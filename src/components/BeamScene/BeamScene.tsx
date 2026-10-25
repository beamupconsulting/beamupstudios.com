import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'

type BeamSceneProps = {
  pointer: RefObject<{ x: number; y: number }>
  progress: RefObject<number>
}

const beamVertex = /* glsl */ `
  varying float vAlong;
  varying vec3 vNormal;
  void main() {
    vAlong = uv.y;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uGain;
  varying float vAlong;
  varying vec3 vNormal;
  void main() {
    float facing = pow(clamp(abs(vNormal.z), 0.0, 1.0), uPower);
    float along = smoothstep(0.0, 0.14, vAlong) * smoothstep(1.0, 0.68, vAlong);
    float alpha = facing * along * uGain;
    vec3 col = uColor * (0.4 + facing * 2.4);
    gl_FragColor = vec4(col, alpha);
  }
`

function disposeObject(root: THREE.Object3D) {
  const geos = new Set<THREE.BufferGeometry>()
  const mats = new Set<THREE.Material>()
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.geometry) geos.add(mesh.geometry)
    const material = mesh.material
    if (Array.isArray(material)) material.forEach((item) => mats.add(item))
    else if (material) mats.add(material)
  })
  geos.forEach((geo) => geo.dispose())
  mats.forEach((mat) => mat.dispose())
}

function buildEnvironment(renderer: THREE.WebGLRenderer) {
  const envScene = new THREE.Scene()
  const geo = new THREE.BoxGeometry(1, 1, 1)
  const mats: THREE.Material[] = []

  const add = (
    color: number,
    intensity: number,
    position: [number, number, number],
    scale: [number, number, number],
  ) => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: color,
      emissiveIntensity: intensity,
      roughness: 1,
      metalness: 0,
    })
    mats.push(mat)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(position[0], position[1], position[2])
    mesh.scale.set(scale[0], scale[1], scale[2])
    envScene.add(mesh)
  }

  add(0xfff6ea, 7, [0, 3.4, 0], [12, 0.12, 12])
  add(0xffb067, 6, [-4.2, 0.3, 1.6], [0.55, 2.4, 0.55])
  add(0xd7e4f4, 4.5, [4.2, 0.5, -1.8], [0.7, 1.8, 0.7])
  add(0x24262b, 0.6, [0, -2.6, 0], [14, 0.16, 14])

  const pmrem = new THREE.PMREMGenerator(renderer)
  const target = pmrem.fromScene(envScene, 0.04)
  pmrem.dispose()
  geo.dispose()
  mats.forEach((mat) => mat.dispose())
  return target
}

function makeGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.18, 'rgba(255,226,190,0.7)')
  grd.addColorStop(0.46, 'rgba(255,120,40,0.16)')
  grd.addColorStop(1, 'rgba(255,80,20,0)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeBeam(length: number, radius: number, color: string, power: number, gain: number) {
  const geo = new THREE.CylinderGeometry(radius, radius, length, 24, 1, true)
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uGain: { value: gain },
    },
    vertexShader: beamVertex,
    fragmentShader: beamFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.z = -Math.PI / 2
  mesh.position.x = length / 2
  mesh.renderOrder = 3
  return mesh
}

export function BeamScene({ pointer, progress }: BeamSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'default',
    })
    if (!renderer.getContext()) {
      renderer.dispose()
      return
    }

    renderer.setClearColor(0x090908, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x090908)
    scene.environmentIntensity = 1

    const env = buildEnvironment(renderer)
    scene.environment = env.texture

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
    camera.position.set(0, 0.22, 7.05)

    scene.add(new THREE.AmbientLight(0xfff8f0, 0.28))
    const key = new THREE.DirectionalLight(0xfff3e6, 2.6)
    key.position.set(-4.5, 3.2, 5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xc5d6e8, 2.1)
    rim.position.set(5, 1.4, -3.5)
    scene.add(rim)
    const warm = new THREE.PointLight(0xffb067, 8, 6, 2)
    warm.position.set(-0.2, 0.2, 1.4)
    scene.add(warm)

    const rig = new THREE.Group()
    const bench = new THREE.Group()
    const optics = new THREE.Group()
    scene.add(rig)
    rig.add(bench)
    bench.add(optics)

    const shape = new THREE.Shape()
    shape.moveTo(-0.5, 0.56)
    shape.lineTo(-0.5, -0.56)
    shape.lineTo(0.64, 0)
    shape.closePath()
    const prismGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.72,
      bevelEnabled: false,
    })
    prismGeo.center()
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#b7c3ce'),
      metalness: 0.02,
      roughness: 0.04,
      transmission: 0.82,
      thickness: 1.4,
      ior: 1.62,
      attenuationColor: new THREE.Color('#d7e4f2'),
      attenuationDistance: 0.85,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      reflectivity: 1,
      envMapIntensity: 2.2,
      transparent: true,
      side: THREE.FrontSide,
    })
    const prism = new THREE.Mesh(prismGeo, prismMat)
    prism.renderOrder = 1
    optics.add(prism)
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(prismGeo, 18),
      new THREE.LineBasicMaterial({ color: 0xfff6ea, transparent: true, opacity: 0.95, toneMapped: false }),
    )
    prism.add(edges)

    prismGeo.computeBoundingBox()
    const box = prismGeo.boundingBox
    const minX = box?.min.x ?? -0.5
    const maxX = box?.max.x ?? 0.6

    const incident = new THREE.Group()
    incident.add(makeBeam(2.15, 0.012, '#fffaf4', 1.7, 1))
    incident.add(makeBeam(2.15, 0.05, '#ffb067', 0.5, 0.42))
    incident.rotation.z = Math.PI
    incident.position.set(minX + 0.22, 0, 0)
    optics.add(incident)

    const upper = new THREE.Group()
    upper.add(makeBeam(1.85, 0.01, '#fff8f2', 1.7, 1))
    upper.add(makeBeam(1.85, 0.042, '#ffc48a', 0.5, 0.38))
    upper.rotation.z = 0.42
    upper.position.set(maxX - 0.16, 0.03, 0)
    optics.add(upper)

    const lower = new THREE.Group()
    lower.add(makeBeam(1.55, 0.009, '#f4f8ff', 1.7, 0.95))
    lower.add(makeBeam(1.55, 0.038, '#d5e4ff', 0.5, 0.34))
    lower.rotation.z = -0.3
    lower.position.set(maxX - 0.14, -0.02, 0)
    optics.add(lower)

    const glowTex = makeGlowTexture()
    if (glowTex) {
      const entry = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: 0xffc48a,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
          opacity: 0.9,
        }),
      )
      entry.position.set(minX, 0, 0)
      entry.scale.set(0.28, 0.28, 1)
      entry.renderOrder = 4
      optics.add(entry)

      const exit = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: 0xffe2c2,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
          opacity: 0.75,
        }),
      )
      exit.position.set(maxX, 0, 0)
      exit.scale.set(0.32, 0.32, 1)
      exit.renderOrder = 4
      optics.add(exit)
    }

    optics.position.y = 0.05

    const ring = new THREE.Group()
    const majorGeo = new THREE.BoxGeometry(0.15, 0.012, 0.012)
    const minorGeo = new THREE.BoxGeometry(0.07, 0.008, 0.008)
    const majorMat = new THREE.MeshBasicMaterial({ color: 0xc8c2b4 })
    const minorMat = new THREE.MeshBasicMaterial({ color: 0x4a463f })
    const ringRadius = 1.5
    for (let i = 0; i < 72; i++) {
      const major = i % 9 === 0
      const tick = new THREE.Mesh(major ? majorGeo : minorGeo, major ? majorMat : minorMat)
      const angle = (i / 72) * Math.PI * 2
      tick.position.set(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0)
      tick.rotation.z = angle
      ring.add(tick)
    }
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(ringRadius, 0.006, 8, 160),
      new THREE.MeshBasicMaterial({ color: 0x6d685f }),
    )
    ring.add(torus)
    rig.add(ring)

    const dustCount = 130
    const dustPositions = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 6.2
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 3.2
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.4
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xffe1c4,
        size: 0.016,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    )
    rig.add(dust)

    bench.rotation.y = 0.22
    bench.rotation.x = 0.06

    let alive = true
    let raf = 0
    const started = performance.now()

    const fit = () => {
      const width = parent.clientWidth
      const height = parent.clientHeight
      if (width === 0 || height === 0) return
      const portrait = width / height < 0.92
      const short = height < 720
      const dprCap = portrait ? 1.5 : 1.75
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      const scale = portrait ? 0.5 : short ? 0.6 : 0.7
      rig.scale.setScalar(scale)
      rig.position.y = portrait ? 0.95 : short ? 0.78 : 0.58
    }

    const render = () => {
      const elapsed = (performance.now() - started) / 1000
      if (!reduced) {
        const px = pointer.current?.x ?? 0
        const py = pointer.current?.y ?? 0
        rig.rotation.y += (px * 0.24 - rig.rotation.y) * 0.05
        rig.rotation.x += (-py * 0.1 - rig.rotation.x) * 0.05
        bench.rotation.y = 0.22 + Math.sin(elapsed * 0.22) * 0.05
        ring.rotation.z = elapsed * 0.04
        dust.rotation.y = elapsed * 0.025
        const nextZ = 7.05 + (progress.current ?? 0) * 0.55
        camera.position.z += (nextZ - camera.position.z) * 0.05
      }
      camera.lookAt(0, 0.08, 0)
      renderer.render(scene, camera)
    }

    const loop = () => {
      if (!alive) return
      const covered = (progress.current ?? 0) > 0.92
      if (!document.hidden && !covered) render()
      raf = requestAnimationFrame(loop)
    }

    const observer = new ResizeObserver(() => fit())
    observer.observe(parent)
    fit()
    render()
    raf = requestAnimationFrame(loop)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      env.texture.dispose()
      env.dispose()
      glowTex?.dispose()
      disposeObject(scene)
      renderer.dispose()
    }
  }, [pointer, progress])

  return <canvas ref={canvasRef} className="stage__canvas" aria-hidden />
}

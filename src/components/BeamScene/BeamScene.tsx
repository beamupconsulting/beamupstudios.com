import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'

type BeamSceneProps = {
  progress: RefObject<number>
  push: RefObject<number>
}

const beamVertex = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const beamFragment = /* glsl */ `
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uProgress;
  uniform float uIntro;
  uniform float uPush;
  uniform float uAnchor;
  uniform float uPark;
  uniform float uNarrow;

  float sat(float x) {
    return clamp(x, 0.0, 1.0);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    float t = pow(sat(uProgress), 0.9);
    float down = 1.0 - uv.y;
    float settle = smoothstep(0.3, 0.92, uProgress);
    float anchor = mix(uAnchor, uPark, settle);
    float flareLive = pow(smoothstep(0.0, 1.0, down), 2.0);
    float x = uv.x - anchor;

    float coreW = mix(mix(0.006, 0.016, t) + flareLive * mix(0.014, 0.055, t), 0.015, settle);
    float glowW = mix(mix(0.04, 0.09, t) + flareLive * mix(0.09, 0.34, t), 0.1, settle);
    float hazeW = mix(mix(0.1, 0.2, t) + flareLive * mix(0.18, 0.75, t), 0.2, settle);
    glowW += uPush * 0.012;
    hazeW += uPush * 0.03;

    float core = exp(-(x * x) / max(coreW * coreW, 1e-6));
    float glow = exp(-(x * x) / max(glowW * glowW, 1e-6));
    float haze = exp(-(x * x) / max(hazeW * hazeW, 1e-6));
    float shimmer = 0.92 + 0.08 * sin(uv.y * 28.0 - uTime * 2.6);

    vec3 col = vec3(0.008, 0.01, 0.022);
    float body = mix(0.45 + 0.55 * down, 1.0, settle);
    col += vec3(0.14, 0.32, 0.95) * haze * body;
    col += vec3(0.32, 0.68, 1.0) * glow;
    col += vec3(0.92, 0.97, 1.0) * core * shimmer;

    float by = (uv.y - mix(0.04, 0.5, settle)) * aspect * mix(0.85, 0.45, settle);
    float bx = x * mix(1.15, 1.7, settle);
    float radius = mix(mix(0.16, 0.72, t), 0.22, settle);
    float disk = bx * bx + by * by;
    float bloomAmt = mix(1.0, 0.28, settle);
    float bloom = exp(-disk / max(radius * radius, 1e-4));
    col += vec3(0.12, 0.38, 1.0) * bloom * 0.45 * bloomAmt;
    col += vec3(0.8, 0.92, 1.0) * exp(-disk / max(radius * radius * 0.06, 1e-4)) * 0.55 * bloomAmt;

    float streak = exp(-pow((uv.y - 0.045) / mix(0.018, 0.07, t), 2.0));
    float span = exp(-(x * x) / max(mix(0.1, 0.5, t) * mix(0.1, 0.5, t), 1e-4));
    col += vec3(0.45, 0.75, 1.0) * streak * span * mix(0.35, 0.0, settle);

    float fill = smoothstep(0.4, 1.0, uProgress);
    col += vec3(0.03, 0.06, 0.16) * fill * haze * (1.0 - settle);

    float crossing = smoothstep(0.64, 0.36, uv.x) * (1.0 - settle);
    col *= mix(1.0, 0.42, crossing);
    col *= mix(1.0, 1.0 - settle, uNarrow);

    float corners = uNarrow * settle;
    vec2 tl = uv - vec2(0.0, 1.0);
    vec2 tr = uv - vec2(1.0, 1.0);
    vec2 bl = uv;
    vec2 br = uv - vec2(1.0, 0.0);
    float reach = 0.007;
    col += vec3(0.05, 0.12, 0.4) * corners * (
      exp(-dot(tl, tl) / reach) * 0.4 +
      exp(-dot(tr, tr) / reach) * 0.75 +
      exp(-dot(bl, bl) / reach) * 0.5 +
      exp(-dot(br, br) / (reach * 1.8))
    );

    col *= mix(0.7, 1.0, uIntro);
    float peak = max(col.r, max(col.g, col.b));
    if (peak > 1.15) col *= 1.15 / peak;
    col *= mix(1.0, 0.38, settle * (1.0 - uNarrow));

    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (dither - 0.5) * 0.008;

    gl_FragColor = vec4(col, 1.0);
  }
`

const moteVertex = /* glsl */ `
  attribute float aAlong;
  attribute float aAcross;
  attribute float aSeed;
  attribute float aSize;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uSpread;
  uniform float uPixel;
  uniform float uAnchor;
  uniform float uPark;
  uniform float uNarrow;
  uniform float uProgress;
  varying float vFade;
  varying float vSeed;
  varying float vSize;

  void main() {
    float cycle = fract(aAlong + uTime * aSpeed);
    float y = mix(-1.04, 1.04, cycle);
    float down = 1.0 - cycle;
    float settle = smoothstep(0.3, 0.92, uProgress);
    float flareLive = pow(smoothstep(0.0, 1.0, down), 1.25);
    float flare = mix(flareLive, 0.82, settle);
    float halfW = uSpread * (0.1 + 0.9 * flare);
    float anchor = mix(uAnchor, uPark, settle);
    float x = (anchor * 2.0 - 1.0) + aAcross * halfW;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, 0.0, 1.0);
    float tw = 0.62 + 0.38 * sin(uTime * (1.4 + aSeed * 2.0) + aSeed * 40.0);
    vSize = aSize * tw;
    gl_PointSize = max(1.0, vSize * uPixel);
    vFade = smoothstep(0.0, 0.08, cycle) * smoothstep(1.0, 0.88, cycle);
    vFade *= 0.25 + 0.75 * flare;
    vFade *= mix(1.0, 0.38, settle * (1.0 - uNarrow));
    vFade *= mix(1.0, 1.0 - settle, uNarrow);
    vSeed = aSeed;
  }
`

const moteFragment = /* glsl */ `
  varying float vFade;
  varying float vSeed;
  varying float vSize;

  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float d = length(p);
    float soft = smoothstep(0.5, 0.02, d);
    if (soft <= 0.0) discard;
    vec3 col = mix(vec3(0.45, 0.78, 1.0), vec3(1.0), smoothstep(0.42, 0.0, d));
    float alpha = soft * soft * vFade;
    alpha *= mix(0.55, 1.0, vSeed);
    alpha *= mix(0.4, 1.0, smoothstep(9.0, 2.2, vSize));
    gl_FragColor = vec4(col * alpha, 1.0);
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

export function BeamScene({ progress, push }: BeamSceneProps) {
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
      powerPreference: 'high-performance',
    })
    if (!renderer.getContext()) {
      renderer.dispose()
      return
    }

    renderer.setClearColor(0x05060e, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 2

    const beamUniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uPush: { value: 0 },
      uAnchor: { value: 0.58 },
      uPark: { value: 0.8 },
      uNarrow: { value: 0 },
    }
    const beamMat = new THREE.ShaderMaterial({
      uniforms: beamUniforms,
      vertexShader: beamVertex,
      fragmentShader: beamFragment,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), beamMat)
    quad.frustumCulled = false
    quad.renderOrder = 0
    scene.add(quad)

    const count = window.innerWidth < 800 ? 720 : 1500
    const along = new Float32Array(count)
    const across = new Float32Array(count)
    const seed = new Float32Array(count)
    const size = new Float32Array(count)
    const speed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      along[i] = Math.random()
      const bell = (Math.random() + Math.random() + Math.random()) / 3
      const wide = Math.random() < 0.72
      across[i] = (bell * 2 - 1) * (wide ? 1 : 0.28)
      seed[i] = Math.random()
      const rare = Math.random()
      size[i] = rare > 0.94 ? 6.5 + Math.random() * 4 : 1.35 + Math.random() * 2.1
      speed[i] = reduced ? 0 : 0.012 + Math.random() * 0.045
    }
    const moteGeo = new THREE.BufferGeometry()
    moteGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    moteGeo.setAttribute('aAlong', new THREE.BufferAttribute(along, 1))
    moteGeo.setAttribute('aAcross', new THREE.BufferAttribute(across, 1))
    moteGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    moteGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    moteGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))

    const moteUniforms = {
      uTime: { value: 0 },
      uSpread: { value: 0.2 },
      uPixel: { value: 1 },
      uAnchor: { value: 0.58 },
      uPark: { value: 0.8 },
      uNarrow: { value: 0 },
      uProgress: { value: 0 },
    }
    const moteMat = new THREE.ShaderMaterial({
      uniforms: moteUniforms,
      vertexShader: moteVertex,
      fragmentShader: moteFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
    const motes = new THREE.Points(moteGeo, moteMat)
    motes.frustumCulled = false
    motes.renderOrder = 1
    scene.add(motes)

    let alive = true
    let raf = 0
    const started = performance.now()

    const fit = () => {
      const width = parent.clientWidth
      const height = parent.clientHeight
      if (width === 0 || height === 0) return
      const portrait = width / height < 0.92
      const pixelRatio = Math.min(window.devicePixelRatio || 1, portrait ? 1.5 : 1.75)
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(width, height, false)
      const narrow = width < 800
      const anchor = portrait ? 0.5 : 0.58
      const park = narrow ? anchor : 0.8
      const narrowValue = narrow ? 1 : 0
      beamUniforms.uAnchor.value = anchor
      beamUniforms.uPark.value = park
      beamUniforms.uNarrow.value = narrowValue
      beamUniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio)
      moteUniforms.uAnchor.value = anchor
      moteUniforms.uPark.value = park
      moteUniforms.uNarrow.value = narrowValue
      moteUniforms.uPixel.value = pixelRatio
      camera.updateProjectionMatrix()
    }

    const render = () => {
      const elapsed = reduced ? 0 : (performance.now() - started) / 1000
      const intro = reduced ? 1 : Math.min(1, elapsed / 0.65)
      const easedIntro = 0.55 + 0.45 * (1 - Math.pow(1 - intro, 3))
      const p = Math.min(1, Math.max(0, progress.current ?? 0))
      const visual = Math.pow(p, 0.85)
      beamUniforms.uTime.value = elapsed
      beamUniforms.uProgress.value = p
      beamUniforms.uIntro.value = easedIntro
      beamUniforms.uPush.value = Math.min(1, Math.max(0, push.current ?? 0))
      moteUniforms.uTime.value = elapsed
      moteUniforms.uProgress.value = p
      const settleIn = Math.min(1, Math.max(0, (p - 0.3) / 0.62))
      const settle = settleIn * settleIn * (3 - 2 * settleIn)
      const openSpread = 0.48 + visual * 1.05
      moteUniforms.uSpread.value = openSpread + (0.26 - openSpread) * settle
      renderer.render(scene, camera)
    }

    const loop = () => {
      if (!alive) return
      render()
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
      disposeObject(scene)
      renderer.dispose()
    }
  }, [progress, push])

  return <canvas ref={canvasRef} className="stage__canvas" aria-hidden />
}

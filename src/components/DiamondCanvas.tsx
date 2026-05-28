import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// ──────────────────────────────────────────────
// Brilliant-cut diamond geometry builder
// ──────────────────────────────────────────────
function createBrilliantCutGeometry(
  crownRadius = 1.0,
  girdleRadius = 1.08,
  pavilionDepth = 1.2,
  crownHeight = 0.38,
  tableRadius = 0.52,
  facets = 16
): THREE.BufferGeometry {
  const vertices: number[] = [];

  function pushTri(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
    vertices.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  }

  const angleStep = (Math.PI * 2) / facets;
  const culet = new THREE.Vector3(0, -pavilionDepth, 0);

  const girdlePoints: THREE.Vector3[] = [];
  const crownPoints: THREE.Vector3[] = [];
  const tablePoints: THREE.Vector3[] = [];

  for (let i = 0; i < facets; i++) {
    const angle = i * angleStep;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const girdleVar = 1.0 + (i % 2 === 0 ? 0.015 : -0.015);
    girdlePoints.push(
      new THREE.Vector3(cos * girdleRadius * girdleVar, 0, sin * girdleRadius * girdleVar)
    );

    crownPoints.push(
      new THREE.Vector3(cos * crownRadius * 0.76, crownHeight * 0.65, sin * crownRadius * 0.76)
    );

    tablePoints.push(
      new THREE.Vector3(cos * tableRadius, crownHeight, sin * tableRadius)
    );
  }

  for (let i = 0; i < facets; i++) {
    const next = (i + 1) % facets;

    // Pavilion — from girdle down to culet
    pushTri(girdlePoints[i], culet, girdlePoints[next]);

    // Lower crown — girdle to crown ring
    pushTri(girdlePoints[i], girdlePoints[next], crownPoints[i]);
    pushTri(girdlePoints[next], crownPoints[next], crownPoints[i]);

    // Upper crown — crown ring to table ring
    pushTri(crownPoints[i], crownPoints[next], tablePoints[i]);
    pushTri(crownPoints[next], tablePoints[next], tablePoints[i]);

    // Table — flat top
    const tableCenter = new THREE.Vector3(0, crownHeight, 0);
    pushTri(tableCenter, tablePoints[i], tablePoints[next]);
  }

  const geometry = new THREE.BufferGeometry();
  const posArray = new Float32Array(vertices);
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  // Use flat shading — do NOT call computeVertexNormals so each face gets its own normal
  geometry.computeVertexNormals();

  return geometry;
}

// ──────────────────────────────────────────────
// Lens flare sprite — subtle accent, not the star
// ──────────────────────────────────────────────
function LensFlare() {
  const spriteRef = useRef<THREE.Sprite>(null);
  const glowRef = useRef<THREE.Sprite>(null);

  const [flareTexture, softGlowTexture] = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Core radial glow
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.04, 'rgba(255, 255, 255, 0.85)');
    gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.35)');
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.06)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Horizontal streak
    ctx.globalCompositeOperation = 'lighter';
    const hGrad = ctx.createLinearGradient(0, size / 2, size, size / 2);
    hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    hGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.03)');
    hGrad.addColorStop(0.47, 'rgba(255, 255, 255, 0.25)');
    hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
    hGrad.addColorStop(0.53, 'rgba(255, 255, 255, 0.25)');
    hGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.03)');
    hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, size / 2 - 1.5, size, 3);

    // Cross streaks
    ctx.save();
    ctx.translate(size / 2, size / 2);
    for (let angle = 0; angle < Math.PI; angle += Math.PI / 3) {
      ctx.save();
      ctx.rotate(angle);
      const dGrad = ctx.createLinearGradient(-size / 2, 0, size / 2, 0);
      dGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      dGrad.addColorStop(0.42, 'rgba(255, 255, 255, 0.08)');
      dGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      dGrad.addColorStop(0.58, 'rgba(255, 255, 255, 0.08)');
      dGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = dGrad;
      ctx.fillRect(-size / 2, -0.75, size, 1.5);
      ctx.restore();
    }
    ctx.restore();

    const flareTex = new THREE.CanvasTexture(canvas);

    // Soft outer glow
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = size;
    glowCanvas.height = size;
    const gCtx = glowCanvas.getContext('2d')!;
    const gGrad = gCtx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gGrad.addColorStop(0.15, 'rgba(255, 255, 255, 0.06)');
    gGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.01)');
    gGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    gCtx.fillStyle = gGrad;
    gCtx.fillRect(0, 0, size, size);
    const glowTex = new THREE.CanvasTexture(glowCanvas);

    return [flareTex, glowTex];
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (spriteRef.current) {
      const pulse = 0.9 + Math.sin(t * 1.5) * 0.1;
      spriteRef.current.scale.set(0.6 * pulse, 0.6 * pulse, 1);
    }
    if (glowRef.current) {
      const pulse2 = 0.9 + Math.sin(t * 1.2 + 0.5) * 0.1;
      glowRef.current.scale.set(1.4 * pulse2, 1.4 * pulse2, 1);
    }
  });

  return (
    <group position={[-1.0, 1.4, 0.8]}>
      <sprite ref={spriteRef} scale={[0.6, 0.6, 1]}>
        <spriteMaterial
          map={flareTexture}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.85}
        />
      </sprite>
      <sprite ref={glowRef} scale={[1.4, 1.4, 1]}>
        <spriteMaterial
          map={softGlowTexture}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.4}
        />
      </sprite>
    </group>
  );
}

// ──────────────────────────────────────────────
// Ground reflection plane
// ──────────────────────────────────────────────
function GroundReflection() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial
        color="#050505"
        metalness={0.95}
        roughness={0.15}
        transparent
        opacity={0.6}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

// ──────────────────────────────────────────────
// Diamond mesh — the star of the show
// ──────────────────────────────────────────────
interface DiamondMeshProps {
  isHeroActive: boolean;
  targetRotationY: number;
}

function DiamondMesh({ isHeroActive, targetRotationY }: DiamondMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () => createBrilliantCutGeometry(1.0, 1.08, 1.2, 0.38, 0.52, 16),
    []
  );

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    const group = groupRef.current;

    if (isHeroActive) {
      group.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
    }

    meshRef.current.rotation.y += delta * 0.1;

    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      targetRotationY * 0.15,
      delta * 0.3
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Upright diamond — no tilt */}
      <group rotation={[0, 0, 0]} scale={2.0}>
        <mesh ref={meshRef} geometry={geometry} castShadow>
          <meshPhysicalMaterial
            color="#1a1a1a"
            metalness={0.15}
            roughness={0.05}
            transmission={0.6}
            thickness={2.5}
            ior={2.42}
            envMapIntensity={2.0}
            clearcoat={1.0}
            clearcoatRoughness={0.03}
            reflectivity={1.0}
            attenuationColor={new THREE.Color('#333333')}
            attenuationDistance={1.5}
            specularIntensity={1.0}
            specularColor={new THREE.Color('#ffffff')}
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner wireframe for facet edge highlights */}
        <mesh geometry={geometry}>
          <meshBasicMaterial
            color="#3a3a3a"
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      </group>
    </group>
  );
}

// ──────────────────────────────────────────────
// Scene setup — fog vignette
// ──────────────────────────────────────────────
function SceneSetup() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x000000, 0.08);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return null;
}

// ──────────────────────────────────────────────
// Main canvas
// ──────────────────────────────────────────────
interface DiamondCanvasProps {
  currentPanel: number;
  isHeroActive: boolean;
}

const DiamondCanvas: React.FC<DiamondCanvasProps> = ({ currentPanel, isHeroActive }) => {
  const targetRotationY = currentPanel * (Math.PI / 3);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: isHeroActive ? 1 : 0,
        visibility: isHeroActive ? 'visible' : 'hidden',
        transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.8s ease',
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: 'transparent' }}
      >
        <SceneSetup />

        {/* Ambient — gentle fill so the diamond isn't invisible */}
        <ambientLight intensity={0.25} color="#ffffff" />

        {/* Key light — upper left, dramatic but not blinding */}
        <spotLight
          position={[-3, 5, 4]}
          angle={0.35}
          penumbra={0.7}
          intensity={5}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Fill light — right side, softer */}
        <pointLight position={[4, 2, 3]} intensity={1.2} color="#d0d0d0" />

        {/* Rim / back light — edge definition */}
        <pointLight position={[2, 3, -4]} intensity={1.5} color="#aaaaaa" />

        {/* Bottom kick — subtle underside glow */}
        <pointLight position={[-1, -2, 2]} intensity={0.5} color="#888888" />

        {/* Top accent */}
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />

        <DiamondMesh
          isHeroActive={isHeroActive}
          targetRotationY={targetRotationY}
        />

        <LensFlare />
        <GroundReflection />

        {/* Environment for reflections on the facets */}
        <React.Suspense fallback={null}>
          <Environment resolution={256}>
            <ambientLight intensity={0.4} />
            {/* Bright reflection sources */}
            <mesh position={[5, 5, 5]}>
              <sphereGeometry args={[2.5, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-5, 5, -5]}>
              <sphereGeometry args={[2.5, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 6, 4]}>
              <sphereGeometry args={[2, 8, 8]} />
              <meshBasicMaterial color="#e0e0e0" />
            </mesh>
            <mesh position={[5, -5, -5]}>
              <sphereGeometry args={[2, 8, 8]} />
              <meshBasicMaterial color="#555555" />
            </mesh>
            {/* Dark backdrop sphere */}
            <mesh>
              <sphereGeometry args={[50, 16, 16]} />
              <meshBasicMaterial color="#080808" side={THREE.BackSide} />
            </mesh>
          </Environment>
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default DiamondCanvas;

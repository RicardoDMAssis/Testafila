'use client';

import { Canvas, type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Component, createContext, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Belt, PointXZ, ProjectScene, Stanchion } from '../../../contracts/project.ts';
import type { EditorSelection } from '../../../contracts/queue-editor.ts';
import type { SceneViewerProps } from '../../../contracts/scene-viewer.ts';

const palette = { floor: '#f1eee4', wall: '#d8d4c7', green: '#355b48', dark: '#243c32', line: '#a6aa98', area: '#dce6dc', person: '#728b76' };

type ScenePointerEvent = ThreeEvent<PointerEvent>;
type DragPreview = { selection: EditorSelection; delta: PointXZ };
type PointerCaptureTarget = { setPointerCapture: (pointerId: number) => void; releasePointerCapture: (pointerId: number) => void };
type DragSession = DragPreview & { pointerId: number; start: PointXZ; target: PointerCaptureTarget };
type EntityHandlers = {
  onPointerDown: (event: ScenePointerEvent) => void;
  onPointerMove: (event: ScenePointerEvent) => void;
  onPointerUp: (event: ScenePointerEvent) => void;
  onPointerCancel: (event: ScenePointerEvent) => void;
  onLostPointerCapture: (event: ScenePointerEvent) => void;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
};
interface SceneInteraction {
  selection: EditorSelection | null;
  preview: DragPreview | null;
  dragging: boolean;
  controlsRef: { current: OrbitControlsImpl | null };
  select: (selection: EditorSelection | null) => void;
  handlers: (selection: EditorSelection, draggable?: boolean) => EntityHandlers;
}
const SceneInteractionContext = createContext<SceneInteraction | null>(null);

function useSceneInteraction() {
  const value = useContext(SceneInteractionContext);
  if (!value) throw new Error('Scene interaction context missing');
  return value;
}

function useEntityHandlers(selection: EditorSelection, draggable = false) {
  return useSceneInteraction().handlers(selection, draggable);
}

function boundsOf(scene: ProjectScene) {
  const points = [
    ...scene.environment.perimeter,
    ...scene.restrictedAreas.flatMap((area) => area.vertices),
    ...scene.posts.map((post) => post.position),
    ...scene.routes.flatMap((route) => route.points),
    ...scene.people.map((person) => person.position),
  ];
  if (!points.length) return { minX: -5, maxX: 5, minZ: -4, maxZ: 4 };
  const minX = Math.min(...points.map((p) => p.x)); const maxX = Math.max(...points.map((p) => p.x));
  const minZ = Math.min(...points.map((p) => p.z)); const maxZ = Math.max(...points.map((p) => p.z));
  const pad = Math.max(0.35, Math.max(maxX - minX, maxZ - minZ) * 0.06);
  return { minX: minX - pad, maxX: maxX + pad, minZ: minZ - pad, maxZ: maxZ + pad };
}

function polygonGeometry(vertices: PointXZ[], y: number) {
  const contour = vertices.map((point) => new THREE.Vector2(point.x, point.z));
  const triangles = THREE.ShapeUtils.triangulateShape(contour, []);
  const positions = contour.flatMap((point) => [point.x, y, point.y]);
  const indices = triangles.flatMap(([a, b, c]) => [a, c, b]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function Floor({ scene, bounds, onFloorPoint }: { scene: ProjectScene; bounds: ReturnType<typeof boundsOf>; onFloorPoint?: SceneViewerProps['onFloorPoint'] }) {
  const { select } = useSceneInteraction();
  const geometry = useMemo(() => polygonGeometry(scene.environment.perimeter, 0), [scene.environment.perimeter]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const click = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    select(null);
    onFloorPoint?.({ x: event.point.x, z: event.point.z });
  }, [onFloorPoint, select]);
  const grid = useMemo(() => {
    const vertices: number[] = [];
    const startX = Math.floor(bounds.minX); const endX = Math.ceil(bounds.maxX);
    const startZ = Math.floor(bounds.minZ); const endZ = Math.ceil(bounds.maxZ);
    for (let x = startX; x <= endX; x += 1) vertices.push(x, 0.006, startZ, x, 0.006, endZ);
    for (let z = startZ; z <= endZ; z += 1) vertices.push(startX, 0.006, z, endX, 0.006, z);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); return geo;
  }, [bounds.minX, bounds.maxX, bounds.minZ, bounds.maxZ]);
  useEffect(() => () => grid.dispose(), [grid]);
  return <group>
    <mesh onClick={click}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color={palette.floor} side={THREE.DoubleSide} />
    </mesh>
    <lineSegments raycast={() => null}><primitive object={grid} attach="geometry" /><lineBasicMaterial color={palette.line} transparent opacity={0.5} /></lineSegments>
  </group>;
}

function createLabelTexture(text: string, kind: 'dimension' | 'area', selected: boolean) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Não foi possível criar o contexto 2D dos rótulos da cena.');
  const fontSize = 40;
  const paddingX = 18;
  const paddingY = 12;
  context.font = `${selected ? 700 : 400} ${fontSize}px Arial, sans-serif`;
  const textWidth = Math.ceil(context.measureText(text).width);
  canvas.width = textWidth + paddingX * 2;
  canvas.height = fontSize + paddingY * 2;
  context.font = `${selected ? 700 : 400} ${fontSize}px Arial, sans-serif`;
  context.textBaseline = 'middle';
  context.fillStyle = '#f8f6ef';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = selected ? palette.dark : kind === 'dimension' ? palette.green : '#c8c5b8';
  context.lineWidth = selected ? 6 : 3;
  context.strokeRect(context.lineWidth / 2, context.lineWidth / 2, canvas.width - context.lineWidth, canvas.height - context.lineWidth);
  context.fillStyle = palette.dark;
  context.fillText(text, paddingX, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function SceneLabel({ text, kind, selected = false, position }: { text: string; kind: 'dimension' | 'area'; selected?: boolean; position: [number, number, number] }) {
  const spriteRef = useRef<THREE.Sprite | null>(null);
  const worldPosition = useRef(new THREE.Vector3());
  const texture = useMemo(() => createLabelTexture(text, kind, selected), [kind, selected, text]);
  const material = useMemo(() => new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }), [texture]);
  useEffect(() => () => { material.dispose(); texture.dispose(); }, [material, texture]);
  useFrame(({ camera: activeCamera, size: activeSize }) => {
    const sprite = spriteRef.current;
    if (!sprite) return;
    let worldUnitsPerPixel = 0;
    if (activeCamera instanceof THREE.PerspectiveCamera) {
      const distance = activeCamera.position.distanceTo(sprite.getWorldPosition(worldPosition.current));
      worldUnitsPerPixel = (2 * distance * Math.tan(THREE.MathUtils.degToRad(activeCamera.fov / 2))) / Math.max(activeSize.height, 1);
    } else if (activeCamera instanceof THREE.OrthographicCamera) {
      worldUnitsPerPixel = (activeCamera.top - activeCamera.bottom) / (Math.max(activeCamera.zoom, 1e-6) * Math.max(activeSize.height, 1));
    }
    const height = worldUnitsPerPixel * 19;
    const width = height * (texture.image.width / texture.image.height);
    if (Math.abs(sprite.scale.x - width) > 1e-4 || Math.abs(sprite.scale.y - height) > 1e-4) sprite.scale.set(width, height, 1);
  });
  return <sprite ref={spriteRef} position={position} raycast={() => null}>
    <primitive object={material} attach="material" />
  </sprite>;
}

function Walls({ scene, view }: { scene: ProjectScene; view: SceneViewerProps['view'] }) {
  const vertices = scene.environment.perimeter; const height = scene.environment.wallHeightMeters;
  const opacity = view === 'top' ? 0.16 : 0.26;
  return <group>{vertices.map((a, index) => {
    const b = vertices[(index + 1) % vertices.length]; const dx = b.x - a.x; const dz = b.z - a.z; const length = Math.hypot(dx, dz);
    if (!length) return null;
    return <mesh key={`wall-${index}`} position={[(a.x + b.x) / 2, height / 2, (a.z + b.z) / 2]} rotation={[0, -Math.atan2(dz, dx), 0]}>
      <boxGeometry args={[length, height, 0.12]} /><meshStandardMaterial color={palette.wall} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>;
  })}</group>;
}

function Dimensions({ scene }: { scene: ProjectScene }) {
  const vertices = scene.environment.perimeter;
  return <group>{vertices.map((a, index) => {
    const b = vertices[(index + 1) % vertices.length]; const length = Math.hypot(b.x - a.x, b.z - a.z);
    if (!length) return null;
    return <SceneLabel key={`dimension-${index}`} kind="dimension" text={`${length.toFixed(2)} m`} position={[(a.x + b.x) / 2, 0.045, (a.z + b.z) / 2]} />;
  })}</group>;
}

function AreaPolygon({ area }: { area: ProjectScene['restrictedAreas'][number] }) {
  const { selection, preview } = useSceneInteraction();
  const handlers = useEntityHandlers({ kind: 'area', id: area.id }, true);
  const selected = selection?.kind === 'area' && selection.id === area.id;
  const delta = preview?.selection.kind === 'area' && preview.selection.id === area.id ? preview.delta : { x: 0, z: 0 };
  const geometry = useMemo(() => polygonGeometry(area.vertices, 0.018), [area.vertices]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const outline = useMemo(() => {
    const outlineGeometry = new THREE.BufferGeometry();
    outlineGeometry.setFromPoints(area.vertices.map((vertex) => new THREE.Vector3(vertex.x, 0.035, vertex.z)));
    return outlineGeometry;
  }, [area.vertices]);
  useEffect(() => () => outline.dispose(), [outline]);
  const label: [number, number, number] = [area.vertices.reduce((s, p) => s + p.x, 0) / area.vertices.length, 0.04, area.vertices.reduce((s, p) => s + p.z, 0) / area.vertices.length];
  return <group position={[delta.x, 0, delta.z]}>
    <mesh {...handlers}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color={palette.area} transparent opacity={selected ? 0.95 : 0.85} side={THREE.DoubleSide} />
    </mesh>
    <SceneLabel kind="area" text={area.name} selected={selected} position={label} />
    {selected && <lineLoop raycast={() => null}><primitive object={outline} attach="geometry" /><lineBasicMaterial color={palette.dark} linewidth={2} /></lineLoop>}
  </group>;
}

function Areas({ scene }: { scene: ProjectScene }) {
  return <group>{scene.restrictedAreas.map((area) => <AreaPolygon key={area.id} area={area} />)}</group>;
}

function PostObject({ post }: { post: Stanchion }) {
  const { selection, preview } = useSceneInteraction();
  const handlers = useEntityHandlers({ kind: 'post', id: post.id }, true);
  const selected = selection?.kind === 'post' && selection.id === post.id;
  const delta = preview?.selection.kind === 'post' && preview.selection.id === post.id ? preview.delta : { x: 0, z: 0 };
  return <group position={[post.position.x + delta.x, 0, post.position.z + delta.z]} {...handlers}>
    <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[post.baseRadiusMeters, post.baseRadiusMeters, 0.07, 20]} /><meshStandardMaterial color={palette.dark} /></mesh>
    <mesh position={[0, post.heightMeters / 2, 0]}><cylinderGeometry args={[0.035, 0.045, post.heightMeters, 12]} /><meshStandardMaterial color={palette.green} /></mesh>
    {selected && <>
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}><torusGeometry args={[post.baseRadiusMeters + 0.055, 0.025, 8, 24]} /><meshBasicMaterial color={palette.dark} /></mesh>
      <mesh position={[0, post.heightMeters + 0.13, 0]} raycast={() => null}><sphereGeometry args={[0.07, 12, 10]} /><meshBasicMaterial color={palette.dark} /></mesh>
    </>}
  </group>;
}

function BeltObject({ belt, from, to }: { belt: Belt; from: Stanchion; to: Stanchion }) {
  const { selection } = useSceneInteraction();
  const handlers = useEntityHandlers({ kind: 'belt', id: belt.id });
  const selected = selection?.kind === 'belt' && selection.id === belt.id;
  const dx = to.position.x - from.position.x; const dz = to.position.z - from.position.z;
  const length = Math.hypot(dx, dz);
  const position: [number, number, number] = [(from.position.x + to.position.x) / 2, belt.heightMeters, (from.position.z + to.position.z) / 2];
  const rotation: [number, number, number] = [0, -Math.atan2(dz, dx), 0];
  return <mesh {...handlers} position={position} rotation={rotation}>
    <boxGeometry args={[length, 0.035, 0.018]} /><meshStandardMaterial color={palette.green} />
    <mesh scale={[1, 4, 10]}><boxGeometry args={[length, 0.035, 0.018]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    {selected && <mesh scale={[1.08, 1.8, 3]} raycast={() => null}><boxGeometry args={[length, 0.035, 0.018]} /><meshBasicMaterial color={palette.dark} wireframe depthTest={false} /></mesh>}
  </mesh>;
}

function RouteObject({ route }: { route: ProjectScene['routes'][number] }) {
  const { selection } = useSceneInteraction();
  const handlers = useEntityHandlers({ kind: 'route', id: route.id });
  const selected = selection?.kind === 'route' && selection.id === route.id;
  return <group>{route.points.slice(1).map((point, index) => {
    const from = route.points[index]; const length = Math.hypot(point.x - from.x, point.z - from.z);
    const position: [number, number, number] = [(from.x + point.x) / 2, 0.025, (from.z + point.z) / 2];
    const rotation: [number, number, number] = [-Math.PI / 2, 0, Math.atan2(point.z - from.z, point.x - from.x)];
    return <group key={`${route.id}-${index}`} {...handlers} position={position} rotation={rotation}>
      {selected && <mesh raycast={() => null}><planeGeometry args={[length, 0.14]} /><meshBasicMaterial color={palette.dark} side={THREE.DoubleSide} /></mesh>}
      <mesh><planeGeometry args={[length, selected ? 0.07 : 0.055]} /><meshBasicMaterial color={palette.person} side={THREE.DoubleSide} /></mesh>
    </group>;
  })}
    {selected && route.points.map((point) => <group key={`route-handle-${route.id}-${point.id}`} {...handlers} position={[point.x, 0.05, point.z]} raycast={() => null}>
      <mesh><sphereGeometry args={[0.075, 12, 10]} /><meshBasicMaterial color={palette.dark} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.09, 0.115, 20]} /><meshBasicMaterial color={palette.dark} side={THREE.DoubleSide} /></mesh>
    </group>)}
  </group>;
}

function PersonObject({ person, scene }: { person: ProjectScene['people'][number]; scene: ProjectScene }) {
  const { selection } = useSceneInteraction();
  const handlers = useEntityHandlers({ kind: 'person', id: person.id });
  const selected = selection?.kind === 'person' && selection.id === person.id;
  return <group position={[person.position.x, 0, person.position.z]} rotation={[0, person.yawRadians, 0]} {...handlers}>
    {selected && <>
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}><ringGeometry args={[scene.simulation.personRadiusMeters + 0.035, scene.simulation.personRadiusMeters + 0.075, 24]} /><meshBasicMaterial color={palette.dark} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, scene.simulation.personHeightMeters + 0.1, 0]} raycast={() => null}><sphereGeometry args={[0.07, 12, 10]} /><meshBasicMaterial color={palette.dark} /></mesh>
    </>}
    <mesh position={[0, scene.simulation.personHeightMeters / 2, 0]}><capsuleGeometry args={[scene.simulation.personRadiusMeters, Math.max(0.01, scene.simulation.personHeightMeters - scene.simulation.personRadiusMeters * 2), 6, 10]} /><meshStandardMaterial color={palette.person} /></mesh>
  </group>;
}

function QueueObjects({ scene }: { scene: ProjectScene }) {
  const posts = useMemo(() => new Map<string, Stanchion>(scene.posts.map((post) => [post.id, post])), [scene.posts]);
  return <group>
    {scene.posts.map((post) => <PostObject key={post.id} post={post} />)}
    {scene.belts.map((belt) => { const from = posts.get(belt.fromPostId); const to = posts.get(belt.toPostId); return from && to ? <BeltObject key={belt.id} belt={belt} from={from} to={to} /> : null; })}
    {scene.routes.map((route) => <RouteObject key={route.id} route={route} />)}
    {scene.people.map((person) => <PersonObject key={person.id} person={person} scene={scene} />)}
  </group>;
}

function ViewControls({ view, center, width, depth, wallHeight, disabled, controlsRef }: { view: SceneViewerProps['view']; center: [number, number, number]; width: number; depth: number; wallHeight: number; disabled: boolean; controlsRef: { current: OrbitControlsImpl | null } }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = Math.max(0.2, size.width / Math.max(size.height, 1));
    const verticalHalfFov = THREE.MathUtils.degToRad((camera instanceof THREE.PerspectiveCamera ? camera.fov : 42) / 2);
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * aspect);
    const diagonal = Math.hypot(width, depth);
    const distance = view === 'top'
      ? Math.max(depth / (2 * Math.tan(verticalHalfFov)), width / (2 * Math.tan(horizontalHalfFov))) * 1.2
      : Math.max(diagonal / (2 * Math.tan(horizontalHalfFov)), (diagonal * 0.55 + wallHeight) / (2 * Math.tan(verticalHalfFov))) * 1.25;
    if (view === 'top') camera.up.set(0, 0, -1);
    else camera.up.set(0, 1, 0);
    camera.position.set(center[0] + (view === 'top' ? 0 : distance * 0.58), center[1] + (view === 'top' ? distance : distance * 0.58), center[2] + (view === 'top' ? 0.001 : distance * 0.58));
    camera.lookAt(...center);
    camera.updateProjectionMatrix();
    controlsRef.current?.target.set(...center);
    controlsRef.current?.update();
  }, [camera, center, depth, size.height, size.width, view, wallHeight, width]);
  const span = Math.max(width, depth, wallHeight, 1);
  return <OrbitControls ref={controlsRef} target={center} makeDefault enabled={!disabled} enableDamping={false} minDistance={Math.max(0.5, span * 0.12)} maxDistance={span * 10} />;
}

function SceneContents({ scene, view, onFloorPoint, selection: controlledSelection, onSelectEntity, onMoveEntity }: SceneViewerProps) {
  const connected = useThree((state) => state.events.connected);
  const [localSelection, setLocalSelection] = useState<EditorSelection | null>(null);
  const [preview, setPreview] = useState<DragPreview | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragSession = useRef<DragSession | null>(null);
  const dragPointerIds = useRef(new Set<number>());
  const suppressedClickPointerIds = useRef(new Set<number>());
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const cancelDrag = useCallback((pointerId: number, releaseCapture: boolean) => {
    const wasDragPointer = dragPointerIds.current.delete(pointerId);
    if (wasDragPointer) suppressedClickPointerIds.current.add(pointerId);
    const session = dragSession.current;
    if (!session || session.pointerId !== pointerId) return wasDragPointer;

    // Clear the session before releasing capture: release can synchronously or
    // asynchronously produce lostpointercapture, and cancellation must never commit.
    dragSession.current = null;
    setPreview(null);
    setDragging(false);
    if (controlsRef.current) controlsRef.current.enabled = true;
    if (releaseCapture) {
      try { session.target.releasePointerCapture(pointerId); } catch { /* capture may already be released */ }
    }
    return true;
  }, []);
  useEffect(() => {
    if (!connected) return;
    const onPointerDown = (event: PointerEvent) => {
      // A new physical sequence makes any missed compatibility click stale.
      suppressedClickPointerIds.current.delete(event.pointerId);
    };
    const onPointerCancel = (event: PointerEvent) => {
      if (!dragPointerIds.current.has(event.pointerId)) return;
      // OrbitControls did not receive pointerdown for this drag. Keep its
      // unconditional pointercancel release from touching an unrelated gesture.
      event.stopImmediatePropagation();
      cancelDrag(event.pointerId, true);
    };
    const onLostPointerCapture = (event: PointerEvent) => {
      cancelDrag(event.pointerId, false);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!suppressedClickPointerIds.current.has(event.pointerId)) return;
      event.stopImmediatePropagation();
    };
    const onClick = (event: MouseEvent) => {
      const pointerId = 'pointerId' in event && typeof event.pointerId === 'number' ? event.pointerId : null;
      const suppressedId = pointerId !== null && suppressedClickPointerIds.current.has(pointerId)
        ? pointerId
        : pointerId === null && suppressedClickPointerIds.current.size === 1
          ? suppressedClickPointerIds.current.values().next().value ?? null
          : null;
      if (suppressedId === null) return;
      event.stopImmediatePropagation();
      suppressedClickPointerIds.current.delete(suppressedId);
    };
    connected.addEventListener('pointerdown', onPointerDown, true);
    connected.addEventListener('pointercancel', onPointerCancel, true);
    connected.addEventListener('lostpointercapture', onLostPointerCapture, true);
    connected.addEventListener('pointerup', onPointerUp, true);
    connected.addEventListener('click', onClick, true);
    return () => {
      connected.removeEventListener('pointerdown', onPointerDown, true);
      connected.removeEventListener('pointercancel', onPointerCancel, true);
      connected.removeEventListener('lostpointercapture', onLostPointerCapture, true);
      connected.removeEventListener('pointerup', onPointerUp, true);
      connected.removeEventListener('click', onClick, true);
    };
  }, [cancelDrag, connected]);
  const selection = controlledSelection !== undefined ? controlledSelection : localSelection;
  const select = useCallback((next: EditorSelection | null) => {
    setLocalSelection(next);
    onSelectEntity?.(next);
  }, [onSelectEntity]);
  const handlers = useCallback((entity: EditorSelection, draggable = false): EntityHandlers => {
    const stop = (event: ScenePointerEvent) => event.stopPropagation();
    const intersection = (event: ScenePointerEvent): PointXZ | null => {
      const { origin, direction } = event.ray;
      if (Math.abs(direction.y) < 1e-8) return null;
      const distance = -origin.y / direction.y;
      if (distance < 0) return null;
      return { x: origin.x + direction.x * distance, z: origin.z + direction.z * distance };
    };
    const release = (session: DragSession) => { try { session.target.releasePointerCapture(session.pointerId); } catch { /* capture may already be released */ } };
    const finish = (event: ScenePointerEvent, commit: boolean) => {
      stop(event);
      const wasDragPointer = dragPointerIds.current.delete(event.pointerId);
      if (commit && wasDragPointer) suppressedClickPointerIds.current.add(event.pointerId);
      if (event.nativeEvent.type === 'pointercancel' && wasDragPointer) event.nativeEvent.stopImmediatePropagation();
      const session = dragSession.current;
      if (!session || session.pointerId !== event.pointerId) return;
      const hit = intersection(event);
      if (commit && hit) session.delta = { x: hit.x - session.start.x, z: hit.z - session.start.z };
      dragSession.current = null;
      setPreview(null);
      setDragging(false);
      if (controlsRef.current) controlsRef.current.enabled = true;
      release(session);
      if (commit && (Math.abs(session.delta.x) > 1e-5 || Math.abs(session.delta.z) > 1e-5)) onMoveEntity?.(session.selection, session.delta);
    };
    return {
      onPointerDown: (event: ScenePointerEvent) => {
        suppressedClickPointerIds.current.delete(event.pointerId);
        stop(event);
        select(entity);
        if (!draggable) return;
        // OrbitControls listens on this same DOM target after R3F. Keep a drag
        // pointer out of its pointer tracking so cancel has no unmatched release.
        event.nativeEvent.stopImmediatePropagation();
        dragPointerIds.current.add(event.pointerId);
        const hit = intersection(event);
        if (!hit) return;
        const target = event.target as PointerCaptureTarget | null;
        if (!target || !('setPointerCapture' in target)) return;
        const session: DragSession = { selection: entity, delta: { x: 0, z: 0 }, start: { x: hit.x, z: hit.z }, pointerId: event.pointerId, target };
        try {
          target.setPointerCapture(event.pointerId);
        } catch (error) {
          // R3F records capture before calling the browser API; unwind that
          // record if a synthetic or otherwise inactive pointer is rejected.
          try { target.releasePointerCapture(event.pointerId); } catch (cleanupError) {
            if (!(cleanupError instanceof Error && cleanupError.name === 'NotFoundError')) console.error('Falha ao limpar captura de ponteiro da cena.', cleanupError);
          }
          dragPointerIds.current.delete(event.pointerId);
          console.warn('Arraste da cena cancelado: o navegador não concedeu captura do ponteiro.', error);
          return;
        }
        dragSession.current = session;
        if (controlsRef.current) controlsRef.current.enabled = false;
        setDragging(true);
      },
      onPointerMove: (event: ScenePointerEvent) => {
        stop(event);
        const session = dragSession.current;
        if (!session || session.pointerId !== event.pointerId) return;
        const hit = intersection(event);
        if (!hit) return;
        session.delta = { x: hit.x - session.start.x, z: hit.z - session.start.z };
        setPreview({ selection: session.selection, delta: session.delta });
      },
      onPointerUp: (event: ScenePointerEvent) => finish(event, true),
      onPointerCancel: (event: ScenePointerEvent) => finish(event, false),
      onLostPointerCapture: (event: ScenePointerEvent) => finish(event, false),
      onClick: (event: ThreeEvent<MouseEvent>) => event.stopPropagation(),
    };
  }, [onMoveEntity, select]);
  const interaction = useMemo<SceneInteraction>(() => ({ selection, preview, dragging, controlsRef, select, handlers }), [selection, preview, dragging, controlsRef, select, handlers]);
  useEffect(() => () => {
    const session = dragSession.current;
    dragSession.current = null;
    dragPointerIds.current.clear();
    suppressedClickPointerIds.current.clear();
    if (session) {
      try { session.target.releasePointerCapture(session.pointerId); } catch { /* component may unmount after capture ended */ }
    }
    if (controlsRef.current) controlsRef.current.enabled = true;
  }, []);
  const bounds = useMemo(() => boundsOf(scene), [scene]);
  const center = useMemo<[number, number, number]>(() => [(bounds.minX + bounds.maxX) / 2, 0, (bounds.minZ + bounds.maxZ) / 2], [bounds.maxX, bounds.maxZ, bounds.minX, bounds.minZ]);
  const width = bounds.maxX - bounds.minX; const depth = bounds.maxZ - bounds.minZ;
  return <SceneInteractionContext.Provider value={interaction}>
    <color attach="background" args={['#f8f6ef']} />
    <ambientLight intensity={1.8} /><directionalLight position={[center[0] + width * 0.5, Math.max(width, depth), center[2] + depth * 0.5]} intensity={0.9} />
    <Floor scene={scene} bounds={bounds} onFloorPoint={onFloorPoint} /><Walls scene={scene} view={view} /><Dimensions scene={scene} /><Areas scene={scene} /><QueueObjects scene={scene} />
    <ViewControls view={view ?? 'perspective'} center={center} width={width} depth={depth} wallHeight={scene.environment.wallHeightMeters} disabled={dragging} controlsRef={controlsRef} />
  </SceneInteractionContext.Provider>;
}

class CanvasErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Falha ao renderizar a cena 3D.', error, info.componentStack);
  }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function WebGLFallback() { return <div role="status" style={{ display: 'grid', placeItems: 'center', minHeight: 280, padding: 24, color: palette.dark, background: '#f1eee4', border: '1px solid #c8c5b8', font: '14px Arial, sans-serif', textAlign: 'center' }}>Este navegador não conseguiu iniciar o WebGL. Abra a planta em um navegador com aceleração gráfica habilitada.</div>; }

export default function SceneViewer({ scene, view = 'perspective', className, onFloorPoint, selection, onSelectEntity, onMoveEntity }: SceneViewerProps) {
  const ratio = typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
  return <div className={className} style={{ width: '100%', height: '100%', minHeight: 300, position: 'relative', background: '#f8f6ef', touchAction: 'none' }}>
    <CanvasErrorBoundary fallback={<WebGLFallback />}>
      <Canvas dpr={ratio} frameloop="demand" camera={{ position: [0, 12, 12], fov: 42, near: 0.01, far: 10000 }} gl={{ antialias: true, alpha: false }} fallback="WebGL indisponível neste navegador.">
        <Suspense fallback={null}><SceneContents scene={scene} view={view} onFloorPoint={onFloorPoint} selection={selection} onSelectEntity={onSelectEntity} onMoveEntity={onMoveEntity} /></Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  </div>;
}

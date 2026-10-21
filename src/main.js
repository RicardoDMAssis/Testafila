import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  calculateQueueMetrics,
  evaluateCollisions,
  generateSerpentinePreset
} from './geometry.js';
import {
  createStanchionMesh,
  createBeltSegmentMesh,
  createRestrictedZoneMesh,
  createReticleMesh
} from './arObjects.js';

// ============================================================================
// ESTADO DA APLICAÇÃO (TestaFila MVP)
// ============================================================================
const state = {
  mode: 'queue', // 'queue' (Fila) | 'zone' (Área Restrita)
  showAbntCorridor: false, // Largura mínima 0.90m (ABNT NBR 9050)
  cameraPassThroughActive: false,
  webxrActive: false,
  config: {
    metersPerPerson: 0.6, // Fixado em 0,6m/pessoa no MVP (customizável no modal)
    rows: 1,
    serviceRatePpm: 4, // Pessoas por minuto
    cameraHeight: 1.4 // Altura padrão do smartphone ao chão (m)
  },
  posts: [], // Array de { x, y, z }
  zones: [], // Array de { id, name, vertices: [{x, y, z}] }
  activeZoneVertices: [], // Vértices da zona restrita sendo desenhada no momento
  history: [] // Pilha de ações para 'Desfazer' (Undo)
};

// ============================================================================
// INICIALIZAÇÃO DO THREE.JS E CENA 3D
// ============================================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.05,
  100
);
camera.position.set(0, 3.2, 4.5);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);

// Controles de câmera para inspeção 3D e uso sem giroscópio
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI / 2 - 0.03; // Não deixa passar para baixo do chão
controls.minDistance = 0.8;
controls.maxDistance = 35;
controls.target.set(0, 0, 0);

// Iluminação realista para destacar os postes metálicos
const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Piso Virtual de Referência (Visível quando fora do WebXR ou em modo híbrido)
const floorGroup = new THREE.Group();
scene.add(floorGroup);

const gridHelper = new THREE.GridHelper(30, 30, 0x00ff66, 0x334155);
gridHelper.position.y = 0.001;
gridHelper.material.opacity = 0.45;
gridHelper.material.transparent = true;
floorGroup.add(gridHelper);

// Plano invisível para Raycasting (Hit-Testing no piso Y=0)
const floorPlaneGeo = new THREE.PlaneGeometry(100, 100);
floorPlaneGeo.rotateX(-Math.PI / 2);
const floorPlaneMat = new THREE.MeshBasicMaterial({
  visible: false,
  side: THREE.DoubleSide
});
const hitPlane = new THREE.Mesh(floorPlaneGeo, floorPlaneMat);
scene.add(hitPlane);

// Grupos de objetos dinâmicos da cena
const objectsGroup = new THREE.Group();
scene.add(objectsGroup);

// Retículo 3D (Mira no piso)
const reticle = createReticleMesh();
scene.add(reticle);

// ============================================================================
// RAYCASTER E HIT-TESTING (WEBXR + FALLBACK UNIVERSAL)
// ============================================================================
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2(0, 0);
let xrHitTestSource = null;
let xrTransientInputSource = null;

/**
 * Atualiza a posição do retículo no chão quando não está em sessão WebXR nativa
 */
function updateFallbackReticle() {
  if (state.webxrActive) return;

  // Lança raio do centro da tela (ou último ponteiro) em direção ao piso
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObject(hitPlane);
  if (hits.length > 0) {
    const pt = hits[0].point;
    reticle.visible = true;
    reticle.position.set(pt.x, 0.004, pt.z);
  }
}

// ============================================================================
// RECONSTRUÇÃO VISUAL E MOTOR DE COLISÃO EM TEMPO REAL (< 200ms)
// ============================================================================
function rebuildSceneAndMetrics() {
  // Limpa malhas anteriores do grupo
  while (objectsGroup.children.length > 0) {
    const child = objectsGroup.children[0];
    objectsGroup.remove(child);
  }

  // Consolida zonas fechadas + zona atualmente em desenho (se tiver >= 3 vértices)
  const allZonesForCollision = [...state.zones];
  if (state.activeZoneVertices.length >= 3) {
    allZonesForCollision.push({
      id: 'active-draft',
      name: 'Zona em edição',
      vertices: state.activeZoneVertices
    });
  }

  // 1. Avalia colisões geométricas no plano XZ
  const collisionReport = evaluateCollisions(state.posts, allZonesForCollision);

  // 2. Calcula metragem euclidiana e capacidade (0,6m/pessoa)
  const metrics = calculateQueueMetrics(state.posts, state.config);

  // 3. Renderiza Zonas Restritas salvas (Vermelho 35% opacidade)
  state.zones.forEach((zone) => {
    const zoneMesh = createRestrictedZoneMesh(zone.vertices, true);
    objectsGroup.add(zoneMesh);
  });

  // Renderiza Zona Restrita em construção
  if (state.activeZoneVertices.length > 0) {
    const draftMesh = createRestrictedZoneMesh(
      state.activeZoneVertices,
      state.activeZoneVertices.length >= 3
    );
    objectsGroup.add(draftMesh);
  }

  // 4. Renderiza Postes Metálicos 3D (Pedestais)
  state.posts.forEach((post, idx) => {
    const postCollides = collisionReport.postCollisions[idx];
    const stanchion = createStanchionMesh(idx + 1, postCollides);
    stanchion.position.set(post.x, post.y || 0, post.z);
    objectsGroup.add(stanchion);
  });

  // 5. Renderiza Fitas Divisórias (LineRenderer / Belt 3D)
  metrics.segments.forEach((seg, idx) => {
    const segCollides = collisionReport.segmentCollisions[idx];
    const beltMesh = createBeltSegmentMesh(
      seg.p1,
      seg.p2,
      seg.length,
      segCollides,
      state.showAbntCorridor
    );
    objectsGroup.add(beltMesh);
  });

  // 6. Atualiza HUD 2D Overlapped
  updateHUD(metrics, collisionReport);
}

// ============================================================================
// ATUALIZAÇÃO DO HUD 2D E FEEDBACK DE ESTADO
// ============================================================================
const valLengthEl = document.getElementById('val-length');
const subSegmentsEl = document.getElementById('sub-segments');
const valCapacityEl = document.getElementById('val-capacity');
const subDensityEl = document.getElementById('sub-density');
const valWaitEl = document.getElementById('val-wait');
const subFlowEl = document.getElementById('sub-flow');
const statusBannerEl = document.getElementById('status-banner');
const statusIconEl = document.getElementById('status-icon');
const statusTitleEl = document.getElementById('status-title');
const statusSubtitleEl = document.getElementById('status-subtitle');
const cardLengthEl = document.getElementById('card-length');
const cardCapacityEl = document.getElementById('card-capacity');
const btnFinishZoneEl = document.getElementById('btn-finish-zone');

function updateHUD(metrics, collisionReport) {
  valLengthEl.textContent = metrics.totalLength.toFixed(2);
  subSegmentsEl.textContent = `${metrics.segments.length} segmento(s) • ${state.posts.length} poste(s)`;

  valCapacityEl.textContent = `${metrics.capacity}`;
  subDensityEl.textContent = `${state.config.metersPerPerson.toFixed(2)}m/p (±${metrics.marginError} p)`;

  valWaitEl.textContent = `${metrics.estimatedWaitMinutes}`;
  subFlowEl.textContent = `Vazão: ${state.config.serviceRatePpm} p/min`;

  // Botão de fechar polígono de área restrita
  if (state.mode === 'zone' && state.activeZoneVertices.length >= 3) {
    btnFinishZoneEl.classList.remove('hidden');
  } else {
    btnFinishZoneEl.classList.add('hidden');
  }

  // Estado de Colisão (Verde = Seguro | Vermelho = Bloqueio Detectado)
  if (collisionReport.hasCollision) {
    statusBannerEl.className = 'status-banner danger';
    statusIconEl.textContent = '🚨';
    const segList = collisionReport.collidingSegmentIndices.join(', ');
    statusTitleEl.textContent = 'ALERTA: BLOQUEIO DE ÁREA RESTRITA DETECTADO!';
    statusSubtitleEl.textContent = segList
      ? `Interseção no(s) segmento(s) #${segList}. Reajuste ou desfaça o último poste.`
      : 'Poste posicionado dentro de corredor de emergência proibido.';

    cardLengthEl.classList.add('collision-state');
    cardCapacityEl.classList.add('collision-state');

    // Vibração tátil no celular (Haptic Feedback) quando há colisão
    if (navigator.vibrate) {
      navigator.vibrate([80, 50, 120]);
    }
  } else {
    statusBannerEl.className = 'status-banner safe';
    statusIconEl.textContent = '✅';
    if (state.posts.length === 0 && state.zones.length === 0) {
      statusTitleEl.textContent = 'Pronto para Mapear • Sem Obstruções';
      statusSubtitleEl.textContent =
        'Toque no chão ou use "Posicionar no Retículo" para criar a fila';
    } else {
      statusTitleEl.textContent = 'Trajeto Validado • Corredores Livres';
      statusSubtitleEl.textContent = `Fila comporta ~${metrics.capacity} pessoas sem invadir zonas restritas`;
    }

    cardLengthEl.classList.remove('collision-state');
    cardCapacityEl.classList.remove('collision-state');
  }
}

// ============================================================================
// INSERÇÃO DE PONTOS (TAP TO PLACE E RETÍCULO)
// ============================================================================
function addPointAtPosition(point3D) {
  const cleanPoint = {
    x: Number(point3D.x.toFixed(3)),
    y: Number((point3D.y || 0).toFixed(3)),
    z: Number(point3D.z.toFixed(3))
  };

  if (state.mode === 'queue') {
    state.posts.push(cleanPoint);
    state.history.push({ type: 'add-post' });
  } else if (state.mode === 'zone') {
    state.activeZoneVertices.push(cleanPoint);
    state.history.push({ type: 'add-zone-vertex' });
  }

  if (navigator.vibrate) {
    navigator.vibrate(25);
  }

  rebuildSceneAndMetrics();
}

function finishActiveZone() {
  if (state.activeZoneVertices.length >= 3) {
    state.zones.push({
      id: `zone_${Date.now()}`,
      name: `Zona Restrita ${state.zones.length + 1}`,
      vertices: [...state.activeZoneVertices]
    });
    state.activeZoneVertices = [];
    state.history.push({ type: 'close-zone' });
    rebuildSceneAndMetrics();
  }
}

// Toque direto no Canvas 3D (Tap to Place)
let pointerDownPos = { x: 0, y: 0 };

renderer.domElement.addEventListener('pointerdown', (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('pointermove', (e) => {
  if (state.webxrActive) return;
  pointerNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointerNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

renderer.domElement.addEventListener('pointerup', (e) => {
  if (state.webxrActive) return;

  // Diferencia um clique rápido (Tap to Place) de um arraste de câmera (Orbit)
  const moveDist = Math.hypot(
    e.clientX - pointerDownPos.x,
    e.clientY - pointerDownPos.y
  );
  if (moveDist > 8) return;

  const tapNDC = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(tapNDC, camera);
  const hits = raycaster.intersectObject(hitPlane);
  if (hits.length > 0) {
    const pt = hits[0].point;
    reticle.position.set(pt.x, 0.004, pt.z);
    addPointAtPosition(pt);
    // Volta o ponteiro para o centro após tocar no mobile
    pointerNDC.set(0, 0);
  }
});

// ============================================================================
// MODO 1: CÂMERA AR UNIVERSAL (FUNCIONA EM 100% DOS CELULARES ANDROID/IOS)
// ============================================================================
const videoEl = document.getElementById('camera-feed');
const btnToggleCamera = document.getElementById('btn-toggle-camera');
const crosshairEl = document.getElementById('center-crosshair');
let mediaStream = null;
let deviceOrientationHandler = null;

async function toggleCameraPassThrough() {
  if (state.cameraPassThroughActive) {
    stopCameraPassThrough();
    return;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    videoEl.srcObject = mediaStream;
    videoEl.classList.add('active');
    state.cameraPassThroughActive = true;
    btnToggleCamera.classList.add('active');
    btnToggleCamera.textContent = '📷 Câmera Ativa';
    crosshairEl.classList.remove('hidden');

    // Ajusta opacidade do grid para ver o piso real nitidamente
    gridHelper.material.opacity = 0.28;

    // Posiciona a câmera na altura real configurada pelo usuário (padrão 1.40m)
    const h = state.config.cameraHeight || 1.4;
    camera.position.set(0, h, 2.2);
    controls.target.set(0, 0, 0);
    controls.update();
    pointerNDC.set(0, 0);

    // Tenta habilitar orientação por giroscópio se disponível no celular
    enableGyroscopeTrackingIfAvailable();
  } catch (err) {
    alert(
      'Não foi possível acessar a câmera traseira. Verifique as permissões do navegador ou conexão HTTPS. Você ainda pode usar o Modo Simulador 3D interativo!'
    );
    console.warn('Erro ao abrir câmera:', err);
  }
}

function stopCameraPassThrough() {
  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop());
    mediaStream = null;
  }
  videoEl.classList.remove('active');
  state.cameraPassThroughActive = false;
  btnToggleCamera.classList.remove('active');
  btnToggleCamera.textContent = '📷 Câmera Real';
  crosshairEl.classList.add('hidden');
  gridHelper.material.opacity = 0.45;

  if (deviceOrientationHandler) {
    window.removeEventListener('deviceorientation', deviceOrientationHandler);
    deviceOrientationHandler = null;
  }
}

function enableGyroscopeTrackingIfAvailable() {
  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === 'granted') {
          attachOrientationListener();
        }
      })
      .catch(() => {});
  } else if ('ondeviceorientation' in window) {
    attachOrientationListener();
  }
}

function attachOrientationListener() {
  deviceOrientationHandler = (event) => {
    if (!state.cameraPassThroughActive || state.webxrActive) return;
    if (event.beta === null || event.gamma === null) return;

    // Converte inclinação do celular (beta) para atualizar o alvo no chão à frente
    const tiltRad = THREE.MathUtils.degToRad(
      THREE.MathUtils.clamp(event.beta, 20, 85)
    );
    const camH = state.config.cameraHeight || 1.4;
    const forwardDist = THREE.MathUtils.clamp(
      camH * Math.tan(tiltRad - Math.PI / 6),
      0.8,
      8.0
    );

    // Move suavemente o retículo conforme a inclinação do aparelho
    reticle.position.z = THREE.MathUtils.lerp(
      reticle.position.z,
      2.2 - forwardDist,
      0.15
    );
  };
  window.addEventListener('deviceorientation', deviceOrientationHandler);
}

// ============================================================================
// MODO 2: WEBXR NATIVO COM HIT-TESTING (ARCORE / ARKIT)
// ============================================================================
const btnStartWebXR = document.getElementById('btn-start-webxr');

async function startWebXRSession() {
  if (!navigator.xr) {
    // Se o navegador não suporta WebXR nativo (ex: iOS Safari ou HTTP local), ativa Câmera AR Universal automaticamente
    toggleCameraPassThrough();
    return;
  }

  try {
    const supported = await navigator.xr.isSessionSupported('immersive-ar');
    if (!supported) {
      toggleCameraPassThrough();
      return;
    }

    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay', 'local-floor'],
      domOverlay: { root: document.getElementById('hud-overlay') }
    });

    state.webxrActive = true;
    floorGroup.visible = false; // No WebXR nativo mostramos apenas o chão real e o retículo
    btnStartWebXR.textContent = '🟢 WebXR Ativo';

    renderer.xr.setReferenceSpaceType('local');
    await renderer.xr.setSession(session);

    const viewerSpace = await session.requestReferenceSpace('viewer');
    xrHitTestSource = await session.requestHitTestSource({ space: viewerSpace });

    // Toque na tela em sessão WebXR
    session.addEventListener('select', () => {
      if (reticle.visible) {
        addPointAtPosition(reticle.position);
      }
    });

    session.addEventListener('end', () => {
      state.webxrActive = false;
      xrHitTestSource = null;
      floorGroup.visible = true;
      btnStartWebXR.textContent = '📱 Iniciar WebXR';
    });
  } catch (err) {
    console.warn('WebXR indisponível, ativando Câmera AR Universal:', err);
    toggleCameraPassThrough();
  }
}

// ============================================================================
// CENÁRIOS PRONTOS DO XRD (PARA DEMONSTRAÇÃO IMEDIATA À PROFESSORA / BANCA)
// ============================================================================

/**
 * Carrega o Cenário 1 exato descrito na Seção 6 do XRD:
 * "Ele aponta a câmera para o chão e marca em vermelho um retângulo correspondente ao corredor de emergência.
 * Em seguida, posiciona os postes virtuais da fila de entrada. A aplicação indica que a fila possui 18 metros
 * e comporta 30 pessoas, mas emite um alerta vermelho informando que o terceiro segmento cruza o corredor restrito"
 */
function loadXRDScenario1Show() {
  if (state.activeZoneVertices.length > 0) state.activeZoneVertices = [];

  // Corredor de Emergência Retangular no centro-direita
  state.zones = [
    {
      id: 'zone_emergencia_xrd',
      name: 'Corredor de Emergência (Saída)',
      vertices: [
        { x: -0.6, y: 0, z: -0.6 },
        { x: 2.4, y: 0, z: -0.6 },
        { x: 2.4, y: 0, z: 0.6 },
        { x: -0.6, y: 0, z: 0.6 }
      ]
    }
  ];

  // Fila de 18 metros exatos (3 segmentos de 6.0m = 18.00m -> 30 pessoas a 0.6m/pessoa)
  // O 3º segmento cruza propositalmente o corredor de emergência para demonstrar o alerta!
  state.posts = [
    { x: -2.0, y: 0, z: -2.5 }, // Poste #1
    { x: -2.0, y: 0, z: 3.5 },  // Poste #2 (Seg #1 = 6.00m)
    { x: 1.0, y: 0, z: 3.5 },   // Poste #3 (Seg #2 = 3.00m)
    { x: 1.0, y: 0, z: -5.5 }   // Poste #4 (Seg #3 = 9.00m -> Cruza o corredor vermelho! Total = 18.00m)
  ];

  state.history.push({ type: 'preset' });
  rebuildSceneAndMetrics();
}

/**
 * Gera uma fila em Caracol / Serpentina (Cenário 2 do XRD: Agências, Feiras e Shows)
 */
function loadSerpentineQueue() {
  const center = reticle.visible
    ? { x: reticle.position.x, y: 0, z: reticle.position.z }
    : { x: 0, y: 0, z: 0 };

  const serpentinePosts = generateSerpentinePreset(center, {
    lanes: 3,
    laneLength: 3.6,
    laneSpacing: 1.0
  });

  state.posts = serpentinePosts;
  state.history.push({ type: 'preset' });
  rebuildSceneAndMetrics();
}

// ============================================================================
// EVENT LISTENERS DOS BOTÕES DO HUD E MODAL
// ============================================================================
const modeQueueBtn = document.getElementById('mode-queue');
const modeZoneBtn = document.getElementById('mode-zone');
const btnToggleAbnt = document.getElementById('btn-toggle-abnt');
const modeInstructionEl = document.getElementById('mode-instruction');

modeQueueBtn.addEventListener('click', () => {
  if (state.activeZoneVertices.length >= 3) {
    finishActiveZone();
  } else {
    state.activeZoneVertices = [];
  }
  state.mode = 'queue';
  modeQueueBtn.classList.add('active');
  modeZoneBtn.classList.remove('active');
  modeInstructionEl.textContent =
    'Modo Fila: Toque no piso ou no botão verde para inserir postes metálicos';
  rebuildSceneAndMetrics();
});

modeZoneBtn.addEventListener('click', () => {
  state.mode = 'zone';
  modeZoneBtn.classList.add('active');
  modeQueueBtn.classList.remove('active');
  modeInstructionEl.textContent =
    'Modo Área Restrita: Marque 3 ou mais cantos no chão para criar zona proibida';
  rebuildSceneAndMetrics();
});

btnToggleAbnt.addEventListener('click', () => {
  state.showAbntCorridor = !state.showAbntCorridor;
  btnToggleAbnt.classList.toggle('active', state.showAbntCorridor);
  rebuildSceneAndMetrics();
});

btnFinishZoneEl.addEventListener('click', () => {
  finishActiveZone();
});

document.getElementById('btn-place-reticle').addEventListener('click', () => {
  addPointAtPosition(reticle.position);
});

document.getElementById('btn-preset-serpentine').addEventListener('click', () => {
  loadSerpentineQueue();
});

document.getElementById('btn-demo-scenario').addEventListener('click', () => {
  loadXRDScenario1Show();
});

document.getElementById('btn-undo').addEventListener('click', () => {
  if (state.mode === 'zone' && state.activeZoneVertices.length > 0) {
    state.activeZoneVertices.pop();
  } else if (state.posts.length > 0) {
    state.posts.pop();
  } else if (state.zones.length > 0) {
    state.zones.pop();
  }
  rebuildSceneAndMetrics();
});

document.getElementById('btn-clear').addEventListener('click', () => {
  state.posts = [];
  state.zones = [];
  state.activeZoneVertices = [];
  state.history = [];
  rebuildSceneAndMetrics();
});

btnToggleCamera.addEventListener('click', toggleCameraPassThrough);
btnStartWebXR.addEventListener('click', startWebXRSession);

// Modal de Laudo Técnico / Parâmetros
const reportModal = document.getElementById('report-modal');
const selectDensity = document.getElementById('select-density');
const inputFlow = document.getElementById('input-flow');
const inputCamHeight = document.getElementById('input-cam-height');
const reportSummaryBox = document.getElementById('report-summary-box');

function openReportModal() {
  const metrics = calculateQueueMetrics(state.posts, state.config);
  const collisions = evaluateCollisions(state.posts, state.zones);

  reportSummaryBox.innerHTML = `
    <div><strong>Postes Posicionados:</strong> ${state.posts.length} unidades</div>
    <div><strong>Segmentos de Fita:</strong> ${metrics.segments.length} trechos</div>
    <div><strong>Extensão Linear Total (XZ):</strong> ${metrics.totalLength.toFixed(2)} metros</div>
    <div><strong>Capacidade Estimada:</strong> ${metrics.capacity} pessoas (±${metrics.marginError} pessoas)</div>
    <div><strong>Tempo Médio de Espera:</strong> ~${metrics.estimatedWaitMinutes} minutos</div>
    <div><strong>Zonas Restritas Mapeadas:</strong> ${state.zones.length} área(s)</div>
    <div><strong>Status de Segurança:</strong> ${
      collisions.hasCollision
        ? '<span style="color:#ff6b6b;font-weight:bold;">❌ REPROVADO (Obstrução no segmento #' +
          collisions.collidingSegmentIndices.join(', #') +
          ')</span>'
        : '<span style="color:#00ff66;font-weight:bold;">✅ APROVADO (Sem bloqueios)</span>'
    }</div>
  `;
  reportModal.classList.remove('hidden');
}

document.getElementById('btn-open-report').addEventListener('click', openReportModal);
document.getElementById('btn-close-report').addEventListener('click', () => {
  reportModal.classList.add('hidden');
});
document.getElementById('btn-close-report-bottom').addEventListener('click', () => {
  reportModal.classList.add('hidden');
});

selectDensity.addEventListener('change', (e) => {
  state.config.metersPerPerson = parseFloat(e.target.value) || 0.6;
  rebuildSceneAndMetrics();
  openReportModal();
});

inputFlow.addEventListener('input', (e) => {
  state.config.serviceRatePpm = Math.max(1, parseInt(e.target.value, 10) || 4);
  rebuildSceneAndMetrics();
});

inputCamHeight.addEventListener('change', (e) => {
  state.config.cameraHeight = parseFloat(e.target.value) || 1.4;
  if (state.cameraPassThroughActive) {
    camera.position.y = state.config.cameraHeight;
  }
});

// Validador de Erro Métrico vs Trena Física (Critério MVP <= 5%)
document.getElementById('btn-calc-error').addEventListener('click', () => {
  const realMeters = parseFloat(document.getElementById('input-real-trena').value);
  const resultEl = document.getElementById('trena-result');
  const metrics = calculateQueueMetrics(state.posts, state.config);

  if (!realMeters || realMeters <= 0) {
    resultEl.innerHTML = '<span style="color:#fbbf24;">Informe um valor válido medido na trena física (ex: 20).</span>';
    return;
  }

  const errorPct = (Math.abs(metrics.totalLength - realMeters) / realMeters) * 100;
  const approved = errorPct <= 5.0;

  resultEl.innerHTML = `
    Medida RA: <strong>${metrics.totalLength.toFixed(2)}m</strong> | Trena: <strong>${realMeters.toFixed(2)}m</strong><br/>
    Erro Relativo: <strong style="color:${approved ? '#00ff66' : '#ff6b6b'}">${errorPct.toFixed(2)}%</strong>
    (${approved ? '✅ Dentro da meta <= 5% do MVP!' : '⚠️ Acima de 5% - Ajuste a altura da câmera'})
  `;
});

// Exportação do Layout em JSON
document.getElementById('btn-export-json').addEventListener('click', () => {
  const metrics = calculateQueueMetrics(state.posts, state.config);
  const payload = {
    projeto: 'Checa Fila (TestaFila)',
    timestamp: new Date().toISOString(),
    config: state.config,
    metricas: {
      extensaoMetros: Number(metrics.totalLength.toFixed(2)),
      capacidadePessoas: metrics.capacity,
      tempoEsperaMinutos: metrics.estimatedWaitMinutes
    },
    postes: state.posts,
    zonasRestritas: state.zones
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `testafila-layout-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// Responsividade da janela
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================================================
// LOOP DE RENDERIZAÇÃO (WEBXR + SIMULADOR / CÂMERA AR)
// ============================================================================
renderer.setAnimationLoop((timestamp, frame) => {
  if (state.webxrActive && frame && xrHitTestSource) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const hitTestResults = frame.getHitTestResults(xrHitTestSource);

    if (hitTestResults.length > 0) {
      const hit = hitTestResults[0];
      const pose = hit.getPose(referenceSpace);
      if (pose) {
        reticle.visible = true;
        reticle.position.set(
          pose.transform.position.x,
          pose.transform.position.y,
          pose.transform.position.z
        );
      }
    } else {
      reticle.visible = false;
    }
  } else {
    controls.update();
    updateFallbackReticle();
  }

  renderer.render(scene, camera);
});

// Inicializa com um layout inicial limpo e pronto
rebuildSceneAndMetrics();

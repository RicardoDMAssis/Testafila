/**
 * Motor de Cálculo Métrico Espacial e Verificação Geométrica (Plano 2D XZ)
 * Responsável: Lógica e Geometria (Conforme XRD / Plano de Projeto)
 */

/**
 * Calcula a distância euclidiana no plano XZ entre dois pontos 3D.
 * @param {{x: number, z: number}} p1
 * @param {{x: number, z: number}} p2
 * @returns {number} Distância em metros
 */
export function distanceXZ(p1, p2) {
  const dx = p2.x - p1.x;
  const dz = p2.z - p1.z;
  return Math.hypot(dx, dz);
}

/**
 * Calcula métricas completas da fila com base nos postes posicionados e parâmetros de atendimento.
 * @param {Array<{x: number, y: number, z: number}>} posts Lista de coordenadas dos postes
 * @param {object} config Configurações de densidade e fluxo
 * @param {number} config.metersPerPerson Espaço linear ocupado por pessoa (Padrão MVP: 0.6m)
 * @param {number} config.rows Multiplicador de fileiras paralelas (1 = simples, 2 = dupla)
 * @param {number} config.serviceRatePpm Taxa de atendimento (pessoas por minuto)
 */
export function calculateQueueMetrics(posts, config = {}) {
  const metersPerPerson = config.metersPerPerson || 0.6;
  const rows = config.rows || 1;
  const serviceRatePpm = config.serviceRatePpm || 4; // Ex: 4 pessoas/minuto na catraca

  let totalLength = 0;
  const segments = [];

  for (let i = 0; i < posts.length - 1; i++) {
    const p1 = posts[i];
    const p2 = posts[i + 1];
    const len = distanceXZ(p1, p2);
    totalLength += len;
    segments.push({
      index: i,
      p1,
      p2,
      length: len,
      collides: false
    });
  }

  const effectiveLength = totalLength * rows;
  const capacity = Math.floor(effectiveLength / metersPerPerson);
  const marginError = Math.max(1, Math.round(capacity * 0.05)); // Margem <= 5% conforme XRD
  const estimatedWaitMinutes = capacity > 0 ? Math.ceil(capacity / serviceRatePpm) : 0;

  return {
    totalLength,
    effectiveLength,
    capacity,
    marginError,
    estimatedWaitMinutes,
    segments
  };
}

/**
 * Verifica orientação de 3 pontos no plano XZ (2D)
 */
function ccwXZ(A, B, C) {
  return (C.z - A.z) * (B.x - A.x) > (B.z - A.z) * (C.x - A.x);
}

/**
 * Verifica se dois segmentos de reta AB e CD se interceptam no plano XZ.
 */
export function segmentsIntersectXZ(A, B, C, D) {
  // Verifica bounding box rápido primeiro
  if (
    Math.max(A.x, B.x) < Math.min(C.x, D.x) ||
    Math.min(A.x, B.x) > Math.max(C.x, D.x) ||
    Math.max(A.z, B.z) < Math.min(C.z, D.z) ||
    Math.min(A.z, B.z) > Math.max(C.z, D.z)
  ) {
    return false;
  }

  return (
    ccwXZ(A, C, D) !== ccwXZ(B, C, D) &&
    ccwXZ(A, B, C) !== ccwXZ(A, B, D)
  );
}

/**
 * Algoritmo Ray-Casting (Even-Odd Rule) para verificar se um ponto P está dentro de um polígono no plano XZ.
 * @param {{x: number, z: number}} point
 * @param {Array<{x: number, z: number}>} polygon
 */
export function isPointInPolygonXZ(point, polygon) {
  if (!polygon || polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, zi = polygon[i].z;
    const xj = polygon[j].x, zj = polygon[j].z;

    const intersect =
      zi > point.z !== zj > point.z &&
      point.x < ((xj - xi) * (point.z - zi)) / (zj - zi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Verifica se um segmento de fila (p1 -> p2) colide ou atravessa um polígono de Zona Restrita.
 * @param {{x: number, z: number}} p1
 * @param {{x: number, z: number}} p2
 * @param {Array<{x: number, z: number}>} polygon
 */
export function segmentIntersectsPolygonXZ(p1, p2, polygon) {
  if (!polygon || polygon.length < 3) return false;

  // 1. Verifica se alguma das extremidades está dentro da zona restrita
  if (isPointInPolygonXZ(p1, polygon) || isPointInPolygonXZ(p2, polygon)) {
    return true;
  }

  // 2. Verifica se o ponto médio está dentro do polígono (caso atravesse de ponta a ponta)
  const mid = { x: (p1.x + p2.x) / 2, z: (p1.z + p2.z) / 2 };
  if (isPointInPolygonXZ(mid, polygon)) {
    return true;
  }

  // 3. Verifica interseção do segmento com qualquer aresta do polígono
  for (let i = 0; i < polygon.length; i++) {
    const v1 = polygon[i];
    const v2 = polygon[(i + 1) % polygon.length];
    if (segmentsIntersectXZ(p1, p2, v1, v2)) {
      return true;
    }
  }

  return false;
}

/**
 * Verifica todas as colisões entre os postes/segmentos da fila e múltiplas zonas restritas.
 * @param {Array<{x: number, y: number, z: number}>} posts
 * @param {Array<{id: string, name: string, vertices: Array<{x: number, y: number, z: number}>}>} zones
 */
export function evaluateCollisions(posts, zones) {
  const closedZones = zones.filter((z) => z.vertices && z.vertices.length >= 3);

  const postCollisions = posts.map((post) =>
    closedZones.some((zone) => isPointInPolygonXZ(post, zone.vertices))
  );

  const segmentCollisions = [];
  const collidingSegmentIndices = [];

  for (let i = 0; i < posts.length - 1; i++) {
    const p1 = posts[i];
    const p2 = posts[i + 1];
    const collides = closedZones.some((zone) =>
      segmentIntersectsPolygonXZ(p1, p2, zone.vertices)
    );
    segmentCollisions.push(collides);
    if (collides) {
      collidingSegmentIndices.push(i + 1); // 1-based para exibição amigável ao usuário
    }
  }

  const hasCollision =
    postCollisions.some(Boolean) || segmentCollisions.some(Boolean);

  return {
    hasCollision,
    postCollisions,
    segmentCollisions,
    collidingSegmentIndices
  };
}

/**
 * Gera automaticamente um layout de fila em "Caracol / Zig-Zag" (Serpentina)
 * Ideal para shows, feiras e agências bancárias (Cenário 2 do XRD).
 * @param {{x: number, y: number, z: number}} center Ponto central no chão
 * @param {object} options Opções do gerador
 */
export function generateSerpentinePreset(center, options = {}) {
  const lanes = options.lanes || 3; // Número de corredores
  const laneLength = options.laneLength || 4.0; // Comprimento de cada corredor (m)
  const laneSpacing = options.laneSpacing || 1.0; // Largura do corredor (m) - ABNT NBR 9050 recomenda >= 0.90m
  const y = center.y || 0;

  const posts = [];
  const totalWidth = (lanes - 1) * laneSpacing;
  const startX = center.x - totalWidth / 2;
  const startZ = center.z - laneLength / 2;

  for (let lane = 0; lane < lanes; lane++) {
    const x = startX + lane * laneSpacing;
    if (lane % 2 === 0) {
      posts.push({ x, y, z: startZ + laneLength });
      posts.push({ x, y, z: startZ });
    } else {
      posts.push({ x, y, z: startZ });
      posts.push({ x, y, z: startZ + laneLength });
    }
  }

  return posts;
}

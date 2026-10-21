import * as THREE from 'three';

/**
 * Cria um Poste Organizador de Fila (Unifila / Pedestal 3D Metálico)
 * Conforme Seção 10 do XRD: Cilindros virtuais em tom prateado/metálico simples.
 * @param {number} index Número do poste (1-based)
 * @param {boolean} isColliding Se o poste está dentro de uma zona restrita
 */
export function createStanchionMesh(index, isColliding = false) {
  const group = new THREE.Group();
  group.name = `Stanchion_${index}`;

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: isColliding ? 0xff4444 : 0xd8dee9,
    metalness: 0.85,
    roughness: 0.2
  });

  const darkCapMaterial = new THREE.MeshStandardMaterial({
    color: isColliding ? 0x990000 : 0x1e293b,
    metalness: 0.4,
    roughness: 0.6
  });

  // 1. Base pesada circular no chão (Raio 16cm, Altura 2.5cm)
  const baseGeo = new THREE.CylinderGeometry(0.15, 0.16, 0.025, 24);
  const baseMesh = new THREE.Mesh(baseGeo, darkCapMaterial);
  baseMesh.position.y = 0.0125;
  group.add(baseMesh);

  // Anel cromado sobre a base
  const ringGeo = new THREE.CylinderGeometry(0.13, 0.145, 0.015, 24);
  const ringMesh = new THREE.Mesh(ringGeo, metalMaterial);
  ringMesh.position.y = 0.025;
  group.add(ringMesh);

  // 2. Tubo vertical metálico (Altura 92cm, Raio 3.2cm)
  const poleHeight = 0.92;
  const poleGeo = new THREE.CylinderGeometry(0.032, 0.032, poleHeight, 20);
  const poleMesh = new THREE.Mesh(poleGeo, metalMaterial);
  poleMesh.position.y = poleHeight / 2 + 0.025;
  group.add(poleMesh);

  // 3. Cassete superior da fita retrátil
  const topGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.09, 20);
  const topMesh = new THREE.Mesh(topGeo, darkCapMaterial);
  topMesh.position.y = poleHeight + 0.025;
  group.add(topMesh);

  // 4. Indicador luminoso no topo (Verde = Seguro, Vermelho = Colisão)
  const glowColor = isColliding ? 0xff0000 : 0x00ff66;
  const bulbGeo = new THREE.SphereGeometry(0.028, 16, 16);
  const bulbMat = new THREE.MeshBasicMaterial({ color: glowColor });
  const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
  bulbMesh.position.y = poleHeight + 0.08;
  group.add(bulbMesh);

  // 5. Badge flutuante com número do poste
  const badgeSprite = createTextSprite(`#${index}`, {
    bgColor: isColliding ? 'rgba(220, 38, 38, 0.9)' : 'rgba(15, 23, 42, 0.85)',
    borderColor: isColliding ? '#ff4444' : '#00ff66',
    textColor: '#ffffff'
  });
  badgeSprite.position.set(0, poleHeight + 0.22, 0);
  badgeSprite.scale.set(0.28, 0.14, 1);
  group.add(badgeSprite);

  return group;
}

/**
 * Cria a Fita Retrátil 3D (Belt/Ribbon) conectando dois postes.
 * Conforme Seção 10 do XRD: Verde (#00FF00) seguro e Vermelho (#FF0000) colisão.
 * Além da fita a 0.85m de altura, desenha uma faixa projetada no chão para facilitar a leitura espacial.
 */
export function createBeltSegmentMesh(p1, p2, segmentLength, isColliding = false, showAccessibilityCorridor = false) {
  const group = new THREE.Group();

  const colorHex = isColliding ? 0xff0000 : 0x00ff00;
  const beltHeight = 0.86; // Altura da fita do pedestal
  const beltThickness = 0.065; // Fita de 6,5cm de largura

  const dx = p2.x - p1.x;
  const dz = p2.z - p1.z;
  const dist = Math.hypot(dx, dz);
  if (dist < 0.01) return group;

  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;
  const midZ = (p1.z + p2.z) / 2;
  const angle = Math.atan2(dx, dz);

  // 1. Fita física suspensa entre os postes
  const beltGeo = new THREE.BoxGeometry(0.012, beltThickness, dist);
  const beltMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: isColliding ? 0.55 : 0.25,
    roughness: 0.4
  });
  const beltMesh = new THREE.Mesh(beltGeo, beltMat);
  beltMesh.position.set(midX, midY + beltHeight, midZ);
  beltMesh.rotation.y = angle;
  group.add(beltMesh);

  // 2. Linha projetada no piso (Guia de solo de alto contraste)
  const floorLineGeo = new THREE.PlaneGeometry(0.05, dist);
  floorLineGeo.rotateX(-Math.PI / 2);
  const floorLineMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  });
  const floorLineMesh = new THREE.Mesh(floorLineGeo, floorLineMat);
  floorLineMesh.position.set(midX, midY + 0.006, midZ);
  floorLineMesh.rotation.y = angle;
  group.add(floorLineMesh);

  // 3. Opcional: Faixa de largura mínima de acessibilidade ABNT NBR 9050 (0.90m de largura)
  if (showAccessibilityCorridor) {
    const corridorGeo = new THREE.PlaneGeometry(0.9, dist);
    corridorGeo.rotateX(-Math.PI / 2);
    const corridorMat = new THREE.MeshBasicMaterial({
      color: isColliding ? 0xff0000 : 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide
    });
    const corridorMesh = new THREE.Mesh(corridorGeo, corridorMat);
    corridorMesh.position.set(midX, midY + 0.003, midZ);
    corridorMesh.rotation.y = angle;
    group.add(corridorMesh);
  }

  // 4. Marcadores de ocupação de pessoas no chão (a cada 0,6m conforme regra de densidade do MVP)
  const personStep = 0.6;
  const numPeopleInSeg = Math.floor(dist / personStep);
  const personRingGeo = new THREE.RingGeometry(0.11, 0.16, 20);
  personRingGeo.rotateX(-Math.PI / 2);
  const personRingMat = new THREE.MeshBasicMaterial({
    color: isColliding ? 0xff4444 : 0x22c55e,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide
  });

  for (let k = 1; k <= numPeopleInSeg; k++) {
    const t = (k * personStep) / dist;
    if (t < 0.95) {
      const px = p1.x + dx * t;
      const pz = p1.z + dz * t;
      const py = p1.y + (p2.y - p1.y) * t;
      const footprint = new THREE.Mesh(personRingGeo, personRingMat);
      footprint.position.set(px, py + 0.008, pz);
      group.add(footprint);
    }
  }

  // 5. Etiqueta com metragem do segmento
  const labelText = `${segmentLength.toFixed(2)}m${isColliding ? ' ⚠️ BLOQUEIO' : ''}`;
  const labelSprite = createTextSprite(labelText, {
    bgColor: isColliding ? 'rgba(220, 38, 38, 0.95)' : 'rgba(15, 23, 42, 0.85)',
    borderColor: isColliding ? '#ffffff' : '#00ff00',
    textColor: '#ffffff'
  });
  labelSprite.position.set(midX, midY + beltHeight + 0.18, midZ);
  labelSprite.scale.set(isColliding ? 0.52 : 0.34, 0.15, 1);
  group.add(labelSprite);

  return group;
}

/**
 * Cria Polígono de Zona Restrita / Corredor de Emergência no chão
 * Conforme Seção 10 do XRD: Vermelho Semitransparente (Hex #FF0000 com opacidade a 35%)
 */
export function createRestrictedZoneMesh(vertices, isClosed = true) {
  const group = new THREE.Group();
  if (!vertices || vertices.length === 0) return group;

  const avgY = vertices.reduce((acc, v) => acc + (v.y || 0), 0) / vertices.length;

  // Pinos vermelhos nos vértices
  const pinGeo = new THREE.ConeGeometry(0.06, 0.18, 16);
  const pinMat = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0x660000,
    roughness: 0.3
  });

  vertices.forEach((v) => {
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(v.x, (v.y || avgY) + 0.09, v.z);
    group.add(pin);
  });

  // Borda perimetral vermelha
  if (vertices.length >= 2) {
    const points3D = vertices.map((v) => new THREE.Vector3(v.x, (v.y || avgY) + 0.015, v.z));
    if (isClosed && vertices.length >= 3) {
      points3D.push(points3D[0].clone());
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points3D);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 });
    const borderLine = new THREE.Line(lineGeo, lineMat);
    group.add(borderLine);
  }

  // Preenchimento do Polígono com 35% de opacidade (#FF0000)
  if (vertices.length >= 3) {
    const shape = new THREE.Shape();
    shape.moveTo(vertices[0].x, vertices[0].z);
    for (let i = 1; i < vertices.length; i++) {
      shape.lineTo(vertices[i].x, vertices[i].z);
    }
    shape.closePath();

    const polyGeo = new THREE.ShapeGeometry(shape);
    // ShapeGeometry é criada no plano XY; rotacionamos para o plano XZ
    const posAttr = polyGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getY(i);
      posAttr.setXYZ(i, x, avgY + 0.01, z);
    }
    polyGeo.computeVertexNormals();

    const polyMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.35, // Especificação exata do OPC/XRD: 35% opacidade
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const polyMesh = new THREE.Mesh(polyGeo, polyMat);
    group.add(polyMesh);

    // Label central "ÁREA RESTRITA / EMERGÊNCIA"
    const centerX = vertices.reduce((s, v) => s + v.x, 0) / vertices.length;
    const centerZ = vertices.reduce((s, v) => s + v.z, 0) / vertices.length;
    const zoneLabel = createTextSprite('⛔ ÁREA RESTRITA', {
      bgColor: 'rgba(185, 28, 28, 0.92)',
      borderColor: '#fca5a5',
      textColor: '#ffffff'
    });
    zoneLabel.position.set(centerX, avgY + 0.25, centerZ);
    zoneLabel.scale.set(0.55, 0.16, 1);
    group.add(zoneLabel);
  }

  return group;
}

/**
 * Cria o Retículo Visual 3D (Mira de Hit-Testing no chão)
 */
export function createReticleMesh() {
  const group = new THREE.Group();

  // Anel externo branco/verde
  const outerRingGeo = new THREE.RingGeometry(0.14, 0.18, 32);
  outerRingGeo.rotateX(-Math.PI / 2);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x00ff66,
    side: THREE.DoubleSide
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  group.add(outerRing);

  // Ponto central
  const centerDotGeo = new THREE.CircleGeometry(0.035, 20);
  centerDotGeo.rotateX(-Math.PI / 2);
  const centerDotMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  const centerDot = new THREE.Mesh(centerDotGeo, centerDotMat);
  centerDot.position.y = 0.002;
  group.add(centerDot);

  return group;
}

/**
 * Utilitário para criar Sprites 2D em Canvas 3D para exibir metragens no espaço real
 */
function createTextSprite(text, style = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  const bgColor = style.bgColor || 'rgba(15, 23, 42, 0.85)';
  const borderColor = style.borderColor || '#00ff66';
  const textColor = style.textColor || '#ffffff';

  // Fundo arredondado
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 8;
  roundRect(ctx, 12, 12, canvas.width - 24, canvas.height - 24, 36);
  ctx.fill();
  ctx.stroke();

  // Texto
  ctx.font = 'bold 54px Inter, system-ui, sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  });
  return new THREE.Sprite(material);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Belt, PointXZ, ProjectScene, QueueRoute, RestrictedArea, Stanchion, Vertex } from "../../../contracts/project.ts";
import type { EditorSelection, QueueCommand, QueueHistory } from "../../../contracts/queue-editor.ts";
import { createQueueHistory, executeQueueCommand, getQueueStats, redoQueue, undoQueue, validateQueueScene } from "../../../src/domain/queue/index.ts";
import { queueErrorsForUser } from "../lib/queue-errors";
import { ScenePreview } from "./scene-preview";

type QueueTool = "post" | "belt" | "people";
type QueueStage = "areas" | "queue";
type EditorMode = "create" | "edit";
type Props = {
  initialScene: ProjectScene;
  mode: EditorMode;
  onSceneChange: (scene: ProjectScene) => void;
  onEnvironmentChangePending?: (pending: boolean) => void;
  onBack?: () => void;
  onContinue?: (scene: ProjectScene) => void;
  onSave?: (scene: ProjectScene) => void | Promise<void>;
};
type DraftVertex = { id: string; x: string; z: string };

function parseMeters(value: string): number | null {
  if (!value.trim()) return null;
  const number = Number(value.trim().replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

function formatMeters(value: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value);
}

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function environmentGeometryKey(environment: ProjectScene["environment"]): string {
  return JSON.stringify({
    perimeter: environment.perimeter.map(({ x, z }) => [x, z]),
    wallHeightMeters: environment.wallHeightMeters,
  });
}

export function sameEnvironmentGeometry(first: ProjectScene["environment"], second: ProjectScene["environment"]): boolean {
  return environmentGeometryKey(first) === environmentGeometryKey(second);
}

export function QueueEditor({ initialScene, mode, onSceneChange, onEnvironmentChangePending, onBack, onContinue, onSave }: Props) {
  const [history, setHistory] = useState<QueueHistory>(() => createQueueHistory(initialScene));
  const [stage, setStage] = useState<QueueStage>("areas");
  const [tool, setTool] = useState<QueueTool>("post");
  const [view, setView] = useState<"top" | "perspective">("top");
  const [selection, setSelection] = useState<EditorSelection | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const scene = history.present;
  const environmentChanged = environmentGeometryKey(scene.environment) !== environmentGeometryKey(initialScene.environment);
  const validation = useMemo(() => validateQueueScene(scene), [scene]);
  const stats = useMemo(() => getQueueStats(scene), [scene]);
  const selectedPost = selection?.kind === "post" ? scene.posts.find((post) => post.id === selection.id) : undefined;
  const selectedArea = selection?.kind === "area" ? scene.restrictedAreas.find((area) => area.id === selection.id) : undefined;

  useEffect(() => {
    onEnvironmentChangePending?.(environmentChanged);
    if (!environmentChanged) onSceneChange(scene);
  }, [environmentChanged, onEnvironmentChangePending, onSceneChange, scene]);

  function run(command: QueueCommand, successMessage?: string): boolean {
    if (environmentChanged) {
      setError("As medidas mudaram. Confirme o descarte da montagem anterior antes de aplicar alterações.");
      return false;
    }
    const result = executeQueueCommand(history, command);
    if (!result.valid) {
      setError(queueErrorsForUser(result.errors, "Esta alteração não pode ser aplicada.").join(" ") || "Esta alteração não pode ser aplicada.");
      setMessage("");
      return false;
    }
    if (result.history.present === history.present) {
      setError("Esta alteração não mudou a planta.");
      setMessage("");
      return false;
    }
    setHistory(result.history);
    setError("");
    setMessage(successMessage ?? "Alteração aplicada.");
    return true;
  }

  function undo() {
    if (!history.past.length) return;
    setHistory(undoQueue(history));
    setSelection(null);
    setError("");
    setMessage("Última alteração desfeita.");
  }

  function redo() {
    if (!history.future.length) return;
    setHistory(redoQueue(history));
    setSelection(null);
    setError("");
    setMessage("Alteração refeita.");
  }

  function handleSelect(next: EditorSelection | null) {
    setSelection(next);
    if (next?.kind === "post" && tool === "belt") {
      if (!fromPost) {
        setFromPost(next.id); setToPost(""); setMessage("Primeiro poste escolhido. Clique em outro poste para completar o par.");
      } else if (fromPost === next.id && !toPost) {
        setFromPost(""); setToPost(""); setMessage("Seleção limpa. Clique no primeiro poste para começar de novo.");
      } else if (toPost) {
        setFromPost(next.id); setToPost(""); setMessage("Par reiniciado. Clique em outro poste para escolher o segundo.");
      } else {
        setToPost(next.id); setMessage("Par escolhido. Confirme a conexão com fita.");
      }
    }
    setError("");
  }

  const [postX, setPostX] = useState("");
  const [postZ, setPostZ] = useState("");
  const [fromPost, setFromPost] = useState("");
  const [toPost, setToPost] = useState("");
  const [routeDraft, setRouteDraft] = useState<Vertex[]>([]);
  const [routeX, setRouteX] = useState("");
  const [routeZ, setRouteZ] = useState("");
  const [areaKind, setAreaKind] = useState<"rectangle" | "polygon">("rectangle");
  const [areaName, setAreaName] = useState("");
  const [areaX, setAreaX] = useState("");
  const [areaZ, setAreaZ] = useState("");
  const [areaWidth, setAreaWidth] = useState("");
  const [areaDepth, setAreaDepth] = useState("");
  const [areaDraft, setAreaDraft] = useState<DraftVertex[]>([]);
  const [newAreaDraft, setNewAreaDraft] = useState<DraftVertex[]>([]);
  const [areaVertexX, setAreaVertexX] = useState("");
  const [areaVertexZ, setAreaVertexZ] = useState("");

  function discardAssemblyForNewEnvironment() {
    const resetScene: ProjectScene = {
      ...initialScene,
      restrictedAreas: [], posts: [], belts: [], routes: [], people: [],
    };
    setHistory(createQueueHistory(resetScene));
    setSelection(null); setRouteDraft([]); setAreaDraft([]); setNewAreaDraft([]);
    setPostX(""); setPostZ(""); setFromPost(""); setToPost("");
    setRouteX(""); setRouteZ(""); setAreaVertexX(""); setAreaVertexZ("");
    setAreaName(""); setAreaX(""); setAreaZ(""); setAreaWidth(""); setAreaDepth("");
    setStage("areas"); setError("");
    setMessage("A montagem anterior foi descartada. As áreas e a fila agora usam as novas medidas.");
    onEnvironmentChangePending?.(false);
  }

  const queueRoute = scene.routes[0];
  const peopleOnRoute = queueRoute ? scene.people.filter((person) => person.routeId === queueRoute.id) : [];

  function addPost(position: PointXZ) {
    const post: Stanchion = { id: newId("post"), position, heightMeters: 0.95, baseRadiusMeters: 0.16 };
    run({ type: "post:add", post }, "Poste adicionado.");
  }

  function addPostByCoordinates(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const x = parseMeters(postX);
    const z = parseMeters(postZ);
    if (x === null || z === null) { setError("Informe as duas posições do poste em metros."); return; }
    if (run({ type: "post:add", post: { id: newId("post"), position: { x, z }, heightMeters: 0.95, baseRadiusMeters: 0.16 } }, "Poste adicionado.")) {
      setPostX(""); setPostZ("");
    }
  }

  function moveSelectedPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPost) return;
    const x = parseMeters(postX);
    const z = parseMeters(postZ);
    if (x === null || z === null) { setError("Informe as duas posições do poste em metros."); return; }
    if (run({ type: "post:move", id: selectedPost.id, position: { x, z } }, "Posição do poste atualizada.")) {
      setPostX(""); setPostZ("");
    }
  }

  function addBelt() {
    if (!fromPost || !toPost || fromPost === toPost) { setError("Escolha dois postes diferentes para ligar com a fita."); return; }
    const belt: Belt = { id: newId("belt"), fromPostId: fromPost, toPostId: toPost, heightMeters: 0.86 };
    if (run({ type: "belt:add", belt }, "Fita ligada aos dois postes.")) { setFromPost(""); setToPost(""); }
  }

  function addRoutePoint(point: PointXZ) {
    if (environmentChanged) { setError("As medidas mudaram. Descarte a montagem anterior para continuar."); return; }
    setRouteDraft((current) => [...current, { id: newId("route-point"), ...point }]);
    setMessage("Ponto incluído no rascunho do percurso.");
    setError("");
  }

  function addRoutePointByCoordinates(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (environmentChanged) { setError("As medidas mudaram. Descarte a montagem anterior para continuar."); return; }
    const x = parseMeters(routeX);
    const z = parseMeters(routeZ);
    if (x === null || z === null) { setError("Informe as duas posições do percurso em metros."); return; }
    addRoutePoint({ x, z }); setRouteX(""); setRouteZ("");
  }

  function confirmRoute() {
    if (scene.routes.length > 0) { setError("Remova o percurso atual antes de confirmar outro."); return; }
    if (routeDraft.length < 2) { setError("Inclua pelo menos dois pontos para confirmar o percurso."); return; }
    const route: QueueRoute = { id: newId("route"), points: routeDraft };
    if (run({ type: "route:set", route }, "Percurso confirmado.")) setRouteDraft([]);
  }

  function handleFloorPoint(point: PointXZ) {
    if (stage !== "queue") return;
    if (environmentChanged) { setError("As medidas mudaram. Descarte a montagem anterior para continuar."); return; }
    if (tool === "post") addPost(point);
    if (tool === "people") addRoutePoint(point);
  }

  function handleMove(selectionToMove: EditorSelection, delta: PointXZ) {
    if (selectionToMove.kind === "post") {
      const post = scene.posts.find((candidate) => candidate.id === selectionToMove.id);
      if (post) run({ type: "post:move", id: post.id, position: { x: post.position.x + delta.x, z: post.position.z + delta.z } }, "Poste reposicionado.");
      return;
    }
    if (selectionToMove.kind === "area") {
      const area = scene.restrictedAreas.find((candidate) => candidate.id === selectionToMove.id);
      if (area) run({ type: "area:update", area: { ...area, vertices: area.vertices.map((vertex) => ({ ...vertex, x: vertex.x + delta.x, z: vertex.z + delta.z })) } }, "Área reposicionada.");
      return;
    }
    setError("Esta peça não pode ser movida diretamente. Use as opções de edição disponíveis.");
  }

  function createArea() {
    const name = areaName.trim() || `Área ${scene.restrictedAreas.length + 1}`;
    let vertices: Vertex[];
    if (areaKind === "rectangle") {
      const x = parseMeters(areaX); const z = parseMeters(areaZ);
      const width = parseMeters(areaWidth); const depth = parseMeters(areaDepth);
      if (x === null || z === null || width === null || depth === null || width <= 0 || depth <= 0) {
        setError("Informe a posição, largura e profundidade positivas da área, em metros."); return;
      }
      vertices = [
        { id: newId("area-point"), x, z },
        { id: newId("area-point"), x: x + width, z },
        { id: newId("area-point"), x: x + width, z: z + depth },
        { id: newId("area-point"), x, z: z + depth },
      ];
    } else {
      vertices = newAreaDraft.map(({ id, x, z }) => ({ id, x: Number(x), z: Number(z) }));
      if (vertices.length < 3 || vertices.some((vertex) => !Number.isFinite(vertex.x) || !Number.isFinite(vertex.z))) {
        setError("Inclua pelo menos três pontos válidos para desenhar a área."); return;
      }
    }
    const area: RestrictedArea = { id: newId("area"), name, vertices };
    if (run({ type: "area:add", area }, "Área restrita adicionada.")) {
      setAreaName(""); setNewAreaDraft([]); setSelection({ kind: "area", id: area.id });
      setAreaX(""); setAreaZ(""); setAreaWidth(""); setAreaDepth("");
    }
  }

  useEffect(() => {
    if (selectedArea) setAreaDraft(selectedArea.vertices.map((vertex) => ({ id: vertex.id, x: String(vertex.x), z: String(vertex.z) })));
    else setAreaDraft([]);
  }, [selectedArea]);

  function addAreaVertex(event: FormEvent<HTMLFormElement>, destination: "new" | "selected" = "new") {
    event.preventDefault();
    const x = parseMeters(areaVertexX); const z = parseMeters(areaVertexZ);
    if (x === null || z === null) { setError("Informe as duas posições do ponto em metros."); return; }
    const point = { id: newId("area-point"), x: String(x), z: String(z) };
    if (destination === "selected") setAreaDraft((current) => [...current, point]);
    else setNewAreaDraft((current) => [...current, point]);
    setAreaVertexX(""); setAreaVertexZ(""); setError("");
  }

  function saveAreaDraft() {
    if (!selectedArea) return;
    const vertices: Vertex[] = [];
    for (const vertex of areaDraft) {
      const x = parseMeters(vertex.x); const z = parseMeters(vertex.z);
      if (x === null || z === null) { setError("Revise as posições dos pontos da área antes de aplicar."); return; }
      vertices.push({ id: vertex.id, x, z });
    }
    run({ type: "area:update", area: { ...selectedArea, vertices } }, "Área atualizada.");
  }

  function removeSelected() {
    if (!selection) { setError("Selecione um poste, fita, percurso ou pessoa primeiro."); return; }
    if (selection.kind === "area") { setError("Edite ou remova áreas na etapa anterior à montagem da fila."); return; }
    const labels = { post: "Poste removido junto com as fitas ligadas a ele.", belt: "Fita removida.", route: "Percurso e pessoas removidos.", person: "Pessoa removida." };
    const command: QueueCommand = selection.kind === "post"
      ? { type: "post:remove", id: selection.id }
      : selection.kind === "belt" ? { type: "belt:remove", id: selection.id }
        : selection.kind === "route" ? { type: "route:remove", id: selection.id }
          : { type: "person:remove", id: selection.id };
    if (run(command, labels[selection.kind])) setSelection(null);
  }

  function changeSpacing(value: string) {
    if (environmentChanged) { setError("As medidas mudaram. Descarte a montagem anterior para continuar."); return; }
    if (scene.simulation.spacingMeters === Number(value)) return;
    const oldCount = stats.peopleCount;
    const spacingMeters = Number(value);
    const result = executeQueueCommand(history, { type: "simulation:spacing", spacingMeters });
    if (!result.valid || result.history.present === history.present) {
      setError(queueErrorsForUser(result.errors, "Este espaçamento não altera a fila.").join(" ") || "Este espaçamento não altera a fila."); setMessage(""); return;
    }
    const nextCount = getQueueStats(result.history.present).peopleCount;
    setHistory(result.history); setError(""); setMessage(nextCount < oldCount
      ? `Espaçamento atualizado. A quantidade foi reduzida de ${oldCount} para ${nextCount} para caber no percurso.`
      : "Espaçamento atualizado.");
  }

  async function saveOrContinue() {
    if (environmentChanged) { setError("O ambiente mudou. Confirme o descarte da montagem anterior antes de continuar."); return; }
    if (!validation.valid) { setError(queueErrorsForUser(validation.errors, "Confira os itens da fila antes de continuar.").join(" ") || "Corrija os itens marcados antes de continuar."); return; }
    setSaving(true);
    try {
      if (mode === "edit") await onSave?.(scene);
      else onContinue?.(scene);
    } finally { setSaving(false); }
  }

  const postCoordinateForm = (
    <form className="queue-coordinate-form" onSubmit={selectedPost ? moveSelectedPost : addPostByCoordinates}>
      <label>{selectedPost ? "Nova posição X (m)" : "Posição X (m)"}<input value={postX} onChange={(event) => setPostX(event.target.value)} placeholder={selectedPost ? formatMeters(selectedPost.position.x) : "0"} inputMode="decimal" /></label>
      <label>{selectedPost ? "Nova posição Z (m)" : "Posição Z (m)"}<input value={postZ} onChange={(event) => setPostZ(event.target.value)} placeholder={selectedPost ? formatMeters(selectedPost.position.z) : "0"} inputMode="decimal" /></label>
      <button className="button-secondary" type="submit">{selectedPost ? "Mover poste" : "Adicionar poste"}</button>
    </form>
  );

  return (
    <section className="queue-editor" aria-labelledby="queue-editor-title">
      <div className="queue-editor-heading">
        <div><p className="stage-kicker">{stage === "areas" ? "ETAPA ANTES DA FILA" : "MONTAGEM DA FILA"}</p>
          <h1 id="queue-editor-title">{stage === "areas" ? <>Marque os espaços <em>restritos.</em></> : <>Monte a fila <em>no ambiente.</em></>}</h1>
          <p>{stage === "areas" ? "Zonas como pilares ou móveis impedem a passagem. Se não houver áreas restritas, você pode continuar sem elas." : "Adicione postes, conecte fitas e desenhe o percurso das pessoas. Todas as posições usam metros."}</p>
        </div>
        {stage === "queue" && <div className="view-switch" role="group" aria-label="Ângulo da visualização">
          <button type="button" className={view === "top" ? "selected" : ""} onClick={() => setView("top")}>Planta</button>
          <button type="button" className={view === "perspective" ? "selected" : ""} onClick={() => setView("perspective")}>Perspectiva</button>
        </div>}
      </div>

      {environmentChanged && <div className="queue-environment-warning" role="alert">
        <p>As medidas do ambiente mudaram. A montagem anterior não corresponde às novas medidas. Você pode voltar e restaurar as medidas antigas, ou descartar áreas, postes, fitas, percurso e pessoas para começar com o ambiente atualizado.</p>
        <button className="queue-danger-button" type="button" onClick={discardAssemblyForNewEnvironment}>Descartar montagem e usar as novas medidas</button>
      </div>}

      {stage === "areas" ? (
        <div className="area-stage">
          <div className="area-editor-panel">
            <div className="queue-panel-heading"><span>01</span><h2>Adicionar área restrita</h2></div>
            <div className="area-create-form">
              <label>Nome da área<input value={areaName} maxLength={80} onChange={(event) => setAreaName(event.target.value)} placeholder="Ex.: Pilar central" /></label>
              <div className="entry-switch" role="group" aria-label="Forma da área">
                <button type="button" className={areaKind === "rectangle" ? "entry-option selected" : "entry-option"} onClick={() => setAreaKind("rectangle")}>Retângulo</button>
                <button type="button" className={areaKind === "polygon" ? "entry-option selected" : "entry-option"} onClick={() => setAreaKind("polygon")}>Polígono</button>
              </div>
              {areaKind === "rectangle" ? <div className="queue-coordinate-form">
                <label>Posição X (m)<input value={areaX} onChange={(event) => setAreaX(event.target.value)} inputMode="decimal" /></label>
                <label>Posição Z (m)<input value={areaZ} onChange={(event) => setAreaZ(event.target.value)} inputMode="decimal" /></label>
                <label>Largura (m)<input value={areaWidth} onChange={(event) => setAreaWidth(event.target.value)} inputMode="decimal" /></label>
                <label>Profundidade (m)<input value={areaDepth} onChange={(event) => setAreaDepth(event.target.value)} inputMode="decimal" /></label>
              </div> : <>
                <p className="measurement-note">Inclua os pontos em metros na ordem ao redor da área; o último fecha no primeiro.</p>
                <form className="queue-coordinate-form" onSubmit={(event) => addAreaVertex(event, "new")}>
                  <label>Posição X (m)<input value={areaVertexX} onChange={(event) => setAreaVertexX(event.target.value)} inputMode="decimal" /></label>
                  <label>Posição Z (m)<input value={areaVertexZ} onChange={(event) => setAreaVertexZ(event.target.value)} inputMode="decimal" /></label>
                  <button className="button-secondary" type="submit">Incluir ponto</button>
                </form>
                <ol className="queue-draft-list">{newAreaDraft.map((vertex, index) => <li key={vertex.id}>Ponto {index + 1}: X {vertex.x} m · Z {vertex.z} m</li>)}</ol>
              </>}
              <button className="button-primary" type="button" onClick={createArea}>Adicionar área</button>
            </div>
          </div>

          <div className="area-editor-panel">
            <div className="queue-panel-heading"><span>02</span><h2>Áreas registradas</h2></div>
            {scene.restrictedAreas.length === 0 ? <p className="measurement-note">Nenhuma área restrita adicionada.</p> : <ul className="queue-entity-list">
              {scene.restrictedAreas.map((area) => <li key={area.id}>
                <button type="button" className={selectedArea?.id === area.id ? "queue-entity selected" : "queue-entity"} onClick={() => setSelection({ kind: "area", id: area.id })}>
                  <span>{area.name}</span><small>{area.vertices.length} pontos</small>
                </button>
              </li>)}
            </ul>}
            {selectedArea && <div className="selected-area-form">
              <h3>Editar forma de {selectedArea.name}</h3>
              {areaDraft.map((vertex, index) => <div className="area-vertex-edit" key={vertex.id}>
                <span>Ponto {index + 1}</span>
                <label>X (m)<input value={vertex.x} inputMode="decimal" onChange={(event) => setAreaDraft((draft) => draft.map((item) => item.id === vertex.id ? { ...item, x: event.target.value } : item))} /></label>
                <label>Z (m)<input value={vertex.z} inputMode="decimal" onChange={(event) => setAreaDraft((draft) => draft.map((item) => item.id === vertex.id ? { ...item, z: event.target.value } : item))} /></label>
                <button className="queue-icon-button" type="button" aria-label={`Remover ponto ${index + 1}`} onClick={() => setAreaDraft((draft) => draft.filter((item) => item.id !== vertex.id))}>Remover ponto</button>
              </div>)}
              <form className="queue-coordinate-form" onSubmit={(event) => addAreaVertex(event, "selected")}>
                <label>Novo X (m)<input value={areaVertexX} onChange={(event) => setAreaVertexX(event.target.value)} inputMode="decimal" /></label>
                <label>Novo Z (m)<input value={areaVertexZ} onChange={(event) => setAreaVertexZ(event.target.value)} inputMode="decimal" /></label>
                <button className="button-secondary" type="submit">Incluir ponto</button>
              </form>
              <div className="queue-inline-actions"><button className="button-secondary" type="button" onClick={saveAreaDraft}>Aplicar forma</button>
                <button className="queue-danger-button" type="button" onClick={() => { if (run({ type: "area:remove", id: selectedArea.id }, "Área removida.")) setSelection(null); }}>Remover área</button></div>
            </div>}
          </div>
          <div className="area-stage-preview"><ScenePreview scene={scene} view="top" selection={selection} onSelectEntity={handleSelect} onMoveEntity={handleMove} /></div>
          {error && <p className="queue-error" role="alert">{error}</p>}
          {message && <p className="queue-message" role="status">{message}</p>}
          <div className="stage-footer area-stage-footer">
            {onBack ? <button className="button-quiet" type="button" onClick={onBack}>Voltar à planta</button> : <span />}
            <div><button className="button-primary" type="button" disabled={environmentChanged} onClick={() => { setStage("queue"); setError(""); }}>
              {scene.restrictedAreas.length ? "Continuar com áreas" : "Continuar sem áreas"}
            </button></div>
          </div>
        </div>
      ) : (
        <>
          <div className="queue-history-bar">
            <div><button className="button-secondary" type="button" onClick={undo} disabled={!history.past.length}>Desfazer</button>
              <button className="button-secondary" type="button" onClick={redo} disabled={!history.future.length}>Refazer</button>
              <span>{history.past.length} de até 100 alterações</span></div>
            <button className="button-quiet" type="button" onClick={() => setStage("areas")}>Editar áreas restritas</button>
          </div>

          <div className="queue-tools" role="toolbar" aria-label="Ferramentas da fila">
            <button type="button" className={tool === "post" ? "queue-tool active" : "queue-tool"} onClick={() => setTool("post")}>Poste</button>
            <button type="button" className={tool === "belt" ? "queue-tool active" : "queue-tool"} onClick={() => setTool("belt")}>Fita</button>
            <button type="button" className={tool === "people" ? "queue-tool active" : "queue-tool"} onClick={() => setTool("people")}>Pessoas</button>
          </div>

          <div className="queue-editor-grid">
            <div className="queue-canvas-column">
              <div className="viewer-toolbar"><div className="queue-instruction">{tool === "post" ? "Toque no piso para adicionar poste ou informe as posições ao lado." : tool === "belt" ? "Escolha dois postes para conectar com uma fita." : "Toque no piso para traçar o percurso ou informe pontos ao lado."}</div></div>
              <ScenePreview scene={scene} view={view} selection={selection} onSelectEntity={handleSelect} onMoveEntity={handleMove} onFloorPoint={handleFloorPoint} />
              <div className="queue-stats" aria-live="polite">
                <div><span>Comprimento do percurso</span><strong>{formatMeters(stats.routeLengthMeters)} m</strong></div>
                <div><span>Pessoas no percurso</span><strong>{stats.peopleCount}</strong></div>
                <div><span>Capacidade estimada</span><strong>{stats.capacity}</strong></div>
                <label>Espaçamento<select value={scene.simulation.spacingMeters} onChange={(event) => changeSpacing(event.target.value)}>
                  <option value="0.5">0,5 m</option><option value="0.8">0,8 m</option><option value="1">1 m</option>
                </select></label>
              </div>
            </div>

            <aside className="queue-controls">
              {tool === "post" && <section className="queue-control-panel">
                <div className="queue-panel-heading"><span>01</span><h2>Postes</h2></div>
                <p>Adicione pelo piso ou defina uma posição em metros.</p>
                {postCoordinateForm}
                {selectedPost && <p className="measurement-note">Selecionado: X {formatMeters(selectedPost.position.x)} m · Z {formatMeters(selectedPost.position.z)} m. Também é possível arrastar na planta.</p>}
                <ul className="queue-entity-list">{scene.posts.map((post) => <li key={post.id}>
                  <button type="button" className={selection?.kind === "post" && selection.id === post.id ? "queue-entity selected" : "queue-entity"} onClick={() => { setSelection({ kind: "post", id: post.id }); setPostX(String(post.position.x)); setPostZ(String(post.position.z)); }}>
                    <span>Poste {formatMeters(post.position.x)}, {formatMeters(post.position.z)} m</span><small>base {formatMeters(post.baseRadiusMeters)} m</small>
                  </button>
                </li>)}</ul>
                <button className="queue-danger-button" type="button" onClick={removeSelected} disabled={selection?.kind !== "post"}>Remover poste selecionado</button>
              </section>}

              {tool === "belt" && <section className="queue-control-panel">
                <div className="queue-panel-heading"><span>02</span><h2>Fitas</h2></div>
                <p>Selecione dois postes distintos. A fita é uma barreira, não um percurso.</p>
                <div className="queue-coordinate-form">
                  <label>Primeiro poste<select value={fromPost} onChange={(event) => setFromPost(event.target.value)}><option value="">Escolher</option>{scene.posts.map((post) => <option key={post.id} value={post.id}>Poste {formatMeters(post.position.x)}, {formatMeters(post.position.z)} m</option>)}</select></label>
                  <label>Segundo poste<select value={toPost} onChange={(event) => setToPost(event.target.value)}><option value="">Escolher</option>{scene.posts.filter((post) => post.id !== fromPost).map((post) => <option key={post.id} value={post.id}>Poste {formatMeters(post.position.x)}, {formatMeters(post.position.z)} m</option>)}</select></label>
                </div>
                <button className="button-secondary" type="button" onClick={addBelt} disabled={scene.posts.length < 2}>Conectar com fita</button>
                <ul className="queue-entity-list">{scene.belts.map((belt) => <li key={belt.id}>
                  <button type="button" className={selection?.kind === "belt" && selection.id === belt.id ? "queue-entity selected" : "queue-entity"} onClick={() => setSelection({ kind: "belt", id: belt.id })}>
                    <span>{postLabel(scene.posts, belt.fromPostId)} ↔ {postLabel(scene.posts, belt.toPostId)}</span><small>Fita {formatMeters(belt.heightMeters)} m</small>
                  </button>
                </li>)}</ul>
                <button className="queue-danger-button" type="button" onClick={removeSelected} disabled={selection?.kind !== "belt"}>Remover fita selecionada</button>
              </section>}

              {tool === "people" && <section className="queue-control-panel">
                <div className="queue-panel-heading"><span>03</span><h2>Percurso e pessoas</h2></div>
                <p>Desenhe pontos no piso ou informe as posições. Confirme para criar o percurso.</p>
                <form className="queue-coordinate-form" onSubmit={addRoutePointByCoordinates}>
                  <label>Posição X (m)<input value={routeX} onChange={(event) => setRouteX(event.target.value)} inputMode="decimal" /></label>
                  <label>Posição Z (m)<input value={routeZ} onChange={(event) => setRouteZ(event.target.value)} inputMode="decimal" /></label>
                  <button className="button-secondary" type="submit">Incluir ponto</button>
                </form>
                {routeDraft.length > 0 && <div className="queue-draft-summary">{routeDraft.length} pontos no percurso ainda não confirmado.
                  <button className="queue-danger-button" type="button" onClick={() => setRouteDraft([])}>Limpar rascunho</button></div>}
                <button className="button-secondary" type="button" onClick={confirmRoute} disabled={routeDraft.length < 2}>Confirmar percurso</button>
                {queueRoute && <div className="people-actions">
                  <p>Percurso ativo: {queueRoute.points.length} pontos · {formatMeters(stats.routeLengthMeters)} m</p>
                  <div className="queue-inline-actions">
                    <button className="button-secondary" type="button" onClick={() => run({ type: "people:add", routeId: queueRoute.id, id: newId("person") }, "Uma pessoa adicionada.")}>Adicionar 1 pessoa</button>
                    <button className="button-secondary" type="button" onClick={() => run({ type: "people:add", routeId: queueRoute.id, id: newId("person") }, "Mais uma pessoa adicionada.")}>Adicionar mais 1</button>
                    <button className="button-secondary" type="button" onClick={() => run({ type: "people:fill", routeId: queueRoute.id, idPrefix: newId("person") }, "O percurso foi preenchido até sua capacidade válida.")}>Preencher percurso</button>
                  </div>
                  <p>{peopleOnRoute.length} pessoa(s) posicionada(s) · capacidade para {stats.capacity}.</p>
                </div>}
                <ul className="queue-entity-list">{scene.routes.map((route) => <li key={route.id}>
                  <button type="button" className={selection?.kind === "route" && selection.id === route.id ? "queue-entity selected" : "queue-entity"} onClick={() => setSelection({ kind: "route", id: route.id })}>
                    <span>Percurso</span><small>{route.points.length} pontos</small>
                  </button>
                </li>)}{scene.people.map((person, index) => <li key={person.id}>
                  <button type="button" className={selection?.kind === "person" && selection.id === person.id ? "queue-entity selected" : "queue-entity"} onClick={() => setSelection({ kind: "person", id: person.id })}>
                    <span>Pessoa {index + 1}</span><small>{formatMeters(person.distanceAlongRouteMeters)} m do início</small>
                  </button>
                </li>)}</ul>
                <button className="queue-danger-button" type="button" onClick={removeSelected} disabled={selection?.kind !== "person" && selection?.kind !== "route"}>Remover pessoa ou percurso selecionado</button>
              </section>}
            </aside>
          </div>

          <div className="queue-validation-row">
            <span className={validation.valid ? "queue-valid" : "queue-invalid"}>{validation.valid ? "Fila válida" : "Revise a fila"}</span>
            {!validation.valid && <ul>{queueErrorsForUser(validation.errors, "Confira os itens da fila antes de continuar.").map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>}
            {error && <p className="queue-error" role="alert">{error}</p>}
            {message && <p className="queue-message" role="status">{message}</p>}
          </div>

          <div className="stage-footer queue-footer">
            <div>{onBack && <button className="button-quiet" type="button" onClick={onBack}>Voltar à revisão</button>}
              <button className="button-quiet" type="button" onClick={() => setStage("areas")}>Áreas restritas</button></div>
            <button className="button-primary" type="button" onClick={() => void saveOrContinue()} disabled={saving || !validation.valid || environmentChanged}>
              {saving ? "Salvando…" : mode === "edit" ? "Salvar alterações" : "Continuar para nomear"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function postLabel(posts: Stanchion[], id: string): string {
  const post = posts.find((item) => item.id === id);
  return post ? `Poste ${formatMeters(post.position.x)}, ${formatMeters(post.position.z)} m` : "Poste indisponível";
}

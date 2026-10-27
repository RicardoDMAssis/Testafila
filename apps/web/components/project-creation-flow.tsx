"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ProjectScene, SaveProjectInput, Vertex } from "../../../contracts/project.ts";
import { apiFetch, readApiError } from "../lib/http";
import {
  appendManualVertex,
  confirmManualEnvironment,
  createEmptyProjectScene,
  createManualRectangle,
  getEnvironmentArea,
  getEnvironmentPerimeterLength,
  moveManualVertex,
  removeManualVertex,
  updateManualWallHeight,
  validateManualEnvironment,
} from "../lib/project-scene";
import { ScenePreview } from "./scene-preview";
import { QueueEditor, sameEnvironmentGeometry } from "./queue-editor";
import type { SessionResponse } from "../lib/contracts";

type EntryMode = "rectangle" | "vertices";
type Stage = "measure" | "review" | "queue" | "name";
type VertexDraft = { x: string; z: string };

function parseMeters(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value.trim().replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatMeters(value: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value);
}

export function ProjectCreationFlow() {
  const router = useRouter();
  const [scene, setScene] = useState<ProjectScene>(createEmptyProjectScene);
  const [mode, setMode] = useState<EntryMode>("rectangle");
  const [stage, setStage] = useState<Stage>("measure");
  const [queueEditorMounted, setQueueEditorMounted] = useState(false);
  const [queueEnvironmentNotice, setQueueEnvironmentNotice] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionEmail, setSessionEmail] = useState("");
  const [initialError, setInitialError] = useState("");
  const [widthInput, setWidthInput] = useState("");
  const [depthInput, setDepthInput] = useState("");
  const [rectangleInputsDirty, setRectangleInputsDirty] = useState(false);
  const [wallHeightInput, setWallHeightInput] = useState("");
  const [xInput, setXInput] = useState("");
  const [zInput, setZInput] = useState("");
  const [vertexDrafts, setVertexDrafts] = useState<Record<string, VertexDraft>>({});
  const [projectName, setProjectName] = useState("");
  const [geometryError, setGeometryError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [saving, setSaving] = useState(false);
  const [reauthing, setReauthing] = useState(false);
  const [view, setView] = useState<"top" | "perspective">("top");
  const latestScene = useRef(scene);
  const latestProjectName = useRef(projectName);
  latestScene.current = scene;
  latestProjectName.current = projectName;

  useEffect(() => {
    let active = true;
    apiFetch("/api/auth/get-session")
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/");
          return;
        }
        if (!response.ok) throw new Error(await readApiError(response, "Não foi possível verificar sua sessão."));
        const session = (await response.json()) as SessionResponse;
        if (!session?.user) {
          router.replace("/");
          return;
        }
        if (active) setSessionEmail(session.user.email);
      })
      .catch((cause) => {
        if (active) setInitialError(cause instanceof Error ? cause.message : "Não foi possível verificar sua sessão.");
      })
      .finally(() => {
        if (active) setSessionReady(true);
      });
    return () => { active = false; };
  }, [router]);

  const validation = useMemo(() => scene.environment.perimeter.length >= 3
    ? validateManualEnvironment(scene.environment)
    : null, [scene.environment]);
  const environmentIsValid = validation?.valid === true;
  const canChooseMode = scene.environment.perimeter.length === 0 && stage === "measure";

  const updateEnvironment = useCallback((update: (environment: ProjectScene["environment"]) => ProjectScene["environment"]) => {
    setScene((current) => ({ ...current, environment: update(current.environment) }));
  }, []);

  const handleQueueSceneChange = useCallback((nextScene: ProjectScene) => {
    setScene((current) => {
      if (current === nextScene) return current;
      return sameEnvironmentGeometry(current.environment, nextScene.environment)
        ? { ...nextScene, environment: current.environment }
        : nextScene;
    });
  }, []);
  const handleQueueEnvironmentChangePending = useCallback((pending: boolean) => {
    setQueueEnvironmentNotice(pending);
  }, []);

  function selectMode(nextMode: EntryMode) {
    if (!canChooseMode) return;
    setMode(nextMode);
    setGeometryError("");
  }

  function applyRectangle() {
    const widthMeters = parseMeters(widthInput);
    const depthMeters = parseMeters(depthInput);
    const wallHeightMeters = parseMeters(wallHeightInput);
    if (widthMeters === null || depthMeters === null || wallHeightMeters === null) {
      setGeometryError("Informe largura, profundidade e altura medidas, em metros.");
      return;
    }
    try {
      const environment = createManualRectangle(widthMeters, depthMeters, wallHeightMeters);
      setScene((current) => ({ ...current, environment }));
      setVertexDrafts({});
      setRectangleInputsDirty(false);
      setGeometryError("");
    } catch (cause) {
      setGeometryError(cause instanceof Error ? cause.message : "Confira as medidas informadas.");
    }
  }

  function addVertex(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const x = parseMeters(xInput);
    const z = parseMeters(zInput);
    const height = parseMeters(wallHeightInput);
    if (x === null || z === null) {
      setGeometryError("Informe coordenadas X e Z finitas, em metros.");
      return;
    }
    if (height === null) {
      setGeometryError("Informe também a altura medida das paredes, em metros.");
      return;
    }
    const vertex: Vertex = { id: crypto.randomUUID(), x, z };
    setScene((current) => {
      const environment = updateManualWallHeight(current.environment, height);
      return { ...current, environment: appendManualVertex(environment, vertex) };
    });
    setXInput("");
    setZInput("");
    setGeometryError("");
  }

  function commitVertex(vertex: Vertex) {
    const draft = vertexDrafts[vertex.id] ?? { x: String(vertex.x), z: String(vertex.z) };
    const x = parseMeters(draft.x);
    const z = parseMeters(draft.z);
    if (x === null || z === null) {
      setGeometryError("As coordenadas devem ser números finitos em metros.");
      return;
    }
    updateEnvironment((environment) => moveManualVertex(environment, vertex.id, { x, z }));
    setVertexDrafts((current) => ({ ...current, [vertex.id]: { x: String(x), z: String(z) } }));
    setGeometryError("");
  }

  function removeVertex(vertexId: string) {
    updateEnvironment((environment) => removeManualVertex(environment, vertexId));
    setVertexDrafts((current) => {
      const next = { ...current };
      delete next[vertexId];
      return next;
    });
    setGeometryError("");
  }

  function renderVertexAddForm() {
    return <form className="vertex-add-form" onSubmit={addVertex}>
      <label>X (metros)<input type="text" inputMode="decimal" value={xInput} onChange={(event) => setXInput(event.target.value)} /></label>
      <label>Z (metros)<input type="text" inputMode="decimal" value={zInput} onChange={(event) => setZInput(event.target.value)} /></label>
      <button className="button-secondary" type="submit">Adicionar vértice</button>
    </form>;
  }

  function renderVertexTable() {
    if (!vertices.length) return null;
    return <ol className="vertex-list" aria-label="Coordenadas dos vértices">
      {vertices.map((vertex, index) => {
        const draft = vertexDrafts[vertex.id] ?? { x: String(vertex.x), z: String(vertex.z) };
        return <li className="vertex-row" key={vertex.id}>
          <span className="vertex-number">{String(index + 1).padStart(2, "0")}</span>
          <label>X<input type="text" inputMode="decimal" value={draft.x} onChange={(event) => setVertexDrafts((current) => ({ ...current, [vertex.id]: { ...draft, x: event.target.value } }))} /></label>
          <label>Z<input type="text" inputMode="decimal" value={draft.z} onChange={(event) => setVertexDrafts((current) => ({ ...current, [vertex.id]: { ...draft, z: event.target.value } }))} /></label>
          <button type="button" className="vertex-save" onClick={() => commitVertex(vertex)} aria-label={`Aplicar coordenada do vértice ${index + 1}`}>Aplicar</button>
          <button type="button" className="vertex-remove" onClick={() => removeVertex(vertex.id)} aria-label={`Remover vértice ${index + 1}`}>Remover</button>
        </li>;
      })}
    </ol>;
  }

  function continueToReview() {
    setGeometryError("");
    if (mode === "rectangle" && rectangleInputsDirty) {
      setGeometryError("Aplique as medidas retangulares alteradas antes de revisar.");
      return;
    }
    if (mode === "vertices" && (xInput.trim() || zInput.trim())) {
      setGeometryError("Adicione as coordenadas preenchidas antes de revisar.");
      return;
    }
    const hasUnappliedVertexDraft = vertices.some((vertex) => {
      const draft = vertexDrafts[vertex.id];
      return draft && (parseMeters(draft.x) !== vertex.x || parseMeters(draft.z) !== vertex.z);
    });
    if (hasUnappliedVertexDraft) {
      setGeometryError("Aplique as coordenadas alteradas antes de revisar.");
      return;
    }
    const wallHeightMeters = parseMeters(wallHeightInput);
    if (wallHeightMeters === null) {
      setGeometryError("Informe a altura medida das paredes, em metros.");
      return;
    }
    if (scene.environment.perimeter.length < 3) {
      setGeometryError("Adicione pelo menos três vértices para fechar o ambiente.");
      return;
    }
    const withHeight = updateManualWallHeight(scene.environment, wallHeightMeters);
    const result = validateManualEnvironment(withHeight);
    if (!result.valid) {
      setGeometryError(result.errors.join(" "));
      return;
    }
    const confirmed = confirmManualEnvironment(withHeight);
    setScene((current) => ({ ...current, environment: confirmed }));
    setStage("review");
  }

  const saveProject = useCallback(async (sceneToSave: ProjectScene = scene, projectNameToSave: string = projectName) => {
    if (!sceneToSave.environment.confirmedAt) {
      setSaveError("Revise e confirme um ambiente válido antes de salvar.");
      setStage("measure");
      return;
    }
    if (!projectNameToSave.trim()) {
      setSaveError("Informe um nome para esta fila.");
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      const input: SaveProjectInput = {
        name: projectNameToSave.trim(),
        scene: sceneToSave,
        expectedRevision: null,
      };
      const response = await apiFetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (response.status === 401) {
        setAuthRequired(true);
        setSaveError("Sua sessão expirou. Entre novamente para salvar; as medidas continuam nesta tela.");
        return;
      }
      if (response.status === 400) {
        setSaveError(await readApiError(response, "O servidor não aceitou os dados. Revise o ambiente e tente novamente."));
        return;
      }
      if (response.status === 409) {
        setSaveError("O servidor sinalizou um conflito. Nada foi sobrescrito; suas edições continuam nesta tela.");
        return;
      }
      if (response.status === 413) {
        setSaveError("Esta fila excede o tamanho aceito para salvar. Suas edições continuam nesta tela; reduza os itens e tente novamente.");
        return;
      }
      if (!response.ok) {
        setSaveError(await readApiError(response, "Não foi possível salvar agora. Suas edições continuam nesta tela."));
        return;
      }
      const saved = (await response.json()) as { id?: string };
      if (!saved.id) {
        setSaveError("O servidor confirmou a gravação, mas não retornou o identificador do projeto.");
        return;
      }
      router.push(`/projects/${encodeURIComponent(saved.id)}`);
    } catch {
      setSaveError("Não foi possível conectar ao serviço. Suas edições continuam nesta tela.");
    } finally {
      setSaving(false);
    }
  }, [projectName, router, scene]);

  async function reauthenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReauthing(true);
    setAuthError("");
    try {
      const response = await apiFetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sessionEmail, password: reauthPassword }),
      });
      if (!response.ok) {
        setAuthError(await readApiError(response, "Não foi possível renovar a sessão. Confira seus dados."));
        return;
      }
      setAuthRequired(false);
      setReauthPassword("");
      await saveProject(latestScene.current, latestProjectName.current);
    } catch {
      setAuthError("Não foi possível conectar ao serviço. As medidas permanecem nesta tela.");
    } finally {
      setReauthing(false);
    }
  }

  if (!sessionReady) {
    return <main className="project-shell"><div className="flow-loading" role="status">Verificando sessão…</div></main>;
  }
  if (initialError) {
    return <main className="project-shell"><div className="flow-error" role="alert">{initialError}
      <button className="button-secondary" type="button" onClick={() => window.location.reload()}>Tentar novamente</button>
    </div></main>;
  }

  const vertices = scene.environment.perimeter;
  return (
    <main className="project-shell">
      <header className="project-header">
        <Link className="wordmark dashboard-wordmark" href="/dashboard" aria-label="TestaFila, voltar aos projetos">
          <span>testa<span className="wordmark-light">fila</span></span>
        </Link>
        <span className="project-header-label">NOVA FILA <span>·</span> PLANTA MANUAL</span>
        <Link className="button-quiet" href="/dashboard">Sair para projetos</Link>
      </header>

      <div className="project-flow-content">
        <nav className="flow-steps" aria-label="Etapas de criação">
          <span className={stage === "measure" ? "flow-step active" : "flow-step"}><b>01</b> MEDIDAS</span>
          <span className={stage === "review" ? "flow-step active" : "flow-step"}><b>02</b> REVISÃO 3D</span>
          <span className={stage === "queue" ? "flow-step active" : "flow-step"}><b>03</b> FILA</span>
          <span className={stage === "name" ? "flow-step active" : "flow-step"}><b>04</b> SALVAR</span>
        </nav>

        {stage === "measure" && (
          <section className="builder-stage" aria-labelledby="measure-title">
            <div className="stage-intro">
              <p className="stage-kicker">01 · LEVANTAMENTO MANUAL</p>
              <h1 id="measure-title">Comece pelas medidas <em>reais.</em></h1>
              <p>Use uma trena para informar as dimensões. A câmera não é usada como instrumento de medição.</p>
            </div>
            {queueEnvironmentNotice && <p className="queue-message" role="status">As medidas mudaram. Ao voltar à montagem, você poderá restaurar as antigas ou descartar a fila anterior para usar as novas.</p>}

            <div className="entry-switch" role="group" aria-label="Método de desenho">
              <button type="button" className={mode === "rectangle" ? "entry-option selected" : "entry-option"}
                onClick={() => selectMode("rectangle")} disabled={!canChooseMode && mode !== "rectangle"}>Retângulo por medidas</button>
              <button type="button" className={mode === "vertices" ? "entry-option selected" : "entry-option"}
                onClick={() => selectMode("vertices")} disabled={!canChooseMode && mode !== "vertices"}>Polígono por coordenadas</button>
            </div>

            <div className="builder-grid">
              <div className="builder-controls">
                {mode === "rectangle" ? (
                  <section className="measure-panel" aria-labelledby="rectangle-title">
                    <div className="measure-panel-head"><span>FORMA 01</span><h2 id="rectangle-title">Planta retangular</h2></div>
                    <p>Informe largura e profundidade medidas no local.</p>
                    <div className="measure-fields">
                      <label>Largura<input type="text" inputMode="decimal" value={widthInput} onChange={(event) => { setWidthInput(event.target.value); setRectangleInputsDirty(true); }} aria-label="Largura medida em metros" /><span>m</span></label>
                      <label>Profundidade<input type="text" inputMode="decimal" value={depthInput} onChange={(event) => { setDepthInput(event.target.value); setRectangleInputsDirty(true); }} aria-label="Profundidade medida em metros" /><span>m</span></label>
                    </div>
                    <div className="measure-fields single-field">
                      <label>Altura medida das paredes<input type="text" inputMode="decimal" value={wallHeightInput} onChange={(event) => { setWallHeightInput(event.target.value); if (mode === "rectangle") setRectangleInputsDirty(true); }} aria-label="Altura medida das paredes em metros" /><span>m</span></label>
                    </div>
                    <button className="button-secondary" type="button" onClick={applyRectangle}>Aplicar medidas</button>
                    {vertices.length > 0 && <>
                      <p className="measurement-note">Dimensões inseridas manualmente. Nenhuma comparação de erro foi registrada.</p>
                      <details className="vertex-editor-disclosure">
                        <summary>Ajustar vértices da planta</summary>
                        <p>X e Z identificam as duas direções do piso. Informe cada posição em metros.</p>
                        {renderVertexAddForm()}
                        {renderVertexTable()}
                      </details>
                    </>}
                  </section>
                ) : (
                  <section className="measure-panel" aria-labelledby="polygon-title">
                    <div className="measure-panel-head"><span>FORMA 02</span><h2 id="polygon-title">Vértices do perímetro</h2></div>
                    <p>Insira os pontos na ordem ao redor do ambiente. O último vértice fecha no primeiro.</p>
                    <div className="measure-fields single-field">
                      <label>Altura medida das paredes<input type="text" inputMode="decimal" value={wallHeightInput} onChange={(event) => setWallHeightInput(event.target.value)} aria-label="Altura medida das paredes em metros" /><span>m</span></label>
                    </div>
                    {renderVertexAddForm()}
                    {renderVertexTable()}
                    <p className="measurement-note">X e Z indicam duas direções do piso. Informe as posições em metros e não repita o primeiro ponto no final.</p>
                  </section>
                )}

                {geometryError && <p className="geometry-error" role="alert">{geometryError}</p>}
                {validation && !validation.valid && <div className="validation-list" role="status">
                  <p>Confira a geometria antes de avançar:</p><ul>{validation.errors.map((message, index) => <li key={`${index}-${message}`}>{message}</li>)}</ul>
                </div>}
                {vertices.length > 0 && (!validation || validation.valid) && <p className="geometry-hint" role="status">{vertices.length} vértices inseridos. Medidas informadas por você.</p>}
              </div>

              <aside className="builder-aside">
                <p className="reference-kicker">SISTEMA DE REFERÊNCIA</p>
                <div className="axis-diagram" aria-hidden="true"><span className="axis-x">X</span><span className="axis-z">Z</span><i /></div>
                <h2>Uma unidade equivale a um metro.</h2>
                <p>X e Z identificam as duas direções do piso. Informe distâncias medidas no local ou lidas na planta, sempre em metros.</p>
                {environmentIsValid && <dl className="environment-summary">
                  <div><dt>ÁREA</dt><dd>{formatMeters(getEnvironmentArea(scene.environment))} m²</dd></div>
                  <div><dt>PERÍMETRO</dt><dd>{formatMeters(getEnvironmentPerimeterLength(scene.environment))} m</dd></div>
                  <div><dt>PAREDES</dt><dd>{formatMeters(scene.environment.wallHeightMeters)} m</dd></div>
                </dl>}
                <p className="measurement-note">Conferências de medida: {scene.environment.measurement.checks.length}. Sem comparar com uma segunda medida, não há erro calculado.</p>
              </aside>
            </div>

            <div className="stage-footer">
              <Link className="button-quiet" href="/dashboard">Cancelar</Link>
              <button className="button-primary" type="button" onClick={continueToReview}>Revisar planta em 3D <span aria-hidden="true">↗</span></button>
            </div>
          </section>
        )}

        {stage === "review" && (
          <section className="review-stage" aria-labelledby="review-title">
            <div className="stage-intro review-intro">
              <p className="stage-kicker">02 · REVISÃO DO AMBIENTE</p>
              <h1 id="review-title">Confira o perímetro <em>antes de salvar.</em></h1>
              <p>Visualização em escala métrica baseada nas medidas informadas. Ela não é uma medição por câmera.</p>
            </div>
            {queueEnvironmentNotice && <p className="queue-message" role="status">As medidas mudaram. Ao voltar à montagem, você poderá restaurar as antigas ou descartar a fila anterior para usar as novas.</p>}
            <div className="viewer-toolbar">
              <div><span className="validation-mark" aria-hidden="true" /><span>Geometria válida · origem manual</span></div>
              <div className="view-switch" role="group" aria-label="Ângulo da visualização">
                <button type="button" className={view === "top" ? "selected" : ""} onClick={() => setView("top")}>Planta</button>
                <button type="button" className={view === "perspective" ? "selected" : ""} onClick={() => setView("perspective")}>Perspectiva</button>
              </div>
            </div>
            <ScenePreview scene={scene} view={view} />
            <div className="review-summary">
              <span>{vertices.length} vértices</span><span>{formatMeters(getEnvironmentArea(scene.environment))} m²</span>
              <span>Paredes {formatMeters(scene.environment.wallHeightMeters)} m</span>
              <span>Conferências de medida: {scene.environment.measurement.checks.length}</span>
            </div>
            <div className="stage-footer">
              <button className="button-quiet" type="button" onClick={() => setStage("measure")}>Voltar e ajustar</button>
              <button className="button-primary" type="button" onClick={() => { setQueueEditorMounted(true); setStage("queue"); }}>Montar fila <span aria-hidden="true">↗</span></button>
            </div>
          </section>
        )}

        {queueEditorMounted && <div hidden={stage !== "queue"}><QueueEditor
          initialScene={scene}
          mode="create"
          onSceneChange={handleQueueSceneChange}
          onEnvironmentChangePending={handleQueueEnvironmentChangePending}
          onBack={() => setStage("review")}
          onContinue={(nextScene) => {
            setScene((current) => sameEnvironmentGeometry(current.environment, nextScene.environment)
              ? { ...nextScene, environment: current.environment }
              : nextScene);
            setStage("name");
          }}
        /></div>}

        {stage === "name" && (
          <section className="save-stage" aria-labelledby="save-title">
            <div className="stage-intro">
              <p className="stage-kicker">03 · SALVAR NO ESPAÇO DE TRABALHO</p>
              <h1 id="save-title">Dê um nome <em>à planta.</em></h1>
              <p>O projeto será salvo na sua conta e poderá ser aberto pela galeria.</p>
            </div>
            <div className="save-card">
              <label htmlFor="project-name">Nome do projeto</label>
              <input id="project-name" name="projectName" type="text" autoComplete="off" maxLength={100} value={projectName}
                onChange={(event) => { setProjectName(event.target.value); setSaveError(""); }} placeholder="Ex.: Salão principal" />
              <div className="save-facts"><span>PLANTA MANUAL</span><span>{vertices.length} VÉRTICES</span><span>{formatMeters(getEnvironmentArea(scene.environment))} m²</span></div>
              {saveError && <p className="save-error" role="alert">{saveError}</p>}
              <button className="button-primary save-button" type="button" onClick={() => void saveProject()} disabled={saving || !projectName.trim()}>
                {saving ? "Salvando…" : "Salvar projeto"}
              </button>
              {authRequired && <form className="reauth-panel" onSubmit={reauthenticate}>
                <p className="eyebrow">SESSÃO EXPIRADA</p>
                <p>Entre novamente para salvar. As medidas e o nome permanecem nesta tela.</p>
                <label htmlFor="reauth-email">E-mail</label>
                <input id="reauth-email" type="email" autoComplete="username" value={sessionEmail} onChange={(event) => setSessionEmail(event.target.value)} required />
                <label htmlFor="reauth-password">Senha</label>
                <input id="reauth-password" type="password" autoComplete="current-password" value={reauthPassword} onChange={(event) => setReauthPassword(event.target.value)} required />
                {authError && <p className="save-error" role="alert">{authError}</p>}
                <button className="button-secondary" type="submit" disabled={reauthing || saving}>{reauthing ? "Verificando…" : "Entrar e salvar"}</button>
              </form>}
            </div>
            <div className="save-preview"><ScenePreview scene={scene} view="top" /></div>
            <div className="stage-footer">
              <button className="button-quiet" type="button" onClick={() => setStage(queueEditorMounted ? "queue" : "review")}>{queueEditorMounted ? "Voltar à fila" : "Voltar à revisão"}</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

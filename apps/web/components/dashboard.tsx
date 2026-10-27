"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, readApiError } from "../lib/http";
import type { ProjectSummary, ProjectsResponse, SessionResponse } from "../lib/contracts";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data indisponível";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase("pt-BR")).join("") || "?";
}

export function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const sessionResponse = await apiFetch("/api/auth/get-session");
      if (sessionResponse.status === 401) {
        router.replace("/");
        return;
      }
      if (!sessionResponse.ok) throw new Error(await readApiError(sessionResponse, "Não foi possível verificar sua sessão."));
      const session = (await sessionResponse.json()) as SessionResponse;
      if (!session?.user) {
        router.replace("/");
        return;
      }
      setUserName(session.user.name);

      const response = await apiFetch("/api/projects");
      if (response.status === 401) {
        router.replace("/");
        return;
      }
      if (!response.ok) throw new Error(await readApiError(response, "Não foi possível carregar os projetos."));
      const payload = (await response.json()) as ProjectsResponse;
      if (!Array.isArray(payload.projects)) throw new Error("A resposta de projetos está em formato inesperado.");
      setProjects(payload.projects);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha ao carregar os projetos.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { void loadProjects(); }, [loadProjects]);

  async function signOut() {
    setSigningOut(true);
    setError("");
    try {
      const response = await apiFetch("/api/auth/sign-out", { method: "POST" });
      if (!response.ok) throw new Error(await readApiError(response, "Não foi possível encerrar a sessão."));
      router.replace("/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível encerrar a sessão.");
      setSigningOut(false);
    }
  }

  return (
    <>
    <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
    <main className="dashboard-page" id="main-content">
      <header className="dashboard-header">
        <a className="wordmark dashboard-wordmark" href="/" aria-label="TestaFila, início">
          <span>testa<span className="wordmark-light">fila</span></span>
        </a>
        <div className="header-context"><span className="context-line" /> MEUS PROJETOS</div>
        <div className="account-menu">
          <span className="account-avatar" aria-hidden="true">{initials(userName)}</span>
          <span className="account-name">{userName || "Conta"}</span>
          <button className="button-quiet" type="button" onClick={signOut} disabled={signingOut}>
            {signingOut ? "Saindo…" : "Sair"}
          </button>
        </div>
      </header>

      <section className="dashboard-main" aria-labelledby="dashboard-title">
        <div className="dashboard-heading">
          <div><p className="eyebrow">ESPAÇO DE TRABALHO</p>
            <h1 id="dashboard-title">Seus projetos<span className="heading-period">.</span></h1>
            <p className="dashboard-subtitle">Projetos salvos nesta conta.</p>
          </div>
          <div className="dashboard-actions">
            <span className="project-count">{loading ? "…" : String(projects.length).padStart(2, "0")} <span>PROJETOS</span></span>
            <Link className="button-primary create-project" href="/projects/new">Criar nova fila</Link>
          </div>
        </div>

        {error && <div className="notice-error" role="alert"><span>{error}</span>
          <button className="button-quiet" type="button" onClick={() => void loadProjects()}>Tentar novamente</button>
        </div>}

        {loading ? (
          <div className="project-grid" aria-label="Carregando projetos" aria-busy="true">
            {[0, 1, 2].map((item) => <div className="project-skeleton" key={item}><div className="skeleton-preview" /><div className="skeleton-line" /><div className="skeleton-line skeleton-short" /></div>)}
          </div>
        ) : !error && projects.length === 0 ? (
          <div className="empty-state"><div className="empty-drawing" aria-hidden="true"><span /><span /><span /><span /></div>
            <p className="eyebrow">AINDA SEM PROJETOS</p><h2>Seu espaço começa aqui.</h2>
            <p>Quando um projeto for salvo, ele aparecerá nesta galeria.</p>
          </div>
        ) : !error ? (
          <div className="project-grid" aria-label="Projetos salvos">
            {projects.map((project, index) => <article className="project-card" key={project.id} style={{ "--item-delay": `${index * 55}ms` } as React.CSSProperties}>
              <div className="project-preview" aria-label="Prévia indisponível">
                <span className="preview-label">PRÉVIA INDISPONÍVEL</span>
              </div>
              <div className="project-card-info"><div><h2>{project.name}</h2><p>Atualizado em {formatDate(project.updatedAt)}</p></div>
                <Link className="open-project" href={`/projects/${encodeURIComponent(project.id)}`} aria-label={`Abrir ${project.name}`}>↗</Link>
              </div>
              <p className="project-status"><span /> SALVO · REV. {project.revision}</p>
            </article>)}
          </div>
        ) : null}
        <div className="dashboard-bottom"><span>TESTAFILA · PROJETOS DA CONTA</span><span>UMA UNIDADE ESPACIAL = 1 METRO</span></div>
      </section>
    </main>
    </>
  );
}

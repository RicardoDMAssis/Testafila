# Skills pedidas pelo usuário

Estado atualizado em 22/10/2026: instalação global concluída pelo usuário.
Nova coordenação verificou os 292 SKILL.md do manifesto em ~/.agents/skills: nenhum
ausente. Cada agente deve ler as skills pertinentes pelo caminho absoluto.
Os procedimentos abaixo preservam o histórico da instalação e servem para manutenção.

O arquivo ../../instalar-skills-global.ps1 usa o helper oficial do Codex, descobre a
árvore via API GitHub e fixa cada SHA antes de instalar. Instala os packs de MengTo e
Owl-Listener, tastemaker e as três skills 3D explicitamente pedidas. Não segue os outros
repositórios indicados pelo marketplace de Owl-Listener, que não foram solicitados.
Não executa scripts dos repositórios. Preserva skills existentes; nomes conflitantes
ou skills solicitadas ausentes interrompem a instalação sem substituição silenciosa.

Em PowerShell fora da sessão restrita, na raiz do workspace:

```powershell
.\instalar-skills-global.ps1 -ListOnly
.\instalar-skills-global.ps1
```

Destino padrão: ~/.agents/skills (global compartilhado pelo usuário, já usado pelas
skills Maestri). Para Codex com destino específico, passar -Destination apontando
para ~/.codex/skills. Agys/outros CLIs precisam confirmar onde descobrem skills antes
de afirmar disponibilidade; instalação no diretório do Codex não garante uso por eles.

Instalação via CLI skills, se o usuário preferir o instalador que indicou:

```powershell
npx skills add https://github.com/openai/plugins --skill react-three-fiber-game --global
npx skills add https://github.com/emalorenzo/three-agent-skills --skill r3f-best-practices --global
npx skills add https://github.com/openai/plugins --skill web-3d-asset-pipeline --global
```

Confirmar flags com npx skills add --help na máquina com rede antes de usar esta
alternativa. Os comandos acima não foram executados nem verificados nesta sessão.

## Aplicação por tarefa

- Referência visual principal: ../../slide-cintia/DESIGN.md e styles.css.
- MengTo: editorial-tech e design-first-ui-prompting para hierarquia e consistência.
- tastemaker: referência e registro de decisões; não gerar outra paleta que substitua
  os tokens fornecidos pelo usuário.
- designer-skills: escolher módulos pertinentes de tokens, layout responsivo,
  interação, formulários e revisão. Não carregar o pack inteiro em cada tarefa.
- r3f-best-practices: renderização, estado, recursos compartilhados e custo mobile.
- react-three-fiber-game: padrões R3F aplicáveis; não adicionar mecânicas de jogo.
- web-3d-asset-pipeline: escala humana, origem, orientação, licenças e otimização dos assets.

Leituras web realizadas não equivalem a instalação. Editorial-tech e r3f-best-practices
foram consultadas; a estrutura dos outros repositórios deve ser verificada pelo instalador.

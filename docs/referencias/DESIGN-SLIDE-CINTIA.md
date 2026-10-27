# TestaFila: decisões de design e conteúdo

## Direção

Apresentação universitária com linguagem de produto. Uma ideia central por slide, parágrafos curtos e títulos que descrevem o argumento. Fundo marfim, verde fechado, regras finas e composição editorial. Títulos em sans-serif com trechos em Georgia itálica. Sem gradientes, neons, emojis decorativos, depoimentos ou resultados inventados.

Skill principal lida e aplicada: [editorial-tech, MengTo/Skills](https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/editorial-tech/SKILL.md). Apoio de [design-first-ui-prompting](https://github.com/MengTo/Skills/blob/main/agent-skills/ui/design-first-ui-prompting/SKILL.md) para hierarquia, restrições e consistência. As sugestões opcionais de brilho e gradiente foram descartadas por instrução do usuário.

Revisão de texto com [remove-ai-slop, davidamitchell/Skills](https://github.com/davidamitchell/Skills/blob/main/remove-ai-slop/SKILL.md): frases específicas, voz ativa, menos repetições e nenhum ganho apresentado como comprovado. Avaliação editorial interna: clareza 9/10, ritmo 8/10, respeito ao leitor 9/10, naturalidade 8/10, densidade 9/10. Isso é uma revisão qualitativa, não uma avaliação independente.

## Fontes do conteúdo

Os três PDFs fornecidos sustentam conceito, equipe, tecnologia, datas e critérios. O XRD e o One-Page Concept definem a meta de erro de 5%; o plano também menciona uma margem de 10% na matriz de risco. A apresentação adota o critério de aceitação de 5% como meta, sem afirmar precisão já alcançada. A menção a AR Foundation em uma linha do cronograma do plano foi alinhada à arquitetura WebXR descrita no restante dos documentos.

O suporte universal a Chrome/Safari da apresentação anterior foi corrigido. Referência: https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API . A compatibilidade precisa ser validada no aparelho e no navegador. O prazo final apresentado é 17/12/2026.

## Simulação

Cena ilustrativa em projeção axonométrica, com opção de planta. Malha de um metro, paredes, janelas, saída, sombras sólidas, postes e fitas. Sem dependências de rede. A apresentação usa Canvas 2D para desenhar a cena; Three.js e WebXR são tecnologias previstas para o produto acadêmico.

Hall de 10 × 8 m, três traçados, deslocamento lateral, espaçamento por pessoa e controle de ocupação. A distância usa a soma euclidiana dos segmentos, a capacidade usa arredondamento para baixo, e a interseção considera contato com o limite da área. A colisão verifica a linha central do percurso, sem simular largura corporal, evacuação ou tempo de atendimento. As pessoas ilustram ocupação estática.

## Skills globais

Documentação consultada pelo acesso web. A instalação global não foi executada: a sessão só permite escrita na pasta do projeto, e o acesso de rede do terminal está bloqueado. Não há skills do repositório instaladas local ou globalmente por este trabalho. O script `instalar-skills-global.ps1` usa o instalador oficial do Codex, descobre todas as skills do repositório e fixa a revisão consultada antes de instalar. Ele preserva diretórios já existentes. Execute-o fora da sessão restrita para concluir a instalação global na conta do Codex.

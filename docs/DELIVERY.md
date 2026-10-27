# Entrega e estado atual

Atualizado em 27/10/2026. Leitura principal: [passagem para o colega](PASSAGEM-COLEGA.md).
O histórico de decisões e bloqueios de 22/10 está em
[historico/COORDENACAO-2026-10-22.md](historico/COORDENACAO-2026-10-22.md).

## Entregue

- Fundação Next/TypeScript + Nest/SQLite, Better Auth e CLI administrativo.
- Login real, projetos do proprietário, salvar/abrir e conflitos de revisão.
- Planta manual retangular/poligonal em metros, revisão 3D e confirmação.
- Zonas, postes/fitas, percursos/pessoas, espaçamento e histórico de comandos.
- Seleção/arraste, cancelamento e retomada de sessão sem perder o último rascunho.
- Proxy, limite de tamanho e validação geométrica comum ao cliente e servidor.
- Documentação centralizada, PDFs de referência e relatórios de QA datados.

## Não entregue como produto

- Captura do ambiente pela câmera e editor sobre o chão real.
- Sessão XR integrada ao fluxo de projetos e realinhamento de cena salva.
- Precisão física garantida, aceite mobile físico, HTTPS/deploy final e testes SUS.
- Certificação normativa de acessibilidade/segurança ou capacidade otimizada global.

O spike experimental `/xr-check` prepara a validação de suporte e hit-test;
seu resultado em aparelho real ainda precisa ser coletado. Não deve ser marcado
como entrega completa de AR. Detalhes em [XR-PENDENCIAS.md](XR-PENDENCIAS.md).

## Evidências e critérios

- [QA de integração do Lote 3](QA-LOTE-03.md)
- [Correções e retestes do fechamento](QA-FECHAMENTO-LOTE-03.md)
- [Relatório desta passagem e verificações finais](PASSAGEM-COLEGA.md)
- [Matriz contra os PDFs e mudanças autorizadas](REQUISITOS-ESTADO-ATUAL.md)

Os SPRINT-01/02/03 e PRE-DEVELOPMENT registram a evolução histórica. Falhas de
instalação, quotas e ausência de ferramentas neles não representam o estado atual.
Marcar uma tarefa como concluída exige evidência correspondente ao ambiente:
teste unitário não comprova precisão de câmera nem compatibilidade de aparelhos.

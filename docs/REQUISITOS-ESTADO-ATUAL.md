# Requisitos dos PDFs e estado real

Atualização 28/10: a prioridade autorizada é concluir a interação 3D antes da
câmera. O fluxo público agora aceita só retângulo, sem coordenadas/altura; cantos
são ajustados no canvas. Pessoas livres, rotação e +1 não exigem percurso.
As zonas são desenhadas por arraste com confirmação; câmera tem comandos
explícitos. Isso não implementa medição pela câmera: a planta segue manual.
Ver [SPRINT-04.md](SPRINT-04.md) para as mudanças desta etapa.

Conferência direta dos três PDFs da raiz em 22/10/2026. O produto atual é um
editor manual/3D com backend Nest e SQLite. Não é o MVP WebAR completo dos PDFs.
Ainda há implementação autônoma de XR pendente; não falta apenas teste físico.

Atualização em 27/10/2026: há agora um spike experimental isolado `/xr-check`,
com suporte, sessão, hit-test e duas marcas transitórias. Seu build/testes locais
não comprovam funcionamento em aparelho. Continua sem mapeamento de planta,
persistência ou integração ao editor; detalhes em [XR-PENDENCIAS.md](XR-PENDENCIAS.md).

Fontes: [XRD](referencias/XR_Design_Document_TestaFila.pdf),
[conceito](referencias/One_Page_Concept_TestaFila_UnicaPagina.pdf) e
[plano](referencias/Plano_de_Projeto%20-%20TestaFila.pdf).

| Requisito | Estado e evidência/limite |
| --- | --- |
| Câmera, sessão WebXR e detecção do chão por hit-test | Não integrados na aplicação Next. O protótipo Vite preservado não conta como entrega integrada. |
| Retículo estável e toque para posicionar no chão real | Pendente. O clique no piso do editor é raycast de uma planta virtual, não medida pela câmera. |
| Áreas restritas e geometria XZ | Implementadas no modo manual/3D, com validação compartilhada pelo servidor. |
| Postes e fitas | Implementados no 3D, com conexões explícitas e remoção de dependências. |
| Metragem, pessoas e capacidade | Implementadas geometricamente no percurso, a partir de medidas manuais. Sem certificação de precisão de sensores ou otimização combinatória global. |
| Feedback de bloqueio | Edição inválida é rejeitada com mensagem. Ainda não há equivalência completa ao feedback contextual verde/vermelho e HUD sobre câmera descritos no XRD. |
| Desfazer/refazer e edição | Implementados; cancelamento e perda de captura foram corrigidos e retestados no portal. |
| Salvar, galeria, proprietário e conflito | Implementados por ampliação posterior do usuário; autenticação real, SQLite e revisão esperada. |
| Erro métrico máximo de 5% em 20 m | Não validado. Exige captura XR implementada e comparação física com trena. Não inferir precisão física de testes geométricos. |
| Colisão em menos de 200 ms | Correção funcional testada; falta medição de latência nos aparelhos-alvo. |
| HTTPS e funcionamento mobile online | Aplicação local HTTP disponível. Deploy HTTPS e teste de dispositivos não concluídos. |
| SUS com cinco usuários e execução contínua em smartphone | Pendentes. |
| GitHub/Trello/documentação acadêmica final | Sem publicação/atualização externa nesta rodada. Não declarar entrega acadêmica concluída. |

## Mudanças posteriores aos PDFs

O pedido completo do usuário na passagem de coordenação ampliou e alterou o fluxo:
planta manual alternativa, perímetro/paredes, percurso independente de fitas,
pessoas como entidades, espaçamentos de 0,5/0,8/1 m, salvar/abrir e realinhamento.
Backend Nest/SQLite e identidade slide-cintia foram também pedidos posteriormente.

Os PDFs usam densidade fixa de 0,6 m por pessoa, ligação automática entre postes,
HUD escuro, postes prateados e ausência de banco externo. A implementação segue
as instruções posteriores onde divergem. Essas decisões precisam ser refletidas
no XRD/plano, não apresentadas como conformidade literal aos PDFs originais.

O plano menciona AR.js com marcadores como mitigação e mistura AR Foundation
em uma linha do cronograma; o XRD descreve WebXR. Nenhuma dessas alternativas
foi validada em campo ou declarada funcional nesta entrega.

## Próximas dependências reais

1. Implementar diagnóstico de capacidade XR e preparar acesso HTTPS de teste.
2. Integrar sessão immersive-ar, hit-test, retículo, origem/plano e estados de tracking.
3. Integrar a mesma ProjectScene ao renderizador XR, com inserção e bloqueio seguro
   quando não houver pose válida; manter documento persistido separado da sessão.
4. Implementar e validar realinhamento de projeto salvo, exigido pelo fluxo ampliado.
5. Executar testes físicos de suporte, precisão em 20 m, deriva, tracking,
   perda de sessão, desempenho e usabilidade. Adaptar a estratégia à evidência.

O usuário já pode testar o editor manual/3D. Isso não substitui os itens acima.

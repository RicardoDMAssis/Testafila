# Roteiro de aceite humano

Este roteiro é um pedido de validação, não um registro de testes já executados.
Prepare login/ambiente conforme EXECUCAO-LOCAL.md. Não inclua senha no relatório.

## Editor manual e 3D

1. Entrar, criar planta de 10 × 8 m com paredes de 2,8 m; revisar área 80 m² e
   perímetro 36 m. Confirmar que a fonte é manual e não há erro de medida inventado.
2. Criar zona X=4..6/Z=5..7. Tentar poste (5,6): deve rejeitar sem mudar a cena.
3. Criar postes (1,1) e (8,1), conectar por seleção no canvas ou seletores.
4. Desenhar percurso (1,3) até (8,3), confirmar e preencher a 0,8 m: nove pessoas.
   A 0,5 m preencher: 15; trocar para 1 m: oito, com aviso de redução.
5. Desfazer/refazer e verificar contagens, posições, fitas dependentes e seleção.
6. Alternar planta/perspectiva; zoom e orbit; conferir cotas, rótulos e pessoas.
   Arrastar poste/zona e tentar posição inválida: a última cena válida deve voltar.
7. Interromper um arraste no aparelho; confirmar ausência de inclusão/movimento
   residual e testar um novo gesto. Testar rolagem da página fora do canvas.
8. Salvar, recarregar e reabrir; confirmar a mesma geometria e quantidade.
9. Abrir o mesmo projeto em duas abas, salvar na primeira e depois na segunda:
   deve haver conflito 409, com opção explícita de manter ou descartar rascunho.
10. Confirmar legibilidade/foco/alvos de toque em desktop e smartphone. Anotar
    modelo, navegador, viewport, orientação e desconfortos encontrados.

## Câmera/AR

O editor ainda não possui AR integrada. Para o spike isolado `/xr-check`, siga
XR-PENDENCIAS.md. Aceite do spike não representa entrega de mapeamento de projeto,
editor XR, realinhamento, precisão ou conformidade normativa.

## Registro

| Data | Aparelho/SO/navegador | Passo | Resultado esperado/observado | Evidência/bug |
| --- | --- | --- | --- | --- |
| A preencher | A preencher | A preencher | A preencher | A preencher |

Para precisão física, medir 20 m com trena e registrar valor observado, erro e
condições reais. Para usabilidade, os PDFs pedem SUS com cinco usuários; o roteiro
local não substitui esse estudo. Nunca preencher resultado como aprovado sem execução.

# TestaFila: editor visual de filas

## Produto e uso

Ferramenta operacional para desenhar uma fila em planta 3D, por organizadores que
não precisam conhecer coordenadas ou geometria. Uso em desktop e smartphone.
Nesta etapa o ambiente é manual/3D; câmera e AR não fazem parte do fluxo entregue.
Sucesso é colocar/mover/conectar objetos sem preencher tabelas técnicas.

Leitura: editor espacial operacional, canvas principal, paleta direita no desktop,
bandeja inferior no mobile. Superfície operate, V3 M1 D5. Não é landing page.

## Identidade existente

Fonte: docs/referencias/DESIGN-SLIDE-CINTIA.md e SVG original de slide-cintia.
Símbolo fila verde: viewBox 0 0 27 28, path M3 25V3h21v10H12v12, traço4,
circle cx24 cy25 r3. Reutilizar com marca textual TestaFila em todas as telas.

```design-tokens
fonts: Segoe UI, Arial, Georgia, Consolas, monospace, sans-serif
colors: #f5f4ef, #214b40, #242d29, #606963, #d8dcd4, #e8ece4, #9b3f31, #ffffff, #f8f6ef, #355b48, #243c32, #c8c5b8
radii: 0, 2px, 4px, 6px, 8px, 12px, 50%, 9999px
```

Marfim no fundo, verde para ações/seleção, alerta vermelho só para erro/restrição.
Usar tokens CSS existentes. Nenhum neon, gradiente decorativo, glass, confete ou
novo framework visual. A referência do usuário prevalece sobre sugestões das skills.

## Composição e componentes

- Canvas ocupa o espaço de trabalho. Painel de itens não pode dominar a tela.
- Desktop: painel direito de cerca de 280 px; mobile: bandeja na zona de polegar,
  recolhível/compacta e com safe-area. Evitar rolagem da página para alcançar ação.
- Escolha de item com miniatura reconhecível. Clique/toque arma a colocação; drag
  permite arrastar da paleta. Seleção é acompanhada de ações breves no inspector.
- Botões e campos com alvo mínimo de 44 px. Foco visível, nome acessível, contraste
  AA. Não depender de arraste: tocar item e tocar piso é alternativa obrigatória.
- Espaçamento em escala de 4/8 px; títulos modestos, corpo legível, métricas com
  algarismos tabulares. Georgia só em trechos editoriais já existentes, não em controles.
- Movimentos de câmera têm botões nomeados além de orbit/zoom de gesto.

## Texto

Português curto, orientado à ação: Colocar, Conectar, Girar, Desenhar área,
Usar área, Cancelar, +1 pessoa. Remover explicação técnica, UUID, XZ, revision,
schema, tabelas de vértices e numeração decorativa do fluxo comum.
Dados técnicos podem continuar no contrato/diagnóstico, não na tarefa do usuário.

## Movimento e verificação

Feedback discreto; respeitar reduced-motion. Canvas em demand sem loop decorativo.
Não declarar interação pronta só por typecheck; exercitar colocação, cancelamento,
seleção, drag da paleta/cena, conexão, pessoas, salvar/reabrir em 1280/390/320 px.

## Decisão de 28/10/2026

Os onze pontos do teste do usuário substituem o fluxo anterior de tabelas e
coordenadas. O esquema preserva cenas antigas, mas novas pessoas podem ser livres.
Altura de parede deixa de ser pergunta; a fila é a tarefa central.

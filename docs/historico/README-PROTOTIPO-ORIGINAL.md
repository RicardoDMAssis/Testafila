# TestaFila (Checa Fila)

Aplicação web em Realidade Aumentada para planejamento e dimensionamento de filas em eventos e estabelecimentos comerciais diretamente pelo navegador.

## Funcionalidades

- **3 Modos de Visualização:** WebXR Nativo, Câmera AR Universal (compatível com Android e iOS) e Simulador 3D.
- **Demarcação de Filas:** Posicionamento de pedestais virtuais conectados por fitas que mudam de cor (verde para livre, vermelho para colisão).
- **Zonas Restritas:** Marcação de áreas bloqueadas, como saídas de emergência e corredores.
- **Cálculos em Tempo Real:** Medição automática do comprimento da fila em metros, estimativa de público (0,60m por pessoa) e detecção de colisões.
- **Ferramentas Extras:** Validador de acessibilidade (ABNT NBR 9050), gerador automático de fila em formato caracol e exportação de relatório em JSON.

## Tecnologias

- JavaScript (ES6+)
- [Three.js](https://threejs.org/) & WebXR API
- [Vite](https://vitejs.dev/)

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse o endereço exibido no terminal pelo computador ou celular conectado na mesma rede.

---

**Projeto Aplicado V — Realidade Virtual e Aumentada (2026.2)**
**Professora:** Profª. Cintia da Costa Souza
**Equipe:** João Paulo, Lucas Vinícius e Ricardo Daniel

# Histórico

## 2026-11-19

- Nova pasta `react/`: componentes React do DS (26 componentes, incluindo Grid como `PageGrid`), com tipos, `styles.css` gerado a partir de `css/`, README e página de demonstração.

## 2026-11-18
- Checkbox, Radio e Toggle: contorno um tom mais suave (65% de `border-strong` com `surface-raised`). ThreeWaySwitch: texto marcado em peso regular.
- Estado de foco removido de todos os componentes (CSS, prévias e guias); contorno padrão do navegador desligado. Tokens `focus-ring` e `shadow-focus` mantidos, sem uso.
- Slider segmentado: 2px fixos entre os segmentos, pontas redondas de 4px.
- Nova página `biblioteca.html`: biblioteca completa com os 26 componentes (um card por componente, em light e dark, com variantes e estados), filtro por grupo e tema compartilhado com a apresentação. A página usa o próprio Design System (cabeçalho, abas, cards, etiquetas e botões).
- Apresentação: botão no topo, chamada no hero e faixa final apontando para a biblioteca.
- Novo componente ProgressBar (grupo Feedback): barra de avanço de 8px com cor por faixa (vermelho a verde), estados em espera, em andamento e concluído, animação de preenchimento e de cor; token `size-progress-height`.
- Novo componente Card (grupo Dados): padding de 16px, raio de 24px, 24px entre cards, sete modelos; token `size-card-min-width`.
- Página de apresentação com a seção de Cards e a barra de avanço animada.
- TextField selecionado: botão X pequeno à esquerda para limpar o texto, no lugar do ícone de editar.
- ThreeWaySwitch: texto branco sobre o destaque verde (contraste cerca de 2,2:1, ponto aberto no guia do componente).
- Novo componente Table (grupo Dados): células de mesma largura, divisor, status e ações; variante com quadro.
- Modal: variante janela (525px) com cabeçalho, conteúdo variável e rodapé de botões.
- Padronização de foco, hover, desabilitado e transição; `border-strong` nas bordas de controles; rolagem do Tooltip no padrão Scrollbar.
- Página de apresentação do Design System (`index.html`) com os componentes reais, drawer, filtros e modal de confirmação.

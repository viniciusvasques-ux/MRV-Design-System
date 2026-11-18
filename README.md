# Design System MRV&CO

Página de apresentação do Design System da MRV&CO Produção, com os componentes reais embutidos: botões, toggle, caixa de seleção, seletor de três posições, chip, slider, campo de texto, tabela, toast, drawer, filtros e modal de confirmação. Alterna entre os temas claro e escuro.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `index.html` | Página autocontida (CSS e logo embutidos) |
| `css/tokens.css` | Tokens de cor (light e dark), espaçamento, raio, tamanhos, sombras e tipografia |
| `css/bundle.css` | Estilos dos componentes (`ds-*`) |
| `assets/` | Logo MRV&CO monocromático negativo |

## Usar os estilos em outra página

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/bundle.css">

<html data-theme="light"> <!-- ou "dark" -->
<button type="button" class="ds-btn ds-btn--positive"><span class="fontsize-x-semi">Confirmar</span></button>
```

A marcação de cada componente está na prévia e no README do componente, no artefato do Design System.

## Publicar no GitHub Pages

Settings > Pages > Source: branch `main`, pasta `/ (root)`. A página fica em `https://<usuario>.github.io/<repositorio>/`.

## Limites desta versão

- `css/tokens.css` é uma versão compacta transcrita à mão; `tokens.json` original não está neste repositório.
- Não estão incluídos os READMEs e prévias de cada componente, as fontes Outfit em TTF nem os demais logos.
- Licença não definida: escolha uma antes de tornar o repositório público.

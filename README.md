# Design System MRV&CO · página de apresentação

- `index.html`: página autocontida (CSS do DS embutido, logo inline). Abre direto no navegador; precisa de internet só para as fontes Outfit e Material Symbols (Google Fonts).
- `css/tokens.css` e `css/bundle.css`: os mesmos estilos que estão embutidos no `index.html`, separados para reuso.

## Publicar no GitHub Pages
1. Crie o repositório e envie estes arquivos na raiz.
2. Settings > Pages > Source: branch `main`, pasta `/ (root)`.
3. A página fica em `https://<usuario>.github.io/<repositorio>/`.

Observação: `tokens.css` aqui é uma versão compacta transcrita do DS; a fonte da verdade continua sendo o `tokens.json` do artefato do Design System.

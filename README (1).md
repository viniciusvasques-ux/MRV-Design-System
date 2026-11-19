# @mrvco/design-system-react

Componentes React do Design System MRV&CO. A camada React não redefine estilo: ela gera a marcação e as classes `ds-*` já documentadas, e acrescenta o comportamento (estado, teclado, foco, animação de saída). Os tokens (cores light e dark, espaçamento, raio, tipografia) vêm de `css/tokens.css` e `css/bundle.css`.

## Instalação e uso

```bash
cd react
npm install
npm run build      # gera dist/ (JS, tipos e styles.css)
```

```tsx
import '@mrvco/design-system-react/styles.css';   // tokens + componentes (+ Select e PageGrid)
import { Button, TextField, Select, ToastProvider, useToast } from '@mrvco/design-system-react';
```

Na página, carregue as fontes (Outfit e Material Symbols Rounded) e defina o tema no elemento raiz: `<html data-theme="light">` ou `"dark"`.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
```

`react` e `react-dom` (17 ou superior) são peer dependencies. Os ícones são os nomes do Material Symbols (`icon="check"`).

## Componentes

| DS | Exportações | Pontos principais |
| --- | --- | --- |
| Button, IconButton | `Button`, `IconButton`, `Icon` | `variant` (default, positive, negative, alert), `appearance` (filled, light, outline), `pill`, `icon`. IconButton exige `aria-label`. |
| Checkbox, Radio | `Checkbox`, `Radio`, `RadioGroup` | `indeterminate`; RadioGroup controlado ou não. |
| Toggle | `Toggle` | `role="switch"`; `checked`/`defaultChecked`/`onCheckedChange`, `alert`, `label`. |
| ThreeWaySwitch | `ThreeWaySwitch` | Valores `'a' \| 'n' \| 'b'`; `labels`, `hint`. |
| Chip | `Chip` | `outline`, `onRemove`, `menuItems`. |
| Dropdown | `Menu`, `Select` | `Menu`: `complex`, `simple`, `multiple` (Limpar e Aplicar) e `single` (Aplicar). `Select`: campo com painel, único ou `multiple`. |
| TextField | `TextField` | `state` (selected, error, alert, disabled, hidden), `leftIcon`, `rightIcon`, `counter`, `clearable` (icon ou text), `chips`, `stepper`, `labelAction`, `helper`, `density`. |
| SearchField | `SearchField` | `alt`, `select`, `onSearch` (Enter), estado ativo automático. |
| Callout | `Callout` | `tone` (alert, positive, negative, accent); com `title` vira a versão com toggle. |
| Tooltip | `Tooltip`, `TooltipList`, `TooltipInfo`, `TooltipDetail` | Painéis do DS; gatilho e posição ficam com quem usa. |
| Toast | `ToastProvider`, `useToast`, `Toast`, `ToastBlock` | `toast.show(kind, título, texto)` (5 s, no máximo 10) e `toast.block(kind, texto)`. |
| Card | `Card`, `CardGrid` e partes (`CardHeader`, `CardTitle`, `CardRow`, `CardField`, `CardStat`, `CardDelta`, `CardBadge`, `CardBar`, `CardMeter`, `CardTable`, `CardFooter` etc.) | Composição por partes: padding 16, raio 24, 12px entre blocos. |
| ActionBar | `ActionBar`, `ActionBarText` | `position`: fixed, contained, static; `end` para toggle ou contador. |
| NavBar | `Header`, `NavBar`, `NavBarTitle`, `NavBarBack`, `NavBarAction`, `NavBarSelect`, `Breadcrumb` | Padrões título, breadcrumb e voltar; `Header` aceita `Tabs` encaixadas. |
| Tabs | `Tabs` | Rolagem com setas, teclado ← →, aba desabilitada. O painel de conteúdo é de quem usa. |
| Pagination | `Pagination` | `total`, `page`, `perPage`, `perPageOptions`, controlado ou não; anuncia a página para leitor de tela. |
| ProgressBar | `ProgressBar` | `state` (running, waiting, done), `onCancel`; cor evolui por faixa de valor. |
| Slider | `Slider` | Valor único ou `[min, max]`; `segmented` (segmentos de 5%, 2px de intervalo), `format`. |
| GanttSlider | `GanttSlider` | `value` `{ p1, p2?, b1, b2 }`; arraste e teclado (setas, Shift = 5, Home e End); `compact`, `dark`, `endLabel`. |
| Scrollbar | `Scroll` | `axis` (x, y, both), `visible`. |
| Modal | `Modal`, `ModalWindow` | `open`/`onClose`; Esc, clique no fundo, foco preso e devolvido, animação de saída. |
| Drawer | `Drawer`, `DrawerSection` | `side`, `compact`, `surface`, `footer`; mesmo comportamento de camada do Modal. |
| Table | `Table`, `TableAction` | `columns`, `rows`, `actions`, `muted`, `framed`. |
| Grid | `PageGrid`, `GridCol` | 12/8/4 colunas, gutter e margens por breakpoint (600 e 1024px), `dense`; `offsetTop` (cabeçalho fixo) e `offsetBottom` (ActionBar fixa) evitam que o conteúdo fique encoberto. |

## Demonstração

`npm run build && npm run demo` gera `demo/dist/index.html` (página única, com todos os componentes, alternância light e dark e toasts, modal e drawer funcionando).

## Limites conhecidos

- `Tooltip*` e `Menu` são painéis: não fazem posicionamento nem abrem sozinhos (use `Select`, `Chip` e `SearchField`, que já abrem o menu).
- `Slider` segmentado assume a escala do DS (segmentos de 5% em 0 a 100).
- `GanttSlider` e `Slider` calculam as posições pelas variáveis CSS do DS (`--min`, `--max`, `--p1`…); formatos de rótulo ficam em `format`.
- `Select` e `PageGrid` usam `react-extra.css` (parte do `styles.css`), porque o `bundle.css` não define a posição do painel nem a grade da página.
- A navegação por teclado de `Menu` (setas) vale para `complex` e `simple`; em `Select` o foco inicial fica no campo.
- Não há testes automatizados; a verificação foi feita por tipagem (`npm run typecheck`) e por interação no navegador sobre a página de demonstração.

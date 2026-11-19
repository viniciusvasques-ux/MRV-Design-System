/** Trechos de código copiáveis, por seção da demonstração. */
export const SNIPPETS: Record<string, string> = {
  intro: `# Dentro da pasta react/ do repositório
npm install
npm run build

// Na aplicação
import '@mrvco/design-system-react/styles.css';   // tokens + componentes
import { Button, TextField, Select, ToastProvider, useToast } from '@mrvco/design-system-react';

// <html data-theme="light"> ou "dark", com as fontes Outfit e Material Symbols Rounded carregadas`,

  buttons: `import { Button, IconButton } from '@mrvco/design-system-react';

<Button icon="check">Aplicar</Button>
<Button appearance="light" icon="chevron_right">Avançar</Button>
<Button pill>Pílula</Button>

<Button variant="positive" icon="check">Confirmar</Button>
<Button variant="negative" appearance="outline" icon="close">Sair</Button>
<Button variant="alert" icon="block">Inativar</Button>
<Button disabled>Desabilitado</Button>

<IconButton icon="tune" aria-label="Filtros" appearance="light" />
<IconButton icon="check" aria-label="Aplicar" pill />
<IconButton icon="close" aria-label="Fechar" variant="negative" appearance="light" />`,

  choices: `import { Checkbox, Radio, RadioGroup, Toggle, ThreeWaySwitch } from '@mrvco/design-system-react';

<Checkbox label="Marcada" defaultChecked />
<Checkbox label="Parcial" indeterminate />
<Checkbox label="Desabilitada" disabled />

<RadioGroup
  name="exemplo"
  aria-label="Exemplo"
  defaultValue="b"
  options={[
    { value: 'a', label: 'Não selecionado' },
    { value: 'b', label: 'Selecionado' },
  ]}
/>

<Toggle label="Ligado" defaultChecked />
<Toggle label="Alerta" alert />
<Toggle label="Desabilitado" disabled />

const [valor, setValor] = useState<'a' | 'n' | 'b'>('n');
<ThreeWaySwitch label="Descrição da tarefa" hint="(obrigatório)" value={valor} onChange={setValor} />`,

  chips: `import { Chip, Callout, Tooltip, TooltipList, TooltipInfo, TooltipDetail } from '@mrvco/design-system-react';

<Chip>Nome item</Chip>
<Chip outline onRemove={() => {}}>Remover</Chip>
<Chip menuItems={[{ label: 'Opção 1' }, { label: 'Opção 2' }]}>Menu</Chip>

<Callout tone="alert">As alterações são aplicadas automaticamente.</Callout>
<Callout tone="accent" title="Modo Replanejamento ativo!">
  Os serviços posteriores terão prazos recalculados.
</Callout>

<Tooltip>informação de texto a ser exibida</Tooltip>
<TooltipList items={emails} onRemove={(i) => setEmails(emails.filter((_, j) => j !== i))} />
<TooltipInfo sections={[{ title: 'Normal', items: [{ code: '086420' }] }]} />
<TooltipDetail title="Lançamento" meta={[{ label: 'SKU', value: 'TCLASS03--2QSV-DW', copyable: true }]} />`,

  fields: `import { TextField, SearchField, Select } from '@mrvco/design-system-react';

<TextField label="Padrão" leftIcon="edit" defaultValue="Campo de texto" counter={64} rightIcon="expand_more" helper="Input Helper" />
<TextField label="Erro" state="error" leftIcon="search" helper="Input Helper" />
<TextField label="Alerta" state="alert" helper="Input Helper" />
<TextField label="Desabilitado" state="disabled" defaultValue="Campo de texto" />
<TextField label="Oculto" state="hidden" leftIcon="dialpad" defaultValue="123456789" />
<TextField label="Limpar texto" clearable="text" leftIcon="edit" defaultValue="Campo de texto" />
<TextField label="Múltiplos itens" chips={chips} onChipRemove={(i) => setChips(chips.filter((_, j) => j !== i))} onAdd={() => setChips([...chips, 'Novo'])} />
<TextField label="Contador" value="01" onChange={() => {}} stepper={{ onIncrement, onDecrement }} />

<SearchField value={q} onChange={setQ} onSearch={buscar} select={{ options: ['Todas', 'Projetos', 'Pessoas'] }} />

<Select label="Comitê responsável" placeholder="Selecione um comitê"
  options={[{ value: 'exco', label: 'ExCo' }, { value: 'opco', label: 'OpCo' }]} />
<Select label="Dias da semana" multiple placeholder="Selecione um ou mais dias"
  options={dias.map((d) => ({ value: d, label: d }))} />`,

  menus: `import {
  Menu, Toast, ToastBlock, ToastProvider, useToast, Modal, ModalWindow, Drawer, DrawerSection, Button, TextField, Toggle,
} from '@mrvco/design-system-react';

<Menu variant="complex" title="Título" items={[{ value: '1', label: 'Item 1', icon: 'search' }]} />
<Menu variant="simple" items={[{ value: '1', label: 'Item 1' }]} onSelect={(v) => {}} />
<Menu variant="multiple" value={['2']} items={itens} onApply={(valores) => {}} />

<Toast kind="info" title="Informação" text="Existem novas notificações" />
<ToastBlock kind="success" onClose={() => {}}>Mensagem ou descrição</ToastBlock>

// Envolva a aplicação em <ToastProvider> e dispare de qualquer lugar:
const toast = useToast();
toast.show('success', 'Informação', 'Existem novas notificações');
toast.block('alert', 'Mensagem ou descrição');

<Modal open={aberto} onClose={fechar} icon="warning" title="Registro de NC"
  actions={<><Button onClick={fechar}>Cancelar</Button><Button variant="negative">Registrar</Button></>}>
  Quando uma Não Conformidade for apontada, o item deverá ser revisado.
</Modal>

<ModalWindow open={janela} onClose={fecharJanela} title="Salvar como nova versão"
  actions={<Button variant="positive">Publicar</Button>}>
  <TextField label="Nova versão" defaultValue="2.0" />
  <Toggle label="Tornar versão anterior obsoleta" />
</ModalWindow>

<Drawer open={gaveta} onClose={fecharGaveta} title="Detalhes da reunião"
  footer={<Button variant="positive" icon="check">Confirmar agenda</Button>}>
  <DrawerSection title="Pauta">…</DrawerSection>
</Drawer>`,

  cards: `import {
  Card, CardGrid, CardHeader, CardStat, CardDelta, CardRow, CardBar, CardBadge, CardFooter, CardTitle, CardDivider,
  CardMeterHead, CardMeter, CardField, CardTable, Button,
} from '@mrvco/design-system-react';

<CardGrid>
  <Card>
    <CardHeader icon="attach_money" subtitle="Forecast Jan.26" />
    <CardStat>R$ 12.4M</CardStat>
    <CardDelta value="+12%" label="vs mês ant." />
  </Card>

  <Card>
    <CardRow><b>ASC</b><span>50%</span></CardRow>
    <CardBar value={50} label="Avanço da ASC" />
    <CardBadge tone="alert">Medição em rascunho</CardBadge>
    <CardFooter><Button appearance="light" icon="bar_chart">Avanço detalhado</Button></CardFooter>
  </Card>

  <Card>
    <CardTitle brand icon="warehouse" size="l">Camaçari</CardTitle>
    <CardDivider />
    <CardMeterHead label="Posições (ocupação)" value="200 | 400" />
    <CardMeter icon="inventory_2" value={50} tone="positive" label="Posições" />
    <CardField label="Linha">MCMV</CardField>
    <CardTable columns={['m2', 'm']} rows={[['Alumínio', '2.500,00', '3.120,00']]} total={['Total', '2.500,00', '3.120,00']} />
  </Card>
</CardGrid>`,

  data: `import { Table, TableAction, Pagination, ProgressBar, Slider, GanttSlider, Scroll } from '@mrvco/design-system-react';

<Table
  aria-label="Templates"
  rows={rows}
  getRowKey={(r) => r.id}
  muted={(r) => r.status === 'Obsoleto'}
  columns={[
    { key: 'name', header: 'Template' },
    { key: 'tipo', header: 'Tipo' },
    { key: 'status', header: 'Status', negative: (r) => r.status === 'Obsoleto' },
  ]}
  actions={(r) => (<>
    <TableAction icon="content_copy" aria-label={\`Duplicar \${r.name}\`} />
    <TableAction icon="edit" aria-label={\`Editar \${r.name}\`} />
  </>)}
  actionsCount={2}
/>

<Pagination total={95} />

<ProgressBar label="Dados em sincronia" value={62} onCancel={() => {}} />
<ProgressBar label="Dados em sincronia" value={0} state="waiting" />
<ProgressBar label="Dados em sincronia" value={100} state="done" />

<Slider label="Avanço físico" value={[20, 75]} onChange={setRange} segmented />
<Slider label="Volume" value={volume} onChange={(v) => setVolume(v as number)} />

const [g, setG] = useState({ p1: 2, p2: 4, b1: 22, b2: 46 });
<GanttSlider value={g} onChange={setG} endLabel />

<Scroll axis="y" style={{ height: 96 }}>…</Scroll>`,

  nav: `import { NavBar, Header, Tabs, Breadcrumb, NavBarBack, NavBarSelect, NavBarTitle, NavBarAction, IconButton, ActionBar, ActionBarText, Button, PageGrid, GridCol } from '@mrvco/design-system-react';

<Header>
  <NavBar
    start={<NavBarTitle>Portal de Comitês</NavBarTitle>}
    end={<NavBarAction icon="notifications" aria-label="Notificações" />}
  />
  <Tabs aria-label="Seções" tabs={[{ id: 'a', label: 'Componentes' }, { id: 'b', label: 'Navegação' }]} value={aba} onChange={setAba} />
</Header>

<NavBar
  start={<Breadcrumb items={[{ label: 'Home', icon: 'home' }, { label: 'Nível 1' }, { label: 'Página atual' }]} />}
  end={<IconButton icon="undo" aria-label="Desfazer" appearance="light" />}
/>
<NavBar start={<NavBarBack />} center={<NavBarSelect>Seleção</NavBarSelect>} end={<IconButton icon="close" aria-label="Fechar" variant="negative" />} />

<PageGrid offsetTop={104}>
  <GridCol span={8}>…</GridCol>
  <GridCol span={4}>…</GridCol>
</PageGrid>

<ActionBar end={<ActionBarText>0 itens selecionados</ActionBarText>}>
  <Button variant="negative" appearance="light" icon="close">Cancelar</Button>
  <Button variant="positive" icon="check">Publicar</Button>
</ActionBar>`,
};

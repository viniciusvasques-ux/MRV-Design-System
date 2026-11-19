import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ActionBar, ActionBarText, Breadcrumb, Button, Callout, Card, CardBadge, CardBar, CardDelta, CardDivider, CardField, CardFooter, CardGrid,
  CardHeader, CardMeter, CardMeterHead, CardRow, CardStat, CardTable, CardTitle, Checkbox, Chip, Drawer, DrawerSection, GanttSlider, GridCol,
  Header, IconButton, Menu, Modal, ModalWindow, NavBar, NavBarAction, NavBarBack, NavBarSelect, NavBarTitle, PageGrid, Pagination, ProgressBar,
  Radio, RadioGroup, Scroll, SearchField, Select, Slider, Table, TableAction, Tabs, TextField, ThreeWaySwitch, Toast, ToastBlock, ToastProvider,
  Toggle, Tooltip, TooltipDetail, TooltipInfo, TooltipList, useToast,
  type GanttValue, type ThreeWayValue,
} from '../src';
import { SNIPPETS } from './snippets';

declare const __EMBED__: boolean;
declare const __LOGO__: string;

function copyText(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy') ? resolve() : reject(new Error('copy')); } catch (e) { reject(e); } finally { ta.remove(); }
  });
}

function CopyCode({ id, code }: { id: string; code: string }) {
  const [state, setState] = React.useState<'idle' | 'ok' | 'err'>('idle');
  const [open, setOpen] = React.useState(false);
  const flash = (s: 'ok' | 'err') => { setState(s); window.setTimeout(() => setState('idle'), 1800); };
  return (
    <>
      <Row>
        <Button
          appearance="light" icon={state === 'ok' ? 'check' : state === 'err' ? 'error' : 'content_copy'} data-copy={id}
          onClick={() => copyText(code).then(() => flash('ok'), () => flash('err'))}
        >
          {state === 'ok' ? 'Código copiado' : state === 'err' ? 'Não foi possível copiar' : 'Copiar código'}
        </Button>
        <Button appearance="light" icon={open ? 'expand_less' : 'code'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Ocultar código' : 'Ver código'}
        </Button>
        <span role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          {state === 'ok' ? 'Código copiado' : ''}
        </span>
      </Row>
      {open && (
        <Scroll axis="both" style={{ maxHeight: 320, background: 'var(--surface-alt)', borderRadius: 12 }}>
          <pre className="fontsize-xs-regular" style={{ margin: 0, padding: 12, whiteSpace: 'pre', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{code}</pre>
        </Scroll>
      )}
    </>
  );
}

function Sec({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: 'var(--surface-raised)', borderRadius: 24 }}>
      <h2 className="fontsize-m-semi" style={{ margin: 0 }}>{title}</h2>
      {children}
      {SNIPPETS[id] && <CopyCode id={id} code={SNIPPETS[id]} />}
    </section>
  );
}
const Row = ({ children }: { children: React.ReactNode }) => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>;
const Col = ({ children }: { children: React.ReactNode }) => <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>{children}</div>;

function ToastDemo() {
  const t = useToast();
  return (
    <Row>
      <Button variant="positive" onClick={() => t.show('success', 'Informação', 'Existem novas notificações')}>Disparar aviso</Button>
      <Button variant="negative" appearance="light" onClick={() => t.block('alert', 'Mensagem ou descrição')}>Aviso com bloqueio</Button>
    </Row>
  );
}

function App() {
  const [dark, setDark] = React.useState(() => {
    if (!__EMBED__) return false;
    try { return localStorage.getItem('ds-theme') !== 'light'; } catch (e) { return true; }
  });
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (__EMBED__) { try { localStorage.setItem('ds-theme', dark ? 'dark' : 'light'); } catch (e) { /* sem armazenamento */ } }
  }, [dark]);
  const [tab, setTab] = React.useState('p');
  const [tw, setTw] = React.useState<ThreeWayValue>('n');
  const [modal, setModal] = React.useState(false);
  const [win, setWin] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const [tips, setTips] = React.useState(['adalberto.rossi@parceiro.mrv.com.br', 'rafalea.vieira@parceiro.mrv.com.br']);
  const [chips, setChips] = React.useState(['Item A', 'Item B']);
  const [n, setN] = React.useState(1);
  const [g, setG] = React.useState<GanttValue>({ p1: 2, p2: 4, b1: 22, b2: 46 });
  const [rng, setRng] = React.useState<number | [number, number]>([20, 75]);
  const [pct, setPct] = React.useState(40);
  const [q, setQ] = React.useState('');
  const [committed, setCommitted] = React.useState('');
  const rows = [
    { id: '1', name: 'Torre_pavimento_2026', tipo: 'Torre', criador: 'joao.silva', status: 'Em edição' },
    { id: '2', name: 'Bloco_pavimento_2026', tipo: 'Bloco', criador: 'ana.souza', status: 'Vigente' },
    { id: '3', name: 'Torre_Sensia_2024', tipo: 'Torre', criador: 'pedro.oliveira', status: 'Obsoleto' },
  ];
  return (
    <ToastProvider>
      {__EMBED__ ? (
        <Header>
          <nav className="ds-navbar" aria-label="Principal">
            <div className="ds-navbar__start" dangerouslySetInnerHTML={{ __html: __LOGO__ }} />
            <div className="ds-navbar__end">
              <a className="ds-btn ds-btn--light" href="biblioteca.html"><span className="fontsize-x-semi">Biblioteca</span><span className="ds-icon" aria-hidden="true">widgets</span></a>
              <a className="ds-btn ds-btn--light" href="index.html"><span className="fontsize-x-semi">Apresentação</span><span className="ds-icon" aria-hidden="true">arrow_back</span></a>
              <button className="ds-btn" id="theme" type="button" aria-pressed={!dark} onClick={() => setDark(!dark)}>
                <span className="fontsize-x-semi">{dark ? 'Acender a luz' : 'Apagar a luz'}</span>
                <span className="ds-icon" aria-hidden="true">{dark ? 'light_mode' : 'dark_mode'}</span>
              </button>
            </div>
          </nav>
        </Header>
      ) : (
      <Header>
        <NavBar
          start={<NavBarTitle>Biblioteca React · DS MRV&amp;CO</NavBarTitle>}
          end={<NavBarAction icon={dark ? 'light_mode' : 'dark_mode'} aria-label="Alternar tema" id="theme" onClick={() => setDark(!dark)} />}
        />
        <Tabs aria-label="Seções" tabs={[{ id: 'p', label: 'Componentes' }, { id: 'o', label: 'Navegação' }, { id: 'x', label: 'Desabilitada', disabled: true }]} value={tab} onChange={setTab} />
      </Header>
      )}
      <PageGrid offsetTop={__EMBED__ ? 64 : 104} offsetBottom={57}>
        {__EMBED__ && (
          <GridCol span={12}>
            <Sec id="intro" title="Biblioteca React">
              <p className="fontsize-m-regular" style={{ margin: 0, maxWidth: '75ch', color: 'var(--text-secondary)' }}>
                Os 26 componentes do Design System em React com TypeScript. A camada React usa as mesmas classes <b>ds-*</b> e os mesmos tokens, e acrescenta estado, teclado, foco e animação de saída. Cada bloco abaixo é interativo e tem um botão para copiar o código.
              </p>
            </Sec>
          </GridCol>
        )}
        <GridCol span={4}><Sec id="buttons" title="Button e IconButton">
          <Row><Button icon="check">Aplicar</Button><Button appearance="light" icon="chevron_right">Avançar</Button><Button pill>Pílula</Button></Row>
          <Row><Button variant="positive" icon="check">Confirmar</Button><Button variant="negative" appearance="outline" icon="close">Sair</Button><Button variant="alert" icon="block">Inativar</Button><Button disabled>Desabilitado</Button></Row>
          <Row><IconButton icon="tune" aria-label="Filtros" appearance="light" /><IconButton icon="check" aria-label="Aplicar" pill /><IconButton icon="close" aria-label="Fechar" variant="negative" appearance="light" /></Row>
        </Sec></GridCol>
        <GridCol span={4}><Sec id="choices" title="Checkbox, Radio, Toggle, ThreeWay">
          <Col><Checkbox label="Desmarcada" /><Checkbox label="Marcada" defaultChecked /><Checkbox label="Parcial" indeterminate /><Checkbox label="Desabilitada" disabled /></Col>
          <RadioGroup name="r" aria-label="Exemplo" defaultValue="b" options={[{ value: 'a', label: 'Não selecionado' }, { value: 'b', label: 'Selecionado' }]} />
          <Radio name="rx" label="Radio avulso" disabled />
          <Col><Toggle label="Ligado" defaultChecked /><Toggle label="Alerta" alert /><Toggle label="Desabilitado" disabled /></Col>
          <ThreeWaySwitch label="Descrição da tarefa" hint="(obrigatório)" value={tw} onChange={setTw} />
          <span id="tw-out" className="fontsize-x-regular">valor: {tw}</span>
        </Sec></GridCol>
        <GridCol span={4}><Sec id="chips" title="Chip, Callout, Tooltip">
          <Row><Chip>Nome item</Chip><Chip outline onRemove={() => {}}>Remover</Chip><Chip menuItems={[{ label: 'Opção 1' }, { label: 'Opção 2' }]}>Menu</Chip></Row>
          <Callout tone="alert">As alterações são aplicadas automaticamente.</Callout>
          <Callout tone="accent" title="Modo Replanejamento ativo!">Os serviços posteriores terão prazos recalculados.</Callout>
          <Tooltip>informação de texto a ser exibida</Tooltip>
          <TooltipList items={tips} onRemove={(i) => setTips(tips.filter((_, j) => j !== i))} />
          <TooltipInfo sections={[{ title: 'Normal', items: [{ code: '086420' }] }, { title: 'Remodelagem', items: [{ code: '975319', alert: true }] }]} />
          <TooltipDetail title="Lançamento" meta={[{ label: 'SKU', value: 'TCLASS03--2QSV-DW', copyable: true }, { label: 'Módulos', value: '2' }]} />
        </Sec></GridCol>

        <GridCol span={6}><Sec id="fields" title="TextField, SearchField, Select">
          <TextField label="Padrão" leftIcon="edit" defaultValue="Campo de texto" counter={64} rightIcon="expand_more" helper="Input Helper" />
          <TextField label="Erro" state="error" leftIcon="search" defaultValue="Campo de texto" helper="Input Helper" />
          <TextField label="Alerta" state="alert" defaultValue="Não há itens listados" helper="Input Helper" />
          <TextField label="Desabilitado" state="disabled" defaultValue="Campo de texto" />
          <TextField label="Oculto" state="hidden" leftIcon="dialpad" defaultValue="123456789" />
          <TextField label="Limpar texto" clearable="text" leftIcon="edit" defaultValue="Campo de texto" />
          <TextField label="Múltiplos itens" chips={chips} onChipRemove={(i) => setChips(chips.filter((_, j) => j !== i))} onAdd={() => setChips([...chips, `Item ${chips.length + 1}`])} />
          <TextField label="Contador" value={String(n).padStart(2, '0')} onChange={() => {}} stepper={{ onIncrement: () => setN(n + 1), onDecrement: () => setN(Math.max(0, n - 1)) }} />
          <SearchField value={q} onChange={setQ} onSearch={setCommitted} select={{ options: ['Todas', 'Projetos', 'Pessoas'] }} />
          <span id="search-out" className="fontsize-x-regular">busca: {committed}</span>
          <Select label="Comitê responsável" placeholder="Selecione um comitê" options={[{ value: 'exco', label: 'ExCo' }, { value: 'opco', label: 'OpCo' }, { value: 'riskco', label: 'RiskCo' }]} />
          <Select label="Dias da semana" multiple placeholder="Selecione um ou mais dias" options={['Segunda-feira', 'Terça-feira', 'Quarta-feira'].map((d) => ({ value: d, label: d }))} />
        </Sec></GridCol>
        <GridCol span={6}><Sec id="menus" title="Dropdown (Menu), Toast, Modal, Drawer">
          <Row>
            <Menu variant="complex" title="Título" items={[{ value: '1', label: 'Item 1', icon: 'search' }, { value: '2', label: 'Item 2', icon: 'search' }]} />
            <Menu variant="simple" items={[{ value: '1', label: 'Item 1' }, { value: '2', label: 'Item 2' }]} />
            <Menu variant="multiple" value={['2']} items={[{ value: '1', label: 'Item 1' }, { value: '2', label: 'Item 2' }]} />
          </Row>
          <Toast kind="info" title="Informação" text="Existem novas notificações" />
          <ToastBlock kind="success" onClose={() => {}}>Mensagem ou descrição</ToastBlock>
          <ToastDemo />
          <Row>
            <Button appearance="light" icon="open_in_new" onClick={() => setModal(true)} id="open-modal">Abrir modal</Button>
            <Button appearance="light" icon="open_in_new" onClick={() => setWin(true)} id="open-win">Abrir janela</Button>
            <Button appearance="light" icon="open_in_new" onClick={() => setDrawer(true)} id="open-drawer">Abrir drawer</Button>
          </Row>
        </Sec></GridCol>

        <GridCol span={6}><Sec id="cards" title="Card">
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
          </CardGrid>
        </Sec></GridCol>
        <GridCol span={6}><Sec id="data" title="Table, Pagination, ProgressBar, Slider, Gantt, Scroll">
          <Table
            aria-label="Templates" rows={rows} getRowKey={(r) => r.id} muted={(r) => r.status === 'Obsoleto'}
            columns={[{ key: 'name', header: 'Template' }, { key: 'tipo', header: 'Tipo' }, { key: 'status', header: 'Status', negative: (r) => r.status === 'Obsoleto' }]}
            actions={(r) => <><TableAction icon="content_copy" aria-label={`Duplicar ${r.name}`} /><TableAction icon="edit" aria-label={`Editar ${r.name}`} /></>} actionsCount={2}
          />
          <Pagination total={95} />
          <ProgressBar label="Dados em sincronia" value={62} onCancel={() => {}} />
          <ProgressBar label="Dados em sincronia" value={0} state="waiting" />
          <ProgressBar label="Dados em sincronia" value={100} state="done" />
          <Slider label="Avanço físico" value={rng} onChange={setRng} segmented />
          <Slider label="Volume" value={pct} onChange={(v) => setPct(v as number)} />
          <GanttSlider value={g} onChange={setG} endLabel />
          <span id="gantt-out" className="fontsize-x-regular">{JSON.stringify(g)}</span>
          <Scroll axis="y" style={{ height: 96, border: '1px solid var(--border-default)', borderRadius: 12, padding: 8 }}>
            {Array.from({ length: 10 }, (_, i) => <div className="fontsize-x-regular" key={i} style={{ minHeight: 32 }}>Item {i + 1}</div>)}
          </Scroll>
        </Sec></GridCol>
        <GridCol span={12}><Sec id="nav" title="NavBar: breadcrumb e voltar">
          <NavBar start={<Breadcrumb items={[{ label: 'Home', icon: 'home' }, { label: 'Nível 1' }, { label: 'Página atual' }]} />} end={<IconButton icon="undo" aria-label="Desfazer" appearance="light" />} />
          <NavBar start={<NavBarBack />} center={<NavBarSelect>Seleção</NavBarSelect>} end={<IconButton icon="close" aria-label="Fechar" variant="negative" />} />
        </Sec></GridCol>
      </PageGrid>
      <ActionBar end={<ActionBarText>0 itens selecionados</ActionBarText>}>
        <Button variant="negative" appearance="light" icon="close">Cancelar</Button>
        <Button variant="positive" icon="check">Publicar</Button>
      </ActionBar>
      <Modal open={modal} onClose={() => setModal(false)} icon="warning" title="Registro de NC" actions={<><Button onClick={() => setModal(false)}>Cancelar</Button><Button variant="negative" onClick={() => setModal(false)}>Registrar</Button></>}>
        Quando uma Não Conformidade for apontada, o item deverá ser revisado após a correção.
      </Modal>
      <ModalWindow open={win} onClose={() => setWin(false)} title="Salvar como nova versão" actions={<><Button variant="negative" appearance="light" onClick={() => setWin(false)}>Cancelar</Button><Button variant="positive" onClick={() => setWin(false)}>Publicar</Button></>}>
        <TextField label="Nova versão" defaultValue="2.0" />
        <Toggle label="Tornar versão anterior obsoleta" />
      </ModalWindow>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Detalhes da reunião" footer={<Button variant="positive" icon="check" onClick={() => setDrawer(false)}>Confirmar agenda</Button>}>
        <DrawerSection title="Informações gerais"><p className="fontsize-x-regular" style={{ margin: 0 }}>Comitê organizador: ExCo</p></DrawerSection>
        <DrawerSection title="Pauta"><p className="fontsize-x-regular" style={{ margin: 0 }}>Report de segurança</p></DrawerSection>
      </Drawer>
    </ToastProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

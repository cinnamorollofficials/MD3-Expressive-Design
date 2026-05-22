import { useState } from 'react';
import {
  List, ListItem, Divider, Carousel, Icon, IconButton,
  Avatar, AvatarGroup, Breadcrumbs, EmptyState, Skeleton, Stepper, Pagination,
  Timeline, DataTable, Accordion, Tree, Button,
  type DataTableColumn,
} from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

interface Person { id: number; name: string; role: string; status: 'active' | 'invited' | 'paused'; lastSeen: string; }
const PEOPLE: Person[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', status: 'active', lastSeen: '2 min ago' },
  { id: 2, name: 'Grace Hopper', role: 'Architect', status: 'active', lastSeen: '14 min ago' },
  { id: 3, name: 'Alan Turing', role: 'Researcher', status: 'paused', lastSeen: 'Yesterday' },
  { id: 4, name: 'Hedy Lamarr', role: 'Inventor', status: 'invited', lastSeen: '—' },
];

const COLUMNS: DataTableColumn<Person>[] = [
  { id: 'name', header: 'Name', sortable: true, sortValue: r => r.name },
  { id: 'role', header: 'Role', sortable: true, sortValue: r => r.role },
  {
    id: 'status', header: 'Status', sortable: true, sortValue: r => r.status,
    cell: r => <span style={{ textTransform: 'capitalize' }}>{r.status}</span>,
  },
  { id: 'lastSeen', header: 'Last seen', align: 'right' },
];

export function ContentPage({ activeComponent }: { activeComponent?: string }) {
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(3);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set([2]));
  const [treeSelected, setTreeSelected] = useState<string | null>('src/index.ts');

  const showAll = !activeComponent;

  return (
    <>
      <PageTitle title="Content" subtitle="Lists, tables, timelines, and structural content components." />

      {(showAll || activeComponent === 'avatar') && (
        <DemoSection
          title="Avatars"
          description="Square or circular avatars in five sizes, with image, initial, and icon fallbacks. Stack with AvatarGroup."
          code={`<Avatar name="Ada Lovelace" />
<Avatar src="..." />
<AvatarGroup max={3} items={[...]} />`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Avatar name="Ada Lovelace" size="sm" />
            <Avatar name="Grace Hopper" />
            <Avatar name="Alan Turing" size="lg" tone={3} />
            <Avatar icon="person" size="xl" />
            <AvatarGroup max={3}>
              <Avatar name="Ada Lovelace" />
              <Avatar name="Grace Hopper" />
              <Avatar name="Alan Turing" />
              <Avatar name="Hedy Lamarr" />
              <Avatar name="Margaret Hamilton" />
            </AvatarGroup>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'breadcrumbs') && (
        <DemoSection
          title="Breadcrumbs"
          code={`<Breadcrumbs items={[{label:'Library'},{label:'Components'},{label:'Content'}]} />`}
        >
          <Breadcrumbs items={[
            { label: 'Library', icon: 'home', onClick: () => {} },
            { label: 'Components', onClick: () => {} },
            { label: 'Content' },
          ]} />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'stepper') && (
        <DemoSection
          title="Stepper"
          description="Linear stepper with three numbered steps. Click a completed step to jump back."
          code={`<Stepper current={1} steps={[{label:'Cart'},{label:'Shipping'},{label:'Payment'}]} onChange={setStep} />`}
        >
          <div style={{ width: '100%', maxWidth: 560 }}>
            <Stepper
              current={step}
              onChange={setStep}
              steps={[
                { label: 'Cart' },
                { label: 'Shipping', optional: 'Address & method' },
                { label: 'Payment' },
                { label: 'Review' },
              ]}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button variant="text" onClick={() => setStep(Math.max(0, step - 1))}>Back</Button>
              <Button onClick={() => setStep(Math.min(3, step + 1))}>Continue</Button>
            </div>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'pagination') && (
        <DemoSection
          title="Pagination"
          code={`<Pagination page={page} pageCount={12} onChange={setPage} />`}
        >
          <Pagination page={page} pageCount={12} onChange={setPage} />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'skeleton') && (
        <DemoSection
          title="Skeleton"
          description="Placeholder shapes used while content is loading."
          code={`<Skeleton variant="text" />
<Skeleton variant="rounded" height={120} />`}
        >
          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton variant="rounded" height={120} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Skeleton variant="circular" width={40} height={40} />
              <div style={{ flex: 1 }}>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="50%" />
              </div>
            </div>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'empty-state') && (
        <DemoSection
          title="Empty state"
          code={`<EmptyState icon="inbox" title="No messages yet" description="..." actions={<Button>Compose</Button>} />`}
        >
          <EmptyState
            icon="inbox"
            title="No messages yet"
            description="When someone sends you a message, you'll see it here."
            actions={<Button>Compose</Button>}
          />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'data-table') && (
        <DemoSection
          title="Data table"
          description="Sortable columns, row selection, and dense mode. Click a header to cycle asc → desc → unsorted."
          code={`<DataTable columns={cols} rows={rows} selected={sel} onSelectedChange={setSel} />`}
        >
          <DataTable
            columns={COLUMNS}
            rows={PEOPLE}
            rowKey={r => r.id}
            selected={selectedRows}
            onSelectedChange={setSelectedRows}
            ariaLabel="People"
          />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'timeline') && (
        <DemoSection
          title="Timeline"
          description="Vertical activity feed with tone-coded markers."
          code={`<Timeline items={[{title:'Order placed', meta:'2 min ago', tone:'success'}, ...]} />`}
        >
          <div style={{ width: '100%', maxWidth: 520 }}>
            <Timeline
              items={[
                { id: 1, title: 'Order placed', meta: '2 min ago', tone: 'success', icon: 'shopping_cart', content: 'Order #4821 confirmed.' },
                { id: 2, title: 'Payment captured', meta: '1 min ago', tone: 'primary', icon: 'credit_card' },
                { id: 3, title: 'Preparing shipment', meta: 'just now', icon: 'inventory_2' },
                { id: 4, title: 'Awaiting carrier pickup', meta: '—' },
              ]}
            />
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'accordion') && (
        <DemoSection
          title="Accordion"
          code={`<Accordion items={[{id:'a', title:'Shipping', content:'...'}, ...]} />`}
        >
          <div style={{ width: '100%', maxWidth: 520 }}>
            <Accordion
              items={[
                { id: 'a', title: 'Shipping & returns', supporting: 'Free for orders over $50', icon: 'local_shipping', content: 'Orders ship within 1–2 business days. Returns accepted within 30 days.' },
                { id: 'b', title: 'Sizing', icon: 'straighten', content: 'Refer to the size guide on each product page for measurements.' },
                { id: 'c', title: 'Care instructions', icon: 'dry_cleaning', content: 'Machine wash cold, tumble dry low. Do not bleach.' },
              ]}
            />
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'tree') && (
        <DemoSection
          title="Tree"
          description="Hierarchical list with keyboard navigation (Arrow keys, Enter)."
          code={`<Tree nodes={nodes} onSelect={id => ...} />`}
        >
          <div style={{ width: '100%', maxWidth: 360, padding: 8, background: 'var(--md-sys-color-surface-container-low)', borderRadius: 12 }}>
            <Tree
              ariaLabel="Project files"
              defaultExpanded={['src', 'src/components']}
              selected={treeSelected}
              onSelect={id => setTreeSelected(id)}
              nodes={[
                {
                  id: 'src', label: 'src', children: [
                    { id: 'src/index.ts', label: 'index.ts', icon: 'description' },
                    {
                      id: 'src/components', label: 'components', children: [
                        { id: 'src/components/Button.tsx', label: 'Button.tsx', icon: 'code' },
                        { id: 'src/components/Card.tsx', label: 'Card.tsx', icon: 'code' },
                      ],
                    },
                    { id: 'src/styles.css', label: 'styles.css', icon: 'css' },
                  ],
                },
                { id: 'package.json', label: 'package.json', icon: 'description' },
                { id: 'README.md', label: 'README.md', icon: 'description' },
              ]}
            />
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'list') && (
        <DemoSection
          title="Lists"
          description="One-, two-, and three-line list items."
          code={`<List>
  <ListItem headline="Item" leading={<Icon name="folder" />} trailing={<Icon name="chevron_right"/>} />
</List>`}
        >
          <div style={{ width: '100%', maxWidth: 480, background: 'var(--md-sys-color-surface-container-low)', borderRadius: 12, padding: 8 }}>
            <List>
              <ListItem headline="One-line list item" leading={<Icon name="folder" />} trailing={<Icon name="chevron_right" />} onClick={() => {}} />
              <Divider />
              <ListItem headline="Two-line item" supporting="Supporting line of text" leading={<Icon name="image" />} onClick={() => {}} />
              <Divider />
              <ListItem
                headline="Three-line item"
                overline="Overline"
                supporting="Supporting text that can wrap onto a second line if needed."
                leading={<Icon name="article" />}
                trailing={<IconButton icon="more_vert" label="More" />}
              />
            </List>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'divider') && (
        <DemoSection
          title="Divider"
          code={`<Divider />
<Divider inset />`}
        >
          <div style={{ width: 300 }}>
            <div>Above</div>
            <Divider />
            <div>Between</div>
            <Divider inset />
            <div>Below</div>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'carousel') && (
        <DemoSection
          title="Carousel"
          description="Uncontained, hero, and multi-browse layouts."
          code={`<Carousel variant="hero" items={items} />`}
        >
          <div style={{ width: '100%' }}>
            <h4 style={{ margin: '0 0 8px', font: 'var(--md-sys-typescale-title-medium)' }}>Hero</h4>
            <Carousel
              variant="hero"
              items={Array.from({ length: 6 }, (_, i) => ({
                id: i,
                image: `https://picsum.photos/seed/hero-${i}/600/800`,
                label: `Story ${i + 1}`,
              }))}
            />
            <h4 style={{ margin: '16px 0 8px', font: 'var(--md-sys-typescale-title-medium)' }}>Multi-browse</h4>
            <Carousel
              variant="multibrowse"
              items={Array.from({ length: 10 }, (_, i) => ({
                id: i,
                image: `https://picsum.photos/seed/mb-${i}/320/400`,
              }))}
            />
          </div>
        </DemoSection>
      )}
    </>
  );
}

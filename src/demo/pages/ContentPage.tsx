import { useState } from 'react';
import {
  List, ListItem, Divider, Carousel, Icon, IconButton,
  Avatar, AvatarGroup, Breadcrumbs, EmptyState, Skeleton, Stepper, Pagination,
  Timeline, DataTable, Accordion, Tree, Button, Chip,
  type DataTableColumn, type DataTableVariant, type DataTableDensity,
} from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

interface ExtendedPerson {
  id: number;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'invited' | 'paused';
  email: string;
  salary: number;
  lastSeen: string;
}

const EXTENDED_PEOPLE: ExtendedPerson[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', department: 'Core AI', status: 'active', email: 'ada@example.com', salary: 145000, lastSeen: '2 min ago' },
  { id: 2, name: 'Grace Hopper', role: 'Architect', department: 'Systems', status: 'active', email: 'grace@example.com', salary: 160000, lastSeen: '14 min ago' },
  { id: 3, name: 'Alan Turing', role: 'Researcher', department: 'Algorithms', status: 'paused', email: 'alan@example.com', salary: 155000, lastSeen: 'Yesterday' },
  { id: 4, name: 'Hedy Lamarr', role: 'Inventor', department: 'Wireless', status: 'invited', email: 'hedy@example.com', salary: 135000, lastSeen: '—' },
  { id: 5, name: 'Katherine Johnson', role: 'Mathematician', department: 'Orbitals', status: 'active', email: 'katherine@example.com', salary: 150000, lastSeen: '1 hour ago' },
  { id: 6, name: 'Margaret Hamilton', role: 'Software Lead', department: 'Apollo', status: 'active', email: 'margaret@example.com', salary: 165000, lastSeen: 'Just now' },
  { id: 7, name: 'Linus Torvalds', role: 'Kernel Dev', department: 'OS', status: 'active', email: 'linus@example.com', salary: 170000, lastSeen: '5 min ago' },
  { id: 8, name: 'Tim Berners-Lee', role: 'Web Lead', department: 'Standards', status: 'paused', email: 'tim@example.com', salary: 140000, lastSeen: '3 days ago' },
];

interface FileTreeNode {
  id: string;
  name: string;
  owner: string;
  size: string;
  modified: string;
  children?: FileTreeNode[];
}

const TREE_DATA: FileTreeNode[] = [
  {
    id: 'src',
    name: 'src',
    owner: 'Ada Lovelace',
    size: '—',
    modified: 'Today, 10:45 AM',
    children: [
      { id: 'src-components', name: 'components', owner: 'Grace Hopper', size: '—', modified: 'Yesterday', children: [
        { id: 'src-comp-table', name: 'DataTable.tsx', owner: 'Grace Hopper', size: '8.4 KB', modified: 'Just now' },
        { id: 'src-comp-card', name: 'Card.tsx', owner: 'Alan Turing', size: '3.1 KB', modified: '2 days ago' },
      ]},
      { id: 'src-utils', name: 'utils.ts', owner: 'Linus Torvalds', size: '1.2 KB', modified: '3 days ago' },
    ],
  },
  {
    id: 'public',
    name: 'public',
    owner: 'Hedy Lamarr',
    size: '—',
    modified: 'Last week',
    children: [
      { id: 'pub-logo', name: 'logo.svg', owner: 'Hedy Lamarr', size: '14.2 KB', modified: 'Last week' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Dedicated Examples for DataTable Variants & Features                      */
/* -------------------------------------------------------------------------- */

function DataTableOutlinedDemo() {
  const columns: DataTableColumn<ExtendedPerson>[] = [
    { id: 'name', header: 'Name', sortable: true, sortValue: r => r.name },
    { id: 'role', header: 'Role' },
    { id: 'department', header: 'Department' },
    { id: 'salary', header: 'Salary', numeric: true, cell: r => `$${r.salary.toLocaleString()}` },
  ];
  return <DataTable columns={columns} rows={EXTENDED_PEOPLE.slice(0, 4)} rowKey={r => r.id} variant="outlined" />;
}

function DataTableStripedDemo() {
  const columns: DataTableColumn<ExtendedPerson>[] = [
    { id: 'name', header: 'Name', sortable: true, sortValue: r => r.name },
    { id: 'role', header: 'Role' },
    { id: 'department', header: 'Department' },
    { id: 'salary', header: 'Salary', numeric: true, cell: r => `$${r.salary.toLocaleString()}` },
  ];
  return <DataTable columns={columns} rows={EXTENDED_PEOPLE.slice(0, 4)} rowKey={r => r.id} variant="striped" />;
}

function DataTableDensityDemo() {
  const columns: DataTableColumn<ExtendedPerson>[] = [
    { id: 'name', header: 'Name' },
    { id: 'role', header: 'Role' },
    { id: 'department', header: 'Department' },
    { id: 'salary', header: 'Salary', numeric: true, cell: r => `$${r.salary.toLocaleString()}` },
  ];
  const sample = EXTENDED_PEOPLE.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: 600 }}>Comfortable Density (`density="comfortable"`)</h4>
        <DataTable columns={columns} rows={sample} rowKey={r => r.id} variant="outlined" density="comfortable" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: 600 }}>Medium Density (`density="medium"`)</h4>
        <DataTable columns={columns} rows={sample} rowKey={r => r.id} variant="outlined" density="medium" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: 600 }}>Compact Density (`density="compact"`)</h4>
        <DataTable columns={columns} rows={sample} rowKey={r => r.id} variant="outlined" density="compact" />
      </div>
    </div>
  );
}

function DataTableSearchPaginationDemo() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const columns: DataTableColumn<ExtendedPerson>[] = [
    { id: 'name', header: 'Name', sortable: true, sortValue: r => r.name },
    { id: 'role', header: 'Role', sortable: true, sortValue: r => r.role },
    { id: 'department', header: 'Department' },
    { id: 'email', header: 'Email' },
    { id: 'salary', header: 'Salary', numeric: true, sortable: true, sortValue: r => r.salary, cell: r => `$${r.salary.toLocaleString()}` },
  ];

  return (
    <DataTable
      columns={columns}
      rows={EXTENDED_PEOPLE}
      rowKey={r => r.id}
      variant="outlined"
      searchable={{ title: 'Team Directory', placeholder: 'Search by name, role, email...' }}
      pagination={{
        page,
        pageSize,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
        pageSizeOptions: [4, 8],
      }}
    />
  );
}

function DataTableSelectionExpandableDemo() {
  const [selected, setSelected] = useState<Set<string | number>>(new Set([1, 2]));

  const columns: DataTableColumn<ExtendedPerson>[] = [
    { id: 'name', header: 'Name', sortable: true, sortValue: r => r.name },
    { id: 'role', header: 'Role' },
    { id: 'department', header: 'Department' },
    { id: 'status', header: 'Status', cell: r => <Chip label={r.status} /> },
  ];

  return (
    <DataTable
      columns={columns}
      rows={EXTENDED_PEOPLE.slice(0, 4)}
      rowKey={r => r.id}
      variant="outlined"
      selected={selected}
      onSelectedChange={setSelected}
      bulkActions={[
        { id: 'export', label: 'Export Selected', icon: 'download', onClick: keys => alert(`Exporting ${keys.size} items`) },
        { id: 'delete', label: 'Delete Selected', icon: 'delete', tone: 'danger', onClick: keys => setSelected(new Set()) },
      ]}
      expandableRow={{
        renderDetail: row => (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Avatar name={row.name} size="lg" />
            <div>
              <div style={{ fontWeight: 600 }}>{row.name} ({row.role})</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Email: {row.email} | Dept: {row.department} | Salary: ${row.salary.toLocaleString()}
              </div>
            </div>
          </div>
        ),
      }}
    />
  );
}

function DataTableTreeDemo() {
  const columns: DataTableColumn<FileTreeNode>[] = [
    { id: 'name', header: 'File / Folder Name', width: '240px' },
    { id: 'owner', header: 'Owner' },
    { id: 'size', header: 'Size', align: 'right' },
    { id: 'modified', header: 'Last Modified', align: 'right' },
  ];

  return (
    <DataTable
      columns={columns}
      rows={TREE_DATA}
      rowKey={r => r.id}
      treeMode
      variant="outlined"
    />
  );
}

function DataTableInlineEditDemo() {
  const [data, setData] = useState(EXTENDED_PEOPLE.slice(0, 4));

  const columns: DataTableColumn<ExtendedPerson>[] = [
    { id: 'name', header: 'Name (Pinned Left)', pinned: 'left', width: '160px' },
    { id: 'role', header: 'Role (Double click to edit)', editable: true },
    { id: 'email', header: 'Email (Double click to edit)', editable: true },
    { id: 'salary', header: 'Salary', numeric: true, cell: r => `$${r.salary.toLocaleString()}` },
  ];

  const handleCellEdit = (row: ExtendedPerson, colId: string, newVal: any) => {
    setData(prev => prev.map(p => p.id === row.id ? { ...p, [colId]: newVal } : p));
  };

  return (
    <DataTable
      columns={columns}
      rows={data}
      rowKey={r => r.id}
      variant="outlined"
      resizableColumns
      onCellEdit={handleCellEdit}
    />
  );
}



interface TransactionRecord {
  id: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
}

const TRANSACTIONS: TransactionRecord[] = [
  { id: 'TX-1001', customer: 'Ada Lovelace', amount: 3450.00, status: 'completed', date: new Date('2026-07-22T10:30:00') },
  { id: 'TX-1002', customer: 'Grace Hopper', amount: 1200.50, status: 'completed', date: new Date('2026-07-20T14:15:00') },
  { id: 'TX-1003', customer: 'Alan Turing', amount: 890.00, status: 'pending', date: new Date('2026-07-15T09:45:00') },
  { id: 'TX-1004', customer: 'Hedy Lamarr', amount: 2400.00, status: 'completed', date: new Date('2026-07-10T16:20:00') },
  { id: 'TX-1005', customer: 'Katherine Johnson', amount: 5600.00, status: 'completed', date: new Date('2026-07-01T11:10:00') },
  { id: 'TX-1006', customer: 'Linus Torvalds', amount: 1750.25, status: 'failed', date: new Date('2026-06-25T13:00:00') },
];

function DataTableDateRangeDemo() {
  const [startDate, setStartDate] = useState<Date | null>(new Date('2026-07-10'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2026-07-22'));

  const columns: DataTableColumn<TransactionRecord>[] = [
    { id: 'id', header: 'Transaction ID', width: '140px' },
    { id: 'customer', header: 'Customer Name', sortable: true, sortValue: r => r.customer },
    { id: 'date', header: 'Timestamp', sortable: true, sortValue: r => r.date, cell: r => r.date.toLocaleString() },
    {
      id: 'status',
      header: 'Status',
      cell: r => (
        <Chip
          label={r.status}
        />
      ),
    },
    { id: 'amount', header: 'Amount', numeric: true, sortable: true, sortValue: r => r.amount, cell: r => `$${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      {/* Quick Preset Buttons */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Quick Presets:</span>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => {
            const today = new Date();
            setStartDate(today);
            setEndDate(today);
          }}
        >
          Today
        </Button>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 7);
            setStartDate(start);
            setEndDate(end);
          }}
        >
          Last 7 Days
        </Button>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 30);
            setStartDate(start);
            setEndDate(end);
          }}
        >
          Last 30 Days
        </Button>
        <Button
          size="sm"
          variant="text"
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
          }}
        >
          Reset All
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={TRANSACTIONS}
        rowKey={r => r.id}
        variant="outlined"
        searchable={{ title: 'Financial Audit Log', placeholder: 'Search transaction ID or customer...' }}
        dateRangeFilter={{
          columnId: 'date',
          startDate,
          endDate,
          onStartDateChange: setStartDate,
          onEndDateChange: setEndDate,
        }}
      />
    </div>
  );
}


export function ContentPage({ activeComponent }: { activeComponent?: string }) {
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(3);
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
          description="Navigational trail showing page hierarchy."
          code={`<Breadcrumbs items={[{label:'Home', href:'#'}, {label:'Products', href:'#'}, {label:'Laptops'}]} />`}
        >
          <Breadcrumbs
            items={[
              { label: 'Home', href: '#' },
              { label: 'Components', href: '#' },
              { label: 'Content', href: '#' },
              { label: 'Data table' },
            ]}
          />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'stepper') && (
        <DemoSection
          title="Stepper"
          description="Horizontal step progress indicator."
          code={`<Stepper steps={[{label:'Cart'}, {label:'Shipping'}, {label:'Payment'}, {label:'Review'}]} current={step} onChange={setStep} />`}
        >
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Stepper
              steps={[
                { label: 'Cart' },
                { label: 'Shipping' },
                { label: 'Payment' },
                { label: 'Review' },
              ]}
              current={step}
              onChange={setStep}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button disabled={step <= 0} onClick={() => setStep(s => s - 1)}>Back</Button>
              <Button disabled={step >= 3} variant="filled" onClick={() => setStep(s => s + 1)}>Next</Button>
            </div>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'pagination') && (
        <DemoSection
          title="Pagination"
          description="Page controls with auto-collapsing ellipsis for long ranges."
          code={`<Pagination page={page} pageCount={10} onChange={setPage} />`}
        >
          <Pagination page={page} pageCount={10} onChange={setPage} />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'skeleton') && (
        <DemoSection
          title="Skeleton"
          description="Shimmering loading placeholders matching surface geometry."
          code={`<Skeleton variant="rounded" height={140} />`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
            <Skeleton variant="rounded" height={140} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="50%" />
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'empty-state') && (
        <DemoSection
          title="Empty state"
          description="Clear empty states with illustration icon, title, description, and call to action."
          code={`<EmptyState icon="inbox" title="No messages" description="..." actions={<Button>Compose</Button>} />`}
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
        <>
          <DemoSection
            title="Data table — Outlined variant"
            description="Cell borders and outer container outline following Material 3 surface guidelines."
            code={`<DataTable variant="outlined" columns={columns} rows={rows} />`}
          >
            <DataTableOutlinedDemo />
          </DemoSection>

          <DemoSection
            title="Data table — Striped variant"
            description="Alternating subtle surface tint background on even rows for improved horizontal scannability."
            code={`<DataTable variant="striped" columns={columns} rows={rows} />`}
          >
            <DataTableStripedDemo />
          </DemoSection>

          <DemoSection
            title="Data table — Row density (Comfortable, Medium, Compact)"
            description="Adjust padding height for high data density or touch-friendly comfortable rows."
            code={`<DataTable density="comfortable" columns={columns} rows={rows} />
<DataTable density="medium" columns={columns} rows={rows} />
<DataTable density="compact" columns={columns} rows={rows} />`}
          >
            <DataTableDensityDemo />
          </DemoSection>

          <DemoSection
            title="Data table — Search toolbar & Pagination"
            description="Top search input toolbar with real-time filtering and footer pagination bar."
            code={`<DataTable
  variant="outlined"
  searchable={{ title: 'Team Directory', placeholder: 'Search...' }}
  pagination={{ page, pageSize, onPageChange: setPage, onPageSizeChange: setPageSize }}
  columns={columns}
  rows={rows}
/>`}
          >
            <DataTableSearchPaginationDemo />
          </DemoSection>

          <DemoSection
            title="Data table — Datetime Range Filter"
            description="Filter timestamp/date columns with start and end date pickers, real-time bounding, and quick date range presets."
            code={`<DataTable
  variant="outlined"
  searchable={{ title: 'Financial Audit Log' }}
  dateRangeFilter={{
    columnId: 'date',
    startDate,
    endDate,
    onStartDateChange: setStartDate,
    onEndDateChange: setEndDate,
  }}
  columns={columns}
  rows={rows}
/>`}
          >
            <DataTableDateRangeDemo />
          </DemoSection>

          <DemoSection
            title="Data table — Row selection & Floating bulk actions"
            description="Leading row checkboxes and a floating action bar when 1 or more rows are selected."
            code={`<DataTable
  variant="outlined"
  selected={selectedKeys}
  onSelectedChange={setSelectedKeys}
  bulkActions={[
    { id: 'export', label: 'Export Selected', icon: 'download', onClick: handleExport },
    { id: 'delete', label: 'Delete Selected', icon: 'delete', tone: 'danger', onClick: handleDelete },
  ]}
  columns={columns}
  rows={rows}
/>`}
          >
            <DataTableSelectionExpandableDemo />
          </DemoSection>

          <DemoSection
            title="Data table — Tree View (Hierarchical Data)"
            description="Render nested parent-child rows with expand/collapse folder controls and level indentation."
            code={`<DataTable
  treeMode
  variant="outlined"
  columns={fileColumns}
  rows={treeData}
/>`}
          >
            <DataTableTreeDemo />
          </DemoSection>

          <DemoSection
            title="Data table — Pinned columns & Inline cell editing"
            description="Freeze columns during horizontal scroll, drag column borders to resize, and double-click to edit cell values inline."
            code={`<DataTable
  variant="outlined"
  resizableColumns
  onCellEdit={(row, colId, newVal) => updateRow(row, colId, newVal)}
  columns={[
    { id: 'name', header: 'Name (Pinned Left)', pinned: 'left' },
    { id: 'role', header: 'Role (Editable)', editable: true },
    { id: 'email', header: 'Email (Editable)', editable: true },
  ]}
  rows={rows}
/>`}
          >
            <DataTableInlineEditDemo />
          </DemoSection>
        </>
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
          description="Collapsible content panels for expanding details."
          code={`<Accordion items={[{id:'1', title:'Section 1', content:'...'}]} />`}
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

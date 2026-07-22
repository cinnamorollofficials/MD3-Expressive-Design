import { useMemo, useState } from 'react';
import {
  TopAppBar, IconButton, Tooltip, Menu, Icon, Tabs, Chip, Button,
  Avatar, AvatarGroup, Breadcrumbs, Banner, Stepper, Timeline,
  Accordion, DataTable, Tree, Rating, Pagination, EmptyState,
  Card, CardContent, CardTitle, CardBody,
  List, ListItem, Divider, Snackbar, Badge, ProgressIndicator,
  type DataTableColumn,
} from '../../lib';
import { cn } from '../../lib/utils/cn';
import { ExampleSourceSheet } from '../components/ExampleSourceSheet';
import pageSource from './CompanyProfilePage.tsx?raw';
import styleSource from './CompanyProfilePage.module.css?raw';
import styles from './CompanyProfilePage.module.css';

// ---------------------- mock data ----------------------

const COMPANY = {
  name: 'Acme Robotics',
  tagline: 'Building cooperative machines for everyone.',
  hero: 'https://picsum.photos/seed/acme-hero/1600/400',
  industry: 'Robotics & Hardware',
  size: '420 employees',
  hq: 'San Francisco, CA',
  founded: 2014,
  website: 'acme.example.com',
  verified: true,
  rating: 4.3,
  reviewCount: 287,
};

const KPIS = [
  { key: 'employees', label: 'Employees',  value: '420',  icon: 'group',       trend: '+18 this quarter' },
  { key: 'revenue',   label: 'ARR',        value: '$48M', icon: 'payments',    trend: '+22% YoY' },
  { key: 'founded',   label: 'Founded',    value: '2014', icon: 'history_edu', trend: '11 years strong' },
  { key: 'sites',     label: 'Locations',  value: '6',    icon: 'place',       trend: '3 continents' },
];

const MILESTONES = [
  { label: 'Founded' },
  { label: 'Seed', optional: '$2M' },
  { label: 'Series A', optional: '$15M' },
  { label: 'Series B', optional: '$40M' },
  { label: 'IPO', optional: 'Target 2027' },
];

const ACTIVITY = [
  { id: 1, title: 'Closed Series B funding round', meta: 'Mar 2026', tone: 'success' as const, icon: 'rocket_launch',
    content: 'Led by Lightspeed with participation from existing investors.' },
  { id: 2, title: 'Acquired SwiftGrip Robotics',   meta: 'Jan 2026', tone: 'primary' as const, icon: 'handshake',
    content: 'Brought 38 engineers in haptics and end-effector design onboard.' },
  { id: 3, title: 'Opened Tokyo office',            meta: 'Oct 2025', tone: 'primary' as const, icon: 'place' },
  { id: 4, title: 'Reached 100k units shipped',     meta: 'Jun 2025', tone: 'success' as const, icon: 'inventory_2' },
  { id: 5, title: 'Launched ACME-7 platform',       meta: 'Mar 2025', icon: 'memory' },
];

const FAQ = [
  { id: 'who', title: 'Who do you sell to?', icon: 'business',
    content: 'Mid-market manufacturers and university research labs. We do not currently sell directly to consumers.' },
  { id: 'remote', title: 'Is the company remote-friendly?', icon: 'home_work',
    content: 'Engineering and design roles are hybrid (2 days/week in office). Manufacturing roles are fully on-site.' },
  { id: 'open', title: 'Are you hiring?', icon: 'work',
    content: '23 roles open across engineering, design, and operations. See the careers page for current postings.' },
  { id: 'press', title: 'Media & press contact', icon: 'campaign',
    content: 'Reach our communications team at press@acme.example.com — we typically respond within one business day.' },
];

interface Member { id: number; name: string; role: string; department: 'Engineering' | 'Design' | 'Operations' | 'Sales'; joined: string; tenure: number; }
const MEMBERS: Member[] = [
  { id: 1, name: 'Ada Lovelace',     role: 'CTO',                department: 'Engineering', joined: 'Jan 2014', tenure: 11.4 },
  { id: 2, name: 'Grace Hopper',     role: 'VP Engineering',     department: 'Engineering', joined: 'Mar 2015', tenure: 10.2 },
  { id: 3, name: 'Hedy Lamarr',      role: 'Head of Design',     department: 'Design',      joined: 'Aug 2016', tenure: 9.7 },
  { id: 4, name: 'Alan Turing',      role: 'Principal Engineer', department: 'Engineering', joined: 'Feb 2017', tenure: 9.3 },
  { id: 5, name: 'Margaret Hamilton',role: 'COO',                department: 'Operations',  joined: 'Jun 2018', tenure: 7.9 },
  { id: 6, name: 'Katherine Johnson',role: 'VP Sales',           department: 'Sales',       joined: 'Nov 2019', tenure: 6.5 },
  { id: 7, name: 'Linus Torvalds',   role: 'Staff Engineer',     department: 'Engineering', joined: 'Apr 2021', tenure: 5.1 },
  { id: 8, name: 'Sandi Metz',       role: 'Engineering Lead',   department: 'Engineering', joined: 'Sep 2022', tenure: 3.7 },
];

const MEMBER_COLUMNS: DataTableColumn<Member>[] = [
  {
    id: 'name', header: 'Name', sortable: true, sortValue: r => r.name,
    cell: r => (
      <span className={styles.cellPerson}>
        <Avatar name={r.name} size="sm" tone={((r.id - 1) % 4 + 1) as 1 | 2 | 3 | 4} />
        <span>{r.name}</span>
      </span>
    ),
  },
  { id: 'role', header: 'Role', sortable: true, sortValue: r => r.role },
  {
    id: 'department', header: 'Department', sortable: true, sortValue: r => r.department,
    cell: r => <Chip kind="suggestion" label={r.department} />,
  },
  { id: 'joined', header: 'Joined', sortable: true, sortValue: r => r.tenure },
];

type ProjectStatus = 'Active' | 'Shipped' | 'Planning' | 'On hold';
interface Project { id: string; name: string; lead: string; status: ProjectStatus; progress: number; due: string; }
const PROJECTS: Project[] = [
  { id: 'P-118', name: 'ACME-8 platform',        lead: 'Ada Lovelace',   status: 'Active',   progress: 72, due: 'Q3 2026' },
  { id: 'P-117', name: 'Tokyo expansion',         lead: 'Margaret H.',    status: 'Active',   progress: 45, due: 'Q4 2026' },
  { id: 'P-116', name: 'SwiftGrip integration',   lead: 'Grace Hopper',   status: 'Active',   progress: 88, due: 'Q2 2026' },
  { id: 'P-115', name: 'Internal tooling refresh',lead: 'Sandi Metz',     status: 'Planning', progress:  8, due: 'Q1 2027' },
  { id: 'P-114', name: 'Brand refresh',           lead: 'Hedy Lamarr',    status: 'On hold',  progress: 30, due: 'TBD' },
  { id: 'P-113', name: 'Vision-7 module',         lead: 'Alan Turing',    status: 'Shipped',  progress:100, due: 'Mar 2026' },
  { id: 'P-112', name: 'Channel partner program', lead: 'Katherine J.',   status: 'Shipped',  progress:100, due: 'Feb 2026' },
  { id: 'P-111', name: 'Manufacturing line #3',   lead: 'Margaret H.',    status: 'Shipped',  progress:100, due: 'Jan 2026' },
];
const PAGE_SIZE = 5;

const projectStatusTone: Record<ProjectStatus, string> = {
  Active: styles.statusActive,
  Shipped: styles.statusShipped,
  Planning: styles.statusPlanning,
  'On hold': styles.statusHold,
};

const PROJECT_COLUMNS: DataTableColumn<Project>[] = [
  { id: 'name', header: 'Project', sortable: true, sortValue: r => r.name,
    cell: r => (
      <span>
        <div style={{ font: 'var(--md-sys-typescale-body-medium)' }}>{r.name}</div>
        <div className={styles.subtle}>{r.id} · {r.lead}</div>
      </span>
    ),
  },
  { id: 'status', header: 'Status', sortable: true, sortValue: r => r.status,
    cell: r => <span className={cn(styles.statusPill, projectStatusTone[r.status])}>{r.status}</span>,
  },
  { id: 'progress', header: 'Progress', numeric: true, sortable: true, sortValue: r => r.progress,
    cell: r => (
      <div className={styles.progressCell}>
        <ProgressIndicator value={r.progress} />
        <span>{r.progress}%</span>
      </div>
    ),
  },
  { id: 'due', header: 'Due', sortable: true, sortValue: r => r.due },
];

const CONTACTS = [
  { name: 'Lin Chen',     role: 'Account Executive',  email: 'lin@acme.example.com',     tone: 1 as const },
  { name: 'Omar Reyes',   role: 'Customer Success',   email: 'omar@acme.example.com',    tone: 2 as const },
  { name: 'Priya Shah',   role: 'Press contact',      email: 'press@acme.example.com',   tone: 3 as const },
];

const LOCATIONS = [
  { city: 'San Francisco', label: 'HQ',          headcount: 198, icon: 'place' },
  { city: 'New York',      label: 'East Coast',  headcount:  64, icon: 'place' },
  { city: 'Austin',        label: 'Manufacturing', headcount: 78, icon: 'factory' },
  { city: 'London',        label: 'EMEA',        headcount:  42, icon: 'place' },
  { city: 'Tokyo',         label: 'APAC',        headcount:  28, icon: 'place' },
  { city: 'Berlin',        label: 'R&D',         headcount:  10, icon: 'science' },
];

// Tree of public documents
const DOC_TREE = [
  {
    id: 'public', label: 'Public',
    children: [
      { id: 'public/overview.pdf', label: 'Company overview.pdf', icon: 'description' },
      { id: 'public/pitch-deck.pdf', label: 'Pitch deck Q2.pdf', icon: 'slideshow' },
      { id: 'public/brand', label: 'Brand kit',
        children: [
          { id: 'public/brand/logo.svg',     label: 'Logo.svg',     icon: 'image' },
          { id: 'public/brand/guidelines.pdf', label: 'Guidelines.pdf', icon: 'menu_book' },
        ],
      },
    ],
  },
  {
    id: 'press', label: 'Press',
    children: [
      { id: 'press/2026-series-b.pdf', label: '2026-series-b.pdf', icon: 'description' },
      { id: 'press/founder-bios.pdf',  label: 'Founder bios.pdf',  icon: 'description' },
    ],
  },
  { id: 'media', label: 'Media kit (zip)', icon: 'folder_zip' },
];

const DOC_PREVIEW: Record<string, { title: string; size: string; updated: string; summary: string }> = {
  'public/overview.pdf':         { title: 'Company overview',     size: '2.4 MB',  updated: 'Apr 12, 2026', summary: 'High-level introduction to Acme Robotics, our markets, and our product portfolio.' },
  'public/pitch-deck.pdf':       { title: 'Pitch deck — Q2 2026', size: '8.1 MB',  updated: 'Apr 02, 2026', summary: 'Investor-facing deck used during the Series B round.' },
  'public/brand/logo.svg':       { title: 'Logo (SVG)',           size: '12 KB',   updated: 'Sep 18, 2025', summary: 'Primary mark in vector format. Use on light backgrounds.' },
  'public/brand/guidelines.pdf': { title: 'Brand guidelines',     size: '4.7 MB',  updated: 'Sep 18, 2025', summary: 'Voice, color, typography, and logo usage.' },
  'press/2026-series-b.pdf':     { title: 'Series B announcement',size: '780 KB',  updated: 'Mar 14, 2026', summary: 'Official press release covering the Series B funding announcement.' },
  'press/founder-bios.pdf':      { title: 'Founder biographies',  size: '320 KB',  updated: 'Jan 30, 2026', summary: 'Press-ready short and long form bios for the founding team.' },
};

// ---------------------- page ----------------------

type TabId = 'overview' | 'team' | 'projects' | 'documents';

export function CompanyProfilePage() {
  const [tab, setTab] = useState<TabId>('overview');
  const [milestone, setMilestone] = useState(3);
  const [following, setFollowing] = useState(false);
  const [memberSel, setMemberSel] = useState<Set<string | number>>(new Set());
  const [deptFilter, setDeptFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [doc, setDoc] = useState<string | null>('public/overview.pdf');
  const [snack, setSnack] = useState<string | null>(null);
  const [sourceOpen, setSourceOpen] = useState(false);

  const filteredMembers = useMemo(
    () => deptFilter.length ? MEMBERS.filter(m => deptFilter.includes(m.department)) : MEMBERS,
    [deptFilter],
  );

  const projectsPage = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return PROJECTS.slice(start, start + PAGE_SIZE);
  }, [page]);
  const projectsPageCount = Math.ceil(PROJECTS.length / PAGE_SIZE);

  const docMeta = doc ? DOC_PREVIEW[doc] : null;

  const toggleDept = (d: string) =>
    setDeptFilter(f => f.includes(d) ? f.filter(x => x !== d) : [...f, d]);

  return (
    <div className={styles.page}>
      {/* Top app bar */}
      <TopAppBar
        variant="small"
        title={COMPANY.name}
        start={<IconButton icon="precision_manufacturing" label="Company" variant="tonal" />}
        end={
          <>
            <Button variant="tonal" size="sm" startIcon="code" onClick={() => setSourceOpen(true)}>View source</Button>
            <Tooltip label="Share"><IconButton icon="share" label="Share" /></Tooltip>
            <Tooltip label="Bookmark"><IconButton icon="bookmark_border" label="Bookmark" /></Tooltip>
            <Tooltip label="Notifications">
              <Badge count={3}><IconButton icon="notifications" label="Notifications" /></Badge>
            </Tooltip>
            <Menu
              trigger={(p) => <IconButton icon="more_vert" label="More" {...p} />}
              items={[
                { label: 'Report this page', icon: 'flag' },
                { label: 'Download as PDF', icon: 'download' },
                { divider: true, label: '' },
                { label: 'Manage access', icon: 'admin_panel_settings' },
              ]}
            />
          </>
        }
      />

      <Breadcrumbs items={[
        { label: 'Directory', icon: 'home', onClick: () => setSnack('Back to directory') },
        { label: 'Companies', onClick: () => setSnack('All companies') },
        { label: COMPANY.name },
      ]} />

      {/* Hero */}
      <div
        className={styles.hero}
        style={{ backgroundImage: `linear-gradient(0deg, var(--md-sys-color-surface) 0%, transparent 40%), url(${COMPANY.hero})` }}
      />

      {/* Identity card */}
      <Card variant="filled" className={styles.identity}>
        <div className={styles.identityAvatar}>
          <Avatar name={COMPANY.name} size="xl" tone={1} shape="rounded" />
        </div>
        <CardContent>
          <div className={styles.identityHead}>
            <div>
              <CardTitle>
                <span className={styles.identityName}>
                  {COMPANY.name}
                  {COMPANY.verified && (
                    <Tooltip label="Verified company">
                      <span className={styles.verifiedDot} aria-label="Verified">
                        <Icon name="verified" size={20} />
                      </span>
                    </Tooltip>
                  )}
                </span>
              </CardTitle>
              <CardBody>
                <div className={styles.tagline}>{COMPANY.tagline}</div>
                <div className={styles.metaRow}>
                  <span className={styles.metaItem}><Icon name="domain" size={16} />{COMPANY.industry}</span>
                  <span className={styles.metaItem}><Icon name="group" size={16} />{COMPANY.size}</span>
                  <span className={styles.metaItem}><Icon name="place" size={16} />{COMPANY.hq}</span>
                  <span className={styles.metaItem}><Icon name="link" size={16} />{COMPANY.website}</span>
                </div>
                <div className={styles.chipRow}>
                  <Chip kind="assist" label="Robotics" />
                  <Chip kind="assist" label="Manufacturing" />
                  <Chip kind="assist" label="Series B" />
                  <Chip kind="assist" label="Hiring" icon="work" />
                </div>
              </CardBody>
            </div>
            <div className={styles.identityActions}>
              <Button
                variant={following ? 'tonal' : 'filled'}
                onClick={() => {
                  setFollowing(v => !v);
                  setSnack(following ? 'Unfollowed Acme Robotics' : 'Following Acme Robotics');
                }}
              >
                {following ? 'Following' : 'Follow'}
              </Button>
              <Button variant="outlined" onClick={() => setSnack('Opening contact form…')}>Contact</Button>
              <Tooltip label="Open website">
                <IconButton icon="open_in_new" label="Website" variant="tonal" />
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification banner */}
      {COMPANY.verified && (
        <Banner
          variant="success"
          title="Verified company profile"
          actions={<Button variant="text" onClick={() => setSnack('Verification details')}>Details</Button>}
        >
          Acme Robotics has confirmed ownership of this profile and verified business details with our review team.
        </Banner>
      )}

      {/* KPI strip */}
      <div className={styles.kpiGrid}>
        {KPIS.map(k => (
          <Card key={k.key} variant="elevated" className={styles.kpi}>
            <Avatar icon={k.icon} size="md" shape="rounded" tone={1} />
            <div>
              <div className={styles.kpiLabel}>{k.label}</div>
              <div className={styles.kpiValue}>{k.value}</div>
              <div className={styles.kpiTrend}>{k.trend}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Card variant="elevated" className={styles.tabsPanel}>
        <Tabs
          items={[
            { value: 'overview',  label: 'Overview',  icon: 'info' },
            { value: 'team',      label: 'Team',      icon: 'group' },
            { value: 'projects',  label: 'Projects',  icon: 'task_alt' },
            { value: 'documents', label: 'Documents', icon: 'folder' },
          ]}
          value={tab}
          onChange={(v) => setTab(v as TabId)}
        />

        <div className={styles.tabBody}>
          {/* Main column varies per tab; sidebar stays */}
          <div className={styles.main}>
            {tab === 'overview' && (
              <>
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>About</h3>
                  <p className={styles.sectionBody}>
                    Acme Robotics designs cooperative robots and the software that runs them.
                    Founded in 2014, our hardware ships to mid-market manufacturers across
                    North America, Europe, and Asia. We invest heavily in safe, transparent
                    machine behavior — every ACME platform ships with on-device explainability.
                  </p>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Funding & milestones</h3>
                  <Stepper
                    steps={MILESTONES}
                    current={milestone}
                    onChange={setMilestone}
                    linear={false}
                  />
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Recent activity</h3>
                    <Button variant="text" onClick={() => setSnack('Full history')}>View all</Button>
                  </div>
                  <Timeline items={ACTIVITY} />
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>FAQ</h3>
                  <Accordion items={FAQ} variant="filled" defaultExpanded={['who']} />
                </section>
              </>
            )}

            {tab === 'team' && (
              <>
                <div className={styles.sectionHeader} style={{ marginBottom: 12 }}>
                  <div>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: 4 }}>Team members</h3>
                    <div className={styles.subtle}>{filteredMembers.length} of {MEMBERS.length} members</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={styles.subtle}>Leads:</span>
                    <AvatarGroup max={4}>
                      {MEMBERS.slice(0, 5).map((m, i) => (
                        <Avatar key={m.id} name={m.name} tone={((i % 4) + 1) as 1 | 2 | 3 | 4} />
                      ))}
                    </AvatarGroup>
                  </div>
                </div>

                <div className={styles.filterRow}>
                  <span className={styles.subtle}>Filter:</span>
                  {(['Engineering', 'Design', 'Operations', 'Sales'] as const).map(d => (
                    <Chip
                      key={d}
                      kind="filter"
                      label={d}
                      selected={deptFilter.includes(d)}
                      onClick={() => toggleDept(d)}
                    />
                  ))}
                  {deptFilter.length > 0 && (
                    <Button variant="text" onClick={() => setDeptFilter([])}>Clear</Button>
                  )}
                </div>

                {filteredMembers.length === 0 ? (
                  <EmptyState
                    icon="filter_alt_off"
                    title="No matches"
                    description="No members match the selected departments."
                    actions={<Button onClick={() => setDeptFilter([])}>Clear filters</Button>}
                  />
                ) : (
                  <DataTable
                    columns={MEMBER_COLUMNS}
                    rows={filteredMembers}
                    rowKey={r => r.id}
                    selected={memberSel}
                    onSelectedChange={setMemberSel}
                    ariaLabel="Team members"
                  />
                )}

                {memberSel.size > 0 && (
                  <div className={styles.selectionBar}>
                    <span>{memberSel.size} selected</span>
                    <div style={{ flex: 1 }} />
                    <Button variant="text" onClick={() => setMemberSel(new Set())}>Clear</Button>
                    <Button variant="tonal" onClick={() => setSnack(`Messaging ${memberSel.size} people`)}>Message</Button>
                  </div>
                )}
              </>
            )}

            {tab === 'projects' && (
              <>
                <div className={styles.sectionHeader} style={{ marginBottom: 12 }}>
                  <h3 className={styles.sectionTitle}>Projects</h3>
                  <Button variant="filled" onClick={() => setSnack('New project draft')}>
                    <Icon name="add" size={18} />
                    New project
                  </Button>
                </div>

                <DataTable
                  columns={PROJECT_COLUMNS}
                  rows={projectsPage}
                  rowKey={r => r.id}
                  ariaLabel="Projects"
                />

                <div className={styles.pageFoot}>
                  <span className={styles.subtle}>
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, PROJECTS.length)} of {PROJECTS.length}
                  </span>
                  <Pagination page={page} pageCount={projectsPageCount} onChange={setPage} />
                </div>
              </>
            )}

            {tab === 'documents' && (
              <div className={styles.docsLayout}>
                <Card variant="filled" className={styles.docsTree}>
                  <Tree
                    ariaLabel="Documents"
                    nodes={DOC_TREE}
                    defaultExpanded={['public', 'public/brand', 'press']}
                    selected={doc}
                    onSelect={(id) => setDoc(id)}
                  />
                </Card>
                <Card variant="outlined" className={styles.docsPreview}>
                  {docMeta ? (
                    <>
                      <div className={styles.docsHeader}>
                        <Avatar icon="description" size="lg" shape="rounded" tone={1} />
                        <div style={{ flex: 1 }}>
                          <div className={styles.docsTitle}>{docMeta.title}</div>
                          <div className={styles.subtle}>{docMeta.size} · Updated {docMeta.updated}</div>
                        </div>
                        <Button variant="tonal" onClick={() => setSnack(`Downloading ${docMeta.title}`)}>
                          <Icon name="download" size={18} />
                          Download
                        </Button>
                      </div>
                      <Divider />
                      <p className={styles.sectionBody}>{docMeta.summary}</p>
                    </>
                  ) : (
                    <EmptyState
                      icon="article"
                      title="Select a document"
                      description="Choose a file from the tree to see its details and download options."
                    />
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar — visible across all tabs */}
          <aside className={styles.sidebar}>
            <Card variant="filled" className={styles.sideCard}>
              <div className={styles.sideHeader}>
                <h4 className={styles.sideTitle}>Glassview rating</h4>
                <span className={styles.subtle}>{COMPANY.reviewCount} reviews</span>
              </div>
              <div className={styles.ratingRow}>
                <span className={styles.ratingValue}>{COMPANY.rating.toFixed(1)}</span>
                <Rating value={COMPANY.rating} half />
              </div>
              <div className={styles.subtle}>Updated weekly from verified employees.</div>
            </Card>

            <Card variant="filled" className={styles.sideCard}>
              <div className={styles.sideHeader}>
                <h4 className={styles.sideTitle}>Key contacts</h4>
                <IconButton icon="open_in_new" label="View all" />
              </div>
              <List>
                {CONTACTS.map((c, i) => (
                  <ListItem
                    key={c.email}
                    headline={c.name}
                    supporting={c.role}
                    leading={<Avatar name={c.name} size="sm" tone={c.tone} />}
                    trailing={<IconButton icon="mail" label={`Email ${c.name}`} onClick={() => setSnack(`Composing to ${c.email}`)} />}
                    onClick={() => setSnack(`Opening ${c.name}'s profile`)}
                  />
                ))}
                {CONTACTS.length === 0 && (
                  <ListItem headline="No contacts yet" supporting="Verified contacts will appear here." />
                )}
              </List>
            </Card>

            <Card variant="filled" className={styles.sideCard}>
              <div className={styles.sideHeader}>
                <h4 className={styles.sideTitle}>Locations</h4>
                <Chip kind="suggestion" label={`${LOCATIONS.length}`} />
              </div>
              <List>
                {LOCATIONS.map(l => (
                  <ListItem
                    key={l.city}
                    headline={l.city}
                    supporting={l.label}
                    leading={<Avatar icon={l.icon} size="sm" tone={3} />}
                    trailing={<span className={styles.headcount}>{l.headcount}</span>}
                  />
                ))}
              </List>
            </Card>

            <Card variant="filled" className={styles.sideCard}>
              <div className={styles.sideHeader}>
                <h4 className={styles.sideTitle}>Open positions</h4>
              </div>
              <EmptyState
                icon="work_outline"
                title="Job board not yet integrated"
                description="Connect your ATS to surface open roles directly in this profile."
                actions={<Button variant="tonal" onClick={() => setSnack('Opening integrations…')}>Connect ATS</Button>}
              />
            </Card>
          </aside>
        </div>
      </Card>

      <Snackbar
        open={!!snack}
        message={snack ?? ''}
        action={{ label: 'Dismiss', onClick: () => setSnack(null) }}
        onClose={() => setSnack(null)}
      />
      <ExampleSourceSheet open={sourceOpen} onClose={() => setSourceOpen(false)} title="Company Profile" pageSource={pageSource} styleSource={styleSource} />
    </div>
  );
}

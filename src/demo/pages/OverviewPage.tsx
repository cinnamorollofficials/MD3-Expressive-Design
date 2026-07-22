import { Icon } from '../../lib';
import type { GroupDef } from '../../App';
import styles from './OverviewPage.module.css';

const CATEGORIES = [
  { id: 'buttons', icon: 'smart_button', title: 'Buttons', count: 6, description: 'Actions that feel responsive and unmistakably expressive.', preview: 'buttons' },
  { id: 'containment', icon: 'view_quilt', title: 'Containment', count: 7, description: 'Cards, dialogs, sheets, and surfaces that organize content.', preview: 'containment' },
  { id: 'selection', icon: 'check_box', title: 'Selection', count: 4, description: 'Clear controls for choices, filters, and preferences.', preview: 'selection' },
  { id: 'input', icon: 'edit_note', title: 'Inputs', count: 9, description: 'Friendly fields and controls for every kind of data.', preview: 'input' },
  { id: 'navigation', icon: 'menu', title: 'Navigation', count: 6, description: 'Wayfinding patterns for compact to expansive layouts.', preview: 'navigation' },
  { id: 'communication', icon: 'notifications', title: 'Communication', count: 4, description: 'Feedback, status, loading, and timely updates.', preview: 'communication' },
  { id: 'content', icon: 'view_list', title: 'Content', count: 13, description: 'Structured patterns for presenting dense information.', preview: 'content' },
  { id: 'charts', icon: 'show_chart', title: 'Charts', count: 7, description: 'Fluid time-series and area-based data stories.', preview: 'charts' },
  { id: 'bar-charts', icon: 'bar_chart', title: 'Bar charts', count: 6, description: 'Crisp comparisons for categories and composition.', preview: 'bars' },
  { id: 'networks', icon: 'hub', title: 'Networks', count: 7, description: 'Reveal relationships, flows, and connected systems.', preview: 'networks' },
  { id: 'analysis', icon: 'analytics', title: 'Analysis', count: 7, description: 'Statistical views for patterns, ranges, and distribution.', preview: 'analysis' },
  { id: 'maps', icon: 'map', title: 'Maps', count: 3, description: 'Geographic data with accessible color and interaction.', preview: 'maps' },
  { id: 'hierarchies', icon: 'account_tree', title: 'Hierarchies', count: 6, description: 'Explore nested structure from root to smallest detail.', preview: 'hierarchies' },
] as const;

function CategoryPreview({ type }: { type: string }) {
  return (
    <div className={`${styles.preview} ${styles[type]}`} aria-hidden="true">
      {type === 'buttons' && <><span className={styles.filledPill}>Create</span><span className={styles.tonalPill}>Explore</span><i className={styles.roundButton}>+</i></>}
      {type === 'containment' && <><i className={styles.miniCardLarge} /><i className={styles.miniCardSmall} /></>}
      {type === 'selection' && <><i className={styles.check}>✓</i><i className={styles.toggle}><b /></i><span className={styles.chip}>Selected</span></>}
      {type === 'input' && <><i className={styles.field}>Search components…</i><i className={styles.slider}><b /></i></>}
      {type === 'navigation' && <><i className={styles.navRail}><b /><b /><b /></i><i className={styles.navPage} /></>}
      {type === 'communication' && <><i className={styles.message}>Saved to your library</i><i className={styles.progress} /></>}
      {type === 'content' && <><i className={styles.avatar}>M</i><span className={styles.contentLines}><b /><b /><b /></span></>}
      {type === 'charts' && <svg viewBox="0 0 240 100"><path className={styles.areaFill} d="M0 88 C24 76 38 32 67 54 S111 82 132 34 S177 23 197 48 S224 22 240 12 V100 H0Z"/><path className={styles.chartLine} d="M0 88 C24 76 38 32 67 54 S111 82 132 34 S177 23 197 48 S224 22 240 12"/></svg>}
      {type === 'bars' && <span className={styles.barSet}><b /><b /><b /><b /><b /></span>}
      {type === 'networks' && <svg viewBox="0 0 240 100"><g className={styles.links}><path d="M30 55L86 24L130 65L203 27M86 24L170 83M130 65L203 27"/></g><g className={styles.nodes}><circle cx="30" cy="55" r="9"/><circle cx="86" cy="24" r="12"/><circle cx="130" cy="65" r="8"/><circle cx="170" cy="83" r="7"/><circle cx="203" cy="27" r="11"/></g></svg>}
      {type === 'analysis' && <><span className={styles.dots}>{[0,1,2,3,4,5,6,7,8,9,10,11].map(n => <b key={n} />)}</span><i className={styles.trend} /></>}
      {type === 'maps' && <svg viewBox="0 0 240 100" className={styles.mapSvg}><path d="M24 44l23-23 31 8 20-15 23 22 30-11 15 19 33-7 19 25-24 24-37-5-24 13-30-18-35 8-31-19z"/><path d="M78 29l5 55M121 36l12 58M166 44l-9 37M47 21l22 49M98 14l23 22M151 25l15 19M37 65l46-2M83 63l50 8M133 71l41-10"/></svg>}
      {type === 'hierarchies' && <><i className={styles.treeRoot} /><span className={styles.treeBranches}><b /><b /><b /></span></>}
    </div>
  );
}

function ComponentMiniVisual({ groupId, componentId, index }: { groupId: string; componentId: string; index: number }) {
  if (groupId === 'buttons') {
    if (componentId === 'icon-button') return <span className={styles.miniIconButton}><Icon name="favorite" size={17} /></span>;
    if (componentId === 'fab') return <span className={styles.miniFab}><Icon name="add" size={19} /></span>;
    if (componentId === 'fab-menu') return <span className={styles.miniFabMenu}><i /><i /><b>+</b></span>;
    if (componentId === 'split-button') return <span className={styles.miniSplit}><b>Save</b><i>⌄</i></span>;
    if (componentId === 'segmented-button') return <span className={styles.miniSegments}><i>1</i><i>2</i><i>3</i></span>;
    return <span className={styles.miniButton}>Button</span>;
  }

  if (groupId === 'selection') {
    if (componentId === 'checkbox') return <span className={styles.miniCheckbox}>✓</span>;
    if (componentId === 'radio') return <span className={styles.miniRadio}><i /></span>;
    if (componentId === 'switch') return <span className={styles.miniSwitch}><i /></span>;
    return <span className={styles.miniChip}>Selected</span>;
  }

  if (groupId === 'input') {
    if (componentId === 'slider') return <span className={styles.miniSlider}><i /></span>;
    if (componentId === 'rating') return <span className={styles.miniRating}>★ ★ ★</span>;
    if (componentId.includes('picker')) return <span className={styles.miniPicker}><Icon name={componentId.startsWith('date') ? 'calendar_today' : 'schedule'} size={18} /><i /><i /></span>;
    if (componentId === 'select' || componentId === 'combobox') return <span className={styles.miniField}>Choose <b>⌄</b></span>;
    if (componentId === 'number-input') return <span className={styles.miniField}>24 <b>±</b></span>;
    return <span className={styles.miniField}>{componentId === 'search' ? '⌕ Search' : 'Label'}</span>;
  }

  if (['charts', 'bar-charts', 'analysis'].includes(groupId)) {
    return <span className={styles.miniChart} data-chart={groupId === 'bar-charts' ? 'bar' : groupId === 'analysis' ? 'dots' : 'line'} style={{ '--mini-accent': `var(--md-sys-color-${index % 3 === 0 ? 'primary' : index % 3 === 1 ? 'secondary' : 'tertiary'})` } as React.CSSProperties}><i /><i /><i /><i /><i /></span>;
  }

  if (groupId === 'networks') return <span className={styles.miniNetwork}><i /><i /><i /><i /><b /><b /><b /></span>;
  if (groupId === 'maps') return <span className={styles.miniMap}><i /><i /><i /><i /></span>;
  if (groupId === 'hierarchies') return <span className={styles.miniTree}><b /><i /><i /><i /></span>;

  if (groupId === 'content') {
    if (componentId === 'avatar') return <span className={styles.realAvatar}><b>HG</b><i /><i /></span>;
    if (componentId === 'breadcrumbs') return <span className={styles.realBreadcrumbs}><b>Home</b><i>›</i><b>Library</b><i>›</i><strong>Button</strong></span>;
    if (componentId === 'stepper') return <span className={styles.realStepper}><b>✓</b><i /><b>2</b><i /><b>3</b></span>;
    if (componentId === 'pagination') return <span className={styles.realPagination}><i>‹</i><b>1</b><i>2</i><i>3</i><i>›</i></span>;
    if (componentId === 'skeleton') return <span className={styles.realSkeleton}><b /><i /><i /></span>;
    if (componentId === 'empty-state') return <span className={styles.realEmpty}><Icon name="inbox" size={25} /><b>No items yet</b><i>Add item</i></span>;
    if (componentId === 'data-table') return <span className={styles.realTable}>{[0,1,2,3,4,5,6,7,8].map(cell => <i key={cell} />)}</span>;
    if (componentId === 'timeline') return <span className={styles.realTimeline}><i /><b>Created</b><i /><b>Reviewed</b><i /><b>Published</b></span>;
    if (componentId === 'accordion') return <span className={styles.realAccordion}><b>What is MD3?<i>⌄</i></b><b>How to install?<i>⌄</i></b><b>Theme options<i>⌄</i></b></span>;
    if (componentId === 'tree') return <span className={styles.realTree}><b>▾ src</b><i>├ components</i><i>└ styles</i><em>▸ assets</em></span>;
    if (componentId === 'list') return <span className={styles.realList}>{[0,1,2].map(row => <b key={row}><i>{row + 1}</i><span /><em>›</em></b>)}</span>;
    if (componentId === 'divider') return <span className={styles.realDivider}><b>Section one</b><i /><b>Section two</b></span>;
    if (componentId === 'carousel') return <span className={styles.realCarousel}><i /><b /><i /></span>;
  }

  const iconMap: Record<string, string> = {
    containment: componentId.includes('sheet') ? 'dock_to_right' : componentId === 'dialog' ? 'dialogs' : componentId === 'snackbar' ? 'toast' : componentId === 'tooltip' ? 'tooltip' : componentId === 'menu' ? 'menu' : 'cards',
    navigation: componentId.includes('rail') ? 'view_sidebar' : componentId.includes('bar') ? 'bottom_navigation' : componentId.includes('drawer') ? 'dock_to_left' : componentId === 'tabs' ? 'tab' : 'toolbar',
    communication: componentId.includes('loading') || componentId.includes('progress') ? 'progress_activity' : componentId === 'badge' ? 'notification_important' : 'campaign',
  };
  return <span className={styles.miniGeneric}><Icon name={iconMap[groupId] ?? 'widgets'} size={25} /><i /><i /></span>;
}

export function OverviewPage({ groups }: { groups: GroupDef[] }) {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}><i /> React + TypeScript design system</span>
          <h1>Build interfaces<br />with more <em>feeling.</em></h1>
          <p>MD3 Expressive gives you a complete set of lively, accessible components—from everyday controls to advanced data visualization.</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryCta} href="#installation">Get started <Icon name="arrow_forward" size={20} /></a>
            <a className={styles.secondaryCta} href="#buttons">Browse components</a>
          </div>
          <div className={styles.proof}><span><strong>85+</strong> components</span><span><strong>6</strong> themes</span><span><strong>100%</strong> typed</span></div>
        </div>
        <div className={styles.heroArt} aria-label="Preview of expressive UI components">
          <div className={styles.artGlow} />
          <div className={styles.dashboardCard}>
            <div className={styles.dashTop}><span><i />Overview</span><b>•••</b></div>
            <p>Weekly activity</p><strong>24,680</strong><small>↑ 12.4% this week</small>
            <div className={styles.sparkBars}>{[32,52,40,72,58,88,66,96].map((h, i) => <i key={i} style={{height: `${h}%`}} />)}</div>
          </div>
          <div className={styles.floatingChoice}><i>✓</i><span><small>Theme</small><strong>Ocean light</strong></span></div>
          <div className={styles.floatingAction}><Icon name="auto_awesome" size={24} /></div>
          <span className={styles.shapeOne} /><span className={styles.shapeTwo} />
        </div>
      </section>

      <section className={styles.categories}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.kicker}>Component library</span><h2>Everything your UI needs.</h2></div>
          <p>Start with solid foundations, then scale all the way to complex data experiences.</p>
        </div>
        <div className={styles.categorySections}>
          {CATEGORIES.map(category => {
            const components = groups.find(group => group.id === category.id)?.components ?? [];
            return (
              <section className={styles.categorySection} key={category.id}>
                <div className={styles.categoryHeading}>
                  <span className={styles.categoryIcon}><Icon name={category.icon} size={22} /></span>
                  <div><h3>{category.title}</h3><p>{category.description}</p></div>
                  <a href={`#${category.id}`}>{components.length} components <Icon name="arrow_forward" size={17} /></a>
                </div>
                <div className={styles.componentGrid} aria-label={`${category.title} components`}>
                  {components.map((component, componentIndex) => (
                    <a href={`#${component.id}`} className={styles.componentPreview} key={component.id}>
                      <span className={styles.componentCanvas}>
                        <ComponentMiniVisual groupId={category.id} componentId={component.id} index={componentIndex} />
                      </span>
                      <span className={styles.componentMeta}>
                        <strong>{component.label}</strong>
                        {component.status && component.status !== 'stable' && <i>{component.status}</i>}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className={styles.bottomCta}>
        <span className={styles.ctaIcon}><Icon name="code" size={30} /></span>
        <div><span className={styles.kicker}>Ready when you are</span><h2>From idea to expressive interface.</h2><p>Install the package, pick a theme, and ship something people enjoy using.</p></div>
        <a href="#installation">Start building <Icon name="arrow_forward" size={20} /></a>
      </section>
    </main>
  );
}

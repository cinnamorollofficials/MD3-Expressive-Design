import { Icon } from '../../lib';
import type { GroupDef } from '../../App';
import styles from './OverviewPage.module.css';

const CATEGORIES = [
  { id: 'buttons', icon: 'smart_button', title: 'Buttons', description: 'Actions that feel responsive and unmistakably expressive.' },
  { id: 'containment', icon: 'view_quilt', title: 'Containment', description: 'Cards, dialogs, sheets, and surfaces that organize content.' },
  { id: 'selection', icon: 'check_box', title: 'Selection', description: 'Clear controls for choices, filters, and preferences.' },
  { id: 'input', icon: 'edit_note', title: 'Inputs', description: 'Friendly fields and controls for every kind of data.' },
  { id: 'navigation', icon: 'menu', title: 'Navigation', description: 'Wayfinding patterns for compact to expansive layouts.' },
  { id: 'communication', icon: 'notifications', title: 'Communication', description: 'Feedback, status, loading, and timely updates.' },
  { id: 'content', icon: 'view_list', title: 'Content', description: 'Structured patterns for presenting dense information.' },
  { id: 'charts', icon: 'show_chart', title: 'Charts', description: 'Fluid time-series and area-based data stories.' },
  { id: 'bar-charts', icon: 'bar_chart', title: 'Bar charts', description: 'Crisp comparisons for categories and composition.' },
  { id: 'networks', icon: 'hub', title: 'Networks', description: 'Reveal relationships, flows, and connected systems.' },
  { id: 'analysis', icon: 'analytics', title: 'Analysis', description: 'Statistical views for patterns, ranges, and distribution.' },
  { id: 'maps', icon: 'map', title: 'Maps', description: 'Geographic data with accessible color and interaction.' },
  { id: 'hierarchies', icon: 'account_tree', title: 'Hierarchies', description: 'Explore nested structure from root to smallest detail.' },
] as const;

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

  if (groupId === 'charts') {
    if (componentId === 'calendar-chart') return <span className={styles.realCalendarChart}>{Array.from({ length: 35 }, (_, cell) => <i key={cell} style={{ opacity: .18 + ((cell * 7) % 10) / 12 }} />)}</span>;
    if (componentId === 'area-chart-missing') return <span className={styles.realChart}><svg viewBox="0 0 180 78"><path className={styles.chartAreaA} d="M4 70C25 66 35 39 57 47L79 35V76H4ZM105 40C126 49 140 24 176 13V76H105Z"/><path className={styles.chartStrokeA} d="M4 70C25 66 35 39 57 47L79 35M105 40C126 49 140 24 176 13"/></svg></span>;
    if (componentId === 'stacked-area-chart') return <span className={styles.realChart}><svg viewBox="0 0 180 78"><path className={styles.chartAreaA} d="M3 64C28 50 45 62 68 43S112 54 137 31S162 25 177 13V76H3Z"/><path className={styles.chartAreaB} d="M3 64C29 61 46 70 69 58S113 68 138 48S162 39 177 30V76H3Z"/><path className={styles.chartStrokeA} d="M3 64C28 50 45 62 68 43S112 54 137 31S162 25 177 13"/></svg></span>;
    if (componentId === 'normalized-stacked-area-chart') return <span className={styles.realChart}><svg viewBox="0 0 180 78"><path className={styles.chartAreaC} d="M2 12H178V76H2Z"/><path className={styles.chartAreaA} d="M2 38C31 22 52 49 80 31S132 43 178 22V76H2Z"/><path className={styles.chartAreaB} d="M2 57C34 45 58 65 86 49S135 60 178 43V76H2Z"/></svg></span>;
    if (componentId === 'streamgraph') return <span className={styles.realChart}><svg viewBox="0 0 180 78"><path className={styles.chartAreaC} d="M2 38C27 9 49 22 67 38S108 57 128 32S160 19 178 38C156 57 144 61 126 49S90 65 66 43S25 67 2 38Z"/><path className={styles.chartAreaA} d="M2 38C32 25 49 31 69 39S107 49 130 34S160 30 178 38C151 47 142 49 127 43S91 55 67 41S31 53 2 38Z"/></svg></span>;
    if (componentId === 'difference-chart') return <span className={styles.realChart}><svg viewBox="0 0 180 78"><path className={styles.chartPositive} d="M3 51C28 15 49 60 76 32S126 58 177 15V40C132 67 103 37 77 55S28 42 3 63Z"/><path className={styles.chartNegative} d="M3 63C28 42 51 74 77 55S132 67 177 40V62C127 76 104 55 76 69S25 59 3 72Z"/><path className={styles.chartStrokeA} d="M3 51C28 15 49 60 76 32S126 58 177 15"/><path className={styles.chartStrokeB} d="M3 63C28 42 51 74 77 55S132 67 177 40"/></svg></span>;
    return <span className={styles.realChart}><svg viewBox="0 0 180 78"><path className={styles.chartAreaA} d="M3 68C24 66 34 47 53 53S82 29 103 37S141 27 177 9V76H3Z"/><path className={styles.chartStrokeA} d="M3 68C24 66 34 47 53 53S82 29 103 37S141 27 177 9"/></svg></span>;
  }

  if (groupId === 'bar-charts') {
    if (componentId === 'horizontal-bar-chart') return <span className={styles.realBarChart}><svg viewBox="0 0 180 82"><g className={styles.barPrimary}><rect x="10" y="8" width="118" height="11" rx="3"/><rect x="10" y="27" width="76" height="11" rx="3"/><rect x="10" y="46" width="148" height="11" rx="3"/><rect x="10" y="65" width="98" height="11" rx="3"/></g></svg></span>;
    if (componentId === 'diverging-bar-chart') return <span className={styles.realBarChart}><svg viewBox="0 0 180 82"><path className={styles.barAxis} d="M90 4V78"/><g className={styles.barNegative}><rect x="27" y="9" width="63" height="11" rx="3"/><rect x="49" y="28" width="41" height="11" rx="3"/><rect x="16" y="47" width="74" height="11" rx="3"/><rect x="58" y="66" width="32" height="11" rx="3"/></g><g className={styles.barPositive}><rect x="90" y="9" width="46" height="11" rx="3"/><rect x="90" y="28" width="72" height="11" rx="3"/><rect x="90" y="47" width="31" height="11" rx="3"/><rect x="90" y="66" width="61" height="11" rx="3"/></g></svg></span>;
    if (componentId === 'stacked-bar-chart') return <span className={styles.realBarChart}><svg viewBox="0 0 180 82"><g>{[12,48,84,120,156].map((x, bar) => <g key={x}><rect className={styles.barPrimary} x={x} y={62 - bar * 5} width="24" height={14 + bar * 5} rx="3"/><rect className={styles.barSecondary} x={x} y={39 - bar * 3} width="24" height={23 - bar * 2} rx="3"/><rect className={styles.barTertiary} x={x} y={18} width="24" height={21 - bar * 3} rx="3"/></g>)}</g></svg></span>;
    if (componentId === 'normalized-stacked-bar-chart') return <span className={styles.realBarChart}><svg viewBox="0 0 180 82"><g>{[12,48,84,120,156].map((x, bar) => <g key={x}><rect className={styles.barPrimary} x={x} y={52 - bar * 3} width="24" height={26 + bar * 3} rx="2"/><rect className={styles.barSecondary} x={x} y={31 + bar * 2} width="24" height={21 - bar * 5} rx="2"/><rect className={styles.barTertiary} x={x} y="8" width="24" height={23 + bar * 2} rx="2"/></g>)}</g></svg></span>;
    if (componentId === 'timeline-chart') return <span className={styles.realHistoryTimeline}><i /><b style={{ left: '4%', width: '35%' }}>Ancient</b><b style={{ left: '25%', width: '42%' }}>Medieval</b><b style={{ left: '58%', width: '38%' }}>Modern</b><em>-3000</em><em>0</em><em>2000</em></span>;
    return <span className={styles.realBarChart}><svg viewBox="0 0 180 82"><g className={styles.barPrimary}><rect x="12" y="48" width="24" height="30" rx="4"/><rect x="48" y="24" width="24" height="54" rx="4"/><rect x="84" y="38" width="24" height="40" rx="4"/><rect x="120" y="12" width="24" height="66" rx="4"/><rect x="156" y="31" width="20" height="47" rx="4"/></g></svg></span>;
  }

  if (groupId === 'analysis') {
    if (componentId === 'moving-average') return <span className={styles.realAnalysis}><svg viewBox="0 0 180 82"><path className={styles.rawSeries} d="M4 61L18 35L31 58L45 25L59 43L73 20L87 53L101 32L115 48L130 18L145 39L176 11"/><path className={styles.analysisLine} d="M4 55C28 47 38 40 58 36S91 39 111 33S148 27 176 17"/></svg></span>;
    if (componentId === 'bollinger-bands') return <span className={styles.realAnalysis}><svg viewBox="0 0 180 82"><path className={styles.bollingerBand} d="M4 56C31 31 48 43 67 23S106 39 127 20S156 18 176 8L176 43C150 52 139 47 121 59S82 51 65 65S28 59 4 74Z"/><path className={styles.analysisLine} d="M4 65C31 45 47 52 66 43S105 47 125 39S153 34 176 25"/><path className={styles.bandEdge} d="M4 56C31 31 48 43 67 23S106 39 127 20S156 18 176 8M4 74C28 59 47 75 65 65S103 70 121 59S150 52 176 43"/></svg></span>;
    if (componentId === 'box-plot') return <span className={styles.realAnalysis}><svg viewBox="0 0 180 82"><g className={styles.boxWhisker}><path d="M20 12V70M14 12H26M14 70H26M20 28H42V54H20M31 28V54M42 41H58M58 31V51"/><path d="M73 18V66M67 18H79M67 66H79M73 31H97V56H73M86 31V56M97 43H111M111 34V52"/><path d="M126 9V73M120 9H132M120 73H132M126 24H152V48H126M139 24V48M152 36H168M168 27V45"/></g></svg></span>;
    if (componentId === 'histogram') return <span className={styles.realAnalysis}><svg viewBox="0 0 180 82"><g className={styles.histBars}><rect x="5" y="68" width="14" height="10"/><rect x="21" y="58" width="14" height="20"/><rect x="37" y="43" width="14" height="35"/><rect x="53" y="21" width="14" height="57"/><rect x="69" y="9" width="14" height="69"/><rect x="85" y="17" width="14" height="61"/><rect x="101" y="35" width="14" height="43"/><rect x="117" y="50" width="14" height="28"/><rect x="133" y="61" width="14" height="17"/><rect x="149" y="69" width="14" height="9"/></g></svg></span>;
    if (componentId === 'kernel-density-estimation') return <span className={styles.realAnalysis}><svg viewBox="0 0 180 82"><path className={styles.kdeFill} d="M3 76C21 75 26 67 38 51S57 25 72 45C83 59 91 46 102 27S127 13 137 40S153 70 177 74V78H3Z"/><path className={styles.analysisLine} d="M3 76C21 75 26 67 38 51S57 25 72 45C83 59 91 46 102 27S127 13 137 40S153 70 177 74"/></svg></span>;
    if (componentId === 'hexbin-chart') return <span className={styles.realHexbin}>{Array.from({length:24},(_, hex) => <i key={hex} style={{ opacity: .25 + ((hex * 3) % 8) / 10 }} />)}</span>;
    return <span className={styles.realAnalysis}><svg viewBox="0 0 180 82"><path className={styles.qqReference} d="M14 72L166 9"/><g className={styles.qqPoints}>{[[22,67],[38,62],[53,55],[68,48],[84,43],[99,36],[116,31],[130,24],[147,18],[160,11]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="4"/>)}</g></svg></span>;
  }

  if (groupId === 'networks') {
    if (componentId === 'disjoint-force-directed-graph') return <span className={styles.realNetwork}><svg viewBox="0 0 180 82"><g className={styles.netLinks}><path d="M18 22L48 11L65 34L35 48L18 22M116 24L151 15L166 43L137 68L108 48L116 24"/></g><g className={styles.netNodes}><circle cx="18" cy="22" r="6"/><circle cx="48" cy="11" r="7"/><circle cx="65" cy="34" r="5"/><circle cx="35" cy="48" r="6"/><circle cx="116" cy="24" r="6"/><circle cx="151" cy="15" r="8"/><circle cx="166" cy="43" r="5"/><circle cx="137" cy="68" r="7"/><circle cx="108" cy="48" r="5"/></g></svg></span>;
    if (componentId === 'mobile-patent-suits') return <span className={styles.realNetwork}><svg viewBox="0 0 180 82"><defs><marker id="arrow-mini" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0L5 2.5L0 5Z" className={styles.netArrow}/></marker></defs><g className={styles.netDirected}><path d="M28 40Q55 5 86 31M87 35Q121 10 151 38M149 45Q116 74 88 49M81 47Q51 72 30 47M34 38Q89 6 145 38"/></g><g className={styles.netNodes}><circle cx="25" cy="43" r="9"/><circle cx="86" cy="40" r="10"/><circle cx="153" cy="43" r="9"/></g><g className={styles.netLabels}><text x="18" y="46">A</text><text x="82" y="44">G</text><text x="149" y="46">S</text></g></svg></span>;
    if (componentId === 'arc-diagram') return <span className={styles.realNetwork}><svg viewBox="0 0 180 82"><path className={styles.arcBase} d="M13 66H168"/><g className={styles.netArcs}><path d="M20 66Q45 4 70 66M45 66Q88 12 130 66M70 66Q110 27 150 66M20 66Q94 -2 168 66"/></g><g className={styles.netNodes}>{[20,45,70,100,130,150,168].map(x => <circle key={x} cx={x} cy="66" r="5"/>)}</g></svg></span>;
    if (componentId === 'sankey-diagram') return <span className={styles.realNetwork}><svg viewBox="0 0 180 82"><g className={styles.sankeyFlows}><path d="M18 15C62 15 62 26 93 26"/><path d="M18 38C65 38 60 29 93 29"/><path d="M18 64C58 64 67 50 93 50"/><path d="M101 27C130 27 132 17 163 17"/><path d="M101 47C132 47 132 61 163 61"/></g><g className={styles.sankeyNodes}><rect x="10" y="8" width="9" height="16" rx="2"/><rect x="10" y="31" width="9" height="16" rx="2"/><rect x="10" y="56" width="9" height="17" rx="2"/><rect x="93" y="19" width="9" height="36" rx="2"/><rect x="163" y="8" width="9" height="19" rx="2"/><rect x="163" y="52" width="9" height="19" rx="2"/></g></svg></span>;
    if (componentId === 'chord-diagram') return <span className={styles.realNetwork}><svg viewBox="0 0 180 82"><g transform="translate(90 41)"><circle className={styles.chordRing} r="34"/><path className={styles.chordA} d="M-27-20Q18-12 29 17Q-5 10-27-20Z"/><path className={styles.chordB} d="M-30 16Q2-22 23-25Q10 7-30 16Z"/><path className={styles.chordC} d="M5 34Q-2-5 29-17Q22 16 5 34Z"/></g></svg></span>;
    if (componentId === 'hierarchical-edge-bundling') return <span className={styles.realNetwork}><svg viewBox="0 0 180 82"><g transform="translate(90 41)"><circle className={styles.bundleRing} r="34"/><g className={styles.bundleLinks}><path d="M-32-9Q0 0 27 21M-22-26Q0 0 33-4M-3-34Q0 0-28 19M19-28Q0 0 4 34M31 11Q0 0-16 30"/></g><g className={styles.netNodes}>{Array.from({length:10},(_, n) => { const a=n*Math.PI*2/10; return <circle key={n} cx={Math.cos(a)*34} cy={Math.sin(a)*34} r="3.5"/>})}</g></g></svg></span>;
    return <span className={styles.realNetwork}><svg viewBox="0 0 180 82"><g className={styles.netLinks}><path d="M17 42L52 17L87 37L121 12L162 39M52 17L68 68L87 37L111 67L162 39M121 12L111 67"/></g><g className={styles.netNodes}><circle cx="17" cy="42" r="6"/><circle cx="52" cy="17" r="8"/><circle cx="68" cy="68" r="5"/><circle cx="87" cy="37" r="10"/><circle cx="111" cy="67" r="7"/><circle cx="121" cy="12" r="6"/><circle cx="162" cy="39" r="8"/></g></svg></span>;
  }
  if (groupId === 'maps') {
    if (componentId === 'world-choropleth') return <span className={styles.realMap}><svg viewBox="0 0 180 82"><g className={styles.worldRegions}><path d="M12 27L27 15l22 2 11 13-8 10-18-3-8 15-12-8z"/><path d="M57 19l18-8 19 6 8 12-12 7-5 19-12-5-5-18z"/><path d="M101 18l27-8 33 13 7 14-18 7-9-8-17 10-18-6z"/><path d="M128 52l14-6 17 9-5 16-22 2-10-11z"/></g></svg></span>;
    if (componentId === 'bivariate-choropleth') return <span className={styles.realMap}><svg viewBox="0 0 180 82"><g className={styles.biRegions}><path d="M22 18L52 10l17 16-6 20-31 5-17-17z"/><path d="M69 26l27-15 22 12-5 25-25 9-25-11z"/><path d="M118 23l30-8 18 18-7 22-29 2-17-9z"/><path d="M32 51l31-5 25 11-4 17H46l-20-10z"/><path d="M88 57l25-9 17 9 29-2-8 18H84z"/></g></svg><i className={styles.biLegend}><b /><b /><b /><b /></i></span>;
    return <span className={styles.realMap}><svg viewBox="0 0 180 82"><g className={styles.localRegions}><path d="M17 22L46 8l19 17-5 23-32 3-16-15z"/><path d="M65 25L95 9l22 14-7 27-27 8-23-10z"/><path d="M117 23l31-12 20 21-9 24-30 2-19-8z"/><path d="M28 51l32-3 23 10-2 17H45L20 64z"/><path d="M83 58l27-8 19 8 30-2-10 19H81z"/></g></svg></span>;
  }
  if (groupId === 'hierarchies') {
    if (componentId === 'treemap') return <span className={styles.realHierarchy}><svg viewBox="0 0 180 82"><g className={styles.treeMapRects}><rect x="7" y="7" width="75" height="68" rx="4"/><rect x="86" y="7" width="52" height="38" rx="4"/><rect x="142" y="7" width="31" height="38" rx="4"/><rect x="86" y="49" width="31" height="26" rx="4"/><rect x="121" y="49" width="52" height="26" rx="4"/></g></svg></span>;
    if (componentId === 'indented-tree') return <span className={styles.realIndented}><b>▾ Root</b><i>├ Folder A</i><em>• Item one</em><em>• Item two</em><i>└ Folder B</i></span>;
    if (componentId === 'tidy-tree') return <span className={styles.realHierarchy}><svg viewBox="0 0 180 82"><g className={styles.treeLinks}><path d="M20 41C48 41 45 16 75 16M20 41C48 41 45 66 75 66M82 16C110 16 106 8 138 8M82 16C110 16 106 29 138 29M82 66C110 66 106 55 138 55M82 66C110 66 106 75 138 75"/></g><g className={styles.treeNodes}><circle cx="18" cy="41" r="7"/><circle cx="78" cy="16" r="6"/><circle cx="78" cy="66" r="6"/><circle cx="142" cy="8" r="5"/><circle cx="142" cy="29" r="5"/><circle cx="142" cy="55" r="5"/><circle cx="142" cy="75" r="5"/></g></svg></span>;
    if (componentId === 'radial-tree') return <span className={styles.realHierarchy}><svg viewBox="0 0 180 82"><g transform="translate(90 41)"><g className={styles.radialLinks}>{[0,45,90,135,180,225,270,315].map(angle => <path key={angle} d="M0 0C10 0 19 0 31 0" transform={`rotate(${angle})`}/>)}</g><circle className={styles.radialRoot} r="7"/><g className={styles.treeNodes}>{[0,45,90,135,180,225,270,315].map(angle => {const a=angle*Math.PI/180;return <circle key={angle} cx={Math.cos(a)*34} cy={Math.sin(a)*34} r="4"/>})}</g></g></svg></span>;
    if (componentId === 'sunburst-chart') return <span className={styles.realHierarchy}><svg viewBox="0 0 180 82"><g transform="translate(90 41)"><circle className={styles.sunCenter} r="11"/><circle className={styles.sunRingOne} r="22"/><circle className={styles.sunRingTwo} r="34"/></g></svg></span>;
    return <span className={styles.realHierarchy}><svg viewBox="0 0 180 82"><g className={styles.tangledLinks}><path d="M20 18C52 18 48 14 76 14M20 18C50 18 48 61 76 61M20 63C52 63 48 35 76 35M84 14C113 14 110 24 143 24M84 35C113 35 110 24 143 24M84 35C112 35 110 59 143 59M84 61C114 61 110 59 143 59"/></g><g className={styles.tangledNodes}><rect x="10" y="11" width="14" height="14" rx="4"/><rect x="10" y="56" width="14" height="14" rx="4"/><rect x="74" y="7" width="14" height="14" rx="4"/><rect x="74" y="28" width="14" height="14" rx="4"/><rect x="74" y="54" width="14" height="14" rx="4"/><rect x="141" y="17" width="14" height="14" rx="4"/><rect x="141" y="52" width="14" height="14" rx="4"/></g></svg></span>;
  }

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
            <a className={styles.secondaryCta} href="#button">Browse components</a>
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
                  <span className={styles.categoryCount}>{components.length} components</span>
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

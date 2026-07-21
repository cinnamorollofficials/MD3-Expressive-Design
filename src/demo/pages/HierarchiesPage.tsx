import { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Treemap, TreemapNode, IndentedTree, IndentedTreeNode, TidyTree, TidyTreeNode, RadialTree, RadialTreeNode, SunburstChart, SunburstNode, Card, CardContent } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';






// Generate Flare Software Package Hierarchy dataset matching exact reference image
function generateFlareHierarchyData(): TreemapNode {
  return {
    name: 'flare',
    children: [
      {
        name: 'analytics',
        category: 'analytics',
        children: [
          { name: 'ClusterLayout', value: 12870 },
          { name: 'GraphLayout', value: 12003 },
          { name: 'Optimization', value: 9956 },
          { name: 'PropertyEncoder', value: 4138 },
          { name: 'Encoder', value: 4060 },
          { name: 'Strings', value: 22026 },
          { name: 'Maths', value: 17705 },
          { name: 'Interpolator', value: 8746 },
        ],
      },
      {
        name: 'animate',
        category: 'animate',
        children: [
          { name: 'TreeLayout', value: 9317 },
          { name: 'TreeMapLayout', value: 9191 },
          { name: 'RadialLabeler', value: 3899 },
          { name: 'ColorEncoder', value: 3179 },
          { name: 'Shapes', value: 19118 },
          { name: 'Displays', value: 12555 },
          { name: 'Transitioner', value: 19975 },
        ],
      },
      {
        name: 'data',
        category: 'data',
        children: [
          { name: 'StackedAreaLayout', value: 9121 },
          { name: 'AxisLayout', value: 6725 },
          { name: 'IcicleTreeLayout', value: 4864 },
          { name: 'Distortion', value: 6314 },
          { name: 'FisheyeTreeFilter', value: 5219 },
          { name: 'Geometry', value: 10393 },
          { name: 'FibonacciHeap', value: 9354 },
          { name: 'Easing', value: 17010 },
        ],
      },
      {
        name: 'display',
        category: 'display',
        children: [
          { name: 'ForceDirectedLayout', value: 8411 },
          { name: 'DendrogramLayout', value: 4853 },
          { name: 'IndentedTreeLayout', value: 3174 },
          { name: 'BifocalDistortion', value: 4461 },
          { name: 'FisheyeDistortion', value: 3444 },
          { name: 'Arrays', value: 8258 },
          { name: 'Dates', value: 8217 },
        ],
      },
      {
        name: 'flex',
        category: 'flex',
        children: [
          { name: 'Layout', value: 7881 },
          { name: 'BundledEdgeRouter', value: 3727 },
          { name: 'PieLayout', value: 2728 },
          { name: 'OperatorList', value: 5248 },
          { name: 'OperatorSwitch', value: 2581 },
          { name: 'Sort', value: 6887 },
          { name: 'Tween', value: 6006 },
        ],
      },
      {
        name: 'physics',
        category: 'physics',
        children: [
          { name: 'Data', value: 20544 },
          { name: 'ScaleBinding', value: 11275 },
          { name: 'OperatorSequence', value: 4190 },
          { name: 'Operator', value: 2490 },
          { name: 'SparseMatrix', value: 3366 },
          { name: 'DenseMatrix', value: 3165 },
          { name: 'FunctionSequence', value: 5842 },
        ],
      },
      {
        name: 'query',
        category: 'query',
        children: [
          { name: 'DataList', value: 19788 },
          { name: 'TreeBuilder', value: 9930 },
          { name: 'DataSprite', value: 10349 },
          { name: 'Tree', value: 7147 },
          { name: 'Query', value: 13896 },
          { name: 'Expression', value: 5130 },
          { name: 'TimeScale', value: 5833 },
        ],
      },
      {
        name: 'scale',
        category: 'scale',
        children: [
          { name: 'NodeSprite', value: 19382 },
          { name: 'EdgeRenderer', value: 5569 },
          { name: 'EdgeSprite', value: 3301 },
          { name: 'DateUtil', value: 4141 },
          { name: 'Comparison', value: 5103 },
          { name: 'OrdinalScale', value: 3770 },
          { name: 'QuantitativeScale', value: 4839 },
        ],
      },
      {
        name: 'util',
        category: 'util',
        children: [
          { name: 'TooltipControl', value: 8435 },
          { name: 'HoverControl', value: 4896 },
          { name: 'ControlList', value: 4665 },
          { name: 'Axis', value: 24593 },
          { name: 'Axes', value: 1302 },
          { name: 'Arithmetic', value: 3891 },
          { name: 'Match', value: 3748 },
          { name: 'ExpressionIterator', value: 3617 },
          { name: 'HierarchicalCluster', value: 6714 },
        ],
      },
      {
        name: 'vis',
        category: 'vis',
        children: [
          { name: 'Legend', value: 20859 },
          { name: 'LegendRange', value: 10530 },
          { name: 'Visualization', value: 16540 },
          { name: 'MaxFlowCut', value: 7840 },
          { name: 'ShortestPaths', value: 5914 },
          { name: 'LinkDistance', value: 5731 },
          { name: 'BetweennessCentrality', value: 3534 },
          { name: 'NodeForce', value: 10498 },
          { name: 'Simulation', value: 9983 },
        ],
      },
    ],
  };
}

interface HierarchiesPageProps {
  activeComponent?: string;
}

export function HierarchiesPage({ activeComponent }: HierarchiesPageProps) {
  const flareData = useMemo(() => generateFlareHierarchyData(), []);

  const renderTreemap = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <Treemap
            title="Flare Software Package Hierarchy (Treemap)"
            subtitle="Nested treemap layout displaying package structure and size. Switch tiling algorithms using the Tiling method dropdown (binary, squarify, dice, slice, sliceDice, resquarify)."
            data={flareData}
            tilingMethod="binary"
            height={580}
            showControls={true}
            showLegend={true}
            interactive={true}
            valueFormatter={(v) => d3.format(',.0f')(v)}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderIndentedTree = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <IndentedTree
            title="Flare Package Directory Structure (Indented Tree)"
            subtitle="Vertical indented layout with orthogonal connecting lines, right-aligned Size & Count columns, and interactive expand/collapse nodes. Click any parent node to toggle expand/collapse."
            data={flareData}
            indentStep={24}
            rowHeight={24}
            col1Label="Size"
            col2Label="Count"
            interactive={true}
            initialExpandDepth={3}
            valueFormatter={(v) => d3.format(',.0f')(v)}
            countFormatter={(v) => (v !== undefined ? d3.format(',.0f')(v) : '-')}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderTidyTree = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <TidyTree
            title="Flare Software Package Structure (Tidy Tree)"
            subtitle="Node-link tree diagram using D3 Reingold-Tilford tidy tree layout algorithm with smooth curved bezier branch links, left/right text label anchoring, and interactive branch highlighting."
            data={flareData}
            orientation="horizontal"
            height={950}
            interactive={true}
            valueFormatter={(v) => d3.format(',.0f')(v)}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderRadialTree = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <RadialTree
            title="Flare Package Circular Hierarchy (Radial Tidy Tree)"
            subtitle="Concentric 360° circular tree layout radiating outwards from origin root. Features radial curved bezier links (d3.linkRadial), 180° text flip rotation, and interactive branch highlighting."
            data={flareData}
            height={920}
            interactive={true}
            valueFormatter={(v) => d3.format(',.0f')(v)}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderSunburst = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <SunburstChart
            title="Flare Package Partition Structure (Sunburst Diagram)"
            subtitle="Radial partition layout dividing concentric ring arcs proportionally to package node size. Click any arc slice to zoom into its subtree, or click the center circle to reset."
            data={flareData}
            height={880}
            interactive={true}
            valueFormatter={(v) => d3.format(',.0f')(v)}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Hierarchical Data Visualizations"
        subtitle="Hierarchy and tree visualization components for nested structures, package dependencies, and proportion breakdowns styled with Material Design 3 Expressive design tokens."
      />

      {(!activeComponent || activeComponent === 'treemap') && (
        <DemoSection
          title="Treemap"
          description="Displays hierarchical data as a set of nested rectangles sized proportionally to a quantitative node variable."
        >
          {renderTreemap()}
        </DemoSection>
      )}

      {(!activeComponent || activeComponent === 'indented-tree') && (
        <DemoSection
          title="Indented Tree"
          description="Displays hierarchical data as a vertical indented tree layout with orthogonal links, tabular columns, and expand/collapse nodes."
        >
          {renderIndentedTree()}
        </DemoSection>
      )}

      {(!activeComponent || activeComponent === 'tidy-tree') && (
        <DemoSection
          title="Tidy Tree"
          description="Node-link diagram laying out tree nodes using the Reingold-Tilford algorithm to minimize tree width and prevent overlapping labels."
        >
          {renderTidyTree()}
        </DemoSection>
      )}

      {(!activeComponent || activeComponent === 'radial-tree') && (
        <DemoSection
          title="Radial Tidy Tree"
          description="Concentric 360-degree node-link tree diagram radiating outwards from origin root node with radial curved links."
        >
          {renderRadialTree()}
        </DemoSection>
      )}

      {(!activeComponent || activeComponent === 'sunburst-chart') && (
        <DemoSection
          title="Sunburst Diagram"
          description="Radial partition chart dividing concentric rings into arcs proportional to node size, with interactive subtree zoom."
        >
          {renderSunburst()}
        </DemoSection>
      )}
    </div>
  );
}





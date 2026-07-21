import { useState } from 'react';
import { ForceDirectedGraph, DisjointForceDirectedGraph, DirectedForceGraph, ArcDiagram, Card, CardContent } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';


// Mobile Patent Suits dataset matching official D3 reference
const PATENT_SUITS_DATA = {
  nodes: [
    { id: 'Apple', label: 'Apple' },
    { id: 'HTC', label: 'HTC' },
    { id: 'Huawei', label: 'Huawei' },
    { id: 'RIM', label: 'RIM' },
    { id: 'LG', label: 'LG' },
    { id: 'Motorola', label: 'Motorola' },
    { id: 'Nokia', label: 'Nokia' },
    { id: 'Qualcomm', label: 'Qualcomm' },
    { id: 'Samsung', label: 'Samsung' },
    { id: 'Sony', label: 'Sony' },
    { id: 'ZTE', label: 'ZTE' },
    { id: 'Ericsson', label: 'Ericsson' },
    { id: 'Google', label: 'Google' },
    { id: 'Oracle', label: 'Oracle' },
    { id: 'Microsoft', label: 'Microsoft' },
    { id: 'Amazon', label: 'Amazon' },
    { id: 'Barnes & Noble', label: 'Barnes & Noble' },
    { id: 'Foxconn', label: 'Foxconn' },
    { id: 'Inventec', label: 'Inventec' },
    { id: 'Kodak', label: 'Kodak' },
  ],
  links: [
    { source: 'Microsoft', target: 'Amazon', type: 'licensing' },
    { source: 'Microsoft', target: 'HTC', type: 'licensing' },
    { source: 'Samsung', target: 'Apple', type: 'suit' },
    { source: 'Motorola', target: 'Apple', type: 'suit' },
    { source: 'Motorola', target: 'Microsoft', type: 'suit' },
    { source: 'Nokia', target: 'Apple', type: 'suit' },
    { source: 'Nokia', target: 'Qualcomm', type: 'suit' },
    { source: 'Apple', target: 'Motorola', type: 'suit' },
    { source: 'Apple', target: 'HTC', type: 'suit' },
    { source: 'Apple', target: 'Nokia', type: 'resolved' },
    { source: 'Apple', target: 'Samsung', type: 'suit' },
    { source: 'HTC', target: 'Apple', type: 'suit' },
    { source: 'Kodak', target: 'RIM', type: 'suit' },
    { source: 'Kodak', target: 'Apple', type: 'suit' },
    { source: 'Kodak', target: 'LG', type: 'suit' },
    { source: 'LG', target: 'Kodak', type: 'resolved' },
    { source: 'RIM', target: 'Kodak', type: 'suit' },
    { source: 'Sony', target: 'LG', type: 'licensing' },
    { source: 'Qualcomm', target: 'Nokia', type: 'resolved' },
    { source: 'Samsung', target: 'Kodak', type: 'suit' },
    { source: 'Kodak', target: 'Samsung', type: 'resolved' },
    { source: 'Huawei', target: 'ZTE', type: 'suit' },
    { source: 'ZTE', target: 'Huawei', type: 'suit' },
    { source: 'Ericsson', target: 'ZTE', type: 'suit' },
    { source: 'Oracle', target: 'Google', type: 'suit' },
    { source: 'Microsoft', target: 'Barnes & Noble', type: 'suit' },
    { source: 'Microsoft', target: 'Foxconn', type: 'suit' },
    { source: 'Microsoft', target: 'Inventec', type: 'suit' },
  ],
};


// Disjoint graph dataset matching D3 disjoint force-directed reference
const DISJOINT_GRAPH_DATA = (() => {
  const nodes: any[] = [];
  const links: any[] = [];

  // Cluster 1: Major Star Network (26 nodes)
  const hub1 = 'hub_1';
  nodes.push({ id: hub1, label: 'Central Core', group: 1, val: 24 });
  for (let i = 1; i <= 25; i++) {
    const leafId = `c1_node_${i}`;
    nodes.push({ id: leafId, label: `Core Node ${i}`, group: 1, val: 6 });
    links.push({ source: leafId, target: hub1, value: 2 });
  }

  // Cluster 2: Secondary Star (16 nodes)
  const hub2 = 'hub_2';
  nodes.push({ id: hub2, label: 'Analytics Cluster', group: 2, val: 20 });
  for (let i = 1; i <= 15; i++) {
    const leafId = `c2_node_${i}`;
    nodes.push({ id: leafId, label: `Worker ${i}`, group: 2, val: 5 });
    links.push({ source: leafId, target: hub2, value: 2 });
  }

  // Cluster 3: Third Star (12 nodes)
  const hub3 = 'hub_3';
  nodes.push({ id: hub3, label: 'Gateway Node', group: 1, val: 18 });
  for (let i = 1; i <= 11; i++) {
    const leafId = `c3_node_${i}`;
    nodes.push({ id: leafId, label: `Route ${i}`, group: 1, val: 5 });
    links.push({ source: leafId, target: hub3, value: 2 });
  }

  // Cluster 4: Fourth Star (10 nodes)
  const hub4 = 'hub_4';
  nodes.push({ id: hub4, label: 'Storage Cluster', group: 2, val: 16 });
  for (let i = 1; i <= 9; i++) {
    const leafId = `c4_node_${i}`;
    nodes.push({ id: leafId, label: `Volume ${i}`, group: 2, val: 5 });
    links.push({ source: leafId, target: hub4, value: 2 });
  }

  // 16 Disconnected Pairs (2 nodes each)
  for (let p = 1; p <= 16; p++) {
    const nA = `pair_${p}_a`;
    const nB = `pair_${p}_b`;
    const grp = (p % 2) + 1;
    nodes.push({ id: nA, label: `Pair ${p}A`, group: grp, val: 6 });
    nodes.push({ id: nB, label: `Pair ${p}B`, group: grp, val: 6 });
    links.push({ source: nA, target: nB, value: 1.5 });
  }

  // 12 Disconnected Triads (3 nodes each)
  for (let t = 1; t <= 12; t++) {
    const tA = `triad_${t}_a`;
    const tB = `triad_${t}_b`;
    const tC = `triad_${t}_c`;
    const grp = (t % 2) + 1;
    nodes.push({ id: tA, label: `Triad ${t}A`, group: grp, val: 7 });
    nodes.push({ id: tB, label: `Triad ${t}B`, group: grp, val: 6 });
    nodes.push({ id: tC, label: `Triad ${t}C`, group: grp, val: 6 });
    links.push({ source: tA, target: tB, value: 1.5 });
    links.push({ source: tA, target: tC, value: 1.5 });
  }

  return { nodes, links };
})();

// Classic Les Misérables Character Co-occurrence Network dataset
const LES_MISERABLES_DATA = {
  nodes: [
    { id: 'Myriel', label: 'Myriel', group: 1, val: 10 },
    { id: 'Napoleon', label: 'Napoleon', group: 1, val: 2 },
    { id: 'Mlle.Baptistine', label: 'Mlle. Baptistine', group: 1, val: 5 },
    { id: 'Mme.Magloire', label: 'Mme. Magloire', group: 1, val: 5 },
    { id: 'CountessdeLo', label: 'Countess de Lo', group: 1, val: 1 },
    { id: 'Geborand', label: 'Geborand', group: 1, val: 1 },
    { id: 'Champtercier', label: 'Champtercier', group: 1, val: 1 },
    { id: 'Cravatte', label: 'Cravatte', group: 1, val: 1 },
    { id: 'Count', label: 'Count', group: 1, val: 1 },
    { id: 'OldMan', label: 'Old Man', group: 1, val: 1 },
    { id: 'Labarre', label: 'Labarre', group: 2, val: 2 },
    { id: 'Valjean', label: 'Jean Valjean', group: 2, val: 30 },
    { id: 'Marguerite', label: 'Marguerite', group: 3, val: 3 },
    { id: 'Mme.deR', label: 'Mme. de R', group: 2, val: 1 },
    { id: 'Isabeau', label: 'Isabeau', group: 2, val: 1 },
    { id: 'Gervais', label: 'Gervais', group: 2, val: 1 },
    { id: 'Tholomyes', label: 'Tholomyes', group: 3, val: 9 },
    { id: 'Listolier', label: 'Listolier', group: 3, val: 4 },
    { id: 'Fameuil', label: 'Fameuil', group: 3, val: 4 },
    { id: 'Blacheville', label: 'Blacheville', group: 3, val: 4 },
    { id: 'Favourite', label: 'Favourite', group: 3, val: 4 },
    { id: 'Dahlia', label: 'Dahlia', group: 3, val: 4 },
    { id: 'Zephine', label: 'Zephine', group: 3, val: 4 },
    { id: 'Fantine', label: 'Fantine', group: 3, val: 15 },
    { id: 'Mme.Thenardier', label: 'Mme. Thenardier', group: 4, val: 11 },
    { id: 'Thenardier', label: 'Thenardier', group: 4, val: 16 },
    { id: 'Cosette', label: 'Cosette', group: 5, val: 15 },
    { id: 'Javert', label: 'Javert', group: 4, val: 18 },
    { id: 'Fauchelevent', label: 'Fauchelevent', group: 0, val: 4 },
    { id: 'Bamatabois', label: 'Bamatabois', group: 3, val: 8 },
    { id: 'Perpetue', label: 'Perpetue', group: 3, val: 2 },
    { id: 'Simplice', label: 'Simplice', group: 2, val: 4 },
    { id: 'Scaufflaire', label: 'Scaufflaire', group: 2, val: 1 },
    { id: 'Woman1', label: 'Woman 1', group: 2, val: 2 },
    { id: 'Judge', label: 'Judge', group: 2, val: 6 },
    { id: 'Champmathieu', label: 'Champmathieu', group: 2, val: 6 },
    { id: 'Brevet', label: 'Brevet', group: 2, val: 6 },
    { id: 'Chenildieu', label: 'Chenildieu', group: 2, val: 6 },
    { id: 'Cochepaille', label: 'Cochepaille', group: 2, val: 6 },
    { id: 'Pontmercy', label: 'Pontmercy', group: 6, val: 3 },
    { id: 'Boulatruelle', label: 'Boulatruelle', group: 4, val: 1 },
    { id: 'Eponine', label: 'Eponine', group: 4, val: 11 },
    { id: 'Anzelma', label: 'Anzelma', group: 4, val: 3 },
    { id: 'Gavroche', label: 'Gavroche', group: 7, val: 22 },
    { id: 'Marius', label: 'Marius', group: 6, val: 20 },
    { id: 'Enjolras', label: 'Enjolras', group: 7, val: 15 },
    { id: 'Combeferre', label: 'Combeferre', group: 7, val: 10 },
    { id: 'Prouvaire', label: 'Prouvaire', group: 7, val: 6 },
    { id: 'Feuilly', label: 'Feuilly', group: 7, val: 8 },
    { id: 'Courfeyrac', label: 'Courfeyrac', group: 7, val: 10 },
    { id: 'Bahorel', label: 'Bahorel', group: 7, val: 7 },
    { id: 'Bossuet', label: 'Bossuet', group: 7, val: 9 },
    { id: 'Joly', label: 'Joly', group: 7, val: 8 },
    { id: 'Grantaire', label: 'Grantaire', group: 7, val: 10 },
  ],
  links: [
    { source: 'Napoleon', target: 'Myriel', value: 1 },
    { source: 'Mlle.Baptistine', target: 'Myriel', value: 8 },
    { source: 'Mme.Magloire', target: 'Myriel', value: 10 },
    { source: 'Mme.Magloire', target: 'Mlle.Baptistine', value: 6 },
    { source: 'CountessdeLo', target: 'Myriel', value: 1 },
    { source: 'Geborand', target: 'Myriel', value: 1 },
    { source: 'Champtercier', target: 'Myriel', value: 1 },
    { source: 'Cravatte', target: 'Myriel', value: 1 },
    { source: 'Count', target: 'Myriel', value: 2 },
    { source: 'OldMan', target: 'Myriel', value: 1 },
    { source: 'Valjean', target: 'Labarre', value: 1 },
    { source: 'Valjean', target: 'Mme.Magloire', value: 3 },
    { source: 'Valjean', target: 'Mlle.Baptistine', value: 3 },
    { source: 'Valjean', target: 'Myriel', value: 5 },
    { source: 'Marguerite', target: 'Valjean', value: 1 },
    { source: 'Mme.deR', target: 'Valjean', value: 1 },
    { source: 'Isabeau', target: 'Valjean', value: 1 },
    { source: 'Gervais', target: 'Valjean', value: 1 },
    { source: 'Tholomyes', target: 'Fantine', value: 4 },
    { source: 'Listolier', target: 'Tholomyes', value: 3 },
    { source: 'Fameuil', target: 'Tholomyes', value: 3 },
    { source: 'Blacheville', target: 'Tholomyes', value: 3 },
    { source: 'Favourite', target: 'Tholomyes', value: 3 },
    { source: 'Dahlia', target: 'Tholomyes', value: 3 },
    { source: 'Zephine', target: 'Tholomyes', value: 3 },
    { source: 'Fantine', target: 'Marguerite', value: 2 },
    { source: 'Valjean', target: 'Fantine', value: 9 },
    { source: 'Javert', target: 'Valjean', value: 17 },
    { source: 'Javert', target: 'Fantine', value: 5 },
    { source: 'Thenardier', target: 'Valjean', value: 12 },
    { source: 'Thenardier', target: 'Fantine', value: 7 },
    { source: 'Thenardier', target: 'Javert', value: 5 },
    { source: 'Mme.Thenardier', target: 'Thenardier', value: 13 },
    { source: 'Mme.Thenardier', target: 'Fantine', value: 3 },
    { source: 'Cosette', target: 'Mme.Thenardier', value: 4 },
    { source: 'Cosette', target: 'Valjean', value: 12 },
    { source: 'Cosette', target: 'Tholomyes', value: 1 },
    { source: 'Cosette', target: 'Thenardier', value: 4 },
    { source: 'Cosette', target: 'Javert', value: 1 },
    { source: 'Fauchelevent', target: 'Valjean', value: 8 },
    { source: 'Bamatabois', target: 'Fantine', value: 1 },
    { source: 'Bamatabois', target: 'Javert', value: 1 },
    { source: 'Simplice', target: 'Valjean', value: 3 },
    { source: 'Champmathieu', target: 'Valjean', value: 3 },
    { source: 'Champmathieu', target: 'Judge', value: 3 },
    { source: 'Judge', target: 'Valjean', value: 3 },
    { source: 'Brevet', target: 'Judge', value: 2 },
    { source: 'Brevet', target: 'Valjean', value: 2 },
    { source: 'Chenildieu', target: 'Judge', value: 2 },
    { source: 'Chenildieu', target: 'Valjean', value: 2 },
    { source: 'Cochepaille', target: 'Judge', value: 2 },
    { source: 'Cochepaille', target: 'Valjean', value: 2 },
    { source: 'Eponine', target: 'Thenardier', value: 5 },
    { source: 'Eponine', target: 'Mme.Thenardier', value: 2 },
    { source: 'Anzelma', target: 'Mme.Thenardier', value: 1 },
    { source: 'Anzelma', target: 'Thenardier', value: 2 },
    { source: 'Gavroche', target: 'Thenardier', value: 1 },
    { source: 'Gavroche', target: 'Valjean', value: 1 },
    { source: 'Gavroche', target: 'Javert', value: 1 },
    { source: 'Marius', target: 'Cosette', value: 11 },
    { source: 'Marius', target: 'Valjean', value: 10 },
    { source: 'Marius', target: 'Thenardier', value: 5 },
    { source: 'Marius', target: 'Eponine', value: 5 },
    { source: 'Enjolras', target: 'Marius', value: 7 },
    { source: 'Enjolras', target: 'Gavroche', value: 6 },
    { source: 'Enjolras', target: 'Javert', value: 6 },
    { source: 'Combeferre', target: 'Enjolras', value: 15 },
    { source: 'Prouvaire', target: 'Enjolras', value: 4 },
    { source: 'Feuilly', target: 'Enjolras', value: 6 },
    { source: 'Courfeyrac', target: 'Enjolras', value: 17 },
    { source: 'Courfeyrac', target: 'Marius', value: 9 },
    { source: 'Bahorel', target: 'Enjolras', value: 4 },
    { source: 'Bossuet', target: 'Enjolras', value: 10 },
    { source: 'Joly', target: 'Enjolras', value: 5 },
    { source: 'Grantaire', target: 'Enjolras', value: 8 },
  ],
};

// System Architecture Network dataset
const TECH_STACK_DATA = {
  nodes: [
    { id: 'WebUI', label: 'React Frontend', group: 'Frontend', val: 16 },
    { id: 'MobileApp', label: 'Mobile Client', group: 'Frontend', val: 12 },
    { id: 'APIGateway', label: 'API Gateway', group: 'API Layer', val: 24 },
    { id: 'AuthService', label: 'Auth Service', group: 'Services', val: 10 },
    { id: 'UserService', label: 'User Microservice', group: 'Services', val: 14 },
    { id: 'OrderService', label: 'Order Service', group: 'Services', val: 18 },
    { id: 'PaymentService', label: 'Payment Gateway', group: 'Services', val: 12 },
    { id: 'Notification', label: 'Notification Service', group: 'Services', val: 8 },
    { id: 'PostgreSQL', label: 'PostgreSQL DB', group: 'Database', val: 20 },
    { id: 'Redis', label: 'Redis Cache', group: 'Database', val: 15 },
    { id: 'RabbitMQ', label: 'RabbitMQ Broker', group: 'Message Bus', val: 14 },
    { id: 'Kubernetes', label: 'K8s Cluster', group: 'DevOps', val: 22 },
  ],
  links: [
    { source: 'WebUI', target: 'APIGateway', value: 8 },
    { source: 'MobileApp', target: 'APIGateway', value: 5 },
    { source: 'APIGateway', target: 'AuthService', value: 6 },
    { source: 'APIGateway', target: 'UserService', value: 7 },
    { source: 'APIGateway', target: 'OrderService', value: 9 },
    { source: 'UserService', target: 'PostgreSQL', value: 8 },
    { source: 'UserService', target: 'Redis', value: 6 },
    { source: 'OrderService', target: 'PaymentService', value: 7 },
    { source: 'OrderService', target: 'PostgreSQL', value: 9 },
    { source: 'OrderService', target: 'RabbitMQ', value: 6 },
    { source: 'PaymentService', target: 'RabbitMQ', value: 4 },
    { source: 'RabbitMQ', target: 'Notification', value: 5 },
    { source: 'Kubernetes', target: 'APIGateway', value: 4 },
    { source: 'Kubernetes', target: 'UserService', value: 4 },
    { source: 'Kubernetes', target: 'OrderService', value: 4 },
  ],
};

interface NetworksPageProps {
  activeComponent?: string;
}

export function NetworksPage({ activeComponent }: NetworksPageProps) {
  const [clickedNode, setClickedNode] = useState<any>(null);

  const renderForceDirectedGraph = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <ForceDirectedGraph
            title="Les Misérables Character Network"
            subtitle="Force-directed layout of character co-appearances in Victor Hugo's novel. Drag nodes, zoom/pan, or click legend groups to filter."
            nodes={LES_MISERABLES_DATA.nodes}
            links={LES_MISERABLES_DATA.links}
            height={520}
            linkDistance={55}
            chargeStrength={-120}
            showLabels={true}
            showLegend={true}
            draggable={true}
            zoomable={true}
            interactive={true}
            onNodeClick={(node) => setClickedNode(node)}
          />

          {clickedNode && (
            <div
              style={{
                marginTop: 16,
                padding: '12px 16px',
                borderRadius: 8,
                background: 'var(--md-sys-color-surface-container-high)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                fontSize: 13,
                color: 'var(--md-sys-color-on-surface)',
              }}
            >
              <strong>Selected Node:</strong> {clickedNode.label || clickedNode.id} (Group {clickedNode.group}, Relative Weight: {clickedNode.val || 1})
            </div>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <ForceDirectedGraph
            title="Microservices Architecture Network"
            subtitle="Topology visualization of backend services, database clusters, and message queues."
            nodes={TECH_STACK_DATA.nodes}
            links={TECH_STACK_DATA.links}
            height={440}
            nodeRadius={(node) => Math.max(8, Math.sqrt(node.val || 10) * 2.5)}
            linkDistance={80}
            chargeStrength={-200}
            showLabels={true}
            showLegend={true}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderDisjointForceDirectedGraph = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <DisjointForceDirectedGraph
            title="Disjoint Network Clusters"
            subtitle="Layout containing multiple independent, unconnected sub-graph clusters, pairs, and star hubs positioned naturally across canvas using gentle radial forces without central collapse."
            nodes={DISJOINT_GRAPH_DATA.nodes}
            links={DISJOINT_GRAPH_DATA.links}
            height={560}
            nodeRadius={(node) => (node.val && node.val > 10 ? 8 : 5)}
            linkDistance={30}
            chargeStrength={-35}
            showLabels={false}
            showLegend={true}
            draggable={true}
            zoomable={true}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderMobilePatentSuits = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <DirectedForceGraph
            title="Mobile Patent Suits Network"
            subtitle="Directed graph showing patent litigations, licensing agreements, and resolved suits between major technology companies. Uses curved SVG arc paths and arrowhead markers."
            nodes={PATENT_SUITS_DATA.nodes}
            links={PATENT_SUITS_DATA.links}
            height={560}
            nodeRadius={5}
            linkDistance={95}
            chargeStrength={-350}
            showLabels={true}
            showLegend={true}
            draggable={true}
            zoomable={true}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderArcDiagram = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <ArcDiagram
            title="Les Misérables Character Co-occurrences (Arc Diagram)"
            subtitle="1D layout of character nodes arranged vertically by group with semicircular arcs connecting character appearances. Hover over nodes or arcs to highlight relationship clusters."
            nodes={LES_MISERABLES_DATA.nodes}
            links={LES_MISERABLES_DATA.links}
            orientation="vertical"
            order="group"
            height={900}
            nodeRadius={4}
            showLabels={true}
            showLegend={true}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Network & Graph Visualization"
        subtitle="Interactive force-directed graph components built with D3 force simulation and styled with Material Design 3 Expressive tokens. Supports drag physics, multi-level zooming, node highlighting, group legend filters, and custom sizing."
      />

      {(!activeComponent || activeComponent === 'force-directed-graph') && (
        <DemoSection
          title="Force-Directed Graph"
          description="Visualizes connected network topologies, social connections, and relational data using D3's velocity Verlet numerical integrator."
        >
          {renderForceDirectedGraph()}
        </DemoSection>
      )}

      {(!activeComponent || activeComponent === 'disjoint-force-directed-graph') && (
        <DemoSection
          title="Disjoint Force-Directed Graph"
          description="Specialized layout for networks with disconnected subgraphs, isolated node pairs, and independent clusters that float naturally without collapsing to the center."
        >
          {renderDisjointForceDirectedGraph()}
        </DemoSection>
      )}

      {(!activeComponent || activeComponent === 'mobile-patent-suits') && (
        <DemoSection
          title="Mobile Patent Suits (Directed Graph)"
          description="Directed graph visualization with curved arc links and directional arrow markers representing lawsuits, licensing, and settlements."
        >
          {renderMobilePatentSuits()}
        </DemoSection>
      )}

      {(!activeComponent || activeComponent === 'arc-diagram') && (
        <DemoSection
          title="Arc Diagram"
          description="One-dimensional layout placing nodes linearly along an axis with semicircular arcs connecting related node pairs."
        >
          {renderArcDiagram()}
        </DemoSection>
      )}
    </div>
  );
}





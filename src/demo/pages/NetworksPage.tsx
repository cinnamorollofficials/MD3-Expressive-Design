import { useState } from 'react';
import { ForceDirectedGraph, Card, CardContent } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Network & Graph Visualization"
        subtitle="Interactive force-directed graph components built with D3 force simulation and styled with Material Design 3 Expressive tokens. Supports drag physics, multi-level zooming, node highlighting, group legend filters, and custom sizing."
      />

      {(!activeComponent || activeComponent === 'force-directed-graph') && (
        <DemoSection
          title="Force-Directed Graph"
          description="Visualizes network topologies, social connections, and relational data using D3's velocity Verlet numerical integrator."
        >
          {renderForceDirectedGraph()}
        </DemoSection>
      )}
    </div>
  );
}


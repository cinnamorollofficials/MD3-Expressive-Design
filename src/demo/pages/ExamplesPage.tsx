import { Card, CardContent, CardTitle, CardBody, Button, Icon } from '../../lib';
import { PageTitle } from '../components/DemoSection';

interface ExamplesPageProps {
  onNavigate: (id: string) => void;
}

export function ExamplesPage({ onNavigate }: ExamplesPageProps) {
  const examples = [
    {
      id: 'shop-dashboard',
      title: 'Shop Dashboard',
      description: 'An e-commerce management dashboard demonstrating cards, data tables, sliders, and navigation drawer components in a themed control center.',
      icon: 'storefront',
    },
    {
      id: 'company-profile',
      title: 'Company Profile',
      description: 'A responsive corporate web page presenting hero sections, pricing cards, dialogs, sliders, carousels, and modern navigation structures.',
      icon: 'business',
    },
  ];

  return (
    <>
      <PageTitle
        title="Application Examples"
        subtitle="Real-world layouts and pages built using the MD3 Expressive component library."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginTop: 16 }}>
        {examples.map(ex => (
          <Card key={ex.id} variant="outlined" style={{ height: '100%' }}>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'var(--md-sys-color-primary-container)',
                  color: 'var(--md-sys-color-on-primary-container)',
                }}>
                  <Icon name={ex.icon} size={28} />
                </div>
                <CardTitle>{ex.title}</CardTitle>
                <CardBody>{ex.description}</CardBody>
                <div style={{ paddingTop: 16 }}>
                  <Button
                    variant="filled"
                    endIcon="arrow_forward"
                    onClick={() => onNavigate(ex.id)}
                  >
                    View Example
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

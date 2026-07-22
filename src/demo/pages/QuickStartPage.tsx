import { Button, Card, CardBody, CardContent, CardTitle, Icon } from '../../lib';
import { CodeBlock } from '../components/CodeBlock';
import { PageTitle } from '../components/DemoSection';

const steps = [
  { number: '01', icon: 'download', title: 'Install the package', body: 'Add the component library to an existing React application.' },
  { number: '02', icon: 'palette', title: 'Load styles and theme', body: 'Import the stylesheet once and wrap the application with ThemeProvider.' },
  { number: '03', icon: 'widgets', title: 'Build your first UI', body: 'Import only the components you need and compose them normally.' },
];

export function QuickStartPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <PageTitle title="Quick start" subtitle="Go from installation to your first MD3 Expressive interface in a few minutes." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {steps.map(step => (
          <Card key={step.number} variant="filled">
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 14, background: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)' }}>
                  <Icon name={step.icon} size={22} />
                </span>
                <strong style={{ color: 'var(--md-sys-color-primary)', fontSize: 12 }}>{step.number}</strong>
              </div>
              <CardTitle>{step.title}</CardTitle>
              <CardBody>{step.body}</CardBody>
            </CardContent>
          </Card>
        ))}
      </div>

      <section>
        <h2 style={{ font: 'var(--md-sys-typescale-headline-small)', marginBottom: 8 }}>1. Install</h2>
        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 16 }}>Install from npm using your preferred package manager.</p>
        <CodeBlock code="npm install @hadi_gunawan/md3-expressive-ds" language="bash" />
      </section>

      <section>
        <h2 style={{ font: 'var(--md-sys-typescale-headline-small)', marginBottom: 8 }}>2. Set up the theme</h2>
        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 16 }}>Import the global stylesheet once, then provide synchronized theme state at the app root.</p>
        <CodeBlock code={`import { ThemeProvider } from '@hadi_gunawan/md3-expressive-ds';
import '@hadi_gunawan/md3-expressive-ds/style.css';

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);`} />
      </section>

      <section>
        <h2 style={{ font: 'var(--md-sys-typescale-headline-small)', marginBottom: 8 }}>3. Use a component</h2>
        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 16 }}>Components are typed, theme-aware, and ready to compose.</p>
        <div style={{ padding: 28, marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', borderRadius: 24, background: 'var(--md-sys-color-surface-container-low)' }}>
          <Button variant="filled" startIcon="add">Create project</Button>
          <Button variant="tonal">Learn more</Button>
          <Button variant="outlined" endIcon="arrow_forward">Continue</Button>
        </div>
        <CodeBlock code={`import { Button } from '@hadi_gunawan/md3-expressive-ds';

export function Actions() {
  return (
    <Button variant="filled" startIcon="add">
      Create project
    </Button>
  );
}`} />
      </section>

      <Card variant="outlined">
        <CardContent>
          <CardTitle>Ready to explore?</CardTitle>
          <CardBody>Open a component category for API details, accessibility guidance, and interactive examples.</CardBody>
          <div style={{ marginTop: 18 }}><Button variant="filled" endIcon="arrow_forward" onClick={() => { window.location.hash = 'buttons'; }}>Browse components</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}

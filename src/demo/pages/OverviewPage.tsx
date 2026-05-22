import { Card, CardContent, CardTitle, CardBody, Button, Icon } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

const COUNTS = [
  { label: 'Components', value: '40+' },
  { label: 'Themes', value: '3' },
  { label: 'Modes', value: 'Light + Dark' },
  { label: 'Spec', value: 'MD3 Expressive' },
];

export function OverviewPage() {
  return (
    <>
      <PageTitle title="MD3 Expressive" subtitle="A React + TypeScript design system implementing Material Design 3 Expressive." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 48 }}>
        {COUNTS.map(c => (
          <Card key={c.label} variant="filled">
            <CardContent>
              <CardTitle>{c.value}</CardTitle>
              <CardBody>{c.label}</CardBody>
            </CardContent>
          </Card>
        ))}
      </div>

      <DemoSection
        title="What's Expressive about it"
        description="Material 3 Expressive (2025) adds shape morphing, springier motion, larger size scales, and a few new components."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, width: '100%' }}>
          {[
            ['shapes', 'Shape morphing', 'Components interpolate corner radius on press'],
            ['animation', 'Spring motion', 'Emphasized easing and bouncier transitions'],
            ['blur_on', 'Loading blob', 'Shape-morphing loader through MD3 shapes'],
            ['toolbar', 'Toolbar', 'New floating pill-shaped action cluster'],
            ['fab', 'FAB Menu', 'Staggered fan-out menu of related actions'],
            ['call_split', 'Split Button', 'Primary action + paired dropdown'],
            ['graphic_eq', 'Wavy progress', 'Animated wavy linear progress indicator'],
            ['palette', 'Color presets', 'Purple, Ocean, Forest in light + dark'],
          ].map(([icon, title, body]) => (
            <Card key={title as string} variant="outlined">
              <CardContent>
                <Icon name={icon as string} size={28} />
                <CardTitle>{title}</CardTitle>
                <CardBody>{body}</CardBody>
              </CardContent>
            </Card>
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="Quick start"
        code={`import { Button, Card } from './lib';

<Button variant="filled" startIcon="favorite">Like</Button>
<Button variant="tonal">Tonal</Button>
<Button variant="outlined" endIcon="arrow_forward">Continue</Button>`}
      >
        <Button variant="filled" startIcon="favorite">Like</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="outlined" endIcon="arrow_forward">Continue</Button>
      </DemoSection>
    </>
  );
}

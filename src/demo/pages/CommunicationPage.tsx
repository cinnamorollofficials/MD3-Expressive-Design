import { useState } from 'react';
import { Badge, ProgressIndicator, LoadingIndicator, IconButton, Banner, Button } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

export function CommunicationPage({ activeComponent }: { activeComponent?: string }) {
  const [prog, setProg] = useState(40);
  const showAll = !activeComponent;

  return (
    <>
      <PageTitle title="Communication" subtitle="Badges, progress indicators, and the Expressive shape-morphing loader." />

      {(showAll || activeComponent === 'badge') && (
        <DemoSection
          title="Badges"
          code={`<Badge dot><IconButton icon="notifications" label="Notifications"/></Badge>
<Badge count={3}><IconButton icon="mail" label="Mail"/></Badge>
<Badge count={120}><IconButton icon="inbox" label="Inbox"/></Badge>`}
        >
          <Badge dot><IconButton icon="notifications" label="Notifications" /></Badge>
          <Badge count={3}><IconButton icon="mail" label="Mail" /></Badge>
          <Badge count={120}><IconButton icon="inbox" label="Inbox" /></Badge>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'progress-indicator') && (
        <>
          <DemoSection
            title="Linear Progress"
            code={`<ProgressIndicator value={40} />
<ProgressIndicator />  // indeterminate
<ProgressIndicator value={60} wavy />  // Expressive wavy`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
              <ProgressIndicator value={prog} />
              <ProgressIndicator />
              <ProgressIndicator value={prog} wavy />
              <input
                type="range" min={0} max={100} value={prog}
                onChange={(e) => setProg(Number(e.target.value))}
                style={{ width: 240 }}
              />
            </div>
          </DemoSection>

          <DemoSection
            title="Circular Progress"
            code={`<ProgressIndicator variant="circular" value={75} />
<ProgressIndicator variant="circular" />`}
          >
            <ProgressIndicator variant="circular" value={75} />
            <ProgressIndicator variant="circular" />
          </DemoSection>
        </>
      )}

      {(showAll || activeComponent === 'banner') && (
        <DemoSection
          title="Banners"
          description="Prominent inline messages — use for app-level status that needs acknowledgement."
          code={`<Banner variant="info" title="Sync paused" actions={<Button variant="text">Resume</Button>}>
  We'll keep your changes locally until reconnected.
</Banner>`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 640 }}>
            <Banner
              variant="info"
              title="Sync paused"
              actions={<Button variant="text">Resume</Button>}
              onDismiss={() => {}}
            >
              We'll keep your changes locally until reconnected.
            </Banner>
            <Banner variant="success" title="Backup complete">
              All 1,284 photos saved to the cloud.
            </Banner>
            <Banner variant="warning" title="Storage almost full" actions={<Button variant="text">Manage</Button>}>
              You're using 94% of your plan.
            </Banner>
            <Banner variant="error" title="Payment failed" onDismiss={() => {}}>
              Update your card to keep your subscription active.
            </Banner>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'loading-indicator') && (
        <DemoSection
          title="Loading Indicator (Expressive)"
          description="A shape-morphing blob that interpolates between MD3 expressive shapes — circle, scallop, pentagon, clover — while it spins."
          code={`<LoadingIndicator />
<LoadingIndicator size={64} />`}
        >
          <LoadingIndicator />
          <LoadingIndicator size={64} />
          <LoadingIndicator size={96} />
        </DemoSection>
      )}
    </>
  );
}

import { useState } from 'react';
import { PageTitle, DemoSection } from '../components/DemoSection';
import { Button, Icon } from '../../lib';

export function MotionPage() {
  const [activeDuration, setActiveDuration] = useState<'short' | 'medium' | 'long'>('medium');
  const [activeEasing, setActiveEasing] = useState<'standard' | 'decelerated' | 'spring'>('spring');
  const [isMoved, setIsMoved] = useState(false);

  // Map user choices to actual design system CSS variables
  const durationVal = activeDuration === 'short'
    ? 'var(--md-sys-motion-duration-short3)'
    : activeDuration === 'medium'
      ? 'var(--md-sys-motion-duration-medium3)'
      : 'var(--md-sys-motion-duration-long4)';

  const easingVal = activeEasing === 'standard'
    ? 'var(--md-sys-motion-easing-standard)'
    : activeEasing === 'decelerated'
      ? 'var(--md-sys-motion-easing-decelerate)'
      : 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // Expressive Spring Bouncy

  const triggerAnimation = () => {
    setIsMoved(prev => !prev);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Motion & Transition"
        subtitle="Expressive transitions introduce bouncy spring physics and shape morphs, providing smooth reactive layouts."
      />

      {/* Physics Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: 24,
        background: 'var(--md-sys-color-surface-container-low)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        padding: '24px'
      }}>
        {/* Play box */}
        <div style={{
          background: 'var(--md-sys-color-surface-container-lowest)',
          border: '1px dashed var(--md-sys-color-outline-variant)',
          borderRadius: 'var(--md-sys-shape-corner-medium)',
          height: '240px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: '0 48px'
        }}>
          {/* Animated Blob */}
          <div style={{
            width: isMoved ? 180 : 80,
            height: 80,
            borderRadius: isMoved ? 'var(--md-sys-shape-corner-large)' : 'var(--md-sys-shape-corner-full)',
            background: isMoved ? 'var(--md-sys-color-tertiary)' : 'var(--md-sys-color-primary)',
            transform: isMoved ? 'translateX(180px) rotate(45deg)' : 'translateX(0px) rotate(0deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isMoved ? 'var(--md-sys-color-on-tertiary)' : 'var(--md-sys-color-on-primary)',
            font: 'var(--md-sys-typescale-title-small)',
            transition: `all ${durationVal} ${easingVal}`,
            boxShadow: 'var(--md-sys-elevation-2)'
          }}>
            <Icon name={isMoved ? 'blur_on' : 'category'} size={32} />
          </div>
        </div>

        {/* Easing parameters controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ font: 'var(--md-sys-typescale-title-medium)', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
            Animation Settings
          </div>

          {/* Duration selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>Duration</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['short', 'medium', 'long'] as const).map(d => (
                <Button
                  key={d}
                  variant={activeDuration === d ? 'filled' : 'outlined'}
                  size="sm"
                  onClick={() => setActiveDuration(d)}
                  style={{ flex: 1 }}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>

          {/* Easing selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>Easing Curve</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(['standard', 'decelerated', 'spring'] as const).map(e => (
                <Button
                  key={e}
                  variant={activeEasing === e ? 'filled' : 'outlined'}
                  size="sm"
                  onClick={() => setActiveEasing(e)}
                >
                  {e === 'spring' ? 'Expressive Bouncy' : e}
                </Button>
              ))}
            </div>
          </div>

          <Button variant="tonal" onClick={triggerAnimation} startIcon="play_arrow" style={{ marginTop: 'auto' }}>
            Animate Morph
          </Button>
        </div>
      </div>

      {/* Specifications */}
      <DemoSection title="Transition Tokens Specs">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%' }}>
          <div>
            <h4 style={{ font: 'var(--md-sys-typescale-title-medium)', marginBottom: 12, color: 'var(--md-sys-color-on-surface)' }}>Durations</h4>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--md-sys-color-on-surface-variant)', font: 'var(--md-sys-typescale-body-medium)' }}>
              <li><code>--md-sys-motion-duration-short1</code> (50ms) - Instant feedback.</li>
              <li><code>--md-sys-motion-duration-short3</code> (150ms) - Hover / focus triggers.</li>
              <li><code>--md-sys-motion-duration-medium3</code> (300ms) - Expand card / side sheets.</li>
              <li><code>--md-sys-motion-duration-long4</code> (500ms) - Dialog opens / full screen morph.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ font: 'var(--md-sys-typescale-title-medium)', marginBottom: 12, color: 'var(--md-sys-color-on-surface)' }}>Easing Curves</h4>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--md-sys-color-on-surface-variant)', font: 'var(--md-sys-typescale-body-medium)' }}>
              <li><code>--md-sys-motion-easing-standard</code> - Organic acceleration and deceleration.</li>
              <li><code>--md-sys-motion-easing-decelerate</code> - Entering elements slide-in focus.</li>
              <li><code>--md-sys-motion-easing-accelerate</code> - Exiting elements slide-out focus.</li>
              <li><code>Expressive Spring</code> - Bouncy overshoot transitions (used in FABMenu).</li>
            </ul>
          </div>
        </div>
      </DemoSection>
    </div>
  );
}

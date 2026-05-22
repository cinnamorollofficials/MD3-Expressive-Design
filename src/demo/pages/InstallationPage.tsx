import { DemoSection, PageTitle } from '../components/DemoSection';
import { Card, CardContent, CardTitle, CardBody, Button, Icon } from '../../lib';
import { useState } from 'react';

export function InstallationPage() {
  const [copiedText, setCopiedText] = useState<'npm' | 'yarn' | 'pnpm' | null>(null);

  const copyCommand = (cmd: 'npm' | 'yarn' | 'pnpm', text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(cmd);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Installation"
        subtitle="Get started integrating Material Design 3 Expressive components into your React project."
      />

      {/* Package manager grids */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <Card variant="outlined">
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CardTitle>npm</CardTitle>
              <Button
                variant="text"
                size="sm"
                startIcon={copiedText === 'npm' ? 'done' : 'content_copy'}
                onClick={() => copyCommand('npm', 'npm i @hadi_gunawan/md3-expressive-ds')}
              >
                {copiedText === 'npm' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre style={{
              background: 'var(--md-sys-color-surface-container-high)',
              padding: '12px',
              borderRadius: 'var(--md-sys-shape-corner-medium)',
              fontFamily: 'monospace',
              fontSize: 14,
              color: 'var(--md-sys-color-primary)',
              overflowX: 'auto',
              margin: '8px 0 0 0'
            }}>
              <code>npm i @hadi_gunawan/md3-expressive-ds</code>
            </pre>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CardTitle>yarn</CardTitle>
              <Button
                variant="text"
                size="sm"
                startIcon={copiedText === 'yarn' ? 'done' : 'content_copy'}
                onClick={() => copyCommand('yarn', 'yarn add @hadi_gunawan/md3-expressive-ds')}
              >
                {copiedText === 'yarn' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre style={{
              background: 'var(--md-sys-color-surface-container-high)',
              padding: '12px',
              borderRadius: 'var(--md-sys-shape-corner-medium)',
              fontFamily: 'monospace',
              fontSize: 14,
              color: 'var(--md-sys-color-primary)',
              overflowX: 'auto',
              margin: '8px 0 0 0'
            }}>
              <code>yarn add @hadi_gunawan/md3-expressive-ds</code>
            </pre>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CardTitle>pnpm</CardTitle>
              <Button
                variant="text"
                size="sm"
                startIcon={copiedText === 'pnpm' ? 'done' : 'content_copy'}
                onClick={() => copyCommand('pnpm', 'pnpm add @hadi_gunawan/md3-expressive-ds')}
              >
                {copiedText === 'pnpm' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre style={{
              background: 'var(--md-sys-color-surface-container-high)',
              padding: '12px',
              borderRadius: 'var(--md-sys-shape-corner-medium)',
              fontFamily: 'monospace',
              fontSize: 14,
              color: 'var(--md-sys-color-primary)',
              overflowX: 'auto',
              margin: '8px 0 0 0'
            }}>
              <code>pnpm add @hadi_gunawan/md3-expressive-ds</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Steps */}
      <DemoSection title="1. Import the Stylesheet" description="Import the global theme design tokens and styles in your app entrypoint file (e.g. index.tsx or App.tsx).">
        <pre style={{
          width: '100%',
          background: 'var(--md-sys-color-surface-container-low)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          padding: '16px',
          margin: 0,
          fontFamily: 'monospace',
          fontSize: 14,
          color: 'var(--md-sys-color-on-surface-variant)',
          overflowX: 'auto'
        }}>
          <code>{`// src/main.tsx or src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import stylesheet assets
import '@hadi_gunawan/md3-expressive-ds/style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);`}</code>
        </pre>
      </DemoSection>

      <DemoSection title="2. Add Material Symbols Font" description="The library utilizes Google's Material Symbols Outlined font. Include this inside your main index.html header.">
        <pre style={{
          width: '100%',
          background: 'var(--md-sys-color-surface-container-low)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          padding: '16px',
          margin: 0,
          fontFamily: 'monospace',
          fontSize: 14,
          color: 'var(--md-sys-color-on-surface-variant)',
          overflowX: 'auto'
        }}>
          <code>{`<!-- public/index.html -->
<head>
  <meta charset="utf-8" />
  <title>Your App</title>
  <!-- Material Symbols Outlined link -->
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
</head>`}</code>
        </pre>
      </DemoSection>

      <DemoSection title="3. Render your first Component" description="Import and use any component. Wrap parts of your app in theme containers to trigger dark mode or custom palettes.">
        <pre style={{
          width: '100%',
          background: 'var(--md-sys-color-surface-container-low)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          padding: '16px',
          margin: 0,
          fontFamily: 'monospace',
          fontSize: 14,
          color: 'var(--md-sys-color-on-surface-variant)',
          overflowX: 'auto'
        }}>
          <code>{`import { Button, useTheme } from '@hadi_gunawan/md3-expressive-ds';

export function Home() {
  const { theme, setTheme, toggleMode } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      <h1>Welcome to MD3!</h1>
      <p>Current Theme: {theme}</p>
      
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="filled" onClick={toggleMode}>
          Toggle Dark Mode
        </Button>
        <Button variant="tonal" onClick={() => setTheme('ocean')}>
          Switch to Ocean theme
        </Button>
      </div>
    </div>
  );
}`}</code>
        </pre>
      </DemoSection>
    </div>
  );
}

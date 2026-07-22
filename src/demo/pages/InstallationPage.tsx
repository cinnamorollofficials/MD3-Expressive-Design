import { DemoSection, PageTitle } from '../components/DemoSection';
import { Card, CardContent, Button } from '../../lib';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';

export function InstallationPage() {
  const [packageManager, setPackageManager] = useState<'npm' | 'yarn' | 'pnpm'>('npm');
  const installCommands = {
    npm: 'npm i @hadi_gunawan/md3-expressive-ds',
    yarn: 'yarn add @hadi_gunawan/md3-expressive-ds',
    pnpm: 'pnpm add @hadi_gunawan/md3-expressive-ds',
  } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Installation"
        subtitle="Get started integrating Material Design 3 Expressive components into your React project."
      />

      {/* Package manager tabs */}
      <section>
        <Card variant="outlined">
          <CardContent>
            <div role="tablist" aria-label="Package manager" style={{ display: 'flex', gap: 8, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
              {(['npm', 'yarn', 'pnpm'] as const).map(manager => (
                <Button
                  key={manager}
                  role="tab"
                  aria-selected={packageManager === manager}
                  variant={packageManager === manager ? 'tonal' : 'text'}
                  size="sm"
                  onClick={() => setPackageManager(manager)}
                >
                  {manager}
                </Button>
              ))}
            </div>
            <div role="tabpanel" aria-label={`${packageManager} install command`}>
              <CodeBlock code={installCommands[packageManager]} language="bash" embedded />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Steps */}
      <DemoSection bare title="1. Import Stylesheet & Wrap with ThemeProvider" description="Import the global theme tokens/styles and wrap your App root with ThemeProvider.">
        <CodeBlock
          code={`// src/main.tsx or src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@hadi_gunawan/md3-expressive-ds';

// Import stylesheet assets
import '@hadi_gunawan/md3-expressive-ds/style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);`}
          language="jsx"
          showLineNumbers
        />
      </DemoSection>

      <DemoSection bare title="2. Add Material Symbols Font" description="The library utilizes Google's Material Symbols Rounded font. Include this inside your main index.html header or self-host the font.">
        <CodeBlock
          code={`<!-- public/index.html -->
<head>
  <meta charset="utf-8" />
  <title>Your App</title>
  <!-- Material Symbols Rounded link -->
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
</head>`}
          language="jsx"
          showLineNumbers
        />
      </DemoSection>

      <DemoSection bare title="3. Render your first Component" description="Import and use any component. Wrap parts of your app in theme containers to trigger dark mode or custom palettes.">
        <CodeBlock
          code={`import { Button, useTheme } from '@hadi_gunawan/md3-expressive-ds';

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
}`}
          language="jsx"
          showLineNumbers
        />
      </DemoSection>
    </div>
  );
}

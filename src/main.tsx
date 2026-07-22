import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ThemeProvider, DensityProvider } from './lib';
import './styles/reset.css';
import './styles/tokens/_base.css';
import './styles/tokens/light-purple.css';
import './styles/tokens/dark-purple.css';
import './styles/tokens/light-ocean.css';
import './styles/tokens/dark-ocean.css';
import './styles/tokens/light-forest.css';
import './styles/tokens/dark-forest.css';
import './styles/typography.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <DensityProvider>
        <App />
      </DensityProvider>
    </ThemeProvider>
  </StrictMode>,
);

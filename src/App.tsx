import { useEffect, useState } from 'react';
import { DemoLayout, type PageDef } from './demo/components/DemoLayout';
import { OverviewPage } from './demo/pages/OverviewPage';
import { ButtonsPage } from './demo/pages/ButtonsPage';
import { ContainmentPage } from './demo/pages/ContainmentPage';
import { SelectionPage } from './demo/pages/SelectionPage';
import { InputPage } from './demo/pages/InputPage';
import { NavigationPage } from './demo/pages/NavigationPage';
import { CommunicationPage } from './demo/pages/CommunicationPage';
import { ContentPage } from './demo/pages/ContentPage';
import { ShopDashboardPage } from './demo/examples/ShopDashboardPage';
import { CompanyProfilePage } from './demo/examples/CompanyProfilePage';
import { useTheme } from './lib/hooks/useTheme';

const PAGES: PageDef[] = [
  { id: 'overview', label: 'Overview', icon: 'dashboard', section: 'Getting started' },
  { id: 'buttons', label: 'Buttons', icon: 'smart_button', section: 'Components' },
  { id: 'containment', label: 'Containment', icon: 'view_quilt' },
  { id: 'selection', label: 'Selection', icon: 'check_box' },
  { id: 'input', label: 'Inputs', icon: 'edit_note' },
  { id: 'navigation', label: 'Navigation', icon: 'menu' },
  { id: 'communication', label: 'Communication', icon: 'notifications' },
  { id: 'content', label: 'Content', icon: 'view_list' },
  { id: 'shop-dashboard', label: 'Shop Dashboard', icon: 'storefront', section: 'Examples' },
  { id: 'company-profile', label: 'Company Profile', icon: 'business' },
];

const initial = () => {
  const hash = window.location.hash.replace(/^#/, '');
  return PAGES.find(p => p.id === hash)?.id ?? 'overview';
};

export function App() {
  useTheme(); // ensures data-theme/data-mode are applied
  const [page, setPage] = useState<string>(initial);

  useEffect(() => {
    const onHash = () => setPage(initial());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (id: string) => {
    window.location.hash = id;
    setPage(id);
  };

  let content;
  switch (page) {
    case 'buttons': content = <ButtonsPage />; break;
    case 'containment': content = <ContainmentPage />; break;
    case 'selection': content = <SelectionPage />; break;
    case 'input': content = <InputPage />; break;
    case 'navigation': content = <NavigationPage />; break;
    case 'communication': content = <CommunicationPage />; break;
    case 'content': content = <ContentPage />; break;
    case 'shop-dashboard': content = <ShopDashboardPage />; break;
    case 'company-profile': content = <CompanyProfilePage />; break;
    default: content = <OverviewPage />;
  }

  return <DemoLayout pages={PAGES} current={page} onNavigate={navigate}>{content}</DemoLayout>;
}

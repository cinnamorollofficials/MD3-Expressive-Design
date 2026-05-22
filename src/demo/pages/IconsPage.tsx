import { useState } from 'react';
import { PageTitle, DemoSection } from '../components/DemoSection';
import { Icon, TextField } from '../../lib';

const ICONS_LIST = [
  'favorite', 'send', 'add', 'download', 'star', 'settings', 'menu', 'search',
  'home', 'person', 'email', 'phone', 'lock', 'close', 'check', 'error',
  'warning', 'info', 'notifications', 'explore', 'storefront', 'business',
  'dashboard', 'tab', 'calendar_month', 'schedule', 'expand_more', 'expand_less',
  'chevron_right', 'chevron_left', 'arrow_forward', 'arrow_back', 'done',
  'open_in_new', 'mic', 'description', 'image', 'share', 'navigation', 'mail',
  'tune', 'unfold_more', 'grid_view', 'view_sidebar', 'table_view', 'timeline',
  'account_tree', 'list', 'remove', 'photo_library', 'blur_on', 'category',
  'shopping_cart', 'receipt_long', 'payments', 'insights', 'group'
];

export function IconsPage() {
  const [search, setSearch] = useState('');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const filteredIcons = ICONS_LIST.filter(icon =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (iconName: string) => {
    const code = `<Icon name="${iconName}" />`;
    navigator.clipboard.writeText(code);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Icon Gallery"
        subtitle="Search and explore icons powered by Google's Material Symbols Rounded. Click any icon to copy the JSX React component tag."
      />

      {/* Search inputs */}
      <div style={{
        background: 'var(--md-sys-color-surface-container-low)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ maxWidth: 480 }}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            label="Search Icons"
            placeholder="Type icon keyword..."
            leadingIcon="search"
          />
        </div>
      </div>

      <DemoSection title="Material Symbols Gallery" description={`Showing ${filteredIcons.length} matching symbols.`}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 12,
          width: '100%'
        }}>
          {filteredIcons.map(icon => {
            const isCopied = copiedIcon === icon;
            return (
              <button
                key={icon}
                type="button"
                onClick={() => handleCopy(icon)}
                style={{
                  background: isCopied ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface)',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                  borderRadius: 'var(--md-sys-shape-corner-large)',
                  padding: '16px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  color: isCopied ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                  transition: 'all var(--md-sys-motion-duration-short2) ease',
                  outline: 'none'
                }}
              >
                <Icon name={icon} size={28} filled={isCopied} />
                <span style={{
                  font: 'var(--md-sys-typescale-label-small)',
                  color: isCopied ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
                  textAlign: 'center',
                  wordBreak: 'break-all',
                  fontSize: 11
                }}>
                  {isCopied ? 'Copied Tag!' : icon}
                </span>
              </button>
            );
          })}
        </div>
      </DemoSection>
    </div>
  );
}

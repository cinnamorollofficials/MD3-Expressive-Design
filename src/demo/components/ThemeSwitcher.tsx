import { cn } from '../../lib/utils/cn';
import { Icon } from '../../lib/components/Icon';
import { useTheme, type ThemeName } from '../../lib/hooks/useTheme';
import styles from './ThemeSwitcher.module.css';

const THEMES: { name: ThemeName; cls: string; label: string }[] = [
  { name: 'purple', cls: styles.purple, label: 'Purple' },
  { name: 'ocean', cls: styles.ocean, label: 'Ocean' },
  { name: 'forest', cls: styles.forest, label: 'Forest' },
];

export function ThemeSwitcher() {
  const { theme, mode, setTheme, toggleMode } = useTheme();
  return (
    <div className={styles.root}>
      <div className={styles.label}>Theme</div>
      <div className={styles.swatchRow}>
        {THEMES.map(t => (
          <button
            key={t.name}
            type="button"
            aria-label={t.label}
            className={cn(styles.swatch, t.cls, theme === t.name && styles.active)}
            onClick={() => setTheme(t.name)}
          />
        ))}
      </div>
      <button type="button" className={styles.modeBtn} onClick={toggleMode}>
        <Icon name={mode === 'light' ? 'dark_mode' : 'light_mode'} size={18} />
        {mode === 'light' ? 'Dark' : 'Light'} mode
      </button>
    </div>
  );
}

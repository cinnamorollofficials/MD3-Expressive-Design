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
  const currentTheme = THEMES.find(t => t.name === theme) || THEMES[0];

  return (
    <div className={styles.root}>
      <div className={styles.themeDropdownContainer}>
        <button type="button" className={styles.dropdownTrigger}>
          <Icon name="palette" size={20} />
          <span>Theme: {currentTheme.label}</span>
          <Icon name="arrow_drop_down" size={18} />
        </button>
        <div className={styles.dropdownMenu}>
          {THEMES.map(t => (
            <button
              key={t.name}
              type="button"
              className={cn(styles.dropdownItem, theme === t.name && styles.dropdownItemActive)}
              onClick={() => setTheme(t.name)}
            >
              <span className={cn(styles.menuSwatch, t.cls)} />
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.divider} />
      <button
        type="button"
        className={styles.modeBtn}
        onClick={toggleMode}
        title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        <Icon name={mode === 'light' ? 'dark_mode' : 'light_mode'} size={20} />
      </button>
    </div>
  );
}

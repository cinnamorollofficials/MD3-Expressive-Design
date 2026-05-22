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
  const { theme, mode, setTheme, toggleMode, seedColor, setSeedColor } = useTheme();
  const currentTheme = THEMES.find(t => t.name === theme);
  const themeLabel = currentTheme ? currentTheme.label : 'Custom';

  return (
    <div className={styles.root}>
      <div className={styles.themeDropdownContainer}>
        <button type="button" className={styles.dropdownTrigger}>
          <Icon name="palette" size={20} />
          <span>Theme: {themeLabel}</span>
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
          <div className={styles.menuDivider} />
          <div className={cn(styles.customColorItem, theme === 'custom' && styles.dropdownItemActive)}>
            <label className={styles.customColorLabel}>
              <span className={styles.colorPickerWrapper}>
                <input
                  type="color"
                  value={seedColor}
                  onChange={(e) => setSeedColor(e.target.value)}
                  className={styles.colorInput}
                />
                <span className={cn(styles.menuSwatch)} style={{ backgroundColor: seedColor }} />
              </span>
              <span className={styles.customColorText}>Custom Seed</span>
            </label>
          </div>
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


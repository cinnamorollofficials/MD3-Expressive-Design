import { Icon } from '../../lib/components/Icon';
import { useDensityContext } from '../../lib/hooks/useDensity';
import styles from './ThemeSwitcher.module.css';

export function DensitySwitcher() {
  const context = useDensityContext();
  if (!context) return null;

  const { density, toggleDensity } = context;
  const isComfortable = density === 'comfortable';

  return (
    <button
      type="button"
      className={styles.dropdownTrigger}
      onClick={toggleDensity}
      title={isComfortable ? 'Switch to compact density' : 'Switch to comfortable density'}
    >
      <Icon name={isComfortable ? 'density_medium' : 'density_small'} size={18} />
      <span>{isComfortable ? 'Comfortable' : 'Compact'}</span>
    </button>
  );
}

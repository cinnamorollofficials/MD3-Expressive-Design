import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Search.module.css';

export interface SearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leadingIcon?: string;
  trailingIcon?: string;
  onTrailingClick?: () => void;
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { leadingIcon = 'search', trailingIcon, onTrailingClick, className, placeholder = 'Search', ...rest },
  ref,
) {
  return (
    <div className={cn(styles.bar, className)}>
      <span className={styles.icon}><Icon name={leadingIcon} size={24} /></span>
      <input ref={ref} type="search" className={styles.input} placeholder={placeholder} {...rest} />
      {trailingIcon && (
        <button type="button" className={styles.icon} aria-label="action" onClick={onTrailingClick}>
          <Icon name={trailingIcon} size={24} />
        </button>
      )}
    </div>
  );
});

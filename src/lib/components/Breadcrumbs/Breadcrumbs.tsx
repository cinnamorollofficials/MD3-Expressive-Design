import { Fragment, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Breadcrumbs.module.css';

export interface Crumb {
  label: ReactNode;
  href?: string;
  icon?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: Crumb[];
  separator?: string;
}

export function Breadcrumbs({ items, separator = 'chevron_right' }: BreadcrumbsProps) {
  return (
    <nav className={styles.root} aria-label="Breadcrumb">
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        const Tag: any = c.href ? 'a' : 'button';
        return (
          <Fragment key={i}>
            <Tag
              href={c.href}
              type={Tag === 'button' ? 'button' : undefined}
              className={cn(styles.crumb, isLast && styles.current)}
              aria-current={isLast ? 'page' : undefined}
              onClick={c.onClick}
            >
              {c.icon && <Icon name={c.icon} size={16} />}
              {c.label}
            </Tag>
            {!isLast && <span className={styles.sep}><Icon name={separator} size={16} /></span>}
          </Fragment>
        );
      })}
    </nav>
  );
}

import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Carousel.module.css';

export type CarouselVariant = 'uncontained' | 'hero' | 'multibrowse';

export interface CarouselItemData {
  id: string | number;
  image?: string;
  label?: ReactNode;
  content?: ReactNode;
}

export interface CarouselProps {
  variant?: CarouselVariant;
  items: CarouselItemData[];
}

export function Carousel({ variant = 'uncontained', items }: CarouselProps) {
  return (
    <div className={cn(styles.root, styles[variant])} role="region" aria-label="Carousel">
      {items.map(it => (
        <div key={it.id} className={styles.item}>
          {it.image && <img src={it.image} alt="" />}
          {it.content}
          {it.label && <div className={styles.label}>{it.label}</div>}
        </div>
      ))}
    </div>
  );
}

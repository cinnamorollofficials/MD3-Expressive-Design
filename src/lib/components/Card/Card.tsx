import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Card.module.css';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'elevated', interactive, className, children, ...rest }, ref,
) {
  return (
    <div ref={ref} className={cn(styles.card, styles[variant], interactive && styles.interactive, className)} {...rest}>
      {children}
    </div>
  );
});

export const CardMedia = ({ src, alt = '' }: { src: string; alt?: string }) =>
  <img className={styles.media} src={src} alt={alt} />;

export const CardContent = ({ children }: { children: ReactNode }) =>
  <div className={styles.content}>{children}</div>;

export const CardTitle = ({ children }: { children: ReactNode }) =>
  <div className={styles.title}>{children}</div>;

export const CardSubtitle = ({ children }: { children: ReactNode }) =>
  <div className={styles.subtitle}>{children}</div>;

export const CardBody = ({ children }: { children: ReactNode }) =>
  <div className={styles.body}>{children}</div>;

export const CardActions = ({ children }: { children: ReactNode }) =>
  <div className={styles.actions}>{children}</div>;

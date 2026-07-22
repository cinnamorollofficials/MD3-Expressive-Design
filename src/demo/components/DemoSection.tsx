import { ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';
import styles from './DemoSection.module.css';

export interface DemoSectionProps {
  title: string;
  description?: string;
  code?: string;
  children: ReactNode;
  bare?: boolean;
}

export function DemoSection({ title, description, code, children, bare = false }: DemoSectionProps) {
  return (
    <section className={styles.section}>
      <header className={styles.heading}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.desc}>{description}</p>}
      </header>
      <div className={`${styles.preview} ${bare ? styles.barePreview : ''}`}>{children}</div>
      {code && <CodeBlock code={code} />}
    </section>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <h1 className={styles.pageTitle}>{title}</h1>
      {subtitle && <p className={styles.pageSub}>{subtitle}</p>}
    </>
  );
}

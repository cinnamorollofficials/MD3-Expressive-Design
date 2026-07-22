import { ReactNode, useState } from 'react';
import { Icon } from '../../lib';
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
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  return (
    <section className={styles.section}>
      <header className={styles.heading}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.desc}>{description}</p>}
      </header>

      {code ? (
        <div className={styles.cardContainer}>
          <div className={styles.tabHeader}>
            <div className={styles.tabGroup}>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'preview' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <Icon name="visibility" size={16} />
                <span>Preview</span>
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'code' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('code')}
              >
                <Icon name="code" size={16} />
                <span>Code</span>
              </button>
            </div>
          </div>
          <div className={styles.tabBody}>
            {activeTab === 'preview' ? (
              <div className={`${styles.preview} ${bare ? styles.barePreview : ''}`}>{children}</div>
            ) : (
              <div className={styles.codeWrap}>
                <CodeBlock code={code} embedded />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.cardContainer}>
          <div className={`${styles.preview} ${bare ? styles.barePreview : ''}`}>{children}</div>
        </div>
      )}
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

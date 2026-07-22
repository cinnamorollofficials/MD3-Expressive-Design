import { useState } from 'react';
import { IconButton, SideSheet, Tabs } from '../../lib';
import { CodeBlock } from './CodeBlock';
import styles from './ExampleSourceSheet.module.css';

interface ExampleSourceSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  pageSource: string;
  styleSource: string;
}

export function ExampleSourceSheet({ open, onClose, title, pageSource, styleSource }: ExampleSourceSheetProps) {
  const [tab, setTab] = useState<'page' | 'styles'>('page');
  const copyReadyPageSource = pageSource
    .replace("from '../../lib';", "from '@hadi_gunawan/md3-expressive-ds';")
    .split('\n')
    .filter(line =>
      !line.includes('ExampleSourceSheet') &&
      !line.includes('?raw') &&
      !line.includes('sourceOpen') &&
      !line.includes('View source')
    )
    .join('\n');

  return (
    <SideSheet open={open} onClose={onClose} size="wide" ariaLabel={`${title} source code`}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Example source</div>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <IconButton icon="close" label="Close source code" onClick={onClose} />
      </div>
      <p className={styles.description}>Source is loaded from the files used by this live example, so the code stays in sync with the UI.</p>
      <Tabs
        items={[{ value: 'page', label: 'Page', icon: 'code' }, { value: 'styles', label: 'Styles', icon: 'css' }]}
        value={tab}
        onChange={value => setTab(value as 'page' | 'styles')}
      />
      <div className={styles.code}>
        <CodeBlock
          code={tab === 'page' ? copyReadyPageSource : styleSource}
          language={tab === 'page' ? 'jsx' : 'css'}
          showLineNumbers
        />
      </div>
    </SideSheet>
  );
}

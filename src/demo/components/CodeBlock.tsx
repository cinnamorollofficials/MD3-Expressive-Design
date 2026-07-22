import { useState, ReactNode } from 'react';
import { Icon } from '../../lib/components/Icon';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
  code: string;
  language?: 'jsx' | 'bash';
  showLineNumbers?: boolean;
  embedded?: boolean;
}

export function CodeBlock({ code, language = 'jsx', showLineNumbers = false, embedded = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlighted = highlight(code, language);

  return (
    <div className={`${styles.wrapper} ${embedded ? styles.embedded : ''}`}>
      <div className={styles.header}>
        <span className={styles.langBadge}>{language.toUpperCase()}</span>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={handleCopy}
          title="Copy code to clipboard"
        >
          <Icon name={copied ? 'done' : 'content_copy'} size={16} />
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className={styles.scrollArea}>
        <pre className={styles.pre}>
          {showLineNumbers ? (
            <table className={styles.table}>
              <tbody>
                {code.split('\n').map((line, index) => {
                  // highlight line by line if we need line numbers
                  const lineHighlighted = highlight(line, language);
                  return (
                    <tr key={index} className={styles.lineRow}>
                      <td className={styles.lineNo}>{index + 1}</td>
                      <td className={styles.lineContent}>{lineHighlighted}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <code className={styles.code}>{highlighted}</code>
          )}
        </pre>
      </div>
    </div>
  );
}

function highlight(code: string, lang: 'jsx' | 'bash'): ReactNode[] {
  if (lang === 'bash') {
    const bashRegex = new RegExp(
      [
        '\\b(npm i|npm install|yarn add|pnpm add|npm run build|npm run dev|npm run build:lib|git add|git commit|git push)\\b', // command (1)
        '(@[a-zA-Z_\\-0-9]+/[a-zA-Z_\\-0-9]+|@[a-zA-Z_\\-0-9]+|[a-zA-Z_\\-0-9]+)', // package or args (2)
        '(".*?"|\'.*?\')', // string params (3)
      ].join('|'),
      'g'
    );

    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = bashRegex.exec(code)) !== null) {
      if (match.index > lastIndex) {
        parts.push(code.substring(lastIndex, match.index));
      }

      const [full, cmd, pkg, str] = match;

      if (cmd) {
        parts.push(<span key={match.index} className={styles.keyword}>{cmd}</span>);
      } else if (str) {
        parts.push(<span key={match.index} className={styles.string}>{str}</span>);
      } else if (pkg && (pkg.startsWith('@') || pkg.includes('/'))) {
        parts.push(<span key={match.index} className={styles.identifier}>{pkg}</span>);
      } else {
        parts.push(full);
      }

      lastIndex = bashRegex.lastIndex;
    }

    if (lastIndex < code.length) {
      parts.push(code.substring(lastIndex));
    }

    return parts;
  }

  // JSX/TSX Tokenizer rules
  const jsxRegex = new RegExp(
    [
      '(//.*|/\\*[\\s\\S]*?\\*/|<!--[\\s\\S]*?-->)', // comment (1)
      '("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|`(?:[^`\\\\]|\\\\.)*`)', // string (2)
      '(</?[A-Za-z0-9_:]+|>|\\/>)', // tag (3)
      '(\\b[a-zA-Z0-9\\-]+)(?=\\s*=)', // attr (4)
      '\\b(import|export|from|const|function|return|default|let|var|class|extends|interface|type|new|as|case|switch|break|if|else)\\b', // keyword (5)
      '\\b(true|false|null|undefined)\\b', // boolean (6)
      '\\b(\\d+)\\b', // number (7)
      '([{}\\[\\]().,;:=>])', // punctuation (8)
    ].join('|'),
    'g'
  );

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = jsxRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      parts.push(code.substring(lastIndex, match.index));
    }

    const [
      full,
      comment,
      str,
      tag,
      attr,
      keyword,
      boolean,
      num,
      punct
    ] = match;

    if (comment) {
      parts.push(<span key={match.index} className={styles.comment}>{comment}</span>);
    } else if (str) {
      parts.push(<span key={match.index} className={styles.string}>{str}</span>);
    } else if (tag) {
      parts.push(<span key={match.index} className={styles.tag}>{tag}</span>);
    } else if (attr) {
      parts.push(<span key={match.index} className={styles.attr}>{attr}</span>);
    } else if (keyword) {
      parts.push(<span key={match.index} className={styles.keyword}>{keyword}</span>);
    } else if (boolean) {
      parts.push(<span key={match.index} className={styles.boolean}>{boolean}</span>);
    } else if (num) {
      parts.push(<span key={match.index} className={styles.number}>{num}</span>);
    } else if (punct) {
      parts.push(<span key={match.index} className={styles.punctuation}>{punct}</span>);
    } else {
      parts.push(full);
    }

    lastIndex = jsxRegex.lastIndex;
  }

  if (lastIndex < code.length) {
    parts.push(code.substring(lastIndex));
  }

  return parts;
}

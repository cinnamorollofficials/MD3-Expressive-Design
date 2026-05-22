import { useState } from 'react';
import { Checkbox, Radio, Switch, Chip } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

export function SelectionPage({ activeComponent }: { activeComponent?: string }) {
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);
  const [radio, setRadio] = useState('a');
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [filter, setFilter] = useState<string[]>(['sale']);
  const [inputChips, setInputChips] = useState(['React', 'TypeScript', 'Vite']);

  const showAll = !activeComponent;

  return (
    <>
      <PageTitle title="Selection" subtitle="Checkbox, radio, switch, and the chip family." />

      {(showAll || activeComponent === 'checkbox') && (
        <DemoSection
          title="Checkbox"
          code={`<Checkbox label="Subscribe" checked={v} onChange={...} />`}
        >
          <Checkbox label="Subscribe" checked={check1} onChange={(e) => setCheck1(e.target.checked)} />
          <Checkbox label="Notifications" checked={check2} onChange={(e) => setCheck2(e.target.checked)} />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled" disabled />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'radio') && (
        <DemoSection
          title="Radio"
          code={`<Radio name="g" value="a" checked={v === 'a'} onChange={...} />`}
        >
          <Radio name="g1" value="a" label="Option A" checked={radio === 'a'} onChange={() => setRadio('a')} />
          <Radio name="g1" value="b" label="Option B" checked={radio === 'b'} onChange={() => setRadio('b')} />
          <Radio name="g1" value="c" label="Option C" checked={radio === 'c'} onChange={() => setRadio('c')} />
          <Radio name="g1" value="d" label="Disabled" disabled />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'switch') && (
        <DemoSection
          title="Switch"
          description="Expressive switch — the thumb pops in size when on, and slides with emphasized motion."
          code={`<Switch label="Wi-Fi" checked={v} onChange={...} />`}
        >
          <Switch label="Wi-Fi" checked={sw1} onChange={(e) => setSw1(e.target.checked)} />
          <Switch label="Bluetooth" checked={sw2} onChange={(e) => setSw2(e.target.checked)} />
          <Switch label="Disabled" disabled />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'chip') && (
        <DemoSection
          title="Chips"
          description="Four chip kinds: assist, filter, input, suggestion."
          code={`<Chip label="Add" kind="assist" icon="add" />
<Chip label="Sale" kind="filter" selected={true} />
<Chip label="React" kind="input" onClose={...} />
<Chip label="Try a recipe" kind="suggestion" />`}
        >
          <Chip label="Add to event" kind="assist" icon="event" />
          {['sale', 'new', 'free shipping'].map(k => (
            <Chip
              key={k}
              label={k}
              kind="filter"
              selected={filter.includes(k)}
              onClick={() => setFilter(f => f.includes(k) ? f.filter(x => x !== k) : [...f, k])}
            />
          ))}
          {inputChips.map(c => (
            <Chip key={c} label={c} kind="input" selected onClose={() => setInputChips(i => i.filter(x => x !== c))} />
          ))}
          <Chip label="Try a recipe" kind="suggestion" />
          <Chip label="Elevated" kind="assist" elevated icon="auto_awesome" />
        </DemoSection>
      )}
    </>
  );
}

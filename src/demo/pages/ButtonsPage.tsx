import {
  Button, IconButton, FAB, FABMenu, SplitButton, SegmentedButton,
} from '../../lib';
import { useState } from 'react';
import { DemoSection, PageTitle } from '../components/DemoSection';

export function ButtonsPage() {
  const [pressed, setPressed] = useState(false);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  return (
    <>
      <PageTitle title="Buttons" subtitle="The full Expressive button family — common, FAB, split, segmented." />

      <DemoSection
        title="Common Buttons"
        description="Five emphasis variants: filled, tonal, elevated, outlined, text."
        code={`<Button variant="filled">Filled</Button>
<Button variant="tonal">Tonal</Button>
<Button variant="elevated">Elevated</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>`}
      >
        <Button variant="filled">Filled</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="elevated">Elevated</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </DemoSection>

      <DemoSection
        title="Buttons with Icons"
        code={`<Button startIcon="favorite">Like</Button>
<Button variant="tonal" endIcon="arrow_forward">Continue</Button>`}
      >
        <Button startIcon="favorite">Like</Button>
        <Button variant="tonal" endIcon="arrow_forward">Continue</Button>
        <Button variant="outlined" startIcon="download">Download</Button>
      </DemoSection>

      <DemoSection
        title="Expressive Sizes"
        description="Expressive introduces a 5-step button size scale from xs to xl."
        code={`<Button size="xs">XS</Button>
<Button size="sm">SM</Button>
<Button size="md">MD</Button>
<Button size="lg">LG</Button>
<Button size="xl">XL</Button>`}
      >
        <Button size="xs">XS</Button>
        <Button size="sm">SM</Button>
        <Button size="md">MD</Button>
        <Button size="lg">LG</Button>
        <Button size="xl">XL</Button>
      </DemoSection>

      <DemoSection
        title="Icon Buttons"
        code={`<IconButton icon="favorite" label="Favorite" />
<IconButton variant="filled" icon="send" label="Send" />
<IconButton variant="tonal" icon="edit" label="Edit" />
<IconButton variant="outlined" icon="bookmark" label="Bookmark" />
<IconButton toggle selected={pressed} icon="star" selectedIcon="star" label="Star" />`}
      >
        <IconButton icon="favorite" label="Favorite" />
        <IconButton variant="filled" icon="send" label="Send" />
        <IconButton variant="tonal" icon="edit" label="Edit" />
        <IconButton variant="outlined" icon="bookmark" label="Bookmark" />
        <IconButton
          toggle
          selected={pressed}
          icon="star"
          selectedIcon="star"
          label="Star"
          onClick={() => setPressed(p => !p)}
        />
      </DemoSection>

      <DemoSection
        title="Floating Action Button"
        code={`<FAB size="sm" icon="add" />
<FAB icon="edit" />
<FAB size="lg" icon="add" color="tertiary" />
<FAB icon="add" label="Compose" />`}
      >
        <FAB size="sm" icon="add" />
        <FAB icon="edit" />
        <FAB size="lg" icon="add" color="tertiary" />
        <FAB icon="add" label="Compose" />
      </DemoSection>

      <DemoSection
        title="FAB Menu (Expressive)"
        description="A FAB that fans out into a menu of related actions with staggered spring motion."
        code={`<FABMenu
  label="Create"
  items={[
    { icon: 'description', label: 'Document' },
    { icon: 'image', label: 'Image' },
    { icon: 'mic', label: 'Audio' },
  ]}
/>`}
      >
        <FABMenu
          label="Create"
          items={[
            { icon: 'description', label: 'Document' },
            { icon: 'image', label: 'Image' },
            { icon: 'mic', label: 'Audio' },
          ]}
        />
      </DemoSection>

      <DemoSection
        title="Split Button (Expressive)"
        description="Primary action paired with a dropdown of related options."
        code={`<SplitButton
  label="Save"
  startIcon="save"
  options={[
    { label: 'Save as draft' },
    { label: 'Save and publish' },
    { label: 'Save as template' },
  ]}
/>`}
      >
        <SplitButton
          label="Save"
          startIcon="save"
          options={[
            { label: 'Save as draft' },
            { label: 'Save and publish' },
            { label: 'Save as template' },
          ]}
        />
      </DemoSection>

      <DemoSection
        title="Segmented Button"
        code={`<SegmentedButton
  value={view}
  onChange={setView}
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
/>`}
      >
        <SegmentedButton
          value={view}
          onChange={(v) => setView(v as 'day' | 'week' | 'month')}
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />
      </DemoSection>
    </>
  );
}

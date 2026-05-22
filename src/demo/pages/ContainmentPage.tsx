import { useState } from 'react';
import {
  Card, CardMedia, CardContent, CardTitle, CardSubtitle, CardBody, CardActions,
  Button, IconButton,
  Dialog, BottomSheet, SideSheet, Snackbar,
  Tooltip, Menu, Icon,
} from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

export function ContainmentPage({ activeComponent }: { activeComponent?: string }) {
  const [dialog, setDialog] = useState(false);
  const [fullDialog, setFullDialog] = useState(false);
  const [bottom, setBottom] = useState(false);
  const [side, setSide] = useState(false);
  const [snack, setSnack] = useState(false);

  const showAll = !activeComponent;

  return (
    <>
      <PageTitle title="Containment" subtitle="Cards, dialogs, sheets, tooltips, and menus." />

      {(showAll || activeComponent === 'card') && (
        <>
          <DemoSection
            title="Cards"
            code={`<Card variant="elevated">…</Card>
<Card variant="filled">…</Card>
<Card variant="outlined">…</Card>`}
          >
            {(['elevated', 'filled', 'outlined'] as const).map(v => (
              <Card key={v} variant={v} interactive style={{ width: 260 }}>
                <CardContent>
                  <CardTitle>{v[0].toUpperCase() + v.slice(1)} card</CardTitle>
                  <CardSubtitle>Variant: {v}</CardSubtitle>
                  <CardBody>Cards group related content and actions about a single subject.</CardBody>
                </CardContent>
                <CardActions>
                  <Button variant="text">Cancel</Button>
                  <Button variant="filled">Open</Button>
                </CardActions>
              </Card>
            ))}
          </DemoSection>

          <DemoSection
            title="Card with Media"
            code={`<Card variant="elevated">
  <CardMedia src="..." />
  <CardContent>…</CardContent>
</Card>`}
          >
            <Card variant="elevated" style={{ width: 280 }}>
              <CardMedia src="https://picsum.photos/seed/md3/560/320" />
              <CardContent>
                <CardTitle>Nature</CardTitle>
                <CardSubtitle>Stock imagery</CardSubtitle>
                <CardBody>A short body explaining the photo and what action to take next.</CardBody>
              </CardContent>
              <CardActions>
                <Button variant="text">Share</Button>
                <Button variant="text">Explore</Button>
              </CardActions>
            </Card>
          </DemoSection>
        </>
      )}

      {(showAll || activeComponent === 'dialog') && (
        <DemoSection
          title="Dialog"
          code={`<Dialog open={open} onClose={() => setOpen(false)}
  icon="info" title="Update available"
  actions={<><Button variant="text">Later</Button><Button>Update</Button></>}
>
  A new version is available. Update now for new features.
</Dialog>`}
        >
          <Button onClick={() => setDialog(true)}>Show basic dialog</Button>
          <Button variant="tonal" onClick={() => setFullDialog(true)}>Show full-screen dialog</Button>
          <Dialog
            open={dialog}
            onClose={() => setDialog(false)}
            icon="info"
            title="Update available"
            actions={
              <>
                <Button variant="text" onClick={() => setDialog(false)}>Later</Button>
                <Button onClick={() => setDialog(false)}>Update</Button>
              </>
            }
          >
            A new version is available. Update now to get the latest features and bug fixes.
          </Dialog>
          <Dialog
            open={fullDialog}
            onClose={() => setFullDialog(false)}
            fullscreen
            title="Edit profile"
            actions={<Button onClick={() => setFullDialog(false)}>Save</Button>}
          >
            <p>Full-screen dialogs fill the entire viewport and are used for complex tasks like editing a profile or composing a message.</p>
          </Dialog>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'bottom-sheet' || activeComponent === 'side-sheet') && (
        <DemoSection
          title="Sheets"
          code={`<BottomSheet open={open} onClose={...}>…</BottomSheet>
<SideSheet open={open} onClose={...} side="right">…</SideSheet>`}
        >
          {(showAll || activeComponent === 'bottom-sheet') && (
            <Button onClick={() => setBottom(true)}>Open bottom sheet</Button>
          )}
          {(showAll || activeComponent === 'side-sheet') && (
            <Button variant="tonal" onClick={() => setSide(true)}>Open side sheet</Button>
          )}
          <BottomSheet open={bottom} onClose={() => setBottom(false)}>
            <h3 style={{ margin: '0 0 8px' }}>Share</h3>
            <p>Bottom sheets surface contextual content from the bottom of the screen.</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button onClick={() => setBottom(false)}>Close</Button>
            </div>
          </BottomSheet>
          <SideSheet open={side} onClose={() => setSide(false)} side="right">
            <h3 style={{ margin: '0 0 12px' }}>Filters</h3>
            <p>Side sheets anchor to the edge of the screen for secondary content.</p>
            <Button style={{ marginTop: 16 }} onClick={() => setSide(false)}>Close</Button>
          </SideSheet>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'snackbar') && (
        <DemoSection
          title="Snackbar"
          code={`<Snackbar open={open} message="Item archived"
  action={{ label: 'Undo', onClick: ... }} onClose={...} />`}
        >
          <Button onClick={() => setSnack(true)}>Show snackbar</Button>
          <Snackbar
            open={snack}
            message="Item archived"
            action={{ label: 'Undo', onClick: () => setSnack(false) }}
            onClose={() => setSnack(false)}
          />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'tooltip') && (
        <DemoSection
          title="Tooltips"
          code={`<Tooltip label="Save"><IconButton icon="save" label="Save" /></Tooltip>
<Tooltip title="Rich" label="More detailed help text here" rich>...</Tooltip>`}
        >
          <Tooltip label="Save">
            <IconButton icon="save" label="Save" />
          </Tooltip>
          <Tooltip title="Cycling" label="Drag the route to change it. Tap an icon to add a stop." rich>
            <Button variant="tonal">Rich tooltip</Button>
          </Tooltip>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'menu') && (
        <DemoSection
          title="Menu"
          code={`<Menu
  trigger={(p) => <IconButton icon="more_vert" label="More" {...p} />}
  items={[
    { label: 'Edit', icon: 'edit' },
    { label: 'Share', icon: 'share' },
    { divider: true },
    { label: 'Delete', icon: 'delete' },
  ]}
/>`}
        >
          <Menu
            trigger={(p) => <IconButton icon="more_vert" label="More" {...p} />}
            items={[
              { label: 'Edit', icon: 'edit' },
              { label: 'Share', icon: 'share' },
              { label: 'Move', icon: 'drive_file_move' },
              { divider: true, label: '' },
              { label: 'Delete', icon: 'delete' },
            ]}
          />
          <Menu
            trigger={(p) => <Button variant="outlined" endIcon="expand_more" {...p}>Actions</Button>}
            items={[
              { label: 'Rename', icon: 'edit' },
              { label: 'Duplicate', icon: 'content_copy' },
              { label: 'Archive', icon: 'archive', trailingIcon: 'chevron_right' },
            ]}
          />
          <Icon name="info" />
        </DemoSection>
      )}
    </>
  );
}

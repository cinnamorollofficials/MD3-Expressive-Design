export interface PropDef {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface KeyboardShortcut {
  key: string;
  action: string;
}

export interface AriaSpec {
  name: string;
  description: string;
}

export interface DoDont {
  do: string;
  dont: string;
}

export interface PlaygroundControl {
  name: string;
  label: string;
  type: 'select' | 'boolean' | 'text' | 'number';
  options?: string[];
  defaultValue: any;
}

export interface ComponentMetadata {
  id: string;
  label: string;
  status: 'stable' | 'beta' | 'experimental';
  description: string;
  props: PropDef[];
  keyboard: KeyboardShortcut[];
  aria: AriaSpec[];
  doDonts: DoDont[];
  playgroundControls?: PlaygroundControl[];
}

export const COMPONENTS_REGISTRY: Record<string, ComponentMetadata> = {
  button: {
    id: 'button',
    label: 'Button',
    status: 'stable',
    description: 'Common buttons communicate an action that occurs when the user clicks or taps it.',
    props: [
      { name: 'variant', type: "'filled' | 'tonal' | 'elevated' | 'outlined' | 'text'", default: "'filled'", description: 'The visual style emphasis of the button.' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'The size scale of the button (Expressive specific 5-step scale).' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the button is interactive.' },
      { name: 'startIcon', type: 'string', default: 'undefined', description: 'Name of the Material icon to display before the label text.' },
      { name: 'endIcon', type: 'string', default: 'undefined', description: 'Name of the Material icon to display after the label text.' },
      { name: 'onClick', type: '() => void', default: 'undefined', description: 'Callback function called when the button is clicked.' },
    ],
    keyboard: [
      { key: 'Space', action: 'Activates the button.' },
      { key: 'Enter', action: 'Activates the button.' },
      { key: 'Tab', action: 'Focuses the button in sequential keyboard navigation.' },
    ],
    aria: [
      { name: 'role="button"', description: 'Identifies the element as a button to assistive technologies.' },
      { name: 'aria-disabled', description: 'Reflects the disabled state when standard HTML disabled is not supported.' },
    ],
    doDonts: [
      { do: 'Use filled buttons for the primary call-to-action on a screen.', dont: 'Use multiple filled buttons in close proximity; it dilutes visual hierarchy.' },
      { do: 'Keep button label text concise (1-3 words).', dont: 'Wrap button text labels; use single lines only.' },
    ],
    playgroundControls: [
      { name: 'variant', label: 'Variant', type: 'select', options: ['filled', 'tonal', 'elevated', 'outlined', 'text'], defaultValue: 'filled' },
      { name: 'size', label: 'Size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], defaultValue: 'md' },
      { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
      { name: 'children', label: 'Label Text', type: 'text', defaultValue: 'Send Message' },
      { name: 'startIcon', label: 'Start Icon', type: 'select', options: ['', 'favorite', 'send', 'add', 'download', 'star'], defaultValue: '' },
      { name: 'endIcon', label: 'End Icon', type: 'select', options: ['', 'arrow_forward', 'open_in_new', 'done'], defaultValue: '' },
    ],
  },
  'icon-button': {
    id: 'icon-button',
    label: 'IconButton',
    status: 'stable',
    description: 'Icon buttons let users take actions and make choices with a single tap, using compact symbols.',
    props: [
      { name: 'icon', type: 'string', default: 'required', description: 'Name of the Material icon to render.' },
      { name: 'label', type: 'string', default: 'required', description: 'Accessibility text read by screen readers.' },
      { name: 'variant', type: "'standard' | 'filled' | 'tonal' | 'outlined'", default: "'standard'", description: 'The visual style emphasis of the icon button.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the button is interactive.' },
      { name: 'toggle', type: 'boolean', default: 'false', description: 'Enables toggle state behavior.' },
      { name: 'selected', type: 'boolean', default: 'false', description: 'Whether the toggle button is selected.' },
      { name: 'selectedIcon', type: 'string', default: 'undefined', description: 'Alternative icon shown when selected is true.' },
    ],
    keyboard: [
      { key: 'Space', action: 'Toggles or clicks the icon button.' },
      { key: 'Enter', action: 'Toggles or clicks the icon button.' },
    ],
    aria: [
      { name: 'aria-label', description: 'Provides a descriptive text label for screen readers.' },
      { name: 'aria-pressed', description: 'Required for toggle icon buttons to indicate active selection status.' },
    ],
    doDonts: [
      { do: 'Always supply a clear accessibility label detailing what action will trigger.', dont: 'Leave label empty, forcing screen readers to read generic icon filenames.' },
    ],
    playgroundControls: [
      { name: 'icon', label: 'Icon', type: 'select', options: ['favorite', 'send', 'add', 'download', 'star', 'settings', 'menu'], defaultValue: 'favorite' },
      { name: 'label', label: 'Aria Label', type: 'text', defaultValue: 'Add to favorites' },
      { name: 'variant', label: 'Variant', type: 'select', options: ['standard', 'filled', 'tonal', 'outlined'], defaultValue: 'standard' },
      { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
      { name: 'toggle', label: 'Is Toggle', type: 'boolean', defaultValue: false },
    ],
  },
  fab: {
    id: 'fab',
    label: 'FAB',
    status: 'stable',
    description: 'Floating Action Buttons represent the primary, most common action on a screen.',
    props: [
      { name: 'icon', type: 'string', default: 'required', description: 'Name of the main action icon.' },
      { name: 'label', type: 'string', default: 'undefined', description: 'Extended text label. If provided, creates an Extended FAB.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Visual scale of the FAB.' },
      { name: 'color', type: "'surface' | 'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'Theme background color assignment.' },
    ],
    keyboard: [{ key: 'Space/Enter', action: 'Activates the floating action.' }],
    aria: [{ name: 'aria-label', description: 'Required if label prop is not provided to describe the floating action.' }],
    doDonts: [
      { do: 'Use FABs for constructive, primary tasks like Create, Compose, or Add.', dont: 'Use FABs for destructive actions like Delete or Clear.' },
    ],
    playgroundControls: [
      { name: 'icon', label: 'Icon', type: 'select', options: ['add', 'edit', 'share', 'navigation', 'mail'], defaultValue: 'add' },
      { name: 'label', label: 'Extended Label', type: 'text', defaultValue: 'New Project' },
      { name: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
      { name: 'color', label: 'Color Variant', type: 'select', options: ['primary', 'secondary', 'tertiary', 'surface'], defaultValue: 'primary' },
    ],
  },
  card: {
    id: 'card',
    label: 'Card',
    status: 'stable',
    description: 'Cards contain content and actions about a single subject, serving as containers for custom visual structure.',
    props: [
      { name: 'variant', type: "'elevated' | 'filled' | 'outlined'", default: "'elevated'", description: 'Visual emphasis layout style.' },
      { name: 'onClick', type: '() => void', default: 'undefined', description: 'Adding this makes the card look and behave as interactive.' },
    ],
    keyboard: [{ key: 'Enter', action: 'Triggers action if interactive card is focused.' }],
    aria: [{ name: 'role="button"', description: 'Applied dynamically when onClick is provided.' }],
    doDonts: [
      { do: 'Structure cards with related images, titles, body content, and action items in hierarchy.', dont: 'Overload cards with multiple complex data streams; use tables instead.' },
    ],
    playgroundControls: [
      { name: 'variant', label: 'Card Variant', type: 'select', options: ['elevated', 'filled', 'outlined'], defaultValue: 'elevated' },
    ],
  },
  dialog: {
    id: 'dialog',
    label: 'Dialog',
    status: 'stable',
    description: 'Dialogs provide critical information or prompt users for decisions, requiring user focus before continuing.',
    props: [
      { name: 'open', type: 'boolean', default: 'required', description: 'Visibility toggle status.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Dialog headline title.' },
      { name: 'onClose', type: '() => void', default: 'required', description: 'Close action handler.' },
    ],
    keyboard: [
      { key: 'Escape', action: 'Closes the active dialog.' },
      { key: 'Tab', action: 'Traps keyboard focus inside the dialog.' },
    ],
    aria: [
      { name: 'role="dialog"', description: 'Identifies the element as a dialog container.' },
      { name: 'aria-modal="true"', description: 'Tells assistive technologies that contents outside the dialog are inactive.' },
    ],
    doDonts: [
      { do: 'Keep dialog content clean and highly focused on a single decision.', dont: 'Open dialogs from within other dialogs.' },
    ],
  },
  switch: {
    id: 'switch',
    label: 'Switch',
    status: 'stable',
    description: 'Switches toggle the state of a single setting on or off immediately.',
    props: [
      { name: 'checked', type: 'boolean', default: 'required', description: 'Active toggle state.' },
      { name: 'onChange', type: '(c: boolean) => void', default: 'required', description: 'State modification handler.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the switch is interactable.' },
      { name: 'label', type: 'string', default: 'undefined', description: 'Optional inline text label.' },
    ],
    keyboard: [{ key: 'Space', action: 'Toggles checked state.' }],
    aria: [
      { name: 'role="switch"', description: 'Explicitly declares the element as a binary state switch.' },
      { name: 'aria-checked', description: 'Tells assistive technologies whether the switch is currently on or off.' },
    ],
    doDonts: [
      { do: 'Use switches for settings that take effect immediately without clicking Submit.', dont: 'Use switches where checkbox multi-selection is more appropriate.' },
    ],
    playgroundControls: [
      { name: 'checked', label: 'Checked', type: 'boolean', defaultValue: true },
      { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
      { name: 'label', label: 'Switch Label', type: 'text', defaultValue: 'Enable Notifications' },
    ],
  },
  checkbox: {
    id: 'checkbox',
    label: 'Checkbox',
    status: 'stable',
    description: 'Checkboxes let users select one or more items from a set, or toggle sub-choices.',
    props: [
      { name: 'checked', type: 'boolean', default: 'required', description: 'Selection state.' },
      { name: 'onChange', type: '(c: boolean) => void', default: 'required', description: 'Change handler.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Interaction disable flag.' },
      { name: 'label', type: 'string', default: 'undefined', description: 'Adjacent label text.' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Enables partial hierarchical checked representation.' },
    ],
    keyboard: [{ key: 'Space', action: 'Selects or unselects the checkbox.' }],
    aria: [{ name: 'role="checkbox"', description: 'Identifies the element as a checkbox.' }],
    doDonts: [
      { do: 'Use checkboxes when multiple selection from a list of options is valid.', dont: 'Use checkboxes when only a single option can be selected; use Radio instead.' },
    ],
    playgroundControls: [
      { name: 'checked', label: 'Checked', type: 'boolean', defaultValue: false },
      { name: 'indeterminate', label: 'Indeterminate', type: 'boolean', defaultValue: false },
      { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
      { name: 'label', label: 'Checkbox Label', type: 'text', defaultValue: 'I agree to the terms of service' },
    ],
  },
  'text-field': {
    id: 'text-field',
    label: 'TextField',
    status: 'stable',
    description: 'Text fields let users enter and edit text into a form or interface.',
    props: [
      { name: 'value', type: 'string', default: 'required', description: 'The text value.' },
      { name: 'onChange', type: '(v: string) => void', default: 'required', description: 'Text modification callback.' },
      { name: 'label', type: 'string', default: 'required', description: 'Floating label text.' },
      { name: 'placeholder', type: 'string', default: 'undefined', description: 'Hint text.' },
      { name: 'error', type: 'boolean', default: 'false', description: 'Triggers invalid visual state.' },
      { name: 'errorText', type: 'string', default: 'undefined', description: 'Text displayed below when error is true.' },
      { name: 'supportingText', type: 'string', default: 'undefined', description: 'Optional guide text displayed below.' },
      { name: 'prefixIcon', type: 'string', default: 'undefined', description: 'Left aligned Material icon.' },
      { name: 'suffixIcon', type: 'string', default: 'undefined', description: 'Right aligned Material icon.' },
    ],
    keyboard: [{ key: 'Escape', action: 'Clears input text if clearable.' }],
    aria: [{ name: 'aria-invalid', description: 'Set to true when the input is in an error state.' }],
    doDonts: [
      { do: 'Use text fields with floating labels to save space while keeping context.', dont: 'Hide helper text when user inputs invalid data; display clear errors.' },
    ],
    playgroundControls: [
      { name: 'value', label: 'Input Value', type: 'text', defaultValue: 'John Doe' },
      { name: 'label', label: 'Label', type: 'text', defaultValue: 'Username' },
      { name: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'e.g. johndoe123' },
      { name: 'error', label: 'Has Error', type: 'boolean', defaultValue: false },
      { name: 'errorText', label: 'Error Text', type: 'text', defaultValue: 'This username is already taken.' },
      { name: 'prefixIcon', label: 'Prefix Icon', type: 'select', options: ['', 'person', 'email', 'phone', 'lock'], defaultValue: 'person' },
      { name: 'suffixIcon', label: 'Suffix Icon', type: 'select', options: ['', 'check', 'error', 'close', 'visibility'], defaultValue: '' },
    ],
  },
  slider: {
    id: 'slider',
    label: 'Slider',
    status: 'stable',
    description: 'Sliders let users make selections from a range of values along a bar.',
    props: [
      { name: 'value', type: 'number', default: 'required', description: 'Current numeric value.' },
      { name: 'onChange', type: '(v: number) => void', default: 'required', description: 'Slider slide change callback.' },
      { name: 'min', type: 'number', default: '0', description: 'Minimum bounds.' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum bounds.' },
      { name: 'step', type: 'number', default: '1', description: 'Steps size scale.' },
    ],
    keyboard: [
      { key: 'Right Arrow / Up Arrow', action: 'Increments the slider value.' },
      { key: 'Left Arrow / Down Arrow', action: 'Decrements the slider value.' },
    ],
    aria: [
      { name: 'role="slider"', description: 'Declares control as a draggable slider.' },
      { name: 'aria-valuenow', description: 'Tells screen readers the current selected numeric value.' },
    ],
    doDonts: [
      { do: 'Provide clear visual feedback of the selected number next to or above the slider.', dont: 'Use sliders for highly precise numbers where typing is easier.' },
    ],
    playgroundControls: [
      { name: 'value', label: 'Value', type: 'number', defaultValue: 50 },
      { name: 'min', label: 'Min', type: 'number', defaultValue: 0 },
      { name: 'max', label: 'Max', type: 'number', defaultValue: 100 },
      { name: 'step', label: 'Step Size', type: 'number', defaultValue: 5 },
    ],
  },
  badge: {
    id: 'badge',
    label: 'Badge',
    status: 'stable',
    description: 'Badges display notifications, counts, or small status details next to another element.',
    props: [
      { name: 'value', type: 'string | number', default: 'undefined', description: 'Count or label to display inside. If empty, renders a small dot badge.' },
      { name: 'color', type: "'primary' | 'error' | 'secondary'", default: "'error'", description: 'Color style background.' },
    ],
    keyboard: [],
    aria: [{ name: 'aria-label', description: 'Wrap parents with label describing notifications count.' }],
    doDonts: [
      { do: 'Use small badges for subtle notification signals.', dont: 'Put long sentences inside badges; stick to 1-3 digits or characters.' },
    ],
    playgroundControls: [
      { name: 'value', label: 'Badge Value', type: 'text', defaultValue: '99+' },
      { name: 'color', label: 'Badge Color', type: 'select', options: ['primary', 'error', 'secondary'], defaultValue: 'error' },
    ],
  },
  avatar: {
    id: 'avatar',
    label: 'Avatar',
    status: 'stable',
    description: 'Avatars represent users or entities visually using photos, icons, or text initials.',
    props: [
      { name: 'src', type: 'string', default: 'undefined', description: 'Image URL source.' },
      { name: 'alt', type: 'string', default: 'undefined', description: 'Alternative label text.' },
      { name: 'initials', type: 'string', default: 'undefined', description: 'Initials shown when image fails or is absent.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size diameter dimension.' },
    ],
    keyboard: [],
    aria: [{ name: 'role="img"', description: 'Ensures the avatar structure is announced as an image.' }],
    doDonts: [
      { do: 'Provide a fallback color background and initials in case images fail to load.', dont: 'Use initials that are longer than 2 characters.' },
    ],
    playgroundControls: [
      { name: 'src', label: 'Image Source (Empty to fallback)', type: 'text', defaultValue: '' },
      { name: 'initials', label: 'Initials Fallback', type: 'text', defaultValue: 'HG' },
      { name: 'size', label: 'Avatar Size', type: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    ],
  },
};

// Fill in other components with default empty structures so TS compiles and users see basic pages
export const getComponentMetadata = (id: string): ComponentMetadata => {
  const existing = COMPONENTS_REGISTRY[id];
  if (existing) return existing;

  // Pretty title from camelCase or kebab-case
  const label = id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return {
    id,
    label,
    status: 'stable',
    description: `Detailed documentation and live previews for the ${label} component.`,
    props: [
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Content nested inside the component.' },
      { name: 'className', type: 'string', default: 'undefined', description: 'Custom CSS override selector.' },
    ],
    keyboard: [{ key: 'Tab', action: 'Focuses element sequentially.' }],
    aria: [{ name: 'aria-hidden', description: 'Applies only if element is decoration.' }],
    doDonts: [
      { do: `Check the standard MD3 style guide for details on ${label} usage.`, dont: `Overload the ${label} component with unnecessary custom CSS classes.` },
    ],
  };
};

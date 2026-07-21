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
      { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', default: 'required', description: 'Native checkbox change handler. Read the next value from event.target.checked.' },
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
      { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', default: 'required', description: 'Native checkbox change handler. Read the next value from event.target.checked.' },
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
      { name: 'helperText', type: 'string', default: 'undefined', description: 'Optional guide or error text displayed below the input.' },
      { name: 'leadingIcon', type: 'string', default: 'undefined', description: 'Left aligned Material icon.' },
      { name: 'trailingIcon', type: 'string', default: 'undefined', description: 'Right aligned Material icon.' },
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
      { name: 'leadingIcon', label: 'Leading Icon', type: 'select', options: ['', 'person', 'email', 'phone', 'lock'], defaultValue: 'person' },
      { name: 'trailingIcon', label: 'Trailing Icon', type: 'select', options: ['', 'check', 'error', 'close', 'visibility'], defaultValue: '' },
    ],
  },
  slider: {
    id: 'slider',
    label: 'Slider',
    status: 'stable',
    description: 'Sliders let users make selections from a range of values along a bar.',
    props: [
      { name: 'value', type: 'number', default: 'required', description: 'Current numeric value.' },
      { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', default: 'required', description: 'Native range input change handler. Read the next value from event.target.value.' },
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
      { name: 'count', type: 'string | number', default: 'undefined', description: 'Count or label to display inside. If empty, renders a small dot badge.' },
      { name: 'dot', type: 'boolean', default: 'false', description: 'Forces compact dot display.' },
      { name: 'max', type: 'number', default: '99', description: 'Maximum numeric count before rendering a + suffix.' },
      { name: 'ariaLabel', type: 'string', default: 'derived', description: 'Accessible announcement for the badge value.' },
    ],
    keyboard: [],
    aria: [{ name: 'aria-label', description: 'Wrap parents with label describing notifications count.' }],
    doDonts: [
      { do: 'Use small badges for subtle notification signals.', dont: 'Put long sentences inside badges; stick to 1-3 digits or characters.' },
    ],
    playgroundControls: [
      { name: 'count', label: 'Badge Count', type: 'text', defaultValue: '99+' },
      { name: 'dot', label: 'Dot Only', type: 'boolean', defaultValue: false },
      { name: 'max', label: 'Max Count', type: 'number', defaultValue: 99 },
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
      { name: 'name', type: 'string', default: 'undefined', description: 'Name used to generate initials when no image or icon is provided.' },
      { name: 'icon', type: 'string', default: 'undefined', description: 'Material icon fallback when no image is provided.' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size diameter dimension.' },
      { name: 'shape', type: "'circle' | 'square' | 'rounded'", default: "'circle'", description: 'Avatar container geometry.' },
      { name: 'tone', type: '1 | 2 | 3 | 4', default: '1', description: 'Token-backed color tone for generated initials.' },
    ],
    keyboard: [],
    aria: [{ name: 'role="img"', description: 'Ensures the avatar structure is announced as an image.' }],
    doDonts: [
      { do: 'Provide a fallback color background and initials in case images fail to load.', dont: 'Use initials that are longer than 2 characters.' },
    ],
    playgroundControls: [
      { name: 'src', label: 'Image Source (Empty to fallback)', type: 'text', defaultValue: '' },
      { name: 'name', label: 'Name Fallback', type: 'text', defaultValue: 'Hadi Gunawan' },
      { name: 'size', label: 'Avatar Size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], defaultValue: 'md' },
      { name: 'shape', label: 'Shape', type: 'select', options: ['circle', 'square', 'rounded'], defaultValue: 'circle' },
    ],
  },
  'area-chart': {
    id: 'area-chart',
    label: 'AreaChart',
    status: 'beta',
    description: 'Area charts display progress or trends over a continuous domain, filled with a color gradient.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data points to visualize.' },
      { name: 'xKey', type: 'string', default: 'required', description: 'The property key in each data object for the X-axis coordinate.' },
      { name: 'yKey', type: 'string', default: 'required', description: 'The property key in each data object for the Y-axis coordinate.' },
      { name: 'height', type: 'number', default: '300', description: 'Chart drawing height in pixels.' },
      { name: 'curve', type: "'linear' | 'monotone' | 'step'", default: "'monotone'", description: 'Interpolation function style for drawing paths.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to overlay background grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the X and Y axes.' },
      { name: 'color', type: 'string', default: 'undefined', description: 'Override stroke/fill primary color.' },
      { name: 'gradient', type: 'boolean', default: 'true', description: 'Whether to shade the area under the curve with a custom translucent gradient.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover interaction lines and popup details tooltip.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Main title header text.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Secondary descriptive text below title.' },
    ],
    keyboard: [
      { key: 'Mouse Move / Hover', action: 'Positions the horizontal tracking line and renders details tooltip card.' },
    ],
    aria: [
      { name: 'role="img"', description: 'Identifies the chart vector as an graphical image representation.' },
    ],
    doDonts: [
      { do: 'Use area charts to visualize continuous values like timelines or metrics over time.', dont: 'Use area charts for categories that have no logical order; use bar or segmented elements instead.' },
    ],
    playgroundControls: [
      { name: 'curve', label: 'Curve Interpolation', type: 'select', options: ['monotone', 'linear', 'step'], defaultValue: 'monotone' },
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'gradient', label: 'Translucent Gradient', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip & Tracker', type: 'boolean', defaultValue: true },
    ],
  },
  'area-chart-missing': {
    id: 'area-chart-missing',
    label: 'Area Chart with Missing Data',
    status: 'beta',
    description: 'Area charts representing signal dropouts, connectivity gaps, or missing metrics by breaking the path layout gracefully.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data points containing null, undefined, or NaN values.' },
      { name: 'xKey', type: 'string', default: 'required', description: 'The property key in each data object for the X-axis coordinate.' },
      { name: 'yKey', type: 'string', default: 'required', description: 'The property key in each data object for the Y-axis coordinate.' },
      { name: 'height', type: 'number', default: '300', description: 'Chart drawing height in pixels.' },
      { name: 'curve', type: "'linear' | 'monotone' | 'step'", default: "'monotone'", description: 'Interpolation function style for drawing paths.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to overlay background grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the X and Y axes.' },
      { name: 'color', type: 'string', default: 'undefined', description: 'Override stroke/fill primary color.' },
      { name: 'gradient', type: 'boolean', default: 'true', description: 'Whether to shade the area under the curve with a custom translucent gradient.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover interaction lines and popup details tooltip.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Main title header text.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Secondary descriptive text below title.' },
    ],
    keyboard: [
      { key: 'Mouse Move / Hover', action: 'Positions the horizontal tracking line and renders details tooltip card. Bypasses missing segments.' },
    ],
    aria: [
      { name: 'role="img"', description: 'Identifies the chart vector as an graphical image representation.' },
    ],
    doDonts: [
      { do: 'Use missing data representation to show period drops or connection disconnect states accurately.', dont: 'Interpolate/fill missing spaces if presenting exact metrics is critical for domain analysis.' },
    ],
    playgroundControls: [
      { name: 'curve', label: 'Curve Interpolation', type: 'select', options: ['monotone', 'linear', 'step'], defaultValue: 'monotone' },
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'gradient', label: 'Translucent Gradient', type: 'boolean', defaultValue: true },
    ],
  },
  'stacked-area-chart': {
    id: 'stacked-area-chart',
    label: 'Stacked Area Chart',
    status: 'beta',
    description: 'Stacked area charts show the relationship of individual series to the total cumulative value over time.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data points to visualize.' },
      { name: 'xKey', type: 'string', default: 'required', description: 'The property key in each data object for the X-axis coordinate.' },
      { name: 'yKeys', type: 'string[]', default: 'required', description: 'The keys of the multiple data series to stack.' },
      { name: 'legendLabels', type: 'string[]', default: 'undefined', description: 'Array of custom user-friendly labels corresponding to yKeys.' },
      { name: 'height', type: 'number', default: '300', description: 'Chart drawing height in pixels.' },
      { name: 'curve', type: "'linear' | 'monotone' | 'step'", default: "'monotone'", description: 'Interpolation function style for drawing paths.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to overlay background grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the X and Y axes.' },
      { name: 'colors', type: 'string[]', default: 'DEFAULT_PALETTE', description: 'Array of custom colors to fill layers.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover interaction tracking line and legend-rows tooltip.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Main title header text.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Secondary descriptive text below title.' },
    ],
    keyboard: [
      { key: 'Mouse Move / Hover', action: 'Positions the horizontal tracking line and renders details tooltip card with stacked list values.' },
    ],
    aria: [
      { name: 'role="img"', description: 'Identifies the chart vector as an graphical image representation.' },
    ],
    doDonts: [
      { do: 'Use stacked area charts when the cumulative total of components is important and represents a parts-to-whole relationship.', dont: 'Use stacked area charts if comparing individual metrics values is crucial, as stacking makes lower layers harder to read in isolation.' },
    ],
    playgroundControls: [
      { name: 'curve', label: 'Curve Interpolation', type: 'select', options: ['monotone', 'linear', 'step'], defaultValue: 'monotone' },
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip & Tracker', type: 'boolean', defaultValue: true },
    ],
  },
  'normalized-stacked-area-chart': {
    id: 'normalized-stacked-area-chart',
    label: 'Normalized Stacked Area Chart',
    status: 'beta',
    description: 'Normalized stacked area charts display component parts as percentages of the cumulative total, summing to 100%.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data points to visualize.' },
      { name: 'xKey', type: 'string', default: 'required', description: 'The property key in each data object for the X-axis coordinate.' },
      { name: 'yKeys', type: 'string[]', default: 'required', description: 'The keys of the multiple data series to stack.' },
      { name: 'legendLabels', type: 'string[]', default: 'undefined', description: 'Array of custom user-friendly labels corresponding to yKeys.' },
      { name: 'height', type: 'number', default: '300', description: 'Chart drawing height in pixels.' },
      { name: 'curve', type: "'linear' | 'monotone' | 'step'", default: "'monotone'", description: 'Interpolation function style for drawing paths.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to overlay background grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the X and Y axes.' },
      { name: 'colors', type: 'string[]', default: 'DEFAULT_PALETTE', description: 'Array of custom colors to fill layers.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover interaction tracking line and legend-rows tooltip.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Main title header text.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Secondary descriptive text below title.' },
    ],
    keyboard: [
      { key: 'Mouse Move / Hover', action: 'Positions the horizontal tracking line and renders details tooltip card with stacked contribution percentages.' },
    ],
    aria: [
      { name: 'role="img"', description: 'Identifies the chart vector as an graphical image representation.' },
    ],
    doDonts: [
      { do: 'Use normalized stacked area charts to emphasize relative share changes over time when absolute levels are of secondary importance.', dont: 'Use normalized stacked area charts if displaying changes in absolute cumulative size is critical for context.' },
    ],
    playgroundControls: [
      { name: 'curve', label: 'Curve Interpolation', type: 'select', options: ['monotone', 'linear', 'step'], defaultValue: 'monotone' },
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip & Tracker', type: 'boolean', defaultValue: true },
    ],
  },
  streamgraph: {
    id: 'streamgraph',
    label: 'Streamgraph',
    status: 'beta',
    description: 'Streamgraphs stack multiple layers around a central wiggling axis to create flowing, waves-based data visualizations.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data points to visualize.' },
      { name: 'xKey', type: 'string', default: 'required', description: 'The property key in each data object for the X-axis coordinate.' },
      { name: 'yKeys', type: 'string[]', default: 'required', description: 'The keys of the multiple data series to stack.' },
      { name: 'legendLabels', type: 'string[]', default: 'undefined', description: 'Array of custom user-friendly labels corresponding to yKeys.' },
      { name: 'height', type: 'number', default: '300', description: 'Chart drawing height in pixels.' },
      { name: 'curve', type: "'linear' | 'monotone' | 'step'", default: "'monotone'", description: 'Interpolation function style for drawing paths.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to overlay background grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the X and Y axes.' },
      { name: 'colors', type: 'string[]', default: 'DEFAULT_PALETTE', description: 'Array of custom colors to fill layers.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover interaction tracking line and legend-rows tooltip.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Main title header text.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Secondary descriptive text below title.' },
    ],
    keyboard: [
      { key: 'Mouse Move / Hover', action: 'Positions the horizontal tracking line and renders details tooltip card with stacked raw values.' },
    ],
    aria: [
      { name: 'role="img"', description: 'Identifies the chart vector as an graphical image representation.' },
    ],
    doDonts: [
      { do: 'Use streamgraphs to illustrate aggregate organic flow and proportional balance over time.', dont: 'Use streamgraphs if reading exact value totals or layer baselines is necessary, as wiggling coordinates hide zero baselines.' },
    ],
    playgroundControls: [
      { name: 'curve', label: 'Curve Interpolation', type: 'select', options: ['monotone', 'linear', 'step'], defaultValue: 'monotone' },
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip & Tracker', type: 'boolean', defaultValue: true },
    ],
  },
  'difference-chart': {
    id: 'difference-chart',
    label: 'Difference Chart',
    status: 'beta',
    description: 'Difference charts display the variation between two overlapping time series, highlighting positive and negative gaps.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data points to visualize.' },
      { name: 'xKey', type: 'string', default: 'required', description: 'The property key in each data object for the X-axis coordinate.' },
      { name: 'y0Key', type: 'string', default: 'required', description: 'Key of the first series (drawn with bold outline).' },
      { name: 'y1Key', type: 'string', default: 'required', description: 'Key of the second series (comparison target).' },
      { name: 'y0Label', type: 'string', default: "'Series A'", description: 'Display label for the first series.' },
      { name: 'y1Label', type: 'string', default: "'Series B'", description: 'Display label for the second series.' },
      { name: 'height', type: 'number', default: '300', description: 'Chart drawing height in pixels.' },
      { name: 'curve', type: "'linear' | 'monotone' | 'step'", default: "'monotone'", description: 'Interpolation function style for drawing paths.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to overlay background grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the X and Y axes.' },
      { name: 'colors', type: 'colors object', default: 'DEFAULT_COLORS', description: 'Custom colors for positive (y0 > y1) and negative (y0 < y1) fills.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover interaction tracking line and dual markers tooltip.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Main title header text.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Secondary descriptive text below title.' },
    ],
    keyboard: [
      { key: 'Mouse Move / Hover', action: 'Positions the horizontal tracking line and renders details tooltip card with comparative values and gap metrics.' },
    ],
    aria: [
      { name: 'role="img"', description: 'Identifies the chart vector as an graphical image representation.' },
    ],
    doDonts: [
      { do: 'Use difference charts when tracking variations between two overlapping metrics (e.g. actual vs normal temperature) is key.', dont: 'Use difference charts if comparing more than two series, as clip-paths cannot easily segment three or more overlaps.' },
    ],
    playgroundControls: [
      { name: 'curve', label: 'Curve Interpolation', type: 'select', options: ['monotone', 'linear', 'step'], defaultValue: 'monotone' },
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip & Tracker', type: 'boolean', defaultValue: true },
    ],
  },
  'bar-chart': {
    id: 'bar-chart',
    label: 'Bar Chart',
    status: 'beta',
    description: 'A vertical bar chart that compares categorical values along a common quantitative baseline. Mirroring the D3.js canonical bar chart example with letter frequency data.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data objects.' },
      { name: 'xKey', type: 'string', default: 'required', description: 'Key in each data object used for the X axis (category labels).' },
      { name: 'yKey', type: 'string', default: 'required', description: 'Key in each data object for the quantitative Y axis value.' },
      { name: 'height', type: 'number', default: '320', description: 'Chart drawing height in pixels.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to overlay background horizontal grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the X and Y axes with tick labels.' },
      { name: 'barRadius', type: 'number', default: '3', description: 'Corner radius applied to the top of each bar.' },
      { name: 'barPadding', type: 'number', default: '0.15', description: 'Ratio of whitespace between bars (0 = no gap, 1 = all gap).' },
      { name: 'color', type: 'string', default: 'var(--md-sys-color-primary)', description: 'Fill color of all bars.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover tooltips revealing the bar label and value.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Optional chart title displayed above the chart.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Optional secondary descriptive text below the title.' },
      { name: 'yFormatter', type: '(val: number) => string', default: 'undefined', description: 'Custom formatter for Y-axis tick labels.' },
      { name: 'xFormatter', type: '(val: string) => string', default: 'undefined', description: 'Custom formatter for X-axis tick labels.' },
    ],
    keyboard: [
      { key: 'Mouse Hover', action: 'Shows a tooltip card with the bar category label and numeric value.' },
    ],
    aria: [
      { name: 'data-md3-component="bar-chart"', description: 'Identifies the root element as a bar chart component.' },
    ],
    doDonts: [
      { do: 'Sort bars by value (descending) to make rankings immediately readable.', dont: 'Use a bar chart for continuous time-series data — use an area or line chart instead.' },
      { do: 'Use clear, short X-axis labels so categories are quickly identifiable.', dont: 'Crowd too many bars — consider grouping or paging if categories exceed 30+.' },
    ],
    playgroundControls: [
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip', type: 'boolean', defaultValue: true },
    ],
  },
  'horizontal-bar-chart': {
    id: 'horizontal-bar-chart',
    label: 'Horizontal Bar Chart',
    status: 'beta',
    description: 'A horizontal bar chart mapping categories to values with bars extending left-to-right. Ideal for long category labels, ranked comparisons, or when a horizontal reading flow feels more natural.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data objects.' },
      { name: 'yKey', type: 'string', default: 'required', description: 'Key in each data object used for the Y axis (category labels).' },
      { name: 'xKey', type: 'string', default: 'required', description: 'Key in each data object for the quantitative X axis value (bar length).' },
      { name: 'height', type: 'number', default: '400', description: 'Chart drawing height in pixels.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to overlay background vertical grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the X and Y axes with tick labels.' },
      { name: 'barRadius', type: 'number', default: '3', description: 'Corner radius applied to the right end of each bar.' },
      { name: 'barPadding', type: 'number', default: '0.2', description: 'Ratio of whitespace between bars (0 = no gap, 1 = all gap).' },
      { name: 'color', type: 'string', default: 'var(--md-sys-color-primary)', description: 'Fill color of all bars.' },
      { name: 'showValueLabels', type: 'boolean', default: 'true', description: 'Shows the numeric value at the right end of each bar.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover tooltips revealing the bar label and value.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Optional chart title displayed above the chart.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Optional secondary descriptive text below the title.' },
      { name: 'xFormatter', type: '(val: number) => string', default: 'undefined', description: 'Custom formatter for X-axis tick labels and tooltip values.' },
      { name: 'yFormatter', type: '(val: string) => string', default: 'undefined', description: 'Custom formatter for Y-axis category labels.' },
    ],
    keyboard: [
      { key: 'Mouse Hover', action: 'Shows a tooltip card with the category label and numeric bar value.' },
    ],
    aria: [
      { name: 'data-md3-component="horizontal-bar-chart"', description: 'Identifies the root element as a horizontal bar chart component.' },
    ],
    doDonts: [
      { do: 'Use horizontal bars when category labels are long text (e.g. country names, product names) to avoid cramped X-axis labels.', dont: 'Mix horizontal and vertical bar charts on the same dashboard without a clear reason — pick one orientation consistently.' },
      { do: 'Sort bars by value (descending top-to-bottom) to make rankings scannable at a glance.', dont: 'Use horizontal bars for time-series data — area or line charts communicate temporal progression more naturally.' },
    ],
    playgroundControls: [
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'showValueLabels', label: 'Show Value Labels', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip', type: 'boolean', defaultValue: true },
    ],
  },
  'diverging-bar-chart': {
    id: 'diverging-bar-chart',
    label: 'Diverging Bar Chart',
    status: 'beta',
    description: 'A horizontal diverging bar chart where positive values extend right and negative values extend left from a shared zero baseline. Ideal for showing change, deficit/surplus, or sentiment scores. Mirrors the D3.js canonical diverging bar chart (US state population change).',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data objects with a category key and a numeric (positive or negative) value key.' },
      { name: 'yKey', type: 'string', default: 'required', description: 'Key for the category label rendered on the Y axis (centered on the zero line).' },
      { name: 'xKey', type: 'string', default: 'required', description: 'Key for the numeric value. Positive values extend right; negative extend left.' },
      { name: 'height', type: 'number', default: '500', description: 'Chart drawing height in pixels.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to show vertical reference grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the bottom X axis with value ticks.' },
      { name: 'barRadius', type: 'number', default: '3', description: 'Corner radius on the outer end of each bar.' },
      { name: 'barPadding', type: 'number', default: '0.15', description: 'Ratio of whitespace between bars.' },
      { name: 'positiveColor', type: 'string', default: "'#4a90d9'", description: 'Fill color for bars with positive values (right-extending).' },
      { name: 'negativeColor', type: 'string', default: "'#e07050'", description: 'Fill color for bars with negative values (left-extending).' },
      { name: 'showValueLabels', type: 'boolean', default: 'true', description: 'Displays the formatted value at the outer end of each bar.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover tooltip with a color-coded accent border.' },
      { name: 'legendLabels', type: '[string, string]', default: 'undefined', description: 'Optional legend labels as [positiveLabel, negativeLabel].' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Optional chart title.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Optional subtitle below the title.' },
      { name: 'xFormatter', type: '(val: number) => string', default: 'undefined', description: 'Custom formatter for X-axis tick labels and tooltip values.' },
    ],
    keyboard: [
      { key: 'Mouse Hover', action: 'Shows a tooltip card with color-coded accent border indicating positive or negative direction.' },
    ],
    aria: [
      { name: 'data-md3-component="diverging-bar-chart"', description: 'Identifies the root element as a diverging bar chart.' },
    ],
    doDonts: [
      { do: 'Use diverging bars to show values that have a meaningful zero point (e.g., population change, profit/loss, survey scores).', dont: "Use diverging bars for data without a natural midpoint — use a regular horizontal bar chart instead." },
      { do: 'Label the zero baseline clearly and keep it visually prominent.', dont: 'Mix diverging bars with stacked bars in the same chart without clear visual separation.' },
    ],
    playgroundControls: [
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'showValueLabels', label: 'Show Value Labels', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip', type: 'boolean', defaultValue: true },
    ],
  },
  'stacked-bar-chart': {
    id: 'stacked-bar-chart',
    label: 'Stacked Bar Chart',
    status: 'beta',
    description: 'A stacked bar chart comparing cumulative contributions of different series within a category. Supports vertical or horizontal layouts, custom series colors, and interactive legend toggles.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data objects containing category and value keys.' },
      { name: 'categoryKey', type: 'string', default: 'required', description: 'Key in data objects for the category labels.' },
      { name: 'keys', type: 'string[]', default: 'required', description: 'Keys of numeric values to stack cumulatively.' },
      { name: 'normalized', type: 'boolean', default: 'false', description: 'If true, normalizes values to percentage sums equaling 100%.' },
      { name: 'horizontal', type: 'boolean', default: 'true', description: 'If true, renders horizontal bar columns; vertical if false.' },
      { name: 'height', type: 'number', default: '400', description: 'Chart drawing height in pixels.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to overlay background reference grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the category and value axes.' },
      { name: 'colors', type: 'string[]', default: 'DEFAULT_COLORS', description: 'Predefined color array mapping each key to a visual layer.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover tooltips revealing layer names and exact contributions.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Optional chart header title.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Optional chart subtitle description.' },
    ],
    keyboard: [
      { key: 'Mouse Click Legend', action: 'Toggles the visibility of specific series keys in the layout stack dynamically.' },
      { key: 'Mouse Hover Bar', action: 'Renders the precise numeric contribution and percentage share of the segment.' },
    ],
    aria: [
      { name: 'data-md3-component="stacked-bar-chart"', description: 'Identifies the root element as a stacked bar chart component.' },
    ],
    doDonts: [
      { do: 'Use stacked bar charts to compare whole categories and understand category breakdowns.', dont: 'Use stacked bar charts when category totals are not comparable or meaningful.' },
      { do: 'Provide distinct, highly contrasting colors for each stacked key segment.', dont: 'Stack more than 6-7 categories as they become difficult for users to visually decode.' },
    ],
    playgroundControls: [
      { name: 'horizontal', label: 'Horizontal Orientation', type: 'boolean', defaultValue: true },
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip & Tracker', type: 'boolean', defaultValue: true },
    ],
  },
  'normalized-stacked-bar-chart': {
    id: 'normalized-stacked-bar-chart',
    label: 'Normalized Stacked Bar Chart',
    status: 'beta',
    description: 'A stacked bar chart normalized to relative percentages totaling 100%. Replicates the D3.js percentage stacking structure.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data objects containing category and value keys.' },
      { name: 'categoryKey', type: 'string', default: 'required', description: 'Key in data objects for the category labels.' },
      { name: 'keys', type: 'string[]', default: 'required', description: 'Keys of numeric values to stack cumulatively.' },
      { name: 'normalized', type: 'boolean', default: 'true', description: 'Set to true for percentage stacking totaling 100%.' },
      { name: 'horizontal', type: 'boolean', default: 'true', description: 'If true, renders horizontal bar columns; vertical if false.' },
      { name: 'height', type: 'number', default: '400', description: 'Chart drawing height in pixels.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to overlay background reference grid lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the category and value axes.' },
      { name: 'colors', type: 'string[]', default: 'DEFAULT_COLORS', description: 'Predefined color array mapping each key to a visual layer.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover tooltips revealing layer names and exact contributions.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Optional chart header title.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Optional chart subtitle description.' },
    ],
    keyboard: [
      { key: 'Mouse Click Legend', action: 'Toggles the visibility of specific series keys in the layout stack dynamically.' },
      { key: 'Mouse Hover Bar', action: 'Renders the precise numeric contribution and percentage share of the segment.' },
    ],
    aria: [
      { name: 'data-md3-component="stacked-bar-chart"', description: 'Identifies the root element as a stacked bar chart component.' },
    ],
    doDonts: [
      { do: 'Use normalized stacked bar charts to emphasize shares of the whole category over absolute magnitudes.', dont: 'Use if the absolute sums of categories are the key comparison metric.' },
    ],
    playgroundControls: [
      { name: 'horizontal', label: 'Horizontal Orientation', type: 'boolean', defaultValue: true },
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip & Tracker', type: 'boolean', defaultValue: true },
    ],
  },
  'timeline-chart': {
    id: 'timeline-chart',
    label: 'World History Timeline',
    status: 'beta',
    description: 'A timeline chart showing duration events or civilisations from a start to an end boundary. Supports custom region coloring, top year axis (BC/AD), interactive tracker line, and multi-mode sorting (time, duration, name).',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data objects containing duration events.' },
      { name: 'idKey', type: 'string', default: 'required', description: 'Unique identifier key for each timeline row.' },
      { name: 'labelKey', type: 'string', default: 'required', description: 'Key of the text label for the bar.' },
      { name: 'startKey', type: 'string', default: 'required', description: 'Key of the start year (negative for BC, positive for AD).' },
      { name: 'endKey', type: 'string', default: 'required', description: 'Key of the end year (negative for BC, positive for AD).' },
      { name: 'categoryKey', type: 'string', default: 'undefined', description: 'Optional key of the category/region for bar coloring.' },
      { name: 'colors', type: 'string[]', default: 'DEFAULT_COLORS', description: 'Custom array of hex colors for region mapping.' },
      { name: 'height', type: 'number', default: '680', description: 'Height of the chart drawing area in pixels.' },
      { name: 'showGrid', type: 'boolean', default: 'true', description: 'Whether to show vertical grid reference lines.' },
      { name: 'showAxes', type: 'boolean', default: 'true', description: 'Whether to show the top year axis.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover tooltips and interactive tracking line.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Optional chart title.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Optional subtitle below the title.' },
    ],
    keyboard: [
      { key: 'Mouse Move / Hover Bar', action: 'Renders the detailed tooltip showing labels, regions, and dates. Aligns the dashed vertical tracker line.' },
      { key: 'Select Sort Mode', action: 'Re-orders timeline rows dynamically by start time, duration, or alphabetical name.' },
    ],
    aria: [
      { name: 'data-md3-component="timeline-chart"', description: 'Identifies the root element as a timeline chart component.' },
    ],
    doDonts: [
      { do: 'Provide sorting controls to allow users to organize timelines chronologically or by size.', dont: 'Use timeline charts when events only have single point-in-time dates; use scatter plots or timeline markers instead.' },
      { do: 'Use colors to group timeline items by meaningful categories (e.g., regions or types).', dont: 'Overcrowd the chart with too many categories or overlapping series.' },
    ],
    playgroundControls: [
      { name: 'showGrid', label: 'Show Grid Lines', type: 'boolean', defaultValue: true },
      { name: 'showAxes', label: 'Show Axes', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip & Tracker', type: 'boolean', defaultValue: true },
    ],
  },
  'calendar-chart': {
    id: 'calendar-chart',
    label: 'Calendar View',
    status: 'beta',
    description: 'A calendar view (heatmap) displaying daily metrics mapped across weeks and weekdays in a year-based grid layout, featuring a diverging color scale.',
    props: [
      { name: 'data', type: 'any[]', default: 'required', description: 'Array of data items containing date and value fields.' },
      { name: 'dateKey', type: 'string', default: "'date'", description: 'Key of the date field in each object.' },
      { name: 'valueKey', type: 'string', default: "'value'", description: 'Key of the numeric value field in each object.' },
      { name: 'weekdaysOnly', type: 'boolean', default: 'true', description: 'If true, only renders weekdays Monday through Friday.' },
      { name: 'cellSize', type: 'number', default: '15', description: 'Size of each square day cell in pixels.' },
      { name: 'negativeColor', type: 'string', default: "'#b32657'", description: 'Diverging scale negative peak color.' },
      { name: 'neutralColor', type: 'string', default: "'#f5f5f5'", description: 'Diverging scale neutral midpoint color.' },
      { name: 'positiveColor', type: 'string', default: "'#2e7d32'", description: 'Diverging scale positive peak color.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables hover tooltips.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Optional chart header title.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Optional chart subtitle.' },
      { name: 'legendTitle', type: 'string', default: "'Daily change'", description: 'Title header text for the legend bar.' },
      { name: 'valueFormatter', type: '(val: number) => string', default: 'undefined', description: 'Custom formatter for value tooltips.' },
    ],
    keyboard: [
      { key: 'Mouse Hover Cell', action: 'Renders the detailed tooltip showing dates and formatted value.' },
    ],
    aria: [
      { name: 'data-md3-component="calendar-chart"', description: 'Identifies the root element as a calendar chart component.' },
    ],
    doDonts: [
      { do: 'Use calendar heatmaps to highlight temporal patterns, seasonal clusters, or daily shifts.', dont: 'Use calendar view if dates are sparse or if comparison of absolute raw trends over time is the key goal.' },
    ],
    playgroundControls: [
      { name: 'weekdaysOnly', label: 'Weekdays Only', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip', type: 'boolean', defaultValue: true },
    ],
  },
};

const COMMON_CLASS_PROP: PropDef = {
  name: 'className',
  type: 'string',
  default: 'undefined',
  description: 'Optional CSS class for layout or local styling overrides.',
};

const COMPONENT_DOC_BLUEPRINTS: Record<string, Omit<ComponentMetadata, 'id' | 'label'>> = {
  'fab-menu': {
    status: 'beta',
    description: 'FAB menus reveal a small set of related high-emphasis actions from a floating trigger.',
    props: [
      { name: 'items', type: 'FABMenuItem[]', default: 'required', description: 'Actions shown when the menu expands.' },
      { name: 'open', type: 'boolean', default: 'internal', description: 'Expansion state when controlled externally by the caller.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [
      { key: 'Enter / Space', action: 'Activates the FAB trigger or focused menu action.' },
      { key: 'Tab', action: 'Moves through visible actions when the menu is open.' },
    ],
    aria: [
      { name: 'aria-expanded', description: 'Communicates whether the action menu is currently open.' },
      { name: 'aria-hidden', description: 'Hides collapsed action items from assistive technologies.' },
    ],
    doDonts: [
      { do: 'Use for a short family of closely related primary actions.', dont: 'Use it as a replacement for long overflow menus.' },
    ],
  },
  'split-button': {
    status: 'stable',
    description: 'Split buttons pair a primary action with a menu of alternate related actions.',
    props: [
      { name: 'label', type: 'string', default: 'required', description: 'Primary action label.' },
      { name: 'startIcon', type: 'string', default: 'undefined', description: 'Optional Material icon before the primary label.' },
      { name: 'onClick', type: '() => void', default: 'undefined', description: 'Primary action callback.' },
      { name: 'options', type: 'SplitButtonOption[]', default: 'required', description: 'Secondary menu actions.' },
    ],
    keyboard: [
      { key: 'Arrow Down', action: 'Opens the alternate action menu and focuses the first item.' },
      { key: 'Escape', action: 'Closes the menu.' },
    ],
    aria: [
      { name: 'aria-haspopup="menu"', description: 'Identifies the trailing button as a menu trigger.' },
      { name: 'role="menuitem"', description: 'Applied to each secondary action.' },
    ],
    doDonts: [
      { do: 'Keep the primary action predictable and the alternate actions closely related.', dont: 'Hide destructive actions behind an ambiguous trailing arrow.' },
    ],
  },
  'segmented-button': {
    status: 'stable',
    description: 'Segmented buttons select one or multiple options from a compact set.',
    props: [
      { name: 'options', type: 'SegmentedOption[]', default: 'required', description: 'Segments with values, optional labels, optional icons, and optional tooltips.' },
      { name: 'value', type: 'string | string[]', default: 'required', description: 'Selected segment value or values.' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows multiple segments to be selected.' },
      COMMON_CLASS_PROP,
    ],

    keyboard: [{ key: 'Tab + Space/Enter', action: 'Focuses and toggles a segment.' }],
    aria: [
      { name: 'role="radiogroup"', description: 'Used for single-select segments.' },
      { name: 'aria-pressed', description: 'Used for multi-select toggle segments.' },
    ],
    doDonts: [
      { do: 'Use for 2-5 mutually related choices.', dont: 'Use for navigation across unrelated app sections.' },
    ],
  },
  'bottom-sheet': {
    status: 'beta',
    description: 'Bottom sheets present contextual content from the bottom edge while keeping the current task nearby.',
    props: [
      { name: 'open', type: 'boolean', default: 'required', description: 'Controls sheet visibility.' },
      { name: 'onClose', type: '() => void', default: 'required', description: 'Called when Escape or the scrim closes the sheet.' },
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Sheet content.' },
    ],
    keyboard: [
      { key: 'Escape', action: 'Closes the sheet.' },
      { key: 'Tab', action: 'Keeps focus inside while open.' },
    ],
    aria: [{ name: 'role="dialog"', description: 'Announces the sheet as a modal surface.' }],
    doDonts: [
      { do: 'Use for short contextual workflows or secondary choices.', dont: 'Use for deeply nested forms that need a full page.' },
    ],
  },
  'side-sheet': {
    status: 'beta',
    description: 'Side sheets reveal supporting content or filters from a screen edge.',
    props: [
      { name: 'open', type: 'boolean', default: 'required', description: 'Controls sheet visibility.' },
      { name: 'side', type: "'left' | 'right'", default: "'right'", description: 'Edge where the sheet appears.' },
      { name: 'onClose', type: '() => void', default: 'required', description: 'Called when the sheet should close.' },
    ],
    keyboard: [
      { key: 'Escape', action: 'Closes the sheet.' },
      { key: 'Tab', action: 'Keeps focus inside while open.' },
    ],
    aria: [{ name: 'aria-modal="true"', description: 'Marks the side sheet as modal while open.' }],
    doDonts: [
      { do: 'Use for filters, details, or supporting panels on wider layouts.', dont: 'Use when the content is essential primary navigation.' },
    ],
  },
  snackbar: {
    status: 'stable',
    description: 'Snackbars provide brief status updates with an optional low-emphasis action.',
    props: [
      { name: 'message', type: 'ReactNode', default: 'required', description: 'Short feedback text.' },
      { name: 'action', type: 'ReactNode', default: 'undefined', description: 'Optional action such as Undo.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab', action: 'Focuses an action if one is present.' }],
    aria: [{ name: 'role="status"', description: 'Announces non-critical updates politely.' }],
    doDonts: [
      { do: 'Keep messages concise and time-bound.', dont: 'Use snackbars for blocking decisions.' },
    ],
  },
  tooltip: {
    status: 'stable',
    description: 'Tooltips label or explain compact controls on hover or focus.',
    props: [
      { name: 'label', type: 'ReactNode', default: 'required', description: 'Tooltip text or element.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Headline title for rich tooltips.' },
      { name: 'rich', type: 'boolean', default: 'false', description: 'Uses rich styling layout.' },
      { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right' | 'auto'", default: "'top'", description: 'Preferred direction of the tooltip popup.' },
      { name: 'children', type: 'ReactNode', default: 'required', description: 'Target trigger element.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Focus', action: 'Shows the tooltip for keyboard users.' }],
    aria: [{ name: 'role="tooltip"', description: 'Identifies the popup as tooltip content.' }],
    doDonts: [
      { do: 'Use for icon-only controls and compact affordances.', dont: 'Put essential instructions only in a tooltip.' },
    ],
  },
  menu: {
    status: 'stable',
    description: 'Menus show a temporary list of actions or choices anchored to a trigger.',
    props: [
      { name: 'trigger', type: '(props) => ReactNode', default: 'required', description: 'Render prop that receives menu trigger accessibility handlers.' },
      { name: 'items', type: 'MenuItem[]', default: 'required', description: 'Menu rows, icons, disabled states, and dividers with optional labels.' },
      { name: 'align', type: "'left' | 'right' | 'auto'", default: "'left'", description: 'Alignment of the dropdown menu.' },
      { name: 'usePortal', type: 'boolean', default: 'true', description: 'Render menu inside document.body portal.' },
    ],

    keyboard: [
      { key: 'Arrow Down / Arrow Up', action: 'Moves focus through menu items.' },
      { key: 'Escape', action: 'Closes the menu.' },
    ],
    aria: [
      { name: 'aria-haspopup="menu"', description: 'Applied to the trigger.' },
      { name: 'role="menu"', description: 'Applied to the popup container.' },
    ],
    doDonts: [
      { do: 'Use menus for compact contextual actions.', dont: 'Use menus for complex forms or long browsing experiences.' },
    ],
  },
  radio: {
    status: 'stable',
    description: 'Radio buttons select exactly one option from a related set.',
    props: [
      { name: 'checked', type: 'boolean', default: 'required', description: 'Whether the option is selected.' },
      { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', default: 'required', description: 'Native radio change handler.' },
      { name: 'label', type: 'string', default: 'undefined', description: 'Inline label text.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Arrow keys / Space', action: 'Follows native radio input behavior.' }],
    aria: [{ name: 'type="radio"', description: 'Uses native radio semantics.' }],
    doDonts: [
      { do: 'Group radio buttons with a clear fieldset or label.', dont: 'Use radios when multiple answers can be selected.' },
    ],
  },
  chip: {
    status: 'stable',
    description: 'Chips represent compact inputs, filters, suggestions, or actions.',
    props: [
      { name: 'kind', type: "'assist' | 'filter' | 'input' | 'suggestion'", default: "'assist'", description: 'Chip interaction pattern.' },
      { name: 'selected', type: 'boolean', default: 'false', description: 'Selected state for filter/input chips.' },
      { name: 'onClose', type: '() => void', default: 'undefined', description: 'Renders a remove affordance for input chips.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Enter / Space', action: 'Activates or toggles the chip.' }],
    aria: [
      { name: 'role="checkbox"', description: 'Used by selectable filter/input chips.' },
      { name: 'aria-checked', description: 'Reflects chip selection state.' },
    ],
    doDonts: [
      { do: 'Use chips to make small pieces of state visible and easy to adjust.', dont: 'Use chips for long-form commands.' },
    ],
  },
  search: {
    status: 'stable',
    description: 'Search fields help users enter queries and refine content in the current surface.',
    props: [
      { name: 'value', type: 'string', default: 'required', description: 'Current query text.' },
      { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', default: 'required', description: 'Native input change handler.' },
      { name: 'placeholder', type: 'string', default: 'undefined', description: 'Short query hint.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Escape', action: 'Commonly clears or exits search when wired by the caller.' }],
    aria: [{ name: 'type="search"', description: 'Uses native search input semantics.' }],
    doDonts: [
      { do: 'Place search close to the content it filters.', dont: 'Use generic placeholder text when the searchable scope is narrow.' },
    ],
  },
  select: {
    status: 'stable',
    description: 'Select lets users choose one value from a bounded list of options.',
    props: [
      { name: 'options', type: 'SelectOption[]', default: 'required', description: 'Available choices.' },
      { name: 'value', type: 'string', default: 'undefined', description: 'Selected option value.' },
      { name: 'onChange', type: '(value: string) => void', default: 'undefined', description: 'Called with the selected value.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the trigger.' },
      { name: 'minWidth', type: 'string | number', default: 'undefined', description: 'Minimum width of the select container.' },
      { name: 'width', type: 'string | number', default: 'undefined', description: 'Explicit width of the select container.' },
      { name: 'size', type: "'small' | 'medium' | 'large'", default: "'large'", description: 'Height and padding density size.' },
      COMMON_CLASS_PROP,
    ],

    keyboard: [
      { key: 'Arrow Down / Arrow Up', action: 'Opens and moves through options.' },
      { key: 'Enter', action: 'Selects the active option.' },
      { key: 'Escape', action: 'Closes the listbox.' },
    ],
    aria: [
      { name: 'role="combobox"', description: 'Applied to the readonly trigger input.' },
      { name: 'role="listbox"', description: 'Applied to the option popup.' },
      { name: 'aria-activedescendant', description: 'Tracks the keyboard-active option.' },
    ],
    doDonts: [
      { do: 'Use select for short, known option sets.', dont: 'Use select when users need to search many options; use Combobox.' },
    ],
  },
  combobox: {
    status: 'stable',
    description: 'Combobox combines text entry with filtered option selection.',
    props: [
      { name: 'options', type: 'ComboboxOption[]', default: 'required', description: 'Choices available for filtering.' },
      { name: 'value', type: 'string', default: 'undefined', description: 'Selected option value.' },
      { name: 'strict', type: 'boolean', default: 'true', description: 'Restricts committed values to listed options.' },
      { name: 'onChange', type: '(value?: string) => void', default: 'undefined', description: 'Called when an option is selected or cleared in free-entry mode.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [
      { key: 'Arrow Down / Arrow Up', action: 'Moves through filtered options.' },
      { key: 'Enter', action: 'Chooses the active option.' },
      { key: 'Escape', action: 'Closes the popup.' },
    ],
    aria: [
      { name: 'aria-autocomplete="list"', description: 'Communicates filtered suggestions.' },
      { name: 'aria-expanded', description: 'Reflects popup visibility.' },
    ],
    doDonts: [
      { do: 'Use comboboxes for medium or searchable option sets.', dont: 'Use a combobox for two or three static choices.' },
    ],
  },
  'number-input': {
    status: 'stable',
    description: 'Number inputs provide typed numeric entry with increment and decrement controls.',
    props: [
      { name: 'value', type: 'number', default: 'required', description: 'Current numeric value.' },
      { name: 'onChange', type: '(value: number) => void', default: 'required', description: 'Called with the next value.' },
      { name: 'min / max / step', type: 'number', default: 'native defaults', description: 'Numeric constraints.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Arrow Up / Arrow Down', action: 'Uses native number input stepping.' }],
    aria: [{ name: 'aria-label', description: 'Increment and decrement buttons include accessible labels.' }],
    doDonts: [
      { do: 'Use for exact numeric values.', dont: 'Use for approximate ranges where Slider is faster.' },
    ],
  },
  rating: {
    status: 'stable',
    description: 'Ratings visualize a bounded score, commonly using star icons.',
    props: [
      { name: 'value', type: 'number', default: 'required', description: 'Current rating.' },
      { name: 'max', type: 'number', default: '5', description: 'Maximum score.' },
      { name: 'readOnly', type: 'boolean', default: 'false', description: 'Disables editing.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab', action: 'Focuses editable rating controls when available.' }],
    aria: [{ name: 'aria-label', description: 'Announces the score as value out of max.' }],
    doDonts: [
      { do: 'Use ratings for subjective scores.', dont: 'Use stars to show precise operational metrics.' },
    ],
  },
  'date-picker': {
    status: 'beta',
    description: 'Date pickers collect calendar dates with Material-styled fields and panels.',
    props: [
      { name: 'value', type: 'Date | string', default: 'undefined', description: 'Selected date.' },
      { name: 'onChange', type: '(value) => void', default: 'undefined', description: 'Called when the date changes.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab / Enter / Escape', action: 'Moves through controls, selects dates, or closes overlays.' }],
    aria: [{ name: 'aria-label', description: 'Calendar controls should expose clear date labels.' }],
    doDonts: [
      { do: 'Use for dates that benefit from calendar context.', dont: 'Force calendar picking for familiar typed dates like birthdays.' },
    ],
  },
  'time-picker': {
    status: 'beta',
    description: 'Time pickers collect time values with touch-friendly Material controls.',
    props: [
      { name: 'value', type: 'string', default: 'undefined', description: 'Selected time.' },
      { name: 'onChange', type: '(value: string) => void', default: 'undefined', description: 'Called when the time changes.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab / Enter / Escape', action: 'Moves through controls, confirms values, or closes overlays.' }],
    aria: [{ name: 'aria-label', description: 'Inputs should announce hour, minute, and period meaningfully.' }],
    doDonts: [
      { do: 'Use when time precision and format matter.', dont: 'Use a time picker for broad time-of-day categories.' },
    ],
  },
  'top-app-bar': {
    status: 'stable',
    description: 'Top app bars hold page titles, navigation affordances, and key actions.',
    props: [
      { name: 'variant', type: "'small' | 'center' | 'medium' | 'large'", default: "'small'", description: 'TopAppBar layout variant style.' },
      { name: 'title', type: 'ReactNode', default: 'required', description: 'Headline title.' },
      { name: 'start', type: 'ReactNode', default: 'undefined', description: 'Left-aligned leading element (navigation button, logo).' },
      { name: 'end', type: 'ReactNode', default: 'undefined', description: 'Right-aligned actions list container.' },
      { name: 'scrolled', type: 'boolean', default: 'false', description: 'Triggers scrolled background elevation style.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab', action: 'Moves across interactive actions.' }],
    aria: [{ name: 'header / nav landmarks', description: 'Use surrounding landmarks in app shells when appropriate.' }],
    doDonts: [
      { do: 'Keep actions high frequency and screen-specific.', dont: 'Overload the top bar with every available command.' },
    ],
  },

  'navigation-bar': {
    status: 'stable',
    description: 'Navigation bars provide compact bottom navigation for up to five destinations.',
    props: [
      { name: 'items', type: 'NavigationItem[]', default: 'required', description: 'Destinations with icons and labels.' },
      { name: 'value', type: 'string', default: 'required', description: 'Active destination value.' },
      { name: 'onChange', type: '(value: string) => void', default: 'required', description: 'Called when a destination is selected.' },
    ],
    keyboard: [{ key: 'Tab + Enter/Space', action: 'Focuses and activates destinations.' }],
    aria: [
      { name: 'role="tablist"', description: 'Models destinations as mutually exclusive selections.' },
      { name: 'aria-selected', description: 'Marks the active destination.' },
    ],
    doDonts: [
      { do: 'Use for primary destinations on compact screens.', dont: 'Show more than five destinations.' },
    ],
  },
  'navigation-rail': {
    status: 'stable',
    description: 'Navigation rails provide vertical primary navigation for medium-width layouts.',
    props: [
      { name: 'items', type: 'NavigationItem[]', default: 'required', description: 'Destinations with icons and labels.' },
      { name: 'value', type: 'string', default: 'required', description: 'Active destination value.' },
      { name: 'onChange', type: '(value: string) => void', default: 'required', description: 'Called when a destination is selected.' },
    ],
    keyboard: [{ key: 'Tab + Enter/Space', action: 'Focuses and activates destinations.' }],
    aria: [{ name: 'role="tablist"', description: 'Models primary destination selection.' }],
    doDonts: [
      { do: 'Use when side space is available.', dont: 'Use rail and bottom nav at the same breakpoint.' },
    ],
  },
  'navigation-drawer': {
    status: 'beta',
    description: 'Navigation drawers expose app destinations and hierarchy in a side panel.',
    props: [
      { name: 'sections', type: 'NavSection[]', default: 'required', description: 'Sections containing list destinations.' },
      { name: 'value', type: 'string', default: 'required', description: 'Active destination key value.' },
      { name: 'onChange', type: '(v: string) => void', default: 'required', description: 'Selection state change listener.' },
      { name: 'header', type: 'ReactNode', default: 'undefined', description: 'Header content shown above the destination items.' },
      { name: 'modal', type: 'boolean', default: 'false', description: 'Renders the drawer as a modal slide-out panel.' },
      { name: 'open', type: 'boolean', default: 'false', description: 'Controls visibility of the modal drawer.' },
      { name: 'onClose', type: '() => void', default: 'undefined', description: 'Close action handler triggered by scrim click or Escape.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Escape', action: 'Closes modal drawers when wired by the caller.' }],
    aria: [{ name: 'nav', description: 'Drawer content should be exposed as navigation.' }],
    doDonts: [
      { do: 'Use drawers for broad app structures.', dont: 'Use them for one-off contextual actions.' },
    ],
  },

  tabs: {
    status: 'stable',
    description: 'Tabs switch between related views at the same hierarchy level.',
    props: [
      { name: 'items', type: 'TabItem[]', default: 'required', description: 'Tabs with values, labels, and optional icons.' },
      { name: 'value', type: 'string', default: 'required', description: 'Selected tab value.' },
      { name: 'onChange', type: '(value: string) => void', default: 'required', description: 'Called when the active tab changes.' },
      { name: 'ariaLabel', type: 'string', default: 'undefined', description: 'Accessible name for the tab list.' },
    ],
    keyboard: [
      { key: 'Arrow Left / Arrow Right', action: 'Moves between tabs.' },
      { key: 'Home / End', action: 'Moves to the first or last tab.' },
    ],
    aria: [
      { name: 'role="tablist"', description: 'Groups related tabs.' },
      { name: 'role="tab"', description: 'Applied to each tab button.' },
    ],
    doDonts: [
      { do: 'Use tabs for peer content views.', dont: 'Use tabs for sequential steps.' },
    ],
  },
  toolbar: {
    status: 'stable',
    description: 'Toolbars group compact actions into an expressive command cluster.',
    props: [
      { name: 'children', type: 'ReactNode', default: 'required', description: 'Toolbar controls.' },
      { name: 'vibrant', type: 'boolean', default: 'false', description: 'Applies a more expressive color treatment.' },
      { name: 'docked', type: 'boolean', default: 'false', description: 'Uses a docked layout treatment.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab', action: 'Moves through toolbar controls.' }],
    aria: [{ name: 'role="toolbar"', description: 'Identifies the grouped command surface.' }],
    doDonts: [
      { do: 'Group commands that are used together.', dont: 'Mix unrelated navigation and editing controls.' },
    ],
  },
  'progress-indicator': {
    status: 'stable',
    description: 'Progress indicators show determinate or indeterminate task progress.',
    props: [
      { name: 'value', type: 'number', default: '0', description: 'Progress value from 0 to 100.' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows ongoing progress without a known value.' },
      { name: 'variant', type: "'linear' | 'circular' | 'wavy'", default: "'linear'", description: 'Progress presentation.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [],
    aria: [
      { name: 'role="progressbar"', description: 'Announces progress state.' },
      { name: 'aria-valuenow', description: 'Provided for determinate progress.' },
    ],
    doDonts: [
      { do: 'Use determinate progress when the amount of work is known.', dont: 'Show fake precision for unknown work.' },
    ],
  },
  'loading-indicator': {
    status: 'stable',
    description: 'Expressive loading indicators use morphing shapes to communicate ongoing work.',
    props: [
      { name: 'size', type: 'number', default: '48', description: 'Rendered indicator size in pixels.' },
      { name: 'aria-label', type: 'string', default: "'Loading'", description: 'Accessible loading label.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [],
    aria: [{ name: 'role="progressbar"', description: 'Announces loading state.' }],
    doDonts: [
      { do: 'Use for short waiting states where a determinate value is unavailable.', dont: 'Use animated loading indicators when content can render skeleton placeholders.' },
    ],
  },
  banner: {
    status: 'stable',
    description: 'Banners display important contextual messages with optional actions.',
    props: [
      { name: 'variant', type: "'info' | 'warning' | 'error' | 'success'", default: "'info'", description: 'Message tone.' },
      { name: 'children', type: 'ReactNode', default: 'required', description: 'Banner message.' },
      { name: 'actions', type: 'ReactNode', default: 'undefined', description: 'Optional response actions.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab', action: 'Moves to banner actions.' }],
    aria: [
      { name: 'role="alert"', description: 'Used for warning and error banners.' },
      { name: 'role="status"', description: 'Used for non-critical banners.' },
    ],
    doDonts: [
      { do: 'Use for persistent, contextual information.', dont: 'Use banners for transient success feedback better suited to snackbars.' },
    ],
  },
  breadcrumbs: {
    status: 'stable',
    description: 'Breadcrumbs show the current page location inside a hierarchy.',
    props: [
      { name: 'items', type: 'BreadcrumbItem[]', default: 'required', description: 'Hierarchy links.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab', action: 'Moves through breadcrumb links.' }],
    aria: [
      { name: 'aria-label="Breadcrumb"', description: 'Names the navigation landmark.' },
      { name: 'aria-current="page"', description: 'Marks the current location.' },
    ],
    doDonts: [
      { do: 'Use for deep hierarchies.', dont: 'Use breadcrumbs as the only navigation system.' },
    ],
  },
  stepper: {
    status: 'beta',
    description: 'Steppers show progress through a multi-step workflow.',
    props: [
      { name: 'steps', type: 'StepperStep[]', default: 'required', description: 'Step labels and optional metadata.' },
      { name: 'current', type: 'number', default: '0', description: 'Current step index.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab', action: 'Moves through interactive step controls when enabled.' }],
    aria: [{ name: 'aria-current="step"', description: 'Recommended for the active step.' }],
    doDonts: [
      { do: 'Use for linear workflows with clear progress.', dont: 'Use for arbitrary navigation.' },
    ],
  },
  pagination: {
    status: 'stable',
    description: 'Pagination moves through discrete pages of content.',
    props: [
      { name: 'page', type: 'number', default: 'required', description: 'Current page.' },
      { name: 'count', type: 'number', default: 'required', description: 'Total page count.' },
      { name: 'onChange', type: '(page: number) => void', default: 'required', description: 'Called when the page changes.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab + Enter/Space', action: 'Focuses and activates page controls.' }],
    aria: [
      { name: 'aria-label="Pagination"', description: 'Names the pagination nav.' },
      { name: 'aria-current="page"', description: 'Marks the current page.' },
    ],
    doDonts: [
      { do: 'Use when users need stable page positions.', dont: 'Use pagination for tiny result sets.' },
    ],
  },
  skeleton: {
    status: 'stable',
    description: 'Skeletons reserve layout space while content is loading.',
    props: [
      { name: 'variant', type: "'text' | 'rect' | 'circle'", default: "'text'", description: 'Placeholder shape.' },
      { name: 'width / height', type: 'number | string', default: 'undefined', description: 'Placeholder dimensions.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [],
    aria: [{ name: 'aria-hidden="true"', description: 'Skeletons are decorative loading placeholders.' }],
    doDonts: [
      { do: 'Match skeleton shape to the final content.', dont: 'Show skeletons indefinitely without loading state messaging.' },
    ],
  },
  'empty-state': {
    status: 'stable',
    description: 'Empty states explain why content is missing and offer a useful next action.',
    props: [
      { name: 'title', type: 'ReactNode', default: 'required', description: 'Primary empty-state message.' },
      { name: 'description', type: 'ReactNode', default: 'undefined', description: 'Supporting context.' },
      { name: 'action', type: 'ReactNode', default: 'undefined', description: 'Optional next action.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab', action: 'Focuses the action when present.' }],
    aria: [{ name: 'role="status"', description: 'Politely announces the empty state.' }],
    doDonts: [
      { do: 'Give users a clear next step.', dont: 'Blame the user or leave the surface blank.' },
    ],
  },
  'data-table': {
    status: 'stable',
    description: 'Data tables present structured rows with sorting and optional selection.',
    props: [
      { name: 'columns', type: 'DataTableColumn<T>[]', default: 'required', description: 'Column definitions and cell renderers.' },
      { name: 'rows', type: 'T[]', default: 'required', description: 'Table data.' },
      { name: 'sort', type: '{ columnId: string; direction: SortDirection } | null', default: 'internal', description: 'Controlled sort state.' },
      { name: 'selected', type: 'Set<string | number>', default: 'undefined', description: 'Selected row keys.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab + Enter/Space', action: 'Focuses sort buttons and row checkboxes.' }],
    aria: [
      { name: 'aria-sort', description: 'Reflects column sort direction.' },
      { name: 'aria-selected', description: 'Marks selected rows.' },
    ],
    doDonts: [
      { do: 'Use for comparable structured data.', dont: 'Use tables for card-like editorial content.' },
    ],
  },
  timeline: {
    status: 'stable',
    description: 'Timelines show ordered events or milestones.',
    props: [
      { name: 'items', type: 'TimelineItem[]', default: 'required', description: 'Events with labels, metadata, and tone.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [],
    aria: [{ name: 'list semantics', description: 'Use surrounding labels for event groups when needed.' }],
    doDonts: [
      { do: 'Use for chronological or process history.', dont: 'Use timelines for unrelated cards.' },
    ],
  },
  accordion: {
    status: 'stable',
    description: 'Accordions expand and collapse sections of related content.',
    props: [
      { name: 'items', type: 'AccordionItem[]', default: 'required', description: 'Expandable sections.' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows more than one section open.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Enter / Space', action: 'Toggles the focused section header.' }],
    aria: [
      { name: 'aria-expanded', description: 'Reflects whether a section is open.' },
      { name: 'aria-controls', description: 'Connects header buttons to panels.' },
    ],
    doDonts: [
      { do: 'Use for scannable optional details.', dont: 'Hide primary task content inside accordions by default.' },
    ],
  },
  tree: {
    status: 'stable',
    description: 'Trees display nested hierarchical data with expandable branches.',
    props: [
      { name: 'nodes', type: 'TreeNode[]', default: 'required', description: 'Hierarchical nodes.' },
      { name: 'selectedId', type: 'string', default: 'undefined', description: 'Selected node id.' },
      { name: 'onSelect', type: '(node: TreeNode) => void', default: 'undefined', description: 'Called when a node is selected.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [
      { key: 'Arrow Left / Arrow Right', action: 'Collapses or expands branches.' },
      { key: 'Enter / Space', action: 'Selects the focused node.' },
    ],
    aria: [
      { name: 'role="tree"', description: 'Identifies hierarchical navigation.' },
      { name: 'role="treeitem"', description: 'Applied to nodes.' },
    ],
    doDonts: [
      { do: 'Use for real hierarchy.', dont: 'Use a tree for flat menus.' },
    ],
  },
  list: {
    status: 'stable',
    description: 'Lists arrange related rows of text, icons, and actions.',
    props: [
      { name: 'children', type: 'ReactNode', default: 'required', description: 'List items.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab', action: 'Moves through interactive controls inside list items.' }],
    aria: [
      { name: 'role="list"', description: 'Applied to the list container.' },
      { name: 'role="listitem"', description: 'Applied to each row.' },
    ],
    doDonts: [
      { do: 'Use lists for repeated homogeneous content.', dont: 'Use lists where tabular comparison is the main task.' },
    ],
  },
  divider: {
    status: 'stable',
    description: 'Dividers separate content groups with a low-emphasis line.',
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Divider direction.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [],
    aria: [{ name: 'role="separator"', description: 'Identifies the visual separation.' }],
    doDonts: [
      { do: 'Use sparingly to clarify grouping.', dont: 'Use dividers as decoration between every element.' },
    ],
  },
  carousel: {
    status: 'beta',
    description: 'Carousels browse a horizontal set of visual items.',
    props: [
      { name: 'items', type: 'ReactNode[]', default: 'required', description: 'Slides or cards to browse.' },
      { name: 'variant', type: 'string', default: 'default', description: 'Carousel layout treatment.' },
      COMMON_CLASS_PROP,
    ],
    keyboard: [{ key: 'Tab + button activation', action: 'Moves through carousel controls when present.' }],
    aria: [{ name: 'role="region"', description: 'Names the carousel browsing area.' }],
    doDonts: [
      { do: 'Use for visual browsing where adjacent items matter.', dont: 'Hide critical content off-screen in a carousel.' },
    ],
  },
  'force-directed-graph': {
    status: 'beta',
    description: 'A network graph layout using D3 velocity Verlet force simulation. Visualizes interconnected nodes, communities/clusters, link weights, and supports drag physics, multi-level zooming, and group filtering.',

    props: [
      { name: 'nodes', type: 'NetworkNode[]', default: 'required', description: 'Array of node objects ({ id, label, group, val, ... }).' },
      { name: 'links', type: 'NetworkLink[]', default: 'required', description: 'Array of link objects ({ source, target, value, ... }).' },
      { name: 'height', type: 'number', default: '480', description: 'Chart drawing height in pixels.' },
      { name: 'nodeRadius', type: 'number | ((node) => number)', default: '7', description: 'Radius of node circles in pixels.' },
      { name: 'linkDistance', type: 'number', default: '60', description: 'Target distance between linked nodes.' },
      { name: 'chargeStrength', type: 'number', default: '-140', description: 'Electrostatic repulsion strength (negative repels).' },
      { name: 'collideRadius', type: 'number', default: '4', description: 'Collision buffer radius around node circles.' },
      { name: 'showLabels', type: 'boolean', default: 'true', description: 'Whether to show node text labels.' },
      { name: 'showLegend', type: 'boolean', default: 'true', description: 'Whether to show group legend filter below the graph.' },
      { name: 'draggable', type: 'boolean', default: 'true', description: 'Enables dragging nodes with mouse/touch.' },
      { name: 'zoomable', type: 'boolean', default: 'true', description: 'Enables zooming and panning using mouse wheel/drag.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables node hover highlighting and tooltips.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Optional main title above chart.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Optional secondary subtitle text.' },
      { name: 'onNodeClick', type: '(node: NetworkNode) => void', default: 'undefined', description: 'Callback when a node circle is clicked.' },
    ],
    keyboard: [
      { key: 'Mouse Drag Node', action: 'Repositions a node in the physical simulation space.' },
      { key: 'Scroll Wheel', action: 'Zooms in or out of the network diagram.' },
      { key: 'Double Click', action: 'Resets the zoom scale and pan translation.' },
    ],
    aria: [
      { name: 'data-md3-component="force-directed-graph"', description: 'Identifies the root element as a force-directed network graph.' },
    ],
    doDonts: [
      { do: 'Group related nodes with color codes to reveal community clusters.', dont: 'Overcrowd the graph with hundreds of unclustered nodes without charge tuning.' },
      { do: 'Provide a legend for interactive filtering when graph contains multiple groups.', dont: 'Disable drag or zoom on complex graphs with high node density.' },
    ],
    playgroundControls: [
      { name: 'showLabels', label: 'Show Labels', type: 'boolean', defaultValue: true },
      { name: 'showLegend', label: 'Show Legend', type: 'boolean', defaultValue: true },
      { name: 'draggable', label: 'Draggable Nodes', type: 'boolean', defaultValue: true },
      { name: 'zoomable', label: 'Zoom & Pan', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip', type: 'boolean', defaultValue: true },
    ],
  },
  'disjoint-force-directed-graph': {
    status: 'beta',
    description: 'A force-directed graph layout optimized for disjoint networks containing unconnected subgraphs, isolated pairs, and star components. Uses radial forces rather than a single center gravity to prevent overlapping.',
    props: [
      { name: 'nodes', type: 'NetworkNode[]', default: 'required', description: 'Array of node objects ({ id, label, group, val, ... }).' },
      { name: 'links', type: 'NetworkLink[]', default: 'required', description: 'Array of link objects ({ source, target, value, ... }).' },
      { name: 'height', type: 'number', default: '520', description: 'Chart drawing height in pixels.' },
      { name: 'nodeRadius', type: 'number | ((node) => number)', default: '6', description: 'Radius of node circles in pixels.' },
      { name: 'linkDistance', type: 'number', default: '35', description: 'Target distance between linked nodes.' },
      { name: 'chargeStrength', type: 'number', default: '-35', description: 'Electrostatic repulsion strength.' },
      { name: 'centerStrength', type: 'number', default: '0.018', description: 'Radial gravity strength pulling nodes towards canvas center.' },
      { name: 'collideRadius', type: 'number', default: '3', description: 'Collision buffer radius around node circles.' },
      { name: 'showLabels', type: 'boolean', default: 'false', description: 'Whether to show node text labels.' },
      { name: 'showLegend', type: 'boolean', default: 'true', description: 'Whether to show group legend filter below the graph.' },
      { name: 'draggable', type: 'boolean', default: 'true', description: 'Enables dragging nodes with mouse/touch.' },
      { name: 'zoomable', type: 'boolean', default: 'true', description: 'Enables zooming and panning using mouse wheel/drag.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables node hover highlighting and tooltips.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Optional main title above chart.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Optional secondary subtitle text.' },
      { name: 'onNodeClick', type: '(node: NetworkNode) => void', default: 'undefined', description: 'Callback when a node circle is clicked.' },
    ],
    keyboard: [
      { key: 'Mouse Drag Node', action: 'Repositions a node in the physical simulation space.' },
      { key: 'Scroll Wheel', action: 'Zooms in or out of the network diagram.' },
      { key: 'Double Click', action: 'Resets the zoom scale and pan translation.' },
    ],
    aria: [
      { name: 'data-md3-component="disjoint-force-directed-graph"', description: 'Identifies the root element as a disjoint force-directed network graph.' },
    ],
    doDonts: [
      { do: 'Use for sparse networks with multiple disconnected sub-graphs or isolated node pairs.', dont: 'Use strong single-point center gravity which causes disjoint clusters to overlap.' },
    ],
    playgroundControls: [
      { name: 'showLabels', label: 'Show Labels', type: 'boolean', defaultValue: false },
      { name: 'showLegend', label: 'Show Legend', type: 'boolean', defaultValue: true },
      { name: 'draggable', label: 'Draggable Nodes', type: 'boolean', defaultValue: true },
      { name: 'zoomable', label: 'Zoom & Pan', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip', type: 'boolean', defaultValue: true },
    ],
  },
  'mobile-patent-suits': {
    status: 'beta',
    description: 'A directed force-directed graph with curved arc paths and arrowhead markers representing relationships (e.g., patent lawsuits, licensing, settlements) between mobile technology companies.',
    props: [
      { name: 'nodes', type: 'NetworkNode[]', default: 'required', description: 'Array of company node objects.' },
      { name: 'links', type: 'DirectedLink[]', default: 'required', description: 'Array of directed link objects with type attribute (suit, licensing, resolved).' },
      { name: 'height', type: 'number', default: '540', description: 'Chart drawing height in pixels.' },
      { name: 'nodeRadius', type: 'number | ((node) => number)', default: '5', description: 'Radius of node circles in pixels.' },
      { name: 'linkDistance', type: 'number', default: '90', description: 'Target distance between linked nodes.' },
      { name: 'chargeStrength', type: 'number', default: '-300', description: 'Electrostatic repulsion strength.' },
      { name: 'collideRadius', type: 'number', default: '6', description: 'Collision buffer radius around node circles.' },
      { name: 'showLabels', type: 'boolean', default: 'true', description: 'Whether to show node text labels.' },
      { name: 'showLegend', type: 'boolean', default: 'true', description: 'Whether to show link types legend below graph.' },
      { name: 'draggable', type: 'boolean', default: 'true', description: 'Enables dragging nodes.' },
      { name: 'zoomable', type: 'boolean', default: 'true', description: 'Enables zooming and panning.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Enables node hover highlighting and tooltips.' },
      { name: 'title', type: 'string', default: 'undefined', description: 'Optional title text.' },
      { name: 'subtitle', type: 'string', default: 'undefined', description: 'Optional secondary description text.' },
    ],
    keyboard: [
      { key: 'Mouse Drag Node', action: 'Repositions a node in the physical simulation space.' },
      { key: 'Scroll Wheel', action: 'Zooms in or out of the network diagram.' },
      { key: 'Double Click', action: 'Resets the zoom scale and pan translation.' },
    ],
    aria: [
      { name: 'data-md3-component="directed-force-graph"', description: 'Identifies the root element as a directed force-directed graph.' },
    ],
    doDonts: [
      { do: 'Use curved arc links to prevent overlapping when bidirectional links exist between nodes.', dont: 'Use straight lines for bidirectional directed relationships.' },
    ],
    playgroundControls: [
      { name: 'showLabels', label: 'Show Labels', type: 'boolean', defaultValue: true },
      { name: 'showLegend', label: 'Show Legend', type: 'boolean', defaultValue: true },
      { name: 'draggable', label: 'Draggable Nodes', type: 'boolean', defaultValue: true },
      { name: 'zoomable', label: 'Zoom & Pan', type: 'boolean', defaultValue: true },
      { name: 'interactive', label: 'Hover Tooltip', type: 'boolean', defaultValue: true },
    ],
  },
};




// Fill in remaining components with per-component blueprints. Unknown ids are marked
// experimental so placeholder coverage cannot masquerade as complete documentation.
export const getComponentMetadata = (id: string): ComponentMetadata => {
  const existing = COMPONENTS_REGISTRY[id];
  if (existing) return existing;

  // Pretty title from camelCase or kebab-case
  const label = id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const blueprint = COMPONENT_DOC_BLUEPRINTS[id];
  if (blueprint) {
    return {
      id,
      label,
      ...blueprint,
    };
  }

  return {
    id,
    label,
    status: 'experimental',
    description: `${label} is available in the package, but its full API, accessibility, and usage documentation still needs a dedicated review.`,
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

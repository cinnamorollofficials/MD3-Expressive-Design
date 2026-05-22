// Side-effect-only entry that imports every stylesheet needed for the
// component library to render correctly: design tokens, all built-in
// themes, typography, and global resets. Consumers get the whole set with
// `import '@hadi_gunawan/md3-expressive-ds/style.css'` after the lib build
// bundles these into a single CSS file.

import '../styles/reset.css';
import '../styles/tokens/_base.css';
import '../styles/tokens/light-purple.css';
import '../styles/tokens/dark-purple.css';
import '../styles/tokens/light-ocean.css';
import '../styles/tokens/dark-ocean.css';
import '../styles/tokens/light-forest.css';
import '../styles/tokens/dark-forest.css';
import '../styles/typography.css';
import '../styles/global.css';

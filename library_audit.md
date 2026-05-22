# Audit Source Code — `@hadi_gunawan/md3-expressive-ds`

> Temuan dari sesi debugging border visibility di halaman login.

---

## 🔴 Bug Kritis

### 1. Token CSS tidak punya fallback di `:root`

**File:** `src/styles/tokens/light-purple.css` (dan semua file theme lainnya)

**Masalah:** Semua token warna (`--md-sys-color-*`) hanya didefinisikan di dalam selector `[data-theme='purple'][data-mode='light']`. Tidak ada nilai fallback di `:root`.

```css
/* ❌ Sekarang — token hanya aktif kalau <html> punya data-theme & data-mode */
[data-theme='purple'][data-mode='light'] {
  --md-sys-color-outline: #79747e;
  --md-sys-color-on-surface-variant: #49454f;
  /* ... */
}
```

**Akibat:** Jika `useTheme()` belum dipanggil (atau belum mount), semua `var(--md-sys-color-*)` resolve ke `undefined` → border, warna teks, background **semua invisible/transparent**.

**Fix:** Tambahkan default Purple Light di `:root` sebagai fallback:

```css
/* ✅ Fix — fallback di :root */
:root {
  --md-sys-color-outline: #79747e;
  --md-sys-color-on-surface-variant: #49454f;
  /* semua token dengan nilai default purple-light */
}

[data-theme='purple'][data-mode='light'] {
  /* sama seperti :root, tapi bisa di-override */
}
```

---

### 2. `useTheme` hanya apply token di dalam `useEffect` (async)

**File:** `src/lib/hooks/useTheme.ts`

**Masalah:** `apply()` dipanggil di dalam `useEffect` → dieksekusi **setelah** React render pertama selesai. Selama render pertama, `<html>` belum punya `data-theme` dan `data-mode`.

```ts
// ❌ Sekarang — apply() dipanggil setelah render (useEffect)
export function useTheme() {
  const [state, setState] = useState(read);
  useEffect(() => {
    apply(state); // ← terlambat, render sudah terjadi
  }, [state]);
}
```

**Akibat:** Flash of Unstyled Content (FOUC) — komponen render tanpa warna/border sebentar lalu "muncul" setelah useEffect jalan.

**Fix yang sudah diterapkan (v0.2.0):** `apply(read())` dipanggil synchronously saat module diimport:
```ts
// ✅ Fix — apply synchronously sebelum React render
apply(read());

export function useTheme() { ... }
```

> ⚠️ Fix ini baru ada di `src/`, tapi **akar masalahnya** ada di Token Architecture (Bug #1 di atas). Fix yang paling benar adalah kombinasi keduanya.

---

### 3. `TextField` default width `240px` (fixed, tidak responsive)

**File:** `src/lib/components/TextField/TextField.module.css`

```css
/* ❌ Sebelumnya — fixed width, tidak mengisi container */
.root {
  width: 240px;
}
```

**Akibat:** TextField tidak mengisi lebar form/container secara otomatis. Consumer harus selalu pass `style={{ width: '100%' }}` atau override CSS.

**Fix yang sudah diterapkan:**
```css
/* ✅ Fix */
.root {
  width: 100%;
}
```

---

### 4. `Button` tidak punya `border: none` di base style

**File:** `src/lib/components/Button/Button.module.css`

```css
/* ❌ Sebelumnya — browser default border bisa muncul di beberapa browser */
.btn {
  /* tidak ada border: none */
}
```

**Akibat:** Di beberapa browser/OS, button HTML element punya default border yang muncul di variant `filled` dan `tonal`.

**Fix yang sudah diterapkan:**
```css
/* ✅ Fix */
.btn {
  border: none;
}
```

---

### 5. `TextField` outlined — floated label background hardcoded ke `surface`

**File:** `src/lib/components/TextField/TextField.module.css`

```css
/* ❌ Sebelumnya — hardcoded, tidak cocok dengan semua background */
.outlined .label.floated {
  background: var(--md-sys-color-surface);
}
```

**Akibat:** Kalau TextField dirender di atas background bukan `surface` (mis. `surface-container-lowest` di login page), label yang float ke atas akan punya background yang salah warna → tampak "kotak putih" di atas border.

**Fix yang sudah diterapkan:**
```css
/* ✅ Fix — cascadeable via CSS custom property */
.outlined .label.floated {
  background: var(--md-tf-surface,
    var(--md-sys-color-surface-container-lowest,
    var(--md-sys-color-surface)));
}
```

> Consumer bisa override: `--md-tf-surface: var(--md-sys-color-surface-container-highest)`

---

## 🟡 Issues Design/DX (Developer Experience)

### 6. Border `outlined` terlalu tipis dan warna kurang kontras

**File:** `TextField.module.css`, `Button.module.css`

```css
/* ❌ Sebelumnya — 1px & outline color terlalu subtle */
.outlined { border: 1px solid var(--md-sys-color-outline); }
```

`--md-sys-color-outline` di tema terang bernilai sekitar `#79747e` — cukup terang untuk background putih tapi jika ada gangguan sedikit (background agak berwarna, monitor brightness rendah) jadi sulit terlihat.

**Fix yang sudah diterapkan:**
```css
/* ✅ Fix — 1.5px & warna lebih gelap */
.outlined { border: 1.5px solid var(--md-sys-color-on-surface-variant); }
.outlined:hover { border-color: var(--md-sys-color-on-surface); }
```

---

### 7. `useTheme` dipanggil ulang di setiap consumer (tidak ada context/provider)

**File:** `src/lib/hooks/useTheme.ts`

**Masalah:** Tidak ada `ThemeContext`. Setiap komponen yang memanggil `useTheme()` membuat state terpisah dan masing-masing menulis ke localStorage. Ini tidak menyebabkan bug (localStorage sama), tapi:
- State tidak sync antar komponen via React — bergantung pada localStorage
- `apply()` dipanggil berkali-kali untuk hal yang sama
- Tidak bisa pass theme via props (no context = no SSR-safe injection)

**Rekomendasi Fix:**
```tsx
// Buat ThemeContext + ThemeProvider
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeState(); // internal
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
```

---

### 8. Peer dependency React versi library vs consumer tidak di-dedupe saat `npm link`

**Akar masalah saat debugging:**

Library punya `node_modules/react` sendiri (`^18`) sementara project consumer pakai React `^19`. Saat `npm link`, ini menghasilkan **dual React instance** → crash: `Cannot read properties of undefined (reading 'map')`.

**Fix sisi library:** Pastikan `react` dan `react-dom` **hanya** di `peerDependencies`, **tidak** di `dependencies`. ✅ Sudah benar di `package.json`.

**Masalah sesungguhnya:** Library menggunakan `devDependencies.react: ^18` sementara consumer pakai `^19`. Saat `npm link`, npm membuat symlink dan library membawa `node_modules/react@18`-nya sendiri.

**Fix di `package.json` library:**
```json
{
  "peerDependencies": {
    "react": "^18.3.1 || ^19.0.0"   ✅ sudah benar
  },
  "devDependencies": {
    "react": "^19.0.0"   ← update ini agar matching dengan consumer
  }
}
```

**Fix sisi consumer (sementara):** Alias di `vite.config.ts` ✅ sudah diterapkan.

---

## 🟢 Yang Sudah Benar

| Aspek | Status |
|---|---|
| CSS Module scoping (class name hashing) | ✅ |
| Motion/easing tokens di `:root` | ✅ |
| Shape tokens di `:root` | ✅ |
| `border: none` di Button base | ✅ Sudah difix |
| TextField width `100%` | ✅ Sudah difix |
| Sync theme init | ✅ Sudah difix |
| Hover state pada outlined border | ✅ Sudah difix |

---

## 📋 Prioritas Perbaikan

| # | Issue | Prioritas | Effort |
|---|---|---|---|
| 1 | Token fallback di `:root` | 🔴 Kritis | Rendah |
| 7 | ThemeContext / ThemeProvider | 🟡 Penting | Sedang |
| 8 | DevDep react `^19` | 🟡 Penting | Sangat Rendah |
| 2 | FOUC (sudah di-workaround) | 🟡 Penting | Rendah |
| 3-6 | CSS fixes | ✅ Done | — |

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*?raw' {
  const source: string;
  export default source;
}

declare module '*.geojson' {
  const geojson: Record<string, unknown>;
  export default geojson;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SNIPCART_API_KEY: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

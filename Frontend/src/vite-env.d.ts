/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
  // voeg hier andere environment variables toe
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}



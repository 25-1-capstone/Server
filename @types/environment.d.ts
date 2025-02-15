declare namespace NodeJS {
  export interface ProcessEnv extends NodeJS.ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
  }
}

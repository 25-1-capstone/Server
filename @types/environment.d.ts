declare namespace NodeJS {
  export interface ProcessEnv extends NodeJS.ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    PASSPORT_KAKAO_CLIENT_ID: string;
    PASSPORT_KAKAO_CLIENT_SECRET: string;
    EXPRESS_SESSION_SECRET: string;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WEBSOCKET_PORT: number | undefined;
    }
  }
}

export {};

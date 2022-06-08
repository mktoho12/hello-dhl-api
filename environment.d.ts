declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DHL_API_AUTH_USERNAME: string
      DHL_API_AUTH_PASSWORD: string
    }
  }
}

export {}

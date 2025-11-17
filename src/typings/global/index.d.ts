declare module '*.less' {
  const value: {
    [key: string]: string
  }
  export = value
}

declare module '*.png'

declare module '*.svg'

// 환경 변수 타입 정의
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VERSION_HASH: string
      CLASS_PREFIX: string
      VERSION: string
    }
  }
}

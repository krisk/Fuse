declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string
    EXTENDED_SEARCH_ENABLED?: string | boolean
    LOGICAL_SEARCH_ENABLED?: string | boolean
  }
}

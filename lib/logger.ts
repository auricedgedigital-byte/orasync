// Simple logger utility
export function createLogger(namespace: string) {
  return {
    info: (...args: unknown[]) => {
      console.log(`[${namespace}]`, ...args)
    },
    error: (...args: unknown[]) => {
      console.error(`[${namespace}]`, ...args)
    },
    warn: (...args: unknown[]) => {
      console.warn(`[${namespace}]`, ...args)
    },
    debug: (...args: unknown[]) => {
      if (process.env.DEBUG) {
        console.debug(`[${namespace}]`, ...args)
      }
    },
  }
}

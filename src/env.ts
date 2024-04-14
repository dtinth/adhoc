export interface Env {
  BASIC_AUTH_PASSWORD: string
}

export const envMap = new WeakMap<Request, Env>()

export function getEnv(request: Request): Env {
  const env = envMap.get(request)
  if (!env) throw new Error('Unable to get environment for request')
  return env
}

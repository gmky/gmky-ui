import { joinURL } from "ufo";

export default defineEventHandler(async (event) => {
    const cookies = await parseCookies(event)

    const token = cookies['auth.token']

    const runtimeConfig = useRuntimeConfig()
    const baseURL = runtimeConfig.baseURL
    
    const path = event.path.replace(/^\/api\//, '')
    const target = joinURL(baseURL, path)
    
    if (!token) return proxyRequest(event, target);

    return proxyRequest(event, target, { headers: { Authorization: `Bearer ${token}`}})
})
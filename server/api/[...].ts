import { joinURL } from "ufo";

export default defineEventHandler(async (event) => {
    const cookies = await parseCookies(event)

    const token = cookies['auth.token']

    const runtimeConfig = useRuntimeConfig()
    const apiBaseURL = runtimeConfig.public.apiBaseUrl
    const path = event.path.replace(/^\/api\//, '')
    const target = joinURL(apiBaseURL, path)

    console.log(apiBaseURL)

    if (!token) return proxyRequest(event, target);

    return proxyRequest(event, target, { headers: { Authorization: `Bearer ${token}` } })
})
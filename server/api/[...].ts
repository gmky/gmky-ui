import { joinURL } from "ufo";

export default defineEventHandler(async (event) => {
    const cookies = await parseCookies(event)

    const token = cookies['auth.token']

    const runtimeConfig = useRuntimeConfig()
    const baseURL = runtimeConfig.baseURL

    const path = event.path.replace(/^\/api\//, '')
    const target = joinURL(baseURL, path)

    if (!token) return proxyRequest(event, target);

    const response = await proxyRequest(event, target, { headers: { Authorization: `Bearer ${token}`}})

    if (response.status == '401') {
        window.location.href = '/admin/login'
        return;
    }

    return response;
})
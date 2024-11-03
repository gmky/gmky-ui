export default {
    getUserStatus() {
        return useFetch<string[]>('/api/client-api/v1/metadata/user-status', { default: () => [], server: false })
    }
}
const _addToast = (error, okTitle, eTitle, okMsg = null, eMsg = null) => {
    const { $toast } = useNuxtApp()
    return $toast(error, okTitle, eTitle, okMsg = null, eMsg = null)
}

export const addToast = createSharedComposable(_addToast)
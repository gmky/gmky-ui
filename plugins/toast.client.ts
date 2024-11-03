export default defineNuxtPlugin((nuxtApp) => {
  const gToast = useToast()
  return {
    provide: {
      toast: (error: any, okTitle, eTitle, okMsg = null, eMsg = null) => {
        if (error) {
          gToast.add({
            color: 'red',
            title: eTitle,
            description: eMsg
          })
        } else {
          gToast.add({
            color: 'green',
            title: okTitle,
            description: okMsg
          })
        }
      }
    }
  }
})
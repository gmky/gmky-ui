export default {
  toastError: (toast, title, message) => {
    toast.add({
      color: 'red',
      title: title,
      description: message
    })
  },
  toastOk: (toast, title, message) => {
    toast.add({
      color: 'green',
      title: title,
      description: message
    })
  },
  toastRes: (toast, error, okTitle, eTitle, okMsg = null, eMsg = null) => {
    if (error) {
      toast.add({
        color: 'red',
        title: eTitle,
        description: eMsg
      })
    } else {
      toast.add({
        color: 'green',
        title: okTitle,
        description: okMsg
      })
    }
  }
}
export default {
  defaultResponse: () => {
    return {
      data: [],
      meta: {
          page: 0,
          total: 0,
          size: 20
      }
    }
  },
  nextPageLink: (page: number) => {
    return {
      query: {
        page
      }
    }
  }
}
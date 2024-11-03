export default eventHandler(async (event) => {
    const authorization = getRequestHeader(event, 'Authorization');
    const data = await $fetch('http://localhost:8080/client-api/v1/profile', { method: 'GET', headers: { Authorization: authorization} } );
    return data;
  })
  
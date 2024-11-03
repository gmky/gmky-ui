import type { User, UserStatus } from '~/types'

export default eventHandler(async (event) => {
  const { statuses } = await readBody(event);
  const data : User[] = await $fetch('http://localhost:8080/client-api/v1/users/filter', { method: 'POST', body: { statuses } });
  return data;
})

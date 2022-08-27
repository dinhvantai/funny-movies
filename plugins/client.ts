export default async function (context: any) {
  try {
    const res = await context.$axios.get('me')
    await context.store.dispatch('profile/doSetUser', res.data.user)
  } catch (e) {
    await context.store.dispatch('profile/doSetUser', {})
  }
}

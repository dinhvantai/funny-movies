import TokenService from '~/services/TokenService'

export default function ({ $axios }) {
  $axios.onRequest(() => {
    $axios.setToken(TokenService.getToken())
  })
}

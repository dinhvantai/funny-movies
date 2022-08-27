import TokenService from '~/services/TokenService'

export default function ({ $axios }: any) {
  $axios.onRequest(() => {
    $axios.setToken(TokenService.getToken())
  })
}

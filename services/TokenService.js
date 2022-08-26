import Cookies from 'js-cookie'

const key = 'token_key'

class TokenService {
  saveToken (token) {
    Cookies.set(key, token)
  }

  getToken () {
    return Cookies.get(key)
  }
}

export default new TokenService()

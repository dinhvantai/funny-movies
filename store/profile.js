const SET_USER = 'SET_USER'

export const state = {
  user: {},
}

export const mutations = {
  [SET_USER] (state, user = {}) {
    state.user = user
  },
}

export const actions = {
  async doFetchRoleInfo ({
    commit,
    state,
  }, params = {}) {
    // try {
    //   let {data} = await axios.get(config.apiEndPoints.API_ROLE_INFO, {params});
    //   commit(SET_ROLE_INFO, data)
    // } catch (e) {
    // }
  },
}

export const getters = {
  getUser: state => state.user,
  getAuthInfo: state => state,
}

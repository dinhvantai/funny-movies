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
  doSetUser ({
    commit,
  }, user = {}) {
    commit(SET_USER, user)
  },
}

export const getters = {
  getUser: state => state.user,
}

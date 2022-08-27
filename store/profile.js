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
  async doSetUser ({
    commit,
  }, user = {}) {
    commit(SET_USER, user)
    if (!user || !user.id) {
      await this.dispatch('sharedMovies/doSetPagination', { isPrivate: false })
    }
  },
}

export const getters = {
  getUser: state => state.user || {},
}

const SET_DATA = 'SET_DATA'

export const state = {
  snackbar: {
    timeout: 8000,
    color: 'success',
    value: false,
    content: '',
  },
}

export const mutations = {
  [SET_DATA] (state, snackbar = {}) {
    state.snackbar = {
      ...state.snackbar,
      color: 'success',
      ...snackbar,
    }
  },
}

export const actions = {
  doSetSnackbar ({ commit }, snackbar = {}) {
    commit(SET_DATA, snackbar)
  },
}

export const getters = {
  getSnackbar: state => state.snackbar,
}

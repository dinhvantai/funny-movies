const SET_DATA = 'SET_DATA'
const SET_PAGINATION = 'SET_PAGINATION'

export const state = {
  movies: [],
  pagination: {
    page: 1,
    total: 0,
    perPage: 10,
    isPrivate: false,
  },
}

export const mutations = {
  [SET_DATA] (state, movies = []) {
    state.movies = movies
  },
  [SET_PAGINATION] (state, pagination = {}) {
    state.pagination = {
      ...state.pagination,
      ...pagination,
    }
  },
}

export const actions = {
  doSetMovies ({ commit }, movies = []) {
    commit(SET_DATA, movies)
  },

  doSetPagination ({ commit }, pagination = {}) {
    commit(SET_PAGINATION, pagination)
  },

  async doFetchMovies ({
    state,
    commit,
  }) {
    try {
      const res = await this.$axios.get('movies', { params: state.pagination })
      commit(SET_DATA, res.data.movies || [])
      commit(SET_PAGINATION, res.data.meta)
    } catch (e) {
    }
  },
}

export const getters = {
  getMovies: state => state.movies,
  getPagination: state => state.pagination,
}

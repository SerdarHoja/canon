import { fetchCatalog as fetchCatalogFromServer } from '@/api'
import { STATES } from '../consts'
import { STORE_CHUNK_STATES_ACTION_TYPES, storeChunkName } from './consts'

const { SET_ERROR_STATE, SET_LOADED_STATE, SET_LOADING_STATE } = STORE_CHUNK_STATES_ACTION_TYPES

const setLoadingState = () => ({
  type: SET_LOADING_STATE
})

const setLoadedState = catalog => ({
  type: SET_LOADED_STATE,
  payload: {
    catalog
  }
})

const setErrorState = ({ message }) => ({
  type: SET_ERROR_STATE,
  payload: {
    message
  }
})

export const fetchCatalog = (region, lang) => (dispatch, getState) => {
  const {
    [storeChunkName]: { state }
  } = getState()

  if (state !== STATES.LOADING) {
    dispatch(setLoadingState())
    fetchCatalogFromServer(region, lang)
      .then((...args) => dispatch(setLoadedState.apply(null, [...args])))
      .catch((...args) => dispatch(setErrorState.apply(null, ...args)))
  }
}

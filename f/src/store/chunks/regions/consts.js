import { generateStoreChunkStatesActionTypes } from '../helpers'

export const storeChunkName = 'regions'

export const STORE_CHUNK_STATES_ACTION_TYPES = Object.freeze(generateStoreChunkStatesActionTypes(storeChunkName))

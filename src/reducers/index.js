import { combineReducers } from 'redux';
import { structure } from './sructure';

const appReducers = combineReducers({
  structure
});

const initialState = appReducers({}, {});

export const reducers = (state, action) => {
  state = appReducers(state, action) || initialState;
  return state;
};

export function createReducer(initialState, handlers) {
  return (state = initialState, action) =>
  handlers[action.type] ? handlers[action.type](state, action.payload) : state;
}
import { createReducer } from './index';
import { actions } from '../actions';


let initialState = {
  paragraphs: [],
  problems: [],
  chapters: [],
  books: []
};

export const structure = createReducer(initialState, {
  [actions.STRUCTURE]: (state, payload) => payload
});
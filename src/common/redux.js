import { createStore, combineReducers } from 'redux';

const errorMessage = (state = '', action) => {
  switch (action.type) {
    case '@ERROR':
      return action.payload;
    default:
      return state;
  }
};
const loggedIn = (state = false, action) => {
  switch (action.type) {
    case '@LOGOUT':
      return false;
    default:
      return state;
  }
};
const initiateStore = (initialState = {}) => {
  const rootReducer = combineReducers({ errorMessage, loggedIn });
  const store = createStore(rootReducer, initialState);
  return store;
};

export default initiateStore;

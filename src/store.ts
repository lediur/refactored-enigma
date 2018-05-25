import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';

// tslint:disable-next-line:no-any
const logger = (newStore: any) => (next: any) => (action: any) => {
  console.log('dispatching', JSON.stringify(action));
  const result = next(action);
  console.log('next state', JSON.stringify(newStore.getState()));
  return result;
};

const store = createStore(reducers, applyMiddleware(logger));
export type AppStore = typeof store;

export default store;

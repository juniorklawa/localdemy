import { createStore } from 'redux';
import { ICatalogState } from './modules/catalog/types';
import rootReducer from './modules/rootReducer';

export interface IState {
  catalog: ICatalogState;
}

const store = createStore(rootReducer);

export default store;

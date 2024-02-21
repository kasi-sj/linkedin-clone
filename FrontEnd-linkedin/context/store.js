import {createStore} from 'redux';
import myReducer from './reducers/index';

const store = createStore(myReducer);

export default store;
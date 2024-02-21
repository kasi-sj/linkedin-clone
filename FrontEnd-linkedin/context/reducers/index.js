import {combineReducers} from 'redux';
import searchReducer from './searchReducer';

const myReducer = combineReducers({
    search : searchReducer
})

export default myReducer;
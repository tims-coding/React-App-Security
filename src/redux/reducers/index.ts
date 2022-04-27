import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import { authentication } from './authentication.reducer';


const persistConfig = {
    key: "ui",
    storage,
    debug: false,
};

const rootReducer = combineReducers({
    authentication,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;

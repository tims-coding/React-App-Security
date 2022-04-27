import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import persistReducer from './reducers';
import { persistStore } from 'redux-persist';

const loggerMiddleware = createLogger();

export const store = createStore(
    persistReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

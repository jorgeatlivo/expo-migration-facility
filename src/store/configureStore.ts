import {combineReducers} from 'redux';
import shiftData from './reducers/shiftsReducer';
import claimData from './reducers/claimsReducer';
import configurationData from './reducers/configurationReducer';
import profileData from './reducers/profileReducer';
import professionalAgendaData from './reducers/professionalAgendaReducer';
import authData from './reducers/authenticationReducer';
import {configureStore} from '@reduxjs/toolkit';


const rootReducer = combineReducers({
  shiftData,
  claimData,
  configurationData,
  profileData,
  professionalAgendaData,
  authData
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
});

export type AppDispatch = typeof store.dispatch



export default store;

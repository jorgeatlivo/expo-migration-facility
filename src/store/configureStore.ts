import { combineReducers } from 'redux';

import { configureStore } from '@reduxjs/toolkit';

import authData from './reducers/authenticationReducer';
import claimData from './reducers/claimsReducer';
import configurationData from './reducers/configurationReducer';
import professionalAgendaData from './reducers/professionalAgendaReducer';
import profileData from './reducers/profileReducer';
import shiftData from './reducers/shiftsReducer';

const rootReducer = combineReducers({
  shiftData,
  claimData,
  configurationData,
  profileData,
  professionalAgendaData,
  authData,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;

export default store;

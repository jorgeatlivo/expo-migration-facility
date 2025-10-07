import { LivoContact } from "../../types";
import { LOAD_LIVO_CONTACT, LOAD_USER_ID, SET_APP_STATE, SET_LAST_ACTIVE_TIME } from "./actionTypes";

export const loadLivoContactAction = (livoContact: LivoContact) => ({
    payload: livoContact,
    type: LOAD_LIVO_CONTACT
});

export const setLastActiveTime = (lastActive: string) => ({
    type: SET_LAST_ACTIVE_TIME,
    payload: lastActive,
});

export const setAppState = (appState: string) => ({
    type: SET_APP_STATE,
    payload: appState,
});

export const loadUserId = (userId: string) => ({
    type: LOAD_USER_ID,
    payload: userId,
});
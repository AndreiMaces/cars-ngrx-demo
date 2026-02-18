import { ActionReducerMap, createReducer, on } from "@ngrx/store";
import { User } from "../../core/models/user";
import { AuthActions } from "../action-types";

export interface AuthState {
    user: User | null;
}

const AUTH_STORAGE_KEY = 'user';

function getInitialAuthState(): AuthState {
    try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
        if (!stored) return { user: null };
        const user = JSON.parse(stored) as User;
        return { user };
    } catch {
        return { user: null };
    }
}

export const initialAuthState: AuthState = {
    user: null
};

export const authReducer = createReducer(
    getInitialAuthState(),
    on(AuthActions.login, (state, action) => {
        return {
            user: action.user
        }
    }),
    on(AuthActions.logout, (state) => {
        return {
            user: null
        }
    })
);


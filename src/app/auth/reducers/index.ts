import { ActionReducerMap, createReducer, on } from "@ngrx/store";
import { User } from "../../core/models/user";
import { AuthActions } from "../action-types";

export interface AuthState {
    user: User | null;
}

export const initialAuthState: AuthState = {
    user: null
}


export const authReducer = createReducer(
    initialAuthState,
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


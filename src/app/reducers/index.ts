import { Action, ActionReducer, ActionReducerMap, createReducer, MetaReducer, on } from "@ngrx/store";
import { AuthState, authReducer } from "../auth/reducers";
import { isDevMode } from "@angular/core";
import { routerReducer, RouterState } from "@ngrx/router-store";
import type { EntityCache } from "@ngrx/data";

export interface AppState {
    auth: AuthState;
    router: RouterState;
    entityCache?: EntityCache;
}

export function loggingReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
    return (state: AppState | undefined, action: Action) => {
        console.log('state before: ', state);
        console.log('action', action);
        return reducer(state, action);
    }
}

export const reducers: ActionReducerMap<AppState> = {
    auth: authReducer,
    router: routerReducer,
};

export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [loggingReducer] : [];
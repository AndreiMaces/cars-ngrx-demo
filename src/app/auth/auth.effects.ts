import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthApi } from "../core/api/auth.api";
import { AuthActions } from "./action-types";
import { tap } from "rxjs";
import { Router } from "@angular/router";
import { inject } from "@angular/core";

export class AuthEffects {
    router = inject(Router);
    actions$ = inject(Actions);

    login$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.login),
        tap(action => {
            localStorage.setItem('user', JSON.stringify(action.user));
            this.router.navigate(['/cars']);
        })
    ), { dispatch: false });

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(action => {
            localStorage.removeItem('user');
            this.router.navigate(['/auth']);
        })
    ), { dispatch: false });

}
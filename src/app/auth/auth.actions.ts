import { createAction, props } from "@ngrx/store";
import { User } from "../core/models/user";



export const login = createAction('[Login Page] Login', props<{ user: User }>());

export const logout = createAction('[Navbar] Logout');
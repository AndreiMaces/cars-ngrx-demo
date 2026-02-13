import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';
import { AppState } from '../../../reducers';
import { AsyncPipe } from '@angular/common';
import { logout } from '../../../auth/auth.actions';
import { isLoggedIn, isLoggedOut } from '../../../auth/auth.selectors';
@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.isLoggedIn$ = this.store.pipe(
      select(isLoggedIn)
    )
    this.isLoggedOut$ = this.store.pipe(
      select(isLoggedOut)
    )
  }

  logout() {
    this.store.dispatch(logout());
  }
}

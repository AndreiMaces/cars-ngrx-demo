import { Component, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { AppState } from '../reducers';
import { login } from './auth.actions';
import { AuthApi } from '../core/api/auth.api';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  readonly loading = signal(false);
  readonly loginError = signal<string | null>(null);

  constructor(
    private store: Store<AppState>,
    private authApi: AuthApi
  ) { }

  onSubmit() {
    if (!this.loginForm.value.username || !this.loginForm.value.password) {
      return;
    }
    this.loginError.set(null);
    this.loading.set(true);
    this.authApi
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.loginError.set(null);
          this.store.dispatch(login({ user: response.user }));
        },
        error: (err) => {
          const msg = err?.error?.error ?? 'Invalid username or password. Please try again.';
          this.loginError.set(msg);
        },
      });
  }
}

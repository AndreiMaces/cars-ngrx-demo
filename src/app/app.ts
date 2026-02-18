import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Navbar } from "./shared/components/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('cars-ngrx');
  protected readonly navigating = signal(false);

  private readonly router = inject(Router);
  private subscription: Subscription | null = null;

  ngOnInit(): void {
    this.subscription = this.router.events
      .pipe(
        filter(
          (e): e is NavigationStart | NavigationEnd | NavigationError =>
            e instanceof NavigationStart || e instanceof NavigationEnd || e instanceof NavigationError
        )
      )
      .subscribe((e) => {
        this.navigating.set(e instanceof NavigationStart);
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

// route-history.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RouteHistoryService {
  private previousUrl: string = '';
  private currentUrl: string = '';

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        pairwise()
      )
      .subscribe(([prev, curr]: [NavigationEnd, NavigationEnd]) => {
        this.previousUrl = prev.urlAfterRedirects;
        this.currentUrl = curr.urlAfterRedirects;
      });
  }

  public getPreviousUrl(): string {
    return this.previousUrl;
  }
}

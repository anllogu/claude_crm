import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ]
})
export class LayoutComponent implements OnInit {
  isHandset$!: Observable<boolean>;
  currentPageTitle: string = 'Dashboard';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle(event.urlAfterRedirects);
      }
    });
  }

  updatePageTitle(url: string): void {
    if (url.includes('/dashboard')) {
      this.currentPageTitle = 'Dashboard';
    } else if (url.includes('/contacts')) {
      this.currentPageTitle = 'Contactos';
    } else if (url.includes('/opportunities')) {
      this.currentPageTitle = 'Oportunidades';
    }
  }

  getCurrentPageTitle(): string {
    return this.currentPageTitle;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

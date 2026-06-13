import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastService } from '../toast.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastSvc: ToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.authService.currentUserValue;
    const allowedRoles = route.data['roles'] as Array<string>;

    // If user is logged in and role is allowed
    if (user && allowedRoles && allowedRoles.includes(user.role)) {
      return true;
    }

    // Access denied - alert the user
    this.toastSvc.showError('Access denied. Administrator privileges required.');
    this.router.navigate(['/']);
    return false;
  }
}

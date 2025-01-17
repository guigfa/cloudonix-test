import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private tokenService: TokenService = inject(TokenService);
  private router: Router = inject(Router);
  private snack: SnackbarService = inject(SnackbarService);

  canActivate(): boolean {
    if (this.tokenService.getAuthorizationToken()) {
        return true;
    }
    this.snack.show('User is not authenticated');
    this.router.navigate(['/login']);
    return false;
  }
}

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { TokenService } from '../../shared/services/token.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const tokenService = inject(TokenService); 
  const token = tokenService.getAuthorizationToken();

  const tokenedRequest = token
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    : request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        }, 
      });

  return next(tokenedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/login']);
        return throwError(() => new Error('Please, login.'));
      }
      return throwError(() => error);
    })
  );
};

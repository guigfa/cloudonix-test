import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom([BrowserAnimationsModule]), provideHttpClient(withInterceptors([authInterceptor])), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withViewTransitions())]
};

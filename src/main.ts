import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { EnvironmentInjector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { WebCreateFormComponent } from './app/shared/web-components/create-product/create-product.component';

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    const injector = appRef.injector.get(EnvironmentInjector);
    const webCreateForm = createCustomElement(WebCreateFormComponent, { injector });
    customElements.define('web-create-form', webCreateForm);
  })
  .catch((err) => console.error(err));

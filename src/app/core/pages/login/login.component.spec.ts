import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../../shared/services/token.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: Router;

  beforeEach(async () => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['removeAuthorizationToken', 'setAuthorizationToken']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        RouterTestingModule
      ],
      providers: [
        { provide: TokenService, useValue: tokenServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize authKey FormControl', () => {
    expect(component.authKey).toBeTruthy();
    expect(component.authKey.value).toBe('');
    expect(component.authKey.valid).toBeFalse();
  });

  it('should call removeAuthorizationToken on init', () => {
    expect(tokenService.removeAuthorizationToken).toHaveBeenCalled();
  });

  it('should set authorization token and navigate on valid login', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.authKey.setValue('valid-token');
    component.login();
    expect(tokenService.setAuthorizationToken).toHaveBeenCalledWith('valid-token');
    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });

  it('should alert if token is empty', () => {
    spyOn(window, 'alert');
    component.authKey.setValue('');
    component.login();
    expect(window.alert).toHaveBeenCalledWith('The token is required.');
  });
});

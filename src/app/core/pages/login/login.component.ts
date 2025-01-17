import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TokenService } from '../../../shared/services/token.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule],
})
export class LoginComponent {
  authKey: FormControl = new FormControl('', Validators.required);

  constructor(private tokenService: TokenService, private router: Router) {
    this.tokenService.removeAuthorizationToken();
  }

  login(): void {
    if (this.authKey.value.trim()) {
      this.tokenService.setAuthorizationToken(this.authKey.value);
      this.router.navigate(['/products']);
    } else {
      alert('The token is required.');
    }
  }
}

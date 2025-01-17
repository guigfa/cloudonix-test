import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
  })
  export class TokenService {
    storageService = new StorageService();
  
    getAuthorizationToken(): string {
      return this.storageService.getItem('token') || '';
    }
  
    getAuthorizationHeaders(): HttpHeaders {
      const token = this.getAuthorizationToken();
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
  
    setAuthorizationToken(token: string) {
      if (token?.length) this.storageService.setItem('token', token);
    }

    removeAuthorizationToken() {
        this.storageService.removeItem('token');
    }
}
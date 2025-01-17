import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getItem(key: string): any {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setItem(key: string, item: any) {
    window.localStorage.setItem(key, JSON.stringify(item));
  }

  removeItem(key: string) {
    window.localStorage.removeItem(key);
  }

  clear() {
    window.localStorage.clear();
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of } from 'rxjs';

type LoginRequest = { email: string; password: string };
type RegisterRequest = { email: string; password: string };

type ManageInfoResponse = {
  email: string;
  isEmailConfirmed: boolean;
};

const API_BASE = 'http://localhost:5211';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(payload: LoginRequest) {
    return this.http.post(`${API_BASE}/login`, payload, {
      params: { useCookies: true },
      withCredentials: true,
    });
  }

  register(payload: RegisterRequest) {
    return this.http.post(`${API_BASE}/register`, payload, { withCredentials: true });
  }

  logout() {
    return this.http.post(`${API_BASE}/logout`, {}, { withCredentials: true });
  }

  fetchCurrentUser() {
    return this.http
      .get<ManageInfoResponse>(`${API_BASE}/manage/info`, { withCredentials: true })
      .pipe(catchError(() => of(null)));
  }
}

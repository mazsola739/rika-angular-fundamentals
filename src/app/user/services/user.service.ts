import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map } from 'rxjs'
import { API_URL, type ApiSuccess, type PublicUser } from '../../core/api'

/** The logged-in user, from the backend. */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(API_URL)

  getUser() {
    return this.http
      .get<ApiSuccess<PublicUser>>(`${this.apiUrl}/users/me`)
      .pipe(map(({ result }) => result))
  }
}

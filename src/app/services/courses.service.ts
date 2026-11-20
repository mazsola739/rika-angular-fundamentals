import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { map, type Observable } from 'rxjs'
import { API_URL, type ApiSuccess, type Author, type Course, type CourseInput } from '../core/api'

/** Every call to the backend about courses and authors. */
@Injectable({ providedIn: 'root' })
export class CoursesService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(API_URL)

  getAll(): Observable<Course[]> {
    return this.get<Course[]>('/courses/all')
  }

  createCourse(course: CourseInput): Observable<Course> {
    return this.http
      .post<ApiSuccess<Course>>(`${this.apiUrl}/courses/add`, course)
      .pipe(map(({ result }) => result))
  }

  editCourse(id: string, course: CourseInput): Observable<Course> {
    return this.http
      .put<ApiSuccess<Course>>(`${this.apiUrl}/courses/${encodeURIComponent(id)}`, course)
      .pipe(map(({ result }) => result))
  }

  getCourse(id: string): Observable<Course> {
    return this.get<Course>(`/courses/${encodeURIComponent(id)}`)
  }

  deleteCourse(id: string): Observable<string> {
    return this.http
      .delete<ApiSuccess<string>>(`${this.apiUrl}/courses/${encodeURIComponent(id)}`)
      .pipe(map(({ result }) => result))
  }

  /** The backend's search: courses whose title contains the value. */
  filterCourses(value: string): Observable<Course[]> {
    return this.http
      .get<ApiSuccess<Course[]>>(`${this.apiUrl}/courses/filter`, { params: { title: value } })
      .pipe(map(({ result }) => result))
  }

  getAllAuthors(): Observable<Author[]> {
    return this.get<Author[]>('/authors/all')
  }

  createAuthor(name: string): Observable<Author> {
    return this.http
      .post<ApiSuccess<Author>>(`${this.apiUrl}/authors/add`, { name })
      .pipe(map(({ result }) => result))
  }

  getAuthorById(id: string): Observable<Author> {
    return this.get<Author>(`/authors/${encodeURIComponent(id)}`)
  }

  private get<T>(path: string): Observable<T> {
    return this.http.get<ApiSuccess<T>>(`${this.apiUrl}${path}`).pipe(map(({ result }) => result))
  }
}

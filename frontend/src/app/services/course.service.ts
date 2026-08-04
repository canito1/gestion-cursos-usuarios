import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CreateCourseRequest } from '../core/models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly apiUrl = 'http://localhost:4000/api/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  createCourse(course: CreateCourseRequest): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }
}

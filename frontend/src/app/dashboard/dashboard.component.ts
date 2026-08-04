import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { Course } from '../core/models/course.model';
import { UserInfo } from '../core/models/login-response.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: UserInfo | null = this.auth.getUser();
  courses: Course[] = [];
  coursesCount = 0;
  loadingCourses = false;
  coursesError = false;

  constructor(private auth: AuthService, private courseService: CourseService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loadingCourses = true;
    this.coursesError = false;
    this.courseService.getCourses().subscribe({
      next: data => {
        this.courses = data;
        this.coursesCount = data.length;
        this.loadingCourses = false;
        try { this.cd.detectChanges(); } catch {}
      },
      error: err => {
        console.error('Error fetching courses', err);
        this.courses = [];
        this.coursesCount = 0;
        this.loadingCourses = false;
        try { this.cd.detectChanges(); } catch {}
        this.coursesError = true;
      }
    });
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseService } from '../services/course.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course, CreateCourseRequest } from '../core/models/course.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  showCreate = false;
  newCourse: CreateCourseRequest = { title: '', description: '', teacher: '' };
  loading = false;
  error = false;

  constructor(private courseService: CourseService, public auth: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCourses();
  }

  get canEdit() {
    const role = this.auth.getUserRole();
    return role === 'admin' || role === 'profesor';
  }

  loadCourses() {
    this.loading = true;
    this.error = false;
    this.courseService.getCourses().subscribe({
      next: data => {
        this.courses = data;
        this.loading = false;
        try { this.cd.detectChanges(); } catch {}
      },
      error: err => {
        console.error('CoursesComponent: error loading courses', err);
        this.courses = [];
        this.loading = false;
        try { this.cd.detectChanges(); } catch {}
        this.error = true;
      }
    });
  }

  createCourse() {
    this.courseService.createCourse(this.newCourse).subscribe(() => {
      this.newCourse = { title: '', description: '', teacher: '' };
      this.showCreate = false;
      this.loadCourses();
    });
  }
}

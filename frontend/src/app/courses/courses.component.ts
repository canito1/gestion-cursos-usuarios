import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseService } from '../services/course.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-courses',
  template: `
    <div>
      <h2>Cursos</h2>
      <div style="margin-bottom:8px">Total: <strong>{{ loading ? 'Cargando...' : (courses.length + ' cursos') }}</strong></div>
      <button *ngIf="canEdit" (click)="showCreate = !showCreate">{{ showCreate ? 'Cancelar' : 'Nuevo curso' }}</button>

      <div *ngIf="showCreate" class="form-panel">
        <form (ngSubmit)="createCourse()">
          <label>Título<input [(ngModel)]="newCourse.title" name="title" required /></label>
          <label>Descripción<textarea [(ngModel)]="newCourse.description" name="description" required></textarea></label>
          <label>Profesor<input [(ngModel)]="newCourse.teacher" name="teacher" required /></label>
          <button type="submit">Crear curso</button>
        </form>
      </div>

      <div class="course-list">
        <div class="course-card" *ngFor="let course of courses">
          <h3>{{ course.title }}</h3>
          <p>{{ course.description }}</p>
          <small>Docente: {{ course.teacher }}</small>
        </div>
      </div>
    </div>
  `,
  styles: [
    "h2 { margin-bottom: 12px; }",
    ".form-panel { margin: 16px 0; padding: 16px; border: 1px solid #d1d5db; border-radius: 8px; background: #f8fafc; }",
    "label { display: block; margin-bottom: 12px; }",
    "input, textarea { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #cbd5e1; border-radius: 4px; }",
    "button { margin-top: 8px; padding: 10px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }",
    ".course-list { display: grid; gap: 16px; margin-top: 20px; }",
    ".course-card { padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; }"
  ]
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  showCreate = false;
  newCourse = { title: '', description: '', teacher: '' };
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
    console.log('CoursesComponent: loading courses via service');
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

    // diagnostic fallback
    try {
      const url = 'http://localhost:4000/api/courses';
      console.log('CoursesComponent: fallback fetch ->', url);
      window.fetch(url)
        .then(async res => {
          console.log('CoursesComponent: fetch status', res.status);
          const text = await res.text();
          try { console.log('CoursesComponent: fetch body JSON', JSON.parse(text)); } catch { console.log('CoursesComponent: fetch body (text)', text); }
        })
        .catch(err => console.error('CoursesComponent: fetch error', err));
    } catch (e) {
      console.error('CoursesComponent: fetch fallback not available', e);
    }
  }

  createCourse() {
    this.courseService.createCourse(this.newCourse).subscribe(() => {
      this.newCourse = { title: '', description: '', teacher: '' };
      this.showCreate = false;
      this.loadCourses();
    });
  }
}

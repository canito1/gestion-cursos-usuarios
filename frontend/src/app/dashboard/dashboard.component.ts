import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-dashboard',
  template: `
    <div>
      <h2>Bienvenido, {{ user?.name }}</h2>
      <p>Rol: {{ user?.role }}</p>
      <section class="summary">
        <div class="card">
          <strong>Cursos disponibles</strong>
          @if (loadingCourses) { <div>Cargando...</div> }
          @if (!loadingCourses && !coursesError) { <div>{{ coursesCount }}</div> }
          @if (coursesError) { <div style="color: #b91c1c">Error al cargar cursos</div> }
        </div>
        @if (user?.role === 'admin') { <div class="card">
          <strong>Administrar usuarios</strong>
          <div>Solo administradores pueden acceder</div>
        </div> }
      </section>
    </div>
  `,
  styles: [
    "h2 { margin-bottom: 8px; }",
    ".summary { display: flex; gap: 16px; margin-top: 24px; flex-wrap: wrap; }",
    ".card { padding: 16px; border: 1px solid #d1d5db; border-radius: 8px; min-width: 180px; background: #f9fafb; }"
  ]
})
export class DashboardComponent implements OnInit {
  user = this.auth.getUser();
  courses = [] as any[];
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
    console.log('Dashboard: loadCourses - using CourseService');
    this.courseService.getCourses().subscribe({
      next: data => {
        this.courses = data;
        this.coursesCount = Array.isArray(data) ? data.length : 0;
        this.loadingCourses = false;
        console.log('Dashboard: updated coursesCount', this.coursesCount);
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
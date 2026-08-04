export interface Course {
  _id: string;
  title: string;
  description: string;
  teacher: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  teacher: string;
}

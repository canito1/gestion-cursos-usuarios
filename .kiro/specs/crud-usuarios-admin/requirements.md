# Requirements Document

## Introduction

Este documento especifica los requisitos para completar el CRUD de administración de usuarios en el frontend Angular. La funcionalidad de edición de usuarios está ausente, el template del componente está duplicado (inline en el `.ts` vs archivo `.html` separado desincronizado), y existe un bug en el mapeo del identificador de usuario (`user.id` vs `_id` de MongoDB). El backend ya expone todos los endpoints necesarios (`GET`, `POST`, `PUT`, `DELETE` en `/api/users`) protegidos con JWT y rol admin. No se requieren cambios en el backend.

## Glossary

- **UsersComponent**: Componente Angular standalone (`app-users`) responsable de listar, crear, editar y eliminar usuarios desde la vista de administración.
- **UserService**: Servicio Angular inyectable que encapsula las llamadas HTTP al backend para el recurso de usuarios.
- **Edit Panel**: Panel lateral desplegable que muestra el formulario de edición de un usuario, con el mismo estilo visual que el panel de creación.
- **ID Mapping**: Corrección del campo identificador de usuario; el backend devuelve `_id` (MongoDB) y el frontend debe mapearlo a `id` para uso interno.
- **templateUrl**: Propiedad del decorador `@Component` que apunta a un archivo HTML externo, en oposición al `template` inline.
- **Admin**: Usuario con rol `admin` que tiene acceso completo al módulo de gestión de usuarios.
- **UpdateUserPayload**: Objeto que contiene los campos actualizables de un usuario: `name` (requerido), `role` (requerido) y `password` (opcional).

---

## Requirements

### Requirement 1: Migración de template inline a archivo externo

**User Story:** As an Admin, I want the UsersComponent template to live in a dedicated HTML file, so that the component TypeScript file stays clean and the template is editable without touching compiled logic.

#### Acceptance Criteria

1. THE UsersComponent SHALL declare `templateUrl: './users.component.html'` in its `@Component` decorator.
2. THE UsersComponent SHALL NOT contain a `template` property in its `@Component` decorator after the migration.
3. THE `users.component.html` file SHALL contain the complete, canonical template of the UsersComponent, replacing all content previously defined inline.
4. WHEN the Angular compiler processes UsersComponent, THE UsersComponent SHALL compile without errors after the migration.

---

### Requirement 2: Corrección del mapeo _id a id

**User Story:** As an Admin, I want user rows to display and operate correctly, so that delete and edit actions work with the actual MongoDB document identifier.

#### Acceptance Criteria

1. WHEN `UserService.getUsers()` returns the user list from the backend, THE UsersComponent SHALL map each user object so that `user.id` contains the value of `user._id`, and the mapped list SHALL be used as the data source rendered in the table.
2. WHEN `deleteUser` is invoked for a user row and `user.id` is a non-empty string, THE UsersComponent SHALL pass `user.id` to `UserService.deleteUser()`.
3. WHEN `updateUser` is invoked for a user row and `user.id` is a non-empty string, THE UsersComponent SHALL pass `user.id` to `UserService.updateUser()`.
4. IF the backend response for a user does not include an `_id` field, or if `_id` is `null` or an empty string, THEN THE UsersComponent SHALL exclude that user from the rendered table and log an error to the console.
5. IF `deleteUser` or `updateUser` is invoked for a user whose `id` is `undefined` or an empty string, THEN THE UsersComponent SHALL abort the operation without calling the service and log an error to the console.

---

### Requirement 3: Método updateUser en UserService

**User Story:** As an Admin, I want UserService to provide an updateUser method, so that the edit panel can persist changes to the backend.

#### Acceptance Criteria

1. THE UserService SHALL expose a public method `updateUser(id: string, data: UpdateUserPayload): Observable<any>`.
2. WHEN `updateUser` is called with a non-empty `id`, THE UserService SHALL issue an HTTP `PUT` request to `/api/users/{id}` where `{id}` is substituted with the value of the `id` parameter, with the sanitized body as the request body.
3. WHERE the `password` field in `UpdateUserPayload` is an empty string, `null`, or `undefined`, THE UserService SHALL build a new request body object that omits the `password` field entirely, without mutating the caller's `data` object.
4. THE UserService SHALL return the `Observable` emitted by `HttpClient.put()` without additional transformation.

---

### Requirement 4: Botón Editar por fila en la tabla de usuarios

**User Story:** As an Admin, I want an "Editar" button on each user row, so that I can open the edit panel for a specific user.

#### Acceptance Criteria

1. THE UsersComponent SHALL render an "Editar" button in the actions cell of every row in the users table.
2. WHEN the "Editar" button of a row is clicked, THE UsersComponent SHALL set the selected user as the edit target, populate the Edit Panel fields with that user's current values, and display the Edit Panel.
3. WHEN the "Editar" button of a row is clicked and the Edit Panel is already open for a different user, THE UsersComponent SHALL replace the edit target with the newly selected user and discard any unsaved changes from the previous user.
4. WHEN the "Editar" button of the same row is clicked while the Edit Panel is open for that user, THE UsersComponent SHALL close the Edit Panel and discard any unsaved changes.

---

### Requirement 5: Panel de edición de usuario

**User Story:** As an Admin, I want a slide-in edit panel with fields for name, role, and optional password, so that I can update user data without navigating away from the list.

#### Acceptance Criteria

1. THE Edit Panel SHALL be visible only when a user has been selected for editing.
2. WHEN the Edit Panel is opened for a user, THE UsersComponent SHALL pre-populate the `name` and `role` fields with the selected user's current values, and SHALL leave the password field empty.
3. THE Edit Panel SHALL contain a text input bound to the edit state's `name` field.
4. THE Edit Panel SHALL contain a `<select>` bound to the edit state's `role` field, offering the options `admin`, `profesor`, and `estudiante`.
5. THE Edit Panel SHALL contain a password input labeled as optional.
6. IF the password field is left empty when the edit form is submitted, THEN THE UsersComponent SHALL omit the `password` field from the update payload sent to `UserService.updateUser()`.
7. THE Edit Panel SHALL require the `name` field to be non-empty before the edit form can be submitted; IF `name` is empty, THEN THE UsersComponent SHALL prevent submission.
8. THE Edit Panel SHALL apply the same CSS styles as the creation panel (class `form-panel` and its associated label, input, select, and button styles).
9. WHEN the edit form is submitted with a valid `name`, THE UsersComponent SHALL call `UserService.updateUser()` with the user's mapped `id` and the `UpdateUserPayload`.
10. WHEN `UserService.updateUser()` completes successfully, THE UsersComponent SHALL close the Edit Panel, clear the edit state, and reload the user list.
11. IF `UserService.updateUser()` returns an error, THEN THE UsersComponent SHALL display a visible error message to the user and log the error to the console without closing the Edit Panel.
12. THE Edit Panel SHALL include a "Cancelar" button that, WHEN clicked, closes the Edit Panel and resets all edit fields to the values they held when the panel was opened.

---

### Requirement 6: Consistencia del estado del panel de creación y edición

**User Story:** As an Admin, I want the create and edit panels to be mutually exclusive, so that both panels are never open at the same time.

#### Acceptance Criteria

1. WHEN the "Nuevo usuario" button is clicked while the Edit Panel is open, THE UsersComponent SHALL close the Edit Panel before opening the creation panel.
2. WHEN the "Editar" button is clicked while the creation panel is open, THE UsersComponent SHALL close the creation panel before opening the Edit Panel.
3. WHILE neither panel is open, THE UsersComponent SHALL display only the users table and the "Nuevo usuario" button.

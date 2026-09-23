# Cofor

## Ejecución local con microservicios

El front está configurado para consumir los servicios por HTTP, sin datos simulados:

- `user-service`: `http://127.0.0.1:8000/api`
- `companies-service`: `http://127.0.0.1:8001/api`

En tres terminales independientes, desde `C:\cofor\Back-Services`, inicia los procesos:

```powershell
cd user-service
.\venv\Scripts\python.exe manage.py runserver 8000
```

```powershell
cd companies-service
.\venv\Scripts\python.exe manage.py runserver 8001
```

```powershell
cd front\cofor
npm start
```

El inicio de sesión obtiene el JWT desde `user-service`; el front lo envía automáticamente al consultar, editar o eliminar alumnos. Las empresas se consultan desde `companies-service` en las dos vistas empresariales.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

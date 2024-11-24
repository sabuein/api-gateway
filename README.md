# api-gateway

Frontend as a Progressive Web App (PWA) (HTML, CSS, JavaScript)
Backend with NodeJS, MariaDB, and Express (JavaScript, SQL)

### Always Separate Concerns:
- Routes define endpoints.
- Controllers contain business logic.
- Models interact with the database.

### How the App Ties Together

The above changes ensure that your application structure is modular and scalable:

- HTTP Requests: Handled by service1Routes.js.
- Business Logic: Processed by service1Controller.js.
- Database Interactions: Managed by service1Model.js.

By doing this, your app remains clean, organized, and easy to expand with additional services or APIs.
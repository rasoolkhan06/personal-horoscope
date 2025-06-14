# Design Decisions

## API Structure
- **RESTful Endpoints**: The API follows RESTful conventions with clear resource naming and appropriate HTTP methods.
- **Versioning**: Consider adding API versioning (e.g., `/api/v1/...`) for future compatibility.
- **Authentication**: JWT-based authentication is used for securing endpoints.

## Data Model
- **MongoDB Schema**: MongoDB was chosen for its flexibility with unstructured data like horoscopes.
- **User-Horoscope Relationship**: One-to-many relationship between users and their horoscope readings.
- **Date Handling**: All dates are stored in UTC and converted to the user's timezone when displayed.

## Caching Strategy
- **In-Memory Caching**: Implemented for frequently accessed data like zodiac signs.
- **Horoscope Caching**: Daily horoscopes are cached to reduce database load.

## Error Handling
- **Consistent Error Responses**: Standardized error response format across all endpoints.
- **Validation**: Request validation using class-validator decorators.
- **Global Exception Filter**: Centralized error handling for all routes.

## Security
- **Environment Variables**: Sensitive configuration stored in environment variables.
- **Password Hashing**: bcrypt is used for secure password storage.
- **Rate Limiting**: Consider implementing to prevent abuse of public endpoints.

## Performance
- **Pagination**: Implemented for endpoints that could return large datasets.
- **Query Optimization**: Indexes added for frequently queried fields.
- **Selective Field Projection**: Only fetching necessary fields from the database.

## Testing
- **Unit Tests**: Individual service methods are unit tested.
- **E2E Tests**: API endpoints are tested with real HTTP requests.
- **Mocking**: External services are mocked in tests for reliability.

## Documentation
- **Swagger/OpenAPI**: Auto-generated API documentation.
- **JSDoc**: Code is documented with JSDoc comments.
- **This Document**: High-level design decisions are documented here.

## Future Considerations
- **WebSocket Support**: For real-time horoscope updates.
- **GraphQL API**: For more flexible data querying.
- **Microservices**: Potential to split into separate services as the application grows.

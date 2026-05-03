export class SkinstracksError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly response?: unknown
  ) {
    super(message);
    this.name = 'SkinstracksError';
    Object.setPrototypeOf(this, SkinstracksError.prototype);
  }
}

export class UnauthorizedError extends SkinstracksError {
  constructor(message = 'Unauthorized - missing or invalid API key') {
    super(message, 401);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class RateLimitError extends SkinstracksError {
  constructor(message = 'API call limit reached for your plan') {
    super(message, 429);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class NotFoundError extends SkinstracksError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class BadRequestError extends SkinstracksError {
  constructor(message = 'Bad request') {
    super(message, 400);
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class ServerError extends SkinstracksError {
  constructor(message = 'Internal server error') {
    super(message, 500);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

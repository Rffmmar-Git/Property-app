export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;

    this.name = "ApiError";

    Object.setPrototypeOf(this, ApiError.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}
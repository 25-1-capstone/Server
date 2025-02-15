export type ErrorDetails = null;

export class BaseError extends Error {
  public statusCode: number;
  public code: string;
  public details: ErrorDetails = null;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: ErrorDetails,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details || null;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

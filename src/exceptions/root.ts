// We will send a Message a Status Code , error code- uniquely identifies an exception,errors that have occurred back to the frontend

export class HttpException extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: ErrorCode;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  UNAUTHORIZED = 1004,
  UNPROCESSABLE_ENTITY = 2001,
  INTERNAL_EXCEPTION = 3001,
  LISTING_ALREADY_EXISTS = 4001,
  USER_DOESNT_HAVE_LISTINGS = 4002,
  LISTING_IS_LOCKED = 4003,
  LISTING_NOT_FOUND = 4004,
  USER_HAS_EXISTING_LEASE = 5001,
  CANNOT_LEASE = 5001,
}

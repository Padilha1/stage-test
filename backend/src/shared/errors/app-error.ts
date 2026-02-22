export type ErrorType =
  | "validation_error"
  | "not_found"
  | "conflict"
  | "internal_error";

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly details?: Array<{ field: string; reason: string }>;

  constructor(params: {
    type: ErrorType;
    message: string;
    statusCode: number;
    details?: Array<{ field: string; reason: string }>;
  }) {
    super(params.message);
    this.type = params.type;
    this.statusCode = params.statusCode;
    this.details = params.details;
  }
}

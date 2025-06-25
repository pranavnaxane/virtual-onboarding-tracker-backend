export enum HTTP_STATUS_CODE {
  CREATED = 201,
  BAD_REQUEST = 400,
  TOKEN_NOT_FOUND = 401,
  UNAUTHORISED = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export enum USER_TYPE {
  HR = "hr",
  USER = "user",
}

export enum STATUS {
  ACTIVE = "active",
  DEACTIVE = "deactive",
}

export enum TASK_STATUS {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

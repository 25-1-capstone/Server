export type ErrorDetails =
  | {scheduleId?: string}
  | {reason?: string}
  | {startDate?: Date; endDate?: Date}
  | {groupId?: string}
  | {groupId?: string; userId?: string}
  | {focusTargetId?: string}
  | null;

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

// Schedule(일정) 관련 에러
export class ScheduleCreationError extends BaseError {
  constructor(details: {scheduleId: bigint}) {
    const ErrorDetails = {
      scheduleId: details.scheduleId.toString(),
    };
    super(400, 'SCH-400', '일정 생성 중 오류가 발생했습니다.', ErrorDetails);
  }
}

export class ScheduleDateError extends BaseError {
  constructor(details: {startDate: Date; endDate: Date}) {
    const ErrorDetails = {
      startDate: details.startDate,
      endDate: details.startDate,
    };
    super(
      400,
      'SCH-400',
      '종료일을 시작일보다 과거로 설정할 수 없습니다.',
      ErrorDetails,
    );
  }
}

export class ScheduleOverlappingError extends BaseError {
  constructor(details: {startDate: Date; endDate: Date}) {
    const ErrorDetails = {
      startDate: details.startDate,
      endDate: details.startDate,
    };
    super(
      400,
      'SCH-400',
      '이미 존재하는 일정과 시간이 겹칩니다.',
      ErrorDetails,
    );
  }
}

export class WeeklyScheduleGetError extends BaseError {
  constructor(details: {reason: string}) {
    super(400, 'SCH-400', '주간 일정 조회 중 오류가 발생했습니다.', details);
  }
}

export class ScheduleNotFoudError extends BaseError {
  constructor(details: {scheduleId: bigint}) {
    const ErrorDetails = {
      scheduleId: details.scheduleId.toString(),
    };
    super(404, 'SCH-404', '해당 일정을 찾을 수 없습니다.', ErrorDetails);
  }
}

// Group(그룹) 관련 에러
export class GroupCreationError extends BaseError {
  constructor(details: {groupId: bigint}) {
    const ErrorDetails = {
      groupId: details.groupId.toString(),
    };
    super(400, 'GRP-400', '그룹 생성 중 오류가 발생했습니다.', ErrorDetails);
  }
}

export class GroupNotFoundError extends BaseError {
  constructor(details: {groupId: bigint}) {
    const ErrorDetails = {
      groupId: details.groupId.toString(),
    };
    super(
      404,
      'GRP-404',
      '특정 그룹 조회 중 오류가 발생했습니다.',
      ErrorDetails,
    );
  }
}

export class GroupJoinDuplicateError extends BaseError {
  constructor(details: {groupId: bigint; userId: bigint}) {
    const ErrorDetails = {
      groupId: details.groupId.toString(),
      userId: details.userId.toString(),
    };
    super(400, 'GRP-400', '이미 가입한 그룹입니다.', ErrorDetails);
  }
}

export class GroupJoinError extends BaseError {
  constructor(details: {groupId: bigint; userId: bigint}) {
    const ErrorDetails = {
      groupId: details.groupId.toString(),
      userId: details.userId.toString(),
    };
    super(400, 'GRP-400', '그룹 가입 중 오류가 발생하였습니다.', ErrorDetails);
  }
}

// FocusTarget(허용 동작) 관련 에러
export class FocusTargetEnableError extends BaseError {
  constructor(details: {focusTargetId: bigint}) {
    const ErrorDetails = {
      focusTargetId: details.focusTargetId.toString(),
    };
    super(
      400,
      'FCT-400',
      '허용 동작 업데이트 중 오류가 발생하였습니다.',
      ErrorDetails,
    );
  }
}

// 공용 에러
export class DBError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(500, 'DB-001', '데이터베이스 에러입니다.', details);
  }
}

export class ServerError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(500, 'SER-001', '내부 서버 오류입니다.', details);
  }
}

// 인증 관련 에러
export class AuthError extends BaseError {
  constructor(details: {reason: string}) {
    super(401, 'AUT-401', '인증 오류입니다.', details);
  }
}

export class SessionError extends BaseError {
  constructor(details: {reason: string}) {
    super(401, 'AUT-401', '세션 오류입니다.', details);
  }
}

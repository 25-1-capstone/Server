import {
  Controller,
  Example,
  Post,
  Request,
  Route,
  SuccessResponse,
  Response,
  Tags,
  Body,
  Get,
  Path,
} from '@tsoa/runtime';
import {StatusCodes} from 'http-status-codes';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoa-response.js';
import {Request as ExpressRequest} from 'express';
import {
  BodyToSchedule,
  ScheduleResponse,
  WeeklyScheduleResponse,
} from '../models/schedule.model.js';
import {bodyToSchedule} from '../dtos/schedule.dto.js';
import {
  scheduleCreate,
  scheduleGet,
  weeklyScheduleGet,
} from '../services/schedule.service.js';

@Route('schedule')
export class ScheduleController extends Controller {
  /**
   * 일정을 생성하는 API입니다.
   *
   * @summary 일정 생성 API
   * @param body 일정 제목, 설명, 시작일, 종료일, 반복 여부, 알림
   * @returns 일정 생성 결과
   */
  @Post('/')
  @Tags('Schedule-Controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'SCH-400',
        reason: '일정 생성 중 오류가 발생했습니다.',
        data: {scheduleId: '1'},
      },
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'SCH-400',
        reason: '종료일을 시작일과 일치하거나 과거로 설정할 수 없습니다.',
        data: {
          startDate: new Date('2025-05-17T03:50:25'),
          endDate: new Date('2025-05-13T03:50:25'),
        },
      },
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'SCH-400',
        reason: '이미 존재하는 일정과 시간이 겹칩니다.',
        data: {
          startDate: new Date('2025-05-17T03:50:25'),
          endDate: new Date('2025-05-18T03:50:25'),
        },
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '일정 생성 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      id: '1',
      title: 'string',
      userId: '1',
      description: 'string',
      startDate: '2025-01-17T03:50:25',
      endDate: '2025-01-17T03:50:25',
      repeatType: '반복 없음',
      notification: 0,
    },
  })
  public async handleScheduleAdd(
    // @Request() req: ExpressRequest,
    @Body() body: BodyToSchedule,
  ): Promise<ITsoaSuccessResponse<ScheduleResponse>> {
    try {
      const userId = BigInt(11); //BigInt(req.user!.id);
      const schedule = await scheduleCreate(userId, bodyToSchedule(body));
      return new TsoaSuccessResponse(schedule);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 주간 일정을 조회하는 API입니다.
   *
   * @summary 주간 일정 조회 API
   * @returns 주간 일정 조회 결과
   */
  @Get('/weekly')
  @Tags('Schedule-Controller')
  @SuccessResponse(StatusCodes.OK, '주간 일정 조회 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      userId: '1',
      schedules: {
        '0': [
          {
            id: '1',
            title: 'string',
            description: 'string',
            startDate: '2025-01-17T03:50:25',
            endDate: '2025-01-17T03:50:25',
          },
        ],
        '1': [
          {
            id: '1',
            title: 'string',
            description: 'string',
            startDate: '2025-01-17T03:50:25',
            endDate: '2025-01-17T03:50:25',
          },
        ],
        '2': [
          {
            id: '1',
            title: 'string',
            description: 'string',
            startDate: '2025-01-17T03:50:25',
            endDate: '2025-01-17T03:50:25',
          },
        ],
        '3': [
          {
            id: '1',
            title: 'string',
            description: 'string',
            startDate: '2025-01-17T03:50:25',
            endDate: '2025-01-17T03:50:25',
          },
        ],
        '4': [
          {
            id: '1',
            title: 'string',
            description: 'string',
            startDate: '2025-01-17T03:50:25',
            endDate: '2025-01-17T03:50:25',
          },
        ],
        '5': [
          {
            id: '1',
            title: 'string',
            description: 'string',
            startDate: '2025-01-17T03:50:25',
            endDate: '2025-01-17T03:50:25',
          },
        ],
        '6': [
          {
            id: '1',
            title: 'string',
            description: 'string',
            startDate: '2025-01-17T03:50:25',
            endDate: '2025-01-17T03:50:25',
          },
        ],
      },
    },
  })
  public async handleWeekScheduleGet() // @Request() req: ExpressRequest,
  : Promise<ITsoaSuccessResponse<WeeklyScheduleResponse>> {
    try {
      const userId = BigInt(11); //BigInt(req.user!.id);

      const weeklySchedule = await weeklyScheduleGet(userId);
      console.log('최종 주간 일정:', weeklySchedule);
      return new TsoaSuccessResponse(weeklySchedule);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 특정 일정을 조회하는 API입니다.
   *
   * @summary 특정 일정 조회 API
   * @param  그룹 ID
   * @returns 특정 일정 조회 결과
   */
  @Get('/:scheduleId')
  @Tags('Schedule-Controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.NOT_FOUND,
    '존재하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'SCH-404',
        reason: '해당 일정을 찾을 수 없습니다.',
        data: {
          scheduleId: '1',
        },
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '특정 일정 조회 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      userId: '1',
      schedules: {
        id: '1',
        title: 'string',
        description: 'string',
        startDate: '2025-01-17T03:50:25',
        endDate: '2025-01-17T03:50:25',
        repeatType: '반복 안함',
        notification: 0,
      },
    },
  })
  public async handleScheduleGet(
    @Request() req: ExpressRequest,
    @Path('scheduleId') scheduleIdParam: string,
  ): Promise<ITsoaSuccessResponse<ScheduleResponse>> {
    try {
      const scheduleId = BigInt(scheduleIdParam);
      const schedule = await scheduleGet(scheduleId);
      return new TsoaSuccessResponse(schedule);
    } catch (error) {
      throw error;
    }
  }
}

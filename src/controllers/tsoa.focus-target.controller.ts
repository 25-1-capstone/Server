import {
  Controller,
  Patch,
  Route,
  Tags,
  Request,
  Path,
  Example,
  SuccessResponse,
  Response,
  Get,
} from '@tsoa/runtime';
import {Request as ExpressRequest} from 'express';
import {StatusCodes} from 'http-status-codes';
import {
  DailyStatisticsResponse,
  FocusTargetListResponse,
  FocusTargetResponse,
} from '../models/focus-target.model.js';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoa-response.js';
import {
  DailyStatisticsGet,
  FocusTargetListGet,
  FocusTargetUpdateDisable,
  FocusTargetUpdateEnable,
} from '../services/focus-target.service.js';

@Route('focusTarget')
export class FocusTargetController extends Controller {
  /**
   * 허용 동작을 활성화하는 API입니다.
   *
   * @summary 허용 동작 활성화 API
   * @param focusTargetIdParam
   * @returns 허용 동작 활성화 결과를 반환합니다.
   */
  @Patch('/enable/:focusTargetId')
  @Tags('Focus-Target-Controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'FCT-400',
        reason: '허용 동작 업데이트 중 오류가 발생하였습니다.',
        data: {focusTargetId: '1'},
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '허용 동작 활성화 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      focusTargetId: '1',
      userId: '1',
      status: 1,
    },
  })
  public async updateFocusTargetEnable(
    @Request() req: ExpressRequest,
    @Path('focusTargetId') focusTargetIdParam: string,
  ): Promise<ITsoaSuccessResponse<FocusTargetResponse>> {
    try {
      const focusTargetId = BigInt(focusTargetIdParam);
      const updatedFocusTarget = await FocusTargetUpdateEnable(focusTargetId);
      return new TsoaSuccessResponse(updatedFocusTarget);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 허용 동작을 비활성화하는 API입니다.
   *
   * @summary 허용 동작 비활성화 API
   * @param focusTargetIdParam
   * @returns 허용 동작 비활성화 결과를 반환합니다.
   */
  @Patch('/disable/:focusTargetId')
  @Tags('Focus-Target-Controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'FCT-400',
        reason: '허용 동작 업데이트 중 오류가 발생하였습니다.',
        data: {focusTargetId: '1'},
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '허용 동작 비활성화 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      focusTargetId: '1',
      userId: '1',
      status: 0,
    },
  })
  public async updateFocusTargetDisable(
    @Request() req: ExpressRequest,
    @Path('focusTargetId') focusTargetIdParam: string,
  ): Promise<ITsoaSuccessResponse<FocusTargetResponse>> {
    try {
      const focusTargetId = BigInt(focusTargetIdParam);
      const updatedFocusTarget = await FocusTargetUpdateDisable(focusTargetId);
      return new TsoaSuccessResponse(updatedFocusTarget);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 허용 동작 리스트를 조회하는 API입니다.
   *
   * @summary 허용 동작 리스트 조회 API
   * @returns 허용 동작 리스트 조회 결과를 반환합니다.
   */
  @Get('/')
  @Tags('Focus-Target-Controller')
  @SuccessResponse(StatusCodes.OK, '허용 동작 리스트 조회 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      targets: [
        {
          id: '1',
          target: '책/교재',
          userId: '1',
          status: 0,
        },
      ],
    },
  })
  public async GetFocusTargetList(@Request() req: ExpressRequest,)
  : Promise<ITsoaSuccessResponse<FocusTargetListResponse>> {
    try {
      const userId = BigInt(14);//(req.user!.id);
      console.log(req.user);
      const focusTargetList = await FocusTargetListGet(userId);
      return new TsoaSuccessResponse(focusTargetList);
    } catch (error) {
      throw error;
    }
  }

  // public async getFocusTargetEnable(
  //   @Request() req: ExpressRequest,
  // ): Promise<ITsoaSuccessResponse<>> {
  //   try{
  //     const
  //   }catch (error) {
  //     throw error;
  //   }
  // }

  /**
   * 집중 시간 일간 통계를 조회하는 API입니다.
   *
   * 0: 토, 1: 일, 2: 월, 3: 화, 4: 수, 5: 목, 6: 금
   *
   * @summary 일간 통계 조회 API
   * @returns 일간 통계 조회 결과를 반환합니다.
   */
  @Get('/statistics/daily')
  @Tags('Focus-Target-Controller')
  @SuccessResponse(StatusCodes.OK, '일간 통계 조회 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      dailyTotalTime: {
        '0': 60,
        '1': 60,
        '2': 60,
        '3': 60,
        '4': 60,
        '5': 60,
        '6': 60,
      },
      today: {
        disabledTarget: [
          {
            target: '책/교재',
            targetId: '1',
            startTime: '2025-01-17T03:50:25',
            endTime: '2025-01-17T04:50:25',
          },
        ],
        enabledTarget: [
          {
            target: '책/교재',
            targetId: '1',
            startTime: '2025-01-17T03:50:25',
            endTime: '2025-01-17T04:50:25',
          },
        ],
      },
    },
  })
  public async GetDailyStatistics(@Request() req: ExpressRequest,)
  : Promise<ITsoaSuccessResponse<DailyStatisticsResponse>> {
    try {
      const userId = BigInt(14);//(req.user!.id);
      console.log(req.user);

      const dailyStatistics = await DailyStatisticsGet(userId);
      return new TsoaSuccessResponse(dailyStatistics);
    } catch (error) {
      throw error;
    }
  }

}

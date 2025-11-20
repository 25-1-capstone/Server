import {
  Controller,
  Example,
  Post,
  // Request,
  Route,
  SuccessResponse,
  Response,
  Tags,
  Body,
  Path,
  Get,
  Request
} from '@tsoa/runtime';
import {StatusCodes} from 'http-status-codes';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoa-response.js';
// import {Request as ExpressRequest} from 'express';
import {
  BodyToGroup,
  GroupListResponse,
  GroupResponse,
  GroupUserResponse,
} from '../models/group.model.js';
import {
  groupCreate,
  groupGet,
  groupJoin,
  groupListGet,
} from 'src/services/group.service.js';
import {bodyToGroup} from 'src/dtos/group.dto.js';
import {Request as ExpressRequest} from 'express';

@Route('group')
export class GroupController extends Controller {
  /**
   * 스터디 그룹을 생성하는 API입니다.
   *
   * @summary 그룹 생성 API
   * @param body 그룹 이름, 설명
   * @returns 그룹 생성 결과
   */
  @Post('/')
  @Tags('Group-Controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'GRP-400',
        reason: '그룹 생성 중 오류가 발생했습니다.',
        data: {groupId: '1'},
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '그룹 생성 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      id: '1',
      name: 'string',
      hostId: '1',
      description: 'string',
    },
  })
  public async handleGroupAdd(
    @Request() req: ExpressRequest,
    @Body() body: BodyToGroup,
  ): Promise<ITsoaSuccessResponse<GroupResponse>> {
    try {
      const hostId = BigInt(14);//(req.user!.id);
      const group = await groupCreate(hostId, bodyToGroup(body));
      return new TsoaSuccessResponse(group);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 특정 스터디 그룹을 조회하는 API입니다.
   *
   * @summary 특정 그룹 조회 API
   * @param groupIdParam 그룹 ID
   * @returns 특정 그룹 조회 결과
   */
  @Get('/:groupId')
  @Tags('Group-Controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.NOT_FOUND,
    '존재하지 않는 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'GRP-404',
        reason: '특정 그룹 조회 중 오류가 발생했습니다.',
        data: {groupId: '1'},
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '특정 그룹 조회 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      id: '1',
      name: 'string',
      hostId: '1',
      description: 'string',
    },
  })
  public async handleGroupGet(
    @Request() req: ExpressRequest,
    @Path('groupId') groupIdParam: string,
  ): Promise<ITsoaSuccessResponse<GroupResponse>> {
    try {
        const hostId = BigInt(req.user!.id);
      const groupId = BigInt(groupIdParam);
      const group = await groupGet(groupId);
      return new TsoaSuccessResponse(group);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 내가 속한 스터디 그룹 리스트를 조회하는 API입니다.
   *
   * @summary 나의 그룹 리스트 조회 API
   * @returns 나의 그룹 리스트 조회 결과
   */
  @Get('/')
  @Tags('Group-Controller')
  @SuccessResponse(StatusCodes.OK, '나의 그룹 리스트 조회 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      groups: [{id: '1', name: 'string', memberCount: 1}],
    },
  })
  public async handleGroupListGet(@Request() req: ExpressRequest)
  : Promise<ITsoaSuccessResponse<GroupListResponse>> {
    try {
      const userId = BigInt(14);//(req.user!.id);
      const group = await groupListGet(userId);
      return new TsoaSuccessResponse(group);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 스터디 그룹에 가입하는 API입니다.
   *
   * @summary 그룹 가입 API
   * @param body 그룹 이름, 설명
   * @returns 그룹 생성 결과
   */
  @Post('/:groupId/user')
  @Tags('Group-Controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'GRP-400',
        reason: '그룹 가입 중 오류가 발생했습니다.',
        data: {groupId: '1', userId: '1'},
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
        errorCode: 'GRP-400',
        reason: '이미 가입한 그룹입니다.',
        data: {groupId: '1', userId: '1'},
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '그룹 가입 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      userId: '1',
      groupId: '1',
    },
  })
  public async handledGroupJoin(
    @Request() req: ExpressRequest,
    @Path('groupId') groupIdParam: string,
  ): Promise<ITsoaSuccessResponse<GroupUserResponse>> {
    try {
      const userId = BigInt(14);//(req.user!.id);
      const groupId = BigInt(groupIdParam);
      const groupUser = await groupJoin(groupId, userId);
      return new TsoaSuccessResponse(groupUser);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 내가 속한 스터디 그룹 리스트를 조회하는 API입니다.
   *
   * @summary 나의 그룹 리스트 조회 API
   * @returns 나의 그룹 리스트 조회 결과
   */
  @Get('/')
  @Tags('Group-Controller')
  @SuccessResponse(StatusCodes.OK, '나의 그룹 리스트 조회 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      groups: [{id: '1', name: 'string', memberCount: 1}],
    },
  })
  public async handleGroupUserListGet(@Request() req: ExpressRequest)
  : Promise<ITsoaSuccessResponse<GroupListResponse>> {
    try {
      const userId = BigInt(14);//(req.user!.id);
      const group = await groupListGet(userId);
      return new TsoaSuccessResponse(group);
    } catch (error) {
      throw error;
    }
  }
}

/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ScheduleController } from './../controllers/tsoa.schedule.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GroupController } from './../controllers/tsoa.group.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FocusTargetController } from './../controllers/tsoa.focus-target.controller.js';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ScheduleResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "startDate": {"dataType":"datetime","required":true},
            "endDate": {"dataType":"datetime","required":true},
            "repeatType": {"dataType":"string","required":true},
            "notification": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ScheduleResponse_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"ScheduleResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorDetails": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"scheduleId":{"dataType":"string"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"reason":{"dataType":"string"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"endDate":{"dataType":"datetime"},"startDate":{"dataType":"datetime"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"groupId":{"dataType":"string"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"userId":{"dataType":"string"},"groupId":{"dataType":"string"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"focusTargetId":{"dataType":"string"}}},{"dataType":"enum","enums":[null]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"ref":"ErrorDetails","required":true},"reason":{"dataType":"string","required":true},"errorCode":{"dataType":"string","required":true}},"required":true},
            "success": {"dataType":"enum","enums":[null],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BodyToSchedule": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "startDate": {"dataType":"datetime","required":true},
            "endDate": {"dataType":"datetime","required":true},
            "repeatType": {"dataType":"string","required":true},
            "notification": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WeeklyScheduleResponse": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "schedules": {"dataType":"nestedObjectLiteral","nestedProperties":{"0":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"endDate":{"dataType":"datetime","required":true},"startDate":{"dataType":"datetime","required":true},"description":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"title":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},"1":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"endDate":{"dataType":"datetime","required":true},"startDate":{"dataType":"datetime","required":true},"description":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"title":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},"2":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"endDate":{"dataType":"datetime","required":true},"startDate":{"dataType":"datetime","required":true},"description":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"title":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},"3":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"endDate":{"dataType":"datetime","required":true},"startDate":{"dataType":"datetime","required":true},"description":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"title":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},"4":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"endDate":{"dataType":"datetime","required":true},"startDate":{"dataType":"datetime","required":true},"description":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"title":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},"5":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"endDate":{"dataType":"datetime","required":true},"startDate":{"dataType":"datetime","required":true},"description":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"title":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},"6":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"endDate":{"dataType":"datetime","required":true},"startDate":{"dataType":"datetime","required":true},"description":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"title":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_WeeklyScheduleResponse_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"WeeklyScheduleResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "hostId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_GroupResponse_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"GroupResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BodyToGroup": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupListResponse": {
        "dataType": "refObject",
        "properties": {
            "groups": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"memberCount":{"dataType":"double","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_GroupListResponse_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"GroupListResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupUserResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "group": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_GroupUserResponse_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"GroupUserResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FocusTargetResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "target": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "status": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_FocusTargetResponse_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"FocusTargetResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FocusTargetListResponse": {
        "dataType": "refObject",
        "properties": {
            "targets": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"double","required":true},"userId":{"dataType":"string","required":true},"target":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_FocusTargetListResponse_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"FocusTargetListResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DailyStatisticsResponse": {
        "dataType": "refObject",
        "properties": {
            "dailyTotalTime": {"dataType":"nestedObjectLiteral","nestedProperties":{"0":{"dataType":"double","required":true},"1":{"dataType":"double","required":true},"2":{"dataType":"double","required":true},"3":{"dataType":"double","required":true},"4":{"dataType":"double","required":true},"5":{"dataType":"double","required":true},"6":{"dataType":"double","required":true}},"required":true},
            "today": {"dataType":"nestedObjectLiteral","nestedProperties":{"enabledTarget":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"endTime":{"dataType":"datetime","required":true},"startTime":{"dataType":"datetime","required":true},"targetId":{"dataType":"string","required":true},"target":{"dataType":"string","required":true}}},"required":true},"disabledTarget":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"endTime":{"dataType":"datetime","required":true},"startTime":{"dataType":"datetime","required":true},"targetId":{"dataType":"string","required":true},"target":{"dataType":"string","required":true}}},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_DailyStatisticsResponse_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"DailyStatisticsResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsScheduleController_handleScheduleAdd: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"BodyToSchedule"},
        };
        app.post('/schedule',
            ...(fetchMiddlewares<RequestHandler>(ScheduleController)),
            ...(fetchMiddlewares<RequestHandler>(ScheduleController.prototype.handleScheduleAdd)),

            async function ScheduleController_handleScheduleAdd(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsScheduleController_handleScheduleAdd, request, response });

                const controller = new ScheduleController();

              await templateService.apiHandler({
                methodName: 'handleScheduleAdd',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsScheduleController_handleWeekScheduleGet: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/schedule/weekly',
            ...(fetchMiddlewares<RequestHandler>(ScheduleController)),
            ...(fetchMiddlewares<RequestHandler>(ScheduleController.prototype.handleWeekScheduleGet)),

            async function ScheduleController_handleWeekScheduleGet(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsScheduleController_handleWeekScheduleGet, request, response });

                const controller = new ScheduleController();

              await templateService.apiHandler({
                methodName: 'handleWeekScheduleGet',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsScheduleController_handleScheduleGet: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                scheduleIdParam: {"in":"path","name":"scheduleId","required":true,"dataType":"string"},
        };
        app.get('/schedule/:scheduleId',
            ...(fetchMiddlewares<RequestHandler>(ScheduleController)),
            ...(fetchMiddlewares<RequestHandler>(ScheduleController.prototype.handleScheduleGet)),

            async function ScheduleController_handleScheduleGet(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsScheduleController_handleScheduleGet, request, response });

                const controller = new ScheduleController();

              await templateService.apiHandler({
                methodName: 'handleScheduleGet',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGroupController_handleGroupAdd: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"BodyToGroup"},
        };
        app.post('/group',
            ...(fetchMiddlewares<RequestHandler>(GroupController)),
            ...(fetchMiddlewares<RequestHandler>(GroupController.prototype.handleGroupAdd)),

            async function GroupController_handleGroupAdd(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGroupController_handleGroupAdd, request, response });

                const controller = new GroupController();

              await templateService.apiHandler({
                methodName: 'handleGroupAdd',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGroupController_handleGroupGet: Record<string, TsoaRoute.ParameterSchema> = {
                groupIdParam: {"in":"path","name":"groupId","required":true,"dataType":"string"},
        };
        app.get('/group/:groupId',
            ...(fetchMiddlewares<RequestHandler>(GroupController)),
            ...(fetchMiddlewares<RequestHandler>(GroupController.prototype.handleGroupGet)),

            async function GroupController_handleGroupGet(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGroupController_handleGroupGet, request, response });

                const controller = new GroupController();

              await templateService.apiHandler({
                methodName: 'handleGroupGet',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGroupController_handleGroupListGet: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/group',
            ...(fetchMiddlewares<RequestHandler>(GroupController)),
            ...(fetchMiddlewares<RequestHandler>(GroupController.prototype.handleGroupListGet)),

            async function GroupController_handleGroupListGet(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGroupController_handleGroupListGet, request, response });

                const controller = new GroupController();

              await templateService.apiHandler({
                methodName: 'handleGroupListGet',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGroupController_handledGroupJoin: Record<string, TsoaRoute.ParameterSchema> = {
                groupIdParam: {"in":"path","name":"groupId","required":true,"dataType":"string"},
        };
        app.post('/group/:groupId/user',
            ...(fetchMiddlewares<RequestHandler>(GroupController)),
            ...(fetchMiddlewares<RequestHandler>(GroupController.prototype.handledGroupJoin)),

            async function GroupController_handledGroupJoin(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGroupController_handledGroupJoin, request, response });

                const controller = new GroupController();

              await templateService.apiHandler({
                methodName: 'handledGroupJoin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFocusTargetController_updateFocusTargetEnable: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                focusTargetIdParam: {"in":"path","name":"focusTargetId","required":true,"dataType":"string"},
        };
        app.patch('/focusTarget/enable/:focusTargetId',
            ...(fetchMiddlewares<RequestHandler>(FocusTargetController)),
            ...(fetchMiddlewares<RequestHandler>(FocusTargetController.prototype.updateFocusTargetEnable)),

            async function FocusTargetController_updateFocusTargetEnable(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFocusTargetController_updateFocusTargetEnable, request, response });

                const controller = new FocusTargetController();

              await templateService.apiHandler({
                methodName: 'updateFocusTargetEnable',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFocusTargetController_updateFocusTargetDisable: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                focusTargetIdParam: {"in":"path","name":"focusTargetId","required":true,"dataType":"string"},
        };
        app.patch('/focusTarget/disable/:focusTargetId',
            ...(fetchMiddlewares<RequestHandler>(FocusTargetController)),
            ...(fetchMiddlewares<RequestHandler>(FocusTargetController.prototype.updateFocusTargetDisable)),

            async function FocusTargetController_updateFocusTargetDisable(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFocusTargetController_updateFocusTargetDisable, request, response });

                const controller = new FocusTargetController();

              await templateService.apiHandler({
                methodName: 'updateFocusTargetDisable',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFocusTargetController_GetFocusTargetList: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/focusTarget',
            ...(fetchMiddlewares<RequestHandler>(FocusTargetController)),
            ...(fetchMiddlewares<RequestHandler>(FocusTargetController.prototype.GetFocusTargetList)),

            async function FocusTargetController_GetFocusTargetList(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFocusTargetController_GetFocusTargetList, request, response });

                const controller = new FocusTargetController();

              await templateService.apiHandler({
                methodName: 'GetFocusTargetList',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFocusTargetController_GetDailyStatistics: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/focusTarget/statistics/daily',
            ...(fetchMiddlewares<RequestHandler>(FocusTargetController)),
            ...(fetchMiddlewares<RequestHandler>(FocusTargetController.prototype.GetDailyStatistics)),

            async function FocusTargetController_GetDailyStatistics(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFocusTargetController_GetDailyStatistics, request, response });

                const controller = new FocusTargetController();

              await templateService.apiHandler({
                methodName: 'GetDailyStatistics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

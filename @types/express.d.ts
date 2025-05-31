import 'express';
import {UserModel} from 'src/models/user.model.ts';

declare global {
  namespace Express {
    export interface User extends UserModel {}
    export interface Response {
      success(success: any): this;
      error(error: {
        errorCode?: string;
        reason?: string | null;
        data?: any | null;
      }): this;
    }
  }
}

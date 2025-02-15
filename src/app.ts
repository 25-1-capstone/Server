import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import process from 'process';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerDocument from '../swagger/swagger.json' assert {type: 'json'};
import {BaseError} from './error.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(
  '/api-docs/',
  swaggerUiExpress.serveFiles(swaggerDocument),
  swaggerUiExpress.setup(swaggerDocument),
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.success = (success: any) => {
    return res.json({resultType: 'SUCCESS', error: null, success});
  };

  res.error = (error: {errorCode?: string; reason?: string; data?: any}) => {
    const {errorCode = 'unknown', reason = null, data = null} = error;
    return res.status(400).json({
      resultType: 'FAIL',
      error: {errorCode, reason, data},
      success: null,
    });
  };

  next();
});

app.get('/', (req, res) => {
  res.send('25-1 Capstone');
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      resultType: 'FAIL',
      error: {
        errorCode: err.code,
        reason: err.message,
        data: err.details,
      },
      success: null,
    });
    return;
  }
  res.status(500).json({
    result: 'FAIL',
    error: {
      errorCode: 'unknown',
      reason: err.message || '예상치 못한 에러가 발생하였습니다.',
      data: null,
    },
    success: null,
  });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

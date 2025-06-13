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
import passport from 'passport';
import session from 'express-session';
import {PrismaSessionStore} from '@quixo3/prisma-session-store';
import cookieParser from 'cookie-parser';
// import {sessionAuthMiddleware} from './auth.config.js';
import {prisma} from './db.config.js';
import {RegisterRoutes} from './routers/tsoaRoutes.js';
import {authRouter} from './routers/auth.router.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  // cors({
  //   origin: ['http://localhost:3000', 'http://18.208.62.86:3000'], // 프론트엔드 주소
  //   credentials: true,
  // }),
  cors(),
);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

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

// Session 설정
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 일주일
      // sameSite: 'lax',
      // secure: false,
      // httpOnly: true,
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      serializer: {
        stringify: (obj: unknown) =>
          JSON.stringify(obj, (_, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          ),
        parse: (str: string) =>
          JSON.parse(str, (_, value) =>
            typeof value === 'string' && /^\d+$/.test(value)
              ? BigInt(value)
              : value,
          ),
      },
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// 로그인 전
app.use('/oauth2', authRouter);

// 인증 미들웨어
// app.use(sessionAuthMiddleware);

// 로그인 후
RegisterRoutes(app);

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

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});

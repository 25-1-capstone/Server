import dotenv from 'dotenv';
import process from 'process';
import {
  Strategy as KakaoStrategy,
  Profile as KakaoProfile,
} from 'passport-kakao';
import {prisma} from './db.config.js';
import {UserModel} from './models/user.model.js';
import {SocialProfile} from './models/auth.model.js';
import {Request, Response, NextFunction} from 'express';
import {ServerError, AuthError, SessionError} from './error.js';
dotenv.config();

const updateOrCreateSocialAccount = async (
  userId: bigint,
  profile: SocialProfile,
  provider: string,
): Promise<void> => {
  const {id: providerUserId} = profile;

  // 기존 SocialAccount 조회
  const existingSocialAccount = await prisma.socialAccount.findFirst({
    where: {provider, providerUserId: providerUserId.toString(), userId},
  });

  const updatedAt = new Date();
  if (existingSocialAccount) {
    // SocialAccount 업데이트
    await prisma.socialAccount.update({
      where: {id: existingSocialAccount.id},
      data: {updatedAt, status: 1},
    });
  } else {
    // 새로운 SocialAccount 생성
    await prisma.socialAccount.create({
      data: {
        provider,
        providerUserId: providerUserId.toString(),
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 1,
      },
    });
  }
};

// 카카오 로그인
export const kakaoStrategy = new KakaoStrategy(
  {
    clientID: process.env.PASSPORT_KAKAO_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECRET!, // Optional in Kakao
    callbackURL: 'http://localhost:3000/oauth2/callback/kakao',
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await verifyUser(profile as KakaoProfile, 'KAKAO');
      cb(null, user as UserModel);
    } catch (err) {
      cb(err);
    }
  },
);

// 사용자 검증 및 생성 함수
const verifyUser = async (
  profile: SocialProfile,
  provider: string,
): Promise<{id: bigint; email: string; name: string}> => {
  const userEmail = (profile as KakaoProfile)._json?.kakao_account?.email;

  if (!userEmail) {
    throw new AuthError({
      reason: `profile.email이 없습니다: ${JSON.stringify(profile)}`,
    });
  }

  // 기존 사용자 조회
  const user = await prisma.user.findFirst({where: {email: userEmail}});

  const userName = profile.displayName || profile.username || 'Kakao User';

  if (user) {
    // SocialAccount 데이터 추가 또는 업데이트
    const {id, email, name} = user;
    await updateOrCreateSocialAccount(id, profile, provider);

    return {id, email, name};
  }

  // 새로운 사용자 생성
  const createdUser = await prisma.user.create({
    data: {
      email: userEmail,
      name: userName,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 2,
    },
  });

  await prisma.focusTarget.createMany({
    data: [
      {target: '핸드폰', userId: createdUser.id},
      {target: '책 읽기', userId: createdUser.id},
      {target: 'PC 보기', userId: createdUser.id},
    ],
  });

  // SocialAccount 데이터 추가
  const {id, email, name} = createdUser;
  await updateOrCreateSocialAccount(id, profile, provider);

  return {id, email, name};
};

//인증 미들웨어
export const sessionAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cookies = req.cookies || {};
    let sessionId = cookies['connect.sid'];

    // 세션 아이디가 없는 경우
    if (!sessionId) {
      throw new SessionError({reason: 'No session ID provided'});
    }

    // 's:' 및 서명 제거
    sessionId = sessionId.split('.')[0].replace(/^s:/, '');

    // 세션 ID가 DB에 존재하는지 확인
    const session = await prisma.session.findUnique({
      where: {sid: sessionId},
    });

    if (!session) {
      throw new SessionError({reason: 'Invalid session ID'});
    }

    // 만료 시간 확인
    const sessionExpiresAt = session.expiresAt;

    if (!sessionExpiresAt || new Date() > sessionExpiresAt) {
      await extendSessionExpiration(sessionId); // 만료일 연장
      return;
    }

    // 세션 인증 완료 시
    next();
  } catch (error) {
    next(error);
  }
};

// 세션 만료일 연장 함수
const extendSessionExpiration = async (sid: string): Promise<void> => {
  try {
    const newExpirationDate = new Date();
    newExpirationDate.setDate(newExpirationDate.getDate() + 7);

    await prisma.session.update({
      where: {sid},
      data: {expiresAt: newExpirationDate},
    });
  } catch {
    throw new ServerError({
      reason: 'Failed to extend session expiration for SID',
    });
  }
};

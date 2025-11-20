import express from 'express';
export const authRouter = express.Router();
import {UserModel} from '../models/user.model.js';

import passport from 'passport';
import {kakaoStrategy} from '../auth.config.js';
import {prisma} from '../db.config.js';

// BigInt를 문자열로 직렬화
(BigInt.prototype as unknown as {toJSON: () => string}).toJSON = function () {
  return this.toString();
};

//passport 전략 설정
passport.use(kakaoStrategy);
// serialize 설정
passport.serializeUser((user, done) => done(null, user));
// deserializeUser 설정
passport.deserializeUser<UserModel>(async (user: UserModel, done) => {
  try {
    // 사용자 조회
    const checkUser = await prisma.user.findUnique({where: {id: user.id}});
    // 사용자 존재 여부 확인
    if (!checkUser) {
      return done(new Error('User not found'), null);
    }
    // 성공적으로 사용자 반환
    done(null, checkUser as UserModel);
  } catch (error) {
    // 에러 처리
    done(error, null);
  }
});

// 카카오 로그인 라우트
authRouter.get(
  '/login/kakao',
  passport.authenticate('kakao', {
    scope: ['profile_nickname', 'account_email'],
  }),
);

// 카카오 로그인 콜백 라우트
authRouter.get(
  '/callback/kakao',
  passport.authenticate('kakao', {failureRedirect: '/'}),
  (req, res) => {
    // 로그인 성공 시 처리
    // res.redirect('/user/mypage'); // 온보딩 페이지로 리디렉션(예정)
    // res.redirect('https://ai-study-lens.p-e.kr/onboarding');
    res.redirect('http://localhost:3000/onboarding')
  },
);

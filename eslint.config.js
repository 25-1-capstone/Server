import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'node_modules',
      'scripts',
      'tsconfig.json',
      'eslint.config.js',
      'dist',
    ],
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tseslint.parser, // TypeScript 파서
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json', // tsconfig.json 경로 추가
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin, // 플러그인을 객체로 추가
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-namespace': 'off', // namespace 허용
      '@typescript-eslint/no-explicit-any': 'warn', // 명시적 any 사용 경고
      '@typescript-eslint/no-unused-vars': 'error', // 사용하지 않는 변수 금지
      'no-console': 'warn', // console 사용 경고
      'prefer-const': 'warn', // let 대신 const 사용 권장
      'prefer-template': 'warn', // 문자열 연결 대신 템플릿 리터럴 사용 권장
      'no-shadow': 'warn', // 외부 변수와 중복 변수 선언 경고
      eqeqeq: ['error', 'always'], // == 대신 === 사용 권장
      'no-duplicate-imports': 'error', // 중복 import 경고
      'no-var': 'error', // var 사용 금지
      'no-undef': 'off', // 선언되지 않은 변수 사용 일시적 허용 (로컬 테스트)
      'no-const-assign': 'error', // const 재할당 금지
    },
  },
];

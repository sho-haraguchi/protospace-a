import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import UserDetailPage from '../page';

// 外部モジュールのモック設定 (Mocking)
// 1. axios通信をモック化して、実際のサーバー（バックエンドAPI）へのアクセスを防ぐ
jest.mock('axios');

// 2. Next.js App Router のナビゲーション用フックおよび関数（useParams, useRouter, notFound）をモック化
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ push: jest.fn() }),
  notFound: jest.fn(), // 該当ユーザーが存在しない場合の 404 リダイレクト処理用
}));

// モックデータの定義
// バックエンドAPIから返されるデータ構造 (data.user / data.prototypes) に合わせて設定
const mockApiResponse = {
  data: {
    user: {
      id: 1,
      name: 'テストユーザー',
      profile: 'こんにちは、テストユーザーです。',
      occupation: 'エンジニア',
      position: 'リード',
    },
    prototypes: [
      {
        id: 10,
        name: 'ユーザーのプロトタイプ1',
        slogan: 'すごいプロトタイプ',
        concept: 'コンセプト1',
        image: 'proto1.jpg',
      },
    ],
  },
};

describe('ユーザー詳細ページ (app/users/[id]/page.jsx)', () => {
  // 各テストケースが実行される前の共通前処理
  beforeEach(() => {
    jest.clearAllMocks(); // モック関数の呼び出し履歴や返り値をリセット
    
    // axios.get が実行された際に、定義したダミーレスポンス（mockApiResponse）を返すよう設定
    axios.get.mockResolvedValue(mockApiResponse);
  });

  // 1. 正常系のテスト
  test('1. 正常系: URLの id パラメータに基づいてユーザー情報と投稿一覧が表示されること', async () => {
    // Next.js の Server Component に渡す params プロミスを用意
    const paramsPromise = Promise.resolve({ id: '1' });

    // Server Component を非同期実行して JSX 要素を取得後、テスト環境（jsdom）に描画
    const pageComponent = await UserDetailPage({ params: paramsPromise });
    render(pageComponent);

    // APIから取得したユーザー名とプロフィールが画面上に正しく表示されているか検証
    await waitFor(() => {
      expect(screen.getByText('テストユーザー')).toBeInTheDocument();
      expect(screen.getByText('こんにちは、テストユーザーです。')).toBeInTheDocument();
    });

    // ユーザーが投稿したプロトタイプ名が表示されていることを検証
    expect(screen.getByText('ユーザーのプロトタイプ1')).toBeInTheDocument();
  });
});
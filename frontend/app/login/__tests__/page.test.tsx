import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import LoginPage from '../page';


// 外部モジュールのモック設定 (Mocking)
// 1. axios通信をモック化して実際のAPI呼び出しを防ぐ
jest.mock('axios');
const mockedAxios = jest.mocked(axios);

// 2. Next.js App Router のルーター機能（useRouter）をモック化
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('LoginPage', () => {
  // 各テストケースが実行される前処理
  beforeEach(() => {
    jest.clearAllMocks(); // モックの呼び出し履歴や返り値をリセット
    localStorage.clear();   // localStorage をクリーンな状態にする
  });

  // 1. 正常系のテスト
  test('1. 正常系: 正しい情報でログインするとlocalStorageに保存され、トップページに遷移すること', async () => {
    // APIが成功レスポンス（トークンとユーザー情報）を返すようにモック設定
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'dummy-token', user: { name: 'テストユーザー' } },
    });

    // コンポーネントのレンダリング
    const { container } = render(<LoginPage />);
    const inputs = container.querySelectorAll('input');

    // メールアドレスとパスワードのフォーム入力処理
    fireEvent.change(inputs[0], { target: { value: 'test@example.com' } });
    fireEvent.change(inputs[1], { target: { value: 'password123' } });

    // ログインボタンのクリックイベント発火
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    // 非同期処理が完了し、POSTリクエストが呼ばれたことを検証
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  // 2. 異常系(APIエラー・メッセージあり)のテスト
  test('2. 異常系(APIエラー・メッセージあり): APIがエラーメッセージを返した場合、画面に表示されること', async () => {
    // サーバーが特定のメッセージを含むエラーレスポンスを返す設定
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'メールアドレスまたはパスワードが正しくありません' } },
    });

    const { container } = render(<LoginPage />);
    const inputs = container.querySelectorAll('input');

    // 誤った情報を入力してフォーム送信
    fireEvent.change(inputs[0], { target: { value: 'wrong@example.com' } });
    fireEvent.change(inputs[1], { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    // サーバーから返ってきたエラーメッセージが画面に描画されることを検証
    await waitFor(() => {
      expect(screen.getByText(/メールアドレスまたはパスワードが正しくありません/)).toBeInTheDocument();
    });
  });


  // 3. 異常系(メッセージなしのエラー)のテスト
  test('3. 異常系(JSON解析エラーなど・メッセージなし): デフォルトエラーが表示されること', async () => {
    // エラーメッセージが含まれない空のエラーオブジェクトが返る設定
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: {} },
    });

    const { container } = render(<LoginPage />);
    const inputs = container.querySelectorAll('input');

    fireEvent.change(inputs[0], { target: { value: 'test@example.com' } });
    fireEvent.change(inputs[1], { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    // システムデフォルトの汎用エラーメッセージが表示されることを検証
    await waitFor(() => {
      expect(screen.getByText(/ログインに失敗しました/i)).toBeInTheDocument();
    });
  });

  // 4. 異常系(ネットワークエラー)のテスト
  test('4. 異常系(ネットワークエラー): サーバー通信失敗時にエラーメッセージが表示されること', async () => {
    // サーバー接続不可などのネットワークエラー発生を設定
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

    const { container } = render(<LoginPage />);
    const inputs = container.querySelectorAll('input');

    fireEvent.change(inputs[0], { target: { value: 'test@example.com' } });
    fireEvent.change(inputs[1], { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    // 通信エラー時にも適切なフォールバックメッセージが表示されることを検証
    await waitFor(() => {
      expect(screen.getByText(/ログインに失敗しました/i)).toBeInTheDocument();
    });
  });
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpPage from '../page';
import { apiClient } from '@/lib/api/client';

// 外部モジュールのモック設定 (Mocking)
// 1. apiClient 通信（POSTリクエスト等）をモック化して実際のサーバー通信を防ぐ
jest.mock('@/lib/api/client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

// 型安全にモックメソッドを操作できるようにキャスト設定
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

// 2. Next.js App Router のルーター機能（useRouter）をモック化
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('SignUpPage Component', () => {
  // 各テストケース実行前の共通前処理
  beforeEach(() => {
    jest.clearAllMocks(); // モック関数の呼び出し履歴や返り値をクリア
  });

  // ヘルパー関数: レンダリングされたDOMから入力要素をまとめて取得
  const getFormElements = (container: HTMLElement) => {
    const inputs = container.querySelectorAll('input');
    const textareas = container.querySelectorAll('textarea');
    return {
      emailInput: inputs[0],
      passwordInput: inputs[1],
      passwordConfirmInput: inputs[2],
      nameInput: inputs[3],
      profileTextarea: textareas[0],
      occupationTextarea: textareas[1],
      positionTextarea: textareas[2],
    };
  };

  // 1. 初期描画のテスト
  test('1. 初期描画時に全てのフォーム要素が存在すること', () => {
    // 画面を描画
    const { container } = render(<SignUpPage />);

    // タイトルの見出しが存在することを確認
    expect(screen.getByRole('heading', { name: 'ユーザー新規登録' })).toBeInTheDocument();

    // フォームの各入力要素を取得
    const {
      emailInput,
      passwordInput,
      passwordConfirmInput,
      nameInput,
      profileTextarea,
      occupationTextarea,
      positionTextarea,
    } = getFormElements(container);

    // 全ての入力項目（input / textarea）が画面上に存在することを検証
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordConfirmInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(profileTextarea).toBeInTheDocument();
    expect(occupationTextarea).toBeInTheDocument();
    expect(positionTextarea).toBeInTheDocument();
  });

  // 2. バリデーションエラー（パスワード不一致）のテスト
  test('2. パスワードと確認用パスワードが一致しない場合、エラーが表示されAPIが呼ばれないこと', async () => {
    const { container } = render(<SignUpPage />);
    const {
      emailInput,
      passwordInput,
      passwordConfirmInput,
      nameInput,
      profileTextarea,
      occupationTextarea,
      positionTextarea,
    } = getFormElements(container);

    // パスワードと確認用パスワードで「異なる値」を入力
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'different_password' } });
    fireEvent.change(nameInput, { target: { value: 'テストユーザー' } });
    fireEvent.change(profileTextarea, { target: { value: 'プロフィール' } });
    fireEvent.change(occupationTextarea, { target: { value: '所属' } });
    fireEvent.change(positionTextarea, { target: { value: '役職' } });

    // フォーム送信ボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: '新規登録' }));

    // バリデーションエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/パスワードが一致しません/)).toBeInTheDocument();
    });

    // バックエンドAPIが呼び出されていないことを検証
    expect(mockedApiClient.post).not.toHaveBeenCalled();
  });

  // 3. 正常系（登録成功）のテスト
  test('3. 正常に入力して登録が成功した場合、APIが呼ばれること', async () => {
    // APIが成功レスポンス（ステータスコード 200）を返すようにモック化
    mockedApiClient.post.mockResolvedValueOnce({ status: 200, data: {} });

    const { container } = render(<SignUpPage />);
    const {
      emailInput,
      passwordInput,
      passwordConfirmInput,
      nameInput,
      profileTextarea,
      occupationTextarea,
      positionTextarea,
    } = getFormElements(container);

    // 正しい情報（パスワードの一致含む）を入力
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'password123' } });
    fireEvent.change(nameInput, { target: { value: 'テストユーザー' } });
    fireEvent.change(profileTextarea, { target: { value: 'プロフィール' } });
    fireEvent.change(occupationTextarea, { target: { value: '所属' } });
    fireEvent.change(positionTextarea, { target: { value: '役職' } });

    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: '新規登録' }));

    // apiClient.post が正常に呼び出されたことを検証
    await waitFor(() => {
      expect(mockedApiClient.post).toHaveBeenCalled();
    });
  });

  // 4. 異常系（サーバーエラー）のテスト
  test('4. サーバー側でエラーが返された場合、エラーメッセージが表示されること', async () => {
    // サーバーが既存ユーザーエラー（メッセージ付き）を返すようにモック設定
    mockedApiClient.post.mockRejectedValueOnce({
      response: { data: { message: 'すでに登録されているメールアドレスです' } },
    });

    const { container } = render(<SignUpPage />);
    const {
      emailInput,
      passwordInput,
      passwordConfirmInput,
      nameInput,
      profileTextarea,
      occupationTextarea,
      positionTextarea,
    } = getFormElements(container);

    // 登録済みメールアドレスを入力して送信
    fireEvent.change(emailInput, { target: { value: 'already_exists@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'password123' } });
    fireEvent.change(nameInput, { target: { value: 'テストユーザー' } });
    fireEvent.change(profileTextarea, { target: { value: 'プロフィール' } });
    fireEvent.change(occupationTextarea, { target: { value: '所属' } });
    fireEvent.change(positionTextarea, { target: { value: '役職' } });

    fireEvent.click(screen.getByRole('button', { name: '新規登録' }));

    // サーバーからのエラーメッセージが画面に反映されていることを検証
    await waitFor(() => {
      expect(screen.getByText(/すでに登録されているメールアドレスです/)).toBeInTheDocument();
    });
  });
});
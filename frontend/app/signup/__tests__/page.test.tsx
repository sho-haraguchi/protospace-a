import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpPage from '../page';
import '@testing-library/jest-dom';

// fetch のモック（ダミー化）
global.fetch = jest.fn();

describe('SignUpPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. 初期描画時に全てのフォーム要素が存在すること', () => {
    render(<SignUpPage />);

    expect(screen.getByRole('heading', { name: 'ユーザー新規登録' })).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード（6文字以上）')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード再入力')).toBeInTheDocument();
    expect(screen.getByLabelText('ユーザー名')).toBeInTheDocument();
    expect(screen.getByLabelText('プロフィール')).toBeInTheDocument();
    expect(screen.getByLabelText('所属')).toBeInTheDocument();
    expect(screen.getByLabelText('役職')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '新規登録' })).toBeInTheDocument();
  });

  test('2. パスワードと確認用パスワードが一致しない場合、エラーが表示されAPIが呼ばれないこと', async () => {
    render(<SignUpPage />);

    // 入力処理
    fireEvent.change(screen.getByLabelText('メールアドレス'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('パスワード（6文字以上）'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('パスワード再入力'), { target: { value: 'different_password' } });
    fireEvent.change(screen.getByLabelText('ユーザー名'), { target: { value: 'テストユーザー' } });

    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: '新規登録' }));

    // エラーメッセージの確認
    expect(await screen.findByText('❌ パスワードが一致しません。')).toBeInTheDocument();
    
    // API通信（fetch）が一度も実行されていないことを検証
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('3. 正常に入力して登録が成功した場合、成功メッセージが表示されフォームがクリアされること', async () => {
    // APIが成功レスポンス（200 OK）を返すように設定
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    render(<SignUpPage />);

    // 入力処理
    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード（6文字以上）');
    const passwordConfirmInput = screen.getByLabelText('パスワード再入力');
    const nameInput = screen.getByLabelText('ユーザー名');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'password123' } });
    fireEvent.change(nameInput, { target: { value: 'テストユーザー' } });

    // 送信
    fireEvent.click(screen.getByRole('button', { name: '新規登録' }));

    // APIリクエストのパラメータを検証
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/users', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'password123',
          name: 'テストユーザー',
          profile: '',
          affiliation: '',
          position: '',
        }),
      }));
    });

    // 成功メッセージの表示確認
    expect(await screen.findByText('🎉 登録が完了しました！')).toBeInTheDocument();

    // フォームがリセットされていることを確認
    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
    expect(nameInput).toHaveValue('');
  });

  test('4. サーバー側でエラーが返された場合、エラーメッセージが表示されること', async () => {
    // APIがエラーレスポンス（400 Bad Requestなど）を返すように設定
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'メールアドレスは既に登録されています。' }),
    });

    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText('メールアドレス'), { target: { value: 'already_exists@example.com' } });
    fireEvent.change(screen.getByLabelText('パスワード（6文字以上）'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('パスワード再入力'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('ユーザー名'), { target: { value: 'テストユーザー' } });

    fireEvent.click(screen.getByRole('button', { name: '新規登録' }));

    // 返されたエラーメッセージが表示されることを確認
    expect(await screen.findByText('❌ メールアドレスは既に登録されています。')).toBeInTheDocument();
  });
});
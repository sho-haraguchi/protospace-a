import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../page';

// --- モックのセットアップ ---
// 1. fetchAPIのモック化
global.fetch = jest.fn();

// 2. localStorageのモック化
const mockSetItem = jest.fn();
Object.defineProperty(window, 'localStorage', {
  value: { setItem: mockSetItem },
  writable: true,
});

// 3. window.locationのモック化 (JSDOM環境でhrefを変更できるようにする)
const originalLocation = window.location;
beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    enumerable: true,
    value: { href: '' }, // hrefのみを持つダミーオブジェクトをセット
  });
});

afterAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    enumerable: true,
    value: originalLocation, // テストが終わったら元に戻す
  });
});

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = ''; // 遷移先URLを初期化
  });

  test('1. 正常系: 正しい情報でログインするとlocalStorageに保存され、トップページに遷移すること', async () => {
    // 準備: API通信が成功する設定
    const mockUser = { id: 1, name: 'テストユーザー', email: 'test@example.com' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(<LoginPage />);

    // 入力と送信
    // ※ label と input が紐付いていないため、placeholder で要素を取得します
    await userEvent.type(screen.getByPlaceholderText('example@example.com'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('パスワードを入力'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // 検証: 正しいURLとパラメータでfetchが呼ばれたか
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/users/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        })
      );
    });

    // 検証: localStorageにデータが保存されたか
    expect(mockSetItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));

    // 検証: トップページへ遷移したか
    expect(window.location.href).toBe('/');
  });

  test('2. 異常系(APIエラー・メッセージあり): APIがエラーメッセージを返した場合、画面に表示されること', async () => {
    // 準備: ログイン失敗 ＆ エラーメッセージが存在する場合
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'メールアドレスが存在しません' }),
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText('example@example.com'), 'wrong@example.com');
    await userEvent.type(screen.getByPlaceholderText('パスワードを入力'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // 検証: APIからのエラーメッセージが表示されること
    expect(await screen.findByText('❌ メールアドレスが存在しません')).toBeInTheDocument();
    
    // 検証: ページ遷移や保存が行われていないこと
    expect(mockSetItem).not.toHaveBeenCalled();
    expect(window.location.href).toBe('');
  });

  test('3. 異常系(JSON解析エラーなど・メッセージなし): APIがメッセージ無しでエラーを返した場合、デフォルトエラーが表示されること', async () => {
    // 準備: JSONが返ってこない場合（例外発生シミュレート）
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => { throw new Error('Unexpected token'); }, 
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText('example@example.com'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('パスワードを入力'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // 検証: デフォルトのエラーメッセージが表示されること
    expect(
      await screen.findByText('❌ ログインに失敗しました。メールアドレスまたはパスワードを確認してください。')
    ).toBeInTheDocument();
  });

  test('4. 異常系(ネットワークエラー): サーバー通信失敗時にエラーメッセージが表示されること', async () => {
    // 準備: サーバーが落ちている等で fetch 自体が失敗する場合
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText('example@example.com'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('パスワードを入力'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // 検証: catchブロックのエラーメッセージが表示されること
    expect(await screen.findByText('⚠️ サーバーとの通信に失敗しました。')).toBeInTheDocument();
  });
});
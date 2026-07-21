package in.tech_camp.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import in.tech_camp.backend.entity.UserEntity;
import in.tech_camp.backend.form.LoginForm;
import in.tech_camp.backend.form.UserForm;
import in.tech_camp.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserForm validForm;

    @BeforeEach
    void setUp() {
        validForm = new UserForm();
        validForm.setEmail("test@example.com");
        validForm.setPassword("password123");
        validForm.setPasswordConfirmation("password123");
        validForm.setName("テストユーザー");
        validForm.setProfile("プロフィール");
        validForm.setAffiliation("所属");
        validForm.setPosition("役職");
    }

    @Test
    @DisplayName("2-1. 正常系: ユーザー情報が正しくDBに保存されること")
    void registerUser_Success() {
        // 🌟 重複なし（ユーザーが存在しない）場合は null を返すように設定
        when(userRepository.findByEmail(validForm.getEmail())).thenReturn(null);
        
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password123");

        // 実行
        userService.registerUser(validForm);

        // userRepository.save() が 1 回呼ばれたことを検証
        verify(userRepository, times(1)).insert(any(UserEntity.class));
    }

    @Test
    @DisplayName("2-2. 重複エラー: すでに存在するメールアドレスの場合は例外が発生し、保存されないこと")
    void registerUser_DuplicateEmail_ThrowsException() {
        // 🌟 既存ユーザーが存在する場合は素の existingUser オブジェクトを返す
        UserEntity existingUser = new UserEntity();
        when(userRepository.findByEmail(validForm.getEmail())).thenReturn(existingUser);

        // 例外が発生することを検証
        assertThrows(IllegalArgumentException.class, () -> {
            userService.registerUser(validForm);
        });

        // 保存処理が一度も実行されないことを検証
        verify(userRepository, never()).insert(any(UserEntity.class));
    }

    @Test
    @DisplayName("2-3. 暗号化処理: パスワードがハッシュ化されて保存処理へ渡されること")
    void registerUser_PasswordIsEncrypted() {
        // 🌟 ここも null に変更
        when(userRepository.findByEmail(validForm.getEmail())).thenReturn(null);
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password123");

        userService.registerUser(validForm);

        verify(passwordEncoder, times(1)).encode("password123");
    }

    // ==========================================
    // ▼ ここからログイン機能のテスト ▼
    // ==========================================

    @Test
    @DisplayName("3-1. ログイン正常系: 正しいメールとパスワードでユーザーが取得できること")
    void login_Success() {
        // 🌟 準備: DBから取得できるユーザーをモック化
        UserEntity mockUser = new UserEntity();
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("hashed_password123"); 

        when(userRepository.findByEmail("test@example.com")).thenReturn(mockUser);
        
        // パスワード照合のモック設定
        when(passwordEncoder.matches("password123", "hashed_password123")).thenReturn(true);

        // 🌟 修正ポイント: LoginForm オブジェクトを作って渡す
        LoginForm loginForm = new LoginForm();
        loginForm.setEmail("test@example.com");
        loginForm.setPassword("password123");
        
        // 実行
        UserEntity result = userService.login(loginForm);

        // 検証
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    @DisplayName("3-2. ログイン異常系: 存在しないメールアドレスの場合、ログイン失敗（nullが返る等）すること")
    void login_Fail_UserNotFound() {
        when(userRepository.findByEmail("wrong@example.com")).thenReturn(null);

        // 🌟 修正ポイント: LoginForm オブジェクトを作って渡す
        LoginForm loginForm = new LoginForm();
        loginForm.setEmail("wrong@example.com");
        loginForm.setPassword("password123");

        // 実行
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.login(loginForm);
        });

        // 検証
        assertEquals("メールアドレスまたはパスワードが正しくありません。", exception.getMessage());
    }

    @Test
    @DisplayName("3-3. ログイン異常系: パスワードが間違っている場合、ログイン失敗すること")
    void login_Fail_WrongPassword() {
        UserEntity mockUser = new UserEntity();
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("hashed_password123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(mockUser);
        
        // パスワード照合で false（不一致）を返すように設定
        when(passwordEncoder.matches("wrong_password", "hashed_password123")).thenReturn(false);

        // 🌟 修正ポイント: LoginForm オブジェクトを作って渡す
        LoginForm loginForm = new LoginForm();
        loginForm.setEmail("test@example.com");
        loginForm.setPassword("wrong_password"); // わざと間違ったパスワードをセット

        // 実行
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.login(loginForm);
        }); 

        // 検証
        assertEquals("メールアドレスまたはパスワードが正しくありません。", exception.getMessage());
    }
}
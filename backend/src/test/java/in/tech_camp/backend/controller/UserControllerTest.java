package in.tech_camp.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.validation.BindingResult;

import in.tech_camp.backend.form.UserForm;
import in.tech_camp.backend.service.UserService;

@ExtendWith(MockitoExtension.class) 
class UserControllerTest {

    @Mock
    private UserService userService; // 依存先をモック化

    @InjectMocks
    private UserController userController; // モックを注入したテスト対象

    private UserForm validForm;

    @BeforeEach
    void setUp() {
        validForm = new UserForm();
        validForm.setEmail("test@example.com");
        validForm.setPassword("password123");
        validForm.setPasswordConfirmation("password123");
        validForm.setName("テストユーザー");
        validForm.setProfile("プロフィールです");
        validForm.setAffiliation("所属");
        validForm.setPosition("役職");
    }

    @Test
    void registerUser_Success() {
        BindingResult bindingResult = mock(BindingResult.class);
        // コントローラーのメソッドを呼び出す
        userController.createUser(validForm, bindingResult);

        // UserServiceのメソッドが呼ばれたか検証
        verify(userService).registerUser(any(UserForm.class));
    }

    @Test
    @DisplayName("1-1. 任意項目（プロフィール・所属・役職）が空でも正常に登録できること")
    void createUser_Success_WithOptionalFieldsEmpty() {
        // 任意項目を空にしてテスト
        validForm.setProfile("");
        validForm.setAffiliation("");
        validForm.setPosition("");

        BindingResult bindingResult = mock(BindingResult.class);
        when(bindingResult.hasErrors()).thenReturn(true);

        userController.createUser(validForm, bindingResult);

        // サービスが問題なく呼ばれることを検証
        verify(userService, never()).registerUser(any(UserForm.class));
    }

    @Test
    @DisplayName("1-2. バリデーションエラーが存在する場合、UserServiceが呼び出されないこと")
    void createUser_ValidationError_ShouldNotCallService() {
        BindingResult bindingResult = mock(BindingResult.class);
        // バリデーションエラーがある状態（true）を模擬
        when(bindingResult.hasErrors()).thenReturn(true);

        userController.createUser(validForm, bindingResult);

        // バリデーションエラー時は userService.registerUser が一度も呼ばれていないことを検証
        verify(userService, never()).registerUser(any(UserForm.class));
    }

    @Test
    @DisplayName("1-3. パスワードが5文字以下（境界値）の場合のバリデーションエラーチェック")
    void createUser_PasswordTooShort() {
        validForm.setPassword("12345"); // 5文字（6文字未満）
        validForm.setPasswordConfirmation("12345");

        BindingResult bindingResult = mock(BindingResult.class);
        when(bindingResult.hasErrors()).thenReturn(true); // バリデーションエラー発生

        userController.createUser(validForm, bindingResult);

        // エラーのためServiceは呼ばれない
        verify(userService, never()).registerUser(any(UserForm.class));
    }

    @Test
    @DisplayName("1-4. パスワードと確認用パスワードが不一致の場合、UserServiceが呼び出されないこと")
    void createUser_PasswordMismatch_ShouldNotCallService() {
        validForm.setPasswordConfirmation("differentPassword123");

        BindingResult bindingResult = mock(BindingResult.class);
        // パスワード不一致等でエラーがある状態を定義
        when(bindingResult.hasErrors()).thenReturn(true);

        userController.createUser(validForm, bindingResult);

        // Serviceが実行されないことを検証
        verify(userService, never()).registerUser(any(UserForm.class));
    }
}
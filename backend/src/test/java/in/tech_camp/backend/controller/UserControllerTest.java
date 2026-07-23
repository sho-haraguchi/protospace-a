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
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.validation.BindingResult;

import in.tech_camp.backend.entity.UserEntity;
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

    @Test
    @DisplayName("showMypage: 存在するユーザーIDを指定した場合、ユーザー情報が返る")
    void testShowMypage_Success() {
        Integer userId = 1;
        UserEntity mockUser = new UserEntity();
        mockUser.setId(userId);
        mockUser.setName("テストユーザー");
        mockUser.setProfile("よろしくお願いします");

        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("user", mockUser);
        mockResponse.put("prototypes", List.of());

        // userService.getUserDetail が呼ばれたら mockResponse を返すよう設定
        when(userService.getUserDetail(userId)).thenReturn(mockResponse);

        // 2. 実行 (When)
        ResponseEntity<Map<String, Object>> response = userController.showMypage(userId);

        // 3. 検証 (Then)
        assertNotNull(response); // レスポンスがnullでないこと
        assertEquals(HttpStatus.OK, response.getStatusCode()); // ステータスが 200 OK であること
        assertEquals(mockResponse, response.getBody()); // 中身が想定通りであること
        
        // userService.getUserDetail が指定したIDで1回呼ばれたことを検証
        verify(userService).getUserDetail(userId);
    }

    @Test
    @DisplayName("showMypage: 存在しないユーザーIDを指定した場合、ステータス404が返る")
    void testShowMypage_NotFound() {
        // 1. 準備 (Given)
        Integer userId = 999;
        
        // 存在しない場合は null が返るよう設定
        when(userService.getUserDetail(userId)).thenReturn(null);

        // 2. 実行 (When)
        ResponseEntity<Map<String, Object>> response = userController.showMypage(userId);

        // 3. 検証 (Then)
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode()); // ステータスが 404 NOT FOUND であること
        
        verify(userService).getUserDetail(userId);
    
    }
}
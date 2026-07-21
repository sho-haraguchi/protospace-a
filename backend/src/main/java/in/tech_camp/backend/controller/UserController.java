package in.tech_camp.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import in.tech_camp.backend.entity.UserEntity;
import in.tech_camp.backend.form.LoginForm;
import in.tech_camp.backend.form.UserForm;
import in.tech_camp.backend.service.UserService;
import lombok.RequiredArgsConstructor;

@Controller
@ResponseBody
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

  /**
   * 新規ユーザー登録処理（createUser）
   */
  @PostMapping
  public ResponseEntity<?> createUser(@Validated @RequestBody UserForm userForm, BindingResult bindingResult) {

    // バリデーションエラーチェック
    if (bindingResult.hasErrors()) {
      Map<String, String> errors = new HashMap<>();
      bindingResult.getFieldErrors().forEach(error ->
           errors.put(error.getField(), error.getDefaultMessage())
      );
      // エラー一覧を返す
      return ResponseEntity.badRequest().body(errors);
    }

    try {
      // データベースに保存
      userService.registerUser(userForm);
      
      // 返却用のJSONボディ（Map）を作成
      Map<String, String> responseBody = new HashMap<>();
      responseBody.put("message", "ユーザー登録が完了しました");
      
      // JSON形式でレスポンスボディを返す
      return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
    } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
  }

  /**
   * ログイン処理（API）
   * Next.jsから送られてきたログイン情報を受け取って認証。
   */
  @PostMapping("login")
  public ResponseEntity<?> login(@Validated @RequestBody LoginForm loginForm, BindingResult bindingResult) {
      // バリデーションエラー（未入力チェックなど）
      if (bindingResult.hasErrors()) {
          Map<String, String> errors = new HashMap<>();
          bindingResult.getFieldErrors().forEach(error ->
              errors.put(error.getField(), error.getDefaultMessage())
          );
          return ResponseEntity.badRequest().body(errors);
      }
      try {
        // サービスを呼び出しログイン判定
        UserEntity loggedInUser = userService.login(loginForm);

        loggedInUser.setPassword(null);

        // ログイン成功：ユーザー情報をステータス200（OK）で返す
        return ResponseEntity.ok(loggedInUser);

      } catch (RuntimeException e) {
        // ログイン失敗：エラーメッセージをステータス401（Unauthorized = 認証未許可）で返す
        Map<String, String> error = new HashMap<>();
        error.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
      }
  }
  
  /**
     * ログアウト処理（API）
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "ログアウトしました");
        return ResponseEntity.ok(response);
    }
  /**
   * ログイン画面表示（showLogin）
   */



  /**
   * ログイン失敗時、再度ログイン画面へ遷移させる処理（loginError）
   */



  /**
   * ユーザー詳細ページ表示（showMypage）
   */
}
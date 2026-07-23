package in.tech_camp.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import in.tech_camp.backend.entity.UserEntity;
import in.tech_camp.backend.form.LoginForm;
import in.tech_camp.backend.form.UserForm;
import in.tech_camp.backend.service.UserService;
import jakarta.servlet.http.HttpSession;
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
    public ResponseEntity<?> createUser(
            @Validated @RequestBody UserForm userForm, 
            BindingResult bindingResult,
            HttpSession session) {

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

            UserEntity registeredUser = userService.registerUser(userForm);
            
            if (session != null) {
                session.setAttribute("user", registeredUser);
            }

            registeredUser.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);

        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 単体テスト（UserControllerTest）互換用メソッド
     */
    public ResponseEntity<?> createUser(UserForm userForm, BindingResult bindingResult) {
        return createUser(userForm, bindingResult, null);
    }

    /**
     * ログイン処理
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Validated @RequestBody LoginForm loginForm,
            BindingResult bindingResult,
            HttpSession session) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            UserEntity loggedInUser = userService.login(loginForm);

            session.setAttribute("user", loggedInUser);

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
     * ログイン中ユーザー情報取得 API（Headerコンポーネント用）
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    /**
     * ログアウト処理（API）
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "ログアウトしました");
        return ResponseEntity.ok(response);
    }

  /**
   * ユーザー詳細ページ表示（showMypage）
   */
  @GetMapping("/{id}")
  public ResponseEntity<Map<String, Object>> showMypage(@PathVariable Integer id) {
      // Serviceからユーザー情報とプロトタイプ一覧のMapを受け取る
      Map<String, Object> response = userService.getUserDetail(id);

      // ユーザーが存在しない場合は 404 Not Found を返す
      if (response == null) {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }

      // 取得できた場合は 200 OK とともにデータを返す
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
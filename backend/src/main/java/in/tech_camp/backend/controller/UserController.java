package in.tech_camp.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import in.tech_camp.backend.custom_user.CustomUserDetail;
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
                setSpringSecurityContext(registeredUser, session);
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
            // 1. UserServiceでDBとの認証チェックを行う
            UserEntity loggedInUser = userService.login(loginForm);

            // 2. Spring Security 認証コンテキストの作成 & セッション保存を一括実行
            setSpringSecurityContext(loggedInUser, session);

            // 3. アプリケーション独自のセッション保存
            session.setAttribute("user", loggedInUser);

            // パスワードをレスポンスに含めないためのクリア処理
            loggedInUser.setPassword(null);

            // ログイン成功
            return ResponseEntity.ok(loggedInUser);

        } catch (RuntimeException e) {
            // ログイン失敗（401 Unauthorized）
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
        SecurityContextHolder.clearContext();

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
     * Spring Security に認証完了を伝え、@AuthenticationPrincipal が利用できる状態にしてセッションに保持する
     */
    private void setSpringSecurityContext(UserEntity loggedInUser, HttpSession session) {
        // 1. CustomUserDetail の作成
        CustomUserDetail userDetails = new CustomUserDetail(loggedInUser);
        // 2. 認証トークンの作成
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, 
                null, 
                userDetails.getAuthorities()
        );
        // 3. SecurityContext の作成とスレッドへの設定
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
        // 4. セッションへ Context を明示的に紐付け
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
        }
    

    /**
     * ユーザー情報更新処理（updateUser）
     */
    @PutMapping
    public ResponseEntity<?> updateUser(
            @RequestBody UserForm userEditForm,
            HttpSession session) {

        UserEntity sessionUser = (UserEntity) session.getAttribute("user");
        if (sessionUser == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "ログインが必要です。");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        try {
            // userRepository ではなく userService のメソッドを呼び出す
            UserEntity updatedUser = userService.updateUser(sessionUser.getId(), userEditForm);

            // セッションと SecurityContext の更新
            setSpringSecurityContext(updatedUser, session);
            session.setAttribute("user", updatedUser);

            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);

        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "更新処理に失敗しました。");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
     }
    }
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

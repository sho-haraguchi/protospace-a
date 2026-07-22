package in.tech_camp.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import in.tech_camp.backend.entity.UserEntity;
import in.tech_camp.backend.form.LoginForm;
import in.tech_camp.backend.form.UserForm;
import in.tech_camp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
  
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     *  ユーザー登録処理
     */
    public void registerUser(UserForm userForm) {

      // メールアドレスの重複チェック
      UserEntity existingUser = userRepository.findByEmail(userForm.getEmail());
      if (existingUser != null) {
          throw new IllegalArgumentException("このメールアドレスは既に登録されています");
      }

      // パスワード確認用の一致チェック
      if (!userForm.getPassword().equals(userForm.getPasswordConfirmation())) 
          throw new IllegalArgumentException("パスワードと確認用パスワードが一致しません");
      // FormからEntityへデータを詰め替え
      UserEntity userEntity = new UserEntity();
      userEntity.setName(userForm.getName());
      userEntity.setEmail(userForm.getEmail());
      userEntity.setProfile(userForm.getProfile());
      userEntity.setAffiliation(userForm.getAffiliation());
      userEntity.setPosition(userForm.getPosition());

      // パスワードをハッシュ化
      String hashedPassword = passwordEncoder.encode(userForm.getPassword());
      userEntity.setPassword(hashedPassword);

      // データベースに保存
      userRepository.insert(userEntity);
    }

    /**
     * ログイン認証処理
     */
    public UserEntity login(LoginForm loginForm) {
      // メールアドレスでユーザーを検索
      UserEntity user = userRepository.findByEmail(loginForm.getEmail());

      // ユーザーが存在しない、またはパスワードが一致しない場合はエラー
      if (user == null || !passwordEncoder.matches(loginForm.getPassword(), user.getPassword())) {
          throw new RuntimeException("メールアドレスまたはパスワードが正しくありません。");
      }

      // 認証成功なら、ログインユーザーの情報を返す
      return user;
    }
}
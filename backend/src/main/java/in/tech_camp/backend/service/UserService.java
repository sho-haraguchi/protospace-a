package in.tech_camp.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import in.tech_camp.backend.entity.UserEntity;
import in.tech_camp.backend.form.LoginForm;
import in.tech_camp.backend.form.UserForm;
import in.tech_camp.backend.repository.UserRepository;
import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.repository.PrototypeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PrototypeRepository prototypeRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * ユーザー登録処理
     */
    public UserEntity registerUser(UserForm userForm) {

        // メールアドレスの重複チェック
        UserEntity existingUser = userRepository.findByEmail(userForm.getEmail());
        if (existingUser != null) {
            throw new IllegalArgumentException("このメールアドレスは既に登録されています");
        }

        // パスワード確認用の一致チェック
        if (!userForm.getPassword().equals(userForm.getPasswordConfirmation())) {
            throw new IllegalArgumentException("パスワードと確認用パスワードが一致しません");
        }

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

        return userEntity;
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

    /**
     * ユーザー情報とプロトタイプを取得するメソッド
     */
    public Map<String, Object> getUserDetail(Integer userId) {
        // ユーザー情報を取得
        UserEntity user = userRepository.findById(userId);
        
        // ユーザーが存在しない場合は null を返し、Controller側で404エラーとして扱う
        if (user == null) {
            return null;
        }

        // そのユーザーが投稿したプロトタイプ一覧を取得
        List<PrototypeEntity> prototypes = prototypeRepository.findByUserId(userId);

        // 画面に返すためのデータをMapにまとめる
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("prototypes", prototypes);

        return response;
    }

}
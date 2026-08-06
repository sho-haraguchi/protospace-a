package in.tech_camp.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.entity.UserEntity;
import in.tech_camp.backend.form.LoginForm;
import in.tech_camp.backend.form.UserForm;
import in.tech_camp.backend.repository.CommentRepository;
import in.tech_camp.backend.repository.PrototypeRepository;
import in.tech_camp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PrototypeRepository prototypeRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService; // StorageServiceを利用
    
    /**
     * ユーザー登録処理
     */
    @Transactional
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

        // 画像の保存処理（StorageServiceを使用）
        MultipartFile imageFile = userForm.getImage();
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = storageService.storeFile(imageFile);
            userEntity.setImage(fileName);
        }

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

    /**
     * ユーザー情報の更新処理
     */
    @Transactional
    public UserEntity updateUser(Integer userId, UserForm userForm) {
        UserEntity user = userRepository.findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("ユーザーが存在しません。");
        }

        // 基本情報の更新（空でない場合のみ更新、または既存の値を保持）
        if (userForm.getName() != null) user.setName(userForm.getName());
        if (userForm.getProfile() != null) user.setProfile(userForm.getProfile());
        if (userForm.getAffiliation() != null) user.setAffiliation(userForm.getAffiliation());
        if (userForm.getPosition() != null) user.setPosition(userForm.getPosition());

        if (userForm.getEmail() != null && !userForm.getEmail().isEmpty()) {
            user.setEmail(userForm.getEmail());
        }

        // 画像の保存処理（StorageServiceを使用）
        MultipartFile imageFile = userForm.getImage();
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = storageService.storeFile(imageFile);
            user.setImage(fileName);
        }

        // パスワード変更が入力されている場合の処理
        if (userForm.getNewPassword() != null && !userForm.getNewPassword().isEmpty()) {
            
            // 現在のパスワードの照合
            if (!passwordEncoder.matches(userForm.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("現在のパスワードが正しくありません。");
            }

            // 新しいパスワードを暗号化してセット
            String encodedPassword = passwordEncoder.encode(userForm.getNewPassword());
            user.setPassword(encodedPassword);
        }

        // DBの更新（MyBatis等でのupdate実行）
        userRepository.update(user);

        return user;
    }

    /**
     * ユーザー削除処理
     */
    @Transactional
    public void deleteUser(Integer id) {
        commentRepository.deleteByUserId(id);
        prototypeRepository.deleteByUserId(id);
        userRepository.deleteById(id);
    }

    /**
     * IDからユーザーを取得
     */
    public UserEntity findById(Integer id) {
        return userRepository.findById(id);
    }

    /**
     * メールアドレスからユーザーを取得
     */
    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
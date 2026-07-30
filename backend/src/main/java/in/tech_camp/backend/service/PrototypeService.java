package in.tech_camp.backend.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.entity.UserEntity;
import in.tech_camp.backend.form.PrototypeEditForm;
import in.tech_camp.backend.form.PrototypeForm;
import in.tech_camp.backend.repository.PrototypeRepository;
import in.tech_camp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrototypeService {

    private final StorageService storageService;
    private final PrototypeRepository prototypeRepository;
    private final UserRepository userRepository;

    /**
     * 新規プロトタイプの登録処理
     */
    @Transactional
    public PrototypeEntity createPrototype(PrototypeForm form, Integer userId) throws IOException {
        // 1. 画像の保存
        String savedFileName = storageService.storeFile(form.getImage());

        // 2. エンティティの作成
        PrototypeEntity prototype = new PrototypeEntity();
        prototype.setUserId(userId);
        prototype.setName(form.getName());
        prototype.setSlogan(form.getSlogan());
        prototype.setConcept(form.getConcept());
        prototype.setImage(savedFileName);

        // 3. DB保存
        prototypeRepository.insert(prototype);

        return prototype;
    }

    /**
     * プロトタイプ一覧取得
     * 
     * @param sort ソート条件 ("created" または "updated")
     * @return ソート済みのプロトタイプ一覧
     */
    public List<PrototypeEntity> findAllPrototypes(String sort) {
        return prototypeRepository.findAll(sort);
    }

    /**
     * プロトタイプ詳細取得
     */
    public PrototypeEntity findById(Integer id) {
        return prototypeRepository.findById(id);
    }

    /**
     * プロトタイプ編集処理
     */
    @Transactional
    public PrototypeEntity updatePrototype(Integer id, PrototypeEditForm form, Integer currentUserId) throws IOException {
        // データベースから現在のデータを取得
        PrototypeEntity prototype = prototypeRepository.findById(id);

        // 指定されたIDのデータが存在しない場合の安全対策
        if (prototype == null) {
            throw new IllegalArgumentException("指定されたプロトタイプが見つかりません。");
        }

        // 所有者チェック
        // DBの投稿者ID(user_id)と、現在ログインしているユーザーIDが一致しない場合は例外を投げる
        if (!prototype.getUserId().equals(currentUserId)) {
            throw new SecurityException("他のユーザーの投稿を編集する権限がありません。");
        }

        // 新しいデータで上書き
        prototype.setName(form.getName());
        prototype.setSlogan(form.getSlogan());
        prototype.setConcept(form.getConcept());

        // ユーザーが新しく画像をアップロードした場合のみ、画像の保存と上書きを行う
        if (form.getImage() != null && !form.getImage().isEmpty()) {
            String savedFileName = storageService.storeFile(form.getImage());
            prototype.setImage(savedFileName);
        }

        // 更新されたデータをDBに保存
        prototypeRepository.update(prototype);
        
        return prototype;
    }

    /**
     * プロトタイプ削除処理
     */
    @Transactional
    public void deletePrototype(Integer id, String username) {
        // 1. ログインユーザー情報を取得
        UserEntity loginUser = userRepository.findByEmail(username);
        if (loginUser == null) {
            throw new SecurityException("ユーザー情報が存在しません。");
        }

        // 2. データベースから該当の投稿を取得
        PrototypeEntity prototype = prototypeRepository.findById(id);

        // 3. 削除対象が存在しない場合 (404)
        if (prototype == null) {
            throw new IllegalArgumentException("該当の投稿が存在しません。");
        }

        // 4. 本人確認（投稿者ID と ログインユーザーID の比較） (403)
        if (!prototype.getUserId().equals(loginUser.getId())) {
            throw new SecurityException("自分の投稿のみ削除できます。");
        }

        // 5. 本人の場合のみ削除を実行
        prototypeRepository.deleteById(id);
    }

/**
     * プロトタイプ検索処理
     */
    public List<PrototypeEntity> searchPrototypes(String query) {
        // null や 空文字、スペースのみの場合は検索せずに空リストを返す
        if (query == null || query.isBlank()) {
            return List.of();
        }
        return prototypeRepository.findByTextContaining(query.trim());
    }
}

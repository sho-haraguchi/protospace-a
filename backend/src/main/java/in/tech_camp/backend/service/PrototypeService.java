package in.tech_camp.backend.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.form.PrototypeForm;
import in.tech_camp.backend.repository.PrototypeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrototypeService {

    private final StorageService storageService;
    private final PrototypeRepository prototypeRepository;

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
     */
    public List<PrototypeEntity> findAllPrototypes() {
        
        return prototypeRepository.findAll();
    }

    /**
     * プロトタイプ詳細取得
     */
    public PrototypeEntity findById(Integer id) {
        return prototypeRepository.findById(id);
    }
}

package in.tech_camp.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.repository.PrototypeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrototypeService {
  // Repositoryを使うためにフィールドを宣言
  private final PrototypeRepository prototypeRepository;
  
  // Controllerから呼び出されるメソッド
  public List<PrototypeEntity> findAllPrototypes() {
        return prototypeRepository.findAll();
    }

  // プロトタイプ詳細画面表示
  public PrototypeEntity findById(Integer id) {
    return prototypeRepository.findById(id);
  }
}

package in.tech_camp.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.repository.PrototypeRepository;

@Service
public class PrototypeService {
  // Repositoryを使うためにフィールドを宣言
  private final PrototypeRepository prototypeRepository;
  public PrototypeService(PrototypeRepository prototypeRepository) {
        this.prototypeRepository = prototypeRepository;
    }
  // Controllerから呼び出されるメソッド
  public List<PrototypeEntity> findAllPrototypes() {
        return prototypeRepository.findAll();
    }
}

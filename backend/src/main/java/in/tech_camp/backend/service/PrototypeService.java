package in.tech_camp.backend.service;

import org.springframework.stereotype.Service;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.repository.PrototypeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrototypeService {

  private final PrototypeRepository prototypeRepository;

  // プロトタイプ詳細画面表示
  public PrototypeEntity findById(Integer id) {
    return prototypeRepository.findById(id);
  }

}

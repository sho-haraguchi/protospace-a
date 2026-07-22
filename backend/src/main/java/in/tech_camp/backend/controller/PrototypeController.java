package in.tech_camp.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.service.PrototypeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PrototypeController {

  private final PrototypeService prototypeService;
    
  /**
   * プロトタイプ一覧表示機能（showPrototypes）
   */



  /**
   * プロトタイプ投稿画面表示（showPrototypesNew）
   */



  /**
   * プロトタイプ新規投稿処理（postPrototypes）
   */



  /**
   * プロトタイプ編集画面表示（editPrototype）
   */



  /**
   * プロトタイプ編集処理（updatePrototype）
   */



  /**
   * プロトタイプ詳細画面表示（showPrototypeDetail）
   */
  @GetMapping("/api/prototypes/{id}")
  public PrototypeEntity showPrototypeDetail(@PathVariable Integer id) {

    PrototypeEntity prototype = prototypeService.findById(id);

    return prototype;
  }


  
  /**
   * プロトタイプ削除処理（deletePrototype）
   */
}

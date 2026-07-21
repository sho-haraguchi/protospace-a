package in.tech_camp.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.service.PrototypeService;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PrototypeController {
  private final PrototypeService prototypeService;
  public PrototypeController(PrototypeService prototypeService) {
        this.prototypeService = prototypeService;
    }
    /**
   * プロトタイプ一覧表示機能（showPrototypes）
   */
  @GetMapping("/api/prototypes")
    public List<PrototypeEntity> showPrototypes() {
        return prototypeService.findAllPrototypes(); 
    }
}




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


  
  /**
   * プロトタイプ削除処理（deletePrototype）
   */


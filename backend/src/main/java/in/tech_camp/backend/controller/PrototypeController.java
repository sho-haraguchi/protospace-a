package in.tech_camp.backend.controller;

import java.io.IOException;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.form.PrototypeForm;
import in.tech_camp.backend.service.PrototypeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/app/prototypes")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PrototypeController {

    private final PrototypeService prototypeService;

    /**
     * プロトタイプ新規投稿処理（postPrototypes）
     */
    @PostMapping
    public PrototypeEntity postPrototypes(
            @ModelAttribute @Validated PrototypeForm prototypeForm
            // @AuthenticationPrincipal CustomUserDetail currentUser
    ) throws IOException {
        Integer currentUserId = 1; // ログインユーザーID（認証実装後に currentUser.getId() に変更）
        
        // 登録処理を実行して、作成された PrototypeEntity を直接返す（エラーは GlobalExceptionHandler に自動委託）
        return prototypeService.createPrototype(prototypeForm, currentUserId);
    }
}
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
}
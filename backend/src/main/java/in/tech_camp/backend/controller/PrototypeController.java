package in.tech_camp.backend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.form.PrototypeForm;
import in.tech_camp.backend.service.PrototypeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/prototypes")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PrototypeController {

    private final PrototypeService prototypeService;

    /**
     * プロトタイプ新規投稿機能
     * POST: /app/prototypes
     */
    @PostMapping
    public PrototypeEntity postPrototypes(@ModelAttribute @Validated PrototypeForm prototypeForm) throws IOException {
        // 仮のユーザーID (1) でプロトタイプを作成
        return prototypeService.createPrototype(prototypeForm, 1);
    }

    /**
     * プロトタイプ一覧表示機能
     * GET: /app/prototypes
     */
    @GetMapping
    public List<PrototypeEntity> showPrototypes() {
        return prototypeService.findAllPrototypes(); 
    }

    /**
     * プロトタイプ詳細表示機能
     * GET: /app/prototypes/{id}
     */
    @GetMapping("/{id}")
    public PrototypeEntity showPrototypeDetail(@PathVariable Integer id) {
        return prototypeService.findById(id);
    }
}

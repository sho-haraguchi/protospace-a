package in.tech_camp.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.form.PrototypeForm;
import in.tech_camp.backend.repository.PrototypeRepository;
import in.tech_camp.backend.repository.UserRepository;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/app/prototypes")
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
public class PrototypeController {

    private final PrototypeRepository prototypeRepository;
    private final UserRepository userRepository;
    private final String UPLOAD_DIR = "uploads/prototypes/";

    /**
     * プロトタイプ一覧表示機能（showPrototypes）
     */


    /**
     * プロトタイプ新規投稿処理（postPrototypes）
     */
@PostMapping
public ResponseEntity<?> postPrototypes(
        @ModelAttribute @Validated PrototypeForm prototypeForm,
        BindingResult result
) {
    if (result.hasErrors()) {
        List<String> errorMessages = result.getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());
        return ResponseEntity.badRequest().body(Map.of("messages", errorMessages));
    }

    try {
        MultipartFile file = prototypeForm.getImage();
        String savedFileName = "";

        if (file != null && !file.isEmpty()) {
            // 1. 保存先ディレクトリの絶対パスを指定（プロジェクト直下の uploads/prototypes）
            java.nio.file.Path uploadDir = Paths.get("uploads/prototypes").toAbsolutePath().normalize();

            // 2. ディレクトリが存在しなければ作成
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // 3. 安全なファイル名を生成
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null) {
                originalFilename = Paths.get(originalFilename).getFileName().toString();
            }
            savedFileName = UUID.randomUUID().toString() + "_" + originalFilename;

            // 4. 保存先ファイルのフルパスを構築
            java.nio.file.Path targetPath = uploadDir.resolve(savedFileName);

            // 5. Files.copy を使ってファイルを直接書き込む（Tomcatのバグを回避！）
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        PrototypeEntity prototype = new PrototypeEntity();
        prototype.setUserId(1);
        prototype.setName(prototypeForm.getName());
        prototype.setSlogan(prototypeForm.getSlogan());
        prototype.setConcept(prototypeForm.getConcept());
        prototype.setImage(savedFileName);

        prototypeRepository.insert(prototype);
        return ResponseEntity.ok().body(prototype);

    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().body(Map.of("messages", List.of("画像の保存に失敗しました")));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().body(Map.of("messages", List.of("Internal Server Error")));
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
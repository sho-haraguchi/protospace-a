package in.tech_camp.backend.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // 👈 追加
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.tech_camp.backend.custom_user.CustomUserDetail;
import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.entity.UserEntity;
import in.tech_camp.backend.form.PrototypeEditForm;
import in.tech_camp.backend.form.PrototypeForm;
import in.tech_camp.backend.repository.PrototypeRepository;
import in.tech_camp.backend.repository.UserRepository;
import in.tech_camp.backend.service.PrototypeService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PrototypeController {

    private final PrototypeService prototypeService;
    private final PrototypeRepository prototypeRepository;
    private final UserRepository userRepository;

    // 画像が保存されているベースディレクトリ
    private final Path imageStorageDir = Paths.get("uploads/prototypes").toAbsolutePath().normalize();

    /**
     * 画像取得機能
     * GET: /api/images/{filename}
     */
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            String cleanFileName = filename;
            if (cleanFileName.contains("/")) {
                cleanFileName = cleanFileName.substring(cleanFileName.lastIndexOf('/') + 1);
            }
            if (cleanFileName.contains("\\")) {
                cleanFileName = cleanFileName.substring(cleanFileName.lastIndexOf('\\') + 1);
            }

            Path filePath = this.imageStorageDir.resolve(cleanFileName).normalize();
            if (!filePath.startsWith(this.imageStorageDir)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = null;
            try {
                contentType = Files.probeContentType(filePath);
            } catch (IOException e) {
                // スルー
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("画像取得エラー: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * プロトタイプ新規投稿機能（ログイン中のユーザーIDを適用）
     * POST: /api/prototypes
     */
    @PostMapping("/prototypes")
    public ResponseEntity<?> postPrototypes(
            @ModelAttribute @Validated PrototypeForm prototypeForm,
            @AuthenticationPrincipal CustomUserDetail currentUser) {

        // 1. ログインセッションが届いていない場合のガード（401を返す）
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ログインが必要です。再度ログインしてお試しください。"));
        }

        try {
            // 2. 「仮の1」ではなく「currentUser.getId()」を使って保存！
            PrototypeEntity createdPrototype = prototypeService.createPrototype(prototypeForm, currentUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPrototype);
        
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "画像の保存に失敗しました。"));
        }
    }

    /**
     * プロトタイプ一覧表示機能
     * GET: /api/prototypes
     */
    @GetMapping("/prototypes")
    public List<PrototypeEntity> showPrototypes() {
        return prototypeService.findAllPrototypes(); 
    }

    /**
     * プロトタイプ詳細表示機能
     * GET: /api/prototypes/{id}
     */
    @GetMapping("/prototypes/{id}")
    public PrototypeEntity showPrototypeDetail(@PathVariable Integer id) {
        return prototypeService.findById(id);
    }

    /**
     * プロトタイプ編集
     * PUT: /app/prototypes/{id}/update
     */
    @PutMapping("/prototypes/{id}")
    public PrototypeEntity updatePrototype(
            @PathVariable Integer id, 
            @ModelAttribute @Validated PrototypeEditForm form,
            HttpSession session) throws IOException {
       // セッションからログイン中のユーザーを取り出す
        UserEntity currentUser = (UserEntity) session.getAttribute("user");
        if (currentUser == null) {
            throw new RuntimeException("ログインが必要です。");
        }
        return prototypeService.updatePrototype(id, form, currentUser.getId());
    }

    @PostMapping("/prototypes/{id}/delete")
    public ResponseEntity<?> deletePrototype(
            @PathVariable("id") Integer id,
            @AuthenticationPrincipal UserDetails customUser) {

        // 1. 未ログインチェック
        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ログインが必要です"));
        }

        // 2. ユーザーID取得 & サービス呼び出し
        UserEntity loginUser = userRepository.findByEmail(customUser.getUsername());
        prototypeService.deletePrototype(id, loginUser.getId());

        // 3. 成功時レスポンス（失敗時はGlobalExceptionHandlerが各ステータスコードでキャッチ）
        return ResponseEntity.ok().body(Map.of("message", "削除が完了しました"));
    }
}

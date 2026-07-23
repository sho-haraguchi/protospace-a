package in.tech_camp.backend.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.tech_camp.backend.entity.PrototypeEntity;
import in.tech_camp.backend.form.PrototypeForm;
import in.tech_camp.backend.form.PrototypeEditForm;
import in.tech_camp.backend.service.PrototypeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PrototypeController {

    private final PrototypeService prototypeService;

    // 画像が保存されているベースディレクトリ
    private final Path imageStorageDir = Paths.get("uploads/prototypes").toAbsolutePath().normalize();

    /**
     * 画像取得機能
     * GET: /api/images/{filename}
     */
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            // 1. filenameにパス区切り文字（/ や \）が含まれている場合の対策
            // 純粋なファイル名部分（例: "xxx.jpg"）だけを抽出して不正なパス指定を防ぐ
            String cleanFileName = filename;
            if (cleanFileName.contains("/")) {
                cleanFileName = cleanFileName.substring(cleanFileName.lastIndexOf('/') + 1);
            }
            if (cleanFileName.contains("\\")) {
                cleanFileName = cleanFileName.substring(cleanFileName.lastIndexOf('\\') + 1);
            }

            // 2. パスの解決とセキュリティチェック（上位ディレクトリへのアクセスを防ぐ）
            Path filePath = this.imageStorageDir.resolve(cleanFileName).normalize();
            if (!filePath.startsWith(this.imageStorageDir)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Resource resource = new UrlResource(filePath.toUri());

            // 3. ファイルの存在確認
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // 4. MIMEタイプの安全な判定（エラーで落ちないようにtry-catch）
            String contentType = null;
            try {
                contentType = Files.probeContentType(filePath);
            } catch (IOException e) {
                // OS環境によって失敗することがあるためスルー
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
     * プロトタイプ新規投稿機能
     * POST: /api/prototypes
     */
    @PostMapping("/prototypes")
    public PrototypeEntity postPrototypes(@ModelAttribute @Validated PrototypeForm prototypeForm) throws IOException {
        // 仮のユーザーID (1) でプロトタイプを作成
        return prototypeService.createPrototype(prototypeForm, 1);
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
}

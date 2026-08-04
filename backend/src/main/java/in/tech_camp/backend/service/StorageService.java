package in.tech_camp.backend.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {

    private final Path uploadDir;

    public StorageService() {
        // 実行場所に左右されず、必ず「backend/uploads/prototypes」を向くように固定！
        Path currentDir = Paths.get("").toAbsolutePath();
        if (currentDir.endsWith("backend")) {
            this.uploadDir = currentDir.resolve("uploads/prototypes").normalize();
        } else {
            this.uploadDir = currentDir.resolve("backend/uploads/prototypes").normalize();
        }
    }

    /**
     * ファイルを保存し、保存後のファイル名を返す
     */
    public String storeFile(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            return "";
        }

        try {
            // ディレクトリが存在しなければ作成
            if (!Files.exists(this.uploadDir)) {
                Files.createDirectories(this.uploadDir);
            }

            // 元のファイル名を取得し、安全なファイル名のみ抽出
            String originalFilename = image.getOriginalFilename();
            String safeFileName = "image.jpg"; // デフォルト名

            if (originalFilename != null && !originalFilename.isBlank()) {
                safeFileName = Paths.get(originalFilename).getFileName().toString();
            }

            // UUIDを付与した一意のファイル名を生成（例: 90c49a00-b254-..._sample.jpg）
            String savedFileName = UUID.randomUUID().toString() + "_" + safeFileName;

            // 保存先パスを解決し、ディレクトリトラバーサルを防ぐ
            Path targetPath = this.uploadDir.resolve(savedFileName).normalize();
            if (!targetPath.startsWith(this.uploadDir)) {
                throw new SecurityException("不正なファイルパスです");
            }

            // ファイルを保存先に書き込み（上書き許可）
            try (InputStream inputStream = image.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            return savedFileName;

        } catch (IOException e) {
            throw new RuntimeException("ファイルの保存に失敗しました", e);
        }
    }
}
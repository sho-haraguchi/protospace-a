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
        this.uploadDir = Paths.get("uploads/prototypes").toAbsolutePath().normalize();
    }

    /**
     * ファイルを保存し、保存後のファイル名を返す
     */
    public String storeFile(MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) {
            return "";
        }

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
    }
}
package in.tech_camp.backend.service;

import java.io.IOException;
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

        // 安全なファイル名を作成
        String originalFilename = image.getOriginalFilename();
        if (originalFilename != null) {
            originalFilename = Paths.get(originalFilename).getFileName().toString();
        }
        String savedFileName = UUID.randomUUID().toString() + "_" + originalFilename;

        // ファイルを保存先にコピー
        Path targetPath = this.uploadDir.resolve(savedFileName);
        Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return savedFileName;
    }
}
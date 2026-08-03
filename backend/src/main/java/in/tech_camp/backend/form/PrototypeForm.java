package in.tech_camp.backend.form;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class PrototypeForm {

    @NotBlank(message = "プロトタイプの名称を入力してください")
    @Size(max = 50, message = "プロトタイプの名称は50文字以内で入力してください")
    private String name;

    @NotBlank(message = "キャッチコピーを入力してください")
    @Size(max = 100, message = "キャッチコピーは100文字以内で入力してください")
    private String slogan;

    @NotBlank(message = "コンセプトを入力してください")
    @Size(max = 200, message = "コンセプトは200文字以内で入力してください")
    private String concept;

    @NotNull(message = "画像ファイルを選択してください")
    private MultipartFile image;
}
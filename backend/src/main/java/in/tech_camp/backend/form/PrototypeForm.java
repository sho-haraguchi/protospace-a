package in.tech_camp.backend.form;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PrototypeForm {
  @NotBlank(message = "プロトタイプの名称を入力してください")
  private String name;

  @NotBlank(message = "キャッチコピーを入力してください")
  private String slogan;

  @NotBlank(message = "コンセプトを入力してください")
  private String concept;
  
  private MultipartFile image;
  
}

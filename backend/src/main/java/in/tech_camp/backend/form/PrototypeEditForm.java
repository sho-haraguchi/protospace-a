package in.tech_camp.backend.form;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;

@Data
public class PrototypeEditForm {
    @NotBlank(message = "Name can't be blank")
    private String name;

    @NotBlank(message = "Slogan can't be blank")
    private String slogan;

    @NotBlank(message = "Concept can't be blank")
    private String concept;

    //編集時は画像が任意になる
    private MultipartFile image; 
}
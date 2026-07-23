package in.tech_camp.backend.form;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class PrototypeForm {
    @NotBlank(message = "Name can't be blank")
    private String name;

    @NotBlank(message = "Slogan can't be blank")
    private String slogan;

    @NotBlank(message = "Concept can't be blank")
    private String concept;

    @NotNull(message = "Image file is required")
    private MultipartFile image; // String から MultipartFile に変更
}

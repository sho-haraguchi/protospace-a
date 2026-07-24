package in.tech_camp.backend.form;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentForm {

    @NotBlank(message = "コメント本文は必須です")
    private String text;

}
package in.tech_camp.backend.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserForm {

    @NotBlank(message = "ユーザー名は必須です")
    private String name;

    @NotBlank(message = "メールアドレスは必須です")
    @Email(message = "有効なメールアドレス形式で入力してください")
    private String email;

    @NotBlank(message = "パスワードは必須です")
    @Size(min = 6, message = "パスワードは６文字以上で入力してください")
    private String password;

    @NotBlank(message = "確認用パスワードは必須です")
    private String passwordConfirmation;

    @NotBlank(message = "プロフィールは必須です")
    private String profile;

    @NotBlank(message = "所属は必須です")
    private String affiliation;

    @NotBlank(message = "役職は必須です")
    private String position;
}

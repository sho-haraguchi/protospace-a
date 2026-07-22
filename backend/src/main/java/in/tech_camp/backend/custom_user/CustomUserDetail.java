package in.tech_camp.backend.custom_user;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import in.tech_camp.backend.entity.UserEntity;
import lombok.Data;

@Data
public class CustomUserDetail implements UserDetails {

    private final UserEntity user;

    public CustomUserDetail(UserEntity user) {
        this.user = user;
    }

    public Integer getId() {
        return user.getId();
    }

    // もし UserEntity に nickname フィールドがない場合は、getName() などに合わせるか削除してください
    public String getName() {
        return user.getName();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
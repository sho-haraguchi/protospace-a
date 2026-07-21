package in.tech_camp.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // /api/ から始まるすべてのURLに対して、アクセスを許可する
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000") // Next.jsからのアクセスを許可
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 許可するメソッド
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
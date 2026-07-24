package in.tech_camp.backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Next.js (Port 3000) から Spring Boot (Port 8080) への API 通信（CORS）を許可
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // パターンB: カレントディレクトリ直下の uploads と public/uploads の両方を絶対パスで取得
        Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
        Path publicUploadPath = Paths.get("public/uploads").toAbsolutePath().normalize();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(
                    uploadPath.toUri().toString(),
                    publicUploadPath.toUri().toString()
                );
    }
}
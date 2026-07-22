package in.tech_camp.backend.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

import in.tech_camp.backend.entity.PrototypeEntity;

@Mapper
public interface PrototypeRepository {
  // 投稿保存
    @Insert("INSERT INTO prototypes (name, slogan, concept, image, user_id) VALUES (#{name}, #{slogan}, #{concept}, #{image}, #{userId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(PrototypeEntity prototype);
}

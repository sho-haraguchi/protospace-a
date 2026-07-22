package in.tech_camp.backend.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import in.tech_camp.backend.entity.PrototypeEntity;

@Mapper
public interface PrototypeRepository {

  // プロトタイプ詳細画面表示
  @Select("SELECT p.*, u.name AS \"user.name\" " +
            "FROM prototypes p " +
            "LEFT JOIN users u ON p.user_id = u.id " +
            "WHERE p.id = #{id}")
    PrototypeEntity findById(Integer id);
}
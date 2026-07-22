package in.tech_camp.backend.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import in.tech_camp.backend.entity.UserEntity;

@Mapper
public interface UserRepository {
  
  /**
   * ユーザー新規登録SQL
   */
  @Insert("INSERT INTO users (name, email, password, profile, affiliation, position) VALUES (#{name}, #{email}, #{password}, #{profile}, #{affiliation}, #{position})")
  @Options(useGeneratedKeys = true, keyProperty = "id")
  void insert(UserEntity userEntity);

  /**
   * IDからユーザー情報を一軒取得するSQL
   */
  @Select("SELECT * FROM users WHERE id = #{id}")
  UserEntity findByID(Integer id);

  /**
 　* メールアドレスからユーザー情報を取得するSQL
 　*/
  @Select("SELECT * FROM users WHERE email = #{email}")
  UserEntity findByEmail(String email);
}

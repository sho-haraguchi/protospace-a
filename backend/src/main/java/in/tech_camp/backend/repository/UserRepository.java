package in.tech_camp.backend.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

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
   * IDからユーザー情報を1件取得するSQL（通常はこちらに統一）
   */
  @Select("SELECT * FROM users WHERE id = #{id}")
  UserEntity findById(Integer id);

  /**
   * メールアドレスからユーザー情報を取得するSQL
   */
  @Select("SELECT * FROM users WHERE email = #{email}")
  UserEntity findByEmail(String email);

  /**
   * ユーザー情報を更新するSQL
   */
  @Update("UPDATE users SET name = #{name}, profile = #{profile}, affiliation = #{affiliation}, position = #{position} WHERE id = #{id}")
  void update(UserEntity userEntity);
}
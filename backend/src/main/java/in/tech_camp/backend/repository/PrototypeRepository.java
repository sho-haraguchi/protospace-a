package in.tech_camp.backend.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import in.tech_camp.backend.entity.PrototypeEntity;

@Mapper
public interface PrototypeRepository {
  // 投稿保存
    @Insert("INSERT INTO prototypes (name, slogan, concept, image, user_id) VALUES (#{name}, #{slogan}, #{concept}, #{image}, #{userId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(PrototypeEntity prototype);
  
  //「プロトタイプ情報」と「投稿者の名前」を同時に取得するためJOIN句を使用
  // <script>と<choose>タグを用い、SQLインジェクションを防ぎつつ動的にソート順を切り替える
  @Select("<script>" +
            "SELECT prototypes.*, users.name AS user_name " +
            "FROM prototypes " +
            "JOIN users ON prototypes.user_id = users.id " +
            "<choose>" +
            "  <!-- 'updated' が指定された場合は更新日時の降順 -->" +
            "  <when test='sort == \"updated\"'>ORDER BY prototypes.updated_at DESC, prototypes.id DESC</when>" +
            "  <!-- デフォルトまたはその他は作成日時の降順 -->" +
            "  <otherwise>ORDER BY prototypes.created_at DESC, prototypes.id DESC</otherwise>" +
            "</choose>" +
            "</script>")
    @Results({
      //"user_name" として取得した投稿者の名前を"user"フィールドの"name"フィールドにセット
      @Result(property = "userId", column = "user_id"),
      @Result(property = "user.id", column = "user_id"),
      @Result(property = "user.name", column = "user_name"),
      @Result(property = "createdAt", column = "created_at"),
      @Result(property = "updatedAt", column = "updated_at")
    })
    List<PrototypeEntity> findAll(@Param("sort") String sort);


  // プロトタイプ詳細画面表示
  @Select("SELECT p.*, u.id AS user_id, u.name AS user_name " +
            "FROM prototypes p " +
            "LEFT JOIN users u ON p.user_id = u.id " +
            "WHERE p.id = #{id}")
    @Results({
      @Result(property = "user.id", column = "user_id"),
      @Result(property = "user.name", column = "user_name"),
      @Result(property = "userId", column = "user_id") ,
      @Result(property = "createdAt", column = "created_at"),
      @Result(property = "updatedAt", column = "updated_at")
    })
    PrototypeEntity findById(Integer id);

    //プロトタイプ編集
  @Update("UPDATE prototypes SET name = #{name}, slogan = #{slogan}, concept = #{concept}, image = #{image}, updated_at = CURRENT_TIMESTAMP WHERE id = #{id}")
    void update(PrototypeEntity prototype);
  
  /**
   * 指定したユーザーIDに紐づくプロトタイプを取得するSQL
   */
  @Select("SELECT * FROM prototypes WHERE user_id = #{userId}")
  List<PrototypeEntity> findByUserId(Integer userId);

  @Delete("DELETE FROM prototypes WHERE id = #{id}")
  void deleteById(Integer id);
}

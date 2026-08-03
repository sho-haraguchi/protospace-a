package in.tech_camp.backend.repository;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface LikeRepository {
    // いいねを登録。ON CONFLICT DO NOTHING により、重複クリックによるSQLエラーを防ぎぐ
    @Insert("INSERT INTO likes (user_id, prototype_id) VALUES (#{userId}, #{prototypeId}) ON CONFLICT DO NOTHING")
    void insert(@Param("userId") Integer userId, @Param("prototypeId") Integer prototypeId);

    // いいねを解除
    @Delete("DELETE FROM likes WHERE user_id = #{userId} AND prototype_id = #{prototypeId}")
    void delete(@Param("userId") Integer userId, @Param("prototypeId") Integer prototypeId);

    // 特定のユーザーが特定の作品にいいねしているかを確認
    @Select("SELECT COUNT(*) > 0 FROM likes WHERE user_id = #{userId} AND prototype_id = #{prototypeId}")
    boolean existsByUserIdAndPrototypeId(@Param("userId") Integer userId, @Param("prototypeId") Integer prototypeId);

    // 特定の作品の合計いいね数を取得
    @Select("SELECT COUNT(*) FROM likes WHERE prototype_id = #{prototypeId}")
    Integer countByPrototypeId(@Param("prototypeId") Integer prototypeId);
}
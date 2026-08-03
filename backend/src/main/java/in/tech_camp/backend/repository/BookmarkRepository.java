package in.tech_camp.backend.repository;

import java.util.List;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import in.tech_camp.backend.entity.PrototypeEntity;

@Mapper
public interface BookmarkRepository {

    // お気に入り登録
    @Insert("INSERT INTO bookmarks (user_id, prototype_id) VALUES (#{userId}, #{prototypeId}) ON CONFLICT DO NOTHING")
    void insert(@Param("userId") Integer userId, @Param("prototypeId") Integer prototypeId);

    // お気に入り解除：ユーザーIDと作品IDでマッチするレコードを直接削除
    @Delete("DELETE FROM bookmarks WHERE user_id = #{userId} AND prototype_id = #{prototypeId}")
    void delete(@Param("userId") Integer userId, @Param("prototypeId") Integer prototypeId);

    // 特定ユーザーが特定作品をお気に入り登録済みか確認
    // フロントエンドのボタンの初期状態判定
    @Select("SELECT COUNT(*) > 0 FROM bookmarks WHERE user_id = #{userId} AND prototype_id = #{prototypeId}")
    boolean existsByUserIdAndPrototypeId(@Param("userId") Integer userId, @Param("prototypeId") Integer prototypeId);
    
    // お気に入り一覧取得
    @Select("SELECT p.*, u.id AS user_id, u.name AS user_name, COUNT(l.prototype_id) AS like_count " +
            "FROM bookmarks b " +
            "JOIN prototypes p ON b.prototype_id = p.id " +
            "JOIN users u ON p.user_id = u.id " +
            "LEFT JOIN likes l ON p.id = l.prototype_id " +
            "WHERE b.user_id = #{userId} " +
            "GROUP BY p.id, u.id, u.name, b.created_at " +
            "ORDER BY b.created_at DESC")
    @Results({
        @Result(property = "userId", column = "user_id"),
        @Result(property = "user.id", column = "user_id"),
        @Result(property = "user.name", column = "user_name"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "likeCount", column = "like_count")
    })
    List<PrototypeEntity> findMyBookmarks(@Param("userId") Integer userId);
}
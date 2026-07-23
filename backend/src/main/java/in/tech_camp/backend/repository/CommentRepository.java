package in.tech_camp.backend.repository;

import in.tech_camp.backend.entity.CommentEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommentRepository {

    // コメントの登録
    @Insert("INSERT INTO comments (text, user_id, prototype_id) VALUES (#{text}, #{userId}, #{prototypeId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(CommentEntity comment);

    // 特定の投稿に紐づくコメント一覧の取得
    @Select("""
                SELECT
                    c.id,
                    c.text,
                    c.user_id AS userId,
                    c.prototype_id AS prototypeId,
                    u.name AS userName
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.prototype_id = #{prototypeId}
                ORDER BY c.id DESC
            """)
    List<CommentEntity> findByPrototypeId(Integer prototypeId);
}
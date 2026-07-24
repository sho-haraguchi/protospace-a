package in.tech_camp.backend.service;

import in.tech_camp.backend.entity.CommentEntity;
import in.tech_camp.backend.form.CommentForm;
import in.tech_camp.backend.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    // コメント登録処理
    @Transactional
    public CommentEntity createComment(Integer prototypeId, CommentForm form, Integer userId) {
        CommentEntity comment = new CommentEntity();
        comment.setText(form.getText());
        comment.setUserId(userId);
        comment.setPrototypeId(prototypeId);

        commentRepository.insert(comment);
        
        return comment;
    }

    // 投稿に紐づくコメント取得処理
    public List<CommentEntity> getCommentsByPrototypeId(Integer prototypeId) {
        return commentRepository.findByPrototypeId(prototypeId);
    }
}
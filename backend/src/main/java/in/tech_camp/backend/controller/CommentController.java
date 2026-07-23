package in.tech_camp.backend.controller;

import in.tech_camp.backend.custom_user.CustomUserDetail;
import in.tech_camp.backend.entity.CommentEntity;
import in.tech_camp.backend.form.CommentForm;
import in.tech_camp.backend.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prototypes/{prototypeId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // コメント投稿
    @PostMapping
    public ResponseEntity<CommentEntity> createComment(
            @PathVariable("prototypeId") Integer prototypeId,
            @Valid @RequestBody CommentForm form,
            @AuthenticationPrincipal CustomUserDetail customUserDetail
    ) {

        if (customUserDetail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer userId = customUserDetail.getId();

        CommentEntity createdComment = commentService.createComment(prototypeId, form, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }

    // コメント一覧取得
    @GetMapping
    public ResponseEntity<List<CommentEntity>> getComments(
            @PathVariable("prototypeId") Integer prototypeId
    ) {
        List<CommentEntity> comments = commentService.getCommentsByPrototypeId(prototypeId);
        return ResponseEntity.ok(comments);
    }
}
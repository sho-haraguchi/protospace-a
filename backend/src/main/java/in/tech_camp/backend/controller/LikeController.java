package in.tech_camp.backend.controller;

import in.tech_camp.backend.custom_user.CustomUserDetail;
import in.tech_camp.backend.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/prototypes/{prototypeId}/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    //  いいねの状態を取得（自分がいいねしたかどうか、および全体のいいね数）
    @GetMapping
    public ResponseEntity<Map<String, Object>> getLikeStatus(
            @PathVariable Integer prototypeId,
            @AuthenticationPrincipal CustomUserDetail currentUser) {
        // 未ログインユーザーでも状態の確認は許可する（currentUser は null になる）
        Integer userId = currentUser != null ? currentUser.getId() : null;
        return ResponseEntity.ok(likeService.getLikeStatus(userId, prototypeId));
    }

    // いいねを登録
    @PostMapping
    public ResponseEntity<?> addLike(
            @PathVariable Integer prototypeId,
            @AuthenticationPrincipal CustomUserDetail currentUser) {
        // フロントエンドから送信される userId は絶対に信用せず、セキュリティコンテキストからログイン中のユーザー情報を取得する
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 Unauthorized
        }
        likeService.addLike(currentUser.getId(), prototypeId);
        return ResponseEntity.ok().build();
    }

    // いいねを解除
    @DeleteMapping
    public ResponseEntity<?> removeLike(
            @PathVariable Integer prototypeId,
            @AuthenticationPrincipal CustomUserDetail currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        likeService.removeLike(currentUser.getId(), prototypeId);
        return ResponseEntity.ok().build();
    }
}
package in.tech_camp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import in.tech_camp.backend.custom_user.CustomUserDetail;
import in.tech_camp.backend.service.BookmarkService;
import in.tech_camp.backend.entity.PrototypeEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    // お気に入り追加
    @PostMapping("/prototypes/{prototypeId}/bookmarks")
    public ResponseEntity<?> addBookmark(
            @PathVariable Integer prototypeId,
            @AuthenticationPrincipal CustomUserDetail currentUser) { // 現在ログイン中のユーザー情報を抽出
        bookmarkService.addBookmark(currentUser.getId(), prototypeId);
        return ResponseEntity.ok().build();
    }

    // お気に入り解除
    @DeleteMapping("/prototypes/{prototypeId}/bookmarks")
    public ResponseEntity<?> removeBookmark(
            @PathVariable Integer prototypeId,
            @AuthenticationPrincipal CustomUserDetail currentUser) {
        bookmarkService.removeBookmark(currentUser.getId(), prototypeId);
        return ResponseEntity.ok().build();
    }

    // 現在のユーザーに対する該当作品のお気に入り状態を取得
    @GetMapping("/prototypes/{prototypeId}/bookmarks/status")
    public ResponseEntity<Map<String, Boolean>> getBookmarkStatus(
            @PathVariable Integer prototypeId,
            @AuthenticationPrincipal CustomUserDetail currentUser) {
        // 未ログイン状態を許容します（未ログイン時は常に isBookmarked: false を返します）
        Integer userId = currentUser != null ? currentUser.getId() : null;
        boolean isBookmarked = bookmarkService.isBookmarked(userId, prototypeId);
        return ResponseEntity.ok(Map.of("isBookmarked", isBookmarked));
    }

    // マイコレクション一覧を取得
    @GetMapping("/bookmarks/my-list")
    public ResponseEntity<?> getMyBookmarks(@AuthenticationPrincipal CustomUserDetail currentUser) {
        List<PrototypeEntity> bookmarks = bookmarkService.getMyBookmarks(currentUser.getId());
        return ResponseEntity.ok(bookmarks);
    }
}
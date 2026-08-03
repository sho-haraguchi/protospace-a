package in.tech_camp.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import in.tech_camp.backend.repository.BookmarkRepository;
import in.tech_camp.backend.entity.PrototypeEntity;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookmarkService {
    
    private final BookmarkRepository bookmarkRepository;

    // お気に入り追加
    public void addBookmark(Integer userId, Integer prototypeId) {
        bookmarkRepository.insert(userId, prototypeId);
    }

    // お気に入り解除
    public void removeBookmark(Integer userId, Integer prototypeId) {
        bookmarkRepository.delete(userId, prototypeId);
    }

    // お気に入り登録済みかチェック
    public boolean isBookmarked(Integer userId, Integer prototypeId) {
        if (userId == null) return false;
        return bookmarkRepository.existsByUserIdAndPrototypeId(userId, prototypeId);
    }

    // お気に入り一覧を取得
    public List<PrototypeEntity> getMyBookmarks(Integer userId) {
        return bookmarkRepository.findMyBookmarks(userId);
    }
}
package in.tech_camp.backend.service;

import in.tech_camp.backend.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;

    public void addLike(Integer userId, Integer prototypeId) {
        likeRepository.insert(userId, prototypeId);
    }

    public void removeLike(Integer userId, Integer prototypeId) {
        likeRepository.delete(userId, prototypeId);
    }

    public Map<String, Object> getLikeStatus(Integer userId, Integer prototypeId) {
        // 未ログイン時(userIdがnull)は、isLikedは無条件でfalseになる
        boolean isLiked = userId != null && likeRepository.existsByUserIdAndPrototypeId(userId, prototypeId);
        int count = likeRepository.countByPrototypeId(prototypeId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        response.put("likeCount", count);
        return response;
    }
}
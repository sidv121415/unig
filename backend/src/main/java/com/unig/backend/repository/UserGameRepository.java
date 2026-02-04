package com.unig.backend.repository;

import com.unig.backend.model.GameStatus;
import com.unig.backend.model.User;
import com.unig.backend.model.UserGame;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserGameRepository extends JpaRepository<UserGame, Long> {
    List<UserGame> findByUser(User user);
    List<UserGame> findByUserAndStatus(User user, GameStatus status);
    Optional<UserGame> findByUserAndGameId(User user, Integer gameId);
}

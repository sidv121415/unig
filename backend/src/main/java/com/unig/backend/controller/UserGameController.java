package com.unig.backend.controller;

import com.unig.backend.model.GameStatus;
import com.unig.backend.model.User;
import com.unig.backend.model.UserGame;
import com.unig.backend.repository.UserGameRepository;
import com.unig.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserGameController {

    @Autowired
    private UserGameRepository userGameRepository;

    @Autowired
    private UserRepository userRepository;

    private User getUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public List<UserGame> getMyGames(@AuthenticationPrincipal UserDetails userDetails) {
        return userGameRepository.findByUser(getUser(userDetails));
    }

    @GetMapping("/status/{status}")
    public List<UserGame> getGamesByStatus(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable GameStatus status) {
        return userGameRepository.findByUserAndStatus(getUser(userDetails), status);
    }

    @GetMapping("/{gameId}/check")
    public ResponseEntity<?> getGameForUser(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer gameId) {
        User user = getUser(userDetails);
        Optional<UserGame> existing = userGameRepository.findByUserAndGameId(user, gameId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/wishlist")
    public List<UserGame> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        return userGameRepository.findByUserAndStatus(getUser(userDetails), GameStatus.PLAN_TO_PLAY);
    }

    @GetMapping("/my-games")
    public List<UserGame> getMyGamesList(@AuthenticationPrincipal UserDetails userDetails) {
        return userGameRepository.findByUserAndStatus(getUser(userDetails), GameStatus.PLAYING);
    }

    @PostMapping
    public ResponseEntity<?> addGame(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserGame gameRequest) {
        User user = getUser(userDetails);

        // Check if already exists
        Optional<UserGame> existing = userGameRepository.findByUserAndGameId(user, gameRequest.getGameId());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Game already in your list");
        }

        gameRequest.setUser(user);
        // Ensure default status if null
        if (gameRequest.getStatus() == null) {
            gameRequest.setStatus(GameStatus.PLAN_TO_PLAY);
        }

        UserGame saved = userGameRepository.save(gameRequest);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{gameId}")
    public ResponseEntity<?> updateGame(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer gameId,
            @RequestBody UserGame updateRequest) {
        User user = getUser(userDetails);
        UserGame game = userGameRepository.findByUserAndGameId(user, gameId)
                .orElseThrow(() -> new RuntimeException("Game not found in your list"));

        if (updateRequest.getStatus() != null)
            game.setStatus(updateRequest.getStatus());
        if (updateRequest.getPersonalRating() != null)
            game.setPersonalRating(updateRequest.getPersonalRating());

        // Allow updating rawg rank/snapshot if needed
        if (updateRequest.getRawgRating() != null)
            game.setRawgRating(updateRequest.getRawgRating());

        userGameRepository.save(game);
        return ResponseEntity.ok(game);
    }

    @DeleteMapping("/{gameId}")
    public ResponseEntity<?> removeGame(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer gameId) {
        User user = getUser(userDetails);
        UserGame game = userGameRepository.findByUserAndGameId(user, gameId)
                .orElseThrow(() -> new RuntimeException("Game not found in your list"));

        userGameRepository.delete(game);
        return ResponseEntity.ok("Game removed");
    }
}

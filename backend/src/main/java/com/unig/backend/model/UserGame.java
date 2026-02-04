package com.unig.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "user_games")
public class UserGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // RAWG API Game ID
    @Column(nullable = false)
    private Integer gameId;

    // Cached Metadata for Display
    private String title;
    private String backgroundImage; // URL

    // Snapshot of Global Rank (Metacritic or Rating)
    private Double rawgRating;

    // User's Personal Data
    @Enumerated(EnumType.STRING)
    private GameStatus status;

    private Integer personalRating; // 1-10

    // Extended Snapshot Data
    @Column(columnDefinition = "TEXT")
    private String description;
    private Double price;
    private String releaseDate;
    private String genre;

    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
    }
}

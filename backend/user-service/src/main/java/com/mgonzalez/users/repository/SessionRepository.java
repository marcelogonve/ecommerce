package com.mgonzalez.users.repository;

import com.mgonzalez.users.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findByAccessToken(String accessToken);
    Optional<Session> findByRefreshToken(String refreshToken);
    void deleteByUserId(Long userId); // TODO: Opcional, se puede usar para cerrar todas las sesiones de un usuario por ID
}

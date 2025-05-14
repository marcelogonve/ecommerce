package com.mgonzalez.users.service.impl;

import com.mgonzalez.users.dto.LoginRequest;
import com.mgonzalez.users.dto.LoginResponse;
import com.mgonzalez.users.dto.RegisterRequest;
import com.mgonzalez.users.entity.Session;
import com.mgonzalez.users.entity.User;
import com.mgonzalez.users.repository.SessionRepository;
import com.mgonzalez.users.repository.UserRepository;
import com.mgonzalez.users.service.JwtService;
import com.mgonzalez.users.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final SessionRepository sessionRepository;

    public UserServiceImpl(UserRepository userRepository, JwtService jwtService, SessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.sessionRepository = sessionRepository;
    }

    @Override
    public User register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setAddress(request.getAddress());
        user.setBirthDate(request.getBirthDate());
        return userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }

        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusDays(7);

        Session session = new Session();
        session.setUser(user);
        session.setAccessToken(accessToken);
        session.setRefreshToken(refreshToken);
        session.setCreatedAt(now);
        session.setExpiresAt(expiresAt);

        sessionRepository.save(session);

        return new LoginResponse(accessToken, refreshToken);
    }

    @Override
    public User getCurrentUser(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        Session session = sessionRepository.findByAccessToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión no válida o expirada"));

        return session.getUser();
    }

    @Override
    public LoginResponse refreshAccessToken(String refreshToken) {
        Session session = sessionRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token inválido"));

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expirado");
        }

        String newAccessToken = jwtService.generateToken(session.getUser().getEmail());
        session.setAccessToken(newAccessToken);
        sessionRepository.save(session);

        return new LoginResponse(newAccessToken, session.getAccessToken());
    }

}

package com.mgonzalez.users.controller;

import com.mgonzalez.users.dto.*;
import com.mgonzalez.users.entity.User;
import com.mgonzalez.users.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Slf4j
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        log.info("### ENTRANDO A REGISTER ###");
        try {
            log.info("- Request: {}", request);
            return ResponseEntity.ok(userService.register(request));
        } finally {
            log.info("### SALIENDO DE REGISTER ###");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        log.info("### ENTRANDO A LOGIN ###");
        try {
            log.info("- Request: {}", request);
            LoginResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } finally {
            log.info("### SALIENDO DE LOGIN ###");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        log.info("### ENTRANDO A REFRESH TOKEN ###");
        try {
            return ResponseEntity.ok(userService.refreshAccessToken(request.getRefreshToken()));
        } finally {
            log.info("### SALIENDO DE REFRESH TOKEN ###");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorizationHeader) {
        log.info("### ENTRANDO A LOGOUT ###");
        try {
            userService.logout(authorizationHeader);
            return ResponseEntity.noContent().build();
        } finally {
            log.info("### SALIENDO DE LOGOUT ###");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(@RequestHeader("Authorization") String authorizationHeader) {
        log.info("### ENTRANDO A GET PROFILE ###");
        try {
            User user = userService.getCurrentUser(authorizationHeader);
            log.info("- User: {}", user);
            ProfileResponse profile = new ProfileResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getAddress(),
                    user.getBirthDate()
            );
            return ResponseEntity.ok(profile);
        } finally {
            log.info("### SALIENDO DE GET PROFILE ###");
        }
    }
}

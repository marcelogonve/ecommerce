package com.mgonzalez.users.service;

import com.mgonzalez.users.dto.LoginRequest;
import com.mgonzalez.users.dto.LoginResponse;
import com.mgonzalez.users.dto.RegisterRequest;
import com.mgonzalez.users.entity.User;

public interface UserService {
    User register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    User getCurrentUser(String token);
    LoginResponse refreshAccessToken(String refreshToken);
}

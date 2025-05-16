package com.mgonzalez.gateway.filter;

import com.mgonzalez.gateway.util.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@Slf4j
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;

    private static final List<String> PUBLIC_PATHS = List.of(
            "/login",
            "/register",
            "/refresh",
            "/products",
            "/ping",
            "/v3/api-docs",
            "/swagger-ui",
            "/swagger-ui.html",
            "/webjars"
    );

    public AuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("REQ -> {} {}", exchange.getResponse().getStatusCode(), exchange.getRequest().getURI());
        String path = exchange.getRequest().getPath().toString();

        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.error("Encabezado Authorization mal formado o ausente");
            return unauthorized("Encabezado Authorization mal formado o ausente");
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            log.error("Access token inválido o expirado");
            return unauthorized("Access token inválido o expirado");
        }

        Claims claims = jwtUtil.getClaims(token);
        exchange.getRequest().mutate()
                .header("user-email", claims.getSubject())
                .build();

        return chain.filter(exchange)
                .doOnSuccess(_ -> log.info("RES -> {} {}", exchange.getResponse().getStatusCode(), exchange.getRequest().getURI()));
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::contains);
    }

    private Mono<Void> unauthorized(String message) {
        return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, message));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

}

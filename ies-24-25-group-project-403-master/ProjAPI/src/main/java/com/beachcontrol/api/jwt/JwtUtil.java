package com.beachcontrol.api.jwt;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private static final String secretKey = "Hello";

    public String generateToken(String email, String role) {
        JwtBuilder jwt = Jwts.builder()
                .setSubject(email) // Usa o email como identificador do usuário
                .claim("role", role) // Inclui a role do usuário como claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas
                .signWith(generateJwtSecretKey(), SignatureAlgorithm.HS256);
        return jwt.compact();
    }

    public SecretKey generateJwtSecretKey() {
        // Convert the static word to a byte array
        byte[] keyBytes = secretKey.getBytes();

        // Ensure the key length is compatible with the algorithm (HMAC SHA-256 requires
        // 32 bytes)
        byte[] keyBytesPadded = new byte[32];
        System.arraycopy(keyBytes, 0, keyBytesPadded, 0, Math.min(keyBytes.length, 32));

        // Generate the SecretKey using the static word
        return Keys.hmacShaKeyFor(keyBytesPadded);
    }


    public boolean validateToken(String token, UserDetails userDetails) {
        String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        // TODO Auto-generated method stub
        return getClaims(token).getExpiration().before(new Date());
    }

    // Extrai o email (subject) do token
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // Extrai a role do usuário do token
    public String extractUserRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // Extrai as claims do token, com a chave configurada
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(generateJwtSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

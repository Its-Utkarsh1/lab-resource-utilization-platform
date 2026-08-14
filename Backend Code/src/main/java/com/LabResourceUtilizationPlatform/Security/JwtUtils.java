package com.LabResourceUtilizationPlatform.Security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

    private static final Logger logger =
            LoggerFactory.getLogger(JwtUtils.class);

    // =========================================================
    // JWT CONFIGURATION
    // =========================================================

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refresh-secret}")
    private String jwtRefreshSecret;

    @Value("${jwt.refresh-expiration}")
    private long jwtRefreshExpiration;


    // =========================================================
    // ACCESS TOKEN
    // =========================================================

    public String generateAccessToken(
            UserDetails userDetails
    ) {

        String username =
                userDetails.getUsername();

        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpiration
                        )
                )
                .signWith(accessKey())
                .compact();
    }


    // =========================================================
    // REFRESH TOKEN
    // =========================================================

    public String generateRefreshToken(
            UserDetails userDetails
    ) {

        return Jwts.builder()
                .subject(
                        userDetails.getUsername()
                )
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtRefreshExpiration
                        )
                )
                .signWith(refreshKey())
                .compact();
    }


    // =========================================================
    // GOOGLE REGISTRATION TOKEN
    // =========================================================


    // =========================================================
    // GET JWT FROM AUTHORIZATION HEADER
    // =========================================================

    public String getJwtFromHeader(
            HttpServletRequest request
    ) {

        String bearerToken =
                request.getHeader("Authorization");

        logger.debug(
                "Authorization Header present: {}",
                bearerToken != null
        );

        if (
                bearerToken != null
                        && bearerToken.startsWith("Bearer ")
        ) {

            return bearerToken.substring(7);
        }

        return null;
    }


    // =========================================================
    // GET USERNAME FROM ACCESS TOKEN
    // =========================================================

    public String getUsernameFromAccessToken(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(accessKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }


    // =========================================================
    // GET USERNAME FROM REFRESH TOKEN
    // =========================================================

    public String getUsernameFromRefreshToken(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(refreshKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }


    // =========================================================
    // VALIDATE ACCESS TOKEN
    // =========================================================

    public boolean validateAccessToken(
            String token
    ) {

        try {

            logger.debug(
                    "Validating access token"
            );

            Jwts.parser()
                    .verifyWith(accessKey())
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (MalformedJwtException e) {

            logger.error(
                    "Invalid JWT token"
            );

        } catch (ExpiredJwtException e) {

            logger.error(
                    "JWT token is expired"
            );

        } catch (UnsupportedJwtException e) {

            logger.error(
                    "JWT token is unsupported"
            );

        } catch (IllegalArgumentException e) {

            logger.error(
                    "JWT claims string is empty"
            );
        }

        return false;
    }


    // =========================================================
    // VALIDATE REFRESH TOKEN
    // =========================================================

    public boolean validateRefreshToken(
            String token
    ) {

        try {

            Jwts.parser()
                    .verifyWith(refreshKey())
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (MalformedJwtException e) {

            logger.error(
                    "Invalid refresh token"
            );

        } catch (ExpiredJwtException e) {

            logger.error(
                    "Refresh token expired"
            );

        } catch (UnsupportedJwtException e) {

            logger.error(
                    "Unsupported refresh token"
            );

        } catch (IllegalArgumentException e) {

            logger.error(
                    "Refresh token is empty"
            );
        }

        return false;
    }


    // =========================================================
    // ACCESS KEY
    // =========================================================

    private SecretKey accessKey() {

        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes(
                        StandardCharsets.UTF_8
                )
        );
    }


    // =========================================================
    // REFRESH KEY
    // =========================================================

    private SecretKey refreshKey() {

        return Keys.hmacShaKeyFor(
                jwtRefreshSecret.getBytes(
                        StandardCharsets.UTF_8
                )
        );
    }
}
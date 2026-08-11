package com.LabResourceUtilizationPlatform.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheConfiguration redisCacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(new GenericJackson2JsonRedisSerializer())
                );
    }

    @Bean
    CommandLineRunner redisInfo(RedisConnectionFactory factory) {
        return args -> {

            if (factory instanceof LettuceConnectionFactory lettuce) {
                RedisStandaloneConfiguration config =
                        lettuce.getStandaloneConfiguration();

                System.out.println("Redis Host : " + config.getHostName());
                System.out.println("Redis Port : " + config.getPort());
                System.out.println("Redis DB   : " + config.getDatabase());
            }

            var connection = factory.getConnection();

            System.out.println("PING = " + connection.ping());

            System.out.println(connection.serverCommands().info("server"));
        };
    }
}
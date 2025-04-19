package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.UserRowMapper;
import com.sjsu.booktable.model.dto.user.RegistrationRequest;
import com.sjsu.booktable.model.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void save(String useId, RegistrationRequest request) {
        String sql = "INSERT INTO users (user_id, first_name, last_name, role, email, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, useId, request.getFirstName(), request.getLastName(), request.getRole().name(), request.getEmail(), request.getPhoneNumber());
    }

    @Override
    public User findById(String userId) {
        String sql = "SELECT * FROM users WHERE user_id = ?";
        return jdbcTemplate.queryForObject(sql, new UserRowMapper(), userId);
    }
}

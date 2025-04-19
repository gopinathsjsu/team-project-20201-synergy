package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.entity.User;
import com.sjsu.booktable.model.enums.Role;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<User> {

    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        return User.builder()
                .userId(rs.getString("user_id"))
                .email(rs.getString("email"))
                .phoneNumber(rs.getString("phone_number"))
                .firstName(rs.getString("first_name"))
                .lastName(rs.getString("last_name"))
                .role(Role.valueOf(rs.getString("role")))
                .build();
    }
}

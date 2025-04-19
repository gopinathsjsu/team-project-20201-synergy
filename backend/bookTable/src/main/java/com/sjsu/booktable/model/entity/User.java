package com.sjsu.booktable.model.entity;

import com.sjsu.booktable.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {

    // in sync to Cognito user pool
    private String userId;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private Role role;

}

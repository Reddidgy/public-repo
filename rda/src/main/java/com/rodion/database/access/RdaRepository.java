package com.rodion.database.access;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RdaRepository {

    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private ObjectMapper objectMapper;

    public List<User> fetch() {
        return jdbcTemplate.query("select * from users limit 100",
                (rs, rowNum) -> new User(rs.getLong("ID"), rs.getString("Name")));
    }
}

package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    Optional<User> findById(Long id);

    List<User> findAll();

    void saveUser(User user);

    void deleteById(Long id);

    Optional<User> findByUsername(String username);

    long count();
}

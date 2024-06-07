package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SecurityServiceImpl implements SecurityService {
    private final PasswordEncoder bCryptPasswordEncoder;
    public SecurityServiceImpl(PasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }
    @Override
    public String getCrypt(String pass) {
        return bCryptPasswordEncoder.encode(pass);
    }
}

package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class InitDb {
    private final UserServiceImpl service;

    public InitDb(UserServiceImpl service) {
        this.service = service;
    }

    @PostConstruct
    public void init() {
        Set<Role> set = new HashSet<>();
        set.add(new Role("ROLE_ADMIN"));
        set.add(new Role("ROLE_USER"));
        User defaultUser = new User("admin@mail.ru", "admin"
                , set.stream().map(x -> new Role(x.getAuthority())).collect(Collectors.toList()));
        if (0 == service.count()) {
            service.saveUser(defaultUser);
        }
    }
}

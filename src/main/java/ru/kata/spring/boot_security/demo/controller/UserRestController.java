package ru.kata.spring.boot_security.demo.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.exception_handling.NoSuchUserException;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserRestController {

    private final UserService userService;
    private final RoleService roleService;

    public UserRestController(UserService service, RoleService roleService) {
        this.userService = service;
        this.roleService = roleService;
    }

    @GetMapping("/admin")
    public List<User> showAllUser() {
        return userService.findAll();
    }
    @GetMapping("/admin/roles")
    public List<Role> showAllRoles() {
        return roleService.findAll();
    }

    @GetMapping("/admin/{id}")
    public User getUser(@PathVariable long id) {
        Optional<User> userId = userService.findById(id);
        if (userId.isEmpty()) {
            throw new NoSuchUserException("User with ID " + id + " not Database.");
        }
        return userId.get();
    }
    @GetMapping("/admin/userNow")
    public User getUser(Principal principal) {
        Optional<User> userId = Optional.empty();
        for (User user : userService.findAll()) {
            if (user.getUsername().equals(principal.getName())) {
                userId = userService.findById(user.getId());
            }
        }
        if (userId.isEmpty()) {
            throw new NoSuchUserException("User is not in database!");
        }
        return userId.get();
    }

    @PostMapping("/admin")
    public User addNewUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    @PutMapping("/admin")
    public User editUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    @DeleteMapping("/admin/{id}")
    public String deleteUser(@PathVariable long id) {
        Optional<User> userId = userService.findById(id);
        if (userId.isEmpty()) {
            throw new NoSuchUserException("You can't delete a user from their ID " + id);
        }
        userService.deleteById(id);
        return "Removal User ID: " + id + " completed!";
    }
}

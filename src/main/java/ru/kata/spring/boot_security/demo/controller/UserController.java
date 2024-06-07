package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;

@Controller
public class UserController {

    private final UserService userService;
    private final RoleService roleService;

    public UserController(UserService service, RoleService roleService) {
        this.userService = service;
        this.roleService = roleService;
    }

    @GetMapping(value = "/")
    public String hello() {
        return "/hello";
    }

    @GetMapping(value = "/login")
    public String login() {
        return "login";
    }
    @GetMapping(value = "/logout")
    public String logout() {
        return "logout";
    }

    @GetMapping(value = "/user")
    public String showUser(Principal principal, Model model) {
        for (User user : userService.findAll()) {
            if (user.getUsername().equals(principal.getName())) {
                model.addAttribute("userId", user);
                return "user";
            }
        }
        return "notUser";
    }

    @GetMapping(value = "/admin")
    public String showAdmin(ModelMap model, Principal principal) {
        for (User user : userService.findAll()) {
            if (user.getUsername().equals(principal.getName())) {
                model.addAttribute("userId", user);
            }
        }
        model.addAttribute("roles", roleService.findAll());
        model.addAttribute("users", userService.findAll());
        model.addAttribute("new_user", new User());
        return "admin";
    }

    @PostMapping(value = "/saveUser")
    public String saveUser(@ModelAttribute("new_user") User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/findOne")
    @ResponseBody
    public User findOne(Long id) {
        return userService.findById(id).get();
    }

    @PostMapping(value = "/update")
    public String editUser(@ModelAttribute("new_user") User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PostMapping(value = "/delete")
    public String deleteUser(@ModelAttribute("new_user") User user) {
        userService.deleteById(user.getId());
        return "redirect:/admin";
    }
}

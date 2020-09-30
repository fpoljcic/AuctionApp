package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.requests.LoginRequest;
import ba.atlantbh.auctionapp.requests.RegisterRequest;
import ba.atlantbh.auctionapp.responses.LoginResponse;
import ba.atlantbh.auctionapp.responses.RegisterResponse;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import ba.atlantbh.auctionapp.services.PersonService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class PersonController {

    private final JwtTokenUtil jwtTokenUtil;
    private final PersonService personService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        final Person person = personService.login(loginRequest);
        final String token = jwtTokenUtil.generateToken(person);
        return ResponseEntity.ok(new LoginResponse(person, token));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest registerRequest) {
        Person person = personService.register(registerRequest);
        return ResponseEntity.ok(new RegisterResponse(person, jwtTokenUtil.generateToken(person)));
    }
}

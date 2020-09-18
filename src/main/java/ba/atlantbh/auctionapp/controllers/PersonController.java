package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.requests.LoginRequest;
import ba.atlantbh.auctionapp.requests.RegisterRequest;
import ba.atlantbh.auctionapp.responses.LoginResponse;
import ba.atlantbh.auctionapp.responses.RegisterResponse;
import ba.atlantbh.auctionapp.security.JsonWebToken;
import ba.atlantbh.auctionapp.services.PersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/person")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        Person person = personService.login(loginRequest);
        return ResponseEntity.ok(new LoginResponse(person, JsonWebToken.generateJWTToken(person)));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest registerRequest) {
        Person person = personService.register(registerRequest);
        return ResponseEntity.ok(new RegisterResponse(person, JsonWebToken.generateJWTToken(person)));
    }
}

package ba.atlantbh.auctionapp.controllers;

import ba.atlantbh.auctionapp.exceptions.BadGatewayException;
import ba.atlantbh.auctionapp.exceptions.BadRequestException;
import ba.atlantbh.auctionapp.exceptions.ConflictException;
import ba.atlantbh.auctionapp.exceptions.UnauthorizedException;
import ba.atlantbh.auctionapp.models.Person;
import ba.atlantbh.auctionapp.projections.PersonInfoProj;
import ba.atlantbh.auctionapp.requests.*;
import ba.atlantbh.auctionapp.responses.LoginResponse;
import ba.atlantbh.auctionapp.responses.RegisterResponse;
import ba.atlantbh.auctionapp.security.JwtTokenUtil;
import ba.atlantbh.auctionapp.services.PersonService;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class PersonController {

    private final JwtTokenUtil jwtTokenUtil;
    private final PersonService personService;

    @PostMapping("/login")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
    })
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        final Person person = personService.login(loginRequest);
        final String token = jwtTokenUtil.generateToken(person);
        return ResponseEntity.ok(new LoginResponse(person, token));
    }

    @PostMapping("/social/login")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
    })
    public ResponseEntity<LoginResponse> socialLogin(@RequestBody @Valid SocialLoginRequest socialLoginRequest) {
        final Person person = personService.socialLogin(socialLoginRequest);
        final String token = jwtTokenUtil.generateToken(person);
        return ResponseEntity.ok(new LoginResponse(person, token));
    }

    @PostMapping("/register")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 409, message = "Conflict", response = ConflictException.class),
    })
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest registerRequest) {
        Person person = personService.register(registerRequest);
        return ResponseEntity.ok(new RegisterResponse(person, jwtTokenUtil.generateToken(person)));
    }

    @PutMapping("/update")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
            @ApiResponse(code = 409, message = "Conflict", response = ConflictException.class),
    })
    public ResponseEntity<LoginResponse> update(@RequestBody @Valid UpdateProfileRequest updateProfileRequest) {
        Person person = personService.update(updateProfileRequest);
        return ResponseEntity.ok(new LoginResponse(person, jwtTokenUtil.generateToken(person)));
    }

    @PostMapping("/forgot_password")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 502, message = "Bad gateway", response = BadGatewayException.class),
    })
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid ForgotPassRequest forgotPassRequest) {
        return ResponseEntity.ok(personService.forgotPassword(forgotPassRequest));
    }

    @PostMapping("/reset_password")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
    })
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPassRequest resetPassRequest) {
        return ResponseEntity.ok(personService.resetPassword(resetPassRequest));
    }

    @PostMapping("/valid_token")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
    })
    public ResponseEntity<Boolean> validToken(@RequestBody @Valid TokenRequest tokenRequest) {
        return ResponseEntity.ok(personService.validToken(tokenRequest));
    }

    @GetMapping
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
    })
    public ResponseEntity<PersonInfoProj> getUserInfo(@RequestParam String userId) {
        return ResponseEntity.ok(personService.getUserInfo(userId));
    }

    @PostMapping("/notifications/update")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
    })
    public ResponseEntity<String> updateNotifications(@RequestBody @Valid UpdateNotifRequest updateNotifRequest) {
        personService.updateNotifications(updateNotifRequest);
        return ResponseEntity.ok("Notification preferences updated");
    }

    @PostMapping("/deactivate")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Bad request", response = BadRequestException.class),
            @ApiResponse(code = 401, message = "Unauthorized", response = UnauthorizedException.class),
    })
    public ResponseEntity<String> deactivate(@RequestBody @Valid DeactivateRequest deactivateRequest) {
        personService.deactivate(deactivateRequest.getPassword());
        return ResponseEntity.ok("User deactivated");
    }
}

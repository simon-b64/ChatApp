package at.avox.chatapp.web.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatRegistrationDto(
    @NotBlank(message = "Username is required")
    String username
) {
}

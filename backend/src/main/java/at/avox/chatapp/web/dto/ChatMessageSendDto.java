package at.avox.chatapp.web.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatMessageSendDto(
    @NotBlank(message = "Content cannot be blank")
    String content
) {
}

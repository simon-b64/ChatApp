package at.avox.chatapp.web.dto;

import at.avox.chatapp.enums.MessageType;
import lombok.Builder;

import java.time.OffsetDateTime;

@Builder
public record ChatMessageDto(
    MessageType type,
    String content,
    String username,
    OffsetDateTime timestamp
) {
}

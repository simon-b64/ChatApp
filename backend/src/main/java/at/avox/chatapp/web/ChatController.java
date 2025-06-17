package at.avox.chatapp.web;

import at.avox.chatapp.config.ChatappProperties;
import at.avox.chatapp.enums.MessageType;
import at.avox.chatapp.web.dto.ChatMessageDto;
import at.avox.chatapp.web.dto.ChatMessageSendDto;
import at.avox.chatapp.web.dto.ChatRegistrationDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.OffsetDateTime;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatappProperties chatappProperties;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage")
    @SendTo("/topic/chat")
    public ChatMessageDto sendMessage(@Valid @Payload ChatMessageSendDto chatMessageDto, SimpMessageHeaderAccessor headerAccessor) {
        var sessionAttributes = headerAccessor.getSessionAttributes();

        if (sessionAttributes == null) {
            throw new IllegalStateException("Session attributes are not available!");
        }

        if(!sessionAttributes.containsKey(chatappProperties.getUsernameSessionAttribute())) {
            throw new IllegalStateException("User is not authenticated!");
        }

        return ChatMessageDto.builder()
            .type(MessageType.CHAT)
            .username((String) sessionAttributes.get("username"))
            .content(chatMessageDto.content())
            .timestamp(OffsetDateTime.now())
            .build();
    }

    @MessageMapping("/addUser")
    @SendTo("/topic/chat")
    public ChatMessageDto addUser(
        @Valid @Payload ChatRegistrationDto registrationDto,
        Principal principal,
        SimpMessageHeaderAccessor headerAccessor
    ) {
        var sessionAttributes = headerAccessor.getSessionAttributes();

        if (sessionAttributes == null) {
            throw new IllegalStateException("Session attributes are not available!");
        }

        if(sessionAttributes.containsKey(chatappProperties.getUsernameSessionAttribute())) {
            throw new IllegalStateException("User is already authenticated!");
        }

        messagingTemplate.convertAndSendToUser(
            principal.getName(),
            "/queue/reply",
            "Welcome to the chat, " + registrationDto.username() + "!"
        );

        sessionAttributes.put(chatappProperties.getUsernameSessionAttribute(), registrationDto.username());
        return ChatMessageDto.builder()
            .type(MessageType.JOIN)
            .username(registrationDto.username())
            .timestamp(OffsetDateTime.now())
            .build();
    }

}

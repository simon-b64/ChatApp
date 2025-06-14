package at.avox.chatapp.eventlistener;

import at.avox.chatapp.config.ChatappProperties;
import at.avox.chatapp.enums.MessageType;
import at.avox.chatapp.web.dto.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.OffsetDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final ChatappProperties chatappProperties;
    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        log.info("Received a new web socket connection: {}", event);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        var sessionAttributes = accessor.getSessionAttributes();

        if (sessionAttributes == null || !sessionAttributes.containsKey(chatappProperties.getUsernameSessionAttribute())) {
            log.info("Session disconnected without a username: {}", event);
            return;
        }

        String username = (String) accessor.getSessionAttributes().get(chatappProperties.getUsernameSessionAttribute());
        log.info("User disconnected: {}", username);

        var chatMessage = ChatMessageDto.builder()
            .type(MessageType.LEAVE)
            .username(username)
            .timestamp(OffsetDateTime.now())
            .build();

        messagingTemplate.convertAndSend("/topic/chat", chatMessage);
    }

}

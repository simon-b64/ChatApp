package at.avox.chatapp.web;

import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.availability.AvailabilityChangeEvent;
import org.springframework.boot.availability.LivenessState;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * This endpoint is used for kubernetes health checks.
 */
@RestController
@RequestMapping("/health")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class CustomHealthController {

    private final ApplicationContext applicationContext;
    private boolean status = true;

    @PermitAll
    @GetMapping
    public ResponseEntity<String> getHealth() {
        if (status) {
            return ResponseEntity.ok("OK");
        }
        return ResponseEntity.internalServerError().build();
    }

    /**
     * Before the shutdown of a pod this url will be called. Afterwards the health probes fail. Therefore the pod
     * is removed from the healthy pods which are exposed. This way a zero downtime upgrade is possible.
     */
    @PermitAll
    @GetMapping("/prepareShutdown")
    public void preShutdown() {
        AvailabilityChangeEvent.publish(applicationContext, LivenessState.BROKEN);
        status = false;
    }
}

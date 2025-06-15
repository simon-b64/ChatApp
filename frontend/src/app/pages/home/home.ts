import {AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MessageStore} from '../../stores/message.store';
import {DatePipe} from '@angular/common';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {faSmile} from '@fortawesome/free-regular-svg-icons';
import {SocketClientService} from '../../services/socket-client.service';
import {MessageDto} from '../../model/messageDto';
import {Subscription} from 'rxjs';
import {MessageType} from '../../enums/messageType';

@Component({
    selector: 'app-home',
    imports: [
        DatePipe,
        FaIconComponent,
        ReactiveFormsModule
    ],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomePage implements OnInit, OnDestroy, AfterViewChecked {
    protected readonly messageStore = inject(MessageStore);
    private readonly formBuilder = inject(FormBuilder);
    private readonly socketClientService = inject(SocketClientService);

    private messageSubscription: Subscription | undefined;

    @ViewChild('messagesContainer') private readonly messagesContainer!: ElementRef;

    messageForm: FormGroup;

    constructor() {
        this.messageForm = this.formBuilder.group({
            message: ['', [Validators.required, Validators.maxLength(5120)]],
        });
    }

    sendMessage() {
        if (this.messageForm.invalid) {
            return;
        }

        this.socketClientService.send("/app/sendMessage", {
            content: this.messageForm.value.message.trim()
        });
        this.messageForm.reset();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    ngOnInit() {
        this.messageSubscription = this.socketClientService.onMessage<MessageDto>("/topic/chat")
            .subscribe({
                next: (message: MessageDto) => {
                    this.messageStore.appendMessage(message);
                    this.scrollToBottom();
                },
                error: (err) => console.error('Error receiving message:', err)
            });
    }

    ngOnDestroy() {
        this.messageSubscription?.unsubscribe();
    }

    private scrollToBottom(): void {
        if (this.messagesContainer) {
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        }
    }

    protected faPaperPlane = faPaperPlane;
    protected faSmile = faSmile;
    protected readonly MessageType = MessageType;
}

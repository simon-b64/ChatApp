import {AfterViewChecked, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {MessageStore} from '../../stores/message.store';
import {DatePipe} from '@angular/common';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faSmile } from '@fortawesome/free-regular-svg-icons';

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
export class HomePage implements AfterViewChecked {
    protected readonly messageStore = inject(MessageStore);
    private readonly formBuilder = inject(FormBuilder);

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

        this.messageStore.appendMessage({
            content: this.messageForm.value.message.trim(),
            author: 'User',
            timestamp: new Date()
        });
        this.messageForm.reset();
    }

    protected faPaperPlane = faPaperPlane;
    protected faSmile = faSmile;

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        if (this.messagesContainer) {
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        }
    }
}

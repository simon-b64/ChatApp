import {Component, inject} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faSmile } from '@fortawesome/free-regular-svg-icons';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageStore} from '../../stores/message.store';

@Component({
    selector: 'app-footer',
    imports: [
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './footer.html',
    styleUrl: './footer.css'
})
export class Footer {
    private readonly formBuilder = inject(FormBuilder);
    private readonly messageStore = inject(MessageStore);

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
}

import {AfterViewChecked, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {MessageStore} from '../../stores/message.store';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-home',
    imports: [
        DatePipe
    ],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomePage implements AfterViewChecked {
    protected readonly messageStore = inject(MessageStore);
    @ViewChild('messagesContainer') private readonly messagesContainer!: ElementRef;

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        if (this.messagesContainer) {
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        }
    }
}

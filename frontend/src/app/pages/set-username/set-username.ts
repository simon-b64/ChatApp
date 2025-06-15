import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageStore} from '../../stores/message.store';
import {Router} from '@angular/router';
import {SocketClientService} from '../../services/socket-client.service';

@Component({
    selector: 'app-set-username',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './set-username.html',
    styleUrl: './set-username.css'
})
export class SetUsernamePage {
    private readonly formBuilder = inject(FormBuilder);
    private readonly messageStore = inject(MessageStore);
    private readonly router = inject(Router);
    private readonly socketClientService = inject(SocketClientService);

    usernameForm: FormGroup;

    constructor() {
        this.usernameForm = this.formBuilder.group({
            username: ['', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.usernameForm.invalid) {
            return;
        }

        this.messageStore.setUsername(this.usernameForm.value.username);
        this.socketClientService.send("/app/addUser", {username: this.usernameForm.value.username});
        this.router.navigate(['/']).then();
    }

}

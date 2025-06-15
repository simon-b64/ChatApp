import {inject, Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {MessageStore} from '../stores/message.store';

@Injectable({ providedIn: 'root' })
export class UsernameGuard implements CanActivate {
    private readonly router = inject(Router);
    private messageStore = inject(MessageStore);

    canActivate(): boolean {
        if (this.messageStore.username() !== undefined) {
            return true;
        }
        this.router.navigate(['/set-username']).then();
        return false;
    }
}

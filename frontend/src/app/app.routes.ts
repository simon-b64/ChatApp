import {Routes} from '@angular/router';
import {NotFoundPage} from './pages/not-found/not-found';
import {HomePage} from './pages/home/home';
import {UsernameGuard} from './guards/usernameGuard';
import {NoUsernameGuard} from './guards/noUsernameGuard';
import {SetUsernamePage} from './pages/set-username/set-username';

export const routes: Routes = [
    {
        path: '',
        component: HomePage,
        pathMatch: 'full',
        canActivate: [UsernameGuard]
    },
    {
        path: 'set-username',
        component: SetUsernamePage,
        canActivate: [NoUsernameGuard]
    },
    {
        path: 'not-found',
        component: NotFoundPage,
    },
    {
        path: '**',
        redirectTo: '/not-found',
    },
];

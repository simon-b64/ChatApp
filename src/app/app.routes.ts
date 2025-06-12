import {Routes} from '@angular/router';
import {NotFoundPage} from './pages/not-found/not-found';
import {HomePage} from './pages/home/home';

export const routes: Routes = [
    {
        path: '',
        component: HomePage,
        pathMatch: 'full',
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

import { Routes } from '@angular/router';
import { NotFoundPage } from './pages/not-found/not-found';

export const routes: Routes = [
    {
        path: 'not-found',
        component: NotFoundPage,
    },
    {
        path: '**',
        redirectTo: '/not-found',
    },
];

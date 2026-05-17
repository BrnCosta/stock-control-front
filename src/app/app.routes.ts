import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Dividends } from './features/dividends/dividends';
import { Transactions } from './features/transactions/transactions';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'dividends', component: Dividends },
      { path: 'transactions', component: Transactions }
    ]
  }
];

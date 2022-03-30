import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from "./overview/overview.component";
import { AppComponent } from "./app.component";
import { AccountComponent } from "./account/account.component";
import { StakeUnlockComponent } from "./stake-unlock/stake-unlock.component";
import { SignoutComponent } from "./signout/signout.component";
import { UsersComponent } from './users/users.component';
import { LogsComponent } from "./logs/logs.component";
import { SearchComponent } from "./search/search.component";

const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            {
                path: '',
                component: OverviewComponent,
                pathMatch: 'full',
            },
            {
                path: 'search',
                component: SearchComponent,
                pathMatch: 'full',
            },
            {
                path: 'account/:address',
                component: AccountComponent,
                pathMatch: 'full'
            },
            {
                path: 'stake-unlock',
                component: StakeUnlockComponent,
                pathMatch: 'full'
            },
            {
                path: 'signout',
                component: SignoutComponent,
                pathMatch: 'full'
            },
            {
                path: 'users',
                component: UsersComponent,
                pathMatch: 'full'
            },
            {
                path: 'logs',
                component: LogsComponent,
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule( {
    imports: [RouterModule.forRoot( routes )],
    exports: [RouterModule]
} )
export class AppRoutingModule {
}

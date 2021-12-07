import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { ApiClientService } from "./services/api-client.service";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { TreeComponent } from './tree/tree.component';
import { ClipboardModule } from 'ngx-clipboard';
import { StakeUnlockComponent } from './stake-unlock/stake-unlock.component';
import { AccountComponent } from './account/account.component';
import { OverviewComponent } from './overview/overview.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthComponent } from './auth/auth.component';
import { JwtModule } from "@auth0/angular-jwt";
import { AuthService } from './services/auth.service';
import { InterceptorModule } from './interceptor/interceptor.module';

@NgModule( {
    declarations: [
        AppComponent,
        TreeComponent,
        StakeUnlockComponent,
        AccountComponent,
        OverviewComponent,
        AuthComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CommonModule,
        ClipboardModule,
        HttpClientModule,
        InterceptorModule,
        FormsModule,
        JwtModule.forRoot( {
            config: {
                tokenGetter: () => {
                    return AuthService.access_token || localStorage.getItem("access_token");
                },
                //authScheme: "bearer ",
                allowedDomains: ["3.124.189.139:3002"],
                //allowedDomains: ["*"],
                //disallowedRoutes: ["http://example.com/examplebadroute/"],
            } } ),
            NgxMatDatetimePickerModule,
            NgxMatTimepickerModule,
            ReactiveFormsModule,
            MatDatepickerModule,
            MatInputModule,
            NgxMatNativeDateModule,
            NgxPaginationModule,
            CommonModule,
            BrowserModule,
            ReactiveFormsModule
    ],
    providers: [
        ApiClientService
    ],
    bootstrap: [AppComponent]
} )
export class AppModule {
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { ApiClientService } from './services/api-client.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { SignoutComponent } from './signout/signout.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersComponent } from './users/users.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ActivateComponent } from './activate/activate.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LogsComponent } from './logs/logs.component';
import { SearchComponent } from './search/search.component';
import { MatButtonModule } from "@angular/material/button";
import {
    NGX_MAT_DATE_FORMATS,
    NgxMatDatetimePickerModule, NgxMatNativeDateModule,
    NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, NgxMatMomentModule } from "@angular-material-components/moment-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";

@NgModule( {
    declarations: [
        AppComponent,
        TreeComponent,
        StakeUnlockComponent,
        AccountComponent,
        OverviewComponent,
        AuthComponent,
        SignoutComponent,
        UserFormComponent,
        UsersComponent,
        ActivateComponent,
        LogsComponent,
        SearchComponent,
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
        ReactiveFormsModule,
        MatButtonModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        MatDatepickerModule,
        NgxMatNativeDateModule,
        NgxMatMomentModule,
        JwtModule.forRoot( {
                config: {
                    tokenGetter: () => {
                        return AuthService.access_token || localStorage.getItem( "access_token" );
                    },
                }
            }
        ),
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule,
        NgxPaginationModule,
        SweetAlert2Module.forRoot(),
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        QRCodeModule,
    ],
    providers: [
        ApiClientService,
        { provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        {
            provide: NGX_MAT_DATE_FORMATS, useValue: {
                parse: {
                    dateInput: "MMM DD, YYYY, LT"
                },
                display: {
                    dateInput: "MMM DD, YYYY, LT",
                    monthYearLabel: "MMM YYYY",
                    dateA11yLabel: "LL",
                    monthYearA11yLabel: "MMMM YYYY"
                },
            }
        },
    ],
    bootstrap: [AppComponent]
} )
export class AppModule {
}

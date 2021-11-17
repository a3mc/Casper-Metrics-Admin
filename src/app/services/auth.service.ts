import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { take } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt"

@Injectable( {
    providedIn: 'root'
} )
export class AuthService {

    public loggedIn = false;
    public errorMessage: string;
    public user: any;
    public static access_token;

    constructor(
        private _apiClientService: ApiClientService
    ) {
    }

    public async authByToken( token: string ) {
        this._apiClientService.get(
            'me',
        ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.loggedIn = true;
                    this.user = result;
                },
                error => {
                    console.log( error );
                    this.loggedIn = false;
                    this.user = null;
                    this.errorMessage = error?.error?.error?.message || 'Error!';
                }
            )
    }

    public auth( user: any ) {
        this._apiClientService.post(
            'login',
            user
        ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.loggedIn = true;
                    this.user = result;
                    AuthService.access_token = result.token;
                    if ( user.remember ) {
                        localStorage.setItem( 'access_token', result.token )
                    }

                },
                error => {
                    this.loggedIn = false;
                    this.user = null;
                    localStorage.removeItem( 'access_token' );
                    console.log( error );
                    this.errorMessage = error?.error?.error?.message || 'Error!';
                }
            )
    }
}

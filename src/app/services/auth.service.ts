import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { take } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt"
import { Router } from "@angular/router";

@Injectable( {
    providedIn: 'root'
} )
export class AuthService {

    public loggedIn = false;
    public errorMessage: string;
    public user: any;
    public static access_token = localStorage.getItem( 'access_token' );

    constructor(
        private _apiClientService: ApiClientService,
        private _router: Router,
    ) {
    }

    public authByToken( token: string ): void {
        this._apiClientService.get(
            'me',
        ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.loggedIn = true;
                    this.user = result;
                },
                error => {
                    this.loggedIn = false;
                    this.user = null;
                    if ( !error?.error?.error?.message.match( /expired/) ) {
                        this.errorMessage = error?.error?.error?.message || 'Error!';
                    }
                    console.error( error );
                }
            );
    }

    public auth( user: any ): void {
        this._apiClientService.post(
            'login',
            user
        ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.loggedIn = true;
                    this.user = result;
                    AuthService.access_token = result.token;
                    localStorage.setItem( 'access_token', result.token );
                    this._router.navigate( ['/'] );
                },
                error => {
                    this.loggedIn = false;
                    this.user = null;
                    localStorage.removeItem( 'access_token' );
                    console.error( error );
                    this.errorMessage = error?.error?.error?.message || 'Error!';
                }
            );
    }

    public signOut(): void {
        this._router.navigate( [''] ).then( () => {
            localStorage.removeItem( 'access_token' );
            this.user = null;
            this.loggedIn = false;
        } );
    }
}

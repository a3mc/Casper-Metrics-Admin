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

    constructor(
        private _apiClientService: ApiClientService
    ) {
    }

    public auth( user: any ) {
        this._apiClientService.post(
            'auth',
            user
        ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.loggedIn = true;
                    console.log( result.token );

                    const helper = new JwtHelperService();
                    const decodedToken = helper.decodeToken( result.token );
                    const expirationDate = helper.getTokenExpirationDate( result.token );
                    const isExpired = helper.isTokenExpired( result.token );

                    console.log( result.token, decodedToken, expirationDate, isExpired )
                },
                error => {
                    this.loggedIn = false;
                    console.error( error )
                }
            )
    }
}

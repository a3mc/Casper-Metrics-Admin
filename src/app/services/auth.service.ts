import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { take } from 'rxjs/operators';
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Injectable( {
    providedIn: 'root'
} )
export class AuthService {

    public static access_token = localStorage.getItem( 'access_token' );
    public loggedIn = false;
    public isActivating = false;
    public errorMessage: string;
    public user: any;
    public status = 0;
    public checkingToken = false;
    private _authTimer: number;

    constructor(
        private _apiClientService: ApiClientService,
        private _router: Router,
    ) {
        setInterval( () => {
            this.checkStatus();
        }, 2000 );
    }

    public checkStatus(): void {
        if ( !this.loggedIn || !this.user || this.user.role === 'viewer' ) {
            return;
        }
        this._apiClientService.get(
            'transfers/status',
        ).pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    this.status = result;
                }
            );
    }

    public authByToken( token: string ): void {
        this._apiClientService.get(
            'me',
        ).pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    if ( this.user && result.role && this.user.role !== result.role ) {
                        console.warn( 'User role has been changed.' );
                        Swal.fire( {
                            title: 'Attention!',
                            text: 'You user role was changed by the admin. Please log in again.',
                            icon: 'warning',
                            confirmButtonText: 'Ok',
                            showCancelButton: false
                        } ).then(
                            () => {
                                this.signOut();
                            }
                        );
                        return;
                    }

                    this.loggedIn = true;
                    this.user = result;
                    this._recheckAuth();
                    this.checkStatus();
                    this.checkingToken = false;
                },
                error => {
                    if (
                        error.status &&
                        error.status >= 400 && error.status < 500
                    ) {
                        this.loggedIn = false;
                        this.user = null;
                        localStorage.removeItem( 'access_token' );
                        this._router.navigate( ['/'] );
                        if ( !error?.error?.error?.message.match( /expired/ ) ) {
                            this.errorMessage = error?.error?.error?.message || 'Error!';
                        }
                    }
                    this.checkingToken = false;
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
                    // Admin init redirect.
                    if ( result.activate ) {
                        location.replace( '/?activate=' + result.activate );
                        return;
                    }
                    this.loggedIn = true;
                    this.user = result;
                    AuthService.access_token = result.token;
                    localStorage.setItem( 'access_token', result.token );
                    this._recheckAuth();
                },
                error => {
                    this.loggedIn = false;
                    this.user = null;
                    localStorage.removeItem( 'access_token' );
                    this.errorMessage = 'Wrong email, password or 2FA code';
                    console.error( error );
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

    private _recheckAuth(): void {
        clearTimeout( this._authTimer );
        if ( AuthService.access_token ) {
            this._authTimer = setTimeout(
                () => {
                    this.authByToken( AuthService.access_token );
                },
            )
        }

    }
}

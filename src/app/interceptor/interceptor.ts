import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpHeaderRequestInterceptor implements HttpInterceptor {

    constructor(
        private _authService: AuthService
    ) {}

    intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
        if ( AuthService.access_token ) {
            const xAuthToken = AuthService.access_token;
            request = request.clone( {
                setHeaders: {
                    'Authorization': 'Bearer ' + xAuthToken
                }
            } );
        }

        return next.handle( request ).pipe( catchError(
            ( error: any, caught: Observable<HttpEvent<any>> ) => {
                if ( error.status === 401 ) {
                    console.warn( 'logout!' ); // FIXME!
                    // this._authenticationService.logout();
                    // return of( error );
                }
                throw error;
            }
        ) );
    }
}

import { Component, OnInit } from '@angular/core';
import { AccountNode } from "./tree/tree.component";
import { VAULTS } from "../vaults";
import { AuthService } from './services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
} )
export class AppComponent implements OnInit {
    public loggedIn = false;
    public vaults: AccountNode[] = Object.assign( [], VAULTS );

    constructor(
        public authService: AuthService,
        private _activeRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this._activeRoute.queryParams.subscribe( async ( params ) => {
            if ( params['activate'] ) {
                localStorage.removeItem( 'access_token' );
                this.authService.user = null;
                this.authService.loggedIn = false;
                this.authService.isActivating = true;
            }
        } );
    }
}

import { Component } from '@angular/core';
import { AccountNode } from "./tree/tree.component";
import { VAULTS } from "../vaults";
import { AuthService } from './services/auth.service';

@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
} )
export class AppComponent {
    public loggedIn = false;
    public vaults: AccountNode[] = Object.assign( [], VAULTS );

    constructor(
        public authService: AuthService,
    ) {
    }
}

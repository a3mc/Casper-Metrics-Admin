import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { ApiClientService } from '../services/api-client.service';
import { AuthService } from '../services/auth.service';

@Component( {
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
} )
export class UsersComponent implements OnInit {

    public selectedUser: any = null;
    public users: any[] = [];

    constructor(
        public authService: AuthService,
        private _apiClientService: ApiClientService
    ) {
    }

    ngOnInit(): void {
        this._getUsers();
    }

    public addNewUser(): void {
        this.selectedUser = null;
        setTimeout( () => { this.selectedUser = { active: true, role: 'editor' }; } );
    }

    public setUser( user: any ): void {
        this.selectedUser = null;
        setTimeout( () => { this.selectedUser = user; } );
    }

    public userUpdated(): void {
        this._getUsers();
    }

    private _getUsers(): void {
        this._apiClientService.get( 'users' ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    // @ts-ignore
                    this.users = result;
                }
            );
    }

}

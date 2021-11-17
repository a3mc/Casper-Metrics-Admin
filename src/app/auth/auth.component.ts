import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component( {
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
} )
export class AuthComponent implements OnInit {

    public userForm: FormGroup;

    get email(): AbstractControl {
        return this.userForm.get( 'UserEmail' );
    }

    get password(): AbstractControl {
        return this.userForm.get( 'UserPassword' );
    }

    get remember(): AbstractControl {
        return this.userForm.get( 'Remember' );
    }

    constructor(
        public authService: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.init();
    }

    public init() {
        const token = localStorage.getItem( 'access_token' );
        if ( token ) {
            this.authService.authByToken(token);
        }
        this._createUserForm();
    }

    public signIn(): void {
        if ( !this.remember.value ) {
            localStorage.removeItem( 'access_token' );
        }
        this.authService.auth( {
            email: this.email.value,
            password: this.password.value,
            remember: this.remember.value
        } )
    }

    private _createUserForm(): void {
        this.userForm = new FormGroup( {
            'UserEmail': new FormControl( null, [
                Validators.required,
                Validators.email
            ] ),
            'UserPassword': new FormControl( null, [
                Validators.required,
                Validators.minLength( 12 )
            ] ),
            'Remember': new FormControl( null ),
        } );
    }

}

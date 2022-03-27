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

    constructor(
        public authService: AuthService,
    ) {
    }

    get email(): AbstractControl {
        return this.userForm.get( 'UserEmail' );
    }

    get password(): AbstractControl {
        return this.userForm.get( 'UserPassword' );
    }

    get faCode(): AbstractControl {
        return this.userForm.get( 'FaCode' );
    }

    ngOnInit(): void {
        this.init();
    }

    public init() {
        const token = localStorage.getItem( 'access_token' );
        if ( token ) {
            this.authService.authByToken( token );
        }
        this._createUserForm();
    }

    public signIn(): void {
        this.authService.auth( {
            email: this.email.value,
            password: this.password.value,
            faCode: this.faCode.value,
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
            'FaCode': new FormControl( null, [
                Validators.required,
                Validators.minLength( 6 ),
                Validators.maxLength( 6 )
            ] ),
        } );
    }

}

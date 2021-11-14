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
        return this.userForm.get( 'UserEmail' );
    }

    constructor(
        public authService: AuthService,
    ) {
    }

    ngOnInit(): void {
      this._createUserForm();
    }

    public signIn(): void {
        this.authService.auth( {
            email: this.email.value,
            password: this.password.value
        })
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
      } );
    }

}

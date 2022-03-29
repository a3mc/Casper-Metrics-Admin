import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ApiClientService } from '../services/api-client.service';
import { AuthService } from '../services/auth.service';

@Component( {
    selector: 'app-activate',
    templateUrl: './activate.component.html',
    styleUrls: ['./activate.component.scss']
} )
export class ActivateComponent implements OnInit {

    public userForm: FormGroup;
    public denyError = false;
    public user: any = {};
    public twoFactor: any = null;
    public twoFactorVerified = false;
    public twoFactorWrong = false;
    public errorMessage: string = null;
    private _token: string = null;

    constructor(
        public authService: AuthService,
        private _apiClientService: ApiClientService,
        private _activeRoute: ActivatedRoute,
        private _router: Router,
    ) {
    }

    get password(): AbstractControl {
        return this.userForm.get( 'UserPassword' );
    }

    get password2(): AbstractControl {
        return this.userForm.get( 'UserPassword2' );
    }

    get verificationCode(): AbstractControl {
        return this.userForm.get( 'VerificationCode' );
    }

    ngOnInit(): void {
        this._activeRoute.queryParams.subscribe( params => {
            if ( params['activate'] ) {
                this._token = params['activate'];
                localStorage.clear();
                this._validateToken();
            }
        } );
    }

    public verifyCode(): void {
        this._apiClientService.get(
            'verify2fa?secret=' + this.twoFactor.secret +
            '&token=' + this.verificationCode.value
        )
            .pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.twoFactorVerified = !!result;
                    if ( !this.twoFactorVerified ) {
                        this.errorMessage = 'Wrong 2FA code';
                    }
                    this.twoFactorWrong = !this.twoFactorVerified;
                }
            );
    }

    public save(): void {
        if ( this.userForm.invalid ) {
            return;
        }

        this._apiClientService.post( 'activate ', {
            password: this.password.value,
            secret: this.twoFactor.secret,
            token: this._token
        } ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.authService.isActivating = false;
                    this._router.navigate( ['/'] );
                },
                error => {
                    this.errorMessage = 'Error submitting the form';
                    console.error( error );
                }
            );
    }

    private _validateToken(): void {
        this._apiClientService.get( 'activate?token=' + this._token )
            .pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.user = result;
                    this._generate2fa();
                    this._createUserForm();
                },
                error => {
                    this.denyError = true;
                }
            );
    }

    private _checkPasswords: ValidatorFn = ( group: AbstractControl ): ValidationErrors | null => {
        if ( !this.userForm ) {
            return null;
        }
        const pass = this.password.value;
        const confirmPass = this.password2.value
        return pass === confirmPass ? null : { notSame: true }
    }

    private _generate2fa(): void {
        this.twoFactorVerified = false;
        this._apiClientService.get( 'generate2fa?email=' + this.user.email ).pipe( take( 1 ) )
            .subscribe( result => {
                this.twoFactor = result;
            } );
    }

    private _createUserForm(): void {
        this.userForm = new FormGroup( {
            'UserPassword': new FormControl( null, [
                Validators.required,
                Validators.minLength( 12 )
            ] ),
            'UserPassword2': new FormControl( null, [
                Validators.required,
                Validators.minLength( 12 ),
                this._checkPasswords
            ] ),
            'VerificationCode': new FormControl( null ),
        } );
    }

}

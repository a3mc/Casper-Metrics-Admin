import { Component, Input, OnInit, Output,  EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ApiClientService } from '../services/api-client.service';
import { AuthService } from '../services/auth.service';

@Component( {
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
} )
export class UserFormComponent implements OnInit {

    @Input( 'user' ) user: any;
    @Output() updated = new EventEmitter<void>();

    public userForm: FormGroup;
    public errorMessage: string = null;
    public showSuccess = false;
    public roles: string[] = [
        'editor',
        'administrator',
    ];
    public setPassword = false;
    public twoFactor: any = null;

    get email(): AbstractControl {
        return this.userForm.get( 'UserEmail' );
    }

    get password(): AbstractControl {
        return this.userForm.get( 'UserPassword' );
    }

    get firstName(): AbstractControl {
        return this.userForm.get( 'FirstName' );
    }

    get lastName(): AbstractControl {
        return this.userForm.get( 'LastName' );
    }

    get role(): AbstractControl {
        return this.userForm.get( 'Role' );
    }

    get fa(): AbstractControl {
        return this.userForm.get( 'FA' );
    }

    get disable2FA(): AbstractControl {
        return this.userForm.get( 'Disable2FA' );
    }

    get active(): AbstractControl {
        return this.userForm.get( 'Active' );
    }

    constructor(
        public authService: AuthService,
        private _apiClientService: ApiClientService,
    ) {
    }

    ngOnInit(): void {
        this._createUserForm();
    }

    public save(): void {
        const updatedUser: any = {
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            email: this.email.value,
            fa: this.fa.value,
        };

        if ( this.password.value ) {
            updatedUser.password = this.password.value;
        }

        if ( this.twoFactor && this.fa.value ) {
            updatedUser.faSecret = this.twoFactor.secret;
        }

        if ( this.user.id !== this.authService.user.id ) {
            if ( this.role.value ) {
                updatedUser.role = this.role.value;
            }

            if ( this.active.value !== undefined ) {
                updatedUser.active = this.active.value;
            }

            if ( this.disable2FA.value ) {
                updatedUser.fa = false;
            }
        }





        if ( this.user.id ) {
            this._updateUser( updatedUser );
        } else {
            this._createUser( updatedUser );
        }
    }

    public generate2fa(): void {
        if ( !this.fa.value ) {
            this.twoFactor = null;
            return;
        }

        this._apiClientService.get( 'generate2fa' ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.twoFactor = result;
                }
            );
    }

    private _createUser( user ): void {
        this._apiClientService.post( 'new-user', user ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.errorMessage = null;
                    this.showSuccess = true;
                    this.updated.emit();
                },
                error => {
                    this.errorMessage = 'Error updating profile!'
                    this.showSuccess = false;
                }
            )
    }

    private _updateUser( user ): void {
        this._apiClientService.post( 'users/' + this.user.id, user ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.errorMessage = null;
                    this.showSuccess = true;
                    this.updated.emit();
                },
                error => {
                    this.errorMessage = 'Error updating profile!'
                    this.showSuccess = false;
                }
            )
    }

    private _createUserForm(): void {
        this.userForm = new FormGroup( {
            'UserEmail': new FormControl( this.user.email, [
                Validators.required,
                Validators.email
            ] ),
            'UserPassword': new FormControl( null ),
            'FirstName': new FormControl( this.user.firstName ),
            'LastName': new FormControl( this.user.lastName ),
            'Role': new FormControl( this.user.role ),
            'FA': new FormControl( !!this.user.fa ),
            'Disable2FA': new FormControl( !this.user.fa ),
            'Active': new FormControl( this.user.active ),
        } );

        if ( !this.user.id ) {
            this.setPassword = true;
        }
    }
}

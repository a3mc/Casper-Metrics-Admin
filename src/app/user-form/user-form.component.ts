import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ApiClientService } from '../services/api-client.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2'

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
        'viewer',
        'editor',
        'administrator',
    ];

    constructor(
        public authService: AuthService,
        private _apiClientService: ApiClientService,
    ) {
    }

    get email(): AbstractControl {
        return this.userForm.get( 'UserEmail' );
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

    get active(): AbstractControl {
        return this.userForm.get( 'Active' );
    }

    ngOnInit(): void {
        this._createUserForm();
    }

    public save(): void {
        if ( this.user.id ) {
            this._updateUserRole( {
                role: this.role.value
            } );
        } else {
            this._createUser( {
                firstName: this.firstName.value,
                lastName: this.lastName.value,
                email: this.email.value,
            } );
        }
    }

    public confirmReset(): void {
        Swal.fire( {
            title: 'Attention!',
            text: 'This will deactivate the user and email a new activation link. Do you want to continue?',
            icon: 'error',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        } ).then(
            ( result ) => {
                if ( result.isConfirmed ) {
                    this._apiClientService.post( 'users/' + this.user.id + '/reset', null )
                        .pipe( take( 1 ) )
                        .subscribe(
                            result => {
                                this.errorMessage = null;
                                this.showSuccess = true;
                                setTimeout( () => { this.updated.emit(); }, 2000 );
                            },
                            error => {
                                this.errorMessage = error?.error?.error?.message || 'Error reseting user profile';
                            }
                        );
                }
            }
        )
    }

    public confirmDeactivate(): void {
        Swal.fire( {
            title: 'Attention!',
            text: 'This will permanently deactivate the account. Do you want to continue?',
            icon: 'error',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        } ).then(
            ( result ) => {
                if ( result.isConfirmed ) {
                    this._apiClientService.post( 'users/' + this.user.id + '/deactivate', null )
                        .pipe( take( 1 ) )
                        .subscribe(
                            result => {
                                this.errorMessage = null;
                                this.showSuccess = true;
                                setTimeout( () => { this.updated.emit(); }, 2000 );
                            },
                            error => {
                                this.errorMessage = error?.error?.error?.message || 'Error deactivating user profile';
                            }
                        );
                }

            }
        )
    }

    private _createUser( user ): void {
        this._apiClientService.post( 'invite', user ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.errorMessage = null;
                    this.showSuccess = true;
                    setTimeout( () => { this.updated.emit(); }, 2000 );
                },
                error => {
                    this.errorMessage = 'Error creating user!'
                    this.showSuccess = false;
                }
            )
    }

    private _updateUserRole( user ): void {
        this._apiClientService.post( 'users/' + this.user.id + '/role/' + user.role, null ).pipe( take( 1 ) )
            .subscribe(
                result => {
                    this.errorMessage = null;
                    this.showSuccess = true;
                    setTimeout( () => { this.updated.emit(); }, 2000 );

                },
                error => {
                    this.errorMessage = error?.error?.error?.message || 'Error updating profile!';
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
            'FirstName': new FormControl( this.user.firstName ),
            'LastName': new FormControl( this.user.lastName ),
            'Role': new FormControl( this.user.role ),
        } );
    }
}

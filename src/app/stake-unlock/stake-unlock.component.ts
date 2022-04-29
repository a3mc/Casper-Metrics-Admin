import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Message } from "../account/account.component";
import { ApiClientService } from "../services/api-client.service";
import { AuthService } from '../services/auth.service';
import * as moment from "moment";

@Component( {
    selector: 'app-stake-unlock',
    templateUrl: './stake-unlock.component.html',
    styleUrls: ['./stake-unlock.component.scss']
} )
export class StakeUnlockComponent implements OnInit {

    // Initial Validators Weight
    public readonly locked = 3535670616;
    public readonly genesisDate = '2021-03-31T15:00:39.552Z';

    public unlock90 = 0;
    public customUnlocks = [];
    public message: Message;
    public isSaving = false;
    public expanded = false;

    constructor(
        public authService: AuthService,
        private _apiClientService: ApiClientService
    ) {
    }

    ngOnInit(): void {
        this.isSaving = false;
        this._apiClientService.get( 'validators-unlock' )
            .subscribe(
                ( result: any ) => {
                    const days90 = result.filter( record => record.day >= 90 &&  record.day <= 103 );

                    if ( !days90.length ) {
                        this.unlock90 = 0;
                    } else {
                        this.unlock90 = Math.round( days90.reduce( ( a, b ) => {
                            return Number( a ) + Number( b.amount )
                        }, 0 ) / 1000000000 );
                    }

                    const custom = result.filter( record => record.day > 103 );

                    this.customUnlocks = custom.map( ( record: any ) => {
                        return {
                            date: moment( record.timestamp ).utc().format(),
                            amount: Math.round( record.amount / 1000000000 )
                        }
                    } );

                    this.sortCustom();
                }
            );
    }

    public remove( i: number ): void {
        this.message = null;
        this.customUnlocks.splice( i, 1 );
        this.sortCustom();
    }

    public add(): void {
        this.message = null;
        this.customUnlocks.push( {
            date: moment().utc().format(),
            amount: 0
        } );
    }

    public dateFromDay( day: number ): string {
        return moment( this.genesisDate ).add( day, 'days' ).utc().format();
    }

    public getDaysSinceGenesis( date: string ): number {
        return moment( date ).diff( this.genesisDate, 'days' );
    }

    public totalLocked(): number {
        return this.locked - (
            this.unlock90 + this.customSum( this.customUnlocks[this.customUnlocks.length-1] )
        );
    }

    public checkUnlock90Field(): void {
        this.message = null;
        if ( this.unlock90 < 0 ) {
            this.unlock90 = 0;
        }
    }

    public checkCustomField( i: number ): void {
        this.message = null;
        if ( this.customUnlocks[i].amount < 0 ) {
            this.customUnlocks[i].amount = 0;
        }
    }

    public customSum( custom: any ): number {
        return this.customUnlocks
            .filter( record => moment( record.date ).isSameOrBefore( custom.date ) )
            .reduce( (a , b ) => {
            return a + b.amount
        }, 0 );
    }

    public sortCustom(): void {
        this.customUnlocks.sort( (a, b ) => {
            if ( moment( a.date ).isBefore( b.date )) {
                return -1;
            } else if ( moment( a.date ).isAfter( b.date )) {
                return 1;
            } else {
                return 0;
            }
        })
    }

    public save(): void {
        this.message = null;
        this.isSaving = true;
        this._apiClientService.post( 'validators-unlock', {
            unlock90: this.unlock90,
            custom: this.customUnlocks
        } )
            .subscribe(
                () => {
                    this.message = {
                        type: 'success',
                        text: 'Unlock schedule was updated. Click "Approve & Calculate" on the "Approval" tab to make the changes public.'
                    };
                    this.isSaving = false;
                },
                ( error ) => {
                    this.message = {
                        type: 'error',
                        text: 'Error updating unlocked validators schedule.'
                    }
                    this.isSaving = false;
                    console.log( error );
                }
            );
    }

}

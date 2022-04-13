import { Component, OnInit } from '@angular/core';
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
    public readonly genesisDate = moment( '2021-03-31T15:00:39.552Z' );

    public unlock90 = 0;
    public unlock365 = 0;

    public customUnlocks = [
        // {
        //     date: '2022-03-13T15:50:12+07:00',
        //     amount: 123,
        // },
        // {
        //     date: '2022-02-13T15:50:12+07:00',
        //     amount: 12334,
        // }
    ];

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
                            date: record.timestamp,
                            amount: Math.round( record.amount / 1000000000 )
                        }
                    } );

                    this.sortCustom();
                }
            );
    }

    public remove( i: number ): void {
        this.customUnlocks.splice( i, 1 );
        this.sortCustom();
    }

    public add(): void {
        this.customUnlocks.push( {
            date: moment().utc( true ).format(),
            amount: 0
        } );
        this.sortCustom();
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
        if ( this.unlock90 < 0 ) {
            this.unlock90 = 0;
        }
    }

    public checkCustomField( i: number ): void {
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
        console.log( this.customUnlocks );


        this.authService.status = true;
        this._apiClientService.post( 'validators-unlock', {
            unlock90: this.unlock90,
            custom: this.customUnlocks
        } )
            .subscribe(
                () => {
                },
                ( error ) => {
                    this.message = {
                        type: 'error',
                        text: 'Error updating unlocked validators schedule.'
                    }
                    console.log( error );
                }
            );
    }

}

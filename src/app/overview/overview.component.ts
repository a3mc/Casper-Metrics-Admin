import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiClientService } from "../services/api-client.service";
import { take } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Component( {
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
} )
export class OverviewComponent implements OnInit, OnDestroy {

    public circulatingSupply = 0;
    public totalSupply = 0;
    public validatorsWeight = 0;
    public totalStakeUnlock = 0;
    private _eraInterval;

    constructor(
        public authService: AuthService,
        private _apiClientService: ApiClientService,
    ) {
    }

    ngOnInit(): void {
        this._getEra();
        this._getStakeUnlockSum();
        this._eraInterval = setInterval( () => {
            this._getEra();
        }, 10000 );

        document.body.style.backgroundColor = '#dbd9ce';
    }

    ngOnDestroy(): void {
        document.body.style.backgroundColor = 'inherit';
        clearInterval( this._eraInterval );
    }

    public calculate(): void {
        this.authService.status = 100;
        this._apiClientService.post( 'transfers/calculate', null )
            .pipe( take( 1 ) )
            .subscribe(
                () => {
                },
                ( error: any ) => {
                    console.error( error );
                }
            );
    }

    private _getStakeUnlockSum(): void {
        this._apiClientService.get( 'validators-unlock' )
            .subscribe(
                ( result: any ) => {


                    this.totalStakeUnlock =  Math.round(
                        result.reduce( ( a: any, b: any ) => {
                            return a + Number( b.amount );
                        }, 0 ) / 1000000000  ) ;
                }
            );
    }

    private _getEra(): void {
        this._apiClientService.get( 'era', null, true )
            .pipe( take( 1 ) )
            .subscribe( ( result: any ) => {
                this.circulatingSupply = result[0].circulatingSupply;
                this.totalSupply = result[0].totalSupply;
                this.validatorsWeight = result[0].validatorsWeights;
            } );
    }

}

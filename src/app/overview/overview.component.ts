import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiClientService } from "../services/api-client.service";
import { take } from "rxjs/operators";

@Component( {
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
} )
export class OverviewComponent implements OnInit, OnDestroy {

    public circulatingSupply = 0;
    public totalSupply = 0;
    public validatorsWeight = 0;
    private _eraInterval;

    constructor(
        private _apiClientService: ApiClientService,
    ) {
    }

    ngOnInit(): void {
        this._getEra();
        this._eraInterval = setInterval( () => {
            this._getEra();
        }, 10000 );

        document.body.style.backgroundColor = '#dbd9ce';
    }

    ngOnDestroy(): void  {
        document.body.style.backgroundColor = 'inherit';
        clearInterval( this._eraInterval );
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

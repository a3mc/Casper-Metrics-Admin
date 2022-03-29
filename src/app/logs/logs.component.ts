import { Component, OnInit } from '@angular/core';
import { ApiClientService } from "../services/api-client.service";
import { take } from "rxjs/operators";
import { saveAs } from 'file-saver';

@Component( {
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss']
} )
export class LogsComponent implements OnInit {

    public page = 1;
    public totalItems = 0;
    public perPage = 15;
    public logs: any[] = [];

    constructor(
        private _apiClientService: ApiClientService,
    ) {
    }

    ngOnInit(): void {
        this.loadLogs();
    }

    public loadLogs(): void {
        this._apiClientService.get( 'admin-logs?page=' + this.page + '&perPage=' + this.perPage )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    this.logs = result.data;
                    this.totalItems = result.total;
                    this.page = result.page;
                    this.perPage = result.perPage;
                }
            )
    }

    public perPageChanged(): void {
        this.page = 1;
        this.pageChanged( this.page );
    }

    public pageChanged( page ): void {
        this.page = page;
        this.loadLogs();
    }

    public showDetails( log: any, i: number ): void {
        this._apiClientService.get( 'admin-logs/' + log.id )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    if ( result.extra ) {
                        result.extra = result.extra.split( ';' );
                        this.logs[i] = result;
                    }
                }
            );
    }

    public copied( event: any ): void {
        // Change the icon color for 3s to show that it was copied.
        event.event.target.className = 'far fa-clipboard text-success';
        setTimeout( () => {
            event.event.target.className = 'far fa-clipboard';
        }, 3000 );
    }

    public downloadFile( data: any ): any {
        const csv = ['Deploy Hash', ...data];
        const csvArray = csv.join( '\r\n' );
        const blob = new Blob( [csvArray], { type: 'text/csv' } )
        saveAs( blob, 'deploy_hashes.csv' );
    }

}

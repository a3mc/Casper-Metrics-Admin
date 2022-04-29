import { Component, OnInit } from '@angular/core';
import { ApiClientService } from "../services/api-client.service";
import { take } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { Message } from "../account/account.component";

@Component( {
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
} )
export class SearchComponent implements OnInit {

    public searchTerm: string = null;
    public tab = 'inbound';
    public page = 1;
    public perPage = 15;
    public totalItems = 0;
    public transfers: any[] = [];
    public allSelected = false;
    public message: Message;
    public searchPerformed = false;
    public totalApproved = 0;
    public allTransferSum = 0;
    public isSaving = false;
    public sortColumn = 'blockHeight';
    public sortOrder = 'DESC';
    public approveType = '1';
    public accountName = '';
    public accountComment = '';

    constructor(
        public authService: AuthService,
        private _apiClientService: ApiClientService,
    ) {
    }

    ngOnInit(): void {
        this.message = null;
        this.approveType = '1';
    }

    public searchChanged(): void {
        if ( !this.searchTerm || this.searchTerm.length < 64 ) {
            return;
        }
        this._reset();

        if ( this.searchTerm.length === 64 ) {
            this.setDeploy();
        } else {
            if ( this.tab === 'deploy' ) {
                this.tab = 'inbound';
            }
            if ( this.tab === 'inbound' ) {
                this.getInbound();
            } else if ( this.tab === 'outbound' ) {
                this.getOutbound();
            }
        }
    }

    public changeSort( column: string ): void {
        if ( this.sortColumn === column ) {
            if ( this.sortOrder === 'DESC' ) {
                this.sortOrder = 'ASC';
            } else {
                this.sortOrder = 'DESC';
            }
        } else {
            this.sortColumn = column;
        }
        this.page = 1;

        if ( this.tab === 'deploy' ) {
            this.getDeploy();
        } else if ( this.tab === 'inbound' ) {
            this.getInbound();
        } else if ( this.tab === 'outbound' ) {
            this.getOutbound();
        }
    }

    public setDeploy(): void {
        this._reset();
        this.tab = 'deploy';
        this.getDeploy();
    }

    public setInbound(): void {
        this._reset();
        this.tab = 'inbound';
        this.getInbound();
    }

    public setOutbound(): void {
        this._reset();
        this.tab = 'outbound';
        this.getOutbound();
    }

    public getInbound(): void {
        this._apiClientService.get(
            'transfers?toHash=' + this.searchTerm + '&perPage=' + this.perPage + '&page=' + this.page +
            '&sort=' + this.sortColumn + ' ' + this.sortOrder
        )
            .pipe( take( 1 ) )
            .subscribe( ( result: any ) => {
                this.searchPerformed = true;
                this.totalItems = result.totalItems.count;
                this.totalApproved = result.approvedSum;
                this.transfers = result.data;
                this.allTransferSum = result.totalSum;
                this._reduceApprovedSum();
                this.checkSelected();
            }, error => {
                console.warn( error );
                this.searchPerformed = true;
                this.transfers = [];
            } );
    }

    public getOutbound(): void {
        this._apiClientService.get(
            'transfers?fromHash=' + this.searchTerm + '&perPage=' + this.perPage + '&page=' + this.page +
            '&sort=' + this.sortColumn + ' ' + this.sortOrder
        )
            .pipe( take( 1 ) )
            .subscribe( ( result: any ) => {
                this.searchPerformed = true;
                this.totalItems = result.totalItems.count;
                this.totalApproved = result.approvedSum;
                this.transfers = result.data;
                this.allTransferSum = result.totalSum;
                this._reduceApprovedSum();
                this.checkSelected();
            }, error => {
                console.warn( error );
                this.searchPerformed = true;
                this.transfers = [];
            } );
    }

    public getDeploy(): void {
        this._apiClientService.get(
            'transfers?deployHash=' + this.searchTerm + '&perPage=' + this.perPage + '&page=' + this.page +
            '&sort=' + this.sortColumn + ' ' + this.sortOrder
        )
            .pipe( take( 1 ) )
            .subscribe( ( result: any ) => {
                this.searchPerformed = true;
                this.totalItems = result.totalItems.count;
                this.totalApproved = result.approvedSum;
                this.transfers = result.data;
                this.allTransferSum = result.totalSum;
                this._reduceApprovedSum();
                this.checkSelected();
            }, error => {
                console.warn( error );
                this.searchPerformed = true;
                this.transfers = [];
            } );
    }

    public selectAll(): void {
        this.message = null;
        if ( !this.transfers.every( transfer => transfer.approved ) ) {
            this.transfers.forEach( transfer => {
                transfer.approved = true;
            } );
            this.allSelected = true;
        } else {
            this.transfers.forEach( transfer => {
                transfer.approved = false;
            } );
            this.allSelected = false;
        }
        this.transfers.forEach( transfer => transfer.touched = true );
    }

    public checkSelected(): void {
        this.allSelected = !!this.transfers.every( transfer => transfer.approved );
    }

    public perPageChanged(): void {
        this.page = 1;
        this.pageChanged( this.page );
    }

    public pageChanged( page ): void {
        this.message = null;
        this.page = page;
        this.allSelected = false;
        if ( this.tab === 'inbound' ) {
            this.getInbound();
        }
        if ( this.tab === 'outbound' ) {
            this.getOutbound();
        }
        if ( this.tab === 'deploy' ) {
            this.getDeploy();
        }
    }

    public copied( event ): void {
        event.event.target.className = 'far fa-clipboard text-success';
        setTimeout( () => {
            event.event.target.className = 'far fa-clipboard';
        }, 3000 );
    }

    public countApproved(): number {
        return this.totalApproved + this.transfers.filter( transfer => transfer.approved )
            .reduce( ( a, b ) => a + b.amount / 1000000000, 0 );
    }

    public touched( i: number ): void {
        this.transfers[i].touched = true;
    }

    public save(): void {
        this.isSaving = true;
        const approved: string = this.transfers.filter( transfer => transfer.approved && transfer.touched ).map(
            transfer => transfer.id
        ).join( ',' );

        const declined: string = this.transfers.filter( transfer => !transfer.approved && transfer.touched ).map(
            transfer => transfer.id
        ).join( ',' );

        this._apiClientService.post( 'transfers/approve?approvedIds=' + approved +
            '&declinedIds=' + declined, {} )
            .pipe( take( 1 ) )
            .subscribe(
                ( result ) => {
                    this.message = {
                        type: 'success',
                        text: 'Saved successfully. Use "Approval" tab to deploy changes.',
                    }
                    setTimeout( () => {
                        this.isSaving = false;
                    }, 2000 );
                },
                ( error ) => {
                    this.message = {
                        type: 'error',
                        text: 'Error updating records.',
                    }
                    this.isSaving = false;
                    console.error( error );
                } );
    }

    public saveName(): void {
        this._apiClientService.post(
            'transfers/name', {
                hash: this.searchTerm.trim(),
                name: this.accountName.trim(),
                comment: this.accountComment.trim()
            }
        )
            .pipe( take( 1 ) )
            .subscribe(
                ( result ) => {
                    console.log( 'saved ');
                },
                ( error ) => {
                    console.error( error );
                } );
    }

    public saveAll(): void {
        if ( this.totalItems > 100 ) {
            this.authService.status = 100;
        }

        if ( this.tab !== 'inbound' && this.tab !== 'outbound' ) {
            console.error( 'Incorrect tab trying to save all' );
            return;
        }

        this.transfers.forEach( transfer => transfer.approved = !!Number( this.approveType ) );
        this.allSelected = !!Number( this.approveType );

        this.isSaving = true;
        const hash = this.tab === 'inbound' ? this.transfers[0].toHash : this.transfers[0].fromHash;

        this._apiClientService.post(
            'transfers/approve?' + this.tab + '=' + hash + '&type=' + this.approveType, {}
        )
            .pipe( take( 1 ) )
            .subscribe(
                ( result ) => {
                    this.message = {
                        type: 'success',
                        text: 'Saved successfully. Use "Approval" tab to deploy changes.',
                    }
                    setTimeout( () => {
                        this.isSaving = false;
                    }, 2000 );
                },
                ( error ) => {
                    this.message = {
                        type: 'error',
                        text: 'Error updating records.',
                    }
                    this.isSaving = false;
                    console.error( error );
                } );
    }

    private _reduceApprovedSum(): void {
        this.transfers.forEach( transfer => {
            transfer.selected = transfer.approved;
            this.totalApproved -= transfer.approved ? transfer.amount / 1000000000 : 0;
            if ( this.totalApproved < 0 ) {
                this.totalApproved = 0;
            }
        } );
    }

    private _reset(): void {
        this.searchPerformed = false;
        this.allSelected = false;
        this.transfers = [];
        this.page = 1;
        this.totalItems = 0;
        this.message = null;
        this.approveType = '1';
        this.accountName = '';
        this.accountComment = '';
    }

}

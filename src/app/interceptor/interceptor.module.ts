import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpHeaderRequestInterceptor } from './interceptor';
import { NgModule } from '@angular/core';

@NgModule( {
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpHeaderRequestInterceptor, multi: true }
    ]
} )

export class InterceptorModule {
}

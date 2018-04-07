import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxSelect2ExModule } from './ngx-select2-ex/ngx-select2-ex.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxSelect2ExModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

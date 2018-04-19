import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSelect2ExComponent } from './components/ngx-select2-ex/ngx-select2-ex.component';
import { NgxSelect2ExDropdownComponent } from './components/ngx-select2-ex-dropdown/ngx-select2-ex-dropdown.component';
import { NgxSelect2ExService } from './services/ngx-select2-ex.service';
import { NgxSelect2ExDropdownInjectionService } from './services/ngx-select2-ex-dropdown-injection.service';
import { NgxSelect2ExDirective } from './directives/ngx-select2-ex.directive';
import { NgxSelect2OptionFilterPipe } from './pipes/ngx-select2-option-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    NgxSelect2ExComponent,
    NgxSelect2ExDropdownComponent,
    NgxSelect2ExDirective,
    NgxSelect2OptionFilterPipe
  ],
  exports: [NgxSelect2ExComponent],
  entryComponents: [NgxSelect2ExDropdownComponent],
  providers: [
    NgxSelect2ExDropdownInjectionService,
    NgxSelect2OptionFilterPipe
  ]
})
export class NgxSelect2ExModule { }

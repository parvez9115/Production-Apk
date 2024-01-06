import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDeliveryDetailsPageRoutingModule } from './add-delivery-details-routing.module';

import { AddDeliveryDetailsPage } from './add-delivery-details.page';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { SafePipe } from '../services/safe.pipe';
import { DealerComponent } from './dealer/dealer.component';
import { DealerFilterPipe } from '../services/dealer-filter.pipe';
import { InvoiceComponent } from './invoice/invoice.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    jqxGridModule,
    ReactiveFormsModule,
    IonicModule,
    AddDeliveryDetailsPageRoutingModule,
  ],
  providers: [SafePipe, BarcodeScanner],
  declarations: [
    AddDeliveryDetailsPage,
    DealerComponent,
    InvoiceComponent,
    DealerFilterPipe,
  ],
})
export class AddDeliveryDetailsPageModule {}

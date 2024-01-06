import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewDevicePage } from './add-new-device.page';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { RouterModule, Routes } from '@angular/router';
import { SafePipe } from '../services/safe.pipe';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

const routes: Routes = [
  {
    path: '',
    component: AddNewDevicePage,
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    jqxGridModule,
    RouterModule.forChild(routes),
  ],
  providers: [SafePipe, BarcodeScanner],
  declarations: [AddNewDevicePage],
})
export class AddNewDevicePageModule {}

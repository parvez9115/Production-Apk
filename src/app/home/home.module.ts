import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { SafePipe } from '../services/safe.pipe';
import { RouterModule, Routes } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DeviceModelComponent } from './device-model/device-model.component';
import { DeviceFilterPipe } from '../services/device-filter.pipe';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
// import { DeviceFilterPipe } from '../services/device-filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    jqxGridModule,
    RouterModule.forChild(routes),
  ],
  providers: [SafePipe, BarcodeScanner],
  declarations: [
    HomePage,
    DeviceModelComponent,
    DeviceFilterPipe,
    // DeviceFilterPipe],
  ],
})
export class HomePageModule {}

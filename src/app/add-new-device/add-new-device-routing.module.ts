import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewDevicePage } from './add-new-device.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewDevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewDevicePageRoutingModule {}

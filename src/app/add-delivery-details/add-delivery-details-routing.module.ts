import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDeliveryDetailsPage } from './add-delivery-details.page';

const routes: Routes = [
  {
    path: '',
    component: AddDeliveryDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDeliveryDetailsPageRoutingModule {}

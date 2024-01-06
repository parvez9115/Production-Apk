import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'main-menu',
    loadChildren: () =>
      import('./main-menu/main-menu.module').then((m) => m.MainMenuPageModule),
  },
  {
    path: 'add-new-device',
    loadChildren: () =>
      import('./add-new-device/add-new-device.module').then(
        (m) => m.AddNewDevicePageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'add-delivery-details',
    loadChildren: () =>
      import('./add-delivery-details/add-delivery-details.module').then(
        (m) => m.AddDeliveryDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

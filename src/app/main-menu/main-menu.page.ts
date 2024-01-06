import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.page.html',
  styleUrls: ['./main-menu.page.scss'],
})
export class MainMenuPage implements OnInit {
  backButtonSubscription: any;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private platform: Platform
  ) {}

  addnewdevice() {
    this.router.navigateByUrl('/add-new-device');
  }
  addproduction() {
    this.router.navigateByUrl('/home');
  }
  adddelivery() {
    this.router.navigateByUrl('/add-delivery-details');
  }

  async confirmlogout() {
    const alert = await this.alertController.create({
      header: 'Log Out',
      backdropDismiss: true,
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (data) => {
            this.modalController.dismiss();
          },
        },
        {
          text: 'Ok',
          handler: (data) => {
            this.logout();
            localStorage.clear();
          },
        },
      ],
    });
    await alert.present();
  }

  logout() {
    this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/main-menu') {
          this.enableBackButtonExit();
        } else {
          this.disableBackButtonExit();
        }
      }
    });
  }

  enableBackButtonExit() {
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(0, () => {
        navigator['app'].exitApp();
      });
  }

  disableBackButtonExit() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }
}

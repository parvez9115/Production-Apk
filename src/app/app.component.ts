import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  loadingRefresh = false;
  constructor(private route: Router, private commonService: CommonService) {
    window.addEventListener('offline', () => {
      //Do task when no internet connection
      this.commonService.networkChecker();
    });
    window.addEventListener('online', () => {
      this.commonService.alertController.dismiss();
    });
  }

  initializeApp() {
    this.loadingRefresh = true;
  }
}

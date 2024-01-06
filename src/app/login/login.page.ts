import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AjaxService } from '../services/ajax.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  mobileNo = '';
  otp = '';
  endisOTP = false;
  backdropDismiss: true;
  generatedOTP: any = '';
  userId: string | null = null;

  constructor(
    public router: Router,
    private toastController: ToastController,
    private ajaxService: AjaxService,
    private commonService: CommonService
  ) {}

  async generateOTP() {
    var val = Math.floor(1000 + Math.random() * 9000);
    this.generatedOTP = val.toString();
    this.commonService.presentToast('Your OPT is ' + this.generatedOTP);
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.commonService.presentLoader();
      this.router.navigateByUrl('/main-menu');
      this.commonService.dismissLoader();
    }
  }

  ionViewWillEnter() {
    // localStorage.clear();
    this.mobileNo = '';
    this.otp = '';
    this.endisOTP = false;
    this.generatedOTP = '';
  }

  login() {
    if (this.generatedOTP == this.otp) {
      localStorage.setItem('userId', this.mobileNo);

      this.router.navigateByUrl('/main-menu');
    } else {
      this.commonService.presentToast('Enter the correct OTP');
    }
  }

  submit() {
    if (this.mobileNo.toString().length == 10) {
      let url = `https://mvt.apmkingstrack.com/fleettracking/login/company/productionlogin?mobileno=${this.mobileNo}`;
      this.ajaxService.ajaxGet(url).subscribe((res) => {
        if (res != '') {
          localStorage.setItem('data', JSON.stringify(res));
          this.generateOTP();
          this.endisOTP = true;
        } else {
          this.endisOTP = false;
          this.commonService.presentToast('Mobile No Not Available');
        }
      });
    } else {
      this.commonService.presentToast('Please enter the 10 digit Mobile no');
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AjaxService } from 'src/app/services/ajax.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-device-model',
  templateUrl: './device-model.component.html',
  styleUrls: ['./device-model.component.scss'],
})
export class DeviceModelComponent implements OnInit {
  devicemodellist = [];
  filterBy: any;
  show = false;
  stin = [];

  constructor(
    private ajaxService: AjaxService,
    private modalController: ModalController,
    private commonService: CommonService
  ) {}

  cancel() {
    this.modalController.dismiss();
  }

  handleScroll(ev) {
    if (ev.detail.scrollTop > 200) {
      this.show = true;
    }
    if (ev.detail.scrollTop < 200) {
      this.show = false;
    }
  }

  getModellist() {
    var url = 'https://mvt.apmkingstrack.com/fleettracking' + '/esim/getModel';
    this.ajaxService.ajaxGetPerference(url).subscribe((res) => {
      this.devicemodellist = res;
    });
  }

  selectStudent(stin, e) {
    if (e.detail.checked == true) {
      this.stin.push(stin);
      this.modalController.dismiss({ data: this.stin });
    } else {
      this.stin = this.stin.filter((d) => d != stin);
      this.modalController.dismiss;
    }
    console.log(this.stin);
  }

  ngOnInit() {
    this.getModellist();
  }
}

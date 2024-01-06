import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AjaxService } from 'src/app/services/ajax.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.scss'],
})
export class DealerComponent implements OnInit {
  dealerlist = [];
  filterBy: any;
  show = false;
  stin = [];

  constructor(
    private ajaxService: AjaxService,
    private modalController: ModalController,
    private commonService: CommonService
  ) {}

  handleScroll(ev) {
    if (ev.detail.scrollTop > 200) {
      this.show = true;
    }
    if (ev.detail.scrollTop < 200) {
      this.show = false;
    }
  }
  cancel() {
    this.modalController.dismiss();
  }

  getModellist() {
    var url = 'https://mvt.apmkingstrack.com/fleettracking' + '/esim/getDealer';
    this.ajaxService.ajaxGetPerference(url).subscribe((res) => {
      this.dealerlist = res;
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
  }

  ngOnInit() {
    this.getModellist();
  }
}

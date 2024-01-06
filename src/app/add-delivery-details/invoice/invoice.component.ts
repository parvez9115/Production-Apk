import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AjaxService } from 'src/app/services/ajax.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  @Input() value: any;
  filterBy: any;
  show = false;
  stin = [];
  invoicelist: any;

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

  getinvoice() {
    const url =
      'https://mvt.apmkingstrack.com/fleettracking' +
      '/esim/getSalesDealerInvoice?companyid=apm' +
      '&dealer=' +
      this.value;
    this.ajaxService.ajaxGetPerference(url).subscribe((res) => {
      this.invoicelist = res;
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
  cancel() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    this.getinvoice();
  }
}

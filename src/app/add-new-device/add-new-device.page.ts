import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { CommonService } from '../services/common.service';
import { AjaxService } from '../services/ajax.service';

@Component({
  selector: 'app-add-new-device',
  templateUrl: './add-new-device.page.html',
  styleUrls: ['./add-new-device.page.scss'],
})
export class AddNewDevicePage implements OnInit {
  @ViewChild('myGrid', { static: false }) myGrid: jqxGridComponent;
  value: any;
  scanData: any;
  columns: any;
  imeidetail: any;
  isshow = false;
  tableData = [];
  Qty: number;
  source: { localdata: any };
  dataAdapter: any;
  renderer: (row: number, column: any, value: string) => string;
  static BarcodeScanner: any[] | Type<any>;
  scansave: any;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private commonService: CommonService,
    private ajaxService: AjaxService
  ) {}

  async qrscan() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        this.value = barcodeData.text;
        this.save();
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  save() {
    this.scanData = this.value.split(',');
    if (this.scanData != '') {
      var data = {
        imei: this.scanData[0],
        iccidno: this.scanData[1],
        vltdsno: this.scanData[2],
      };
      this.commonService.presentLoader();
      const url =
        'https://mvt.apmkingstrack.com/fleettracking' +
        '/esim/saveEsimInventory?createdby=production-sa';
      this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
        this.commonService.dismissLoader();
        if (res.message == 'Inventory Saved Successfully') {
          this.scansave = res;
          this.getdatas();
        } else {
          if (res.message != '') {
            this.commonService.presentToast(res.message);
          }
        }
      });
    }
  }

  getdatas() {
    this.scanData = this.value.split(',');
    var qrValue = {
      imei: this.scanData[0],
      iccidno: this.scanData[1],
      vltdsno: this.scanData[2],
    };
    this.isshow = true;
    this.tableData.push(qrValue);
    this.Qty = this.tableData.length;
    this.renderer = (row: number, column: any, value: string) => {
      if (value == '' || null || undefined || value == ',') {
        return '--';
      } else {
        return (
          '<span  style="line-height:32px;font-size:11px;color:darkblue;margin:auto;">' +
          value +
          '</span>'
        );
      }
    };
    this.source = { localdata: this.tableData };
    this.dataAdapter = new jqx.dataAdapter(this.source);
    this.columns = [
      {
        text: 'Iccid Number',
        datafield: 'iccidno',
        cellsrenderer: this.renderer,
        cellsalign: 'center',
        align: 'center',
        width: '36%',
      },
      {
        text: 'Imei Number',
        datafield: 'imei',
        cellsrenderer: this.renderer,
        cellsalign: 'center',
        align: 'center',
        width: '28%',
      },
      {
        text: 'VLTD No',
        datafield: 'vltdsno',
        cellsrenderer: this.renderer,
        cellsalign: 'center',
        align: 'center',
        width: '36%',
      },
    ];
  }

  ngOnInit() {}
}

import {
  Component,
  OnInit,
  Type,
  ViewChild,
  enableProdMode,
} from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertController,
  MenuController,
  ModalController,
  Platform,
} from '@ionic/angular';

import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { AjaxService } from '../services/ajax.service';
import { CommonService } from '../services/common.service';

import { Router } from '@angular/router';
import { DeviceModelComponent } from './device-model/device-model.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('myGrid', { static: false }) myGrid: jqxGridComponent;
  columns: any;
  source: { localdata: any };
  dataAdapter: any;
  renderer: (row: number, column: any, value: string) => string;
  myPlatform: any;
  scanData: any;
  tableData = [];
  button: boolean;
  productionForm: FormGroup;
  serial: number;
  devicemodellist: any;
  imeidetail: any;
  isshow = false;
  Qty = 0;
  scanActive: boolean = false;
  deletebutton: boolean = false;
  encodedData: '';
  encodeData: any;
  inputData: any;
  searchText = 'select the device';
  barcodeData: any;
  serialdis: boolean = true;

  static QrScannerComponent: any[] | Type<any>;
  value: any;
  selectedRow: any;
  data: any;

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private ajaxService: AjaxService,
    private commonService: CommonService,
    private alertController: AlertController,
    private menu: MenuController,

    private router: Router,
    private barcodeScanner: BarcodeScanner
  ) {}

  cancelBtn() {
    this.modalController.dismiss();
  }

  createForm() {
    this.productionForm = this.formBuilder.group({
      devicemodel: ['', Validators.required],
      SerialNo: [''],
    });
  }

  setvalue() {
    this.productionForm.patchValue({
      devicemodel: this.data,
    });
  }

  reset() {
    this.productionForm.patchValue({
      devicemodel: '',
      SerialNo: this.serial,
    });
    this.isshow = false;
    this.tableData = [];
    this.Qty = 0;
    this.source = { localdata: this.tableData };
    this.dataAdapter = new jqx.dataAdapter(this.source);

    this.selectedRow = '';
  }
  async device() {
    const isModalOpened = await this.modalController.getTop();
    const modal = await this.modalController.create({
      component: DeviceModelComponent,
      cssClass: 'certificateForm',
      componentProps: {
        value: this.devicemodellist,
      },
    });
    modal.onDidDismiss().then((data) => {
      this.data = data.data.data;
      this.setvalue();
    });
    return await modal.present();
  }

  getModellist() {
    var url = 'https://mvt.apmkingstrack.com/fleettracking' + '/esim/getModel';
    this.ajaxService.ajaxGetPerference(url).subscribe((res) => {
      this.devicemodellist = res;
    });
  }

  getserial() {
    const url =
      'https://mvt.apmkingstrack.com/fleettracking' +
      '/esim/generateSerialno?companyid=' +
      localStorage.getItem('corpId');
    this.ajaxService.ajaxGet(url).subscribe((res) => {
      this.serial = res;
    });
  }

  getdata() {
    let show = true;
    this.scanData = this.value.split(',');
    var qrValue = {
      imei: this.scanData[0],
      iccidno: this.scanData[1],
      vltdsno: this.scanData[2],
    };
    if (this.myGrid)
      this.myGrid['attrSource']['originaldata'].map((res) => {
        if (res.iccidno1 == this.scanData[1]) {
          this.commonService.presentToast('Iccidno No Already Assigned');
          show = false;
        } else if (res.vltdsno == this.scanData[2]) {
          this.commonService.presentToast('VLTD No Already Assigned');
          show = false;
        } else if (res.imei == this.scanData[0]) {
          this.commonService.presentToast('Imei No Already Assigned');
          show = false;
        }
      });

    if (show) {
      {
        this.commonService.presentLoader();
        const url =
          'https://mvt.apmkingstrack.com/fleettracking' +
          '/esim/getSingleEsimManufactureByImei?companyid=apm' +
          '&iccidno=' +
          this.scanData[1] +
          '&imei=' +
          this.scanData[0] +
          '&vltdsno=' +
          this.scanData[2] +
          '&imeicheck=Y';

        this.ajaxService.ajaxGetPerference(url).subscribe((res) => {
          this.commonService.dismissLoader();
          this.imeidetail = res;
          if (this.scanData[0] == '') {
          } else if (res.message == 'Invalid ICCID') {
            this.commonService.presentToast(res.message);
          } else if (res.message == 'ICCID Already Exists') {
            this.commonService.presentToast(res.message);
          } else if (res.message == 'Invalid VLTD No') {
            this.commonService.presentToast(res.message);
          } else if (res.message == 'VLTD No Already Exists') {
            this.commonService.presentToast(res.message);
          } else if (res.message == 'Invalid QRCode') {
            this.commonService.presentToast(res.message);
          } else if (res.message == 'IMEI Already Exists') {
            this.commonService.presentToast(res.message);
          } else {
            var detailValue = {
              imei: this.imeidetail.imei,
              iccidno1: this.imeidetail.iccidno1,
              iccidno2: this.imeidetail.iccidno2,
              vltdsno: this.imeidetail.vltdsno,
            };
            this.isshow = true;
            this.tableData.push(detailValue);
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
                datafield: 'iccidno1',
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
        });
      }
    }
  }

  deleteAnalogRow(row?: any) {
    this.tableData.splice(row, 1);
    this.source = { localdata: this.tableData };
    this.Qty = this.tableData.length;
    this.dataAdapter = new jqx.dataAdapter(this.source);
    this.myGrid.clearselection();
    this.selectedRow = '';
  }

  async deleteMode() {
    if (this.selectedRow) {
      const alert = await this.alertController.create({
        header: 'Delete ',
        backdropDismiss: false,
        message: 'Are you sure you want to delete?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: (data) => {
              this.myGrid.clearselection();
              this.selectedRow = '';
            },
          },
          {
            text: 'Ok',
            handler: (data) => {
              this.deleteAnalogRow();
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.commonService.presentToast('Please select a row to delete');
    }
  }
  myGridOnRowSelect(event: any): void {
    this.selectedRow = event.args.row.bounddata;
  }

  async qrscan() {
    if (this.Qty <= 24) {
      this.deletebutton = false;
      this.barcodeScanner
        .scan()
        .then((barcodeData) => {
          this.value = barcodeData.text;
          this.getdata();
        })
        .catch((err) => {
          console.log('Error', err);
        });
      this.myGrid.clearselection();
      this.selectedRow = '';
    } else {
      this.commonService.showConfirm('Device Scanning Quantity Reached..');
    }
  }

  submitBtn() {
    this.button = true;
    var data;
    data = {
      companyid: 'apm',
      branchid: 'apm',
      serialno: this.serial,
      quantity: this.Qty,
      createdby: 'production-sa',
      salesdetail: this.tableData,
      devicemodel: this.productionForm.value.devicemodel.toString(),
    };
    this.commonService.presentLoader();
    const url =
      'https://mvt.apmkingstrack.com/fleettracking' +
      '/esim/saveEsimProduction?companyid=apm' +
      '&branchid=';
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
      this.commonService.dismissLoader();
      if (res.message == 'Production Saved Successfully') {
        this.commonService.presentToast('Box Detail Added Succesfully');
        this.modalController.dismiss({ data: 'Box Detail Added Succesfully' });
        this.reset();
        this.getserial();
        this.button = false;
      } else {
        this.button = false;
        this.commonService.presentToast(res.message);
      }
    });
  }

  ngOnInit() {
    this.myPlatform = this.platform.platforms()[0];
    if (this.myPlatform == 'tablet') {
      this.myPlatform = 'desktop';
    }
    this.getserial();
    this.createForm();
    this.getModellist();
  }
}

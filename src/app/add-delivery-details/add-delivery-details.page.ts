import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSelect, ModalController, Platform } from '@ionic/angular';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { AjaxService } from '../services/ajax.service';
import { CommonService } from '../services/common.service';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DealerComponent } from './dealer/dealer.component';
import { InvoiceComponent } from './invoice/invoice.component';

@Component({
  selector: 'app-add-delivery-details',
  templateUrl: './add-delivery-details.page.html',
  styleUrls: ['./add-delivery-details.page.scss'],
})
export class AddDeliveryDetailsPage implements OnInit {
  @ViewChild('myGrid', { static: false })
  myGrid: jqxGridComponent;
  columns: any;
  button: boolean = false;
  companyName: any;
  source: { localdata: any };
  dataAdapter: any;
  renderer: (row: number, column: any, value: string) => string;
  isshow: boolean = false;
  salesForm: FormGroup;
  tableData = [];
  totquantity = 0;
  maxDate: string;
  today = new Date();
  dealerlist: any;
  invoiceno: any;
  myPlatform: any;
  list = '';
  value: any;
  selectedRow: any = [];
  scanData: any;
  url: any;
  Qty: number;
  data;
  sales = false;
  provider: any;

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private ajaxService: AjaxService,
    private commonService: CommonService,
    private barcodeScanner: BarcodeScanner
  ) {}

  createForm() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.salesForm = this.formBuilder.group({
      distributor: ['', Validators.required],
      salesdate: [today, Validators.required],
      invoiceno: ['', Validators.required],
    });
  }

  cancelBtn() {
    var now = new Date();
    var day = ('0' + now.getDate()).slice(-2);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + month + '-' + day;
    this.salesForm.patchValue({
      SerialNo: '',
      invoiceno: '',
      salesdate: today,
      distributor: '',
      salesqty: '',
    });
    this.totquantity = 0;
    this.tableData = [];

    this.isshow = false;
  }

  ionViewWillEnter() {
    this.cancelBtn();
  }

  calculateTotalQuantity(): void {
    this.totquantity = this.tableData.reduce(
      (total, row) => total + row.quantity,
      0
    );
  }
  async qrscan() {
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
  }

  getdata() {
    let show = true;
    this.scanData = this.value;
    if (this.scanData != '') {
      var qrValue = {
        serialno: this.scanData,
      };
      if (this.myGrid)
        this.myGrid['attrSource']['originaldata'].map((res) => {
          if (res.serialno == this.scanData) {
            this.commonService.presentToast('Box No Already Assigned');
            show = false;
          }
        });

      if (show) {
        this.commonService.presentLoader();
        const url =
          'https://mvt.apmkingstrack.com/fleettracking' +
          '/esim/getEsimSerialNoValidation?companyid=apm' +
          '&serialno=' +
          this.scanData;

        this.ajaxService.ajaxGetPerference(url).subscribe((res) => {
          this.commonService.dismissLoader();

          if (
            res[0].message == 'Invalid Serial No' ||
            res[0].message == 'Serial No Already Exists'
          ) {
            this.commonService.presentToast(res[0].message);
          } else {
            // Remove the incorrect addition of quantity here
            var detailValue = {
              serialno: this.scanData,
              quantity: res[0].quantity, // Use the quantity directly from the response
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
                text: 'Box Number',
                datafield: 'serialno',
                cellsrenderer: this.renderer,
                cellsalign: 'center',
                align: 'center',
                width: '75%',
              },
              {
                text: 'Delete',
                datafield: 'Delete',
                columntype: 'button',
                cellsalign: 'center',
                align: 'center',
                width: '25%',
                cellsrenderer: (): string => {
                  return 'Delete';
                },
                buttonclick: (row): void => {
                  this.deleteAnalogRow(row);
                },
              },
            ];

            // Calculate total quantity after adding a new row
            this.calculateTotalQuantity();
          }
        });
      }
    }
  }
  deleteAnalogRow(row: any): void {
    const rowIndex =
      typeof row === 'number' ? row : this.myGrid.getselectedrowindex();

    console.log('Selected Row Index:', rowIndex);

    if (rowIndex >= 0) {
      const deletedQuantity = this.tableData[rowIndex].quantity;
      this.tableData.splice(rowIndex, 1);

      // Recalculate the total quantity after deleting a row
      this.calculateTotalQuantity();

      // Update the data source for the grid
      this.source = { localdata: [...this.tableData] };
      this.dataAdapter = new jqx.dataAdapter(this.source);

      // Clear selection and reset selectedRow
      this.myGrid.clearselection();
      this.selectedRow = null;

      console.log('Updated Total Quantity:', this.totquantity);
    }
  }

  myGridOnRowSelect(event: any): void {
    this.selectedRow = event.args.row.bounddata;
  }

  handleChange(event) {
    this.provider = event.detail.value;
  }

  submitBtn() {
    let tableDatas = [];
    for (var i = 0; i < this.tableData.length; i++) {
      tableDatas.push({ serialno: this.tableData[i].serialno });
    }
    var data;
    data = {
      companyid: 'apm',
      branchid: 'apm',
      salesdetail: this.tableData,
      invoiceno: this.salesForm.value.invoiceno.toString(),
      provider: this.provider,
      saledistributor: this.salesForm.value.distributor.toString(),
      saledate: this.salesForm.value.salesdate,
      totalquantity: this.totquantity,
      createdby: 'production-sa',
      createddate: null,
      updatedby: 'null',
      updateddate: null,
    };
    this.commonService.presentLoader();
    const url =
      'https://mvt.apmkingstrack.com/fleettracking/esim/saveEsimSales';
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
      this.commonService.dismissLoader();
      if (res.message == 'Sales Saved Successfully') {
        this.commonService.presentToast('Sales Details Added Succesfully');
        this.cancelBtn();

        this.button = false;
      } else {
        this.commonService.presentToast(res.message);
        this.button = false;
      }
    });
  }

  reset() {
    this.salesForm.patchValue({
      invoiceno: '',
    });
  }

  async dealerpoppup() {
    this.reset();
    const isModalOpened = await this.modalController.getTop();
    const modal = await this.modalController.create({
      component: DealerComponent,
      cssClass: 'certificateForm',
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      this.data = data.data.data;
      this.dealervalue();
    });
    return await modal.present();
  }

  dealervalue() {
    this.salesForm.patchValue({
      distributor: this.data,
    });
  }

  async invoicepopup() {
    const isModalOpened = await this.modalController.getTop();
    const modal = await this.modalController.create({
      component: InvoiceComponent,
      cssClass: 'certificateForm',
      componentProps: {
        value: this.salesForm.value.distributor,
      },
    });
    modal.onDidDismiss().then((data) => {
      this.data = data.data.data;
      this.invoicevalue();
    });
    return await modal.present();
  }

  invoicevalue() {
    this.salesForm.patchValue({
      invoiceno: this.data,
    });
  }

  ngOnInit() {
    this.myPlatform = this.platform.platforms()[0];
    if (this.myPlatform == 'tablet') {
      this.myPlatform = 'desktop';
    }
    this.maxDate = this.today.getFullYear() + '-';
    this.maxDate +=
      (this.today.getMonth() + 1 < 10
        ? '0' + (this.today.getMonth() + 1).toString()
        : (this.today.getMonth() + 1).toString()) + '-';
    this.maxDate +=
      this.today.getDate() < 10
        ? '0' + this.today.getDate().toString()
        : this.today.getDate().toString();
    this.createForm();
  }
}

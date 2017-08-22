// Main Components
import {Component} from '@angular/core';
import {IonicPage, NavController, ModalController, ToastController, ViewController, NavParams, Events, ActionSheetController} from 'ionic-angular';

// Providers
import {Users} from "../../providers/users";
import {API} from "../../providers/api";

// Req Pages


@IonicPage()
@Component({
    selector: 'page-edit-path',
    templateUrl: 'edit-path.html',
})
export class EditPath {
    routeInfo: any;
    showLoader: boolean = true;
    districts: any;
    universities: any;
    vehicles: any;
    contracts: any;
    goAndComes: any;
    temp: any;
    error: any;
    Token: any;
    myInfo: any;
    submitload: any;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public events: Events,
        public actionSheetCtrl: ActionSheetController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public api: API,
        public users: Users
    ) {

        Promise.all([
            this.users.getToken().then((val) => {
                this.Token = val;
            })
        ]).then(() => {
            console.log('current token=' + this.Token);
        });

        console.log(navParams.get('nId'));
        this.getRouteInfoByUserId(navParams.get('nId'));



        //get cities
        this.users.getTaxList('5').then((data) => {

            this.districts = data;
            console.log('data', data);
        });
        // get Univirsities
        this.users.getTaxList('9').then((data) => {

            this.universities = data;
            console.log('data', data);
        });
        // get vehicles
        this.users.getTaxList('2').then((data) => {

            this.vehicles = data;
            console.log('data', data);
        });
        // get contracts
        this.users.getTaxList('4').then((data) => {

            this.contracts = data;
            console.log('data', data);
        });
        // get go_and_come
        this.users.getTaxList('8').then((data) => {

            this.goAndComes = data;
            console.log('data', data);
        });


    }

    ionViewDidEnter() {
        // Run After Page Already Entered

    }

    ionViewDidLoad() {


    }
    dismiss() {
        this.viewCtrl.dismiss();
    }

    getRouteInfoByUserId(nId) {
        console.log('nId', nId);

        this.users.getRouteInfo(nId).then((data) => {
            this.showLoader = false;
            this.routeInfo = data[0];
            this.temp = {
                nid: nId,
                title: this.routeInfo.title,
                "field_route_from": this.routeInfo.field_route_from.und.tid
                ,
                "field_route_university_to": this.routeInfo.field_route_university_to.und.tid
                ,
                "field_vehicle_type": this.routeInfo.field_vehicle_type.und.tid
                ,
                "field_contract_period": this.routeInfo.field_contract_period.und.tid
                ,
                "field_go_and_come": this.routeInfo.field_go_and_come.und.tid
                ,
                "field_price": this.routeInfo.price
                ,


            };
            console.log('data', data);
            console.log('temp', this.temp);
        });
    }
    updatePath() {
        console.log('title', this.temp);

        if (!this.temp.title) {

            this.showToast('يرجى ادخال عنوان المسار ');
        }
        else if (!this.temp.field_route_from) {

            this.showToast('يرجى تحديد المدينة ');
        }
        else if (!this.temp.field_route_university_to) {

            this.showToast('يرجى تحديد الجامعة ');
        } else if (!this.temp.field_vehicle_type) {

            this.showToast('يرجى تحديد نوع المركبة ');
        } else if (!this.temp.field_contract_period) {

            this.showToast('يرجى تحديد مدة العقد ');
        } else if (!this.temp.field_go_and_come) {

            this.showToast('يرجى تحديد نوع الطلب ');
        } else if (!this.temp.field_price) {

            this.showToast('يرجى إدخال السعر ');
        }
        else {
            this.submitload = true;
            this.users.updatePath(this.temp, this.Token)
                .map(res => res.json()).subscribe(data => {
                    console.log('data', data);
                    this.submitload = false;
                    this.showToast('تم تعديل المسار بنجاح ');
                    this.viewCtrl.dismiss(data);
                });
        }
    }
    showToast(msg, dur = 2000) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: dur,
            position: 'top',
            showCloseButton: true,
            closeButtonText: 'x'
        });



        toast.present();
    }

    editimageActionSheet() {
        let imageactionSheet = this.actionSheetCtrl.create({
            title: 'قم بإختيار صورة',
            buttons: [
                {
                    icon: 'folder',
                    text: 'تحميل من ملف',
                    handler: () => {
                        console.log('Destructive clicked');
                    }
                }, {
                    icon: 'camera',
                    text: 'التقاط صورة',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                }, {
                    text: 'إلغاء',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        imageactionSheet.present();
    }




}
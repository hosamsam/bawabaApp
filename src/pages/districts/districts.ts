// Main Components
import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController,} from 'ionic-angular';

// Providers
import {Users} from "../../providers/users";
import {API} from "../../providers/api";
// Req Pages
import {University} from "../university/university";
import {AppUtils} from "../../app/appconf/app.utils";


//@IonicPage()
@Component({
  selector: 'page-districts',
  templateUrl: 'districts.html',
})
export class Districts {

  isOnline:boolean = true;
  showLoader: boolean = true;
  districts: any[];
  DistId: number;
  cityId: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public api: API,
              public users: Users,
              public toastCtrl: ToastController,
              public events: Events,
              public appUtils: AppUtils
              ) {

    this.cityId = this.navParams.get('cityId');


    // get Districts
    /*this.users.getTaxList('5').then((data) => {
        this.showLoader = false;
        this.districts = data;
        console.log('data', data);
    });*/
  }


  getDistricts() {
    this.users.getDistrictsByCity(this.cityId)
      .subscribe(
        districts => {

          console.log('Districts in city', districts);

          this.districts = districts;


        }, err => {
          console.warn(err.json());
          this.showLoader = false
        }, () => {
          this.showLoader = false
        });
  }


  gouniversity(distId, distName) {

    let temp = {
      cityId: this.navParams.get('cityId'),
      cityName: this.navParams.get('cityName'),
      distId: distId,
      distName: distName

    };
    console.log('temp', temp);
    this.navCtrl.push(University, temp);
  }

  ionViewWillEnter() {
    // Run After Page Already Entered

    this.events.subscribe('UniversityDistId', (DistId) => {
      this.DistId = DistId
    })
  }

  ionViewDidLoad() {

    if (this.appUtils.IsConnected) {

      this.appUtils.OnConnection(
        ()=> {
          this.getDistricts()
        },()=> {
          this.isOnline = false;
          this.appUtils.watchOnConnect(()=> { // watch when the user will be connected
            this.isOnline = true;
          })
        }
      )

    } else {
      this.isOnline = false;
    }
  }

  ionViewWillLeave() {
    console.warn('you are about to leave this page');
    this.events.publish('passengerHomeCityId', this.navParams.get('cityId')); // Send City Id To Passenfer Home
  }

}

import {PushObject, Push, PushOptions} from '@ionic-native/push';
// Main Components
import {Component} from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, NavParams, AlertOptions, ToastController, ModalController, AlertController, Events, Platform } from 'ionic-angular';

// Providers
import {Users} from "../../providers/users";
import {API} from "../../providers/api";
import {DragulaService} from 'ng2-dragula/ng2-dragula';
import {Storage} from '@ionic/storage';

// Req Pages
import {SearchOption} from '../search-option/search-option';
import {AddPath} from '../add-path/add-path';
import {EditPath} from '../edit-path/edit-path';
import {Network} from "@ionic-native/network";
import {AppUtils} from "../../app/appconf/app.utils";



//@IonicPage()
@Component({
    selector: 'page-transporter-home',
    templateUrl: 'transporter-home.html',
})
export class TransporterHome {
    loading: Loading;
    name: any;
    uid: any;
    routes: any;
    myInfo: any;
    Token: any;
    alertOptions: AlertOptions;
    showLoader: boolean = true;
    pushObject: PushObject;
    isOnline: boolean = true;
    noPaths: boolean = false;
    noMatchedPaths: boolean = false;
    routesAlt: any[];
    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public modalctrl: ModalController,
      public events: Events,
      public alert: AlertController,
      public toastCtrl: ToastController,
      public alertCtrl: AlertController,
      public storage: Storage,
      public loadingCtrl: LoadingController,
      public api: API,
      public users: Users,
      public push: Push,
      public platform: Platform,
      public network: Network,
      public appUtils: AppUtils

    ) {



    }



    ionViewDidEnter() {
        // Run After Page Already Entered

    }


  ionViewDidLoad() {

    console.log('Are you connected or not', this.appUtils.IsConnected);

    if (this.appUtils.IsConnected) {

      this.appUtils.OnConnection(  // user is connected to the internet
        () => {
          this.initPageOnConnection()
        },
        () => { // after a while he disconnected to the internet
          this.Online = false;
          this.appUtils.watchOnConnect(() => { // watch when the user will be connected
            this.isOnline = true;
            this.initPageOnConnection();
          })
        }
      );

    } else { // detect if the user is not connected to WIFI
      this.Online = false;

      this.appUtils.watchOnConnect(() => { // watch when the user will be connected
        this.isOnline = true;
        this.initPageOnConnection();
      })
    }

  }

  initPageOnConnection() {
    this.users
      .getUserInfo()
      .then((data) => {

        this.myInfo = data;

        this.getRoutesByUserId(data.uid);

      });


  }

    getRoutesByUserId(uId) {

        if (this.network.type == 'none') {
          this.showLoader = false;
          this.isOnline = false;
        } else {
          this.users
            .getUserRoutes(uId)
            .then((data:any[]) => {
              this.showLoader = false;
              this.routes = data;
              if (data.length <= 0)
                this.noPaths = true;
              console.log('All Paths data', data);
            });
        }

    }

    ionViewWillLeave() {
      if (this.routesAlt) {

        this.routes = this.routesAlt;
        this.noMatchedPaths = false;
        this.routesAlt = null
      }
  }
  private set Online(isOnlineStatus: boolean) {
    this.isOnline = isOnlineStatus
  }

  private registerUserDeviceToken(): void {

    let platformType = this.platform.is('ios') ? 'ios' : (this.platform.is('windows') ? 'windows' : 'android');


    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      let deviceData = {
        token: registration.token,
        type: platformType
      };

      this.users
        .registerDeviceToken(deviceData)
        .subscribe(res => {
          console.log('device data has saved to db', res);
        }, err => {
          console.warn(err.json());
        });

    });

    this.pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }

  searchoption() {
      
    if (this.routesAlt) {

      this.routes = this.routesAlt ;
      this.noMatchedPaths = false;  
      this.routesAlt = null
    }
        let searchoptionModal = this.modalctrl.create(SearchOption);
        searchoptionModal.present();
        searchoptionModal.onDidDismiss(data => {
            // filter and search paths based onn the search modal
          this.routesAlt = this.routes;
            console.log('What i will filter with', data);

            if (data) {

              this.routes = this.routes.filter(route => {
                
                if (data.city && data.university) {
                  return route.city == data.city && route.university == data.university
                } else if (data.city  && data.district) {
                  return route.city == data.city && route.routeFrom == data.district
                }else if (data.city && data.university && data.district){ 
                  return route.city == data.city && route.university == data.university && route.routeFrom == data.district
                } else if (data.city)
                  return route.city == data.city
                }
              );

              if (this.routes.length <= 0)
                this.noMatchedPaths = true;

                console.log('filtered by city', this.routes, '\n founded matched paths or not', !!this.routes);
            }
        })
  }
  
    addpathmodal() {
      if (this.routesAlt) {

        this.routes = this.routesAlt;
        this.noMatchedPaths = false;
        this.routesAlt = null
      }
        let addpathModal = this.modalctrl.create(AddPath);
        addpathModal.present();
        addpathModal.onDidDismiss(data => {
            console.log(' data', data);
            if (data) {
                this.routes.unshift(data);
            }


            console.log('  this.routes', this.routes);
        })

    }
    editpathmodal(nId) {
      if (this.routesAlt) {

        this.routes = this.routesAlt;
        this.noMatchedPaths = false;
        this.routesAlt =null
      }
  
      let editpathModal = this.modalctrl.create(EditPath, {nId: nId});
        editpathModal.present();
        editpathModal.onDidDismiss(data => {
            // Saving this info to local storage after updating user profile info
            console.log(' data', data);
            if (data) {
              let foundedIndex = this.routes.findIndex((obj) => {
                return obj.Nid == data.Nid
              });

                console.log('Index of repeated route', foundedIndex);

                this.routes[foundedIndex] = data;
            }
        })

    }
    deletepathmodal(route) {
      if (this.routesAlt) {

        this.routes = this.routesAlt;
        this.noMatchedPaths = false;
        this.routesAlt = null
      }

      let routeIndex = this.routes.indexOf(route);
      console.log('route', route,'routeIndex', routeIndex);
       
      let alert = this.alertCtrl.create({
            title: 'حذف مسار ',
            message: 'هل انت متأكد من رغبتك فى حذف المسار ؟',
            buttons: [
                {
                    text: 'الغاء',
                    handler: (data) => {

                    }
                },
                {
                    text: 'حذف',
                    handler: () => {

                        this.loading = this.loadingCtrl.create({
                            content: 'جارى حذف المسار ...',
                        });
                        this.loading.present();
                        this.users.deletePath(route.Nid, this.Token)
                            .map(res => res.json()).subscribe(data => {
                                //                    this.submitload = false;
                                console.log('delete path response', data);
                                this.routes.splice(routeIndex, 1);
                                this.loading.dismissAll();
                                this.showToast('تم حذف المسار بنجاح ');
                                
                                this.decreaseRoutesNum();
                                
                                this.users
                                  .userToken()
                                  .map(res => res.json())
                                  .subscribe(TokenData => {
                                    this.users.saveToken(TokenData.token);
                                    this.Token = TokenData.token
                                  });
                                
                            }, (err) => {
                          let error = err.json();

                          if (error[0] == 'CSRF validation failed') {
                            this.users.userToken()
                              .map(res => res.json())
                              .subscribe(data => {
                                this.users.saveToken(data.token);
                                this.users.deletePath(route.Nid, data.token)
                                  .map(res => res.json()).subscribe(data => {
                                  //                    this.submitload = false;
                                  console.log('data', data);
                                  this.routes.splice(routeIndex, 1);
                                  this.loading.dismissAll();
                                  this.showToast('تم حذف المسار بنجاح ');
                                  this.decreaseRoutesNum();
                                }, (err) => {
                                  let error = err.json();

                                  if (error[0] == 'CSRF validation failed') {
                                    this.users.userToken()
                                      .map(res => res.json())
                                      .subscribe(data => {
                                        this.users.saveToken(data.Token);
                                        this.users.deletePath(route.Nid, data.token)
                                      })
                                  }
                                })
                              })
                          }
                        })
                    }
                }
            ]
        });

      alert.present();


    }
    decreaseRoutesNum() {
      this.storage.get('userInfo')
        .then(data => {
          data.numberOfRoutes--;
          this.storage.set('userInfo', data);
        })
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

}

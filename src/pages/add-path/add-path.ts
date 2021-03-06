// Main Components
import {Component, DoCheck} from '@angular/core';
import {
  IonicPage,
  NavController,
  ModalController,
  LoadingController,
  Loading,
  Platform,
  ViewController,
  NavParams,
  Events,
  ToastController,
  ActionSheetController
} from 'ionic-angular';
import {Storage} from '@ionic/storage';


// Providers
import {Users} from "../../providers/users";
import {API} from "../../providers/api";


import {File} from '@ionic-native/file';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {FilePath} from '@ionic-native/file-path';
import {Camera} from '@ionic-native/camera';
// Req Pages

declare var cordova: any;

//@IonicPage()
@Component({
  selector: 'page-add-path',
  templateUrl: 'add-path.html',
})
export class AddPath {
  lastImage: string = null;
  loading: Loading;
  cities: any[] | any;
  districts: any[] | any;
  universities: any[] | any;
  vehicles: any[] | any;
  contracts: any[] | any;
  goAndComes: any[] | any;
  temp: any;
  error: any;
  Token: any;
  myInfo: any;
  cityModel: any;
  submitload: any;
  showDistrictsLoader: boolean = false;
  showUniversityLoader: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public events: Events,
              public storage: Storage,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              private camera: Camera,
              private transfer: Transfer,
              public platform: Platform,
              private file: File,
              private filePath: FilePath,
              public loadingCtrl: LoadingController,
              public api: API,
              public users: Users) {


//         this.submitload = true;
    this.temp = {
      type: "routes",
      language: "ar",

      title: '',
      "field_city": {
        "und": [
          {
            "tid": ""
          }
        ]
      },
      "field_route_from": {
        "und": [
          {
            "tid": ""
          }
        ]
      },
      "field_route_university_to": {
        "und": [
          {
            "tid": ""
          }
        ]
      },
      "field_vehicle_type": {
        "und": [
          {
            "tid": ''
          }
        ]
      },
      "field_contract_period": {
        "und": [
          {
            "tid": ""
          }
        ]
      },
      "field_go_and_come": {
        "und": [
          {
            "tid": ""
          }
        ]
      },
      "field_price": {
        "und": [
          {
            "value": ""
          }
        ]
      },


    };

    Promise.all([
      this.users.getTaxList('7'),

      this.users.getTaxList('2'),
      this.users.getTaxList('4'),
      this.users.getTaxList('8'),

    ]).then(data => {
      console.log(data);
      [this.cities, this.vehicles, this.contracts, this.goAndComes] = data;
    })

  }

  ionViewDidLoad() {

    this.users.getToken().then((val) => {
      this.Token = val;
      console.log('Current User Token', this.Token)
    });

    this.users.getUserInfo().then((data) => {
      console.log('myInfo', data);
      this.myInfo = data;
      console.log('data.uid', data.uid);


    });


  }

  changeCity(event) {
    console.log('event', event)
  }

  private fillFields(cityId) {


    this.users.getDistrictsByCity(cityId)

      .subscribe(data => {
        console.log(data);
        this.districts = data;
      });

    this.users.getUniversitiesByCity(cityId)

      .subscribe(data => {
        console.log(data);
        this.universities = data;
      })

  }


  changedValue(cityId) {
    console.log('change value', cityId);

    if (this.temp.field_city.und[0].tid == cityId) {
      console.log('you have not changed the city value');
    } else {
      this.temp.field_city.und[0]['tid'] = cityId;
      this.districts = null;
      this.universities = null;
      this.showDistrictsLoader = true;
      this.showUniversityLoader = true;
      this.users.getDistrictsByCity(cityId)

        .subscribe(data => {

          this.showDistrictsLoader = false;
          console.log(data);
          this.districts = data;
        });

      this.users.getUniversitiesByCity(cityId)

        .subscribe(data => {
          console.log(data);

          this.showUniversityLoader = false;
          this.universities = data;
        })
    }

  }

  addPath() {
    console.log('title', this.temp);
    this.storage.get('userInfo').then((data) => {
    });
      //data.map((response: Response) => response.json());
    if (!this.temp.title) {

      this.showToast('يرجى ادخال عنوان المسار ');
    }
    else if (!this.temp.field_route_from.und[0]['tid']) {

      this.showToast('يرجى تحديد المدينة ');
    }
    else if (!this.temp.field_route_university_to.und[0]['tid']) {

      this.showToast('يرجى تحديد الجامعة ');
    } else if (!this.temp.field_vehicle_type.und[0]['tid']) {

      this.showToast('يرجى تحديد نوع المركبة ');
    } else if (!this.temp.field_contract_period.und[0]['tid']) {

      this.showToast('يرجى تحديد مدة العقد ');
    } else if (!this.temp.field_go_and_come.und[0]['tid']) {

      this.showToast('يرجى تحديد نوع الطلب ');
    } else if (!this.temp.field_price.und[0]['value']) {

      this.showToast('يرجى إدخال السعر ');
    } else {
      this.submitload = true;
      this.temp.uid = this.myInfo.uid;
      console.log('this.temp.uid', this.temp.uid);
      this.AddPathService(this.temp, this.Token);
    }



  }

  AddPathService(temp, token) {
    this.users.addPath(temp, token)
      .map(res => res.json())
      .subscribe(data => {
        this.submitload = false;
        console.log('data', data);
        this.showToast('تم اضافة المسار بنجاح ');
        this.viewCtrl.dismiss(data);


        this.storage.get('userInfo')
          .then(data => {
            data.numberOfRoutes++;
            this.storage.set('userInfo', data);
          })

      }, err => {
        this.submitload = false;
        this.users
          .userToken()
          .map(res => res.json())
          .subscribe(TokenData => {
            this.users.saveToken(TokenData.token);
            this.Token = TokenData.token;
            this.AddPathService(this.temp, this.Token);
          });

      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
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


  takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        console.log('currentName', currentName);
        console.log('correctPath', currentName);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.showToast('Error while selecting image.');
    });
  }


  // Create a new name for the image
  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      console.log('this.lastImage', this.lastImage);
      this.uploadImage();
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }


  uploadImage() {
    console.log('upload image ');
    // Destination URL
    var url = "http://www.bawabt-alnagel.com/AlBawabh/api/upload.php";
    console.log('url', url);
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {'fileName': filename}
    };
    console.log('targetPath', targetPath);
    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

  imageActionSheet() {
    let imageactionSheet = this.actionSheetCtrl.create({
      title: 'قم بإختيار صورة',
      buttons: [
        {
          icon: 'folder',
          text: 'تحميل من ملف',
          handler: () => {
            console.log('Destructive clicked');
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);

          }
        }, {
          icon: 'camera',
          text: 'التقاط صورة',
          handler: () => {
            console.log('Archive clicked');
            this.takePicture(this.camera.PictureSourceType.CAMERA);

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

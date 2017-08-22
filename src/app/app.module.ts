import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule , TranslateStaticLoader, TranslateLoader} from 'ng2-translate/ng2-translate';
import { IonicStorageModule } from '@ionic/storage';
import { DragulaModule } from 'ng2-dragula';

import { MyApp } from './app.component';


import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';


import { Tabs } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { Intro } from '../pages/intro/intro';
import { Login } from '../pages/login/login';
import { ForgetPass } from '../pages/forget-pass/forget-pass';
import { Signup } from '../pages/signup/signup';
import { TransporterHome } from '../pages/transporter-home/transporter-home';
import { PassengerHome } from '../pages/passenger-home/passenger-home';
import { Routes } from '../pages/routes/routes';
import { RoutesNewPage } from '../pages/routes-new/routes-new';
import { RoutesEditPage } from '../pages/routes-edit/routes-edit';
import { RoutesViewPage } from '../pages/routes-view/routes-view';
import { Settings } from '../pages/settings/settings';
import { Contactus } from '../pages/contactus/contactus';
import { ProfilePage } from '../pages/profile/profile';
import { Districts } from '../pages/districts/districts';
import { University } from '../pages/university/university';
import { Transportation } from '../pages/transportation/transportation';
import { SearchResults } from '../pages/search-results/search-results';
import { Reservation } from '../pages/reservation/reservation';
import { Tickets } from '../pages/tickets/tickets';
import { SendLocation } from '../pages/sendlocation/sendlocation';
import { Notifications } from '../pages/notifications/notifications';
import { Complaints } from '../pages/complaints/complaints';
import { EditProfile } from '../pages/edit-profile/edit-profile';
import { GetLocation } from '../pages/get-location/get-location';
import { ComplaintsReply } from '../pages/complaints-reply/complaints-reply';
import { CompanyPath } from '../pages/company-path/company-path';
import { SearchOption } from '../pages/search-option/search-option';
import { AddPath } from '../pages/add-path/add-path';
import { EditPath } from '../pages/edit-path/edit-path';
import { NotificationsDetail } from '../pages/notifications-detail/notifications-detail';
import { HsaloaderComponentModule } from '../components/hsa-loader/hsa-loader.module';


import { API } from '../providers/api';
import { SMS } from '../providers/sms';
import { Users } from '../providers/users';
import { Components } from '../providers/components';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ShrinkingSegmentHeaderComponent } from '../components/shrinking-segment-header/shrinking-segment-header';

export function createTranslateLoader(http: Http) {
	return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    Tabs,
    HomePage,
    ListPage,
    Intro,
    Login,
    ForgetPass,
    Signup,
    TransporterHome,
    PassengerHome,
    Routes,
    RoutesNewPage,
    RoutesEditPage,
    RoutesViewPage,
    Settings,
    Districts,
    Contactus,
    ShrinkingSegmentHeaderComponent,
    ProfilePage,
    University,
    Transportation,
    SearchResults,
    Reservation,
    Tickets,
    SendLocation,
    Notifications,
    Complaints,
    EditProfile,
    GetLocation,
    ComplaintsReply,
    CompanyPath,
    SearchOption,
    AddPath,
    EditPath,
    NotificationsDetail,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    HsaloaderComponentModule,
    ReactiveFormsModule,

    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    DragulaModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Tabs, 
    HomePage,
    ListPage,
    Intro,
    Login,
    ForgetPass,
    Signup,
    TransporterHome,
    PassengerHome,
    Routes,
    RoutesNewPage,
    RoutesEditPage,
    RoutesViewPage,
    Districts,
    Settings,
    Contactus,
    ProfilePage,
    University,
    Transportation,
    SearchResults,
    Reservation,
    Tickets,
    SendLocation,
    Notifications,
    Complaints,
    EditProfile,
    GetLocation,
    ComplaintsReply,
    CompanyPath,
    SearchOption,
    AddPath,
    EditPath,
    NotificationsDetail
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    Transfer,
    Camera,
    FilePath,
    API,SMS,Users,Components,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
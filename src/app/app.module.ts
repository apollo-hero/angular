import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';

import { MomentModule } from 'angular2-moment';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPrintModule } from 'ngx-print';
import { NgxTinymceModule } from 'ngx-tinymce';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QrCodeModule } from 'ng-qrcode';
import { NgQrScannerModule } from 'ngx-qr';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgxPayPalModule } from 'ngx-paypal';
import { SafePipe } from './pipe/safe.pipe';
import { KeysPipe } from './pipe/keys.pipe';
import { CountdownPipe } from './pipe/countdown.pipe';

import { NotifyService } from './addon/notify.service';
import { PasteService } from './addon/paste.service';
import { FirebaseService } from './addon/firebase.service';

import { AppServices } from './app.services';
import { RelationService } from './relation.service';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './share/not-found/not-found.component';
import { FcmComponent } from './share/fcm/fcm.component';
import { BreadcrumbComponent } from './share/breadcrumb/breadcrumb.component';
import { TableHistoryComponent } from './share/table-history/table-history.component';
import { TableEditComponent } from './share/table-edit/table-edit.component';
import { ImgComponent } from './share/img/img.component';
import { InputGroupComponent } from './share/input-group/input-group.component';
import { DriveZoneComponent } from './share/drive-zone/drive-zone.component';
import { SwitchComponent } from './share/switch/switch.component';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

import { HomeComponent } from './main/home/home.component';
import { ProfileComponent } from './main/profile/profile.component';
import { LoginComponent } from './main/login/login.component';
import { RegisterComponent } from './main/register/register.component';
import { AboutComponent } from './main/about/about.component';
import { ContactComponent } from './main/contact/contact.component';
import { MyMenuComponent } from './layout/my-menu/my-menu.component';
import { MyContactComponent } from './main/my-contact/my-contact.component';
import { RerouteComponent } from './main/reroute/reroute.component';
import { MapComponent } from './share/map/map.component';
import { CalendarComponent } from './share/calendar/calendar.component';
import { SetupOrderComponent } from './manage/setup-order/setup-order.component';
import { AutocompleteComponent } from './share/autocomplete/autocomplete.component';
import { QuotesComponent } from './main/quotes/quotes.component';
import { MyHistoryComponent } from './main/my-history/my-history.component';
import { RadioComponent } from './share/radio/radio.component';
import { CompleteComponent } from './main/complete/complete.component';
import { SetupCourierComponent } from './manage/setup-courier/setup-courier.component';
import { SetupCustomerComponent } from './manage/setup-customer/setup-customer.component';
import { SetupLocationComponent } from './manage/setup-location/setup-location.component';
import { SetupAddressComponent } from './manage/setup-address/setup-address.component';
import { SetupDashboardComponent } from './manage/setup-dashboard/setup-dashboard.component';
import { TrackingComponent } from './main/tracking/tracking.component';
import { ButtonComponent } from './share/button/button.component';
import { InstallComponent } from './share/install/install.component';
import { ClipboardComponent } from './share/clipboard/clipboard.component';
import { DiagramComponent } from './share/diagram/diagram.component';
import { NavTabComponent } from './share/nav-tab/nav-tab.component';
import { ScanCodeComponent } from './share/scan-code/scan-code.component';
import { MomoComponent } from './share/momo/momo.component';
import { BarcodeComponent } from './share/barcode/barcode.component';
import { SocialChatComponent } from './share/social-chat/social-chat.component';
import { CalculatorComponent } from './share/calculator/calculator.component';
import { AudioPlayerComponent } from './share/audio-player/audio-player.component';
import { PaypalComponent } from './share/paypal/paypal.component';

const routes: any = [
{ path: '', component: HomeComponent },
{ path: 'FCM_PLUGIN_ACTIVITY', component: FcmComponent },
{ path: 'rr/:mod/:nav/:param', component: RerouteComponent },
{ path: 'main/home', component: HomeComponent, name: 'Home' },
{ path: 'main/complete/:id', component: CompleteComponent, name: 'Complete' },
{ path: 'main/about', component: AboutComponent, name: 'About' },
{ path: 'main/contact', component: ContactComponent, name: 'Contact' },
{ path: 'main/tracking', component: TrackingComponent, name: 'Tracking' },
{ path: 'main/login', component: LoginComponent, name: 'Login' },
{ path: 'main/register', component: RegisterComponent, name: 'Register' },
{ path: 'main/profile/:id', component: ProfileComponent, name: 'Profile' },
{ path: 'main/my-contact', component: MyContactComponent, name: 'My Contact' },
{ path: 'main/quotes/:id', component: QuotesComponent, name: 'Quotes' },
{ path: 'main/my-history', component: MyHistoryComponent, name: 'My History' },
{ path: 'manage/setup-address', component: SetupAddressComponent, name: 'Setup Address' },
{ path: 'manage/setup-courier', component: SetupCourierComponent, name: 'Setup Courier' },
{ path: 'manage/setup-customer', component: SetupCustomerComponent, name: 'Setup Customer' },
{ path: 'manage/setup-location', component: SetupLocationComponent, name: 'Setup Location' },
{ path: 'manage/setup-order', component: SetupOrderComponent, name: 'Setup Order' },
{ path: 'manage/setup-dashboard', component: SetupDashboardComponent, name: 'Setup Dashboard' },
{ path: '**', component: NotFoundComponent }
];

enableProdMode()

@NgModule({
    declarations: [
    AppComponent,
    NotFoundComponent,
    SafePipe,
    KeysPipe,
    HeaderComponent,
    FcmComponent,
    FooterComponent,
    HomeComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    BreadcrumbComponent,
    TableHistoryComponent,
    TableEditComponent,
    ImgComponent,
    AboutComponent,
    ContactComponent,
    MyMenuComponent,
    MyContactComponent,
    RerouteComponent,
    InputGroupComponent,
    DriveZoneComponent,
    SwitchComponent,
    MapComponent,
    CalendarComponent,
    SetupOrderComponent,
    AutocompleteComponent,
    QuotesComponent,
    MyHistoryComponent,
    RadioComponent,
    CompleteComponent,
    SetupCourierComponent,
    SetupCustomerComponent,
    SetupLocationComponent,
    SetupAddressComponent,
    SetupDashboardComponent,
    TrackingComponent,
    ButtonComponent,
    InstallComponent,
    ClipboardComponent,
    DiagramComponent,
    NavTabComponent,
    ScanCodeComponent,
    MomoComponent,
    BarcodeComponent,
    SocialChatComponent,
    CalculatorComponent,
    AudioPlayerComponent,
    PaypalComponent,
    CountdownPipe
    ],
    imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    HttpClientModule,
    MomentModule,
    NgxDropzoneModule,
    NgxPrintModule,
    FullCalendarModule,
    SocialLoginModule,
    QrCodeModule,
    NgQrScannerModule,
    NgxTinymceModule.forRoot({
        baseURL: '/assets/tinymce/',
        config: {
            min_height: 250,
            theme: 'modern',
            branding: false,
            resize: false,
            menubar: false,
            // inline: true,
            forced_root_block : '',
            plugins: 'paste print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help emoticons code advlist',
            toolbar: [
            'paste | formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent  | removeformat',
            'fullscreen emoticons | table list hr | image media | charmap code codesample | pagebreak print'
            ],
            image_advtab: true,
            imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
            paste_data_images: true,
            images_upload_handler: tinymce_upload_images,
            image_dimensions: false,
            image_class_list: [{value: 'img-fluid'} ]
        }
    }),
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        },
        defaultLanguage: 'en'
    }),
    RouterModule.forRoot(routes),
    DeviceDetectorModule.forRoot(),
    NgxPayPalModule
    ],
    exports: [RouterModule],
    providers: [AppServices, RelationService, NotifyService, PasteService, FirebaseService, {
        provide: AuthServiceConfig,
        useFactory: provideConfig
    }, DecimalPipe, DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function tinymce_upload_images(blobInfo, success, failure){
    success("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
}
export function provideConfig(){
    return new AuthServiceConfig([])
}
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
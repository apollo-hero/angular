import {Component, OnInit, Renderer} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

import {TranslateService} from '@ngx-translate/core';
import {AppServices} from './app.services';
import {NotifyService} from './addon/notify.service';
import {FirebaseService} from './addon/firebase.service';

import {AuthService, AuthServiceConfig, FacebookLoginProvider} from 'angularx-social-login';

// 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/scrollspy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  app;

  constructor(private meta: Meta, private titleService: Title
    , private router: Router, private activatedroute: ActivatedRoute
    , private renderer: Renderer, private appServices: AppServices, private authService: AuthService
    , private notifyService: NotifyService, private firebaseService: FirebaseService, private translate: TranslateService) {
    translate.use(translate.getBrowserLang());
    appServices.api('get', null, {
      model: `applications/${appServices.appcode}`,
    }, {notify: false}).then((obj) => {
      let res = obj.response.res;
      if (res.pagination.count) {
        this.app = res.data[0];
        appServices.clear();
        appServices.setLocal('app', this.app);
        meta.updateTag({name: 'description', content: this.app.description});
        meta.updateTag({name: 'og:description', content: this.app.description});
        appServices.setCanonical();

        new AuthService(new AuthServiceConfig([{
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider(this.app.fb_app_id)
        }]));
      }
    }).catch(err => {
    });

    router.events.subscribe((event: any) => {
      if (event.constructor.name === 'NavigationStart') {

      }
      if (event.constructor.name === 'NavigationEnd') {
        this.firebaseService.getMessage(payload => {
          console.log(payload);
          this.notifyService.toast(payload.notification.title, payload.notification.body);
        });
      }
    });
  }

  ngOnInit() {
    /* SSR */
    this.firebaseService.getMessage(payload => {
      console.log(payload);
      this.notifyService.toast(payload.notification.title, payload.notification.body);
    });
    /* End SSR */

    this.firebaseService.getToken(token => {
      this.appServices.setLocal('notify', token);
    });
  }

  onDeactivate() {
    this.renderer.setElementProperty(document.body, 'scrollTop', 1000);
  }
}

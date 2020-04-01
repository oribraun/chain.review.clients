import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

declare var ga: any;
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private gaUrl = 'https://www.google-analytics.com/collect';
  public analyticsId: string;
  private router: Router;
  private httpClient: HttpClient;
  private titleService: Title;
  private headers: any;
  constructor(httpClient: HttpClient, router: Router, titleService: Title) {
    this.headers = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        // 'Authorization': 'my-auth-token'
        'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT'
      })
    };
    console.log('this.headers', this.headers);

    this.httpClient = httpClient;
    this.router = router;
    this.titleService = titleService;
    this.analyticsId = environment.analyticsId;
    AnalyticsService.loadGoogleAnalytics2(this.analyticsId);
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.trackPageView();
        });
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }

  static loadGoogleAnalytics(trackingID: string): void {

    const gaScript = document.createElement('script');
    gaScript.setAttribute('async', 'true');
    gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${ trackingID }`);

    const gaScript2 = document.createElement('script');
    gaScript2.innerText = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'${ trackingID }\');`;

    document.documentElement.firstChild.appendChild(gaScript);
    document.documentElement.firstChild.appendChild(gaScript2);
  }

  static loadGoogleAnalytics2(trackingID: string): void {

    const gaScript = document.createElement('script');
    gaScript.innerText = '(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){\n' +
      '  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n' +
      '  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n' +
      '  })(window,document,\'script\',\'https://www.google-analytics.com/analytics.js\',\'ga\');\n' +
      '\n' +
      '  ga(\'create\', \'' + trackingID + '\', \'auto\');\n';
      // "  ga('send', 'pageview');";

    document.documentElement.lastChild.appendChild(gaScript);
  }

  // trackEvent(eventCategory, eventAction, eventLabel, eventValue) {
  //
  //   ga('send', {
  //     hitType: 'event',
  //     eventCategory: eventCategory,
  //     eventAction: eventAction,
  //     eventLabel: eventLabel,
  //     eventValue: eventValue
  //   });
  //   // ga('send', {
  //   //   hitType: 'event',
  //   //   eventCategory: 'Videos',
  //   //   eventAction: 'play',
  //   //   eventLabel: 'Fall Campaign'
  //   // });
  //
  //   const eventTypeList = [
  //     'pageview',
  //     'event',
  //     'screenview',
  //     'transaction',
  //     'item',
  //     'social',
  //     'exception',
  //     'timing',
  //   ]
  //
  //   var data = {
  //     v: 1,
  //     tid: this.analyticsId,
  //     // cid: StoreId,
  //     // cd1: StoreId, // custom dimension
  //     // uid: RepId,
  //     // cd2: RepId, // custom dimension
  //     // cd3: buildType, // custom dimension
  //     // cd4: isDemo, // custom dimension
  //     t: 'event',
  //     ec: eventCategory,
  //     ea: eventAction,
  //     el: eventLabel,
  //     ev: parseInt(eventValue, 0) || 0 // only numbers
  //   }
  //   this.httpClient.post(this.gaUrl, data, this.headers)
  //     .subscribe((data: any) => {});
  // }

  trackPageView() {
    // console.log('ga', ga)
    ga('send', {
      hitType: 'pageview',
      page: location.pathname + '/' + location.hash,
      location: location.pathname + '/' + location.hash,
      title: this.titleService.getTitle()
    });
  }
}

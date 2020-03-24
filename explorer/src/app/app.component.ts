import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AnalyticsService} from "./services/analytics.service";

declare let DATA: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'explorer';
  // data;
  private data: any;
  private titleService: Title;

  constructor(titleService: Title, analyticsService: AnalyticsService) {
    // analyticsService.trackPageView()
    this.titleService = titleService;
    let data: any = {}; /// from server node ejs data
    if (typeof DATA !== "undefined") {
      data = DATA;
    }
    this.data = data;
    console.log('session data');
    // console.log('app component', data);
    this.titleService.setTitle( this.data.wallet.replace('dogecash', 'dogec').toUpperCase() + ' Network - Blockchain Explorer | Chain Review' );
    // this.data = data;
  }

  ngOnInit(): void {
  }
}

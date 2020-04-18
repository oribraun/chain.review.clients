import {Component, OnInit} from '@angular/core';

declare var DATA: any;

@Component({
  selector: 'info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.less']
})
export class InfoBarComponent implements OnInit {
  public data: any = {};
  public preetyVersion: string;

  ngOnInit() {
    let data: any = {};

    if (typeof (window as any).DATA !== 'undefined') {
      data = (window as any).DATA;
    }

    this.data = data;
    this.preetyVersion = this.data.stats.version.toString().replace(/(.)./g, "$1.");
  }
}

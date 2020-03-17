import {Component, OnInit} from "@angular/core";

declare var DATA: any;

@Component({
  selector: 'info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.less']
})
export class InfoBarComponent implements OnInit {
  public data = {};

  ngOnInit() {
    let data: any = {};

    if (typeof (<any>window).DATA !== "undefined") {
      data = (<any>window).DATA;
    }

    this.data = data;
  }
}

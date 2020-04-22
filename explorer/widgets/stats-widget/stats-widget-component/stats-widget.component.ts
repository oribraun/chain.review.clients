import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from './../../environments/environment';

declare var $: any;
@Component({
  selector: 'stats-widget',
  templateUrl: './stats-widget.component.html',
  styleUrls: ['./stats-widget.component.less'],
  providers: [HttpClient]
})
export class StatsWidgetComponent implements OnInit, OnChanges {

  @Input() wallet: string;
  public _elementRef: ElementRef;
  private _http: HttpClient;
  public _stats: any;
  public idCounter = 1;
  public _gettingStats: boolean;
  public _sliderStarted = false;
  private interval;
  private timeout;
  constructor(http: HttpClient, elementRef: ElementRef) {
    this._elementRef = elementRef;
    if (!this.wallet) {
      this.wallet = this._elementRef.nativeElement.getAttribute('wallet');
    }
    this._http = http;
  }
  ngOnInit() {
    this.startGettingData();
  }
  startGettingData() {
    this.getData();
    this.interval = setInterval(() => {
      this.getData();
    }, 60 * 1000);
  }
  replaceWallet() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
    $('.stats').fadeOut().removeClass('fadeInDown fadeOutDown animated');
    this.idCounter = 1;
    this._stats = null;
    this._sliderStarted = false;
    this.getData();
  }
  headSlider() {
    this._sliderStarted = true;
    if (this.idCounter < 10) {
      $('.stats_' + this.idCounter).show().addClass('animated fadeInDown');
      this.timeout = setTimeout(() => {
        $('.stats_' + this.idCounter).show().addClass('fadeOutDown');
        $('.stats_' + this.idCounter).fadeOut().removeClass('fadeInDown');
        this.idCounter++;
        if(this._sliderStarted) {
          this.headSlider();
        }
      }, 3000);
    } else {
      $('.stats').fadeOut().removeClass('fadeInDown fadeOutDown animated');
      this.idCounter = 1;
      if(this._sliderStarted) {
        this.headSlider();
      }
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.wallet) {
      this.replaceWallet();
    }
  }

  getData() {
    if (this.wallet) {
      this._gettingStats = true;
      this._http.get('https://sandbox.chain.review/api/db/' + this.wallet + '/getstats').subscribe(
        (data: any) => {
          // this._data = data;
          this._stats = data;
          this._gettingStats = false;
          if (!this._sliderStarted) {
            setTimeout(() => {
              this.headSlider();
            });
          }
        }
      );
    }
  }
  numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}

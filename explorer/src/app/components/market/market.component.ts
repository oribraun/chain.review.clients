import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {MaxAfterDotPipe} from "../../pipes/maxAfterDot/max-after-dot.pipe";

declare var DATA: any;
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.less']
})
export class MarketComponent implements OnInit {

  public data;
  public currentSymbol: string = '';
  public currentFromCoin: string = '';
  public currentToCoin: string = '';
  public market: any;
  public avaliableMarkets: any;
  public gettingAvailableMarkets: boolean = false;
  public gettingMarket: boolean = false;

  private http: HttpClient;
  private route: ActivatedRoute;
  private router: Router;
  private maxAfterDotPipe: MaxAfterDotPipe = new MaxAfterDotPipe();
  constructor(http: HttpClient, route: ActivatedRoute, router: Router) {
    this.http = http;
    this.route = route;
    this.router = router;
    this.route.params.subscribe(params => {
      this.currentSymbol = params['symbol'];
      if(this.currentSymbol) {
        const coins = this.currentSymbol.split('_');
        this.currentFromCoin = coins[1];
        this.currentToCoin = coins[0];
      }
      if(this.avaliableMarkets) {
        this.getMarket();
      }
    });

    let data: any = {}; /// from server node ejs data
    if (typeof (<any>window).DATA !== "undefined") {
      data = (<any>window).DATA;
    }
    this.data = data;
    this.getAvaliableMarkets();
  }

  ngOnInit() {
  }

  getAvaliableMarkets() {
    this.gettingAvailableMarkets = true;
    let url = window.location.origin + '/api/db/' + this.data.wallet + '/getAvailableMarkets';
    this.http.get(url).subscribe(
      (response: any) => {
        if(!response.err) {
          this.avaliableMarkets = response.data;
          var symbols = this.avaliableMarkets.map(function(obj) { return obj.symbol});
          var index = symbols.indexOf(this.currentSymbol);
          if(index > -1) {
            this.getMarket();
          } else {
            this.router.navigateByUrl('/market/' + symbols[0]);
          }
        } else {
          this.router.navigateByUrl('/');
        }
        this.gettingAvailableMarkets = false;
      },
      (error) => {
        console.log(error);
        this.gettingAvailableMarkets = false;
      }
    )
  }

  getMarket() {
    this.gettingMarket = true;
    this.market = null;
    let url = window.location.origin + '/api/db/' + this.data.wallet + '/getMarket/' + this.currentSymbol;
    this.http.get(url).subscribe(
      (response: any) => {
        if(!response.err) {
          this.market = response.data;
          console.log('this.market', this.market)
        } else {
          this.router.navigateByUrl('/');
        }
        this.gettingMarket = false;
      },
      (error) => {
        console.log(error);
        this.gettingMarket = false;
      }
    )
  }

  setCurrentTable(symbol) {
    this.router.navigateByUrl('/market/' + symbol);
  }

  fixPrice(price) {
    return parseFloat(price).toFixed(8);
  }

  setTotal(price) {
    var res;
      if(this.currentFromCoin === 'BTC') {
        res = parseFloat(this.maxAfterDotPipe.transform(price, 8)).toFixed(8);
      }
      else {
        res = parseFloat(this.maxAfterDotPipe.transform(price, 2)).toFixed(2);
      }
    return res;
  }
  setPrice(total) {
    var res;
    if(this.currentFromCoin === 'BTC') {
      res = parseFloat(this.maxAfterDotPipe.transform(total, 8)).toFixed(8);
    }
    else if(this.currentFromCoin === 'XEM' || this.currentFromCoin === 'DOGEC' || this.currentFromCoin === 'STREAM') {
      res = parseFloat(this.maxAfterDotPipe.transform(total, 8)).toFixed(8);
    }
    else if(this.currentFromCoin === 'TWINS') {
      res = parseFloat(this.maxAfterDotPipe.transform(total, 4)).toFixed(4);
    }
    else if(this.currentFromCoin === 'FIX') {
      res = parseFloat(this.maxAfterDotPipe.transform(total, 8));
      if(res < 1) {
        res = res.toFixed(8);
      }
    }
    else {
      res = parseFloat(this.maxAfterDotPipe.transform(total, 2)).toFixed(2);
    }
    return res;
  }

}

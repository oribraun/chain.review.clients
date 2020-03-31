import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {MaxAfterDotPipe} from "../../pipes/maxAfterDot/max-after-dot.pipe";
import {Title} from "@angular/platform-browser";

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
  public marketSummary: any;
  public marketData: any = {};
  public gettingAvailableMarkets: boolean = false;
  public gettingMarketSummary: boolean = false;
  public gettingMarket: boolean = false;

  private http: HttpClient;
  private route: ActivatedRoute;
  private router: Router;
  private maxAfterDotPipe: MaxAfterDotPipe = new MaxAfterDotPipe();
  private titleService: Title;
  constructor(http: HttpClient, route: ActivatedRoute, router: Router, titleService: Title) {
    this.http = http;
    this.route = route;
    this.router = router;
    this.titleService = titleService;
    this.route.params.subscribe(params => {
      // this.currentSymbol = params['symbol'];
      // if(this.currentSymbol) {
      //   const coins = this.currentSymbol.split('_');
      //   this.currentFromCoin = coins[1];
      //   this.currentToCoin = coins[0];
      // }
      let data: any = {}; /// from server node ejs data
      if (typeof (<any>window).DATA !== "undefined") {
        data = (<any>window).DATA;
      }
      this.data = data;
      this.titleService.setTitle( this.data.wallet.replace('dogecash', 'dogec').toUpperCase() + ' Network - Market Overview | Chain Review' );
      // if(this.avaliableMarkets) {
      //   this.getMarket();
      // }
    });
  }

  ngOnInit() {
    this.getAvaliableMarkets();
    this.getMarketsSummary();
  }

  getAvaliableMarkets() {
    this.gettingAvailableMarkets = true;
    let url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getAvailableMarkets';
    this.http.get(url).subscribe(
      (response: any) => {
        if(!response.err) {
          this.avaliableMarkets = response.data;
          // var symbols = this.avaliableMarkets.map(function(obj) { return obj.symbol});
          // var index = symbols.indexOf(this.currentSymbol);
          // if(index > -1) {
          //   this.getMarket();
          // } else {
          //   this.router.navigateByUrl('/market/' + symbols[0]);
          // }
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
  getMarketsSummary() {
    this.gettingMarketSummary = true;
    let url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getMarketsSummary';
    this.http.post(url, {}).subscribe(
      (response: any) => {
        if (!response.err) {
          this.marketSummary = response.data;
          this.calcMarketData();
          console.log('getMarketsSummary', response.data);
        }
        this.gettingMarketSummary = false;
      },
      (error) => {
        console.log(error);
        this.gettingMarketSummary = false;
      }
    )
  }

  calcMarketData() {
    for (const i in this.marketSummary) {
      if (!this.marketData[this.marketSummary[i].market_name]) {
        this.marketData[this.marketSummary[i].market_name] = {
          '24hVolume': 0,
          sellLiquidity: 0,
          buyLiquidity: 0,
          '24hDeposits': 0,
          '24hWithdrawals': 0,
          'totalPriceBtc': 0,
          'totalPriceCount': 0,
          'avgPriceBtc': 0,
          buyLquidityOptions: [],
          sellLquidityOptions: []
        };
      }
      const setDataBasedOnLastPrice = () => {
        this.marketData[this.marketSummary[i].market_name].buyLiquidity += this.marketSummary[i].buyLiquidityBtc;
        this.marketData[this.marketSummary[i].market_name].sellLiquidity += this.marketSummary[i].sellLiquidityBtc;
        this.marketData[this.marketSummary[i].market_name]['24hVolume'] += parseFloat(this.marketSummary[i].volume) * parseFloat(this.marketSummary[i].leftCoinPriceBtc);
        if (this.marketSummary[i].symbol.indexOf('BTC_') === -1) {
          this.marketData[this.marketSummary[i].market_name].totalPriceBtc += this.marketSummary[i].leftCoinPriceBtc;
          this.marketData[this.marketSummary[i].market_name].totalPriceCount += 1;
        }
        const symbolSplit = this.marketSummary[i].symbol.split('_');
        const fromCoin = symbolSplit[0];
        const toCoin = symbolSplit[1];
        // if(fromCoin !== 'BTC') {
        this.marketData[this.marketSummary[i].market_name].buyLquidityOptions.push({
          fromCoin: fromCoin,
          fromAmount: this.marketSummary[i].buyLiquidity.toFixed(6),
          toCoin: toCoin,
          toMainCoin: 'BTC',
          toAmount: this.marketSummary[i].buyLiquidityBtc.toFixed(6),
        })
        this.marketData[this.marketSummary[i].market_name].sellLquidityOptions.push({
          fromCoin: fromCoin,
          fromAmount: this.marketSummary[i].sellLiquidity.toFixed(6),
          toCoin: toCoin,
          toMainCoin: 'BTC',
          toAmount: this.marketSummary[i].sellLiquidityBtc.toFixed(6)
        })
        // }
      }

      const setDataBasedOnRealPrice = () => {
        this.marketData[this.marketSummary[i].market_name].buyLiquidity += this.marketSummary[i].realBuyLiquidityBtc;
        this.marketData[this.marketSummary[i].market_name].sellLiquidity += this.marketSummary[i].realSellLiquidityBtc;
        this.marketData[this.marketSummary[i].market_name]['24hVolume'] += parseFloat(this.marketSummary[i].volume) * parseFloat(this.marketSummary[i].leftCoinPriceBtc);
        if(this.marketSummary[i].symbol.indexOf('BTC_') === -1) {
          this.marketData[this.marketSummary[i].market_name].totalPriceBtc += this.marketSummary[i].leftCoinPriceBtc;
          this.marketData[this.marketSummary[i].market_name].totalPriceCount += 1;
        }
        const symbolSplit = this.marketSummary[i].symbol.split('_');
        const fromCoin = symbolSplit[0];
        const toCoin = symbolSplit[1];
        // if(fromCoin !== 'BTC') {
        this.marketData[this.marketSummary[i].market_name].buyLquidityOptions.push({
          fromCoin: fromCoin,
          fromAmount: this.marketSummary[i].realBuyLiquidity.toFixed(6),
          toCoin: toCoin,
          toMainCoin: 'BTC',
          toAmount: this.marketSummary[i].realBuyLiquidityBtc.toFixed(6),
        })
        this.marketData[this.marketSummary[i].market_name].sellLquidityOptions.push({
          fromCoin: fromCoin,
          fromAmount: this.marketSummary[i].realSellLiquidity.toFixed(6),
          toCoin: toCoin,
          toMainCoin: 'BTC',
          toAmount: this.marketSummary[i].realSellLiquidityBtc.toFixed(6)
        })
      }

      setDataBasedOnRealPrice();
    }
    for(var i in this.marketData) {
      this.marketData[i].avgPriceBtc = (this.marketData[i].totalPriceBtc / this.marketData[i].totalPriceCount).toFixed(8);
      this.marketData[i].buyLiquidity = this.marketData[i].buyLiquidity.toFixed(8);
      this.marketData[i].sellLiquidity = this.marketData[i].sellLiquidity.toFixed(8);
      this.marketData[i]['24hVolume'] = this.marketData[i]['24hVolume'].toFixed(8);
    }
    console.log('this.marketData', this.marketData)
  }

  getMarket() {
    this.gettingMarket = true;
    this.market = null;
    let url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getMarket/' + this.currentSymbol;
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

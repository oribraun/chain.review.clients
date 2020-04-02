import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {MaxAfterDotPipe} from '../../pipes/maxAfterDot/max-after-dot.pipe';
import {Title} from '@angular/platform-browser';

declare var DATA: any;
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.less']
})
export class MarketComponent implements OnInit {

  public data;
  public currentSymbol = '';
  public currentFromCoin = '';
  public currentToCoin = '';
  public market: any;
  public avaliableMarkets: any;
  public marketSummary: any;
  public marketData: any = {};
  public gettingAvailableMarkets = false;
  public gettingMarketSummary = false;
  public gettingMarket = false;

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
      if (typeof (window as any).DATA !== 'undefined') {
        data = (window as any).DATA;
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
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getAvailableMarkets';
    this.http.get(url).subscribe(
      (response: any) => {
        if (!response.err) {
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
    );
  }
  getMarketsSummary() {
    this.gettingMarketSummary = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getMarketsSummary';
    this.http.post(url, {}).subscribe(
      (response: any) => {
        if (!response.err) {
          this.marketSummary = response.data;
          this.removeDuplicateSummary();
          this.calcMarketData();
          // console.log('getMarketsSummary', response.data);
        }
        this.gettingMarketSummary = false;
      },
      (error) => {
        console.log(error);
        this.gettingMarketSummary = false;
      }
    );
  }

  removeDuplicateSummary() {
    // console.log('before remove duplicate this.marketSummary', this.marketSummary);
    const symbolsToCalc = [];
    for (let i = 0; i < this.marketSummary.length; i++) {
      const symbolSplit = this.marketSummary[i].symbol.split('_');
      const fromCoin = symbolSplit[0];
      const toCoin = symbolSplit[1];
      const regularSymbol = fromCoin + '_' + toCoin;
      if (!regularSymbol.includes(this.data.wallet.toUpperCase() + '_')) {
        this.marketSummary.splice(i, 1);
        i--;
      }
    }
    // console.log('after remove duplicate this.marketSummary', this.marketSummary);
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
          totalPriceBtc: 0,
          totalPriceCount: 0,
          avgPriceBtc: 0,
          buyLquidityOptions: [],
          sellLquidityOptions: []
        };
      }
      const setDataBasedOnLastPrice = () => {
        this.marketData[this.marketSummary[i].market_name].buyLiquidity += this.marketSummary[i].totalBuyLiquidityBtc;
        this.marketData[this.marketSummary[i].market_name].sellLiquidity += this.marketSummary[i].amountSellLiquidityBtc;
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
          fromCoin,
          fromAmount: this.marketSummary[i].totalBuyLiquidity.toFixed(6),
          toCoin,
          toMainCoin: 'BTC',
          toAmount: this.marketSummary[i].totalBuyLiquidityBtc.toFixed(6),
        });
        this.marketData[this.marketSummary[i].market_name].sellLquidityOptions.push({
          fromCoin,
          fromAmount: this.marketSummary[i].amountSellLiquidity.toFixed(6),
          toCoin,
          toMainCoin: 'BTC',
          toAmount: this.marketSummary[i].amountSellLiquidityBtc.toFixed(6)
        });
        // }
      };

      const setDataBasedOnRealPrice = () => {
        this.marketData[this.marketSummary[i].market_name].buyLiquidity += this.marketSummary[i].totalBuyLiquidityBtc;
        this.marketData[this.marketSummary[i].market_name].sellLiquidity += this.marketSummary[i].totalSellLiquidityBtc;
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
          fromCoin,
          fromAmount: this.marketSummary[i].totalBuyLiquidity.toFixed(6),
          toCoin,
          toMainCoin: 'BTC',
          toAmount: this.marketSummary[i].totalBuyLiquidityBtc.toFixed(6),
        });
        this.marketData[this.marketSummary[i].market_name].sellLquidityOptions.push({
          fromCoin,
          fromAmount: this.marketSummary[i].totalSellLiquidity.toFixed(6),
          toCoin,
          toMainCoin: 'BTC',
          toAmount: this.marketSummary[i].totalSellLiquidityBtc.toFixed(6)
        });
      };

      setDataBasedOnLastPrice();
    }
    for (const i in this.marketData) {
      this.marketData[i].avgPriceBtc = (this.marketData[i].totalPriceBtc / this.marketData[i].totalPriceCount).toFixed(8);
      this.marketData[i].buyLiquidity = this.marketData[i].buyLiquidity.toFixed(8);
      this.marketData[i].sellLiquidity = this.marketData[i].sellLiquidity.toFixed(8);
      this.marketData[i]['24hVolume'] = this.marketData[i]['24hVolume'].toFixed(8);
    }
    // console.log('this.marketData', this.marketData);
  }

  getMarket() {
    this.gettingMarket = true;
    this.market = null;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getMarket/' + this.currentSymbol;
    this.http.get(url).subscribe(
      (response: any) => {
        if (!response.err) {
          this.market = response.data;
          console.log('this.market', this.market);
        } else {
          this.router.navigateByUrl('/');
        }
        this.gettingMarket = false;
      },
      (error) => {
        console.log(error);
        this.gettingMarket = false;
      }
    );
  }

  setCurrentTable(symbol) {
    this.router.navigateByUrl('/market/' + symbol);
  }

  fixPrice(price) {
    return parseFloat(price).toFixed(8);
  }

  setTotal(price) {
    let res;
    if (this.currentFromCoin === 'BTC') {
      res = parseFloat(this.maxAfterDotPipe.transform(price, 8)).toFixed(8);
    } else {
      res = parseFloat(this.maxAfterDotPipe.transform(price, 2)).toFixed(2);
    }
    return res;
  }
  setPrice(total) {
    let res;
    if (this.currentFromCoin === 'BTC') {
      res = parseFloat(this.maxAfterDotPipe.transform(total, 8)).toFixed(8);
    } else if (this.currentFromCoin === 'XEM' || this.currentFromCoin === 'DOGEC' || this.currentFromCoin === 'STREAM') {
      res = parseFloat(this.maxAfterDotPipe.transform(total, 8)).toFixed(8);
    } else if (this.currentFromCoin === 'TWINS') {
      res = parseFloat(this.maxAfterDotPipe.transform(total, 4)).toFixed(4);
    } else if (this.currentFromCoin === 'FIX') {
      res = parseFloat(this.maxAfterDotPipe.transform(total, 8));
      if (res < 1) {
        res = res.toFixed(8);
      }
    } else {
      res = parseFloat(this.maxAfterDotPipe.transform(total, 2)).toFixed(2);
    }
    return res;
  }

}

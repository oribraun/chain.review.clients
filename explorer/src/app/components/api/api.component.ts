import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";

declare let DATA: any;
@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.less']
})
export class ApiComponent implements OnInit {

  public api:any[] = [];
  private data: any;
  private titleService: Title;
  constructor(titleService: Title) {
    this.titleService = titleService;
    let data: any = {}; /// from server node ejs data
    if (typeof (<any>window).DATA !== "undefined") {
      data = (<any>window).DATA;
    }
    this.data = data;
    this.titleService.setTitle( this.data.wallet.replace('dogecash', 'dogec').toUpperCase() + ' Network - Free Blockchain API | Chain Review' );
  }

  ngOnInit() {
    this.api = [
      {url: window.location.origin + "/explorer-api/db/" + this.data.wallet + "/getdifficulty", desc:"Returns the current difficulty."},
      {url:window.location.origin + "/explorer-api/db/" + this.data.wallet + "/getconnectioncount", desc:"Returns the number of connections the block explorer has to other nodes."},
      {url:window.location.origin + "/explorer-api/db/" + this.data.wallet + "/getblockcount", desc:"Returns the current block index."},
      {url:window.location.origin + "/explorer-api/db/" + this.data.wallet + "/getblockhash/1", desc:"Returns the hash of the block at ; index 0 is the genesis block."},
      {url:window.location.origin + "/explorer-api/db/" + this.data.wallet + "/getblock/" + this.data.blockHash, desc:"Returns information about the block with the given hash."},
      {url:window.location.origin + "/explorer-api/db/" + this.data.wallet + "/getrawtransaction/" + this.data.txHash, desc:"Returns raw transaction representation for given transaction id"},
      {url:window.location.origin + "/explorer-api/db/" + this.data.wallet + "/getnetworkhashps", desc:"Returns the current network hashrate. (hash/s)"},
      {url:window.location.origin + "/explorer-api/db/" + this.data.wallet + "/getmoneysupply", desc:"Returns current money supply"},
      {url:window.location.origin + "/explorer-api/db/" + this.data.wallet + "/getdistribution", desc:"Returns wealth distribution stats"},
      {url:window.location.origin + "/explorer-api/db/" + this.data.wallet + "/getAddress/" + this.data.devAddress, desc:"Returns information for given address"},
      // {url:window.location.origin + "/explorer-api/db/" + data.wallet + "/getAvailableMarkets", desc:"Returns available market's information"},
      // {url:window.location.origin + "/explorer-api/db/" + data.wallet + "/getMarket/" + data.wallet.replace('dogecash', 'dogec').toUpperCase() + "_BTC", desc:"Returns market information"}
    ]
  }

}

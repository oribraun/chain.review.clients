import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

declare var DATA: any;
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.less']
})
export class BlockComponent implements OnInit {

  public data;
  public block: any;
  public blockTxs: any;
  public hash: string;
  public gettingBlockTxs: boolean = false;

  private http: HttpClient;
  private route: ActivatedRoute;
  private router: Router;
  private titleService: Title;
  constructor(http: HttpClient, route: ActivatedRoute, router: Router, titleService: Title) {
    this.http = http;
    this.route = route;
    this.router = router;
    this.titleService = titleService;
    let data: any = {}; /// from server node ejs data
    if (typeof (<any>window).DATA !== "undefined") {
      data = (<any>window).DATA;
    }
    // console.log(data);
    this.data = data;
    this.route.params.subscribe(params => {
      this.hash = params['hash'];
      this.getBlock();
    });
  }

  ngOnInit() {

  }

  getBlock() {
    this.gettingBlockTxs = true;
    let url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getBlockTxsByHash/' + this.hash;
    console.log('url', url)
    this.http.get(url).subscribe(
      (response: any) => {
        if(!response.err) {
          this.block = response.data.block;
          this.titleService.setTitle( this.data.wallet.replace('dogecash', 'dogec').toUpperCase() + ' Network - Block ' + this.block.height + ' | Chain Review' );
          this.blockTxs = response.data.txs;
          console.log('this.blockTxs', this.blockTxs)
        } else {
          this.router.navigateByUrl('/');
        }
        this.gettingBlockTxs = false;
      },
      (error) => {
        console.log(error);
        this.gettingBlockTxs = false;
      }
    )
  }

}

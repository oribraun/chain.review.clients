import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

declare var DATA: any;
@Component({
  selector: 'app-tx',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.less']
})
export class TxComponent implements OnInit {

  public data;
  public tx: any;
  public hash: string;
  public gettingTx = false;

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
    if (typeof (window as any).DATA !== 'undefined') {
      data = (window as any).DATA;
    }
    // console.log(data);
    this.data = data;
    this.route.params.subscribe(params => {
      this.hash = params.hash;
      this.getTxDetails();
    });
    this.titleService.setTitle( this.data.symbol.toUpperCase() + ' Coin - Tx ' + this.hash + ' | Chain Review' );
  }

  ngOnInit() {
  }

  getTxDetails() {
    this.gettingTx = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getTxDetails/' + this.hash;
    console.log('url', url);
    this.http.get(url).subscribe(
      (response: any) => {
        if (!response.err) {
          this.tx = response.data;
          this.titleService.setTitle( this.data.symbol.toUpperCase() + ' Coin - Tx ' + this.tx.txid + ' | Chain Review' );
        } else {
          this.router.navigateByUrl('/');
        }
        this.gettingTx = false;
      },
      (error) => {
        console.log(error);
        this.gettingTx = false;
      }
    );
  }

}

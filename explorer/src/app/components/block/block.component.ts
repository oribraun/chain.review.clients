import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

declare var DATA: any;
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.less']
})
export class BlockComponent implements OnInit {

  public data;
  public emptyTable: any[] = [];
  public currentTable: any[] = [];
  public blockDetails: any;
  public block: any;
  public blockTxs: any;
  public hash: string;
  public gettingBlockDetails = false;
  public gettingBlockTxs = false;
  public showPagination = false;
  public input = '';

  public pagination: any = {
    current: 1,
    start: 1,
    end: 10,
    pages: 0,
    maxPages: 10,
    offset: 0,
    limit: 25
  };

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
      this.resetPagination();
      this.setCurrentTable();
      this.getBlockDetails();
    });
    this.titleService.setTitle( this.data.symbol.toUpperCase() + ' Coin - Block ' + this.hash + ' | Chain Review' );
  }

  ngOnInit() {

  }

  resetPagination() {
    this.pagination = {
      current: 1,
      start: 1,
      end: 10,
      pages: 0,
      maxPages: 10,
      offset: 0,
      limit: 25
    };
  }

  getBlockDetails() {
    this.gettingBlockDetails = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getBlockDetails';
    console.log('url', url);
    this.http.post(url, {hash: this.hash}).subscribe(
      (response: any) => {
        if (!response.err) {
          this.blockDetails = response.data;
          this.titleService.setTitle( this.data.symbol.toUpperCase() + ' Coin - Block ' + this.blockDetails.height + ' | Chain Review' );
          this.getBlockTxList();
        } else {
          if (response.errMessage === 'no address found') {
            alert('address not exist or still in sync');
            this.router.navigateByUrl('/');
          }
        }
        this.setPages();
        this.gettingBlockDetails = false;
      },
      (error) => {
        console.log(error);
        this.gettingBlockDetails = false;
      }
    );
  }

  getBlockTxList() {
    this.gettingBlockTxs = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getBlockTxs';
    console.log('url', url);
    const data = {
      hash : this.hash,
      limit : this.pagination.limit,
      offset : this.pagination.offset,
    };
    this.http.post(url, data).subscribe(
      (response: any) => {
        if (!response.err) {
          this.blockTxs = response.data;
          this.currentTable = this.emptyTable.slice();
          for (let i = 0; i < this.blockTxs.length; i++) {
            this.currentTable[i] = this.blockTxs[i];
          }
        }
        if (!this.showPagination) {
          this.showPagination = true;
        }
        this.gettingBlockTxs = false;
      },
      (error) => {
        console.log(error);
        this.gettingBlockTxs = false;
      }
    );
  }

  setCurrentTable() {
    for (let i = 0; i < this.pagination.limit; i++) {
      this.emptyTable.push( {blockindex: '&nbsp;', txid: '', totalAmount: '', recipients: ''});
    }
    this.currentTable = this.emptyTable.slice();
  }

  setPages() {
    if (window.innerWidth <= 415) {
      this.pagination.maxPages = 5;
    } else {
      this.pagination.maxPages = 10;
    }
    this.pagination.pages = Math.ceil(this.blockDetails.count / this.pagination.limit);
    this.pagination.start = this.pagination.current - Math.floor(this.pagination.maxPages / 2) + 1;
    this.pagination.end = this.pagination.current + Math.floor(this.pagination.maxPages / 2);
    if (this.pagination.start < 1) {
      this.pagination.start = 1;
      // this.pagination.current = this.pagination.start;
      this.pagination.end = this.pagination.maxPages;
    }
    if (this.pagination.end > this.pagination.pages) {
      this.pagination.end = this.pagination.pages;
      // this.pagination.current = this.pagination.end;
      this.pagination.start = this.pagination.end - this.pagination.maxPages + 1;
      if (this.pagination.start < 1) {
        this.pagination.start = 1;
      }
    }
    if (this.pagination.current < 1) {
      this.pagination.current = this.pagination.start;
    }
    if (this.pagination.current > this.pagination.end) {
      this.pagination.current = this.pagination.end;
    }
  }
  nextPage() {
    if (this.gettingBlockTxs) { return; }
    if (this.pagination.current < this.pagination.pages) {
      this.pagination.current++;
      this.getBlockTxList();
    }
    if (this.pagination.end < this.pagination.pages && this.pagination.current > Math.floor(this.pagination.maxPages / 2)) {
      this.pagination.start++;
      this.pagination.end++;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  prevPage() {
    if (this.gettingBlockTxs) { return; }
    if (this.pagination.current > 1) {
      this.pagination.current--;
      this.getBlockTxList();
    }
    if (this.pagination.start > 1 && this.pagination.current < this.pagination.pages - Math.ceil(this.pagination.maxPages / 2)) {
      this.pagination.start--;
      this.pagination.end--;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  setPage(page) {
    if (this.gettingBlockTxs) { return; }
    if (page === this.pagination.current || !page || isNaN(page)) {
      return;
    }
    this.pagination.current = parseInt(page, 0);
    if (this.pagination.current < 1) {
      this.pagination.current = this.pagination.start;
    }
    if (this.pagination.current > this.pagination.pages) {
      this.pagination.current = this.pagination.pages;
    }
    this.pagination.offset = (parseInt(this.pagination.current, 0) - 1);

    this.setPages();
    this.getBlockTxList();
  }

  getBlock() {
    this.gettingBlockTxs = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getBlockTxsByHash/' + this.hash;
    console.log('url', url);
    this.http.get(url).subscribe(
      (response: any) => {
        if (!response.err) {
          this.block = response.data.block;
          this.titleService.setTitle( this.data.symbol.toUpperCase() + ' Coin - Block ' + this.block.height + ' | Chain Review' );
          this.blockTxs = response.data.txs;
          console.log('this.blockTxs', this.blockTxs);
        } else {
          this.router.navigateByUrl('/');
        }
        this.gettingBlockTxs = false;
      },
      (error) => {
        console.log(error);
        this.gettingBlockTxs = false;
      }
    );
  }

}

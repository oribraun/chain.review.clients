import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";

declare var DATA: any;
@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.less']
})
export class MovementComponent implements OnInit {

  public data;
  public input = '';
  public txs: any[];
  public txVinVoutCount: any = 0;
  public emptyTable: any[] = [];
  public currentTable: any[] = [];
  public gettingTxs = false;
  public gettingTxVinVoutCount = false;
  public showPagination = false;
  public pagination: any = {
    current: 1,
    start: 1,
    end: 10,
    pages: 0,
    maxPages: 10,
    offset: 0,
    limit: 25
  }
  public flags = {
    "min_amount": 100,
    "low_flag": 9999999, // flaga
    "high_flag": 10000000 // flagb
  };
  private http: HttpClient;
  private titleService: Title;
  constructor(http: HttpClient, titleService: Title) {
    this.http = http;
    this.titleService = titleService;
    let data: any = {}; /// from server node ejs data
    if (typeof (<any>window).DATA !== "undefined") {
      data = (<any>window).DATA;
    }
    // console.log(data);
    this.data = data;
    this.titleService.setTitle( this.data.wallet.replace('dogecash', 'dogec').toUpperCase() + ' Network - Transactions | Chain Review' );
  }

  ngOnInit() {
    this.setCurrentTable();
    this.getTxVinVoutCount();

  }

  setPages() {
    if(window.innerWidth <= 415) {
      this.pagination.maxPages = 5;
    } else {
      this.pagination.maxPages = 10;
    }
    this.pagination.pages = Math.ceil(this.txVinVoutCount / this.pagination.limit);
    this.pagination.start = this.pagination.current - Math.floor(this.pagination.maxPages / 2) + 1;
    this.pagination.end = this.pagination.current + Math.floor(this.pagination.maxPages / 2);
    if(this.pagination.start < 1) {
      this.pagination.start = 1;
      // this.pagination.current = this.pagination.start;
      this.pagination.end = this.pagination.maxPages;
    }
    if(this.pagination.end > this.pagination.pages) {
      this.pagination.end = this.pagination.pages;
      // this.pagination.current = this.pagination.end;
      this.pagination.start = this.pagination.end - this.pagination.maxPages + 1;
      if(this.pagination.start < 1) {
        this.pagination.start = 1;
      }
    }
    if(this.pagination.current < 1) {
      this.pagination.current = this.pagination.start;
    }
    if(this.pagination.current > this.pagination.end) {
      this.pagination.current = this.pagination.end;
    }
  }
  setCurrentTable() {
    for(var i = 0; i < this.pagination.limit; i++) {
      this.emptyTable.push( { "timestamp": "", "total": "", "_id": "", "txid": "&nbsp;" });
    }
    this.currentTable = this.emptyTable.slice();
  }
  nextPage() {
    if(this.gettingTxs) return;
    if(this.pagination.current < this.pagination.pages) {
      this.pagination.current++;
      this.getTxs();
    }
    if(this.pagination.end < this.pagination.pages && this.pagination.current > Math.floor(this.pagination.maxPages / 2)) {
      this.pagination.start++;
      this.pagination.end++;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  prevPage() {
    if(this.gettingTxs) return;
    if(this.pagination.current > 1) {
      this.pagination.current--;
      this.getTxs();
    }
    if(this.pagination.start > 1 && this.pagination.current < this.pagination.pages - Math.ceil(this.pagination.maxPages / 2)) {
      this.pagination.start--;
      this.pagination.end--;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  setPage(page) {
    if(this.gettingTxs) return;
    if(page == this.pagination.current || !page || isNaN(page)) {
      return;
    }
    this.pagination.current = parseInt(page);
    if(this.pagination.current < 1) {
      this.pagination.current = this.pagination.start;
    }
    if(this.pagination.current > this.pagination.pages) {
      this.pagination.current = this.pagination.pages;
    }
    this.pagination.offset = (parseInt(this.pagination.current) - 1);

    this.setPages();
    this.getTxs();
  }

  getTxVinVoutCount() {
    this.gettingTxVinVoutCount = true;
    let url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getTxVinVoutCountWhereTotal';
    console.log('url', url)
    this.http.get(url).subscribe(
      (response: any) => {
        if(!response.err) {
          this.txVinVoutCount = response.data;
        }
        this.gettingTxVinVoutCount = false;
        this.setPages();
        this.getTxs();
      },
      (error) => {
        console.log(error);
        this.gettingTxVinVoutCount = false;
      }
    )
  }
  getTxs() {
    this.gettingTxs = true;
    let url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getAllTxVinVout';
    console.log('url', url)
    var data = {
      limit: this.pagination.limit,
      offset: this.pagination.offset
    }
    this.http.post(url, data).subscribe(
      (response: any) => {
        if(!response.err) {
          this.txs = response.data;
          this.currentTable = this.emptyTable.slice();
          for (var i = 0; i < this.txs.length; i++) {
            this.currentTable[i] = this.txs[i];
          }
        }
        if(!this.showPagination) {
          this.showPagination = true;
        }
        this.gettingTxs = false;
      },
      (error) => {
        console.log(error)
        this.gettingTxs = false;
      }
    )
  }
  @HostListener('window:resize')
  onWindowResize() {
    //debounce resize, wait for resize to finish before doing stuff
    if(window.innerWidth <= 415) {
      this.pagination.maxPages = 5;
    } else {
      this.pagination.maxPages = 10;
    }
    this.setPages();
  }

}

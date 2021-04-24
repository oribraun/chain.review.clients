import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

declare var DATA: any;
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.less']
})
export class AddressComponent implements OnInit {

  public data;
  public txs: any[] = [];
  public emptyTable: any[] = [];
  public currentTable: any[] = [];
  public addressDetails: any;
  public addr: string;
  public gettingTxs = false;
  public gettingAddressDetails = false;
  public showPagination = false;
  private latestAddressId: string;
  public pagination: any = {
    current: 1,
    start: 1,
    end: 10,
    pages: 0,
    maxPages: 10,
    offset: 0,
    limit: 25
  };
  public input = '';
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
      this.addr = params.address;
      this.resetPagination();
      this.setCurrentTable();
      this.getAddressDetails();
    });
    this.titleService.setTitle( this.data.symbol.toUpperCase() + ' Coin - Address ' + this.addr + ' | Chain Review' );
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
  setCurrentTable() {
    for (let i = 0; i < this.pagination.limit; i++) {
      this.emptyTable.push( {txid: '&nbsp;', timestamp: '', sent: '', received: '', balance: '', type: '', blockindex: ''});
    }
    this.currentTable = this.emptyTable.slice();
  }
  setPages() {
    if (window.innerWidth <= 415) {
      this.pagination.maxPages = 5;
    } else {
      this.pagination.maxPages = 10;
    }
    this.pagination.pages = Math.ceil(this.addressDetails.count / this.pagination.limit);
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
    if (this.gettingTxs) { return; }
    if (this.pagination.current < this.pagination.pages) {
      this.pagination.current++;
      this.getAddressTxList();
    }
    if (this.pagination.end < this.pagination.pages && this.pagination.current > Math.floor(this.pagination.maxPages / 2)) {
      this.pagination.start++;
      this.pagination.end++;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  prevPage() {
    if (this.gettingTxs) { return; }
    if (this.pagination.current > 1) {
      this.pagination.current--;
      this.getAddressTxList();
    }
    if (this.pagination.start > 1 && this.pagination.current < this.pagination.pages - Math.ceil(this.pagination.maxPages / 2)) {
      this.pagination.start--;
      this.pagination.end--;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  setPage(page) {
    if (this.gettingTxs) { return; }
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
    this.getAddressTxList();
  }

  getAddressTxList() {
    // console.log('this.latestAddressId', this.latestAddressId);
    this.gettingTxs = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getAddressTxs';
    // console.log('url', url);
    const data = {
      address : this.addr,
      limit : this.pagination.limit,
      offset : this.pagination.offset,
    };
    this.http.post(url, data).subscribe(
      (response: any) => {
        if (!response.err) {
          this.txs = response.data;
          if (this.txs.length) {
            this.latestAddressId = this.txs[this.txs.length - 1];
          }
          // console.log('this.latestAddressId', this.latestAddressId);
          this.currentTable = this.emptyTable.slice();
          for (let i = 0; i < this.txs.length; i++) {
            this.currentTable[i] = this.txs[i];
          }
        }
        if (!this.showPagination) {
          this.showPagination = true;
        }
        this.gettingTxs = false;
      },
      (error) => {
        console.log(error);
        this.gettingTxs = false;
      }
    );
  }

  getAddressDetails() {
    this.gettingAddressDetails = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getAddressDetails';
    // console.log('url', url);
    this.http.post(url, {address: this.addr}).subscribe(
        (response: any) => {
          if (!response.err) {
            this.addressDetails = response.data;
            this.titleService.setTitle( this.data.symbol.toUpperCase() + ' Coin - Address ' + this.addressDetails.address + ' | Chain Review' );
            this.getAddressTxList();
          } else {
            if (response.errMessage === 'no address found') {
              alert('address not exist or still in sync');
              this.router.navigateByUrl('/');
            }
          }
          this.setPages();
          this.gettingAddressDetails = false;
      },
      (error) => {
        console.log(error);
        this.gettingAddressDetails = false;
      }
    );
  }

  @HostListener('window:resize')
  onWindowResize() {
    // debounce resize, wait for resize to finish before doing stuff
    if (window.innerWidth <= 415) {
      this.pagination.maxPages = 5;
    } else {
      this.pagination.maxPages = 10;
    }
    this.setPages();
  }

}

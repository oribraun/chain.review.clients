import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';

declare var DATA: any;
declare var $: any;
@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.less']
})
export class BlocksComponent implements OnInit {

  public data;
  public input = '';
  public blocks: any[];
  public emptyTable: any[] = [];
  public currentTable: any[] = [];
  public gettingBlocks = false;
  public showPagination = false;
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
  private titleService: Title;
  constructor(http: HttpClient, titleService: Title) {
    this.http = http;
    this.titleService = titleService;
    let data: any = {}; /// from server node ejs data
    if (typeof (window as any).DATA !== 'undefined') {
      data = (window as any).DATA;
    }
    // console.log(data);
    this.data = data;
    this.titleService.setTitle( this.data.wallet.replace('dogecash', 'dogec').toUpperCase() + ' Coin - Block Explorer | Chain Review' );
  }

  ngOnInit() {
    this.setCurrentTable();
    this.setPages();
    this.getBlocks();

  }

  setPages() {
    if (window.innerWidth <= 415) {
      this.pagination.maxPages = 5;
    } else {
      this.pagination.maxPages = 10;
    }
    this.pagination.pages = Math.ceil(this.data.total / this.pagination.limit);
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
  setCurrentTable() {
    for (let i = 0; i < this.pagination.limit; i++) {
      this.emptyTable.push( { blockindex: '&nbsp;', _id: '', blockhash: '', timestamp: '' });
    }
    this.currentTable = this.emptyTable.slice();
  }
  nextPage() {
    if (this.gettingBlocks) { return; }
    if (this.pagination.current < this.pagination.pages) {
      this.pagination.current++;
      this.getBlocks();
    }
    if (this.pagination.end < this.pagination.pages && this.pagination.current > Math.floor(this.pagination.maxPages / 2)) {
      this.pagination.start++;
      this.pagination.end++;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  prevPage() {
    if (this.gettingBlocks) { return; }
    if (this.pagination.current > 1) {
      this.pagination.current--;
      this.getBlocks();
    }
    if (this.pagination.start > 1 && this.pagination.current < this.pagination.pages - Math.ceil(this.pagination.maxPages / 2)) {
      this.pagination.start--;
      this.pagination.end--;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  setPage(page) {
    if (this.gettingBlocks) { return; }
    if (page == this.pagination.current || !page || isNaN(page)) {
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
    this.getBlocks();
  }

  getBlocks() {
    this.gettingBlocks = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getAllBlocks';
    console.log('url', url);
    const data = {
      limit: this.pagination.limit,
      offset: this.pagination.offset
    };
    this.http.post(url, data).subscribe(
      (response: any) => {
        if (!response.err) {
          this.blocks = response.data;
          this.currentTable = this.emptyTable.slice();
          for (let i = 0; i < this.blocks.length; i++) {
            this.currentTable[i] = this.blocks[i];
          }
        }
        if (!this.showPagination) {
          this.showPagination = true;
        }
        this.gettingBlocks = false;
      },
      (error) => {
        console.log(error);
        this.gettingBlocks = false;
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

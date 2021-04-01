import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {FilterPipe} from "../../pipes/filter/filter.pipe";
import {OrderByPipe} from "../../pipes/orderBy/order-by.pipe";

@Component({
  selector: 'app-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.less']
})
export class ClustersComponent implements OnInit {

  public data;
  public input = '';
  public total = 0;
  public clusters: any[] = [];
  public emptyTable: any[] = [];
  public currentTable: any[] = [];
  public gettingClusters = false;
  public showPagination = false;
  public orderBy = 'address_count';
  public orderByOrder = '-';
  public pagination: any = {
    current: 1,
    start: 1,
    end: 10,
    pages: 0,
    maxPages: 10,
    offset: 0,
    limit: 10
  };
  public search: string;
  private filterPipe: FilterPipe = new FilterPipe();
  private orderByPipe: OrderByPipe = new OrderByPipe();
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
    this.titleService.setTitle( this.data.symbol.toUpperCase() + ' Coin - Clusters | Chain Review' );
  }

  ngOnInit() {
    this.resetPagination();
    this.setCurrentTable();
    this.getClustersCount();

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
    for (let i = 0; i < this.pagination.maxPages; i++) {
      this.emptyTable.push( { addr: '&nbsp;', collateral: '', status: '', lastseen: '' });
    }
    this.currentTable = this.emptyTable.slice();
  }
  setPages() {
    if (window.innerWidth <= 415) {
      this.pagination.maxPages = 5;
    } else {
      this.pagination.maxPages = 10;
    }
    this.pagination.pages = Math.ceil(this.total / this.pagination.limit);
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
    if (this.gettingClusters) { return; }
    if (this.pagination.current < this.pagination.pages) {
      this.pagination.current++;
      this.getClusters();
    }
    if (this.pagination.end < this.pagination.pages && this.pagination.current > Math.floor(this.pagination.maxPages / 2)) {
      this.pagination.start++;
      this.pagination.end++;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  prevPage() {
    if (this.gettingClusters) { return; }
    if (this.pagination.current > 1) {
      this.pagination.current--;
      this.getClusters();
    }
    if (this.pagination.start > 1 && this.pagination.current < this.pagination.pages - Math.ceil(this.pagination.maxPages / 2)) {
      this.pagination.start--;
      this.pagination.end--;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  setPage(page) {
    if (this.gettingClusters) { return; }
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
    this.getClusters();
  }

  getClustersCount() {
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getClustersCount';
    this.http.post(url, {}).subscribe(
      (response: any) => {
        if (!response.err) {
          this.total = response.data;
          this.getClusters();
        }
        this.gettingClusters = false;
        this.setPages();
      },
      (error) => {
        console.log(error);
        this.gettingClusters = false;
      }
    );
  }

  getClusters() {
    this.gettingClusters = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getClusters';
    const data = {
      limit : this.pagination.limit,
      offset : this.pagination.offset,
    };
    this.http.post(url, data).subscribe(
      (response: any) => {
        if (!response.err) {
          this.clusters = response.data;
          this.currentTable = this.emptyTable.slice();
          for (let i = 0; i < this.clusters.length; i++) {
            this.currentTable[i] = this.clusters[i];
          }
        }
        if (!this.showPagination) {
          this.showPagination = true;
        }
        this.gettingClusters = false;
        this.setPages();
      },
      (error) => {
        console.log(error);
        this.gettingClusters = false;
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

  setOrderBy(orderBy: string) {
    if (orderBy != this.orderBy) {
      this.orderBy = orderBy;
      this.orderByOrder = '-';
    } else {
      if (this.orderByOrder == '-') {
        this.orderByOrder = '+';
      } else {
        this.orderByOrder = '-';
      }
    }
    console.log(this.orderByOrder + this.orderBy);
  }

}

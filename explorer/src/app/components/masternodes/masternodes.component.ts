import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterPipe} from "../../pipes/filter/filter.pipe";
import {OrderByPipe} from "../../pipes/orderBy/order-by.pipe";
import {Title} from "@angular/platform-browser";

declare var DATA: any;
@Component({
  selector: 'app-masternodes',
  templateUrl: './masternodes.component.html',
  styleUrls: ['./masternodes.component.less']
})
export class MasternodesComponent implements OnInit {

  public data;
  public input = '';
  public masternodes: any[] = [];
  public masternodesCollateralCount: any[] = [];
  public emptyTable: any[] = [];
  public currentTable: any[] = [];
  public gettingMasternodes = false;
  public gettingMasternodesCollateralCount = false;
  public orderBy: string = 'lastseen';
  public orderByOrder: string = '-';
  public pagination: any = {
    current: 1,
    start: 1,
    end: 10,
    pages: 0,
    maxPages: 10,
    offset: 0,
    limit: 10
  }
  public search: string;
  private filterPipe: FilterPipe = new FilterPipe();
  private orderByPipe: OrderByPipe = new OrderByPipe();
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
    this.titleService.setTitle( this.data.wallet.replace('dogecash', 'dogec').toUpperCase() + ' Network - Masternodes | Chain Review' );
  }

  ngOnInit() {
    this.setCurrentTable();
    this.getMasternodesCollateralCount();
    this.getBlocks();

  }

  setPages() {
    if(window.innerWidth <= 415) {
      this.pagination.maxPages = 5;
    } else {
      this.pagination.maxPages = 10;
    }
    this.pagination.pages = Math.ceil(this.filterMasternodes().length / this.pagination.limit);
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
    for(var i = 0; i < this.pagination.maxPages; i++) {
      this.emptyTable.push( { "addr": "&nbsp;", "collateral": "", "status": "", "lastseen": "" });
    }
    this.currentTable = this.emptyTable.slice();
  }
  nextPage() {
    if(this.gettingMasternodes) return;
    if(this.pagination.current < this.pagination.pages) {
      this.pagination.current++;
      // this.getBlocks();
      this.getNextBlocks();
    }
    if(this.pagination.end < this.pagination.pages && this.pagination.current > Math.floor(this.pagination.maxPages / 2)) {
      this.pagination.start++;
      this.pagination.end++;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  prevPage() {
    if(this.gettingMasternodes) return;
    if(this.pagination.current > 1) {
      this.pagination.current--;
      // this.getBlocks();
      this.getNextBlocks();
    }
    if(this.pagination.start > 1 && this.pagination.current < this.pagination.pages - Math.ceil(this.pagination.maxPages / 2)) {
      this.pagination.start--;
      this.pagination.end--;
    }
    this.pagination.offset = (this.pagination.current - 1);
  }

  setPage(page) {
    if(this.gettingMasternodes) return;
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
    this.getNextBlocks()
  }

  getBlocks() {
    this.gettingMasternodes = true;
    let url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/listMasternodes/0';
    console.log('url', url)
    this.http.get(url).subscribe(
      (response: any) => {
        if(!response.err) {
          this.masternodes = response.data;
          this.currentTable = this.emptyTable.slice();
          for (var i = 0; i < this.masternodes.length; i++) {
            this.currentTable[i] = this.masternodes[i];
          }
        }
        this.gettingMasternodes = false;
        this.setPages();
      },
      (error) => {
        console.log(error)
        this.gettingMasternodes = false;
      }
    )
  }
  getNextBlocks() {
    this.currentTable = this.emptyTable.slice();
    for(var i = 0; i< this.currentTable.length; i++) {
      if(this.masternodes[(this.pagination.current - 1) * this.pagination.limit + i]) {
        this.currentTable[i] = this.masternodes[(this.pagination.current - 1) * this.pagination.limit + i];
      }
    }
  }

  getMasternodesCollateralCount() {
    this.gettingMasternodesCollateralCount = true;
    let url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/masternodesCollateralCount';
    console.log('url', url)
    this.http.get(url).subscribe(
      (response: any) => {
        if(!response.err) {
          this.masternodesCollateralCount = response.data;
          console.log(this.masternodesCollateralCount);
        }
        this.gettingMasternodesCollateralCount = false;
      },
      (error) => {
        console.log(error)
        this.gettingMasternodesCollateralCount = false;
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

  filterMasternodes() {
    var a = this.orderByPipe.transform(this.masternodes, this.orderByOrder + this.orderBy);
    var b = this.filterPipe.transform(a, this.search, ['addr','collateral','status'])
    return b;
  }

  setOrderBy(orderBy: string) {
    if(orderBy != this.orderBy) {
      this.orderBy = orderBy;
      this.orderByOrder = '-';
    } else {
      if (this.orderByOrder == '-') {
        this.orderByOrder = '+'
      } else {
        this.orderByOrder = '-';
      }
    }
    console.log(this.orderByOrder + this.orderBy)
  }

}

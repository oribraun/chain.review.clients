import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.less']
})
export class ClusterComponent implements OnInit {

  public data;
  public addresses: any[] = [];
  public emptyTable: any[] = [];
  public currentTable: any[] = [];
  public clusterDetails: any;
  public clusterId: string;
  public gettingClusterTxs = false;
  public gettingClusterDetails = false;
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
      this.clusterId = params.clusterId;
      this.resetPagination();
      this.setCurrentTable();
      this.getClusterDetails();
    });
    this.titleService.setTitle( this.data.symbol.toUpperCase() + ' Coin - Address ' + this.clusterId + ' | Chain Review' );
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
    this.pagination.pages = Math.ceil(this.clusterDetails.address_count / this.pagination.limit);
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
    if (this.gettingClusterTxs) { return; }
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
    if (this.gettingClusterTxs) { return; }
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
    if (this.gettingClusterTxs) { return; }
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
    this.gettingClusterTxs = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getClusterAddresses';
    console.log('url', url);
    const data = {
      clusterId : this.clusterId,
      limit : this.pagination.limit,
      offset : this.pagination.offset,
    };
    this.http.post(url, data).subscribe(
      (response: any) => {
        if (!response.err) {
          this.addresses = response.data;
          this.currentTable = this.emptyTable.slice();
          for (let i = 0; i < this.addresses.length; i++) {
            this.currentTable[i] = this.addresses[i];
          }
        }
        if (!this.showPagination) {
          this.showPagination = true;
        }
        this.gettingClusterTxs = false;
      },
      (error) => {
        console.log(error);
        this.gettingClusterTxs = false;
      }
    );
  }

  getClusterDetails() {
    this.gettingClusterDetails = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getClusterDetails';
    console.log('url', url);
    this.http.post(url, {clusterId: this.clusterId}).subscribe(
      (response: any) => {
        if (!response.err) {
          this.clusterDetails = response.data;
          this.titleService.setTitle( this.data.symbol.toUpperCase() + ' Coin - Address ' + this.clusterDetails._id + ' | Chain Review' );
          this.getAddressTxList();
        } else {
          if (response.errMessage === 'no address found') {
            this.router.navigateByUrl('/');
          }
        }
        this.setPages();
        this.gettingClusterDetails = false;
      },
      (error) => {
        console.log(error);
        this.gettingClusterDetails = false;
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

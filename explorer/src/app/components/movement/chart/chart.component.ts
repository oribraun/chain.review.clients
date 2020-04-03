import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

declare var DATA: any;

@Component({
  selector: 'movement-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less']
})
export class MovementChartComponent implements OnInit {
  public data: any;
  public gettingTxsChart = false;
  public httpData: any = [];
  public chartData: any = [];
  public chartType: string;
  private http: HttpClient;
  public options: any;
  constructor(http: HttpClient) {
    this.http = http;
    let data: any = {}; /// from server node ejs data
    if (typeof (window as any).DATA !== 'undefined') {
      data = (window as any).DATA;
    }
    // console.log(data);
    this.data = data;
    this.setChart('Transactions', false);
  }

  ngOnInit(): void {
    this.getTransactionsChart();
  }

  getTransactionsChart() {
    this.gettingTxsChart = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getTransactionsChart';
    this.http.post(url, {}).subscribe(
      (response: any) => {
        if (!response.err) {
          this.httpData = response.data;
          this.setTransactionChartData();
          // console.log(response.data);
        }
        this.gettingTxsChart = false;
      },
      (error) => {
        console.log(error);
        this.gettingTxsChart = false;
      }
    );
  }

  setTransactionChartData() {
    this.chartData = this.httpData.map((obj) => ([ new Date(obj.d).getTime(), obj.c]));
    if (this.chartType !== 'Transactions') {
      this.setChart('Transactions', true);
    }
  }

  setAmountChartData() {
    this.chartData = this.httpData.map((obj) => ([ new Date(obj.d).getTime(), (obj.t / 100000000).toFixed(1)]));
    console.log('this.chartData', this.chartData);
    if (this.chartType !== 'Amount') {
      this.setChart('Amount', true);
    }
  }

  setChart(chartName, setChartType) {
    if(setChartType) {
      this.chartType = chartName;
    }
    this.options = {
      series: [
        {
          name: chartName,
          data: this.chartData
        }
      ],
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: '',
          tools: {
            customIcons: [
              {
                // icon: '<i class="fa fa-dollar"></i>',
                icon: '<span class="">Amount</span> ',
                index: -7,
                class: 'apexcharts-custom-icon-button apexcharts-custom-icon-button-amount',
                title: 'Amount chart',
                click: (chart, options, e) => {
                  this.setAmountChartData();
                },
              },
              {
                // icon: '<i class="fa fa-dollar"></i>',
                icon: '<span class="">Transactions</span> ',
                index: -8,
                class: 'apexcharts-custom-icon-button apexcharts-custom-icon-button-transactions',
                title: 'Transactions chart',
                click: (chart, options, e) => {
                  this.setTransactionChartData();
                },
              }
            ]
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        // curve: 'stepline',
        // show?: boolean;
        // curve?: "smooth" | "straight" | "stepline";
        // lineCap?: "butt" | "square" | "round";
        // colors?: string[];
        // width?: number | number[];
        // dashArray?: number | number[];
      },
      markers: {
        size: 0,
        hover: {
          size: 4
        }
      },
      colors: ['#212529'],
      title: {
        text: chartName + ' Movement',
        align: 'left'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        }
      },
      yaxis: {
        labels: {
          formatter: (val) => {
            return (val).toFixed(0);
          }
        },
        title: {
          text: chartName
        }
      },
      xaxis: {
        type: 'datetime'
      },
      tooltip: {
        shared: false,
        y: {
          formatter: (val) => {
            return (val);
          }
        }
      },
      noData: {
        // text: 'Loading...'
      }
    };
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

declare var DATA: any;

@Component({
  selector: 'address-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less']
})
export class AddressChartComponent implements OnInit {
  public data: any;
  public gettingAddressChart = false;
  public httpData: any = [];
  public chartData: any = [];
  public chartType: string;
  public chartsAvaliable: any = {};
  private http: HttpClient;
  public options: any;
  @Input('addr') currentAddress: any;
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
    this.gettingAddressChart = true;
    const url = window.location.origin + '/explorer-api/db/' + this.data.wallet + '/getAddressTxChart';
    this.http.post(url, {address: this.currentAddress}).subscribe(
      (response: any) => {
        if (!response.err) {
          this.httpData = response.data;
          const sent = this.httpData.filter((obj1) => (obj1.totalSentADay));
          const received = this.httpData.filter((obj1) => (obj1.totalReceivedADay));
          this.chartsAvaliable = {
            sent: sent.length,
            received: received.length,
          }
          this.setTransactionChartData();
          console.log('this.httpData', this.httpData);
        }
        this.gettingAddressChart = false;
      },
      (error) => {
        console.log(error);
        this.gettingAddressChart = false;
      }
    );
  }

  setTransactionChartData() {
    this.chartData = this.httpData.map((obj) => ([ new Date(obj.date).getTime(), obj.count]));
    console.log(this.chartData);
    if (this.chartType !== 'Transactions') {
      this.setChart('Transactions', true);
    }
  }

  setSentAmountChartData() {
    this.chartData = this.httpData.filter((obj1) => (obj1.totalSentADay)).map((obj) => ([ new Date(obj.date).getTime(), (obj.totalSentADay / 100000000).toFixed(1)]));
    if (this.chartType !== 'Sent') {
      this.setChart('Sent', true);
    }
  }

  setReceivedAmountChartData() {
    this.chartData = this.httpData.filter((obj1) => (obj1.totalReceivedADay)).map((obj) => ([ new Date(obj.date).getTime(), (obj.totalReceivedADay / 100000000).toFixed(1)]));
    if (this.chartType !== 'Received') {
      this.setChart('Received', true);
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
            customIcons: []
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
        text: chartName,
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

    if(this.chartsAvaliable.received > 0) {
      if(this.chartsAvaliable.received === 1) {
        this.options.markers.size = 4;
      }
      this.options.chart.toolbar.tools.customIcons.push(
        {
          icon: '<span class="">Received</span> ',
          index: -8,
          class: 'apexcharts-custom-icon-button apexcharts-custom-icon-button-received',
          title: 'Received chart',
          click: (chart, options, e) => {
            this.setReceivedAmountChartData();
          },
        }
      );
    }
    if(this.chartsAvaliable.sent > 0) {
      this.options.chart.toolbar.tools.customIcons.push(
        {
          icon: '<span class="">Sent</span> ',
          index: -9,
          class: 'apexcharts-custom-icon-button apexcharts-custom-icon-button-sent',
          title: 'Sent chart',
          click: (chart, options, e) => {
            this.setSentAmountChartData();
          },
        }
      );
    }
    this.options.chart.toolbar.tools.customIcons.push(
      {
        icon: '<span class="">Transactions</span> ',
        index: -10,
        class: 'apexcharts-custom-icon-button apexcharts-custom-icon-button-transactions',
        title: 'Transactions chart',
        click: (chart, options, e) => {
          this.setTransactionChartData();
        },
      }
    );
    if (this.chartsAvaliable.sent === 1 && this.chartType === 'SENT') {
      this.options.markers.size = 4;
    }
    if (this.chartsAvaliable.received === 1 && this.chartType === 'Received') {
      this.options.markers.size = 4;
    }
  }
}

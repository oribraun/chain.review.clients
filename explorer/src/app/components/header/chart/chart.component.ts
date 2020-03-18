import {Component} from "@angular/core";

const mockedData = {
  currency: "USD",
  x: ["21-02-2020", "22-02-2020", "23-02-2020", "24-02-2020", "25-02-2020", "26-02-2020", "27-02-2020", "28-02-2020", "29-02-2020"],
  y: [0.0007, 0.00071, 0.0007, 0.0006, 0.00041, 0.0004, 0.0004, 0.00034, 0.000378],
};

@Component({
  selector: "header-chart",
  templateUrl: "./chart.component.html",
})
export class HeaderChartComponent {
  public options = {
    series: [{
      name: mockedData.currency,
      data: mockedData.y,
    }],
    chart: {
      height: 120,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false,
      },
      offsetY: -12,
    },
    colors: ["#212529"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: [2],
    },
    grid: {
      show: true,
      borderColor: "#eaebf1",
    },
    xaxis: {
      categories: mockedData.x,
      labels: {
        show: false,
      },
      tickAmount: 3,
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 2,
    },
  };
}

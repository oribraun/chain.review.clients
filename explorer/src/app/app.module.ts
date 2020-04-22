import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { RangePipe } from './pipes/range/range.pipe';
import { PrettyTimePipe } from './pipes/prettyTime/pretty-time.pipe';
import { HeaderComponent } from './components/header/header.component';
import { TxComponent } from './components/tx/tx.component';
import { BlockComponent } from './components/block/block.component';
import { AddressComponent } from './components/address/address.component';
import { RichlistComponent } from './components/richlist/richlist.component';
import { MasternodesComponent } from './components/masternodes/masternodes.component';
import { FilterPipe } from './pipes/filter/filter.pipe';
import { MovementComponent } from './components/movement/movement.component';
import { ApiComponent } from './components/api/api.component';
import { PrettyDaysHoursMinutesPipe } from './pipes/prettyDaysHoursMinutes/pretty-days-hours-minutes.pipe';
import { OrderByPipe } from './pipes/orderBy/order-by.pipe';
import { MarketComponent } from './components/market/market.component';
import { ToFixedPipe } from './pipes/toFixed/to-fixed.pipe';
import { InfoBarComponent } from './components/header/info-bar/info-bar.component';
import { HeaderChartComponent } from './components/header/chart/chart.component';
import { MaxAfterDotPipe } from './pipes/maxAfterDot/max-after-dot.pipe';
import { MovementChartComponent } from './components/movement/chart/chart.component';
import { AddressChartComponent } from './components/address/chart/chart.component';
import { ClustersComponent } from './components/clusters/clusters.component';
import { ClusterComponent } from './components/cluster/cluster.component';

@NgModule({
  declarations: [
    AppComponent,
    BlocksComponent,
    RangePipe,
    PrettyTimePipe,
    HeaderComponent,
    InfoBarComponent,
    HeaderChartComponent,
    TxComponent,
    BlockComponent,
    AddressComponent,
    RichlistComponent,
    MasternodesComponent,
    FilterPipe,
    MovementComponent,
    ApiComponent,
    PrettyDaysHoursMinutesPipe,
    OrderByPipe,
    MarketComponent,
    ToFixedPipe,
    MaxAfterDotPipe,
    MovementChartComponent,
    AddressChartComponent,
    ClustersComponent,
    ClusterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgApexchartsModule,
  ],
  providers: [],
  exports: [
    PrettyTimePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

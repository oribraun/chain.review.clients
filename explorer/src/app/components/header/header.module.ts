import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";

import {HeaderComponent} from "./header.component";
import {InfoBarComponent} from "./info-bar/info-bar.component";
import {HeaderChartComponent} from "./chart/chart.component";
import {AppRoutingModule} from "../../app-routing.module";

@NgModule({
  declarations: [
    HeaderComponent,
    InfoBarComponent,
    HeaderChartComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  exports: [
    HeaderComponent,
  ],
})
export class HeaderModule { }

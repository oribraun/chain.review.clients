import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { StatsWidgetComponent } from '../stats-widget-component/stats-widget.component';

@NgModule({
  declarations: [
    StatsWidgetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  entryComponents: [ StatsWidgetComponent ],
  // bootstrap: [TwinsCoinListWidgetComponent]
})
export class AppModule {
    constructor(private injector: Injector) { }

    ngDoBootstrap() {
        const myCustomElement = createCustomElement(StatsWidgetComponent, { injector: this.injector });
        if (!customElements.get('stats-widget')) {
            customElements.define('stats-widget', myCustomElement);
        }
    }
}

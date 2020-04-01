import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BlocksComponent} from './components/blocks/blocks.component';
import {TxComponent} from './components/tx/tx.component';
import {BlockComponent} from './components/block/block.component';
import {AddressComponent} from './components/address/address.component';
import {RichlistComponent} from './components/richlist/richlist.component';
import {MasternodesComponent} from './components/masternodes/masternodes.component';
import {MovementComponent} from './components/movement/movement.component';
import {ApiComponent} from './components/api/api.component';
import {MarketComponent} from './components/market/market.component';


const routes: Routes = [
  { path: '', component: BlocksComponent, pathMatch: 'full' },
  { path: 'block/:hash', component: BlockComponent },
  { path: 'tx/:hash', component: TxComponent },
  { path: 'address/:address', component: AddressComponent },
  { path: 'addresses', component: RichlistComponent },
  { path: 'masternodes', component: MasternodesComponent },
  { path: 'transactions', component: MovementComponent },
  { path: 'api', component: ApiComponent },
  { path: 'market', component: MarketComponent },
  // { path: 'market/:symbol', component: MarketComponent },
  { path: '**', redirectTo: '' },
  // { path: 'login', component: LoginComponent },
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { enableTracing: true, useHash: true })],
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

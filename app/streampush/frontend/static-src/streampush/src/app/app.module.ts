import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RestreamsComponent } from './restreams/restreams.component';
import { EndpointSelectorComponent } from './endpoint-selector/endpoint-selector.component';
import { StreamStatsComponent } from './stream-stats/stream-stats.component';
import { BackendStatsComponent } from './backend-stats/backend-stats.component';
import { SetupComponent } from './setup/setup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RestreamsComponent,
    EndpointSelectorComponent,
    StreamStatsComponent,
    BackendStatsComponent,
    SetupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
    }),
    FormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
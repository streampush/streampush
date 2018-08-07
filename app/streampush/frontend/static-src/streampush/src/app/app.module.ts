import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RestreamsComponent } from './restreams/restreams.component';
import { EndpointSelectorComponent } from './endpoint-selector/endpoint-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RestreamsComponent,
    EndpointSelectorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
    }),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
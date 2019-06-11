// import { BrowserModule } from '@angular/platform-browser';
import {NoopAnimationsModule, BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { SuiModule } from 'ng2-semantic-ui';
import { CommonModule } from '@angular/common';
import { CoreModule, UserService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { PublicModule } from '@sunbird/public';
import { TelemetryModule } from '@sunbird/telemetry';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { BootstrapFramework, WebExtensionModule } from '@project-sunbird/web-extensions';
import { WebExtensionsConfig, PluginModules } from './framework.config';
import { CacheService } from 'ng2-cache-service';
import { CacheStorageAbstract } from 'ng2-cache-service/dist/src/services/storage/cache-storage-abstract.service';
import { CacheSessionStorage } from 'ng2-cache-service/dist/src/services/storage/session-storage/cache-session-storage.service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { TenantResolverService } from './modules/public/services/TenantResolver/tenant-resolver.service';
import { SharedTenantResolverService } from './modules/shared/services/tenant-resolver/shared-tenant-resolver.service';

export const tenantInfoProviderFactory = (provider: SharedTenantResolverService) => () => {
  /* if (performance.navigation.type === 1) {
    localStorage.setItem('reload', JSON.stringify(true));
    return provider.reloadInfo();
   } else {
    localStorage.setItem('no reload', JSON.stringify(false));
    return;
   } */
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule.forRoot(),
    CommonModule,
    // BrowserModule,
    NoopAnimationsModule,
    HttpClientModule,
    SuiModule,
    SharedModule.forRoot(),
    Ng2IziToastModule,
    WebExtensionModule.forRoot(),
    TelemetryModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    PublicModule,
    SharedFeatureModule,
    ...PluginModules,
    AppRoutingModule // don't add any module below this because it contains wildcard route
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    SharedTenantResolverService,
    {provide : APP_INITIALIZER, useFactory: tenantInfoProviderFactory, deps: [SharedTenantResolverService], multi: true},
    CacheService,
    { provide: CacheStorageAbstract, useClass: CacheSessionStorage },
  ]
})
export class AppModule {
  constructor(bootstrapFramework: BootstrapFramework) {
    bootstrapFramework.initialize(WebExtensionsConfig);
  }
}

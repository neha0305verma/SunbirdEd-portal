
import { environment } from '@sunbird/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TelemetryService, ITelemetryContext } from '@sunbird/telemetry';
import {
  UtilService, ResourceService, ToasterService, IUserData, IUserProfile,
  NavigationHelperService, ConfigService, BrowserCacheTtlService
} from '@sunbird/shared';
import { Component, HostListener, OnInit, ViewChild, Input } from '@angular/core';
import { TenantResolverService } from '../app/modules/public/services/TenantResolver/tenant-resolver.service';
import { SharedTenantResolverService } from './modules/shared/services/tenant-resolver/shared-tenant-resolver.service';
import { UserService, PermissionService, CoursesService, TenantService, OrgDetailsService, DeviceRegisterService } from '@sunbird/core';
import * as _ from 'lodash';
import { ProfileService } from '@sunbird/profile';
import { Observable, of, throwError, combineLatest } from 'rxjs';
import { first, filter, mergeMap, tap, map, take } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import {CookieManagerService} from './modules/shared/services/cookie-manager/cookie-manager.service';

const fingerPrint2 = new Fingerprint2();

/**
 * main app component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('frameWorkPopUp') frameWorkPopUp;
  /**
   * user profile details.
   */
  private userProfile: IUserProfile;
  /**
   * user to load app after fetching user/org details.
   */
  public initApp = false;
  /**
   * stores organization details for Anonymous user.
   */
  private orgDetails: any;
  /**
   * this variable is used to show the FrameWorkPopUp
   */
  public showFrameWorkPopUp = false;

  /**
   * this variable is used to show the terms and conditions popup
   */
  public showTermsAndCondPopUp = false;

  /**
   * Used to fetch tenant details and org details for Anonymous user. Possible values
   * 1. url slug param will be slug for Anonymous user
   * 2. user profile rootOrg slug for logged in
   */
  private slug: string;
  /**
   * Used to config telemetry service and device register api. Possible values
   * 1. org hashtag for Anonymous user
   * 2. user profile rootOrg hashtag for logged in
   */
  private channel: string;
  recievedContent = true;
  theme = false;
  /**
   * constructor
   */
  /**
  * Variable to show popup to install the app
  */
  showAppPopUp = false;
  viewinBrowser = false;
  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    public userService: UserService, private navigationHelperService: NavigationHelperService,
    private permissionService: PermissionService, public resourceService: ResourceService,
    private deviceRegisterService: DeviceRegisterService, private courseService: CoursesService, private tenantService: TenantService,
    private telemetryService: TelemetryService, public router: Router, private configService: ConfigService,
    private orgDetailsService: OrgDetailsService, private activatedRoute: ActivatedRoute,
    private profileService: ProfileService, private toasterService: ToasterService, public utilService: UtilService,
    private mockservice: TenantResolverService, private sharedTenant: SharedTenantResolverService,
     private cookieSrvc: CookieManagerService) {
  }
  /**
   * dispatch telemetry window unload event before browser closes
   * @param  event
   */
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    this.telemetryService.syncEvents();
  }
  ngOnInit() {

    /* 1. check if user is logged in or not
          1.1 if user is logged in
            1.1.1 check whether the user is from the same domain or not
                1.1.1.1 if the user is from the same domain, load the theme
                1.1.1.2 if the user is not from same domain,
                      1.1.1.2.1 get the user specific theme and load the theme

          1.2 if user is not logged in
            1.2.1 check if the user came from logout or not
                1.2.1.1 if user came from logout, load the theme
                1.2.1.1 if user did not came from logout, update the theme based on url
    */
   this.sharedTenant.getTenantInfo().subscribe(themeData => {
     if ( !!themeData['value'] || (typeof themeData === 'boolean' && !!themeData)) {
      this.theme = true;
     } else if (_.isString(themeData)) {
       // console.log('object data recorded', themeData);
        if (!!themeData) {
          const loggedUserOrgID = themeData;
          if (loggedUserOrgID['length'] < 0) {
            // did not find any cookie storing the orgId, load the default one
            // console.log('did not recieve user id in loggedUserOrgID variable');
            this.theme = false;
            this.recievedContent = false;
            console.log('did not recieve any organization id for logged in user');
          } else {
            // a user from different domain may have logged in
            this.sharedTenant.compareUser(loggedUserOrgID).subscribe( response => {

              if (!!!response) {

                this.mockservice.getMockDataonID(loggedUserOrgID).pipe(take(1)).subscribe( newThemeData => {
                  if (newThemeData) {
                    this.cookieSrvc.setCookie('theming', JSON.stringify(newThemeData));
                    // now update the theme with new data
                    this.sharedTenant._tenantData = JSON.parse(this.cookieSrvc.getCookie('theming'));
                    this.sharedTenant.updateTheme();
                    this.sharedTenant.tenantData$.next(this.sharedTenant._tenantData);
                    this.theme = true;
                  }
                }, err => {
                  this.theme = false;
                  this.recievedContent = false;
                  console.log('An error occured while retreiving the tenant data according to the user id');
                  console.log(err);
                });
              } else {
                this.theme = true;
              }
            }, err => {
              this.theme = false;
              this.recievedContent = false;
              console.log('An error occured while getting org id of logged in user');
            });
          }
        }
      } else {
        this.theme = false;
        this.recievedContent = false;
        console.log('Recieved neither boolean nor string(orgID) in the observable');
      }
     }, err => {
     this.theme = false;
     this.recievedContent = false;
     console.log('Error occured while subscribing the getTenantInfo');
     console.log(err);
   });


    this.resourceService.initialize();

    combineLatest(this.setSlug(), this.setDeviceId()).pipe(
      mergeMap(data => {
        this.navigationHelperService.initialize();
        this.userService.initialize(this.userService.loggedIn);
        if (this.userService.loggedIn) {
          this.permissionService.initialize();
          this.courseService.initialize();
          return this.setUserDetails();
        } else {
          return this.setOrgDetails();
        }
      }))
      .subscribe(data => {
        this.tenantService.getTenantInfo(this.slug);
        this.setPortalTitleLogo();
        this.telemetryService.initialize(this.getTelemetryContext());
        this.deviceRegisterService.registerDevice(this.channel);
        this.checkTncAndFrameWorkSelected();
        this.initApp = true;
      }, error => {
        this.initApp = true;
      });
  }

  /**
   * checks if user has accepted the tnc and show tnc popup.
   */
  public checkTncAndFrameWorkSelected() {
    if (_.has(this.userProfile, 'promptTnC') && _.has(this.userProfile, 'tncLatestVersion') &&
      _.has(this.userProfile, 'tncLatestVersion') && this.userProfile.promptTnC === true) {
      this.showTermsAndCondPopUp = true;
    } else {
      this.checkFrameworkSelected();
    }
  }

  /**
   * checks if user has selected the framework and shows popup if not selected.
   */
  public checkFrameworkSelected() {
    const frameWorkPopUp: boolean = this.cacheService.get('showFrameWorkPopUp');
    if (frameWorkPopUp) {
      this.showFrameWorkPopUp = false;
    } else {
      if (this.userService.loggedIn && _.isEmpty(_.get(this.userProfile, 'framework'))) {
        this.showFrameWorkPopUp = true;
      }
    }
  }

  /**
   * once tnc is accpeted from tnc popup on submit this function is triggered
   */
  public onAcceptTnc() {
    this.showTermsAndCondPopUp = false;
    this.checkFrameworkSelected();
  }

  /**
   * fetch device id using fingerPrint2 library.
   */
  public setDeviceId(): Observable<string> {
    return new Observable(observer => fingerPrint2.get((deviceId) => {
      (<HTMLInputElement>document.getElementById('deviceId')).value = deviceId;
      observer.next(deviceId);
      observer.complete();
    }));
  }
  /**
   * set slug from url only for Anonymous user.
   */
  private setSlug(): Observable<string> {
    if (this.userService.loggedIn) {
      return of(undefined);
    } else {
      return this.router.events.pipe(filter(event => event instanceof NavigationEnd), first(),
        map(data => this.slug = _.get(this.activatedRoute, 'snapshot.root.firstChild.params.slug')));
    }
  }
  /**
   * set user details for loggedIn user.
   */
  private setUserDetails(): Observable<any> {
    return this.userService.userData$.pipe(first(),
      mergeMap((user: IUserData) => {
        if (user.err) {
          return throwError(user.err);
        }
        this.userProfile = user.userProfile;
        this.slug = _.get(this.userProfile, 'rootOrg.slug');
        this.channel = this.userService.hashTagId;
        return of(user.userProfile);
      }));
  }
  /**
   * set org Details for Anonymous user.
   */
  private setOrgDetails(): Observable<any> {
    // // console.log('slug', this.slug);
    return this.orgDetailsService.getOrgDetails(this.slug).pipe(
      tap(data => {
        this.orgDetails = data;
        this.channel = this.orgDetails.hashTagId;
      })
    );
  }
  /**
   * returns telemetry context based on user loggedIn
   */
  private getTelemetryContext(): ITelemetryContext {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    if (this.userService.loggedIn) {
      return {
        userOrgDetails: {
          userId: this.userProfile.userId,
          rootOrgId: this.userProfile.rootOrgId,
          rootOrg: this.userProfile.rootOrg,
          organisationIds: this.userProfile.hashTagIds
        },
        config: {
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.configService.appConfig.TELEMETRY.PID
          },
          endpoint: this.configService.urlConFig.URLS.TELEMETRY.SYNC,
          apislug: this.configService.urlConFig.URLS.CONTENT_PREFIX,
          host: '',
          uid: this.userProfile.userId,
          sid: this.userService.sessionId,
          channel: _.get(this.userProfile, 'rootOrg.hashTagId'),
          env: 'home',
          enableValidation: environment.enableTelemetryValidation
        }
      };
    } else {
      return {
        userOrgDetails: {
          userId: 'anonymous',
          rootOrgId: this.orgDetails.rootOrgId,
          organisationIds: [this.orgDetails.hashTagId]
        },
        config: {
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.configService.appConfig.TELEMETRY.PID
          },
          batchsize: 2,
          endpoint: this.configService.urlConFig.URLS.TELEMETRY.SYNC,
          apislug: this.configService.urlConFig.URLS.CONTENT_PREFIX,
          host: '',
          uid: 'anonymous',
          sid: this.userService.anonymousSid,
          channel: this.orgDetails.hashTagId,
          env: 'home',
          enableValidation: environment.enableTelemetryValidation
        }
      };
    }
  }
  /**
   * set app title and favicon after getting tenant data
   */
  private setPortalTitleLogo(): void {
    this.tenantService.tenantData$.subscribe(data => {
      if (!data.err) {
        document.title = this.userService.rootOrgName || data.tenantData.titleName;
        document.querySelector('link[rel*=\'icon\']').setAttribute('href', data.tenantData.favicon);
      }
    });
  }
  /**
   * updates user framework. After update redirects to library
   */
  public updateFrameWork(event) {
    const req = {
      framework: event
    };
    this.profileService.updateProfile(req).subscribe(res => {
      this.frameWorkPopUp.modal.deny();
      this.showFrameWorkPopUp = false;
      this.utilService.toggleAppPopup();
      this.showAppPopUp = this.utilService.showAppPopUp;
    }, err => {
      this.toasterService.warning(this.resourceService.messages.emsg.m0012);
      this.frameWorkPopUp.modal.deny();
      this.router.navigate(['/learn']);
      this.cacheService.set('showFrameWorkPopUp', 'installApp');
    });
  }
  viewInBrowser() {
    this.router.navigate(['/learn']);
  }
  closeIcon() {
    this.showFrameWorkPopUp = false;
    this.cacheService.set('showFrameWorkPopUp', 'installApp');
  }
}

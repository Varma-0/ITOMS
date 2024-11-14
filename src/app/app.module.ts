import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { SidebarComponent } from './components/layouts/sidebar/sidebar.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard/dashboard.component';
import { AnalyticsComponent } from './components/pages/dashboard/analytics/analytics.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TerminalComponent } from './components/pages/table/terminal/terminal.component';
import { WebAnalyticsComponent } from './components/charts/web-analytics/web-analytics.component';
import { EmailSendComponent } from './components/charts/email-send/email-send.component';
import { TrafficSourceComponent } from './components/charts/traffic-source/traffic-source.component';
import { BasicLineChartComponent } from './components/charts/basic-line-chart/basic-line-chart.component';
import { DashedLineComponent } from './components/charts/dashed-line/dashed-line.component';
import { AreaDatetimeXAxisComponent } from './components/charts/area-datetime-x-axis/area-datetime-x-axis.component';
import { MultipleRadialbarComponent } from './components/charts/multiple-radialbar/multiple-radialbar.component';
import { RadialbarSemiCircularGaugeComponent } from './components/charts/radialbar-semi-circular-gauge/radialbar-semi-circular-gauge.component';
import { LandingComponent } from './landing/dashboard/dashboard.component';
import { LandingFooterComponent } from './landing/layouts/footer/footer.component';
import { LandingHeaderComponent } from './landing/layouts/header/header.component';
import { LandingNavbarComponent } from './landing/layouts/navbar/navbar.component';
import { DLogInComponent } from './landing/log-in/log-in.component';
import { AuthInterceptor } from './services/login/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptgroup, MatOption, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatListModule} from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MerchantComponent } from './components/pages/merchant/merchant.component';
import { MatCardModule } from '@angular/material/card';
import { AdministrationComponent } from './components/pages/admin/administration/administration.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RoleComponent } from './components/pages/admin/role/role.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AlertComponent } from './components/pages/admin/alerts/alerts.component';
import { TenantsComponent } from './components/pages/admin/tenants/tenants.component';
import { HierarchyLevelComponent } from './components/pages/admin/hierarchy-level/hierarchy-level.component';
import { MerchantsComponent } from './components/pages/admin/merchants/merchants.component';
import { ConfirmDeleteDialogComponent } from './components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { SchedulingComponent } from './components/pages/table/scheduling/scheduling.component';
import { FlyparametersComponent } from './components/pages/table/flyparameters/flyparameters.component';
import { TerminalViewComponent } from "./components/pages/table/terminal/terminal-view/terminal-view.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MapComponent } from './map.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DesignSelectionComponent } from './components/dialogs/design-selection/design-selection.component';
import { SelectCfgComponent } from './components/dialogs/select-cfg/select-cfg.component';
import { ProfileComponent } from './components/pages/table/profile/profile.component';
import { AddFormComponent } from './components/dialogs/add-form/add-form.component';
import { PackagesComponent } from './components/pages/table/packages/packages.component';
import {MatSliderModule} from '@angular/material/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { DevicesComponent } from './components/pages/device/devices/devices.component';
import { UpdateScheduleComponent } from './components/pages/table/update-schedule/update-schedule.component';
import { GroupComponent } from './components/pages/table/group/group.component';
import { ModelComponent } from './components/pages/device/model/model.component';
import { AddPermissionComponent } from './components/dialogs/add-permission/add-permission.component';
import { ActiveComponent } from './components/dialogs/active/active.component';
import { DevicesFormComponent } from './components/dialogs/device-form/device-form.component';
import { HierarchySelectionComponent } from './components/dialogs/hierarchy-selection/hierarchy-selection.component';
import { HierarchyFormComponent } from './components/dialogs/hierarchy-form/hierarchy-form.component';
import { ReportsDialogComponent } from './components/dialogs/reports/reports.component';
import { HeartReportComponent } from './components/pages/reports/heart/heart.component';
import { SystemReportComponent } from './components/pages/reports/system/system.component';
import { SwapReportComponent } from './components/pages/reports/swap/swap.component';
import { HirerichiesReportComponent } from './components/pages/reports/hirerichies/hirerichies.component';
import { ParametersReportComponent } from './components/pages/reports/parameters/parameters.component';
import { SearchReportComponent } from './components/pages/reports/search/search.component';
import { SoftwareReportComponent } from './components/pages/reports/software/software.component';
import { StatusReportComponent } from './components/pages/reports/status/status.component';
import { BasicLineChart1Component } from './components/charts/basic-line-chart1/basic-line-chart1.component';
import { BasicLineChart2Component } from './components/charts/basic-line-chart2/basic-line-chart2.component';
import { GoogleMapComponent } from './components/pages/table/terminal/google-map/google-map.component';
import { TerminalProfileComponent } from './components/dialogs/terminal-profile/terminal-profile.component';
import { DeploymentModalComponent } from './components/dialogs/deployment-modal/deployment-modal.component';
import { PackageAddComponent } from './components/pages/table/packages/package-add/package-add.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ProfileChartComponent } from './components/charts/profile-chart/profile-chart.component';
import { SettingDialogComponent } from './components/dialogs/setting-dialog/setting-dialog.component';
import { OtpComponent } from './components/dialogs/otp/otp.component';
import { PasswordComponent } from './components/dialogs/password/password.component';
import { ViewTenantComponent } from './components/dialogs/view-tenant/view-tenant.component';
import { ToastrModule } from 'ngx-toastr';
import { ProfilesComponent } from './components/pages/profile/profile.component';
import { ContactComponent } from './landing/contact/contact.component';
import { TerminalChartComponent } from './components/charts/app-terminal-chart/app-terminal.component';
import { GroupProfileComponent } from './components/pages/table/group-profile/group-profile.component';
import { UserComponent } from './components/pages/admin/user/user.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ViewDataComponent } from './components/dialogs/view-data/view-data.component';
import { JsonViewerNodeComponent } from './components/dialogs/json-viewer-node/json-viewer-node.component';
import { JsonViewerComponent } from './components/dialogs/json-viewer/json-viewer.component';
import { TableComponent } from './components/pages/table/table/table.component';
import { FilterPipe } from './components/dialogs/filter.pipe';
import { LoaderComponent } from './components/layouts/loader/loader.component';


@NgModule({
  declarations: [
    AppComponent,
    PasswordComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    AnalyticsComponent,
    OtpComponent,
    TerminalComponent,
    AdministrationComponent,
    UserComponent,
    RoleComponent,
    AlertComponent,
    ReportsDialogComponent,
    HeartReportComponent,
    SystemReportComponent,
    SwapReportComponent,
    HirerichiesReportComponent,
    ParametersReportComponent,
    SearchReportComponent,
    SoftwareReportComponent,
    StatusReportComponent,
    WebAnalyticsComponent,
    EmailSendComponent,
    TrafficSourceComponent,
    BasicLineChartComponent,
    DashedLineComponent,
    BasicLineChart1Component,
    BasicLineChart2Component,
    AreaDatetimeXAxisComponent,
    ContactComponent,
    MultipleRadialbarComponent,
    RadialbarSemiCircularGaugeComponent,
    LandingComponent,
    LandingFooterComponent,
    LandingHeaderComponent,
    LandingNavbarComponent,
    DLogInComponent,
    MerchantComponent,
    TenantsComponent,
    HierarchyLevelComponent,
    MerchantsComponent,
    ConfirmDeleteDialogComponent,
    SchedulingComponent,
    FlyparametersComponent,
    TerminalViewComponent,
    MapComponent,
    DesignSelectionComponent,
    SelectCfgComponent,
    ProfileComponent,
    AddFormComponent,
    PackagesComponent,
    DevicesComponent,
    UpdateScheduleComponent,
    GroupComponent,
    ModelComponent,
    AddPermissionComponent,
    ActiveComponent,
    DevicesFormComponent,
    HierarchySelectionComponent,
    HierarchyFormComponent,
    GoogleMapComponent,
    TerminalProfileComponent,
    DeploymentModalComponent,
    PackageAddComponent,
    ProfileChartComponent,
    SettingDialogComponent,
    ViewTenantComponent,
    TerminalChartComponent,
    ProfilesComponent,
    GroupProfileComponent,
    JsonViewerNodeComponent,
    JsonViewerComponent,
    ViewDataComponent,
    TableComponent,
    FilterPipe,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOption,
    BrowserAnimationsModule,
    MatTableModule,
    MatCardModule,
    MatDialogModule,
    MatToolbarModule,
    MatChipsModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSortModule,
    MatSliderModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSlideToggleModule,
    NgxJsonViewerModule,
    MatProgressBarModule,
    MatProgressSpinner,
    ReactiveFormsModule,
    MultiSelectModule,
    MatStepperModule,
    ToastrModule.forRoot(),
],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

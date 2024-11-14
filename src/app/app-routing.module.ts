import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './components/pages/dashboard/analytics/analytics.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard/dashboard.component';
import { TerminalComponent } from './components/pages/table/terminal/terminal.component';
import { LandingComponent } from './landing/dashboard/dashboard.component';
import { DLogInComponent } from './landing/log-in/log-in.component';
import { MerchantComponent } from './components/pages/merchant/merchant.component';
import { AdministrationComponent } from './components/pages/admin/administration/administration.component';
import { UserComponent } from './components/pages/admin/user/user.component';
import { RoleComponent } from './components/pages/admin/role/role.component';
import { AlertComponent } from './components/pages/admin/alerts/alerts.component';
import { TenantsComponent } from './components/pages/admin/tenants/tenants.component';
import { HierarchyLevelComponent } from './components/pages/admin/hierarchy-level/hierarchy-level.component';
import { MerchantsComponent } from './components/pages/admin/merchants/merchants.component';
import { SchedulingComponent } from './components/pages/table/scheduling/scheduling.component';
import { FlyparametersComponent } from './components/pages/table/flyparameters/flyparameters.component';
import { PackagesComponent } from './components/pages/table/packages/packages.component';
import { DevicesComponent } from './components/pages/device/devices/devices.component';
import { UpdateScheduleComponent } from './components/pages/table/update-schedule/update-schedule.component';
import { GroupComponent } from './components/pages/table/group/group.component';
import { ModelComponent } from './components/pages/device/model/model.component';
import { StatusReportComponent } from './components/pages/reports/status/status.component';
import { HeartReportComponent } from './components/pages/reports/heart/heart.component';
import { SearchReportComponent } from './components/pages/reports/search/search.component';
import { HirerichiesReportComponent } from './components/pages/reports/hirerichies/hirerichies.component';
import { SoftwareReportComponent } from './components/pages/reports/software/software.component';
import { ParametersReportComponent } from './components/pages/reports/parameters/parameters.component';
import { SwapReportComponent } from './components/pages/reports/swap/swap.component';
import { SystemReportComponent } from './components/pages/reports/system/system.component';
import { PackageAddComponent } from './components/pages/table/packages/package-add/package-add.component';
import { ProfilesComponent } from './components/pages/profile/profile.component';
import { ContactComponent } from './landing/contact/contact.component';
import { TableComponent } from './components/pages/table/table/table.component';

const routes: Routes = [
  {path: '', redirectTo:'landing',pathMatch:'full'},
  {
    path:'login',component:DLogInComponent
  },
  {
    path:'landing', component:LandingComponent
  },
  {
    path:'contact', component:ContactComponent
  },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      {path: 'analytics', data: { breadcrumb: 'Analytics' }, component: AnalyticsComponent},
      {path: 'profile', data: { breadcrumb: 'profile' }, component: ProfilesComponent},
    ]
  },
  {path: 'colors', component: PackageAddComponent},
  {
    path: 'table', component: TableComponent,
    children: [
      {path: 'terminal', data: { breadcrumb: 'Table' }, component: TerminalComponent},
      {path: 'scheduling', data: { breadcrumb: 'Scheduling' }, component: SchedulingComponent},
      {path: 'parameters', data: { breadcrumb: 'DynamiKeys' }, component: FlyparametersComponent},
      {path: 'packages', data: { breadcrumb: 'Packages' }, component: PackagesComponent},
      {path: 'update-schedule', data: { breadcrumb: 'Update Schedule' }, component: UpdateScheduleComponent},
      {path: 'group', data: { breadcrumb: 'Group' }, component: GroupComponent},
    ]
  },
  {
    path: 'admin', component: AdministrationComponent,
    children: [
      {path: 'user', data: { breadcrumb: 'User' }, component: UserComponent},
      {path: 'role', data: { breadcrumb: 'Role' }, component: RoleComponent},
      {path: 'alert', data: { breadcrumb: 'Alert' }, component: AlertComponent},
      {path: 'tenants', data: { breadcrumb: 'Tenants' }, component: TenantsComponent},
      {path: 'hierarchies', data: { breadcrumb: 'Hierarchies' }, component: HierarchyLevelComponent},
      {path: 'merchant', data: { breadcrumb: 'Merchant' }, component: MerchantsComponent},
    ]
  },
  {
    path: 'device', component: AdministrationComponent,
    children: [
      {path: 'device', data: { breadcrumb: 'Device' }, component: DevicesComponent},
      {path: 'model', data: { breadcrumb: 'Model' }, component: ModelComponent},
    ]
  },
  {
    path: 'report', component: AdministrationComponent,
    children: [
      {path: 'status', component: StatusReportComponent},
      {path: 'heart', component: HeartReportComponent},
      {path: 'search', component: SearchReportComponent},
      {path: 'hierarchy', component: HirerichiesReportComponent},
      {path: 'software', component: SoftwareReportComponent},
      {path: 'parameters', component: ParametersReportComponent},
      {path: 'swap', component: SwapReportComponent},
      {path: 'system', component: SystemReportComponent},
    ]
  },
  {path: 'merchant', component: MerchantComponent},
  {path:'**',redirectTo:'landing'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

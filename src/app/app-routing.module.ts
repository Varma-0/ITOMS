import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './components/pages/dashboard/analytics/analytics.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard/dashboard.component';
import { EcommerceComponent } from './components/pages/dashboard/ecommerce/ecommerce.component';
import { AppChatComponent } from './components/pages/app-chat/app-chat.component';
import { AppTodoComponent } from './components/pages/app-todo/app-todo.component';
import { AppCalendarComponent } from './components/pages/app-calendar/app-calendar.component';
import { GalleryComponent } from './components/pages/gallery/gallery.component';
import { TimelineComponent } from './components/pages/timeline/timeline.component';
import { PricingComponent } from './components/pages/pricing/pricing.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { InvoiceComponent } from './components/pages/invoice/invoice.component';
import { BlankPageComponent } from './components/pages/blank-page/blank-page.component';
import { GridComponent } from './components/pages/grid/grid.component';
import { ColorsComponent } from './components/pages/colors/colors.component';
import { IconsComponent } from './components/pages/icons/icons/icons.component';
import { BoxiconsComponent } from './components/pages/icons/boxicons/boxicons.component';
import { FeathericonsComponent } from './components/pages/icons/feathericons/feathericons.component';
import { BasicCardComponent } from './components/pages/card/basic-card/basic-card.component';
import { ColorsCardComponent } from './components/pages/card/colors-card/colors-card.component';
import { StatisticsCardComponent } from './components/pages/card/statistics-card/statistics-card.component';
import { FormLayoutComponent } from './components/pages/forms/form-layout/form-layout.component';
import { FormInputGroupComponent } from './components/pages/forms/form-input-group/form-input-group.component';
import { TerminalComponent } from './components/pages/table/terminal/terminal.component';
import { TableDarkComponent } from './components/pages/table/table-dark/table-dark.component';
import { InboxComponent } from './components/pages/app-email/inbox/inbox.component';
import { ReadComponent } from './components/pages/app-email/read/read.component';
import { ComposeComponent } from './components/pages/app-email/compose/compose.component';
import { FormComponent } from './components/pages/forms/form/form.component';
import { CardComponent } from './components/pages/card/card/card.component';
import { AppEmailComponent } from './components/pages/app-email/app-email/app-email.component';
import { TableComponent } from './components/pages/table/table/table.component';
import { UiComponentsComponent } from './components/pages/ui-components/ui-components/ui-components.component';
import { AlertsComponent } from './components/pages/ui-components/alerts/alerts.component';
import { BadgesComponent } from './components/pages/ui-components/badges/badges.component';
import { BordersComponent } from './components/pages/ui-components/borders/borders.component';
import { ButtonsComponent } from './components/pages/ui-components/buttons/buttons.component';
import { ButtonsGroupComponent } from './components/pages/ui-components/buttons-group/buttons-group.component';
import { BreadcrumbComponent } from './components/pages/ui-components/breadcrumb/breadcrumb.component';
import { SliderComponent } from './components/pages/ui-components/slider/slider.component';
import { CollapseComponent } from './components/pages/ui-components/collapse/collapse.component';
import { DisplayComponent } from './components/pages/ui-components/display/display.component';
import { DropdownComponent } from './components/pages/ui-components/dropdown/dropdown.component';
import { EmbedComponent } from './components/pages/ui-components/embed/embed.component';
import { FiguresComponent } from './components/pages/ui-components/figures/figures.component';
import { ImagesComponent } from './components/pages/ui-components/images/images.component';
import { JumbotronComponent } from './components/pages/ui-components/jumbotron/jumbotron.component';
import { ListGroupComponent } from './components/pages/ui-components/list-group/list-group.component';
import { MediaObjectComponent } from './components/pages/ui-components/media-object/media-object.component';
import { ModalComponent } from './components/pages/ui-components/modal/modal.component';
import { NavsComponent } from './components/pages/ui-components/navs/navs.component';
import { NavbarComponent } from './components/pages/ui-components/navbar/navbar.component';
import { PaginationComponent } from './components/pages/ui-components/pagination/pagination.component';
import { ProgressComponent } from './components/pages/ui-components/progress/progress.component';
import { SpinnerComponent } from './components/pages/ui-components/spinner/spinner.component';
import { TextComponent } from './components/pages/ui-components/text/text.component';
import { VerticalAlignmentComponent } from './components/pages/ui-components/vertical-alignment/vertical-alignment.component';
import { TypographyComponent } from './components/pages/ui-components/typography/typography.component';
import { TooltipsComponent } from './components/pages/ui-components/tooltips/tooltips.component';
import { PopoversComponent } from './components/pages/ui-components/popovers/popovers.component';
import { LoginComponent } from './components/pages/authentication/login/login.component';
import { AuthenticationComponent } from './components/pages/authentication/authentication/authentication.component';
import { LoginWithImageComponent } from './components/pages/authentication/login-with-image/login-with-image.component';
import { RegisterComponent } from './components/pages/authentication/register/register.component';
import { RegisterWithImageComponent } from './components/pages/authentication/register-with-image/register-with-image.component';
import { ForgotPasswordComponent } from './components/pages/authentication/forgot-password/forgot-password.component';
import { ForgotPasswordWithImageComponent } from './components/pages/authentication/forgot-password-with-image/forgot-password-with-image.component';
import { ResetPasswordComponent } from './components/pages/authentication/reset-password/reset-password.component';
import { ResetPasswordWithImageComponent } from './components/pages/authentication/reset-password-with-image/reset-password-with-image.component';
import { SessionLockScreenComponent } from './components/pages/authentication/session-lock-screen/session-lock-screen.component';
import { SessionLockScreenWithImageComponent } from './components/pages/authentication/session-lock-screen-with-image/session-lock-screen-with-image.component';
import { MiscellaneousComponent } from './components/pages/miscellaneous/miscellaneous/miscellaneous.component';
import { NotAuthorizedComponent } from './components/pages/miscellaneous/not-authorized/not-authorized.component';
import { NotAuthorizedWithImageComponent } from './components/pages/miscellaneous/not-authorized-with-image/not-authorized-with-image.component';
import { MaintenanceComponent } from './components/pages/miscellaneous/maintenance/maintenance.component';
import { MaintenanceWithImageComponent } from './components/pages/miscellaneous/maintenance-with-image/maintenance-with-image.component';
import { ComingSoonComponent } from './components/pages/miscellaneous/coming-soon/coming-soon.component';
import { ComingSoonWithImageComponent } from './components/pages/miscellaneous/coming-soon-with-image/coming-soon-with-image.component';
import { Errorv1Component } from './components/pages/error/errorv1/errorv1.component';
import { Errorv2Component } from './components/pages/error/errorv2/errorv2.component';
import { ErrorComponent } from './components/pages/error/error/error.component';
import { Errorv3Component } from './components/pages/error/errorv3/errorv3.component';
import { Errorv4Component } from './components/pages/error/errorv4/errorv4.component';
import { MapsComponent } from './components/pages/maps/maps.component';
import { ApexChartsComponent } from './components/pages/apex-charts/apex-charts.component';
import { LandingComponent } from './landing/dashboard/dashboard.component';
import { DLogInComponent } from './landing/log-in/log-in.component';
import { AuthGuard } from './services/login/auth.guard';
import { MerchantComponent } from './components/pages/merchant/merchant.component';
import { AdministrationComponent } from './components/pages/admin/administration/administration.component';
import { UserComponent } from './components/pages/admin/user/user.component';
import { RoleComponent } from './components/pages/admin/role/role.component';
import { AlertComponent } from './components/pages/admin/alerts/alerts.component';
import { PermissionComponent } from './components/pages/admin/permission/permission.component';
import { TenantsComponent } from './components/pages/admin/tenants/tenants.component';
import { HierarchyLevelComponent } from './components/pages/admin/hierarchy-level/hierarchy-level.component';
import { HierarchyComponent } from './components/pages/admin/hierarchy/hierarchy.component';
import { MerchantsComponent } from './components/pages/admin/merchants/merchants.component';
import { SchedulingComponent } from './components/pages/table/scheduling/scheduling.component';
import { FlyparametersComponent } from './components/pages/table/flyparameters/flyparameters.component';
import { ProfileComponent } from './components/pages/table/profile/profile.component';
import { PackagesComponent } from './components/pages/table/packages/packages.component';
import { DevicesComponent } from './components/pages/device/devices/devices.component';
import { UpdateScheduleComponent } from './components/pages/table/update-schedule/update-schedule.component';
import { GroupComponent } from './components/pages/table/group/group.component';
import { ModelComponent } from './components/pages/device/model/model.component';

const routes: Routes = [
  {path: '', redirectTo:'landing',pathMatch:'full'},
  {
    path:'login',component:DLogInComponent
    // , canActivate: [AuthGuard]
  },
  {
    path:'landing', component:LandingComponent
  },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      {path: 'analytics', data: { breadcrumb: 'Analytics' }, component: AnalyticsComponent},
      {path: 'e-commerce', data: { breadcrumb: 'eCommerce' }, component: EcommerceComponent},
    ]
  },
  {
    path: 'app-email', component: AppEmailComponent,
    children: [
      {path: 'inbox', data: { breadcrumb: 'Inbox' }, component: InboxComponent},
      {path: 'read', data: { breadcrumb: 'Email Read' }, component: ReadComponent},
      {path: 'compose', data: { breadcrumb: 'Email Compose' }, component: ComposeComponent},
    ]
  },
  {path: 'app-chat', component: AppChatComponent},
  {path: 'app-todo', component: AppTodoComponent},
  {path: 'app-calendar', component: AppCalendarComponent},

  {path: 'grid', component: GridComponent},
  {path: 'colors', component: ColorsComponent},
  {
    path: 'icons', component: IconsComponent,
    children: [
      {path: 'boxicons', data: { breadcrumb: 'Boxicons' }, component: BoxiconsComponent},
      {path: 'feathericons', data: { breadcrumb: 'Feather Icons' }, component: FeathericonsComponent},
    ]
  },
  {
    path: 'card', component: CardComponent,
    children: [
      {path: 'basic-card', data: { breadcrumb: 'Basic Card' }, component: BasicCardComponent},
      {path: 'colors-card', data: { breadcrumb: 'Colors Card' }, component: ColorsCardComponent},
      {path: 'statistics-card', data: { breadcrumb: 'Statistics Card' }, component: StatisticsCardComponent},
    ]
  },
  {
    path: 'ui-components', component: UiComponentsComponent,
    children: [
      {path: 'alerts', data: { breadcrumb: 'Alerts' }, component: AlertsComponent},
      {path: 'badges', data: { breadcrumb: 'Badges' }, component: BadgesComponent},
      {path: 'borders', data: { breadcrumb: 'Borders' }, component: BordersComponent},
      {path: 'breadcrumb', data: { breadcrumb: 'Breadcrumbs' }, component: BreadcrumbComponent},
      {path: 'buttons', data: { breadcrumb: 'Buttons' }, component: ButtonsComponent},
      {path: 'buttons-group', data: { breadcrumb: 'Buttons Group' }, component: ButtonsGroupComponent},
      {path: 'slider', data: { breadcrumb: 'Carousel' }, component: SliderComponent},
      {path: 'collapse', data: { breadcrumb: 'Collapse' }, component: CollapseComponent},
      {path: 'display', data: { breadcrumb: 'Display' }, component: DisplayComponent},
      {path: 'dropdown', data: { breadcrumb: 'Dropdown' }, component: DropdownComponent},
      {path: 'embed', data: { breadcrumb: 'Embed' }, component: EmbedComponent},
      {path: 'figures', data: { breadcrumb: 'Figures' }, component: FiguresComponent},
      {path: 'images', data: { breadcrumb: 'Images' }, component: ImagesComponent},
      {path: 'jumbotron', data: { breadcrumb: 'Jumbotron' }, component: JumbotronComponent},
      {path: 'list-group', data: { breadcrumb: 'List Group' }, component: ListGroupComponent},
      {path: 'media-object', data: { breadcrumb: 'Media Object' }, component: MediaObjectComponent},
      {path: 'modal', data: { breadcrumb: 'Modal' }, component: ModalComponent},
      {path: 'navs', data: { breadcrumb: 'Navs' }, component: NavsComponent},
      {path: 'navbar', data: { breadcrumb: 'Navbar' }, component: NavbarComponent},
      {path: 'pagination', data: { breadcrumb: 'Pagination' }, component: PaginationComponent},
      {path: 'progress', data: { breadcrumb: 'Progress' }, component: ProgressComponent},
      {path: 'spinner', data: { breadcrumb: 'Spinner' }, component: SpinnerComponent},
      {path: 'text', data: { breadcrumb: 'Text' }, component: TextComponent},
      {path: 'vertical-alignment', data: { breadcrumb: 'Vertical Alignment' }, component: VerticalAlignmentComponent},
      {path: 'typography', data: { breadcrumb: 'Typography' }, component: TypographyComponent},
      {path: 'tooltips', data: { breadcrumb: 'Tooltips' }, component: TooltipsComponent},
      {path: 'popovers', data: { breadcrumb: 'Popovers' }, component: PopoversComponent},
    ]
  },
  {
    path: 'forms', component: FormComponent,
    children: [
      {path: 'form-layout', data: { breadcrumb: 'Forms' }, component: FormLayoutComponent},
      {path: 'form-input-group', data: { breadcrumb: 'Input Group' }, component: FormInputGroupComponent},
    ]
  },
  {
    path: 'table', component: TableComponent,
    children: [
      {path: 'terminal', data: { breadcrumb: 'Table' }, component: TerminalComponent},
      {path: 'table-dark', data: { breadcrumb: 'Table Dark' }, component: TableDarkComponent},
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
      {path: 'permission', data: { breadcrumb: 'Permission' }, component: PermissionComponent},
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
  {path: 'merchant', component: MerchantComponent},
  {path: 'report', component: GalleryComponent},
  {path: 'gallery', component: GalleryComponent},
  {path: 'timeline', component: TimelineComponent},
  {path: 'pricing', component: PricingComponent},
  {path: 'faq', component: FaqComponent},
  {path: 'invoice', component: InvoiceComponent},
  {path: 'blank-page', component: BlankPageComponent},
  {
    path: 'authentication', component: AuthenticationComponent,
    children: [
      {path: 'login', data: { breadcrumb: 'Login' }, component: LoginComponent},
      {path: 'login-with-image', data: { breadcrumb: 'Login with Image' }, component: LoginWithImageComponent},
      {path: 'register', data: { breadcrumb: 'Register' }, component: RegisterComponent},
      {path: 'register-with-image', data: { breadcrumb: 'Register with Image' }, component: RegisterWithImageComponent},
      {path: 'forgot-password', data: { breadcrumb: 'Forgot Password' }, component: ForgotPasswordComponent},
      {path: 'forgot-password-with-image', data: { breadcrumb: 'Forgot Password with Image' }, component: ForgotPasswordWithImageComponent},
      {path: 'reset-password', data: { breadcrumb: 'Reset Password' }, component: ResetPasswordComponent},
      {path: 'reset-password-with-image', data: { breadcrumb: 'Reset Password with Image' }, component: ResetPasswordWithImageComponent},
      {path: 'lock-screen', data: { breadcrumb: 'Lock Screen' }, component: SessionLockScreenComponent},
      {path: 'lock-screen-with-image', data: { breadcrumb: 'Lock Screen with Image' }, component: SessionLockScreenWithImageComponent},
    ]
  },
  {
    path: 'miscellaneous', component: MiscellaneousComponent,
    children: [
      {path: 'not-authorized', data: { breadcrumb: 'Not Authorized' }, component: NotAuthorizedComponent},
      {path: 'not-authorized-with-image', data: { breadcrumb: 'Not Authorized with Image' }, component: NotAuthorizedWithImageComponent},
      {path: 'maintenance', data: { breadcrumb: 'Maintenance' }, component: MaintenanceComponent},
      {path: 'maintenance-with-image', data: { breadcrumb: 'Maintenance with Image' }, component: MaintenanceWithImageComponent},
      {path: 'coming-soon', data: { breadcrumb: 'Coming Soon' }, component: ComingSoonComponent},
      {path: 'coming-soon-with-image', data: { breadcrumb: 'Coming Soon with Image' }, component: ComingSoonWithImageComponent},
    ]
  },
  {
    path: 'error', component: ErrorComponent,
    children: [
      {path: 'errorv1', data: { breadcrumb: '404 Error' }, component: Errorv1Component},
      {path: 'errorv2', data: { breadcrumb: '404 Error with Image' }, component: Errorv2Component},
      {path: 'errorv3', data: { breadcrumb: '500 Error with Image' }, component: Errorv3Component},
      {path: 'errorv4', data: { breadcrumb: '500 Error with Image' }, component: Errorv4Component},
    ]
  },
  {path: 'apex-charts', component: ApexChartsComponent},
  {path: 'maps', component: MapsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

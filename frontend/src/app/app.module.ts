import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

// ng2-charts
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { ReadingChartComponent } from './components/reading-chart/reading-chart.component';
import { ThresholdFormComponent } from './components/threshold-form/threshold-form.component';
import { TicketPanelComponent } from './components/ticket-panel/ticket-panel.component';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AssetListComponent,
    ReadingChartComponent,
    ThresholdFormComponent,
    TicketPanelComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,
    ReactiveFormsModule, FormsModule, AppRoutingModule,
    MatTableModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule,
    MatListModule, MatDividerModule, MatToolbarModule, MatBadgeModule,
    MatChipsModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatTooltipModule, MatPaginatorModule, MatDialogModule, MatSelectModule,
    BaseChartDirective
  ],
  providers: [
    AuthGuard,
    provideCharts(withDefaultRegisterables()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

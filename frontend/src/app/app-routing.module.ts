import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'doctors',
    canActivate: [AuthGuard],
    loadChildren: () => import('./doctors/doctors.module').then(m => m.DoctorsModule) 
  },
  { 
    path: 'patients', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule) 
  },
  { 
    path: 'appointments', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
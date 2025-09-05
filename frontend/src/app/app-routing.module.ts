import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'doctors',
    loadChildren: () => import('./doctors/doctors.module').then(m => m.DoctorsModule) 
  },
  { path: 'patients', 
    loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule) 
  },
  { path: 'appointments', 
    loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { RoleGuard } from '../auth/role.guard';

const routes: Routes = [
  { path: '', component: DoctorListComponent },
  { 
    path: 'add', 
    component: DoctorFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'edit/:id', 
    component: DoctorFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  { path: 'details/:id', component: DoctorDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule { }

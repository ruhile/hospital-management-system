import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';

const routes: Routes = [
  { path: '', component: DoctorListComponent },           // /doctors
  { path: 'add', component: DoctorFormComponent },        // /doctors/add
  { path: 'edit/:id', component: DoctorFormComponent },    // /doctors/edit/1
  { path: 'details/:id', component: DoctorDetailsComponent }  // ✅ new
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule { }

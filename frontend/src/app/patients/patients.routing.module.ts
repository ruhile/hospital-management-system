import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';

const routes: Routes = [
  { path: '', component: PatientListComponent },           // /patients
  { path: 'add', component: PatientFormComponent },        // /patients/add
  { path: 'edit/:id', component: PatientFormComponent },   // /patients/edit/1
  { path: 'details/:id', component: PatientDetailsComponent } // optional
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule {}

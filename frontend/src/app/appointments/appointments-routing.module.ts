import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';

const routes: Routes = [
  { path: '', component: AppointmentListComponent },           // /appointments
  { path: 'add', component: AppointmentFormComponent },        // /appointments/add
  { path: 'edit/:id', component: AppointmentFormComponent },    // /appointments/edit/1
  { path: 'details/:id', component: AppointmentDetailsComponent } // optional
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule {}

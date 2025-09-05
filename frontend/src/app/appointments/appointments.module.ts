import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentsRoutingModule } from './appointments-routing.module';



@NgModule({
  declarations: [
    AppointmentListComponent,
    AppointmentFormComponent,
    AppointmentDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppointmentsRoutingModule
  ]
})
export class AppointmentsModule { }

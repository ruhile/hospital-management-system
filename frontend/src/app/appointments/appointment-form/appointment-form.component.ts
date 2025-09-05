import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../patient.service';
import { AppointmentService } from '../../appointment.service';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  isEditMode = false;
  appointmentId: string | null = null;

  patients: any[] = [];
  doctors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appSvc: AppointmentService,
    private patientSvc: PatientService,
    private doctorSvc: DoctorService
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      patient: ['', Validators.required],
      doctor: ['', Validators.required],
      date: ['', Validators.required],
      status: ['Scheduled']
    });

    // Load patients + doctors for dropdowns
this.patientSvc.list().subscribe({
  next: (res) => {
    console.log('Patients API response:', res);
    this.patients = Array.isArray(res) ? res : res.data; // <-- pick array
  },
  error: (err) => console.error('Error fetching patients', err)
});
    this.doctorSvc.list().subscribe(d => this.doctors = d);

    // If editing, load appointment
    this.appointmentId = this.route.snapshot.paramMap.get('id');
    if (this.appointmentId) {
      this.isEditMode = true;
      this.appSvc.get(this.appointmentId).subscribe(data => {
        this.appointmentForm.patchValue({
          patient: data.patient?._id || data.patient,
          doctor: data.doctor?._id || data.doctor,
          date: data.date?.substring(0, 10), // show only yyyy-mm-dd
          status: data.status
        });
      });
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) return;

    if (this.isEditMode) {
      this.appSvc.update(this.appointmentId!, this.appointmentForm.value).subscribe(() => {
        this.router.navigate(['/appointments']);
      });
    } else {
      this.appSvc.create(this.appointmentForm.value).subscribe(() => {
        this.router.navigate(['/appointments']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/appointments']);
  }
}

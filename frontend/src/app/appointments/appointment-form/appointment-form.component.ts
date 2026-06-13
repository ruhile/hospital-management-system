import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../patient.service';
import { AppointmentService } from '../../appointment.service';
import { DoctorService } from '../../doctor.service';
import { ToastService } from '../../toast.service';
import { AuthService } from '../../auth/auth.service';

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
  selectedDoctor: any = null;
  doctorAvailabilityWarning = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appSvc: AppointmentService,
    private patientSvc: PatientService,
    private doctorSvc: DoctorService,
    private toastSvc: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      patient: ['', Validators.required],
      doctor: ['', Validators.required],
      date: ['', Validators.required],
      status: ['Scheduled']
    });

    // Listen to changes for smart availability validation
    this.appointmentForm.get('doctor')?.valueChanges.subscribe(() => this.validateAvailability());
    this.appointmentForm.get('date')?.valueChanges.subscribe(() => this.validateAvailability());

    // Load patients for dropdown list (backend automatically filters based on logged-in user profile)
    this.patientSvc.list().subscribe({
      next: (res) => {
        console.log('Patients API response:', res);
        this.patients = Array.isArray(res) ? res : (res.data || []);
      },
      error: (err) => console.error('Error fetching patients', err)
    });

    this.doctorSvc.list().subscribe(d => {
      this.doctors = d;
      // If editing, run initial validation once doctors are loaded
      if (this.isEditMode) {
        this.validateAvailability();
      }
    });

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

  validateAvailability(): void {
    this.doctorAvailabilityWarning = '';
    const docId = this.appointmentForm.get('doctor')?.value;
    const dateStr = this.appointmentForm.get('date')?.value;

    if (!docId || !dateStr) {
      this.selectedDoctor = null;
      return;
    }

    this.selectedDoctor = this.doctors.find(d => d._id === docId);
    if (!this.selectedDoctor || !this.selectedDoctor.availability) {
      return;
    }

    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const dateObj = new Date(year, month, day);
      
      // Mongoose expects: 'Mon','Tue','Wed','Thu','Fri','Sat','Sun'
      const daysOfWeekAbbrev = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const daysOfWeekFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      const selectedDayIdx = dateObj.getDay();
      const selectedDayAbbrev = daysOfWeekAbbrev[selectedDayIdx];
      const selectedDayFull = daysOfWeekFull[selectedDayIdx];

      if (!this.selectedDoctor.availability.includes(selectedDayAbbrev)) {
        const fullWorkDays = this.selectedDoctor.availability.map((d: string) => {
          const idx = daysOfWeekAbbrev.indexOf(d);
          return idx > -1 ? daysOfWeekFull[idx] : d;
        });
        this.doctorAvailabilityWarning = `Notice: Dr. ${this.selectedDoctor.name} is not scheduled to work on ${selectedDayFull}s. Consulting Days: ${fullWorkDays.join(', ')}`;
      }
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) return;

    if (this.isEditMode) {
      this.appSvc.update(this.appointmentId!, this.appointmentForm.value).subscribe({
        next: () => {
          this.toastSvc.showSuccess('Appointment updated successfully.');
          this.router.navigate(['/appointments']);
        },
        error: () => this.toastSvc.showError('Failed to update appointment.')
      });
    } else {
      this.appSvc.create(this.appointmentForm.value).subscribe({
        next: () => {
          this.toastSvc.showSuccess('Appointment booked successfully.');
          this.router.navigate(['/appointments']);
        },
        error: () => this.toastSvc.showError('Failed to book appointment.')
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/appointments']);
  }
}

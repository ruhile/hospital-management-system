import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../doctor.service';
import { PatientService } from '../patient.service';
import { AppointmentService } from '../appointment.service';
import { AuthService } from '../auth/auth.service';
import { forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  apiUrl = environment.apiUrl;
  doctorCount = 0;
  patientCount = 0;
  appointmentCount = 0;
  
  scheduledCount = 0;
  completedCount = 0;
  cancelledCount = 0;
  
  recentAppointments: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private doctorSvc: DoctorService,
    private patientSvc: PatientService,
    private appointmentSvc: AppointmentService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.fetchDashboardData();
    } else {
      this.loading = false;
    }
  }

  fetchDashboardData(): void {
    this.loading = true;
    this.errorMsg = '';

    forkJoin({
      doctors: this.doctorSvc.list(),
      patients: this.patientSvc.list(),
      appointments: this.appointmentSvc.list()
    }).subscribe({
      next: (res) => {
        // Calculate doctor count
        this.doctorCount = Array.isArray(res.doctors) ? res.doctors.length : 0;
        
        // Calculate patient count
        this.patientCount = Array.isArray(res.patients) ? res.patients.length : (res.patients.data ? res.patients.data.length : 0);
        
        // Calculate appointment count and stats
        const apps = Array.isArray(res.appointments) ? res.appointments : [];
        this.appointmentCount = apps.length;
        
        this.scheduledCount = apps.filter((a: any) => a.status === 'Scheduled').length;
        this.completedCount = apps.filter((a: any) => a.status === 'Completed').length;
        this.cancelledCount = apps.filter((a: any) => a.status === 'Cancelled').length;

        // Sort by date (descending) and take top 4
        this.recentAppointments = [...apps]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard statistics', err);
        this.errorMsg = 'Failed to load dashboard statistics. Please make sure the backend is running.';
        this.loading = false;
      }
    });
  }
}

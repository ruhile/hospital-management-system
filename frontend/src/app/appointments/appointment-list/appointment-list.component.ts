import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../appointment.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  loading = true;

  constructor(private appSvc: AppointmentService, private router: Router) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appSvc.list().subscribe({
      next: (res) => {
        this.appointments = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading appointments', err);
        this.loading = false;
      }
    });
  }

  editAppointment(id: string): void {
    this.router.navigate(['/appointments/edit', id]);
  }

  deleteAppointment(id: string): void {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    this.appSvc.remove(id).subscribe(() => {
      this.appointments = this.appointments.filter(a => a._id !== id);
    });
  }
}

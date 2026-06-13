import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../appointment.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  searchTerm = '';
  statusFilter = ''; // Empty string = All
  loading = true;

  constructor(
    private appSvc: AppointmentService, 
    private router: Router,
    private toastSvc: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appSvc.list().subscribe({
      next: (res) => {
        this.appointments = Array.isArray(res) ? res : [];
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading appointments', err);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    let filtered = [...this.appointments];

    // Status Filter
    if (this.statusFilter) {
      filtered = filtered.filter(a => a.status === this.statusFilter);
    }

    // Search Query (Patient or Doctor Name)
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      filtered = filtered.filter(a => {
        const patientName = a.patient?.name ? a.patient.name.toLowerCase() : '';
        const doctorName = a.doctor?.name ? a.doctor.name.toLowerCase() : '';
        return patientName.includes(q) || doctorName.includes(q);
      });
    }

    // Sort by date (descending)
    this.filteredAppointments = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  editAppointment(id: string): void {
    this.router.navigate(['/appointments/edit', id]);
  }

  deleteAppointment(id: string): void {
    if (!confirm('Are you sure you want to cancel/delete this appointment record?')) return;
    this.appSvc.remove(id).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(a => a._id !== id);
        this.applyFilter();
        this.toastSvc.showSuccess('Appointment cancelled successfully.');
      },
      error: () => this.toastSvc.showError('Failed to cancel appointment.')
    });
  }
}

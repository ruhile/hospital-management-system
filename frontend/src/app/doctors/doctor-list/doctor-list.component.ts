import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../doctor.service';
import { ToastService } from '../../toast.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  searchTerm = '';
  loading = true;

  constructor(
    private doctorSvc: DoctorService,
    private router: Router,
    private toastSvc: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorSvc.list().subscribe({
      next: (res) => {
        this.doctors = res; // backend returns array of doctors
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading doctors', err);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDoctors = this.doctors;
    } else {
      const q = this.searchTerm.toLowerCase();
      this.filteredDoctors = this.doctors.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.specialization.toLowerCase().includes(q)
      );
    }
  }

  editDoctor(id: string): void {
    this.router.navigate(['/doctors/edit', id]);
  }

  deleteDoctor(id: string): void {
    if (!confirm('Are you sure you want to delete this doctor? All scheduled appointments for this doctor will remain but show as unassigned.')) return;
    this.doctorSvc.remove(id).subscribe({
      next: () => {
        this.doctors = this.doctors.filter(doc => doc._id !== id);
        this.applyFilter();
        this.toastSvc.showSuccess('Doctor profile removed successfully.');
      },
      error: () => this.toastSvc.showError('Failed to remove doctor.')
    });
  }
}

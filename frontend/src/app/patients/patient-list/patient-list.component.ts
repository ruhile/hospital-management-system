import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../patient.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  searchTerm = '';
  loading = true;

  constructor(
    private patientSvc: PatientService, 
    private router: Router,
    private toastSvc: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientSvc.list().subscribe({
      next: (res) => {
        this.patients = res.data || res; // depending on backend response
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading patients', err);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = this.patients;
    } else {
      const q = this.searchTerm.toLowerCase();
      this.filteredPatients = this.patients.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.medicalHistory && p.medicalHistory.toLowerCase().includes(q))
      );
    }
  }

  editPatient(id: string): void {
    this.router.navigate(['/patients/edit', id]);
  }

  deletePatient(id: string): void {
    if (!confirm('Are you sure you want to delete this patient? All scheduled appointments for this patient will remain but show as unknown.')) return;
    this.patientSvc.remove(id).subscribe({
      next: () => {
        this.patients = this.patients.filter(p => p._id !== id);
        this.applyFilter();
        this.toastSvc.showSuccess('Patient record removed successfully.');
      },
      error: () => this.toastSvc.showError('Failed to remove patient record.')
    });
  }
}
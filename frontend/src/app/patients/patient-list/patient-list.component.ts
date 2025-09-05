import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../patient.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  loading = true;

  constructor(private patientSvc: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientSvc.list().subscribe({
      next: (res) => {
        this.patients = res.data || res; // depending on backend response
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading patients', err);
        this.loading = false;
      }
    });
  }

  editPatient(id: string): void {
    this.router.navigate(['/patients/edit', id]);
  }

  deletePatient(id: string): void {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    this.patientSvc.remove(id).subscribe(() => {
      this.patients = this.patients.filter(p => p._id !== id);
    });
  }
}
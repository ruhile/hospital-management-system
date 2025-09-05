// src/app/patients/patient-details/patient-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../patient.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  patient: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientSvc: PatientService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientSvc.get(id).subscribe({
        next: (data) => {
          this.patient = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading patient', err);
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/patients']);
  }
}

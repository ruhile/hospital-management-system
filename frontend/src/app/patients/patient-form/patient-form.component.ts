import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../patient.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  patientForm!: FormGroup;
  isEditMode = false;
  patientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private patientSvc: PatientService
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      medicalHistory: ['']
    });

    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId) {
      this.isEditMode = true;
      this.patientSvc.get(this.patientId).subscribe(data => {
        this.patientForm.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    if (this.patientForm.invalid) return;

    if (this.isEditMode) {
      this.patientSvc.update(this.patientId!, this.patientForm.value).subscribe(() => {
        this.router.navigate(['/patients']);
      });
    } else {
      this.patientSvc.create(this.patientForm.value).subscribe(() => {
        this.router.navigate(['/patients']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }
}
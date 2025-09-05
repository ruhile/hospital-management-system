import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css']
})
export class DoctorFormComponent implements OnInit {
  doctorForm!: FormGroup;
  isEditMode = false;
  doctorId: string | null = null;

  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private doctorSvc: DoctorService
  ) {}

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      availability: [[], Validators.required]
    });

    this.doctorId = this.route.snapshot.paramMap.get('id');
    if (this.doctorId) {
      this.isEditMode = true;
      this.doctorSvc.get(this.doctorId).subscribe(doc => {
        this.doctorForm.patchValue(doc);
      });
    }
  }

  // Handle checkbox change
  onDayChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const availability = this.doctorForm.value.availability as string[];

    if (checkbox.checked) {
      if (!availability.includes(checkbox.value)) {
        availability.push(checkbox.value);
      }
    } else {
      const index = availability.indexOf(checkbox.value);
      if (index > -1) {
        availability.splice(index, 1);
      }
    }

    this.doctorForm.patchValue({ availability });
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) return;

    if (this.isEditMode) {
      this.doctorSvc.update(this.doctorId!, this.doctorForm.value).subscribe(() => {
        this.router.navigate(['/doctors']);
      });
    } else {
      this.doctorSvc.create(this.doctorForm.value).subscribe(() => {
        this.router.navigate(['/doctors']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/doctors']);
  }
}

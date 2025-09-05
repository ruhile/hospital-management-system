import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']   // ✅ fixed styleUrls (plural)
})
export class DoctorListComponent implements OnInit {
  doctors: any[] = [];
  loading = true;

  constructor(
    private doctorSvc: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorSvc.list().subscribe({
      next: (res) => {
        this.doctors = res; // backend returns array of doctors
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading doctors', err);
        this.loading = false;
      }
    });
  }

  editDoctor(id: string): void {
    this.router.navigate(['/doctors/edit', id]);
  }

  deleteDoctor(id: string): void {
    // if (!confirm('Are you sure you want to delete this doctor?')) return;
    this.doctorSvc.remove(id).subscribe(() => {
      this.doctors = this.doctors.filter(doc => doc._id !== id);
    });
  }
}

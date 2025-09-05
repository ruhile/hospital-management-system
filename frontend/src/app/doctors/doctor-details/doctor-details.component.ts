import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnInit {
  doctorId: string | null = null;
  doctor: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorSvc: DoctorService
  ) {}

  ngOnInit(): void {
    this.doctorId = this.route.snapshot.paramMap.get('id');

    if (this.doctorId) {
      this.doctorSvc.get(this.doctorId).subscribe({
        next: (data) => {
          this.doctor = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading doctor details', err);
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/doctors']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../appointment.service';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.css']
})
export class AppointmentDetailsComponent implements OnInit {
  appointment: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appSvc: AppointmentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appSvc.get(id).subscribe({
        next: (res) => {
          this.appointment = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching appointment:', err);
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/appointments']);
  }
}

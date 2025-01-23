import { Component, OnInit, inject } from '@angular/core';
import { DataComponent } from './data/data.component';
import { AddDataComponent } from './add-data/add-data.component';
import { BackendService } from '../shared/backend.service';
import { StoreService } from '../shared/store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DataComponent, AddDataComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private backendService = inject(BackendService);
  private storeService = inject(StoreService);

  ngOnInit(): void {
    this.backendService.getCourses();

    this.backendService.getRegistrations(this.storeService.currentPage);
  }
}
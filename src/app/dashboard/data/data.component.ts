import { Component } from '@angular/core';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
  ],
  providers: [DatePipe], // Für die Nutzung der DatePipe
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent {
  public page: number = 0;
  public loading: boolean[] = [];
  public sortAscending: boolean = true;

  constructor(public storeService: StoreService, private backendService: BackendService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.backendService.getRegistrations(this.page);
  }

  selectPage(i: number) {
    this.page = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(i);
  }

  toggleSort() {
    this.sortAscending = !this.sortAscending;
    this.storeService.registrations.sort((a, b) => {
      const dateA = new Date(a.registrationDate).getTime();
      const dateB = new Date(b.registrationDate).getTime();
      return this.sortAscending ? dateA - dateB : dateB - dateA;
    });
  }

  deleteRegistration(id: number, index: number) {
    this.loading[index] = true;
    this.backendService.deleteRegistration(id).subscribe(() => {
      this.loading[index] = false;
      this.storeService.registrations = this.storeService.registrations.filter(r => +r.id !== id);
  
      this.snackBar.open('Abmeldung erfolgreich', 'Schließen', {
        duration: 3000,
      });
    });
  }

  public returnAllPages(): number[] {
    const pagesCount = Math.ceil(this.storeService.registrationTotalCount / 2); // Gesamtseitenzahl
    const pages: number[] = [];
    for (let i = 1; i <= pagesCount; i++) {
      pages.push(i); // Seitenzahlen in das Array einfügen
    }
    return pages;
  }
  

}
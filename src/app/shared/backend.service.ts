import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Course } from './Interfaces/Course';
import { Registration } from './Interfaces/Registration';
import { HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public getCourses() {
    this.http.get<Course[]>('http://localhost:5000/courses').subscribe(courses => {
      this.http.get<any[]>('http://localhost:5000/eventLocations').subscribe(locations => {
        this.storeService.courses = courses.map(course => ({
          ...course,
          eventLocation: locations.find(loc => loc.id == course.eventLocationId)
        }));
      });
    });
  }



  public getRegistrations(page: number) {
    this.http
      .get<Registration[]>(`http://localhost:5000/registrations?_embed=course&_page=${page}&_limit=2`, {
        observe: 'response', // Diese Option gibt die gesamte HTTP-Response zurück
      })
      .subscribe((response: HttpResponse<Registration[]>) => {
        this.storeService.registrations = response.body || []; // Zugriff auf den Body
        this.storeService.registrationTotalCount = Number(response.headers.get('X-Total-Count')); // Zugriff auf die Headers
      });
  }
  
  

  public deleteRegistration(id: number) {
    return this.http.delete(`http://localhost:5000/registrations/${id}`);
  }
  

  public addRegistration(registration: any, page: number) {
    return this.http.post('http://localhost:5000/registrations', registration).pipe(
      tap(() => this.getRegistrations(page)) // Hole die Registrierungen nach dem Hinzufügen
    );
  }
}
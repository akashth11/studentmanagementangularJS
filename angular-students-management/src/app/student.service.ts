import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Student} from './student';
import {STUDENTS} from './mock-students';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map, tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class StudentService {

  private  studentsUrl = 'api/students';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.studentsUrl)
      .pipe(
        tap(students => this.log(`fetched students`)),
        catchError(this.handleError(`getStudents`,[]))
      );
  }

  getStudentNo404<Data>(id: number): Observable<Student> {
    const url = `${this.studentsUrl}/?id=${id}`;
    return this.http.get<Student[]>(url)
      .pipe(
        map(students => students[0]),
        tap(h =>{
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} student id=${id}`);
        }),
        catchError(this.handleError<Student>(`getStudent id=${id}`))
      );
  }

  getStudent(id: number): Observable<Student> {
    const url = `${this.studentsUrl}/${id}`;
    return this.http.get<Student>(url).pipe(
      tap(_ => this.log(`fetched student id=${id}`)),
      catchError(this.handleError<Student>(`getStudent id=${id}`))
    );
  }

  searchStudents(term: string): Observable<Student[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Student[]>(`${this.studentsUrl}/? name=${term}`).pipe(
      tap(_ => this.log(`found students matching"${term}"`)),
      catchError(this.handleError<Student[]>
      ('searchStudents', []))

    );
    }

    addStudent (student: Student): Observable<Student> {
    return this.http.post<Student>(this.studentsUrl, student, httpOptions).pipe(
      tap((student: Student) => this.log(`added student w/ id=${student.id}`)),
      catchError(this.handleError<Student>(`addStudent`))
    );
  }

  deleteStudent (student: Student | number): Observable<Student>  {
    const id = typeof student === 'number' ? student : student.id;
    const url = `${this.studentsUrl}/${id}`;

    return this.http.delete<Student>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted student id=${id}`)),
      catchError(this.handleError<Student>(`deleteStudent`))
    );
  }

  updateStudent (student: Student): Observable<any> {
    return this.http.put(this.studentsUrl, student, httpOptions).pipe(
      tap(_ => this.log(`updates student id=${student.id}`)),
      catchError(this.handleError<any>(`updateStudent`))
    );
  }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);
      return of (result as T);
    };
  }

  private log(message: string) {
    this.messageService.add('StudentService: ' + message);
  }
}

import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Student} from '../student';
import {StudentService} from '../student.service';

@Component({
  selector: 'app-student-search',
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.css']
})

export class StudentSearchComponent implements OnInit {
  students$: Observable<Student[]>;
  private searchTerms = new Subject<string>();

  constructor(private studentService: StudentService) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }


  ngOnInit(): void {
    this.students$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),

      switchMap((term: string) =>
    this.studentService.searchStudents(term)),
  );
  }
}

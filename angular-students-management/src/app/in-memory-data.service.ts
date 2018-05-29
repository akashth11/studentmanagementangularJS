import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Student} from './student';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const students = [
      { id: 1, name: 'Aakash' },
      { id: 2, name: 'Abhishek' },
      { id: 3, name: 'Prateek' },
      { id: 4, name: 'Prankur' },
      { id: 5, name: 'Rohan' }
      ];
    return {students};
  }
}

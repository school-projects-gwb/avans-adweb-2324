import { DocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';

export class Booklet {
  id: string;
  name: string;
  description: string;
  isArchived: boolean;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isArchived = false;
  }

  public setId(id: string) {
    this.id = id;
  }
}

export const bookletConverter = {
  toFirestore: (booklet: Booklet) => {
    return {
      name: booklet.name,
      description: booklet.description,
      isArchived: booklet.isArchived != null ? booklet.isArchived : false,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    if (!data) return new Booklet('', '', '');
    return new Booklet(snapshot.id, data['name'], data['description']);
  },
};

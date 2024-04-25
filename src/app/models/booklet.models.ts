import { DocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';

export class Booklet {
  id: string;
  userId: string;
  name: string;
  description: string;
  isArchived: boolean;

  constructor(id: string, userId: string, name: string, description: string) {
    this.id = id;
    this.userId = userId;
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
      userId: booklet.userId
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    if (!data) return new Booklet('', '', '', '');
    return new Booklet(snapshot.id, data['userId'], data['name'], data['description']);
  },
};

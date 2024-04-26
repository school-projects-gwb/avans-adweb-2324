import { DocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';

export class Booklet {
  private _id: string;
  private _userId: string;
  private _userEmail: string; // TODO this stuff
  private _name: string;
  private _description: string;
  private _isArchived: boolean;
  private _authenticatedUserEmails: string[] = [];

  constructor(
    id: string,
    userId: string,
    userEmail: string,
    name: string,
    description: string,
    authenticatedUserEmails: string[] = []
  ) {
    this._id = id;
    this._userId = userId;
    this._userEmail = userEmail;
    this._name = name;
    this._description = description;
    this._isArchived = false;
    this._authenticatedUserEmails = authenticatedUserEmails;
  }

  set id(id: string) {
    this._id = id;
  }

  set userEmail(email: string) {
    this._userEmail = email;
  }

  get userEmail(): string {
    return this._userEmail;
  }

  get id(): string {
    return this._id;
  }

  set userId(userId: string) {
    this._userId = userId;
  }

  get userId(): string {
    return this._userId;
  }

  set name(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set description(description: string) {
    this._description = description;
  }

  get description(): string {
    return this._description;
  }

  set isArchived(isArchived: boolean) {
    this._isArchived = isArchived;
  }

  get isArchived(): boolean {
    return this._isArchived;
  }

  set authenticatedUserEmails(authenticatedUserEmails: string[]) {
    this._authenticatedUserEmails = authenticatedUserEmails;
  }

  get authenticatedUserEmails(): string[] {
    return this._authenticatedUserEmails;
  }

  public addAuthenticatedUserEmail(emailToAdd: string): void {
    if (!this._authenticatedUserEmails.includes(emailToAdd))
      this._authenticatedUserEmails.push(emailToAdd);
  }

  public removeAuthenticatedUserEmail(emailToRemove: string): void {
    const index = this._authenticatedUserEmails.indexOf(emailToRemove);
    if (index !== -1) this._authenticatedUserEmails.splice(index, 1);
  }
}

export const bookletConverter = {
  toFirestore: (booklet: Booklet) => {
    return {
      name: booklet.name,
      description: booklet.description,
      isArchived: booklet.isArchived != null ? booklet.isArchived : false,
      userId: booklet.userId,
      authenticatedUserEmails: booklet.authenticatedUserEmails,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    if (!data) return new Booklet('', '', '', '', '');
    return new Booklet(
      snapshot.id,
      data['userId'],
      data['name'],
      data['description'],
      data['authenticatedUserEmails']
    );
  },
};

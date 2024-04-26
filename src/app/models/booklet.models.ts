import { DocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';

export class Booklet {
  private _id: string;
  private _userId: string;
  private _ownerEmail!: string;
  private _isOwner: boolean = false;
  private _name: string;
  private _description: string;
  private _isArchived: boolean;
  private _authenticatedUserEmails: string[] = [];

  constructor(
    id: string,
    userId: string,
    name: string,
    description: string,
    authenticatedUserEmails: string[] = []
  ) {
    this._id = id;
    this._userId = userId;
    this._name = name;
    this._description = description;
    this._isArchived = false;
    this._authenticatedUserEmails = authenticatedUserEmails;
  }

  set id(id: string) {
    this._id = id;
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

  get isOwner(): boolean {
    return this._isOwner;
  }

  set ownerEmail(ownerEmail: string) {
    this._ownerEmail = ownerEmail;
  }

  get ownerEmail(): string {
    return this._ownerEmail;
  }

  public addAuthenticatedUserEmail(emailToAdd: string): void {
    if (this.isOwner && emailToAdd == this._ownerEmail) return;

    if (!this._authenticatedUserEmails.includes(emailToAdd))
      this._authenticatedUserEmails.push(emailToAdd);
  }

  public removeAuthenticatedUserEmail(emailToRemove: string): void {
    const index = this._authenticatedUserEmails.indexOf(emailToRemove);
    if (index !== -1) this._authenticatedUserEmails.splice(index, 1);
  }

  public setOwnerInfo(currentUserId: string, currentUserEmail: string) {
    if (currentUserId == this._userId) {
      this._isOwner = true;
      this._ownerEmail = currentUserEmail;
      this.removeAuthenticatedUserEmail(currentUserEmail);
    }
  }
}

export const bookletConverter = {
  toFirestore: (booklet: Booklet) => {
    // inject owner email if current user is owner
    if (booklet.isOwner || booklet.ownerEmail != null) {
      if (!booklet.authenticatedUserEmails)
        booklet.authenticatedUserEmails = [];
      booklet.authenticatedUserEmails.push(booklet.ownerEmail);
    }

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
    if (!data) return new Booklet('', '', '', '');
    return new Booklet(
      snapshot.id,
      data['userId'],
      data['name'],
      data['description'],
      data['authenticatedUserEmails']
    );
  },
};

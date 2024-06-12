import { DocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { Booklet } from "../booklet.models";

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
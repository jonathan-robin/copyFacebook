

import {db, storage} from '../firebase';

    export class User {
        constructor (BirthDate, FullName, Name, Sex, id, Etudes, Habite, Originaire ) {
            this.BirthDate = BirthDate;
            this.FullName = FullName;
            this.Name = Name;
            this.Sex = Sex;
            this.id = id;
            this.Etudes = Etudes;
            this.Habite = Habite;
            this.Originaire = Originaire;
        }
        toString() {
            return this.FullName + ', ' + this.Name + ', ' + this.BirthDate + ', ' + this.Sex + ', ' + this.id + ', ' + this.Etudes + ', ' + this.Habite + ', ' + this.Originaire
        }
    }
    
    // Firestore data converter
    export var userConverter = {
        toFirestore: function(user) {
            return {
                BirthDate: user.BirthDate,
                FullName: user.FullName,
                Name: user.Name,
                Sex: user.Sex,
                id: user.id,
                Etudes: user.Etudes,
                Habite: user.Habite,
                Originaire: user.Originaire,
                };
        },
        fromFirestore: function(snapshot, options){
            const data = snapshot.data(options);
            return new User(data.BirthDate, data.FullName, data.Name, data.Sex, data.id, data.Etudes, data.Habite, data.Originaire);
        }
    };

    export const getLaPhoto = (id) => {
        console.log(id);
                    var urlFriend = '';

                    storage
                    .ref(id+"profilActif")
                    .child('profilPictureActive')
                    .getDownloadURL()
                    .then(url => {
                        console.log(url)
                        urlFriend = url
                    });
                    console.log(urlFriend);
            return urlFriend;
    };

    export const getLesInfosNoms= (id) => {
        var user = '';
        db.collection("users").doc(id)
        .withConverter(userConverter)
        .get().then(function(doc) {
            if (doc.exists){
                user = (doc.data());
            } else {
            console.log("No such document!");
            }}).catch(function(error) {
            console.log("Error getting document:", error);
            });
            return user;
    }



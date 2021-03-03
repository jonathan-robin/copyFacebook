import React, { useContext, useState, useEffect } from 'react'
import { auth, db, storage } from '../firebase.js';
import 'firebase';
import 'firebase/database';
import firebase from 'firebase/app'

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe
    }, [])

    function signup(email, password, prenom, nom, day, month, year, sex) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut();
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    async function updateEtudes(Etudes) {
        return await db.collection('/users').doc(currentUser.uid).update({
            Etudes: Etudes
        })
    }
    async function updateOrigine(Originaire) {
        return await db.collection('/users').doc(currentUser.uid).update({
            Originaire: Originaire
        })
    }
    async function updateHabite(Habite) {
        return await db.collection('/users').doc(currentUser.uid).update({
            Habite: Habite
        })
    }
    async function updateNaissance(BirthDate) {
        return await db.collection('/users').doc(currentUser.uid).update({
            BirthDate: BirthDate
        })
    }

    function addFriends(idFriend) {
        db.collection('/inviteSend' + currentUser.uid).doc(idFriend).set({
            idStatus: 'send',
            idFriend: idFriend,
            Date: new Date()
        })
        db.collection('/inviteRecu' + idFriend).doc(currentUser.uid).set({
            idStatus: 'recu',
            idFriend: currentUser.uid,
            Date: new Date()
        })
    }

    function accepterInvitation(idFriend, userId) {
        db.collection("Amis" + currentUser.uid).doc(idFriend).set({
            idFriend: idFriend,
        })
        db.collection('/inviteRecu' + currentUser.uid).doc(idFriend).delete();

        db.collection("Amis" + idFriend).doc(currentUser.uid).set({
            idFriend: idFriend,
        })
        db.collection('/inviteSend' + idFriend).doc(currentUser.uid).delete();
    }

    function refuserInvitation(idFriend, userId) {
        db.collection('/inviteRecu' + currentUser.uid).doc(idFriend).delete();
    }

    async function askFriendList(id) {
        var idFriendRequest = []
        await db.collection('/inviteRecu' + id).get()
            .then(snapshot => {
                snapshot.docs.forEach(collec => {
                    idFriendRequest.push({ id: collec.id });
                })
            })
        return idFriendRequest;
    }

    async function getFriendsList(id) {
        var idFriend = [];
        await db.collection('Amis' + id).get()
            .then(snapshot => {
                snapshot.docs.forEach(collec => {
                    idFriend.push({ id: collec.id });
                })
            })
        return idFriend
    }

    function FriendResponse(idFriend) {
        db.collection('/listAmis' + currentUser.uid).add({
            idFriend: idFriend,
            Date: new Date(),
        })
    }

    async function getAllUsers() {
        var users = []
        const snapshot = await firebase.firestore().collection('users').get()
        users = snapshot.docs.map(doc => doc.data());
        return users
    };

    function sendInfos(name, fullname, day, month, year, sex, user) {

        return db.collection("/users").doc(user.uid).set({
            BirthDate: day + '/' + month + '/' + year,
            FullName: fullname,
            Name: name,
            Sex: sex,
            id: user.uid,
            Etudes: '',
            Habite: '',
            Originaire: '',
        });
    }



    const value = {
        currentUser,
        login,
        signup,
        sendInfos,
        logout,
        resetPassword,
        updateEtudes,
        updateOrigine,
        updateHabite,
        updateNaissance,
        addFriends,
        FriendResponse,
        askFriendList,
        accepterInvitation,
        getFriendsList,
        refuserInvitation,
        getAllUsers
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}


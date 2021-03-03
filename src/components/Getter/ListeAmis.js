import React, { useState, useEffect } from 'react'
import '../../styles/listeAmis.css';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../firebase';
import { userConverter } from '../getInfos';

function ListeAmis(props) {
    const { currentUser, getFriendsList } = useAuth();
    const [user, setUser] = useState();
    const history = useHistory();
    var userAccountListeAmis = [];
    var lesPublications = [];
    var userdata = []
    const [data, setdata] = useState(0)

    useEffect(() => {
        setTimeout(() => {
            setdata(data + 1)
        }, 1000)
    }, [props.listeAmis])

    const getPubli = async (userAccount) => {
        await db.collection('Publications' + userAccount.infos.id).get()
            .then(res => res.docs.map(
                async doc => {
                    var laPubli = [];
                    laPubli = doc.data();
                    var lesCom = []
                    db.collection('Commentaires' + doc.data().idPost).get()
                        .then(com => com.docs.map(
                            doc =>
                                lesCom.push(doc.data())
                        ))
                    lesPublications.push({ doc: laPubli, com: lesCom })
                }
            ))
        return lesPublications
    }

    const getUser = async () => {
        await db.collection('/users').doc(currentUser.uid)
            .withConverter(userConverter)
            .get().then(function (doc) {
                if (doc.exists) {
                    userdata = (doc.data());
                }
            })
        return userdata;
    }

    const getFriends = async (idAmis) => {
        await idAmis.map(async request => {
            await db.collection('/users').doc(request.id).get()
                .then(res => {
                    storage
                        .ref(res.id + "/profilActif/")
                        .child('profilPictureActive')
                        .getDownloadURL()
                        .then(url => {
                            userAccountListeAmis.push({ infos: res.data(), url: url })
                        });
                }
                );
        })
        return userAccountListeAmis;
    }

    const HandleClickAmisProfile = (userAccount, props) => {
        var urlCouvUserVisited = 'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + userAccount.infos.id + '%2FcouvertureActive%2FcouvertureCropActive%2Fcouv?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'
        var urlProfilUserVisited = 'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + userAccount.infos.id + '%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'
        var urlProfil = 'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + currentUser.uid + '%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'

        getFriendsList(userAccount.infos.id).then(async idAmis => {
            Promise.all([await getFriends(idAmis), await getPubli(userAccount), await getUser()])
                .then((infos) => {
                    history.push({ pathname: '/reload' })
                    history.push({
                        pathname: '/visitingProfile',
                        state: {
                            userAccountListeAmis: infos[0],
                            userActif: infos[2],
                            user: userAccount.infos,
                            urlCouv: urlCouvUserVisited,
                            urlProfil: urlProfilUserVisited,
                            pp: urlProfil,
                            megaUser: props.megaUser,
                            lesPublicationsUserVisited: infos[1]
                        }
                    })
                }
                )
        })
    }

    return (
        <div className='deuxiemeDiv'>
            <div className='gridAmis'>
                {props.listeAmis.map(element => {
                    return <div className='portraitAmis' key={element.infos.id}
                        onClick={() =>
                            HandleClickAmisProfile(element, props)
                        }>
                        <div className='photoAmis'>
                            <img src={element.url} className='imgProfileListe' />
                        </div>
                        <div className='nomAmis'>
                            {element.infos.FullName} {element.infos.Name}
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}
export default ListeAmis

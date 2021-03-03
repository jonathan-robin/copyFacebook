import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../firebase';
import firebase from 'firebase/app';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FriendRequest } from './FriendRequest.js';
import RechercheFacebook from './RechercheFacebook';
import '../../styles/bandeauNav.css';
import logofb from '../../resources/fblogo.png';
import loupe from '../../resources/loupe.svg';
import messenger from '../../resources/messenger.png';
import accueil from '../../resources/home.png';
import friends from '../../resources/friends.png';
import video from '../../resources/video-player.png';
import marketplace from '../../resources/shopping-store.png';
import group from '../../resources/group.png';
import addUser from '../../resources/add-friend.svg'
import logoutImg from '../../resources/logout.svg'
import notification from '../../resources/notif.svg';

function Nav(props) {
    const { currentUser, logout, askFriendList } = useAuth();
    const [clicRecherche, setClicRecherche] = useState(false);
    const [clickFriendRequest, setClickFriendRequest] = useState(false);
    const [friendsRequest, setFriendsRequest] = useState(props.FriendsRequest)
    const history = useHistory();

    var handleClickFriendRequest = () => {
        setTimeout(() => {
            setClickFriendRequest(true);
        }, 1000)
    }
    var handleClickProfil = () => {
        var urls = [];
        var storageRef = firebase.storage().ref(props.currentUser.uid + '/profil/');
        storageRef.listAll().then(function (result) {
            result.items.forEach(function (imageRef) {
                imageRef.getDownloadURL()
                    .then(url => {
                        urls.push(url);
                    })
            })
        })
        history.push({
            pathname: '/',
            state: {
                allUsers: props.megaUser.allUser,
                user: props.currentUser,
                listeAmis: props.megaUser.lesAmis,
                requestFriends: friendsRequest,
                urls: urls,
                lesPublications: props.megaUser.lesPublications
            }
        })
    }

    var handleClose = () => {
        setClicRecherche(false);
        setClickFriendRequest(false);
        var requestFriends = [];
        props.getAfterFriendsRequest();
        askFriendList(currentUser.uid)
            .then(idRequestFriends => idRequestFriends.map(request => {
                db.collection('/users').doc(request.id).get()
                    .then(res => {
                        storage
                            .ref(res.id + "/profilActif/")
                            .child('profilPictureActive')
                            .getDownloadURL()
                            .then(url => {
                                requestFriends.push({ infos: res.data(), url: url })
                            });
                    })
            }))
        setFriendsRequest(requestFriends);
    }

    var handleClickRecherche = () => {
        setClicRecherche(true)
    }

    var handleClickDashboard = () => {
        history.push({
            pathname: '/dashboard',
            state: {
                megaUser: {
                    lesAmis: props.lesAmis,
                    user: props.currentUser,
                    urlFinal: props.urlFinal,
                    photoProfil: props.photoProfil,
                    allUser: props.allUser,
                    lesPublications: props.lesPublications
                },
                friendsRequest: friendsRequest,
                currentUser: props.currentUser,
                lesPublicationsDashboard: props.lesPublicationsDashboard
            }
        })
    }

    return (
        <div className='BandeauNav' style={{ position: 'sticky', top: '0px' }}>
            <div className='BandeauNavLeft'>
                <img src={logofb} className='fblogo' />
                <div className='rechercheLoupe'>
                    <img src={loupe} className='loupe' /> <div className='textLoupe' onClick={() => { handleClickRecherche() }}>Rechercher sur Facebook</div>
                </div>
                {clicRecherche && <RechercheFacebook megaUser={props.megaUser} pp={props.photoProfil} handleClose={handleClose} show={clicRecherche} />}
            </div>
            <div className='BandeauNavMiddle'>
                <div className='Home'>
                    <img className='Homeimg' src={accueil} onClick={handleClickDashboard} />
                </div>
                <div className='FriendsList'>
                    <img className='friendsimg' src={friends} />
                </div>
                <div className='Watch'>
                    <img className='videoimg' src={video} />
                </div>
                <div className='Marketplace'>
                    <img className='marketplaceimg' src={marketplace} />
                </div>
                <div className='Group'>
                    <img className='groupimg' src={group} />
                </div>
            </div>
            <div className='BandeauNavRight'>
                <div className='AutourBoutton' >
                    <img className='bouton4' src={logoutImg} onClick={logout} />
                </div>
                <div className='AutourBoutton'> <img className='bouton3' src={notification} /></div>
                <div className='AutourBoutton'>
                    <img className='bouton2' src={messenger} /></div>
                {clickFriendRequest && <FriendRequest friendsRequest={friendsRequest} show={clickFriendRequest} handleClose={handleClose} />}
                <div className='AutourBoutton'> <img className='bouton1' src={addUser} onClick={() => { handleClickFriendRequest() }} /></div>
                <div className='AutourBouttonProfil' onClick={handleClickProfil}><img className='imgProfile' src={props.photoProfil} /><div className='profilText'>{props.currentUser.Name}</div></div>
            </div>
        </div>
    )
}
export default Nav

import React, { useState, useEffect,useMemo } from 'react'
import { useLocation } from 'react-router-dom';
import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import orginaire from '../../resources/originaire.png';
import habite from '../../resources/habite.png';
import etude from '../../resources/etude.png';
import addFriend from '../../resources/addFriend.png';
import messenger from '../../resources/messenger.png'
import anniversaire from '../../resources/birthday-cake.png';
import friendAdded from '../../resources/friendAdded.png'
import Nav from '../Navigation/Nav';
import ListeAmis from '../Getter/ListeAmis';
import LesPublications from '../Getter/LesPublications';
import PublierSurMur from './PublierSurMur';
import '../../styles/VisitingProfile.css';

function VisitingProfile() {

    const [publierPost, setClickPublierPost] = useState(false);
    const [show, setShow] = useState(false);
    const { addFriends, currentUser, getFriendsList} = useAuth();
    const location = useLocation();
    const [urlCouv, setUrlCouv] = useState(location.state.urlCouv);
    const [userVisited, setUserVisited] = useState(location.state.user)
    const [urlProfil, setUrlProfil] = useState(location.state.urlProfil);
    const [userActif, setUserActif] = useState(location.state.userActif)
    const [userAccount, setUserAccount] = useState(location.state.userAccount);
    const [newUrl, setNewUrl] = useState(location.state.pp);
    const [lesAmis, setLesAmis] = useState(location.state.userAccountListeAmis);
    const [megaUser, setMegaUser] = useState(location.state.megaUser);
    const [publiDashboard, setLesPublicationsDashboard] = useState();
    const [lesPublicationsUserVisited, setLesPublicationsUserVisited] = useState(location.state.lesPublicationsUserVisited);
    const handleClose = () => { setShow(false); setClickPublierPost(false) }
    const handleShow = () => { setShow(true) }

    useEffect(() => {
    window.scrollTo(0, 0);
        db.collection('inviteSend' + megaUser.user.id).get()
            .then(function (snapshot) {
                snapshot.forEach(function (doc) {
                    if (doc.data().idFriend === userVisited.id) {
                        document.getElementById("BtnAddFriend").style.display = 'none';
                        document.getElementById("invitEnvoye").style.display = 'block';
                    }
                })
            })
        var amis = megaUser.lesAmis.filter(e => userVisited.id === e.infos.id)
        if (amis.length > 0) {
            document.getElementById("BtnAddFriend").style.display = 'none';
            document.getElementById("Amis").style.display = 'block';
        }
        var lesPublicationsDashboard = [];
        megaUser.lesAmis.map(async ami => {
            await db.collection('Publications' + ami.infos.id).get()
                .then(res => res.docs.map(
                    doc => {
                        var laPubli = [];
                        laPubli = doc.data();
                        var lesCom = []
                        db.collection('Commentaires' + doc.data().idPost)
                            .orderBy('timestamp', 'desc')
                            .get()
                            .then(com => com.docs.map(
                                doc =>
                                    lesCom.push(doc.data())
                            ))
                        lesPublicationsDashboard.push({ doc: laPubli, com: lesCom })
                    }
                ))
        })
        setLesPublicationsDashboard(lesPublicationsDashboard)
    }, [])

    var handleClickPublierPost = () => {
        setClickPublierPost(true);
    }
    var handleClickAddFriend = () => {
        addFriends(userVisited.id);
        document.getElementById('BtnAddFriend').style.display = 'none';
        document.getElementById('invitEnvoye').style.display = 'block';
        document.getElementById('Amis').style.display = 'none';
    }

    var getAfterFriendsRequest = async () => {
        var listeAmis = [];
        await getFriendsList(currentUser.uid)
            .then(idAmis => {
                idAmis.map(request => {
                    db.collection('/users').doc(request.id).get()
                        .then(res => {
                            storage
                                .ref(res.id + "/profilActif/")
                                .child('profilPictureActive')
                                .getDownloadURL()
                                .then(url => {
                                    listeAmis.push({ infos: res.data(), url: url })
                                });
                        }
                        );
                }); return setLesAmis(listeAmis)
            })
    }

    var getComs = async (laPubli) => {
        var lesCom = [];
        await db.collection('Commentaires' + laPubli.idPost)
            .orderBy('timestamp', 'desc')
            .get()
            .then(com => com.docs.map(doc => {
                lesCom.push(doc.data())
            }))
        return lesCom
    }
    var getPubli = async (id) => {
        var lesPubli = [];
        db.collection('Publications' + id)
            .orderBy('Date', 'desc')
            .get()
            .then(res => res.docs.map( async doc => {
                var laPubli = doc.data();
                await getComs(laPubli)
                .then(res => lesPubli.push({doc: laPubli, com: res}))
                })
            )
            return lesPubli
    }

    const getNewCommentaires = async () => {
        await getPubli(userVisited.id)
        .then(res => {
            setLesPublicationsUserVisited(res)
        })
    }

    return (
        <div>
            <div>

                <Nav megaUser={megaUser} currentUser={userActif} photoProfil={newUrl} FriendsRequest={location.state.megaUser.requestFriends} 
                lesAmis={megaUser.lesAmis} urlFinal={megaUser.urlFinal} allUser={megaUser.allUser} lesPublications={megaUser.lesPublications}
                getAfterFriendsRequest={getAfterFriendsRequest} lesPublicationsDashboard={publiDashboard}/>
                <div className='Couv'>
                    <div className='CouvCenter'>
                        <img src={urlCouv} className='imgCouv' />
                        <div className='basCouv'>
                            <div className='ChangerCouv'>
                            </div>
                            <div className='profilPicture'>
                                <img className='imgPP' src={urlProfil} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='InfoNoms'>
                    <div className='ProfilNom'>{userVisited.FullName} {userVisited.Name}</div>
                    <div className='ajouterbio'></div>
                </div>
                <div className='MenuProfile'>
                    <div className='addFriend' id='BtnAddFriend' onClick={() => handleClickAddFriend()}>
                        <img src={addFriend} className='ImgMenuProfile' />
                    </div>
                    <div className='Friend' id='Amis' style={{ display: 'none', cursor: 'auto' }}><img src={friendAdded} className='ImgMenuProfile t' /></div>
                    <div className='InvitationSend' id='invitEnvoye' style={{ display: 'none', cursor: 'auto' }}>Invitation envoyé</div>
                    <div className='sendMessage'>
                        <img src={messenger} className='ImgMenuProfile' />
                    </div>
                </div>
            </div>
            <div className='ProfileBack'>
                <div className='ProfileContent'>
                    <div className='ProfilLeft'>
                        <div className='Intro'>
                            <p className='IntroText'>Intro</p>
                            {userVisited.BirthDate != '' ?
                                <div className='InfoIntro'>
                                    <img src={anniversaire} className='logointro' /> Anniversaire : {userVisited.BirthDate}
                                </div> : null}
                            {userVisited.Etudes != '' ?
                                <div className='InfoIntro'>
                                    <img src={etude} className='logointro' /> A étudié à {userVisited.Etudes}
                                </div> : null}
                            {userVisited.Habite != '' ?
                                <div className='InfoIntro'>
                                    <img src={habite} className='logointro' /> Habite à {userVisited.Habite}
                                </div> : null}
                            {userVisited.Originaire != '' ?
                                <div className='InfoIntro'>
                                    <img src={orginaire} className='logointro' /> De {userVisited.Originaire}
                                </div> : null}
                            {userVisited.Sex != '' ?
                                <div className='InfoIntro'>
                                    <img src={orginaire} className='logointro' /> Sexe : {userVisited.Sex}
                                </div> : null}
                        </div>
                        <div className='PhotosIntro'>
                            <div className='IntroText'>Photos</div>
                            <p className='ToutesLesPhotos'>Toutes les photos</p>
                            <div className='CarouselPhotos'>
                            </div>
                        </div>
                        <div className='cont'>
                            <div className='premiereDiv'>
                                <div className='AmisLeft'>Amis</div>
                                <div className='TousLesAmisRight'>Tous les amis</div>
                            </div>
                            {lesAmis && <ListeAmis megaUser={megaUser} listeAmis={lesAmis} />}
                        </div>
                    </div>
                    <div className='ProfilRight'>
                        <div className='PublierPost'>
                            <img className='imgProfilePublierPost' src={newUrl} />
                            <div className='QueVoulezVousDire' onClick={handleClickPublierPost}>
                                <p className='QVVDtext'>Publier sur le mur de {userVisited.FullName} {userVisited.Name} ...</p>
                            </div>
                            {publierPost && <PublierSurMur userVisited={userVisited} megaUser={megaUser} currentUser={currentUser} show={publierPost} handleClose={handleClose} handleShow={handleShow} />}                        </div>
                        {lesPublicationsUserVisited && <LesPublications addPublications={getNewCommentaires} lesPublications={lesPublicationsUserVisited} />}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default VisitingProfile

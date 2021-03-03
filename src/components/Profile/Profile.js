import firebase from 'firebase/app';
import { useAuth } from '../../contexts/AuthContext';
import { storage, db } from '../../firebase';
import { useLocation } from 'react-router-dom';
import { Button, Dropdown } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Nav from '../Navigation/Nav';
import LesPublications from '../Getter/LesPublications';
import { userConverter } from '../getInfos';
import ModifInfos from './ModifInfos';
import PublierPost from './PublierPost';
import ListeAmis from '../Getter/ListeAmis';
import ChangerProfilPicture from './ChangerProfilPicture';
import ImageCropper from './Crop/EasyCrop';
import '../../styles/Profile.css';
import '../../styles/ModalChangerPP.css';
import '../../styles/ProfilePublications.css'
import Redimensionner from '../../resources/crop.png'
import camera from '../../resources/camera.png'
import crayon from '../../resources/crayon.png'
import eye from '../../resources/eye.png'
import loupe from '../../resources/loupe.svg'
import orginaire from '../../resources/originaire.png';
import habite from '../../resources/habite.png';
import etude from '../../resources/etude.png';
import filtre from '../../resources/filter.png';
import gear from '../../resources/gear.png';
import vueGrille from '../../resources/rows.png';
import vueListe from '../../resources/menu.png'
import Delete from '../../resources/delete.png';
import decor from '../../resources/decor.png';
import importer from '../../resources/importer.png';
import anniversaire from '../../resources/birthday-cake.png';
import tagFriends from '../../resources/tagfriend.png';
import picture from '../../resources/image.png'

function Profile() {
    const history = useHistory();
    const location = useLocation();
    if (location.state === undefined){ 
        history.push('/login-signup');
    }
    const { currentUser, logout, askFriendList, getFriendsList } = useAuth();
    const [requestFriends, setRequestFriends] = useState(location.state.requestFriends)
    const [lesAmis, setLesAmis] = useState(location.state.listeAmis);
    const [user, setUser] = useState(location.state.user);
    const [allUser, setAllUser] = useState(location.state.allUsers)
    const [urlFinal, setUrlFinal] = useState(location.state.urls);
    const [lesPublications, setLesPublications] = useState(location.state.lesPublications)
    const [newUser, setNewUser] = useState(location.state.newUser);
    const [urlCouv, setUrlCouv] = useState('https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + currentUser.uid + '%2FcouvertureActive%2FcouvertureCropActive%2Fcouv?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3');
    const [urlCouvOriginal, setUrlCouvOriginal] = useState('https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + currentUser.uid + '%2FcouvertureActive%2FcouvertureOriginaleActive%2Fcouv?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3');
    const [newUrl, setNewUrl] = useState('https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + currentUser.uid + '%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3');
    const [inputImg, setInputImg] = useState('')
    const [etargetfiles, setetargetfiles] = useState();
    const [imageCouv, setImageCouv] = useState();
    const [blob, setBlob] = useState(null)
    const [clickModifProfil, setClickModifProfil] = useState(false);
    const [publierPost, setClickPublierPost] = useState(false);
    const [show, setShow] = useState();
    const [megaUser, setMegaUser] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [publiDashboard, setLesPublicationsDashboard] = useState();

    useEffect(() => {
        setMegaUser({
            requestFriends: requestFriends,
            lesAmis: lesAmis,
            user: user,
            urlFinal: urlFinal,
            photoProfil: newUrl,
            allUser: allUser,
            lesPublications: lesPublications
        })
    }, [user], [lesAmis], [lesPublications], [requestFriends], [newUrl], [allUser])

    useEffect(() => {
        var lesPublicationsDashboard = [];
        lesAmis.map(async ami => {
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

    const handleClose = () => { RecupPhotosProfil(); setShow(false); setClickModifProfil(false); setClickPublierPost(false) };
    const handleShow = () => { RecupPhotosProfil(); setShow(true) };
    const addProfilPicture = (e) => { setUrlFinal([...urlFinal, e]); };
    const getBlob = (blob) => { setBlob(blob); };
    const onInputChange = (e) => { setInputImg(urlCouvOriginal); }
    const handleClickModifProfil = () => { setClickModifProfil(true); }
    const handleClickPublierPost = () => { setClickPublierPost(true); }
    const setNewPP = (url) => { setNewUrl(url); }

    async function handleSubmitImage(e) {
        const uploadTask = storage.ref(currentUser.uid + "/couvertureActive/" + '/couvertureCropActive/' + "couv").put(blob, { contentType: blob.type });
        uploadTask.on(
            "state_changed",
            snapshot => { },
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref(currentUser.uid + "/couvertureActive/" + '/couvertureCropActive/')
                    .child('couv')
                    .getDownloadURL()
                    .then(url => {
                        setUrlCouv(url)
                    });
            }
        );
        setInputImg(false)
        var nomImage = new Date().toString();
        const uploadSecondTask = storage.ref(currentUser.uid + "/couverture/" + nomImage).put(blob, { contentType: blob.type });
        uploadSecondTask.on(
            "state_changed",
            snapshot => { },
            error => {
                console.log(error);
            },
            () => {
                storage

                    .ref(currentUser.uid + "/couverture/")
                    .child(nomImage)
                    .getDownloadURL()
            }
        );
    }

    var RecupPhotosProfil = () => {
        var lesUrls = [];
        var storageRef = firebase.storage().ref(currentUser.uid + '/profil/');
        storageRef.listAll().then(function (result) {
            result.items.forEach(function (imageRef) {
                imageRef.getDownloadURL()
                    .then(url => {
                        lesUrls.push(url);
                    })
            })
        }
        )
        return lesUrls;
    }
    async function handleChange(e) {
        if (e.target.files[0]) {
            setImageCouv(e.target.files[0])
        };
        const uploadTask = storage.ref(currentUser.uid + "/couvertureActive/" + '/couvertureOriginaleActive/' + "couv").put(e.target.files[0]);
        uploadTask.on(
            "state_changed",
            snapshot => { },
            error => {
                console.log(error);
            },
            () => {
                storage

                    .ref(currentUser.uid + "/couvertureActive/" + '/couvertureOriginaleActive/')
                    .child('couv')
                    .getDownloadURL()
                    .then(url => {
                        setUrlCouv(url)
                        setUrlCouvOriginal(url);
                    });
            }
        );
        setetargetfiles(e.target.files[0])
    }

    var getComs = async (laPubli) => {
        var lesCom = [];
        db.collection('Commentaires' + laPubli.idPost)
            .orderBy('timestamp', 'desc')
            .get()
            .then(com => com.docs.map(doc => {
                lesCom.push(doc.data())
            }))
        return lesCom
    }

    var getPubli = async () => {
        var lesPubli = [];
        await db.collection('Publications' + user.id)
            .orderBy('timestamp', 'desc')
            .get()
            .then(res => res.docs.map(async doc => {
                await getComs(doc.data())
                    .then(res => lesPubli.push({ doc: doc.data(), com: res }))
            }
            ))
        return lesPubli
    }

    var addPublications = async () => {
        await getPubli()
            .then(res => setLesPublications(res))
    }

    var handleClickModifInfos = async () => {
        await db.collection("/users").doc(user.id)
            .withConverter(userConverter)
            .get()
            .then(doc => { setUser(doc.data()) })
    }

    var getAfterFriendsRequest = async () => {
        var listeAmis = [];
        await getFriendsList(user.id)
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

    return (
        <>
            <Nav lesPublicationsDashboard={publiDashboard} lesAmis={lesAmis} urlFinal={urlFinal} allUser={allUser} lesPublications={lesPublications}
                megaUser={megaUser} currentUser={user} photoProfil={newUrl} FriendsRequest={requestFriends} getAfterFriendsRequest={getAfterFriendsRequest} />
            <div className='fond'>
                {inputImg && (
                    <>
                        <form onSubmit={handleSubmitImage}>
                            <ImageCropper className='containerCropper' getBlob={getBlob} inputImg={inputImg}/>
                            <div className='controls'>
                                <Button type='submit' onClick={handleSubmitImage}>Valider</Button>
                                <Button >Annuler</Button>
                            </div>
                        </form>
                    </>
                )}
                <div style={{ visibility: inputImg ? 'hidden' : 'visible' }}>
                    <div className='Couv'>
                        <div className='CouvCenter'>
                            <img src={urlCouv} className='imgCouv' />
                            <div className='basCouv'>
                                <div className='ChangerCouv'>
                                    <Dropdown style={{ visibility: inputImg ? 'hidden' : 'visible' }}>
                                        <Dropdown.Toggle key='down' className='dropdownCouv' id="dropdown-basic">
                                            <img className='camera' src={camera} /> Changer la photo de couverture
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item><img className='iconpp' src={decor} />Selectionner une photo</Dropdown.Item>
                                            <label className='importer2' type='file'><input className='inputFichier' onChange={handleChange} type='file' /><img className='iconpp' src={importer} />Importer une photo</label>
                                            <Dropdown.Item><img className='iconpp' src={Delete} />Supprimer</Dropdown.Item>
                                            <Dropdown.Item onClick={() => { onInputChange() }}><img className='iconpp' src={Redimensionner} />Redimensionner</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className='profilPicture' style={{ visibility: inputImg ? 'hidden' : 'visible' }}>
                                    <img className='imgPP' src={newUrl} />
                                    <img className='changerpp' src={camera} onClick={handleShow} />
                                    {show ?
                                        <ChangerProfilPicture addProfilPicture={addProfilPicture} UrlDesPhotos={urlFinal} newUrl={setNewPP} show={show} currentUser={currentUser} handleClose={handleClose} handleShow={handleShow} /> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='InfoNoms'>
                        <div className='ProfilNom'>{user.FullName} {user.Name}</div>
                        <div className='ajouterbio'>Ajouter une bio</div>
                    </div>
                    <div className='MenuProfile'>
                        <div className='MenuProfileContent'>
                            <div className='Publications'>Publications</div>
                            <div className='Propos'>A propos</div>
                            <div className='Amis'>Amis</div>
                            <div className='Photos'>Photos</div>
                            <div className='Plus'>Plus</div>
                            <div className='ModifProfil' onClick={() => { handleClickModifProfil() }}>
                                <img className='crayon' src={crayon} /> Modifier le Profil
                            </div>
                        </div>
                        <div className='MenuProfilContentResize'>
                            <div className='ModifProfil' onClick={() => { handleClickModifProfil() }}>
                                <img className='crayon' src={crayon} /> Modifier le Profil
                            </div>
                        </div>
                        {clickModifProfil ?
                            <ModifInfos ModifInfos={handleClickModifInfos} newUrl={setNewPP} show={clickModifProfil} currentUser={user} handleClose={handleClose} handleShow={handleShow} /> : null}
                        <div className='Oeil'>
                            <img className='eye' src={eye} />
                        </div>
                        <div className='loupeRechercheProfil'>
                            <img className='loupe2' src={loupe} />
                        </div>
                        <div className='paramsuppl'>
                            ...
                        </div>
                    </div>
                </div>
                <div className='ProfileBack' style={{ visibility: inputImg ? 'hidden' : 'visible' }}>
                    <div className='ProfileContent'>
                        <div className='ProfilLeft'>
                            <div className='Intro'>
                                <p className='IntroText'>Intro</p>
                                {user.BirthDate != '' ?
                                    <div className='InfoIntro'>
                                        <img src={anniversaire} className='logointro' /> Anniversaire : {user.BirthDate}
                                    </div> : null}
                                {user.Etudes != '' ?
                                    <div className='InfoIntro'>
                                        <img src={etude} className='logointro' /> A étudié à {user.Etudes}
                                    </div> : null}
                                {user.Habite != '' ?
                                    <div className='InfoIntro'>
                                        <img src={habite} className='logointro' /> Habite à {user.Habite}
                                    </div> : null}
                                {user.Originaire != '' ?
                                    <div className='InfoIntro'>
                                        <img src={orginaire} className='logointro' /> De {user.Originaire}
                                    </div> : null}
                                {user.Sex != '' ?
                                    <div className='InfoIntro'>
                                        <img src={orginaire} className='logointro' /> Sexe : {user.Sex}
                                    </div> : null}
                                <div className='BoutonsModifIntro' onClick={() => handleClickModifProfil()}>
                                    Modifier les infos
                                </div>
                                <div className='BoutonsModifIntro v2'>
                                    Ajouter des loisirs
                                </div>
                                <div className='BoutonsModifIntro v2'  >
                                    Modifier la une
                                </div>
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
                            <div className='Publier'>
                                <div className='PublierPost'>
                                    <img className='imgProfilePublierPost' src={newUrl} />
                                    <div className='QueVoulezVousDire' onClick={handleClickPublierPost}>
                                        <p className='QVVDtext'> Que voulez-vous dire ? </p>
                                    </div>
                                    {publierPost &&
                                        <PublierPost addPublications={addPublications} megaUser={megaUser} currentUser={currentUser} show={publierPost} handleClose={handleClose} handleShow={handleShow} />}
                                </div>
                                <div className='AjouterPost'>
                                    <div className='AjouterPhoto'>
                                        <img src={picture} className='addPicture' /><div className='AjouterPhotoText'>Photo/Vidéo</div>
                                    </div>
                                    <div className='TagFriends'>
                                        <img src={tagFriends} className='TagFriend' /><div className='TagFriendText'>Identifier des amis</div>
                                    </div>
                                </div>
                            </div>
                            <div className='FiltrerPublications'>
                                <div className='publifiltr'>
                                    <div className='IntroText'>Publications</div>
                                    <div className='Filtres'><img src={filtre} className='filtre' />Filtres</div>
                                    <div className='FiltresResize'><img src={filtre} className='filtre' /></div>
                                    <div className='gérerpubli'><img src={gear} className='filtre' />Gérer les publications</div>
                                    <div className='gérerpubliResize'><img src={gear} className='filtre' /></div>
                                </div>
                                <div className='switchVuepubli'>
                                    <div className='vueListe'>
                                        <img src={vueListe} className='filtre' /><div className='VueListeTxt'>Vue Liste</div></div>
                                    <div className='vueGrille'>
                                        <img src={vueGrille} className='filtre' /><div className='VueGrilleTxt'>Vue Grille</div></div>
                                </div>
                            </div>
                            <LesPublications addPublications={addPublications} lesPublications={lesPublications} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Profile

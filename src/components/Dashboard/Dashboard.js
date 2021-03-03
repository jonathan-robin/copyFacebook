import React,{useState, useEffect, useMemo} from 'react'
import '../../styles/Dashboard.css';
import {useAuth} from '../../contexts/AuthContext';
import {useLocation} from 'react-router-dom';
import {db,storage} from '../../firebase'

import masque from '../../resources/masque.svg'; 
import video from '../../resources/video-player.png'; 
import plus from '../../resources/plus.svg'; 
import group from '../../resources/group.png'; 
import clock from '../../resources/clock.svg'; 
import calendar from '../../resources/calendar.svg'; 
import flag from '../../resources/flag.svg'; 
import marketplace from '../../resources/shopping-store.png'; 
import friend from '../../resources/addFriend.png'; 
import birthday from '../../resources/birthday-cake.svg';
import loupe from '../../resources/loupe.svg';
import camera from '../../resources/camera.png';
import tagFriends from '../../resources/tagfriend.png';
import cameraVideo from '../../resources/camera-video.svg'
import picture from '../../resources/image.png'
import firebasePhoto from '../../resources/firebase.png'; 
import reactPhoto from '../../resources/reactjs.jpg';
import nodePhoto from '../../resources/nodejs.png'
import bootstrapPhoto from '../../resources/bootstrapPhoto.pgn.png';
import githubPhoto from '../../resources/github.png';

import Nav from '../Navigation/Nav';
import PublierPost from '../Profile/PublierPost';

import LesPublications from '../Getter/LesPublications';

import Salon from './Salon';
import Chat from './Chat';
import Contacts from './Contacts';

function Dashboard() {
    const location = useLocation(); 
    const {currentUser, getFriendsList} = useAuth(); 
    const [show, setShow] = useState(false);
    const [publierPost, setClickPublierPost] = useState(false);
    const [newUrl, setNewUrl] = useState('https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/'+currentUser.uid+'%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3')
    const [user, setUser] = useState(location.state.megaUser.user)
    const [lesPublications, setLesPublications] = useState(location.state.lesPublicationsDashboard);
    const [lesAmis, setLesAmis] = useState(location.state.megaUser.lesAmis);
    const [chat, setChat] = useState([]);
    const [openChat, setOpenChat] = useState(false);
    const [megaUser, setMegaUser] = useState(location.state.megaUser); 
    const [sender, setSender] = useState(location.state.megaUser.user);

    useEffect(() => { 
        window.scroll(0, 0);
    },[])

        var getComs = async (data) => {
            var lesCom = []; 
            await db.collection('Commentaires'+ data.idPost)
            .orderBy('timestamp', 'desc')
            .get()
            .then(com => com.docs.map(doc => 
                lesCom.push(doc.data())
            ))
            return lesCom
        }

        var getPubli = async() => {
            var lesPublicationsDashboard=[];
            lesAmis.map(ami => {
                db.collection('Publications'+ami.infos.id).get()
               .then(res => res.docs.map(async doc => {
                    var laPubli = doc.data();
                    await getComs(laPubli)
                    .then(res => lesPublicationsDashboard.push({doc: laPubli, com: res}))
                    })
                )
           })
           return lesPublicationsDashboard;
        }
        
        const getNewCommentaires = useMemo(function() {
            return async function() {
                await getPubli()
                .then(res => (setLesPublications(res)))
            }
        },[lesPublications])

        var getAfterFriendsRequest = async () =>{
            var listeAmis=[];
            await getFriendsList(user.id)
            .then(idAmis => {idAmis.map(request => {
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
        }
          )
          
        }

console.log('render Dashboard')
    // var getNewCommentaires = async () => {
    //     await getPubli()
    //     .then(res => (setLesPublications(res)))
    // }

    // useEffect(() =>{ 
    //     setTimeout(() => { 
    //         setLoading(loading+1)
    //     },1000)
    // },[lesPublications])

    // var addPublications = async() => {
    //     var lesPubli = [];
    //     await db.collection('Publications'+user.id)
    //     .orderBy('timestamp', 'desc')
    //     .get()
    //     .then(res => res.docs.map(async doc =>  {
    //       await getComs(doc.data())
    //       .then(res => lesPubli.push({doc: doc.data(), com: res}))
    //     }  
    //     ))
    //     return setLesPublications(lesPubli)
    // }
    // var getComs = async(laPubli) => {
    //     var lesCom = [];
    //     await db.collection('Commentaires'+laPubli.idPost)
    //         .orderBy('timestamp', 'desc')
    //         .get()
    //         .then(com => com.docs.map(doc => {
    //             lesCom.push(doc.data())
    //         }))
    //         return lesCom
    // }
    
    var childSettingChat = (element) => { 
        setOpenChat(true);
        setChat(element);
    }

    const handleClose = () => {setShow(false); setClickPublierPost(false)};
    const handleShow = () =>   {setShow(true)}

    var handleClickPublierPost = () => {
        setClickPublierPost(true);
    }

    var closeChat = () => {
        setOpenChat(false);
    }

return (
<>
        <Nav megaUser={location.state.megaUser} currentUser={location.state.megaUser.user} photoProfil={newUrl} 
        FriendsRequest={location.state.friendsRequest} getAfterFriendsRequest={getAfterFriendsRequest}/>
        <div className='myContainer'>
            <div className='dashboardLeft'>
                <div className='raccourci'><img src={'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/'+currentUser.uid+'%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'} className='profilePicture'/>
                    <div className='raccourciTextProfilePicture'>{user.FullName} {user.Name}</div>
                </div>
                <div className='raccourci'><img src={flag} className='imageShortcut'/>
                <div className='raccourciText'>Pages</div></div>
                <div className='raccourci'><img src={masque} className='imageShortcut'/>
                <div className='raccourciText'>COVID-19 - Centre d'information</div></div>
                <div className='raccourci'><img src={friend} className='imageShortcut'/>
                <div className='raccourciText'>Amis</div></div>
                <div className='raccourci'><img src={group} className='imageShortcutSVG imageShortcut'/>
                <div className='raccourciText'>Groupes</div></div>
                <div className='raccourci'><img src={marketplace} className='imageShortcutSVG imageShortcut'/>
                <div className='raccourciText'>Marketplace</div></div>
                <div className='raccourci'><img src={video} className='imageShortcutSVG imageShortcut'/>
                <div className='raccourciText'>Watch</div></div>
                <div className='raccourci'><img src={calendar} className='imageShortcut'/>
                <div className='raccourciText'>Evenements</div></div>
                <div className='raccourci'><img src={clock} className='imageShortcut'/>
                <div className='raccourciText'>Souvenirs</div></div>
                <div className='raccourci'><img src={plus} className='imageShortcutSVG imageShortcut'/>
                <div className='raccourciText'>Voir plus</div></div>
        <div className='borderbottom'></div>
        <div className='copyrightdashboardleft'>
        Confidentialité  · Conditions générales  · Publicités  · Choix publicitaires   · Cookies  ·   Facebook © 2021
        </div>
            </div>
            <div className='dashboardCenter'>
                <div className='Publier PublierPostDashboard'>
                    <div className='PublierPost'>
                        <img className='imgProfilePublierPost' src={newUrl} />
                        <div className='QueVoulezVousDire' onClick={handleClickPublierPost}>
                           <p className='QVVDtext'> Que voulez-vous dire ? </p>
                        </div>
                            {publierPost && 
                            <PublierPost megaUser={location.state.megaUser} currentUser={currentUser} show={publierPost} handleClose={handleClose} handleShow={handleShow} />}
                    </div>
                    <div className='AjouterPost'>
                        <div className='AjouterPhoto'>
                            <img src={picture} className='addPicture'/>Photo/Vidéo 
                        </div>
                        <div className='TagFriends'> 
                        <img src={tagFriends} className='TagFriend'/>Identifier des amis
                        </div>
                    </div>
                </div>
            <div className='Salon'>
                <div className='AmisDashboard'>
                    <div className='creerUnSalon'>Créer un Salon <img className='imgSalon' src={cameraVideo}/> </div>
                    <Salon listeAmis={location.state.megaUser.lesAmis}/>
                </div>
            </div>
            <div className='Story'>
                <div className='AmisStory'>
                    <div className='AmisStoryFrame'>
                            <img src={firebasePhoto} className='photoProfilStory'/>
                        <img src={'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/'+currentUser.uid+'%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'} className='storyPhoto'/>
                    </div>
                    <div className='AmisStoryFrame'>
                            <img src={reactPhoto} className='photoProfilStory'/>
                        <img src={'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/'+currentUser.uid+'%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'} className='storyPhoto'/>
                    </div>
                    <div className='AmisStoryFrame'>
                            <img src={nodePhoto} className='photoProfilStory'/>
                        <img src={'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/'+currentUser.uid+'%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'} className='storyPhoto'/>
                    </div>
                    <div className='AmisStoryFrame'>
                            <img src={bootstrapPhoto} className='photoProfilStory'/>
                        <img src={'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/'+currentUser.uid+'%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'} className='storyPhoto'/>
                    </div>
                    <div className='AmisStoryFrame'>
                            <img src={githubPhoto} className='photoProfilStory'/>
                        <img src={'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/'+currentUser.uid+'%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'} className='storyPhoto'/>
                    </div>
                </div>
            </div>
           <LesPublications addPublications={getNewCommentaires} lesPublications={lesPublications}/>
            </div>
            <div className='dashboardRight'>
                <div className='Sponsorise'>
                    <div className='sponsor'>
                        <img className='sponsorImg' src='https://scontent.frun2-1.fna.fbcdn.net/v/t45.1600-4/cp0/q90/spS444/s526x296/96161686_6174543889558_4978910867606208512_n.png.jpg?_nc_cat=100&ccb=3&_nc_sid=7e83b1&_nc_ohc=qNe_OKOjUNkAX9mtIBh&_nc_ht=scontent.frun2-1.fna&_nc_tp=31&oh=9252bdc0889fb4363814fea534573465&oe=604A0ECF'/>
                        <div className='txtSponsor'>Time to migrate from Jenkins to CircleCI! </div>
                    </div>
                    <div className='sponsor'>
                        <img className='sponsorImg' src='https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/C001apture.PNG?alt=media&token=a96def0c-6bce-4413-8133-3b5c057d83ba'/>
                        <div className='txtSponsor'>Profitez de -98% sur une sélection de noms de domaine 👉 </div>
                    </div>
                </div>
                <div className='Anniversaires'>
                    <div className='titreAnniversaire'>
                        Anniversaire
                    </div>
                    <div className='AnniversaireAmis'>
                    <img src={birthday} className='imageShortcut'/> <div className='txtAnniv'>C'est l'anniversaire de Dark Vador aujourd'hui.</div>
                    </div>
                </div>
                <div className='Contacts'>
                    <div className='ContactsIntro'>
                        <div className='txtContactsTitre'>Contacts</div> <img className='ActionsContacts' src={camera}/><img className='ActionsContacts' src={loupe}/><div className='troispoints'>...</div>
                    </div>
                    <div className='ContactEnLigne'>
                        <Contacts megaUser={megaUser} setChat={childSettingChat}/>
                    </div>
                </div>
            </div>
            {openChat && <Chat close={() => { closeChat()}} currentUser={currentUser} sender={sender} reciever={chat}/>}
        </div>
        </>
    )
}

export default Dashboard

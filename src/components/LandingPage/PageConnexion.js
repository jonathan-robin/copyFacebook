import firebase from 'firebase/app'
import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import CreerUnCompte from './CreerUnCompte';
import { userConverter } from '../getInfos';
import 'bootstrap/dist/css/bootstrap.css';
import '../../index.css';
import '../../App.css';
import '../../styles/connexion.css';
import boutonsPlus from '../../resources/boutons+.png';
global.jQuery = require('jquery');
require('bootstrap');

function PageConnexion(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const history = useHistory();
  const { login, currentUser, loading, askFriendList, getAllUsers, getFriendsList } = useAuth();
  const [nom, setNom] = useState(null);
  const [prenom, setPrenom] = useState(null);
  const [sex, setSex] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [day, setDay] = useState(null);
  const [newUser, setNewUser] = useState(false);
  const [userData, setUserData] = useState(null);
  const [urls, setUrls] = useState(null);
  const [listeAmis, setListeAmis] = useState(null);
  const [requestFriends, setRequestFriends] = useState(null);
  const [nomUser, setNomUsers] = useState(null);
  const [lesPublications, setLesPublications] = useState(null);
  const [HandlerClickModal, setHandlerClickModal] = useState()

  useEffect(() => {
    setUserData(null);
    setUrls(null);
    setListeAmis(null);
    setRequestFriends(null);
    setNomUsers(null);
    setLesPublications(null)
  }, [])

  var setnewuser = () => {
    setNewUser(true);
  }
  var setnom = (n) => {
    setNom(n);
  }
  var setprenom = (n) => {
    setPrenom(n)
  }
  var HandlerClickButtonLeaveCreateAccount = () => {
    setHandlerClickModal(false);
  }
  var HandlerClickButtonCreateAccount = () => {
    setHandlerClickModal(true);
  }

  const getInfosUser = async (user) => {
    var userdata = [];
    var urls = [];
    var listeAmis = [];
    var requestFriends = [];
    var nomUsers = [];
    var lesPublications = [];

    await db.collection('Publications' + user.uid)
      .orderBy('timestamp', 'desc')
      .get()
      .then(res => res.docs.map(
        async doc => {
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
          lesPublications.push({ doc: laPubli, com: lesCom })
        }
      ))
    await getFriendsList(user.uid)
      .then(idAmis => idAmis.map(request => {
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
      })
      )
    await db.collection("/users").doc(user.uid)
      .withConverter(userConverter)
      .get().then(doc => userdata = (doc.data()))
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    await getAllUsers().then(response => {
      response.map(res => {
        nomUsers.push({ label: res.FullName + ' ' + res.Name, id: res.id })
      })
    })
    var storageRef = firebase.storage().ref(user.uid + '/profil/');
    await storageRef.listAll().then(function (result) {
      result.items.forEach(function (imageRef) {
        imageRef.getDownloadURL()
          .then(url => {
            urls.push(url);
          })
      })
    }
    )
    await askFriendList(user.uid)
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
    setUserData(userdata);
    setUrls(urls);
    setListeAmis(listeAmis);
    setRequestFriends(requestFriends);
    setNomUsers(nomUsers);
    setLesPublications(lesPublications)
    return history.push({
      pathname: '/',
      state: {
        user: userdata,
        urls: urls,
        listeAmis: listeAmis,
        requestFriends: requestFriends,
        allUsers: nomUsers,
        lesPublications: lesPublications
      }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('');
    await login(emailRef.current.value, passwordRef.current.value)
      .then(res => getInfosUser(res.user))
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='ConnexionGlobal' >
      <div className='ConnexionContainer'
        style={{
          opacity: HandlerClickModal ? 0.4 : 1,
          zIndex: HandlerClickModal ? 0 : 1,
        }}
      >
        <div className='contentContent'>
          <div className='ConnexionContent'>
            <div className='ConnexionInformation'>
              <div className='ConnexionRecentes'>
                <div className="logoFacebook">
                  <img className='logoFacebookimg' src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" />
                </div>
                <div className="txtConnexionsRecentes">
                  Connexions récentes
              </div>
                <div className="txtCliquezImages">
                  Cliquez sur votre image ou sur Ajouter un compte.
              </div>
                <div className="CompteEnregistre">
                  <div className='savedAccount removable'>
                  </div>
                  <div className='savedAccount SignUp'>
                    <div className='addAccount'>
                      <div className='addAccount1'>
                        <div className='imgBoutons'><img src={boutonsPlus} /></div>
                        <div className="addAccountText">Ajouter un compte</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='Connexion'>
                {error && <Alert variant='danger'>{error}</Alert>}
                <div className='ConnexionMargin'>
                  <div className='ConnexionMainInfo'>
                    <form className='FormConnexion' onSubmit={handleSubmit}>
                      <div className='inputInfo'>
                        <div className='EmailInfo'>
                          <input className='inputConnexion' ref={emailRef} type="text" name="email" id="email" placeholder="Adresse e-mail ou numéro de tél." />
                        </div>
                        <div className='PasswordInfo'>
                          <input className='inputConnexion' ref={passwordRef} type="password" name="password" id="password" placeholder="Mot de Passe" />
                        </div>
                      </div>
                      <div className='BouttonConnexion'>
                        <button className='buttonCo' type='submit'>Connexion</button>
                      </div>
                      <div className='MdpOublie' >
                        <Link to='/forgot-password'>
                          Mot de passe oublié ?
                      </Link>
                      </div>
                    </form>
                    <div className='BreakForm'></div>
                    <div className='CreeAccountBouton'>
                      <button className='CreateAccountButton' onClick={() => { HandlerClickButtonCreateAccount() }}>Créer un compte</button>
                    </div>
                  </div>
                  <div className='ConnexionBottom'>
                    <a className='Page'>Créer une Page</a> pour une célébrité, un groupe ou une entreprise.
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='ConnexionMentions'>
          <div className='ConnexionMentionsMargin'>
            <div className='pageFooter'>
              <ul><li>Français (France)</li><li>English (US)</li>
                <li>Español (España)</li><li>Deutsch</li>   <li>中文(简体)</li> <li>Italiano</li> <li>العربية</li> <li>Português (Brasil)</li> <li>हिन्दी</li>  <li>日本語</li>
                <li> <button className='plusLangage'>+</button></li></ul>
              <div className='breakLangage'></div>
              <div className='pageFooterChildren'>
                <ul><li>S’inscrire</li><li>Connexion</li>  <li>Facebook</li> <li>Lite</li> <li>Watch</li> <li>Personnes</li> <li>Pages</li> <li>Catégories de Page</li>
                  <li>Lieux</li> <li>Jeux</li> <li>Marketplace</li> <li>Facebook Pay</li>  <li>Groupes</li><li>Offres d’emploi</li> <li>Oculus</li> <li>Portal</li>  <li>Instagram</li>
                  <li>Local Collectes de fonds</li> <li>Services</li> <li>Centre d’information sur les élections </li> <li>À propos</li> <li>Créer une publicité</li>
                  <li>Créer une Page</li> <li>Développeurs</li> <li>Emplois</li> <li>Confidentialité</li>   <li>Cookies</li> <li>Choisir sa pub</li>
                  <li>Conditions générales</li> <li>Aide</li> <li>Paramètres</li></ul>
                <div className='Facebookcopy'>Facebook © 2021</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {HandlerClickModal ?
        <CreerUnCompte setnewuser={setnewuser} HandlerClickButtonLeaveCreateAccount={HandlerClickButtonLeaveCreateAccount} nom={setnom} prenom={setprenom} month={setMonth} year={setYear}
          day={setDay} sex={setSex} />
        : null}
    </div>
  );
}
export default PageConnexion;

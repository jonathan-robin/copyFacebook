import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { userConverter } from '../getInfos';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import '../../styles/rechercherSurFacebook.css';

function RechercheFacebook(props) {
    const { currentUser, getFriendsList } = useAuth();
    const [userAccount, setUserAccount] = useState();
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const history = useHistory();
    const [megaUser, setMegaUser] = useState(props.megaUser);
    const [user, setUser] = useState();

    var handleClickRechercheFacebook = async () => {
        var lesPublications = [];
        await db.collection('Publications' + value.id).get()
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
        await db.collection("/users").doc(currentUser.uid)
            .withConverter(userConverter)
            .get().then(function (doc) {
                if (doc.exists) {
                    setUserAccount(doc.data());
                } else {
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });

        var urlCouv = 'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + value.id + '%2FcouvertureActive%2FcouvertureCropActive%2Fcouv?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'
        var urlProfil = 'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + value.id + '%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'
        var userAccountListeAmis = [];
        var idAmis = await getFriendsList(value.id)
            .then(idAmis => idAmis.map(request => {
                db.collection('/users').doc(request.id).get()
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
            }))
        await db.collection("/users").doc(value.id)
            .withConverter(userConverter)
            .get().then(function (doc) {
                if (doc.exists) {
                    history.push({
                        pathname: '/reload',
                    })
                    history.push({
                        pathname: '/visitingProfile',
                        state: {
                            megaUser: megaUser,
                            userAccountListeAmis: userAccountListeAmis,
                            pp: props.pp,
                            user: doc.data(),
                            urlProfil: urlProfil,
                            urlCouv: urlCouv,
                            userActif: props.megaUser.user,
                            lesPublicationsUserVisited: lesPublications
                        }
                    });
                }
            })
    }

    return (
        <Modal show={props.show} onHide={() => { props.handleClose() }} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered contentClassName="ModalChangerPP" >
            <Modal.Header className='modalHeader' closeButton>
                <Modal.Title className='UpdatePP'>Recherche sur Facebook</Modal.Title>
            </Modal.Header>
            <Modal.Body contentClassName="contentBody">
                <div className='rechercherSurFacebook' style={{ display: 'flex', color: 'white', fontSize: '20px' }}>
                    <Autocomplete
                        value={value}
                        onChange={(event, newValue) => { setValue(newValue); }}
                        id="auto-complete"
                        options={props.megaUser.allUser}
                        getOptionLabel={(option) => option.label}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label='Recherche par nom...' margin="normal" />}/>
                </div>
                <Button variant='primary' style={{ marginLeft: '60%', marginTop: '-12%' }} onClick={() => handleClickRechercheFacebook()}>Rechercher</Button>
                <Button variant='danger' style={{ marginLeft: '80%', marginTop: '-19%' }} onClick={() => props.handleClose()}>Quitter</Button>
            </Modal.Body>
        </Modal>

    )
}
export default RechercheFacebook

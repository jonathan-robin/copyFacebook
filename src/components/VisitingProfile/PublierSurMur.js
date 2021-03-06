import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap';
import '../../styles/ModalChangerPP.css';
import '../../styles/ModalModifInfos.css';
import '../../styles/Publication.css';
import { storage, db } from '../../firebase';
import picture from '../../resources/image.png';
import tagFriends from '../../resources/tagfriend.png'
global.jQuery = require('jquery');

function PublierPost(props) {

    const publiRef = useRef();
    const [contentRef, setContentRef] = useState();
    const [urlPhotoPubli, setUrlPhotoPubli] = useState(null);
    const currentUser = props.currentUser;
    const [targetFiles, setTargetFiles] = useState();
    const [tagged, setTagged] = useState('none');
    const idPost = Math.random().toString();
    const [publi, setPubli] = useState(Math.random().toString());
    const [userVisited, setUserVisited] = useState(props.userVisited);

    var handleClickPublier = () => {
        setContentRef(publiRef.current.value);
        var date = new Date();
        var datePubli = date.toString();
        db.collection('Publications' + userVisited.id).doc(idPost).set({
            Contenu: publiRef.current.value,
            Date: datePubli,
            Media: 'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + currentUser.uid + '%2FMedias%2FPublications%2F' + publi + '?alt=media&token=1f2846e5-d179-4e97-9bb5-3b62bb571116',
            identification: currentUser.uid,
            identificationFullName: props.megaUser.user.FullName,
            identificationName: props.megaUser.user.Name,
            author: currentUser.uid,
            idPost: idPost
        });
        props.handleClose();
    }

    var handleChangePhoto = (e) => {
        document.getElementById('save').style.disabled = 'true';
        if (e.target.files[0]) {
            setTargetFiles(e.target.files[0])
        }
        const uploadSecondTask = storage.ref(currentUser.uid + "/Medias/" + "/Publications/" + publi).put(e.target.files[0]);
        uploadSecondTask.on(
            "state_changed",
            snapshot => { },
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref(currentUser.uid + "/Medias/" + "/Publications/")
                    .child(publi)
                    .getDownloadURL()
                    .then(url => {
                        setUrlPhotoPubli(url);
                    })
            }
        );
        document.getElementById('save').style.enabled = 'false';
    }

    return (
        <Modal show={props.show} onHide={() => { props.handleClose() }} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered contentClassName="ModalChangerPP" >
            <Modal.Header className='modalHeader' closeButton>
                <Modal.Title className='UpdatePP'>Créer une publication</Modal.Title>
            </Modal.Header>
            <Modal.Body contentClassName="contentBody">
                <input contentEditable='true' type='text' className='QueVoulezVousDireModal' placeholder='Que voulez-vous dire... ? ' ref={publiRef} />
                <div className='AjouterPost'>
                    <label className='' type='file'>
                        <div className='AjouterPhoto'>
                            <input className='inputFichier' type='file' onChange={
                                handleChangePhoto} />
                            <div className='addpubliphoto'>
                                <img src={picture} className='addPicture' /><div className='txtpubli'>Photo/Vidéo</div>  </div>
                        </div>
                    </label>
                    <div className='TagFriends tgf'>
                        <img src={tagFriends} className='TagFriend' />Identifier des amis
                        </div>
                </div>
                <div className='boutonsModifInfos'>
                    <Button variant='primary' id='save' className='validermodifs' onClick={() => { handleClickPublier() }}>Publier</Button>
                    <Button variant='danger' className='leaveModifs' onClick={() => { props.handleClose() }}>Annuler</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default PublierPost

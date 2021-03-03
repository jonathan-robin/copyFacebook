import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import '../../styles/ModalChangerPP.css';
import plus from '../../resources/Ajouter.png';
import decor from '../../resources/decor.png';
import crayon from '../../resources/crayon.png';
import { storage } from '../../firebase';
global.jQuery = require('jquery');

const ChangerProfilPicture = (props) => {
    const currentUser = props.currentUser;
    const [url, setUrl] = useState('https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + currentUser.uid + '%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3');
    
    async function handleChange(e) {
        if (e.target.files.length > 0){
                var pictureName = new Date().toString();
                const uploadSecondTask = storage.ref(currentUser.uid + "/profil/" + pictureName).put(e.target.files[0]);
                uploadSecondTask.on(
                    "state_changed",
                    snapshot => { },
                    error => {
                        console.log(error);
                    },
                    () => {
                        storage
                            .ref(currentUser.uid + "/profil/")
                            .child(pictureName)
                            .getDownloadURL()
                            .then(url => {
                                props.addProfilPicture(url);
                            });
                    }
                );
            }
        else{
            console.log('Aucune photo téléchargé')
        }
    };

    const handleSelected = async (e) => {
        fetch(e.target.currentSrc)
            .then(response => response.blob())
            .then(blob => {
                const uploadSecondTask = storage.ref(currentUser.uid + "/profilActif" + '/profilPictureActive').put(blob);
                uploadSecondTask.on(
                    "state_changed",
                    snapshot => { },
                    error => {
                        console.log(error);
                    },
                    () => {
                        storage
                            .ref(currentUser.uid + "/profilActif")
                            .child('/profilPictureActive')
                            .getDownloadURL()
                            .then(url => {
                                setUrl(url)
                            });
                    }
                );
            });
        props.newUrl(e.target.currentSrc);
        props.handleClose();
    }

    return (
        <Modal show={props.show} onHide={() => { props.handleClose() }} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered contentClassName="ModalChangerPP" >
            <Modal.Header className='modalHeader' closeButton>
                <Modal.Title className='UpdatePP'>Mettre à jour la photo de profil</Modal.Title>
            </Modal.Header>
            <Modal.Body contentClassName="contentBody">
                <div contentClassName='PhotosSugg'>
                    <label className='importer' type='file'><input className='inputFichier' type='file' onChange={handleChange} /><img src={plus} className='iconpp' /> Importer une photo </label>
                    <div className='ajouter'> <img src={decor} className='iconpp' /> Ajouter un décor </div>
                    <div className='crayonpp'><img src={crayon} className='iconppC ' /></div>
                </div>
                <div className='VoirPlus'>
                    <div className='PhotosSuggerees'>
                        Photos suggérées
                    </div>
                    <div className='carousselPhotos'>
                        {url ?
                            <div className='carrouselImporterPhotos' style={{marginRight:'40px',marginLeft:'10px'}}>
                                <img className='carrouselImporterPhotos' onClick={handleSelected} src={url} />
                            </div>
                        : null}
                        {props.UrlDesPhotos.map(function (element) {
                                return <div className='carrouselImporterPhotos'><img className='carrouselImporterPhotos' onClick={handleSelected} src={element} key={element} /></div>
                            })}
                    </div>
                    <div className='VoirPlustxt'>
                        Télécharger la photo de profil
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default ChangerProfilPicture

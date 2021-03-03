import React, { useRef } from 'react'
import { Modal, Button } from 'react-bootstrap';
import '../../styles/ModalChangerPP.css';
import '../../styles/ModalModifInfos.css';
import anniversaire from '../../resources/birthday-cake.png';
import etude from '../../resources/etude.png';
import habite from '../../resources/habite.png';
import originaire from '../../resources/originaire.png'
import { useAuth } from '../../contexts/AuthContext';
global.jQuery = require('jquery');

function ModifInfos(props) {
    const { updateOrigine, updateEtudes, updateHabite, updateNaissance } = useAuth();
    const currentUser = props.currentUser;
    const adresse = props.currentUser.Habite;
    const etudes = props.currentUser.Etudes;
    const origine = props.currentUser.Originaire;
    const naissance = props.currentUser.BirthDate;
    const naissanceRef = useRef(null);
    const etudeRef = useRef(null);
    const origineRef = useRef(null);
    const habiteRef = useRef(null);

    var handleClickSaveModif = async () => {
        if (origineRef.current.value !== '' && origineRef.current.value !== origine) {
            await updateOrigine(origineRef.current.value);
        }
        if (etudeRef.current.value !== '' && etudeRef.current.value !== etudes) {
            await updateEtudes(etudeRef.current.value);
        }
        if (habiteRef.current.value !== '' && habiteRef.current.value !== adresse) {
            await updateHabite(habiteRef.current.value);
        }
        if (naissanceRef.current.value !== '' && naissanceRef.current.value !== naissance) {
            await updateNaissance(naissanceRef.current.value);
        }
        return props.ModifInfos().then(props.handleClose())
    }

    return (
        <Modal show={props.show} onHide={() => { props.handleClose() }} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered contentClassName="ModalChangerPP" >
            <Modal.Header className='modalHeader' closeButton>
                <Modal.Title className='UpdatePP'>Mettre à jour le profil</Modal.Title>
            </Modal.Header>
            <Modal.Body contentClassName="contentBody">
                <div className='rowModif'>
                    <input ref={naissanceRef} type='text' className='modifInfosInput' placeholder='Modifier la date de naissance ...' />
                    {currentUser.BirthDate === '' ? <div className='modifInfosGrise'>Vous n'avez pas encore rentré de date de naissance... </div> :
                        <div className='modifInfos'>
                            <img className='logointro' src={anniversaire} />{currentUser.BirthDate}
                        </div>}
                </div>
                <div className='rowModif'>
                    <input ref={etudeRef} type='text' className='modifInfosInput' placeholder='Modifier les études ...' />
                    {currentUser.Etudes === '' ? <div className='modifInfosGrise'>Vous n'avez pas encore rentré d'études...</div> :
                        <div className='modifInfos'>
                            <img className='logointro' src={etude} />{currentUser.Etudes}
                        </div>
                    }
                </div>
                <div className='rowModif'>
                    <input ref={habiteRef} type='text' className='modifInfosInput' placeholder="Modifier l'adresse ..." />
                    {currentUser.Habite === '' ? <div className='modifInfosGrise'>Vous n'avez pas encore rentré d'adresse...</div> :
                        <div className='modifInfos'>
                            <img className='logointro' src={habite} />{currentUser.Habite}
                        </div>
                    }
                </div>
                <div className='rowModif'>
                    <input ref={origineRef} type='text' className='modifInfosInput' placeholder="Modifier l'origine ..." />
                    {currentUser.Originaire === '' ? <div className='modifInfosGrise'>Vous n'avez pas encore rentré d'origine...</div> :
                        <div className='modifInfos'>
                            <img className='logointro' src={originaire} />{currentUser.Originaire}
                        </div>
                    }
                </div>
                <div className='boutonsModifInfos'>
                    <Button variant='primary' className='validermodifs' onClick={() => handleClickSaveModif()}>Enregistrer les Modifications</Button>
                    <Button variant='secondary' className='leaveModifs' onClick={() => props.handleClose()}>Quitter les modifications</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModifInfos

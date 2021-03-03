import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Dropdown } from 'react-bootstrap';
import '../../../styles/ModalChangerPP.css';
import { storage, useAuth } from '../../firebase';
global.jQuery = require('jquery');

function ChangerPhotoCouverture(props) {

    const SelectPhotoRef = useRef();
    const ImportPhotoRef = useRef();
    const SupprPhotoRef = useRef();
    const currentUser = props.currentUser;
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState();
    const [newUrl, setNewUrl] = useState();

    async function handleChange(e) {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        };
        const uploadTask = storage.ref(currentUser.uid + "/" + e.target.files[0].name).put(e.target.files[0]);
        uploadTask.on(
            "state_changed",
            snapshot => { },
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref(currentUser.uid)
                    .child(e.target.files[0].name)
                    .getDownloadURL()
                    .then(url => {
                        setUrl(url)
                    });
            }
        );
    };

    console.log(currentUser.uid);
    const handleUpload = () => {
    };
    const handleSelected = (e) => {
        props.newUrl(e.target.currentSrc)
    }

    console.log(image);
    return (
        <Dropdown>
            <Dropdown.Toggle className='dropdownCouv' id="dropdown-basic">
                Changer la photo de couverture
        </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item ref={SelectPhotoRef} className='dropdownCouv'>Selectionner une photo</Dropdown.Item>
                <Dropdown.Item ref={ImportPhotoRef} className='dropdownCouv'><input type='file' className='inputFichier' />Importer une photo</Dropdown.Item>
                <Dropdown.Item ref={SupprPhotoRef} className='dropdownCouv'>Supprimer</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

    )
}
export default ChangerPhotoCouverture

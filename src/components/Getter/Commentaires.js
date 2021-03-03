import React, { useRef } from 'react'
import '../../styles/ProfilePublications.css';
import { db } from '../../firebase';
import { Button } from 'react-bootstrap';
import { ConvertDate } from '../ConvertDate';

function Commentaires(props) {
    const ComRef = useRef();

    var handleClickPublierCommentaires = async () => {
        var idCommentaires = new Date()
        var date = ConvertDate(idCommentaires)
        var hour = idCommentaires.getHours();
        var minute = idCommentaires.getMinutes();
        var seconds = idCommentaires.getSeconds();
        var rushhour = (hour + ':' + minute + ':' + seconds).toString();
        var a = ComRef.current.value
        ComRef.current.value = '';
        await db.collection('Commentaires' + props.idPhoto).doc()
            .set({
                idCommentaires: date,
                date: rushhour,
                timestamp: new Date().toISOString(),
                content: a,
                author: props.author,
            }).then(res => { return props.addPublications() })
    }
    
    return (
        <div className='commentaires'>
            <textarea className='InputCom' placeholder='Ecrivez votre commentaire ...' type='text' label='inputText' ref={ComRef} />
            <Button variant='primary' className='boutonPublish' onClick={() => { handleClickPublierCommentaires() }} ><p className='textPublierCom'>Publier</p></Button>
        </div>
    )
}

export default Commentaires

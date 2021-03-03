import { useAuth } from '../../contexts/AuthContext';
import React, { useState, useEffect } from 'react'
import FeedCommentaires from './FeedCommentaires';
import Commentaires from './Commentaires';
import { ConvertDate } from '../ConvertDate';
import '../../styles/listeAmis.css';

function LesPublications(props) {
    const { currentUser } = useAuth();
    const [publications, setPublications] = useState(props.lesPublications);
    const [Data, setData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            data();
        }, 1000)
    }, [props.lesPublications])

    var data = async () => {
        var da = props.lesPublications.map(publi => {
            return (<div className='DivPublications' key={Math.random()}>
                <div className='margin'>
                    <div className='divUp'>
                        <img className='imgProfilePublierPost' src={'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + publi.doc.author + '%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'} />
                    <div className='divUpText'>Avec {publi.doc.identificationFullName} {publi.doc.identificationName}, le {ConvertDate(publi.doc.Date)}</div>
                    </div>
                    <div className='textContent'>
                        <p className='txtContentFirstLine'>{publi.doc.Contenu}</p>
                    </div>
                    <div className='MediaContent'>
                        <img src={publi.doc.Media} className='imagePubli' />
                    </div>
                    <div className='interactions'>
                    </div>
                    <div className='reactions'>
                        <FeedCommentaires Commentaires={publi.com} />
                    </div>
                    <div className='saisieCom'>
                        <Commentaires addPublications={props.addPublications} author={currentUser.uid} idPhoto={publi.doc.idPost} />
                    </div>
                </div>
            </div>)
        })
        setData(da);
    }
    return Data
}
export default LesPublications

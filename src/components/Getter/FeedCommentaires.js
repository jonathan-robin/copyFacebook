import React, { useState, useEffect, useMemo } from 'react'
import { db } from '../../firebase';
import { userConverter } from '../getInfos';
import '../../styles/FeedCommentaires.css';

function FeedCommentaires(props) {
    const [data, setData] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [commentaires, setCommentaires] = useState(props.Commentaires)

    useEffect(() => {
        let cancelled = false;
        getLaData().then(res => {
            setData(res);
            setIsLoading(false);
        })
        return () => {
            cancelled = true;
        }
    }, [])

    const getLaData = useMemo(function () {
        return async function () {
            var a = []
            await getData()
                .then((res) => {
                    for (var i = 0; i < res.length; i++) {
                        a.push(<div className='commentaire' key={Math.random()}>
                            <div className='bgCom'>
                                <div className='elementProfilCommentaire'>
                                    <div className='imgProfil'>
                                        <img src={'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + res[i].id + '%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'} className='photoProfil' />
                                    </div>
                                    <div className='NomCommentaires'>
                                        {res[i].FullName} {res[i].Name}
                                    </div>
                                </div>
                                <div className='ContentCommentaire'>
                                    {props.Commentaires[i].content}
                                </div>
                            </div>
                            <div className='infoCommentaire'>
                                le {props.Commentaires[i].idCommentaires} à {props.Commentaires[i].date}
                            </div>
                        </div>)
                    }
                })
            return a
        }
    }, [commentaires])

    const functionWithPromise = async item => {
        const data = await db.collection('users').doc(item.author)
            .withConverter(userConverter)
            .get()
        return data.data();
    }
    const getData = async () => {
        return await Promise.all(props.Commentaires.map(com => functionWithPromise(com)))
    }
    return data
}
export default FeedCommentaires
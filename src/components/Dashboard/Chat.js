import React, { useRef, useState, useEffect } from 'react'
import { db } from '../../firebase';
import { Card } from '@material-ui/core';
import { CardContent } from '@material-ui/core';
import '../../styles/Dashboard.css';
import send from '../../resources/send.svg'

function Chat(props) {
    const refMessage = useRef();
    const [messages, setMessages] = useState(['']);
    const username = props.currentUser;
    const [cheminDoc, setCheminDoc] = useState(() => {
        if (props.sender.id < props.reciever.infos.id) {
            return props.sender.id + '' + props.reciever.infos.id
        }
        return props.reciever.infos.id + '' + props.sender.id;
    });

    useEffect(() => {
        db.collection('messages/').doc(cheminDoc).collection('private_messages')
            .orderBy('date', 'desc')
            .onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()));
            })
    }, [])

    var postChat = async (e) => {
        db.collection('messages/').doc(cheminDoc).collection('private_messages').add({
            sender: props.sender.id,
            reciever: props.reciever.infos.id,
            message: refMessage.current.value,
            date: new Date().toISOString(),
        })
        refMessage.current.value = '';
    }

    return (
        <div className='CardChat' key={props.reciever.infos.id}>
            <div className='cardChat'>
                <div className='nomReciever'>
                    <img className='photoReciever' src={'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + props.reciever.infos.id + '%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'} />
                    {props.reciever.infos.FullName} {props.reciever.infos.Name}
                    <div className='leaveChat' onClick={props.close}>X</div>
                </div>
                <div className='lesMessages'>
                    {messages.map(message => {
                        const isUser = username.uid === message.sender;
                        return (
                            <div className='topCard'>
                                {!isUser && <img src={'https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/' + props.reciever.infos.id + '%2FprofilActif%2FprofilPictureActive?alt=media&token=cbbfb6dc-d993-4fd7-ae09-2056cb15bcc3'} className='ppreciever' />}
                                <div className={`message ${isUser && 'message__user'}`}>
                                    <Card className={isUser ? "message__userCard" : "message__guestCard"}>
                                        <CardContent className='CardContent'>
                                            {message.message}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='EntrerMessage'>
                    <input ref={refMessage} className='inputChat' placeholder='Entrer votre message ...' />
                    <img src={send} onClick={() => { postChat() }} type='submit' className='sendMessageImg' />
                </div>
            </div>
        </div>
    )
}
export default Chat

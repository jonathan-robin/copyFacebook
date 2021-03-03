import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { Modal, Button } from 'react-bootstrap';
import '../../styles/FriendRequest.css'

export const FriendRequest = (props) => {
  const { accepterInvitation, currentUser, askFriendList, refuserInvitation } = useAuth();
  const [lesRequest, setLesRequest] = useState(props.friendsRequest)

  var handleClickAccepter = (e, id) => {
    document.getElementById('ButtonAccept').style.display = 'none';
    document.getElementById('DivAccepter').style.display = 'block';
    accepterInvitation(id, currentUser.uid);
    let newRequest = lesRequest.filter(el => el.infos.id !== id)
    setLesRequest(newRequest);
  }
  var handleClickRefuser = (e, id) => {
    document.getElementById('ButtonAccept').style.display = 'none';
    document.getElementById('DivRefuser').style.display = 'block';
    refuserInvitation(id, currentUser.uid);
    let newRequest = lesRequest.filter(el => el.infos.id !== id)
    setLesRequest(newRequest);
  }

  return (
    <Modal show={props.show} onHide={() => { props.handleClose() }} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered contentClassName="ModalChangerPP" >
      <Modal.Header className='modalHeader' closeButton>
        <Modal.Title className='UpdatePP'>Vos demandes d'amis</Modal.Title>
      </Modal.Header>
      <Modal.Body contentClassName="contentBody">
        {lesRequest.map(function (requete) {
          return <div key={requete.infos.id}>
            <div className='divFriendRequest' id='ButtonAccept'>
              <div className='ProfileFriendRequest'>
                <img src={requete.url} className='ImageProfileFriendRequest' />
                <div className='nomFr'>
                  <div className='friendRequestName'>{requete.infos.Name}</div>
                  <div className='friendRequestFullName'>{requete.infos.FullName}</div>
                  <div className='boutonsFR' id='boutonIdAccepter'>
                    <Button value='accepter' onClick={(e) => { handleClickAccepter(e.target.value, requete.infos.id)}}>Ajouter</Button>
                    <Button variant='danger' value='refuser' onClick={(e) => {handleClickRefuser(e.target.value, requete.infos.id)}}> Refuser </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className='divFriendRequest' style={{ display: 'none' }} id='DivAccepter'>
              <div className='ProfileFriendRequest'>
                <img src={requete.url} className='ImageProfileFriendRequest' />
                <div className='nomFr'>
                  <div className='friendRequestName'>{requete.infos.Name} </div> <div className='friendRequestFullName'>{requete.infos.FullName}</div>
                  <div className='boutonsFR invitAccept'>
                    Invitation acceptée !
                  </div>
                </div>
              </div>
            </div>
            <div className='divFriendRequest' style={{ display: 'none' }} id='DivRefuser'>
              <div className='ProfileFriendRequest'>
                <img src={requete.url} className='ImageProfileFriendRequest' />
                <div className='nomFr'>
                  <div className='friendRequestName'>{requete.infos.Name} </div> <div className='friendRequestFullName'>{requete.infos.FullName}</div>
                  <div className='boutonsFR invitRefuser'>
                    Invitation refusée...
                  </div>
                </div>
              </div>
            </div>
          </div>
        })}
      </Modal.Body>
    </Modal>
  )
}


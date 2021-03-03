import React from 'react'
import '../../styles/Dashboard.css';

function Contacts(props) {
    var handleClickContact = (element) => {
        props.setChat(element);
    }
    return (
        props.megaUser.lesAmis.map(element => {
            return (
                <div key={element.infos.id}>
                    <div className='ContactsEnLigne' key={element.infos.id}
                        onClick={() => { handleClickContact(element) }}
                    >
                        <img src={element.url} className='imgContactsEnLigne' />
                        <div className='NomAmis'>
                            {element.infos.FullName} {element.infos.Name}
                        </div>
                    </div>
                </div>
            )
        })
    )
}
export default Contacts

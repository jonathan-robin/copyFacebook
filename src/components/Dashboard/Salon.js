import React from 'react'
import '../../styles/Salon.css'
import '../../styles/Dashboard.css';

function Salon(props) {
    return (
        props.listeAmis.map(element => {
            return (
                <div className='bulleAmis' key={element.infos.id}>
                    <img src={element.url} className='imgBulleSalon' />
                </div>
            )
        })
    )
}

export default Salon

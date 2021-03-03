import React,{useEffect, useState, useRef} from 'react'
import {Button, Card,Form, Alert } from 'react-bootstrap';
import {useAuth} from '../../contexts/AuthContext';
import {useHistory, Link} from 'react-router-dom'


function ForgotPassword() {
    const emailRef = useRef();
    const {login, resetPassword} = useAuth();
    const [error, setError] = useState();
    const [loading, setLoading] =useState();
    const history = useHistory();
    const [message,setMessage] = useState();

    async function handleSubmit(e) {
        e.preventDefault();

        try{
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(emailRef.current.value); 
            setMessage('Un mail vous a été envoyé avec les instructions a suivre.')
        }catch{
            setError('Une erreur est survenue lors de la réinitialisation du mot de passe');
        }
        setLoading(false);
    }

    return (
        <>
        <Card style={{alignItems:'center', width:'60%', margin:'auto', marginTop:'10%'}}>
            <Card.Body>
                <h2 className='text-center mb-4'>Réinitialiser le mot de passe</h2>
                {error && <Alert variant='danger'>{error}</Alert>}
                {message && <Alert variant='success'>{message}</Alert>}
                <Form onSubmit={handleSubmit}> 
                    <Form.Group id='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' ref={emailRef} required/>
                    </Form.Group>
                    <Button disabled={loading} className='w-100' type='submit'>
                        Réinitialiser le mot de passe
                    </Button>
                </Form>
                <div className='w-100 text-center mt-3'>
                    <Link to='/login-signup'>Se connecter</Link>
                </div>
            </Card.Body>
        </Card>
        </>
    )
}

export default ForgotPassword

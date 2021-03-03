import cross from '../../resources/cross.png';
import '../../styles/connexion.css';
import React, { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { db, storage } from '../../firebase';

function CreerUnCompte(props) {
  const emailRef = useRef();
  const prenomRef = useRef();
  const nomRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const birthDayRef = useRef();
  const birthMonthRef = useRef();
  const birthYearRef = useRef();
  const [sex, setSex] = useState();
  const history = useHistory();
  const { signup, sendInfos, currentUser, login } = useAuth();
  const location = useLocation();

  async function handleSubmit(e) {
    props.prenom(prenomRef.current.value);
    props.nom(nomRef.current.value);
    props.day(birthDayRef.current.value);
    props.month(birthMonthRef.current.value);
    props.sex(sex);
    props.year(birthYearRef.current.value);
    await signup(emailRef.current.value, passwordRef.current.value, prenomRef.current.value, nomRef.current.value, birthDayRef.current.value, birthMonthRef.current.value, birthYearRef.current.value, sex)
      .then(async function (res) {
        fetch('https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/t%C3%A9l%C3%A9chargement%20(6).jpg?alt=media&token=44d86512-0daf-41c0-9efb-c36431d1565e')
          .then(response => response.blob())
          .then(thisblob => {
            storage.ref(res.user.uid + '/profilActif/' + '/profilPictureActive').put(thisblob)
          })
          .then(
            fetch('https://firebasestorage.googleapis.com/v0/b/copiefacebook.appspot.com/o/couverture.jpg?alt=media&token=02243391-2e14-4cee-9f9c-b08267ca01f7')
              .then(response => response.blob())
              .then(thisblob => {
                storage.ref(res.user.uid + '/couvertureActive/' + '/couvertureCropActive/')
                  .child('couv')
                  .put(thisblob)
                storage.ref(res.user.uid + '/couvertureActive/' + '/couvertureOriginaleActive/')
                  .child('couv')
                  .put(thisblob)
              }))
          .then(
            sendInfos(prenomRef.current.value, nomRef.current.value, birthDayRef.current.value, birthMonthRef.current.value, birthYearRef.current.value, sex, res.user)
          )
        if (res.additionalUserInfo.isNewUser) {
          props.setnewuser();
        }
      }
      )
  }

  return (
    <div className='ModalPadding'>
      <div className='ModalFull'>
        <div className='ModalTitre'>
          S'inscrire<img src={cross} onClick={() => { props.HandlerClickButtonLeaveCreateAccount() }} className='cross' /></div>
        <div className='ModalSousTitre'>
          C'est rapide et facile.
      </div>
        <div className='ModalInfo'>
          <div className='fullName'>
            <input className='prenom' ref={prenomRef} placeholder='Prénom' required />
            <input className='Nom' ref={nomRef} placeholder='Nom de famille' required />
            <input className='NumOuEmail' ref={emailRef} type='email' placeholder='Numéro de mobile ou e-mail' required />
            <input className='InscriptionMdp' ref={passwordRef} type='password' placeholder='Nouveau mot de passe' required />
            <div className='Datedenaissance'>
              Date de naissance
                <div className='BirthDateCombo'>
                <select ref={birthDayRef} className='BirthDay'>
                  <option value='0'>Jour</option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>
                  <option value='5'>5</option>
                  <option value='6'>6</option>
                  <option value='7'>7</option>
                  <option value='8'>8</option>
                  <option value='9'>9</option>
                  <option value='10'>10</option>
                  <option value='11'>11</option>
                  <option value='12'>12</option>
                  <option value='13'>13</option>
                  <option value='14'>14</option>
                  <option value='15'>15</option>
                  <option value='16'>16</option>
                  <option value='17'>17</option>
                  <option value='18'>18</option>
                  <option value='19'>19</option>
                  <option value='20'>20</option>
                  <option value='21'>21</option>
                  <option value='22'>22</option>
                  <option value='23'>23</option>
                  <option value='24'>24</option>
                  <option value='25'>25</option>
                  <option value='26'>26</option>
                  <option value='27'>27</option>
                  <option value='28'>28</option>
                  <option value='29'>29</option>
                  <option value='30'>30</option>
                  <option value='31'>31</option>
                </select>
                <select ref={birthMonthRef} className='BirthDay'>
                  <option value='0'>Mois</option>
                  <option value='01'>Janvier</option>
                  <option value='02'>Février</option>
                  <option value='03'>Mars</option>
                  <option value='04'>Avril</option>
                  <option value='05'>Mai</option>
                  <option value='06'>Juin</option>
                  <option value='07'>Juillet</option>
                  <option value='08'>Août</option>
                  <option value='09'>Septembre</option>
                  <option value='10'>Octobre</option>
                  <option value='11'>Novembre</option>
                  <option value='12'>Décembre</option>
                </select>
                <select ref={birthYearRef} className='BirthYear'>
                  <option value='0'>Année</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2017">2017</option>
                  <option value="2016">2016</option>
                  <option value="2015">2015</option>
                  <option value="2014">2014</option>
                  <option value="2013">2013</option>
                  <option value="2012">2012</option>
                  <option value="2011">2011</option>
                  <option value="2010">2010</option>
                  <option value="2009">2009</option>
                  <option value="2008">2008</option>
                  <option value="2007">2007</option>
                  <option value="2006">2006</option>
                  <option value="2005">2005</option>
                  <option value="2004">2004</option>
                  <option value="2003">2003</option>
                  <option value="2002">2002</option>
                  <option value="2001">2001</option>
                  <option value="2000">2000</option>
                  <option value="1999">1999</option>
                  <option value="1998">1998</option>
                  <option value="1997">1997</option>
                  <option value="1996">1996</option>
                  <option value="1995">1995</option>
                  <option value="1994">1994</option>
                  <option value="1993">1993</option>
                  <option value="1992">1992</option>
                  <option value="1991">1991</option>
                  <option value="1990">1990</option>
                  <option value="1989">1989</option>
                  <option value="1988">1988</option>
                  <option value="1987">1987</option>
                  <option value="1986">1986</option>
                  <option value="1985">1985</option>
                  <option value="1984">1984</option>
                  <option value="1983">1983</option>
                  <option value="1982">1982</option>
                  <option value="1981">1981</option>
                  <option value="1980">1980</option>
                  <option value="1979">1979</option>
                  <option value="1978">1978</option>
                  <option value="1977">1977</option>
                  <option value="1976">1976</option>
                  <option value="1975">1975</option>
                  <option value="1974">1974</option>
                  <option value="1973">1973</option>
                  <option value="1972">1972</option>
                  <option value="1971">1971</option>
                  <option value="1970">1970</option>
                  <option value="1969">1969</option>
                  <option value="1968">1968</option>
                  <option value="1967">1967</option>
                  <option value="1966">1966</option>
                  <option value="1965">1965</option>
                  <option value="1964">1964</option>
                  <option value="1963">1963</option>
                  <option value="1962">1962</option>
                  <option value="1961">1961</option>
                  <option value="1960">1960</option>
                  <option value="1959">1959</option>
                  <option value="1958">1958</option>
                  <option value="1957">1957</option>
                  <option value="1956">1956</option>
                  <option value="1955">1955</option>
                  <option value="1954">1954</option>
                  <option value="1953">1953</option>
                  <option value="1952">1952</option>
                  <option value="1951">1951</option>
                  <option value="1950">1950</option>
                  <option value="1949">1949</option>
                  <option value="1948">1948</option>
                  <option value="1947">1947</option>
                  <option value="1946">1946</option>
                  <option value="1945">1945</option>
                  <option value="1944">1944</option>
                  <option value="1943">1943</option>
                  <option value="1942">1942</option>
                  <option value="1941">1941</option>
                  <option value="1940">1940</option>
                  <option value="1939">1939</option>
                  <option value="1938">1938</option>
                  <option value="1937">1937</option>
                  <option value="1936">1936</option>
                  <option value="1935">1935</option>
                  <option value="1934">1934</option>
                  <option value="1933">1933</option>
                  <option value="1932">1932</option>
                  <option value="1931">1931</option>
                  <option value="1930">1930</option>
                </select>
              </div>
            </div>
            <div className='Datedenaissance'>Genre</div>
            <div className='Genre'>
              <span className='Femme'>
                <label className='LblFemme'>Femme
                 <input type='radio' onClick={() => setSex('Femme')} className='inputRadio' value='1' /></label>
                <label className='LblFemme'>Homme
                 <input type='radio' onClick={() => setSex('Homme')} className='inputRadio' value='1' /></label>
                <label className='lblPersonnalisé'>Personnalisé
                 <input type='radio' onClick={() => setSex('Personnalisé')} className='inputRadio' value='1' /></label>
              </span>
            </div>
            <div className='EnCliquant'>
              En cliquant sur S’inscrire, vous acceptez nos Conditions générales. Découvrez comment nous recueillons, utilisons et partageons vos données en lisant notre Politique d’utilisation des données et comment nous utilisons les cookies et autres technologies similaires en consultant notre Politique d’utilisation des cookies. Vous recevrez peut-être des notifications par texto de notre part et vous pouvez à tout moment vous désabonner.
           </div>
            {error && error != 'p' && <Alert variant='danger'>{error}</Alert>}
            <button className='InscrireButton' disabled={loading} onClick={() => { handleSubmit() }} type='submit'>S'inscrire</button>
          </div>
        </div>

      </div></div>

  )
}

export default CreerUnCompte
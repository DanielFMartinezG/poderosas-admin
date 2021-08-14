//user: poderosas admin
//cuenta: poderosasAdmin@gmail.com
//password: poderosas123
import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/login.css';
import podImg from '../../assets/equipo-poderoso.png';

const LoginAdmin = () => {

  const path = 'http://localhost:3000';
  const emailRef = useRef();
  const passwordRef = useRef();
  const history = useHistory();

  async function login() {
    const email = emailRef.current;
    const password = passwordRef.current;
    const credentials = {
      'user': email.value,
      'password': password.value
    };
    const response = await fetch(`${path}/admin/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(credentials)
    })
    const responseJson = await response.json();

    if(responseJson.msq === 'Inicio correcto'){
      localStorage.setItem('admin', responseJson.token)
      history.push('./home');
    }else{
      alert('Correo o contraseña invalidos.');
    }
    
  }

  return (
    <React.Fragment>
      <section className="banner">
        <img className="img" src={podImg} alt="login"></img>
        <p className="title main-title">Poderosas Admin</p>
      </section>
      <section className="form">
        <div className="box">
          <label className="title" htmlFor="">Email</label>
          <input
            type="email"
            name=""
            className="inp"
            placeholder='ejemploAdmin@poderosas.com'
            id="user_admin_name"
            ref={emailRef}
          />
        </div>
        <div className="box">
          <label className="title" htmlFor="">Password</label>
          <input
            type="password"
            name=""
            className="inp"
            placeholder="******"
            id="user_admin_password"
            ref={passwordRef}
          />
        </div>
        <div className="forgot-password">Bienvenido a Poderosas Admin</div>
      </section>
      <div className="button">
        <button className="button-template login " id="login-button" onClick={login}>Login</button>
      </div>
    </React.Fragment>
  );
}
export default LoginAdmin;
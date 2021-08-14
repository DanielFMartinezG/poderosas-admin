import React, { useRef } from 'react';
import '../../styles/header.css';
import logo from '../../assets/poderosas-icon-rose.png'
import { Link } from 'react-router-dom'

const Header = () => {

  const checkboxRef = useRef();

  /*closeMenu me permite setear el valor del input cuando se haga onClick sobre
  una de las opciones de la lista */
  const closeMenu = ()=>{
    const inputCheckbox = checkboxRef.current;
    inputCheckbox.checked = false;
    const body_element = document.body;
    body_element.style.overflow = "visible";
  }

  /* scroll_body habilita o deshabilita el scroll del body dependiendo de
  el valor de input checkbos, accedemos al body mediante document.body */
  const scroll_body = () => {
    const body_element = document.body;
    if (body_element.style.overflow == "hidden") {
      body_element.style.overflow = "visible";
    } else {
      body_element.style.overflow = "hidden";
    }
  }

  return (
    <header>
      <img src={logo} alt="Logo" className="logo" />
      <nav>
        <div className="menu">
          <input type="checkbox" id="checkbox" onChange={scroll_body} ref={checkboxRef}/>
          <span></span>
          <span></span>
          <span></span>
          <ul className='menu-ul'>
            <li className='menu-item home-item' onClick={closeMenu}><Link to='/poderosas/home'>Poderosas WEB</Link></li>
            <hr color="#FFFFFF" />
          </ul>
        </div>
      </nav>
    </header>
  );
}
export default Header;
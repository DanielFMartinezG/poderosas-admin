import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/formSliderHome.css';
import saveImg from '../../scripts/save_img_firebase';

const PartnersForm = () => {

  const path = 'http://localhost:3000';
  const history = useHistory();
  //utilizamos imgText para mostrar el nombre de la imagen que se está subiendo al formulario 
  const [imgText, setImgText] = useState('sube una imagen');
  const [formUpload, serFormUpload] = useState(true);
  const [dropdownValues, setDropdownValues] = useState([]);
  const partnerRef = useRef();
  const imgPartnerRef = useRef();
  const dropdownRef = useRef();

  /* función encargada de ejecutar el almacenamiento de la imagen a 
  firebase storage y ejecutar el metodo post para guardar la noticia */
  async function saveFirebaseImg(event) {
    event.preventDefault();
    const file = imgPartnerRef.current.files[0];
    const partner = partnerRef.current;

    if (file !== undefined &&
      partner.value !== '') {
      alert('Actualización en proceso...');
      saveImg('poderosas-staff', file, (value) => {
        console.log(`Img URL: ${value}`);
        //TODO, una vez obtenida la url terminar de envíar el post
        sendPostRequire(value, partner.value);
      });
    } else {
      alert('Complete el formulario.');
    }
  }

  /**
   * Función encargada de ejecutar el metodo POST para almacenar el partner
   * @param {*} urlImg url de la imagen a almacentar
   * @param {*} partner nombre de la empresa
   */
  async function sendPostRequire(urlImg, partner) {
    try {
      const token = localStorage.getItem('admin');
      //armamos el objetoa enviar con la info de la empresa
      const body = {
        name: partner,
        url: urlImg,
      }
      const response = await fetch(`${path}/partnerCompanies/createCompanie`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify(body)
      })
      const responseJson = await response.json();
      //si la respuesta es Token Expired redireccionamos al usuario nuevamente al login
      if (responseJson.msq === 'Token Expired') {
        alert('Expiró el tiempo de inicio de sesión');
        history.push('./login');
      } else if (responseJson.msq === 'Compañia insertada con exito') {
        alert('Compañia insertada con éxito.');
        window.location.reload();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
 * función encargada de implementar el metodo DELETE para eliminar una empresa
 * almacenada en la base de datos
 * @param event objeto tipo evento
 */
  async function sendDeleteRequere(event) {
    event.preventDefault();
    const token = localStorage.getItem('admin');
    let dropdown = dropdownRef.current;
    const response = await fetch(`${path}/partnerCompanies/deleteCompanies`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `bearer ${token}`
      },
      method: "DELETE",
      body: JSON.stringify({ id: dropdown.value })
    });
    const responseJson = await response.json();
    if (responseJson.msq === 'Empresa eliminada con exito') {
      alert('Empresa eliminada con éxito.');
      window.location.reload();
    } else if (responseJson.msq === 'Token Expired') {
      alert('Su sesión expiró, inicie sesión nuevamente.');
      history.push('./login');
    } else {
      alert('Tuvimos un problema, intetalo más tarde.');
    }
  }

  /*función encargada de obtener el nombre de la imagen subida e igualmente
  controlar el tamaño de la imagen subida*/
  const changeImgText = (event) => {
    event.preventDefault();
    if (imgPartnerRef.current.files.length > 0 &&
      imgPartnerRef.current.files[0].size < 2097152) {
      setImgText(imgPartnerRef.current.files[0].name);
    }
  }

  const showUploadForm = () => {
    serFormUpload(true);
  }

  const showDeleteForm = () => {
    serFormUpload(false);
  }

  //ejecutramos el useEffect una sola vez, al cargar por primera vez el componente
  useEffect(async function () {
    /*obtenemos las empresas almacenadas actualmente en la base de datos y procedemmos
    a almacenarlas en su respectivo estado */
    const response = await fetch(`${path}/partnerCompanies/getCompanies`);
    const jsonResponse = await response.json();
    const partner = jsonResponse.resultado;
    setDropdownValues(partner);
  }, [])

  return (
    <section className='admin-form'>
      <p className='sub-title'>Aliados</p>
      <div className='form-container'>
        <div className='form-header'>
          <div
            className={formUpload ? 'bttn-header bttn-active' : 'bttn-header'}
            onClick={showUploadForm}
          >
            Subir
          </div>
          <div
            className={!formUpload ? 'bttn-header bttn-active' : 'bttn-header'}
            onClick={showDeleteForm}
          >
            Eliminar
          </div>
        </div>

        <form
          action="#"
          className={formUpload ? "form-admin form-admin-active" : "form-admin"}
          id="form-upload-img"
        >
          <div className='form-item'>
            <span className='label-text' id='partners-name'>Aliado</span>
            <input type='text' className='text-input' ref={partnerRef}></input>
          </div>
          <div className='form-item'>
            <label className='label-text'>Imagen</label>
            <span className='updload-img-box'>
              <input
                type="file"
                accept='image/png, .jpeg, .jpg,'
                name="files"
                className='upload-label'
                id='upload-partner-label'
                ref={imgPartnerRef}
                onChange={changeImgText} >
              </input>
              <label
                htmlFor='upload-partner-label'
                className='button-template upload-img-bttn'
              >
                Subir Img
              </label>
              <p className='upload-img-name' id="file-chosen">{imgText}</p>
            </span>
          </div>
          <button className='button-template update-button' onClick={saveFirebaseImg}>Actualizar</button>
        </form>

        <form
          action="#"
          className={!formUpload ? "form-admin form-admin-active" : "form-admin"}
          id="form-delete-img"
        >
          <div className='form-item'>
            <label className='label-text'> Seleccionar Aliado: </label>
            <select required className='dropdown' ref={dropdownRef}>
              {
                dropdownValues.map((value, index) => (
                  <option
                    value={value._id}
                    key={value._id}
                  >
                    {value.companie_name}
                  </option>
                ))
              }
            </select>
          </div>
          <button
            className='button-template update-button'
            onClick={sendDeleteRequere}
          >
            Eliminar
          </button>
        </form>

      </div>
    </section>
  );
}
export default PartnersForm;
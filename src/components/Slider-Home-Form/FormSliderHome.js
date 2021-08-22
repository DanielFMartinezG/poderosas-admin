import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/formSliderHome.css';
import saveImg from '../../scripts/save_img_firebase';

const FormSliderHome = () => {

  const path = 'http://localhost:3000';
  //utilizamos imgText para mostrar el nombre de la imagen que se está subiendo al formulario 
  const [imgText, setImgText] = useState('sube una imagen');
  const [formUpload, serFormUpload] = useState(true);
  const [dropdownValues, setDropdownValues] = useState([]);
  const imgTextRef = useRef();
  const podPhraseRef = useRef();
  const dropdownRef = useRef();
  const history = useHistory();

  /*función encargada de obtener el nombre de la imagen subida e igualmente
  controlar el tamaño de la imagen subida*/
  const changeImgText = (event) => {
    event.preventDefault();
    if (imgTextRef.current.files.length > 0 &&
      imgTextRef.current.files[0].size < 2097152) {
      setImgText(imgTextRef.current.files[0].name);
    }
  }

  const showUploadForm = () => {
    serFormUpload(true);
  }

  const showDeleteForm = () => {
    serFormUpload(false);
  }

  /* función encargada de ejecutar el almacenamiento de la imagen a 
  firebase storage y ejecutar el metodo post para guardar la noticia */
  async function saveFirebaseImg(event) {
    event.preventDefault();
    const file = imgTextRef.current.files[0];
    const phrase = podPhraseRef.current;
    if (file !== undefined &&
      phrase.value !== '') {
      alert('Actualización en proceso...');
      saveImg('carrusel-home-images', file, (value) => {
        console.log(`Img URL: ${value}`);
        // una vez obtenida la url terminamos de envíar el post
        sendPostRequire(value, phrase.value);
      });
    } else {
      alert('Complete el formulario.');
    }
  }

  /**
   * Función encargada de ejecutar el metodo POST para almacenar la imagen
   * @param {*} urlImg url de la imagen almacenada en FirebaseStorage
   * @param {*} phrase  frase poderosa
   */
  async function sendPostRequire(urlImg, phrase) {
    try {
      const token = localStorage.getItem('admin');
      //armamos el objeto a enviar con la info de la imagen
      const body = {
        text: phrase,
        img: urlImg,
      }
      const response = await fetch(`${path}/heroSlider/insertPhrase`, {
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
      } else if (responseJson.msg === 'Frase Poderosa insertada con exito') {
        console.log(responseJson.result);
        alert('Imagen insertada con éxito.');
        window.location.reload();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * función encargada de implementar el metodo DELETE para eliminar una imagen del hero 
   * almacenada en la base de datos
   * @param event objeto tipo evento
   */
  async function sendDeleteRequere(event) {
    event.preventDefault();
    const token = localStorage.getItem('admin');
    let dropdown = dropdownRef.current;
    const response = await fetch(`${path}/heroSlider/deletePhrase`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `bearer ${token}`
      },
      method: "DELETE",
      body: JSON.stringify({ id: dropdown.value })
    });
    const responseJson = await response.json();
    if (responseJson.msg === 'Frase Poderosa eliminada con exito') {
      alert('Frase Poderosa eliminada con éxito.');
      window.location.reload();
    } else if (responseJson.msq === 'Token Expired') {
      alert('Su sesión expiró, inicie sesión nuevamente.');
      history.push('./login');
    } else {
      alert('Tuvimos un problema, intetalo más tarde.');
    }
  }

  //ejecutramos el useEffect una sola vez, al cargar por primera vez el componente
  useEffect(async function () {
    /*obtenemos las imagenes almacenadas actualmente en la base de datos y procedemmos
    a guardarlas en su respectivo estado */
    const response = await fetch(`${path}/heroSlider/getPhrases`);
    const jsonResponse = await response.json();
    const content_hero_slider = jsonResponse.result;
    setDropdownValues(content_hero_slider);
  }, [])

  return (
    <section className='admin-form'>
      <p className='sub-title'>Carrusel-Hero</p>
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
            <label className='label-text'>Imagen</label>
            <span className='updload-img-box'>
              <input
                type="file"
                accept='image/png, .jpeg, .jpg,'
                id="files"
                name="files"
                className='upload-label'
                id='upload-label'
                ref={imgTextRef}
                onChange={changeImgText} >
              </input>
              <label
                htmlFor='upload-label'
                className='button-template upload-img-bttn'
              >
                Subir Img
              </label>
              <p className='upload-img-name' id="file-chosen">{imgText}</p>
            </span>
          </div>
          <div className='form-item'>
            <span className='label-text' >Frase poderosa</span>
            <textarea name="mensaje" rows="3" className='text-area' ref={podPhraseRef}></textarea>
          </div>
          <button className='button-template update-button' onClick={saveFirebaseImg}>Actualizar</button>
        </form>

        <form
          action="#"
          className={!formUpload ? "form-admin form-admin-active" : "form-admin"}
          id="form-delete-img"
        >
          <div className='form-item'>
            <label className='label-text'> Imagen del carrusel: </label>
            <select required className='dropdown' ref={dropdownRef}>
              {
                dropdownValues.map((value, index) => (
                  <option
                    value={value._id}
                    key={`item-${index + 1}`}
                  >
                    {value.text_phrase}
                  </option>
                ))
              }
            </select>
          </div>
          <button
            className='button-template update-button'
            onClick={sendDeleteRequere}
          >
            Eliminar IMG
          </button>
        </form>

      </div>
    </section>
  );
}
export default FormSliderHome;
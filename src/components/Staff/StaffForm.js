import React, { useState, useRef, useEffect } from 'react';
import '../../styles/formSliderHome.css';
import saveImg from '../../scripts/save_img_firebase';
import { useHistory } from 'react-router-dom';

const StaffForm = () => {

  const path = 'http://localhost:3000';
  //utilizamos imgText para mostrar el nombre de la imagen que se está subiendo al formulario 
  const history = useHistory();
  const [imgText, setImgText] = useState('sube una imagen');
  const [formUpload, serFormUpload] = useState(true);
  const [dropdownValues, setDropdownValues] = useState([]);
  const imgStaffRef = useRef();
  const rolRef = useRef();
  const nameRef = useRef();

  const dropdownStaffRef = useRef();

  /* función encargada de ejecutar el almacenamiento de la imagen a 
  firebase storage y ejecutar el metodo post para guardar el staff */
  async function saveFirebaseImg(event) {
    event.preventDefault();
    const file = imgStaffRef.current.files[0];
    const rol = rolRef.current;
    const name = nameRef.current;

    if (file !== undefined &&
      rol.value !== '' &&
      name.value !== '') {
      alert('Actualización en proceso...');
      saveImg('poderosas-staff', file, (value) => {
        console.log(`Img URL: ${value}`);
        // una vez obtenida la url terminamos de envíar el post
        sendPostRequire(value, rol.value, name.value);
      });
    } else {
      alert('Complete el formulario.');
    }
  }

  /**
   * Función encargada de ejecutar el metodo POST para almacenar el miembro del equipo
   * @param {*} urlImg url de la imagen almacenada en FirebaseStorage
   * @param {*} rol rol del miembro del equipo
   * @param {*} name nombre el integrante
   */
  async function sendPostRequire(urlImg, rol, name) {
    try {
      const token = localStorage.getItem('admin');
      //armamos el objetoa enviar con la info del miembro
      const body = {
        img: urlImg,
        name: name,
        position: rol,
      }
      const response = await fetch(`${path}/staff/createStaff`, {
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
      } else if (responseJson.msq === 'Elemento de Staff insertada con exito') {
        alert('Elemento de Staff insertada con éxito.');
        window.location.reload();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  /*función encargada de obtener el nombre de la imagen subida e igualmente
  controlar el tamaño de la imagen subida*/
  const changeImgText = (event) => {
    event.preventDefault();
    if (imgStaffRef.current.files.length > 0 &&
      imgStaffRef.current.files[0].size < 2097152) {
      setImgText(imgStaffRef.current.files[0].name);
    }
  }

  const showUploadForm = () => {
    serFormUpload(true);
  }

  const showDeleteForm = () => {
    serFormUpload(false);
  }

  /**
   * función encargada de implementar el metodo DELETE para eliminar un miembro del equipo
   * almacenada en la base de datos
   * @param event objeto tipo evento
   */
  async function sendDeleteRequere(event) {
    event.preventDefault();
    const token = localStorage.getItem('admin');
    let dropdown = dropdownStaffRef.current;
    const response = await fetch(`${path}/staff/deleteStaff`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `bearer ${token}`
      },
      method: "DELETE",
      body: JSON.stringify({ id: dropdown.value })
    });
    const responseJson = await response.json();
    if (responseJson.msq === 'Elemento de Staff eliminado con exito') {
      alert('Elemento de Staff eliminado con éxito.');
    } else if (responseJson.msq === 'Token Expired') {
      alert('Su sesión expiró, inicie sesión nuevamente.');
      history.push('./login');
    } else {
      alert('Tuvimos un problema, intetalo más tarde.');
    }
    window.location.reload();
  }

  //ejecutamos el useEffect una sola vez, al cargar por primera vez el componente
  useEffect(async function () {
    /*obtenemos el staff almacenado actualmente en la base de datos y procedemmos
    a guardarlas en su respectivo estado */
    const response = await fetch(`${path}/staff/getStaff`);
    const jsonResponse = await response.json();
    const slideItems = jsonResponse.resultado;
    setDropdownValues(slideItems);
  }, [])

  return (
    <section className='admin-form'>
      <p className='sub-title'>Staff</p>
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
            <span className='label-text' id='staff-name'>Nombre</span>
            <input type='text' className='text-input' ref={nameRef}></input>
          </div>
          <div className='form-item'>
            <span className='label-text' id='staff-position'>Posición</span>
            <input type='text' className='text-input' ref={rolRef}></input>
          </div>
          <div className='form-item'>
            <label className='label-text'>Imagen</label>
            <span className='updload-img-box'>
              <input
                type="file"
                accept='image/png, .jpeg, .jpg,'
                name="files"
                className='upload-label'
                id='upload-staff-label'
                ref={imgStaffRef}
                onChange={changeImgText} >
              </input>
              <label
                htmlFor='upload-staff-label'
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
            <label className='label-text'> Seleccionar Noticia: </label>
            <select required className='dropdown' ref={dropdownStaffRef}>
              {
                dropdownValues.map((value, index) => (
                  <option
                    value={value._id}
                    key={value._id}
                  >
                    {value.name}
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
export default StaffForm;
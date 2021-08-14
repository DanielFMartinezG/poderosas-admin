import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/formSliderHome.css';
import events_array from '../../scripts/deparment_events';

const FormMap = () => {

  const path = 'http://localhost:3000';
  const history = useHistory();
  const [formUpload, serFormUpload] = useState(true);
  const [eventsDepartments, setEventsDepartments] = useState([]);
  const [events, setEvents] = useState([]);
  const departmentRef = useRef();
  //subir evento
  const titleRef = useRef();
  const descriptionRef = useRef();
  //eliminar
  const deparmentDeleteRef = useRef();
  const eventRef = useRef();

  const showUploadForm = () => {
    serFormUpload(true);
  }

  const showDeleteForm = () => {
    serFormUpload(false);
  }

  async function sendDeleteRequere(event) {
    event.preventDefault();
    const token = localStorage.getItem('admin');
    let dropdown = eventRef.current;
    alert('Comenzar a eliminar el evento.');
    const response = await fetch(`${path}/map/deleteEvent`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `bearer ${token}`
      },
      method: "DELETE",
      body: JSON.stringify({ id: dropdown.value })
    })
    const responseJson = await response.json();
    if (responseJson.msq === 'Token Expired') {
      alert('Expiró el tiempo de inicio de sesión');
      history.push('./login');
    } else if (responseJson.msq === 'Evento de departamento eliminado con exito') {
      console.log(responseJson.result);
      alert('Evento eliminado con éxito.');
      window.location.reload();
    }

  }

  const getEvents = () => {
    const departmentValue = deparmentDeleteRef.current;
    const index = events_array.findIndex(val => val.department_id == departmentValue.value);
    setEvents(events_array[index].event);
  }

  async function saveEvent(event) {
    event.preventDefault();
    try {
      const token = localStorage.getItem('admin');
      const department = departmentRef.current;
      const title = titleRef.current;
      const description = descriptionRef.current;

      const body = {
        departamento: department.value,
        evento: title.value,
        descripcion: description.value,
      }
      alert('Comenzar a insertar el evento.');
      const response = await fetch(`${path}/map/createEvent`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify(body)
      })
      const responseJson = await response.json();
      console.log(responseJson);
      if (responseJson.msq === 'Token Expired') {
        alert('Expiró el tiempo de inicio de sesión');
        history.push('./login');
      } else if (responseJson.msq === 'Evento de mapa insertado con exito') {
        console.log(responseJson.result);
        alert('Evento insertado con éxito.');
        window.location.reload();
      }
    } catch (error) {
      alert('Error al insertar el evento.');
      console.log(error.message);
    }
  }


  //ejecutramos el useEffect una sola vez, al cargar por primera vez el componente
  useEffect(async function () {
    const response = await fetch(`${path}/map/getEvent`);
    const events = await response.json();
    const currentEvents = events.resultado;
    currentEvents.forEach(event => {
      const index = events_array.findIndex(val => val.department_id === event.ID_departament);
      events_array[index].event.push({
        event_id: event._id,
        event_title: event.name_event,
        event_descritpion: event.descripcion,
      });
    });
    //TODO debo tomar los valores de la API
    let departmentWithEvents = [];
    for (let i = 0; i < events_array.length; i++) {
      if (events_array[i].event.length > 0) {
        departmentWithEvents.push({
          department_id: events_array[i].department_id,
          department: events_array[i].department,
        });
      }
    }
    if(departmentWithEvents.length>0){
      let initialEvents = [];
      const index = events_array.findIndex(value => value.department_id === departmentWithEvents[0].department_id);
      //optenemos los eventos del primer departamento con información en event
      if (index != -1) {
        initialEvents = events_array[index].event;
      }
      setEventsDepartments(departmentWithEvents);
      setEvents(initialEvents);
    }
  }, [])

  return (
    <section className='admin-form'>
      <p className='sub-title'>Mapa de eventos</p>
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
            <label className='label-text'> Departamento </label>
            <select required className='dropdown' ref={departmentRef}>
              {
                events_array.map((value) => (
                  <option
                    value={value.department_id}
                    key={value.department_id}
                  >
                    {value.department}
                  </option>
                ))
              }
            </select>
          </div>
          <div className='form-item'>
            <span className='label-text' id='map-title'>Título</span>
            <input type='text' className='text-input' ref={titleRef}></input>
          </div>
          <div className='form-item'>
            <span className='label-text' id='map-description'>Descripción</span>
            <textarea name="mensaje" rows="4" className='text-area' ref={descriptionRef}></textarea>
          </div>
          <button
            className='button-template update-button'
            onClick={saveEvent}
          >
            Actualizar
          </button>
        </form>

        <form
          action="#"
          className={!formUpload ? "form-admin form-admin-active" : "form-admin"}
          id="form-delete-img"
        >
          <div className='form-item'>
            <label className='label-text'> Departamento </label>
            <select className='dropdown' ref={deparmentDeleteRef} onChange={getEvents}>
              {
                eventsDepartments.map((value) => (
                  <option
                    value={value.department_id}
                    key={value.department_id}
                  >
                    {value.department}
                  </option>
                ))
              }
            </select>
          </div>
          <div className='form-item'>
            <label className='label-text'> Evento </label>
            <select required className='dropdown' ref={eventRef}>
              {
                events.map((value, index) => (
                  <option
                    value={value.event_id}
                    key={`item-${index + 1}`}
                  >
                    {value.event_title}
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
export default FormMap;
import React from 'react';
import FormSliderHome from '../components/Slider-Home-Form/FormSliderHome';
import FormMap from '../components/Map/FormMap';
import NewsForm from '../components/News/NewsForm';
import PartnersForm from '../components/partners/partnersForm';
import SliderAboutUsForm from '../components/Slider-abotUs/SlideAboutUsForm';
import StaffForm from '../components/Staff/StaffForm';

const Home = () => {

  return (
    <React.Fragment>
      <p className='main-title'>Poderosas <br></br>Administrador</p>
      <section className='body-section'>
        <FormSliderHome />
        <FormMap />
        <NewsForm />
        <PartnersForm />
        <SliderAboutUsForm />
        <StaffForm />
      </section>
    </React.Fragment>
  );
}
export default Home;
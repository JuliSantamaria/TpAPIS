import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../assets/carousel.css';

export default function Carousel() {
  return (
    <div className="carousel-container">
      <div className="carousel-content">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
        {/*   <SwiperSlide>
            <div className="slide-wrapper">
              <img src="/img/pedales.png" alt="Pedales Mooer" className="slide-image" />
              <div className="slide-text">
                <p className="subheading">PEDALES MOOER CON SONIDO PRO</p>
                <h2>¡Aprovechá 22% OFF<br />en Mooer!</h2>
                <p className="description">
                  Pedales de efecto, preamps, fuentes y más para guitarra y bajo. Alta calidad, gran variedad y ahora con 22% de descuento.
                </p>
                <button className="cta-button">Ver producto</button>
              </div>
            </div>
        
            </SwiperSlide>
        */}
          <SwiperSlide className="slide-guitarras">
            <div className="slide-wrapper">
              <img src="/img/guitarras carousel.png" alt="Pedales Mooer" className="slide-image" />
              <div className="slide-text">
                <p className="subheading">GUITARRAS QUE INSPIRAN TU SONIDO</p>
                <h2>¡Llevate tu guitarra<br />con hasta 25% OFF!</h2>
                <p className="description">
                    Modelos clásicos y modernos para cada estilo. Ideal para principiantes y profesionales. Encontrá la tuya hoy con grandes descuentos y variedad garantizada.
                </p>
                <button className="cta-button">Ver producto</button>
              </div>
            </div>
          </SwiperSlide>
{/*
          <SwiperSlide>
            <div className="slide-wrapper">
              <img src="/img/piano carousel.png" alt="Pedales Mooer" className="slide-image" />
              <div className="slide-text">
                <p className="subheading">EXPERIENCIA MUSICAL CON SONIDO PREMIUM</p>
                <h2>¡Descubrí pianos con<br />hasta 20% OFF!</h2>
                <p className="description">
                    Pianos digitales y acústicos de alta calidad para todos los niveles. Disfrutá de una experiencia sonora única con descuentos especiales por tiempo limitado.
                </p>
                <button className="cta-button">Ver producto</button>
              </div>
            </div>
          </SwiperSlide>
*/}
        </Swiper>
      </div>
    </div>
  );
}
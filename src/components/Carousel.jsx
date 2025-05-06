// src/components/Carousel.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../assets/carousel.css';

export default function Carousel() {
  return (
    <div className="carousel-container">
        <div className="carousel-content">
            <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
            >
                <SwiperSlide>
                    <img src="/img/pedales.png" alt="Banner 1" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/img/guitarras carousel.png" alt="Banner 2" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/img/piano carousel.png" alt="Banner 3" />
                </SwiperSlide>
            </Swiper>
        </div>
      
    </div>
  );
}

import { useState } from 'react';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; // Updated import for modules
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import BattlerProfile from "./BattlerProfile";

SwiperCore.use([Navigation, Pagination]); // Init modules

function ProfilesPage({ battlers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredBattlers = battlers.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 sm:text-xl">Battler Profiles</h2>
      <input
        type="text"
        placeholder="Search battlers..."
        className="bg-gray-700 p-3 rounded-lg w-full mb-4 text-lg sm:text-base sm:p-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Swiper
        spaceBetween={20}
        slidesPerView={1} // 1 on mobile, adjust below
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
        }}
      >
        {filteredBattlers.map((battler) => (
          <SwiperSlide key={battler.id}>
            <BattlerProfile battler={battler} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProfilesPage;
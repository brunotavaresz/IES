import React from 'react';
import bruno from '../../Images/bruno.jpg';
import chicao from '../../Images/chicao.jpg';
import andre from '../../Images/andre.jpg';
import diogo from '../../Images/diogo.jpg';

export default function AboutUs() {
  return (
    <div className="w-full bg-gray-100 py-24"> {/* Aumentei a distância superior e inferior */}

      {/* Container Principal com Background Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-8">

        {/* Cabeçalho da Página */}
        <div className="text-center mb-12"> {/* Aumentei a margem inferior */}
          <h1 className="text-4xl font-extrabold tracking-tight leading-none text-gray-800 md:text-5xl lg:text-6xl">
            About Us
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Welcome to BeachControl – your ultimate source for real-time beach conditions. Our mission is to keep beachgoers informed and safe by providing live data on various environmental factors at popular beaches.
          </p>
        </div>

        {/* Missão e Visão */}
        <div className="mb-12 text-center bg-gray-50 p-10 rounded-lg shadow-md"> {/* Aumentei o padding e a margem inferior */}
          <h2 className="text-3xl font-semibold text-gray-800">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            At BeachControl, we strive to provide accurate and timely information on beach conditions such as water temperature, air temperature, UV index, wind speed, and more. Our goal is to make beach experiences safer and more enjoyable for everyone.
          </p>
        </div>

        {/* O que Medimos */}
        <div className="text-center mb-12"> {/* Aumentei a margem inferior */}
          <h2 className="text-3xl font-semibold text-gray-800">What We Track</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cards para Métricas */}
            {[
              { title: 'Water Temperature', description: '🌊 Our real-time water temperature readings help you know when it\'s the perfect time to dive in!' },
              { title: 'Air Temperature', description: '🌡️ Keep track of the air temperature so you can dress appropriately for the beach.' },
              { title: 'UV Index', description: '🌞 Stay safe by knowing the UV index. Protect yourself from harmful sun exposure!' },
              { title: 'Cloud Cover', description: '☁️ Our cloud cover data helps you predict whether you\'ll need sunglasses or an umbrella.' },
              { title: 'Precipitation', description: '🌧️ We provide real-time precipitation data, so you\'ll know if it\'s a good day to visit the beach.' },
              { title: 'Wind Conditions', description: '🌬️ Our wind data ensures you can enjoy your day at the beach, whether you\'re surfing or just lounging.' }
            ].map((metric, index) => (
              <div key={index} className="bg-white border rounded-lg p-6 text-center shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800">{metric.title}</h3>
                <p className="text-gray-600 mt-2">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Como Funciona */}
        <div className="mb-12 text-center bg-gray-50 p-10 rounded-lg shadow-md"> {/* Aumentei o padding e a margem inferior */}
          <h2 className="text-3xl font-semibold text-gray-800">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            BeachControl collects real-time data from trusted sources and local sensors to provide you with accurate information about beach conditions. Our platform allows you to easily check key metrics such as water and air temperature, UV index, and more.
          </p>
          <div className="mt-8">
            <a
              href="/home"
              className="inline-block bg-blue-600 text-white py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Explore Beaches
            </a>
          </div>
        </div>

        {/* Equipe */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Meet Our Team</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We are a passionate group of tech enthusiasts and beach lovers committed to making your beach experience better. From developers to beach experts, we work hard to bring you the most accurate and reliable data.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Cards para Membros da Equipe */}
            {[
              { name: 'Bruno Tavares', title: 'DevOps', image: bruno, insta: 'https://www.instagram.com/brunotavaresz_/' },
              { name: 'Francisco Pinto', title: 'Team Leader', image: chicao , insta: 'https://www.instagram.com/chicao_pintao/'},
              { name: 'Andre Alves', title: 'Architect', image: andre , insta : 'https://www.instagram.com/aaandre_._/'},
              { name: 'Diogo Costa', title: 'Product Owner', image: diogo , insta: 'https://www.instagram.com/03diogocosta/'}

            ].map((member, index) => (
              <a href={member.insta} target="_blank" rel="noreferrer" >
              <div key={index} className="bg-white border rounded-lg p-6 text-center shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
                <img src={member.image} alt="Team Member" className="mx-auto rounded-full mb-4 w-24 h-24 object-cover" />
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.title}</p>
              </div>
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

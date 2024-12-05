import React from 'react';
//imagem de boas vindas
import Polidex from '../assets/polidex.png';

const WelcomePolidex = () => {
    return (

        <header className='w-full'>

            {/* Imagem de boas vindas */}
            <img 
            src={Polidex} 
            alt="Polidex"
            className="w-full sm:w-2/3 md:w-1/2 lg:w-1/4 h-auto object-cover mx-auto" />

            {/* Texto de boas vindas */}
            <div className='mt-6 text-center'>
                <p className='mt-2 text-base sm:text-lg md:text-xl  '>
                    Bem vindo à Polidex, aqui você pode pesquisar sobre seus pokemons favoritos!
                </p>
            </div>
        </header>
    );
};

export default WelcomePolidex;
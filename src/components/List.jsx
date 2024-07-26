import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [limit, setLimit] = useState(16);

  const fetchPokemonList = async (limit) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      const pokemonList = response.data.results;

      const fetches = pokemonList.map(pokemon => axios.get(pokemon.url));
      const results = await Promise.all(fetches);

      const detailedData = results.map(result => result.data);
      setPokemonData(detailedData);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };

  useEffect(() => {
    fetchPokemonList(limit);
  }, [limit]);

  const handleInputChange = (event) => {
    setFilterQuery(event.target.value);
  };

  const loadMore = () => {
    setLimit(prevLimit => prevLimit + 4);
  };

  const filteredPokemonData = pokemonData.filter(pokemon =>
    pokemon.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div>
      <div className='w-full bg-slate-700 h-20 flex justify-center items-center'>
        <input
          type="text"
          placeholder="Filter Pokemon"
          value={filterQuery}
          onChange={handleInputChange}
          className='h-10 rounded-md text-center w-3/4 md:w-1/2 lg:w-1/3'
        />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 p-4'>
        {filteredPokemonData.map((pokemon, index) => (
          <div key={index} className='m-4 flex flex-col items-center cursor-pointer hover:scale-105 transition-all border shadow-xl h-[400px] rounded-lg p-2'>
            <div className='relative'>
              <img src="./bg.jpg" alt="" className='relative w-full'/>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} className='absolute top-8 left-16 h-36 object-cover' />
            </div>
            <h3 className='mt-8 font-bold text-xl uppercase text-center'>{pokemon.name}</h3>
            <p className='text-md font-semibold text-center'>Weight: {pokemon.weight}</p>
            <p className='text-md font-semibold text-center'>Forms: {pokemon.forms.map(form => form.name).join(', ')}</p>
            <p className='text-md font-semibold text-center'>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            <p className='text-md font-semibold text-center'>Moves: {pokemon.moves.slice(0, 5).map(move => move.move.name).join(', ')}</p>
          </div>
        ))}
      </div>
      <div className='flex justify-center m-6'>
        <button onClick={loadMore} className='px-4 py-2 bg-slate-500 text-white rounded-md font-bold hover:bg-slate-700 hover:scale-110 transition-all'>
          Load More
        </button>
      </div>
    </div>
  );
};

export default PokemonList;

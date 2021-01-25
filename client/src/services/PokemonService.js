import pokeApi from '../api/pokeApi';
import axios from "axios";
import config from "../config";

export const getPokemons = async (offset, limit) => {
  return pokeApi.get('/pokemon', {
    params: {
      offset,
      limit
    }
  });
};

export const fetchPokeURL = (url) => {
  return axios.get(url, {responseType: 'json'})
}

export const getColorTagStyle = (type) => {
  return `card__type-chip ${type}-type`;
};

export const transformPokemonForPage = (pokemonDetails, additionalInfo) => {
  return {
    ...transformPokemonForCard(pokemonDetails),
    weight: pokemonDetails.weight,
    height: pokemonDetails.height,
    baseExp: pokemonDetails.base_experience,
    species: additionalInfo.species,
    abilities: additionalInfo.abilities,
    weaknesses: additionalInfo.weaknesses
  };
};

export const transformPokemonForCard = (pokemonDetails) => {
  return {
    ...transformPokemonForMiniCard(pokemonDetails),
    types: pokemonDetails.types.map((typesEl) => typesEl.type.name),
    stats: {
      HP: pokemonDetails.stats[0]?.base_stat || 'N/A',
      ATK: pokemonDetails.stats[1]?.base_stat || 'N/A',
      DEF: pokemonDetails.stats[2]?.base_stat || 'N/A',
      SpATK: pokemonDetails.stats[3]?.base_stat || 'N/A',
      SpDEF: pokemonDetails.stats[4]?.base_stat || 'N/A',
      SPD: pokemonDetails.stats[5]?.base_stat || 'N/A'
    }
  };
};

export const transformPokemonForMiniCard = (pokemonDetails) => {
  return {
    id: pokemonDetails.id,
    name: pokemonDetails.name,
    image:
      pokemonDetails.sprites.other['official-artwork'].front_default ||
      config.pokeballUrl
  }
}

export const getTypeByName = (type) => {
  return pokeApi.get(`/type/${type}`);
};

export const getPokemonById = async (id) => {
  return pokeApi.get(`/pokemon/${id}`);
};

export const getPokemonByName = async (name) => {
  return pokeApi.get(`/pokemon/${name}`);
};

export const getSpeciesByName = async (name) => {
  return pokeApi.get(`pokemon-species/${name}`);
};

export const getAbilitiesForPokemon = async (pokemonDetails) => {
  const abilities = [];
  for (let abilityElement of pokemonDetails.abilities) {
    const abilityResponse = (
      await fetchPokeURL(abilityElement.ability.url)
    ).data;
    abilities.push({
      name: abilityElement.ability.name,
      desc: abilityResponse.flavor_text_entries.filter(entry=> entry.language.name === 'en')[0].flavor_text.replace('\u000c', ' ')
    });
  }
  return abilities;
};

export const getWeaknessesForPokemon = async (pokemonDetails) => {
  const weaknessesDouble = new Set();
  const weaknessesQuad = new Set();
  const types = [];
  for (let typeEl of pokemonDetails.types) {
    types.push((await getTypeByName(typeEl.type.name)).data);
  }

  for (let type of types) {
    for (let weakness of type.damage_relations.double_damage_from) {
      if (
        weaknessesDouble.has(weakness.name) &&
        !weaknessesQuad.has(weakness.name)
      ) {
        weaknessesDouble.delete(weakness.name);
        weaknessesQuad.add(weakness.name);
      } else {
        weaknessesDouble.add(weakness.name);
      }
    }
  }
  for (let type of types) {
    for (let strength of type.damage_relations.half_damage_from) {
      switch (true) {
        case weaknessesDouble.has(strength.name):
          weaknessesDouble.delete(strength.name);
          break;
        case weaknessesQuad.has(strength.name):
          weaknessesQuad.delete(strength.name);
          weaknessesDouble.add(strength.name);
          break;
        default:
          break;
      }
    }
    for (let immunity of type.damage_relations.no_damage_from) {
      switch (true) {
        case weaknessesDouble.has(immunity.name):
          weaknessesDouble.delete(immunity.name);
          break;
        case weaknessesQuad.has(immunity.name):
          weaknessesQuad.delete(immunity.name);
          break;
        default:
          break;
      }
    }
  }

  return Array.from(new Set([...weaknessesDouble, ...weaknessesQuad]));
};

export const getSpeciesForPokemon = async (pokemonDetails) => {
  const species = (await getSpeciesByName(pokemonDetails.species.name)).data;
  return {
    name: pokemonDetails.species.name,
    desc: species.flavor_text_entries.filter(entry=> entry.language.name === 'en')[0].flavor_text.replace('\u000c', ' ')
  };
};

export const getPokemonForPage = async (id) => {
  const pokemonDetails = (await getPokemonById(id)).data;
  const addInfo = {
    abilities: await getAbilitiesForPokemon(pokemonDetails),
    species: await getSpeciesForPokemon(pokemonDetails),
    weaknesses: await getWeaknessesForPokemon(pokemonDetails)
  };
  return transformPokemonForPage(pokemonDetails, addInfo);
};

// export const getSpeciesByName = async

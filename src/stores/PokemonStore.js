// Pokemon Store
import { defineStore } from 'pinia';

export const usePokemonStore = defineStore('pokemonStore', {
    state: () => ({
        pokemonDetailsList: [],
        pokemonName: null,
        pokemonData: {},
    }),

    actions: {
        setPokemonDetails(pokemonDetails) {
            this.pokemonDetailsList = pokemonDetails;
        },

        updatePokemonDetails(updatedPokemonDetails) {
            this.pokemonDetailsList = this.pokemonName;
            this.pokemonDetailsList = { ...this.pokemonDetailsList, ...updatedPokemonDetails };
        },

        async fetchPokemonName(selectedPokemonName) {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemonName}`);
                this.pokemonName = await res.json();
            } catch (error) {
                console.error('Error fetching pokemon data', error);
            }
        },
    },
});
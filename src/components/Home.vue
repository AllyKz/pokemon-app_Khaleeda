<!-- Pokemon App Home Page -->
<template>
    <div>

        <!-- Button to navigate to the previous and next page -->
        <button @click="$router.go(-1)">Back</button>
        <button @click="$router.go(1)">Next</button>

        <h2 style="color: #ffcb05; font-weight: bold; margin: 20px 0px;">Pokemon App</h2>
        <h3 style="color: white; font-weight: 500; font-size: larger; margin-bottom: 20px;">List of pokemon</h3>

        <div>
            <!-- Search Bar Field -->
            <input class="large-input" style="margin: 10px;" type="text" v-model="searchQuery" placeholder="Search Pokemon">
            
            <!--  Loader -->
            <div v-if="isLoading" class="text-center">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Loading...</p>
            </div>

            <!-- Display pokemon's name, image, info -->
            <div class="pokemonInfo" v-if="!isLoading && selectedPokemon">
                <h3>Pokemon Details</h3>
                <p><strong>Name:</strong> {{ selectedPokemon.name }}</p>
                <img :src="selectedPokemon.sprites.front_default" alt="Pokemon Image" v-if="selectedPokemon.sprites.front_default" class="item-img">
                <p><strong>Height:</strong> {{ selectedPokemon.height }}</p>
                <p><strong>Weight:</strong> {{ selectedPokemon.weight }}</p>
                <p><strong>Abilities:</strong></p>
                <ul class="itemList">
                    <li v-for="(ability, index) in selectedPokemon.abilities" :key="index">{{ ability.ability.name }}</li>
                </ul>

                <!-- Link to a new page -->
                <button class="custom-button" @click="goToDetails(selectedPokemon.name)">Learn More</button>
            </div>

            <!-- List of Pokemon -->
            <div v-if="!isLoading && filteredPokemon.length">
                <div class="grid-container">
                    <div v-for="(pokemon, index) in filteredPokemon" :key="index" class="card">
                        <div class="card-content">
                            <p style="color: yellow; font-size: 20px; font-weight: bold;"># {{ index + 1 }}</p>
                            <p style="color: white; font-size: 22px; font-weight: 500; text-transform: capitalize;">{{ pokemon.name }}</p>
                            <div>
                                <button class="custom-button" @click="fetchPokemonInfo(pokemon.name)">View Info</button>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>

            <!-- No Data Message -->
            <p v-if="!isLoading && !filteredPokemon.length">No data found.</p>

            <!-- Error Message -->
            <p v-if="error">{{ error }}</p>
        </div>
    </div>
</template>

<script>
import { usePokemonStore } from '../stores/PokemonStore';

export default {
    data() {
        return {
            searchQuery:'',
            pokemonData: {},
            selectedPokemon: null,
            isLoading: true,
            error: null,
            cards: Array.from({ length: 100 }, (_, i) => ({ id: i + 1 })),
        };
    },
    created() {
        this.fetchPokemonData(); //fetch data when the component is created
    },
    methods: {
        // to fetch pokemon data and limit the list to only 100 rows
        async fetchPokemonData() {
            try {
                const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100&offset=100");
                this.pokemonData = await res.json();
            } catch (error) {
                this.error = "Failed to fetch data";
                console.error("Error fetching data:", error);
            } finally {
                this.isLoading = false;
            }
        },

        // to fetch pokemon information
        async fetchPokemonInfo(pokemonName) {
            const pokemonStore = usePokemonStore();
            try{
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                this.selectedPokemon = await res.json();
                pokemonStore.setPokemonDetails(this.selectedPokemon);

            }
            catch (error) {
                this.error = "Failed to fetch data"; // Set error message
                console.error("Error fetching data:", error);
            }
            finally {
                this.isLoading = false;
            }
        },

        goToDetails(pokemonName) {
            // Programmatically navigate to Pokemon Details Page with selected Pokemon Name
            this.$router.push({ name: 'PokemonDetails', params: { name: pokemonName }});
        }
    },

    computed: {

        //filter the data according to the search query
        filteredPokemon() {
            return Array.isArray(this.pokemonData.results)
                ? this.pokemonData.results.filter((item) => {
                    return item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                })
                : [];
        },
    },
};
</script>

<style scoped>
.large-input {
  width: 300px;      
  height: 50px;      
  font-size: 18px;  
  padding: 10px;     
  border-radius: 5px; 
}

.item-img {
  width: 100%; 
  height: auto; 
  max-width: 100px; 
  object-fit: cover; 
  margin-bottom: 16px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px; 
}

.card {
  background-color: #F2684A;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  padding: 18px 5px;
  margin: 10px 0;
  width: 200px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.05); 
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.custom-button {
  background-color: white;
  color: black;
  border: 2px solid white;
}

.custom-button:hover {
  background-color: #555555;
  color: white;
  border: #555555;
}

.pokemonInfo {
    background: rgba(137, 175, 216, 0.39);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.9px);
    -webkit-backdrop-filter: blur(5.9px);
    border: 1px solid rgba(137, 175, 216, 0.3);
    margin: 0px 200px;
    padding: 15px 0px;
    text-transform: capitalize;
    font-size: 18px;
}

.itemList li{
    display: flex;          
    justify-content: center; 
    list-style-type: none;  
    margin-left: -30px;
}

/* Responsive grid for tablets */
@media (max-width: 768px) {

  .large-input {
    width: 200px;      
    }

  .grid-container {
    grid-template-columns: repeat(3, 1fr); 
  }

  .item-img {
    width: 70%;
  }

  .pokemonInfo {
    margin: 0px 100px;
    padding: 50px 0px;
}
}

/* Responsive grid for mobile */
@media (max-width: 480px) {

   .large-input {
     width: 200px;      
  }

  .grid-container {
    grid-template-columns: repeat(1, 1fr); 
  }

  .card {
    margin-left: 2rem;
  }

  .item-img {
    width: 50%; 
  }

  .pokemonInfo {
    margin: 0px 50px;
    padding: 15px 0px;
  }
}
</style>
<!-- Pokemon Details Page -->
<template>
    <div class="outer">
        <button @click="$router.go(-1)">Back</button>
        <button @click="$router.go(1)">Next</button>

        <div v-if="loading">Loading...</div>

        <!--  Loader -->
        <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Loading...</p>
        </div>

        <!-- Pokemon Details -->
        <div class="pokemonDetails" v-if="!loading && details">
            <h3 style="text-transform: capitalize;">{{ details.name }}</h3>

            <img :src="details.sprites.front_default" alt="Pokemon Image" v-if="details.sprites.front_default" class="item-img">
            <p><strong>Height:</strong> {{ details.height }}</p>
            <p><strong>Weight:</strong> {{ details.weight }}</p>
            <p v-for="(pokemonStats, index) in details.stats" :key="index" class="pokemon-details-stats">
            <strong>{{ pokemonStats.stat.name }}:</strong> {{ pokemonStats.base_stat }}
            </p>
        </div>

        <div v-if="!loading && !details">Pokemon not found</div>

        <!-- Error Message -->
        <p v-if="error">{{ error }}</p>

        <!-- Pokemon Details to be edited -->
        <div class="editForm" v-if="!loading && isEditing">
            <p>Edit Pokemon's Info:</p>
            <div class="form-group">
                <label for="name">Pokemon Name:</label>
                <input v-model="editedPokemon.name" placeholder="Edit Pokemon Name" class="form-input"><br>
            </div>

            <div class="form-group">
                <label for="height">Pokemon Height:</label>
                <input v-model="editedPokemon.height" placeholder="Edit Pokemon Height" class="form-input">
            </div>

            <div class="form-group">
                <label for="height">Pokemon Weight:</label>
                <input v-model="editedPokemon.weight" placeholder="Edit Pokemon Weight" class="form-input">
            </div>

            <div class="form-group">
                <div v-for="(pokemonStats, index) in editedPokemon.stats" :key="index" class="pokemon-details">
                    <label for="base_stat">{{ pokemonStats.stat.name }}:</label>
                    <input v-model="pokemonStats.base_stat" placeholder="Edit Pokemon Base_State" class="form-input">
                </div>
            </div>

            <button @click="submitEdit">Save Changes</button>
            <button @click="cancelEdit">Cancel</button>
        </div>
        <button v-else @click="toggleEdit">Edit Pokemon Details</button>

    </div>
</template>

<script>
import { usePokemonStore } from '../stores/PokemonStore';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const loading = ref(true);

        const route = useRoute();
        const pokemonStore = usePokemonStore();

        const isEditing = ref(false);
        const editedPokemon = ref({});
        const error = ref(null);
        const details = ref(null);

        const toggleEdit = () => {
            isEditing.value = true;
            loading.value = false;
            editedPokemon.value = { ...details.value }; // Copy existing pokemon data
        };

        const submitEdit = () => {
            pokemonStore.updatePokemonDetails(editedPokemon.value);
            details.value = pokemonStore.pokemonDetailsList;;
            isEditing.value = false;
        };

        const cancelEdit = () => {
            isEditing.value = false;
        };

        onMounted(async() => {
            // Fetch pokemon details based on the pokemon's name from route params
            await pokemonStore.fetchPokemonName(route.params.name);
            details.value = pokemonStore.pokemonName;
            loading.value = false;
        });

        return {
            // pokemonName: pokemonStore.pokemonName,
            loading,
            isEditing,
            editedPokemon,
            toggleEdit,
            submitEdit,
            cancelEdit,
            error,
            details,
        };
    },
};
</script>

<style scoped>
.outer {
    background-color: #3a80b6;
}

.pokemonDetails {
    margin: 0px 200px;
    padding: 40px;
    text-transform: capitalize;
    font-size: 18px;
}

.pokemon-details-stats {
    text-transform: capitalize;
}

.editForm {
    text-align: left;

    p, label {
        font-size: 18px;
        font-weight: bold;
    }
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
}

.form-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

button {
  margin-top: 20px;
  background-color: white;
  color: black;
  border: 2px solid white;
}

button:hover {
  background-color: #555555;
  color: white;
  border: #555555;
}

/* Responsive grid for tablets */
@media (max-width: 768px) {
    .form-group {
        margin-right: 100px;
    }
}

/* Responsive grid for mobile */
@media (max-width: 480px) {
    .form-group {
        margin-right: 0px 100px;
    }
}

</style>
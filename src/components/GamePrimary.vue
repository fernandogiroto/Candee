<script setup>
import api from "@/services/api";
import {cardGamesStore} from "../store/cardGames";
import { ref, reactive, defineProps, onMounted } from 'vue';
import { mapActions, storeToRefs } from "pinia";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const props = defineProps({
  tabId: String,
});

const gamePrimary = cardGamesStore();
const {gamePrimaryID, gamePrimaryCardsRemaining, gamePrimaryDeckPile, gamePrimaryStart} = storeToRefs(gamePrimary);
const {gamePrimaryAddCardToPile} = mapActions(cardGamesStore, ["gamePrimaryAddCardToPile"]);

const gamePrimaryNewGame = () =>{
  if(gamePrimaryStart.value == false)
    gamePrimaryNewDeck();
    gamePrimaryStart.value = true;
}

const gamePrimaryResetGame = () => {
  gamePrimaryNewDeck();
  gamePrimaryStart.value = false;
  gamePrimaryDeckPile.value = []
}

const gamePrimaryNewDeck = () => 
  api.get("/new/shuffle/")
  .then(({data})=>{
    gamePrimaryCardsRemaining.value = data.remaining;
    gamePrimaryID.value = data.deck_id;
    console.log(data);
});

const gamePrimaryAddCardOnPile = () => {
  if(gamePrimaryCardsRemaining.value != 0){
    api.get(`${gamePrimaryID.value}/draw/`)
    .then(({data})=>{
      gamePrimaryCardsRemaining.value = data.remaining;
      console.log(data['cards']);
      gamePrimary.gamePrimaryAddCardToPile(...data['cards']);
    });
  }else{
    console.log("No more cards");
    toast.error("No more cards", {autoClose: 4000,}); 
  }
}
const gamePrimaryShuffleDeck = () => 
  api.get(`${gamePrimaryID.value}/shuffle/?remaining=true`)
  .then(({data})=>{
    gamePrimaryCardsRemaining.value = data.remaining;
    console.log(data);
    toast.info("Deck Cards was shuffled", {autoClose: 3000,}); 
});

const gamePrimaryShufflePileDeck = () => {
  gamePrimaryDeckPile.value.sort(() => Math.random() - 0.5);
}

onMounted(gamePrimaryNewGame);
</script>
<template>
    <!-- GAME PRIMARY -->
    <div class="tab-pane fade show active" :id="tabId" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
      <div class="table-cards-border"> 
        <div class="row table-cards py-5 px-5">
          <div class="col-12 col-md-3 mb-3">
            <img v-if="gamePrimaryCardsRemaining != 0 " src="../assets/images/card.png"  class="card-image pointer getCardEffect" @click="gamePrimaryAddCardOnPile">
            <img v-else src="../assets/images/card_joker.png"  class="card-image pointer getCardEffect" @click="gamePrimaryAddCardOnPile">
          </div>
          <div class="col-12 col-md-9">
            <p><span class="badge bg-success">CARDS REAMINING: {{gamePrimaryCardsRemaining}}</span></p>
            <p><span class="badge bg-light text-dark">DECK ID: {{gamePrimaryID}}</span></p>
            <div class="d-flex">
              <button type="button" class="btn btn-sm btn-info" :class="gamePrimaryCardsRemaining == 0 ? 'disabled' : ''" @click="gamePrimaryShuffleDeck">Shuffle Deck</button>
              <button type="button" class="btn btn-sm btn-warning ms-2" :class="gamePrimaryCardsRemaining > 50 ? 'disabled' : ''" @click="gamePrimaryShufflePileDeck">Shuffle Pile Deck</button>
              <button type="button" class="btn btn-sm btn-danger ms-2" @click="gamePrimaryResetGame">New Game</button>
            </div>
            <p class="text-white mt-3">Click on the deck to draw a card and place it on the pile</p>
          </div>
          <div class="col-6 col-md-2 mt-3 cardBounce" v-for="card in gamePrimaryDeckPile" :key="card">
            <img :src="card.image" class="card-image">
          </div>
        </div>
      </div>
    </div>
</template>
<script setup>
import api from "@/services/api";
import {cardGamesStore} from "../store/cardGames";
import { ref, reactive, defineProps, onMounted } from 'vue';
import { mapActions, storeToRefs } from "pinia";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import flipCard from '../assets/sounds/flip_card.mp3'
import shuffleCards from '../assets/sounds/shuffle_cards.mp3'

const props = defineProps({
  tabId: String,
});

const gameSecondary = cardGamesStore();
const {gameSecondaryID, gameSecondaryCardsRemaining, gameSecondaryDeckPile, gameSecondaryStart, gameSecondaryBestScore, gameSecondaryUserScore, gameSecondaryGameOver} = storeToRefs(gameSecondary);
const {gameSecondaryAddCardToPile} = mapActions(cardGamesStore, ["gameSecondaryAddCardToPile"]);
const {gameSecondaryCheckScore} = mapActions(cardGamesStore, ["gameSecondaryCheckScore"]);


 const flipCardSound = async (cardSound) =>{ 
    const audio = new Audio(cardSound);
    audio.play();
 }

const gameSecondaryNewGame = () =>{
  if(gameSecondaryStart.value == false){
    console.log(gameSecondaryStart.value);
    gameSecondaryNewDeck();
    gameSecondaryStart.value = true;
  }
}

const gameSecondaryResetGame = () => {
  gameSecondary.gameSecondaryCheckScore(gameSecondaryUserScore.value);
  gameSecondaryNewDeck();
  gameSecondaryDeckPile.value = [];
  gameSecondaryGameOver.value = false;
  gameSecondaryUserScore.value = 0;
}

const gameSecondaryNewDeck = () => 
  api.get("/new/shuffle/")
  .then(({data})=>{
    gameSecondaryCardsRemaining.value = data.remaining;
    gameSecondaryID.value = data.deck_id;
    flipCardSound(shuffleCards);
    console.log(data);
});

const gameSecondaryAddCardOnPile = () => {
  if(gameSecondaryCardsRemaining.value != 0){
    api.get(`${gameSecondaryID.value}/draw/`)
    .then(({data})=>{
      gameSecondaryCardsRemaining.value = data.remaining;
      const card = data['cards'][0].code;
      flipCardSound(flipCard);

      if(card != 'QS'){
        gameSecondaryUserScore.value++;
      }else{
        gameSecondaryGameOver.value = true;
      }
      gameSecondary.gameSecondaryAddCardToPile(...data['cards']);
    });
  }else{
    console.log("No more cards");
    toast.error("No more cards", {autoClose: 4000,}); 
  }
}
const gameSecondaryShuffleDeck = () => 
  api.get(`${gameSecondaryID.value}/shuffle/?remaining=true`)
  .then(({data})=>{
    gameSecondaryCardsRemaining.value = data.remaining;
    console.log(data);
    toast.info("Deck Cards was shuffled", {autoClose: 3000,}); 
});

const gameSecondaryShufflePileDeck = () => {
  gameSecondaryDeckPile.value.sort(() => Math.random() - 0.5);
}

onMounted(gameSecondaryNewGame);
</script>
<template>
    <!-- GAME SECONDARY -->
    <div class="tab-pane fade show" :id="tabId" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
      <div class="table-cards-border"> 
        <div class="row table-cards py-5 px-5">
          <div class="col-12 col-md-3 mb-3">
            <img v-if="gameSecondaryGameOver == true" src="../assets/images/card_joker.png"  class="card-image pointer getCardEffect">
            <img v-else src="../assets/images/card.png"  class="card-image pointer getCardEffect" @click="gameSecondaryAddCardOnPile">
          </div>
          <div class="col-12 col-md-5">
            <p><span class="badge bg-success">CARDS REAMINING: {{gameSecondaryCardsRemaining}}</span></p>
            <p><span class="badge bg-light text-dark">DECK ID: {{gameSecondaryID}}</span></p>
            <div class="d-flex">
            <button type="button" class="btn btn-sm btn-info" :class="gameSecondaryCardsRemaining == 0 ? 'disabled' : ''" @click="gameSecondaryShuffleDeck">Shuffle Deck</button>
            <button type="button" class="btn btn-sm btn-warning ms-2" :class="gameSecondaryCardsRemaining > 50 ? 'disabled' : ''" @click="gameSecondaryShufflePileDeck">Shuffle Pile Deck</button>
            <button type="button" class="btn btn-sm btn-danger ms-2" @click="gameSecondaryResetGame">New Game</button>
            <button type="button" class="btn btn-sm btn-dark ms-2" data-bs-toggle="modal" data-bs-target="#gameSecondaryRules">Rules</button>
            </div>
            <p class="text-white mt-3">Click on the deck to draw a card and place it on the pile</p>
          </div>
          <div class="col-12 col-md-4">
            <div class="alert alert-primary" role="alert">
              Best Score: {{gameSecondaryBestScore}}
            </div>
            <div class="alert alert-success" role="alert">
              Score: {{gameSecondaryUserScore}}
            </div>
          </div>
          <div class="col-6 col-md-2 mt-4 cardBounce" v-for="card in gameSecondaryDeckPile" :key="card">
            <img :src="card.image" class="card-image">
          </div>
        </div>
      </div>
    </div>
    <!-- Rules -->
    <div class="modal fade" id="gameSecondaryRules" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Game Secondary - Rules</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Remove as many cards from the deck as possible. If you draw the queen of spades, you lose.
          </div>
        </div>
      </div>
    </div>
</template>
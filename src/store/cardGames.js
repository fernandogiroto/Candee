import { defineStore } from "pinia";

export const cardGamesStore = defineStore("games", {
    state: () => ({
        gamePrimaryStart: false,
        gamePrimaryID: null,
        gamePrimaryCardsRemaining: null,
        gamePrimaryDeckPile: [],

        gameSecondaryStart: false,
        gameSecondaryID: null,
        gameSecondaryCardsRemaining: null,
        gameSecondaryDeckPile: [],

        gameSecondaryGameOver: false,
        gameSecondaryUserScore: 0,
        gameSecondaryBestScore: 0,
    }),
    actions: {
        gamePrimaryAddCardToPile(card) {
            this.gamePrimaryDeckPile.push(card);
        },
        gameSecondaryAddCardToPile(card) {
            this.gameSecondaryDeckPile.push(card);
        },
        gameSecondaryCheckScore(score) {
            if (score > this.gameSecondaryBestScore) {
                this.gameSecondaryBestScore = score;
            }
        }
    },
    persist: {
        enabled: true
    }
})
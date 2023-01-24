import { createStore } from "vuex";

import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

import {Howl} from 'howler';

import SpotifyWebApi from "spotify-web-api-node";

const api = new SpotifyWebApi({
    clientId:import.meta.env.VITE_SPOTIFY_CLIENT_ID
});

const correctSound = new Howl({
    src:"/sounds/correct.wav"
});
const incorrectSound = new Howl({
    src:"/sounds/incorrect.wav"
})

export default createStore({
    state:{
        app_ready:false,
        splash:{
            show:false,
            redirect:"",
        },
        tracks:[],
        error:{
            show:false,
            message:""
        },
        game:{
            score:0,
            currentSong:{
                id:"",
                mp3_url:""
            }
        }
    },
    mutations:{
        setReady(state, ready) {
            state.app_ready = ready;
        },
        showSplash(state, url) {
            state.splash.redirect = url;
            state.splash.show = true;
        },
        showError(state, error) {
            state.error.message = error;
            state.error.show = true;
        },
        setTracks(state, tracks) {
            state.tracks = tracks;
        },
        increaseScore(state) {
            state.game.score ++;
        },
        setCurrentSong(state, song) {
            state.game.currentSong.id = song.id;
            state.game.currentSong.mp3_url = song.preview_url;
        }
    },
    getters:{
        tracks(state) {
            return state.tracks;
        },
        currentSongMp3(state) {
            return state.game.currentSong.mp3_url;
        },
        currentSongId(state) {
            return state.game.currentSong.id;
        }
    },
    actions:{
        async authenticate(state, code) {
            try {
                const tokenRequest = await axios.post("/api/token", {code:code});
                api.setAccessToken(tokenRequest.data.tokens.access);
                state.dispatch("fetchTracks");
                window.history.replaceState({}, "spotiguesser", "/");
            } catch (err) {
                state.commit("showError", "Failed to authenticate with Spotify");
                state.commit("setReady", false);
                console.error(err);
            }
        },
        async fetchTracks(state) {
            try {
                const topTracks = await api.getMyTopTracks({time_range:"medium_term", limit:24});
                state.commit("setTracks", topTracks.body.items);
                state.commit("setReady", true);
            } catch (err) {
                state.commit("showError", "failed to fetch tracks from spotify");
                state.commit("setReady", false);
                console.error(err);
            }
        },
        startGame(state) {
            state.dispatch("pickRandomSong");
            setTimeout(() => {
                state.dispatch("playSongSnippet");
            }, 1000);
        },
        pickRandomSong(state) {
            const songs = state.getters.tracks
            const randomSong = songs[Math.floor(Math.random()*songs.length)];
            state.commit("setCurrentSong", randomSong);
            console.log(`Random song set to ${randomSong.name}`);
        },
        playSongSnippet(state) {
            const songPreview = state.getters.currentSongMp3;
            const songSnip = new Howl({
                src:songPreview,
                format:"mp3"
            });

            songSnip.once("load", () => {
                console.log("preview loaded");
                songSnip.play();
                console.log(`playing preview`);
                setTimeout(() => {
                    songSnip.stop();
                    console.log("stopping preview");
                    songSnip.unload();
                }, 500)
            });
        },
        guessSong(state, id) {
            if (id === state.getters.currentSongId) {
                state.commit("increaseScore");
                correctSound.play();
            } else {
                incorrectSound.play();
            };

            state.dispatch("pickRandomSong");
            setTimeout(() => {
                state.dispatch("playSongSnippet");
            }, 1000);
        }
    }
});
<template>
    <ScoreCount/>
    
    <div class="grid grid-cols-8 gap-5">
        <Track v-for="track in $store.state.tracks" :key="track.id" :id="track.id" :name="track.name" :image="track.album.images[0]?.url"/>
    </div>
</template>

<script>
import ScoreCount from './ScoreCount.vue';
import Track from './Track.vue';

import {Howl} from 'howler';

export default {
    name:"Game",
    components:{
        ScoreCount,
        Track
    },
    methods:{
        pickRandomSong() {
            const songs = this.$store.state.tracks;
            const randomSong = songs[Math.floor(Math.random()*songs.length)];
            this.$store.commit("setCurrentSong", randomSong);
            console.log(`Random song set to ${randomSong.name}`);
        },
        playSongSnippet() {
            const songSnip = new Howl({
                src:this.$store.state.game.currentSong.mp3_url,
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
        }
    },
    mounted() {
        this.$store.dispatch("startGame");
    }
}
</script>
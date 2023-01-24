<template>
    <div class="container mx-auto py-10 flex flex-col gap-10">
        <AppTitle/>
        <ErrorMessage/>

        <Splash v-if="$store.state.splash.show"/>

        <Game v-if="$store.state.app_ready"/>
    </div>
</template>

<script>
import AppTitle from './components/Layout/AppTitle.vue';
import ErrorMessage from './components/Layout/ErrorMessage.vue';
import Splash from './components/Splash/Splash.vue';
import Game from './components/Game/Game.vue';

export default {
    name:"App",
    components:{
        AppTitle,
        ErrorMessage,
        Splash,
        Game
    },
    mounted() {
        const params = new URLSearchParams(window.location.search);

        if (params.get("code")) {
            this.$store.dispatch("authenticate", params.get("code"))
        } 
        else if (params.get("error")) {
            this.$store.commit("showError", params.get("error"));
        } 
        else {
            this.$store.commit("showSplash", `${import.meta.env.VITE_BACKEND_URL}/api/redirect`);
        }
    }
}
</script>
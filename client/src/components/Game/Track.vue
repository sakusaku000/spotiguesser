<template>
    <div class="rounded-lg bg-cover aspect-square hover:ring ring-neutral-50 relative overflow-hidden cursor-pointer" :style="`background-image:url(${image}`" @click="guess">
        <div class="absolute bottom-0 left-0 right-0 p-2 bg-[#000000d0]">
            <p class="text-xs truncate text-ellipsis overflow-hidden">{{name}}</p> 
        </div>
    </div>
</template>

<script>
export default {
    name:"Track",
    props:{
        id:String,
        name:String,
        image:String
    },
    methods:{
        guess() {
            this.$store.dispatch("guessSong", this.id);
        }
    }
}
</script>
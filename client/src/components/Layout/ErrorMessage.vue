<template>
    <div v-if="$store.state.error.show">
        <span>{{$store.state.error.message}}</span>
    </div>
</template>
<template>
    <div id="app">
        <transition name="scale" mode="out-in">
            <component :is="isUseing"></component>
        </transition>
    </div>
</template>

<script>
    import mainPage from './mainpage'
    import componentPage from "./pages/componentPage"

    export default {
        name: 'App',
        data: function () {
            return {
                isUseing: mainPage
            }
        },
        components: {
            componentPage,
            mainPage
        },
        methods: {
            changeComponentByName(str) {
                this._data.isUseing = str;
            }
        }
    }
</script>

<style>
    .scale-enter-active {
        animation: scale-out .15s;
    }

    .scale-leave-active {
        animation: scale-in .15s;
    }

    @keyframes scale-in {
        0% {
            transform: scale(1, 1);
        }
        25% {
            transform: scale(.75, .75);
        }
        50% {
            transform: scale(.5, .5);
        }
        75% {
            transform: scale(.25, .25);
        }
        100% {
            transform: scale(0, 0);
        }
    }

    @keyframes scale-out {
        0% {
            transform: scale(0, 0);
        }
        25% {
            transform: scale(.25, .25);
        }
        50% {
            transform: scale(.5, .5);
        }
        75% {
            transform: scale(.75, .75);
        }
        100% {
            transform: scale(1, 1);
        }
    }
</style>

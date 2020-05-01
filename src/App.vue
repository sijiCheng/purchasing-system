<template>
    <div id="app">
        <main-page></main-page>
    </div>
</template>

<script>
    import mainPage from './mainpage'

    export default {

        name: 'App',
        data: function () {
            return {
                value: '11111111'
            }
        },
        components: {
            mainPage
        }
    }
</script>

<style>
</style>

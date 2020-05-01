<template>
    <div>
        <div class="bodyDiv">
            <div class="welcomeText"><p>{{$t('system.welcomeText')}}</p></div>
            <div class="systemIcon"><img src="./assets/imgs/persys.png" alt=""></div>
            <div class="productSlogan"><p>{{$t('system.featuredSlogan')}}</p></div>
            <div class="searchButton">
                <mt-button size="small" @click.native="handleClick" type="primary">
                    {{$t('system.searchButtonText')}}
                </mt-button>
            </div>
            <div class="history" v-show="ok">
                <div class="historicRecords"></div>
            </div>
        </div>
        <div class="footDiv">
            <div class="functionButton">
                <mt-button size="small" @click.native="handleClick">
                    <img src="./assets/imgs/clearCar.png" slot="icon" alt="">
                    {{$t('system.treasuredObject')}}
                </mt-button>
                <mt-button size="small" @click.native="changeLanguage" >
                    <img src="./assets/imgs/lang.png" slot="icon" alt="">
                    {{$t('system.languageButtonText')}}
                </mt-button>
                <mt-button size="small" @click.native="handleClick">
                    <img src="./assets/imgs/sysSet.png" slot="icon" alt="">
                    {{$t('system.settingButtonText')}}
                </mt-button>
            </div>
            <div class="developmentInf">
                <p>
                    {{$t('system.developmentInfoText')}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                ok: false
            }
        },
        created() {
        },
        methods: {
            handleClick: function () {
                console.log('55555555')
            },
            changeLanguage:function () {
                let locale = this.$i18n.locale
                locale === 'zh_cn' ? this.$i18n.locale = 'en_us' : this.$i18n.locale = 'zh_cn'
            }
        }
    }
</script>

<style scoped>
    .bodyDiv {
        height: 29rem;
    }

    .welcomeText {
        text-align: center;
        font-size: 0.8rem;
        line-height: 1rem;
        padding-top: 1.2rem;
        padding-bottom: 1.2rem
    }

    .systemIcon {
        margin-top: 2rem;
        height: 7.25rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .systemIcon img {
        max-height: 6.5rem;
    }

    .productSlogan {
        text-align: center;
        font-size: 1rem;
        line-height: 1rem;
        padding-top: 1rem;
        padding-bottom: 1rem
    }

    .searchButton {
        display: flex;
        justify-content: center;
    }

    .searchButton button {
        height: 2rem;
        width: 10rem;
    }

    .history {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
    }

    .historicRecords {
        width: 17.5rem;
        height: 10rem;
        border: 1px solid black;
    }

    .footDiv {
        height: 6rem;
        position: absolute;
        bottom: 0;
        width: 100%;
    }

    .functionButton {
        height: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .functionButton button {
        width: 4rem;
        height: 4rem;
        margin: 0 .5rem;
        padding: 0;
    }

    .functionButton button img {
        width: 4rem;
        height: 2rem;
    }

    .developmentInf {
        height: 2rem;
        text-align: center;
        font-size: .6rem;
        line-height: 2rem;
        padding: 0;
    }
</style>
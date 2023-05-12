<template>
    <div class="dam-count">
        <h1 class="title">Aantal dammen</h1>
        <div class="count">
            <div class="dam">
                <div class="piece black-piece-dam"></div>
                <p class="number">{{ bord.blackDamCounter }}</p>
            </div>
            <div class="dam">
                <div class="piece white-piece-dam"></div>
                <p class="number">{{ bord.whiteDamCounter }}</p>
            </div>
        </div>
    </div>
</template>
<script>
    import { useBordStore } from "../../../stores/bord";
    // import io from "socket.io-client";
    // const socket = io(import.meta.env.VUE_APP_SOCKET_ENDPOINT);
    export default {
        name: 'DamCount',
        setup() {
            const bord = useBordStore();
            return { bord };
        }
    }
</script>
<style lang="css" scoped>
    .dam-count {
        width: 350px;
        /* height: 145px; */
        height: 155px;
        background: rgba(237, 19, 93, 0.25);
        border-radius: 20px;
        padding: 5px 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title {
        font-family: sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 20px;
        /* identical to box height */
        text-align: center;
        color: #FFFFFF;
        margin-bottom: 0;
    }

    .count {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100%;
        /* padding-top: 15px; */
    }

    .dam {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .piece {
        width: 60px;
        height: 70px;
    }

    .white-piece-dam {
        /* background-color: #ffe600; */
        content: "";
        background-image: url(/src/assets/rocketWhite.png);
        background-size: 70px auto;
        background-repeat: no-repeat;
        background-position: center center;
    }

    .black-piece-dam {
        content: "";
        background-image: url(/src/assets/rocketBlack.png);
        background-size: 70px auto;
        background-repeat: no-repeat;
        background-position: center center;
    }

    .number {
        margin: 0;
        padding-top: 8px;
        color: white;
    }
</style>
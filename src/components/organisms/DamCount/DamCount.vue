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
    import io from "socket.io-client";
    const socket = io("http://localhost:3000");
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
        width: 349px;
        height: 145px;
        background: rgba(237, 19, 93, 0.25);
        border-radius: 19px;
        padding: 20px 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title {
        font-family: sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 23px;
        /* identical to box height */
        text-align: center;
        color: #FFFFFF;
    }

    .count {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100%;
        padding-top: 15px;
    }

    .dam {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .piece {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .white-piece-dam {
        background-color: #ffe600;
    }

    .black-piece-dam {
        background-color: #1815c0;
    }

    .number {
        padding-top: 8px;
        color: white;
    }
</style>
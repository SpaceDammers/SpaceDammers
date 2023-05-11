<template>
    <div class="scoreboard">
        <h1 class="title">Global Leaderboard</h1>
        <ol>
            <li>Mart</li>
            <li>Milan</li>
            <li>Daneric</li>
            <li>Chris</li>
            <li>Annelieke</li>
            <li>Johan</li>
            <li>Eric</li>
            <li>Fernando</li>
            <li>Joost</li>
            <li>Piet</li>
        </ol>
    </div>
</template>
<script>
    export default {
        name: "Scoreboard",
    }
</script>
<style lang="css" scoped>
    .scoreboard {
        width: 350px;
        /* height: 350px; */
        background: rgba(75, 106, 204, 0.12);
        border-radius: 20px;
        /* padding: 20px 32px; */
        padding: 20px 32px;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .title {
        color: white;
        font-size: 20px;
        text-align: center;
        margin-bottom: 5px;
    }

    /* ol {
        margin-left: 0px;
    } */
    ol {
        counter-reset: item;
        list-style-type: none;
        list-style-position: outside;
        padding: 0;
        margin: 0;
    }

    li {
        display: block;
        line-height: 30px;
    }

    li:before {
        content: counter(item) "  ";
        counter-increment: item
    }

    li {
        color: white;
        font-family: sans-serif;
        font-size: 16px;
        font-weight: 400;
        line-height: 0;
        letter-spacing: 0em;
        padding: 14px 0;
        margin: 0;
        text-align: left;
    }
</style>
<template>
  <div :class="isDarkSquare() ? 'dark':'light'" class="square">
    <CheckerPiece v-if="isDarkSquare()" :squareContent="squareContent" />
  </div>
</template>
<script>
  import CheckerPiece from '../CheckerPiece/CheckerPiece.vue'
  import { useBordStore } from "../../../stores/bord"
  export default {
    components: { CheckerPiece },
    name: "Square",
    props: ['squareContent', 'activeSelect'],
    setup() {
      const bord = useBordStore()
      return { bord }
    },
    data() {
      return {}
    },
    methods: {
      isDarkSquare() {
        return (this.squareContent.col + this.squareContent.row) % 2 == 1;
      },
    },
  };
</script>
<style scoped>
  .square {
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .light {
    background-color: #debb91;
  }

  .dark {
    background-color: #b56f3c;
  }
</style>
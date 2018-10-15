<template>
	<div class="alpheios-title-block">
		<h1 class="alpheios-title-block__title">
      Games for <span class="alpheios-title-block__title__word">{{ word }}</span>
      <span 
         class="alpheios-title-block__hardMode" 
         :class = "{'alpheios-title-block__hardMode-is': hardMode}"
         @click="changeHardMode">
         (hard mode)
      </span>
    </h1>
	</div>
</template>
<script>
  export default {
    name: 'TitleBlock',
    data: function () {
      return {
      }
    },
    props: {
      word: {
        type: String,
        required: true
      },
      hardMode: {
        type: Boolean,
        required: false,
        dafault: false
      }
    },
    methods: {
      changeHardMode () {
        this.$emit('changeHardMode')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/alpheios";
  @import "../../styles/stat";
  
  .alpheios-title-block__title {
    font-size: 20px;
    margin: 10px 0;
    color: $alpheios-headers-color;
  }

  .alpheios-title-block__title__word {
    color: $alpheios-highlight-dark-color;
  }

  .alpheios-title-block__hardMode {
    cursor: pointer;
    color: $alpheios-stat-hard-mode-default;
    font-size: 80%;
  }

  .alpheios-title-block__hardMode-is {
    color: $alpheios-stat-hard-mode-is;
  }
</style>
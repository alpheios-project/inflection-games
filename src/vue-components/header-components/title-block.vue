<template>
	<div class="alpheios-title-block">
		<h1 class="alpheios-title-block__title">
      Inflection games for <span class="alpheios-title-block__title__word">{{ word }}</span>
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/alpheios";

  .alpheios-title-block__title {
    font-size: 20px;
    margin: 10px 0;
    color: $alpheios-headers-color;
  }

  .alpheios-title-block__title__word {
    color: $alpheios-highlight-dark-color;
  }
</style>
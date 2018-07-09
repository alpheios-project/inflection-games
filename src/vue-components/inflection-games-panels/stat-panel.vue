<template>
	<div class = "alpheios-selected_game_panel__stat">
		<p>Made clicks - {{ clicks }} (max - {{ maxClicks }})</p>
	</div>
</template>
<script>
  export default {
    name: 'StatPanel',
    props: {
      clicks: {
        type: Number,
        required: true
      },
      maxClicks: {
        type: Number,
        required: true
      }
    }
  }
</script>
<style lang="scss">
</style>
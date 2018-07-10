<template>
	<div
		
		:class = "resultClasses"
	>
		{{ resultLabel }}
	</div>
</template>
<script>
  export default {
    name: 'FinishResultPanel',
    props: {
      result: {
        type: [Boolean, String],
        required: true
      }
    },
    computed: {
      resultClasses: function () {
      	return {
      		'alpheios-selected_game_panel__result': true,
			'alpheios-selected_game_panel__result_success': this.successResult,
			'alpheios-selected_game_panel__result_failed': this.failedResult
		}
      },
      resultLabel: function () {
      	return this.successResult ? 'Success' : (this.failedResult ? 'Failed' : '')
      },
      successResult: function () {
      	return this.result === 'success'
      },
      failedResult: function () {
      	return this.result === 'failed'
      },
      noResult: function () {
      	return this.result === false
      }
    }
  }
</script>
<style  lang="scss">
  .alpheios-selected_game_panel__result {
    
    text-align: center;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 200px;
    height: 60px;
    line-height: 60px;

    opacity: 0.1;
    font-weight: bold;

    -webkit-transition: 2s ease-in-out;
    -moz-transition: 2s ease-in-out;
    -o-transition: 2s ease-in-out;
    transition: 2s ease-in-out;

    -webkit-transform: translateY(0);
    -moz-transform: translateY(0);
    -o-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);

    visibility: hidden;

	background: #fff;
    box-shadow: 5px 5px 25px #fff;
    border-radius: 10px;
  }

  .alpheios-selected_game_panel__result_success {
  	color: #099f20;

  	-webkit-transform: translateY(-150px);
    -moz-transform: translateY(-150px);
    -o-transform: translateY(-150px);
    -ms-transform: translateY(-150px);
    transform: translateY(-150px);

    font-size: 36px;

    visibility: visible;
    opacity: 0.8;
  }

  .alpheios-selected_game_panel__result_failed {
  	color: #881c07;

  	-webkit-transform: translateY(-150px);
    -moz-transform: translateY(-150px);
    -o-transform: translateY(-150px);
    -ms-transform: translateY(-150px);
    transform: translateY(-150px);

    visibility: visible;

    font-size: 36px;
    opacity: 0.8;
  }
</style>
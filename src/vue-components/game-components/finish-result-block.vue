<template>
	<div :class = "resultClasses">
    <p class="alpheios_result_block--result_label">{{ resultLabel }}</p>
    <p v-if="failedResult" class="alpheios_result_block--restart_button" @click="restartGame">Restart again?</p>
  </div>
</template>
<script>
  export default {
    name: 'FinishResultBlock',
    props: {
      result: {
        type: [Boolean, String],
        required: true
      }
    },
    computed: {
      resultClasses: function () {
      	return {
      		'alpheios-finish-result-block': true,
			    'alpheios-finish-result-block__success': this.successResult,
			    'alpheios-finish-result-block__failed': this.failedResult
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
      }
    },
    methods: {
      restartGame () {
        this.$emit('restartGame')
      }
    }
  }
</script>
<style  lang="scss">
  @import "../../styles/stat";
  .alpheios-finish-result-block {
    
    text-align: center;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 200px;


    opacity: 0.1;
    font-weight: bold;

    -webkit-transition: 0.5s ease-in-out;
    -moz-transition: 0.5s ease-in-out;
    -o-transition: 0.5s ease-in-out;
    transition: 0.5s ease-in-out;

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

  .alpheios-finish-result-block__success {
  	color: $alpheios-stat-block-success;

  	-webkit-transform: translateY(-100%);
    -moz-transform: translateY(-100%);
    -o-transform: translateY(-100%);
    -ms-transform: translateY(-100%);
    transform: translateY(-100%);

    font-size: 36px;

    visibility: visible;
    opacity: 0.8;

    -webkit-transition: 2s ease-in-out;
    -moz-transition: 2s ease-in-out;
    -o-transition: 2s ease-in-out;
    transition: 2s ease-in-out;

    height: 60px;
    line-height: 60px;
  }

  .alpheios-finish-result-block__failed {
  	color: $alpheios-stat-block-failed;

  	-webkit-transform: translateY(-100%);
    -moz-transform: translateY(-100%);
    -o-transform: translateY(-100%);
    -ms-transform: translateY(-100%);
    transform: translateY(-100%);

    visibility: visible;

    font-size: 36px;
    opacity: 0.8;

    -webkit-transition: 2s ease-in-out;
    -moz-transition: 2s ease-in-out;
    -o-transition: 2s ease-in-out;
    transition: 2s ease-in-out;

    height: 100px;
  }

   .alpheios-finish-result-block .alpheios_result_block--result_label {
    margin: 0 0 10px;
  }
  
   .alpheios-finish-result-block .alpheios_result_block--restart_button {
    font-size: 24px;
    margin: 0;
    color: #fff;
    background: #881c07;
    border-radius: 10px;
    padding: 5px;
    cursor: pointer;
  }

</style>
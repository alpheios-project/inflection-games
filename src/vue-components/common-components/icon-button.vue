<template>
	<tooltip-wrap
	  :tooltipText = "tooltipText"
	  :tooltipDirection = "tooltipDirection"
	  :additionalStyles = "additionalStyles"
	>
		<span class="alpheios-icon-button alpheios-popup__close-btn" @click="emitEvent">
	        <slot></slot>
	    </span>
	</tooltip-wrap>
</template>
<script>
  import TooltipWrap from '@/vue-components/common-components/tooltip-wrap.vue'

  export default {
    name: 'IconButton',
    components: {
      tooltipWrap: TooltipWrap
    },
    props: {
      tooltipText: {
        type: String,
        required: true
      },
      tooltipDirection: {
        type: String,
        required: false
      },
      additionalStyles: {
        type: Object,
        required: false
      }
    },
    methods: {
      emitEvent: function () {
      	this.$emit('iconClickEvent')
      }
    }
  }
</script>
<style lang="scss">
	@import "../../styles/alpheios";

    .alpheios-icon-button {
        display: block;
        position: absolute;
        width: 20px;
        right: 5px;
        top: 2px;
        cursor: pointer;
        fill: $alpheios-link-color-dark-bg;
        stroke: $alpheios-link-color-dark-bg;
    }

    .alpheios-icon-button:hover,
    .alpheios-icon-button:focus {
        fill: $alpheios-link-hover-color;
        stroke: $alpheios-link-hover-color;
    }
</style>
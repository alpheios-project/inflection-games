<template>
	<div id="alpheios-welcome-panel" v-show="visible">
		<span class="alpheios-welcome-panel__close-btn" @click="closePopup">
              <close-icon></close-icon>
        </span>
		<h1>Inflection games</h1>
	</div>
</template>
<script>
  import CloseIcon from '../images/inline-icons/close.svg'
  import interact from 'interactjs'

  export default {
    name: 'WelcomePanel',
    components: {
      closeIcon: CloseIcon,
    },
    data: function () {
      return {
        draggable: true,
        interactInstance: undefined
      }
    },
    props: {
      data: {
        type: Object,
        required: true
      },
      visible: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      closePopup () {
        this.$emit('close')
      },
      draggableSettings: function () {
        return {
          inertia: true,
          autoScroll: false,
          restrict: {
            restriction: document.body,
            elementRect: { top: 0.5, left: 0.5, bottom: 0.5, right: 0.5 }
          },
          ignoreFrom: 'input, textarea, a[href], select, option',
          onmove: this.dragMoveListener
        }
      },
      dragMoveListener (event) {
        if (this.draggable) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          target.style.webkitTransform = `translate(${x}px, ${y}px)`;
          target.style.transform = `translate(${x}px, ${y}px)`;

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    },
    mounted () {
      if (this.data && this.data.draggable && this.data.resizable) {
        this.interactInstance = interact(this.$el)
          .draggable(this.draggableSettings())
      }
    },
  }
</script>
<style lang="scss">
	@import "../styles/alpheios";

	#alpheios-welcome-panel {
		font-family: $alpheios-font-family;
    	font-size: $alpheios-base-font-size;
    	line-height: normal;

		min-width: 200px;
		min-height: 200px;
		color: $alpheios-games-panel-text-color;
		background: $alpheios-games-panel-background;
		position: fixed;
		left: 50px;
		top: 50px;

		border: 1px solid $alpheios-games-panel-border-color;
		padding: 10px;

		-webkit-box-shadow: 4px 4px 10px 1px $alpheios-games-panel-border-shadow-color;
		-moz-box-shadow: 4px 4px 10px 1px $alpheios-games-panel-border-shadow-color;
		box-shadow: 4px 4px 10px 1px $alpheios-games-panel-border-shadow-color;
	}
    .alpheios-welcome-panel__close-btn {
        display: block;
        position: absolute;
        width: 20px;
        right: 5px;
        top: 2px;
        cursor: pointer;
        fill: $alpheios-link-color-dark-bg;
        stroke: $alpheios-link-color-dark-bg;
    }

    .alpheios-welcome-panel__close-btn:hover,
    .alpheios-welcome-panel__close-btn:focus {
        fill: $alpheios-link-hover-color;
        stroke: $alpheios-link-hover-color;
    }
</style>
<template>
	<div id="alpheios-games-panel" v-show="visible" :style="mainstyles">
		<span class="alpheios-games-panel__close-btn" @click="closePanel">
              <close-icon></close-icon>
        </span>

		<welcome-panel></welcome-panel>
		<features-panel 
			v-if = "showFeaturesPanel"
			:lexemes = "homonym.lexemes" 
			:definitionsDataReady = "data.definitionsDataReady"
			:definitions = "definitionsFinal"
		></features-panel>

		<inflection-data-panel 
			v-if = "showInflectionsPanel"
			:inflectionData = "inflectionDataFinal"
			:locale = "data.locale"
			@selectedGame = "selectedGame"

			:selectedGameVariantReady = "selectedGameVariantReady"
			:selectedGameVariant = "selectedGameVariant"
		></inflection-data-panel>

		<selected-game-panel
			:selectedGameVariantReady = "selectedGameVariantReady"
			:selectedGameVariant = "selectedGameVariant"
			:changedGame = "changedGame"
		></selected-game-panel>
	</div>
</template>
<script>
  import CloseIcon from '@/images/inline-icons/close.svg'
  import interact from 'interactjs'
  
  import WelcomePanel from '@/vue-components/welcome-panel.vue'
  import FeaturesPanel from '@/vue-components/lexeme-data-panels/features-panel.vue'
  import InflectionDataPanel from '@/vue-components/lexeme-data-panels/inflection-data-panel.vue'
  import SelectedGamePanel from '@/vue-components/selected-game-panel.vue'

  import WindowServices from '@/services/window-services.js'

  export default {
    name: 'GamePanel',
    components: {
      closeIcon: CloseIcon,
      welcomePanel: WelcomePanel,
      featuresPanel: FeaturesPanel,
      inflectionDataPanel: InflectionDataPanel,
      selectedGamePanel: SelectedGamePanel
    },
    data () {
      return {
        draggable: true,
        interactInstance: undefined,
        selectedGameVariant: {},
        selectedGameVariantReady: false,
        changedGame: 0
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
      },
      homonym: {
        type: Object,
        required: true
      }
    },
    computed: {
      mainstyles: function () {
      	return {
      	  'z-index': this.data.zIndex
      	}
      },
      inflectionDataFinal: function () {
      	return this.data.inflectionDataReady ? this.data.inflectionData : {}
      },
      definitionsFinal: function () {
      	return this.data.definitionsDataReady ? this.data.definitions : {}
      },
      showFeaturesPanel: function () {
      	return this.homonym.lexemes && this.homonym.lexemes.length > 0
      },
      showInflectionsPanel: function () {
      	return this.data.inflectionDataReady && this.data.locale
      }
    },
    methods: {
      closePanel () {
      	this.clearData()
        this.$emit('close')
      },
      selectedGame (gameVariant) {
      	this.selectedGameVariant = gameVariant
      	this.selectedGameVariantReady = true
      	this.changedGame = this.changedGame + 1
      },
      clearData () {
        this.selectedGameVariant = {}
        this.selectedGameVariantReady = false
        this.changedGame = 0
      }
    },
    mounted () {
      if (this.data && this.data.draggable) {
        this.interactInstance = interact(this.$el)
          .draggable(WindowServices.draggableSettings())
      }
    }
  }	
</script>
<style lang="scss">
	@import "../styles/alpheios";

	#alpheios-games-panel {
		font-family: $alpheios-font-family;
    	font-size: $alpheios-base-font-size;
    	line-height: normal;

		min-width: 200px;
		max-width: 90%;
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
    .alpheios-games-panel__close-btn {
        display: block;
        position: absolute;
        width: 20px;
        right: 5px;
        top: 2px;
        cursor: pointer;
        fill: $alpheios-link-color-dark-bg;
        stroke: $alpheios-link-color-dark-bg;
    }

    .alpheios-games-panel__close-btn:hover,
    .alpheios-games-panel__close-btn:focus {
        fill: $alpheios-link-hover-color;
        stroke: $alpheios-link-hover-color;
    }
</style>
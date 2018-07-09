<template>
	<div class = "alpheios-selected_game_panel__stat">
		<ul class = "alpheios-selected_game_panel__stat_list">
			<li class="alpheios-selected_game_panel__stat_list_clicks">
				<p class="alpheios-selected_game_panel__stat_list_title">Made clicks</p>
				<p class="alpheios-selected_game_panel__stat_list_value" :class="clicksClass">{{ clicks }}</p>
			</li>
			<li class="alpheios-selected_game_panel__stat_list_max_clicks">
				<p class="alpheios-selected_game_panel__stat_list_title">Max clicks</p>
				<p class="alpheios-selected_game_panel__stat_list_value">{{ maxClicks }}</p>
			</li>
			<li class="alpheios-selected_game_panel__stat_list_failed">
				<p class="alpheios-selected_game_panel__stat_list_title">Failed</p>
				<p class="alpheios-selected_game_panel__stat_list_value">{{ failedGames }}</p>
			</li>
			<li class="alpheios-selected_game_panel__stat_list_success">
				<p class="alpheios-selected_game_panel__stat_list_title">Success</p>
				<p class="alpheios-selected_game_panel__stat_list_value">{{ successGames }}</p>
			</li>
		</ul>
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
      },
      failedGames: {
        type: Number,
        required: true
      },
      successGames: {
        type: Number,
        required: true
      }
    },
    computed: {
      clicksClass: function () {
      	return {
      	  'alpheios-selected_game_panel__stat_list_clicks__smallColor': (this.clicks / this.maxClicks) <= 0.33,
      	  'alpheios-selected_game_panel__stat_list_clicks__mediumColor': (this.clicks / this.maxClicks) > 0.33 && (this.clicks / this.maxClicks) <= 0.66,
      	  'alpheios-selected_game_panel__stat_list_clicks__bigColor': (this.clicks / this.maxClicks) > 0.66
      	}
      }
    }
  }
</script>
<style lang="scss">
  .alpheios-selected_game_panel__stat_list {
  	padding: 0;
  	margin: 0 0 10px;
  	list-style: none;
  }

  .alpheios-selected_game_panel__stat_list li {
  	display: inline-block;
  	vertical-align: bold;
  	text-align: center;
  	margin: 0 5px;
  	font-weight: bold;
  }

  .alpheios-selected_game_panel__stat_list_title {
  	margin: 0 0 5px;
  }

  .alpheios-selected_game_panel__stat_list_value {
  	margin: 0;
  }

  .alpheios-selected_game_panel__stat_list_max_clicks {
  	color: #3E8D9C;
  }
  .alpheios-selected_game_panel__stat_list_failed {
  	color: #881c07;
  }
  .alpheios-selected_game_panel__stat_list_success {
  	color: #099f20;
  }

  .alpheios-selected_game_panel__stat_list_clicks__smallColor {
  	color: #099f20;
  }
  .alpheios-selected_game_panel__stat_list_clicks__mediumColor {
  	color: #E49A0D;
  }
  .alpheios-selected_game_panel__stat_list_clicks__bigColor {
  	color: #e42f0d;
  }

  .alpheios-selected_game_panel__stat {
    text-align: center;
  }
</style>
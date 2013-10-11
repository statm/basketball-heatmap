HOME = "home"
AWAY = "away"


class @Observer
	constructor: () ->
		console.log "observer created"

	setData: (@data) ->

	getPlayerHeatMapData: (playerID) ->
		data = []
		for pos, count of @data.players[playerID].snapshots
			dataItem = 
				x: (parseInt (pos.split ",")[0]) * 10
				y: (parseInt (pos.split ",")[1]) * 10
				count: count
			data.push dataItem
		data


class @GameData
	constructor: () ->
		@players = {}
		@clock = {}
		return

	load: (@url) =>
		console.log "loading file: #{@url}"
		$.getJSON @url,
			(json) =>
				console.log "file loaded: #{@url}"
				@rawData = json.data
				@processData()
				$(@).trigger "LOAD_COMPLETE"
				return
		return

	processData: ->
		@length = @rawData.length
		for item in @rawData
			do (item) =>
				@parseItem item
		return

	parseItem: (item) =>
		@clock[item.time] = item.game_clock
		for homePlayer in item.home
			do (homePlayer) =>
				@players[homePlayer[1]] ?= new Player HOME, homePlayer[1]
				@players[homePlayer[1]].addSnapshot item.time, homePlayer[0][0], homePlayer[0][1]

		for awayPlayer in item.away
			do (awayPlayer) =>
				@players[awayPlayer[1]] ?= new Player AWAY, awayPlayer[1]
				@players[awayPlayer[1]].addSnapshot item.time, awayPlayer[0][0], awayPlayer[0][1]
		return

class Player
	constructor: (team, id) ->
		@getTeam = -> team
		@getID = -> id
		@snapshots = {}
		return

	addSnapshot: (time, x, y) ->
		key = "#{Math.round x},#{Math.round y}"
		@snapshots[key] ?= 0
		@snapshots[key] += 1
		return
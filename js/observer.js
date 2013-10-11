(function() {
  var AWAY, HOME, Player,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  HOME = "home";

  AWAY = "away";

  this.Observer = (function() {
    function Observer() {
      console.log("observer created");
    }

    Observer.prototype.setData = function(data) {
      this.data = data;
    };

    Observer.prototype.getPlayerHeatMapData = function(playerID) {
      var count, data, dataItem, pos, _ref;

      data = [];
      _ref = this.data.players[playerID].snapshots;
      for (pos in _ref) {
        count = _ref[pos];
        dataItem = {
          x: (parseInt((pos.split(","))[0])) * 10,
          y: (parseInt((pos.split(","))[1])) * 10,
          count: count
        };
        data.push(dataItem);
      }
      return data;
    };

    return Observer;

  })();

  this.GameData = (function() {
    function GameData() {
      this.parseItem = __bind(this.parseItem, this);
      this.load = __bind(this.load, this);      this.players = {};
      this.clock = {};
      return;
    }

    GameData.prototype.load = function(url) {
      var _this = this;

      this.url = url;
      console.log("loading file: " + this.url);
      $.getJSON(this.url, function(json) {
        console.log("file loaded: " + _this.url);
        _this.rawData = json.data;
        _this.processData();
        $(_this).trigger("LOAD_COMPLETE");
      });
    };

    GameData.prototype.processData = function() {
      var item, _fn, _i, _len, _ref,
        _this = this;

      this.length = this.rawData.length;
      _ref = this.rawData;
      _fn = function(item) {
        return _this.parseItem(item);
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _fn(item);
      }
    };

    GameData.prototype.parseItem = function(item) {
      var awayPlayer, homePlayer, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1,
        _this = this;

      this.clock[item.time] = item.game_clock;
      _ref = item.home;
      _fn = function(homePlayer) {
        var _base, _name, _ref1;

                if ((_ref1 = (_base = _this.players)[_name = homePlayer[1]]) != null) {
          _ref1;
        } else {
          _base[_name] = new Player(HOME, homePlayer[1]);
        };
        return _this.players[homePlayer[1]].addSnapshot(item.time, homePlayer[0][0], homePlayer[0][1]);
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        homePlayer = _ref[_i];
        _fn(homePlayer);
      }
      _ref1 = item.away;
      _fn1 = function(awayPlayer) {
        var _base, _name, _ref2;

                if ((_ref2 = (_base = _this.players)[_name = awayPlayer[1]]) != null) {
          _ref2;
        } else {
          _base[_name] = new Player(AWAY, awayPlayer[1]);
        };
        return _this.players[awayPlayer[1]].addSnapshot(item.time, awayPlayer[0][0], awayPlayer[0][1]);
      };
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        awayPlayer = _ref1[_j];
        _fn1(awayPlayer);
      }
    };

    return GameData;

  })();

  Player = (function() {
    function Player(team, id) {
      this.getTeam = function() {
        return team;
      };
      this.getID = function() {
        return id;
      };
      this.snapshots = {};
      return;
    }

    Player.prototype.addSnapshot = function(time, x, y) {
      var key, _base, _ref;

      key = "" + (Math.round(x)) + "," + (Math.round(y));
            if ((_ref = (_base = this.snapshots)[key]) != null) {
        _ref;
      } else {
        _base[key] = 0;
      };
      this.snapshots[key] += 1;
    };

    return Player;

  })();

}).call(this);

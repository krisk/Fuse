$(function (window) {
  // Mixins
  var Mixins = {}
  Mixins.Event = function (base) {
    return {
      _hook: function () {
        if (!this._$hook) {
          this._$hook = $({})
        }
        return this._$hook
      },
      on: function () {
        var hook = this._hook()
        hook.on.apply(hook, arguments)
      },
      off: function () {
        var hook = this._hook()
        hook.off.apply(hook, arguments)
      },
      trigger: function () {
        var hook = this._hook()
        hook.trigger.apply(hook, arguments)
      }
    }
  }

  // Core
  var App = {}

  App.Options = Fiber.extend(function () {
    return {
      init: function () {
        this.setupNodes()
        this.bindEvents()
        this.data = {}

        _.each(this.checkboxItems, _.bind(function (item) {
          this.setupCheckboxItems(item, false)
        }, this))

        _.each(this.rangeItems, _.bind(function (item) {
          this.setupRangeItems(item, false)
        }, this))

        this.setupKeys(false)

        this.setupIdentifier(false)

        this.setupPatternLength(false)
      },
      setupNodes: function () {
        this.$caseSensitiveCheckbox = $('#caseSensitiveCheckbox')
        this.$scoreCheckbox = $('#scoreCheckbox')
        this.$matchesCheckbox = $('#matchesCheckbox')
        this.$sortCheckbox = $('#sortCheckbox')
        this.$tokenizeCheckbox = $('#tokenizeCheckbox')
        this.$matchAllTokensCheckbox = $('#matchAllTokensCheckbox')
        this.$identifierTextbox = $('#identifierTextbox')

        this.$locationRange = $('#locationRange')
        this.$thresholdRange = $('#thresholdRange')
        this.$distanceRange = $('#distanceRange')
        this.$maxPatternLength = $('#maxPatternLength')
        this.$keysTextbox = $('#keysTextbox')
        this.$minMatchCharLengthRange = $('#minMatchCharLengthTextbox')
        this.$findAllMatchesCheckbox = $('#findAllMatchesCheckbox')

        this.checkboxItems = [{
          node: this.$caseSensitiveCheckbox,
          name: 'caseSensitive'
        }, {
          node: this.$sortCheckbox,
          name: 'shouldSort'
        }, {
          node: this.$tokenizeCheckbox,
          name: 'tokenize'
        }, {
          node: this.$matchAllTokensCheckbox,
          name: 'matchAllTokens'
        }, {
          node: this.$findAllMatchesCheckbox,
          name: 'findAllMatches'
        }, {
          node: this.$scoreCheckbox,
          name: 'includeScore'
        }, {
          node: this.$matchesCheckbox,
          name: 'includeMatches'
        }]

        this.rangeItems = [{
          node: this.$thresholdRange,
          name: 'threshold'
        }, {
          node: this.$locationRange,
          name: 'location'
        }, {
          node: this.$distanceRange,
          name: 'distance'
        }, {
          node: this.$minMatchCharLengthRange,
          name: 'minMatchCharLength'
        }]
      },
      bindEvents: function () {
        // Checkboxes
        _.each(this.checkboxItems, _.bind(function (item) {
          item.node.on('change', _.bind(function () {
            this.setupCheckboxItems(item, true)
          }, this))
        }, this))

        // Ranges
        _.each(this.rangeItems, _.bind(function (item) {
          item.node.on('change', _.bind(function () {
            this.setupRangeItems(item, true)
          }, this))
        }, this))

        this.$identifierTextbox.on('change', _.bind(this.setupIdentifier, this))

        // keys
        this.$keysTextbox.on('change', _.bind(this.setupKeys, this))

        // Pattern length
        this.$maxPatternLength.on('change', _.bind(this.setupPatternLength, this))

        // Google events
        this.$caseSensitiveCheckbox.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'option:case-sensitive')
        })
        this.$scoreCheckbox.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'option:score')
        })
        this.$matchesCheckbox.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'option:matches')
        })
        this.$sortCheckbox.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'option:sort')
        })
        this.$tokenizeCheckbox.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'option:tokenize')
        })
        this.$matchAllTokensCheckbox.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'option:match-all-tokens')
        })
        this.$identifierTextbox.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'option:identifier')
        })
        this.$keysTextbox.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'option:keys')
        })
        this.$findAllMatchesCheckbox.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'option:find-all-matches')
        })
        this.$minMatchCharLengthRange.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'option:min-match-char-length')
        })
      },
      setupCheckboxItems: function (item, trigger) {
        var checked = item.node.prop('checked')
        this.data[item.name] = checked
        if (trigger || trigger === undefined) {
          this.trigger('change')
        }
      },
      setupRangeItems: function (item, trigger) {
        var value = item.node.val()
        this.data[item.name] = parseFloat(value)
        if (trigger || trigger === undefined) {
          this.trigger('change')
        }
      },
      setupIdentifier: function (trigger) {
        this.data.id = this.$identifierTextbox.val()
        if (trigger) {
          this.trigger('change')
        }
      },
      setupKeys: function (trigger) {
        var text = this.$keysTextbox.val()
        this.data.keys = eval(text)
        if (trigger) {
          this.trigger('change')
        }
      },
      setupPatternLength: function (trigger) {
        var value = this.$maxPatternLength.val()
        this.data['maxPatternLength'] = parseInt(value)
        if (trigger || trigger === undefined) {
          this.trigger('change')
        }
      }
    }
  })
  Fiber.mixin(App.Options, Mixins.Event)

  App.Main = new (Fiber.extend(function () {
    return {
      init: function () {
        this.setupNodes()
        this.bindEvents()
        this.setupItems()
      },
      setupNodes: function () {
        this.$itemsTextArea = $('#itemsTextArea')
        this.$searchTextbox = $('#searchTextbox')
        this.$resultTextArea = $('#resultTextArea')
        this.$jsTextArea = $('#jsTextArea')
        this.$searchTimeLabel = $('#searchTimeLabel')
      },
      bindEvents: function () {
        this.options = new App.Options()
        this.options.on('change', _.bind(this.setupFuse, this))
        this.$itemsTextArea.on('change', _.bind(this.setupItems, this))

        this.$searchTextbox.on('keyup', _.debounce(_.bind(function () {
          this.search(this.$searchTextbox.val())
        }, this), 0))

        this.$itemsTextArea.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'items')
        })
        this.$searchTextbox.on('change', function () {
          ga('send', 'event', 'Demo', 'change', 'search')
        })
      },
      setupItems: function () {
        var list = this.$itemsTextArea.val()
        this.list = eval(list)
        this.setupFuse()
      },
      setupFuse: function () {
        this.fuse = new Fuse(this.list, this.options.data)
        this.search(this.$searchTextbox.val())
      },
      search: function (pattern) {
        if (pattern.length > this.options.data.maxPatternLength) {
          this.$resultTextArea.html('Pattern length is too long')
          return
        }
        this.pattern = pattern
        var start = new Date().getTime()
        var result = this.fuse.search(pattern)
        var end = new Date().getTime()
        this.$searchTimeLabel.text((end - start) + ' ms')
        this.$resultTextArea.html(JSON.stringify(result, null, '  '))
        this.updateJS()
      },
      updateJS: function () {
        var arr = []
        arr.push('var options = {')
        if (this.options.data.id) {
          arr.push('  id: "' + this.options.data.id + '",')
        }
        if (this.options.data.caseSensitive) {
          arr.push('  caseSensitive: ' + this.options.data.caseSensitive + ',')
        }
        if (this.options.data.shouldSort) {
          arr.push('  shouldSort: ' + this.options.data.shouldSort + ',')
        }
        if (this.options.data.tokenize) {
          arr.push('  tokenize: ' + this.options.data.tokenize + ',')
        }
        if (this.options.data.matchAllTokens) {
          arr.push('  matchAllTokens: ' + this.options.data.matchAllTokens + ',')
        }
        if (this.options.data.findAllMatches) {
          arr.push('  findAllMatches: ' + this.options.data.findAllMatches + ',')
        }
        if (this.options.data.includeScore) {
          arr.push('  includeScore: ' + this.options.data.includeScore + ',')
        }
        if (this.options.data.includeMatches) {
          arr.push('  includeMatches: ' + this.options.data.includeMatches + ',')
        }
        arr.push('  threshold: ' + this.options.data.threshold + ',')
        arr.push('  location: ' + this.options.data.location + ',')
        arr.push('  distance: ' + this.options.data.distance + ',')
        arr.push('  maxPatternLength: ' + this.options.data.maxPatternLength + ',')
        arr.push('  minMatchCharLength: ' + this.options.data.minMatchCharLength + ',')
        arr.push('  keys: ' + JSON.stringify(this.options.data.keys, null, '    '))
        arr.push('};')
        arr.push('var fuse = new Fuse(list, options); // "list" is the item array')
        arr.push('var result = fuse.search("' + this.pattern + '");')
        arr = arr.join('\n')
        this.$jsTextArea.html(arr)
      }
    }
  }))()
})

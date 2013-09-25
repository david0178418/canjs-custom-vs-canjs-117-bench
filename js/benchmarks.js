function runBenchmarks(resultsId) {
	var resultsEl = $(resultsId),
		iterations = 10000,
		startTime,
		duration;

	runTest('observes created', function() {
		new can.Observe({
			foo: 'val'
		});
	});

	runTest('observe attributes accessed', function() {
		this.observe.attr('foo');
	}, function() {
		return {
			observe: new can.Observe({foo: 'val'})
		};
	});

	runTest('observe attributes set', function() {
		this.observe.attr('foo', 'bar');
	}, function() {
		return {
			observe: new can.Observe({foo: 'val'})
		};
	});

	runTest('observe bindings applied', function() {
		this.observe.bind('change', function() {});
	}, function() {
		return {
			observe: new can.Observe({foo: 'val'})
		};
	});

	runTest('observe events triggered on single attribute', function(run) {
		this.observe.attr('foo', run);
	}, function() {
		var observe = new can.Observe({foo: 'val'});
		observe.bind('change', function() {});
		return {
			observe: observe
		};
	});

	runTest('observe events triggered on many attributes', function(run) {
		this.observe.attr('foo'+run, run);
	}, function() {
		var observe = new can.Observe({foo: 'val'});
		observe.bind('change', function() {});
		return {
			observe: observe
		};
	});

	runTest('observe lists created', function() {
		new can.Observe.List([{foo: 'val'}, {bar: 'val'}]);
	});

	runTest('observe list items accessed', function() {
		this.observeList.attr('0.foo');
	}, function() {
		return {
			observeList: new can.Observe.List([{foo: 'val'}, {bar: 'val'}])
		};
	});

	runTest('observe list item updates', function(run) {
		this.observeList.attr('0.foo'+run, run);
	}, function() {
		return {
			observeList: new can.Observe.List([{foo: 'val'}])
		};
	});

	runTest('observe list events triggered on single attribute', function(run) {
		this.observeList.attr('0.foo', run);
	}, function() {
		var observeList = new can.Observe.List([{foo: 'val'}]);
		observeList.bind('change', function() {});
		return {
			observeList: observeList
		};
	});

	runTest('observe list events triggered on many attributes', function(run) {
		this.observeList.attr('0.foo'+run, run);
	}, function() {
		var observeList = new can.Observe.List([{foo: 'val'}]);
		observeList.bind('change', function() {});
		return {
			observeList: observeList
		};
	});

	runTest('observe list "each" runs', function() {
		this.observeList.each(function() {});
	}, function() {
		return {
			observeList: new can.Observe.List([{foo: 'val'}, {bar: 'val'}])
		};
	});

	runTest('observe list items pushed', function() {
		this.observeList.push({});
	}, function() {
		return {
			observeList: new can.Observe.List()
		};
	});

	runTest('controllers created', function() {
		new can.Control();
	});

	runTest('controller events triggered', function() {
		this.el.dispatchEvent(this.ev);
	}, function() {
		var root = $('<div><div class="child"></div></div>'),
			ev = document.createEvent("HTMLEvents"),
			Control = can.Control.extend({
				'.child click': function() {}
			});

		ev.initEvent("click", true, true);

		$('body').append(root);

		return {
			root: root,
			ev: ev,
			el: root.find(".child")[0],
			control: new Control(root)
		};
	}, function() {
		this.root.remove();
	});

	function runTest(message, test, setup, cleanup) {
		var scope = (setup && setup()) || this;

		startTime = Date.now();

		for(var run = 0; run < iterations; run++) {
			test.apply(scope, [run]);
		}

		duration = Date.now() - startTime;

		cleanup && cleanup.apply(scope);

		resultsEl.append('<p>'+iterations+' '+message+' in <strong>'+duration+'ms</strong></p>').
			append('<div> <span class="show-code">Show Code<br/><pre>	'+test.toString()+'</pre></span></div>');
	}

	resultsEl.on('click', '.show-code', function() {
		$(this).find('pre').toggle();
	});
}

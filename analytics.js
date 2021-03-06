module.exports = function (type, cb) {
	const isGA = type === 'event' || type === 'social';
	const isTagManager = type === 'tagManager';

	if (isGA) checkIfAnalyticsLoaded(type, cb);
	if (isTagManager) setTagManager(cb);
};

function checkIfAnalyticsLoaded(type, cb) {
	if (window.ga) {
		  if (cb) cb();
		  // bind to shared event on each individual node
		  listen(function (e) {
			const platform = e.target.getAttribute('data-open-share');
			const target = e.target.getAttribute('data-open-share-link') ||
				e.target.getAttribute('data-open-share-url') ||
				e.target.getAttribute('data-open-share-username') ||
			    e.target.getAttribute('data-open-share-center') ||
				e.target.getAttribute('data-open-share-search') ||
				e.target.getAttribute('data-open-share-body');

			if (type === 'event') {
				ga('send', 'event', {
					eventCategory: 'OpenShare Click',
					eventAction: platform,
					eventLabel: target,
					transport: 'beacon'
				});
			}

			if (type === 'social') {
				ga('send', {
					hitType: 'social',
					socialNetwork: platform,
					socialAction: 'share',
					socialTarget: target
				});
			}
		});

	}
	else {
		setTimeout(function () {
			checkIfAnalyticsLoaded(type, cb);
	  	}, 1000);
	}
}

function setTagManager (cb) {

	if (window.dataLayer && window.dataLayer[0]['gtm.start']) {
		if (cb) cb();

		listen(onShareTagManger);

		getCounts(function(e) {
			const count = e.target ?
			  e.target.innerHTML :
			  e.innerHTML;

			const platform = e.target ?
			   e.target.getAttribute('data-open-share-count-url') :
			   e.getAttribute('data-open-share-count-url');

			window.dataLayer.push({
				'event' : 'OpenShare Count',
				'platform': platform,
				'resource': count,
				'activity': 'count'
			});
		});
	} else {
		setTimeout(function () {
			setTagManager(cb);
		}, 1000);
	}
}

function listen (cb) {
	// bind to shared event on each individual node
	[].forEach.call(document.querySelectorAll('[data-open-share]'), function(node) {
		node.addEventListener('OpenShare.shared', cb);
	});
}

function getCounts (cb) {
	var countNode = document.querySelectorAll('[data-open-share-count]');

	[].forEach.call(countNode, function(node) {
		if (node.textContent) cb(node);
		else node.addEventListener('OpenShare.counted-' + node.getAttribute('data-open-share-count-url'), cb);
	});
}

function onShareTagManger (e) {
	const platform = e.target.getAttribute('data-open-share');
	const target = e.target.getAttribute('data-open-share-link') ||
		e.target.getAttribute('data-open-share-url') ||
		e.target.getAttribute('data-open-share-username') ||
		e.target.getAttribute('data-open-share-center') ||
		e.target.getAttribute('data-open-share-search') ||
		e.target.getAttribute('data-open-share-body');

	window.dataLayer.push({
		'event' : 'OpenShare Share',
		'platform': platform,
		'resource': target,
		'activity': 'share'
	});
}

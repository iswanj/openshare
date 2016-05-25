/**
 * Object of transform functions for each openshare api
 * Transform functions passed into OpenShare instance when instantiated
 * Return object containing URL and key/value args
 */
module.exports = {

	// facebook count data
	facebook (url) {
		return {
			type: 'get',
			url: `//graph.facebook.com/?id=${url}`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).shares;
				this.storeSet(this.type + '-' + this.shared, count);
				return count;
			}
		};
	},

	// pinterest count data
	pinterest (url) {
		return {
			type: 'jsonp',
			url: `//api.pinterest.com/v1/urls/count.json?callback=?&url=${url}`,
			transform: function(data) {
				let count = data.count;
				this.storeSet(this.type + '-' + this.shared, count);
				return count;
			}
		};
	},

	// linkedin count data
	linkedin (url) {
		return {
			type: 'jsonp',
			url: `//www.linkedin.com/countserv/count/share?url=${url}&format=jsonp&callback=?`,
			transform: function(data) {
				let count = data.count;
				this.storeSet(this.type + '-' + this.shared, count);
				return count;
			}
		};
	},

	// reddit count data
	reddit (url) {
		return {
			type: 'get',
			url: `//www.reddit.com/api/info.json?url=${url}`,
			transform: function(xhr) {
				let posts = JSON.parse(xhr.responseText).data.children,
					ups = 0;

				posts.forEach((post) => {
					ups += Number(post.data.ups);
				});

				this.storeSet(this.type + '-' + this.shared, ups);

				return ups;
			}
		};
	},

	// google count data
	google (url) {
		return {
			type: 'post',
			data: {
				method: 'pos.plusones.get',
				id: 'p',
				params: {
					nolog: true,
					id: url,
					source: 'widget',
					userId: '@viewer',
					groupId: '@self'
				},
				jsonrpc: '2.0',
				key: 'p',
				apiVersion: 'v1'
			},
			url: `https://clients6.google.com/rpc`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).result.metadata.globalCounts.count;
				this.storeSet(this.type + '-' + this.shared, count);
				return count;
			}
		};
	},

	// github star count
	githubStars (repo) {
		return {
			type: 'get',
			url: `//api.github.com/repos/${repo}`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).stargazers_count;
				this.storeSet(this.type + '-' + this.shared, count);
				return count;
			}
		};
	},

	// github forks count
	githubForks (repo) {
		return {
			type: 'get',
			url: `//api.github.com/repos/${repo}`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).forks_count;
				this.storeSet(this.type + '-' + this.shared, count);
				return count;
			}
		};
	},

	// github watchers count
	githubWatchers (repo) {
		return {
			type: 'get',
			url: `//api.github.com/repos/${repo}`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).watchers_count;
				this.storeSet(this.type + '-' + this.shared, count);
				return count;
			}
		};
	}
};

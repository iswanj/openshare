"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var r=0;r<e.length;r++){var a=e[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,r,a){return r&&t(e.prototype,r),a&&t(e,a),e}}();!function t(e,r,a){function n(s,i){if(!r[s]){if(!e[s]){var u="function"==typeof require&&require;if(!i&&u)return u(s,!0);if(o)return o(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var d=r[s]={exports:{}};e[s][0].call(d.exports,function(t){var r=e[s][1][t];return n(r?r:t)},d,d.exports,t,e,r,a)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<a.length;s++)n(a[s]);return n}({1:[function(t,e,r){e.exports=function(){var e=(t("./modules/data-attr")(),t("./modules/share-api")),r=t("./modules/count-api");return{share:e(),count:r()}}()},{"./modules/count-api":2,"./modules/data-attr":5,"./modules/share-api":8}],2:[function(t,e,r){t("./count");e.exports=function(){var t=function e(t){var r=t.type,a=t.url,n=t.appendTo,o=t.element,s=t.classes;_classCallCheck(this,e);var i=document.createElement(o||"span");return i.setAttribute("data-open-share-count",r),i.setAttribute("data-open-share-count-url",a),i.classList.add("open-share-count"),s&&Array.isArray(s)&&s.forEach(function(t){i.classList.add(t)}),n&&n.appendChild(i),i};return t}},{"./count":4}],3:[function(t,e,r){e.exports={facebook:function(t){return{type:"get",url:"//graph.facebook.com/?id="+t,transform:function(t){var e=JSON.parse(t.responseText).shares;return this.storeSet(this.type+"-"+this.shared,e),e}}},pinterest:function(t){return{type:"jsonp",url:"//api.pinterest.com/v1/urls/count.json?callback=?&url="+t,transform:function(t){var e=t.count;return this.storeSet(this.type+"-"+this.shared,e),e}}},linkedin:function(t){return{type:"jsonp",url:"//www.linkedin.com/countserv/count/share?url="+t+"&format=jsonp&callback=?",transform:function(t){var e=t.count;return this.storeSet(this.type+"-"+this.shared,e),e}}},reddit:function(t){return{type:"get",url:"//www.reddit.com/api/info.json?url="+t,transform:function(t){var e=JSON.parse(t.responseText).data.children,r=0;return e.forEach(function(t){r+=Number(t.data.ups)}),this.storeSet(this.type+"-"+this.shared,r),r}}},google:function(t){return{type:"post",data:{method:"pos.plusones.get",id:"p",params:{nolog:!0,id:t,source:"widget",userId:"@viewer",groupId:"@self"},jsonrpc:"2.0",key:"p",apiVersion:"v1"},url:"https://clients6.google.com/rpc",transform:function(t){var e=JSON.parse(t.responseText).result.metadata.globalCounts.count;return this.storeSet(this.type+"-"+this.shared,e),e}}}}},{}],4:[function(t,e,r){var a=t("./count-transforms"),n=t("./events");e.exports=function(){function t(e,r){var n=this;if(_classCallCheck(this,t),!r)throw new Error("Open Share: no url provided for count");if(e.indexOf(",")>-1)this.type=e,this.typeArr=this.type.split(","),this.countData=[],this.typeArr.forEach(function(t){if(!a[t])throw new Error("Open Share: "+e+" is an invalid count type");n.countData.push(a[t](r))});else{if(!a[e])throw new Error("Open Share: "+e+" is an invalid count type");this.type=e,this.countData=a[e](r)}}return _createClass(t,[{key:"count",value:function(t){this.os=t,this.url=this.os.getAttribute("data-open-share-count"),this.shared=this.os.getAttribute("data-open-share-count-url"),Array.isArray(this.countData)?this.getCounts():this.getCount()}},{key:"getCount",value:function(){var t=this.storeGet(this.type+"-"+this.shared);t&&(this.os.innerHTML=t),this[this.countData.type](this.countData)}},{key:"getCounts",value:function(){var t=this;this.total=[];var e=this.storeGet(this.type+"-"+this.shared);e&&(this.os.innerHTML=e),this.countData.forEach(function(e){t[e.type](e,function(e){if(t.total.push(e),t.total.length===t.typeArr.length){var r=0;t.total.forEach(function(t){r+=t}),t.storeSet(t.type+"-"+t.shared,r),t.os.innerHTML=r}})}),this.os.innerHTML=this.total}},{key:"jsonp",value:function(t,e){var r=this,a=Math.random().toString(36).substring(7).replace(/[^a-zA-Z]/g,"");window[a]=function(a){var o=t.transform.apply(r,[a])||0;e&&"function"==typeof e?e(o):r.os.innerHTML=o,n.trigger(r.os,"counted-"+r.url)};var o=document.createElement("script");o.src=t.url.replace("callback=?","callback="+a),document.getElementsByTagName("head")[0].appendChild(o)}},{key:"get",value:function(t,e){var r=this,a=new XMLHttpRequest;a.onreadystatechange=function(){if(4===a.readyState)if(200===a.status){var o=t.transform.apply(r,[a])||0;e&&"function"==typeof e?e(o):r.os.innerHTML=o,n.trigger(r.os,"counted-"+r.url)}else console.error("Failed to get API data from",t.url,". Please use the latest version of OpenShare.")},a.open("GET",t.url),a.send()}},{key:"post",value:function(t,e){var r=this,a=new XMLHttpRequest;a.onreadystatechange=function(){if(a.readyState===XMLHttpRequest.DONE&&200===a.status){var o=t.transform.apply(r,[a])||0;e&&"function"==typeof e?e(o):r.os.innerHTML=o,n.trigger(r.os,"counted-"+r.url)}},a.open("POST",t.url),a.setRequestHeader("Content-Type","application/json;charset=UTF-8"),a.send(JSON.stringify(t.data))}},{key:"storeSet",value:function(t){var e=arguments.length<=1||void 0===arguments[1]?0:arguments[1];window.localStorage&&t&&localStorage.setItem("OpenShare-"+t,e)}},{key:"storeGet",value:function(t){return window.localStorage&&t?localStorage.getItem("OpenShare-"+t):void 0}}]),t}()},{"./count-transforms":3,"./events":6}],5:[function(t,e,r){var a=t("./open-share"),n=t("./count"),o=t("./share-transforms"),s=t("./events");e.exports=function(){function t(){e(),void 0!==window.MutationObserver&&u(document.querySelectorAll("[data-open-share-watch]"))}function e(){var t=arguments.length<=0||void 0===arguments[0]?document:arguments[0],e=t.querySelectorAll("[data-open-share]:not([data-open-share-node])");[].forEach.call(e,i);var a=t.querySelectorAll("[data-open-share-count]:not([data-open-share-node])");[].forEach.call(a,r),s.trigger(document,"loaded")}function r(t){var e=t.getAttribute("data-open-share-count"),r=new n(e,t.getAttribute("data-open-share-count-url"));r.count(t),t.setAttribute("data-open-share-node",e)}function i(t){var e=t.getAttribute("data-open-share"),r=e.indexOf("-"),n=void 0;if(r>-1){var s=e.substr(r+1,1),i=e.substr(r,2);e=e.replace(i,s.toUpperCase())}var u=o[e];if(!u)throw new Error("Open Share: "+e+" is an invalid type");n=new a(e,u),t.getAttribute("data-open-share-dynamic")&&(n.dynamic=!0),d(n,t),t.addEventListener("click",function(e){c(e,t,n)}),t.addEventListener("OpenShare.trigger",function(e){c(e,t,n)}),t.setAttribute("data-open-share-node",e)}function u(t){[].forEach.call(t,function(t){var r=new MutationObserver(function(t){e(t[0].target)});r.observe(t,{childList:!0})})}function c(t,e,r){r.dynamic&&d(r,e),r.share(t),s.trigger(e,"shared")}function d(t,e){t.setData({url:e.getAttribute("data-open-share-url"),text:e.getAttribute("data-open-share-text"),via:e.getAttribute("data-open-share-via"),hashtags:e.getAttribute("data-open-share-hashtags"),tweetId:e.getAttribute("data-open-share-tweet-id"),related:e.getAttribute("data-open-share-related"),screenName:e.getAttribute("data-open-share-screen-name"),userId:e.getAttribute("data-open-share-user-id"),link:e.getAttribute("data-open-share-link"),picture:e.getAttribute("data-open-share-picture"),caption:e.getAttribute("data-open-share-caption"),description:e.getAttribute("data-open-share-description"),user:e.getAttribute("data-open-share-user"),video:e.getAttribute("data-open-share-video"),username:e.getAttribute("data-open-share-username"),title:e.getAttribute("data-open-share-title"),media:e.getAttribute("data-open-share-media"),to:e.getAttribute("data-open-share-to"),subject:e.getAttribute("data-open-share-subject"),body:e.getAttribute("data-open-share-body"),ios:e.getAttribute("data-open-share-ios"),type:e.getAttribute("data-open-share-type"),center:e.getAttribute("data-open-share-center"),views:e.getAttribute("data-open-share-views"),zoom:e.getAttribute("data-open-share-zoom"),search:e.getAttribute("data-open-share-search"),saddr:e.getAttribute("data-open-share-saddr"),daddr:e.getAttribute("data-open-share-daddr"),directionsmode:e.getAttribute("data-open-share-directionsmode")})}document.addEventListener("OpenShare.load",t),document.addEventListener("DOMContentLoaded",t)}},{"./count":4,"./events":6,"./open-share":7,"./share-transforms":9}],6:[function(t,e,r){e.exports={trigger:function(t,e){var r=document.createEvent("Event");r.initEvent("OpenShare."+e,!0,!0),t.dispatchEvent(r)}}},{}],7:[function(t,e,r){e.exports=function(){function t(e,r){_classCallCheck(this,t),this.ios=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,this.type=e,this.dynamic=!1,this.transform=r,this.typeCaps=e.charAt(0).toUpperCase()+e.slice(1)}return _createClass(t,[{key:"setData",value:function(t){if(this.ios){var e=this.transform(t,!0);this.mobileShareUrl=this.template(e.url,e.data)}var r=this.transform(t);this.shareUrl=this.template(r.url,r.data)}},{key:"share",value:function(t){var e=this;if(this.mobileShareUrl){var r=(new Date).valueOf();setTimeout(function(){var t=(new Date).valueOf();t-r>1600||(window.location=e.shareUrl)},1500),window.location=this.mobileShareUrl}else"email"===this.type?window.location=this.shareUrl:window.open(this.shareUrl,"OpenShare")}},{key:"template",value:function(t,e){var r=["appendTo","url","innerHTML","classes"],a=t,n=void 0;for(n in e)!e[n]||r.indexOf(n)>-1||(e[n]=encodeURIComponent(e[n]),a+=n+"="+e[n]+"&");return a.substr(0,a.length-1)}}]),t}()},{}],8:[function(t,e,r){var a=t("./open-share"),n=t("./share-transforms"),o=t("./events");e.exports=function(){var t=function(){function t(e,r){var o=this;_classCallCheck(this,t);var s=void 0;return this.element=r,this.data=e,this.os=new a(e.type,n[e.type]),this.os.setData(e),r&&!e.element||(r=e.element,s=document.createElement(r||"a"),e.type&&(s.classList.add("open-share-link",e.type),s.setAttribute("data-open-share",e.type)),e.url&&s.setAttribute("data-open-share-url",e.url),e.via&&s.setAttribute("data-open-share-via",e.via),e.text&&s.setAttribute("data-open-share-text",e.text),e.hashtags&&s.setAttribute("data-open-share-hashtags",e.hashtags),e.innerHTML&&(s.innerHTML=e.innerHTML)),s&&(r=s),e.bindClick&&r.addEventListener("click",function(t){o.share()}),e.appendTo&&e.appendTo.appendChild(r),e.classes&&Array.isArray(e.classes)&&e.classes.forEach(function(t){r.classList.add(t)}),s?s:void 0}return _createClass(t,[{key:"share",value:function(t){this.data.dynamic&&this.os.setData(data),this.os.share(t),o.trigger(this.element,"shared")}}]),t}();return t}},{"./events":6,"./open-share":7,"./share-transforms":9}],9:[function(t,e,r){e.exports={twitter:function(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];if(e&&t.ios){var r="";if(t.text&&(r+=t.text),t.url&&(r+=" - "+t.url),t.hashtags){var a=t.hashtags.split(",");a.forEach(function(t){r+=" #"+t})}return t.via&&(r+=" via "+t.via),{url:"twitter://post?",data:{message:r}}}return{url:"https://twitter.com/share?",data:t}},twitterRetweet:function(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e&&t.ios?{url:"twitter://status?",data:{id:t.tweetId}}:{url:"https://twitter.com/intent/retweet?",data:{tweet_id:t.tweetId,related:t.related}}},twitterLike:function(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e&&t.ios?{url:"twitter://status?",data:{id:t.tweetId}}:{url:"https://twitter.com/intent/favorite?",data:{tweet_id:t.tweetId,related:t.related}}},twitterFollow:function(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];if(e&&t.ios){var r=t.screenName?{screen_name:t.screenName}:{id:t.userId};return{url:"twitter://user?",data:r}}return{url:"https://twitter.com/intent/user?",data:{screen_name:t.screenName,user_id:t.userId}}},facebook:function(t){return{url:"https://www.facebook.com/dialog/feed?app_id=961342543922322&redirect_uri=http://facebook.com&",data:t}},facebookSend:function(t){return{url:"https://www.facebook.com/dialog/send?app_id=961342543922322&redirect_uri=http://facebook.com&",data:t}},youtube:function(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e&&t.ios?{url:"youtube:"+t.video+"?"}:{url:"https://www.youtube.com/watch?v="+t.video+"?"}},youtubeSubscribe:function(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e&&t.ios?{url:"youtube://www.youtube.com/user/"+t.user+"?"}:{url:"https://www.youtube.com/user/"+t.user+"?"}},instagram:function(t){return{url:"instagram://camera?"}},instagramFollow:function(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e&&t.ios?{url:"instagram://user?",data:t}:{url:"http://www.instagram.com/"+t.username+"?"}},snapchat:function(t){return{url:"snapchat://add/"+t.username+"?"}},google:function(t){return{url:"https://plus.google.com/share?",data:t}},googleMaps:function(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return t.search&&(t.q=t.search,delete t.search),e&&t.ios?{url:"comgooglemaps://?",data:e}:(!e&&t.ios&&delete t.ios,{url:"https://maps.google.com/?",data:t})},pinterest:function(t){return{url:"https://pinterest.com/pin/create/bookmarklet/?",data:t}},linkedin:function(t){return{url:"http://www.linkedin.com/shareArticle?",data:t}},buffer:function(t){return{url:"http://bufferapp.com/add?",data:t}},tumblr:function(t){return{url:"https://www.tumblr.com/widgets/share/tool?",data:t}},reddit:function(t){return{url:"http://reddit.com/submit?",data:t}},flickr:function(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e&&t.ios?{url:"flickr://photos/"+t.username+"?"}:{url:"http://www.flickr.com/photos/"+t.username+"?"}},whatsapp:function(t){return{url:"whatsapp://send?",data:t}},sms:function(t){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return{url:e?"sms:&":"sms:?",data:t}},email:function(t){var e="mailto:";return null!==t.to&&(e+=""+t.to),e+="?",{url:e,data:{subject:t.subject,body:t.body}}}}},{}],10:[function(t,e,r){function a(t){var e=document.createElement("a");e.classList.add("open-share-link","twitter"),e.setAttribute("data-open-share","twitter"),e.setAttribute("data-open-share-url",t.url),e.setAttribute("data-open-share-via",t.via),e.setAttribute("data-open-share-text",t.text),e.setAttribute("data-open-share-hashtags",t.hashtags),e.innerHTML='<span class="fa fa-twitter"></span>'+t.button;new i.share({type:"twitter",url:"http://www.digitalsurgeons.com",via:"digitalsurgeons",hashtags:"forwardobsessed",appendTo:document.querySelector(".open-share-watch"),innerHTML:"Created via OpenShareAPI",element:"div",classes:["wow","such","classes"]});return e}function n(){var t=u;document.querySelector(".open-share-watch").appendChild(a(t))}function o(){var t=u,e=a(t);document.querySelector(".open-share-watch").appendChild(e);var r=new i.count({type:"facebook",url:"https://www.digitalsurgeons.com/thoughts/strategy/podcast-killed-the-video-star-how-podcast-advertising-builds-authentic-enga"});e.appendChild(r)}function s(){var t=document.querySelector(".create-node.count-nodes"),e=t.querySelector("input.count-type").value,r=t.querySelector("input.count-url").value,a=new i.count({type:e,url:r,appendTo:document.querySelector(".open-share-watch")});a.style.position="relative",t.querySelector("input.count-type").value="",t.querySelector("input.count-url").value=""}var i=t("./index"),u={url:"http://www.digitalsurgeons.com",via:"digitalsurgeons",text:"Forward Obsessed",hashtags:"forwardobsessed",button:"Open Share Watcher!"};window.addNode=n,window.addNodeWithCount=o,window.createCountNode=s,document.addEventListener("OpenShare.loaded",function(){console.log("Open Share loaded"),[].forEach.call(document.querySelectorAll("[data-open-share]"),function(t){t.addEventListener("OpenShare.shared",function(t){console.log("Open Share Shared",t)})});({twitter:new i.share({type:"twitter",bindClick:!0,url:"http://digitalsurgeons.com",via:"digitalsurgeons",text:"Digital Surgeons",hashtags:"forwardobsessed"},document.querySelector('[data-api-example="twitter"]')),facebook:new i.share({type:"facebook",bindClick:!0,link:"http://digitalsurgeons.com",picture:"http://www.digitalsurgeons.com/img/about/bg_office_team.jpg",caption:"Digital Surgeons",description:"forwardobsessed"},document.querySelector('[data-api-example="facebook"]')),pinterest:new i.share({type:"pinterest",bindClick:!0,url:"http://digitalsurgeons.com",media:"http://www.digitalsurgeons.com/img/about/bg_office_team.jpg",description:"Digital Surgeons",appendTo:document.body},document.querySelector('[data-api-example="pinterest"]')),email:new i.share({type:"email",bindClick:!0,to:"techroom@digitalsurgeons.com",subject:"Digital Surgeons",body:"Forward Obsessed"},document.querySelector('[data-api-example="email"]'))})});var c=["facebook","google","linkedin","reddit","pinterest",["google","linkedin","reddit","pinterest"]];c.forEach(function(t){Array.isArray(t)&&(t=t.join(","));var e=document.querySelectorAll('[data-open-share-count="'+t+'"]');[].forEach.call(e,function(e){e.addEventListener("OpenShare.counted-"+t,function(){var r=e.innerHTML;r&&console.log(t,"shares: ",r)})})})},{"./index":1}]},{},[10]);
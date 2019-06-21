/*!
 * Fuse.js v3.4.5 - Lightweight fuzzy-search (http://fusejs.io)
 * 
 * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Fuse",[],t):"object"==typeof exports?exports.Fuse=t():e.Fuse=t()}(this,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=function(e){return Array.isArray?Array.isArray(e):"[object Array]"===Object.prototype.toString.call(e)}},function(e,t,n){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var a=n(2),s=n(8),c=n(0),l=function(){function e(t,n){var r=n.location,o=void 0===r?0:r,i=n.distance,a=void 0===i?100:i,c=n.threshold,l=void 0===c?.6:c,h=n.maxPatternLength,u=void 0===h?32:h,f=n.caseSensitive,v=void 0!==f&&f,d=n.tokenSeparator,p=void 0===d?/ +/g:d,g=n.findAllMatches,y=void 0!==g&&g,m=n.minMatchCharLength,b=void 0===m?1:m,k=n.id,S=void 0===k?null:k,x=n.keys,M=void 0===x?[]:x,_=n.shouldSort,w=void 0===_||_,L=n.getFn,O=void 0===L?s:L,A=n.sortFn,j=void 0===A?function(e,t){return e.score-t.score}:A,C=n.tokenize,I=void 0!==C&&C,P=n.matchAllTokens,F=void 0!==P&&P,T=n.includeMatches,z=void 0!==T&&T,E=n.includeScore,K=void 0!==E&&E,$=n.verbose,D=void 0!==$&&$;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options={location:o,distance:a,threshold:l,maxPatternLength:u,isCaseSensitive:v,tokenSeparator:p,findAllMatches:y,minMatchCharLength:b,id:S,keys:M,includeMatches:z,includeScore:K,shouldSort:w,getFn:O,sortFn:j,verbose:D,tokenize:I,matchAllTokens:F},this.setCollection(t)}var t,n,l;return t=e,(n=[{key:"setCollection",value:function(e){return this.list=e,e}},{key:"search",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{limit:!1};this._log('---------\nSearch pattern: "'.concat(e,'"'));var n=this._prepareSearchers(e),r=n.tokenSearchers,o=n.fullSearcher,i=this._search(r,o),a=i.weights,s=i.results;return this._computeScore(a,s),this.options.shouldSort&&this._sort(s),t.limit&&"number"==typeof t.limit&&(s=s.slice(0,t.limit)),this._format(s)}},{key:"_prepareSearchers",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=[];if(this.options.tokenize)for(var n=e.split(this.options.tokenSeparator),r=0,o=n.length;r<o;r+=1)t.push(new a(n[r],this.options));return{tokenSearchers:t,fullSearcher:new a(e,this.options)}}},{key:"_search",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],n=arguments.length>1?arguments[1]:void 0,r=this.list,i={},a=[];if("string"==typeof r[0]){for(var s=0,c=r.length;s<c;s+=1)this._analyze({key:"",value:r[s],record:s,index:s},{resultMap:i,results:a,tokenSearchers:t,fullSearcher:n});return{weights:null,results:a}}for(var l={},h=[],u=function(t,n){var r=e.options.keys[t],i=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){o(e,t,n[t])})}return e}({weight:1,getFn:function(t){return e.options.getFn(t,i.name)}},"string"==typeof r?{name:r}:r),a=i.name,s=i.weight;if("function"!=typeof i.getFn)throw new Error("Key getFn must be a function");if(s<=0||s>1)throw new Error("Key weight has to be > 0 and <= 1");l[a]={weight:1-s||1},h.push(i)},f=0,v=this.options.keys.length;f<v;f+=1)u(f);for(var d=0,p=r.length;d<p;d+=1){var g=r[d];for(f=0,v=h.length;f<v;f+=1){var y=h[f];this._analyze({key:y.name,value:y.getFn(g),record:g,index:d},{resultMap:i,results:a,tokenSearchers:t,fullSearcher:n})}}return{weights:l,results:a}}},{key:"_analyze",value:function(e,t){var n=e.key,r=e.arrayIndex,o=void 0===r?-1:r,i=e.value,a=e.record,s=e.index,l=t.tokenSearchers,h=void 0===l?[]:l,u=t.fullSearcher,f=void 0===u?[]:u,v=t.resultMap,d=void 0===v?{}:v,p=t.results,g=void 0===p?[]:p;if(null!=i){var y=!1,m=-1,b=0;if("string"==typeof i){this._log("\nKey: ".concat(""===n?"-":n));var k=f.search(i);if(this._log('Full text: "'.concat(i,'", score: ').concat(k.score)),this.options.tokenize){for(var S=i.split(this.options.tokenSeparator),x=[],M=0;M<h.length;M+=1){var _=h[M];this._log('\nPattern: "'.concat(_.pattern,'"'));for(var w=!1,L=0;L<S.length;L+=1){var O=S[L],A=_.search(O),j={};A.isMatch?(j[O]=A.score,y=!0,w=!0,x.push(A.score)):(j[O]=1,this.options.matchAllTokens||x.push(1)),this._log('Token: "'.concat(O,'", score: ').concat(j[O]))}w&&(b+=1)}m=x[0];for(var C=x.length,I=1;I<C;I+=1)m+=x[I];m/=C,this._log("Token score average:",m)}var P=k.score;m>-1&&(P=(P+m)/2),this._log("Score average:",P);var F=!this.options.tokenize||!this.options.matchAllTokens||b>=h.length;if(this._log("\nCheck Matches: ".concat(F)),(y||k.isMatch)&&F){var T=d[s];T?T.output.push({key:n,arrayIndex:o,value:i,score:P,matchedIndices:k.matchedIndices}):(d[s]={item:a,output:[{key:n,arrayIndex:o,value:i,score:P,matchedIndices:k.matchedIndices}]},g.push(d[s]))}}else if(c(i))for(var z=0,E=i.length;z<E;z+=1)this._analyze({key:n,arrayIndex:z,value:i[z],record:a,index:s},{resultMap:d,results:g,tokenSearchers:h,fullSearcher:f})}}},{key:"_computeScore",value:function(e,t){this._log("\n\nComputing score:\n");for(var n=0,r=t.length;n<r;n+=1){for(var o=t[n].output,i=o.length,a=1,s=1,c=0;c<i;c+=1){var l=e?e[o[c].key].weight:1,h=(1===l?o[c].score:o[c].score||.001)*l;1!==l?s=Math.min(s,h):(o[c].nScore=h,a*=h)}t[n].score=1===s?a:s,this._log(t[n])}}},{key:"_sort",value:function(e){this._log("\n\nSorting...."),e.sort(this.options.sortFn)}},{key:"_format",value:function(e){var t=[];if(this.options.verbose){var n=[];this._log("\n\nOutput:\n\n",JSON.stringify(e,function(e,t){if("object"===r(t)&&null!==t){if(-1!==n.indexOf(t))return;n.push(t)}return t})),n=null}var o=[];this.options.includeMatches&&o.push(function(e,t){var n=e.output;t.matches=[];for(var r=0,o=n.length;r<o;r+=1){var i=n[r];if(0!==i.matchedIndices.length){var a={indices:i.matchedIndices,value:i.value};i.key&&(a.key=i.key),i.hasOwnProperty("arrayIndex")&&i.arrayIndex>-1&&(a.arrayIndex=i.arrayIndex),t.matches.push(a)}}}),this.options.includeScore&&o.push(function(e,t){t.score=e.score});for(var i=0,a=e.length;i<a;i+=1){var s=e[i];if(this.options.id&&(s.item=this.options.getFn(s.item,this.options.id)[0]),o.length){for(var c={item:s.item},l=0,h=o.length;l<h;l+=1)o[l](s,c);t.push(c)}else t.push(s.item)}return t}},{key:"_log",value:function(){var e;this.options.verbose&&(e=console).log.apply(e,arguments)}}])&&i(t.prototype,n),l&&i(t,l),e}();e.exports=l},function(e,t,n){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var o=n(3),i=n(4),a=n(7),s=function(){function e(t,n){var r=n.location,o=void 0===r?0:r,i=n.distance,s=void 0===i?100:i,c=n.threshold,l=void 0===c?.6:c,h=n.maxPatternLength,u=void 0===h?32:h,f=n.isCaseSensitive,v=void 0!==f&&f,d=n.tokenSeparator,p=void 0===d?/ +/g:d,g=n.findAllMatches,y=void 0!==g&&g,m=n.minMatchCharLength,b=void 0===m?1:m;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options={location:o,distance:s,threshold:l,maxPatternLength:u,isCaseSensitive:v,tokenSeparator:p,findAllMatches:y,minMatchCharLength:b},this.pattern=this.options.isCaseSensitive?t:t.toLowerCase(),this.pattern.length<=u&&(this.patternAlphabet=a(this.pattern))}var t,n,s;return t=e,(n=[{key:"search",value:function(e){if(this.options.isCaseSensitive||(e=e.toLowerCase()),this.pattern===e)return{isMatch:!0,score:0,matchedIndices:[[0,e.length-1]]};var t=this.options,n=t.maxPatternLength,r=t.tokenSeparator;if(this.pattern.length>n)return o(e,this.pattern,r);var a=this.options,s=a.location,c=a.distance,l=a.threshold,h=a.findAllMatches,u=a.minMatchCharLength;return i(e,this.pattern,this.patternAlphabet,{location:s,distance:c,threshold:l,findAllMatches:h,minMatchCharLength:u})}}])&&r(t.prototype,n),s&&r(t,s),e}();e.exports=s},function(e,t){var n=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;e.exports=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:/ +/g,o=new RegExp(t.replace(n,"\\$&").replace(r,"|")),i=e.match(o),a=!!i,s=[];if(a)for(var c=0,l=i.length;c<l;c+=1){var h=i[c];s.push([e.indexOf(h),h.length-1])}return{score:a?.5:1,isMatch:a,matchedIndices:s}}},function(e,t,n){var r=n(5),o=n(6);e.exports=function(e,t,n,i){for(var a=i.location,s=void 0===a?0:a,c=i.distance,l=void 0===c?100:c,h=i.threshold,u=void 0===h?.6:h,f=i.findAllMatches,v=void 0!==f&&f,d=i.minMatchCharLength,p=void 0===d?1:d,g=s,y=e.length,m=u,b=e.indexOf(t,g),k=t.length,S=[],x=0;x<y;x+=1)S[x]=0;if(-1!==b){var M=r(t,{errors:0,currentLocation:b,expectedLocation:g,distance:l});if(m=Math.min(M,m),-1!==(b=e.lastIndexOf(t,g+k))){var _=r(t,{errors:0,currentLocation:b,expectedLocation:g,distance:l});m=Math.min(_,m)}}b=-1;for(var w=[],L=1,O=k+y,A=1<<k-1,j=0;j<k;j+=1){for(var C=0,I=O;C<I;){r(t,{errors:j,currentLocation:g+I,expectedLocation:g,distance:l})<=m?C=I:O=I,I=Math.floor((O-C)/2+C)}O=I;var P=Math.max(1,g-I+1),F=v?y:Math.min(g+I,y)+k,T=Array(F+2);T[F+1]=(1<<j)-1;for(var z=F;z>=P;z-=1){var E=z-1,K=n[e.charAt(E)];if(K&&(S[E]=1),T[z]=(T[z+1]<<1|1)&K,0!==j&&(T[z]|=(w[z+1]|w[z])<<1|1|w[z+1]),T[z]&A&&(L=r(t,{errors:j,currentLocation:E,expectedLocation:g,distance:l}))<=m){if(m=L,(b=E)<=g)break;P=Math.max(1,2*g-b)}}if(r(t,{errors:j+1,currentLocation:g,expectedLocation:g,distance:l})>m)break;w=T}return{isMatch:b>=0,score:0===L?.001:L,matchedIndices:o(S,p)}}},function(e,t){e.exports=function(e,t){var n=t.errors,r=void 0===n?0:n,o=t.currentLocation,i=void 0===o?0:o,a=t.expectedLocation,s=void 0===a?0:a,c=t.distance,l=void 0===c?100:c,h=r/e.length,u=Math.abs(s-i);return l?h+u/l:u?1:h}},function(e,t){e.exports=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=[],r=-1,o=-1,i=0,a=e.length;i<a;i+=1){var s=e[i];s&&-1===r?r=i:s||-1===r||((o=i-1)-r+1>=t&&n.push([r,o]),r=-1)}return e[i-1]&&i-r>=t&&n.push([r,i-1]),n}},function(e,t){e.exports=function(e){for(var t={},n=e.length,r=0;r<n;r+=1)t[e.charAt(r)]=0;for(var o=0;o<n;o+=1)t[e.charAt(o)]|=1<<n-o-1;return t}},function(e,t,n){var r=n(0);e.exports=function(e,t){return function e(t,n,o){if(n){var i=n.indexOf("."),a=n,s=null;-1!==i&&(a=n.slice(0,i),s=n.slice(i+1));var c=t[a];if(null!=c)if(s||"string"!=typeof c&&"number"!=typeof c)if(r(c))for(var l=0,h=c.length;l<h;l+=1)e(c[l],s,o);else s&&e(c,s,o);else o.push(c.toString())}else o.push(t);return o}(e,t,[])}}])});
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ae8b7c6649da313853cb"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./scripts/index.js")(__webpack_require__.s = "./scripts/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/classnames/index.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),

/***/ "../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/autoprefixer-loader/index.js?{browsers:[\"Android >= 4\",\"Chrome >= 42\",\"Firefox >= 37\",\"Explorer >= 10\",\"iOS >= 7\",\"Opera >= 28\",\"Safari >= 7\"]}!../node_modules/stylus-loader/index.js?{\"sourceMap\":true}!./scripts/index.styl":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, ".link{display:block;position:relative}.dir{margin:10px 0;background-color:#efefef;padding:3px 10px}.depth--1{margin-left:40px}.depth--2{margin-left:80px}.depth--3{margin-left:120px}.depth--4{margin-left:160px}.depth--5{margin-left:200px}.depth--6{margin-left:240px}.depth--7{margin-left:280px}.depth--8{margin-left:320px}.depth--9{margin-left:360px}.depth--10{margin-left:400px}", "", {"version":3,"sources":["/home/aspiretocode/Рабочий стол/practics/src/scripts/scripts/src/scripts/index.styl","/home/aspiretocode/Рабочий стол/practics/src/scripts/scripts/index.styl"],"names":[],"mappings":"AAAA,MACE,cAAA,AACA,iBAAA,CCCD,ADCD,KACE,cAAA,AACA,yBAAA,AACA,gBAAA,CCCD,ADEC,UACE,gBAAA,CCAH,ADDC,UACE,gBAAA,CCGH,ADJC,UACE,iBAAA,CCMH,ADPC,UACE,iBAAA,CCSH,ADVC,UACE,iBAAA,CCYH,ADbC,UACE,iBAAA,CCeH,ADhBC,UACE,iBAAA,CCkBH,ADnBC,UACE,iBAAA,CCqBH,ADtBC,UACE,iBAAA,CCwBH,ADzBC,WACE,iBAAA,CC2BH","file":"index.styl","sourcesContent":[".link\n  display block\n  position relative\n\n.dir\n  margin 10px 0\n  background-color #efefef\n  padding 3px 10px\n\nfor index in (1..10)\n  .depth--{index}\n    margin-left 40px * index",".link {\n  display: block;\n  position: relative;\n}\n.dir {\n  margin: 10px 0;\n  background-color: #efefef;\n  padding: 3px 10px;\n}\n.depth--1 {\n  margin-left: 40px;\n}\n.depth--2 {\n  margin-left: 80px;\n}\n.depth--3 {\n  margin-left: 120px;\n}\n.depth--4 {\n  margin-left: 160px;\n}\n.depth--5 {\n  margin-left: 200px;\n}\n.depth--6 {\n  margin-left: 240px;\n}\n.depth--7 {\n  margin-left: 280px;\n}\n.depth--8 {\n  margin-left: 320px;\n}\n.depth--9 {\n  margin-left: 360px;\n}\n.depth--10 {\n  margin-left: 400px;\n}\n/*# sourceMappingURL=src/scripts/index.css.map */"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/autoprefixer-loader/index.js?{browsers:[\"Android >= 4\",\"Chrome >= 42\",\"Firefox >= 37\",\"Explorer >= 10\",\"iOS >= 7\",\"Opera >= 28\",\"Safari >= 7\"]}!../node_modules/stylus-loader/index.js?{\"sourceMap\":true}!./styles/main.styl":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}hr{box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;box-sizing:content-box}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{margin:0;padding:0;vertical-align:baseline}body{overflow-y:scroll}input:-moz-placeholder,input:-ms-input-placeholder,input::-moz-placeholder,input[placeholder]{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}input::-ms-clear{display:none}label{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none;cursor:pointer}label:hover{cursor:default}img{width:auto 9;max-width:100%;height:auto}li{list-style-type:none}body,html{-webkit-tap-highlight-color:transparent;height:100%}body{font-size:16px;line-height:1.4;font-family:PTSans-Regular}a{text-decoration:none;-webkit-transition:all .2s ease;transition:all .2s ease}a:hover{-webkit-transition:none;transition:none}@font-face{font-family:PTSans-Regular;src:url(" + __webpack_require__("./static/assets/fonts/PTSans/PTSans-Regular.ttf") + ");font-style:normal;font-weight:400}@font-face{font-family:PTSans-Bold;src:url(" + __webpack_require__("./static/assets/fonts/PTSans/PTSans-Bold.ttf") + ");font-style:normal;font-weight:400}@font-face{font-family:PTSans-Italic;src:url(" + __webpack_require__("./static/assets/fonts/PTSans/PTSans-Italic.ttf") + ");font-style:normal;font-weight:400}@font-face{font-family:PTSans-BoldItalic;src:url(" + __webpack_require__("./static/assets/fonts/PTSans/PTSans-BoldItalic.ttf") + ");font-style:normal;font-weight:400}.u-nobr{white-space:nowrap}.dropdown-menu{color:#fff;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.dropdown-menu--base:before{content:\"\";position:absolute;height:10000px;width:100%;background-color:red;background:-webkit-linear-gradient(top,rgba(68,68,68,.96),rgba(68,68,68,.96) 50%,rgba(90,90,90,.96) 0,rgba(90,90,90,.96));background:linear-gradient(180deg,rgba(68,68,68,.96),rgba(68,68,68,.96) 50%,rgba(90,90,90,.96) 0,rgba(90,90,90,.96));background-size:100% 76px}.dropdown-menu-header{padding:5px 10px;padding-left:30px;position:relative}.dropdown-menu-header--active:before{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.dropdown-menu-header:before{content:\"\";width:30px;height:30px;background-image:url(" + __webpack_require__("./static/assets/images/icons/arrow-down.svg") + ");background-size:cover;position:absolute;top:4px;left:0;opacity:.8;-webkit-transition:-webkit-transform .2s ease;transition:-webkit-transform .2s ease;transition:transform .2s ease;transition:transform .2s ease,-webkit-transform .2s ease}.dropdown-menu-header:hover{cursor:pointer}.dropdown-menu-elements{display:none;position:relative;left:25px;width:calc(100% - 25px)}.dropdown-menu-elements--active{display:block}a.dropdown-menu-el,a.dropdown-menu-el:active,a.dropdown-menu-el:hover{position:relative;color:#fff;text-decoration:none;display:block;padding-left:0;margin-left:25px;white-space:nowrap;font-size:15px;height:38px;display:-webkit-flex;display:-ms-flex;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}a.dropdown-menu-el{position:relative;overflow-y:auto}a.dropdown-menu-el:after{position:absolute;content:\"\";bottom:2px;left:10px;height:2px;background-color:#fff;-webkit-transform:translateX(-110%);transform:translateX(-110%);-webkit-transition:-webkit-transform .6s ease;transition:-webkit-transform .6s ease;transition:transform .6s ease;transition:transform .6s ease,-webkit-transform .6s ease;width:100%}a.dropdown-menu-el:hover{cursor:pointer}a.dropdown-menu-el:hover:after{-webkit-transform:translateX(-10%);transform:translateX(-10%)}.footer{position:absolute;bottom:0;left:0;height:160px;background-image:url(" + __webpack_require__("./static/assets/images/bg-header.png") + ");background-size:cover;background-attachment:fixed;background-position:0 0;width:calc(100% - 40px);display:-webkit-flex;display:-ms-flex;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:20px}.footer__text{position:relative;color:#fff;text-align:center}.footer:before{content:\"\";background-color:hsla(0,0%,7%,.8);top:0;height:100%}.footer:before,.header-tabs{position:absolute;left:0;width:100%}.header-tabs{color:#fff;bottom:0;padding:0 30px;box-sizing:border-box}@media screen and (max-width:870px){.header-tabs{top:0;display:-webkit-flex;display:-ms-flex;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}}@media screen and (max-width:900px){.header-tabs{padding:0 20px}}.header-elements{position:relative;z-index:10;display:-webkit-flex;display:-ms-flex;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;max-width:1000px;margin:0 auto}@media screen and (max-width:1050px){.header-elements{max-width:840px}}@media screen and (max-width:870px){.header-elements{display:none}.header-elements--mobiled{z-index:20;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.header-elements__element{border-radius:5px;width:80%;margin-bottom:8px}.header-elements__element:last-child{margin-bottom:0}}.header-elements__element{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;text-align:center;background-color:rgba(68,68,68,.96);-webkit-transition:all .15s ease;transition:all .15s ease;padding:12px 20px;font-size:16px;border-top-left-radius:5px;border-top-right-radius:5px}@media screen and (max-width:1050px){.header-elements__element{padding:6px 10px;font-size:15px}}.header-elements__element--active{background-color:#fff;color:rgba(68,68,68,.96)}.header-elements__element:hover{cursor:pointer}@media screen and (max-width:870px) and (max-width:480px){.header-elements__element{max-width:70%;margin-bottom:5px;font-size:14px}}.header{position:relative;height:300px;background-image:url(" + __webpack_require__("./static/assets/images/bg-header.png") + ");background-size:cover;background-attachment:fixed;background-position:0 -300px}.header-open-mobile-menu{z-index:25;position:absolute;top:10px;left:10px;width:36px;height:36px;background-image:url(" + __webpack_require__("./static/assets/images/icons/burger.svg") + ");background-size:cover;-webkit-transition:opacity .2s;transition:opacity .2s;opacity:.8;display:none}@media screen and (max-width:870px){.header-open-mobile-menu{display:block}}.header-open-mobile-menu--close{background-image:url(" + __webpack_require__("./static/assets/images/icons/close.svg") + ");background-size:cover}.header-open-mobile-menu:hover{opacity:1;cursor:pointer}.header-overlay{z-index:15;background-color:hsla(0,0%,7%,.85);position:absolute;top:0;left:0;height:100%;width:100%;display:none}.header-overlay--active{display:block}.header:after{content:\"\";position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.3);display:none;pointer-events:none}@media screen and (max-width:870px){.header:after{display:block}}.header-circle{position:relative;z-index:10;width:240px;height:240px;background-color:hsla(0,0%,100%,.9);border-radius:50%;position:absolute;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}@media screen and (max-width:780px){.header-circle{width:180px;height:180px}}.header-circle__logo-mirea{background-image:url(" + __webpack_require__("./static/assets/images/logo-mirea.png") + ");background-size:cover;width:100px;height:100px;position:absolute;bottom:6px;left:50%;-webkit-transform:translate(-50%);transform:translate(-50%)}@media screen and (max-width:780px){.header-circle__logo-mirea{width:80px;height:80px}}.header-labels{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;padding:16px}.header-labels,.header-labels__label{display:-webkit-flex;display:-ms-flex;display:-webkit-box;display:-ms-flexbox;display:flex}.header-labels__label{color:#fff;-webkit-transition:all .3s ease;transition:all .3s ease;background-color:rgba(163,203,197,.55);font-size:25px;padding:18px 16px;text-align:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;min-width:360px;border-radius:5px}@media screen and (max-width:1120px){.header-labels__label{padding:5px 8px;font-size:16px;min-width:208px;border-radius:2px;background-color:rgba(116,177,168,.9)}}@media screen and (max-width:870px){.header-labels__label{display:none}}.header-labels__label:active,.header-labels__label:hover{cursor:pointer;background-color:rgba(163,203,197,.85);color:#fff;-webkit-transition:all .3s ease;transition:all .3s ease}.main-professor{display:-webkit-flex;display:-ms-flex;display:-webkit-box;display:-ms-flexbox;display:flex;margin-bottom:20px}.main-professor__image{background-image:url(" + __webpack_require__("./static/assets/images/professors/petrov.png") + ");background-size:cover;width:160px;height:240px;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}@media screen and (max-width:480px){.main-professor__image{width:120px;height:180px}}@media screen and (max-width:480px){.main-professor__descr{margin-bottom:20px}}.main-professor__info{display:-webkit-flex;display:-ms-flex;display:-webkit-box;display:-ms-flexbox;display:flex;margin-left:20px;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}@media screen and (max-width:480px){.main-professor__info{margin-left:14px}}.main-professor__position-1{font-family:PTSans-Italic}.main-professor__contact,.main-professor__position-1,.main-professor__position-2{padding:2px 0;font-size:14px}.main-text{font-size:14px;margin-bottom:20px;color:#444}.stuff-persons{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.stuff-person,.stuff-persons{display:-webkit-flex;display:-ms-flex;display:-webkit-box;display:-ms-flexbox;display:flex}.stuff-person{-webkit-flex-basis:33.33333%;-ms-flex-preferred-size:33.33333%;flex-basis:33.33333%;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;margin-bottom:20px;-webkit-transition:all .2s linear;transition:all .2s linear}@media screen and (max-width:870px){.stuff-person{-webkit-flex-basis:50%;-ms-flex-preferred-size:50%;flex-basis:50%}}@media screen and (max-width:480px){.stuff-person{-webkit-flex-basis:100%;-ms-flex-preferred-size:100%;flex-basis:100%;margin-bottom:20px}}.stuff-person__photo{width:80%;height:300px;margin-bottom:10px;-webkit-transition:-webkit-filter .3s ease;transition:-webkit-filter .3s ease;transition:filter .3s ease;transition:filter .3s ease,-webkit-filter .3s ease;-webkit-filter:saturate(60%);filter:saturate(60%)}@media screen and (max-width:560px){.stuff-person__photo{height:260px}}@media screen and (max-width:480px){.stuff-person__photo{height:320px}}.stuff-person__photo:hover{cursor:pointer;-webkit-filter:saturate(100%);filter:saturate(100%)}.stuff-person__photo--andrianova{background-image:url(" + __webpack_require__("./static/assets/images/professors/andrianova.jpg") + ");background-size:cover}.stuff-person__photo--petrov{background-image:url(" + __webpack_require__("./static/assets/images/professors/petrov.png") + ");background-size:cover}.stuff-person__photo--panov{background-image:url(" + __webpack_require__("./static/assets/images/professors/panov.jpg") + ");background-size:cover}.stuff-person__photo--nemenko{background-image:url(" + __webpack_require__("./static/assets/images/professors/nemenko.jpg") + ");background-size:cover}.stuff-person__photo--aldobaeva{background-image:url(" + __webpack_require__("./static/assets/images/professors/aldobaeva.jpg") + ");background-size:cover}.stuff-person__photo--bashlykova{background-image:url(" + __webpack_require__("./static/assets/images/professors/bashlykova.jpg") + ");background-size:cover}.stuff-person__photo--tomashevskaya{background-image:url(" + __webpack_require__("./static/assets/images/professors/tomashevskaya.jpg") + ");background-size:cover}.stuff-person__photo--trokhachenkova{background-image:url(" + __webpack_require__("./static/assets/images/professors/trokhachenkova.jpg") + ");background-size:cover}.stuff-person__photo--bagrov{background-image:url(" + __webpack_require__("./static/assets/images/professors/bagrov.jpg") + ");background-size:cover}.stuff-person__photo--proshaeva{background-image:url(" + __webpack_require__("./static/assets/images/professors/proshaeva.jpg") + ");background-size:cover;background-position:-35px 0}.stuff-person__photo--mirzoyan{background-image:url(" + __webpack_require__("./static/assets/images/professors/mirzoyan.jpg") + ");background-size:cover;background-position:-35px 0}.stuff-person__photo--davydov{background-image:url(" + __webpack_require__("./static/assets/images/professors/davydov.jpg") + ");background-size:cover}.stuff-person__photo--nophoto{background-image:url(" + __webpack_require__("./static/assets/images/professors/noavatar.png") + ");background-size:cover;background-size:70% auto;background-repeat:no-repeat;background-position:50% 50%;background-color:#efefef}.stuff-person__name{font-family:PTSans-Bold;font-size:16px;text-align:center}.stuff-person__position-1{font-family:PTSans-Italic}.stuff-person__position-1,.stuff-person__position-2{font-size:16px;text-align:center}.tabs-content-data-documents{overflow:hidden;border-radius:5px}.tabs-content-data-mto{overflow-y:scroll}table.table-mto{width:100%;min-width:600px;text-align:center;border-collapse:collapse}table.table-mto tbody td{font-size:13px}table.table-mto tr{-webkit-transition:all .1s ease;transition:all .1s ease}table.table-mto tr:nth-child(2n){background:#efefee}table.table-mto tr:hover{background-color:#ddd}table.table-mto tr th{font-weight:700;color:#fff}table.table-mto tr td{font-size:14px;vertical-align:middle;padding:14px 10px}table.table-mto tr .links{text-align:right}table.table-mto tr .links a{display:inline-block;background:#1c6ea4;color:#fff;padding:2px 8px;border-radius:5px}table.table-mto td,table.table-mto th{border:1px solid #aeabb3;padding:3px 2px}.tabs-content-data-stuff{max-width:900px;margin:0 auto}.tabs-content-element{padding:20px;width:calc(100% - 40px);opacity:0;pointer-events:none;-webkit-transition:.2s linear;transition:.2s linear;-webkit-transition-property:opacity,-webkit-transform;transition-property:opacity,-webkit-transform;transition-property:transform,opacity;transition-property:transform,opacity,-webkit-transform;color:#444;padding-bottom:20px;display:none}@media screen and (max-width:480px){.tabs-content-element{padding:20px 14px;width:calc(100% - 28px)}}.tabs-content-element--active{display:block;pointer-events:auto;-webkit-animation:slidein .3s ease .1s;animation:slidein .3s ease .1s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.tabs-content{position:relative;max-width:1200px;margin:0 auto}.tabs-content-data{padding-bottom:200px}@-webkit-keyframes slidein{0%{opacity:0;-webkit-transform:translateX(-50px);transform:translateX(-50px)}to{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}}@keyframes slidein{0%{opacity:0;-webkit-transform:translateX(-50px);transform:translateX(-50px)}to{opacity:1;-webkit-transform:translateX(0);transform:translateX(0)}}.text-header{font-family:PTSans-Bold;color:#444;font-size:14px}.text-header--big{font-size:16px;padding:2px 0}.text-link{display:block;font-size:14px;margin-bottom:20px}.text-list{padding:3px 0;color:#444}.text-list__item{position:relative;font-size:14px;margin-left:20px;margin-bottom:10px}@media screen and (max-width:480px){.text-list__item{margin-left:14px}}.text-list__item:before{content:\"\";position:absolute;left:-19px;top:6px;height:calc(100% - 12px);width:4px;background-color:hsla(204,2%,59%,.8)}@media screen and (max-width:480px){.text-list__item:before{left:-13px;top:3px;height:calc(100% - 6px)}}.text-list__item:last-child{margin-bottom:0}.text-list--regular{margin-left:20px}.text-list--regular .text-list__item{margin-bottom:5px;list-style-type:disc}.text-list--regular .text-list__item:before{display:none}.text-list--numeric{margin-left:20px}.text-list--numeric .text-list__item{margin-bottom:5px;list-style-type:decimal}.text-list--numeric .text-list__item:before{display:none}body{font-size:20px}a,a:active,a:hover{color:#0881a9;text-decoration:underline}.content-wrapper{position:relative;min-height:100%}", "", {"version":3,"sources":["/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/styles/base/reset.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/main.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/styles/_mixins.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/styles/base/core.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/styles/base/fonts.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/styles/base/utilities.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/dropdown-menu/dropdown-menu.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/footer/footer.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/header-tabs/header-tabs.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/header/header.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/main-professor/main-professor.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/main-text/main-text.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/stuff-person/stuff-person.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/tabs-content-data-documents/tabs-content-data-documents.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/tabs-content-data-mto/tabs-content-data-mto.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/tabs-content-data-stuff/tabs-content-data-stuff.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/tabs-content/tabs-content.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/text-header/text-header.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/text-link/text-link.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/blocks/text-list/text-list.styl","/home/aspiretocode/Рабочий стол/practics/src/styles/styles/src/styles/main.styl"],"names":[],"mappings":"AAEA,KACC,uBAAA,AACA,0BAAA,AACA,6BAAA,CCAA,ADGD,KACC,QAAA,CCDA,ADID,2FAaC,aAAA,CCFA,ADKD,4BAIC,qBAAA,AACA,uBAAA,CCHA,ADMD,sBACC,aAAA,AACA,QAAA,CCJA,ADOD,EACC,4BAAA,CCLA,ADOA,iBAEC,SAAA,CCLD,ADQD,YACC,wBAAA,CCNA,ADSD,SAEC,eAAA,CCPA,ADUD,IACC,iBAAA,CCRA,ADWD,KACC,gBAAA,AACA,UAAA,CCTA,ADYD,MACC,aAAA,CCVA,ADaD,QAEC,cAAA,AACA,cAAA,AACA,kBAAA,AACA,uBAAA,CCXA,ADcD,IACC,SAAA,CCZA,ADeD,IACC,aAAA,CCbA,ADgBD,IACC,QAAA,CCdA,ADiBD,eACC,eAAA,CCfA,ADkBD,GACC,uBAAA,AACA,QAAA,CChBA,ADmBD,IACC,aAAA,CCjBA,ADoBD,kBAIC,gCAAA,AACA,aAAA,CClBA,ADqBD,sCAKC,cAAA,AACA,aAAA,AACA,QAAA,CCnBA,ADsBD,OACC,gBAAA,CCpBA,ADuBD,cAEC,mBAAA,CCrBA,ADwBD,oEAIC,0BAAA,AACA,cAAA,CCtBA,ADyBD,sCAEC,cAAA,CCvBA,AD0BD,iDAEC,SAAA,AACA,SAAA,CCxBA,AD2BD,MACC,kBAAA,CCzBA,AD4BD,uCAEC,sBAAA,AACA,SAAA,CC1BA,AD6BD,4FAEC,WAAA,CC3BA,AD8BD,mBACC,6BAAA,AACA,sBAAA,CC5BA,AD+BD,+FAEC,uBAAA,CC7BA,AD+BD,OACC,SAAA,AACA,SAAA,CC7BA,ADgCD,SACC,aAAA,CC9BA,ADgCD,SACC,eAAA,CC9BA,ADiCD,MACC,yBAAA,AACA,gBAAA,CC/BA,ADkCD,MAEC,SAAA,CChCA,ADoCD,2ZAiFC,SAAA,AACA,UAAA,AACA,uBAAA,CClCA,ADwCD,KACC,iBAAA,CCtCA,AD0CD,8FElNC,gBAAA,AACA,mBAAA,AACA,sBAAA,CD8KA,AD0CD,iBACC,YAAA,CCxCA,AD4CD,MEjNC,yBAAA,sBAAA,qBAAA,iBAAA,AACA,2BAAA,AFkNA,cAAA,CCzCA,ACvKA,YACC,cAAA,CDyKD,AD0CD,IACC,aAAA,AACA,eAAA,AACA,WAAA,CCxCA,AD0CD,GACC,oBAAA,CCxCA,AElRD,UACC,wCAAA,AACA,WAAA,CFqRA,AEnRD,KACC,eAAA,AACA,gBAAA,AACA,0BAAA,CFqRA,AEnRD,EACC,qBAAA,AAEA,gCAAA,uBAAA,CFoRA,AElRA,QACC,wBAAA,eAAA,CFoRD,AGrSD,WACC,2BAAA,AACA,kCAAA,AACA,kBAAA,AACA,eAAA,CHuSA,AGrSD,WACC,wBAAA,AACA,kCAAA,AACA,kBAAA,AACA,eAAA,CHuSA,AGpSD,WACC,0BAAA,AACA,kCAAA,AACA,kBAAA,AACA,eAAA,CHsSA,AGpSD,WACC,8BAAA,AACA,kCAAA,AACA,kBAAA,AACA,eAAA,CHsSA,AI7TD,QACC,kBAAA,CJ+TA,AKhUD,eACC,WAAA,AACA,kBAAA,AACA,yBAAA,sBAAA,qBAAA,gBAAA,CLkUA,AK/TC,4BACC,WAAA,AACA,kBAAA,AACA,eAAA,AACA,WAAA,AACA,qBAAA,AACA,0HAAA,qHAAA,AAOA,yBAAA,CL2TF,AKzTD,sBACC,iBAAA,AACA,kBAAA,AACA,iBAAA,CL2TA,AKvTC,qCACC,iCAAA,wBAAA,CLyTF,AKvTA,6BACC,WAAA,AJhBD,WAAA,AACA,YAAA,AAwGA,+CAAA,AACA,sBAAA,AIvFC,kBAAA,AACA,QAAA,AACA,OAAA,AACA,WAAA,AACA,8CAAA,sCAAA,8BAAA,wDAAA,CL2TD,AKxTA,4BACC,cAAA,CL0TD,AKxTD,wBACC,aAAA,AACA,kBAAA,AACA,UAAA,AACA,uBAAA,CL0TA,AKxTD,gCACC,aAAA,CL0TA,AKxTD,sEACC,kBAAA,AACA,WAAA,AACA,qBAAA,AACA,cAAA,AACA,eAAA,AACA,iBAAA,AACA,mBAAA,AACA,eAAA,AACA,YAAA,AACA,qBAAA,AACA,iBAAA,AACA,oBAAA,oBAAA,aAAA,AACA,yBAAA,2BAAA,sBAAA,kBAAA,CL4TA,AK1TD,mBACC,kBAAA,AACA,eAAA,CL4TA,AK3TA,yBACC,kBAAA,AACA,WAAA,AACA,WAAA,AACA,UAAA,AACA,WAAA,AACA,sBAAA,AACA,oCAAA,4BAAA,AACA,8CAAA,sCAAA,8BAAA,yDAAA,AACA,UAAA,CL6TD,AK3TD,yBACC,cAAA,CL6TA,AK5TA,+BACC,mCAAA,0BAAA,CL8TD,AMpZD,QACC,kBAAA,AACA,SAAA,AACA,OAAA,AACA,aAAA,ALqHA,+CAAA,AACA,sBAAA,AKpHA,4BAAA,AACA,wBAAA,AACA,wBAAA,AACA,qBAAA,AACA,iBAAA,AACA,oBAAA,oBAAA,aAAA,AACA,wBAAA,+BAAA,qBAAA,uBAAA,AACA,yBAAA,2BAAA,sBAAA,mBAAA,AACA,YAAA,CNuZA,AMrZA,cACC,kBAAA,AACA,WAAA,AACA,iBAAA,CNuZD,AMrZA,eACC,WAAA,AACA,kCAAA,AAEA,MAAA,AAEA,WAAA,CNwZD,AOnbD,4BDwBE,kBAAA,AAEA,OAAA,AAEA,UAAA,CNgaD,AO5bD,aACC,WAAA,AAEA,SAAA,AAEA,eAAA,AAEA,qBAAA,CPqbA,AOnbmC,oCAAA,aAClC,MAAA,AACA,qBAAA,AACA,iBAAA,AACA,oBAAA,oBAAA,aAAA,AACA,yBAAA,2BAAA,sBAAA,mBAAA,AACA,wBAAA,+BAAA,qBAAA,sBAAA,CPsbC,CACF,AOrbmC,oCAAA,aAClC,cAAA,CPwbC,CACF,AOvbD,iBACC,kBAAA,AACA,WAAA,AACA,qBAAA,AACA,iBAAA,AACA,oBAAA,oBAAA,aAAA,AACA,yBAAA,sCAAA,sBAAA,8BAAA,AACA,yBAAA,2BAAA,sBAAA,mBAAA,AACA,iBAAA,AACA,aAAA,CPybA,AOvboC,qCAAA,iBACnC,eAAA,CP0bC,CACF,AOzbmC,oCAAA,iBAClC,YAAA,CP4bC,AO1bD,0BACC,WAAA,AACA,oBAAA,qBAAA,oBAAA,aAAA,AACA,4BAAA,6BAAA,8BAAA,0BAAA,qBAAA,CP4bA,AO1bD,0BACC,kBAAA,AACA,UAAA,AACA,iBAAA,CP4bA,AOzbA,qCACC,eAAA,CP2bD,CACF,AOnbA,0BACC,yBAAA,sBAAA,qBAAA,iBAAA,AACA,kBAAA,AACA,oCAAA,AACA,iCAAA,yBAAA,AACA,kBAAA,AACA,eAAA,AACA,2BAAA,AACA,2BAAA,CPqbD,AOnbqC,qCAAA,0BACnC,iBAAA,AACA,cAAA,CPsbA,CACF,AOrbC,kCACC,sBAAA,AACA,wBAAA,CPubF,AOrbC,gCACC,cAAA,CPubF,AOjdoC,0DAClC,0BACC,cAAA,AACA,kBAAA,AACA,cAAA,CPmdD,CACF,AQvgBD,QACC,kBAAA,AAEA,aAAA,APkHA,+CAAA,AACA,sBAAA,AOjHA,4BAAA,AACA,4BAAA,CR0gBA,AQxgBA,yBACC,WAAA,AACA,kBAAA,AACA,SAAA,AACA,UAAA,APAD,WAAA,AACA,YAAA,AAwGA,+CAAA,AACA,sBAAA,AOvGC,+BAAA,uBAAA,AACA,WAAA,AACA,YAAA,CR4gBD,AQ1gBoC,oCAAA,yBAClC,aAAA,CR6gBA,CACF,AQ5gBC,gCP+FD,+CAAA,AACA,qBAAA,CDgbA,AQ7gBC,+BACC,UAAA,AACA,cAAA,CR+gBF,AQ7gBA,gBACC,WAAA,AACA,mCAAA,AACA,kBAAA,AACA,MAAA,AACA,OAAA,AACA,YAAA,AACA,WAAA,AACA,YAAA,CR+gBD,AQ7gBC,wBACC,aAAA,CR+gBF,AQ7gBA,cACC,WAAA,AACA,kBAAA,AACA,MAAA,AACA,OAAA,AACA,WAAA,AACA,YAAA,AACA,gCAAA,AACA,aAAA,AACA,mBAAA,CR+gBD,AQ7gBmC,oCAClC,cACC,aAAA,CR+gBA,CACF,AQ9gBA,eACC,kBAAA,AACA,WAAA,AP/CD,YAAA,AACA,aAAA,AOgDC,oCAAA,AACA,kBAAA,AACA,kBAAA,AACA,SAAA,AACA,uCAAA,8BAAA,CRihBD,AQ/gBoC,oCAAA,ePvDpC,YAAA,AACA,YAAA,CD0kBE,CACF,AQlhBC,2BP+CD,+CAAA,AACA,sBAAA,AA1GA,YAAA,AACA,aAAA,AO4DE,kBAAA,AACA,WAAA,AACA,SAAA,AACA,kCAAA,yBAAA,CRshBF,AQphBqC,oCAAA,2BPlErC,WAAA,AACA,WAAA,CD0lBE,CACF,AQthBA,eAIC,yBAAA,sCAAA,sBAAA,8BAAA,AACA,YAAA,CRwhBD,AQthBC,qCANA,qBAAA,AACA,iBAAA,AACA,oBAAA,oBAAA,YAAA,CRyiBD,AQriBC,sBACC,WAAA,AACA,gCAAA,wBAAA,AACA,uCAAA,AACA,eAAA,AACA,kBAAA,AACA,kBAAA,AAIA,wBAAA,+BAAA,qBAAA,uBAAA,AACA,yBAAA,2BAAA,sBAAA,mBAAA,AACA,gBAAA,AACA,iBAAA,CRwhBF,AQthBsC,qCAAA,sBACnC,gBAAA,AACA,eAAA,AACA,gBAAA,AACA,kBAAA,AACA,qCAAA,CRyhBD,CACF,AQxhBqC,oCAAA,sBAClC,YAAA,CR2hBD,CACF,AQphBE,yDALC,eAAA,AACA,uCAAA,AACA,WAAA,AACA,gCAAA,uBAAA,CRkiBH,ASzpBD,gBACC,qBAAA,AACA,iBAAA,AACA,oBAAA,oBAAA,aAAA,AACA,kBAAA,CT2pBA,ASzpBA,uBRgHA,gDAAA,AACA,sBAAA,AA1GA,YAAA,AACA,aAAA,AQLC,sBAAA,oBAAA,aAAA,CT6pBD,AS3pBoC,oCAAA,uBREpC,YAAA,AACA,YAAA,CD6pBE,CACF,AS7pBoC,oCAAA,uBAClC,kBAAA,CTgqBA,CACF,AS/pBA,sBACC,qBAAA,AACA,iBAAA,AACA,oBAAA,oBAAA,aAAA,AACA,iBAAA,AACA,4BAAA,6BAAA,8BAAA,0BAAA,sBAAA,AACA,yBAAA,sCAAA,sBAAA,6BAAA,CTiqBD,AS/pBoC,oCAAA,sBAClC,gBAAA,CTkqBA,CACF,ASjqBA,4BAGC,yBAAA,CTmqBD,AS7pBA,iFACC,cAAA,AACA,cAAA,CTmqBD,AU9sBD,WACC,eAAA,AACA,mBAAA,AACA,UAAA,CVgtBA,AWntBD,eAIC,yBAAA,sCAAA,sBAAA,8BAAA,AACA,uBAAA,mBAAA,cAAA,CXqtBA,AWntBD,6BANC,qBAAA,AACA,iBAAA,AACA,oBAAA,oBAAA,YAAA,CXiuBA,AW7tBD,cACC,6BAAA,kCAAA,qBAAA,AAIA,4BAAA,6BAAA,8BAAA,0BAAA,sBAAA,AACA,yBAAA,2BAAA,sBAAA,mBAAA,AACA,mBAAA,AACA,kCAAA,yBAAA,CXqtBA,AWntBmC,oCAAA,cAClC,uBAAA,4BAAA,cAAA,CXstBC,CACF,AWrtBmC,oCAAA,cAClC,wBAAA,6BAAA,gBAAA,AACA,kBAAA,CXwtBC,CACF,AWvtBA,qBACC,UAAA,AACA,aAAA,AACA,mBAAA,AACA,2CAAA,mCAAA,2BAAA,mDAAA,AACA,6BAAA,oBAAA,CXytBD,AWvtBoC,oCAAA,qBAClC,YAAA,CX0tBA,CACF,AWztBoC,oCAAA,qBAClC,YAAA,CX4tBA,CACF,AW1tBC,2BACC,eAAA,AACA,8BAAA,qBAAA,CX4tBF,AW1tBC,iCV+ED,gDAAA,AACA,qBAAA,CD8oBA,AW3tBC,6BV4ED,gDAAA,AACA,qBAAA,CDkpBA,AW5tBC,4BVyED,gDAAA,AACA,qBAAA,CDspBA,AW7tBC,8BVsED,gDAAA,AACA,qBAAA,CD0pBA,AW9tBC,gCVmED,gDAAA,AACA,qBAAA,CD8pBA,AW/tBC,iCVgED,gDAAA,AACA,qBAAA,CDkqBA,AWhuBC,oCV6DD,gDAAA,AACA,qBAAA,CDsqBA,AWjuBC,qCV0DD,gDAAA,AACA,qBAAA,CD0qBA,AWluBC,6BVuDD,gDAAA,AACA,qBAAA,CD8qBA,AWnuBC,gCVoDD,gDAAA,AACA,sBAAA,AUnDE,2BAAA,CXsuBF,AWpuBC,+BVgDD,gDAAA,AACA,sBAAA,AU/CE,2BAAA,CXuuBF,AWruBC,8BV4CD,gDAAA,AACA,qBAAA,CD4rBA,AWtuBC,8BVyCD,gDAAA,AACA,sBAAA,AUvCE,yBAAA,AACA,4BAAA,AACA,4BAAA,AACA,wBAAA,CXwuBF,AWtuBA,oBACC,wBAAA,AACA,eAAA,AACA,iBAAA,CXwuBD,AWtuBA,0BACC,yBAAA,CX0uBD,AWtuBA,oDAHC,eAAA,AACA,iBAAA,CX4uBD,AY50BD,6BACC,gBAAA,AACA,iBAAA,CZ80BA,Aah1BD,uBACC,iBAAA,Cbk1BA,Aa/0BA,gBACC,WAAA,AACA,gBAAA,AACA,kBAAA,AACA,wBAAA,Cbi1BD,Aa/0BE,yBACC,cAAA,Cbi1BH,Aah1BC,mBACC,gCAAA,uBAAA,Cbk1BF,Aaj1BE,iCACC,kBAAA,Cbm1BH,Aal1BE,yBACC,qBAAA,Cbo1BH,Aan1BE,sBACC,gBAAA,AACA,UAAA,Cbq1BH,Aap1BE,sBACC,eAAA,AACA,sBAAA,AACA,iBAAA,Cbs1BH,Aar1BE,0BACC,gBAAA,Cbu1BH,Aat1BG,4BACC,qBAAA,AACA,mBAAA,AACA,WAAA,AACA,gBAAA,AACA,iBAAA,Cbw1BJ,Aat1BD,sCACC,yBAAA,AACA,eAAA,Cby1BA,Ac73BD,yBACC,gBAAA,AACA,aAAA,Cd+3BA,Aej4BD,sBACC,aAAA,AACA,wBAAA,AACA,UAAA,AACA,oBAAA,AACA,8BAAA,sBAAA,AACA,sDAAA,8CAAA,sCAAA,wDAAA,AACA,WAAA,AACA,oBAAA,AACA,YAAA,Cfm4BA,Aej4BmC,oCAAA,sBAClC,kBAAA,AACA,uBAAA,Cfo4BC,CACF,Aen4BA,8BACC,cAAA,AACA,oBAAA,AACA,uCAAA,+BAAA,AACA,qCAAA,4BAAA,Cfq4BD,Aen4BD,cACC,kBAAA,AACA,iBAAA,AACA,aAAA,Cfq4BA,Aen4BD,mBACC,oBAAA,Cfq4BA,Ael4BU,2BACV,GACC,UAAA,AACA,oCAAA,2BAAA,Cf84BC,Ae74BF,GACC,UAAA,AACA,gCAAA,uBAAA,Cf+4BC,CACF,Aet5BU,mBACV,GACC,UAAA,AACA,oCAAA,2BAAA,Cfk6BC,Aej6BF,GACC,UAAA,AACA,gCAAA,uBAAA,Cfm6BC,CACF,AgBx8BD,aACC,wBAAA,AACA,WAAA,AACA,cAAA,ChB08BA,AgBx8BA,kBACC,eAAA,AACA,aAAA,ChB08BD,AiBj9BD,WACC,cAAA,AACA,eAAA,AACA,kBAAA,CjBm9BA,AkBp9BD,WACC,cAAA,AACA,UAAA,ClBs9BA,AkBn9BA,iBACC,kBAAA,AACA,eAAA,AACA,iBAAA,AACA,kBAAA,ClBq9BD,AkBn9BoC,oCAAA,iBAClC,gBAAA,ClBs9BA,CACF,AkBr9BC,wBACC,WAAA,AACA,kBAAA,AACA,WAAA,AACA,QAAA,AACA,yBAAA,AACA,UAAA,AACA,oCAAA,ClBu9BF,AkBr9BqC,oCAAA,wBAClC,WAAA,AACA,QAAA,AACA,uBAAA,ClBw9BD,CACF,AkBv9BC,4BACC,eAAA,ClBy9BF,AkBt9BD,oBACC,gBAAA,ClBw9BA,AkBt9BD,qCACC,kBAAA,AACA,oBAAA,ClBw9BA,AkBt9BA,4CACC,YAAA,ClBw9BD,AkBt9BD,oBACC,gBAAA,ClBw9BA,AkBt9BD,qCACC,kBAAA,AACA,uBAAA,ClBw9BA,AkBt9BA,4CACC,YAAA,ClBw9BD,AmBlgCD,KACC,cAAA,CnBogCA,AmBlgCD,mBACC,cAAA,AACA,yBAAA,CnBsgCA,AmBpgCD,iBACC,kBAAA,AACA,eAAA,CnBsgCA","file":"main.styl","sourcesContent":["/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\n\nhtml\n\tfont-family sans-serif\n\t-ms-text-size-adjust 100%\n\t-webkit-text-size-adjust 100%\n\n\nbody\n\tmargin 0\n\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary\n\tdisplay block\n\n\naudio,\ncanvas,\nprogress,\nvideo\n\tdisplay inline-block\n\tvertical-align baseline\n\n\naudio:not([controls])\n\tdisplay none\n\theight 0\n\n\na\n\tbackground-color transparent\n\n\t&:active,\n\t&:hover\n\t\toutline 0\n\n\nabbr[title]\n\tborder-bottom 1px dotted\n\n\nb,\nstrong\n\tfont-weight bold\n\n\ndfn\n\tfont-style italic\n\n\nmark\n\tbackground #ff0\n\tcolor #000\n\n\nsmall\n\tfont-size 80%\n\n\nsub,\nsup\n\tfont-size 75%\n\tline-height 0\n\tposition relative\n\tvertical-align baseline\n\n\nsup\n\ttop -0.5em\n\n\nsub\n\tbottom -0.25em\n\n\nimg\n\tborder 0\n\n\nsvg:not(:root)\n\toverflow hidden\n\n\nhr\n\tbox-sizing content-box\n\theight 0\n\n\npre\n\toverflow auto\n\n\ncode,\nkbd,\npre,\nsamp\n\tfont-family monospace, monospace\n\tfont-size 1em\n\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea\n\tcolor inherit\n\tfont inherit\n\tmargin 0\n\n\nbutton\n\toverflow visible\n\n\nbutton,\nselect\n\ttext-transform none\n\n\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"]\n\t-webkit-appearance button\n\tcursor pointer\n\n\nbutton[disabled],\nhtml input[disabled]\n\tcursor default\n\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner\n\tborder 0\n\tpadding 0\n\n\ninput\n\tline-height normal\n\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"]\n\tbox-sizing border-box\n\tpadding 0\n\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button\n\theight auto\n\n\ninput[type=\"search\"]\n\t-webkit-appearance textfield\n\tbox-sizing content-box\n\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration\n\t-webkit-appearance none\n\nlegend\n\tborder 0\n\tpadding 0\n\n\ntextarea\n\toverflow auto\n\noptgroup\n\tfont-weight bold\n\n\ntable\n\tborder-collapse collapse\n\tborder-spacing 0\n\n\ntd,\nth\n\tpadding 0\n\n\n// reset all default margins and paddings\nhtml,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo\n\tmargin 0\n\tpadding 0\n\tvertical-align baseline\n\n\n// Пользовательские стили\n\n// Предотвращаем изменение ширины сайта при появлении скролла\nbody\n\toverflow-y scroll\n\n\n// Заменяем длинный текст placeholder многоточием\ninput[placeholder],\ninput:-moz-placeholder,\ninput::-moz-placeholder,\ninput:-ms-input-placeholder\n\ttext-overflow ellipsis\n\n\n// Убираем крестик у поля ввода в inherit\ninput::-ms-clear\n\tdisplay none\n\n\n// Курсор для label + отмена выделения при клике\nlabel\n\tnoselection()\n\tcursor pointer\n\n\n// Корректное отображение изображений\nimg\n\twidth auto\\9\n\tmax-width 100%\n\theight auto\n\nli\n\tlist-style-type none\n","/* normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n}\nbody {\n  margin: 0;\n}\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline;\n}\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\na {\n  background-color: transparent;\n}\na:active,\na:hover {\n  outline: 0;\n}\nabbr[title] {\n  border-bottom: 1px dotted;\n}\nb,\nstrong {\n  font-weight: bold;\n}\ndfn {\n  font-style: italic;\n}\nmark {\n  background: #ff0;\n  color: #000;\n}\nsmall {\n  font-size: 80%;\n}\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\nsup {\n  top: -0.5em;\n}\nsub {\n  bottom: -0.25em;\n}\nimg {\n  border: 0;\n}\nsvg:not(:root) {\n  overflow: hidden;\n}\nhr {\n  box-sizing: content-box;\n  height: 0;\n}\npre {\n  overflow: auto;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  font: inherit;\n  margin: 0;\n}\nbutton {\n  overflow: visible;\n}\nbutton,\nselect {\n  text-transform: none;\n}\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer;\n}\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\ninput {\n  line-height: normal;\n}\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0;\n}\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  box-sizing: content-box;\n}\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\nlegend {\n  border: 0;\n  padding: 0;\n}\ntextarea {\n  overflow: auto;\n}\noptgroup {\n  font-weight: bold;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\ntd,\nth {\n  padding: 0;\n}\nhtml,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n  vertical-align: baseline;\n}\nbody {\n  overflow-y: scroll;\n}\ninput[placeholder],\ninput:-moz-placeholder,\ninput::-moz-placeholder,\ninput:-ms-input-placeholder {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\ninput::-ms-clear {\n  display: none;\n}\nlabel {\n  user-select: none;\n  -webkit-touch-callout: none;\n  cursor: pointer;\n}\nlabel:hover {\n  cursor: default;\n}\nimg {\n  width: auto 9;\n  max-width: 100%;\n  height: auto;\n}\nli {\n  list-style-type: none;\n}\nhtml,\nbody {\n  -webkit-tap-highlight-color: transparent;\n  height: 100%;\n}\nbody {\n  font-size: 16px;\n  line-height: 1.4;\n  font-family: \"PTSans-Regular\";\n}\na {\n  text-decoration: none;\n  transition: all 0.2s ease;\n}\na:hover {\n  transition: none;\n}\n@font-face {\n  font-family: PTSans-Regular;\n  src: url(\"../static/assets/fonts/PTSans/PTSans-Regular.ttf\");\n  font-style: normal;\n  font-weight: 400;\n}\n@font-face {\n  font-family: PTSans-Bold;\n  src: url(\"../static/assets/fonts/PTSans/PTSans-Bold.ttf\");\n  font-style: normal;\n  font-weight: 400;\n}\n@font-face {\n  font-family: PTSans-Italic;\n  src: url(\"../static/assets/fonts/PTSans/PTSans-Italic.ttf\");\n  font-style: normal;\n  font-weight: 400;\n}\n@font-face {\n  font-family: PTSans-BoldItalic;\n  src: url(\"../static/assets/fonts/PTSans/PTSans-BoldItalic.ttf\");\n  font-style: normal;\n  font-weight: 400;\n}\n.u-nobr {\n  white-space: nowrap;\n}\n.dropdown-menu {\n  color: #fff;\n  position: relative;\n  user-select: none;\n}\n.dropdown-menu--base:before {\n  content: \"\";\n  position: absolute;\n  height: 10000px;\n  width: 100%;\n  background-color: #f00;\n  background: linear-gradient(to bottom, rgba(68,68,68,0.96), rgba(68,68,68,0.96) 50%, rgba(90,90,90,0.96) 50%, rgba(90,90,90,0.96));\n  background-size: 100% 76px;\n}\n.dropdown-menu-header {\n  padding: 5px 10px;\n  padding-left: 30px;\n  position: relative;\n}\n.dropdown-menu-header--active:before {\n  transform: rotate(180deg);\n}\n.dropdown-menu-header:before {\n  content: \"\";\n  width: 30px;\n  height: 30px;\n  background-image: url(\"../static/assets/images/icons/arrow-down.svg\");\n  background-size: cover;\n  position: absolute;\n  top: 4px;\n  left: 0;\n  opacity: 0.8;\n  transition: transform ease 0.2s;\n}\n.dropdown-menu-header:hover {\n  cursor: pointer;\n}\n.dropdown-menu-elements {\n  display: none;\n  position: relative;\n  left: 25px;\n  width: calc(100% - 25px);\n}\n.dropdown-menu-elements--active {\n  display: block;\n}\na.dropdown-menu-el,\na.dropdown-menu-el:hover,\na.dropdown-menu-el:active {\n  position: relative;\n  color: #fff;\n  text-decoration: none;\n  display: block;\n  padding-left: 0;\n  margin-left: 25px;\n  white-space: nowrap;\n  font-size: 15px;\n  height: 38px;\n  display: -webkit-flex;\n  display: -ms-flex;\n  display: flex;\n  align-items: center;\n}\na.dropdown-menu-el {\n  position: relative;\n  overflow-y: auto;\n}\na.dropdown-menu-el:after {\n  position: absolute;\n  content: \"\";\n  bottom: 2px;\n  left: 10px;\n  height: 2px;\n  background-color: #fff;\n  transform: translateX(-110%);\n  transition: transform 0.6s ease;\n  width: 100%;\n}\na.dropdown-menu-el:hover {\n  cursor: pointer;\n}\na.dropdown-menu-el:hover:after {\n  transform: translateX(-10%);\n}\n.footer {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  height: 160px;\n  background-image: url(\"../static/assets/images/bg-header.png\");\n  background-size: cover;\n  background-attachment: fixed;\n  background-position: 0 0;\n  width: calc(100% - 40px);\n  display: -webkit-flex;\n  display: -ms-flex;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 20px;\n}\n.footer__text {\n  position: relative;\n  color: #fff;\n  text-align: center;\n}\n.footer:before {\n  content: \"\";\n  background-color: rgba(18,18,18,0.8);\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\n.header-tabs {\n  color: #fff;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  padding: 0px 30px;\n  width: 100%;\n  box-sizing: border-box;\n}\n@media screen and (max-width: 870px) {\n  .header-tabs {\n    top: 0;\n    display: -webkit-flex;\n    display: -ms-flex;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n}\n@media screen and (max-width: 900px) {\n  .header-tabs {\n    padding: 0 20px;\n  }\n}\n.header-elements {\n  position: relative;\n  z-index: 10;\n  display: -webkit-flex;\n  display: -ms-flex;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  max-width: 1000px;\n  margin: 0 auto;\n}\n@media screen and (max-width: 1050px) {\n  .header-elements {\n    max-width: 840px;\n  }\n}\n@media screen and (max-width: 870px) {\n  .header-elements {\n    display: none;\n  }\n  .header-elements--mobiled {\n    z-index: 20;\n    display: flex;\n    flex-direction: column;\n  }\n  .header-elements__element {\n    border-radius: 5px;\n    width: 80%;\n    margin-bottom: 8px;\n  }\n  .header-elements__element:last-child {\n    margin-bottom: 0;\n  }\n}\n.header-elements__element {\n  user-select: none;\n  text-align: center;\n  background-color: rgba(68,68,68,0.96);\n  transition: all ease 0.15s;\n  padding: 12px 20px;\n  font-size: 16px;\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n}\n@media screen and (max-width: 1050px) {\n  .header-elements__element {\n    padding: 6px 10px;\n    font-size: 15px;\n  }\n}\n.header-elements__element--active {\n  background-color: #fff;\n  color: rgba(68,68,68,0.96);\n}\n.header-elements__element:hover {\n  cursor: pointer;\n}\n@media screen and (max-width: 870px) and (max-width: 480px) {\n  .header-elements__element {\n    max-width: 70%;\n    margin-bottom: 5px;\n    font-size: 14px;\n  }\n}\n.header {\n  position: relative;\n  background-size: cover;\n  height: 300px;\n  background-image: url(\"../static/assets/images/bg-header.png\");\n  background-size: cover;\n  background-attachment: fixed;\n  background-position: 0px -300px;\n}\n.header-open-mobile-menu {\n  z-index: 25;\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  width: 36px;\n  height: 36px;\n  background-image: url(\"../static/assets/images/icons/burger.svg\");\n  background-size: cover;\n  transition: opacity 0.2s;\n  opacity: 0.8;\n  display: none;\n}\n@media screen and (max-width: 870px) {\n  .header-open-mobile-menu {\n    display: block;\n  }\n}\n.header-open-mobile-menu--close {\n  background-image: url(\"../static/assets/images/icons/close.svg\");\n  background-size: cover;\n}\n.header-open-mobile-menu:hover {\n  opacity: 1;\n  cursor: pointer;\n}\n.header-overlay {\n  z-index: 15;\n  background-color: rgba(18,18,18,0.85);\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  display: none;\n}\n.header-overlay--active {\n  display: block;\n}\n.header::after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0,0,0,0.3);\n  display: none;\n  pointer-events: none;\n}\n@media screen and (max-width: 870px) {\n  .header::after {\n    display: block;\n  }\n}\n.header-circle {\n  position: relative;\n  z-index: 10;\n  width: 240px;\n  height: 240px;\n  background-color: rgba(255,255,255,0.9);\n  border-radius: 50%;\n  position: absolute;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n@media screen and (max-width: 780px) {\n  .header-circle {\n    width: 180px;\n    height: 180px;\n  }\n}\n.header-circle__logo-mirea {\n  background-image: url(\"../static/assets/images/logo-mirea.png\");\n  background-size: cover;\n  width: 100px;\n  height: 100px;\n  position: absolute;\n  bottom: 6px;\n  left: 50%;\n  transform: translate(-50%);\n}\n@media screen and (max-width: 780px) {\n  .header-circle__logo-mirea {\n    width: 80px;\n    height: 80px;\n  }\n}\n.header-labels {\n  display: -webkit-flex;\n  display: -ms-flex;\n  display: flex;\n  justify-content: space-between;\n  padding: 16px;\n}\n.header-labels__label {\n  color: #fff;\n  transition: all ease 0.3s;\n  background-color: rgba(163,203,197,0.55);\n  font-size: 25px;\n  padding: 18px 16px;\n  text-align: center;\n  display: -webkit-flex;\n  display: -ms-flex;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-width: 360px;\n  border-radius: 5px;\n}\n@media screen and (max-width: 1120px) {\n  .header-labels__label {\n    padding: 5px 8px;\n    font-size: 16px;\n    min-width: 208px;\n    border-radius: 2px;\n    background-color: rgba(116,177,168,0.9);\n  }\n}\n@media screen and (max-width: 870px) {\n  .header-labels__label {\n    display: none;\n  }\n}\n.header-labels__label:hover {\n  cursor: pointer;\n  background-color: rgba(163,203,197,0.85);\n  color: #fff;\n  transition: all ease 0.3s;\n}\n.header-labels__label:active {\n  color: #fff;\n  cursor: pointer;\n  background-color: rgba(163,203,197,0.85);\n  transition: all ease 0.3s;\n}\n.main-professor {\n  display: -webkit-flex;\n  display: -ms-flex;\n  display: flex;\n  margin-bottom: 20px;\n}\n.main-professor__image {\n  background-image: url(\"../static/assets/images/professors/petrov.png\");\n  background-size: cover;\n  width: 160px;\n  height: 240px;\n  flex-shrink: 0;\n}\n@media screen and (max-width: 480px) {\n  .main-professor__image {\n    width: 120px;\n    height: 180px;\n  }\n}\n@media screen and (max-width: 480px) {\n  .main-professor__descr {\n    margin-bottom: 20px;\n  }\n}\n.main-professor__info {\n  display: -webkit-flex;\n  display: -ms-flex;\n  display: flex;\n  margin-left: 20px;\n  flex-direction: column;\n  justify-content: space-between;\n}\n@media screen and (max-width: 480px) {\n  .main-professor__info {\n    margin-left: 14px;\n  }\n}\n.main-professor__position-1 {\n  padding: 2px 0;\n  font-size: 14px;\n  font-family: PTSans-Italic;\n}\n.main-professor__position-2 {\n  padding: 2px 0;\n  font-size: 14px;\n}\n.main-professor__contact {\n  padding: 2px 0;\n  font-size: 14px;\n}\n.main-text {\n  font-size: 14px;\n  margin-bottom: 20px;\n  color: #444;\n}\n.stuff-persons {\n  display: -webkit-flex;\n  display: -ms-flex;\n  display: flex;\n  justify-content: space-between;\n  flex-wrap: wrap;\n}\n.stuff-person {\n  flex-basis: 33.33333%;\n  display: -webkit-flex;\n  display: -ms-flex;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin-bottom: 20px;\n  transition: all linear 0.2s;\n}\n@media screen and (max-width: 870px) {\n  .stuff-person {\n    flex-basis: 50%;\n  }\n}\n@media screen and (max-width: 480px) {\n  .stuff-person {\n    flex-basis: 100%;\n    margin-bottom: 20px;\n  }\n}\n.stuff-person__photo {\n  width: 80%;\n  height: 300px;\n  margin-bottom: 10px;\n  transition: filter ease 0.3s;\n  filter: saturate(60%);\n}\n@media screen and (max-width: 560px) {\n  .stuff-person__photo {\n    height: 260px;\n  }\n}\n@media screen and (max-width: 480px) {\n  .stuff-person__photo {\n    height: 320px;\n  }\n}\n.stuff-person__photo:hover {\n  cursor: pointer;\n  filter: saturate(100%);\n}\n.stuff-person__photo--andrianova {\n  background-image: url(\"../static/assets/images/professors/andrianova.jpg\");\n  background-size: cover;\n}\n.stuff-person__photo--petrov {\n  background-image: url(\"../static/assets/images/professors/petrov.png\");\n  background-size: cover;\n}\n.stuff-person__photo--panov {\n  background-image: url(\"../static/assets/images/professors/panov.jpg\");\n  background-size: cover;\n}\n.stuff-person__photo--nemenko {\n  background-image: url(\"../static/assets/images/professors/nemenko.jpg\");\n  background-size: cover;\n}\n.stuff-person__photo--aldobaeva {\n  background-image: url(\"../static/assets/images/professors/aldobaeva.jpg\");\n  background-size: cover;\n}\n.stuff-person__photo--bashlykova {\n  background-image: url(\"../static/assets/images/professors/bashlykova.jpg\");\n  background-size: cover;\n}\n.stuff-person__photo--tomashevskaya {\n  background-image: url(\"../static/assets/images/professors/tomashevskaya.jpg\");\n  background-size: cover;\n}\n.stuff-person__photo--trokhachenkova {\n  background-image: url(\"../static/assets/images/professors/trokhachenkova.jpg\");\n  background-size: cover;\n}\n.stuff-person__photo--bagrov {\n  background-image: url(\"../static/assets/images/professors/bagrov.jpg\");\n  background-size: cover;\n}\n.stuff-person__photo--proshaeva {\n  background-image: url(\"../static/assets/images/professors/proshaeva.jpg\");\n  background-size: cover;\n  background-position: -35px 0;\n}\n.stuff-person__photo--mirzoyan {\n  background-image: url(\"../static/assets/images/professors/mirzoyan.jpg\");\n  background-size: cover;\n  background-position: -35px 0;\n}\n.stuff-person__photo--davydov {\n  background-image: url(\"../static/assets/images/professors/davydov.jpg\");\n  background-size: cover;\n}\n.stuff-person__photo--nophoto {\n  background-image: url(\"../static/assets/images/professors/noavatar.png\");\n  background-size: cover;\n  background-size: 70% auto;\n  background-repeat: no-repeat;\n  background-position: 50% 50%;\n  background-color: #efefef;\n}\n.stuff-person__name {\n  font-family: PTSans-Bold;\n  font-size: 16px;\n  text-align: center;\n}\n.stuff-person__position-1 {\n  font-family: PTSans-Italic;\n  font-size: 16px;\n  text-align: center;\n}\n.stuff-person__position-2 {\n  font-size: 16px;\n  text-align: center;\n}\n.tabs-content-data-documents {\n  overflow: hidden;\n  border-radius: 5px;\n}\n.tabs-content-data-mto {\n  overflow-y: scroll;\n}\ntable.table-mto {\n  width: 100%;\n  min-width: 600px;\n  text-align: center;\n  border-collapse: collapse;\n}\ntable.table-mto tbody td {\n  font-size: 13px;\n}\ntable.table-mto tr {\n  transition: all ease 0.1s;\n}\ntable.table-mto tr:nth-child(even) {\n  background: #efefee;\n}\ntable.table-mto tr:hover {\n  background-color: #ddd;\n}\ntable.table-mto tr th {\n  font-weight: bold;\n  color: #fff;\n}\ntable.table-mto tr td {\n  font-size: 14px;\n  vertical-align: middle;\n  padding: 14px 10px;\n}\ntable.table-mto tr .links {\n  text-align: right;\n}\ntable.table-mto tr .links a {\n  display: inline-block;\n  background: #1c6ea4;\n  color: #fff;\n  padding: 2px 8px;\n  border-radius: 5px;\n}\ntable.table-mto td,\ntable.table-mto th {\n  border: 1px solid #aeabb3;\n  padding: 3px 2px;\n}\n.tabs-content-data-stuff {\n  max-width: 900px;\n  margin: 0 auto;\n}\n.tabs-content-element {\n  padding: 20px;\n  width: calc(100% - 40px);\n  opacity: 0;\n  pointer-events: none;\n  transition: linear 0.2s;\n  transition-property: transform, opacity;\n  color: #444;\n  padding-bottom: 20px;\n  display: none;\n}\n@media screen and (max-width: 480px) {\n  .tabs-content-element {\n    padding: 20px 14px;\n    width: calc(100% - 28px);\n  }\n}\n.tabs-content-element--active {\n  display: block;\n  pointer-events: auto;\n  animation: slidein 0.3s ease 0.1s;\n  animation-fill-mode: forwards;\n}\n.tabs-content {\n  position: relative;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.tabs-content-data {\n  padding-bottom: 200px;\n}\n@-moz-keyframes slidein {\n  from {\n    opacity: 0;\n    transform: translateX(-50px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0px);\n  }\n}\n@-webkit-keyframes slidein {\n  from {\n    opacity: 0;\n    transform: translateX(-50px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0px);\n  }\n}\n@-o-keyframes slidein {\n  from {\n    opacity: 0;\n    transform: translateX(-50px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0px);\n  }\n}\n@keyframes slidein {\n  from {\n    opacity: 0;\n    transform: translateX(-50px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0px);\n  }\n}\n.text-header {\n  font-family: PTSans-Bold;\n  color: #444;\n  font-size: 14px;\n}\n.text-header--big {\n  font-size: 16px;\n  padding: 2px 0;\n}\n.text-link {\n  display: block;\n  font-size: 14px;\n  margin-bottom: 20px;\n}\n.text-list {\n  padding: 3px 0;\n  color: #444;\n}\n.text-list__item {\n  position: relative;\n  font-size: 14px;\n  margin-left: 20px;\n  margin-bottom: 10px;\n}\n@media screen and (max-width: 480px) {\n  .text-list__item {\n    margin-left: 14px;\n  }\n}\n.text-list__item:before {\n  content: \"\";\n  position: absolute;\n  left: -19px;\n  top: 6px;\n  height: calc(100% - 12px);\n  width: 4px;\n  background-color: rgba(149,152,154,0.8);\n}\n@media screen and (max-width: 480px) {\n  .text-list__item:before {\n    left: -13px;\n    top: 3px;\n    height: calc(100% - 6px);\n  }\n}\n.text-list__item:last-child {\n  margin-bottom: 0;\n}\n.text-list--regular {\n  margin-left: 20px;\n}\n.text-list--regular .text-list__item {\n  margin-bottom: 5px;\n  list-style-type: disc;\n}\n.text-list--regular .text-list__item:before {\n  display: none;\n}\n.text-list--numeric {\n  margin-left: 20px;\n}\n.text-list--numeric .text-list__item {\n  margin-bottom: 5px;\n  list-style-type: decimal;\n}\n.text-list--numeric .text-list__item:before {\n  display: none;\n}\nbody {\n  font-size: 20px;\n}\na,\na:hover,\na:active {\n  color: #0881a9;\n  text-decoration: underline;\n}\n.content-wrapper {\n  position: relative;\n  min-height: 100%;\n}\n/*# sourceMappingURL=src/styles/main.css.map */","// grid-template-areas\ng-template-areas(areas...)\n  final = ''\n  for area in areas\n    final += '\"' + area + '\" '\n  grid-template-areas unquote(final)\n\n// Центрирование по горизонтали блока заданной ширины\ncontainer($width)\n\twidth $width\n\tmargin-left auto\n\tmargin-right auto\n\n\n// Размеры элемента\nsize($width, $height = $width)\n\twidth $width\n\theight $height\n\n\n// Центрирование по горизонтали\ncenter()\n\tmargin-right auto\n\tmargin-left auto\n\n\n// Центрирование абсолютно позиционированного элемента по вертикали\nabsolute-center()\n\tposition absolute\n\ttop 50%\n\ttransform translateY(-50%)\n\n\n// Сброс обтекания для плавающих блоков-потомков\nclearfix()\n\t&:before,\n\t&:after\n\t\tcontent \" \"\n\t\tdisplay table\n\n\t&:after\n\t\tclear both\n\n\n// Применяется к родительскому блоку, в который вложено n inline-block потомков.\n// Эти потомки будут распределены по ширине родительского блока\njustify()\n\tfont-size 1px\n\tline-height 0\n\n\tzoom 1\n\n\ttext-align justify\n\ttext-align-last justify\n\ttext-justify newspaper\n\n\t&:after\n\t\tdisplay inline-block\n\t\tvisibility hidden\n\n\t\toverflow hidden\n\n\t\twidth 100%\n\t\theight 0\n\n\t\tcontent ''\n\n\n// Применяется к inline-block элементам, вложенным в родителя с применённым justify.\n// Следует указать нужный размер шрифта в блоках, так как в justify он сбрасывается\njustify-child(font-size = 16px)\n\tdisplay inline-block\n\tvertical-align top\n\n\tfont-size font-size\n\tline-height normal\n\n\n\n// Красивое обрезание лишнего текста\ntext-overflow()\n\toverflow hidden\n\twhite-space nowrap\n\ttext-overflow ellipsis\n\n\n// Скрытие текста у блока\nhidetext()\n\tfont 0/0 a\n\ttext-shadow none\n\tcolor transparent\n\n\n// Запрет выделения текста\nnoselection()\n\tuser-select none\n\t-webkit-touch-callout none\n\n\t&:hover\n\t\tcursor default\n\n\n// Задаёт цвет плейсхолдера\nplaceholder-color(color)\n\t&:-moz-placeholder,\n\t&::-moz-placeholder\n\t\tcolor color\n\t\topacity 1\n\n\t&::-webkit-input-placeholder\n\t\tcolor color\n\n\n// Хак для включения аппаратного ускорения.\n// Поддержка браузерами: IE10+\ngpu()\n\ttransform translate3d(0, 0, 0)\n\n\n// Фоновая картинка\nimage-bg(name)\n\tbackground-image url('../static/assets/images/' + name)\n\tbackground-size cover\n\n\n// Хелперы для флексбокса\n\nflex()\n\tdisplay: flex\n\nflex-center()\n\talign-items center\n\tjustify-content center\n\n\nflexible()\n\tflex-grow 1\n\tflex-shrink 1\n\n\nunflexible()\n\tflex-grow 0\n\tflex-shrink 0\n","$fontFamily = \"PTSans-Regular\"\n\nhtml, body\n\t-webkit-tap-highlight-color transparent\n\theight 100%\n\nbody\n\tfont-size $fontSize\n\tline-height $lineHeight\n\tfont-family $fontFamily\n\na\n\ttext-decoration none\n\n\ttransition all .2s ease\n\n\t&:hover\n\t\ttransition none\n","@font-face\n\tfont-family PTSans-Regular\n\tsrc url('../static/assets/fonts/PTSans/PTSans-Regular.ttf')\n\tfont-style normal\n\tfont-weight 400\n\n@font-face\n\tfont-family PTSans-Bold\n\tsrc url('../static/assets/fonts/PTSans/PTSans-Bold.ttf')\n\tfont-style normal\n\tfont-weight 400\n\n\n@font-face\n\tfont-family PTSans-Italic\n\tsrc url('../static/assets/fonts/PTSans/PTSans-Italic.ttf')\n\tfont-style normal\n\tfont-weight 400\n\n@font-face\n\tfont-family PTSans-BoldItalic\n\tsrc url('../static/assets/fonts/PTSans/PTSans-BoldItalic.ttf')\n\tfont-style normal\n\tfont-weight 400\n",".u-nobr\n\twhite-space nowrap\n",".dropdown-menu\n\tcolor #fff\n\tposition relative\n\tuser-select none\n\n\t&--base\n\t\t&:before\n\t\t\tcontent \"\"\n\t\t\tposition absolute\n\t\t\theight 10000px\n\t\t\twidth 100%\n\t\t\tbackground-color red\n\t\t\tbackground linear-gradient(\n\t\t\t\tto bottom,\n\t\t\t\trgba(68,68,68,0.96),\n\t\t\t\trgba(68,68,68,0.96) 50%,\n\t\t\t\trgba(90,90,90,0.96) 50%,\n\t\t\t\trgba(90,90,90,0.96)\n\t\t\t)\n\t\t\tbackground-size 100% 76px\n\n.dropdown-menu-header\n\tpadding 5px 10px\n\tpadding-left 30px\n\tposition relative\n\n\n\t&--active\n\t\t&:before\n\t\t\ttransform rotate(180deg)\n\n\t&:before\n\t\tcontent \"\"\n\t\tsize(30px)\n\t\timage-bg(\"icons/arrow-down.svg\")\n\t\tposition absolute\n\t\ttop 4px\n\t\tleft 0\n\t\topacity .8\n\t\ttransition transform ease .2s\n\n\n\t&:hover\n\t\tcursor pointer\n\n.dropdown-menu-elements\n\tdisplay none\n\tposition relative\n\tleft 25px\n\twidth calc(100% - 25px)\n\n.dropdown-menu-elements--active\n\tdisplay block\n\na.dropdown-menu-el, a.dropdown-menu-el:hover, a.dropdown-menu-el:active\n\tposition relative\n\tcolor #fff\n\ttext-decoration none\n\tdisplay block\n\tpadding-left 0\n\tmargin-left 25px\n\twhite-space nowrap\n\tfont-size 15px\n\theight 38px\n\tdisplay -webkit-flex\n\tdisplay -ms-flex\n\tdisplay flex\n\talign-items center\n\na.dropdown-menu-el\n\tposition relative\n\toverflow-y auto\n\t&:after\n\t\tposition absolute\n\t\tcontent \"\"\n\t\tbottom 2px\n\t\tleft 10px\n\t\theight 2px\n\t\tbackground-color #fff\n\t\ttransform translateX(-110%)\n\t\ttransition transform .6s ease\n\t\twidth 100%\n\na.dropdown-menu-el:hover\n\tcursor pointer\n\t&:after\n\t\ttransform translateX(-10%)\n",".footer\n\tposition absolute\n\tbottom 0\n\tleft 0\n\theight 160px\n\timage-bg(\"bg-header.png\")\n\tbackground-attachment fixed\n\tbackground-position 0 0\n\twidth calc(100% - 40px)\n\tdisplay -webkit-flex\n\tdisplay -ms-flex\n\tdisplay flex\n\tjustify-content center\n\talign-items center\n\tpadding 20px\n\n\t&__text\n\t\tposition relative\n\t\tcolor #fff\n\t\ttext-align center\n\n\t&:before\n\t\tcontent \"\"\n\t\tbackground-color rgba(18, 18, 18, 0.8)\n\t\tposition absolute\n\t\ttop 0\n\t\tleft 0\n\t\theight 100%\n\t\twidth 100%\n",".header-tabs\n\tcolor #fff\n\tposition absolute\n\tbottom 0\n\tleft 0\n\tpadding 0px 30px\n\twidth 100%\n\tbox-sizing border-box\n\n\t@media screen and (max-width: 870px)\n\t\ttop 0\n\t\tdisplay -webkit-flex\n\t\tdisplay -ms-flex\n\t\tdisplay flex\n\t\talign-items center\n\t\tjustify-content center\n\n\t@media screen and (max-width: 900px)\n\t\tpadding 0 20px\n\n.header-elements\n\tposition relative\n\tz-index 10\n\tdisplay -webkit-flex\n\tdisplay -ms-flex\n\tdisplay flex\n\tjustify-content space-between\n\talign-items center\n\tmax-width 1000px\n\tmargin 0 auto\n\n\t@media screen and (max-width: 1050px)\n\t\tmax-width 840px\n\n\t@media screen and (max-width: 870px)\n\t\tdisplay none\n\n\t\t&--mobiled\n\t\t\tz-index 20\n\t\t\tdisplay flex\n\t\t\tflex-direction column\n\n\t\t&__element\n\t\t\tborder-radius 5px\n\t\t\twidth 80%\n\t\t\tmargin-bottom 8px\n\n\n\t\t\t&:last-child\n\t\t\t\tmargin-bottom 0\n\n\t\t@media screen and (max-width: 480px)\n\t\t\t&__element\n\t\t\t\tmax-width 70%\n\t\t\t\tmargin-bottom 5px\n\t\t\t\tfont-size 14px\n\n\n\t&__element\n\t\tuser-select none\n\t\ttext-align center\n\t\tbackground-color alpha($mainDarkColor, .96)\n\t\ttransition all ease .15s\n\t\tpadding 12px 20px\n\t\tfont-size 16px\n\t\tborder-top-left-radius 5px\n\t\tborder-top-right-radius 5px\n\n\t\t@media screen and (max-width: 1050px)\n\t\t\tpadding 6px 10px\n\t\t\tfont-size 15px\n\n\t\t&--active\n\t\t\tbackground-color #fff\n\t\t\tcolor alpha($mainDarkColor, .96)\n\n\t\t&:hover\n\t\t\tcursor pointer\n","$headerLabelColor = alpha(#A3CBC5, .55)\n$headerLabelMinColor = darken(alpha(#A3CBC5, .9), 20%)\n$headerActiveLabelColor = alpha(#A3CBC5, .85)\n\n.header\n\tposition relative\n\tbackground-size cover\n\theight 300px\n\timage-bg(\"bg-header.png\")\n\tbackground-attachment fixed\n\tbackground-position 0px -300px\n\n\t&-open-mobile-menu\n\t\tz-index 25\n\t\tposition absolute\n\t\ttop 10px\n\t\tleft 10px\n\t\tsize(36px)\n\t\timage-bg(\"icons/burger.svg\")\n\t\ttransition opacity .2s\n\t\topacity .8\n\t\tdisplay none\n\n\t\t@media screen and (max-width: 870px)\n\t\t\tdisplay block\n\n\t\t&--close\n\t\t\timage-bg(\"icons/close.svg\")\n\n\t\t&:hover\n\t\t\topacity 1\n\t\t\tcursor pointer\n\n\t&-overlay\n\t\tz-index 15\n\t\tbackground-color hsla(0, 0%, 7%, .85)\n\t\tposition absolute\n\t\ttop 0\n\t\tleft 0\n\t\theight 100%\n\t\twidth 100%\n\t\tdisplay none\n\n\t\t&--active\n\t\t\tdisplay block\n\n\t&::after\n\t\tcontent \"\"\n\t\tposition absolute\n\t\ttop 0\n\t\tleft 0\n\t\twidth 100%\n\t\theight 100%\n\t\tbackground-color alpha(#000, .3)\n\t\tdisplay none\n\t\tpointer-events none\n\n\t@media screen and (max-width: 870px)\n\t\t&::after\n\t\t\tdisplay block\n\n\t&-circle\n\t\tposition relative\n\t\tz-index 10\n\t\tsize(240px)\n\t\tbackground-color alpha(#fff, .9)\n\t\tborder-radius 50%\n\t\tposition absolute\n\t\tleft 50%\n\t\ttransform translate(-50%, -50%)\n\n\t\t@media screen and (max-width: 780px)\n\t\t\tsize(180px)\n\n\t\t&__logo-mirea\n\t\t\timage-bg(\"logo-mirea.png\")\n\t\t\tsize(100px)\n\t\t\tposition absolute\n\t\t\tbottom 6px\n\t\t\tleft 50%\n\t\t\ttransform translate(-50%)\n\n\t\t\t@media screen and (max-width: 780px)\n\t\t\t\tsize(80px)\n\n\n\t&-labels\n\t\tdisplay -webkit-flex\n\t\tdisplay -ms-flex\n\t\tdisplay flex\n\t\tjustify-content space-between\n\t\tpadding 16px\n\n\t\t&__label\n\t\t\tcolor #fff\n\t\t\ttransition all ease .3s\n\t\t\tbackground-color $headerLabelColor\n\t\t\tfont-size 25px\n\t\t\tpadding 18px 16px\n\t\t\ttext-align center\n\t\t\tdisplay -webkit-flex\n\t\t\tdisplay -ms-flex\n\t\t\tdisplay flex\n\t\t\tjustify-content center\n\t\t\talign-items center\n\t\t\tmin-width 360px\n\t\t\tborder-radius 5px\n\n\t\t\t@media screen and (max-width: 1120px)\n\t\t\t\tpadding 5px 8px\n\t\t\t\tfont-size 16px\n\t\t\t\tmin-width 208px\n\t\t\t\tborder-radius 2px\n\t\t\t\tbackground-color $headerLabelMinColor\n\n\t\t\t@media screen and (max-width: 870px)\n\t\t\t\tdisplay none\n\n\t\t\t&:hover\n\t\t\t\tcursor pointer\n\t\t\t\tbackground-color $headerActiveLabelColor\n\t\t\t\tcolor #fff\n\t\t\t\ttransition all ease .3s\n\n\t\t\t&:active\n\t\t\t\tcolor #fff\n\t\t\t\tcursor pointer\n\t\t\t\tbackground-color $headerActiveLabelColor\n\t\t\t\ttransition all ease .3s\n","$coeff = .8\n$coeffM= .6\n\n.main-professor\n\tdisplay -webkit-flex\n\tdisplay -ms-flex\n\tdisplay flex\n\tmargin-bottom 20px\n\n\t&__image\n\t\timage-bg(\"professors/petrov.png\")\n\t\tsize(200px * $coeff, 300px * $coeff)\n\t\tflex-shrink 0\n\n\t\t@media screen and (max-width: 480px)\n\t\t\tsize(200px * $coeffM, 300px * $coeffM)\n\n\t&__descr\n\t\t@media screen and (max-width: 480px)\n\t\t\tmargin-bottom 20px\n\n\t&__info\n\t\tdisplay -webkit-flex\n\t\tdisplay -ms-flex\n\t\tdisplay flex\n\t\tmargin-left 20px\n\t\tflex-direction column\n\t\tjustify-content space-between\n\n\t\t@media screen and (max-width: 480px)\n\t\t\tmargin-left 14px\n\n\t&__position-1\n\t\tpadding 2px 0\n\t\tfont-size 14px\n\t\tfont-family PTSans-Italic\n\n\t&__position-2\n\t\tpadding 2px 0\n\t\tfont-size 14px\n\n\t&__contact\n\t\tpadding 2px 0\n\t\tfont-size 14px\n",".main-text\n\tfont-size 14px\n\tmargin-bottom 20px\n\tcolor $mainDarkColor\n",".stuff-persons\n\tdisplay -webkit-flex\n\tdisplay -ms-flex\n\tdisplay flex\n\tjustify-content space-between\n\tflex-wrap wrap\n\n.stuff-person\n\tflex-basis 33.33333%\n\tdisplay -webkit-flex\n\tdisplay -ms-flex\n\tdisplay flex\n\tflex-direction column\n\talign-items center\n\tmargin-bottom 20px\n\ttransition all linear .2s\n\n\t@media screen and (max-width: 870px)\n\t\tflex-basis 50%\n\n\t@media screen and (max-width: 480px)\n\t\tflex-basis 100%\n\t\tmargin-bottom 20px\n\n\t&__photo\n\t\twidth 80%\n\t\theight 300px\n\t\tmargin-bottom 10px\n\t\ttransition filter ease .3s\n\t\tfilter saturate(60%)\n\n\t\t@media screen and (max-width: 560px)\n\t\t\theight 260px\n\n\t\t@media screen and (max-width: 480px)\n\t\t\theight 320px\n\n\n\t\t&:hover\n\t\t\tcursor pointer\n\t\t\tfilter saturate(100%)\n\n\t\t&--andrianova\n\t\t\timage-bg(\"professors/andrianova.jpg\")\n\n\t\t&--petrov\n\t\t\timage-bg(\"professors/petrov.png\")\n\n\t\t&--panov\n\t\t\timage-bg(\"professors/panov.jpg\")\n\n\t\t&--nemenko\n\t\t\timage-bg(\"professors/nemenko.jpg\")\n\n\t\t&--aldobaeva\n\t\t\timage-bg(\"professors/aldobaeva.jpg\")\n\n\t\t&--bashlykova\n\t\t\timage-bg(\"professors/bashlykova.jpg\")\n\n\t\t&--tomashevskaya\n\t\t\timage-bg(\"professors/tomashevskaya.jpg\")\n\n\t\t&--trokhachenkova\n\t\t\timage-bg(\"professors/trokhachenkova.jpg\")\n\n\t\t&--bagrov\n\t\t\timage-bg(\"professors/bagrov.jpg\")\n\n\t\t&--proshaeva\n\t\t\timage-bg(\"professors/proshaeva.jpg\")\n\t\t\tbackground-position -35px 0\n\n\t\t&--mirzoyan\n\t\t\timage-bg(\"professors/mirzoyan.jpg\")\n\t\t\tbackground-position -35px 0\n\n\t\t&--davydov\n\t\t\timage-bg(\"professors/davydov.jpg\")\n\n\t\t&--nophoto\n\t\t\timage-bg(\"professors/noavatar.png\")\n\n\t\t\tbackground-size 70% auto\n\t\t\tbackground-repeat no-repeat\n\t\t\tbackground-position 50% 50%\n\t\t\tbackground-color #efefef\n\n\t&__name\n\t\tfont-family PTSans-Bold\n\t\tfont-size 16px\n\t\ttext-align center\n\n\t&__position-1\n\t\tfont-family PTSans-Italic\n\t\tfont-size 16px\n\t\ttext-align center\n\n\t&__position-2\n\t\tfont-size 16px\n\t\ttext-align center\n",".tabs-content-data-documents\n\toverflow hidden\n\tborder-radius 5px\n",".tabs-content-data-mto\n\toverflow-y scroll\n\ntable\n\t&.table-mto\n\t\twidth 100%\n\t\tmin-width 600px\n\t\ttext-align center\n\t\tborder-collapse collapse\n\t\ttbody\n\t\t\ttd\n\t\t\t\tfont-size 13px\n\t\ttr\n\t\t\ttransition all ease .1s\n\t\t\t&:nth-child(even)\n\t\t\t\tbackground #efefee\n\t\t\t&:hover\n\t\t\t\tbackground-color #ddd\n\t\t\tth\n\t\t\t\tfont-weight bold\n\t\t\t\tcolor #FFFFFF\n\t\t\ttd\n\t\t\t\tfont-size 14px\n\t\t\t\tvertical-align middle\n\t\t\t\tpadding 14px 10px\n\t\t\t.links\n\t\t\t\ttext-align right\n\t\t\t\ta\n\t\t\t\t\tdisplay inline-block\n\t\t\t\t\tbackground #1C6EA4\n\t\t\t\t\tcolor #FFFFFF\n\t\t\t\t\tpadding 2px 8px\n\t\t\t\t\tborder-radius 5px\n\ntable.table-mto td, table.table-mto th\n\tborder 1px solid #AEABB3\n\tpadding 3px 2px\n",".tabs-content-data-stuff\n\tmax-width 900px\n\tmargin 0 auto\n",".tabs-content-element\n\tpadding 20px\n\twidth calc(100% - 40px)\n\topacity 0\n\tpointer-events none\n\ttransition linear .2s\n\ttransition-property transform, opacity\n\tcolor $mainDarkColor\n\tpadding-bottom 20px\n\tdisplay none\n\n\t@media screen and (max-width: 480px)\n\t\tpadding 20px 14px\n\t\twidth calc(100% - 28px)\n\n\t&--active\n\t\tdisplay block\n\t\tpointer-events auto\n\t\tanimation slidein .3s ease .1s\n\t\tanimation-fill-mode forwards\n\n.tabs-content\n\tposition relative\n\tmax-width 1200px\n\tmargin 0 auto\n\n.tabs-content-data\n\tpadding-bottom 200px\n\n\n@keyframes slidein\n\tfrom\n\t\topacity 0\n\t\ttransform translateX(-50px)\n\tto\n\t\topacity 1\n\t\ttransform translateX(0px)\n",".text-header\n\tfont-family PTSans-Bold\n\tcolor $mainDarkColor\n\tfont-size 14px\n\n\t&--big\n\t\tfont-size 16px\n\t\tpadding 2px 0\n",".text-link\n\tdisplay block\n\tfont-size 14px\n\tmargin-bottom 20px\n","$textlistItemPadding = 3px\n\n.text-list\n\tpadding $textlistItemPadding 0\n\tcolor $mainDarkColor\n\n\n\t&__item\n\t\tposition relative\n\t\tfont-size 14px\n\t\tmargin-left 20px\n\t\tmargin-bottom 10px\n\n\t\t@media screen and (max-width: 480px)\n\t\t\tmargin-left 14px\n\n\t\t&:before\n\t\t\tcontent \"\"\n\t\t\tposition absolute\n\t\t\tleft -19px\n\t\t\ttop 6px\n\t\t\theight calc(100% - 12px)\n\t\t\twidth 4px\n\t\t\tbackground-color alpha(#95989A, .8)\n\n\t\t\t@media screen and (max-width: 480px)\n\t\t\t\tleft -13px\n\t\t\t\ttop 3px\n\t\t\t\theight calc(100% - 6px)\n\n\t\t&:last-child\n\t\t\tmargin-bottom 0\n\n\n.text-list--regular\n\tmargin-left 20px\n\n.text-list--regular .text-list__item\n\tmargin-bottom 5px\n\tlist-style-type disc\n\n\t&:before\n\t\tdisplay none\n\n.text-list--numeric\n\tmargin-left 20px\n\n.text-list--numeric .text-list__item\n\tmargin-bottom 5px\n\tlist-style-type decimal\n\n\t&:before\n\t\tdisplay none\n","@import '_variables'\n@import '_mixins'\n\n@import 'base/reset'\n@import 'base/core'\n@import 'base/fonts'\n@import 'base/utilities'\n\n@import '../blocks/**/**'\n\nbody\n\tfont-size 20px\n\na, a:hover, a:active\n\tcolor $linkColor\n\ttext-decoration underline\n\n.content-wrapper\n\tposition relative\n\tmin-height 100%\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/infinite-tree/dist/infinite-tree.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, ".infinite-tree-scroll{overflow:auto;max-height:400px}.infinite-tree-table{width:100%}.infinite-tree-content{outline:0;position:relative}.infinite-tree-content .infinite-tree-selected.infinite-tree-item,.infinite-tree-content .infinite-tree-selected.infinite-tree-item:hover{background:#deecfd;border:1px solid #06c}.infinite-tree-content .infinite-tree-item{border:1px solid transparent;cursor:default}.infinite-tree-content .infinite-tree-item:hover{background:#f2fdff}.infinite-tree-content .infinite-tree-item:disabled,.infinite-tree-content .infinite-tree-item[disabled]{cursor:not-allowed;opacity:.5;-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)\";filter:alpha(opacity=50)}.infinite-tree-content .infinite-tree-node{position:relative}.infinite-tree-content .infinite-tree-toggler{color:#666;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.infinite-tree-content .infinite-tree-toggler:hover{color:#333;text-decoration:none}.infinite-tree-content .infinite-tree-title{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.infinite-tree-no-data{text-align:center}", "", {"version":3,"sources":["/home/aspiretocode/Рабочий стол/practics/node_modules/infinite-tree/dist/infinite-tree.css"],"names":[],"mappings":"AAAA,sBACE,cAAe,AACf,gBAAkB,CACnB,AACD,qBACE,UAAY,CACb,AACD,uBACE,UAAW,AACX,iBAAmB,CACpB,AACD,0IAEE,mBAAoB,AACpB,qBAAuB,CACxB,AACD,2CACE,6BAA8B,AAC9B,cAAgB,CACjB,AACD,iDACE,kBAAoB,CACrB,AACD,yGAEE,mBAAoB,AACpB,WAAa,AACb,iEAAkE,AAClE,wBAA0B,CAC3B,AACD,2CACE,iBAAmB,CACpB,AACD,8CACE,WAAY,AACZ,yBAA0B,AAC1B,sBAAuB,AACvB,qBAAsB,AACtB,gBAAkB,CACnB,AACD,oDACE,WAAY,AACZ,oBAAsB,CACvB,AACD,4CACE,eAAgB,AAChB,yBAA0B,AAC1B,sBAAuB,AACvB,qBAAsB,AACtB,gBAAkB,CACnB,AACD,uBACE,iBAAmB,CACpB","file":"infinite-tree.css","sourcesContent":[".infinite-tree-scroll {\n  overflow: auto;\n  max-height: 400px; /* Change the height to suit your needs. */\n}\n.infinite-tree-table {\n  width: 100%;\n}\n.infinite-tree-content {\n  outline: 0;\n  position: relative;\n}\n.infinite-tree-content .infinite-tree-selected.infinite-tree-item,\n.infinite-tree-content .infinite-tree-selected.infinite-tree-item:hover {\n  background: #deecfd;\n  border: 1px solid #06c;\n}\n.infinite-tree-content .infinite-tree-item {\n  border: 1px solid transparent;\n  cursor: default;\n}\n.infinite-tree-content .infinite-tree-item:hover {\n  background: #f2fdff;\n}\n.infinite-tree-content .infinite-tree-item:disabled,\n.infinite-tree-content .infinite-tree-item[disabled] {\n  cursor: not-allowed;\n  opacity: 0.5;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)\";\n  filter: alpha(opacity=50);\n}\n.infinite-tree-content .infinite-tree-node {\n  position: relative;\n}\n.infinite-tree-content .infinite-tree-toggler {\n  color: #666;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.infinite-tree-content .infinite-tree-toggler:hover {\n  color: #333;\n  text-decoration: none;\n}\n.infinite-tree-content .infinite-tree-title {\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.infinite-tree-no-data {\n  text-align: center;\n}\n\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/node-libs-browser/node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "../node_modules/element-class/index.js":
/***/ (function(module, exports) {

module.exports = function(opts) {
  return new ElementClass(opts)
}

function indexOf(arr, prop) {
  if (arr.indexOf) return arr.indexOf(prop)
  for (var i = 0, len = arr.length; i < len; i++)
    if (arr[i] === prop) return i
  return -1
}

function ElementClass(opts) {
  if (!(this instanceof ElementClass)) return new ElementClass(opts)
  var self = this
  if (!opts) opts = {}

  // similar doing instanceof HTMLElement but works in IE8
  if (opts.nodeType) opts = {el: opts}

  this.opts = opts
  this.el = opts.el || document.body
  if (typeof this.el !== 'object') this.el = document.querySelector(this.el)
}

ElementClass.prototype.add = function(className) {
  var el = this.el
  if (!el) return
  if (el.className === "") return el.className = className
  var classes = el.className.split(' ')
  if (indexOf(classes, className) > -1) return classes
  classes.push(className)
  el.className = classes.join(' ')
  return classes
}

ElementClass.prototype.remove = function(className) {
  var el = this.el
  if (!el) return
  if (el.className === "") return
  var classes = el.className.split(' ')
  var idx = indexOf(classes, className)
  if (idx > -1) classes.splice(idx, 1)
  el.className = classes.join(' ')
  return classes
}

ElementClass.prototype.has = function(className) {
  var el = this.el
  if (!el) return
  var classes = el.className.split(' ')
  return indexOf(classes, className) > -1
}

ElementClass.prototype.toggle = function(className) {
  var el = this.el
  if (!el) return
  if (this.has(className)) this.remove(className)
  else this.add(className)
}


/***/ }),

/***/ "../node_modules/escape-html/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */



/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Module exports.
 * @public
 */

module.exports = escapeHtml;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}


/***/ }),

/***/ "../node_modules/events/events.js":
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ "../node_modules/flattree/lib/extend.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
/* eslint no-restricted-syntax: 0 */
var extend = function extend(target) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
    }

    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    for (var index = 0; index < sources.length; index++) {
        var source = sources[index];
        if (source !== undefined && source !== null) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    output[key] = source[key];
                }
            }
        }
    }
    return output;
};

exports['default'] = extend;

/***/ }),

/***/ "../node_modules/flattree/lib/flatten.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extend = __webpack_require__("../node_modules/flattree/lib/extend.js");

var _extend2 = _interopRequireDefault(_extend);

var _node = __webpack_require__("../node_modules/flattree/lib/node.js");

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// @param {object|array} nodes The tree nodes
// @param {object} [options] The options object
// @param {boolean} [options.openAllNodes] True to open all nodes. Defaults to false.
// @param {array} [options.openNodes] An array that contains the ids of open nodes
// @return {array}
/* eslint no-console: 0 */
var flatten = function flatten() {
    var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    nodes = [].concat(nodes);

    var flatten = [];
    var stack = [];
    var pool = {
        lastChild: {}
    };

    options.openAllNodes = !!options.openAllNodes;
    options.openNodes = options.openNodes || [];
    options.throwOnError = !!options.throwOnError;

    {
        // root node
        var firstNode = nodes.length > 0 ? nodes[0] : null;
        var parentNode = firstNode ? firstNode.parent : null;
        if (parentNode && !(parentNode instanceof _node2['default'])) {
            parentNode = new _node2['default'](parentNode);
        }
        var rootNode = parentNode || new _node2['default']({ // defaults
            parent: null,
            children: nodes,
            state: {
                depth: -1,
                open: true, // always open
                path: '',
                prefixMask: '',
                total: 0
            }
        });

        if (rootNode === parentNode) {
            var subtotal = rootNode.state.total || 0;

            // Traversing up through its ancestors
            var p = rootNode;
            while (p) {
                var _p$state = p.state,
                    path = _p$state.path,
                    _p$state$total = _p$state.total,
                    total = _p$state$total === undefined ? 0 : _p$state$total;

                // Rebuild the lastChild pool

                if (p.isLastChild() && path) {
                    pool.lastChild[path] = true;
                }

                // Subtract the number 'subtotal' from the total of the root node and all its ancestors
                p.state.total = total - subtotal;
                if (p.state.total < 0) {
                    if (options.throwOnError) {
                        throw new Error('The node might have been corrupted: id=' + JSON.stringify(p.id) + ', state=' + JSON.stringify(p.state));
                    } else {
                        console && console.log('Error: The node might have been corrupted: id=%s, parent=%s, children=%s, state=%s', JSON.stringify(p.id), p.parent, p.children, JSON.stringify(p.state));
                    }
                }

                p = p.parent;
            }
        }

        stack.push([rootNode, rootNode.state.depth, 0]);
    }

    while (stack.length > 0) {
        var _stack$pop = stack.pop(),
            current = _stack$pop[0],
            depth = _stack$pop[1],
            index = _stack$pop[2];

        var _loop = function _loop() {
            var node = current.children[index];
            if (!(node instanceof _node2['default'])) {
                node = new _node2['default'](node);
            }
            node.parent = current;
            node.children = node.children || [];

            // Ensure parent.children[index] is equal to the current node
            node.parent.children[index] = node;

            var path = current.state.path + '.' + index;
            var open = node.hasChildren() && function () {
                var openAllNodes = options.openAllNodes,
                    openNodes = options.openNodes;

                if (openAllNodes) {
                    return true;
                }
                // determine by node object
                if (openNodes.indexOf(node) >= 0) {
                    return true;
                }
                // determine by node id
                if (openNodes.indexOf(node.id) >= 0) {
                    return true;
                }
                return false;
            }();
            var prefixMask = function (prefix) {
                var mask = '';
                while (prefix.length > 0) {
                    prefix = prefix.replace(/\.\d+$/, '');
                    if (!prefix || pool.lastChild[prefix]) {
                        mask = '0' + mask;
                    } else {
                        mask = '1' + mask;
                    }
                }
                return mask;
            }(path);

            if (node.isLastChild()) {
                pool.lastChild[path] = true;
            }

            // This allows you to put extra information to node.state
            node.state = (0, _extend2['default'])({}, node.state, {
                depth: depth + 1,
                open: open,
                path: path,
                prefixMask: prefixMask,
                total: 0
            });

            var parentDidOpen = true;

            {
                // Check the open state from its ancestors
                var _p = node;
                while (_p.parent !== null) {
                    if (_p.parent.state.open === false) {
                        parentDidOpen = false;
                        break;
                    }
                    _p = _p.parent;
                }
            }

            if (parentDidOpen) {
                // Push the node to flatten list only if all of its parent nodes have the open state set to true
                flatten.push(node);

                // Update the total number of visible child nodes
                var _p2 = node;
                while (_p2.parent !== null) {
                    _p2.parent.state.total++;
                    _p2 = _p2.parent;
                }
            }

            ++index;

            if (node.hasChildren()) {
                // Push back parent node to the stack that will be able to continue
                // the next iteration once all the child nodes of the current node
                // have been completely explored.
                stack.push([current, depth, index]);

                index = 0;
                depth = depth + 1;
                current = node;
            }
        };

        while (index < current.children.length) {
            _loop();
        }
    }

    return flatten;
};

exports['default'] = flatten;

/***/ }),

/***/ "../node_modules/flattree/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Node = exports.flatten = undefined;

var _flatten = __webpack_require__("../node_modules/flattree/lib/flatten.js");

var _flatten2 = _interopRequireDefault(_flatten);

var _node = __webpack_require__("../node_modules/flattree/lib/node.js");

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// IE8 compatibility output
exports.flatten = _flatten2['default'];
exports.Node = _node2['default'];

/***/ }),

/***/ "../node_modules/flattree/lib/node.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extend = __webpack_require__("../node_modules/flattree/lib/extend.js");

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
    function Node(node) {
        _classCallCheck(this, Node);

        this.id = null;
        this.parent = null;
        this.children = [];
        this.state = {};

        (0, _extend2['default'])(this, node);

        this.children = this.children || [];
    }
    // Returns a boolean value indicating whether a node is a descendant of a given node or not.
    // @param {object} node Specifies the node that may be contained by (a descendant of) a specified node.
    // @return {boolean} Returns true if a node is a descendant of a specified node, otherwise false. A descendant can be a child, grandchild, great-grandchild, and so on.


    Node.prototype.contains = function contains(node) {
        while (node instanceof Node && node !== this) {
            if (node.parent === this) {
                return true;
            }
            node = node.parent;
        }
        return false;
    };
    // Gets a child node at the specified index.
    // @param {number} The index of the child node.
    // @return {object} Returns an object that defines the node, null otherwise.


    Node.prototype.getChildAt = function getChildAt(index) {
        var node = null;
        if (this.children.length > 0 && index >= 0 && index < this.children.length) {
            node = this.children[index];
        }
        return node;
    };
    // Gets the child nodes.
    // @return {array} Returns an array of objects that define the nodes.


    Node.prototype.getChildren = function getChildren() {
        return this.children;
    };
    // Gets the first child node.
    // @return {object} Returns an object that defines the node, null otherwise.


    Node.prototype.getFirstChild = function getFirstChild() {
        var node = null;
        if (this.children.length > 0) {
            node = this.children[0];
        }
        return node;
    };
    // Gets the last child node.
    // @return {object} Returns an object that defines the node, null otherwise.


    Node.prototype.getLastChild = function getLastChild() {
        var node = null;
        if (this.children.length > 0) {
            node = this.children[this.children.length - 1];
        }
        return node;
    };
    // Gets the next sibling node.
    // @return {object} Returns an object that defines the node, null otherwise.


    Node.prototype.getNextSibling = function getNextSibling() {
        var node = null;
        if (this.parent) {
            var index = this.parent.children.indexOf(this);
            if (index >= 0 && index < this.parent.children.length - 1) {
                node = this.parent.children[index + 1];
            }
        }
        return node;
    };
    // Gets the parent node.
    // @return {object} Returns an object that defines the node, null otherwise.


    Node.prototype.getParent = function getParent() {
        return this.parent;
    };
    // Gets the previous sibling node.
    // @return {object} Returns an object that defines the node, null otherwise.


    Node.prototype.getPreviousSibling = function getPreviousSibling() {
        var node = null;
        if (this.parent) {
            var index = this.parent.children.indexOf(this);
            if (index > 0 && index < this.parent.children.length) {
                node = this.parent.children[index - 1];
            }
        }
        return node;
    };
    // Checks whether this node has children.
    // @return {boolean} Returns true if the node has children, false otherwise.


    Node.prototype.hasChildren = function hasChildren() {
        return this.children.length > 0;
    };
    // Checks whether this node is the last child of its parent.
    // @return {boolean} Returns true if the node is the last child of its parent, false otherwise.


    Node.prototype.isLastChild = function isLastChild() {
        var hasNextSibling = this.getNextSibling();
        return !hasNextSibling;
    };

    return Node;
}();

exports['default'] = Node;

/***/ }),

/***/ "../node_modules/get-viewport-size/index.js":
/***/ (function(module, exports) {

/**
 * Get the height of the viewport.
 *
 * @return {Integer}
 * @private
 */

function getHeight() {
  return window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight
}

/**
 * Get the width of the viewport.
 *
 * @return {Integer}
 * @private
 */

function getWidth() {
  return window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth
}

/**
 * Get the size of the viewport.
 *
 * @return {Object.<Number>}
 */

function viewportSize() {
  return {
    height: getHeight(),
    width: getWidth()
  }
}

/**
 * Exports
 */

module.exports = viewportSize


/***/ }),

/***/ "../node_modules/html5-tag/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _escapeHtml = __webpack_require__("../node_modules/escape-html/index.js");

var _escapeHtml2 = _interopRequireDefault(_escapeHtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://www.w3.org/TR/html5/syntax.html#void-elements
// Void elements only have a start tag; end tags must not be specified for void elements.
var voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

// @param {string} [tag] The tag name. Defaults to 'div'.
// @param {object} attrs HTML attributes.
// @param {string} [text] The content string.
module.exports = function (tag, attrs, text) {
    if ((typeof tag === 'undefined' ? 'undefined' : _typeof(tag)) === 'object') {
        text = attrs;
        attrs = tag;
        tag = 'div';
    }

    var voidElement = voidElements.indexOf(('' + tag).toLowerCase()) >= 0;
    var html = '<' + tag;

    attrs = _extends({}, attrs);
    Object.keys(attrs).forEach(function (name) {
        var value = attrs[name];
        if (typeof value === 'string') {
            value = (0, _escapeHtml2.default)('' + value);
            html += ' ' + name + '="' + value + '"';
        } else if (!!value) {
            html += ' ' + name;
        }
    });

    if (voidElement) {
        html += '>';
    } else if (text !== undefined) {
        html += '>' + text + '</' + tag + '>';
    } else {
        html += '/>';
    }

    return html;
};

/***/ }),

/***/ "../node_modules/ieee754/index.js":
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "../node_modules/infinite-tree/dist/infinite-tree.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/infinite-tree/dist/infinite-tree.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/infinite-tree/dist/infinite-tree.css", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/infinite-tree/dist/infinite-tree.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "../node_modules/infinite-tree/lib/browser.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
// https://gist.github.com/padolsey/527683#comment-786682
var getIEVersion = exports.getIEVersion = function getIEVersion() {
    var div = document.createElement('div');
    var all = div.getElementsByTagName('i') || [];

    var v = 3;
    do {
        ++v;
        div.innerHTML = '<!--[if gt IE ' + v + ']><i></i><![endif]-->';
    } while (all[0]);

    return v > 4 ? v : document.documentMode;
};

/***/ }),

/***/ "../node_modules/infinite-tree/lib/clusterize.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _events = __webpack_require__("../node_modules/events/events.js");

var _ensureArray = __webpack_require__("../node_modules/infinite-tree/lib/ensure-array.js");

var _ensureArray2 = _interopRequireDefault(_ensureArray);

var _browser = __webpack_require__("../node_modules/infinite-tree/lib/browser.js");

var _dom = __webpack_require__("../node_modules/infinite-tree/lib/dom.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ie = (0, _browser.getIEVersion)();

var Clusterize = function (_EventEmitter) {
    _inherits(Clusterize, _EventEmitter);

    function Clusterize(options) {
        _classCallCheck(this, Clusterize);

        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

        _this.options = {
            rowsInBlock: 50,
            blocksInCluster: 4,
            tag: null,
            emptyClass: '',
            emptyText: '',
            keepParity: true
        };
        _this.state = {
            lastClusterIndex: -1,
            itemHeight: 0,
            blockHeight: 0,
            clusterHeight: 0
        };
        _this.scrollElement = null;
        _this.contentElement = null;
        _this.rows = [];
        _this.cache = {};

        _this.scrollEventListener = function () {
            var debounce = null;

            return function () {
                var isMac = navigator.platform.toLowerCase().indexOf('mac') >= 0;
                if (isMac) {
                    if (_this.contentElement.style.pointerEvents !== 'none') {
                        _this.contentElement.style.pointerEvents = 'none';
                    }

                    if (debounce) {
                        clearTimeout(debounce);
                        debounce = null;
                    }

                    debounce = setTimeout(function () {
                        debounce = null;
                        _this.contentElement.style.pointerEvents = 'auto';
                    }, 50);
                }

                var clusterIndex = _this.getCurrentClusterIndex();
                if (_this.state.lastClusterIndex !== clusterIndex) {
                    _this.changeDOM();
                }
                _this.state.lastClusterIndex = clusterIndex;
            };
        }();

        _this.resizeEventListener = function () {
            var debounce = null;

            return function () {
                if (debounce) {
                    clearTimeout(debounce);
                    debounce = null;
                }
                debounce = setTimeout(function () {
                    var prevItemHeight = _this.state.itemHeight;
                    var current = _this.computeHeight();

                    if (current.itemHeight > 0 && prevItemHeight !== current.itemHeight) {
                        _this.state = _extends({}, _this.state, current);
                        _this.update(_this.rows);
                    }
                }, 100);
            };
        }();

        if (!(_this instanceof Clusterize)) {
            var _ret;

            return _ret = new Clusterize(options), _possibleConstructorReturn(_this, _ret);
        }

        _this.options = Object.keys(_this.options).reduce(function (acc, key) {
            if (options[key] !== undefined) {
                acc[key] = options[key];
            } else {
                acc[key] = _this.options[key];
            }
            return acc;
        }, {});

        _this.scrollElement = options.scrollElement;
        _this.contentElement = options.contentElement;

        // Keep focus on the scrolling content
        if (!_this.contentElement.hasAttribute('tabindex')) {
            _this.contentElement.setAttribute('tabindex', 0);
        }

        if (Array.isArray(options.rows)) {
            _this.rows = options.rows;
        } else {
            _this.rows = [];

            var nodes = _this.contentElement.children;
            var length = nodes.length;
            for (var i = 0; i < length; ++i) {
                var node = nodes[i];
                _this.rows.push(node.outerHTML || '');
            }
        }

        // Remember scroll position
        var scrollTop = _this.scrollElement.scrollTop;

        _this.changeDOM();

        // Restore scroll position
        _this.scrollElement.scrollTop = scrollTop;

        (0, _dom.addEventListener)(_this.scrollElement, 'scroll', _this.scrollEventListener);
        (0, _dom.addEventListener)(window, 'resize', _this.resizeEventListener);
        return _this;
    }

    Clusterize.prototype.destroy = function destroy(clean) {
        (0, _dom.removeEventListener)(this.scrollElement, 'scroll', this.scrollEventListener);
        (0, _dom.removeEventListener)(window, 'resize', this.resizeEventListener);

        var rows = clean ? this.generateEmptyRow() : this.rows();
        this.setContent(rows.join(''));
    };

    Clusterize.prototype.update = function update(rows) {
        this.rows = (0, _ensureArray2['default'])(rows);

        // Remember scroll position
        var scrollTop = this.scrollElement.scrollTop;

        if (this.rows.length * this.state.itemHeight < scrollTop) {
            this.scrollElement.scrollTop = 0;
            this.state.lastClusterIndex = 0;
        }
        this.changeDOM();

        // Restore scroll position
        this.scrollElement.scrollTop = scrollTop;
    };

    Clusterize.prototype.clear = function clear() {
        this.rows = [];
        this.update();
    };

    Clusterize.prototype.append = function append(rows) {
        rows = (0, _ensureArray2['default'])(rows);
        if (!rows.length) {
            return;
        }
        this.rows = this.rows.concat(rows);
        this.changeDOM();
    };

    Clusterize.prototype.prepend = function prepend(rows) {
        rows = (0, _ensureArray2['default'])(rows);
        if (!rows.length) {
            return;
        }
        this.rows = rows.concat(this.rows);
        this.changeDOM();
    };

    Clusterize.prototype.computeHeight = function computeHeight() {
        if (!this.rows.length) {
            return {
                clusterHeight: 0,
                blockHeight: this.state.blockHeight,
                itemHeight: this.state.itemHeight
            };
        } else {
            var nodes = this.contentElement.children;
            var node = nodes[Math.floor(nodes.length / 2)];

            var itemHeight = node.offsetHeight;

            if (this.options.tag === 'tr' && (0, _dom.getElementStyle)(this.contentElement, 'borderCollapse') !== 'collapse') {
                itemHeight += parseInt((0, _dom.getElementStyle)(this.contentElement, 'borderSpacing'), 10) || 0;
            }

            if (this.options.tag !== 'tr') {
                var marginTop = parseInt((0, _dom.getElementStyle)(node, 'marginTop'), 10) || 0;
                var marginBottom = parseInt((0, _dom.getElementStyle)(node, 'marginBottom'), 10) || 0;
                itemHeight += Math.max(marginTop, marginBottom);
            }

            return {
                blockHeight: this.state.itemHeight * this.options.rowsInBlock,
                clusterHeight: this.state.blockHeight * this.options.blocksInCluster,
                itemHeight: itemHeight
            };
        }
    };

    Clusterize.prototype.getCurrentClusterIndex = function getCurrentClusterIndex() {
        var _state = this.state,
            blockHeight = _state.blockHeight,
            clusterHeight = _state.clusterHeight;

        if (!blockHeight || !clusterHeight) {
            return 0;
        }
        return Math.floor(this.scrollElement.scrollTop / (clusterHeight - blockHeight)) || 0;
    };

    Clusterize.prototype.generateEmptyRow = function generateEmptyRow() {
        var _options = this.options,
            tag = _options.tag,
            emptyText = _options.emptyText,
            emptyClass = _options.emptyClass;


        if (!tag || !emptyText) {
            return [];
        }

        var emptyRow = document.createElement(tag);
        emptyRow.className = emptyClass;

        if (tag === 'tr') {
            var td = document.createElement('td');
            td.colSpan = 100;
            td.appendChild(document.createTextNode(emptyText));
            emptyRow.appendChild(td);
        } else {
            emptyRow.appendChild(document.createTextNode(emptyText));
        }

        return [emptyRow.outerHTML];
    };

    Clusterize.prototype.renderExtraTag = function renderExtraTag(className, height) {
        var tag = document.createElement(this.options.tag);
        var prefix = 'infinite-tree-';

        tag.className = [prefix + 'extra-row', prefix + className].join(' ');

        if (height) {
            tag.style.height = height + 'px';
        }

        return tag.outerHTML;
    };

    Clusterize.prototype.changeDOM = function changeDOM() {
        if (!this.state.clusterHeight && this.rows.length > 0) {
            if (ie && ie <= 9 && !this.options.tag) {
                this.options.tag = this.rows[0].match(/<([^>\s/]*)/)[1].toLowerCase();
            }

            if (this.contentElement.children.length <= 1) {
                this.cache.content = this.setContent(this.rows[0] + this.rows[0] + this.rows[0]);
            }

            if (!this.options.tag) {
                this.options.tag = this.contentElement.children[0].tagName.toLowerCase();
            }

            this.state = _extends({}, this.state, this.computeHeight());
        }

        var topOffset = 0;
        var bottomOffset = 0;
        var rows = [];

        if (this.rows.length < this.options.rowsInBlock) {
            rows = this.rows.length > 0 ? this.rows : this.generateEmptyRow();
        } else {
            var rowsInCluster = this.options.rowsInBlock * this.options.blocksInCluster;
            var clusterIndex = this.getCurrentClusterIndex();
            var visibleStart = Math.max((rowsInCluster - this.options.rowsInBlock) * clusterIndex, 0);
            var visibleEnd = visibleStart + rowsInCluster;

            topOffset = Math.max(visibleStart * this.state.itemHeight, 0);
            bottomOffset = Math.max((this.rows.length - visibleEnd) * this.state.itemHeight, 0);

            // Returns a shallow copy of the rows selected from `visibleStart` to `visibleEnd` (`visibleEnd` not included).
            rows = this.rows.slice(visibleStart, visibleEnd);
        }

        var content = rows.join('');
        var contentChanged = this.checkChanges('content', content);
        var topOffsetChanged = this.checkChanges('top', topOffset);
        var bottomOffsetChanged = this.checkChanges('bottom', bottomOffset);

        if (contentChanged || topOffsetChanged) {
            var layout = [];

            if (topOffset > 0) {
                if (this.options.keepParity) {
                    layout.push(this.renderExtraTag('keep-parity'));
                }
                layout.push(this.renderExtraTag('top-space', topOffset));
            }

            layout.push(content);

            if (bottomOffset > 0) {
                layout.push(this.renderExtraTag('bottom-space', bottomOffset));
            }

            this.emit('clusterWillChange');

            this.setContent(layout.join(''));

            this.emit('clusterDidChange');
        } else if (bottomOffsetChanged) {
            this.contentElement.lastChild.style.height = bottomOffset + 'px';
        }
    };

    Clusterize.prototype.setContent = function setContent(content) {
        // For IE 9 and older versions
        if (ie && ie <= 9 && this.options.tag === 'tr') {
            var div = document.createElement('div');
            div.innerHTML = '<table><tbody>' + content + '</tbody></table>';

            var lastChild = this.contentElement.lastChild;
            while (lastChild) {
                this.contentElement.removeChild(lastChild);
                lastChild = this.contentElement.lastChild;
            }

            var rowsNodes = this.getChildNodes(div.firstChild.firstChild);
            while (rowsNodes.length) {
                this.contentElement.appendChild(rowsNodes.shift());
            }
        } else {
            this.contentElement.innerHTML = content;
        }
    };

    Clusterize.prototype.getChildNodes = function getChildNodes(tag) {
        var childNodes = tag.children;
        var nodes = [];
        var length = childNodes.length;

        for (var i = 0; i < length; i++) {
            nodes.push(childNodes[i]);
        }

        return nodes;
    };

    Clusterize.prototype.checkChanges = function checkChanges(type, value) {
        var changed = value !== this.cache[type];
        this.cache[type] = value;
        return changed;
    };

    return Clusterize;
}(_events.EventEmitter);

exports['default'] = Clusterize;

/***/ }),

/***/ "../node_modules/infinite-tree/lib/dom.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var getElementStyle = function getElementStyle(el, prop) {
    return window.getComputedStyle ? window.getComputedStyle(el)[prop] : el.currentStyle[prop];
};

var preventDefault = function preventDefault(e) {
    if (typeof e.preventDefault !== 'undefined') {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
};

var stopPropagation = function stopPropagation(e) {
    if (typeof e.stopPropagation !== 'undefined') {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
};

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Compatibility
var addEventListener = function addEventListener(target, type, listener) {
    if (target.addEventListener) {
        // Standard
        target.addEventListener(type, listener, false);
    } else if (target.attachEvent) {
        // IE8
        // In Internet Explorer versions before IE 9, you have to use attachEvent rather than the standard addEventListener.
        target.attachEvent('on' + type, listener);
    }
};

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
var removeEventListener = function removeEventListener(target, type, listener) {
    if (target.removeEventListener) {
        // Standard
        target.removeEventListener(type, listener, false);
    } else if (target.detachEvent) {
        // IE8
        // In Internet Explorer versions before IE 9, you have to use detachEvent rather than the standard removeEventListener.
        target.detachEvent('on' + type, listener);
    }
};

exports.getElementStyle = getElementStyle;
exports.preventDefault = preventDefault;
exports.stopPropagation = stopPropagation;
exports.addEventListener = addEventListener;
exports.removeEventListener = removeEventListener;

/***/ }),

/***/ "../node_modules/infinite-tree/lib/ensure-array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var ensureArray = function ensureArray() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    if (args.length === 0 || args[0] === undefined || args[0] === null) {
        return [];
    }
    if (args.length === 1) {
        return [].concat(args[0]);
    }
    return [].concat(args);
};

exports["default"] = ensureArray;

/***/ }),

/***/ "../node_modules/infinite-tree/lib/extend.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint no-restricted-syntax: 0 */
var extend = function extend(target) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
    }

    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    for (var index = 0; index < sources.length; index++) {
        var source = sources[index];
        if (source !== undefined && source !== null) {
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    output[key] = source[key];
                }
            }
        }
    }
    return output;
};

module.exports = extend;

/***/ }),

/***/ "../node_modules/infinite-tree/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _infiniteTree = __webpack_require__("../node_modules/infinite-tree/lib/infinite-tree.js");

var _infiniteTree2 = _interopRequireDefault(_infiniteTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

module.exports = _infiniteTree2['default'];

/***/ }),

/***/ "../node_modules/infinite-tree/lib/infinite-tree.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _events = __webpack_require__("../node_modules/events/events.js");

var _events2 = _interopRequireDefault(_events);

var _classnames = __webpack_require__("../node_modules/classnames/index.js");

var _classnames2 = _interopRequireDefault(_classnames);

var _elementClass = __webpack_require__("../node_modules/element-class/index.js");

var _elementClass2 = _interopRequireDefault(_elementClass);

var _isDom = __webpack_require__("../node_modules/is-dom/index.js");

var _isDom2 = _interopRequireDefault(_isDom);

var _flattree = __webpack_require__("../node_modules/flattree/lib/index.js");

var _clusterize = __webpack_require__("../node_modules/infinite-tree/lib/clusterize.js");

var _clusterize2 = _interopRequireDefault(_clusterize);

var _ensureArray = __webpack_require__("../node_modules/infinite-tree/lib/ensure-array.js");

var _ensureArray2 = _interopRequireDefault(_ensureArray);

var _extend = __webpack_require__("../node_modules/infinite-tree/lib/extend.js");

var _extend2 = _interopRequireDefault(_extend);

var _utilities = __webpack_require__("../node_modules/infinite-tree/lib/utilities.js");

var _lookupTable = __webpack_require__("../node_modules/infinite-tree/lib/lookup-table.js");

var _lookupTable2 = _interopRequireDefault(_lookupTable);

var _renderer = __webpack_require__("../node_modules/infinite-tree/lib/renderer.js");

var _dom = __webpack_require__("../node_modules/infinite-tree/lib/dom.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint no-continue: 0 */
/* eslint operator-assignment: 0 */


var noop = function noop() {};

var error = function error(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Error: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
    });

    if (console && console.error) {
        console.error(message);
    }
    try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this error to fire.
        throw new Error(message);
    } catch (e) {
        // Ignore
    }
};

var ensureNodeInstance = function ensureNodeInstance(node) {
    if (!node) {
        // undefined or null
        return false;
    }
    if (!(node instanceof _flattree.Node)) {
        error('The node must be a Node object.');
        return false;
    }
    return true;
};

var createRootNode = function createRootNode(rootNode) {
    return (0, _extend2['default'])(rootNode || new _flattree.Node(), {
        parent: null,
        children: [],
        state: {
            depth: -1,
            open: true, // always open
            path: '',
            prefixMask: '',
            total: 0
        }
    });
};

var InfiniteTree = function (_events$EventEmitter) {
    _inherits(InfiniteTree, _events$EventEmitter);

    // Creates new InfiniteTree object.
    function InfiniteTree(el, options) {
        _classCallCheck(this, InfiniteTree);

        var _this = _possibleConstructorReturn(this, _events$EventEmitter.call(this));

        _this.options = {
            autoOpen: false,
            droppable: false,
            shouldLoadNodes: null,
            loadNodes: null,
            rowRenderer: _renderer.defaultRowRenderer,
            selectable: true,
            shouldSelectNode: null,

            // When el is not specified, the tree will run in the stealth mode
            el: null,

            // The following options will have no effect in the stealth mode
            layout: 'div',
            noDataClass: 'infinite-tree-no-data',
            noDataText: 'No data',
            nodeIdAttr: 'data-id',
            togglerClass: 'infinite-tree-toggler'
        };
        _this.state = {
            openNodes: [],
            rootNode: createRootNode(),
            selectedNode: null
        };
        _this.clusterize = null;
        _this.nodeTable = new _lookupTable2['default']();
        _this.nodes = [];
        _this.rows = [];
        _this.filtered = false;
        _this.scrollElement = null;
        _this.contentElement = null;
        _this.draggableTarget = null;
        _this.droppableTarget = null;
        _this.contentListener = {
            'click': function click(event) {
                event = event || window.event;

                // Wrap stopPropagation that allows click event handler to stop execution
                // by setting the cancelBubble property
                var stopPropagation = event.stopPropagation;
                event.stopPropagation = function () {
                    // Setting the cancelBubble property in browsers that don't support it doesn't hurt.
                    // Of course it doesn't actually cancel the bubbling, but the assignment itself is safe.
                    event.cancelBubble = true;

                    if (stopPropagation) {
                        stopPropagation.call(event);
                    }
                };

                // Call setTimeout(fn, 0) to re-queues the execution of subsequent calls, it allows the
                // click event to bubble up to higher level event handlers before handling tree events.
                setTimeout(function () {
                    // Stop execution if the cancelBubble property is set to true by higher level event handlers
                    if (event.cancelBubble === true) {
                        return;
                    }

                    // Emit a "click" event
                    _this.emit('click', event);

                    // Stop execution if the cancelBubble property is set to true after emitting the click event
                    if (event.cancelBubble === true) {
                        return;
                    }

                    var itemTarget = null;
                    var clickToggler = false;

                    if (event.target) {
                        itemTarget = event.target !== event.currentTarget ? event.target : null;
                    } else if (event.srcElement) {
                        // IE8
                        itemTarget = event.srcElement;
                    }

                    while (itemTarget && itemTarget.parentElement !== _this.contentElement) {
                        if ((0, _elementClass2['default'])(itemTarget).has(_this.options.togglerClass)) {
                            clickToggler = true;
                        }
                        itemTarget = itemTarget.parentElement;
                    }

                    if (!itemTarget || itemTarget.hasAttribute('disabled')) {
                        return;
                    }

                    var id = itemTarget.getAttribute(_this.options.nodeIdAttr);
                    var node = _this.getNodeById(id);
                    if (!node) {
                        return;
                    }

                    // Click on the toggler to open/close a tree node
                    if (clickToggler) {
                        _this.toggleNode(node, { async: true });
                        return;
                    }

                    _this.selectNode(node); // selectNode will re-render the tree
                }, 0);
            },
            'dblclick': function dblclick(event) {
                // Emit a "doubleClick" event
                _this.emit('doubleClick', event);
            },
            'keydown': function keydown(event) {
                // Emit a "keyDown" event
                _this.emit('keyDown', event);
            },
            'keyup': function keyup(event) {
                // Emit a "keyUp" event
                _this.emit('keyUp', event);
            },
            // https://developer.mozilla.org/en-US/docs/Web/Events/dragstart
            // The dragstart event is fired when the user starts dragging an element or text selection.
            'dragstart': function dragstart(event) {
                event = event || window.event;

                _this.draggableTarget = event.target || event.srcElement;
            },
            // https://developer.mozilla.org/en-US/docs/Web/Events/dragend
            // The dragend event is fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key).
            'dragend': function dragend(event) {
                event = event || window.event;

                var _this$options$droppab = _this.options.droppable.hoverClass,
                    hoverClass = _this$options$droppab === undefined ? '' : _this$options$droppab;

                // Draggable

                _this.draggableTarget = null;

                // Droppable
                if (_this.droppableTarget) {
                    (0, _elementClass2['default'])(_this.droppableTarget).remove(hoverClass);
                    _this.droppableTarget = null;
                }
            },
            // https://developer.mozilla.org/en-US/docs/Web/Events/dragenter
            // The dragenter event is fired when a dragged element or text selection enters a valid drop target.
            'dragenter': function dragenter(event) {
                event = event || window.event;

                var itemTarget = null;

                if (event.target) {
                    itemTarget = event.target !== event.currentTarget ? event.target : null;
                } else if (event.srcElement) {
                    // IE8
                    itemTarget = event.srcElement;
                }

                while (itemTarget && itemTarget.parentElement !== _this.contentElement) {
                    itemTarget = itemTarget.parentElement;
                }

                if (!itemTarget) {
                    return;
                }

                if (_this.droppableTarget === itemTarget) {
                    return;
                }

                var _this$options$droppab2 = _this.options.droppable,
                    accept = _this$options$droppab2.accept,
                    _this$options$droppab3 = _this$options$droppab2.hoverClass,
                    hoverClass = _this$options$droppab3 === undefined ? '' : _this$options$droppab3;


                (0, _elementClass2['default'])(_this.droppableTarget).remove(hoverClass);
                _this.droppableTarget = null;

                var canDrop = true; // Defaults to true

                if (typeof accept === 'function') {
                    var id = itemTarget.getAttribute(_this.options.nodeIdAttr);
                    var node = _this.getNodeById(id);

                    canDrop = !!accept.call(_this, event, {
                        type: 'dragenter',
                        draggableTarget: _this.draggableTarget,
                        droppableTarget: itemTarget,
                        node: node
                    });
                }

                if (canDrop) {
                    (0, _elementClass2['default'])(itemTarget).add(hoverClass);
                    _this.droppableTarget = itemTarget;
                }
            },
            // https://developer.mozilla.org/en-US/docs/Web/Events/dragover
            // The dragover event is fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
            'dragover': function dragover(event) {
                event = event || window.event;

                (0, _dom.preventDefault)(event);
            },
            // https://developer.mozilla.org/en-US/docs/Web/Events/drop
            // The drop event is fired when an element or text selection is dropped on a valid drop target.
            'drop': function drop(event) {
                event = event || window.event;

                // prevent default action (open as link for some elements)
                (0, _dom.preventDefault)(event);

                if (!(_this.draggableTarget && _this.droppableTarget)) {
                    return;
                }

                var _this$options$droppab4 = _this.options.droppable,
                    accept = _this$options$droppab4.accept,
                    drop = _this$options$droppab4.drop,
                    _this$options$droppab5 = _this$options$droppab4.hoverClass,
                    hoverClass = _this$options$droppab5 === undefined ? '' : _this$options$droppab5;

                var id = _this.droppableTarget.getAttribute(_this.options.nodeIdAttr);
                var node = _this.getNodeById(id);

                var canDrop = true; // Defaults to true

                if (typeof accept === 'function') {
                    canDrop = !!accept.call(_this, event, {
                        type: 'drop',
                        draggableTarget: _this.draggableTarget,
                        droppableTarget: _this.droppableTarget,
                        node: node
                    });
                }

                if (canDrop && typeof drop === 'function') {
                    drop.call(_this, event, {
                        draggableTarget: _this.draggableTarget,
                        droppableTarget: _this.droppableTarget,
                        node: node
                    });
                }

                (0, _elementClass2['default'])(_this.droppableTarget).remove(hoverClass);
                _this.droppableTarget = null;
            }
        };


        if ((0, _isDom2['default'])(el)) {
            options = _extends({}, options, { el: el });
        } else if (el && (typeof el === 'undefined' ? 'undefined' : _typeof(el)) === 'object') {
            options = el;
        }

        // Assign options
        _this.options = _extends({}, _this.options, options);

        _this.create();

        // Load tree data if it's provided
        if (_this.options.data) {
            _this.loadData(_this.options.data);
        }
        return _this;
    }

    // The following elements will have no effect in the stealth mode


    InfiniteTree.prototype.create = function create() {
        var _this2 = this;

        if (this.options.el) {
            var tag = null;

            this.scrollElement = document.createElement('div');

            if (this.options.layout === 'table') {
                var tableElement = document.createElement('table');
                tableElement.className = (0, _classnames2['default'])('infinite-tree', 'infinite-tree-table');
                var contentElement = document.createElement('tbody');
                tableElement.appendChild(contentElement);
                this.scrollElement.appendChild(tableElement);
                this.contentElement = contentElement;

                // The tag name for supporting elements
                tag = 'tr';
            } else {
                var _contentElement = document.createElement('div');
                this.scrollElement.appendChild(_contentElement);
                this.contentElement = _contentElement;

                // The tag name for supporting elements
                tag = 'div';
            }

            this.scrollElement.className = (0, _classnames2['default'])('infinite-tree', 'infinite-tree-scroll');
            this.contentElement.className = (0, _classnames2['default'])('infinite-tree', 'infinite-tree-content');

            this.options.el.appendChild(this.scrollElement);

            this.clusterize = new _clusterize2['default']({
                tag: tag,
                rows: [],
                scrollElement: this.scrollElement,
                contentElement: this.contentElement,
                emptyText: this.options.noDataText,
                emptyClass: this.options.noDataClass
            });

            this.clusterize.on('clusterWillChange', function () {
                _this2.emit('clusterWillChange');
            });
            this.clusterize.on('clusterDidChange', function () {
                _this2.emit('clusterDidChange');
            });

            (0, _dom.addEventListener)(this.contentElement, 'click', this.contentListener.click);
            (0, _dom.addEventListener)(this.contentElement, 'dblclick', this.contentListener.dblclick);
            (0, _dom.addEventListener)(this.contentElement, 'keydown', this.contentListener.keydown);
            (0, _dom.addEventListener)(this.contentElement, 'keyup', this.contentListener.keyup);

            if (this.options.droppable) {
                (0, _dom.addEventListener)(document, 'dragstart', this.contentListener.dragstart);
                (0, _dom.addEventListener)(document, 'dragend', this.contentListener.dragend);
                (0, _dom.addEventListener)(this.contentElement, 'dragenter', this.contentListener.dragenter);
                (0, _dom.addEventListener)(this.contentElement, 'dragleave', this.contentListener.dragleave);
                (0, _dom.addEventListener)(this.contentElement, 'dragover', this.contentListener.dragover);
                (0, _dom.addEventListener)(this.contentElement, 'drop', this.contentListener.drop);
            }
        }
    };

    InfiniteTree.prototype.destroy = function destroy() {
        this.clear();

        if (this.options.el) {
            (0, _dom.removeEventListener)(this.contentElement, 'click', this.contentListener.click);
            (0, _dom.removeEventListener)(this.contentElement, 'dblclick', this.contentListener.dblclick);
            (0, _dom.removeEventListener)(this.contentElement, 'keydown', this.contentListener.keydown);
            (0, _dom.removeEventListener)(this.contentElement, 'keyup', this.contentListener.keyup);

            if (this.options.droppable) {
                (0, _dom.removeEventListener)(document, 'dragstart', this.contentListener.dragstart);
                (0, _dom.removeEventListener)(document, 'dragend', this.contentListener.dragend);
                (0, _dom.removeEventListener)(this.contentElement, 'dragenter', this.contentListener.dragenter);
                (0, _dom.removeEventListener)(this.contentElement, 'dragleave', this.contentListener.dragleave);
                (0, _dom.removeEventListener)(this.contentElement, 'dragover', this.contentListener.dragover);
                (0, _dom.removeEventListener)(this.contentElement, 'drop', this.contentListener.drop);
            }

            if (this.clusterize) {
                this.clusterize.destroy(true); // True to remove all data from the list
                this.clusterize = null;
            }

            // Remove all child nodes
            while (this.contentElement.firstChild) {
                this.contentElement.removeChild(this.contentElement.firstChild);
            }
            while (this.scrollElement.firstChild) {
                this.scrollElement.removeChild(this.scrollElement.firstChild);
            }

            var containerElement = this.options.el;
            while (containerElement.firstChild) {
                containerElement.removeChild(containerElement.firstChild);
            }

            this.contentElement = null;
            this.scrollElement = null;
        }
    };
    // Adds an array of new child nodes to a parent node at the specified index.
    // * If the parent is null or undefined, inserts new childs at the specified index in the top-level.
    // * If the parent has children, the method adds the new child to it at the specified index.
    // * If the parent does not have children, the method adds the new child to the parent.
    // * If the index value is greater than or equal to the number of children in the parent, the method adds the child at the end of the children.
    // @param {Array} newNodes An array of new child nodes.
    // @param {number} [index] The 0-based index of where to insert the child node.
    // @param {Node} parentNode The Node object that defines the parent node.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.addChildNodes = function addChildNodes(newNodes, index, parentNode) {
        var _this3 = this;

        newNodes = [].concat(newNodes || []); // Ensure array
        if (newNodes.length === 0) {
            return false;
        }

        if ((typeof index === 'undefined' ? 'undefined' : _typeof(index)) === 'object') {
            // The 'object' type might be Node or null
            parentNode = index || this.state.rootNode; // Defaults to rootNode if not specified
            index = parentNode.children.length;
        } else {
            parentNode = parentNode || this.state.rootNode; // Defaults to rootNode if not specified
        }

        if (!ensureNodeInstance(parentNode)) {
            return false;
        }

        if (typeof index !== 'number') {
            index = parentNode.children.length;
        }

        // Assign parent
        newNodes.forEach(function (newNode) {
            newNode.parent = parentNode;
        });

        // Insert new child node at the specified index
        parentNode.children.splice.apply(parentNode.children, [index, 0].concat(newNodes));

        // Get the index of the first new node within the array of child nodes
        index = parentNode.children.indexOf(newNodes[0]);

        var deleteCount = parentNode.state.total;
        var nodes = (0, _flattree.flatten)(parentNode.children, { openNodes: this.state.openNodes });
        var rows = [];
        // Update rows
        rows.length = nodes.length;
        for (var i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            rows[i] = this.options.rowRenderer(node, this.options);
        }

        if (parentNode === this.state.rootNode) {
            this.nodes = nodes;
            this.rows = rows;
        } else {
            var parentOffset = this.nodes.indexOf(parentNode);
            if (parentOffset >= 0) {
                if (parentNode.state.open === true) {
                    // Update nodes & rows
                    this.nodes.splice.apply(this.nodes, [parentOffset + 1, deleteCount].concat(nodes));
                    this.rows.splice.apply(this.rows, [parentOffset + 1, deleteCount].concat(rows));
                }

                // Update the row corresponding to the parent node
                this.rows[parentOffset] = this.options.rowRenderer(parentNode, this.options);
            }
        }

        // Update the lookup table with newly added nodes
        parentNode.children.slice(index).forEach(function (childNode) {
            _this3.flattenNode(childNode).forEach(function (node) {
                if (node.id !== undefined) {
                    _this3.nodeTable.set(node.id, node);
                }
            });
        });

        // Update list
        this.update();

        return true;
    };
    // Adds a new child node to the end of the list of children of a specified parent node.
    // * If the parent is null or undefined, inserts the child at the specified index in the top-level.
    // * If the parent has children, the method adds the child as the last child.
    // * If the parent does not have children, the method adds the child to the parent.
    // @param {object} newNode The new child node.
    // @param {Node} parentNode The Node object that defines the parent node.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.appendChildNode = function appendChildNode(newNode, parentNode) {
        // Defaults to rootNode if the parentNode is not specified
        parentNode = parentNode || this.state.rootNode;

        if (!ensureNodeInstance(parentNode)) {
            return false;
        }

        var index = parentNode.children.length;
        var newNodes = [].concat(newNode || []); // Ensure array
        return this.addChildNodes(newNodes, index, parentNode);
    };
    // Checks or unchecks a node.
    // @param {Node} node The Node object.
    // @param {boolean} [checked] Whether to check or uncheck the node. If not specified, it will toggle between checked and unchecked state.
    // @return {boolean} Returns true on success, false otherwise.
    // @example
    //
    // tree.checkNode(node); // toggle checked and unchecked state
    // tree.checkNode(node, true); // checked=true, indeterminate=false
    // tree.checkNode(node, false); // checked=false, indeterminate=false
    //
    // @doc
    //
    // state.checked | state.indeterminate | description
    // ------------- | ------------------- | -----------
    // false         | false               | The node and all of its children are unchecked.
    // true          | false               | The node and all of its children are checked.
    // true          | true                | The node will appear as indeterminate when the node is checked and some (but not all) of its children are checked.


    InfiniteTree.prototype.checkNode = function checkNode(node, checked) {
        if (!ensureNodeInstance(node)) {
            return false;
        }

        this.emit('willCheckNode', node);

        // Retrieve node index
        var nodeIndex = this.nodes.indexOf(node);
        if (nodeIndex < 0) {
            error('Invalid node index');
            return false;
        }

        if (checked === true) {
            node.state.checked = true;
            node.state.indeterminate = false;
        } else if (checked === false) {
            node.state.checked = false;
            node.state.indeterminate = false;
        } else {
            node.state.checked = !!node.state.checked;
            node.state.indeterminate = !!node.state.indeterminate;
            node.state.checked = node.state.checked && node.state.indeterminate || !node.state.checked;
            node.state.indeterminate = false;
        }

        var topmostNode = node;

        var updateChildNodes = function updateChildNodes(parentNode) {
            var childNode = parentNode.getFirstChild(); // Ignore parent node
            while (childNode) {
                // Update checked and indeterminate state
                childNode.state.checked = parentNode.state.checked;
                childNode.state.indeterminate = false;

                if (childNode.hasChildren()) {
                    childNode = childNode.getFirstChild();
                } else {
                    // Find the parent level
                    while (childNode.getNextSibling() === null && childNode.parent !== parentNode) {
                        // Use child-parent link to get to the parent level
                        childNode = childNode.getParent();
                    }

                    // Get next sibling
                    childNode = childNode.getNextSibling();
                }
            }
        };

        var updateParentNodes = function updateParentNodes(childNode) {
            var parentNode = childNode.parent;

            while (parentNode && parentNode.state.depth >= 0) {
                topmostNode = parentNode;

                var checkedCount = 0;
                var indeterminate = false;

                var len = parentNode.children ? parentNode.children.length : 0;
                for (var i = 0; i < len; ++i) {
                    var _childNode = parentNode.children[i];
                    indeterminate = indeterminate || !!_childNode.state.indeterminate;
                    if (_childNode.state.checked) {
                        checkedCount++;
                    }
                }

                if (checkedCount === 0) {
                    parentNode.state.indeterminate = false;
                    parentNode.state.checked = false;
                } else if (checkedCount > 0 && checkedCount < len || indeterminate) {
                    parentNode.state.indeterminate = true;
                    parentNode.state.checked = true;
                } else {
                    parentNode.state.indeterminate = false;
                    parentNode.state.checked = true;
                }

                parentNode = parentNode.parent;
            }
        };

        updateChildNodes(node);
        updateParentNodes(node);

        this.updateNode(topmostNode);

        // Emit a "checkNode" event
        this.emit('checkNode', node);

        return true;
    };
    // Clears the tree.


    InfiniteTree.prototype.clear = function clear() {
        if (this.clusterize) {
            this.clusterize.clear();
        }
        this.nodeTable.clear();
        this.nodes = [];
        this.rows = [];
        this.state.openNodes = [];
        this.state.rootNode = createRootNode(this.state.rootNode);
        this.state.selectedNode = null;
    };
    // Closes a node to hide its children.
    // @param {Node} node The Node object.
    // @param {object} [options] The options object.
    // @param {boolean} [options.silent] Pass true to prevent "closeNode" and "selectNode" events from being triggered.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.closeNode = function closeNode(node, options) {
        var _this4 = this;

        var _options = _extends({}, options),
            _options$async = _options.async,
            async = _options$async === undefined ? false : _options$async,
            _options$asyncCallbac = _options.asyncCallback,
            asyncCallback = _options$asyncCallbac === undefined ? noop : _options$asyncCallbac,
            _options$silent = _options.silent,
            silent = _options$silent === undefined ? false : _options$silent;

        if (!ensureNodeInstance(node)) {
            return false;
        }

        this.emit('willCloseNode', node);

        // Retrieve node index
        var nodeIndex = this.nodes.indexOf(node);
        if (nodeIndex < 0) {
            error('Invalid node index');
            return false;
        }

        // Check if the closeNode action can be performed
        if (this.state.openNodes.indexOf(node) < 0) {
            return false;
        }

        // Toggle the collapsing state
        node.state.collapsing = true;
        // Update the row corresponding to the node
        this.rows[nodeIndex] = this.options.rowRenderer(node, this.options);
        // Update list
        this.update();

        var fn = function fn() {
            // Keep selected node unchanged if "node" is equal to "this.state.selectedNode"
            if (_this4.state.selectedNode && _this4.state.selectedNode !== node) {
                // row #0 - node.0         => parent node (total=4)
                // row #1   - node.0.0     => close this node; next selected node (total=2)
                // row #2       node.0.0.0 => selected node (total=0)
                // row #3       node.0.0.1
                // row #4     node.0.1
                var selectedIndex = _this4.nodes.indexOf(_this4.state.selectedNode);
                var _total = node.state.total;
                var rangeFrom = nodeIndex + 1;
                var rangeTo = nodeIndex + _total;

                if (rangeFrom <= selectedIndex && selectedIndex <= rangeTo) {
                    _this4.selectNode(node, options);
                }
            }

            node.state.open = false; // Set the open state to false
            var openNodes = _this4.state.openNodes.filter(function (node) {
                return node.state.open;
            });
            _this4.state.openNodes = openNodes;

            // Subtract total from ancestor nodes
            var total = node.state.total;
            for (var p = node; p !== null; p = p.parent) {
                p.state.total = p.state.total - total;
            }

            // Update nodes & rows
            _this4.nodes.splice(nodeIndex + 1, total);
            _this4.rows.splice(nodeIndex + 1, total);

            // Toggle the collapsing state
            node.state.collapsing = false;
            // Update the row corresponding to the node
            _this4.rows[nodeIndex] = _this4.options.rowRenderer(node, _this4.options);

            // Update list
            _this4.update();

            if (!silent) {
                // Emit a "closeNode" event
                _this4.emit('closeNode', node);
            }

            if (typeof asyncCallback === 'function') {
                asyncCallback();
            }
        };

        if (async) {
            setTimeout(fn, 0);
        } else {
            fn();
        }

        return true;
    };
    // Filters nodes. Use a string or a function to test each node of the tree. Otherwise, it will render nothing after filtering (e.g. tree.filter(), tree.filter(null), tree.flter(0), tree.filter({}), etc.).
    // @param {string|function} predicate A keyword string, or a function to test each node of the tree. If the predicate is an empty string, all nodes will be filtered. If the predicate is a function, returns true to keep the node, false otherwise.
    // @param {object} [options] The options object.
    // @param {boolean} [options.caseSensitive] Case sensitive string comparison. Defaults to false. This option is only available for string comparison.
    // @param {boolean} [options.exactMatch] Exact string matching. Defaults to false. This option is only available for string comparison.
    // @param {string} [options.filterPath] Gets the value at path of Node object. Defaults to 'name'. This option is only available for string comparison.
    // @param {boolean} [options.includeAncestors] Whether to include ancestor nodes. Defaults to true.
    // @param {boolean} [options.includeDescendants] Whether to include descendant nodes. Defaults to true.
    // @example
    //
    // const filterOptions = {
    //     caseSensitive: false,
    //     exactMatch: false,
    //     filterPath: 'props.some.other.key',
    //     includeAncestors: true,
    //     includeDescendants: true
    // };
    // tree.filter('keyword', filterOptions);
    //
    // @example
    //
    // const filterOptions = {
    //     includeAncestors: true,
    //     includeDescendants: true
    // };
    // tree.filter(function(node) {
    //     const keyword = 'keyword';
    //     const filterText = node.name || '';
    //     return filterText.toLowerCase().indexOf(keyword) >= 0;
    // }, filterOptions);


    InfiniteTree.prototype.filter = function filter(predicate, options) {
        options = _extends({
            caseSensitive: false,
            exactMatch: false,
            filterPath: 'name',
            includeAncestors: true,
            includeDescendants: true
        }, options);

        this.filtered = true;

        var rootNode = this.state.rootNode;
        var traverse = function traverse(node) {
            var filterNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!node || !node.children) {
                return false;
            }

            if (node === rootNode) {
                node.state.filtered = false;
            } else if (filterNode) {
                node.state.filtered = true;
            } else if (typeof predicate === 'string') {
                // string
                var filterText = (0, _utilities.get)(node, options.filterPath, '');
                if (Number.isFinite(filterText)) {
                    filterText = String(filterText);
                }
                if (typeof filterText !== 'string') {
                    filterText = '';
                }
                var keyword = predicate;
                if (!options.caseSensitive) {
                    filterText = filterText.toLowerCase();
                    keyword = keyword.toLowerCase();
                }
                node.state.filtered = options.exactMatch ? filterText === keyword : filterText.indexOf(keyword) >= 0;
            } else if (typeof predicate === 'function') {
                // function
                var callback = predicate;
                node.state.filtered = !!callback(node);
            } else {
                node.state.filtered = false;
            }

            if (options.includeDescendants) {
                filterNode = filterNode || node.state.filtered;
            }

            var filtered = false;
            for (var i = 0; i < node.children.length; ++i) {
                var childNode = node.children[i];
                if (!childNode) {
                    continue;
                }
                if (traverse(childNode, filterNode)) {
                    filtered = true;
                }
            }
            if (options.includeAncestors && filtered) {
                node.state.filtered = true;
            }

            return node.state.filtered;
        };

        traverse(rootNode);

        // Update rows
        this.rows.length = this.nodes.length;
        for (var i = 0; i < this.nodes.length; ++i) {
            var node = this.nodes[i];
            this.rows[i] = this.options.rowRenderer(node, this.options);
        }

        this.update();
    };
    // Flattens all child nodes of a parent node by performing full tree traversal using child-parent link.
    // No recursion or stack is involved.
    // @param {Node} parentNode The Node object that defines the parent node.
    // @return {array} Returns an array of Node objects containing all the child nodes of the parent node.


    InfiniteTree.prototype.flattenChildNodes = function flattenChildNodes(parentNode) {
        // Defaults to rootNode if the parentNode is not specified
        parentNode = parentNode || this.state.rootNode;

        if (!ensureNodeInstance(parentNode)) {
            return [];
        }

        var list = [];
        var node = parentNode.getFirstChild(); // Ignore parent node
        while (node) {
            list.push(node);
            if (node.hasChildren()) {
                node = node.getFirstChild();
            } else {
                // Find the parent level
                while (node.getNextSibling() === null && node.parent !== parentNode) {
                    // Use child-parent link to get to the parent level
                    node = node.getParent();
                }

                // Get next sibling
                node = node.getNextSibling();
            }
        }

        return list;
    };
    // Flattens a node by performing full tree traversal using child-parent link.
    // No recursion or stack is involved.
    // @param {Node} node The Node object.
    // @return {array} Returns a flattened list of Node objects.


    InfiniteTree.prototype.flattenNode = function flattenNode(node) {
        if (!ensureNodeInstance(node)) {
            return [];
        }

        return [node].concat(this.flattenChildNodes(node));
    };
    // Gets a list of child nodes.
    // @param {Node} [parentNode] The Node object that defines the parent node. If null or undefined, returns a list of top level nodes.
    // @return {array} Returns an array of Node objects containing all the child nodes of the parent node.


    InfiniteTree.prototype.getChildNodes = function getChildNodes(parentNode) {
        // Defaults to rootNode if the parentNode is not specified
        parentNode = parentNode || this.state.rootNode;

        if (!ensureNodeInstance(parentNode)) {
            return [];
        }

        return parentNode.children;
    };
    // Gets a node by its unique id. This assumes that you have given the nodes in the data a unique id.
    // @param {string|number} id An unique node id. A null value will be returned if the id doesn't match.
    // @return {Node} Returns a node the matches the id, null otherwise.


    InfiniteTree.prototype.getNodeById = function getNodeById(id) {
        var node = this.nodeTable.get(id);
        if (!node) {
            // Find the first node that matches the id
            node = this.nodes.filter(function (node) {
                return node.id === id;
            })[0];
            if (!node) {
                return null;
            }
            this.nodeTable.set(node.id, node);
        }
        return node;
    };
    // Returns the node at the specified point. If the specified point is outside the visible bounds or either coordinate is negative, the result is null.
    // @param {number} x A horizontal position within the current viewport.
    // @param {number} y A vertical position within the current viewport.
    // @return {Node} The Node object under the given point.


    InfiniteTree.prototype.getNodeFromPoint = function getNodeFromPoint(x, y) {
        var el = document.elementFromPoint(x, y);
        while (el && el.parentElement !== this.contentElement) {
            el = el.parentElement;
        }
        if (!el) {
            return null;
        }
        var id = el.getAttribute(this.options.nodeIdAttr);
        var node = this.getNodeById(id);

        return node;
    };
    // Gets an array of open nodes.
    // @return {array} Returns an array of Node objects containing open nodes.


    InfiniteTree.prototype.getOpenNodes = function getOpenNodes() {
        // returns a shallow copy of an array into a new array object.
        return this.state.openNodes.slice();
    };
    // Gets the root node.
    // @return {Node} Returns the root node, or null if empty.


    InfiniteTree.prototype.getRootNode = function getRootNode() {
        return this.state.rootNode;
    };
    // Gets the selected node.
    // @return {Node} Returns the selected node, or null if not selected.


    InfiniteTree.prototype.getSelectedNode = function getSelectedNode() {
        return this.state.selectedNode;
    };
    // Gets the index of the selected node.
    // @return {number} Returns the index of the selected node, or -1 if not selected.


    InfiniteTree.prototype.getSelectedIndex = function getSelectedIndex() {
        return this.nodes.indexOf(this.state.selectedNode);
    };
    // Inserts the specified node after the reference node.
    // @param {object} newNode The new sibling node.
    // @param {Node} referenceNode The Node object that defines the reference node.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.insertNodeAfter = function insertNodeAfter(newNode, referenceNode) {
        if (!ensureNodeInstance(referenceNode)) {
            return false;
        }

        var parentNode = referenceNode.getParent();
        var index = parentNode.children.indexOf(referenceNode) + 1;
        var newNodes = [].concat(newNode || []); // Ensure array

        return this.addChildNodes(newNodes, index, parentNode);
    };
    // Inserts the specified node before the reference node.
    // @param {object} newNode The new sibling node.
    // @param {Node} referenceNode The Node object that defines the reference node.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.insertNodeBefore = function insertNodeBefore(newNode, referenceNode) {
        if (!ensureNodeInstance(referenceNode)) {
            return false;
        }

        var parentNode = referenceNode.getParent();
        var index = parentNode.children.indexOf(referenceNode);
        var newNodes = [].concat(newNode || []); // Ensure array

        return this.addChildNodes(newNodes, index, parentNode);
    };
    // Loads data in the tree.
    // @param {object|array} data The data is an object or array of objects that defines the node.


    InfiniteTree.prototype.loadData = function loadData() {
        var _this5 = this;

        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        this.nodes = (0, _flattree.flatten)(data, { openAllNodes: this.options.autoOpen });

        // Clear lookup table
        this.nodeTable.clear();

        this.state.openNodes = this.nodes.filter(function (node) {
            return node.state.open;
        });
        this.state.selectedNode = null;

        var rootNode = function () {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            // Finding the root node
            while (node && node.parent !== null) {
                node = node.parent;
            }
            return node;
        }(this.nodes.length > 0 ? this.nodes[0] : null);

        this.state.rootNode = rootNode || createRootNode(this.state.rootNode); // Create a new root node if rootNode is null

        // Update the lookup table with newly added nodes
        this.flattenChildNodes(this.state.rootNode).forEach(function (node) {
            if (node.id !== undefined) {
                _this5.nodeTable.set(node.id, node);
            }
        });

        // Update rows
        this.rows.length = this.nodes.length;
        for (var i = 0; i < this.nodes.length; ++i) {
            var node = this.nodes[i];
            this.rows[i] = this.options.rowRenderer(node, this.options);
        }

        // Update list
        this.update();
    };
    // Moves a node from its current position to the new position.
    // @param {Node} node The Node object.
    // @param {Node} parentNode The Node object that defines the parent node.
    // @param {number} [index] The 0-based index of where to insert the child node.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.moveNodeTo = function moveNodeTo(node, parentNode, index) {
        if (!ensureNodeInstance(node) || !ensureNodeInstance(parentNode)) {
            return false;
        }

        for (var p = parentNode; p !== null; p = p.parent) {
            if (p === node) {
                error('Cannot move an ancestor node (id=' + node.id + ') to the specified parent node (id=' + parentNode.id + ').');
                return false;
            }
        }

        return this.removeNode(node) && this.addChildNodes(node, index, parentNode);
    };
    // Opens a node to display its children.
    // @param {Node} node The Node object.
    // @param {object} [options] The options object.
    // @param {boolean} [options.silent] Pass true to prevent "openNode" event from being triggered.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.openNode = function openNode(node, options) {
        var _this6 = this;

        var _options2 = _extends({}, options),
            _options2$async = _options2.async,
            async = _options2$async === undefined ? false : _options2$async,
            _options2$asyncCallba = _options2.asyncCallback,
            asyncCallback = _options2$asyncCallba === undefined ? noop : _options2$asyncCallba,
            _options2$silent = _options2.silent,
            silent = _options2$silent === undefined ? false : _options2$silent;

        if (!ensureNodeInstance(node)) {
            return false;
        }

        if (!this.nodeTable.has(node.id)) {
            error('Cannot open node with the given node id:', node.id);
            return false;
        }

        // Check if the openNode action can be performed
        if (this.state.openNodes.indexOf(node) >= 0) {
            return false;
        }

        this.emit('willOpenNode', node);

        // Retrieve node index
        var nodeIndex = this.nodes.indexOf(node);

        var fn = function fn() {
            node.state.open = true;

            if (_this6.state.openNodes.indexOf(node) < 0) {
                // the most recently used items first
                _this6.state.openNodes = [node].concat(_this6.state.openNodes);
            }

            var nodes = (0, _flattree.flatten)(node.children, { openNodes: _this6.state.openNodes });

            // Add all child nodes to the lookup table if the first child does not exist in the lookup table
            if (nodes.length > 0 && !_this6.nodeTable.get(nodes[0])) {
                nodes.forEach(function (node) {
                    if (node.id !== undefined) {
                        _this6.nodeTable.set(node.id, node);
                    }
                });
            }

            // Toggle the expanding state
            node.state.expanding = false;

            if (nodeIndex >= 0) {
                var rows = [];
                // Update rows
                rows.length = nodes.length;
                for (var i = 0; i < nodes.length; ++i) {
                    var _node = nodes[i];
                    rows[i] = _this6.options.rowRenderer(_node, _this6.options);
                }

                // Update nodes & rows
                _this6.nodes.splice.apply(_this6.nodes, [nodeIndex + 1, 0].concat(nodes));
                _this6.rows.splice.apply(_this6.rows, [nodeIndex + 1, 0].concat(rows));

                // Update the row corresponding to the node
                _this6.rows[nodeIndex] = _this6.options.rowRenderer(node, _this6.options);

                // Update list
                _this6.update();
            }

            if (!silent) {
                // Emit a "openNode" event
                _this6.emit('openNode', node);
            }

            if (typeof asyncCallback === 'function') {
                asyncCallback();
            }
        };

        if (nodeIndex < 0) {
            // Toggle the expanding state
            node.state.expanding = true;

            if (async) {
                setTimeout(fn, 0);
            } else {
                fn();
            }

            return true;
        }

        var shouldLoadNodes = typeof this.options.shouldLoadNodes === 'function' ? !!this.options.shouldLoadNodes(node) : !node.hasChildren() && node.loadOnDemand;

        if (shouldLoadNodes) {
            if (typeof this.options.loadNodes !== 'function') {
                return false;
            }

            // Reentrancy not allowed
            if (node.state.loading === true) {
                return false;
            }

            // Toggle the loading state
            node.state.loading = true;
            // Update the row corresponding to the node
            this.rows[nodeIndex] = this.options.rowRenderer(node, this.options);
            // Update list
            this.update();

            // Do a setTimeout to prevent the CPU intensive task
            setTimeout(function () {
                _this6.options.loadNodes(node, function (err, nodes) {
                    var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

                    nodes = (0, _ensureArray2['default'])(nodes);

                    var currentNodeIndex = _this6.nodes.indexOf(node);

                    if (nodes.length === 0 && currentNodeIndex >= 0) {
                        node.state.open = true;

                        if (_this6.state.openNodes.indexOf(node) < 0) {
                            // the most recently used items first
                            _this6.state.openNodes = [node].concat(_this6.state.openNodes);
                        }
                    }

                    if (err || nodes.length === 0) {
                        // Toggle the loading state
                        node.state.loading = false;
                        // Update the row corresponding to the node
                        _this6.rows[currentNodeIndex] = _this6.options.rowRenderer(node, _this6.options);
                        // Update list
                        _this6.update();

                        if (typeof done === 'function') {
                            done();
                        }
                        return;
                    }

                    _this6.addChildNodes(nodes, node);

                    // Ensure the node has children to prevent infinite loop
                    if (node.hasChildren()) {
                        // Call openNode again
                        _this6.openNode(node, _extends({}, options, {
                            async: true,
                            asyncCallback: function asyncCallback() {
                                // Toggle the loading state
                                node.state.loading = false;
                                var openedNodeIndex = _this6.nodes.indexOf(node);
                                // Update the row corresponding to the node
                                _this6.rows[openedNodeIndex] = _this6.options.rowRenderer(node, _this6.options);
                                // Update list
                                _this6.update();

                                if (typeof done === 'function') {
                                    done();
                                }
                            }
                        }));
                    } else {
                        // Toggle the loading state
                        node.state.loading = false;
                        // Update the row corresponding to the node
                        _this6.rows[currentNodeIndex] = _this6.options.rowRenderer(node, _this6.options);
                        // Update list
                        _this6.update();

                        if (typeof done === 'function') {
                            done();
                        }
                    }
                });
            }, 0);

            return true;
        }

        // Toggle the expanding state
        node.state.expanding = true;

        // Update the row corresponding to the node
        this.rows[nodeIndex] = this.options.rowRenderer(node, this.options);
        // Update list
        this.update();

        if (async) {
            setTimeout(fn, 0);
        } else {
            fn();
        }

        return true;
    };
    // Removes all child nodes from a parent node.
    // @param {Node} parentNode The Node object that defines the parent node.
    // @param {object} [options] The options object.
    // @param {boolean} [options.silent] Pass true to prevent "selectNode" event from being triggered.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.removeChildNodes = function removeChildNodes(parentNode, options) {
        var _this7 = this;

        if (!ensureNodeInstance(parentNode)) {
            return false;
        }

        if (parentNode.children.length === 0) {
            return false;
        }
        if (parentNode === this.state.rootNode) {
            this.clear();
            return true;
        }

        var parentNodeIndex = this.nodes.indexOf(parentNode);

        // Update selected node
        if (parentNodeIndex >= 0 && this.state.selectedNode) {
            // row #0 - node.0         => parent node (total=4)
            // row #1   - node.0.0
            // row #2       node.0.0.0 => current selected node
            // row #3       node.0.0.1
            // row #4     node.0.1
            var selectedIndex = this.nodes.indexOf(this.state.selectedNode);
            var rangeFrom = parentNodeIndex + 1;
            var rangeTo = parentNodeIndex + parentNode.state.total;

            if (rangeFrom <= selectedIndex && selectedIndex <= rangeTo) {
                if (parentNode === this.state.rootNode) {
                    this.selectNode(null, options);
                } else {
                    this.selectNode(parentNode, options);
                }
            }
        }

        // Get the nodes being removed
        var removedNodes = this.flattenChildNodes(parentNode);

        // Get the number of nodes to be removed
        var deleteCount = parentNode.state.total;

        // Subtract the deleteCount for all ancestors (parent, grandparent, etc.) of the current node
        for (var p = parentNode; p !== null; p = p.parent) {
            p.state.total = p.state.total - deleteCount;
        }

        // Update parent node
        parentNode.children = [];
        parentNode.state.open = parentNode.state.open && parentNode.children.length > 0;

        if (parentNodeIndex >= 0) {
            // Update nodes & rows
            this.nodes.splice(parentNodeIndex + 1, deleteCount);
            this.rows.splice(parentNodeIndex + 1, deleteCount);

            // Update the row corresponding to the parent node
            this.rows[parentNodeIndex] = this.options.rowRenderer(parentNode, this.options);
        }

        {
            // Update open nodes and lookup table
            this.state.openNodes = this.state.openNodes.filter(function (node) {
                return removedNodes.indexOf(node) < 0 && node.state.open;
            });

            removedNodes.forEach(function (node) {
                _this7.nodeTable.unset(node.id);
            });
        }

        // Update list
        this.update();

        return true;
    };
    // Removes a node and all of its child nodes.
    // @param {Node} node The Node object.
    // @param {object} [options] The options object.
    // @param {boolean} [options.silent] Pass true to prevent "selectNode" event from being triggered.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.removeNode = function removeNode(node, options) {
        var _this8 = this;

        if (!ensureNodeInstance(node)) {
            return false;
        }

        var parentNode = node.parent;
        if (!parentNode) {
            return false;
        }

        // Retrieve node index
        var nodeIndex = this.nodes.indexOf(node);
        var parentNodeIndex = this.nodes.indexOf(parentNode);

        // Update selected node
        if (nodeIndex >= 0 && this.state.selectedNode) {
            // row #0 - node.0         => parent node (total=4)
            // row #1   - node.0.0     => remove this node (total=2)
            // row #2       node.0.0.0 => current selected node (total=0)
            // row #3       node.0.0.1
            // row #4     node.0.1     => next selected node (total=0)
            var selectedIndex = this.nodes.indexOf(this.state.selectedNode);
            var rangeFrom = nodeIndex;
            var rangeTo = nodeIndex + node.state.total + 1;

            if (rangeFrom <= selectedIndex && selectedIndex <= rangeTo) {
                // Change the selected node in the following order:
                // 1. next sibling node
                // 2. previous sibling node
                // 3. parent node
                var selectedNode = node.getNextSibling() || node.getPreviousSibling() || node.getParent();

                if (selectedNode === this.state.rootNode) {
                    this.selectNode(null, options);
                } else {
                    this.selectNode(selectedNode, options);
                }
            }
        }

        // Get the nodes being removed
        var removedNodes = this.flattenNode(node);

        // Get the number of nodes to be removed
        var deleteCount = node.state.total + 1;

        // Subtract the deleteCount for all ancestors (parent, grandparent, etc.) of the current node
        for (var p = parentNode; p !== null; p = p.parent) {
            p.state.total = p.state.total - deleteCount;
        }

        // Update parent node
        parentNode.children.splice(parentNode.children.indexOf(node), 1);
        parentNode.state.open = parentNode.state.open && parentNode.children.length > 0;

        if (nodeIndex >= 0) {
            // Update nodes & rows
            this.nodes.splice(nodeIndex, deleteCount);
            this.rows.splice(nodeIndex, deleteCount);
        }

        // Update the row corresponding to the parent node
        if (parentNodeIndex >= 0) {
            this.rows[parentNodeIndex] = this.options.rowRenderer(parentNode, this.options);
        }

        {
            // Update open nodes and lookup table
            this.state.openNodes = this.state.openNodes.filter(function (node) {
                return removedNodes.indexOf(node) < 0 && node.state.open;
            });

            removedNodes.forEach(function (node) {
                _this8.nodeTable.unset(node.id);
            });
        }

        // Update list
        this.update();

        return true;
    };
    // Sets the current scroll position to this node.
    // @param {Node} node The Node object.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.scrollToNode = function scrollToNode(node) {
        if (!ensureNodeInstance(node)) {
            return false;
        }

        // Retrieve node index
        var nodeIndex = this.nodes.indexOf(node);
        if (nodeIndex < 0) {
            return false;
        }
        if (!this.contentElement) {
            return false;
        }

        // Scroll to a desired position
        var firstChild = this.contentElement.firstChild;
        while (firstChild) {
            var className = firstChild.className || '';
            if (className.indexOf('clusterize-extra-row') < 0 && firstChild.offsetHeight > 0) {
                break;
            }
            firstChild = firstChild.nextSibling;
        }
        // If all items in the list is the same height, it can be calculated by nodeIndex * height.
        var offsetHeight = firstChild && firstChild.offsetHeight || 0;
        if (offsetHeight > 0) {
            this.scrollTop(nodeIndex * offsetHeight);
        }

        // Find the absolute position of the node
        var nodeSelector = '[' + this.options.nodeIdAttr + '="' + node.id + '"]';
        var nodeEl = this.contentElement.querySelector(nodeSelector);
        if (nodeEl) {
            this.scrollTop(nodeEl.offsetTop);
        }

        return true;
    };
    // Gets (or sets) the current vertical position of the scroll bar.
    // @param {number} [value] If the value is specified, indicates the new position to set the scroll bar to.
    // @return {number} Returns the vertical scroll position.


    InfiniteTree.prototype.scrollTop = function scrollTop(value) {
        if (!this.scrollElement) {
            return 0;
        }
        if (value !== undefined) {
            this.scrollElement.scrollTop = Number(value);
        }
        return this.scrollElement.scrollTop;
    };
    // Selects a node.
    // @param {Node} node The Node object. If null or undefined, deselects the current node.
    // @param {object} [options] The options object.
    // @param {boolean} [options.autoScroll] Pass true to automatically scroll to the selected node. Defaults to true.
    // @param {boolean} [options.silent] Pass true to prevent "selectNode" event from being triggered. Defaults to false.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.selectNode = function selectNode() {
        var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var options = arguments[1];
        var _options3 = this.options,
            selectable = _options3.selectable,
            shouldSelectNode = _options3.shouldSelectNode;

        var _options4 = _extends({}, options),
            _options4$autoScroll = _options4.autoScroll,
            autoScroll = _options4$autoScroll === undefined ? true : _options4$autoScroll,
            _options4$silent = _options4.silent,
            silent = _options4$silent === undefined ? false : _options4$silent;

        this.emit('willSelectNode', node);

        if (!selectable) {
            return false;
        }
        if (typeof shouldSelectNode === 'function' && !shouldSelectNode(node)) {
            return false;
        }
        if (node === this.state.rootNode) {
            return false;
        }

        if (node === null) {
            // Deselect the current node
            if (this.state.selectedNode) {
                var selectedNode = this.state.selectedNode;
                var selectedIndex = this.nodes.indexOf(this.state.selectedNode);

                selectedNode.state.selected = false;
                this.rows[selectedIndex] = this.options.rowRenderer(selectedNode, this.options);
                this.state.selectedNode = null;

                // Update list
                this.update();

                if (!silent) {
                    // Emit a "selectNode" event
                    this.emit('selectNode', null);
                }

                return true;
            }

            return false;
        }

        if (!ensureNodeInstance(node)) {
            return false;
        }

        // Retrieve node index
        var nodeIndex = this.nodes.indexOf(node);
        if (nodeIndex < 0) {
            return false;
        }

        // Select this node
        if (this.state.selectedNode !== node) {
            node.state.selected = true;

            // Update the row corresponding to the node
            this.rows[nodeIndex] = this.options.rowRenderer(node, this.options);
        }

        // Deselect the current node
        if (this.state.selectedNode) {
            var _selectedNode = this.state.selectedNode;
            var _selectedIndex = this.nodes.indexOf(this.state.selectedNode);
            _selectedNode.state.selected = false;
            this.rows[_selectedIndex] = this.options.rowRenderer(_selectedNode, this.options);
        }

        if (this.state.selectedNode !== node) {
            this.state.selectedNode = node;

            if (!silent) {
                // Emit a "selectNode" event
                this.emit('selectNode', node);
            }

            if (autoScroll && this.scrollElement && this.contentElement) {
                var nodeSelector = '[' + this.options.nodeIdAttr + '="' + node.id + '"]';
                var nodeEl = this.contentElement.querySelector(nodeSelector);
                if (nodeEl) {
                    var offsetTop = nodeEl.offsetTop || 0;
                    var offsetHeight = nodeEl.offsetHeight || 0;

                    // Scroll Up
                    if (offsetTop < this.scrollElement.scrollTop) {
                        this.scrollElement.scrollTop = offsetTop;
                    }

                    // Scroll Down
                    if (offsetTop + offsetHeight >= this.scrollElement.scrollTop + this.scrollElement.clientHeight) {
                        this.scrollElement.scrollTop += offsetHeight;
                    }
                }
            }
        } else {
            this.state.selectedNode = null;

            if (!silent) {
                // Emit a "selectNode" event
                this.emit('selectNode', null);
            }
        }

        // Update list
        this.update();

        return true;
    };
    // Swaps two nodes.
    // @param {Node} node1 The Node object.
    // @param {Node} node2 The Node object.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.swapNodes = function swapNodes(node1, node2) {
        if (!ensureNodeInstance(node1) || !ensureNodeInstance(node1.parent)) {
            return false;
        }
        if (!ensureNodeInstance(node2) || !ensureNodeInstance(node2.parent)) {
            return false;
        }

        var parentNode1 = node1.parent;
        var parentNode2 = node2.parent;

        for (var p = parentNode1; p !== null; p = p.parent) {
            if (p === node2) {
                error('Cannot swap two nodes with one being an ancestor of the other.');
                return false;
            }
        }
        for (var _p = parentNode2; _p !== null; _p = _p.parent) {
            if (_p === node1) {
                error('Cannot swap two nodes with one being an ancestor of the other.');
                return false;
            }
        }

        var nodeIndex1 = parentNode1.children.indexOf(node1);
        var nodeIndex2 = parentNode2.children.indexOf(node2);

        return this.moveNodeTo(node1, parentNode2, nodeIndex2) && this.moveNodeTo(node2, parentNode1, nodeIndex1);
    };
    // Toggles a node to display or hide its children.
    // @param {Node} node The Node object.
    // @param {object} [options] The options object.
    // @param {boolean} [options.silent] Pass true to prevent "closeNode", "openNode", and "selectNode" events from being triggered.
    // @return {boolean} Returns true on success, false otherwise.


    InfiniteTree.prototype.toggleNode = function toggleNode(node, options) {
        if (!ensureNodeInstance(node)) {
            return false;
        }

        if (this.state.openNodes.indexOf(node) >= 0) {
            // Close node
            return this.closeNode(node, options);
        } else {
            // Open node
            return this.openNode(node, options);
        }
    };
    // Serializes the current state of a node to a JSON string.
    // @param {Node} node The Node object. If null, returns the whole tree.
    // @return {string} Returns a JSON string represented the tree.


    InfiniteTree.prototype.toString = function toString() {
        var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var traverse = function traverse(node) {
            var s = '[';
            if (node && node.children) {
                var _loop = function _loop(i) {
                    var list = [];
                    s = s + '{';
                    Object.keys(node).forEach(function (key) {
                        var value = node[key];
                        if (key === 'parent') {
                            // ignore parent
                            return;
                        }
                        if (key === 'children') {
                            // traverse child nodes
                            list.push('"' + key + '":' + traverse(node.children[i]));
                            return;
                        }
                        if (typeof value === 'string' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                            list.push('"' + key + '":' + JSON.stringify(value));
                        } else {
                            // primitive types
                            list.push('"' + key + '":' + value);
                        }
                    });
                    s = s + list.join(',');
                    s = s + '}' + (i === node.children.length - 1 ? '' : ',');
                };

                for (var i = 0; i < node.children.length; ++i) {
                    _loop(i);
                }
            }
            s = s + ']';
            return s;
        };

        if (!node) {
            node = this.state.rootNode;
        }

        return traverse(node);
    };
    // Unfilters nodes.


    InfiniteTree.prototype.unfilter = function unfilter() {
        this.filtered = false;

        var rootNode = this.state.rootNode;
        var traverse = function traverse(node) {
            if (!node) {
                return;
            }
            delete node.state.filtered;

            if (!node.children) {
                return;
            }
            for (var i = 0; i < node.children.length; ++i) {
                var childNode = node.children[i];
                if (!childNode) {
                    continue;
                }
                traverse(childNode);
            }
        };

        traverse(rootNode);

        // Update rows
        this.rows.length = this.nodes.length;
        for (var i = 0; i < this.nodes.length; ++i) {
            var node = this.nodes[i];
            this.rows[i] = this.options.rowRenderer(node, this.options);
        }

        this.update();
    };
    // Updates the tree.


    InfiniteTree.prototype.update = function update() {
        // Emit a "contentWillUpdate" event
        this.emit('contentWillUpdate');

        if (this.clusterize) {
            // Update list
            var rows = this.rows.filter(function (row) {
                return !!row;
            });
            this.clusterize.update(rows);
        }

        // Emit a "contentWillUpdate" event
        this.emit('contentDidUpdate');
    };
    // Updates the data of a node.
    // @param {Node} node The Node object.
    // @param {object} data The data object.
    // @param {object} [options] The options object.
    // @param {boolean} [options.shallowRendering] True to render only the parent node, false to render the parent node and all expanded child nodes. Defaults to false.


    InfiniteTree.prototype.updateNode = function updateNode(node, data, options) {
        if (!ensureNodeInstance(node)) {
            return;
        }

        // Clone a new one
        data = _extends({}, data);

        if (data.id !== undefined && data.id !== null) {
            this.nodeTable.unset(node.id);
            this.nodeTable.set(data.id, node);
            node.id = data.id;
        }

        // Ignore keys: id, children, parent, and state
        delete data.id;
        delete data.children;
        delete data.parent;
        delete data.state;

        node = (0, _extend2['default'])(node, data);

        // Retrieve node index
        var nodeIndex = this.nodes.indexOf(node);
        if (nodeIndex >= 0) {
            var _options5 = _extends({}, options),
                _options5$shallowRend = _options5.shallowRendering,
                shallowRendering = _options5$shallowRend === undefined ? false : _options5$shallowRend;

            // Update the row corresponding to the node


            this.rows[nodeIndex] = this.options.rowRenderer(node, this.options);

            if (!shallowRendering) {
                var total = node.state.total;
                var rangeFrom = nodeIndex + 1;
                var rangeTo = nodeIndex + total;
                for (var index = rangeFrom; index <= rangeTo; ++index) {
                    this.rows[index] = this.options.rowRenderer(this.nodes[index], this.options);
                }
            }

            // Update list
            this.update();
        }
    };

    return InfiniteTree;
}(_events2['default'].EventEmitter);

exports['default'] = InfiniteTree;

/***/ }),

/***/ "../node_modules/infinite-tree/lib/lookup-table.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LookupTable = function () {
    function LookupTable() {
        _classCallCheck(this, LookupTable);

        this.data = {};
    }

    LookupTable.prototype.clear = function clear() {
        this.data = {};
    };

    LookupTable.prototype.get = function get(key) {
        return this.data[key];
    };

    LookupTable.prototype.has = function has(key) {
        return this.data[key] !== undefined;
    };

    LookupTable.prototype.set = function set(key, value) {
        this.data[key] = value;
        return value;
    };

    LookupTable.prototype.unset = function unset(key) {
        if (this.data[key] !== undefined) {
            delete this.data[key];
        }
    };

    return LookupTable;
}();

exports["default"] = LookupTable;

/***/ }),

/***/ "../node_modules/infinite-tree/lib/renderer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.defaultRowRenderer = undefined;

var _classnames = __webpack_require__("../node_modules/classnames/index.js");

var _classnames2 = _interopRequireDefault(_classnames);

var _escapeHtml = __webpack_require__("../node_modules/escape-html/index.js");

var _escapeHtml2 = _interopRequireDefault(_escapeHtml);

var _html5Tag = __webpack_require__("../node_modules/html5-tag/lib/index.js");

var _html5Tag2 = _interopRequireDefault(_html5Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var defaultRowRenderer = function defaultRowRenderer(node, treeOptions) {
    var id = node.id,
        name = node.name,
        _node$loadOnDemand = node.loadOnDemand,
        loadOnDemand = _node$loadOnDemand === undefined ? false : _node$loadOnDemand,
        children = node.children,
        state = node.state;

    var droppable = treeOptions.droppable;
    var depth = state.depth,
        open = state.open,
        path = state.path,
        total = state.total,
        _state$selected = state.selected,
        selected = _state$selected === undefined ? false : _state$selected,
        filtered = state.filtered;

    var childrenLength = Object.keys(children).length;
    var more = node.hasChildren();

    if (filtered === false) {
        return '';
    }

    var togglerContent = '';
    if (!more && loadOnDemand) {
        togglerContent = '►';
    }
    if (more && open) {
        togglerContent = '▼';
    }
    if (more && !open) {
        togglerContent = '►';
    }
    var toggler = (0, _html5Tag2['default'])('a', {
        'class': function () {
            if (!more && loadOnDemand) {
                return (0, _classnames2['default'])(treeOptions.togglerClass, 'infinite-tree-closed');
            }
            if (more && open) {
                return (0, _classnames2['default'])(treeOptions.togglerClass);
            }
            if (more && !open) {
                return (0, _classnames2['default'])(treeOptions.togglerClass, 'infinite-tree-closed');
            }
            return '';
        }()
    }, togglerContent);
    var title = (0, _html5Tag2['default'])('span', {
        'class': (0, _classnames2['default'])('infinite-tree-title')
    }, (0, _escapeHtml2['default'])(name));
    var treeNode = (0, _html5Tag2['default'])('div', {
        'class': 'infinite-tree-node',
        'style': 'margin-left: ' + depth * 18 + 'px'
    }, toggler + title);

    return (0, _html5Tag2['default'])('div', {
        'data-id': id,
        'data-expanded': more && open,
        'data-depth': depth,
        'data-path': path,
        'data-selected': selected,
        'data-children': childrenLength,
        'data-total': total,
        'class': (0, _classnames2['default'])('infinite-tree-item', { 'infinite-tree-selected': selected }),
        'droppable': droppable
    }, treeNode);
}; /* eslint import/prefer-default-export: 0 */
exports.defaultRowRenderer = defaultRowRenderer;

/***/ }),

/***/ "../node_modules/infinite-tree/lib/utilities.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var trim = exports.trim = function trim(str) {
    var chars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' \f\n\r\t\v';

    while (chars.indexOf(str[0]) >= 0) {
        str = str.slice(1);
    }
    while (chars.indexOf(str[str.length - 1]) >= 0) {
        str = str.slice(0, -1);
    }
    return str;
};

var get = exports.get = function () {
    var re = new RegExp(/[\w\-]+|\[[^\]]*\]+/g);

    return function (object, path, defaultValue) {
        if (!object || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
            return defaultValue;
        }

        path = '' + path;

        var keys = path.match(re);
        if (!keys) {
            return defaultValue;
        }

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            key = trim(key, ' \f\n\r\t\v');
            if (key[0] === '[') {
                key = trim(key.slice(1, -1), ' \f\n\r\t\v');
            }
            key = trim(key, '\'"');

            if (object === undefined || object === null || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
                break;
            }

            object = object[key];

            if (object === undefined) {
                break;
            }
        }

        return object !== undefined ? object : defaultValue;
    };
}();

/***/ }),

/***/ "../node_modules/is-dom/index.js":
/***/ (function(module, exports) {

module.exports = isNode

function isNode (val) {
  return (!val || typeof val !== 'object')
    ? false
    : (typeof window === 'object' && typeof window.Node === 'object')
      ? (val instanceof window.Node)
      : (typeof val.nodeType === 'number') &&
        (typeof val.nodeName === 'string')
}


/***/ }),

/***/ "../node_modules/isarray/index.js":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "../node_modules/jquery/dist/jquery.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.3.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};




	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.3.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc, node );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		div.style.position = "absolute";
		scrollboxSizeVal = div.offsetWidth === 36 || "absolute";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5
		) );
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),
		val = curCSS( elem, dimension, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox;

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = valueIsBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ dimension ] );

	// Fall back to offsetWidth/offsetHeight when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	if ( val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) {

		val = elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ];

		// offsetWidth/offsetHeight provide border-box values
		valueIsBorderBox = true;
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),
				isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra && boxModelAdjustment(
					elem,
					dimension,
					extra,
					isBorderBox,
					styles
				);

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && support.scrollboxSize() === styles.position ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = Date.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
		return jQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),

/***/ "../node_modules/node-libs-browser/node_modules/base64-js/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "../node_modules/node-libs-browser/node_modules/buffer/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__("../node_modules/node-libs-browser/node_modules/base64-js/index.js")
var ieee754 = __webpack_require__("../node_modules/ieee754/index.js")
var isArray = __webpack_require__("../node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/pug-runtime/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pug_has_own_property = Object.prototype.hasOwnProperty;

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = pug_merge;
function pug_merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = pug_merge(attrs, a[i]);
    }
    return attrs;
  }

  for (var key in b) {
    if (key === 'class') {
      var valA = a[key] || [];
      a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
    } else if (key === 'style') {
      var valA = pug_style(a[key]);
      valA = valA && valA[valA.length - 1] !== ';' ? valA + ';' : valA;
      var valB = pug_style(b[key]);
      valB = valB && valB[valB.length - 1] !== ';' ? valB + ';' : valB;
      a[key] = valA + valB;
    } else {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Process array, object, or string as a string of classes delimited by a space.
 *
 * If `val` is an array, all members of it and its subarrays are counted as
 * classes. If `escaping` is an array, then whether or not the item in `val` is
 * escaped depends on the corresponding item in `escaping`. If `escaping` is
 * not an array, no escaping is done.
 *
 * If `val` is an object, all the keys whose value is truthy are counted as
 * classes. No escaping is done.
 *
 * If `val` is a string, it is counted as a class. No escaping is done.
 *
 * @param {(Array.<string>|Object.<string, boolean>|string)} val
 * @param {?Array.<string>} escaping
 * @return {String}
 */
exports.classes = pug_classes;
function pug_classes_array(val, escaping) {
  var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
  for (var i = 0; i < val.length; i++) {
    className = pug_classes(val[i]);
    if (!className) continue;
    escapeEnabled && escaping[i] && (className = pug_escape(className));
    classString = classString + padding + className;
    padding = ' ';
  }
  return classString;
}
function pug_classes_object(val) {
  var classString = '', padding = '';
  for (var key in val) {
    if (key && val[key] && pug_has_own_property.call(val, key)) {
      classString = classString + padding + key;
      padding = ' ';
    }
  }
  return classString;
}
function pug_classes(val, escaping) {
  if (Array.isArray(val)) {
    return pug_classes_array(val, escaping);
  } else if (val && typeof val === 'object') {
    return pug_classes_object(val);
  } else {
    return val || '';
  }
}

/**
 * Convert object or string to a string of CSS styles delimited by a semicolon.
 *
 * @param {(Object.<string, string>|string)} val
 * @return {String}
 */

exports.style = pug_style;
function pug_style(val) {
  if (!val) return '';
  if (typeof val === 'object') {
    var out = '';
    for (var style in val) {
      /* istanbul ignore else */
      if (pug_has_own_property.call(val, style)) {
        out = out + style + ':' + val[style] + ';';
      }
    }
    return out;
  } else {
    return val + '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = pug_attr;
function pug_attr(key, val, escaped, terse) {
  if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
    return '';
  }
  if (val === true) {
    return ' ' + (terse ? key : key + '="' + key + '"');
  }
  if (typeof val.toJSON === 'function') {
    val = val.toJSON();
  }
  if (typeof val !== 'string') {
    val = JSON.stringify(val);
    if (!escaped && val.indexOf('"') !== -1) {
      return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
    }
  }
  if (escaped) val = pug_escape(val);
  return ' ' + key + '="' + val + '"';
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} terse whether to use HTML5 terse boolean attributes
 * @return {String}
 */
exports.attrs = pug_attrs;
function pug_attrs(obj, terse){
  var attrs = '';

  for (var key in obj) {
    if (pug_has_own_property.call(obj, key)) {
      var val = obj[key];

      if ('class' === key) {
        val = pug_classes(val);
        attrs = pug_attr(key, val, false, terse) + attrs;
        continue;
      }
      if ('style' === key) {
        val = pug_style(val);
      }
      attrs += pug_attr(key, val, false, terse);
    }
  }

  return attrs;
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var pug_match_html = /["&<>]/;
exports.escape = pug_escape;
function pug_escape(_html){
  var html = '' + _html;
  var regexResult = pug_match_html.exec(html);
  if (!regexResult) return _html;

  var result = '';
  var i, lastIndex, escape;
  for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
    switch (html.charCodeAt(i)) {
      case 34: escape = '&quot;'; break;
      case 38: escape = '&amp;'; break;
      case 60: escape = '&lt;'; break;
      case 62: escape = '&gt;'; break;
      default: continue;
    }
    if (lastIndex !== i) result += html.substring(lastIndex, i);
    lastIndex = i + 1;
    result += escape;
  }
  if (lastIndex !== i) return result + html.substring(lastIndex, i);
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the pug in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @param {String} str original source
 * @api private
 */

exports.rethrow = pug_rethrow;
function pug_rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || __webpack_require__(0).readFileSync(filename, 'utf8')
  } catch (ex) {
    pug_rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Pug') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};


/***/ }),

/***/ "../node_modules/style-loader/addStyles.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__("../node_modules/style-loader/fixUrls.js");

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "../node_modules/style-loader/fixUrls.js":
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "../node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./JSONTree.json":
/***/ (function(module, exports) {

module.exports = {"path":"src/static/data/Документы","name":"Документы","children":[{"path":"src/static/data/Документы/По предметам","name":"По предметам","children":[{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ","name":"ИБ и ЗИ","children":[{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Лекция №1. Основные термины и определения в области информационной безопасности и защиты информации..xps","name":"Лекция №1. Основные термины и определения в области информационной безопасности и защиты информации..xps","size":436027,"extension":".xps","type":"file"},{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Лекция №2. Вредоносные программы и их классификация..xps","name":"Лекция №2. Вредоносные программы и их классификация..xps","size":497999,"extension":".xps","type":"file"},{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Лекция №3. Законодательный уровень информационной безопасности..xps","name":"Лекция №3. Законодательный уровень информационной безопасности..xps","size":461034,"extension":".xps","type":"file"},{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Лекция №4. Стандарты и спецификации в области информационной безопасности..xps","name":"Лекция №4. Стандарты и спецификации в области информационной безопасности..xps","size":499628,"extension":".xps","type":"file"},{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Лекция №7. Защита информации в информационных системах и компьютерных сетях..xps","name":"Лекция №7. Защита информации в информационных системах и компьютерных сетях..xps","size":479177,"extension":".xps","type":"file"},{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Лекция №8. Технологии и инструменты обеспечения безопасности информации в системах и сетях..xps","name":"Лекция №8. Технологии и инструменты обеспечения безопасности информации в системах и сетях..xps","size":572601,"extension":".xps","type":"file"},{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Лекция №9. Обеспечение интегральной безопасности информационных систем и сетей..xps","name":"Лекция №9. Обеспечение интегральной безопасности информационных систем и сетей..xps","size":515467,"extension":".xps","type":"file"},{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 1.xps","name":"Практическая работа № 1.xps","size":438964,"extension":".xps","type":"file"},{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 2.xps","name":"Практическая работа № 2.xps","size":415959,"extension":".xps","type":"file"},{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 3.xps","name":"Практическая работа № 3.xps","size":446009,"extension":".xps","type":"file"},{"path":"src/static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 4.xps","name":"Практическая работа № 4.xps","size":426792,"extension":".xps","type":"file"}],"size":5189657,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Информационные сети","name":"Информационные сети","children":[{"path":"src/static/data/Документы/По предметам/Информационные сети/Книги","name":"Книги","children":[{"path":"src/static/data/Документы/По предметам/Информационные сети/Книги/networks.pdf","name":"networks.pdf","size":10561285,"extension":".pdf","type":"file"}],"size":10561285,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции","name":"Лекции","children":[{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L1.docx","name":"L1.docx","size":15354,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L11.pdf","name":"L11.pdf","size":265987,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L2.docx","name":"L2.docx","size":158391,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L21.pdf","name":"L21.pdf","size":304424,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L3.docx","name":"L3.docx","size":46546,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L31.pdf","name":"L31.pdf","size":218075,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L4.docx","name":"L4.docx","size":52415,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L41.pdf","name":"L41.pdf","size":236850,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L5.docx","name":"L5.docx","size":34265,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L51.pdf","name":"L51.pdf","size":206227,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L6.docx","name":"L6.docx","size":46461,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L61.pdf","name":"L61.pdf","size":248799,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L7.docx","name":"L7.docx","size":28681,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L71.pdf","name":"L71.pdf","size":343102,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L8.docx","name":"L8.docx","size":39426,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Лекции/L81.pdf","name":"L81.pdf","size":234337,"extension":".pdf","type":"file"}],"size":2479340,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика","name":"Практика","children":[{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/----Задание на практическое занятие 3.docx","name":"----Задание на практическое занятие 3.docx","size":117513,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/----Задание на практическое занятие 5.docx","name":"----Задание на практическое занятие 5.docx","size":28471,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/----Лабораторная работа 1 (1).docx","name":"----Лабораторная работа 1 (1).docx","size":16502,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/----Практическая работа 1.docx","name":"----Практическая работа 1.docx","size":16073,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/----Практическая работа 2.docx","name":"----Практическая работа 2.docx","size":29601,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/Lab1.pdf","name":"Lab1.pdf","size":180563,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/Lab2.pdf","name":"Lab2.pdf","size":200277,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/Lab3.pdf","name":"Lab3.pdf","size":209681,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/Pr1.pdf","name":"Pr1.pdf","size":307433,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/Pr2.pdf","name":"Pr2.pdf","size":251717,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/Pr3.pdf","name":"Pr3.pdf","size":209648,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Практика/Лабораторная работа 4.docx","name":"Лабораторная работа 4.docx","size":17134,"extension":".docx","type":"file"}],"size":1584613,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты","name":"Тесты","children":[{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты/test_01.exe","name":"test_01.exe","size":15360,"extension":".exe","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты/test_02.exe","name":"test_02.exe","size":13824,"extension":".exe","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты/test_03.exe","name":"test_03.exe","size":15360,"extension":".exe","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты/test_04.exe","name":"test_04.exe","size":14336,"extension":".exe","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты/test_05.exe","name":"test_05.exe","size":14336,"extension":".exe","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты/test_06.exe","name":"test_06.exe","size":14336,"extension":".exe","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты/test_07.exe","name":"test_07.exe","size":13824,"extension":".exe","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты/test_08.exe","name":"test_08.exe","size":14336,"extension":".exe","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты/Тест7.docx","name":"Тест7.docx","size":13964,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Информационные сети/Тесты/Тест8.docx","name":"Тест8.docx","size":12673,"extension":".docx","type":"file"}],"size":142349,"type":"directory"}],"size":14767587,"type":"directory"},{"path":"src/static/data/Документы/По предметам/КИС","name":"КИС","children":[{"path":"src/static/data/Документы/По предметам/КИС/Лекции","name":"Лекции","children":[{"path":"src/static/data/Документы/По предметам/КИС/Лекции/1-Структура и классификация КИС..pdf","name":"1-Структура и классификация КИС..pdf","size":227192,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Лекции/2-Модели MRP, MRPII, ERP, ASP..pdf","name":"2-Модели MRP, MRPII, ERP, ASP..pdf","size":451074,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Лекции/3-Корпоративная сеть.pdf","name":"3-Корпоративная сеть.pdf","size":437313,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Лекции/4-Создание клиент-серверных приложений в СУБД SQL Server..pdf","name":"4-Создание клиент-серверных приложений в СУБД SQL Server..pdf","size":446954,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Лекции/5-Архитектура системы безопасности СУБД SQL Server 2000..pdf","name":"5-Архитектура системы безопасности СУБД SQL Server 2000..pdf","size":472162,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Лекции/6-Технология OLAP..pdf","name":"6-Технология OLAP..pdf","size":580882,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Лекции/7-Хранилище данных..pdf","name":"7-Хранилище данных..pdf","size":398874,"extension":".pdf","type":"file"}],"size":3014451,"type":"directory"},{"path":"src/static/data/Документы/По предметам/КИС/Практические работы","name":"Практические работы","children":[{"path":"src/static/data/Документы/По предметам/КИС/Практические работы/1-Создание модели корпоративной базы данных и хранилища данных.pdf","name":"1-Создание модели корпоративной базы данных и хранилища данных.pdf","size":293872,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Практические работы/2-Заполнение хранилищ данных с помощью Data Transformation Services.pdf","name":"2-Заполнение хранилищ данных с помощью Data Transformation Services.pdf","size":462892,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Практические работы/3-Создание многомерных баз данных.pdf","name":"3-Создание многомерных баз данных.pdf","size":539753,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Практические работы/4-OLAP-клиенты.pdf","name":"4-OLAP-клиенты.pdf","size":449663,"extension":".pdf","type":"file"}],"size":1746180,"type":"directory"},{"path":"src/static/data/Документы/По предметам/КИС/Тесты","name":"Тесты","children":[{"path":"src/static/data/Документы/По предметам/КИС/Тесты/1.pdf","name":"1.pdf","size":88258,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Тесты/10.pdf","name":"10.pdf","size":114449,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Тесты/2.pdf","name":"2.pdf","size":84185,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Тесты/3.pdf","name":"3.pdf","size":65663,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Тесты/4.pdf","name":"4.pdf","size":46634,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Тесты/5.pdf","name":"5.pdf","size":47130,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Тесты/6.pdf","name":"6.pdf","size":57894,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Тесты/7.pdf","name":"7.pdf","size":115152,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Тесты/8.pdf","name":"8.pdf","size":148267,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/КИС/Тесты/9.pdf","name":"9.pdf","size":159218,"extension":".pdf","type":"file"}],"size":926850,"type":"directory"}],"size":5687481,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Корпоративные информационные системы","name":"Корпоративные информационные системы","children":[{"path":"src/static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 1.docx","name":"Лекция 1.docx","size":16693,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 2.docx","name":"Лекция 2.docx","size":19180,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 3.docx","name":"Лекция 3.docx","size":14976,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 4.docx","name":"Лекция 4.docx","size":24036,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 5.docx","name":"Лекция 5.docx","size":18372,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 6.docx","name":"Лекция 6.docx","size":19164,"extension":".docx","type":"file"}],"size":112421,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Линейная алгебра","name":"Линейная алгебра","children":[{"path":"src/static/data/Документы/По предметам/Линейная алгебра/TrAlg_1sem_VO_2016.pdf","name":"TrAlg_1sem_VO_2016.pdf","size":706850,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Линейная алгебра/TrAlg_2sem_VO_2016.pdf","name":"TrAlg_2sem_VO_2016.pdf","size":848339,"extension":".pdf","type":"file"}],"size":1555189,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Математический анализ","name":"Математический анализ","children":[{"path":"src/static/data/Документы/По предметам/Математический анализ/TrMa_1sem_VO_2016.pdf","name":"TrMa_1sem_VO_2016.pdf","size":559274,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Математический анализ/TrMa_2sem_VO_2016.pdf","name":"TrMa_2sem_VO_2016.pdf","size":690997,"extension":".pdf","type":"file"}],"size":1250271,"type":"directory"},{"path":"src/static/data/Документы/По предметам/ООП","name":"ООП","children":[{"path":"src/static/data/Документы/По предметам/ООП/Лабораторная работа 1.docx","name":"Лабораторная работа 1.docx","size":1297321,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/ООП/Лабораторная работа 2.docx","name":"Лабораторная работа 2.docx","size":229558,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/ООП/Лабораторная работа 3.docx","name":"Лабораторная работа 3.docx","size":82449,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/ООП/Лабораторная работа 4.docx","name":"Лабораторная работа 4.docx","size":117393,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/ООП/Лабораторная работа 5.docx","name":"Лабораторная работа 5.docx","size":129017,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/ООП/Лабораторная работа 6.docx","name":"Лабораторная работа 6.docx","size":34215,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/ООП/Лабораторная работа 7.docx","name":"Лабораторная работа 7.docx","size":30278,"extension":".docx","type":"file"}],"size":1920231,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем","name":"Технология проектирования информационных систем","children":[{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 1.docx","name":"Лекция 1.docx","size":28902,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 10.docx","name":"Лекция 10.docx","size":25761,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 11.docx","name":"Лекция 11.docx","size":47393,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 12.docx","name":"Лекция 12.docx","size":58343,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 2.docx","name":"Лекция 2.docx","size":29296,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 3.docx","name":"Лекция 3.docx","size":21473,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 4.docx","name":"Лекция 4.docx","size":28544,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 5.docx","name":"Лекция 5.docx","size":23510,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 6.docx","name":"Лекция 6.docx","size":28295,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 7.docx","name":"Лекция 7.docx","size":32227,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 8.docx","name":"Лекция 8.docx","size":27235,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 9.docx","name":"Лекция 9.docx","size":83654,"extension":".docx","type":"file"}],"size":434633,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Физика","name":"Физика","children":[{"path":"src/static/data/Документы/По предметам/Физика/metodicheskie_ukazanija_k_oformleniju_raboti_i_raschetu_oshibok.pdf","name":"metodicheskie_ukazanija_k_oformleniju_raboti_i_raschetu_oshibok.pdf","size":215307,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Физика/pristavki_si.pdf","name":"pristavki_si.pdf","size":178753,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Физика/table_physics_constants.pdf","name":"table_physics_constants.pdf","size":119060,"extension":".pdf","type":"file"},{"path":"src/static/data/Документы/По предметам/Физика/vvedenie_v_teoriju_izmereniy.pdf","name":"vvedenie_v_teoriju_izmereniy.pdf","size":218119,"extension":".pdf","type":"file"}],"size":731239,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Электронный документооборот","name":"Электронный документооборот","children":[{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Лекции","name":"Лекции","children":[{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 1.docx","name":"Лекция 1.docx","size":23258,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 2.docx","name":"Лекция 2.docx","size":22900,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 3.docx","name":"Лекция 3.docx","size":16580,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 4.docx","name":"Лекция 4.docx","size":16332,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 5.docx","name":"Лекция 5.docx","size":16206,"extension":".docx","type":"file"}],"size":95276,"type":"directory"},{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Практические работы","name":"Практические работы","children":[{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 1.docx","name":"Практическая работа 1.docx","size":14003,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 2.docx","name":"Практическая работа 2.docx","size":14054,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 3.docx","name":"Практическая работа 3.docx","size":15198,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 4.docx","name":"Практическая работа 4.docx","size":14845,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 5.docx","name":"Практическая работа 5.docx","size":14124,"extension":".docx","type":"file"}],"size":72224,"type":"directory"}],"size":167500,"type":"directory"}],"size":31816209,"type":"directory"},{"path":"src/static/data/Документы/По семестрам","name":"По семестрам","children":[{"path":"src/static/data/Документы/По семестрам/ 3 семестр","name":" 3 семестр","children":[{"path":"src/static/data/Документы/По семестрам/ 3 семестр/Б1Б11 Структура и алгоритмы обработки данных (готово).docx","name":"Б1Б11 Структура и алгоритмы обработки данных (готово).docx","size":110799,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/ 3 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","name":"Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","size":131072,"extension":".doc","type":"file"}],"size":241871,"type":"directory"},{"path":"src/static/data/Документы/По семестрам/ 7 семестр","name":" 7 семестр","children":[{"path":"src/static/data/Документы/По семестрам/ 7 семестр/Б1ВДВ11_1 Информац-поисковые системы (готово).doc","name":"Б1ВДВ11_1 Информац-поисковые системы (готово).doc","size":210432,"extension":".doc","type":"file"},{"path":"src/static/data/Документы/По семестрам/ 7 семестр/Б1ВДВ9_2 Мультиагентные информационные системы (готово).docx","name":"Б1ВДВ9_2 Мультиагентные информационные системы (готово).docx","size":77207,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/ 7 семестр/Б1ВОД11 Мировые информационные ресурсы (готово).docx","name":"Б1ВОД11 Мировые информационные ресурсы (готово).docx","size":89598,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/ 7 семестр/Б1ВОД12 Управление ИТ-проектами (готовое).docx","name":"Б1ВОД12 Управление ИТ-проектами (готовое).docx","size":73170,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/ 7 семестр/Б1ВОД13 Безопасность функционирования информационных систем (готово).docx","name":"Б1ВОД13 Безопасность функционирования информационных систем (готово).docx","size":64736,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/ 7 семестр/Б1ВОД14 Разработка программного обеспечения для корпоративных информационных систем (готово).doc","name":"Б1ВОД14 Разработка программного обеспечения для корпоративных информационных систем (готово).doc","size":146944,"extension":".doc","type":"file"},{"path":"src/static/data/Документы/По семестрам/ 7 семестр/Б1ВОД7 Проектирование информационных систем (готово).doc","name":"Б1ВОД7 Проектирование информационных систем (готово).doc","size":135168,"extension":".doc","type":"file"},{"path":"src/static/data/Документы/По семестрам/ 7 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","name":"Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","size":131072,"extension":".doc","type":"file"}],"size":928327,"type":"directory"},{"path":"src/static/data/Документы/По семестрам/1 семестр","name":"1 семестр","children":[{"path":"src/static/data/Документы/По семестрам/1 семестр/Б1ВОД1 Процедурное программирование (готово).docx","name":"Б1ВОД1 Процедурное программирование (готово).docx","size":58645,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/1 семестр/Б1ВОД16 Программная инженерия для корпоративных информационных систем (готово).docx","name":"Б1ВОД16 Программная инженерия для корпоративных информационных систем (готово).docx","size":90804,"extension":".docx","type":"file"}],"size":149449,"type":"directory"},{"path":"src/static/data/Документы/По семестрам/2 семестр","name":"2 семестр","children":[{"path":"src/static/data/Документы/По семестрам/2 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","name":"Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","size":131072,"extension":".doc","type":"file"}],"size":131072,"type":"directory"},{"path":"src/static/data/Документы/По семестрам/4 семестр","name":"4 семестр","children":[{"path":"src/static/data/Документы/По семестрам/4 семестр/Б1Б11 Структура и алгоритмы обработки данных (готово).docx","name":"Б1Б11 Структура и алгоритмы обработки данных (готово).docx","size":110799,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/4 семестр/Б1Б19 Информационные системы и технологии (готово).docx","name":"Б1Б19 Информационные системы и технологии (готово).docx","size":56128,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/4 семестр/Б1ВДВ8_1 Открытые информационные системы (готово).doc","name":"Б1ВДВ8_1 Открытые информационные системы (готово).doc","size":197120,"extension":".doc","type":"file"},{"path":"src/static/data/Документы/По семестрам/4 семестр/Б1ВДВ8_2 Методы функциональной стандартизации (готово).doc","name":"Б1ВДВ8_2 Методы функциональной стандартизации (готово).doc","size":194048,"extension":".doc","type":"file"},{"path":"src/static/data/Документы/По семестрам/4 семестр/Б1ВОД15 Качество, стандартизация и сертификация информационных систем (готово).doc","name":"Б1ВОД15 Качество, стандартизация и сертификация информационных систем (готово).doc","size":215040,"extension":".doc","type":"file"},{"path":"src/static/data/Документы/По семестрам/4 семестр/Б1ВОД3 Разработка программных приложений (готово).docx","name":"Б1ВОД3 Разработка программных приложений (готово).docx","size":60633,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/4 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","name":"Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","size":131072,"extension":".doc","type":"file"}],"size":964840,"type":"directory"},{"path":"src/static/data/Документы/По семестрам/5 семестр","name":"5 семестр","children":[{"path":"src/static/data/Документы/По семестрам/5 семестр/Б1Б19 Информационные системы и технологии (готово).docx","name":"Б1Б19 Информационные системы и технологии (готово).docx","size":56128,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/5 семестр/Б1ВДВ10_1 Сопровождение информационных систем (готово).docx","name":"Б1ВДВ10_1 Сопровождение информационных систем (готово).docx","size":73993,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/5 семестр/Б1ВДВ11_2 Математические методы в информационных технологиях (готово).docx","name":"Б1ВДВ11_2 Математические методы в информационных технологиях (готово).docx","size":81707,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/5 семестр/Б1ВДВ4_1 Корпоративные информационные системы (готово).docx","name":"Б1ВДВ4_1 Корпоративные информационные системы (готово).docx","size":85323,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/5 семестр/Б1ВДВ4_2 Интерфейсы информационных систем (готово).docx","name":"Б1ВДВ4_2 Интерфейсы информационных систем (готово).docx","size":61756,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/5 семестр/Б1ВДВ5_1 Оценка качества информационных систем (готово).docx","name":"Б1ВДВ5_1 Оценка качества информационных систем (готово).docx","size":52812,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/5 семестр/Б1ВДВ5_2 Сертификация информационных систем (готово).docx","name":"Б1ВДВ5_2 Сертификация информационных систем (готово).docx","size":73636,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/5 семестр/Б1ВДВ6_2 Математические основы защиты информации (готово).docx","name":"Б1ВДВ6_2 Математические основы защиты информации (готово).docx","size":81754,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/5 семестр/Б1ВОД4 Разработка клиент-серверных приложений (готово).docx","name":"Б1ВОД4 Разработка клиент-серверных приложений (готово).docx","size":55611,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/5 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","name":"Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","size":131072,"extension":".doc","type":"file"}],"size":753792,"type":"directory"},{"path":"src/static/data/Документы/По семестрам/6 семестр","name":"6 семестр","children":[{"path":"src/static/data/Документы/По семестрам/6 семестр/Б1Б10 Анализ сложности алгоритмов (готово).docx","name":"Б1Б10 Анализ сложности алгоритмов (готово).docx","size":45995,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/6 семестр/Б1ВДВ6_1 Информационная безопасность и защита информации (готово).doc","name":"Б1ВДВ6_1 Информационная безопасность и защита информации (готово).doc","size":249344,"extension":".doc","type":"file"},{"path":"src/static/data/Документы/По семестрам/6 семестр/Б1ВДВ7_1 Технологии визуализации информации (готово).docx","name":"Б1ВДВ7_1 Технологии визуализации информации (готово).docx","size":59222,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/6 семестр/Б1ВДВ7_2 Проектирование графических моделей (готово).docx","name":"Б1ВДВ7_2 Проектирование графических моделей (готово).docx","size":57981,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/6 семестр/Б1ВДВ9_1 Системы электронного документооборота (готово).docx","name":"Б1ВДВ9_1 Системы электронного документооборота (готово).docx","size":47706,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/6 семестр/Б1ВОД10 Интеллектуальные системы и технологии (готово).docx","name":"Б1ВОД10 Интеллектуальные системы и технологии (готово).docx","size":81854,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/6 семестр/Б1ВОД8 Теория систем и системный анализ (готово).docx","name":"Б1ВОД8 Теория систем и системный анализ (готово).docx","size":58368,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/6 семестр/Б1ВОД9 Моделирование систем (готово).doc","name":"Б1ВОД9 Моделирование систем (готово).doc","size":250368,"extension":".doc","type":"file"},{"path":"src/static/data/Документы/По семестрам/6 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","name":"Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc","size":131072,"extension":".doc","type":"file"}],"size":981910,"type":"directory"},{"path":"src/static/data/Документы/По семестрам/8 семестр","name":"8 семестр","children":[{"path":"src/static/data/Документы/По семестрам/8 семестр/Б1ВДВ10_2 Менеджмент информационных систем (готово).docx","name":"Б1ВДВ10_2 Менеджмент информационных систем (готово).docx","size":82378,"extension":".docx","type":"file"},{"path":"src/static/data/Документы/По семестрам/8 семестр/Б2Г1 Государственный экзамен (готово).doc","name":"Б2Г1 Государственный экзамен (готово).doc","size":230912,"extension":".doc","type":"file"},{"path":"src/static/data/Документы/По семестрам/8 семестр/Б2Д1 Выпускная квалификационная работа (готово).doc","name":"Б2Д1 Выпускная квалификационная работа (готово).doc","size":217600,"extension":".doc","type":"file"},{"path":"src/static/data/Документы/По семестрам/8 семестр/Б2П2 Преддипломная практика(готово).doc","name":"Б2П2 Преддипломная практика(готово).doc","size":103424,"extension":".doc","type":"file"}],"size":634314,"type":"directory"}],"size":4785575,"type":"directory"}],"size":36601784,"type":"directory"}

/***/ }),

/***/ "./scripts/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__("../node_modules/jquery/dist/jquery.js");

var _jquery2 = _interopRequireDefault(_jquery);

var _getViewportSize = __webpack_require__("../node_modules/get-viewport-size/index.js");

var _getViewportSize2 = _interopRequireDefault(_getViewportSize);

__webpack_require__("./views/index.pug");

__webpack_require__("./styles/main.styl");

__webpack_require__("./scripts/static-init.js");

var _jqueryConstants = __webpack_require__("./scripts/jquery-constants.js");

var _jqueryConstants2 = _interopRequireDefault(_jqueryConstants);

var _tree = __webpack_require__("./scripts/tree.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jqueryConstants2.default.headerElement.on("click", function () {
	var currentTabIndex = (0, _jquery2.default)(this).data("tab");
	_jqueryConstants2.default.headerElement.removeClass(_jqueryConstants2.default.headerElementActiveClass);
	(0, _jquery2.default)(this).addClass(_jqueryConstants2.default.headerElementActiveClass);
	(0, _jquery2.default)(".tabs-content-element").removeClass("tabs-content-element--active");
	(0, _jquery2.default)(".tabs-content-element--" + currentTabIndex).addClass("tabs-content-element--active");
});

(0, _jquery2.default)(".header-open-mobile-menu").on("click", function () {
	(0, _jquery2.default)(this).toggleClass("header-open-mobile-menu--close");
	(0, _jquery2.default)(".header-elements").toggleClass("header-elements--mobiled");
	(0, _jquery2.default)(".header-overlay").toggleClass("header-overlay--active");
});

(0, _jquery2.default)(window).on("resize", function () {
	if ((0, _getViewportSize2.default)().width > 722) {
		(0, _jquery2.default)(".header-elements").removeClass("header-elements--mobiled");
		(0, _jquery2.default)(".header-overlay").removeClass("header-overlay--active");
		(0, _jquery2.default)(".header-open-mobile-menu").removeClass("header-open-mobile-menu--close");
	}
});

(0, _jquery2.default)(".dropdown-menu-header").bind("click", function () {
	var dropdownMenuElements = (0, _jquery2.default)(this).parent().children(".dropdown-menu-elements");
	(0, _jquery2.default)(this).toggleClass("dropdown-menu-header--active");
	dropdownMenuElements.toggleClass("dropdown-menu-elements--active");
	if ((0, _jquery2.default)(this).hasClass("dropdown-menu-header--active")) {
		(0, _jquery2.default)("html, body").animate({ scrollTop: dropdownMenuElements.offset().top - 100 }, "slow");
		return false;
	}
});

(0, _tree.getTree)();

/***/ }),

/***/ "./scripts/index.styl":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/autoprefixer-loader/index.js?{browsers:[\"Android >= 4\",\"Chrome >= 42\",\"Firefox >= 37\",\"Explorer >= 10\",\"iOS >= 7\",\"Opera >= 28\",\"Safari >= 7\"]}!../node_modules/stylus-loader/index.js?{\"sourceMap\":true}!./scripts/index.styl");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/autoprefixer-loader/index.js?{browsers:[\"Android >= 4\",\"Chrome >= 42\",\"Firefox >= 37\",\"Explorer >= 10\",\"iOS >= 7\",\"Opera >= 28\",\"Safari >= 7\"]}!../node_modules/stylus-loader/index.js?{\"sourceMap\":true}!./scripts/index.styl", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/autoprefixer-loader/index.js?{browsers:[\"Android >= 4\",\"Chrome >= 42\",\"Firefox >= 37\",\"Explorer >= 10\",\"iOS >= 7\",\"Opera >= 28\",\"Safari >= 7\"]}!../node_modules/stylus-loader/index.js?{\"sourceMap\":true}!./scripts/index.styl");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./scripts/jquery-constants.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _jquery = __webpack_require__("../node_modules/jquery/dist/jquery.js");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	headerElement: (0, _jquery2.default)(".header-elements__element"),
	headerElementActiveClass: "header-elements__element--active"
};

/***/ }),

/***/ "./scripts/renderer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderer = undefined;

var _html5Tag = __webpack_require__("../node_modules/html5-tag/lib/index.js");

var _html5Tag2 = _interopRequireDefault(_html5Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderer = exports.renderer = function renderer(node, treeOptions) {
  var type = node.type,
      path = node.path,
      name = node.name,
      state = node.state;

  console.log(node);
  var depthClass = 'depth--' + state.depth;
  var isDir = type === 'directory';
  if (isDir) {
    return (0, _html5Tag2.default)('div', { class: 'dir ' + depthClass }, name);
  } else {
    var currentPath = './docs/' + path.split('/').pop();
    return (0, _html5Tag2.default)('a', { href: currentPath, download: true, class: 'link ' + depthClass }, name);
  }
};

/***/ }),

/***/ "./scripts/static-init.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("./static/data/Документы recursive \\.(doc|docx|xps|pdf|exe)$");

/***/ }),

/***/ "./scripts/tree.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTree = getTree;

var _infiniteTree = __webpack_require__("../node_modules/infinite-tree/lib/index.js");

var _infiniteTree2 = _interopRequireDefault(_infiniteTree);

__webpack_require__("../node_modules/infinite-tree/dist/infinite-tree.css");

var _JSONTree = __webpack_require__("./JSONTree.json");

var _JSONTree2 = _interopRequireDefault(_JSONTree);

var _renderer = __webpack_require__("./scripts/renderer.js");

__webpack_require__("./scripts/index.styl");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTree() {
  var tree = new _infiniteTree2.default({
    el: document.querySelector('#documents-tree'),
    data: _JSONTree2.default,
    autoOpen: true,
    rowRenderer: _renderer.renderer,
    shouldLoadNodes: function shouldLoadNodes(parentNode) {
      if (!parentNode.hasChildren() && parentNode.loadOnDemand) {
        return true;
      }
      return false;
    }

  });
}

/***/ }),

/***/ "./static/assets/fonts/PTSans/PTSans-Bold.ttf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/PTSans-Bold.ttf";

/***/ }),

/***/ "./static/assets/fonts/PTSans/PTSans-BoldItalic.ttf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/PTSans-BoldItalic.ttf";

/***/ }),

/***/ "./static/assets/fonts/PTSans/PTSans-Italic.ttf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/PTSans-Italic.ttf";

/***/ }),

/***/ "./static/assets/fonts/PTSans/PTSans-Regular.ttf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/PTSans-Regular.ttf";

/***/ }),

/***/ "./static/assets/images/bg-header.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/bg-header.png";

/***/ }),

/***/ "./static/assets/images/icons/arrow-down.svg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/arrow-down.svg";

/***/ }),

/***/ "./static/assets/images/icons/burger.svg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/burger.svg";

/***/ }),

/***/ "./static/assets/images/icons/close.svg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/close.svg";

/***/ }),

/***/ "./static/assets/images/logo-mirea.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/logo-mirea.png";

/***/ }),

/***/ "./static/assets/images/professors/aldobaeva.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/aldobaeva.jpg";

/***/ }),

/***/ "./static/assets/images/professors/andrianova.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/andrianova.jpg";

/***/ }),

/***/ "./static/assets/images/professors/bagrov.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/bagrov.jpg";

/***/ }),

/***/ "./static/assets/images/professors/bashlykova.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/bashlykova.jpg";

/***/ }),

/***/ "./static/assets/images/professors/davydov.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/davydov.jpg";

/***/ }),

/***/ "./static/assets/images/professors/mirzoyan.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/mirzoyan.jpg";

/***/ }),

/***/ "./static/assets/images/professors/nemenko.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/nemenko.jpg";

/***/ }),

/***/ "./static/assets/images/professors/noavatar.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/noavatar.png";

/***/ }),

/***/ "./static/assets/images/professors/panov.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/panov.jpg";

/***/ }),

/***/ "./static/assets/images/professors/petrov.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/petrov.png";

/***/ }),

/***/ "./static/assets/images/professors/proshaeva.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/proshaeva.jpg";

/***/ }),

/***/ "./static/assets/images/professors/tomashevskaya.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/tomashevskaya.jpg";

/***/ }),

/***/ "./static/assets/images/professors/trokhachenkova.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/trokhachenkova.jpg";

/***/ }),

/***/ "./static/data/Документы recursive \\.(doc|docx|xps|pdf|exe)$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./По предметам/ИБ и ЗИ/Лекция №1. Основные термины и определения в области информационной безопасности и защиты информации..xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №1. Основные термины и определения в области информационной безопасности и защиты информации..xps",
	"./По предметам/ИБ и ЗИ/Лекция №2. Вредоносные программы и их классификация..xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №2. Вредоносные программы и их классификация..xps",
	"./По предметам/ИБ и ЗИ/Лекция №3. Законодательный уровень информационной безопасности..xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №3. Законодательный уровень информационной безопасности..xps",
	"./По предметам/ИБ и ЗИ/Лекция №4. Стандарты и спецификации в области информационной безопасности..xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №4. Стандарты и спецификации в области информационной безопасности..xps",
	"./По предметам/ИБ и ЗИ/Лекция №7. Защита информации в информационных системах и компьютерных сетях..xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №7. Защита информации в информационных системах и компьютерных сетях..xps",
	"./По предметам/ИБ и ЗИ/Лекция №8. Технологии и инструменты обеспечения безопасности информации в системах и сетях..xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №8. Технологии и инструменты обеспечения безопасности информации в системах и сетях..xps",
	"./По предметам/ИБ и ЗИ/Лекция №9. Обеспечение интегральной безопасности информационных систем и сетей..xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №9. Обеспечение интегральной безопасности информационных систем и сетей..xps",
	"./По предметам/ИБ и ЗИ/Практическая работа № 1.xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 1.xps",
	"./По предметам/ИБ и ЗИ/Практическая работа № 2.xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 2.xps",
	"./По предметам/ИБ и ЗИ/Практическая работа № 3.xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 3.xps",
	"./По предметам/ИБ и ЗИ/Практическая работа № 4.xps": "./static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 4.xps",
	"./По предметам/Информационные сети/Книги/networks.pdf": "./static/data/Документы/По предметам/Информационные сети/Книги/networks.pdf",
	"./По предметам/Информационные сети/Лекции/L1.docx": "./static/data/Документы/По предметам/Информационные сети/Лекции/L1.docx",
	"./По предметам/Информационные сети/Лекции/L11.pdf": "./static/data/Документы/По предметам/Информационные сети/Лекции/L11.pdf",
	"./По предметам/Информационные сети/Лекции/L2.docx": "./static/data/Документы/По предметам/Информационные сети/Лекции/L2.docx",
	"./По предметам/Информационные сети/Лекции/L21.pdf": "./static/data/Документы/По предметам/Информационные сети/Лекции/L21.pdf",
	"./По предметам/Информационные сети/Лекции/L3.docx": "./static/data/Документы/По предметам/Информационные сети/Лекции/L3.docx",
	"./По предметам/Информационные сети/Лекции/L31.pdf": "./static/data/Документы/По предметам/Информационные сети/Лекции/L31.pdf",
	"./По предметам/Информационные сети/Лекции/L4.docx": "./static/data/Документы/По предметам/Информационные сети/Лекции/L4.docx",
	"./По предметам/Информационные сети/Лекции/L41.pdf": "./static/data/Документы/По предметам/Информационные сети/Лекции/L41.pdf",
	"./По предметам/Информационные сети/Лекции/L5.docx": "./static/data/Документы/По предметам/Информационные сети/Лекции/L5.docx",
	"./По предметам/Информационные сети/Лекции/L51.pdf": "./static/data/Документы/По предметам/Информационные сети/Лекции/L51.pdf",
	"./По предметам/Информационные сети/Лекции/L6.docx": "./static/data/Документы/По предметам/Информационные сети/Лекции/L6.docx",
	"./По предметам/Информационные сети/Лекции/L61.pdf": "./static/data/Документы/По предметам/Информационные сети/Лекции/L61.pdf",
	"./По предметам/Информационные сети/Лекции/L7.docx": "./static/data/Документы/По предметам/Информационные сети/Лекции/L7.docx",
	"./По предметам/Информационные сети/Лекции/L71.pdf": "./static/data/Документы/По предметам/Информационные сети/Лекции/L71.pdf",
	"./По предметам/Информационные сети/Лекции/L8.docx": "./static/data/Документы/По предметам/Информационные сети/Лекции/L8.docx",
	"./По предметам/Информационные сети/Лекции/L81.pdf": "./static/data/Документы/По предметам/Информационные сети/Лекции/L81.pdf",
	"./По предметам/Информационные сети/Практика/----Задание на практическое занятие 3.docx": "./static/data/Документы/По предметам/Информационные сети/Практика/----Задание на практическое занятие 3.docx",
	"./По предметам/Информационные сети/Практика/----Задание на практическое занятие 5.docx": "./static/data/Документы/По предметам/Информационные сети/Практика/----Задание на практическое занятие 5.docx",
	"./По предметам/Информационные сети/Практика/----Лабораторная работа 1 (1).docx": "./static/data/Документы/По предметам/Информационные сети/Практика/----Лабораторная работа 1 (1).docx",
	"./По предметам/Информационные сети/Практика/----Практическая работа 1.docx": "./static/data/Документы/По предметам/Информационные сети/Практика/----Практическая работа 1.docx",
	"./По предметам/Информационные сети/Практика/----Практическая работа 2.docx": "./static/data/Документы/По предметам/Информационные сети/Практика/----Практическая работа 2.docx",
	"./По предметам/Информационные сети/Практика/Lab1.pdf": "./static/data/Документы/По предметам/Информационные сети/Практика/Lab1.pdf",
	"./По предметам/Информационные сети/Практика/Lab2.pdf": "./static/data/Документы/По предметам/Информационные сети/Практика/Lab2.pdf",
	"./По предметам/Информационные сети/Практика/Lab3.pdf": "./static/data/Документы/По предметам/Информационные сети/Практика/Lab3.pdf",
	"./По предметам/Информационные сети/Практика/Pr1.pdf": "./static/data/Документы/По предметам/Информационные сети/Практика/Pr1.pdf",
	"./По предметам/Информационные сети/Практика/Pr2.pdf": "./static/data/Документы/По предметам/Информационные сети/Практика/Pr2.pdf",
	"./По предметам/Информационные сети/Практика/Pr3.pdf": "./static/data/Документы/По предметам/Информационные сети/Практика/Pr3.pdf",
	"./По предметам/Информационные сети/Практика/Лабораторная работа 4.docx": "./static/data/Документы/По предметам/Информационные сети/Практика/Лабораторная работа 4.docx",
	"./По предметам/Информационные сети/Тесты/test_01.exe": "./static/data/Документы/По предметам/Информационные сети/Тесты/test_01.exe",
	"./По предметам/Информационные сети/Тесты/test_02.exe": "./static/data/Документы/По предметам/Информационные сети/Тесты/test_02.exe",
	"./По предметам/Информационные сети/Тесты/test_03.exe": "./static/data/Документы/По предметам/Информационные сети/Тесты/test_03.exe",
	"./По предметам/Информационные сети/Тесты/test_04.exe": "./static/data/Документы/По предметам/Информационные сети/Тесты/test_04.exe",
	"./По предметам/Информационные сети/Тесты/test_05.exe": "./static/data/Документы/По предметам/Информационные сети/Тесты/test_05.exe",
	"./По предметам/Информационные сети/Тесты/test_06.exe": "./static/data/Документы/По предметам/Информационные сети/Тесты/test_06.exe",
	"./По предметам/Информационные сети/Тесты/test_07.exe": "./static/data/Документы/По предметам/Информационные сети/Тесты/test_07.exe",
	"./По предметам/Информационные сети/Тесты/test_08.exe": "./static/data/Документы/По предметам/Информационные сети/Тесты/test_08.exe",
	"./По предметам/Информационные сети/Тесты/Тест7.docx": "./static/data/Документы/По предметам/Информационные сети/Тесты/Тест7.docx",
	"./По предметам/Информационные сети/Тесты/Тест8.docx": "./static/data/Документы/По предметам/Информационные сети/Тесты/Тест8.docx",
	"./По предметам/КИС/Лекции/1-Структура и классификация КИС..pdf": "./static/data/Документы/По предметам/КИС/Лекции/1-Структура и классификация КИС..pdf",
	"./По предметам/КИС/Лекции/2-Модели MRP, MRPII, ERP, ASP..pdf": "./static/data/Документы/По предметам/КИС/Лекции/2-Модели MRP, MRPII, ERP, ASP..pdf",
	"./По предметам/КИС/Лекции/3-Корпоративная сеть.pdf": "./static/data/Документы/По предметам/КИС/Лекции/3-Корпоративная сеть.pdf",
	"./По предметам/КИС/Лекции/4-Создание клиент-серверных приложений в СУБД SQL Server..pdf": "./static/data/Документы/По предметам/КИС/Лекции/4-Создание клиент-серверных приложений в СУБД SQL Server..pdf",
	"./По предметам/КИС/Лекции/5-Архитектура системы безопасности СУБД SQL Server 2000..pdf": "./static/data/Документы/По предметам/КИС/Лекции/5-Архитектура системы безопасности СУБД SQL Server 2000..pdf",
	"./По предметам/КИС/Лекции/6-Технология OLAP..pdf": "./static/data/Документы/По предметам/КИС/Лекции/6-Технология OLAP..pdf",
	"./По предметам/КИС/Лекции/7-Хранилище данных..pdf": "./static/data/Документы/По предметам/КИС/Лекции/7-Хранилище данных..pdf",
	"./По предметам/КИС/Практические работы/1-Создание модели корпоративной базы данных и хранилища данных.pdf": "./static/data/Документы/По предметам/КИС/Практические работы/1-Создание модели корпоративной базы данных и хранилища данных.pdf",
	"./По предметам/КИС/Практические работы/2-Заполнение хранилищ данных с помощью Data Transformation Services.pdf": "./static/data/Документы/По предметам/КИС/Практические работы/2-Заполнение хранилищ данных с помощью Data Transformation Services.pdf",
	"./По предметам/КИС/Практические работы/3-Создание многомерных баз данных.pdf": "./static/data/Документы/По предметам/КИС/Практические работы/3-Создание многомерных баз данных.pdf",
	"./По предметам/КИС/Практические работы/4-OLAP-клиенты.pdf": "./static/data/Документы/По предметам/КИС/Практические работы/4-OLAP-клиенты.pdf",
	"./По предметам/КИС/Тесты/1.pdf": "./static/data/Документы/По предметам/КИС/Тесты/1.pdf",
	"./По предметам/КИС/Тесты/10.pdf": "./static/data/Документы/По предметам/КИС/Тесты/10.pdf",
	"./По предметам/КИС/Тесты/2.pdf": "./static/data/Документы/По предметам/КИС/Тесты/2.pdf",
	"./По предметам/КИС/Тесты/3.pdf": "./static/data/Документы/По предметам/КИС/Тесты/3.pdf",
	"./По предметам/КИС/Тесты/4.pdf": "./static/data/Документы/По предметам/КИС/Тесты/4.pdf",
	"./По предметам/КИС/Тесты/5.pdf": "./static/data/Документы/По предметам/КИС/Тесты/5.pdf",
	"./По предметам/КИС/Тесты/6.pdf": "./static/data/Документы/По предметам/КИС/Тесты/6.pdf",
	"./По предметам/КИС/Тесты/7.pdf": "./static/data/Документы/По предметам/КИС/Тесты/7.pdf",
	"./По предметам/КИС/Тесты/8.pdf": "./static/data/Документы/По предметам/КИС/Тесты/8.pdf",
	"./По предметам/КИС/Тесты/9.pdf": "./static/data/Документы/По предметам/КИС/Тесты/9.pdf",
	"./По предметам/Корпоративные информационные системы/Лекция 1.docx": "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 1.docx",
	"./По предметам/Корпоративные информационные системы/Лекция 2.docx": "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 2.docx",
	"./По предметам/Корпоративные информационные системы/Лекция 3.docx": "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 3.docx",
	"./По предметам/Корпоративные информационные системы/Лекция 4.docx": "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 4.docx",
	"./По предметам/Корпоративные информационные системы/Лекция 5.docx": "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 5.docx",
	"./По предметам/Корпоративные информационные системы/Лекция 6.docx": "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 6.docx",
	"./По предметам/Линейная алгебра/TrAlg_1sem_VO_2016.pdf": "./static/data/Документы/По предметам/Линейная алгебра/TrAlg_1sem_VO_2016.pdf",
	"./По предметам/Линейная алгебра/TrAlg_2sem_VO_2016.pdf": "./static/data/Документы/По предметам/Линейная алгебра/TrAlg_2sem_VO_2016.pdf",
	"./По предметам/Математический анализ/TrMa_1sem_VO_2016.pdf": "./static/data/Документы/По предметам/Математический анализ/TrMa_1sem_VO_2016.pdf",
	"./По предметам/Математический анализ/TrMa_2sem_VO_2016.pdf": "./static/data/Документы/По предметам/Математический анализ/TrMa_2sem_VO_2016.pdf",
	"./По предметам/ООП/Лабораторная работа 1.docx": "./static/data/Документы/По предметам/ООП/Лабораторная работа 1.docx",
	"./По предметам/ООП/Лабораторная работа 2.docx": "./static/data/Документы/По предметам/ООП/Лабораторная работа 2.docx",
	"./По предметам/ООП/Лабораторная работа 3.docx": "./static/data/Документы/По предметам/ООП/Лабораторная работа 3.docx",
	"./По предметам/ООП/Лабораторная работа 4.docx": "./static/data/Документы/По предметам/ООП/Лабораторная работа 4.docx",
	"./По предметам/ООП/Лабораторная работа 5.docx": "./static/data/Документы/По предметам/ООП/Лабораторная работа 5.docx",
	"./По предметам/ООП/Лабораторная работа 6.docx": "./static/data/Документы/По предметам/ООП/Лабораторная работа 6.docx",
	"./По предметам/ООП/Лабораторная работа 7.docx": "./static/data/Документы/По предметам/ООП/Лабораторная работа 7.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 1.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 1.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 10.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 10.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 11.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 11.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 12.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 12.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 2.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 2.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 3.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 3.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 4.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 4.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 5.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 5.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 6.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 6.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 7.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 7.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 8.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 8.docx",
	"./По предметам/Технология проектирования информационных систем/Лекция 9.docx": "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 9.docx",
	"./По предметам/Физика/metodicheskie_ukazanija_k_oformleniju_raboti_i_raschetu_oshibok.pdf": "./static/data/Документы/По предметам/Физика/metodicheskie_ukazanija_k_oformleniju_raboti_i_raschetu_oshibok.pdf",
	"./По предметам/Физика/pristavki_si.pdf": "./static/data/Документы/По предметам/Физика/pristavki_si.pdf",
	"./По предметам/Физика/table_physics_constants.pdf": "./static/data/Документы/По предметам/Физика/table_physics_constants.pdf",
	"./По предметам/Физика/vvedenie_v_teoriju_izmereniy.pdf": "./static/data/Документы/По предметам/Физика/vvedenie_v_teoriju_izmereniy.pdf",
	"./По предметам/Электронный документооборот/Лекции/Лекция 1.docx": "./static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 1.docx",
	"./По предметам/Электронный документооборот/Лекции/Лекция 2.docx": "./static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 2.docx",
	"./По предметам/Электронный документооборот/Лекции/Лекция 3.docx": "./static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 3.docx",
	"./По предметам/Электронный документооборот/Лекции/Лекция 4.docx": "./static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 4.docx",
	"./По предметам/Электронный документооборот/Лекции/Лекция 5.docx": "./static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 5.docx",
	"./По предметам/Электронный документооборот/Практические работы/Практическая работа 1.docx": "./static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 1.docx",
	"./По предметам/Электронный документооборот/Практические работы/Практическая работа 2.docx": "./static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 2.docx",
	"./По предметам/Электронный документооборот/Практические работы/Практическая работа 3.docx": "./static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 3.docx",
	"./По предметам/Электронный документооборот/Практические работы/Практическая работа 4.docx": "./static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 4.docx",
	"./По предметам/Электронный документооборот/Практические работы/Практическая работа 5.docx": "./static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 5.docx",
	"./По семестрам/ 3 семестр/Б1Б11 Структура и алгоритмы обработки данных (готово).docx": "./static/data/Документы/По семестрам/ 3 семестр/Б1Б11 Структура и алгоритмы обработки данных (готово).docx",
	"./По семестрам/ 3 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc": "./static/data/Документы/По семестрам/ 3 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc",
	"./По семестрам/ 7 семестр/Б1ВДВ11_1 Информац-поисковые системы (готово).doc": "./static/data/Документы/По семестрам/ 7 семестр/Б1ВДВ11_1 Информац-поисковые системы (готово).doc",
	"./По семестрам/ 7 семестр/Б1ВДВ9_2 Мультиагентные информационные системы (готово).docx": "./static/data/Документы/По семестрам/ 7 семестр/Б1ВДВ9_2 Мультиагентные информационные системы (готово).docx",
	"./По семестрам/ 7 семестр/Б1ВОД11 Мировые информационные ресурсы (готово).docx": "./static/data/Документы/По семестрам/ 7 семестр/Б1ВОД11 Мировые информационные ресурсы (готово).docx",
	"./По семестрам/ 7 семестр/Б1ВОД12 Управление ИТ-проектами (готовое).docx": "./static/data/Документы/По семестрам/ 7 семестр/Б1ВОД12 Управление ИТ-проектами (готовое).docx",
	"./По семестрам/ 7 семестр/Б1ВОД13 Безопасность функционирования информационных систем (готово).docx": "./static/data/Документы/По семестрам/ 7 семестр/Б1ВОД13 Безопасность функционирования информационных систем (готово).docx",
	"./По семестрам/ 7 семестр/Б1ВОД14 Разработка программного обеспечения для корпоративных информационных систем (готово).doc": "./static/data/Документы/По семестрам/ 7 семестр/Б1ВОД14 Разработка программного обеспечения для корпоративных информационных систем (готово).doc",
	"./По семестрам/ 7 семестр/Б1ВОД7 Проектирование информационных систем (готово).doc": "./static/data/Документы/По семестрам/ 7 семестр/Б1ВОД7 Проектирование информационных систем (готово).doc",
	"./По семестрам/ 7 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc": "./static/data/Документы/По семестрам/ 7 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc",
	"./По семестрам/1 семестр/Б1ВОД1 Процедурное программирование (готово).docx": "./static/data/Документы/По семестрам/1 семестр/Б1ВОД1 Процедурное программирование (готово).docx",
	"./По семестрам/1 семестр/Б1ВОД16 Программная инженерия для корпоративных информационных систем (готово).docx": "./static/data/Документы/По семестрам/1 семестр/Б1ВОД16 Программная инженерия для корпоративных информационных систем (готово).docx",
	"./По семестрам/2 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc": "./static/data/Документы/По семестрам/2 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc",
	"./По семестрам/4 семестр/Б1Б11 Структура и алгоритмы обработки данных (готово).docx": "./static/data/Документы/По семестрам/4 семестр/Б1Б11 Структура и алгоритмы обработки данных (готово).docx",
	"./По семестрам/4 семестр/Б1Б19 Информационные системы и технологии (готово).docx": "./static/data/Документы/По семестрам/4 семестр/Б1Б19 Информационные системы и технологии (готово).docx",
	"./По семестрам/4 семестр/Б1ВДВ8_1 Открытые информационные системы (готово).doc": "./static/data/Документы/По семестрам/4 семестр/Б1ВДВ8_1 Открытые информационные системы (готово).doc",
	"./По семестрам/4 семестр/Б1ВДВ8_2 Методы функциональной стандартизации (готово).doc": "./static/data/Документы/По семестрам/4 семестр/Б1ВДВ8_2 Методы функциональной стандартизации (готово).doc",
	"./По семестрам/4 семестр/Б1ВОД15 Качество, стандартизация и сертификация информационных систем (готово).doc": "./static/data/Документы/По семестрам/4 семестр/Б1ВОД15 Качество, стандартизация и сертификация информационных систем (готово).doc",
	"./По семестрам/4 семестр/Б1ВОД3 Разработка программных приложений (готово).docx": "./static/data/Документы/По семестрам/4 семестр/Б1ВОД3 Разработка программных приложений (готово).docx",
	"./По семестрам/4 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc": "./static/data/Документы/По семестрам/4 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc",
	"./По семестрам/5 семестр/Б1Б19 Информационные системы и технологии (готово).docx": "./static/data/Документы/По семестрам/5 семестр/Б1Б19 Информационные системы и технологии (готово).docx",
	"./По семестрам/5 семестр/Б1ВДВ10_1 Сопровождение информационных систем (готово).docx": "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ10_1 Сопровождение информационных систем (готово).docx",
	"./По семестрам/5 семестр/Б1ВДВ11_2 Математические методы в информационных технологиях (готово).docx": "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ11_2 Математические методы в информационных технологиях (готово).docx",
	"./По семестрам/5 семестр/Б1ВДВ4_1 Корпоративные информационные системы (готово).docx": "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ4_1 Корпоративные информационные системы (готово).docx",
	"./По семестрам/5 семестр/Б1ВДВ4_2 Интерфейсы информационных систем (готово).docx": "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ4_2 Интерфейсы информационных систем (готово).docx",
	"./По семестрам/5 семестр/Б1ВДВ5_1 Оценка качества информационных систем (готово).docx": "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ5_1 Оценка качества информационных систем (готово).docx",
	"./По семестрам/5 семестр/Б1ВДВ5_2 Сертификация информационных систем (готово).docx": "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ5_2 Сертификация информационных систем (готово).docx",
	"./По семестрам/5 семестр/Б1ВДВ6_2 Математические основы защиты информации (готово).docx": "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ6_2 Математические основы защиты информации (готово).docx",
	"./По семестрам/5 семестр/Б1ВОД4 Разработка клиент-серверных приложений (готово).docx": "./static/data/Документы/По семестрам/5 семестр/Б1ВОД4 Разработка клиент-серверных приложений (готово).docx",
	"./По семестрам/5 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc": "./static/data/Документы/По семестрам/5 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc",
	"./По семестрам/6 семестр/Б1Б10 Анализ сложности алгоритмов (готово).docx": "./static/data/Документы/По семестрам/6 семестр/Б1Б10 Анализ сложности алгоритмов (готово).docx",
	"./По семестрам/6 семестр/Б1ВДВ6_1 Информационная безопасность и защита информации (готово).doc": "./static/data/Документы/По семестрам/6 семестр/Б1ВДВ6_1 Информационная безопасность и защита информации (готово).doc",
	"./По семестрам/6 семестр/Б1ВДВ7_1 Технологии визуализации информации (готово).docx": "./static/data/Документы/По семестрам/6 семестр/Б1ВДВ7_1 Технологии визуализации информации (готово).docx",
	"./По семестрам/6 семестр/Б1ВДВ7_2 Проектирование графических моделей (готово).docx": "./static/data/Документы/По семестрам/6 семестр/Б1ВДВ7_2 Проектирование графических моделей (готово).docx",
	"./По семестрам/6 семестр/Б1ВДВ9_1 Системы электронного документооборота (готово).docx": "./static/data/Документы/По семестрам/6 семестр/Б1ВДВ9_1 Системы электронного документооборота (готово).docx",
	"./По семестрам/6 семестр/Б1ВОД10 Интеллектуальные системы и технологии (готово).docx": "./static/data/Документы/По семестрам/6 семестр/Б1ВОД10 Интеллектуальные системы и технологии (готово).docx",
	"./По семестрам/6 семестр/Б1ВОД8 Теория систем и системный анализ (готово).docx": "./static/data/Документы/По семестрам/6 семестр/Б1ВОД8 Теория систем и системный анализ (готово).docx",
	"./По семестрам/6 семестр/Б1ВОД9 Моделирование систем (готово).doc": "./static/data/Документы/По семестрам/6 семестр/Б1ВОД9 Моделирование систем (готово).doc",
	"./По семестрам/6 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc": "./static/data/Документы/По семестрам/6 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc",
	"./По семестрам/8 семестр/Б1ВДВ10_2 Менеджмент информационных систем (готово).docx": "./static/data/Документы/По семестрам/8 семестр/Б1ВДВ10_2 Менеджмент информационных систем (готово).docx",
	"./По семестрам/8 семестр/Б2Г1 Государственный экзамен (готово).doc": "./static/data/Документы/По семестрам/8 семестр/Б2Г1 Государственный экзамен (готово).doc",
	"./По семестрам/8 семестр/Б2Д1 Выпускная квалификационная работа (готово).doc": "./static/data/Документы/По семестрам/8 семестр/Б2Д1 Выпускная квалификационная работа (готово).doc",
	"./По семестрам/8 семестр/Б2П2 Преддипломная практика(готово).doc": "./static/data/Документы/По семестрам/8 семестр/Б2П2 Преддипломная практика(готово).doc"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./static/data/Документы recursive \\.(doc|docx|xps|pdf|exe)$";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №1. Основные термины и определения в области информационной безопасности и защиты информации..xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция №1. Основные термины и определения в области информационной безопасности и защиты информации..xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №2. Вредоносные программы и их классификация..xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция №2. Вредоносные программы и их классификация..xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №3. Законодательный уровень информационной безопасности..xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция №3. Законодательный уровень информационной безопасности..xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №4. Стандарты и спецификации в области информационной безопасности..xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция №4. Стандарты и спецификации в области информационной безопасности..xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №7. Защита информации в информационных системах и компьютерных сетях..xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция №7. Защита информации в информационных системах и компьютерных сетях..xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №8. Технологии и инструменты обеспечения безопасности информации в системах и сетях..xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция №8. Технологии и инструменты обеспечения безопасности информации в системах и сетях..xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Лекция №9. Обеспечение интегральной безопасности информационных систем и сетей..xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция №9. Обеспечение интегральной безопасности информационных систем и сетей..xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 1.xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Практическая работа № 1.xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 2.xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Практическая работа № 2.xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 3.xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Практическая работа № 3.xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/ИБ и ЗИ/Практическая работа № 4.xps":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Практическая работа № 4.xps";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Книги/networks.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/networks.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L1.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L1.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L11.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L11.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L2.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L2.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L21.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L21.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L3.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L3.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L31.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L31.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L4.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L4.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L41.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L41.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L5.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L5.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L51.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L51.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L6.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L6.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L61.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L61.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L7.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L7.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L71.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L71.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L8.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L8.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Лекции/L81.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/L81.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/----Задание на практическое занятие 3.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/----Задание на практическое занятие 3.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/----Задание на практическое занятие 5.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/----Задание на практическое занятие 5.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/----Лабораторная работа 1 (1).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/----Лабораторная работа 1 (1).docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/----Практическая работа 1.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/----Практическая работа 1.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/----Практическая работа 2.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/----Практическая работа 2.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/Lab1.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Lab1.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/Lab2.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Lab2.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/Lab3.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Lab3.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/Pr1.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Pr1.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/Pr2.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Pr2.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/Pr3.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Pr3.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Практика/Лабораторная работа 4.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лабораторная работа 4.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Тесты/test_01.exe":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/test_01.exe";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Тесты/test_02.exe":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/test_02.exe";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Тесты/test_03.exe":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/test_03.exe";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Тесты/test_04.exe":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/test_04.exe";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Тесты/test_05.exe":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/test_05.exe";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Тесты/test_06.exe":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/test_06.exe";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Тесты/test_07.exe":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/test_07.exe";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Тесты/test_08.exe":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/test_08.exe";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Тесты/Тест7.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Тест7.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Информационные сети/Тесты/Тест8.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Тест8.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Лекции/1-Структура и классификация КИС..pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/1-Структура и классификация КИС..pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Лекции/2-Модели MRP, MRPII, ERP, ASP..pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/2-Модели MRP, MRPII, ERP, ASP..pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Лекции/3-Корпоративная сеть.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/3-Корпоративная сеть.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Лекции/4-Создание клиент-серверных приложений в СУБД SQL Server..pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/4-Создание клиент-серверных приложений в СУБД SQL Server..pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Лекции/5-Архитектура системы безопасности СУБД SQL Server 2000..pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/5-Архитектура системы безопасности СУБД SQL Server 2000..pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Лекции/6-Технология OLAP..pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/6-Технология OLAP..pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Лекции/7-Хранилище данных..pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/7-Хранилище данных..pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Практические работы/1-Создание модели корпоративной базы данных и хранилища данных.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/1-Создание модели корпоративной базы данных и хранилища данных.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Практические работы/2-Заполнение хранилищ данных с помощью Data Transformation Services.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/2-Заполнение хранилищ данных с помощью Data Transformation Services.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Практические работы/3-Создание многомерных баз данных.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/3-Создание многомерных баз данных.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Практические работы/4-OLAP-клиенты.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/4-OLAP-клиенты.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Тесты/1.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/1.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Тесты/10.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/10.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Тесты/2.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/2.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Тесты/3.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/3.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Тесты/4.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/4.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Тесты/5.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/5.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Тесты/6.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/6.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Тесты/7.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/7.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Тесты/8.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/8.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/КИС/Тесты/9.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/9.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 1.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 1.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 2.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 2.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 3.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 3.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 4.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 4.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 5.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 5.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Корпоративные информационные системы/Лекция 6.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 6.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Линейная алгебра/TrAlg_1sem_VO_2016.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/TrAlg_1sem_VO_2016.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Линейная алгебра/TrAlg_2sem_VO_2016.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/TrAlg_2sem_VO_2016.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Математический анализ/TrMa_1sem_VO_2016.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/TrMa_1sem_VO_2016.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Математический анализ/TrMa_2sem_VO_2016.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/TrMa_2sem_VO_2016.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/ООП/Лабораторная работа 1.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лабораторная работа 1.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/ООП/Лабораторная работа 2.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лабораторная работа 2.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/ООП/Лабораторная работа 3.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лабораторная работа 3.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/ООП/Лабораторная работа 4.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лабораторная работа 4.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/ООП/Лабораторная работа 5.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лабораторная работа 5.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/ООП/Лабораторная работа 6.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лабораторная работа 6.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/ООП/Лабораторная работа 7.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лабораторная работа 7.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 1.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 1.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 10.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 10.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 11.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 11.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 12.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 12.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 2.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 2.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 3.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 3.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 4.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 4.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 5.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 5.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 6.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 6.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 7.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 7.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 8.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 8.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Технология проектирования информационных систем/Лекция 9.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 9.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Физика/metodicheskie_ukazanija_k_oformleniju_raboti_i_raschetu_oshibok.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/metodicheskie_ukazanija_k_oformleniju_raboti_i_raschetu_oshibok.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Физика/pristavki_si.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/pristavki_si.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Физика/table_physics_constants.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/table_physics_constants.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Физика/vvedenie_v_teoriju_izmereniy.pdf":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/vvedenie_v_teoriju_izmereniy.pdf";

/***/ }),

/***/ "./static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 1.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 1.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 2.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 2.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 3.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 3.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 4.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 4.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Электронный документооборот/Лекции/Лекция 5.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Лекция 5.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 1.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Практическая работа 1.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 2.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Практическая работа 2.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 3.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Практическая работа 3.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 4.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Практическая работа 4.docx";

/***/ }),

/***/ "./static/data/Документы/По предметам/Электронный документооборот/Практические работы/Практическая работа 5.docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Практическая работа 5.docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/ 3 семестр/Б1Б11 Структура и алгоритмы обработки данных (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1Б11 Структура и алгоритмы обработки данных (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/ 3 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/ 7 семестр/Б1ВДВ11_1 Информац-поисковые системы (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ11_1 Информац-поисковые системы (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/ 7 семестр/Б1ВДВ9_2 Мультиагентные информационные системы (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ9_2 Мультиагентные информационные системы (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/ 7 семестр/Б1ВОД11 Мировые информационные ресурсы (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД11 Мировые информационные ресурсы (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/ 7 семестр/Б1ВОД12 Управление ИТ-проектами (готовое).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД12 Управление ИТ-проектами (готовое).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/ 7 семестр/Б1ВОД13 Безопасность функционирования информационных систем (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД13 Безопасность функционирования информационных систем (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/ 7 семестр/Б1ВОД14 Разработка программного обеспечения для корпоративных информационных систем (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД14 Разработка программного обеспечения для корпоративных информационных систем (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/ 7 семестр/Б1ВОД7 Проектирование информационных систем (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД7 Проектирование информационных систем (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/ 7 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/1 семестр/Б1ВОД1 Процедурное программирование (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД1 Процедурное программирование (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/1 семестр/Б1ВОД16 Программная инженерия для корпоративных информационных систем (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД16 Программная инженерия для корпоративных информационных систем (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/2 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/4 семестр/Б1Б11 Структура и алгоритмы обработки данных (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1Б11 Структура и алгоритмы обработки данных (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/4 семестр/Б1Б19 Информационные системы и технологии (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1Б19 Информационные системы и технологии (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/4 семестр/Б1ВДВ8_1 Открытые информационные системы (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ8_1 Открытые информационные системы (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/4 семестр/Б1ВДВ8_2 Методы функциональной стандартизации (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ8_2 Методы функциональной стандартизации (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/4 семестр/Б1ВОД15 Качество, стандартизация и сертификация информационных систем (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД15 Качество, стандартизация и сертификация информационных систем (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/4 семестр/Б1ВОД3 Разработка программных приложений (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД3 Разработка программных приложений (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/4 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/5 семестр/Б1Б19 Информационные системы и технологии (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1Б19 Информационные системы и технологии (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ10_1 Сопровождение информационных систем (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ10_1 Сопровождение информационных систем (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ11_2 Математические методы в информационных технологиях (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ11_2 Математические методы в информационных технологиях (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ4_1 Корпоративные информационные системы (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ4_1 Корпоративные информационные системы (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ4_2 Интерфейсы информационных систем (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ4_2 Интерфейсы информационных систем (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ5_1 Оценка качества информационных систем (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ5_1 Оценка качества информационных систем (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ5_2 Сертификация информационных систем (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ5_2 Сертификация информационных систем (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/5 семестр/Б1ВДВ6_2 Математические основы защиты информации (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ6_2 Математические основы защиты информации (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/5 семестр/Б1ВОД4 Разработка клиент-серверных приложений (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД4 Разработка клиент-серверных приложений (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/5 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/6 семестр/Б1Б10 Анализ сложности алгоритмов (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1Б10 Анализ сложности алгоритмов (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/6 семестр/Б1ВДВ6_1 Информационная безопасность и защита информации (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ6_1 Информационная безопасность и защита информации (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/6 семестр/Б1ВДВ7_1 Технологии визуализации информации (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ7_1 Технологии визуализации информации (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/6 семестр/Б1ВДВ7_2 Проектирование графических моделей (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ7_2 Проектирование графических моделей (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/6 семестр/Б1ВДВ9_1 Системы электронного документооборота (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ9_1 Системы электронного документооборота (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/6 семестр/Б1ВОД10 Интеллектуальные системы и технологии (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД10 Интеллектуальные системы и технологии (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/6 семестр/Б1ВОД8 Теория систем и системный анализ (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД8 Теория систем и системный анализ (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/6 семестр/Б1ВОД9 Моделирование систем (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВОД9 Моделирование систем (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/6 семестр/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б2П1 Практика по получению профессиональных умений и опыта профессиональной деятельности (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/8 семестр/Б1ВДВ10_2 Менеджмент информационных систем (готово).docx":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б1ВДВ10_2 Менеджмент информационных систем (готово).docx";

/***/ }),

/***/ "./static/data/Документы/По семестрам/8 семестр/Б2Г1 Государственный экзамен (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б2Г1 Государственный экзамен (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/8 семестр/Б2Д1 Выпускная квалификационная работа (готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б2Д1 Выпускная квалификационная работа (готово).doc";

/***/ }),

/***/ "./static/data/Документы/По семестрам/8 семестр/Б2П2 Преддипломная практика(готово).doc":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "docs/Б2П2 Преддипломная практика(готово).doc";

/***/ }),

/***/ "./styles/main.styl":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/autoprefixer-loader/index.js?{browsers:[\"Android >= 4\",\"Chrome >= 42\",\"Firefox >= 37\",\"Explorer >= 10\",\"iOS >= 7\",\"Opera >= 28\",\"Safari >= 7\"]}!../node_modules/stylus-loader/index.js?{\"sourceMap\":true}!./styles/main.styl");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/addStyles.js")(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/autoprefixer-loader/index.js?{browsers:[\"Android >= 4\",\"Chrome >= 42\",\"Firefox >= 37\",\"Explorer >= 10\",\"iOS >= 7\",\"Opera >= 28\",\"Safari >= 7\"]}!../node_modules/stylus-loader/index.js?{\"sourceMap\":true}!./styles/main.styl", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/autoprefixer-loader/index.js?{browsers:[\"Android >= 4\",\"Chrome >= 42\",\"Firefox >= 37\",\"Explorer >= 10\",\"iOS >= 7\",\"Opera >= 28\",\"Safari >= 7\"]}!../node_modules/stylus-loader/index.js?{\"sourceMap\":true}!./styles/main.styl");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./views/index.pug":
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__("../node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (htmlWebpackPlugin, pageTitle) {pug_mixins["header-tabs"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
var elements = ['О кафедре', 'Расписание', 'Материально-техническое обеспечение', 'Учебная работа', 'Сотрудники', 'Документы'];
pug_html = pug_html + "\u003Cdiv class=\"header-tabs\"\u003E\u003CUL class=\"header-elements\"\u003E";
// iterate elements
;(function(){
  var $$obj = elements;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var el = $$obj[i];
if (el === 'О кафедре')
{
pug_html = pug_html + "\u003CLI" + (" class=\"header-elements__element header-elements__element--active\""+pug.attr("data-tab", `${i + 1}`, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = el) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
}
else
{
pug_html = pug_html + "\u003CLI" + (" class=\"header-elements__element\""+pug.attr("data-tab", `${i + 1}`, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = el) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
}
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var el = $$obj[i];
if (el === 'О кафедре')
{
pug_html = pug_html + "\u003CLI" + (" class=\"header-elements__element header-elements__element--active\""+pug.attr("data-tab", `${i + 1}`, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = el) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
}
else
{
pug_html = pug_html + "\u003CLI" + (" class=\"header-elements__element\""+pug.attr("data-tab", `${i + 1}`, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = el) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
}
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002FUL\u003E\u003C\u002Fdiv\u003E";
};
pug_mixins["header"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"header\"\u003E\u003Cdiv class=\"header-open-mobile-menu\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"header-overlay\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"header-circle\"\u003E\u003Cdiv class=\"header-circle__logo-mirea\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"header-labels\"\u003E\u003CA class=\"header-labels__label header-labels__label--1\" href=\"https:\u002F\u002Fwww.mirea.ru\u002F\"\u003EМосковский Технологический\u003Cbr\u003EУниверситет\u003C\u002FA\u003E\u003CA class=\"header-labels__label header-labels__label--2\" href=\"https:\u002F\u002Fit.mirea.ru\u002F\"\u003EИнститут Информационных\u003Cbr\u003EТехнологий \u003C\u002FA\u003E\u003C\u002Fdiv\u003E";
pug_mixins["header-tabs"]();
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};
pug_mixins["text-header"] = pug_interp = function(text, isBig){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv" + (pug.attr("class", pug.classes([`${!isBig ? "text-header" : "text-header text-header--big"}`], [true]), false, true)) + "\u003E" + (pug.escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
};
pug_mixins["main-text"] = pug_interp = function(textArray){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"main-text\"\u003E";
// iterate textArray
;(function(){
  var $$obj = textArray;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var par = $$obj[i];
pug_html = pug_html + "\u003Cp\u003E" + (pug.escape(null == (pug_interp = par) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var par = $$obj[i];
pug_html = pug_html + "\u003Cp\u003E" + (pug.escape(null == (pug_interp = par) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};
pug_mixins["main-professor"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"main-professor\"\u003E\u003Cdiv class=\"main-professor__image\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"main-professor__info\"\u003E\u003Cdiv class=\"main-professor__descr\"\u003E";
pug_mixins["text-header"]('Петров Андрей Борисович', true);
pug_html = pug_html + "\u003CP class=\"main-professor__position-1\"\u003Eзав. кафедрой\u003C\u002FP\u003E\u003CP class=\"main-professor__position-2\"\u003Eпрофессор, доктор технических наук, почетный работник высшего образования Российской Федерации\u003C\u002FP\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"main-professor__contacts\"\u003E\u003CP class=\"main-professor__contact\"\u003EПроспект Вернадского, 78 \u003C\u002FP\u003E\u003CP class=\"main-professor__contact\"\u003Eауд. Г-318\u003C\u002FP\u003E\u003CP class=\"main-professor__contact\"\u003EТелефон: +7 499 215-65-65, доб. 5110 \u003C\u002FP\u003E\u003CP class=\"main-professor__contact\"\u003EE-mail: \u003Ca href=\"mailto:petrov@mirea.ru\"\u003Epetrov@mirea.ru\u003C\u002Fa\u003E\u003C\u002FP\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
pug_mixins["main-text"] = pug_interp = function(textArray){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"main-text\"\u003E";
// iterate textArray
;(function(){
  var $$obj = textArray;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var par = $$obj[i];
pug_html = pug_html + "\u003Cp\u003E" + (pug.escape(null == (pug_interp = par) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var par = $$obj[i];
pug_html = pug_html + "\u003Cp\u003E" + (pug.escape(null == (pug_interp = par) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};
pug_mixins["text-header"] = pug_interp = function(text, isBig){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv" + (pug.attr("class", pug.classes([`${!isBig ? "text-header" : "text-header text-header--big"}`], [true]), false, true)) + "\u003E" + (pug.escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
};
pug_mixins["text-list"] = pug_interp = function(listArr, isRegular, isNumeric){
var block = (this && this.block), attributes = (this && this.attributes) || {};
if (isNumeric) {
pug_html = pug_html + "\u003COL" + (pug.attr("class", pug.classes([`text-list ${isRegular ? "text-list--regular" : ""} ${isNumeric ? "text-list--numeric" : ""}`], [true]), false, true)) + "\u003E";
// iterate listArr
;(function(){
  var $$obj = listArr;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002FOL\u003E";
}
else {
pug_html = pug_html + "\u003CUL" + (pug.attr("class", pug.classes([`text-list ${isRegular ? "text-list--regular" : ""} ${isNumeric ? "text-list--numeric" : ""}`], [true]), false, true)) + "\u003E";
// iterate listArr
;(function(){
  var $$obj = listArr;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002FUL\u003E";
}
};
pug_mixins["text-link"] = pug_interp = function(text, href){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003CA" + (" class=\"text-link\""+pug.attr("href", `${href}`, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002FA\u003E";
};
pug_mixins["tabs-content-data-1"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"tabs-content-data-1\"\u003E";
pug_mixins["main-professor"]();
pug_mixins["text-link"]("Положение о кафедре", "https://it.mirea.ru/upload/medialibrary/953/227.polozhenie-o-kafedre-kis.pdf");
pug_mixins["main-text"](
			[
				"Кафедра корпоративных информационных систем (далее – КИС) была образована в 2010 году (приказ №450 от 03.09.2010). Кафедра является выпускающей по направлению 09/03/02 «Информационные системы и технологии». Летом 2013 года кафедрой был произведен первый выпуск магистров, а в 2015 году состоятся первый выпуск бакалавров по этому же направлению."
			]
		);
pug_mixins["main-text"](
			[
				"Сотрудники кафедры – высококвалифицированные специалисты, многие из которых являются выпускниками МИРЭА. Ими разработано большое количество учебных и учебно-методических пособий для студентов. Программы дисциплин, которые читаются студентам, регулярно пересматриваются в соответствии с новыми достижениями в области информационных систем и технологий."
			]
		);
pug_mixins["text-header"]("За время обучения студенты овладевают глубокими знаниями фундаментальных дисциплин, а также знаниями, умениями и практическими навыками в областях:");
pug_mixins["text-list"](
			[
				"технологии программирования",
				"управление данными",
				"информационные сети",
				"технологии визуализации информации",
				"открытые информационные системы",
				"корпоративные информационные системы",
				"безопасность функционирования ИС",
				"проектирование ИС",
			], true
		);
pug_mixins["main-text"](
			[
				"Работа кафедры строится в соответствии с миссией, целью, видением и основными задачами, перечисленными в Положении о кафедре КИС (СМКО МИРЭА 6.4.03.П.02.40.8-16, в ред. от 27.04.2016) на основе годового плана работы, ежегодно утверждаемого заведующим кафедрой."
			]
		);
pug_mixins["main-text"](
			[
				"Заведующим кафедрой КИС в 2010 году был избран доктор технических наук, профессор А.Б. Петров. В помещениях кафедры за счет средств ф-та ИТ было развернуто три современных компьютерных класса по 16 машин, объединенных локальной сетью и оснащенных системным и прикладным специализированным программным обеспечением. Один класс оборудован мультимедиакомплектом."
			]
		);
pug_mixins["main-text"](
			[
				"В 2012 году за счет средств университета было закуплено, а также в рамках партнерских программ, получено дополнительное программное обеспечение, а в рамках создания образовательного центра с компанией Autodesk, все рабочие места были оснащены программным обеспечением, предоставляемым компанией Autodesk."
			]
		);
pug_mixins["text-header"]("На рабочих местах развернуто следующее программное обеспечение:");
pug_mixins["text-list"](
			[
				`
					Г-312: AutoCAD 2012 – Русский, AutoCAD Electrical 2012,Autodesk 3ds Max Design 2012 64-bit – English, Autodesk Inventor Professional 2012, AutoCAD Map 3D 2012 – Русский, Autodesk Industry Model Data Editor, AutoCAD Mechanical 2012, Autodesk Simulation Multiphysics 2012, OpenOffice.org 3.3, КОМПАС-3D LT V12, Делопроизводство 3.0, ESET NOD32 Antivirus Business Edition, Adobe Dream Weaver CS6 12.0, CorelCAD Academic VMware, Workstation 9;
				`,
				`
					Г-414: AutoCAD 2012 – Русский, AutoCAD Electrical 2012,Autodesk 3ds Max Design 2012 64-bit – English, Autodesk Inventor Professional 2012, AutoCAD Map 3D 2012 – Русский, Autodesk Industry Model Data Editor, AutoCAD Mechanical 2012, Autodesk Simulation Multiphysics 2012, OpenOffice.org 3.3, КОМПАС-3D LT V12, Делопроизводство 3.0, ESET NOD32 Antivirus Business Edition, Adobe Dream Weaver CS6 12.0, CorelCAD Academic VMware, Workstation 9, Lazarus IDE, Microsoft Office 2007, Microsoft Visual Studio 2012, IBM Rational Rose Enterprise Edition, КОМПАС-3D LT V12;
				`,
				`
					Г-111: AutoCAD 2012 – Русский, AutoCAD Electrical 2012,Autodesk 3ds Max Design 2012 64-bit – English, Autodesk Inventor Professional 2012, AutoCAD Map 3D 2012 – Русский, Autodesk Industry Model Data Editor, AutoCAD Mechanical 2012, Autodesk Simulation Multiphysics 2012, OpenOffice.org 3.3, КОМПАС-3D LT V12, Делопроизводство 3.0, ESET NOD32 Antivirus Business Edition, Adobe Dream Weaver CS6 12.0, CorelCAD Academic VMware, Workstation 9, Lazarus IDE, Microsoft Office 2007, Microsoft Visual Studio 2012, IBM Rational Rose Enterprise Edition, КОМПАС-3D LT V12, CA Erwin Process Modeler r7.3.
				`
			]
		);
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};






pug_mixins["tabs-content-data-documents"] = pug_interp = function(documentsData){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"tabs-content-data-documents\"\u003E\u003Cdiv id=\"documents-tree\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
pug_mixins["main-text"] = pug_interp = function(textArray){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"main-text\"\u003E";
// iterate textArray
;(function(){
  var $$obj = textArray;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var par = $$obj[i];
pug_html = pug_html + "\u003Cp\u003E" + (pug.escape(null == (pug_interp = par) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var par = $$obj[i];
pug_html = pug_html + "\u003Cp\u003E" + (pug.escape(null == (pug_interp = par) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};
pug_mixins["text-header"] = pug_interp = function(text, isBig){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv" + (pug.attr("class", pug.classes([`${!isBig ? "text-header" : "text-header text-header--big"}`], [true]), false, true)) + "\u003E" + (pug.escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
};
pug_mixins["text-list"] = pug_interp = function(listArr, isRegular, isNumeric){
var block = (this && this.block), attributes = (this && this.attributes) || {};
if (isNumeric) {
pug_html = pug_html + "\u003COL" + (pug.attr("class", pug.classes([`text-list ${isRegular ? "text-list--regular" : ""} ${isNumeric ? "text-list--numeric" : ""}`], [true]), false, true)) + "\u003E";
// iterate listArr
;(function(){
  var $$obj = listArr;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002FOL\u003E";
}
else {
pug_html = pug_html + "\u003CUL" + (pug.attr("class", pug.classes([`text-list ${isRegular ? "text-list--regular" : ""} ${isNumeric ? "text-list--numeric" : ""}`], [true]), false, true)) + "\u003E";
// iterate listArr
;(function(){
  var $$obj = listArr;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002FUL\u003E";
}
};
pug_mixins["tabs-content-data-history"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"tabs-content-data-history\"\u003E";
pug_mixins["text-header"]("Расписание зачетной сессии 2017-2018:", true);
pug_html = pug_html + "\u003Ciframe src=\"https:\u002F\u002Fdocs.google.com\u002Fspreadsheets\u002Fd\u002Fe\u002F2PACX-1vSQiJAxxttfihIID39o34NLeg1ZUhxvph5sKFXbZe8E6P49OHdKAsEi3OVo2QgEBWOiCpA0IRni0FDT\u002Fpubhtml?&amp;headers=false\" width=\"100%\" height=\"700\"\u003E\u003C\u002Fiframe\u003E\u003Cbr\u003E\u003Cbr\u003E";
pug_mixins["text-header"]("Расписание экзаменационной сессии 2017-2018:", true);
pug_html = pug_html + "\u003Ciframe src=\"https:\u002F\u002Fdocs.google.com\u002Fspreadsheets\u002Fd\u002Fe\u002F2PACX-1vSQS5fXAEIfdqNLBkSXGWLJI-0qZYHMnLp3k8Ob8eIHhHkVNCJ5Lt2VIaUPQHN_gsAicqrEDnHmbm9E\u002Fpubhtml?gid=182901628&amp;single=true&amp;&amp;headers=false\" width=\"100%\" height=\"700\"\u003E\u003C\u002Fiframe\u003E\u003C\u002Fdiv\u003E";
};
pug_mixins["tabs-content-data-mto"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"tabs-content-data-mto\"\u003E\u003Ctable class=\"table-mto\"\u003E\u003Ctr\u003E\u003Ctd\u003E№\u003C\u002Ftd\u003E\u003Ctd\u003EНаименование лаборотории\u003C\u002Ftd\u003E\u003Ctd\u003EУчебные дисциплины, по которым проводятся лабораторные работы\u003C\u002Ftd\u003E\u003Ctd\u003EОборудование для проведения лабораторных работ\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd\u003E1\u003C\u002Ftd\u003E\u003Ctd\u003EКомпьютерный класс №1\u003C\u002Ftd\u003E\u003Ctd\u003EТехнологии программирования\u003Cbr\u003EПроектирование корпоративных информационных систем\u003Cbr\u003EОсновы управления ИТ проектами\u003C\u002Ftd\u003E\u003Ctd\u003EПерсональный компьютер (15 шт.)\u003Cbr\u003EСетевой коммутатор (1 шт.)\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd\u003E2\u003C\u002Ftd\u003E\u003Ctd\u003EКомпьютерный класс №2\u003C\u002Ftd\u003E\u003Ctd\u003EУправление данными\u003Cbr\u003EБезопасность функционирования ИС\u003C\u002Ftd\u003E\u003Ctd\u003EПерсональный компьютер (15 шт.)\u003Cbr\u003EСетевой коммутатор (1 шт.)\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd\u003E3\u003C\u002Ftd\u003E\u003Ctd\u003EУчебная лаборатория\u003C\u002Ftd\u003E\u003Ctd\u003EИнформационные сети\u003Cbr\u003EОперационные системы\u003Cbr\u003EОткрытые ИС\u003C\u002Ftd\u003E\u003Ctd\u003EПерсональный компьютер (15 шт.)\u003Cbr\u003EСетевой коммутатор (1 шт.)\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E";
};
pug_mixins["main-text"] = pug_interp = function(textArray){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"main-text\"\u003E";
// iterate textArray
;(function(){
  var $$obj = textArray;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var par = $$obj[i];
pug_html = pug_html + "\u003Cp\u003E" + (pug.escape(null == (pug_interp = par) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var par = $$obj[i];
pug_html = pug_html + "\u003Cp\u003E" + (pug.escape(null == (pug_interp = par) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E";
};
pug_mixins["text-header"] = pug_interp = function(text, isBig){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv" + (pug.attr("class", pug.classes([`${!isBig ? "text-header" : "text-header text-header--big"}`], [true]), false, true)) + "\u003E" + (pug.escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
};
pug_mixins["text-list"] = pug_interp = function(listArr, isRegular, isNumeric){
var block = (this && this.block), attributes = (this && this.attributes) || {};
if (isNumeric) {
pug_html = pug_html + "\u003COL" + (pug.attr("class", pug.classes([`text-list ${isRegular ? "text-list--regular" : ""} ${isNumeric ? "text-list--numeric" : ""}`], [true]), false, true)) + "\u003E";
// iterate listArr
;(function(){
  var $$obj = listArr;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002FOL\u003E";
}
else {
pug_html = pug_html + "\u003CUL" + (pug.attr("class", pug.classes([`text-list ${isRegular ? "text-list--regular" : ""} ${isNumeric ? "text-list--numeric" : ""}`], [true]), false, true)) + "\u003E";
// iterate listArr
;(function(){
  var $$obj = listArr;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var listItem = $$obj[i];
pug_html = pug_html + "\u003CLI class=\"text-list__item\"\u003E" + (pug.escape(null == (pug_interp = listItem) ? "" : pug_interp)) + "\u003C\u002FLI\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002FUL\u003E";
}
};
pug_mixins["tabs-content-data-teach-work"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_mixins["main-text"](
		[
			"Кафедра корпоративных информационных систем была создана в 2011 году. Кафедру возглавляет д.т.н. профессор Андрей Борисович Петров. Кафедра является выпускающей по направлению 09/03/02 «Информационные системы и технологии». Летом 2013 года кафедрой был произведен первый выпуск магистров, а в 2015 году состоятся первый выпуск бакалавров по этому же направлению."
		]
	);
pug_mixins["main-text"](
		[
			"Сотрудники кафедры – высококвалифицированные специалисты, многие из которых являются выпускниками МИРЭА. Ими разработано большое количество учебных и учебно-методических пособий для студентов. Программы дисциплин, которые читаются студентам, регулярно пересматриваются в соответствии с новыми достижениями в области информационных систем и технологий."
		]
	);
pug_mixins["text-header"]("Специальности и направления подготовки:");
pug_mixins["text-list"](
		[
			"09.03.02 бакалавры направление 51 «корпоративные информационные системы»",
			"09.04.02 магистры направление 23 «информационные системы государственного и корпоративного управления»",
		], true
	);
pug_html = pug_html + "\u003Cbr\u003E";
pug_mixins["text-header"]("Перечень читаемых дисциплин:");
pug_mixins["text-list"](
		[
			"Бакалавриат",
			"Информатика",
			"Объектно-ориентированное программирование",
			"Процедурное программирование",
			"Архитектура корпоративных информационных систем",
			"Операционные системы",
			"Теория информационных процессов и систем",
			"Управление данными",
			"Технология программирования",
			"Автоматизация проектирования ИС",
			"Информационные сети",
			"Моделирование систем",
			"Системный анализ",
			"Технологии визуализации информации",
			"Безопасность функционирования информационных систем",
			"Информационно-поисковые системы",
			"Корпоративные информационные системы",
			"Мировые информационные ресурсы",
			"Основы управления ИТ-проектами",
			"Оценка качества информационных систем",
			"Проектирование ИС",
			"Менеджмент информационных систем",
			"Открытые информационные системы",
			"Программная инженерия",
			"Системы электронного документооборота",
			"Администрирование в информационных системах",
		], false, true
	);
pug_html = pug_html + "\u003Cbr\u003E";
pug_mixins["text-header"]("Магистратура");
pug_mixins["text-list"](
		[
			"Архитектура информационных сетей",
			"Информационные системы государственного и муниципального управления",
			"Распределенные информационные системы и информационные ресурсы",
			"Методы поиска оптимальных решений",
			"Открытые информационные системы",
			"Аутсорсинг информационных технологий",
			"Безопасность функционирования информационных систем",
			"Методологии проектирования информационных систем",
			"Системная инженерия",
		], false, true
	);
pug_html = pug_html + "\u003Cbr\u003E";
pug_mixins["text-header"]("Аспирантура");
pug_mixins["text-list"](
		[
			"Методология проектирования открытых информационных, вычислительных и телекоммуникационных систем",
		], false, true
	);
};
pug_mixins["stuff-person"] = pug_interp = function(name, position1, position2, imageModificator){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"stuff-person\"\u003E\u003Cdiv" + (pug.attr("class", pug.classes([`stuff-person__photo stuff-person__photo--${imageModificator ? imageModificator : "nophoto"}`], [true]), false, true)) + "\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"stuff-person-descr\"\u003E\u003Cdiv class=\"stuff-person__name\"\u003E" + (pug.escape(null == (pug_interp = name) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv class=\"stuff-person__position-1\"\u003E" + (pug.escape(null == (pug_interp = position1) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv class=\"stuff-person__position-2\"\u003E" + (pug.escape(null == (pug_interp = position2) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
pug_mixins["tabs-content-data-stuff"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"tabs-content-data-stuff\"\u003E\u003Cdiv class=\"stuff-persons\"\u003E";
pug_mixins["stuff-person"]("Петров Андрей Борисович", "зав. кафедрой", "д.т.н., профессор", "petrov");
pug_mixins["stuff-person"]("Андрианова Елена Гельевна", "доцент", "к.т.н., доцент", "andrianova");
pug_mixins["stuff-person"]("Башлыкова Анна Александровна", null, "Доцент", "bashlykova");
pug_mixins["stuff-person"]("Стотланд Ирина Аркадьевна", null, "к.т.н., доцент");
pug_mixins["stuff-person"]("Тарасов Е.И.", "доцент", "к.т.н., доцент");
pug_mixins["stuff-person"]("Крюков Дмитрий Алексеевич", null, "к.т.н., доцент");
pug_mixins["stuff-person"]("Панов Александр Владимирович", "доцент", null, "panov");
pug_mixins["stuff-person"]("Томашевская Валерия Сергеевна", null, "к.т.н., доцент", "tomashevskaya");
pug_mixins["stuff-person"]("Трохаченкова Надежда Николаевна", null, "Старший преподаватель", "trokhachenkova");
pug_mixins["stuff-person"]("Мирзоян Дмитрий Ильич", null, "Старший преподаватель", "mirzoyan");
pug_mixins["stuff-person"]("Неменко Мария Витальевна", null, "Старший преподаватель", "nemenko");
pug_mixins["stuff-person"]("Давыдов Денис Павлович", null, "ассистент", "davydov");
pug_mixins["stuff-person"]("Алдобаева Василиса Николаевна", null, "ассистент", "aldobaeva");
pug_mixins["stuff-person"]("Прощаева Анастасия Андреевна", null, "ассистент", "proshaeva");
pug_mixins["stuff-person"]("Багров Сергей Валерьевич", null, "ассистент", "bagrov");
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
pug_mixins["tabs-content"] = pug_interp = function(documentsData){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"tabs-content\"\u003E\u003Cdiv class=\"tabs-content-element tabs-content-element--active tabs-content-element--1\"\u003E\u003Cdiv class=\"tabs-content-data\"\u003E";
pug_mixins["tabs-content-data-1"]();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"tabs-content-element tabs-content-element--2\"\u003E\u003Cdiv class=\"tabs-content-data\"\u003E";
pug_mixins["tabs-content-data-history"]();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"tabs-content-element tabs-content-element--3\"\u003E\u003Cdiv class=\"tabs-content-data\"\u003E";
pug_mixins["tabs-content-data-mto"]();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"tabs-content-element tabs-content-element--4\"\u003E\u003Cdiv class=\"tabs-content-data\"\u003E";
pug_mixins["tabs-content-data-teach-work"]();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"tabs-content-element tabs-content-element--5\"\u003E\u003Cdiv class=\"tabs-content-data\"\u003E";
pug_mixins["tabs-content-data-stuff"]();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"tabs-content-element tabs-content-element--6\"\u003E\u003Cdiv class=\"tabs-content-data\"\u003E";
pug_mixins["tabs-content-data-documents"](documentsData);
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
pug_mixins["footer"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"footer\"\u003E\u003Cdiv class=\"footer__text\"\u003E© 2017 Московский технологический университет\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
pug_html = pug_html + "\u003C!DOCTYPE html\u003E\u003Chtml lang=\"ru\"\u003E\u003Chead\u003E\u003Cmeta charset=\"utf-8\"\u003E\u003Cmeta name=\"viewport\" content=\"width=device-width, initial-scale=1, minimal-ui\"\u003E\u003Cmeta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"\u003E\u003Cmeta name=\"imagetoolbar\" content=\"no\"\u003E\u003Cmeta name=\"msthemecompatible\" content=\"no\"\u003E\u003Cmeta name=\"cleartype\" content=\"on\"\u003E\u003Cmeta name=\"HandheldFriendly\" content=\"True\"\u003E\u003Cmeta name=\"google\" value=\"notranslate\"\u003E\u003Cmeta name=\"description\" content=\"\"\u003E\u003Cmeta name=\"keywords\" content=\"\"\u003E\u003Ctitle\u003E" + (pug.escape(null == (pug_interp = pageTitle || 'Сайт кафедры КИС') ? "" : pug_interp)) + "\u003C\u002Ftitle\u003E\u003C\u002Fhead\u003E\u003Cbody\u003E";
const documentsData = htmlWebpackPlugin.options
pug_html = pug_html + "\u003Cdiv class=\"content-wrapper\"\u003E";
pug_mixins["header"]();
pug_mixins["tabs-content"](documentsData);
pug_mixins["footer"]();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fbody\u003E\u003C\u002Fhtml\u003E";}.call(this,"htmlWebpackPlugin" in locals_for_with?locals_for_with.htmlWebpackPlugin:typeof htmlWebpackPlugin!=="undefined"?htmlWebpackPlugin:undefined,"pageTitle" in locals_for_with?locals_for_with.pageTitle:typeof pageTitle!=="undefined"?pageTitle:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

/******/ });
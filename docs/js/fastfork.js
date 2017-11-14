/******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, GitFastFork_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // export * from "./GitFastFork";
    // export * from "./api/GitFastFork.d";
    /** 用户口令 */
    exports.userToken = function () {
        if (window.fastfork === undefined) {
            window.fastfork = {};
        }
        window.fastfork.userToken = window.localStorage.getItem("githubUserToken");
        return window.fastfork.userToken;
    }();
    /** 用户口令 */
    exports.organizationName = function () {
        if (window.fastfork === undefined) {
            window.fastfork = {};
        }
        window.fastfork.organizationName = window.localStorage.getItem("githubOrganizationName");
        return window.fastfork.organizationName;
    }();
    /** 管理者 */
    exports.gitFastForkManager = function () {
        if (window.fastfork === undefined) {
            window.fastfork = {};
        }
        if (window.fastfork.manager === undefined) {
            window.fastfork.manager = new GitFastFork_1.GitFastFork(exports.userToken, exports.organizationName);
        }
        return window.fastfork.manager;
    }();
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GitFastFork {
        constructor(userToken, organizationName) {
            this.api = new fastfork.Github({
                token: userToken
            });
            this.user = this.api.getUser();
            if (!organizationName) {
                organizationName = "color-coding";
            }
            this.organization = this.api.getOrganization(organizationName);
            this.organization.name = organizationName;
            this.gitRepos = [];
            this.isInitialized = false;
        }
        /** 添加初始化完成监听 */
        addInitializedListener(listener) {
            if (!this.initializedListeners) {
                this.initializedListeners = new Array();
            }
            this.initializedListeners.push(listener);
        }
        /** 添加初始化完成监听 */
        addReposChangedListener(listener) {
            if (!this.reposChangedListeners) {
                this.reposChangedListeners = new Array();
            }
            this.reposChangedListeners.push(listener);
        }
        initialize() {
            let that = this;
            this.gitRepos = [];
            this.user.getProfile((error, user) => {
                that.user.name = user.login;
            }).then((value) => {
                this.organization.getRepos((error, repos) => {
                    if (repos.length > 0) {
                        let index = 0;
                        let getDetails = function () {
                            let orgRepo = repos[index];
                            let repository = that.api.getRepo(that.user.name, orgRepo.name);
                            repository.getDetails((error, repo) => {
                                let gitRepo = new GitRepository();
                                gitRepo.name = orgRepo.name;
                                if (error) {
                                    gitRepo.fork = false;
                                }
                                else if (repo && repo.source.owner.login === that.organization.name) {
                                    gitRepo.fork = true;
                                }
                                else {
                                    gitRepo.fork = false;
                                }
                                if (!!orgRepo.pushed_at) {
                                    gitRepo.pushed_at = dates.toString(new Date(orgRepo.pushed_at), "yyyy-MM-dd hh:mm:ss");
                                }
                                that.gitRepos.push(gitRepo);
                                that.fireReposChanged();
                                if (repos.length > index + 1) {
                                    index++;
                                    getDetails();
                                }
                                else {
                                    that.fireInitialized();
                                }
                            });
                        };
                        getDetails();
                    }
                });
            });
        }
        /** 初始化完成，需要手工调用 */
        fireInitialized() {
            this.isInitialized = true;
            if (!this.initializedListeners) {
                return;
            }
            for (let listener of this.initializedListeners) {
                if (listener instanceof Function) {
                    listener.call(listener, this);
                }
            }
            // 清除监听
            delete (this.initializedListeners);
        }
        /** 初始化完成，需要手工调用 */
        fireReposChanged() {
            if (!this.reposChangedListeners) {
                return;
            }
            for (let listener of this.reposChangedListeners) {
                if (listener instanceof Function) {
                    listener.call(listener, this);
                }
            }
        }
        getRepos() {
            return this.gitRepos;
        }
        // fork仓库到用户
        forkToUser(repo) {
            let that = this;
            if (repo.fork) {
                this.delete(repo).then((value) => {
                    repo.fork = false;
                    return that.fork(repo);
                });
            }
            else {
                return that.fork(repo);
            }
        }
        // 删除用户fork的仓库
        delete(repo) {
            console.log("正在删除原项目...");
            let repository = this.api.getRepo(this.user.name, repo.name);
            return repository.deleteRepo((error, res) => {
                console.log("删除完成");
                repo.fork = false;
            });
        }
        fork(repo) {
            console.log("正在fork");
            let repository = this.api.getRepo(this.organization.name, repo.name);
            return repository.fork((error, res) => {
                console.log("fork完成");
                repo.fork = true;
            });
        }
    }
    exports.GitFastFork = GitFastFork;
    class GitRepository {
    }
    exports.GitRepository = GitRepository;
    /**
     * 日期
     */
    var dates;
    (function (dates) {
        const DATA_SEPARATOR = "-";
        const TIME_SEPARATOR = ":";
        const DATA_TIME_SEPARATOR = "T";
        const DATA_PART_YEAR = "yyyy";
        const DATA_PART_MONTH = "MM";
        const DATA_PART_DAY = "dd";
        const DATA_PART_HOUR = "hh";
        const DATA_PART_MINUTE = "mm";
        const DATA_PART_SECOND = "ss";
        /**
         * 转换日期
         * @param value 日期
         * @returns 日期字符串
         */
        function toString() {
            function fill(value, size, char) {
                let newValue = value.toString();
                for (let index = newValue.length; index < size; index++) {
                    newValue = char + newValue;
                }
                return newValue;
            }
            let value = arguments[0];
            if (!value || !(value instanceof Date)) {
                return "";
            }
            let format = DATA_PART_YEAR + DATA_SEPARATOR +
                DATA_PART_MONTH + DATA_SEPARATOR +
                DATA_PART_DAY +
                DATA_TIME_SEPARATOR +
                DATA_PART_HOUR + TIME_SEPARATOR +
                DATA_PART_MINUTE + TIME_SEPARATOR +
                DATA_PART_SECOND;
            if (!!arguments[1]) {
                format = arguments[1];
            }
            let year = value.getFullYear(), month = value.getMonth(), day = value.getDate(), hour = value.getHours(), minute = value.getMinutes(), second = value.getSeconds();
            format = format.replace(DATA_PART_YEAR, fill(year, DATA_PART_YEAR.length, "0"));
            format = format.replace(DATA_PART_MONTH, fill(month + 1, DATA_PART_MONTH.length, "0"));
            format = format.replace(DATA_PART_DAY, fill(day, DATA_PART_DAY.length, "0"));
            format = format.replace(DATA_PART_HOUR, fill(hour, DATA_PART_HOUR.length, "0"));
            format = format.replace(DATA_PART_MINUTE, fill(minute, DATA_PART_MINUTE.length, "0"));
            format = format.replace(DATA_PART_SECOND, fill(second, DATA_PART_SECOND.length, "0"));
            return format;
        }
        dates.toString = toString;
        let emDifferenceType;
        (function (emDifferenceType) {
            emDifferenceType[emDifferenceType["DAY"] = 0] = "DAY";
            emDifferenceType[emDifferenceType["HOUR"] = 1] = "HOUR";
            emDifferenceType[emDifferenceType["MINUTE"] = 2] = "MINUTE";
            emDifferenceType[emDifferenceType["SECOND"] = 3] = "SECOND";
        })(emDifferenceType = dates.emDifferenceType || (dates.emDifferenceType = {}));
    })(dates = exports.dates || (exports.dates = {}));
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);
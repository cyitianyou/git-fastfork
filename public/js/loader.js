;
(function(root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = exports = factory()
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory)
    } else {
        // Global (browser)
        root.fastfork = factory()
    }
}(this, function() {
    'use strict'
    var fastfork = function() {}
    var requireError = function(error) {
        alert(error)
    }
    fastfork.prototype.load = function() {
        var root
        if (typeof arguments[0] === 'string') {
            root = arguments[0]
        }
        if (root === undefined || root === null) {
            throw new Error('please provide root url.')
        }
        // 解决方法缺失
        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function(prefix) {
                return this.slice(0, prefix.length) === prefix
            }
        }
        if (typeof String.prototype.endsWith != 'function') {
            String.prototype.endsWith = function(suffix) {
                return this.indexOf(suffix, this.length - suffix.length) !== -1
            }
        }
        if (!root.endsWith('/')) {
            root = root + '/'
        }
        require.config({
            baseUrl: root
        })
        let that = this
        require(['3rdparty/GitHub'], function(github) {
            fastfork.Github = github
            require(['fastfork/index'], function() {
                that.onLoaded()
            }, requireError)
        }, requireError)
    }
    fastfork.prototype.onLoaded = function() {}
    return fastfork
}))
$(document).ready(function() {
    if (!localStorage.githubUserToken) {
        window.location.href = 'settings.html'
    }
    var root = document.location.origin
    root = root + document.location.pathname.substring(0, document.location.pathname.lastIndexOf('/') + 1)
    var fastforkLoder = new fastfork()
    fastforkLoder.onLoaded = function() {
        let manager = fastfork.manager
        manager.addReposChangedListener(function() {
            var $table = $('#table')
            $table.bootstrapTable('load', manager.getRepos())
        })
        manager.addInitializedListener(function() {
            var $table = $('#table')
            $table.bootstrapTable('load', manager.getRepos())
            $('#btn_fork').off('click').on('click', function() {
                let repos = manager.getRepos()
                repos.forEach(function(repo) {
                    if (!repo.state) {
                        return
                    }
                    repo.msg = '开始处理...'
                    $table.bootstrapTable('load', manager.getRepos())
                    manager.forkToUser(repo)
                    repo.fork = true
                    repo.msg = 'fork完成!'
                    $table.bootstrapTable('load', manager.getRepos())
                })
                $table.bootstrapTable('load', manager.getRepos())
            })
            $('#btn_delete').off('click').on('click', function() {
                let repos = manager.getRepos()
                repos.forEach(function(repo) {
                    if (!repo.state) {
                        return
                    }
                    repo.msg = '开始处理...'
                    $table.bootstrapTable('load', manager.getRepos())
                    manager.delete(repo)
                    repo.fork = false
                    repo.msg = 'delete完成!'
                    $table.bootstrapTable('load', manager.getRepos())
                })
                $table.bootstrapTable('load', manager.getRepos())
            })
            $('#btn_refresh').off('click').on('click', function() {
                manager.initialize()
            })
        })
        manager.initialize()
    }
    fastforkLoder.load(root + 'js/')
    $('#btn_config').off('click').on('click', function() {
        window.location.href = 'settings.html'
    })
})
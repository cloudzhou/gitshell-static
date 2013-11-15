// gitshell.js
// author: cloudzhou
// gitshell.com

(function (undefined) {
    // global variable
    var csrfmiddlewaretoken = $('meta[name=csrf-token]').attr("content");
    var username = $('meta[name=username]').attr("content");
    // global action
    _.mixin(_.str.exports())
    moment.lang('zh-cn')
    $('.unixtime').each(function(index){ 
        $(this).html(moment(new Date($(this).html()*1000)).fromNow());
        $(this).show();
    });
    var repo_shortcut_loading = false;
    $('.repo-shortcut').mouseover(function(){
        if(!repo_shortcut_loading) {
            $.post('/'+username+'/-/repo/recently/', {csrfmiddlewaretoken: csrfmiddlewaretoken}, function(json){
                recently_view_repo = json.recently_view_repo;
                recently_active_repo = json.recently_active_repo;
                recently_update_repo = json.recently_update_repo;
                html = [];
                html.push('<li class="all"><a href="/'+username+'/-/repo/">所有仓库</a></li>');
                if(recently_view_repo.length > 0) {
                    html.push('<li class="leader"><span>最近查看</span></li>');
                    for(x in recently_view_repo) {
                        repo = recently_view_repo[x];
                        html.push(_.sprintf('<li><a href="/%s/%s/">%s/%s</a></li>', repo.username, repo.name, repo.username, repo.name));
                    }
                }
                if(recently_active_repo.length > 0) {
                    html.push('<li class="leader"><span>最近贡献</span></li>');
                    for(x in recently_active_repo) {
                        repo = recently_active_repo[x];
                        html.push(_.sprintf('<li><a href="/%s/%s/">%s/%s</a></li>', repo.username, repo.name, repo.username, repo.name));
                    }
                }
                if(recently_update_repo.length > 0) {
                    html.push('<li class="leader"><span>最近更新</span></li>');
                    for(x in recently_update_repo) {
                        repo = recently_update_repo[x];
                        html.push(_.sprintf('<li><a href="/%s/%s/">%s/%s</a></li>', repo.username, repo.name, repo.username, repo.name));
                    }
                }
                html.push('<li class="create"><a href="/'+username+'/-/repo/create/"><i class="icon-pencil"></i>新建仓库</a></li>');
                $('.repo-shortcut-ul').html(html.join(''));
            });
        }
        repo_shortcut_loading = true;
    });
    $('.dropdown-toggle').dropdown();
    // repo comparer
    function RepoComparer(user_name, repo_name, from_refs, to_refs) {
        this.user_name = user_name;
        this.repo_name = repo_name;
        this.from_refs = from_refs;
        this.to_refs = to_refs;
        this.path = '';
        this.line_context = 3;
        this.is_pull = false;
    }
    RepoComparer.prototype = {

        setPullUsername: function(source_repo_username, desc_repo_username) {
            this.source_repo_username = source_repo_username;
            this.desc_repo_username = desc_repo_username;
            this.is_pull = true;
        },
        setLineContext: function(line_context) {
            this.line_context = line_context;
        },
        loadDiff: function(selector, before, after) {
            var line_context = this.line_context;
            var url = this.is_pull ?
                        _.sprintf('/%s/%s/pull/diff/%s:%s..%s:%s/%s/', this.user_name, this.repo_name, this.desc_repo_username, this.to_refs, this.source_repo_username, this.from_refs, this.line_context) :
                        _.sprintf('/%s/%s/diff/%s..%s/%s/', this.user_name, this.repo_name, this.from_refs, this.to_refs, this.line_context) ;
            if(!this.is_pull && this.path != '') {
                url = url + this.path;
            }
            $.post(url, {csrfmiddlewaretoken: csrfmiddlewaretoken}, function(json){
                if(before) {
                    before(json);
                }
                var detail = json.diff.detail;
                for(x in detail) {
                    var linediff = detail[x].linediff;
                    for(y in linediff) {
                        var i = 0;
                        for(z in linediff[y]) {
                            var linenum_left = linediff[y][z][0];
                            var linenum_right = linediff[y][z][1];
                            var line = linediff[y][z][2];
                            var is_remove = (linenum_left != 0 && linenum_right == 0);
                            var is_add = (linenum_left == 0 && linenum_right != 0)
                            var class_ = 'common';
                            if(is_remove) {
                                class_ = 'deletion';
                                line = '-' + line;
                            }
                            if(is_add) {
                                class_ = 'addition';
                                line = '+' + line;
                            }
                            if(!is_remove && !is_add) {
                                line = ' ' + line;
                            }
                            line = line.replace(/ /g,'&nbsp;')
                            if(linenum_left == 0) {
                                linenum_left = '';
                            }
                            if(linenum_right == 0) {
                                linenum_right = '';
                            }
                            if(i == 0) {
                                class_ = class_ + ' first';
                            }
                            if(i == linediff[y].length - 1) {
                                class_ = class_ + ' last';
                            }
                            linediff[y][z][0] = linenum_left;
                            linediff[y][z][1] = linenum_right;
                            linediff[y][z][2] = line;
                            linediff[y][z].push(class_);
                            i = i + 1;
                        }
                    }
                }
                var html = repo_diff_tmpl(json);
                selector.html(html);
                $('.cLineContext').removeClass('btn-disable');
                $('.lineContext' + line_context).addClass('btn-disable');
                if(after) {
                    after(json);
                }
            });
        },
        loadCommits: function(selector, before, after, after_load_commits) {
            var url = this.is_pull ?
                        _.sprintf('/%s/%s/pull/commits/%s:%s...%s:%s/', this.user_name, this.repo_name, this.desc_repo_username, this.to_refs, this.source_repo_username, this.from_refs) :
                        _.sprintf('/%s/%s/commits/%s...%s/', this.user_name, this.repo_name, this.from_refs, this.to_refs) ;
            var from_refs = this.from_refs;
            var to_refs = this.to_refs;
            var is_pull = this.is_pull;
            $.post(url, {csrfmiddlewaretoken: csrfmiddlewaretoken}, function(json){
                if(before) {
                    before(json);
                }
                var is_up_to_date = false;
                var source_commit_hash = is_pull ? json.source_repo_refs_commit_hash.substr(0, 7) : json.from_commit_hash.substr(0, 7);
                var desc_commit_hash = is_pull ? json.desc_repo_refs_commit_hash.substr(0, 7) : json.to_commit_hash.substr(0, 7);
                var exists_commit_hash_map = {};
                exists_commit_hash_map[source_commit_hash] = 1
    
                for(var x in json.commits) {
                    var commit = json.commits[x];
                    var commit_hash = commit.commit_hash;
                    if(commit_hash in exists_commit_hash_map) {
                        for(y in json.commits[x].parent_commit_hash) {
                            exists_commit_hash_map[json.commits[x].parent_commit_hash[y]] = 1;
                        }
                    }
                    var committer_moment = moment(new Date(commit.committer_date*1000)).fromNow();
                    commit.committer_moment = committer_moment;
                }

                if(desc_commit_hash in exists_commit_hash_map) {
                    is_up_to_date = true;
                }
                var html = '<p class="alert alert-info">已经是最新的.</p>';
                if(!is_up_to_date) {
                    html = repo_commits_tmpl(json);
                }
                selector.html(html);
                if(!is_up_to_date) {
                    json.allow_merge = true;
                }
                if(!is_pull) {
                    var refs_meta = json.refs_meta;
                    if(refs_meta.branches.indexOf(from_refs) < 0 || refs_meta.branches.indexOf(to_refs) < 0) {
                        json.allow_merge = false;
                    }
                }
                if(after) {
                    after(json);
                }
                if(after_load_commits) {
                    after_load_commits(json);
                }
            });
        },
        selectDiff: function(before, after) {
        },
        selectCommits: function(before, after) {
        },
        navDiff: function() {
            $('.cPullRequestContent').each(function(index){
                $(this).hide();
            });
            $('#pullRequestDiff').show();
        },
        navCommits: function() {
            $('.cPullRequestContent').each(function(index){
                $(this).hide();
            });
            $('#pullRequestCommits').show();
        },
        registerLineContextEvent: function(selector) {
            var repoComparer = this;
            $('.cLineContext').live('click', function(){
                var line = $(this).data('line');
                repoComparer.setLineContext(line);
                repoComparer.loadDiff(selector, null, this.navDiff);
            });
        },
        renderCompare: function(selector, after_load_commits) {
            selector.html(repo_commits_diff_nav_template);
            var repoComparer = this;
            $('.cPullRequestAction').click(function(){
                var action = $(this).data('action');
                $('.cPullRequestAction').each(function(index){
                    $(this).removeClass('active');
                });
                $(this).addClass('active');
                $('.cPullRequestContent').each(function(index){
                    $(this).hide();
                });
                $('.ajaxLoader').show();
                if(action == 'commit') {
                    $('#selectLineContext').hide();
                    repoComparer.loadCommits($('#pullRequestCommits'), null, repoComparer.navCommits, after_load_commits);
                } else if(action == 'diff') {
                    $('#selectLineContext').show();
                    repoComparer.loadDiff($('#pullRequestDiff'), null, repoComparer.navDiff);
                }
            });
            this.registerLineContextEvent($('#pullRequestDiff'));
            this.loadCommits($('#pullRequestCommits'), null, this.navCommits, after_load_commits);
        },


    }
    // feed render
    function Feed(feeds, mode) {
        this.feeds = feeds;
        this.mode = mode;
        this.feed_type_action = {
            100: '新建合并请求', 101: '合并', 102: '合并失败', 103: '拒绝合并请求', 104: '关闭合并请求', 105: '评论合并请求',
            300: '新建问题', 301: '更新问题', 302: '编辑问题',
        };
    }
    Feed.prototype = {
        sorted_feed_ids: function() {
            var _this = this;
            var all_feed_ids = [];
            for(x in _this.feeds) {
                all_feed_ids = all_feed_ids.concat(_this.feeds[x]);
            }
            all_feed_ids.sort(function(a,b) {
                return a[1] - b[1];
            });
            var uniq_feed_ids = []
            var pre_feed_id = 0;
            for(x in all_feed_ids) {
                feed_id = all_feed_ids[x][0];
                if(pre_feed_id != feed_id) {
                    uniq_feed_ids.push(feed_id);
                }
                pre_feed_id = feed_id;
            }
            return uniq_feed_ids;
        },
        request_feeds: function(selector, uniq_feed_ids, before, after) {
            var _this = this;
            var feed_ids_str = uniq_feed_ids.join('_');
            $.post('/ajax/feed/ids/', {'ids_str': feed_ids_str, csrfmiddlewaretoken: csrfmiddlewaretoken}, function(json){
                if(before) {
                    before(json);
                }
                json['feed_type_action'] = _this.feed_type_action;
                var html = feed_tmpl(json);
                selector.html(html);
                if(after) {
                    after(json);
                }
            });
        },
        render: function(selector, before, after) {
            var _this = this;
            var uniq_feed_ids = _this.sorted_feed_ids();
            _this.request_feeds(selector, uniq_feed_ids, before, after)
        },
        
    }
    // end
    this.csrfmiddlewaretoken = csrfmiddlewaretoken;
    this.RepoComparer = RepoComparer;
    this.Feed = Feed;
}).call(this);


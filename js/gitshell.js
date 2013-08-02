// gitshell.js
// author: cloudzhou
// gitshell.com

(function (undefined) {
    // global variable
    var csrfmiddlewaretoken = $('meta[name=csrf-token]').attr("content");
    // global action
    _.mixin(_.str.exports())
    moment.lang('zh-cn')
    $('.unixtime').each(function(index){ 
        $(this).html(moment(new Date($(this).html()*1000)).fromNow());
        $(this).show();
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

        setPullUsername : function(source_repo_username, desc_repo_username) {
            this.source_repo_username = source_repo_username;
            this.desc_repo_username = desc_repo_username;
            this.is_pull = true;
        },
        setLineContext : function(line_context) {
            this.line_context = line_context;
        },
        loadDiff : function(selector, before, after) {
            var url = this.is_pull ?
                        _.sprintf('/%s/%s/pull/diff/%s:%s..%s:%s/%s/', this.user_name, this.repo_name, this.source_repo_username, this.from_refs, this.desc_repo_username, this.to_refs, this.line_context) :
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
                if(after) {
                    after(json);
                }
            });
        },
        loadCommits : function(selector, before, after, after_load_commits) {
            var url = this.is_pull ?
                        _.sprintf('/%s/%s/pull/commits/%s:%s...%s:%s/', this.user_name, this.repo_name, this.desc_repo_username, this.to_refs, this.source_repo_username, this.from_refs) :
                        _.sprintf('/%s/%s/commits/%s...%s/', this.user_name, this.repo_name, this.to_refs, this.from_refs) ;
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
                exists_commit_hash_map[desc_commit_hash] = 1
    
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

                if(source_commit_hash in exists_commit_hash_map) {
                    is_up_to_date = true;
                }
                var html = '<p>Already up-to-date. 你并不需要进行合并操作</p>';
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
        selectDiff : function(before, after) {
        },
        selectCommits : function(before, after) {
        },
        navDiff : function() {
            $('.c_pull_request_content').each(function(index){
                $(this).hide();
            });
            $('#i_pull_request_diff').show();
        },
        navCommits : function() {
            $('.c_pull_request_content').each(function(index){
                $(this).hide();
            });
            $('#i_pull_request_commits').show();
        },
        renderCompare : function(selector, after_load_commits) {
            selector.html(repo_commits_diff_nav_template);
            var repoComparer = this;
            $('.c_pull_request_action').click(function(){
                var action = $(this).data('action');
                $('.c_pull_request_action').each(function(index){
                    $(this).removeClass('active');
                });
                $(this).addClass('active');
                $('.c_pull_request_content').each(function(index){
                    $(this).hide();
                });
                $('#i_ajax_loading').show();
                if(action == 'commit') {
                    $('#i_select_line_context').hide();
                    repoComparer.loadCommits($('#i_pull_request_commits'), null, repoComparer.navCommits, after_load_commits);
                } else if(action == 'diff') {
                    $('#i_select_line_context').show();
                    repoComparer.loadDiff($('#i_pull_request_diff'), null, repoComparer.navDiff);
                }
            });
            $('.c_line_context').click(function(){
                $('#i_line_context').text($(this).text());
                repoComparer.setLineContext($(this).text());
                repoComparer.loadDiff($('#i_pull_request_diff'), null, this.navDiff);
            });
            this.loadCommits($('#i_pull_request_commits'), null, this.navCommits, after_load_commits);
        },


    }
    // end
    this.csrfmiddlewaretoken = csrfmiddlewaretoken;
    this.RepoComparer = RepoComparer;
}).call(this);

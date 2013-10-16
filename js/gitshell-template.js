// gitshell-template.js
// author: cloudzhou
// gitshell.com

var repo_commits_diff_nav_template =
'    <ul class="nav nav-tabs">' +
'        <li class="cPullRequestAction active" data-action="commit"><a href="javascript:void(0)">提交</a></li>' +
'        <li class="cPullRequestAction" data-action="diff">' +
'            <a href="javascript:void(0)">代码差异</a>' +
'        </li></ul>' +
'    <div id="pullMetaData">' +
'        <div class="ajaxLoader cPullRequestContent"><img src=\'/static/img/loading.gif\' alt="loader"><p>正在加载...</p></div>' +
'        <div id="pullRequestCommits" class="cPullRequestContent hide"></div>' +
'        <div id="pullRequestDiff" class="cPullRequestContent hide"></div>' +
'    </div>';

var repo_commits_template = 
'   <table class="table commits"><thead><tr><th class="author">提交者</th><th class="hash">哈希</th><th class="msg">注释</th><th class="date">时间</th></tr></thead><tbody>' +
'       <% _.each(commits, function(commit){ %>' +
'           <tr><td class="author"><a href="/<%-commit.committer_name%>/"><img src="https://gravatar.com/avatar/<%-commit.committer_name%>?s=16" alt="<%-commit.committer_name%>"><%-commit.committer_name%></a></td><td class="hash"><a href="#"><%-commit.commit_hash%></a></td><td class="msg"><%-commit.commit_message%></td><td class="date"><time pubdate="pubdate"><%-commit.committer_moment%></time></td></tr>' +
'       <% }); %>' + 
'   </tbody></table>';
var repo_commits_tmpl = _.template(repo_commits_template);

repo_diff_template =
'   <% if(diff.numstat.length == 0){ %>' +
'   <p class="alert alert-info">没有不同的地方</p>' + 
'   <% } %>' +
'   <div class="diff-header">' +
'       <div class="title"><h3 class="heading">修改文件<strong><%-diff.changedfiles_count%></strong><span class="detail">添加行数<strong><%-diff.total_add_line%></strong>, 删除行数<strong><%-diff.total_delete_line%></strong>, 总计行数<strong><%-diff.abs_change_line%></strong></span></h3>' +
'    <div id="selectLineContext" class="diff-context-option">' +
'       <span class="txt" data-toggle="tooltip" title="显示代码修改部分的上下文代码行数">上下文<i class="icon-question-sign"></i></span>' +
'       <span class="btn-group"><a id="lineContext3" class="cLineContext btn btn-mini first" data-line="3" href="javascript:void(0)">3行</a>' +
'       <a id="lineContext5" class="cLineContext btn btn-mini middle" data-line="5" href="javascript:void(0)">5行</a>' +
'       <a id="lineContext10" class="cLineContext btn btn-mini middle" data-line="10" href="javascript:void(0)">10行</a>' +
'       <a id="lineContext20" class="cLineContext btn btn-mini last" data-line="20" href="javascript:void(0)">20行</a></span></div>' +
'    </div>' +
'       <ul class="diff-list">' +
'       <% _.each(diff.numstat, function(numstat){ %>' +
'           <li><span class="diff-linenumber clearfix"><span class="added">+ <%-numstat[0]%></span><span class="removed">- <%-numstat[1]%></span></span><a href="#chg-<%-numstat[2]%>" class="file"><%-numstat[2]%></a></li>' +
'       <% }); %>' +
'       </ul>' +
'   </div>' +
'   <div class="diff-body">' +
'       <% _.each(diff.detail, function(detail){ %>' +
'       <section class="diff-item-container">' +
'               <header class="item-header clearfix"><h1 id="chg-<%-detail.filename%>" class="heading"><%-detail.filename%></h1><a href="<%-detail.filepath%>" class="view-file">查看原文件</a></header>' +
'               <div class="item-body">' +
'                 <div class="data-container">' +
'                   <% _.each(detail.linediff, function(linediff){ %>' +
'                       <% _.each(linediff, function(linediff_item){ %>' +
'                       <div class="<%-linediff_item[3]%>">' +
'                           <a href="javascript:void(0)" class="line-numbers"><span class="l1"><%-linediff_item[0]%></span><span class="l2"><%-linediff_item[1]%></span></a>' +
'                           <pre class="data"><%=linediff_item[2]%></pre>' +
'                       </div>' +
'                       <% }) %>' +
'                   <% }) %>' +
'                </div>' +
'               </div>' +
'           </section>' +
'       <% }); %>' +
'   </div>';

var repo_diff_tmpl = _.template(repo_diff_template);


// gitshell-template.js
// author: cloudzhou
// gitshell.com

var repo_commits_diff_nav_template =
'    <ul class="nav nav-tabs">' +
'        <li class="cPullRequestAction active" data-action="commit"><a href="javascript:void(0)">Commits</a></li>' +
'        <li class="cPullRequestAction" data-action="diff">' +
'            <a href="javascript:void(0)">Diff</a>' +
'        </li>' +
'        <li id="selectLineContext" class="dropdown hide">' +
'            <a class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">Diff Context 上下行数(<span id="lineContext">3</span>) <b class="caret"></b></a>' +
'            <ul class="dropdown-menu">' +
'                <li><a class="cLineContext" href="javascript:void(0)">3</a></li>' +
'                <li><a class="cLineContext" href="javascript:void(0)">5</a></li>' +
'                <li><a class="cLineContext" href="javascript:void(0)">10</a></li>' +
'                <li><a class="cLineContext" href="javascript:void(0)">20</a></li>' +
'            </ul>' +
'        </li>' +
'    </ul>' +
'    <div id="pullMetaData" class="bubble">' +
'        <div class="ajaxLoader" class="cPullRequestContent"><img src=\'/static/img/loading.gif\' alt="loader"><p>正在加载...</p></div>' +
'        <div id="pullRequestCommits" class="cPullRequestContent hide"></div>' +
'        <div id="pullRequestDiff" class="cPullRequestContent hide"></div>' +
'    </div>';

var repo_commits_template = 
'   <table class="table"><thead><tr><th>提交HASH (作者)</th><th>时间</th><th>日志</th></tr></thead><tbody>' +
'       <% _.each(commits, function(commit){ %>' +
'           <tr><td><code><%-commit.commit_hash%></code><span>(<%-commit.committer_name%>)</span></td><td><span style="display: inline;"><%-commit.committer_moment%></span></td><td><%-commit.commit_message%></td></tr>' +
'       <% }); %>' + 
'   </tbody></table>';
var repo_commits_tmpl = _.template(repo_commits_template);

repo_diff_template =
'   <% if(diff.numstat.length == 0){ %>' +
'   <p>没有不同的地方</p>' + 
'   <% } %>' +
'   <div class="diff-header">' +
'       <p>修改文件(<%-diff.changedfiles_count%>), 添加行数(<%-diff.total_add_line%>), 删除行数(<%-diff.total_delete_line%>), 总计行数(<%-diff.abs_change_line%>)</p>' +
'       <ul class="diff-list">' +
'       <% _.each(diff.numstat, function(numstat){ %>' +
'           <li class="clearfix"><span class="diff-linenumber clearfix"><span class="added">+ <%-numstat[0]%></span><span class="removed">- <%-numstat[1]%></span></span><a href="#chg-<%-numstat[2]%>"><%-numstat[2]%></a></li>' +
'       <% }); %>' +
'       </ul>' +
'   </div>' +
'   <div class="diff-body">' +
'       <% _.each(diff.detail, function(detail){ %>' +
'       <section class="diff-item-container">' +
'               <header class="item-header clearfix"><h1 id="chg-<%-detail.filename%>" class="heading"><%-detail.filename%></h1><a href="<%-detail.filepath%>" class="view-file">View File</a></header>' +
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


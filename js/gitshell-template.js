// gitshell-template.js
// author: cloudzhou
// gitshell.com

var repo_commits_diff_nav_template =
'    <ul class="nav nav-tabs" style="margin-bottom: 10px">' +
'        <li class="c_pull_request_action active" data-action="commit"><a href="javascript:void(0)">Commits</a></li>' +
'        <li class="c_pull_request_action" data-action="diff">' +
'            <a href="javascript:void(0)">Diff</a>' +
'        </li>' +
'        <li id="i_select_line_context" class="dropdown hide">' +
'            <a class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">上下行数(<span id="i_line_context">3</span>) <b class="caret"></b></a>' +
'            <ul class="dropdown-menu">' +
'                <li><a class="c_line_context" href="javascript:void(0)">3</a></li>' +
'                <li><a class="c_line_context" href="javascript:void(0)">5</a></li>' +
'                <li><a class="c_line_context" href="javascript:void(0)">10</a></li>' +
'                <li><a class="c_line_context" href="javascript:void(0)">20</a></li>' +
'            </ul>' +
'        </li>' +
'    </ul>' +
'    <div id="i_pull_meta_data">' +
'        <div id="i_ajax_loading" class="c_pull_request_content"><img style="margin-left: 50px" src=\'/static/img/loading.gif\'></div>' +
'        <div id="i_pull_request_commits" class="c_pull_request_content hide"></div>' +
'        <div id="i_pull_request_diff" class="c_pull_request_content hide"></div>' +
'    </div>';

var repo_commits_template = 
'   <table class="table table-striped"><thead class="fixed"><tr><th width="20%">提交HASH (作者)</th><th width="10%">时间</th><th>日志</th></tr></thead><tbody>' +
'       <% _.each(commits, function(commit){ %>' +
'           <tr><td><code><%-commit.commit_hash%></code><span>(<%-commit.committer_name%>)</span></td><td><span style="display: inline;"><%-commit.committer_moment%></span></td><td><%-commit.commit_message%></td></tr>' +
'       <% }); %>' + 
'   </tbody></table>';
var repo_commits_tmpl = _.template(repo_commits_template);

repo_diff_template =
'<div id="diff">' +
'   <% if(diff.numstat.length == 0){ %>' +
'   <p>没有不同的地方</p>' + 
'   <% } %>' +
'   <div class="diff-header">' +
'       <ul class="diff-list">' +
'       <% _.each(diff.numstat, function(numstat){ %>' +
'           <li class="clearfix"><span class="diff-linenumber clearfix"><span class="added">+ <%-numstat[0]%></span><span class="removed">- <%-numstat[1]%></span></span><a href="#chg-<%-numstat[2]%>"><%-numstat[2]%></a></li>' +
'       <% }); %>' +
'       </ul>' +
'   </div>' +
'   <div class="diff-body">' +
'       <% _.each(diff.detail, function(detail){ %>' +
'       <div class="diff-item-container">' +
'               <div class="item-header clearfix"><h3 id="chg-<%-detail.filename%>" class="heading"><%-detail.filename%></h3><a href="<%-detail.filepath%>" class="view-file">View File</a></div>' +
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
'           </div>' +
'       <% }); %>' +
'   </div>' +
'</div>';

var repo_diff_tmpl = _.template(repo_diff_template);


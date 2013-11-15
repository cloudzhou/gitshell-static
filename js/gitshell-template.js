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

var repo_diff_template =
'   <% if(diff.numstat.length == 0){ %>' +
'   <p class="alert alert-info">没有不同的地方</p>' + 
'   <% } %>' +
'   <div class="diff-header">' +
'       <div class="title"><h3 class="heading">修改<strong><%-diff.changedfiles_count%></strong>个文件<span class="detail">添加行数<strong><%-diff.total_add_line%></strong>, 删除行数<strong><%-diff.total_delete_line%></strong>, 总计行数<strong><%-diff.abs_change_line%></strong></span></h3>' +
'    <div id="selectLineContext" class="diff-context-option">' +
'       <span class="txt" data-toggle="tooltip" title="显示代码修改部分的上下文代码行数">上下文<i class="icon-question-sign"></i></span>' +
'       <span class="btn-group"><a class="cLineContext lineContext3 btn btn-mini first" data-line="3" href="javascript:void(0)">3行</a>' +
'       <a class="cLineContext lineContext5 btn btn-mini middle" data-line="5" href="javascript:void(0)">5行</a>' +
'       <a class="cLineContext lineContext10 btn btn-mini middle" data-line="10" href="javascript:void(0)">10行</a>' +
'       <a class="cLineContext lineContext20 btn btn-mini last" data-line="20" href="javascript:void(0)">20行</a></span></div>' +
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

var feed_template = 
'    <% if(feeds.length == 0) { %>' +
'      <div class="inner"><p class="alert blank-alert"><i class="icon-bell"></i><em>没有feed 信息，请多关注活跃开发者或者仓库</em></p></div>' +
'    <% } else { %>' +
'      <% _.each(feeds, function(feed){ %>' +
'        <% if(feed.relative_obj === null) { %>' +
'          <% return %>' +
'        <% } %>' +
'        <% if(feed.feed_type == 0) { %>' +
'          <section class="feed-item">' +
'            <span class="feed-type commit">提交更新</span>' +
'            <figure class="avatar"><img src="https://gravatar.com/avatar/<%=feed.id%>?s=32"></figure>' +
'              <div class="detail">' + 
'                <time class="date unixtime" pubdate="pubdate"><%=feed.relative_obj.modify_time%></time>' +
'                <p class="title">' +
'                  <a href="/<%=feed.id%>/" class="author"><%=feed.id%></a>' +
'                  提交更新到' +
'                  <a class="issue-link" href="/<%=feed.id%>/"><%=feed.id%></a>' +
'                </p>' +
'                <ul class="subject commits">' +
'                  <li>' +
'                    <img src="https://gravatar.com/avatar/<%=feed.id%>?s=15">'+
'                    <a href="/<%=feed.id%>/" class="author"><%=feed.id%></a>' +
'                    - <span class="commit-msg"><%=feed.relative_obj.subject%></span>' +
'                  </li>' +
'                </ul>' +
'              </div>' +
'          </section>' +
'        <% } else if(feed.feed_type == 2) { %>' +
'          <section class="feed-item">' +
'            <span class="feed-type commit">推送提交</span>' +
'            <figure class="avatar"><img src="https://gravatar.com/avatar/<%=feed.id%>?s=32"></figure>' +
'              <div class="detail">' + 
'                <time class="date unixtime" pubdate="pubdate"><%=feed.relative_obj.modify_time%></time>' +
'                <p class="title">' +
'                  <a href="/<%=feed.id%>/" class="author"><%=feed.id%></a>' +
'                  推送提交' +
'                  <a class="issue-link" href="/<%=feed.id%>/"><%=feed.id%></a>' +
'                </p>' +
'                <ul class="subject commits">' +
'                  <% _.each(feed.relative_obj.commits, function(commit){ %>' +
'                  <li>' +
'                    <img src="https://gravatar.com/avatar/<%=commit.id%>?s=15">'+
'                    <a href="/<%=commit.id%>/" class="author"><%=commit.id%></a>' +
'                    - <span class="commit-msg"><%=commit.subject%></span>' +
'                  </li>' +
'                  <% }); %>' + 
'                </ul>' +
'              </div>' +
'          </section>' +
'        <% } else if(feed.feed_type >= 100 && feed.feed_type <= 105) { %>' +
'          <section class="feed-item">' +
'            <span class="feed-type pull">合并请求</span>' +
'              <figure class="avatar"><img src="https://gravatar.com/avatar/<%=feed.id%>?s=32" alt=""></figure>' +
'              <div class="detail">' + 
'                <time class="date unixtime" pubdate="pubdate"><%=feed.relative_obj.modify_time%></time>' +
'                <p class="title">' +
'                  <a href="/<%=feed.id%>/" class="author"><%=feed.id%></a>' +
'                  <%=feed_type_action[feed.feed_type]%>' +
'                  <a class="issue-link" href="/<%=feed.id%>/<%=feed.id%>/issues/<%=feed.id%>/"><%=feed.id%>/<%=feed.id%> #<%=feed.id%></a>' +
'                </p>' +
'              </div>' +
'              <p class="subject"><span><%=feed.relative_obj.short_title%></span></p></div>' +
'          </section>' +
'        <% } else if(feed.feed_type >= 300 && feed.feed_type <= 302) { %>' +
'          <section class="feed-item">' +
'            <span class="feed-type issue">问题</span>' +
'              <figure class="avatar"><img src="https://gravatar.com/avatar/<%=feed.id%>?s=32" alt=""></figure>' +
'              <div class="detail">' + 
'                <time class="date unixtime" pubdate="pubdate"><%=feed.relative_obj.modify_time%></time>' +
'                <p class="title">' +
'                  <a href="/<%=feed.id%>/" class="author"><%=feed.id%></a>' +
'                  <%=feed_type_action[feed.feed_type]%>' +
'                  <a class="issue-link" href="/<%=feed.id%>/<%=feed.id%>/issues/<%=feed.id%>/"><%=feed.id%>/<%=feed.id%> #<%=feed.id%></a>' +
'                </p>' +
'              </div>' +
'              <p class="subject"><span><%=feed.relative_obj.subject%></span></p></div>' +
'          </section>' +
'        <% } %>' +
'      <% }); %>' +
'    <% } %>';
var feed_tmpl = _.template(feed_template);



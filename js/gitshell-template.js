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
'       {{#each commits}}' +
'           <tr><td><code>{{{commit_hash}}}</code><span>({{{committer}}})</span></td><td><span style="display: inline;">{{{committer_moment}}}</span></td><td>{{{commit_message}}}</td></tr>' +
'       {{/each}}' + 
'   </tbody></table>';
var repo_commits_tmpl = Handlebars.compile(repo_commits_template);

repo_diff_template =
'<div id="diff_numstat">' +
'   {{#each diff.numstat}}' +
'       <div><span class="margin-left-10 label label-success">+ {{{this.[0]}}}</span><span class="margin-left-10 label label-important">- {{{this.[1]}}}</span><span class="margin-left-10 c_diff_stat_filename"><a href="#chg-{{{this.[2]}}}">{{{this.[2]}}}</a></span></div>' +
'   {{/each}}' +
'</div>' +
'{{#if diff.numstat}}' + 
'<div class="page-header" style="margin: 0px"></div>' +
'{{/if}}' + 
'<div id="diff_detail">' +
'   {{#each diff.detail}}' +
'       <div><a id="chg-{{{this.filename}}}"><p class="c_diff_file_filename">{{{this.filename}}}</p></a><div class="well">' +
'       {{#each this.linediff}}' +
'           <table>' +
'           {{#each this}}' +
'               <tr class="{{{this.[3]}}}"><td>{{{this.[0]}}}</td><td>{{{this.[1]}}}</td><td>{{{this.[2]}}}</td></tr>' +
'           {{/each}}' +
'           </table>' +
'       {{/each}}' +
'       </div></div>' +
'   {{/each}}' +
'</div>';
var repo_diff_tmpl = Handlebars.compile(repo_diff_template);


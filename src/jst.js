//This file is generated by bin/hook.js
var template = require('lodash.template');
module.exports = {

  'add': template('<span class="add-comment"></span>'),

  'form': template('<form>	<textarea name="comment" placeholder="<%- placeholder %>"></textarea>	<input name="picture" type="file" />	<p><%- addAt %> <strong class="comment-time">0</strong> <%- minutes %></p>	<div class="submit-comment">		<button type="button"><%- send %></button>	</div></form>'),

  CSS: {
    
      'add': '.comments-controls[data-comments-controls]{display:inline-block;float:left;color:#fff;line-height:32px;font-size:10px;font-weight:700;margin-right:3px}.comments-controls[data-comments-controls] .add-comment{cursor:pointer;opacity:.8;font-weight:lighter}.comments-controls[data-comments-controls] .add-comment:before{font-size:16px}.comments-controls[data-comments-controls] .add-comment:hover{text-shadow:rgba(255,255,255,.8) 0 0 5px;opacity:1}.comments-bar{display:inline-block;float:left;line-height:32px;font-size:10px;font-weight:700;margin-left:6px}.comment-pointer{position:absolute;left:20px;top:8px;width:2px;height:8px;background:#90ee90;color:#90ee90;transition:background .2s linear}.comment-pointer:hover{background:red}.video-comment{color:#fff;text-align:left;font-size:12px!important}.comment-actif{padding:5px!important}.img-comment{min-width:100px;min-height:50px}.img-comment img{max-width:200px;max-height:200px}.img-comment .spinner-three-bounce{top:25%}.img-comment .spinner-three-bounce>div{width:10px;height:10px}.media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-scrubber[data-seekbar]{z-index:99}.seek-time[data-seek-time]{height:initial!important}',
    
      'form': '.form-comment{position:absolute;width:50%;margin-left:auto;margin-right:auto;text-align:left;background:#fff;right:5px;bottom:100px;z-index:999999;padding:5px!important;visibility:hidden;opacity:0;transition:hidden 0s .2s,opacity .2s linear;border-radius:5px;cursor:default}.form-comment button,.form-comment input,.form-comment textarea{font:initial;font-size:initial;line-height:initial;color:initial}.form-comment p{color:initial;font-size:initial!important}.form-comment input[type=file]{display:none}.form-comment textarea{width:100%}.form-comment .submit-comment{text-align:center}.show-form{visibility:visible;opacity:.9}',
    
  }
};

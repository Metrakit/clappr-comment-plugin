//This file is generated by bin/hook.js
var _ = require('underscore');
module.exports = {

  'add': _.template('<div class="add-comment">Comment</div>'),

  'bar': _.template('dfdfdfd<script>console.log("yeah")</script>'),

  'form': _.template('<form>	<textarea placeholder="Put a comment here"></textarea>	<p>Add a comment at <strong class="comment-time">0</strong></p>	<div class="submit-comment">		<button type="button">Send</button>	</div></form>'),

  CSS: {
    
      'add': '.comments-controls[data-comments-controls]{display:inline-block;float:left;color:#fff;line-height:32px;font-size:10px;font-weight:700;margin-left:6px}.comments-controls[data-comments-controls] .add-comment{cursor:default;font-family:Roboto,"Open Sans",Arial,sans-serif}.media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button{background-color:red!important}',
    
      'bar': '.comments-bar{display:inline-block;float:left;line-height:32px;font-size:10px;font-weight:700;margin-left:6px}body{background:lightgrey}',
    
      'form': '.form-comment{position:absolute;width:50%;margin-left:auto;margin-right:auto;text-align:left;background:#fff;right:5px;bottom:100px;z-index:999999;padding:5px!important;visibility:hidden;opacity:0;transition:hidden 0s .2s,opacity .2s linear;border-radius:5px;cursor:default}.form-comment textarea{width:100%}.form-comment .submit-comment{text-align:center}.show-form{visibility:visible;opacity:.9}',
    
  }
};

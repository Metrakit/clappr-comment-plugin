var UiCorePlugin = require('ui_core_plugin');
var JST = require('./jst');
var Styler = require('./styler');
var Events = require('events');
var _ = require('underscore');

/*

Creer un autre plugin pour partager sur les resaux sociaux avec le temps actuel en utilisant les ancres, exemple :
#temps=20

*/

class Testcore extends UiCorePlugin {

  get name() { return 'testcore'; }
  get events() {
    return {
      'click .add-comment': 'click',
    }
  }
  get attributes() {
    return {
      'class': 'comments-controls',
      'data-comments-controls': '',
    }
  }


  constructor(core) {
    super(core)
    this.core = core
    this.percentTime = 0
    this.actualTime = 0
    this.percentHoverTime = 0
  }


  bindEvents() {
    this.listenTo(this.core.mediaControl, 'mediacontrol:rendered', this.make)
    this.listenTo(this.core.mediaControl, 'mediacontrol:mousemove:seekbar', this.hoverBar)
    this.listenTo(this.core.mediaControl.container, 'container:timeupdate', this.timeUpdate)
    this.listenTo(this.core.mediaControl.container, 'container:play', this.play)
  }


  render() {
    this.make()
  }


  play() {
    this.dismissForm()
  }


  dismissForm() {
    if ($(this.$el.formComment).css('visibility') == "visible") {
      $(this.$el.formComment).removeClass('show-form')
    }
  }


  make() {
      // Create new DOM element add a button
    var styleAddBtn = Styler.getStyleFor('add');

    this.$playButton = this.core.mediaControl.$el.find('.media-control-button');

    this.$el.html(JST.add)
          .append(styleAddBtn)

    this.core.mediaControl.$('.media-control-right-panel[data-media-control]').append(this.$el);


    // Create new DOM element for the second bar
    /*var styleBar = Styler.getStyleFor('bar');
    this.$el.bar = document.createElement("div")

    $(this.$el.bar).html(JST.bar)
          .append(styleBar)
          .addClass('comments-bar')
    this.core.mediaControl.$('.media-control-right-panel[data-media-control]').append(this.$el.bar)

    this.core.mediaControl.$('.media-control-right-panel[data-media-control]')
    .find('.comments-bar').click(() => this.clickTest(this)) */


    // Create new DOM element for add the form
    var styleForm = Styler.getStyleFor('form');
    this.$el.formComment = document.createElement("div")
    $(this.$el.formComment).html(JST.form)
          .addClass('form-comment')
          .append(styleForm)
    this.core.mediaControl.container.$el.append(this.$el.formComment)

    this.core.mediaControl.container.$el.find('.form-comment').click(function(e) {
      e.stopPropagation();
    });

    this.getComments(1)

    this.core.mediaControl.container.$el.find('.submit-comment').click(() => this.submitComment(this));
  
    this.core.mediaControl.$seekBarContainer.append(this.commentPointer)

    //this.core.mediaControl.$seekBarContainer.find('.comment-pointer').on('mouseover', () => this.showComment(this));

    this.core.mediaControl.seekTime.$el.prepend('<div class="video-comment"></div>')

    return this;
  }

  getComments(videoId) {  
    if (!this.pointers) {
      this.pointers = new Array;
      $.get('http://minetop.com/comments-video/' + videoId, (function(data) {
        for(var i = 0; i < data.length; i++) {
            this.createCommentPointer(data[i])
        }
        //this.core.mediaControl.$seekBarContainer.find('.comment-pointer').on('mouseover', () => this.showComment(this));
      var elem = this;
      this.core.mediaControl.$seekBarContainer.find('.comment-pointer').on('mouseover', (function(e) {
        elem.showComment(elem, this)
      }));
      this.core.mediaControl.$seekBarContainer.find('.comment-pointer').on('mouseout', () => this.hideComment(this));

      }).bind(this))


    }
  }

  createCommentPointer(data) {
    this.pointers[data.percent] = document.createElement("span")
    $(this.pointers[data.percent]).addClass("comment-pointer")
        .attr('data-percent-comment', data.percent)
        .attr('data-comment', data.comment)
        .attr('data-img-url')
    $(this.pointers[data.percent]).css('left', data.percent + '%');

    this.core.mediaControl.$seekBarContainer.append(this.pointers[data.percent])
  }


  showComment(elem, pointer) {
    elem.core.mediaControl.seekTime.$('.video-comment').html($(pointer).attr('data-comment'))
      .addClass('comment-actif')
  }

  hideComment(elem) {
    elem.core.mediaControl.seekTime.$('.video-comment').html('')
      .removeClass('comment-actif')
  }

  submitComment(elem) {
    var form = elem.core.mediaControl.container.$el.find('form')
    var inputs = $(form).serializeArray()
    console.log(inputs)
   /* $.post('http://minetop.com/submit-comment', { inputs }, function(response){
      // process response
    })*/

    $.ajax({
      url: 'http://minetop.com/submit-comment',
      type: 'POST',
      data: inputs,
      dataType: 'json',
      success: function(data){
        var time = 30;
      }
    })
  }

  click() { 

    if ($(this.$el.formComment).css('visibility') == "visible") {
      console.log($(this.$el.formComment))
      $(this.$el.formComment).removeClass('show-form')
    } else {

      this.core.mediaControl.container.pause()
      this.$playButton.addClass('paused')
      //this.timeUpdate
      console.log('click on button, temps actuel: ' + this.percentTime + '%')
      console.log('Poster un commentaire a ' + Math.round(this.actualTime) + ' secondes')

      $(this.$el.formComment).find('.comment-time').text(Math.round(this.actualTime)/100)
      $(this.$el.formComment).addClass('show-form')

    }

  }

  hoverBar(event) {

    var width = this.core.mediaControl.$seekBarContainer[0].scrollWidth;
    var currentWidth = event.pageX;

    var diff = width - currentWidth;

    this.percentHoverTime = 100 - ((diff / width) * 100);

    $('.bob').text(Math.round(this.percentHoverTime) + '%');

  }

  timeUpdate(position, duration) {
    this.actualTime = position;
    this.percentTime = ((position / duration) * 100);
    $('.bob2').text(Math.round(this.percentTime) + '%');

    if ($(this.$el.formComment).css('visibility') == "visible") {
      $(this.$el.formComment).find('.comment-time').text(Math.round(this.actualTime)/100)
    }
  }


}


module.exports = window.Testcore = Testcore;
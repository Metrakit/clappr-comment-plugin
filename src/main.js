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
    //this.percentTime = 0
    this.actualTime = 0
    //this.percentHoverTime = 0    
  }


  bindEvents() {
    this.listenTo(this.core.mediaControl, 'mediacontrol:rendered', this.make)
    //this.listenTo(this.core.mediaControl, 'mediacontrol:mousemove:seekbar', this.hoverBar)
    this.listenTo(this.core.mediaControl.container, 'container:timeupdate', this.timeUpdate)
    this.listenTo(this.core.mediaControl.container, 'container:play', this.play)
  }


  render() {
    this.core.options.commentImg = this.core.options.commentImg != undefined ? this.core.options.commentImg : true;
    this.videoId = this.core.$el.parent().attr('data-video-id')
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

    if (!isNaN(this.core.mediaControl.container.getDuration())) {
      this.getComments(this.core.options.videoId)
    } else {
      this.videoUnReady = true
    }

    this.core.mediaControl.container.$el.find('.submit-comment').click(() => this.submitComment(this));
  
    this.core.mediaControl.$seekBarContainer.append(this.commentPointer)

    this.core.mediaControl.seekTime.$el.prepend('<div class="video-comment"></div>')

  }

  getComments(videoId) { 

    if (!this.pointers) {
      this.pointers = new Array;
      $.get(this.core.options.urlGetComments + '/' + videoId, (function(data) {

        for(var i = 0; i < data.length; i++) {
            this.createCommentPointer(data[i])
        }
        //this.core.mediaControl.$seekBarContainer.find('.comment-pointer').on('mouseover', () => this.showComment(this));
        this.displayingComment(this)
      }).bind(this))

    }
  }

  displayingComment(elem) {
    this.core.mediaControl.$seekBarContainer.find('.comment-pointer').on('mouseover', (function(e) {
      elem.showComment(elem, this)
    }));
    this.core.mediaControl.$seekBarContainer.find('.comment-pointer').on('mouseout', () => this.hideComment(this));
  }

  /**
    Data :
      comment
      time
      imgUrl
  **/
  createCommentPointer(data) {
    //console.log(data)
    this.pointers[data.time] = document.createElement("span")
    $(this.pointers[data.time]).addClass("comment-pointer")
        .attr('data-comment', data.comment)

    if(data.imgUrl) {
      $(this.pointers[data.time]).attr('data-imgUrl', data.imgUrl)
      //console.log('img url')
    }
        //this.timeUpdate
    this.timePercent = (data.time / this.core.mediaControl.container.getDuration()) * 100
    $(this.pointers[data.time]).css('left', this.timePercent + '%');
    //console.log(this.timePercent)
    if (!isNaN(this.timePercent)) {
      this.core.mediaControl.$seekBarContainer.append(this.pointers[data.time])
    }
    
  }

  showComment(elem, pointer) {
    elem.core.mediaControl.seekTime.$('.video-comment')
      .html($(pointer).attr('data-comment'))
      .addClass('comment-actif')
      //console.log(this.core.options.videoId)
      if (this.core.options.videoId && $(pointer).attr('data-imgUrl')) {
        elem.core.mediaControl.seekTime.$('.video-comment').prepend('<div class="img-comment"><div class="spinner-three-bounce" data-spinner><div data-bounce1></div><div data-bounce2></div><div data-bounce3></div></div></div>')

        $("<img />").attr('src', $(pointer).attr('data-imgUrl'))
        .load(function() {
            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                // wrong image
            } else {
                elem.core.mediaControl.seekTime.$('.img-comment').html(this)

                // doesnt work :
               /*this.animate({
                  opacity: 0.25
                }, 500, 'ease-out');*/

            }
        });
    
      }
  }

  hideComment(elem) {
    elem.core.mediaControl.seekTime.$('.video-comment').html('')
      .removeClass('comment-actif')
  }

  submitComment(elem) {

    var form = elem.core.mediaControl.container.$el.find('form') 
    var fd = new FormData();
    //var file_data = $('input[type="file"]')[0].files; // for multiple files
   /* for(var i = 0;i<file_data.length;i++){
        fd.append("file_"+i, file_data[i]);
    }*/
    var inputs = $(form).serializeArray();
    $.each(inputs, function(key, input) {
        fd.append(input.name, input.value);
    })
    fd.append('time', Math.round(elem.actualTime));


    $.ajax({
      url: this.core.options.urlAddComments,
      type: 'POST',
      data: fd,
      async: false,
      success: function(data){
        elem.createCommentPointer(data)
        elem.displayingComment(elem)
        elem.dismissForm()
      },
      cache: false,
      contentType: false,
      processData: false
    })
  }

  click() { 

    if ($(this.$el.formComment).css('visibility') == "visible") {
      $(this.$el.formComment).removeClass('show-form')
    } else {
      this.core.mediaControl.container.pause()
      this.$playButton.addClass('paused')
      var actualTime = Math.round(this.actualTime)/100
      $(this.$el.formComment).find('.comment-time').text(actualTime)
      $(this.$el.formComment).addClass('show-form')
      //console.log('click on button, temps actuel: ' + this.percentTime + '%')
      //console.log('Poster un commentaire a ' + Math.round(this.actualTime) + ' secondes')s
    }

  }

  timeUpdate(position, duration) {
    this.actualTime = position;
    /*this.percentTime = ((position / duration) * 100);
    $('.bob2').text(Math.round(this.percentTime) + '%');*/

    if ($(this.$el.formComment).css('visibility') == "visible") {
      $(this.$el.formComment).find('.comment-time').text(Math.round(this.actualTime)/100)
    }

    if (this.videoUnReady && this.videoUnReady == true) {
      this.getComments(this.core.options.videoId)
      this.videoUnReady == false
    }
  }

  /*hoverBar(event) {

    // BETTER :
    //this.core.mediaControl.container.getDuration()
    var width = this.core.mediaControl.$seekBarContainer[0].scrollWidth;
    var currentWidth = event.pageX;

    var diff = width - currentWidth;

    this.percentHoverTime = 100 - ((diff / width) * 100);

    $('.bob').text(Math.round(this.percentHoverTime) + '%');

  }*/

}


module.exports = window.Testcore = Testcore;
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
      'click .comments-bar': 'clickBar',
      'click .form-comment': 'clickForm',
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

    this.$el.formComment = document.createElement("div")
    this.$el.bar = document.createElement("div")

  }


  bindEvents() {

    this.listenTo(this.core.mediaControl, 'mediacontrol:rendered', this.make)
    this.listenTo(this.core.mediaControl, 'mediacontrol:mousemove:seekbar', this.hoverBar)
    this.listenTo(this.core.mediaControl.container, 'container:timeupdate', this.timeUpdate)
    this.listenTo(this.core.mediaControl.container, 'container:play', this.play)

  }


  render() {

  }


  play() {

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
    var styleBar = Styler.getStyleFor('bar');

    $(this.$el.bar).html(JST.bar)
          .append(styleBar)
          .addClass('comments-bar')
    this.core.mediaControl.$('.media-control-right-panel[data-media-control]').append(this.$el.bar)


    // Create new DOM element for add the form
    var styleForm = Styler.getStyleFor('form');

    $(this.$el.formComment).html(JST.form)
          .addClass('form-comment')
          .append(styleForm)
    this.core.mediaControl.container.$el.append(this.$el.formComment)
  

    return this
  }


  clickForm() {
    alert('lol')
  }


  click() { 

    if ($(this.$el.formComment).css('visibility') == "visible") {

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


  clickBar() {

    console.log('petit click sur la bar trankil')

  }


  submitComment () {
    $.post('/submit-comment', { comment: 'bob' }, function(response){
      // process response
    })
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

var UiCorePlugin = require('ui_core_plugin');
var JST = require('./jst');
var Styler = require('./styler');
var Events = require('events');

/*

Creer un autre plugin pour partager sur les resaux sociaux avec le temps actuel en utilisant les ancres, exemple :
#temps=20

*/

class Testcore extends UiCorePlugin {

  get name() { return 'testcore'; }

  get events() {
    return {
      'click .add-comment': 'click'
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
   // this.settingsUpdate()
    this.render()
    this.percentTime = 0
    this.actualTime = 0
    this.percentHoverTime = 0
  }


  render() {

    var style = Styler.getStyleFor('add')
    this.$el.html(JST.add)
    this.$el.append(style)

    this.$playButton = this.core.mediaControl.$el.find('.media-control-button')

    //this.core.mediaControl.$el.addClass('live')
    this.core.mediaControl.$('.media-control-right-panel[data-media-control]').append(this.$el)
    /*if (this.$duration) {
      this.$duration.remove()
    }
    this.$duration = $('<span data-duration></span>')
    this.core.mediaControl.seekTime.$el.append(this.$duration)*/

    return this;
  }



  click() { 
    this.core.mediaControl.container.pause()
    this.$playButton.addClass('paused')
    this.timeUpdate
    console.log('click on button, temps actuel: ' + this.percentTime + '%')
    console.log('Poster un commentaire a ' + Math.round(this.actualTime) + ' secondes')
  }

  

  settingsUpdate() {
      
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl, 'mediacontrol:mousemove:seekbar', this.hoverBar)
    this.listenTo(this.core.mediaControl.container, 'container:timeupdate', this.timeUpdate)
  } 

  hoverBar(event) {
  	//console.log(event.pageX);
  	//console.log(event.timeStamp);
    //console.log(this.core); 
    //this.timeUpdate();
    // A TESt :
    //console.log(this.core.mediaControl.container); 

    //console.log(this.core.mediaControl.$seekBarContainer[0].scrollWidth);
    this.render()  // a delete
    var width = this.core.mediaControl.$seekBarContainer[0].scrollWidth;
    var currentWidth = event.pageX;

    var diff = width - currentWidth;

    this.percentHoverTime = 100 - ((diff / width) * 100);

    $('.bob').text(Math.round(this.percentHoverTime) + '%');

    //console.log(this.$playWrapper);

  }

  timeUpdate(position, duration) {
    this.actualTime = position;
    this.percentTime = ((position / duration) * 100);
    $('.bob2').text(Math.round(this.percentTime) + '%');
  }

}


module.exports = window.Testcore = Testcore;

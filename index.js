var UiCorePlugin = require('ui_core_plugin');
var JST = require('./jst');

class Testcore extends UiCorePlugin {
  get name() { return 'testcore'; }

  render() {
    console.log("rendering", this.name);
    var style = $('<style>').html(JST.CSS[this.name]);
    this.$el.append(style);
    return this;
  }

  constructor(core) {
    super(core)
    this.core = core
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl, 'mediacontrol:mousemove:seekbar', this.hoverBar)
    this.listenTo(this.core.mediaControl.container, 'container:timeupdate', this.timeUpdate)
  }

  hoverBar(event) {
  	console.log(event.pageX);
  	console.log(event.timeStamp);
    console.log(this.core); 
    this.timeUpdate();
    // A TESt :
    //console.log(this.core.mediaControl.container); 
  }

  timeUpdate(position, duration) {
    console.log(position);
  }

}


module.exports = window.Testcore = Testcore;

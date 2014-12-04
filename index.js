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
  }

  hoverBar(event) {
  	console.log(event.pageX);
  	console.log(event.timeStamp);
  }

}


module.exports = window.Testcore = Testcore;

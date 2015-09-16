var UICorePlugin = Clappr.UICorePlugin;
var JST = require('./jst');
var Styler = require('./styler');
var Events = Clappr.Events;

class Comments extends UICorePlugin {

  get name() { return 'comments'; }

  get events() {
    return {
      'click .add-comment': 'clickOnContainer',
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
    this.actualTime = 0
  }


  /**
   * Bind events
   */
  bindEvents() {
    this.listenTo(this.core.mediaControl, 'mediacontrol:rendered', this.make)
    this.listenTo(this.core.mediaControl.container, 'container:timeupdate', this.timeUpdate)
    this.listenTo(this.core.mediaControl.container, 'container:play', this.play)
  }


  /**
   * Render
   */
  render() {
    this.core.options.commentImg = this.core.options.commentImg != undefined ? this.core.options.commentImg : true;
    this.videoId = this.core.$el.parent().attr('data-video-id')
    this.make()
  }


  /**
   * Event on play
   */
  play() {
    this.dismissForm()
  }


  /**
   * Make the template and prepare the plugin
   */
  make() {
      // Create new DOM element add a button
    var styleAddBtn = Styler.getStyleFor('add');
    console.log(styleAddBtn[0])

    this.$playButton = this.core.mediaControl.$el.find('.media-control-button');
    this.$el.html(JST.add)
          .append(styleAddBtn[0]);

    this.core.mediaControl.$('.media-control-right-panel[data-media-control]').append(this.$el);



    // Create new DOM element for add the form
    var styleForm = Styler.getStyleFor('form');

    /**
     *  Style options
     */

    var styleOptions = '<style class="clappr-style">';

    // [OPTION] Icon font
    if (this.core.options.iconFont) {
      styleOptions += ".add-comment { font-family: " + this.core.options.iconFont + " !important; } ";
    }    

    // [OPTION] Pointer color
    if (this.core.options.pointerColor) {
      styleOptions += ".comment-pointer { background: " + this.core.options.pointerColor + " !important; } ";
    }    


    styleOptions += "</style>";

    this.$el.formComment = document.createElement("div")

    if (this.core.options.texts) {
      var formText = {
        addAt: this.core.options.texts.addComment ? this.core.options.texts.addComment : "Add a comment at",
        minutes: this.core.options.texts.minutes ? this.core.options.texts.minutes : "minutes",
        placeholder: this.core.options.texts.commentPlaceholder ? this.core.options.texts.commentPlaceholder : "Put a comment here",
        send: this.core.options.texts.sendComment ? this.core.options.texts.sendComment : "Send"
      }
    } else {
      var formText = {
        addAt: "Add a comment at",
        minutes: "minutes",
        placeholder: "Put a comment here",
        send: "Send"
      }

    }

   $(this.$el.formComment).html(JST.form(formText))
          .addClass('form-comment')
          .append(styleForm[0])
          .append(styleOptions)
    this.core.mediaControl.container.$el.append(this.$el.formComment)

    this.core.mediaControl.container.$el.find('.form-comment').click(function(e) {
      e.stopPropagation();
    });


    /**
     *  Options
     */

    // [OPTION] Icon for add a new comment or Text
    if (this.core.options.iconComment) {
      this.core.mediaControl.$el.find('.add-comment').addClass(this.core.options.iconComment);
    } else if (this.core.options.texts && this.core.options.texts.addCommentLink) {
      this.core.mediaControl.$el.find('.add-comment').text(this.core.options.texts.addCommentLink);
    } else {
      this.core.mediaControl.$el.find('.add-comment').text('Comment');
    }

    // [OPTION] Display input file if picture is enabled
    if (this.core.options.enablePicture) {
      this.core.mediaControl.container.$el.find('input[type="file"]').show();
    }  


    // Generate comment (get the video Id in option)
    if (!isNaN(this.core.mediaControl.container.getDuration())) {
      this.getComments(this.core.options.videoId)
    } else {
      this.videoUnReady = true
    }

    this.core.mediaControl.container.$el.find('.submit-comment').click(() => this.submitComment(this));
  
    this.core.mediaControl.$seekBarContainer.append(this.commentPointer)

    this.core.mediaControl.seekTime.$el.prepend('<div class="video-comment"></div>')

    $('.form-comment input[type="file"]').change(function(){
      if (this.files && this.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              $('.form-comment img').attr('src', e.target.result);
          }
          reader.readAsDataURL(this.files[0]);
      }
    });

  }


  /**
   * Get the comments with API (GET)
   * @param  Int videoId
   */
  getComments(videoId) { 

    if (!this.pointers) {
      this.pointers = new Array;
      // Alert if "urlGetComments" is missing
      if (!this.core.options.urlGetComments) {
        alert('An url is needed in the options for the API (POST). Option "urlGetComments"'); return;
      }

      $.get(this.core.options.urlGetComments + '/' + videoId, (function(data) {

        for(var i = 0; i < data.length; i++) {
            this.createCommentPointer(data[i])
        }

        this.displayingComment(this)
      }).bind(this))

    }
  }


  /**
   * Display comment when event with mouse
   * @param Object this
   */
  displayingComment(elem) {
    this.core.mediaControl.$seekBarContainer.find('.comment-pointer').on('mouseover', (function(e) {
      elem.showComment(elem, this)
    }));
    this.core.mediaControl.$seekBarContainer.find('.comment-pointer').on('mouseout', () => this.hideComment(this));
  }


  /**
   * Create a comment pointers
   * @param Json data[comment, time, imgUrl]
   */
  createCommentPointer(data) {

    this.pointers[data.time] = document.createElement("span")
    $(this.pointers[data.time]).addClass("comment-pointer")
        .attr('data-comment', data.comment)

    if(data.imgUrl) {
      $(this.pointers[data.time]).attr('data-imgUrl', data.imgUrl)
    }

    this.timePercent = (data.time / this.core.mediaControl.container.getDuration()) * 100
    $(this.pointers[data.time]).css('left', this.timePercent + '%');

    if (!isNaN(this.timePercent)) {
      this.core.mediaControl.$seekBarContainer.append(this.pointers[data.time])
    }
    
  }


  /**
   * Show a comment when hover a pointer
   * @param  this
   * @param  DOM pointer
   */
  showComment(elem, pointer) {
    elem.core.mediaControl.seekTime.$('.video-comment')
      .html($(pointer).attr('data-comment'))
      .addClass('comment-actif');

      if (this.core.options.videoId && $(pointer).attr('data-imgUrl')) {
        elem.core.mediaControl.seekTime.$('.video-comment').prepend('<div class="img-comment"><div class="spinner-three-bounce" data-spinner><div data-bounce1></div><div data-bounce2></div><div data-bounce3></div></div></div>')
        var img = $("<img />").attr('src', $(pointer).attr('data-imgUrl'));
        img.on('load', function(){
            console.log("test")
            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                // wrong image
            } else {
              console.log(this)
                elem.core.mediaControl.seekTime.$('.img-comment').html(this)
            }        
        }); 
      }
  }


  /**
   * Hide a comment
   * @param  this
   */
  hideComment(elem) {
    elem.core.mediaControl.seekTime.$('.video-comment').html('')
      .removeClass('comment-actif')
  }


  /**
   * Send a new comment to API (POST) 
   * Data: 
   *     comment (string)
   *     picture (file, optionnal)
   *     time (int)   
   * @param Object this
   */
  submitComment(elem) {

    // Alert if "urlAddComments" is missing
    if (!this.core.options.urlAddComments) {
      alert('An url is needed in the options for the API (POST). Option "urlAddComments"'); return;
    }

    var form = elem.core.mediaControl.container.$el.find('form') 
    var fd = new FormData();

    // [OPTION] Add input file if enabled
    if (this.core.options.enablePicture) {

        var picture = $('input[type="file"]')[1].files;

      if (picture.length == 1) {
        fd.append('picture', picture[0])
      }
  
    }

    // All inputs
    var inputs = $(form).serializeArray();

    $.each(inputs, function(key, input) {
        fd.append(input.name, input.value);
    })
    fd.append('time', Math.round(elem.actualTime));

    // Ajax request for send the comment form
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


  /**
   * Dismiss the form
   */
  dismissForm() {
    if ($(this.$el.formComment).css('visibility') == "visible") {
      $(this.$el.formComment).removeClass('show-form')
    }
  }


  /**
   * Event when click on container
   */
  clickOnContainer() { 

    if ($(this.$el.formComment).css('visibility') == "visible") {
      $(this.$el.formComment).removeClass('show-form')
    } else {
      this.core.mediaControl.container.pause()
      this.$playButton.addClass('paused')
      var actualTime = Math.round(this.actualTime)/100
      $(this.$el.formComment).find('.comment-time').text(actualTime)
      $(this.$el.formComment).addClass('show-form')
    }

  }


  /**
   * Event when time change
   * @param Int position
   * @param Int duration
   */
  timeUpdate(position, duration) {
    this.actualTime = position;

    if ($(this.$el.formComment).css('visibility') == "visible") {
      $(this.$el.formComment).find('.comment-time').text(Math.round(this.actualTime)/100)
    }

    if (this.videoUnReady && this.videoUnReady == true) {
      this.getComments(this.core.options.videoId)
      this.videoUnReady == false
    }
  }


}


module.exports = window.Comments = Comments;
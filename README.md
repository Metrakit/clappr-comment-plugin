Clappr Comment plugin
==================

> A plugin for add comments and show comments on the seekbar of the Clappr HTML5 player

## Requirements

Clappr player: https://github.com/clappr/clappr

## Install

### Bower

```
$ bower install clappr-comment-plugin
```

### Git

```
$ git clone https://github.com/Metrakit/clappr-comment-plugin
```

### Using the Plugin

Add the comments Plugin in the Clappr configuration
```html
      plugins: {
        core: [Comments]
      },
```

You can also add some options :
```html
      plugins: {
        core: [Comments]
      },

      // Comment options
      videoId: 1,
      urlGetComments: "http://localhost/comments-video",
      urlAddComments: "http://localhost/submit-comment",
      iconComment: "fa fa-comment-o",
      iconFont: "FontAwesome",
      pointerColor: "orange",
      enablePicture: true,
      texts: {
        addComment: 'Add a comment at',
        addCommentLink: "Comment",
        minutes: "minutes",
        commentPlaceholder: "Put a comment here",
        sendComment: "Send"
      }
```


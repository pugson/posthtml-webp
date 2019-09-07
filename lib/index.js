'use strict'

module.exports = function (options) {
  if (!options) {
    options = {}
  }

  if (options.replaceExtension === undefined) {
    options.replaceExtension = true
  }

  return function posthtmlWebp (tree) {
    tree.match({ tag: 'img' }, function (imgNode) {
      if (imgNode.skip) return imgNode
      return getPicture(imgNode, options)
    })

    return tree
  }
}

function removeExtension (filename) {
  var extIndex = filename.lastIndexOf('.')
  if (extIndex === -1) {
    // Filename has no extension
    return filename
  } else {
    return filename.substring(0, extIndex)
  }
}

function getPicture (imgNode, options) {
  imgNode.skip = true

  var src = imgNode.attrs.src;
  var set = imgNode.attrs.srcset;
  if (options.replaceExtension) {
    src = removeExtension(src);
    set = set.replace('.png', '.webp').replace('.jpg', '.webp').replace('.jpeg', '.webp');
  }
  src += '.webp'

  return {
    tag: 'picture',
    content: [
      {
        tag: 'source',
        attrs: {
          type: 'image/webp',
          srcset: `${src}, ${set}`
        }
      },
      imgNode
    ]
  }
}

// ==UserScript==
// @name Google Code Reference Commander
// @author potix2
// @version 0.0.1
// @namespace https://github.com/potix2/
// @match https://code.google.com/apis/*/reference.html
// @match http://code.google.com/apis/*/reference.html
// ==/UserScript==

(function() {
  function gotoBookmark(name) {
    var parts = location.href.split("#");
    location.href = parts[0] + "#" + name;
  }

  function showSearchBox() {
    var sb = document.getElementById('gc-ref-commander-searchbox');
    sb.style.display = 'block';
    var input = document.getElementById('gc-ref-commander-searchbox-input');
    input.value = '';
    input.focus();
  }

  function search(keyword) {
    gotoBookmark(keyword);
    document.getElementById('gc-ref-commander-searchbox-input').blur();
  }

  function hideSearchBox() {
    document.getElementById('gc-ref-commander-searchbox-input').blur();
    var sb = document.getElementById('gc-ref-commander-searchbox');
    sb.style.display = 'none';
  }

  function handlerSearchBoxKeyPress(e) {
    if ( e.keyCode == 13 ) {
      //Enter
      hideSearchBox();
      console.log(e.target.value);
      search(e.target.value);
    }
  }

  function handlerSearchBoxKeyUp(e) {
    if ( e.keyCode == 27 ) {
      //ESC
      hideSearchBox();
    }
  }


  function handlerCloseButton(e) {
    e.preventDefault();
    hideSearchBox();
  }

  var globalKeymap = {
    'gg': function(e) {
      gotoBookmark("top");
      return true;
    },
    '/': function(e) {
      showSearchBox();
      return true;
    }
  };

  var stack = "";
  var timer = 0;
  function handleKeys(e, m) {
    var c = String.fromCharCode(e.which ? e.which :
      e.keyCode ? e.keyCode : e.charCode);
    stack += c;
    var u = 0;
    for (var k in m) {
      if (k == stack) {
        e.preventDefault();
        var f = m[stack];
        if (f) {
          stack = "";
          if (f(e)) return true;
        }
        return false;
      } else if (k.substring(0, stack.length) == stack) {
        u++;
      }
    }
    try { clearTimeout(timer) } catch(ee) {};
    if (u) {
      e.preventDefault();
      timer = setTimeout(function() {
        var f = m[stack];
        stack = "";
        if (f) f(e);
      }, 2000);
    } else {
      stack = "";
    }
  }

  function hasClass(elem, clazz) {
    var zz = elem.className.split(/\s+/g);
    for (var m = 0; m < zz.length; m++) {
      if (zz[m] == clazz) return true;
    }
    return false;
  }

  function install() {
    var searchBoxElem = document.createElement('div');
    searchBoxElem.innerHTML = '<div id="gc-ref-commander-searchbox" class="gcrcommander" style="position: fixed; right: 0; top: 0; width: 200px; height: 24px; background-color: #e2e2e2; padding-left:4px; padding-right:4px; border: 1px solid #aaa; display: none; ">'
      + '<input id="gc-ref-commander-searchbox-input" class="gcrcommander" type="text" name="searchbox-input" style="width:175px;" />'
      + '<a id="gc-ref-commander-searchbox-close" class="gcrcommander" style="color: #bbb; text-decoration: none; width: 10px; display: bock; padding-left:6px;" href="#">X</a>'
      + '</div>';
    document.getElementsByTagName('body')[0].appendChild(searchBoxElem);
    document.getElementById('gc-ref-commander-searchbox-input').addEventListener('keypress', handlerSearchBoxKeyPress);
    document.getElementById('gc-ref-commander-searchbox-input').addEventListener('keyup', handlerSearchBoxKeyUp);
    document.getElementById('gc-ref-commander-searchbox-close').addEventListener('click', handlerCloseButton);
  }

  function installGlobalKeys(elem) {
    elem.addEventListener('keypress', function(e) {
      if (e.target.nodeName.toLowerCase() == 'input' ) return;
      return handleKeys(e, globalKeymap);
    }, false)
  }

  setTimeout(install, 1000);
  installGlobalKeys(document.body);
})()

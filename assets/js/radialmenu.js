/*
 * This script is derived from http://wewillbeok.com/radial/ by Jeff Pamer (see http://www.jffrynpmr.com/)
 *
 * Note that there is no copyright information posted on the blog by Jeff Pamer or statement as to terms of use.
 *
 * Have emailed Jeff to get a comment on the terms of use, currently awaiting a reply.
 *
 */

$(document).ready(function() {
  /*
  $("body, window").click(function() {
    $("ul.radial").stop().fadeOut("fast");
  });
  */
});
 
var RadialMenu = function(contentId, options) {
  // return if the context and content id are not specified
  if(!contentId) return null;

  // TODO: add option to exclude listening on subordinate elements within the context
  
  // if a content id is specified, then generate the menu items from the content
  /*
  if(contentId) {
    $('#' + contentId + ' > li').each(function () {
      this.children().each(function() {
        console.log("child " + this);
      })
    });
    
  }
  */
  
  options = options || {};
  
  this.contentId = contentId;
  
  if(options.selectionListener) {
    $('#' + this.contentId + ' a').on('click', options.selectionListener);
  }
  
  // setup the menu based on the specified content
  $('#' + this.contentId).each(function() {
    var itemCount = $(this).children("li").length;
    var max_height = 50;
    var max_width = 50;
    var border_width = 25;
    
    $(this).children("li").each(function() {
      if ($(this).width() > max_width) max_width = $(this).width();
      if ($(this).height() > max_height) max_height = $(this).height(); 
    });
    
    var area = (max_width * max_height) * itemCount * Math.PI;
    var radius = Math.sqrt(area / 4);
    var diameter = radius * 2;
    var circumference = Math.PI * diameter;
    $(this).width(diameter).height(diameter).css("border-radius", diameter).css("-moz-border-radius", diameter).css("margin-left", -(diameter/2));
    
    var alpha = (Math.PI * 2) / itemCount; 
    var top = 0;
    var left = 0;
    
    $(this).children("li").each(function(i) {
      $(this).width(max_width);
      $(this).height(max_height);
      var theta = (alpha * i) - (Math.PI / 2);
      var deg = (alpha * i) * (180 / Math.PI);
      var extra_margin = 0;
      
      top = Math.sin(theta) * (radius - ($(this).height() * 0.75));
      left = Math.cos(theta) * (radius - ($(this).width() * 0.75));
      
      $(this).css("top", top).css("left", left).css("margin-left", radius - ($(this).outerWidth() / 2)).css("margin-top", radius - ($(this).outerWidth() / 2) - extra_margin);
      
      if ($(this).children("span").length > 0) {
        var label = $(this).children("span").eq(0);
        var label_width = circumference / itemCount;
        $(this).after(label.addClass("radial_label"));
        label.width(label_width).css("text-align", "center").css("line-height", border_width + "px");
        if (deg > 90 && deg < 270) deg = deg - 180;
        top = Math.sin(theta) * (radius + (border_width / 2));
        left = Math.cos(theta) * (radius + (border_width / 2));
        label.css("top", top).css("left", left).css("margin-left", radius - label_width / 2).css("margin-top", radius - (border_width / 2)).css("position", "absolute");
        label.css("-webkit-transform", "rotate(" + deg + "deg)").css("-moz-transform", "rotate(" + deg + "deg)");
        
        $(this).hover(function() {
          label.css("text-shadow", "0px 0px 5px #fff");
        }, function() {
          label.css("text-shadow", "none");
        });
      }
      
      $(this).wrapInner("<div class='aligner'></div>");
      var aligner = $(this).children("div.aligner")
      var aligner_height = aligner.outerHeight();
      aligner.css("position", "absolute").css("width", "100%").css("top", "50%").css("margin-top", -(aligner_height / 2)); 
    });
    
    $(this).hide();
    $(this).mouseleave(function() {
      // $(this).stop().fadeOut("fast");
      
    });
  });
  
  this.displayed = false;
  // setup the options with the correponsing defaults
}
 
RadialMenu.prototype = {
    addMenuItem: function(id, name, icon) {
      if(!id) return null;
      
      return this;
    },
    setListener: function(listener) {
      $('#' + this.contentId + ' a').off('click');
      $('#' + this.contentId + ' a').on('click', listener);
    },
    isActive: function() {
      return this.displayed;
    },
    removeMenuItem: function() {
      
      return this;
    },
    disableMenuItem: function(id) {
      // change the style so it is disabled
      $('#' + id).addClass('disabled');
      return this;
    },
    enableMenuItem: function() {
      // change the style so it is enabled
      $('#' + id).removeClass('disabled');
      return this;
    },
    hideMenuItem: function() {
      
      return this;
    },
    showMenuItem: function() {
      
      return this;
    },
    onClick: function(contextId) {
      var that = this;
      
      if(contextId) {
        // setup the listener to display the menu
        $('#' + contextId).on('click', function(e) {
          that.displayMenu(e.pageY, e.pageX);
        });
      }
    },
    displayMenu: function(top, left) {
      var menu = $('#' + this.contentId);
  
      if(menu && menu.hasClass("radial")) {
        var menu_width = menu.outerWidth();
  
        menu.stop().css("top", top - menu_width / 2).css("left", left - 25);
  
        menu.css("-webkit-transform", "scale(0.25)");
        menu.css("-moz-transform", "scale(0.25)");
        menu.css("transform", "scale(0.25)");
        menu.css("opacity", 0.25);
        menu.show();
  
        setTimeout(function() { scaleUp(menu, 0.25) }, 10);
        
        this.displayed = true;
        
        return false;
      }
    },
    hideMenu: function() {
      $('#' + this.contentId).stop().fadeOut("fast");
      this.displayed = false;
    },
    destroy: function() {
    }
}

var MenuItem = function(id, name, options) {
  if(!id) return null;
  
  this.id = id;
  this.name = name || "Menu item";
  
  options = options || {};
  
  this.helpText = options.helpText || '';
  this.icon = options.icon;
  this.enabled = options.enabled || true;
  this.visible = options.visible || true;
  this.actionFn = options.actionFn || function() {};
}

function scaleUp(itemToScale, scaleAmount) {
  if (scaleAmount > 1) scaleAmount = 1;
  itemToScale.css("-webkit-transform", "scale(" + scaleAmount + ")");
  itemToScale.css("-moz-transform", "scale(" + scaleAmount + ")");
  itemToScale.css("transform", "scale(" + scaleAmount + ")");
  itemToScale.css("opcaity", scaleAmount);
  if (scaleAmount < 1)
    setTimeout(function() { scaleUp(itemToScale, scaleAmount + 0.20) }, 7);
  else
    itemToScale.css("opacity", 1);  
}
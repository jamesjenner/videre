/*
 * dropdown.js
 *
 * Copyright (c) 2012 James G Jenner
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/
 */

function DropDown(el, onClickListener) {
    this.dd = el;
    this.placeholder = this.dd.children('input');
    this.opts = this.dd.find('ul.dropdown > li');
    this.val = '';
    this.key = '';
    this.index = -1;
    this.initEvents();
    this.onClickListener = (onClickListener != null) ? onClickListener : function() {};  
}

DropDown.prototype = {
    reInitialise : function(el) {
        this.opts = this.dd.find('ul.dropdown > li');
        
        this.initEvents();
    },
    initEvents : function() {
        var obj = this;
 
        // as this can be called more than once, turn off any existing click listeners
        obj.dd.off('click');
 
        obj.dd.on('click', function(event){
            $(this).toggleClass('active');
            return false;
        });
 
        // as this can be called more than once, turn off any existing click listeners
        obj.opts.off('click');
        obj.opts.on('click', function(){
            var opt = $(this);
            obj.key = opt.find('span').attr('key');
            obj.val = opt.find('span').text();
            obj.index = opt.index();
            obj.placeholder.val(obj.val);
            
            // check for listener, if set then call
            if(obj.onClickListener) {
                obj.onClickListener(obj);
            }
        });
    },
    setOnClickListener : function (listener) {
        this.onClickListener = (listener != null) ? listener : function() {};  
    },
    getValue : function() {
        return this.val;
    },
    getIndex : function() {
        return this.index;
    },
    getKey : function() {
        return this.key;
    }
}

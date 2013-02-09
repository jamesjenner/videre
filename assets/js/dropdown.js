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

function DropDown(el) {
    this.dd = el;
    this.placeholder = this.dd.children('input');
    this.opts = this.dd.find('ul.dropdown > li');
    this.val = '';
    this.key = '';
    this.index = -1;
    this.initEvents();
}

DropDown.prototype = {
    initEvents : function() {
        var obj = this;
 
        obj.dd.on('click', function(event){
            $(this).toggleClass('active');
            return false;
        });
 
        obj.opts.on('click', function(){
            var opt = $(this);
            obj.key = opt.find('span').attr('key');
            obj.val = opt.find('span').text();
            obj.index = opt.index();
            obj.placeholder.val(obj.val);
        });
    },
    initList : function() {
        var obj = this;
        
        obj.opts = this.dd.find('ul.dropdown > li');
        
        obj.opts.off('click');
        
        obj.opts.on('click',function(){
            var opt = $(this);
            obj.key = opt.find('span').attr('key');
            obj.val = opt.find('span').text();
            obj.index = opt.index();
            obj.placeholder.val(obj.val);
        });
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

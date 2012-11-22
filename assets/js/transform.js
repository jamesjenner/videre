/*
Copyright (c) 2012 Ben Olson

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

// obtained from http://benknowscode.wordpress.com/2012/09/10/diving-into-matices-with-css3-transforms-and-jquery/

// also available (and copyright notice sourced from) https://github.com/bseth99/sandbox/blob/master/projects/rotate/4-css-transform.html

var _T = {
    rotate: function(deg)
     {
        var rad = parseFloat(deg) * (Math.PI/180),
            costheta = Math.cos(rad),
            sintheta = Math.sin(rad);

        var a = costheta,
            b = sintheta,
            c = -sintheta,
            d = costheta;

        return $M([
          [a, c, 0],
          [b, d, 0],
          [0, 0, 1]
        ]);
     },

    skew: function(dx, dy)
     {
        var radX = parseFloat(dx) * (Math.PI/180),
            radY = parseFloat(dy) * (Math.PI/180),
            c = Math.tan(radX),
            b = Math.tan(radY);


        return $M([
          [1, c, 0],
          [b, 1, 0],
          [0, 0, 1]
        ]);
     },

    translate: function(x, y)
     {
        var e = x || 0,
            f = y || 0;

        return $M([
          [1, 0, e],
          [0, 1, f],
          [0, 0, 1]
        ]);
     },

    scale: function(x, y)
     {
        var a = x || 0,
            d = y || 0;

        return $M([
          [a, 0, 0],
          [0, d, 0],
          [0, 0, 1]
        ]);
     },

    toString: function (m)
     {
        var s = 'matrix(',
            r, c;

        for (c=1;c<=3;c++)
        {
           for (r=1;r<=2;r++)
              s += m.e(r,c)+', ';
        }

        s = s.substr(0, s.length-2) + ')';

        return s;
     },

    fromString: function (s)
     {
        var t = /^matrix\((\S*), (\S*), (\S*), (\S*), (\S*), (\S*)\)$/g.exec(s),
            a = parseFloat(!t ? 1 : t[1]),
            b = parseFloat(!t ? 0 : t[2]),
            c = parseFloat(!t ? 0 : t[3]),
            d = parseFloat(!t ? 1 : t[4]),
            e = parseFloat(!t ? 0 : t[5]),
            f = parseFloat(!t ? 0 : t[6]);

        return $M([
          [a, c, e],
          [b, d, f],
          [0, 0, 1]
        ]);
     }
};
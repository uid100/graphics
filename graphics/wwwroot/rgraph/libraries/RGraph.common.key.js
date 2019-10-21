// version: 2019-09-08
    // o--------------------------------------------------------------------------------o
    // | This file is part of the RGraph package - you can learn more at:               |
    // |                                                                                |
    // |                         https://www.rgraph.net                                 |
    // |                                                                                |
    // | RGraph is licensed under the Open Source MIT license. That means that it's     |
    // | totally free to use and there are no restrictions on what you can do with it!  |
    // o--------------------------------------------------------------------------------o

    RGraph      = window.RGraph || {isRGraph: true};
    RGraph.HTML = RGraph.HTML || {};

// Module pattern
(function (win, doc, undefined)
{
    //
    // Draws the graph key (used by various graphs)
    // 
    // @param object obj The graph object
    // @param array  key An array of the texts to be listed in the key
    // @param colors An array of the colors to be used
    //
    RGraph.drawKey =
    RGraph.DrawKey = function (obj, key, colors)
    {
        if (!key) {
            return;
        }

        var prop = obj.properties,

            // Key positioned in the margin
            keypos   = prop.keyPosition,
            textsize = prop.textSize,
            key_non_null    = [],
            colors_non_null = [];

        obj.context.lineWidth = 1;

        obj.context.beginPath();

        //
        // Change the older keyVpos to keyPositionY
        //
        if (typeof prop.keyVpos == 'number') {
            obj.set('keyPositionY', prop.keyVpos * obj.get('marginTop'));
        }

        //
        // Account for null values in the key
        //
        for (var i=0; i<key.length; ++i) {
            if (key[i] != null) {
                colors_non_null.push(colors[i]);
                key_non_null.push(key[i]);
            }
        }
        
        key    = key_non_null;
        colors = colors_non_null;
        
        // The key does not use accessible text
        var textAccessible = false;
        
        if (typeof prop.keyTextAccessible === 'boolean') {
            textAccessible = prop.keyTextAccessible;
        }



























        //
        // This does the actual drawing of the key when it's in the graph
        // 
        // @param object obj The graph object
        // @param array  key The key items to draw
        // @param array colors An aray of colors that the key will use
        //
        function DrawKey_graph (obj, key, colors)
        {
            var marginLeft   = obj.marginLeft,
                marginRight  = obj.marginRight,
                marginTop    = obj.marginTop,
                marginBottom = obj.marginBottom,
                hpos         = prop.yaxisPosition == 'right' ? marginLeft + 10 : obj.canvas.width - marginRight - 10,
                vpos         = marginTop + 10,
                title        = prop.title,
                hmargin      = 8, // This is the size of the gaps between the blob of color and the text
                vmargin      = 4, // This is the vertical margin of the key
                fillstyle    = prop.keyBackground,
                strokestyle  = '#333',
                height       = 0,
                width        = 0;
                
                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: obj,
                    prefix: 'keyLabels'
                });

            blob_size = textConf.size; // The blob of color
            text_size = textConf.size;

            if (!obj.coords) obj.coords = {};
            obj.coords.key = [];

            // Need to set this so that measuring the text works out OK
            obj.context.font = (textConf.italic ? 'italic ' : '') +
                      (textConf.bold ? 'bold ' : '') +
                      textConf.size + 'pt ' +
                      textConf.font;
    
            // Work out the longest bit of text
            for (i=0; i<key.length; ++i) {
                width = Math.max(
                    width,
                    obj.context.measureText(key[i]).width);
            }
    
            width += 5;
            width += blob_size;
            width += 5;
            width += 5;
            width += 5;
    
            //
            // Now we know the width, we can move the key left more accurately
            //
            if (   prop.yaxisPosition == 'left'
                || (obj.type === 'pie' && !prop.yaxisPosition)
                || (obj.type === 'hbar' && !prop.yaxisPosition)
                || (obj.type === 'hbar' && prop.yaxisPosition === 'center')
                || (obj.type === 'hbar' && prop.yaxisPosition === 'right')
                || (obj.type === 'rscatter' && !prop.yaxisPosition)
                || (obj.type === 'radar' && !prop.yaxisPosition)
                || (obj.type === 'rose' && !prop.yaxisPosition)
                || (obj.type === 'funnel' && !prop.yaxisPosition)
                || (obj.type === 'vprogress' && !prop.yaxisPosition)
                || (obj.type === 'hprogress' && !prop.yaxisPosition)
               ) {

                hpos -= width;
            }

            //
            // Horizontal alignment
            //
            if (typeof prop.keyHalign == 'string') {
                if (prop.keyHalign === 'left') {
                    hpos = marginLeft + 10;
                } else if (prop.keyHalign == 'right') {
                    hpos = obj.canvas.width - marginRight  - width;
                }
            }
    
            //
            // Specific location coordinates
            //
            if (typeof prop.keyPositionX == 'number') {
                hpos = prop.keyPositionX;
            }
            
            if (typeof(prop.keyPositionY) == 'number') {
                vpos = prop.keyPositionY;
            }
    
    
            // Stipulate the shadow for the key box
            if (prop.keyShadow) {
                obj.context.shadowColor   = prop.keyShadowColor;
                obj.context.shadowBlur    = prop.keyShadowBlur;
                obj.context.shadowOffsetX = prop.keyShadowOffsetx;
                obj.context.shadowOffsetY = prop.keyShadowOffsety;
            }
    
    
    
    
            // Draw the box that the key resides in
            obj.context.beginPath();
                obj.context.fillStyle   = prop.keyBackground;
                obj.context.strokeStyle = 'black';

            if (typeof prop.keyPositionGraphBoxed == 'undefined' || (typeof prop.keyPositionGraphBoxed == 'boolean' && prop.keyPositionGraphBoxed) ) {
                if (arguments[3] != false) {
        
                    obj.context.lineWidth = typeof prop.keyLinewidth == 'number' ? prop.keyLinewidth : 1;
    
                    // The older square rectangled key
                    if (prop.keyRounded == true) {
                        obj.context.beginPath();
                            obj.context.strokeStyle = strokestyle;
                            RGraph.strokedCurvyRect(obj.context, Math.round(hpos), Math.round(vpos), width - 5, 5 + ( (text_size + 5) * RGraph.getKeyLength(key)),4);
                        obj.context.stroke();
                        obj.context.fill();
    
                        RGraph.noShadow(obj);
                
                    } else {
                        obj.context.strokeRect(Math.round(hpos), Math.round(vpos), width - 5, 5 + ( (text_size + 5) * RGraph.getKeyLength(key)));
                        obj.context.fillRect(Math.round(hpos), Math.round(vpos), width - 5, 5 + ( (text_size + 5) * RGraph.getKeyLength(key)));
                    }
                }
            }

            RGraph.noShadow(obj);
    
            obj.context.beginPath();
    
                //
                // Custom colors for the key
                //
                if (prop.keyColors) {
                    colors = prop.keyColors;
                }

    
    
                ////////////////////////////////////////////////////////////////////////////////////////////
    
    

                // Draw the labels given
                for (var i=key.length - 1; i>=0; i--) {

                    var j = Number(i) + 1;

                    //
                    // Draw the blob of color
                    //
                    // An array element, string
                    if (typeof prop.keyColorShape === 'object' && typeof prop.keyColorShape[i] === 'string') {
                        var blob_shape = prop.keyColorShape[i];
                    
                    // An array element, function
                    } else if (typeof prop.keyColorShape === 'object' && typeof prop.keyColorShape[i] === 'function') {
                        var blob_shape = prop.keyColorShape[i];
                    
                    // No array - just a string
                    } else if (typeof prop.keyColorShape === 'string') {
                        var blob_shape = prop.keyColorShape;
                    
                    // No array - just a function
                    } else if (typeof prop.keyColorShape === 'function') {
                        var blob_shape = prop.keyColorShape;

                    // Unknown
                    } else {
                        var blob_shape = 'rect';
                    }

                    if (blob_shape == 'circle') {
                        obj.context.beginPath();
                            obj.context.fillStyle = colors[i];
                            obj.context.arc(hpos + 5 + (blob_size / 2), vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2), blob_size / 2, 0, 6.26, 0);
                        obj.context.fill();
                    
                    } else if (blob_shape == 'line') {
                        obj.context.beginPath();
                            obj.context.strokeStyle = colors[i];
                            obj.context.moveTo(hpos + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));
                            obj.context.lineTo(hpos + blob_size + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));
                        obj.context.stroke();
                    
                    } else if (blob_shape == 'triangle') {
                        obj.context.beginPath();
                            obj.context.strokeStyle = colors[i];
                            obj.context.moveTo(hpos + 5, vpos + (5 * j) + (text_size * j) - text_size + blob_size);
                            obj.context.lineTo(hpos + (blob_size / 2) + 5, vpos + (5 * j) + (text_size * j) - text_size );
                            obj.context.lineTo(hpos + blob_size + 5, vpos + (5 * j) + (text_size * j) - text_size + blob_size);
                        obj.context.closePath();
                        obj.context.fillStyle =  colors[i];
                        obj.context.fill();

                    } else if (typeof blob_shape === 'function') {

                        blob_shape({
                            object: obj,
                            color: colors[i],
                            x: hpos + 5,
                            y: vpos + (5 * j) + (text_size * j) - text_size,
                            width: text_size,
                            height: text_size + 1
                        });
                    } else {
                        obj.context.fillStyle =  colors[i];
                        obj.context.fillRect(
                            hpos + 5,
                            vpos + (5 * j) + (text_size * j) - text_size,
                            text_size,
                            text_size + 1
                        );
                    }
                    
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    

                    obj.context.beginPath();
                    //obj.context.fillStyle = typeof text_color == 'object' ? text_color[i] : text_color;
                    


                    ret = RGraph.text({
                    
                        object:     obj,
                        
                        font:       textConf.font,
                        size:       textConf.size,
                        bold:       textConf.bold,
                        italic:     textConf.italic,
                        color:      typeof textConf.color == 'object' ? textConf.color[i] : textConf.color,

                        x:          hpos + blob_size + 5 + 5 + (prop.keyLabelsOffsetx || 0),
                        y:          vpos + (5 * j) + (text_size * j) + 3 + (prop.keyLabelsOffsety || 0),
                        text:       key[i],
                        accessible: textAccessible
                    });

                    obj.coords.key[i] = [
                        ret.x,
                        ret.y,
                        ret.width,
                        ret.height,
                        key[i],
                        colors[i],
                        obj
                    ];
                }
            obj.context.fill();
        }























        //
        // This does the actual drawing of the key when it's in the margin
        // 
        // @param object obj The graph object
        // @param array  key The key items to draw
        // @param array colors An aray of colors that the key will use
        //
        function DrawKey_margin (obj, key, colors)
        {
            var text_size    = typeof prop.keyLabelsSize == 'number' ? prop.keyLabelsSize : prop.textSize,
                text_bold    = prop.keyLabelsBold,
                text_italic  = prop.keyLabelsItalic,
                text_font    = prop.keyLabelsFont || prop.keyFont || prop.textFont,
                text_color   = prop.keyLabelsColor || prop.textColor,
                marginLeft   = obj.marginLeft,
                marginRight  = obj.marginRight,
                marginTop    = obj.marginTop,
                marginBottom = obj.marginBottom,
                hpos         = ((obj.canvas.width - marginLeft - marginRight) / 2) + obj.marginLeft,
                vpos         = marginTop - text_size - 5,
                title        = prop.title,
                blob_size    = text_size, // The blob of color
                hmargin      = 8, // This is the size of the gaps between the blob of color and the text
                vmargin      = 4, // This is the vertical margin of the key
                fillstyle    = prop.keyBackground,
                strokestyle  = '#999',
                length       = 0;

            if (!obj.coords) obj.coords = {};
            obj.coords.key = [];

    
    
            // Need to work out the length of the key first
            obj.context.font = (obj.properties.keyLabelsItalic ? 'italic ' : '') + (obj.properties.keyLabelsBold ? 'bold ' : '') + text_size + 'pt ' + text_font;

            for (i=0; i<key.length; ++i) {
                length += hmargin;
                length += blob_size;
                length += hmargin;
                length += obj.context.measureText(key[i]).width;
            }
            length += hmargin;
    

    
    
            //
            // Work out hpos since in the Pie it isn't necessarily dead center
            //
            if (obj.type == 'pie') {
                if (prop.align == 'left') {
                    var hpos = obj.radius + marginLeft;
                    
                } else if (prop.align == 'right') {
                    var hpos = obj.canvas.width - obj.radius - marginRight;
    
                } else {
                    hpos = obj.canvas.width / 2;
                }
            }

    
    
    
    
            //
            // This makes the key centered
            //  
            hpos -= (length / 2);

    
            //
            // Override the horizontal/vertical positioning
            //
            if (typeof prop.keyPositionX == 'number') {
                hpos = prop.keyPositionX;

            }

            if (typeof prop.keyPositionY === 'number') {
                vpos = prop.keyPositionY;
            }

    

            //
            // Draw the box that the key sits in
            //
            if (   obj.get('keyPositionGutterBoxed')
                || obj.get('keyPositionMarginBoxed')
               ) {

                if (prop.keyShadow) {
                    obj.context.shadowColor   = prop.keyShadowColor;
                    obj.context.shadowBlur    = prop.keyShadowBlur;
                    obj.context.shadowOffsetX = prop.keyShadowOffsetx;
                    obj.context.shadowOffsetY = prop.keyShadowOffsety;
                }


                obj.context.beginPath();
                    obj.context.fillStyle = fillstyle;
                    obj.context.strokeStyle = strokestyle;

                    if (prop.keyRounded) {
                        RGraph.strokedCurvyRect(obj.context, hpos, vpos - vmargin, length, text_size + vmargin + vmargin)
                        // Odd... RGraph.filledCurvyRect(obj.context, hpos, vpos - vmargin, length, text_size + vmargin + vmargin);
                    } else {
                        obj.context.rect(hpos, vpos - vmargin, length, text_size + vmargin + vmargin);
                    }

                obj.context.stroke();
                obj.context.fill();
    
    
                RGraph.noShadow(obj);
            }

    
            //
            // Draw the blobs of color and the text
            //
    
            // Custom colors for the key
            if (prop.keyColors) {
                colors = prop.keyColors;
            }

            for (var i=0, pos=hpos; i<key.length; ++i) {

                pos += hmargin;

    
    
                //////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    
                // Draw the blob of color
                if (typeof prop.keyColorShape === 'object' && typeof prop.keyColorShape[i] === 'string') {
                    var blob_shape = prop.keyColorShape[i];
                
                } else if (typeof prop.keyColorShape === 'object' && typeof prop.keyColorShape[i] === 'function') {
                    var blob_shape = prop.keyColorShape[i];
                
                // No array - just a function
                } else if (typeof prop.keyColorShape === 'function') {
                    var blob_shape = prop.keyColorShape;
                
                } else if (typeof prop.keyColorShape == 'string') {
                    var blob_shape = prop.keyColorShape;
                
                } else {
                    var blob_shape = 'square';
                }


                //
                // Draw the blob of color - line
                //
                if (blob_shape =='line') {
                    
                    obj.context.beginPath();
                        obj.context.strokeStyle = colors[i];
                        obj.context.moveTo(pos, vpos + (blob_size / 2));
                        obj.context.lineTo(pos + blob_size, vpos + (blob_size / 2));
                    obj.context.stroke();
                    
                // Circle
                } else if (blob_shape == 'circle') {
                    
                    obj.context.beginPath();
                        obj.context.fillStyle = colors[i];
                        obj.context.moveTo(pos, vpos + (blob_size / 2));
                        obj.context.arc(pos + (blob_size / 2), vpos + (blob_size / 2), (blob_size / 2), 0, 6.28, 0);
                    obj.context.fill();
                
                } else if (blob_shape == 'triangle') {
                
                    obj.context.fillStyle = colors[i];
                    obj.context.beginPath();
                        obj.context.strokeStyle = colors[i];
                        obj.context.moveTo(pos, vpos + blob_size);
                        obj.context.lineTo(pos + (blob_size / 2), vpos);
                        obj.context.lineTo(pos + blob_size, vpos + blob_size);
                    obj.context.closePath();
                    obj.context.fill();

                } else if (typeof blob_shape === 'function') {

                    blob_shape({
                        object: obj,
                        color: colors[i],
                        x: pos,
                        y: vpos,
                        width: blob_size,
                        height: blob_size
                    });

                } else {

                    obj.context.beginPath();
                        obj.context.fillStyle = colors[i];
                        obj.context.rect(pos, vpos, blob_size, blob_size);
                    obj.context.fill();
                }
    
    
    
                //////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    
    
                pos += blob_size;
                
                pos += hmargin;
    
                obj.context.beginPath();
                    obj.context.fillStyle = (typeof text_color === 'object') ? text_color[i] : text_color;

                    var ret = RGraph.text({
                    
                        object:     obj,
                        
                        font:       text_font,
                        bold:       text_bold,
                        size:       text_size,
                        italic:     text_italic,
                        
                        x:          pos +  + (prop.keyLabelsOffsetx || 0),
                        y:          vpos + text_size + 1 +  + (prop.keyLabelsOffsety || 0),
                        text:       key[i],
                        accessible: textAccessible
                    });
                obj.context.fill();
                pos += obj.context.measureText(key[i]).width;
            
                obj.coords.key[i] = [
                    ret.x,
                    ret.y,
                    ret.width,
                    ret.height,
                    key[i],
                    colors[i],
                    obj
                ];
            }
        }




        if (keypos && (keypos === 'gutter' || keypos === 'margin')) {
            DrawKey_margin(obj, key, colors);
        } else if (keypos && (keypos === 'graph' || keypos === 'chart') ) {
            DrawKey_graph(obj, key, colors);
        } else {
            alert('[COMMON] (' + obj.id + ') Unknown key position: ' + keypos);
        }






        if (prop.keyInteractive) {

            if (!RGraph.Drawing || !RGraph.Drawing.Rect) {
                alert('[INTERACTIVE KEY] The drawing API Rect library does not appear to have been included (which the interactive key uses)');
            }



            //
            // Check that the RGraph.common.dynamic.js file has been included
            //
            if (!RGraph.installWindowMousedownListener) {
                alert('[INTERACTIVE KEY] The dynamic library does not appear to have been included');
            }



            // Determine the maximum width of the labels
            for (var i=0,len=obj.coords.key.length,maxlen=0; i<len; i+=1) {
                maxlen = Math.max(maxlen, obj.coords.key[i][2]);
            }
    

            //obj.coords.key.forEach(function (value, index, arr)
            //{
            for (var i=0,len=obj.coords.key.length; i<len; i+=1) {
            
                // Because the loop would have finished when the i variable is needed - put
                // the onclick function inside a new context so that the value of the i
                // variable is what we expect when the key has been clicked
                (function (idx)
                {
                    var arr   = obj.coords.key;
                    var value = obj.coords.key[idx];
                    var index = idx;
    

                    var rect = new RGraph.Drawing.Rect({
                        id:     obj.id,
                        x:      value[0],
                        y:      value[1],
                        width:  (prop.keyPosition === 'gutter' || prop.keyPosition === 'margin') ? value[2] : maxlen,
                        height: value[3],
                        options: {
                            colorsFill: 'rgba(0,0,0,0)'
                        }
                    }).draw();
                    
                    rect.onclick = function (e, shape)
                    {
                        rect.context.fillStyle = prop.keyInteractiveHighlightLabel;
                        rect.context.fillRect(shape.x, shape.y, shape.width, shape.height);
    
                        if (typeof obj.interactiveKeyHighlight == 'function') {

                            obj.set('keyInteractiveIndex', idx);

                            RGraph.fireCustomEvent(obj, 'onbeforeinteractivekey');
                            obj.interactiveKeyHighlight(index);
                            RGraph.fireCustomEvent(obj, 'onafterinteractivekey');
                        }
                    }
                    
                    rect.onmousemove = function (e, shape)
                    {
                        return true;
                    }
                })(i);
            }
        }
    };




    //
    // Returns the key length, but accounts for null values
    // 
    // @param array key The key elements
    //
    RGraph.getKeyLength = function (key)
    {
        var length = 0;

        for (var i=0,len=key.length; i<len; i+=1) {
            if (key[i] != null) {
                ++length;
            }
        }

        return length;
    };




    //
    // Create a TABLE based HTML key. There's lots of options so it's
    // suggested that you consult the documentation page
    // 
    // @param mixed id   This should be a string consisting of the ID of the container
    // @param object prop An object map of the various properties that you can use to
    //                    configure the key. See the documentation page for a list.
    //
    RGraph.HTML.key =
    RGraph.HTML.Key = function (id, prop)
    {
        var div = doc.getElementById(id);
        var uid = RGraph.createUID();

        
        //
        // Create the table that becomes the key
        //
        var str = '<table border="0" cellspacing="0" cellpadding="0" id="rgraph_key_' + uid + '" style="display: inline;' + (function ()
            {
                var style = ''
                for (i in prop.tableCss) {
                    if (typeof i === 'string') {
                        style = style + i + ': ' + prop.tableCss[i] + ';';
                    }
                }
                return style;
            })() + '" ' + (prop.tableClass ? 'class="' + prop.tableClass + '"' : '') + '>';



        //
        // Add the individual key elements
        //
        for (var i=0; i<prop.labels.length; i+=1) {
            str += '<tr><td><div style="' + (function ()
            {
                var style = '';

                for (var j in prop.blobCss) {
                    if (typeof j === 'string') {
                        style = style + j + ': ' + prop.blobCss[j] + ';';
                    }
                }

                return style;
            })() + 'display: inline-block; margin-right: 5px; margin-top: 4px; width: 15px; height: 15px; background-color: ' + prop.colors[i] + '"' + (prop.blobClass ? 'class="' + prop.blobClass + '"' : '') + '>&nbsp;</div><td>' + (prop.links && prop.links[i] ? '<a href="' + prop.links[i] + '">' : '') + '<span ' + (prop.labelClass ? 'class="' + prop.labelClass + '"' : '') + '" style="' + (function ()
            {
                var style = '';

                for (var j in prop.labelCss) {
                    if (typeof j === 'string') {
                        style = style + j + ': ' + prop.labelCss[j] + ';';
                    }
                }

                return style;
            })() + ' ' + (function ()
            {
                var style = '';

                if (prop['labelCss_' + i]) {

                    for (var j in prop['labelCss_' + i]) {
                        style = style + j + ': ' + prop['labelCss_' + i][j] + ';';
                    }
                }

                return style ? style + '"' : '"';
            })() + '>' + prop.labels[i] + '</span>' + (prop.links && prop.links[i] ? '</a>' : '') + '</td></tr>';
        }

        div.innerHTML += (str + '</table>');

        // Return the TABLE object that is the HTML key
        return doc.getElementById('rgraph_key_' + uid);
    };




// End module pattern
})(window, document);
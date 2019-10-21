// version: 2019-09-08
    // o--------------------------------------------------------------------------------o
    // | This file is part of the RGraph package - you can learn more at:               |
    // |                                                                                |
    // |                         https://www.rgraph.net                                 |
    // |                                                                                |
    // | RGraph is licensed under the Open Source MIT license. That means that it's     |
    // | totally free to use and there are no restrictions on what you can do with it!  |
    // o--------------------------------------------------------------------------------o

    //
    // Having this here means that the RGraph libraries can be included in any order, instead of you having
    // to include the common core library first.
    //

    // Define the RGraph global variable
    RGraph = window.RGraph || {isRGraph: true};
    RGraph.Drawing = RGraph.Drawing || {};

    //
    // The constructor. This function sets up the object.
    //
    RGraph.Drawing.XAxis = function (conf)
    {
        var id = conf.id
        var y  = conf.y;

        this.id                = id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.y                 = y;
        this.coords            = [];
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false

        // This defines the type of this shape
        this.type = 'drawing.xaxis';


        //This facilitates easy object identification, and should always be true
        this.isRGraph = true;


        // This adds a uid to the object that you can use for identification purposes
        this.uid = RGraph.createUID();


        // This adds a UID to the canvas for identification purposes
        this.canvas.uid = this.canvas.uid ? this.canvas.uid : RGraph.createUID();




        // Some default properties
        this.properties =
        {
            marginLeft:                 25,
            marginRight:                25,

            colors:                     ['black'],
            
            textColor:                  'black', // Defaults to same as chart.colors
            textFont:                   'Arial, Verdana, sans-serif',
            textSize:                   12,
            textBold:                   false,
            textItalic:                 false,
            textAccessible:             true,
            textAccessibleOverflow:     'visible',
            textAccessiblePointerevents:false,

            xaxisLabels:          null,
            xaxisLabelsPosition: 'section',
            xaxisLabelsCount:    5,
            xaxisLabelsFont:     null,
            xaxisLabelsSize:     null,
            xaxisLabelsColor:    null,
            xaxisLabelsBold:     null,
            xaxisLabelsItalic:   null,
            xaxisLabelsOffsetx:  0,
            xaxisLabelsOffsety:  0,
            xaxisLabelsAngle:    0,
            xaxisTickmarksAlign: 'bottom',
            xaxisTickmarksCount: 5,
            xaxisTickmarksLastLeft: true,
            xaxisTickmarksLastRight: true,
            xaxisScaleVisible:   true,
            xaxisScaleFormatter: null,
            xaxisScaleDecimals:  0,
            xaxisScalePoint:     '.',
            xaxisScaleThousand:  ',',
            xaxisScaleInvert:    false,
            xaxisScaleZerostart: true,
            xaxisScaleUnitsPre:       '',
            xaxisScaleUnitsPost:      '',
            xaxisTitle:     '',
            xaxisTitleFont:     null,
            xaxisTitleSize:     null,
            xaxisTitleColor:    null,
            xaxisTitleBold:     null,
            xaxisTitleItalic:   null,
            xaxisTickmarksCount: null,
            xaxis:           true,
            xaxisScaleMax: null,
            xaxisScaleMin: 0,
            xaxisPosition:         'bottom',
            
            yaxisPosition:         'left',

            marginInner:         0,

            linewidth:       1,
            
            tooltips:        null,
            tooltipsEffect:   'fade',
            tooltipsCssClass:'RGraph_tooltip',
            tooltipsEvent:    'onclick',
            
            eventsClick:     null,
            eventsMousemove: null,

            clearto:   'rgba(0,0,0,0)'
        }

        // A simple check that the browser has canvas support
        if (!this.canvas) {
            alert('[DRAWING.XAXIS] No canvas support');
            return;
        }

        // Create the dollar object so that functions can be added to them
        this.$0 = {};


        // Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        // done already
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            
            this.canvas.__rgraph_aa_translated__ = true;
        }




        // Short variable names
        var prop = this.properties,
            path = RGraph.path;
        
        
        
        // "Decorate" the object with the generic effects if the effects library has been included
        if (RGraph.Effects && typeof RGraph.Effects.decorate === 'function') {
            RGraph.Effects.decorate(this);
        }








        //
        // A setter method for setting graph properties. It can be used like this: obj.set('colorsStroke', '#666');
        // 
        // @param name  string The name of the property to set
        // @param value mixed  The value of the property
        //
        this.set = function (name)
        {
            var value = typeof arguments[1] === 'undefined' ? null : arguments[1];

            // the number of arguments is only one and it's an
            // object - parse it for configuration data and return.
            if (arguments.length === 1 && typeof arguments[0] === 'object') {
                for (i in arguments[0]) {
                    if (typeof i === 'string') {
                        this.set(i, arguments[0][i]);
                    }
                }

                return this;
            }

            prop[name] = value;

            return this;
        };








        //
        // A getter method for retrieving graph properties. It can be used like this: obj.get('colorsStroke');
        // 
        // @param name  string The name of the property to get
        //
        this.get = function (name)
        {
            return prop[name];
        };








        //
        // Draws the rectangle
        //
        this.draw = function ()
        {
            // Fire the onbeforedraw event
            RGraph.fireCustomEvent(this, 'onbeforedraw');
            
            
            
            // Stop this growing uncntrollably
            this.coordsText = [];







            // Make the margins easy to access
            this.marginLeft  = prop.marginLeft;
            this.marginRight = prop.marginRight;

            // Parse the colors. This allows for simple gradient syntax
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    
    
            // DRAW X AXIS HERE
            this.drawXAxis();
    

            // This installs the event listeners
            RGraph.installEventListeners(this);
    
    

            // Fire the onfirstdraw event
            if (this.firstDraw) {
                this.firstDraw = false;
                RGraph.fireCustomEvent(this, 'onfirstdraw');
                this.firstDrawFunc();
            }




            // Fire the ondraw event
            RGraph.fireCustomEvent(this, 'ondraw');
            
            return this;
        };








        //
        // Used in chaining. Runs a function there and then - not waiting for
        // the events to fire (eg the onbeforedraw event)
        // 
        // @param function func The function to execute
        //
        this.exec = function (func)
        {
            func(this);
            
            return this;
        };








        //
        // The getObjectByXY() worker method
        //
        this.getObjectByXY = function (e)
        {
            if (this.getShape(e)) {
                return this;
            }
        };








        //
        // Not used by the class during creating the graph, but is used by event handlers
        // to get the coordinates (if any) of the selected shape
        // 
        // @param object e The event object
        //
        this.getShape = function (e)
        {
            var mouseXY = RGraph.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];
    
            if (   mouseX >= this.marginLeft
                && mouseX <= (this.canvas.width - this.marginRight)
                && mouseY >= this.y - (prop.xaxisTickmarksAlign ==  'top' ? (prop.textSize * 1.5) + 5 : 0)
                && mouseY <= (this.y + (prop.xaxisTickmarksAlign ==  'top' ? 0 : (prop.textSize * 1.5) + 5))
               ) {
                
                var x = this.marginLeft;
                var y = this.y;
                var w = this.canvas.width - this.marginLeft - this.marginRight;
                var h = 15;
    
                return {
                    0: this, 1: x, 2: y, 3: w, 4: h, 5: 0,
                    object: this, x: x, y: y, width: w, height: h, index: 0, tooltip: prop.tooltips ? prop.tooltips[0] : null
                };
            }
    
            return null;
        };








        //
        // Each object type has its own Highlight() function which highlights the appropriate shape
        // 
        // @param object shape The shape to highlight
        //
        this.highlight = function (shape)
        {
            if (typeof prop.highlightStyle === 'function') {
                (prop.highlightStyle)(shape);
            }
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors.colors           = RGraph.arrayClone(prop.colors),
                this.original_colors.textColor        = RGraph.arrayClone(prop.textColor),
                this.original_colors.xaxisLabelsColor = RGraph.arrayClone(prop.xaxisLabelsColor),
                this.original_colors.xaxisTitleColor  = RGraph.arrayClone(prop.xaxisTitleColor)
            }

            // Parse various properties for colors
            prop.colors[0]        = this.parseSingleColorForGradient(prop.colors[0]);
            prop.textColor        = this.parseSingleColorForGradient(prop.textColor);
            prop.xaxisLabelsColor = this.parseSingleColorForGradient(prop.xaxisLabelsColor);
            prop.xaxisTitleColor  = this.parseSingleColorForGradient(prop.xaxisTitleColor);
        };








        // Use this function to reset the object to the post-constructor state. Eg reset colors if
        // need be etc
        this.reset = function ()
        {
        };








        // This parses a single color value
        this.parseSingleColorForGradient = function (color)
        {
            if (!color) {
                return color;
            }
    
            if (typeof color === 'string' && color.match(/^gradient\((.*)\)$/i)) {


                // Allow for JSON gradients
                if (color.match(/^gradient\(({.*})\)$/i)) {
                    return RGraph.parseJSONGradient({object: this, def: RegExp.$1});
                }

                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = this.context.createLinearGradient(prop.marginLeft,0,this.canvas.width - prop.marginRight,0);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RGraph.trim(parts[0]));
    
                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RGraph.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        };








        // The function that draws the X axis
        this.drawXAxis = function ()
        {
            var marginLeft      = prop.marginLeft,
                marginRight     = prop.marginRight,
                x               = this.marginLeft,
                y               = this.y,
                min             = +prop.xaxisScaleMin,
                max             = +prop.xaxisScaleMax,
                labels          = prop.xaxisLabels,
                labels_offsetx  = prop.xaxisLabelsOffsetx,
                labels_offsety  = prop.xaxisLabelsOffsety,
                labels_position = prop.xaxisLabelsPosition,
                color           = prop.colors[0],
                title_color     = prop.xaxisTitleColor,
                width           = this.canvas.width - this.marginLeft - this.marginRight,
                align           = prop.xaxisTickmarksAlign,
                numlabels       = prop.xaxisLabelsCount,
                formatter       = prop.xaxisScaleFormatter,
                decimals        = Number(prop.xaxisScaleDecimals),
                invert          = prop.xaxisScaleInvert,
                scale_visible   = prop.xaxisScaleVisible,
                units_pre       = prop.xaxisScaleUnitsPre,
                units_post      = prop.xaxisScaleUnitsPost,
                title           = prop.xaxisTitle
                numticks        = prop.xaxisTickmarksCount,
                hmargin         = prop.marginInner,
                linewidth       = prop.linewidth,
                leftendtick     = prop.xaxisTickmarksLastLeft,
                rightendtick    = prop.xaxisTickmarksLastRight,
                noxaxis         = !prop.xaxis,
                xaxispos        = prop.xaxisPosition,
                yaxispos        = prop.yaxisPosition

    
            if (RGraph.isNull(numticks)) {
                if (labels && labels.length) {
                    numticks = labels.length;
                } else if (!labels && max != 0) {
                    numticks = 10;
                } else {
                    numticks = numlabels;
                }
            }
    
            

            // Set the linewidth
            this.context.lineWidth = linewidth + 0.001;
    
            // Set the color
            this.context.strokeStyle = color;
    
            if (!noxaxis) {
                
                // Draw the main horizontal line
                path({
                    context: this.context,
                    path: 'b m % % l % % s %',
                    args: [x, Math.round(y), x + width, Math.round(y), this.context.strokeStyle]
                });
    
                // Draw the axis tickmarks
                this.context.beginPath();
                    for (var i=(leftendtick ? 0 : 1); i<=(numticks - (rightendtick ? 0 : 1)); ++i) {
                        
                        if (yaxispos === 'center' && i === (numticks / 2) ) {
                            continue;
                        }
                        
                        this.context.moveTo(
                            Math.round(x + ((width / numticks) * i)),
                            xaxispos === 'center' ? (align === 'bottom' ? y - 3 : y + 3) : y
                        );
                        
                        this.context.lineTo(
                            Math.round(x + ((width / numticks) * i)),
                            y + (align == 'bottom' ? 3 : -3)
                        );
                    }
                this.context.stroke();
            }
    
    

            // Draw the labels
            if (labels) {

                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'xaxisLabels'
                });

                // Draw the labels
                numlabels = labels.length;
                var h = 0;
                var l = 0;
                var single_line = RGraph.measureText(
                    'Mg',
                    false,
                    textConf.font,
                    textConf.size
                );
    
                // Measure the maximum height
                for (var i=0,len=labels.length; i<len; ++i) {
                    var dimensions = RGraph.measureText(
                        labels[i],
                        false,
                        textConf.font,
                        textConf.size
                    );
                    var h = Math.max(h, dimensions[1]);
                    var l = Math.max(l, labels[i].split('\r\n').length);
                }

                for (var i=0,len=labels.length; i<len; ++i) {
                
                    if (labels_position == 'edge') {
                        var x = ((((width - hmargin - hmargin) / (labels.length - 1)) * i) + marginLeft + hmargin);
                    } else {
                        var graphWidth = (width - hmargin - hmargin);
                        var label_segment_width = (graphWidth / labels.length);

                        var x = ((label_segment_width * i) + (label_segment_width / 2) + marginLeft + hmargin);
                    }


                    RGraph.text({
                    
                      object: this,
                        
                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                        x:      x + labels_offsetx,
                        y:      (align == 'bottom' ? y + 5 : y - 5 - h + single_line[1]) + labels_offsety,
                        text:   String(labels[i]),
                        valign: align == 'bottom' ? 'top' : 'bottom',
                        halign: prop.xaxisLabelsAngle !== 0 ? 'right' : 'center',
                        angle: prop.xaxisLabelsAngle * -1,
                        tag:    'labels'
                    });
                }
        
    
    
    

            // No specific labels - draw a scale
            } else if (scale_visible){

                if (!max) {
                    alert('[DRAWING.XAXIS] If not specifying xaxisLabels you must specify xaxisScaleMax!');
                }

                // yaxispos
                if (yaxispos == 'center') {
                    width /= 2;
                    var additionalX = width;            
                } else {
                    var additionalX = 0;
                }
                    
                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'xaxisLabels'
                });

                for (var i=0; i<=numlabels; ++i) {

                    // Don't show zero if the zerostart option is false
                    if (i == 0 && !prop.xaxisScaleZerostart) {
                        continue;
                    }

                    var original = (((max - min) / numlabels) * i) + min;
                    var hmargin  = prop.marginInner;
    
                    if (typeof formatter === 'function') {
                        var text =  formatter(this, original)
                    } else {

                        text = RGraph.numberFormat({
                            object:    this,
                            number:    original.toFixed(original === 0 ? 0 : decimals),
                            unitspre:  units_pre,
                            unitspost: units_post,
                            point:     prop.xaxisScalePoint,
                            thousand:  prop.xaxisScaleThousand
                        });
                    }

    
                    if (invert) {
                        var x = ((width - hmargin - ((width - hmargin - hmargin) / numlabels) * i)) + marginLeft + additionalX + labels_offsetx;
                    } else {
                        var x = (((width - hmargin - hmargin) / numlabels) * i) + marginLeft + hmargin + additionalX+ labels_offsetx;
                    }

                    RGraph.text({
                    
                      object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                        x:      x,
                        y:      (align == 'bottom' ? y + 5 : y - 5) + labels_offsety,
                        text:   text,
                        valign: align == 'bottom' ? 'top' : 'bottom',
                        halign: prop.xaxisLabelsAngle !== 0 ? 'right' : 'center',
                        angle:  prop.xaxisLabelsAngle * -1,
                        tag:    'scale'
                    });
                }



                //
                // If the Y axis is in the center - this draws the left half of the labels
                //
                if (yaxispos == 'center') {
                  for (var i=0; i<numlabels; ++i) {
        
                        var original = (((max - min) / numlabels) * (numlabels - i)) + min;
                        var hmargin  = prop.marginInner;
        
                        var text = String(typeof formatter == 'function' ? formatter(this, original) : RGraph.numberFormat({object: this, number: original.toFixed(decimals), unitspre: units_pre, unitspost: units_post}));
        
                        if (invert) {
                            var x = ((width - hmargin - ((width - hmargin - hmargin) / numlabels) * i)) + marginLeft;
                        } else {
                            var x = (((width - hmargin - hmargin) / numlabels) * i) + marginLeft + hmargin;
                        }
        
                        RGraph.text({
                        
                          object: this,
                        
                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                            x:      x,
                            y:      align == 'bottom' ? y + 5 : y - 5,'text':'-' + text,
                            valign: align == 'bottom' ? 'top' : 'bottom',
                            halign: 'center',
                            tag:    'scale'
                        });
                    }
                }
            }
    
    
    
            // Draw the title for the axes            
            if (title) {

                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'xaxisTitle'
                });

                var dimensions = RGraph.measureText({
                    text: title,
                    bold: textConf.bold,
                    font: textConf.font,
                    size: textConf.size
                });

                RGraph.text({
                
                  object: this,

                    font:   textConf.font,
                    size:   textConf.size,
                    color:  textConf.color,
                    bold:   textConf.bold,
                    italic: textConf.italic,

                    x:      (this.canvas.width - this.marginLeft - this.marginRight) / 2 + this.marginLeft,
                    y:      align == 'bottom' ? y + dimensions[1] + 5 : y - dimensions[1] - 5,
                    text:   title,
                    valign: 'top',
                    halign: 'center',
                    tag:    'title'
                });
            }
        };








        //
        // Using a function to add events makes it easier to facilitate method chaining
        // 
        // @param string   type The type of even to add
        // @param function func 
        //
        this.on = function (type, func)
        {
            if (type.substr(0,2) !== 'on') {
                type = 'on' + type;
            }
            
            if (typeof this[type] !== 'function') {
                this[type] = func;
            } else {
                RGraph.addCustomEventListener(this, type, func);
            }
    
            return this;
        };








        //
        // This function runs once only
        // (put at the end of the file (before any effects))
        //
        this.firstDrawFunc = function ()
        {
        };








        //
        // Objects are now always registered so that the chart is redrawn if need be.
        //
        RGraph.register(this);








        //
        // This is the 'end' of the constructor so if the first argument
        // contains configuration data - handle that.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);

    };
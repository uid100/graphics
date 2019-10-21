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
    RGraph.Drawing.YAxis = function (conf)
    {
        var id = conf.id
        var x  = conf.x;

        this.id                = id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext("2d");
        this.canvas.__object__ = this;
        this.x                 = x;
        this.coords            = [];
        this.coordsText        = [];
        this.original_colors   = [];
        this.maxLabelLength    = 0;
        this.firstDraw         = true; // After the first draw this will be false



        //
        // This defines the type of this shape
        //
        this.type = 'drawing.yaxis';


        //
        // This facilitates easy object identification, and should always be true
        //
        this.isRGraph = true;


        //
        // This adds a uid to the object that you can use for identification purposes
        // 
        this.uid = RGraph.createUID();


        //
        // This adds a UID to the canvas for identification purposes
        //
        this.canvas.uid = this.canvas.uid ? this.canvas.uid : RGraph.createUID();



        //
        // Some example background properties
        //
        this.properties =
        {
            marginTop:            25,
            marginBottom:         30,
            
            colors:               ['black'],
            
            title:                '',
            titleColor:           null,
            titleFont:            null,
            titleSize:            null,
            titleBold:            null,
            titleItalic:          null,
            
            textFont:             'Arial, Verdana, sans-serif',
            textSize:             12,
            textColor:            'black',
            textBold:             false,
            textItalic:           false,
            textAccessible:       true,
            textAccessibleOverflow:'visible',
            textAccessiblePointerevents: false,
            
            yaxis:                true,
            yaxisTickmarksCount:  5,
            yaxisTickmarksAlign:  'left',
            yaxisTickmarksLastTop:true,
            yaxisTickmarksLastBottom: true,
            yaxisLabelsCount:     5,
            yaxisLabelsSpecific:  null,
            yaxisLabelsFont:      null,
            yaxisLabelsSize:      null,
            yaxisLabelsColor:     null,
            yaxisLabelsBold:      null,
            yaxisLabelsItalic:    null,
            yaxisLabelsOffsetx:   0,
            yaxisLabelsOffsety:   0,
            yaxisScaleMin:        0,
            yaxisScaleMax:        null,
            yaxisScaleFormatter:  null,
            yaxisScaleDecimals:   0,
            yaxisScalePoint:      '.',
            yaxisScaleThousand:   ',',
            yaxisScaleInvert:     false,
            yaxisScaleZerostart:  true,
            yaxisScaleVisible:    true,
            yaxisScaleUnitsPre:   '',
            yaxisScaleUnitsPost:  '',

            linewidth:       1,
            
            tooltips:        null,
            tooltipsEffect:  'fade',
            tooltipsCssClass:'RGraph_tooltip',
            tooltipsEvent:   'onclick',
            
            xaxisPosition:   'bottom',
            
            eventsClick:     null,
            eventsMousemove: null,

            clearto:         'rgba(0,0,0,0)'
        }


        //
        // A simple check that the browser has canvas support
        //
        if (!this.canvas) {
            alert('[DRAWING.YAXIS] No canvas support');
            return;
        }
        
        //
        // Create the dollar object so that functions can be added to them
        //
        this.$0 = {};


        //
        // Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        // done already
        // 
        // ** Could use setTransform() here instead ?
        //
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            
            this.canvas.__rgraph_aa_translated__ = true;
        }



        // Short variable names
        var prop = this.properties,
            path = RGraph.path;
        
        
        
        //
        // "Decorate" the object with the generic effects if the effects library has been included
        //
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
        // Draws the axes
        //
        this.draw = function ()
        {
            //
            // Fire the onbeforedraw event
            //
            RGraph.fireCustomEvent(this, 'onbeforedraw');
    
            //
            // Some defaults
            //
            this.marginTop    = prop.marginTop;
            this.marginBottom = prop.marginBottom;
            
            
            //
            // Stop this growing uncntrollably
            //
            this.coordsText = [];
            
            
    
            if (!prop.textColor)  prop.textColor  = prop.colors[0];
            if (!prop.titleColor) prop.titleColor = prop.textColor;
    
            //
            // Parse the colors. This allows for simple gradient syntax
            //
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    
    
            // DRAW Y AXIS HERE
            this.drawYAxis();
    
    
            //
            // This installs the event listeners
            //
            RGraph.installEventListeners(this);
    
    

            //
            // Fire the onfirstdraw event
            //
            if (this.firstDraw) {
                this.firstDraw = false;
                RGraph.fireCustomEvent(this, 'onfirstdraw');
                this.firstDrawFunc();
            }




            //
            // Fire the ondraw event
            //
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
        // Not used by the class during creating the axis, but is used by event handlers
        // to get the coordinates (if any) of the selected shape
        // 
        // @param object e The event object
        //
        this.getShape = function (e)
        {
            var mouseXY = RGraph.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];
    
            if (   mouseX >= this.x - (prop.tickmarksAlign ==  'right' ? 0 : this.getWidth())
                && mouseX <= this.x + (prop.tickmarksAlign ==  'right' ? this.getWidth() : 0)
                && mouseY >= this.marginTop
                && mouseY <= (this.canvas.height - this.marginBottom)
               ) {
                
                var x = this.x;
                var y = this.marginTop;
                var w = 15;;
                var h = this.canvas.height - this.marginTop - this.marginBottom;
    
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
                this.original_colors.yaxisLabelsColor = RGraph.arrayClone(prop.yaxisLabelsColor);
                this.original_colors.titleColor       = RGraph.arrayClone(prop.titleColor);
                this.original_colors.textColor        = RGraph.arrayClone(prop.textColor);
                this.original_colors.colors           = RGraph.arrayClone(prop.colors);
            }




            //
            // Parse various properties for colors
            //
            prop.yaxisLabelsColor   = this.parseSingleColorForGradient(prop.yaxisLabelsColor);
            prop.titleColor         = this.parseSingleColorForGradient(prop.titleColor);
            prop.textColor          = this.parseSingleColorForGradient(prop.textColor);
            prop.colors[0]          = this.parseSingleColorForGradient(prop.colors[0]);
        };








        //
        // Use this function to reset the object to the post-constructor state. Eg reset colors if
        // need be etc
        //
        this.reset = function ()
        {
        };








        //
        // This parses a single color value
        //
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
                var grad = this.context.createLinearGradient(0,prop.marginTop,0,this.canvas.height - this.marginBottom);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RGraph.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RGraph.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        };








        //
        // The function that draws the Y axis
        //
        this.drawYAxis = function ()
        {
            var x               = this.x,
                y               = this.marginTop,
                height          = this.canvas.height - this.marginBottom - this.marginTop,
                min             = +prop.yaxisScaleMin ? +prop.yaxisScaleMin : 0,
                max             = +prop.yaxisScaleMax,
                title           = prop.yaxisTitle ? prop.yaxisTitle : '',
                color           = prop.colors ? prop.colors[0] : 'black',
                title_color     = prop.yaxisTitleColor ? prop.yaxisTitleColor : color,
                label_color     = prop.textColor ? prop.textColor : color,
                label_offsetx   = prop.yaxisLabelsOffsetx,
                label_offsety   = prop.yaxisLabelsOffsety,
                numticks        = typeof prop.yaxisTickmarksCount === 'number' ? prop.yaxisTickmarksCount : 10,
                labels_specific = prop.yaxisLabelsSpecific,
                numlabels       = prop.yaxisLabelsCount ? prop.yaxisLabelsCount : 5,
                font            = prop.textFont ? prop.textFont : 'Arial, Verdana, sans-serif',
                size            = prop.textSize ? prop.textSize : 12
                align           = typeof prop.yaxisTickmarksAlign === 'string'? prop.yaxisTickmarksAlign : 'left',
                formatter       = prop.yaxisScaleFormatter,
                decimals        = prop.yaxisScaleDecimals,
                invert          = prop.yaxisScaleInvert,
                scale_visible   = prop.yaxisScaleVisible,
                units_pre       = prop.yaxisScaleUnitsPre,
                units_post      = prop.yaxisScaleUnitsPost,
                linewidth       = prop.linewidth ? prop.linewidth : 1,
                notopendtick    = !prop.yaxisTickmarksLastTop,
                nobottomendtick = !prop.yaxisTickmarksLastBottom,
                yaxis           = prop.yaxis,
                xaxispos        = prop.xaxisPosition;

    
            // This fixes missing corner pixels in Chrome
            this.context.lineWidth = linewidth + 0.001;
    
    
            //
            // Set the color
            //
            this.context.strokeStyle = color;

            if (yaxis) {
                //
                // Draw the main vertical line
                //

                path({
                    object: this,
                    path:   'b m % % l % % s %',
                    args:   [
                        Math.round(x),
                        y,
                        Math.round(x),
                        y + height,
                        color
                    ]
                });
    
                //
                // Draw the axes tickmarks
                //
                if (numticks) {
                    
                    var gap = (xaxispos == 'center' ? height / 2 : height) / numticks;
                    var halfheight = height / 2;
    
                    this.context.beginPath();
                        for (var i=(notopendtick ? 1 : 0); i<=(numticks - (nobottomendtick || xaxispos == 'center'? 1 : 0)); ++i) {
                            path(this.context, ['m',align == 'right' ? x + 3 : x - 3, Math.round(y + (gap *i)),'l',x, Math.round(y + (gap *i))]);
                        }
                        
                        // Draw the bottom halves ticks if the X axis is in the center
                        if (xaxispos == 'center') {
                            for (var i=1; i<=numticks - (nobottomendtick ? 1 : 0); ++i) {
                                path({
                                    context: this.context,
                                    path:    'm % % l % %',
                                    args: [
                                        align == 'right' ? x + 3 : x - 3,
                                        Math.round(y + halfheight + (gap *i)),
                                        x,
                                        Math.round(y + halfheight + (gap *i))
                                    ]
                                });
                            }
                        }
                    this.context.stroke();
                }
            }
    
    
            //
            // Draw the scale for the axes
            //
            this.context.fillStyle = label_color;
            //this.context.beginPath();
            var text_len = 0;
                if (scale_visible) {
                    if (labels_specific && labels_specific.length) {
                    
                        var text_len = 0;
    
                        // First - gp through the labels to find the longest
                        for (var i=0,len=labels_specific.length; i<len; i+=1) {
                            text_len = Math.max(text_len, this.context.measureText(labels_specific[i]).width);
                        }

                        
                        // Get the text configuration
                        var textConf = RGraph.getTextConf({
                            object: this,
                            prefix: 'yaxisLabels'
                        });

                        for (var i=0,len=labels_specific.length; i<len; ++i) {
                        
                            var gap = (len-1) > 0 ? (height / (len-1)) : 0;
                            
                            if (xaxispos == 'center') {
                                gap /= 2;
                            }

                            RGraph.text({
                            
                               object: this,

                                 font: textConf.font,
                                 size: textConf.size,
                                 bold: textConf.bold,
                               italic: textConf.italic,
                                color: textConf.color,

                                    x: x - (align == 'right' ? -5 : 5) + label_offsetx,
                                    y: (i * gap) + this.marginTop + label_offsety,
                                 text: labels_specific[i],
                               valign: 'center',
                               halign: align == 'right' ? 'left' : 'right',
                                  tag: 'scale'
                            });
                            
                            //
                            // Store the max length so that it can be used if necessary to determine
                            // whether the mouse is over the axis.
                            //
                            this.maxLabelLength = Math.max(this.maxLabelLength, this.context.measureText(labels_specific[i]).width);
                        }
                        
                        if (xaxispos == 'center') {

                            // It's "-2" so that the center label isn't added twice
                            for (var i=(labels_specific.length-2); i>=0; --i) {
    
                                RGraph.text({
                                
                               object: this,

                                 font: textConf.font,
                                 size: textConf.size,
                                 bold: textConf.bold,
                               italic: textConf.italic,
                                color: textConf.color,

                                    x:      x - (align == 'right' ? -5 : 5) + label_offsetx,
                                    y:      this.canvas.height - this.marginBottom - (i * gap) + label_offsety,
                                    text:   labels_specific[i],
                                    valign: 'center',
                                    halign: align == 'right' ? 'left' : 'right',
                                    tag:    'scale'
                                });
                            }
                        }

                    } else {


                        // Get the text configuration
                        var textConf = RGraph.getTextConf({
                            object: this,
                            prefix: 'yaxisLabels'
                        });

                        for (var i=0; i<=numlabels; ++i) {

                            var original = ((max - min) * ((numlabels-i) / numlabels)) + min;
                        
                            if (original == 0 && prop.yaxisScaleZerostart == false) {
                                continue;
                            }
            
                            var text = RGraph.numberFormat({
                                object:    this,
                                number:    original.toFixed(original === 0 ? 0 : decimals),
                                unitspre:  units_pre,
                                unitspost: units_post,
                                point:     prop.yaxisScalePoint,
                                thousand:  prop.yaxisScaleThousand
                            });
                            var text = String(typeof formatter == 'function' ? formatter(this, original) : text);

                            // text_len is used below for positioning the title
                            var text_len = Math.max(text_len, this.context.measureText(text).width);
                            this.maxLabelLength = text_len;

                            if (invert) {
                                var y = height - ((height / numlabels)*i);
                            } else {
                                var y = (height / numlabels)*i;
                            }
                            
                            if (prop.xaxisPosition == 'center') {
                                y = y / 2;
                            }
                            
                            // This fixes a bug, Replace this: -,400 with this: -400
                            text = text.replace(/^-,([0-9])/, '-$1');
            

                            // Now - draw the labels
                            RGraph.text({
                            
                               object: this,

                                 font: textConf.font,
                                 size: textConf.size,
                                 bold: textConf.bold,
                               italic: textConf.italic,
                                color: textConf.color,

                                x:      x - (align == 'right' ? -5 : 5) + label_offsetx,
                                y:      y + this.marginTop + label_offsety,
                                text:   text,
                                valign: 'center',
                                halign: align == 'right' ? 'left' : 'right',
                                tag:    'scale'
                            });
            
            
            
                            //
                            // Draw the bottom half of the labels if the X axis is in the center
                            //
                            if (prop.xaxisPosition == 'center' && i < numlabels) {
                                RGraph.text({
                                
                               object: this,

                                 font: textConf.font,
                                 size: textConf.size,
                                 bold: textConf.bold,
                               italic: textConf.italic,
                                color: textConf.color,

                                    x:      x - (align == 'right' ? -5 : 5) + label_offsetx,
                                    y:      this.canvas.height - this.marginBottom - y + label_offsety,
                                    text:   '-' + text,
                                    valign: 'center',
                                    halign: align == 'right' ? 'left' : 'right',
                                    tag:    'scale'
                                });
                            }
                        }
                    }
                }
            //this.context.stroke();

            //
            // Draw the title for the axes
            //
            if (title) {
                this.context.beginPath();

                    this.context.fillStyle = title_color;
                    if (labels_specific) {
                        
                        var width = 0;
                        for (var i=0,len=labels_specific.length; i<len; i+=1) {
                            width = Math.max(width, this.context.measureText(labels_specific[i]).width);
                        }

                    } else {
                        var m =  RGraph.measureText(prop.yaxisScaleUnitsPre + prop.yaxisScaleMax.toFixed(prop.yaxisScaleDecimals) + prop.yaxisScaleUnitsPost),
                            width = m[0];
                    }

                        
                    // Get the text configuration
                    var textConf = RGraph.getTextConf({
                        object: this,
                        prefix: 'yaxisTitle'
                    });


                    RGraph.text({
                    
                       object: this,

                         font: textConf.font,
                         size: textConf.size,
                         bold: textConf.bold,
                       italic: textConf.italic,
                        color: textConf.color,

                        x:          align == 'right' ? x + width + 13 : x - width - 13,
                        y:          height / 2 + this.marginTop,
                        text:       title,
                        valign:     'bottom',
                        halign:     'center',
                        angle:      align == 'right' ? 90 : -90,
                        accessible: false
                    });
                this.context.stroke();
            }
        };








        //
        // This detemines the maximum text width of either the scale or text
        // labels - whichever is given
        // 
        // @return number The maximum text width
        //
        this.getWidth = function ()
        {
            var width = this.maxLabelLength;
            
            // Add the title width if it's specified
            if (prop.yaxisTitle && prop.yaxisTitle.length) {
                width += (prop.textSize * 1.5);
            }

            this.width = width;
            
            return width;
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
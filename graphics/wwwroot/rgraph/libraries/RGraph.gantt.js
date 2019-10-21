// version: 2019-09-08
    // o--------------------------------------------------------------------------------o
    // | This file is part of the RGraph package - you can learn more at:               |
    // |                                                                                |
    // |                         https://www.rgraph.net                                 |
    // |                                                                                |
    // | RGraph is licensed under the Open Source MIT license. That means that it's     |
    // | totally free to use and there are no restrictions on what you can do with it!  |
    // o--------------------------------------------------------------------------------o

    RGraph = window.RGraph || {isRGraph: true};

    //
    // The gantt chart constructor
    //
    RGraph.Gantt = function (conf)
    {
        var id                        = conf.id
        var canvas                    = document.getElementById(id);
        var data                      = conf.data;

        this.id                = id;
        this.canvas            = canvas;
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d", {alpha: (typeof id === 'object' && id.alpha === false) ? false : true}) : null;
        this.canvas.__object__ = this;
        this.type              = 'gantt';
        this.isRGraph          = true;
        this.uid               = RGraph.createUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.createUID();
        this.data              = data;
        this.colorsParsed      = false;
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false

        
        // Set some defaults
        this.properties =
        {
            backgroundBarsCount:    null,
            backgroundBarsColor1:   'rgba(0,0,0,0)',
            backgroundBarsColor2:   'rgba(0,0,0,0)',
            backgroundGrid:        true,
            backgroundGridLinewidth:  1,
            backgroundGridColor:  '#ddd',
            backgroundGridHsize:  20,
            backgroundGridVsize:  20,
            backgroundGridHlines: true,
            backgroundGridVlines: true,
            backgroundGridBorder: true,
            backgroundGridAlign:  true,
            backgroundGridAutofit:true,
            backgroundGridAutofitAlign:true,
            backgroundGridHlinesCount: null,
            backgroundGridVlinesCount: null,
            backgroundVbars:           [],
            backgroundHbars:           [],

            textSize:              12,
            textFont:              'Arial, Verdana, sans-serif',
            textColor:             'black',
            textBold:              false,
            textItalic:            false,
            textAccessible:               true,
            textAccessibleOverflow:      'visible',
            textAccessiblePointerevents: false,

            marginLeft:            75,
            marginRight:           25,
            marginTop:             35,
            marginBottom:          25,
            marginInner:           2,

            labelsInbar:          null,
            labelsInbarBgcolor:   null,
            labelsInbarAlign:     'left',
            labelsInbarSize:      null,
            labelsInbarFont:      null,
            labelsInbarColor:     null,
            labelsInbarBold:      null,
            labelsInbarItalic:    null,
            labelsInbarAbove:     false,
            labelsComplete:       true,
            labelsCompleteFont:   null,
            labelsCompleteSize:   null,
            labelsCompleteColor:  null,
            labelsCompleteBold:   null,
            labelsCompleteItalic: null,

            title:                  '',
            titleBackground:       null,
            titleX:                null,
            titleY:                null,
            titleBold:             null,
            titleItalic:           null,
            titleFont:             null,
            titleSize:             null,
            titleColor:            null,
            titleHalign:           null,
            titleValign:           null,

            yaxisLabelsFont:      null,
            yaxisLabelsSize:      null,
            yaxisLabelsColor:     null,
            yaxisLabelsBold:      null,
            yaxisLabelsItalic:    null,
            yaxisTitle:            '',
            yaxisTitleBold:       null,
            yaxisTitleItalic:     null,
            yaxisTitleFont:       null,
            yaxisTitleSize:       null,
            yaxisTitleColor:      null,
            yaxisTitlePos:        null,
            yaxisTitlePosition:   'right',
            yaxisTitleX:          null,
            yaxisTitleY:          null,

            xaxisLabels:           [],
            xaxisLabelsFont:       null,
            xaxisLabelsSize:       null,
            xaxisLabelsColor:      null,
            xaxisLabelsBold:       null,
            xaxisLabelsItalic:     null,
            xaxisLabelsAlign:      'bottom',
            xaxisTitle:            '',
            xaxisTitleX:           null,
            xaxisTitleY:           null,
            xaxisTitleBold:        null,
            xaxisTitleColor:       null,
            xaxisTitleFont:        null,
            xaxisTitleSize:        null,
            xaxisTitleItalic:      null,
            xaxisScaleMin:         0,
            xaxisScaleMax:         0,

            colorsDefault:        'white',

            borders:                true,

            coords:                 [],

            tooltips:               null,
            tooltipsEffect:         'fade',
            tooltipsCssClass:      'RGraph_tooltip',
            tooltipsHighlight:     true,
            tooltipsEvent:         'onclick',
            
            highlightStroke:       'rgba(0,0,0,0)',
            highlightFill:         'rgba(255,255,255,0.7)',

            contextmenu:            null,
            
            annotatable:            false,
            annotatableColor:         'black',
            
            resizable:              false,
            resizableHandleAdjust:   [0,0],
            resizableHandleBackground: null,
            
            adjustable:             false,
            adjustableOnly:        null,
            
            eventsClick:           null,
            eventsMousemove:       null,
            
            clearto:   'rgba(0,0,0,0)'
        }


        //
        // Create the dollar objects so that functions can be added to them
        //
        if (!data) {
            alert('[GANTT] The Gantt chart event data is now supplied as the second argument to the constructor - please update your code');
        } else {
            // Go through the data converting relevant args to numbers
            for (var i=0,idx=0; i<data.length; ++i) {
                if (typeof data[i].start     === 'string') data[i].start     = parseFloat(data[i].start);
                if (typeof data[i].duration  === 'string') data[i].duration  = parseFloat(data[i].duration);
                if (typeof data[i].complete  === 'string') data[i].complete  = parseFloat(data[i].complete);
                if (typeof data[i].linewidth === 'string') data[i].linewidth = parseFloat(data[i].linewidth);
            }
        }
        
        // Linearize the data (DON'T use RGraph.arrayLinearize() here)
        for (var i=0,idx=0; i<data.length; ++i) {
            if (RGraph.isArray(this.data[i][0])) {
                for (var j=0; j<this.data[i].length; ++j) {
                    this['$' + (idx++)] = {};
                }
            } else {
                this['$' + (idx++)] = {};
            }
        }



        //
        // Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        // done already
        //
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            
            this.canvas.__rgraph_aa_translated__ = true;
        }




        // Short variable names
        var prop = this.properties,
            path = RGraph.path,
            win  = window,
            doc  = document;
        
        
        
        //
        // "Decorate" the object with the generic effects if the effects library has been included
        //
        if (RGraph.Effects && typeof RGraph.Effects.decorate === 'function') {
            RGraph.Effects.decorate(this);
        }








        //
        // A setter
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
        // A peudo getter
        // 
        // @param name  string The name of the property to get
        //
        this.get = function (name)
        {
            return prop[name];
        };








        //
        // Draws the chart
        //
        this.draw = function ()
        {
            //
            // Fire the onbeforedraw event
            //
            RGraph.fireCustomEvent(this, 'onbeforedraw');



            //
            // Make the margins easy ro access
            //            
            this.marginLeft   = prop.marginLeft;
            this.marginRight  = prop.marginRight;
            this.marginTop    = prop.marginTop;
            this.marginBottom = prop.marginBottom;
            
            //
            // Stop this growing uncntrollably
            //
            this.coordsText = [];
    
    
            //
            // Parse the colors. This allows for simple gradient syntax
            //
            if (!this.colorsParsed) {

                this.parseColors();
                
                // Don't want to do this again
                this.colorsParsed = true;
            }

            //
            // Work out the graphArea
            //
            this.graphArea     = this.canvas.width - this.marginLeft - this.marginRight;
            this.graphHeight   = this.canvas.height - this.marginTop - this.marginBottom;
            this.numEvents     = this.data.length
            this.barHeight     = this.graphHeight / this.numEvents;
            this.halfBarHeight = this.barHeight / 2;

            // Set the number of horizontal grid lines to the same as that of the
            // data items that we have.
            if (RGraph.isNull(prop.backgroundGridHlinesCount)) {
                this.set('backgroundGridHlinesCount', this.data.length);
            }
    
    
    
    
            //
            // Draw the background
            //
            RGraph.Background.draw(this);
    
    
    
            //
            // Draw the labels at the top
            //
            this.drawLabels();
    
    
    
            //
            // Draw the events
            //
            this.drawEvents();
    
    
    
            //
            // Setup the context menu if required
            //
            if (prop.contextmenu) {
                RGraph.showContext(this);
            }
    
            
            //
            // This function enables resizing
            //
            if (prop.resizable) {
                RGraph.allowResizing(this);
            }
    
    
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
            // Fire the RGraph ondraw event
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
        // Draws the labels at the top and the left of the chart
        //
        this.drawLabels = function ()
        {
            // Draw the X labels at the top/bottom of the chart.
            var labels      = prop.xaxisLabels,
                labelsColor = prop.xaxisLabelsColor || prop.textColor,
                labelSpace  = (this.graphArea) / labels.length,
                x           = this.marginLeft + (labelSpace / 2),
                y           = this.marginTop - (prop.textSize / 2) - 5,
                font        = prop.textFont,
                size        = prop.textSize;

            this.context.beginPath();
            this.context.fillStyle = prop.textColor;
            this.context.strokeStyle = 'black'
            
            //
            // This facilitates xaxisLabelsAlign
            //
            if (prop.xaxisLabelsAlign == 'bottom') {
                y = this.canvas.height - this.marginBottom + size + 2;
            }

            // Get the text configuration
            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'xaxisLabels'
            });

            //
            // Draw the horizontal labels
            //
            for (i=0; i<labels.length; ++i) {

                RGraph.text({
                
                    object: this,

                    font:   textConf.font,
                    size:   textConf.size,
                    color:  textConf.color,
                    bold:   textConf.bold,
                    italic: textConf.italic,

                    x:      x + (i * labelSpace),
                    y:      y,
                    text:   String(labels[i]),
                    halign: 'center',
                    valign: 'center',
                    tag:    'labels.horizontal'
                });
            }

            // Draw the vertical labels
            for (var i=0,len=this.data.length; i<len; ++i) {

                var ev = this.data[i],
                    x  = this.marginLeft,
                    y  = this.marginTop + this.halfBarHeight + (i * this.barHeight);
                
                this.context.fillStyle = labelsColor || prop.textColor;

                // Determine whether the event is just a single event or an array
                // of multiple events
                var label = RGraph.isArray(ev) ? String(ev[0].label) : String(ev.label);

                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'yaxisLabels'
                });

                if (label) {
                    RGraph.text({
                    
                    object: this,

                    font:   textConf.font,
                    size:   textConf.size,
                    color:  textConf.color,
                    bold:   textConf.bold,
                    italic: textConf.italic,

                        x:      x - 5,
                        y:      y,
                        text:   label,
                        halign: 'right',
                        valign: 'center',
                        tag:    'labels.vertical'
                    });
                }
            }
        };








        //
        // Draws the events to the canvas
        //
        this.drawEvents = function ()
        {
            var events = this.data;
    
            //
            // Reset the coords array to prevent it growing
            //
            this.coords = [];




            //
            // First draw the vertical bars that have been added
            //
            if (prop.backgroundVbars) {

                for (i=0,len=prop.backgroundVbars.length; i<len; ++i) {

                    // Boundary checking
                    if (prop.backgroundVbars[i][0] + prop.backgroundVbars[i][1] > prop.xaxisScaleMax) {
                        prop.backgroundVbars[i][1] = 364 - prop.backgroundVbars[i][0];
                    }
        
                    var barX   = this.marginLeft + (( (prop.backgroundVbars[i][0] - prop.xaxisScaleMin) / (prop.xaxisScaleMax - prop.xaxisScaleMin) ) * this.graphArea),
                        barY   = this.marginTop,
                        width  = (this.graphArea / (prop.xaxisScaleMax - prop.xaxisScaleMin) ) * prop.backgroundVbars[i][1],
                        height = this.canvas.height - this.marginTop - this.marginBottom;
                    
                    // Right hand bounds checking
                    if ( (barX + width) > (this.canvas.width - this.marginRight) ) {
                        width = this.canvas.width - this.marginRight - barX;
                    }
        
                    this.context.fillStyle = prop.backgroundVbars[i][2];
                    this.context.fillRect(barX, barY, width, height);
                }
            }



            // Now draw the horizontal bars
            if (prop.backgroundHbars) {

                for (i=0,len=prop.backgroundHbars.length; i<len; ++i) {

                    if (prop.backgroundHbars[i]) {
                        
                        var barX   = this.marginLeft,
                            barY   = ((this.canvas.height - this.marginTop - this.marginBottom) / this.data.length) * i + this.marginTop,
                            width  = this.graphArea,
                            height = this.barHeight

                        this.context.fillStyle = prop.backgroundHbars[i];
                        this.context.fillRect(barX, barY, width, height);
                    }
                }
            }




            // Draw the events
            var sequentialIndex = 0;

            for (i=0; i<events.length; ++i) {
                if (typeof events[i].start === 'number') {

                    this.drawSingleEvent(
                        events[i],
                        i,
                        sequentialIndex++
                    );
                } else {
                    for (var j=0; j<events[i].length; ++j) {

                        var subindex = j;

                        this.drawSingleEvent(
                            events[i][j],
                            i,
                            sequentialIndex++,
                            subindex
                        );

                    }
                }
    
            }
        };








        //
        // Retrieves the bar (if any) that has been click on or is hovered over
        // 
        // @param object e The event object
        //
        this.getShape = function (e)
        {
            e = RGraph.fixEventObject(e);

            var mouseXY = RGraph.getMouseXY(e),
                mouseX = mouseXY[0],
                mouseY = mouseXY[1];
    
            //
            // Loop through the bars determining if the mouse is over a bar
            //
            for (var i=0,len=this.coords.length; i<len; i++) {
    
                var left   = this.coords[i][0],
                    top    = this.coords[i][1],
                    width  = this.coords[i][2],
                    height = this.coords[i][3];
    
                if (   mouseX >= left
                    && mouseX <= (left + width)
                    && mouseY >= top
                    && mouseY <= (top + height)
                   ) {

                    var tooltip = RGraph.parseTooltipText(
                        prop.tooltips,
                        i
                    );


                    var ret =  {
                        0: this,   object:  this,
                        1: left,   x:       left,
                        2: top,    y:       top,
                        3: width,  width:   width,
                        4: height, height:  height,
                        5: i,      index:   this.coords[i][4].index,
                                   subindex: (this.coords[i][4] && typeof this.coords[i][4].subindex === 'number' ? this.coords[i][4].subindex : null),
                                   sequentialIndex: this.coords[i][5],
                                   tooltip: tooltip
                    };

                    return ret;
                }
            }
        };








        // Draws a single event
        this.drawSingleEvent = function (ev, index, sequentialIndex)
        {
            // Store the indexes on the original data
            ev.index = index;
            if (typeof arguments[3] === 'number') {
                ev.subindex = arguments[3]
            }

            var min = prop.xaxisScaleMin;

            this.context.beginPath();
            this.context.strokeStyle = 'black';
            this.context.fillStyle = ev.color ? ev.color : prop.colorsDefault;

            var barStartX  = this.marginLeft + (((ev.start - min) / (prop.xaxisScaleMax - min)) * this.graphArea),
                barStartY  = this.marginTop + (index * this.barHeight),
                barWidth   = (ev.duration / (prop.xaxisScaleMax - min) ) * this.graphArea;

            // If the width is greater than the graph atrea, curtail it
            if ( (barStartX + barWidth) > (this.canvas.width - this.marginRight) ) {
                barWidth = this.canvas.width - this.marginRight - barStartX;
            }

            //  Draw the bar storing the coordinates
            this.coords.push([
                barStartX,
                barStartY + prop.marginInner,
                barWidth,
                this.barHeight - (2 * prop.marginInner),
                ev,
                sequentialIndex,
            ]);





            // draw the border around the bar
            if (prop.borders || typeof ev.border === 'number') {

                this.context.strokeStyle = typeof(ev.border) === 'string' ? ev.border : 'black';
                this.context.lineWidth = (typeof(ev.linewidth) === 'number' ? ev.linewidth : 1);

                if (ev.linewidth !== 0) {
                    this.context.strokeRect(
                        barStartX,
                        barStartY + prop.marginInner,
                        barWidth,
                        this.barHeight - (2 * prop.marginInner)
                    );
                }
            }
            
            // Not entirely sure what this does...
            if (RGraph.isNull(ev.complete)) {
                this.context.fillStyle = ev.color ? ev.color : prop.colorsDefault;
            } else {
                this.context.fillStyle = ev.background ? ev.background : prop.colorsDefault;
            }

            this.context.fillRect(
                barStartX,
                barStartY + prop.marginInner,
                barWidth,
                this.barHeight - (2 * prop.marginInner)
            );
    
            // Work out the completeage indicator
            var complete = (ev.complete / 100) * barWidth;
    
            // Draw the % complete indicator. If it's greater than 0
            if (typeof(ev.complete) === 'number') {

                this.context.fillStyle = ev.color ? ev.color : '#0c0';

                // Draw the percent complete bar if the complete option is given
                this.context.fillRect(
                    barStartX,
                    barStartY + prop.marginInner,
                    (ev.complete / 100) * barWidth,
                    this.barHeight - (2 * prop.marginInner)
                );
                
                // Don't necessarily have to draw the label
                if (prop.labelsComplete) {
                    
                    this.context.beginPath();

                    // Get the text configuration
                    var textConf = RGraph.getTextConf({
                        object: this,
                        prefix: 'labelsComplete'
                    });

                    RGraph.text({
                    
                        object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                        x:      barStartX + barWidth + 5,
                        y:      barStartY + this.halfBarHeight,
                        text:   String(ev.complete) + '%',
                        valign: 'center',
                        tag:    'labels.complete'
                    });
                }
            }


            //
            // Draw the inbar label if it's defined
            //
            if (prop.labelsInbar && prop.labelsInbar[sequentialIndex]) {
                
                var label = String(prop.labelsInbar[sequentialIndex]),
                    halign = prop.labelsInbarAlign == 'left' ? 'left' : 'center';

                halign = prop.labelsInbarAlign == 'right' ? 'right' : halign;
                
                // Work out the position of the text
                if (halign == 'right') {
                    var x = (barStartX + barWidth) - 5;
                } else if (halign == 'center') {
                    var x = barStartX + (barWidth / 2);
                } else {
                    var x = barStartX + 5;
                }
    
    
                // Draw the labels "above" the bar
                if (prop.labelsInbarAbove) {
                    x = barStartX + barWidth + 5;
                    halign = 'left';
                }

                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'labelsInbar'
                });

                // Set the color
                this.context.fillStyle = prop.labelsInbarColor;
                RGraph.text({
                
                    object: this,

                    font:   textConf.font,
                    size:   textConf.size,
                    color:  textConf.color,
                    bold:   textConf.bold,
                    italic: textConf.italic,

                    x:            x,
                    y:            barStartY + this.halfBarHeight,
                    text:         label,
                    valign:       'center',
                    halign:       halign,
                    bounding:     typeof(prop.labelsInbarBgcolor) == 'string',
                    boundingFill: typeof(prop.labelsInbarBgcolor) === 'string' ? prop.labelsInbarBgcolor : null,
                    tag:          'labels.inbar'
                });
            }
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
            } else {
                RGraph.Highlight.rect(this, shape);
            }
        };








        //
        // The getObjectByXY() worker method. Don't call this call:
        // 
        // RGraph.ObjectRegistry.getObjectByXY(e)
        // 
        // @param object e The event object
        //
        this.getObjectByXY = function (e)
        {
            var mouseXY = RGraph.getMouseXY(e);
    
            if (
                   mouseXY[0] > this.marginLeft
                && mouseXY[0] < (this.canvas.width - this.marginRight)
                && mouseXY[1] > this.marginTop
                && mouseXY[1] < (this.canvas.height - this.marginBottom)
                ) {
    
                return this;
            }
        };








        //
        // This method handles the adjusting calculation for when the mouse is moved
        // 
        // @param object e The event object
        //
        this.adjusting_mousemove = function (e)
        {
            // Handle adjusting for the Bar
            if (prop.adjustable && RGraph.Registry.get('adjusting') && RGraph.Registry.get('adjusting').uid == this.uid) {
                
                var bar = RGraph.Registry.get('adjusting.gantt');

                if (bar) {
                    var mouseXY    = RGraph.getMouseXY(e),
                        obj        = RGraph.Registry.get('adjusting.gantt')['object'],
                        index      = bar['index'],
                        subindex   = bar['subindex'],
                        diff       = ((mouseXY[0] - RGraph.Registry.get('adjusting.gantt')['mousex']) / (obj.canvas.width - obj.marginLeft - obj.marginRight)) * prop.xaxisScaleMax,
                        eventStart = RGraph.Registry.get('adjusting.gantt')['event_start'],
                        duration   = RGraph.Registry.get('adjusting.gantt')['event_duration'],
                        event      = typeof subindex === 'number' ? obj.data[index][subindex] : obj.data[index]

                    if (bar['mode'] === 'move') {

                        diff = Math.round(diff);

                        // Single event
                        if (RGraph.isNull(subindex)) {
                        
                            event.start = eventStart + diff;
                            
                            if (eventStart + diff < 0) {
                                obj.data[index].start = 0;

                            } else if ((eventStart + diff + obj.data[index].duration) > prop.xaxisScaleMax) {
                                obj.data[index].start = prop.xaxisScaleMax - obj.data[index].duration;
                            }


                        // Multiple events
                        } else {
                            
                            var index    = RGraph.Registry.get('adjusting.gantt').index,
                                subindex = RGraph.Registry.get('adjusting.gantt').subindex,
                                event    = obj.data[index][subindex];
                            
                            event.start = eventStart + diff;
                            
                            if ( (eventStart + diff) < 0) {
                                event.start = 0;
                            } else if ( (eventStart + diff + event.duration) > prop.xaxisScaleMax ) {
                                event.start = prop.xaxisScaleMax - event.duration;
                            }
                        }












                    } else if (bar['mode'] == 'resize') {
        
                        //
                        // Account for the right hand gutter. Appears to be a FF bug
                        //
                        if (mouseXY[0] > (obj.canvas.width - obj.marginRight)) {
                            mouseXY[0] = obj.canvas.width - obj.marginRight;
                        }
                        
                        var diff = ((mouseXY[0] - RGraph.Registry.get('adjusting.gantt')['mousex']) / (obj.canvas.width - obj.marginLeft - obj.marginRight)) * prop.xaxisScaleMax;
                            diff = Math.round(diff);






                        // Single event
                        if (RGraph.isNull(subindex)) {
                            obj.data[index].duration = duration + diff;
                            
                            if (obj.data[index].duration < 0) {
                                obj.data[index].duration = 1;
                            }

                        // Multiple events
                        } else {
                            obj.data[index][subindex].duration = duration + diff;
                            
                            if (obj.data[index][subindex].duration < 0) {
                                obj.data[index][subindex].duration = 1;
                            }
                        }
                    }
                    
                    RGraph.resetColorsToOriginalValues(obj);
        
                    //RGraph.clear(obj.canvas);
                    RGraph.redrawCanvas(obj.canvas);
                    
                    RGraph.fireCustomEvent(obj, 'onadjust');
                }
            }
        };








        //
        // Returns the X coordinate for the given value
        // 
        // @param number value The desired value (eg minute/hour/day etc)
        //
        this.getXCoord = function (value)
        {
            var min       = prop.xaxisScaleMin,
                max       = prop.xaxisScaleMax,
                graphArea = this.canvas.width - this.marginLeft - this.marginRight;

            if (value > max || value < min) {
                return null;
            }

            var x = (((value - min) / (max - min)) * graphArea) + this.marginLeft;
            
            return x;
        };








        //
        // Returns the value given EITHER the event object OR a two element array containing the X/Y coords
        //
        this.getValue = function (arg)
        {
            if (arg.length == 2) {
                var mouseXY = arg;
            } else {
                var mouseXY = RGraph.getMouseXY(arg);
            }
            
            var mouseX = mouseXY[0],
                mouseY = mouseXY[1];
            
            var value  = (mouseX - this.marginLeft) / (this.canvas.width - this.marginLeft - this.marginRight);
                value *= (prop.xaxisScaleMax - prop.xaxisScaleMin);
            
            // Bounds checking
            if (value < prop.xaxisScaleMin || value > prop.xaxisScaleMax) {
                value = null;
            }
            
            return value;
        };








        //
        // This allows for easy specification of gradients. Could optimise this not to repeatedly call parseSingleColors()
        //
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                
                this.original_colors.data                 = RGraph.arrayClone(this.data);
                this.original_colors.backgroundBarsColor1 = RGraph.arrayClone(prop.backgroundBarsColor1);
                this.original_colors.backgroundBarsColor2 = RGraph.arrayClone(prop.backgroundBarsColor2);
                this.original_colors.backgroundGridColor  = RGraph.arrayClone(prop.backgroundGridColor);
                this.original_colors.colorsDefault        = RGraph.arrayClone(prop.colorsDefault);
                this.original_colors.highlightStroke      = RGraph.arrayClone(prop.highlightStroke);
                this.original_colors.highlightFill        = RGraph.arrayClone(prop.highlightFill);
            }




            //
            // this.coords can be used here as gradients are only parsed on the SECOND draw - not the first.
            // A .redraw() is downe at the end of the first draw.
            //
            for (var i=0,sequentialIndex=0; i<this.data.length; ++i) {

                // Multiple events
                if (   RGraph.isArray(this.data[i])
                    && typeof this.data[i][0] === 'object'
                    && typeof this.data[i][0].start === 'number'
                   ) {

                    for (var j=0,len=this.data[i].length; j<len; j+=1,sequentialIndex+=1) {
                        this.data[i][j].background = this.parseSingleColorForGradient(
                            this.data[i][j].background,
                            {start: this.data[i][j].start, duration: this.data[i][j].duration}
                        );

                        this.data[i][j].color = this.parseSingleColorForGradient(
                            this.data[i][j].color, 
                            {start: this.data[i][j].start, duration: this.data[i][j].duration}
                        );
                    }
                
                // Single event
                } else {
                
                    if (typeof this.data[i].background === 'string') {
                        this.data[i].background = this.parseSingleColorForGradient(
                            this.data[i].background,
                            {start: this.data[i].start, duration: this.data[i].duration}
                        );
                    }

                    if (typeof this.data[i].color === 'string') {
                        this.data[i].color = this.parseSingleColorForGradient(
                            this.data[i].color,
                            {start: this.data[i].start, duration: this.data[i].duration}
                        );
                    }

                    ++sequentialIndex;
                }
            }

            prop.backgroundBarsColor1 = this.parseSingleColorForGradient(prop.backgroundBarsColor1);
            prop.backgroundBarsColor2 = this.parseSingleColorForGradient(prop.backgroundBarsColor2);
            prop.backgroundGridColor  = this.parseSingleColorForGradient(prop.backgroundGridColor);
            prop.backgroundColor      = this.parseSingleColorForGradient(prop.backgroundColor);
            prop.colorsDefault        = this.parseSingleColorForGradient(prop.colorsDefault);
            prop.highlightStroke      = this.parseSingleColorForGradient(prop.highlightStroke);
            prop.highlightFill        = this.parseSingleColorForGradient(prop.highlightFill);
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
        // @param string color The color to parse
        //
        this.parseSingleColorForGradient = function (color)
        {
            var opts = arguments[1] || {};

            if (!color || typeof(color) != 'string') {
                return color;
            }


            if (color.match(/^gradient\((.*)\)$/i)) {

                // Allow for JSON gradients
                if (color.match(/^gradient\(({.*})\)$/i)) {
                    return RGraph.parseJSONGradient({object: this, def: RegExp.$1});
                }

                var parts = RegExp.$1.split(':'),
                    value = (opts.start + opts.duration) > prop.xaxisScaleMax ? prop.xaxisScaleMax : (opts.start + opts.duration);

                // Create the gradient
                var grad = this.context.createLinearGradient(
                    typeof opts.start === 'number' ? this.getXCoord(opts.start) : this.marginLeft,
                    0,
                    typeof opts.start === 'number' ? this.getXCoord(value) : this.canvas.width - this.marginRight,
                    0
                );
    
                var diff = 1 / (parts.length - 1);

                grad.addColorStop(0, RGraph.trim(parts[0]));
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RGraph.trim(parts[j]));
                }
            }

            return grad ? grad : color;
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
        // Gantt chart Grow effect
        // 
        // @param object   obj Options for the grow effect
        // @param function     Optional callback (a function)
        //
        this.grow = function ()
        {
            var obj             = this,
                opt             = arguments[0] || {},
                callback        = arguments[1] ? arguments[1] : function () {},
                canvas          = obj.canvas,
                context         = obj.context,
                numFrames       = opt.frames || 30,
                frame           = 0;
                original_events = RGraph.arrayClone(obj.data);

            function iterator ()
            {
                RGraph.clear(obj.canvas);
                RGraph.redrawCanvas(obj.canvas);


                if (frame <= numFrames) {
                    // Update the events
                    for (var i=0,len=obj.data.length; i<len; ++i) {
                        if (typeof obj.data[i] === 'object' && obj.data[i][0] && typeof obj.data[i][0] === 'object') {
                            for (var j=0; j<obj.data[i].length; ++j) {
                                obj.data[i][j].duration = (frame / numFrames) * original_events[i][j].duration;
                            }
                        } else {
                            obj.data[i].duration = (frame / numFrames) * original_events[i].duration;
                        }
                    }

                    obj.reset();


                    
                    frame++;

                    RGraph.Effects.updateCanvas(iterator);
    
                } else {
                    callback(obj);
                }
            }
            
            iterator();
            
            return this;
        };








        //
        // This helps the Gantt reset colors when the reset function is called.
        // It handles going through the data and resetting the colors.
        //
        this.resetColorsToOriginalValues = function ()
        {
            //
            // Copy the original colors over for single-event-per-line data
            //
            for (var i=0; i<this.original_colors.data.length; ++i) {
                if (this.original_colors.data[i].background) {
                    this.data[i].background = RGraph.arrayClone(this.original_colors.data[i].background);
                }

                if (this.original_colors.data[i].color) {
                    this.data[i].color = RGraph.arrayClone(this.original_colors.data[i].color);
                }
                
                if (typeof this.original_colors.data[i][0] === 'object' && typeof this.original_colors.data[i][0].start === 'number') {
                    for (var j=0,len2=this.original_colors.data[i].length; j<len2; ++j) {
                        this.data[i][j].background = RGraph.arrayClone(this.original_colors.data[i][j].background);
                        this.data[i][j].color      = RGraph.arrayClone(this.original_colors.data[i][j].color);
                    }
                }
            }
        };








        //
        // This function resets the object - clearing it of any previously gathered info
        //
        this.reset = function ()
        {
            this.resetColorsToOriginalValues();
        
            this.colorsParsed    = false;
            this.coordsText      = [];
            this.original_colors = [];
            this.firstDraw       = true;
            this.coords          = [];
        };








        // An unused function
        this.sequentialIndex2Grouped=function(){alert('[RGRAPH] Something went badly wrong - contact support');};








        // Determines whether the Gant is adjustable or not
        this.isAdjustable = function (shape)
        {
            if (RGraph.isNull(prop.adjustableOnly)) {
                return true;
            
            } else if (RGraph.isArray(prop.adjustableOnly) && shape && prop.adjustableOnly[shape.sequentialIndex]) {
                return true;
            }

            return false;
        };








        //
        // Register the object
        //
        RGraph.register(this);








        //
        // This is the 'end' of the constructor so if the first argument
        // contains configuration data - handle that.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);
    };
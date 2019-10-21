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
    // The bar chart constructor
    //
    RGraph.Bar = function (conf)
    {
        var id                        = conf.id,
            canvas                    = document.getElementById(id),
            data                      = conf.data;

        // Get the canvas and context objects
        this.id                     = id;
        this.canvas                 = canvas;
        this.context                = this.canvas.getContext('2d');
        this.canvas.__object__      = this;
        this.type                   = 'bar';
        this.max                    = 0;
        this.stackedOrGrouped       = false;
        this.isRGraph               = true;
        this.uid                    = RGraph.createUID();
        this.canvas.uid             = this.canvas.uid ? this.canvas.uid : RGraph.createUID();
        this.colorsParsed           = false;
        this.original_colors        = [];
        this.cachedBackgroundCanvas = null;
        this.firstDraw              = true; // After the first draw this will be false



        // Various config type stuff
        this.properties =
        {
            backgroundBarsCount:        null,
            backgroundBarsColor1:       'rgba(0,0,0,0)',
            backgroundBarsColor2:       'rgba(0,0,0,0)',
            backgroundGrid:             true,
            backgroundGridColor:        '#ddd',
            backgroundGridLinewidth:    1,
            backgroundGridHsize:        20,
            backgroundGridVsize:        20,
            backgroundGridVlines:       true,
            backgroundGridHlines:       true,
            backgroundGridBorder:       true,
            backgroundGridAutofit:      true,
            backgroundGridAutofitAlign: true,
            backgroundGridHlinesCount:  5,
            backgroundGridDashed:       false,
            backgroundGridDotted:       false,
            backgroundImage:            null,
            backgroundImageStretch:     true,
            backgroundImageX:           null,
            backgroundImageY:           null,
            backgroundImageW:           null,
            backgroundImageH:           null,
            backgroundImageAlign:       null,
            backgroundColor:            null,
            backgroundHbars:            null,

            axes:                   true,
            axesColor:             'black',
            axesLinewidth:         1,
            
            marginTop:             35,
            marginBottom:          35,
            marginLeft:            35,
            marginRight:           35,
            marginInner:           5,
            marginInnerGrouped:   1,
            
            labelsIngraph:         null,
            labelsIngraphFont:    null,
            labelsIngraphSize:    null,
            labelsIngraphColor:   null,
            labelsIngraphBold:    null,
            labelsIngraphItalic:  null,
            labelsAbove:           false,
            labelsAboveDecimals:  0,
            labelsAboveSize:      null,
            labelsAboveColor:     null,
            labelsAboveBold:      null,
            labelsAboveItalic:    null,
            labelsAboveFont:      null,
            labelsAbovePoint:     '.',
            labelsAboveThousand:  ',',
            labelsAboveBackground:'rgba(0,0,0,0)',
            labelsAboveAngle:     null,
            labelsAboveOffset:    4,
            labelsAboveUnitsPre: '',
            labelsAboveUnitsPost:'',
            
            yaxis:                  true,
            yaxisTickmarksCount:  10,
            yaxisScaleMin:        0,
            yaxisScaleMax:        null,
            yaxisScaleUnitsPre:  '',
            yaxisScaleUnitsPost: '',
            yaxisScaleDecimals:         0,
            yaxisScalePoint:            '.',
            yaxisScaleThousand:         ',',
            yaxisScaleRound:            false,
            yaxisScaleZerostart:        true,
            yaxisLabels:                true,
            yaxisLabelsCount:          5,
            yaxisLabelsInside:         false,
            yaxisLabelsOffsetx:        0,
            yaxisLabelsOffsety:        0,
            yaxisLabelsFont:        null,
            yaxisLabelsSize:        null,
            yaxisLabelsColor:       null,
            yaxisLabelsBold:        null,
            yaxisLabelsItalic:      null,
            yaxisPosition:          'left',
            yaxisTitle:            '',
            yaxisTitleBold:       null,
            yaxisTitleSize:       null,
            yaxisTitleFont:       null,
            yaxisTitleColor:      null,
            yaxisTitleItalic:     null,
            yaxisTitlePos:        null,
            yaxisTitleX:          null,
            yaxisTitleY:          null,

            xaxis:                        true,
            xaxisTickmarksLast:         true,
            xaxisTickmarksCount:        null,
            xaxisLabels:                 null,            
            xaxisLabelsSize:            null,
            xaxisLabelsFont:            null,
            xaxisLabelsItalic:          null,
            xaxisLabelsBold:            null,
            xaxisLabelsColor:           null,
            xaxisLabelsOffsetx:         0,
            xaxisLabelsOffsety:         0,
            xaxisPosition:               'bottom',
            xaxisLabelsAngle:             0,
            xaxisTitle:            '',
            xaxisTitleBold:       null,
            xaxisTitleSize:       null,
            xaxisTitleFont:       null,
            xaxisTitleColor:      null,
            xaxisTitleItalic:     null,
            xaxisTitlePos:        null,
            xaxisTitleX:          null,
            xaxisTitleY:          null,

            textItalic:                   false,
            textBold:                     false,
            textColor:                    'black',
            textSize:                     12,
            textFont:                     'Arial, Verdana, sans-serif',
            textAccessible:               true,
            textAccessibleOverflow:      'visible',
            textAccessiblePointerevents: false,
            
            
            title:                  '',
            titleX:                null,
            titleY:                null,
            titleHalign:           null,
            titleValign:           null,
            titleBackground:       null, // Gradients aren't supported for this color
            titleHpos:             null,
            titleVpos:             null,
            titleFont:             null,
            titleSize:             null,
            titleColor:            null,
            titleBold:             null,
            titleItalic:           null,

            colorsStroke:          'rgba(0,0,0,0)',
            colors:                 ['red','#0f0','blue','pink','orange','cyan','black','white','green','magenta'],
            colorsSequential:      false,
            colorsReverse:         false,

            grouping:               'grouped',

            variant:                'bar',
            variantSketchVerticals: true,
            variantThreedXaxis:   true,
            variantThreedYaxis:   true,
            variantThreedAngle:   0.1,
            variantThreedOffsetx: 10,
            variantThreedOffsety: 5,

            shadow:                 false,
            shadowColor:           '#aaa',  // Gradients aren't supported for this color
            shadowOffsetx:         0,
            shadowOffsety:         0,
            shadowBlur:            15,

            tooltips:               null,
            tooltipsEffect:        'fade',
            tooltipsCssClass:     'RGraph_tooltip',
            tooltipsEvent:         'onclick',
            tooltipsHighlight:     true,
            tooltipsHotspotXonly: false,

            highlightStroke:       'rgba(0,0,0,0)',
            highlightFill:         'rgba(255,255,255,0.7)',

            key:                    null,
            keyBackground:         'white',
            keyPosition:           'graph',
            keyShadow:             false,
            keyShadowColor:       '#666',
            keyShadowBlur:        3,
            keyShadowOffsetx:     2,
            keyShadowOffsety:     2,
            keyPositionMarginBoxed:false,
            keyPositionX:         null,
            keyPositionY:         null,
            keyInteractive:        false,
            keyInteractiveHighlightChartStroke:'black',
            keyInteractiveHighlightChartFill:'rgba(255,255,255,0.7)',
            keyInteractiveHighlightLabel:'rgba(255,0,0,0.2)',
            keyHalign:             'right',
            keyColorShape:        'square',
            keyRounded:            true,
            keyLinewidth:          1,
            keyColors:             null,
            keyLabelsColor:       null,
            keyLabelsSize:        null,
            keyLabelsFont:        null,
            keyLabelsBold:        null,
            keyLabelsItalic:      null,
            keyLabelsOffsetx:     0,
            keyLabelsOffsety:     0,

            contextmenu:            null,

            crosshairs:             false,
            crosshairsColor:       '#333',
            crosshairsHline:       true,
            crosshairsVline:       true,

            linewidth:              1,

            annotatable:            false,
            annotatableLinewidth:  1,
            annotatableColor:      'black',

            resizable:              false,
            resizableHandleBackground: null,

            adjustable:             false,
            adjustableOnly:        null,

            eventsClick:           null,
            eventsMousemove:       null,
            
            bevelled:               false,

            errorbars:              false,
            errorbarsColor:        'black',
            errorbarsCapped:        true,
            errorbarsCappedWidth:  14,
            errorbarsLinewidth:     1,

            combinedEffect:    null,
            combinedEffectOptions:  null,
            combinedEffectCallback: null,

            clearto:   'rgba(0,0,0,0)'
        }

        // Check for support
        if (!this.canvas) {
            alert('[BAR] No canvas support');
            return;
        }


        //
        // Convert strings into numbers. Also converts undefined elements to null
        //
        for (var i=0; i<data.length; ++i) {
            if (typeof data[i] === 'string') {
                data[i] = parseFloat(data[i]);
            } else if (typeof data[i] === 'object' && data[i]) {
                for (var j=0; j<data[i].length; ++j) {
                    if (typeof data[i][j] === 'string') {
                        data[i][j] = parseFloat(data[i][j]);
                    }
                }
            } else if (typeof data[i] === 'undefined') {
                data[i] = null;
            }
        }

        //
        // Determine whether the chart will contain stacked or grouped bars
        //
        for (var i=0; i<data.length; ++i) {
            if (typeof data[i] === 'object' && !RGraph.isNull(data[i])) {
                this.stackedOrGrouped = true;
            }
        }


        //
        // Create the dollar objects so that functions can be added to them
        //
        var linear_data = RGraph.arrayLinearize(data);

        for (var i=0; i<linear_data.length; ++i) {
            this['$' + i] = {};
        }


        // Store the data and set the orignal_data to it
        this.data = data;
        this.original_data = RGraph.arrayClone(data);


        // Used to store the coords of the bars
        this.coords     = [];
        this.coords2    = [];
        this.coordsText = [];



        //
        // This linearises the data. Doing so can make it easier to pull
        // out the appropriate data from tooltips
        //
        this.data_arr = RGraph.arrayLinearize(this.data);


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
            path = RGraph.path;

        //
        // "Decorate" the object with the generic effects if the effects library has been included
        //
        if (RGraph.Effects && typeof RGraph.Effects.decorate === 'function') {
            RGraph.Effects.decorate(this);
        }





        //
        // A setter
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
        // A getter
        //
        // @param name  string The name of the property to get
        //
        this.get = function (name)
        {
            return prop[name];
        };








        //
        // The function you call to draw the bar chart
        //
        this.draw = function ()
        {
            // MUST be the first thing done!
            if (typeof prop.backgroundImage === 'string') {
                RGraph.drawBackgroundImage(this);
            }

            //
            // Fire the onbeforedraw event
            //
            RGraph.fireCustomEvent(this, 'onbeforedraw');



            //
            // If the chart is 3d then angle it it
            //
            if (prop.variant === '3d') {
                if (prop.textAccessible) {
                    // Nada
                } else {
                    this.context.setTransform(1,prop.variantThreedAngle,0,1,0.5,0.5);
                }
            }



            //
            // Parse the colors. This allows for simple gradient syntax
            //
            if (!this.colorsParsed) {
                this.parseColors();

                // Don't want to do this again
                this.colorsParsed = true;
            }



            //
            // Make the margins easy ro access
            //
            this.marginLeft   = prop.marginLeft;
            this.marginRight  = prop.marginRight;
            this.marginTop    = prop.marginTop;
            this.marginBottom = prop.marginBottom;
            




            //
            // Check for tooltips and alert the user that they're not supported
            // with pyramid charts
            //
            if (   (prop.variant == 'pyramid' || prop.variant == 'dot')
                && typeof prop.tooltips == 'object'
                && prop.tooltips
                && prop.tooltips.length > 0) {

                alert('[BAR] (' + this.id + ') Sorry, tooltips are not supported with dot or pyramid charts');
            }

            //
            // Stop the coords arrays from growing uncontrollably
            //
            this.coords     = [];
            this.coords2    = [];
            this.coordsText = [];

            //
            // Work out a few things. They need to be here because they depend on things you can change before you
            // call Draw() but after you instantiate the object
            //
            this.max            = 0;
            this.grapharea      = this.canvas.height - this.marginTop - this.marginBottom;
            this.halfgrapharea  = this.grapharea / 2;
            this.halfTextHeight = prop.textSize / 2;





            // Now draw the background on to the main canvas
            RGraph.background.draw(this);




            //If it's a sketch chart variant, draw the axes first
            //if (prop.variant == 'sketch') {
            //    this.drawAxes();
            //    this.drawbars();
            //} else {
                this.drawbars();
                this.drawAxes();
            //}

            this.drawLabels();


            //
            // Draw the bevel if required
            //
            if (prop.bevelled || prop.bevelled) {
                this.drawBevel();
            }


            // Draw the key if necessary
            if (prop.key && prop.key.length) {
                RGraph.drawKey(
                    this,
                    prop.key,
                    prop.colors
                );
            }


            //
            // Setup the context menu if required
            //
            if (prop.contextmenu) {
                RGraph.showContext(this);
            }




            //
            // Draw errorbars
            //
            if (prop.errorbars) {
                this.drawErrorbars();
            }




            //
            // Draw "in graph" labels
            //
            if (prop.labelsIngraph) {
                RGraph.drawInGraphLabels(this);
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
        // Draws the charts axes
        //
        this.drawAxes = function ()
        {
            if (!prop.axes) {
                return;
            }

            var xaxispos = prop.xaxisPosition;
            var yaxispos = prop.yaxisPosition;
            var isSketch = prop.variant == 'sketch';

            this.context.beginPath();
            this.context.strokeStyle = prop.axesColor;
            this.context.lineWidth   = prop.axesLinewidth + 0.001;


            if (RGraph.ISSAFARI == -1) {
                this.context.lineCap = 'square';
            }


            // Draw the Y axis
            if (prop.yaxis) {
                if (yaxispos == 'right') {
                    this.context.moveTo(this.canvas.width - this.marginRight + (isSketch ? 3 : 0), this.marginTop - (isSketch ? 3 : 0));
                    this.context.lineTo(this.canvas.width - this.marginRight - (isSketch ? 2 : 0), this.canvas.height - this.marginBottom + (isSketch ? 5 : 0));
                } else {
                    this.context.moveTo(this.marginLeft - (isSketch ? 2 : 0), this.marginTop - (isSketch ? 5 : 0));
                    this.context.lineTo(this.marginLeft - (isSketch ? 1 : 0), this.canvas.height - this.marginBottom + (isSketch ? 5 : 0));
                }
            }

            // Draw the X axis
            if (prop.xaxis) {
                if (xaxispos == 'center') {
                    this.context.moveTo(this.marginLeft - (isSketch ? 5 : 0), Math.round(((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop + (isSketch ? 2 : 0)));
                    this.context.lineTo(this.canvas.width - this.marginRight + (isSketch ? 5 : 0), Math.round(((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop - (isSketch ? 2 : 0)));
                } else if (xaxispos == 'top') {
                    this.context.moveTo(this.marginLeft - (isSketch ? 3 : 0), this.marginTop - (isSketch ? 3 : 0));
                    this.context.lineTo(this.canvas.width - this.marginRight + (isSketch ? 5 : 0), this.marginTop + (isSketch ? 2 : 0));
                } else {

                    this.context.moveTo(
                        this.marginLeft - (isSketch ? 5 : 0),
                        Math.round(this.getYCoord(0) - (isSketch ? 2 : 0))
                    );
                    this.context.lineTo(
                        this.canvas.width - this.marginRight + (isSketch ? 8 : 0),
                        Math.round(this.getYCoord(0) + (isSketch ? 2 : 0))
                    );

                }
            }

            var numYTicks = prop.yaxisTickmarksCount;

            //
            // DRAW THE Y TICKMARKS
            //
            if (prop.yaxis && !isSketch) {

                var yTickGap = (this.canvas.height - this.marginTop - this.marginBottom) / numYTicks;
                var xpos     = yaxispos == 'left' ? this.marginLeft : this.canvas.width - this.marginRight;

                if (this.properties.yaxisTickmarksCount > 0) {
                    for (y=this.marginTop;
                         xaxispos == 'center' ? y <= (this.canvas.height - this.marginBottom) : y < (this.canvas.height - this.marginBottom + (xaxispos == 'top' ? 1 : 0));
                         y += yTickGap) {

                        if (xaxispos == 'center' && y == (this.marginTop + (this.grapharea / 2))) {
                            continue;
                        }

                        // X axis at the top
                        if (xaxispos == 'top' && y == this.marginTop) {
                            continue;
                        }

                        this.context.moveTo(xpos + (yaxispos == 'left' ? 0 : 0), Math.round(y));
                        this.context.lineTo(xpos + (yaxispos == 'left' ? -3 : 3), Math.round(y));
                    }

                    //
                    // If the X axis is offset (ie not at the bottom when xaxispos
                    // is set to bottom) - draw an extra tick
                    //
                    if (xaxispos === 'bottom' && prop.yaxisScaleMin !== 0) {
                        this.context.moveTo(xpos + (yaxispos == 'left' ? 0 : 0), Math.round(this.canvas.height - prop.marginBottom));
                        this.context.lineTo(xpos + (yaxispos == 'left' ? -3 : 3), Math.round(this.canvas.height - prop.marginBottom));
                    }
                }

                //
                // If the X axis is not being shown, draw an extra tick
                //
                if (!prop.xaxis) {
                    if (xaxispos == 'center') {
                        this.context.moveTo(xpos + (yaxispos == 'left' ? -3 : 3), Math.round(this.canvas.height / 2));
                        this.context.lineTo(xpos, Math.round(this.canvas.height / 2));
                    } else if (xaxispos == 'top') {
                        this.context.moveTo(xpos + (yaxispos == 'left' ? -3 : 3), Math.round(this.marginTop));
                        this.context.lineTo(xpos, Math.round(this.marginTop));
                    } else {
                        this.context.moveTo(xpos + (yaxispos == 'left' ? -3 : 3), Math.round(this.canvas.height - this.marginBottom));
                        this.context.lineTo(xpos, Math.round(this.canvas.height - this.marginBottom));
                    }
                }
            }


            // Draw the X tickmarks
            if (prop.xaxis && !isSketch) {

                if (typeof(prop.xaxisTickmarksCount) == 'number') {
                    var xTickGap = (this.canvas.width - this.marginLeft - this.marginRight) / prop.xaxisTickmarksCount;
                } else {
                    var xTickGap = (this.canvas.width - this.marginLeft - this.marginRight) / this.data.length;
                }

                if (xaxispos == 'bottom') {
                    yStart   = prop.yaxisScaleMin < 0 ? this.getYCoord(0) - 3 : this.getYCoord(0);
                    yEnd     = this.getYCoord(0) + 3;
                } else if (xaxispos == 'top') {
                    yStart = this.marginTop - 3;
                    yEnd   = this.marginTop;
                } else if (xaxispos == 'center') {
                    yStart = ((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop + 3;
                    yEnd   = ((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop - 3;
                }

                //yStart = yStart;
                //yEnd   = yEnd;

                //////////////// X TICKS ////////////////
                var endXTick = prop.xaxisTickmarksLast;

                for (x=this.marginLeft + (yaxispos == 'left' ? xTickGap : 0),len=(this.canvas.width - this.marginRight + (yaxispos == 'left' ? 5 : 0)); x<len; x+=xTickGap) {


                    if (yaxispos == 'left' && endXTick && x > this.marginLeft) {
                        this.context.moveTo(Math.round(x), yStart);
                        this.context.lineTo(Math.round(x), yEnd);

                    } else if (yaxispos == 'left' && !endXTick && x > this.marginLeft && x < (this.canvas.width - this.marginRight) ) {
                        this.context.moveTo(Math.round(x), yStart);
                        this.context.lineTo(Math.round(x), yEnd);

                    } else if (yaxispos == 'right' && x < (this.canvas.width - this.marginRight) && endXTick) {
                        this.context.moveTo(Math.round(x), yStart);
                        this.context.lineTo(Math.round(x), yEnd);

                    } else if (yaxispos == 'right' && x < (this.canvas.width - this.marginRight) && x > (this.marginLeft) && !endXTick) {
                        this.context.moveTo(Math.round(x), yStart);
                        this.context.lineTo(Math.round(x), yEnd);
                    }
                }

                if (!prop.yaxis || prop.xaxisTickmarksCount == null) {
                    if (typeof prop.xaxisTickmarksCount === 'number' && prop.xaxisTickmarksCount > 0) {
                        this.context.moveTo(Math.round(this.marginLeft), yStart);
                        this.context.lineTo(Math.round(this.marginLeft), yEnd);
                    }
                }

                //////////////// X TICKS ////////////////
            }

            //
            // If the Y axis is not being shown, draw an extra tick
            //
            if (!prop.yaxis && prop.xaxis && RGraph.isNull(prop.xaxisTickmarksCount) ) {
                if (xaxispos == 'center') {
                    this.context.moveTo(Math.round(this.marginLeft), (this.canvas.height / 2) - 3);
                    this.context.lineTo(Math.round(this.marginLeft), (this.canvas.height / 2) + 3);
                } else {
                    this.context.moveTo(Math.round(this.marginLeft), this.canvas.height - this.marginBottom);
                    this.context.lineTo(Math.round(this.marginLeft), this.canvas.height - this.marginBottom + 3);
                }
            }

            this.context.stroke();
        };








        //
        // Draws the bars
        //
        this.drawbars = function ()
        {
            this.context.lineWidth   = prop.linewidth;
            this.context.strokeStyle = prop.colorsStroke;
            this.context.fillStyle   = prop.colors[0];

            var prevX    = 0,
                prevY    = 0,
                decimals = prop.yaxisScaleDecimals;


            //
            // Work out the max value
            //
            if (prop.yaxisScaleMax) {

                this.scale2 = RGraph.getScale2(this, {
                    'scale.max':         prop.yaxisScaleMax,
                    'scale.strict':      prop.yaxisScaleRound ? false : true,
                    'scale.min':         prop.yaxisScaleMin,
                    'scale.thousand':    prop.yaxisScaleThousand,
                    'scale.point':       prop.yaxisScalePoint,
                    'scale.decimals':    prop.yaxisScaleDecimals,
                    'scale.labels.count':prop.yaxisLabelsCount,
                    'scale.round':       prop.yaxisScaleRound,
                    'scale.units.pre':   prop.yaxisScaleUnitsPre,
                    'scale.units.post':  prop.yaxisScaleUnitsPost,
                    'scale.formatter':   prop.yaxisScaleFormatter
                });

            } else {

                //
                // If errorbars are given as a number then convert the nuumber to an
                // array.
                //
                var errorbars = prop.errorbars;

                if (typeof errorbars === 'number') {

                    var value = errorbars;

                    prop.errorbars = [];

                    for (var i=0; i<this.data.length; ++i) {
                        if (typeof this.data[i] === 'number') {
                            prop.errorbars.push([value, null]);

                        } else if (typeof this.data[i] === 'object' && !RGraph.isNull(this.data[i])) {
                            for (var j=0; j<this.data[i].length; ++j) {
                                prop.errorbars.push([value, null]);
                            }
                        }
                    }

                    errorbars = prop.errorbars;
                }








                for (i=0; i<this.data.length; ++i) {
                    if (typeof(this.data[i]) == 'object') {
                        var value = prop.grouping === 'grouped' ? Number(RGraph.arrayMax(this.data[i], true)) : Number(RGraph.arraySum(this.data[i]));

                    } else {
                        var value = Number(this.data[i]);
                    }

                    this.max = Math.max(Math.abs(this.max), Math.abs(value) +

                        Number(
                            (
                                   typeof prop.errorbars === 'object'
                                && typeof prop.errorbars[i] === 'object'
                                && !RGraph.isNull(prop.errorbars[i])
                                && typeof prop.errorbars[i][0] === 'number'
                            ) ? prop.errorbars[i][0]  : 0
                        )
                    );
                }







                this.scale2 = RGraph.getScale2(this, {
                    'scale.max':         this.max,
                    'scale.min':         prop.yaxisScaleMin,
                    'scale.thousand':    prop.yaxisScaleThousand,
                    'scale.point':       prop.yaxisScalePoint,
                    'scale.decimals':    prop.yaxisScaleDecimals,
                    'scale.labels.count':prop.yaxisLabelsCount,
                    'scale.round':       prop.yaxisScaleRound,
                    'scale.units.pre':   prop.yaxisScaleUnitsPre,
                    'scale.units.post':  prop.yaxisScaleUnitsPost,
                    'scale.formatter':   prop.yaxisScaleFormatter
                });

                this.max = this.scale2.max;
            }

            //
            // if the chart is adjustable fix the scale so that it doesn't change.
            //
            if (prop.adjustable && !prop.yaxisScaleMax) {
                this.set('yaxisScaleMax', this.scale2.max);
            }

            //
            // Draw horizontal bars here
            //
            if (prop.backgroundHbars && prop.backgroundHbars.length > 0) {
                RGraph.drawBars(this);
            }

            var variant = prop.variant;

            //
            // Draw the 3D axes is necessary
            //
            if (variant === '3d') {
                RGraph.draw3DAxes(this);
            }

            //
            // Get the variant once, and draw the bars, be they regular, stacked or grouped
            //

            // Get these variables outside of the loop
            var xaxispos      = prop.xaxisPosition,
                width         = (this.canvas.width - this.marginLeft - this.marginRight ) / this.data.length,
                orig_height   = height,
                hmargin       = prop.marginInner,
                shadow        = prop.shadow,
                shadowColor   = prop.shadowColor,
                shadowBlur    = prop.shadowBlur,
                shadowOffsetX = prop.shadowOffsetx,
                shadowOffsetY = prop.shadowOffsety,
                strokeStyle   = prop.colorsStroke,
                colors        = prop.colors,
                sequentialColorIndex = 0

            var height;

            for (i=0,len=this.data.length; i<len; i+=1) {





                // Work out the height
                //The width is up outside the loop
                if (RGraph.arraySum(this.data[i]) < 0) {
                    var height = (RGraph.arraySum(this.data[i]) + this.scale2.min)  / (this.scale2.max - this.scale2.min);
                } else {
                    var height = (RGraph.arraySum(this.data[i]) - this.scale2.min) / (this.scale2.max - this.scale2.min);
                }

                height *= Math.abs(this.getYCoord(this.scale2.max) - this.getYCoord(this.scale2.min));






                var x = (i * width) + this.marginLeft;
                var y = xaxispos == 'center' ? ((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop - height
                                             : this.canvas.height - height - this.marginBottom;

                // xaxispos is top
                if (xaxispos == 'top') {
                    y = this.marginTop + Math.abs(height);
                }


                // Account for negative lengths - Some browsers don't like a negative value
                if (height < 0) {
                    y += height;
                    height = Math.abs(height);
                }






                //
                // Turn on the shadow if need be
                //
                if (shadow) {
                    this.context.shadowColor   = shadowColor;
                    this.context.shadowBlur    = shadowBlur;
                    this.context.shadowOffsetX = shadowOffsetX;
                    this.context.shadowOffsetY = shadowOffsetY;
                }

                //
                // Draw the bar
                //
                this.context.beginPath();
                    if (typeof this.data[i] == 'number') {


                        // If the Y axis is offset change the bar start (the top of the bar)
                        if (xaxispos === 'bottom' && prop.yaxisScaleMin < 0) {
                            if (this.data[i] >= 0) {
                                height = Math.abs(this.getYCoord(0) - this.getYCoord(this.data[i]));
                            } else {
                                y = this.getYCoord(0);
                                height = Math.abs(this.getYCoord(0) - this.getYCoord(this.data[i]));
                            }
                        }

                        var barWidth = width - (2 * hmargin);

                        //
                        // Check for a negative bar width
                        //
                        if (barWidth < 0) {
                            alert('[RGRAPH] Warning: you have a negative bar width. This may be caused by the marginInner being too high or the width of the canvas not being sufficient.');
                        }

                        // Set the fill color
                        this.context.strokeStyle = strokeStyle;
                        this.context.fillStyle = colors[0];

                        //
                        // Sequential colors
                        //
                        if (prop.colorsSequential) {
                            this.context.fillStyle = colors[i];
                        }

                        if (variant == 'sketch') {

                            this.context.lineCap = 'round';

                            var sketchOffset = 3;

                            this.context.beginPath();

                            this.context.strokeStyle = colors[0];

                            //
                            // Sequential colors
                            //
                            if (prop.colorsSequential) {
                                this.context.strokeStyle = colors[i];
                            }

                            // Left side
                            this.context.moveTo(x + hmargin + 2, y + height - 2);
                            this.context.lineTo(x + hmargin -    1, y - 4);

                            // The top
                            this.context.moveTo(x + hmargin - 3, y + -2 + (this.data[i] < 0 ? height : 0));
                            this.context.quadraticCurveTo(
                                x + hmargin + ((width - hmargin - hmargin) / 4),
                                y + 0 + (this.data[i] < 0 ? height : 0) + (this.data[i] > 0 ? 10 : -10),
                                
                                x + hmargin + width + -1 - hmargin - hmargin,
                                y + 0 + (this.data[i] < 0 ? height : 0)
                            );


                            // The right side
                            this.context.moveTo(x + hmargin + width - 5 - hmargin - hmargin, y  - 5);
                            this.context.lineTo(x + hmargin + width - 3 - hmargin - hmargin, y + height - 3);




                            // Draw the inner-bar verticals
                            if (prop.variantSketchVerticals) {
                                for (var r=0.2; r<=0.8; r+=0.2) {
                                
                                    this.context.moveTo(
                                        x + hmargin + ((width - hmargin - hmargin) * r),
                                        y - 1
                                    );
                                    this.context.lineTo(
                                        x + hmargin + ((width - hmargin - hmargin) * r),
                                        y + height + (r == 0.2 ? 1 : -2)
                                    );
                                }
                            }




                            this.context.stroke();

                        // Regular bar
                        } else if (variant == 'bar' || variant == '3d' || variant == 'glass' || variant == 'bevel') {

                            if (variant == 'glass') {
                                RGraph.filledCurvyRect(this.context. x + hmargin, y, barWidth, height, 3, this.data[i] > 0, this.data[i] > 0, this.data[i] < 0, this.data[i] < 0);
                                RGraph.strokedCurvyRect(this.context. x + hmargin, y, barWidth, height, 3, this.data[i] > 0, this.data[i] > 0, this.data[i] < 0, this.data[i] < 0);
                            } else {
                                // On 9th April 2013 these two were swapped around so that the stroke happens SECOND so that any
                                // shadow that is cast by the fill does not overwrite the stroke

                                this.context.beginPath();
                                this.context.rect(x + hmargin, y, barWidth, height);
                                this.context.fill();

                                // Turn the shadow off so that the stroke doesn't cast any "extra" shadow
                                // that would show inside the bar
                                RGraph.noShadow(this);

                                this.context.beginPath();
                                this.context.lineJoin = 'miter';
                                this.context.lineCap  = 'square';
                                this.context.rect(
                                    x + hmargin,
                                    y,
                                    barWidth,
                                    height
                                );
                                this.context.stroke();
                            }

                            // 3D effect
                            if (variant == '3d') {

                                var prevStrokeStyle = this.context.strokeStyle;
                                var prevFillStyle   = this.context.fillStyle;

                                // Draw the top (if the value is positive - otherwise there's no point)
                                if (this.data[i] >= 0) {
                                    this.context.beginPath();
                                        this.context.moveTo(x + hmargin, y);
                                        this.context.lineTo(x + hmargin + prop.variantThreedOffsetx, y - prop.variantThreedOffsety);
                                        this.context.lineTo(x + hmargin + prop.variantThreedOffsetx + barWidth, y - prop.variantThreedOffsety);
                                        this.context.lineTo(x + hmargin + barWidth, y);
                                    this.context.closePath();

                                    this.context.stroke();
                                    this.context.fill();
                                }

                                // Draw the right hand side
                                this.context.beginPath();
                                    this.context.moveTo(x + hmargin + barWidth, y);
                                    this.context.lineTo(
                                        x + hmargin + barWidth + prop.variantThreedOffsetx,
                                        this.data[i] < 0 && xaxispos === 'bottom' ?
                                            this.getYCoord(0) : (
                                                  this.data[i] < 0 && (y - prop.variantThreedOffsety)
                                                < (this.marginTop + this.halfgrapharea)

                                                ?

                                                (this.marginTop + this.halfgrapharea)

                                                : (y - prop.variantThreedOffsety))
                                    );

this.context.lineTo(
    x + hmargin + barWidth + prop.variantThreedOffsetx,


      this.data[i] < 0 && (y - prop.variantThreedOffsety + height) < (this.marginTop + this.getYCoord(0))
    ? this.getYCoord(this.data[i]) - prop.variantThreedOffsety
    : (this.data[i] > 0 ?
        y - prop.variantThreedOffsety + height :
        Math.min(y - prop.variantThreedOffsety + height, this.canvas.height - this.marginBottom)
       )
);
                                    this.context.lineTo(x + hmargin + barWidth, y + height);
                                this.context.closePath();
                                this.context.stroke();
                                this.context.fill();




                                // Draw the lighter top section
                                if (this.data[i] > 0) {
                                    this.context.beginPath();
                                        this.context.fillStyle = 'rgba(255,255,255,0.5)';
                                        this.context.moveTo(x + hmargin, y);
                                        this.context.lineTo(x + hmargin + prop.variantThreedOffsetx, y - prop.variantThreedOffsety);
                                        this.context.lineTo(x + hmargin + prop.variantThreedOffsetx + barWidth, y - prop.variantThreedOffsety);
                                        this.context.lineTo(x + hmargin + barWidth, y);
                                        this.context.lineTo(x + hmargin, y);
                                    this.context.closePath();
                                    this.context.stroke();
                                    this.context.fill();
                                }




                                // Draw the darker right side section
                                this.context.beginPath();
                                    this.context.fillStyle = 'rgba(0,0,0,0.4)';
                                    // TL
                                    this.context.moveTo(x + hmargin + barWidth, y);

                                    // TR
                                    this.context.lineTo(
                                        x + hmargin + barWidth + prop.variantThreedOffsetx,
                                        this.data[i] < 0 && xaxispos === 'bottom' ? this.getYCoord(0) : (this.data[i] < 0 && (y - prop.variantThreedOffsety) < (this.marginTop + this.halfgrapharea) ? (this.marginTop + this.halfgrapharea) : y - prop.variantThreedOffsety)
                                    );

                                    // BR
                                    this.context.lineTo(
                                        x + hmargin + barWidth + prop.variantThreedOffsetx,

                                          this.data[i] < 0 && (y - prop.variantThreedOffsety + height) < this.getYCoord(0)
                                        ? this.getYCoord(0)
                                        : this.data[i] > 0 ? y - prop.variantThreedOffsety + height : Math.min(y - prop.variantThreedOffsety + height, this.canvas.height - this.marginBottom)
                                    );
                                    // BL
                                    this.context.lineTo(x + hmargin + barWidth, y + height);
                                    this.context.lineTo(x + hmargin + barWidth, y);
                                this.context.closePath();

                                this.context.stroke();
                                this.context.fill();

                                this.context.strokeStyle = prevStrokeStyle;
                                this.context.fillStyle   = prevFillStyle;

                            // Glass variant
                            } else if (variant == 'glass') {

                                var grad = this.context.createLinearGradient(x + hmargin,y,x + hmargin + (barWidth / 2),y);
                                grad.addColorStop(0, 'rgba(255,255,255,0.9)');
                                grad.addColorStop(1, 'rgba(255,255,255,0.5)');

                                this.context.beginPath();
                                this.context.fillStyle = grad;
                                this.context.fillRect(x + hmargin + 2,y + (this.data[i] > 0 ? 2 : 0),(barWidth / 2) - 2,height - 2);
                                this.context.fill();
                            }


                        // Dot chart
                        } else if (variant == 'dot') {

                            this.context.beginPath();
                            this.context.moveTo(x + (width / 2), y);
                            this.context.lineTo(x + (width / 2), y + height);
                            this.context.stroke();

                            this.context.beginPath();
                            this.context.fillStyle = this.properties.colors[i];
                            this.context.arc(x + (width / 2), y + (this.data[i] > 0 ? 0 : height), 2, 0, 6.28, 0);

                            // Set the colour for the dots
                            this.context.fillStyle = prop.colors[0];

                            //
                            // Sequential colors
                            //
                            if (prop.colorsSequential) {
                                this.context.fillStyle = colors[i];
                            }

                            this.context.stroke();
                            this.context.fill();



                        // Unknown variant type
                        } else {
                            alert('[BAR] Warning! Unknown variant: ' + variant);
                        }

                        this.coords.push([x + hmargin, y, width - (2 * hmargin), height]);

                            if (typeof this.coords2[i] == 'undefined') {
                                this.coords2[i] = [];
                            }
                            this.coords2[i].push([x + hmargin, y, width - (2 * hmargin), height]);


                    //
                    // Stacked bar
                    //
                    } else if (this.data[i] && typeof this.data[i] == 'object' && prop.grouping == 'stacked') {

                        if (this.scale2.min) {
                            alert("[ERROR] Stacked Bar charts with a Y min are not supported");
                        }

                        var barWidth     = width - (2 * hmargin);
                        var redrawCoords = [];// Necessary to draw if the shadow is enabled
                        var startY       = 0;
                        var dataset      = this.data[i];

                        //
                        // Check for a negative bar width
                        //
                        if (barWidth < 0) {
                            alert('[RGRAPH] Warning: you have a negative bar width. This may be caused by the marginInner being too high or the width of the canvas not being sufficient.');
                        }

                        for (j=0; j<dataset.length; ++j) {

                            // Stacked bar chart and X axis pos in the middle - poitless since negative values are not permitted
                            if (xaxispos == 'center') {
                                alert("[BAR] It's pointless having the X axis position at the center on a stacked bar chart.");
                                return;
                            }

                            // Negative values not permitted for the stacked chart
                            if (this.data[i][j] < 0) {
                                alert('[BAR] Negative values are not permitted with a stacked bar chart. Try a grouped one instead.');
                                return;
                            }

                            //
                            // Set the fill and stroke colors
                            //
                            this.context.strokeStyle = strokeStyle
                            this.context.fillStyle = colors[j];

                            if (prop.colorsReverse) {
                                this.context.fillStyle = colors[this.data[i].length - j - 1];
                            }

                            if (prop.colorsSequential && colors[sequentialColorIndex]) {
                                this.context.fillStyle = colors[sequentialColorIndex++];
                            } else if (prop.colorsSequential) {
                                this.context.fillStyle = colors[sequentialColorIndex - 1];
                            }

                            var height = (dataset[j] / this.scale2.max) * (this.canvas.height - this.marginTop - this.marginBottom );

                            // If the X axis pos is in the center, we need to half the  height
                            if (xaxispos == 'center') {
                                height /= 2;
                            }

                            var totalHeight = (RGraph.arraySum(dataset) / this.scale2.max) * (this.canvas.height - hmargin - this.marginTop - this.marginBottom);

                            //
                            // Store the coords for tooltips
                            //
                            this.coords.push([x + hmargin, y, width - (2 * hmargin), height]);
                            if (typeof this.coords2[i] == 'undefined') {
                                this.coords2[i] = [];
                            }
                            this.coords2[i].push([x + hmargin, y, width - (2 * hmargin), height]);


                            if (height > 0) {
                                this.context.lineJoin = 'miter';
                                this.context.lineCap  = 'square';
                                this.context.strokeRect(x + hmargin, y, width - (2 * hmargin), height);
                                this.context.fillRect(x + hmargin, y, width - (2 * hmargin), height);
                            }


                            if (j == 0) {
                                var startY = y;
                                var startX = x;
                            }

                            //
                            // Store the redraw coords if the shadow is enabled
                            //
                            if (shadow) {
                                redrawCoords.push([x + hmargin, y, width - (2 * hmargin), height, this.context.fillStyle]);
                            }

                            //
                            // Stacked 3D effect
                            //
                            if (variant == '3d') {

                                var prevFillStyle = this.context.fillStyle;
                                var prevStrokeStyle = this.context.strokeStyle;


                                // Draw the top side
                                if (j == 0) {
                                    this.context.beginPath();
                                        this.context.moveTo(startX + hmargin, y);
                                        this.context.lineTo(startX + prop.variantThreedOffsetx + hmargin, y - prop.variantThreedOffsety);
                                        this.context.lineTo(startX + prop.variantThreedOffsetx + barWidth + hmargin, y - prop.variantThreedOffsety);
                                        this.context.lineTo(startX + barWidth + hmargin, y);
                                    this.context.closePath();

                                    this.context.fill();
                                    this.context.stroke();
                                }

                                // Draw the side section
                                this.context.beginPath();
                                    this.context.moveTo(startX + barWidth + hmargin, y);
                                    this.context.lineTo(startX + barWidth + hmargin + prop.variantThreedOffsetx, y - prop.variantThreedOffsety);
                                    this.context.lineTo(startX + barWidth + hmargin + prop.variantThreedOffsetx, y - prop.variantThreedOffsety + height);
                                    this.context.lineTo(startX + barWidth + hmargin , y + height);
                                this.context.closePath();

                                this.context.fill();
                                this.context.stroke();

                                // Draw the lighter top side
                                if (j == 0) {
                                    this.context.fillStyle = 'rgba(255,255,255,0.5)';
                                    this.context.beginPath();
                                        this.context.moveTo(startX + hmargin, y);
                                        this.context.lineTo(startX + prop.variantThreedOffsetx + hmargin, y - prop.variantThreedOffsety);
                                        this.context.lineTo(startX + prop.variantThreedOffsetx + barWidth + hmargin, y - prop.variantThreedOffsety);
                                        this.context.lineTo(startX + barWidth + hmargin, y);
                                    this.context.closePath();

                                    this.context.fill();
                                    this.context.stroke();
                                }

                                // Draw the darker side section
                                this.context.fillStyle = 'rgba(0,0,0,0.4)';
                                this.context.beginPath();
                                    this.context.moveTo(startX + barWidth + hmargin, y);
                                    this.context.lineTo(startX + barWidth + hmargin + prop.variantThreedOffsetx, y - prop.variantThreedOffsety);
                                    this.context.lineTo(startX + barWidth + hmargin + prop.variantThreedOffsetx, y - prop.variantThreedOffsety + height);
                                    this.context.lineTo(startX + barWidth + hmargin , y + height);
                                this.context.closePath();

                                this.context.fill();
                                this.context.stroke();

                                this.context.strokeStyle = prevStrokeStyle;
                                this.context.fillStyle = prevFillStyle;
                            }

                            y += height;
                        }



                        //
                        // Redraw the bars if the shadow is enabled due to hem being drawn from the bottom up, and the
                        // shadow spilling over to higher up bars
                        //
                        if (shadow) {

                            RGraph.noShadow(this);

                            for (k=0; k<redrawCoords.length; ++k) {
                                this.context.strokeStyle = strokeStyle;
                                this.context.fillStyle = redrawCoords[k][4];
                                this.context.strokeRect(redrawCoords[k][0], redrawCoords[k][1], redrawCoords[k][2], redrawCoords[k][3]);
                                this.context.fillRect(redrawCoords[k][0], redrawCoords[k][1], redrawCoords[k][2], redrawCoords[k][3]);

                                this.context.stroke();
                                this.context.fill();
                            }

                            // Reset the redraw coords to be empty
                            redrawCoords = [];
                        }

                    //
                    // Grouped bar
                    //
                    } else if (this.data[i] && typeof(this.data[i]) == 'object' && prop.grouping == 'grouped') {

                        var redrawCoords = [];
                        this.context.lineWidth = prop.linewidth;

                        for (j=0; j<this.data[i].length; ++j) {

                            // Set the fill and stroke colors
                            this.context.strokeStyle = strokeStyle;
                            this.context.fillStyle   = colors[j];

                            //
                            // Sequential colors
                            //
                            if (prop.colorsSequential && colors[sequentialColorIndex]) {
                                this.context.fillStyle = colors[sequentialColorIndex++];
                            } else if (prop.colorsSequential) {
                                this.context.fillStyle = colors[sequentialColorIndex - 1];
                            }

                            var individualBarWidth = (width - (2 * hmargin)) / this.data[i].length;
                            var height = ((this.data[i][j] + (this.data[i][j] < 0 ? this.scale2.min : (-1 * this.scale2.min) )) / (this.scale2.max - this.scale2.min) ) * (this.canvas.height - this.marginTop - this.marginBottom );
                            var groupedMargin = prop.marginInnerGrouped;
                            var startX = x + hmargin + (j * individualBarWidth);

                            //
                            // Check for a negative bar width
                            //
                            if (individualBarWidth < 0) {
                                alert('[RGRAPH] Warning: you have a negative bar width. This may be caused by the marginInner being too high or the width of the canvas not being sufficient.');
                            }

                            // If the X axis pos is in the center, we need to half the  height
                            if (xaxispos == 'center') {
                                height /= 2;
                            }

                            //
                            // Determine the start positioning for the bar
                            //
                            if (xaxispos == 'top') {
                                var startY = this.marginTop;
                                var height = Math.abs(height);

                            } else if (xaxispos == 'center') {
                                var startY = this.marginTop + (this.grapharea / 2) - height;

                            } else {
                                var startY = this.getYCoord(0);//this.canvas.height - this.marginBottom - height;
                                var height = Math.abs(Math.abs(this.getYCoord(this.data[i][j])) - this.getYCoord(0));

                                if (this.data[i][j] >= 0) {
                                    startY -= height;
                                }

                            }

                            this.context.lineJoin = 'miter';
                            this.context.lineCap  = 'square';
                            this.context.strokeRect(startX + groupedMargin, startY, individualBarWidth - (2 * groupedMargin), height);
                            this.context.fillRect(startX + groupedMargin, startY, individualBarWidth - (2 * groupedMargin), height);
                            y += height;



                            //
                            // Grouped 3D effect
                            //
                            if (variant == '3d') {

                                var prevFillStyle   = this.context.fillStyle;
                                var prevStrokeStyle = this.context.strokeStyle;
                                var hmarginGrouped  = prop.marginInnerGrouped;

                                // Draw the top side
                                if (this.data[i][j]  >= 0) {

                                    this.context.beginPath();
                                        this.context.moveTo(startX + hmarginGrouped, startY);
                                        this.context.lineTo(startX + hmarginGrouped + prop.variantThreedOffsetx, startY - prop.variantThreedOffsety);
                                        this.context.lineTo(startX + prop.variantThreedOffsetx + individualBarWidth - hmarginGrouped, startY - prop.variantThreedOffsety);
                                        this.context.lineTo(startX + individualBarWidth - hmarginGrouped, startY);
                                    this.context.closePath();
                                    this.context.fill();
                                    this.context.stroke();
                                }

                                // Draw the side section
                                this.context.beginPath();
                                    this.context.moveTo(startX + individualBarWidth - hmarginGrouped - 1, startY);
                                    this.context.lineTo(
                                        startX + individualBarWidth - hmarginGrouped + prop.variantThreedOffsetx,
                                        this.data[i][j] < 0 ? (this.getYCoord(0) + Math.abs(height) - prop.variantThreedOffsety) : this.getYCoord(0) - height - prop.variantThreedOffsety
                                    );

                                    this.context.lineTo(
                                        startX + individualBarWidth - hmarginGrouped + prop.variantThreedOffsetx,
                                        this.data[i][j] < 0 && (startY + height - prop.variantThreedOffsety) < (this.marginTop + this.halfgrapharea) ? (this.marginTop + this.halfgrapharea) : (startY + height - prop.variantThreedOffsety)
                                    );
                                    this.context.lineTo(startX + individualBarWidth - hmarginGrouped - 1, startY + height);
                                this.context.closePath();
                                this.context.fill();
                                this.context.stroke();


                                // Draw the lighter top side - but only if the current value is positive
                                if (this.data[i][j] >= 0) {
                                    this.context.fillStyle = 'rgba(255,255,255,0.5)';
                                    this.context.beginPath();
                                        // BL
                                        this.context.moveTo(startX + hmarginGrouped, startY);

                                        // BR
                                        this.context.lineTo(startX + hmarginGrouped + prop.variantThreedOffsetx, startY - prop.variantThreedOffsety);

                                        // TR
                                        this.context.lineTo(startX + prop.variantThreedOffsetx + individualBarWidth - hmarginGrouped, startY - prop.variantThreedOffsety);

                                        // TL
                                        this.context.lineTo(startX + individualBarWidth - hmarginGrouped, startY);
                                    this.context.closePath();

                                    this.context.fill();
                                    this.context.stroke();
                                }

                                // Draw the darker side section
                                this.context.fillStyle = 'rgba(0,0,0,0.4)';
                                this.context.beginPath();
                                    // TL corner
                                    this.context.moveTo(
                                        startX + individualBarWidth - hmarginGrouped,
                                        startY
                                    );


                                    this.context.lineTo(
                                        startX + individualBarWidth + prop.variantThreedOffsetx - hmarginGrouped,
                                        this.data[i][j] < 0 ? (this.getYCoord(0) + Math.abs(height) - prop.variantThreedOffsety) : this.getYCoord(0) - height - prop.variantThreedOffsety
                                    );

                                    // TR corner
                                    this.context.lineTo(
                                        startX + individualBarWidth + prop.variantThreedOffsetx - hmarginGrouped,
                                        this.data[i][j] < 0 && (startY + height - 5) < (this.marginTop + this.halfgrapharea) ? (this.marginTop + this.halfgrapharea) : (startY + height - prop.variantThreedOffsety)
                                    );

                                    // TL corner
                                    this.context.lineTo(startX + individualBarWidth - hmarginGrouped, startY + height);
                                this.context.closePath();

                                this.context.fill();
                                this.context.stroke();

                                this.context.strokeStyle = prevStrokeStyle;
                                this.context.fillStyle   = prevFillStyle;
                            }

                            if (height < 0) {
                                height = Math.abs(height);
                                startY = startY - height;
                            }

                            this.coords.push([startX + groupedMargin, startY, individualBarWidth - (2 * groupedMargin), height]);
                            if (typeof this.coords2[i] == 'undefined') {
                                this.coords2[i] = [];
                            }

                            this.coords2[i].push([startX + groupedMargin, startY, individualBarWidth - (2 * groupedMargin), height]);

                            // Facilitate shadows going to the left
                            if (prop.shadow) {
                                redrawCoords.push([
                                    startX + groupedMargin,
                                    startY,
                                    individualBarWidth - (2 * groupedMargin),
                                    height,
                                    this.context.fillStyle
                                ]);
                            }
                        }







                        //
                        // Redraw the bar if shadows are going to the left
                        //
                        if (redrawCoords.length) {

                            RGraph.noShadow(this);

                            this.context.lineWidth = prop.linewidth;

                            this.context.beginPath();
                                for (var j=0; j<redrawCoords.length; ++j) {

                                    this.context.fillStyle   = redrawCoords[j][4];
                                    this.context.strokeStyle = prop.colorsStroke;

                                    this.context.fillRect(redrawCoords[j][0], redrawCoords[j][1], redrawCoords[j][2], redrawCoords[j][3]);
                                    this.context.strokeRect(redrawCoords[j][0], redrawCoords[j][1], redrawCoords[j][2], redrawCoords[j][3]);
                                }
                            this.context.fill();
                            this.context.stroke();

                            redrawCoords = [];
                        }
                    } else {
                        this.coords.push([]);
                    }

                this.context.closePath();
            }

            // If 3D, redraw the right hand Y axis
            if (prop.variant === '3d' && prop.yaxisPosition === 'right') {
                RGraph.draw3DYAxis(this);
            }





            //
            // Turn off any shadow
            //
            RGraph.noShadow(this);
        };








        //
        // Draws the labels for the graph
        //
        this.drawLabels = function ()
        {
            var context = this.context;

            var text_angle = prop.xaxisLabelsAngle,
                text_size  = prop.xaxisLabelsSize ? prop.xaxisLabelsSize : prop.textSize,
                labels     = prop.xaxisLabels;



            // Draw the Y axis labels:
            if (prop.yaxisLabels) {
                if (prop.xaxisPosition === 'top')    this.drawlabels_top();
                if (prop.xaxisPosition === 'center') this.drawlabels_center();
                if (prop.xaxisPosition === 'bottom') this.drawlabels_bottom();
            }




            //
            // The X axis labels
            //
            if (typeof labels == 'object' && labels) {

                var yOffset = Number(prop.xaxisLabelsOffsety),
                    xOffset = Number(prop.xaxisLabelsOffsetx),
                    bold    = typeof prop.xaxisLabelsBold === 'boolean' ? prop.xaxisLabelsBold : prop.textBold,
                    italic  = typeof prop.xaxisLabelsItalic === 'boolean' ? prop.xaxisLabelsItalic : prop.textItalic,
                    font    = prop.xaxisLabelsFont || prop.textFont,
                    size    = typeof prop.xaxisLabelsSize === 'number' ? prop.xaxisLabelsSize : prop.textSize;

                //
                // Text angle
                //
                if (prop.xaxisLabelsAngle != 0) {
                    var valign =  'center';
                    var halign =  'right';
                    var angle  = 0 - prop.xaxisLabelsAngle;
                } else {
                    var valign =  'top';
                    var halign =  'center';
                    var angle  = 0;
                }

                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'xaxisLabels'
                });

                // Draw the X axis labels
                this.context.fillStyle = textConf.color;

                // How wide is each bar
                var barWidth = (this.canvas.width - this.marginRight - this.marginLeft) / labels.length;

                // Reset the xTickGap
                xTickGap = (this.canvas.width - this.marginRight - this.marginLeft) / labels.length

                // Draw the X tickmarks
                var i=0;

                for (x=this.marginLeft + (xTickGap / 2); x<=this.canvas.width - this.marginRight; x+=xTickGap) {

                    RGraph.text({
                    
                      object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      x + xOffset,
                        y:      prop.xaxisPosition == 'top' ? this.marginTop + yOffset - 5: (this.canvas.height - this.marginBottom) + yOffset + 3,
                        text:   String(labels[i++]),
                        valign: prop.xaxisPosition == 'top' ? 'bottom' : valign,
                        halign: halign,
                        tag:    'label',
                        marker: false,
                        angle:  angle,
                        tag:    'labels'
                    });
                }
            }

            //
            // Draw above labels
            //
            this.drawAboveLabels();
        };








        //
        // Draws the X axis at the top
        //
        this.drawlabels_top = function ()
        {
            this.context.beginPath();
            this.context.fillStyle   = prop.textColor;
            this.context.strokeStyle = 'black';

            if (prop.xaxisPosition == 'top') {

                var context    = this.context;
                var text_size  = prop.textSize;
                var units_pre  = prop.yaxisScaleUnitsPre;
                var units_post = prop.yaxisScaleUnitsPost;
                var align      = prop.yaxisPosition == 'left' ? 'right' : 'left';
                var font       = prop.textFont;
                var numYLabels = prop.yaxisLabelsCount;
                var ymin       = prop.yaxisScaleMin;
                var offsetx    = prop.yaxisLabelsOffsetx;
                var offsety    = prop.yaxisLabelsOffsety;
                
                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'yaxisLabels'
                });

                if (prop.yaxisLabelsInside == true) {
                    var xpos  = prop.yaxisPosition == 'left' ? this.marginLeft + 5 : this.canvas.width - this.marginRight - 5;
                    var align = prop.yaxisPosition == 'left' ? 'left' : 'right';
                    var boxed = true;
                } else {
                    var xpos  = prop.yaxisPosition == 'left' ? this.marginLeft - 5 : this.canvas.width - this.marginRight + 5;
                    var boxed = false;
                }

                //
                // Draw specific Y labels here so that the local variables can be reused
                //
                if (typeof(prop.yaxisLabelsSpecific) == 'object' && prop.yaxisLabelsSpecific) {

                    var labels = RGraph.arrayReverse(prop.yaxisLabelsSpecific);
                    var grapharea = this.canvas.height - this.marginTop - this.marginBottom;

                    for (var i=0; i<labels.length; ++i) {

                        var y = this.marginTop + (grapharea * (i / labels.length)) + (grapharea / labels.length);

                        RGraph.text({
                        
                          object: this,
                            
                            font:    textConf.font,
                            size:    textConf.size,
                            color:   textConf.color,
                            bold:    textConf.bold,
                            italic:  textConf.italic,
                            
                            x:       xpos + offsetx,
                            y:       y + offsety,
                            text:    String(labels[i]),
                            valign:  'center',
                            halign:  align,
                            bordered:boxed,
                            tag:     'scale'
                        });
                    }

                    return;
                }








                //
                // Draw the scale
                //
                var labels = this.scale2.labels;
                for (var i=0; i<labels.length; ++i) {
                    RGraph.text(this, {
                            
                        font:     textConf.font,
                        size:     textConf.size,
                        color:    textConf.color,
                        bold:     textConf.bold,
                        italic:   textConf.italic,

                        x:        xpos + offsetx,
                        y:        this.marginTop + ((this.grapharea / labels.length) * (i + 1)) + offsety,
                        text:     '-' + labels[i],
                        valign:   'center',
                        halign:   align,
                        bordered: boxed,
                        tag:       'scale'
                    });
                }








                //
                // Show the minimum value if its not zero
                //
                if (prop.yaxisScaleMin != 0 || !prop.xaxis || prop.yaxisScaleZerostart) {

                    RGraph.text(this, {
                            
                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,
                            
                            x: xpos + offsetx,
                            y: this.marginTop + offsety,
                         text: (this.scale2.min != 0 ? '-' : '') + RGraph.numberFormat({
                            object:    this,
                            number:    (this.scale2.min.toFixed((this.scale2.min === 0 ? 0 : prop.yaxisScaleDecimals))),
                            unitspre:  units_pre,
                            unitspost: units_post
                        }),
                       valign: 'center',
                       halign: align,
                     bordered: boxed,
                          tag: 'scale'
                    });
                }

            }

            this.context.fill();
        };








        //
        // Draws the X axis in the middle
        //
        this.drawlabels_center = function ()
        {
            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'scale'
            });

            var numYLabels = prop.yaxisLabelsCount;

            this.context.fillStyle = textConf.color;

            if (prop.xaxisPosition == 'center') {

                //
                // Draw the top labels
                //
                var text_size  = textConf.size;
                var units_pre  = prop.yaxisScaleUnitsPre;
                var units_post = prop.yaxisScaleUnitsPost;
                var context = this.context;
                var align   = '';
                var xpos    = 0;
                var boxed   = false;
                var ymin    = prop.yaxisScaleMin;
                var offsetx = prop.yaxisLabelsOffsetx;
                var offsety = prop.yaxisLabelsOffsety;

                this.context.fillStyle   = textConf.color;
                this.context.strokeStyle = 'black';

                if (prop.yaxisLabelsInside == true) {
                    var xpos  = prop.yaxisPosition == 'left' ? this.marginLeft + 5 : this.canvas.width - this.marginRight - 5;
                    var align = prop.yaxisPosition == 'left' ? 'left' : 'right';
                    var boxed = true;
                } else {
                    var xpos  = prop.yaxisPosition == 'left' ? this.marginLeft - 5 : this.canvas.width - this.marginRight + 5;
                    var align = prop.yaxisPosition == 'left' ? 'right' : 'left';
                    var boxed = false;
                }












                //
                // Draw specific Y labels here so that the local variables can be reused
                //
                if (typeof(prop.yaxisLabelsSpecific) == 'object' && prop.yaxisLabelsSpecific) {

                    var labels    = prop.yaxisLabelsSpecific;
                    var grapharea = this.canvas.height - this.marginTop - this.marginBottom;

                    // Draw the top halves labels
                    for (var i=0; i<labels.length; ++i) {

                        var y = this.marginTop + ((grapharea / 2) / (labels.length - 1)) * i;

                        RGraph.text({
                        
                            object: this,

                            font:    textConf.font,
                            size:    textConf.size,
                            bold:    textConf.bold,
                            italic:  textConf.italic,
                            color:   textConf.color,

                            x:       xpos + offsetx,
                            y:       y + offsety,
                            text:    String(labels[i]),
                            valign:  'center',
                            halign:  align,
                            bordered:boxed,
                            tag:     'scale'
                        });
                    }

                    // Draw the bottom halves labels
                    for (var i=labels.length-1; i>=1; --i) {

                        var y = this.marginTop  + (grapharea * (i / ((labels.length - 1) * 2) )) + (grapharea / 2);

                        RGraph.text({

                          object: this,

                            font:   textConf.font,
                            size:   textConf.size,
                            italic: textConf.italic,
                            bold:   textConf.bold,
                            color:  textConf.color,

                            'x':xpos + offsetx,
                            'y':y + offsety,
                            'text':String(labels[labels.length - i - 1]),
                            'valign':'center',
                            'halign':align,
                            'bordered':boxed,
                            'tag': 'scale'
                        });
                    }

                    return;
                }










                //
                // Draw the top halfs labels
                //
                for (var i=0; i<this.scale2.labels.length; ++i) {
                    var y    = this.marginTop + this.halfgrapharea - ((this.halfgrapharea / numYLabels) * (i + 1));
                    var text = this.scale2.labels[i];
                    RGraph.text({
                    
                      object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        italic: textConf.italic,
                        bold:   textConf.bold,
                        color:  textConf.color,

                        'x':xpos + offsetx,
                        'y':y + offsety,
                        'text': text,
                        'valign':
                        'center',
                        'halign': align,
                        'bordered': boxed,
                        'tag':'scale'
                    });
                }

                //
                // Draw the bottom halfs labels
                //
                for (var i=(this.scale2.labels.length - 1); i>=0; --i) {
                    var y = this.marginTop + ((this.halfgrapharea / numYLabels) * (i + 1)) + this.halfgrapharea;
                    var text = this.scale2.labels[i];
                    RGraph.text({
                    
                      object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        italic: textConf.italic,
                        bold:   textConf.bold,
                        color:  textConf.color,

                        'x':xpos + offsetx,
                        'y':y + offsety,
                        'text': '-' + text,
                        'valign':'center',
                        'halign': align,
                        'bordered': boxed,
                        'tag':'scale'
                    });
                }





                //
                // Show the minimum value if its not zero
                //
                if (this.scale2.min != 0 || prop.yaxisScaleZerostart) {
                    RGraph.text({
                     
                      object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        italic: textConf.italic,
                        bold:   textConf.bold,
                        color:  textConf.color,

                        x:          xpos + offsetx,
                        y:          this.marginTop + this.halfgrapharea + offsety,
                        text:       RGraph.numberFormat({
                            object:    this,
                            number:    (this.scale2.min.toFixed((this.scale2.min === 0 ? 0 : prop.yaxisScaleDecimals))),
                            unitspre:  units_pre,
                            unitspost: units_post
                        }),
                        valign:     'center',
                        valign:     'center',
                        halign:     align,
                        bordered:   boxed,
                        tag:        'scale'
                    });
                }
            }
        };








        //
        // Draws the X axdis at the bottom (the default)
        //
        this.drawlabels_bottom = function ()
        {
            var text_size  = prop.textSize,
                units_pre  = prop.yaxisScaleUnitsPre,
                units_post = prop.yaxisScaleUnitsPost,
                context    = this.context,
                align      = prop.yaxisPosition == 'left' ? 'right' : 'left',

                numYLabels = prop.yaxisLabelsCount,
                ymin       = prop.yaxisScaleMin,
                offsetx    = prop.yaxisLabelsOffsetx,
                offsety    = prop.yaxisLabelsOffsety;

                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'yaxisLabels'
                });


            this.context.beginPath();

            this.context.fillStyle   = textConf.color;
            this.context.strokeStyle = 'black';

            if (prop.yaxisLabelsInside == true) {
                var xpos  = prop.yaxisPosition == 'left' ? this.marginLeft + 5 : this.canvas.width - this.marginRight - 5;
                var align = prop.yaxisPosition == 'left' ? 'left' : 'right';
                var boxed = true;
            } else {
                var xpos  = prop.yaxisPosition == 'left' ? this.marginLeft - 5 : this.canvas.width - this.marginRight + 5;
                var boxed = false;
            }

            //
            // Draw specific Y labels here so that the local variables can be reused
            //
            if (prop.yaxisLabelsSpecific && typeof(prop.yaxisLabelsSpecific) == 'object') {

                var labels = prop.yaxisLabelsSpecific;
                var grapharea = this.canvas.height - this.marginTop - this.marginBottom;

                for (var i=0; i<labels.length; ++i) {
                    
                    var y = this.marginTop + (grapharea * (i / (labels.length - 1)));

                    RGraph.text({
                    
                      object: this,

                        font:     textConf.font,
                        size:     textConf.size,
                        color:    textConf.color,
                        bold:     textConf.bold,
                        italic:   textConf.italic,

                        x:        xpos + offsetx,
                        y:        y + offsety,
                        text:     labels[i],
                        valign:   'center',
                        halign:   align,
                        bordered: boxed,
                        tag:      'scale'
                    });
                }

                return;
            }

            var marginTop      = this.marginTop;
            var halfTextHeight = this.halfTextHeight;
            var scale          = this.scale;


            for (var i=0; i<numYLabels; ++i) {
                
                var text = this.scale2.labels[i];

                RGraph.text(this, {
                
                  object: this,

                    font:     textConf.font,
                    size:     textConf.size,
                    color:    textConf.color,
                    italic:   textConf.italic,
                    bold:     textConf.bold,

                    x:        xpos + offsetx,
                    y:        this.marginTop + this.grapharea - ((this.grapharea / numYLabels) * (i+1)) + offsety,
                    text:     text,
                    valign:   'center',
                    halign:   align,
                    bordered: boxed,
                    tag:      'scale'
                });
            }


            //
            // Show the minimum value if its not zero
            //
            if (prop.yaxisScaleMin != 0 || !prop.xaxis || prop.yaxisScaleZerostart) {

                RGraph.text({
                
                  object: this,

                    font:     textConf.font,
                    size:     textConf.size,
                    color:    textConf.color,
                    italic:   textConf.italic,
                    bold:     textConf.bold,

                    x:        xpos + offsetx,
                    y:        this.canvas.height - this.marginBottom + offsety,
                    text:     RGraph.numberFormat({
                        object:    this,
                        number:    (this.scale2.min.toFixed((this.scale2.min === 0 ? 0 : prop.yaxisScaleDecimals))),
                        unitspre:  units_pre,
                        unitspost: units_post
                    }),
                    valign:   'center',
                    halign:   align,
                    bordered: boxed,
                    tag:      'scale'
                });
            }

            this.context.fill();
        };








        //
        // Not used by the class during creating the graph, but is used by event handlers
        // to get the coordinates (if any) of the selected bar
        //
        // @param object e The event object
        // @param object   OPTIONAL You can pass in the bar object instead of the
        //                          function using "this"
        //
        this.getShape = function (e)
        {
            // This facilitates you being able to pass in the bar object as a parameter instead of
            // the function getting it from itself
            var obj = arguments[1] ? arguments[1] : this;

            var mouseXY = RGraph.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1],
                canvas  = obj.canvas,
                context = obj.context,
                coords  = obj.coords

            for (var i=0,len=coords.length; i<len; i+=1) {

                if (obj.coords[i].length == 0) {
                    continue;
                }

                var left   = coords[i][0],
                    top    = coords[i][1],
                    width  = coords[i][2],
                    height = coords[i][3],
                    prop   = obj.properties

                // Old way of testing
                //if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height)) {

                // Recreate the path/rectangle so that it can be tested
                //  ** DO NOT STROKE OR FILL IT **
                if (prop.tooltipsHotspotXonly) {
                    path(this.context,
                        'b r % % % %',
                        left,
                        this.marginTop,
                        width,
                        this.canvas.height - this.marginBottom
                    );
                } else {
                    path(this.context,
                        'b r % % % %',
                        left,
                        top,
                        width,
                        height
                    );
                }

                if (this.context.isPointInPath(mouseX, mouseY)) {


                    if (prop.tooltips) {
                        var tooltip = RGraph.parseTooltipText ? RGraph.parseTooltipText(prop.tooltips, i) : prop.tooltips[i];
                    }

                    // Work out the dataset
                    var dataset = 0,
                        idx     = i

                    while (idx >=  (typeof obj.data[dataset] === 'object' && obj.data[dataset] ? obj.data[dataset].length : 1)) {

                        if (typeof obj.data[dataset] === 'number') {
                            idx -= 1;
                        } else if (obj.data[dataset]) { // Accounts for null being an object
                            idx -= obj.data[dataset].length;
                        } else {
                            idx -= 1;
                        }

                        dataset++;
                    }

                    if (typeof(obj.data[dataset]) == 'number') {
                        idx = null;
                    }


                    return {
                        0: obj,
                        1: left,
                        2: top,
                        3: width,
                        4: height,
                        5: i,
                        
                    object: obj,
                         x: left,
                         y: top,
                     width: width,
                    height: height,
                     index: i,
                   tooltip: tooltip,
            index_adjusted: idx,
                   dataset: dataset
                    };
                }
            }

            return null;
        };








        //
        // This retrives the bar based on the X coordinate only.
        //
        // @param object e The event object
        // @param object   OPTIONAL You can pass in the bar object instead of the
        //                          function using "this"
        //
        this.getShapeByX = function (e)
        {
            var canvas      = e.target;
            var mouseCoords = RGraph.getMouseXY(e);


            // This facilitates you being able to pass in the bar object as a parameter instead of
            // the function getting it from itself
            var obj = arguments[1] ? arguments[1] : this;


            //
            // Loop through the bars determining if the mouse is over a bar
            //
            for (var i=0,len=obj.coords.length; i<len; i++) {

                if (obj.coords[i].length == 0) {
                    continue;
                }

                var mouseX = mouseCoords[0];
                var mouseY = mouseCoords[1];
                var left   = obj.coords[i][0];
                var top    = obj.coords[i][1];
                var width  = obj.coords[i][2];
                var height = obj.coords[i][3];
                var prop   = obj.properties;

                if (mouseX >= left && mouseX <= (left + width)) {

                    if (prop.tooltips) {
                        var tooltip = RGraph.parseTooltipText ? RGraph.parseTooltipText(prop.tooltips, i) : prop.tooltips[i];
                    }



                    return {
                        0: obj, 1: left, 2: top, 3: width, 4: height, 5: i,
                        'object': obj, 'x': left, 'y': top, 'width': width, 'height': height, 'index': i, 'tooltip': tooltip
                    };
                }
            }

            return null;
        };








        //
        // When you click on the chart, this method can return the Y value at that point. It works for any point on the
        // chart (that is inside the margins) - not just points within the Bars.
        //
        // EITHER:
        //
        // @param object arg The event object
        //
        // OR:
        //
        // @param object arg A two element array containing the X and Y coordinates
        //
        this.getValue = function (arg)
        {
            if (arg.length == 2) {
                var mouseX = arg[0];
                var mouseY = arg[1];
            } else {
                var mouseCoords = RGraph.getMouseXY(arg);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
            }

            if (   mouseY < prop.marginTop
                || mouseY > (this.canvas.height - prop.marginBottom)
                || mouseX < prop.marginLeft
                || mouseX > (this.canvas.width - prop.marginRight)
               ) {
                return null;
            }

            if (prop.xaxisPosition == 'center') {
                var value = (((this.grapharea / 2) - (mouseY - prop.marginTop)) / this.grapharea) * (this.scale2.max - this.scale2.min)
                value *= 2;

                if (value >= 0) {
                    value += this.scale2.min;
                } else {
                    value -= this.scale2.min;
                }

            } else if (prop.xaxisPosition == 'top') {
                var value = ((this.grapharea - (mouseY - prop.marginTop)) / this.grapharea) * (this.scale2.max - this.scale2.min)
                value = this.scale2.max - value;
                value = Math.abs(value) * -1;
            } else {
                var value = ((this.grapharea - (mouseY - prop.marginTop)) / this.grapharea) * (this.scale2.max - this.scale2.min)
                value += this.scale2.min;
            }




            return value;
        };








        //
        // This function can be used when the canvas is clicked on (or similar - depending on the event)
        // to retrieve the relevant Y coordinate for a particular value.
        //
        // @param int value The value to get the Y coordinate for
        //
        this.getYCoord = function (value)
        {
            if (value > this.scale2.max) {
                return null;
            }

            var y, xaxispos = prop.xaxisPosition;

            if (xaxispos == 'top') {

                // Account for negative numbers
                if (value < 0) {
                    value = Math.abs(value);
                }

                y = ((value - this.scale2.min) / (this.scale2.max - this.scale2.min)) * this.grapharea;
                y = y + this.marginTop

            } else if (xaxispos == 'center') {

                y = ((value - this.scale2.min) / (this.scale2.max - this.scale2.min)) * (this.grapharea / 2);
                y = (this.grapharea / 2) - y;
                y += this.marginTop;

            } else {

                if (value < this.scale2.min) {
                    value = this.scale2.min;
                }

                y  = ((value - this.scale2.min) / (this.scale2.max - this.scale2.min));
                y *= (this.canvas.height - this.marginTop - this.marginBottom);

                y = this.canvas.height - this.marginBottom - y;
            }

            return y;
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
                // Add the new highlight
                RGraph.Highlight.rect(this, shape);
            }
        };



        //
        // The getObjectByXY() worker method
        //
        this.getObjectByXY = function (e)
        {
            var mouseXY = RGraph.getMouseXY(e);

            // Adjust the mouse Y coordinate for when the bar chart is
            // a 3D variant
            if (prop.variant === '3d') {
                var adjustment = prop.variantThreedAngle * mouseXY[0];
                mouseXY[1] -= adjustment;
            }



            if (
                   mouseXY[0] >= prop.marginLeft
                && mouseXY[0] <= (this.canvas.width - prop.marginRight)
                && mouseXY[1] >= prop.marginTop
                && mouseXY[1] <= (this.canvas.height - prop.marginBottom)
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
            //
            // Handle adjusting for the Bar
            //
            if (prop.adjustable && RGraph.Registry.get('adjusting') && RGraph.Registry.get('adjusting').uid == this.uid) {

                // Rounding the value to the given number of decimals make the chart step
                var value   = Number(this.getValue(e));
                var shape   = RGraph.Registry.get('adjusting.shape')

                if (shape) {

                    RGraph.Registry.set('adjusting.shape', shape);

                    if (this.stackedOrGrouped && prop.grouping == 'grouped') {

                        var indexes = RGraph.sequentialIndexToGrouped(shape['index'], this.data);

                        if (typeof this.data[indexes[0]] == 'number') {
                            this.data[indexes[0]] = Number(value);
                        } else if (!RGraph.isNull(this.data[indexes[0]])) {
                            this.data[indexes[0]][indexes[1]] = Number(value);
                        }
                    } else if (typeof this.data[shape['index']] == 'number') {

                        this.data[shape['index']] = Number(value);
                    }

                    RGraph.redrawCanvas(e.target);
                    RGraph.fireCustomEvent(this, 'onadjust');
                }
            }
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors.colors                = RGraph.arrayClone(prop.colors);
                this.original_colors.keyColors             = RGraph.arrayClone(prop.keyColors);
                this.original_colors.crosshairsColor       = prop.crosshairsColor;
                this.original_colors.highlightStroke       = prop.highlightStroke;
                this.original_colors.highlightFill         = prop.highlightFill;
                this.original_colors.textColor             = prop.textColor;
                this.original_colors.backgroundBarsColor1  = prop.backgroundBarsColor1;
                this.original_colors.backgroundBarsColor2  = prop.backgroundBarsColor2;
                this.original_colors.backgroundGridColor   = prop.backgroundGridColor;
                this.original_colors.backgroundColor       = prop.backgroundColor;
                this.original_colors.colorsStroke          = prop.colorsStroke;
                this.original_colors.axesColor             = prop.axesColor;
            }


            // colors
            var colors = prop.colors;
            if (colors) {
                for (var i=0; i<colors.length; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }

            // keyColors
            var colors = prop.keyColors;
            if (colors) {
                for (var i=0; i<colors.length; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }

             prop.crosshairsColor      = this.parseSingleColorForGradient(prop.crosshairsColor);
             prop.highlightStroke      = this.parseSingleColorForGradient(prop.highlightStroke);
             prop.highlightFill        = this.parseSingleColorForGradient(prop.highlightFill);
             prop.textColor            = this.parseSingleColorForGradient(prop.textColor);
             prop.backgroundBarsColor1 = this.parseSingleColorForGradient(prop.backgroundBarsColor1);
             prop.backgroundBarsColor2 = this.parseSingleColorForGradient(prop.backgroundBarsColor2);
             prop.backgroundGridColor  = this.parseSingleColorForGradient(prop.backgroundGridColor);
             prop.backgroundColor      = this.parseSingleColorForGradient(prop.backgroundColor);
             prop.colorStroke          = this.parseSingleColorForGradient(prop.colorStroke);
             prop.axesColor            = this.parseSingleColorForGradient(prop.axesColor);
        };








        //
        // Use this function to reset the object to the post-constructor state. Eg reset colors if
        // need be etc
        //
        this.reset = function ()
        {
        };








        //
        // This parses a single color value. This method can also parse the new
        // JSON gradient syntax.
        // 
        // @param string The color to parse
        //
        this.parseSingleColorForGradient = function (color)
        {
            if (!color || typeof(color) != 'string') {
                return color;
            }

            if (color.match(/^gradient\((.*)\)$/i)) {


                // Allow for JSON gradients
                if (color.match(/^gradient\(({.*})\)$/i)) {
                    return RGraph.parseJSONGradient({object: this, def: RegExp.$1});
                }


                var parts = RegExp.$1.split(':');

                // Create the gradient
                var grad = this.context.createLinearGradient(0,this.canvas.height - prop.marginBottom, 0, prop.marginTop);

                var diff = 1 / (parts.length - 1);

                grad.addColorStop(0, RGraph.trim(parts[0]));

                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RGraph.trim(parts[j]));
                }
            }

            return grad ? grad : color;
        };








        this.drawBevel = function ()
        {
            var coords  = this.coords,
                coords2 = this.coords2,
                prop    = this.properties;

            if (prop.grouping == 'stacked') {
                for (var i=0; i<coords2.length; ++i) {
                    if (coords2[i] && coords2[i][0] && coords2[i][0][0]) {

                        var x = coords2[i][0][0];
                        var y = coords2[i][0][1];
                        var w = coords2[i][0][2];

                        var arr = [];
                        for (var j=0; j<coords2[i].length; ++j) {
                            arr.push(coords2[i][j][3]);
                        }
                        var h = RGraph.arraySum(arr);


                        this.context.save();

                            this.context.strokeStyle = 'black';

                            // Clip to the rect
                            this.context.beginPath();
                            this.context.rect(x, y, w, h);
                            this.context.clip();

                            // Add the shadow
                            this.context.shadowColor = 'black';
                            this.context.shadowOffsetX = 0;
                            this.context.shadowOffsetY = 0;
                            this.context.shadowBlur = 20;

                            this.context.beginPath();
                            this.context.rect(x - 3, y - 3, w + 6, h + 100);
                            this.context.lineWidth = 5;
                            this.context.stroke();
                        this.context.restore();
                    }
                }
            } else {

                for (var i=0; i<coords.length; ++i) {
                    if (coords[i]) {

                        var x = coords[i][0];
                        var y = coords[i][1];
                        var w = coords[i][2];
                        var h = coords[i][3];

                        var xaxispos = prop.xaxisPosition;
                        var xaxis_ycoord = ((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop;


                        this.context.save();

                            this.context.strokeStyle = 'black';

                            // Clip to the rect
                            this.context.beginPath();
                            this.context.rect(x, y, w, h);

                            this.context.clip();

                            // Add the shadow
                            this.context.shadowColor = 'black';
                            this.context.shadowOffsetX = 0;
                            this.context.shadowOffsetY = 0;
                            this.context.shadowBlur =  20;

                            if (xaxispos == 'top' || (xaxispos == 'center' && (y + h) > xaxis_ycoord)) {
                                y = y - 100;
                                h = h + 100;
                            } else {
                                y = y;
                                h = h + 100;
                            }

                            this.context.beginPath();
                                this.context.rect(x - 3, y - 3, w + 6, h + 6);
                                this.context.lineWidth = 5;
                            this.context.stroke();
                        this.context.restore();
                    }
                }
            }
        };








        //
        // This function handles highlighting an entire data-series for the interactive
        // key
        //
        // @param int index The index of the data series to be highlighted
        //
        this.interactiveKeyHighlight = function (index)
        {
            var obj = this;

            this.coords2.forEach(function (value, idx, arr)
            {
                if (typeof value[index] == 'object' && value[index]) {

                    var x = value[index][0]
                    var y = value[index][1]
                    var w = value[index][2]
                    var h = value[index][3]

                    obj.context.fillStyle   = prop.keyInteractiveHighlightChartFill;
                    obj.context.strokeStyle = prop.keyInteractiveHighlightChartStroke;
                    obj.context.lineWidth   = 2;
                    obj.context.strokeRect(x, y, w, h);
                    obj.context.fillRect(x, y, w, h);
                }
            });
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








        // Draws the above labels
        this.drawLabelsAbove =
        this.drawAboveLabels = function ()
        {
            var labels      = prop.labelsAbove,
                specific    = prop.labelsAboveSpecific,
                bold        = typeof prop.labelsAboveBold === 'boolean' ? prop.labelsAboveBold : prop.textBold,
                italic      = typeof prop.labelsAboveItalic === 'boolean' ? prop.labelsAboveItalic : prop.textItalic,
                color       = prop.labelsAboveColor || prop.textColor,
                font        = prop.labelsAboveFont || prop.textFont,
                size        = typeof prop.labelsAboveSize === 'number' ? prop.labelsAboveSize : prop.textSize,
                background  = prop.labelsAboveBackground,
                decimals    = prop.labelsAboveDecimals,
                angle       = -1 * prop.labelsAboveAngle,
                unitsPre    = prop.labelsAboveUnitsPre,
                unitsPost   = prop.labelsAboveUnitsPost,
                point       = prop.labelsAbovePoint,
                thousand    = prop.labelsAboveThousand,
                coords      = this.coords,
                coords2     = this.coords2,
                data        = this.data,
                ldata       = RGraph.arrayLinearize(this.data),
                offset      = prop.labelsAboveOffset,
                text_italic = prop.textItalic,
                text_bold   = prop.textBold,
                text_color  = prop.textColor,
                text_font   = prop.textFont,
                text_size   = prop.textSize,
                grouping    = prop.grouping;
            
            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'labelsAbove'
            });

            // Turn off any shadow
            RGraph.noShadow(this);

            // Color
            this.context.fillStyle = textConf.color;


            // This bit draws the text labels that appear above the bars if requested
            if (labels && grouping === 'grouped') {
                for (var i=0,len=data.length,sequentialIndex=0; i<len; i+=1) {

                    // Alignment for regular, positive bars
                    if (typeof data[i] === 'number' && data[i] >= 0) {

                        var angle  = angle;
                        var halign = (angle ? 'left' : 'center');
                        var valign = angle !== 0 ? 'center' : 'bottom';

                        RGraph.text({
                        
                          object: this,

                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                            x:    coords2[i][0][0] + (coords2[i][0][2] / 2),
                            y:    coords2[i][0][1] - offset,
                            text: specific ? (specific[sequentialIndex] || '') : RGraph.numberFormat({
                                object:    this,
                                number:    Number(typeof data[i] === 'object' ? data[i][0] : data[i]).toFixed(decimals),
                                unitspre:  unitsPre,
                                unitspost: unitsPost,
                                point:     point,
                                thousand:  thousand
                            }),
                            halign:            halign,
                            valign:            valign,
                            angle:             angle,
                            marker:            false,
                            bounding:          true,
                            'bounding.fill':   background,
                            'bounding.stroke': 'rgba(0,0,0,0)',
                            tag:               'labels.above'
                        });

                        sequentialIndex++;






                    // Alignment for regular, negative bars
                    } else if (typeof data[i] === 'number' && data[i] < 0) {

                        var angle  = angle;
                        var halign = angle ? 'right' : 'center';
                        var valign = angle !== 0 ? 'center' : 'top';


                        RGraph.text({
                        
                          object: this,

                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                            x:              coords2[i][0][0] + (coords2[i][0][2] / 2),
                            y:              coords2[i][0][1] + coords2[i][0][3] + offset,
                            text: specific ? (specific[sequentialIndex] || '') : RGraph.numberFormat({
                                object:    this,
                                number:    Number(typeof data[i] === 'object' ? data[i][0] : data[i]).toFixed(decimals),
                                unitspre:  unitsPre,
                                unitspost: unitsPost,
                                point:     point,
                                thousand:  thousand
                            }),
                            halign:         halign,
                            valign:         valign,
                            angle:          angle,
                            bounding:       true,
                            'bounding.fill':background,
                            'bounding.stroke':'rgba(0,0,0,0)',
                            marker:         false,
                            tag:            'labels.above'
                        });

                        sequentialIndex++;






                    // Alignment for grouped bars
                    } else if (typeof data[i] === 'object') {

                            for (var j=0,len2=data[i].length; j<len2; j+=1) {

                                var angle  = angle;
                                var halign = data[i][j] < 0 ? 'right' : 'left';
                                    halign = angle === 0 ? 'center' : halign;
                                var valign = data[i][j] < 0 ? 'top' : 'bottom';
                                    valign = angle != 0 ? 'center' : valign;

                                RGraph.text({
                                
                                  object: this,
        
                                    font:   textConf.font,
                                    size:   textConf.size,
                                    color:  textConf.color,
                                    bold:   textConf.bold,
                                    italic: textConf.italic,

                                    x:                  coords2[i][j][0] + (coords2[i][j][2] / 2),
                                    y:                  coords2[i][j][1] + (data[i][j] < 0 ? coords2[i][j][3] + offset: -offset),
                                    text:               specific ? (specific[sequentialIndex] || '') : RGraph.numberFormat({
                                                            object:    this,
                                                            number:    Number(data[i][j]).toFixed(decimals),
                                                            unitspre:  unitsPre,
                                                            unitspost: unitsPost,
                                                            point:     point,
                                                            thousand:  thousand
                                                        }),
                                    halign:             halign,
                                    valign:             valign,
                                    angle:              angle,
                                    bounding:           true,
                                    'bounding.fill':    background,
                                    'bounding.stroke':  'rgba(0,0,0,0)',
                                    marker:             false,
                                    tag:                'labels.above'
                                });
                                sequentialIndex++;
                            }
                    }
                }





            //
            // STACKED bars
            //
            } else if (labels && grouping === 'stacked') {
                for (var i=0,len=data.length,sequentialIndex=0; i<len; i+=1) {
                    if (typeof data[i] === 'object') {

                        var angle  = angle;
                        var halign = angle != 0 ? 'left' : 'center';
                        var valign = angle != 0 ? 'center' : 'bottom';

                        RGraph.text({
                        
                          object: this,

                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                            x:              coords2[i][0][0] + (coords2[i][0][2] / 2),
                            y:              coords2[i][0][1] + (data[i][0] < 0 ? coords2[i][0][3] : 0) - offset,
                            text:           specific ? (specific[sequentialIndex] || '') : RGraph.numberFormat({
                                                object:    this,
                                                number:    Number(RGraph.arraySum(data[i])).toFixed(decimals),
                                                unitspre:  unitsPre,
                                                unitspost: unitsPost,
                                                point:     point,
                                                thousand:  thousand
                                            }),
                            halign:         halign,
                            valign:         valign,
                            angle:          angle,
                            bounding:       true,
                            'bounding.fill':background,
                            'bounding.stroke': 'rgba(0,0,0,0)',
                            marker:         false,
                            tag:            'labels.above'
                        });

                        sequentialIndex += data[i].length;

                    //
                    // Regular numbers but in a stacked grouping
                    //
                    } else {

                        var angle  = angle;
                        var halign = angle != 0 ? 'left' : 'center';
                        var valign = angle != 0 ? 'center' : 'bottom';

                        RGraph.text({
                        
                          object: this,

                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                            x:                  coords2[i][0][0] + (coords2[i][0][2] / 2),
                            y:                  coords2[i][0][1] + (data[i][0] < 0 ? coords2[i][0][3] : 0) - offset,
                            text:               specific ? (specific[sequentialIndex] || '') : RGraph.numberFormat({
                                                    object:    this,
                                                    number:    Number(data[i]).toFixed(decimals),
                                                    unitspre:  unitsPre,
                                                    unitspost: unitsPost,
                                                    point:     point,
                                                    thousand:  thousand
                                                }),
                            halign:             halign,
                            valign:             valign,
                            angle:              angle,
                            bounding:           true,
                            'bounding.fill':    background,
                            'bounding.stroke':  'rgba(0,0,0,0)',
                            marker:             false,
                            tag:                'labels.above'
                        });

                        sequentialIndex++;
                    }
                }
            }
        };








        //
        // This function runs once only
        //
        this.firstDrawFunc = function ()
        {
        };








        //
        // (new) Bar chart Wave effect. This is a rewrite that should be smoother
        // because it just uses a single loop and not setTimeout
        //
        // @param object   OPTIONAL An object map of options. You specify 'frames' here to give the number of frames in the effect
        // @param function OPTIONAL A function that will be called when the effect is complete
        //
        this.wave = function ()
        {
            var obj = this,
                opt = arguments[0] || {},
                labelsAbove = this.get('labelsAbove');

            opt.frames =  opt.frames || 60;
            opt.startFrames = [];
            opt.counters    = [];

            var framesperbar   = opt.frames / 3,
                frame          = -1,
                callback       = arguments[1] || function () {},
                original       = RGraph.arrayClone(this.original_data);

            //
            // turn off the labelsAbove option whilst animating
            //
            this.set('labelsAbove', false);

            for (var i=0,len=obj.data.length; i<len; i+=1) {
                opt.startFrames[i] = ((opt.frames / 2) / (obj.data.length - 1)) * i;

                if (typeof obj.data[i] === 'object' && obj.data[i]) {
                    opt.counters[i] = [];
                    for (var j=0; j<obj.data[i].length; j++) {
                        opt.counters[i][j] = 0;
                    }
                } else {
                    opt.counters[i]    = 0;
                }
            }

            //
            // This stops the chart from jumping
            //
            obj.draw();
            obj.set('yaxisScaleMax', obj.scale2.max);
            RGraph.clear(obj.canvas);


            function iterator ()
            {
                ++frame;

                for (var i=0,len=obj.data.length; i<len; i+=1) {
                        if (frame > opt.startFrames[i]) {
                            if (typeof obj.data[i] === 'number') {

                                obj.data[i] = Math.min(
                                    Math.abs(original[i]),
                                    Math.abs(original[i] * ( (opt.counters[i]++) / framesperbar))
                                );

                                // Make the number negative if the original was
                                if (original[i] < 0) {
                                    obj.data[i] *= -1;
                                }
                            } else if (!RGraph.isNull(obj.data[i])) {
                                for (var j=0,len2=obj.data[i].length; j<len2; j+=1) {

                                    obj.data[i][j] = Math.min(
                                        Math.abs(original[i][j]),
                                        Math.abs(original[i][j] * ( (opt.counters[i][j]++) / framesperbar))
                                    );

                                    // Make the number negative if the original was
                                    if (original[i][j] < 0) {
                                        obj.data[i][j] *= -1;
                                    }
                                }
                            }
                        } else {
                            obj.data[i] = typeof obj.data[i] === 'object' && obj.data[i] ? RGraph.arrayPad([], obj.data[i].length, 0) : (RGraph.isNull(obj.data[i]) ? null : 0);
                        }
                }


                if (frame >= opt.frames) {

                    if (labelsAbove) {
                        obj.set('labelsAbove', true);
                        RGraph.redraw();
                    }

                    callback(obj);
                } else {
                    RGraph.redrawCanvas(obj.canvas);
                    RGraph.Effects.updateCanvas(iterator);
                }
            }

            iterator();

            return this;
        };








        //
        // Color Wave effect. This fades in color sequentially like the wave effect
        // makes the bars grow.
        //
        // @param object   OPTIONAL An object map of options. You specify 'frames'
        //                          here to give the number of frames in the effect
        // @param function OPTIONAL A function that will be called when the effect
        //                          is complete
        //
        this.colorWave = function ()
        {
            var obj = this,
                opt = arguments[0] || {};
                opt.frames =  opt.frames || 60;
                opt.startFrames = [];
                opt.counters    = [],
                colors          = obj.properties.colors;

            // If just one color is specified and colorsSequential is not, then
            // pad the colors array out
            if (colors.length <= obj.data.length) {
                obj.set('colorsSequential', true);
                colors =  RGraph.arrayPad(colors, obj.data.length, colors[colors.length - 1]);
            }

            var framesperbar   = opt.frames / 2,
                frame          = -1,
                callback       = arguments[1] || function () {},
                originalColors = RGraph.arrayClone(obj.properties.colors);



            for (var i=0,len=originalColors.length; i<len; i+=1) {
                opt.startFrames[i] = ((opt.frames / 2) / (originalColors.length - 1)) * i;
                opt.counters[i]    = 0;
            }


            function iterator ()
            {
                ++frame;

                for (var i=0,len=colors.length; i<len; i+=1) {
                    if (frame > opt.startFrames[i] && colors[i].match(/^rgba?\(([0-9 ]+),([0-9 ]+),([0-9 ]+)(,([ 0-9.]+)?)\)/)) {

                        // DO NOT USE SPACES!
                        colors[i] = 'rgba({1},{2},{3},{4})'.format(
                            RegExp.$1,
                            RegExp.$2,
                            RegExp.$3,
                            (frame - opt.startFrames[i]) / framesperbar
                        );
                    } else {
                        colors[i] = colors[i].replace(/,[0-9. ]+\)/, ',0)');
                    }
                }


                if (frame >= opt.frames) {
                    callback(obj);
                } else {
                    RGraph.redrawCanvas(obj.canvas);
                    RGraph.Effects.updateCanvas(iterator);
                }
            }

            iterator();

            return this;
        };








        //
        // Grow
        //
        // The Bar chart Grow effect gradually increases the values of the bars
        //
        // @param object       An object of options - eg: {frames: 30}
        // @param function     A function to call when the effect is complete
        //
        this.grow = function ()
        {
            // Callback
            var opt         = arguments[0] || {},
                frames      = opt.frames || 30,
                frame       = 0,
                callback    = arguments[1] || function () {},
                obj         = this,
                labelsAbove = this.get('labelsAbove');


            // Go through the data and change string arguments of the format +/-[0-9]
            // to absolute numbers
            if (RGraph.isArray(opt.data)) {

                var ymax = 0;

                for (var i=0; i<opt.data.length; ++i) {
                    if (typeof opt.data[i] === 'object') {
                        for (var j=0; j<opt.data[i].length; ++j) {
                            if (typeof opt.data[i][j] === 'string'&& opt.data[i][j].match(/(\+|\-)([0-9]+)/)) {
                                if (RegExp.$1 === '+') {
                                    opt.data[i][j] = this.original_data[i][j] + parseInt(RegExp.$2);
                                } else {
                                    opt.data[i][j] = this.original_data[i][j] - parseInt(RegExp.$2);
                                }
                            }

                            ymax = Math.max(ymax, opt.data[i][j]);
                        }
                    } else if (typeof opt.data[i] === 'string' && opt.data[i].match(/(\+|\-)([0-9]+)/)) {
                        if (RegExp.$1 === '+') {
                            opt.data[i] = this.original_data[i] + parseInt(RegExp.$2);
                        } else {
                            opt.data[i] = this.original_data[i] - parseInt(RegExp.$2);
                        }
                        ymax = Math.max(ymax, opt.data[i]);
                    } else {
                        ymax = Math.max(ymax, opt.data[i]);
                    }
                }


                var scale = RGraph.getScale2(this, {'scale.max':ymax});
                this.set('yaxisScaleMax', scale.max);
            }


            //
            // turn off the labelsAbove option whilst animating
            //
            this.set('labelsAbove', false);


            // Stop the scale from changing by setting yaxisScaleMax (if it's not already set)
            if (prop.yaxisScaleMax == null) {

                var ymax = 0;

                for (var i=0; i<this.data.length; ++i) {
                    if (RGraph.isArray(this.data[i]) && prop.grouping === 'stacked') {
                        ymax = Math.max(ymax, Math.abs(RGraph.arraySum(this.data[i])));

                    } else if (RGraph.isArray(this.data[i]) && prop.grouping === 'grouped') {

                        for (var j=0,group=[]; j<this.data[i].length; j++) {
                            group.push(Math.abs(this.data[i][j]));
                        }

                        ymax = Math.max(ymax, Math.abs(RGraph.arrayMax(group)));

                    } else {
                        ymax = Math.max(ymax, Math.abs(this.data[i]));
                    }
                }

                var scale = RGraph.getScale2(this, {'scale.max':ymax});
                this.set('yaxisScaleMax', scale.max);
            }

            // You can give a ymax to the grow function
            if (typeof opt.ymax === 'number') {
                this.set('yaxisScaleMax', opt.ymax);
            }



            var iterator = function ()
            {
                var easingMultiplier = RGraph.Effects.getEasingMultiplier(frames, frame);

                // Alter the Bar chart data depending on the frame
                for (var j=0,len=obj.original_data.length; j<len; ++j) {
                    if (typeof obj.data[j] === 'object' && !RGraph.isNull(obj.data[j])) {
                        for (var k=0,len2=obj.data[j].length; k<len2; ++k) {
                            if (obj.firstDraw || !opt.data) {
                                obj.data[j][k] = easingMultiplier * obj.original_data[j][k];
                            } else if (opt.data && opt.data.length === obj.original_data.length) {
                                var diff    = opt.data[j][k] - obj.original_data[j][k];
                                obj.data[j][k] = (easingMultiplier * diff) + obj.original_data[j][k];
                            }
                        }
                    } else {

                        if (obj.firstDraw || !opt.data) {
                            obj.data[j] = easingMultiplier * obj.original_data[j];
                        } else if (opt.data && opt.data.length === obj.original_data.length) {
                            var diff    = opt.data[j] - obj.original_data[j];
                            obj.data[j] = (easingMultiplier * diff) + obj.original_data[j];
                        }
                    }
                }




                //RGraph.clear(obj.canvas);
                RGraph.redrawCanvas(obj.canvas);




                if (frame < frames) {
                    frame += 1;

                    RGraph.Effects.updateCanvas(iterator);

                // Call the callback function
                } else {

                    // Do some housekeeping if new data was specified thats done in
                    // the constructor - but needs to be redone because new data
                    // has been specified
                    if (RGraph.isArray(opt.data)) {

                        var linear_data = RGraph.arrayLinearize(data);

                        for (var i=0; i<linear_data.length; ++i) {
                            if (!obj['$' + i]) {
                                obj['$' + i] = {};
                            }
                        }
                    }



                    obj.data = data;
                    obj.original_data = RGraph.arrayClone(data);




                    if (labelsAbove) {
                        obj.set('labelsAbove', true);
                        RGraph.redraw();
                    }
                    callback(obj);
                }
            };

            iterator();

            return this;
        };








        //
        // Draws error-bars for the Bar and Line charts
        //
        this.drawErrorbars = function ()
        {
            var coords = this.coords,
                 color = prop.errorbarsColor || 'black',
     default_halfwidth = Math.min(prop.errorbarsCappedWidth, coords[0][2]) / 2,
                     x = 0,
             errorbars = prop.errorbars,
                length = 0;


            // If not capped set the width of the cqap to zero
            if (!prop.errorbarsCapped) {
                prop.errorbarsCappedWidth = 0;
                halfwidth = 0;
            }

            // Set the linewidth
            this.context.lineWidth = prop.errorbarsLinewidth;




            for (var i=0; i<coords.length; ++i) {
            
                var barX = coords[i][0],
                    barY = coords[i][1],
                    barW = coords[i][2],
                    barH = coords[i][3];

                // Get the grouped version of the index
                var groupedIndexes = RGraph.sequentialIndexToGrouped(i, this.data);

                // Determine if this is 
                if (typeof this.data[groupedIndexes[0]] === 'object' && !RGraph.isNull(this.data[groupedIndexes[0]])) {
                    var isGrouped = true,
                        group     = groupedIndexes[0],
                        subgroup  = groupedIndexes[1];
                }


                // Default to black
                color = prop.errorbarsColor || 'black';

                // Set the perbar linewidth if the fourth option in the array
                // is specified
                if (errorbars[i] && typeof errorbars[i][3] === 'number') {
                    this.context.lineWidth = errorbars[i][3];
                }

                // Set the halfwidth
                var halfwidth = (errorbars[i]&& typeof errorbars[i][4] === 'number') ? errorbars[i][4] / 2 : default_halfwidth;

                if (!prop.errorbarsCapped) {
                    halfwidth = 0;
                }



                // Calulate the pixel size
                if (typeof errorbars[i] === 'number') {

                    length = Math.abs(this.getYCoord(errorbars[i]) - this.getYCoord(0));

                    if (length) {
                        path(
                            this.context,
                            'b m % % l % % l % % l % % s %',
                            barX + (barW / 2),
                            (typeof this.data[i] === 'number' && this.data[i] < 0 || (isGrouped && this.data[group][subgroup] < 0) ) ? barY + barH : barY,
                            barX + (barW / 2),
                            (typeof this.data[i] === 'number' && this.data[i] < 0  || (isGrouped && this.data[group][subgroup] < 0)) ? barY + barH + length : barY - length,
                            barX + (barW / 2) - halfwidth,
                            (typeof this.data[i] === 'number' && this.data[i] < 0 || (isGrouped && this.data[group][subgroup] < 0)) ? Math.round(barY + barH + length) : Math.round(barY - length),
                            barX + (barW / 2) + halfwidth,
                            (typeof this.data[i] === 'number' && this.data[i] < 0  || (isGrouped && this.data[group][subgroup] < 0)) ? Math.round(barY + barH + length)  : Math.round(barY - length),
                            color
                        );
                    }
                } else if (typeof errorbars[i] === 'object' && !RGraph.isNull(errorbars[i])) {

                    var positiveLength = Math.abs(this.getYCoord(errorbars[i][0]) - this.getYCoord(0));

                    // Color
                    if (typeof errorbars[i][1] === 'string') {
                        color = errorbars[i][1];

                    } else if (typeof errorbars[i][2] === 'string') {
                        color = errorbars[i][2];
                    }

                    // Cap width
                    halfwidth = typeof errorbars[i][4] === 'number' ? errorbars[i][4] / 2 : default_halfwidth;

                    if (!prop.errorbarsCapped) {
                        halfwidth = 0;
                    }

                    if (!RGraph.isNull(errorbars[i][0])) {

                        path(
                            this.context,
                            'b m % % l % % l % % l % % s %',
                            barX + (barW / 2),
                            barY + (this.data[i] < 0 ? barH : 0) +  ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2),
                            barY - positiveLength + (this.data[i] < 0 ? barH : 0)+ ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2) - halfwidth,
                            Math.round(barY - positiveLength) + (this.data[i] < 0 ? barH : 0) + ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2) + halfwidth,
                            Math.round(barY - positiveLength) + (this.data[i] < 0 ? barH : 0) + ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            color
                        );
                    }

                    if (typeof errorbars[i][1] === 'number') {

                        var negativeLength = Math.abs(this.getYCoord(errorbars[i][1]) - this.getYCoord(0));

                        path(
                            this.context,
                            'b m % % l % % l % % l % % s %',
                            barX + (barW / 2),
                            barY + (this.data[i] < 0 ? barH : 0)+ ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2),
                            barY + negativeLength + (this.data[i] < 0 ? barH : 0)+ ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2) - halfwidth,
                            Math.round(coords[i][1] + negativeLength) + (this.data[i] < 0 ? barH : 0)+ ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2) + halfwidth,
                            Math.round(barY + negativeLength) + (this.data[i] < 0 ? barH : 0)+ ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            color
                        );
                    }
                }


                // Reset the perbar linewidth to the default if the fourth option
                // in the array was specified specified
                if (errorbars[i] && typeof errorbars[i][3] === 'number') {
                    this.context.lineWidth = prop.errorbarsLinewidth;
                }
            }
        };








        //
        // A per-object to test whether a particular bar is adjustable or not
        //
        // @param shape The shape object
        //
        this.isAdjustable = function (shape)
        {
            if (RGraph.isNull(prop.adjustableOnly) || !RGraph.isArray(prop.adjustableOnly)) {
                return true;
            }

            if (RGraph.isArray(prop.adjustableOnly) && prop.adjustableOnly[shape.index]) {
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
        // contains configuration dsta - handle that.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);
    };





    //
    // This is the combined bar and Line class which makes creating bar/line combo charts a little bit easier
    //







    RGraph.CombinedChart = function ()
    {
        //
        // Create a default empty array for the objects
        //
        this.objects = [];
        var objects  = [];

        if (RGraph.isArray(arguments[0])) {
            objects = arguments[0];
        } else {
            for (var i=0; i<arguments.length; i+=1) {
                objects[i] = arguments[i];
            }
        }

        for (var i=0; i<objects.length; ++i) {

            this.objects[i] = objects[i];

            //
            // Set the Line chart margins to match the Bar chart margins
            //
            this.objects[i].set({
                marginLeft:   this.objects[0].get('marginLeft'), // Needs to use the dot form to skirt an IE9 bug
                marginRight:  this.objects[0].get('marginRight'), // Needs to use the dot form to skirt an IE9 bug
                marginTop:    this.objects[0].get('marginTop'), // Needs to use the dot form to skirt an IE9 bug
                marginBottom: this.objects[0].get('marginBottom') // Needs to use the dot form to skirt an IE9 bug
            });

            if (this.objects[i].type == 'line') {

                var obj = this.objects[i];

                //
                // Set the line chart marginInner
                //
                obj.set('marginInner', ((this.objects[0].canvas.width - this.objects[0].get('marginRight') - this.objects[0].get('marginLeft')) / this.objects[0].data.length) / 2 );


                //
                // No labels, axes or grid on the Line chart
                //
                obj.set('axes', false);
                obj.set('backgroundGrid', false);
                obj.set('yaxisLabels', false);
            }

            //
            // Resizing
            //
            if (this.objects[i].get('resizable')) {
                var resizable_object = obj;
            }
        }

        //
        // Resizing
        //
        if (resizable_object) {
            //
            // This recalculates the Line chart marginInner when the chart is resized
            //
            function myOnresizebeforedraw (obj)
            {
                var marginLeft  = obj.get('marginLeft');
                var marginRight = obj.get('marginRight');

                obj.set('marginInner', (obj.canvas.width - marginLeft - marginRight) / (obj.original_data[0].length * 2));
            }

            RGraph.addCustomEventListener(
                resizable_object,
                'onresizebeforedraw',
                myOnresizebeforedraw
            );
        }
        
        return this;
    };








    //
    // The Add method can be used to add methods to the CombinedChart object.
    //
    RGraph.CombinedChart.prototype.add = function (obj)
    {
        this.objects.push(obj);
        
        return this;
    };








    //
    // The Draw method goes through all of the objects drawing them (sequentially)
    //
    RGraph.CombinedChart.prototype.draw = function ()
    {
        if (RGraph.isArray(this.objects)) {
            for (var i=0; i<this.objects.length; ++i) {
                if (this.objects[i].properties['combinedEffect']) {
    
                    // The options must be given as a string because of the
                    // RGraph configuration system
                    var options  = this.objects[i].properties['combinedEffectOptions'] ? eval('(' + this.objects[i].properties['combinedEffectOptions'] + ')') : null,
                        callback = this.objects[i].properties['combinedEffectCallback'],
                        func     = this.objects[i].properties['combinedEffect'];
    
                    (this.objects[i][func])(options, callback);
                } else {
                    this.objects[i].draw();
                }
            }
        }
        
        return this;
    };
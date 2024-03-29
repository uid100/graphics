// version: 2019-09-08
    //
    // o--------------------------------------------------------------------------------o
    // | This file is part of the RGraph package - you can learn more at:               |
    // |                                                                                |
    // |                          https://www.rgraph.net                                |
    // |                                                                                |
    // | RGraph is licensed under the Open Source MIT license. That means that it's     |
    // | totally free to use and there are no restrictions on what you can do with it!  |
    // o--------------------------------------------------------------------------------o
    //

    RGraph = window.RGraph || {isRGraph: true};

    //
    // The bipolar/age frequency constructor.
    //
    RGraph.Bipolar = function (conf)
    {
        var id                        = conf.id,
            canvas                    = document.getElementById(id),
            left                      = conf.left,
            right                     = conf.right;

        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = canvas;
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'bipolar';
        this.coords            = [];
        this.coords2           = [];
        this.coordsLeft        = [];
        this.coordsRight       = [];
        this.coords2Left       = [];
        this.coords2Right      = [];
        this.max               = 0;
        this.isRGraph          = true;
        this.uid               = RGraph.createUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.createUID();
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false
        
        // The left and right data respectively. Ensure that the data is an array
        // of numbers
        var data = [left, right];
        
        for (var i=0; i<2; ++i) {
            data[i].forEach(function (v,k,arr)
            {
                if (RGraph.isNull(v)) {
                    // Nada
                } else if (typeof v === 'object') {
                    v.forEach (function (v2,k2,arr2)
                    {
                        arr[k][k2] = parseFloat(v2);
                    });
                } else {
                    arr[k] = parseFloat(v);
                }
                
                arr[k] = RGraph.stringsToNumbers(arr[k]);
            });
        }

        this.left  = left;
        this.right = right;
        this.data  = [left, right];

        this.properties =
        {
            backgroundGrid:             true,
            backgroundGridColor:        '#ddd',
            backgroundGridVlines:       true,
            backgroundGridHlines:       true,
            backgroundGridLinewidth:    1,
            backgroundGridVlinesCount:  null,
            backgroundGridHlinesCount:  null,

            xaxis:                      true,
            xaxisTickmarksCount:        5,
            xaxisTickmarksInterval:     null,
            xaxisScaleUnitsPre:         '',
            xaxisScaleUnitsPost:        '',
            xaxisScaleMax:              null,
            xaxisScaleMin:              0,
            xaxisScaleZerostart:        true,
            xaxisScaleDecimals:         null,
            xaxisScalePoint:            '.',
            xaxisScaleThousand:         ',',
            xaxisLabels:                true,
            xaxisLabelsFont:            null,
            xaxisLabelsSize:            null,
            xaxisLabelsColor:           null,
            xaxisLabelsBold:            null,
            xaxisLabelsItalic:          null,
            xaxisLabelsCount:           5,

            yaxis:                      true,
            yaxisTickmarksCount:        null,
            yaxisLabels:                [],
            yaxisLabelsFont:            null,
            yaxisLabelsSize:            null,
            yaxisLabelsColor:           null,
            yaxisLabelsBold:            null,
            yaxisLabelsItalic:          null,
            
            labelsAbove:                false,
            labelsAboveFont:            null,
            labelsAboveSize:            null,
            labelsAboveBold:            null,
            labelsAboveItalic:          null,
            labelsAboveColor:           null,
            labelsAboveUnitsPre:        '',
            labelsAboveUnitsPost:       '',
            labelsAboveDecimals:        0,
            labelsAboveFormatter:       null,
            
            textBold:                   false,
            textItalic:                 false,
            textSize:                   12,
            textColor:                  'black',
            textFont:                   'Arial, Verdana, sans-serif',
            textAccessible:             true,
            textAccessibleOverflow:     'visible',
            textAccessiblePointerevents:false,
            
            titleLeft:                  null,
            titleLeftFont:              null,
            titleLeftSize:              null,
            titleLeftBold:              null,
            titleLeftItalic:            null,
            titleLeftColor:             null,
            
            titleRight:                 null,
            titleRightFont:             null,
            titleRightSize:             null,
            titleRightBold:             null,
            titleRightItalic:           null,
            titleRightColor:            null,
            
            marginCenter:               0,
            marginCenterAuto:           true,
            marginLeft:                 25,
            marginRight:                25,
            marginTop:                  25,
            marginBottom:               30,
            marginInner:                5,
            marginInnerGrouped:         3,
            
            title:                      null,
            titleFont:                  null,
            titleSize:                  null,
            titleBold:                  null,
            titleItalic:                null,
            titleColor:                 null,
            titleBackground:            null,
            titleHpos:                  null,
            titleVpos:                  null,
            titleX:                     null,
            titleY:                     null,
            titleHalign:                null,
            titleValign:                null,


            colorsStroke:               'rgba(0,0,0,0)',
            colors:                     ['#afa','#faa','#aaf','#aff','#ffa','#faf','cyan','brown','gray','black','pink','#afa','#faa','#aaf','#aff','#ffa','#faf','cyan','brown','gray','black','pink'],
            colorsSequential:           false,

            contextmenu:                null,

            tooltips:                   null,
            tooltipsEffect:             'fade',
            tooltipsCssClass:           'RGraph_tooltip',
            tooltipsHighlight:          true,
            tooltipsEvent:              'onclick',

            highlightStroke:            'rgba(0,0,0,0)',
            highlightFill:              'rgba(255,255,255,0.7)',

            
            shadow:                     false,
            shadowColor:                '#ccc',
            shadowOffsetx:              3,
            shadowOffsety:              3,
            shadowOlur:                 3,
            
            annotatable:                false,
            annotatableColor:           'black',

            axes:                       true,
            axesColor:                  'black',
            axesLinewidth:              1,

            resizable:                  false,
            resizableHandleBackground:  null,

            eventsMousemove:            null,
            eventsClick:                null,

            linewidth:                  1,
            
            variantThreedOffsetx:       10,
            variantThreedOffsety:       5,
            variantThreedAngle:         0.1,
            
            grouping:                   'grouped',
            
            clearto:                    'rgba(0,0,0,0)'
        }

        // Pad the arrays so they're the same size
        //
        // DON'T DO THIS NOW - 3/9/17
        //while (this.left.length < this.right.length) this.left.push(null);
        //while (this.left.length > this.right.length) this.right.push(null);
        
        //
        // Set the default for the number of Y tickmarks
        //
        this.properties.yaxisTickmarksCount = this.left.length;

        


        //
        // Create the dollar objects so that functions can be added to them
        //
        var linear_data = RGraph.arrayLinearize(this.left, this.right);

        for (var i=0; i<linear_data.length; ++i) {
            this['$' + i] = {};
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
            path = RGraph.path;

        
        
        //
        // "Decorate" the object with the generic effects if the effects library has been included
        //
        if (RGraph.Effects && typeof RGraph.Effects.decorate === 'function') {
            RGraph.Effects.decorate(this);
        }








        //
        // The setter
        // 
        // @param name  string The name of the parameter to set
        // @param value mixed  The value of the paraneter
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
        // The getter
        // 
        // @param name string The name of the parameter to get
        //
        this.get = function (name)
        {
            return this.properties[name];
        };








        //
        // Draws the graph
        //
        this.draw = function ()
        {
            //
            // Fire the onbeforedraw event
            //
            RGraph.fireCustomEvent(this, 'onbeforedraw');
    
    
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
            this.marginLeft       = prop.marginLeft;
            this.marginRight      = prop.marginRight;
            this.marginTop        = prop.marginTop;
            this.marginBottom     = prop.marginBottom;
            this.marginCenter     = prop.marginCenter;
            this.marginCenterAuto = prop.marginCenterAuto;


            //
            // Autosize the center margin to allow for big labels
            //
            if (prop.marginCenterAuto && !prop.marginCenter) {
                prop.marginCenter = this.getMarginCenter();
            }

            this.marginCenter = prop.marginCenter;

    
    
            // Reset the data to what was initially supplied
            this.left  = this.data[0];
            this.right = this.data[1];

    
            //
            // Reset the coords array
            //
            this.coords       = [];
            this.coords2      = [];
            this.coordsLeft   = [];
            this.coordsRight  = [];
            this.coords2Left  = [];
            this.coords2Right = [];



            //
            // Stop this growing uncontrollably
            //
            this.coordsText = [];
            
            
            if (prop.variant === '3d') {
                if (prop.textAccessible) {
                    // Nada
                } else {
                    this.context.setTransform(1,prop.variantThreedAngle,0,1,0.5,0.5);
                }
            }



            // Some necessary variables
            this.axisWidth  = (this.canvas.width - prop.marginCenter - this.marginLeft - this.marginRight) / 2;
            this.axisHeight = this.canvas.height - this.marginTop - this.marginBottom;


            // Reset the sequential index
            this.sequentialFullIndex = 0;



            this.getMax();
            this.drawBackgroundGrid();
            this.draw3DAxes();
            this.drawAxes();
            this.drawTicks();                
            this.drawLeftBars();
            this.drawRightBars();

            // Redraw the bars so that shadows on not on top
            this.drawLeftBars({shadow: false});
            this.drawRightBars({shadow: false});


            this.drawAxes();
    
            this.drawLabels();
            this.drawTitles();
    
    
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
        // Draws the axes
        //
        this.draw3DAxes = function ()
        {
            if (prop.variant === '3d') {
                var offsetx = prop.variantThreedOffsetx,
                    offsety = prop.variantThreedOffsety;
    
                // Set the linewidth
                this.context.lineWidth = prop.axesLinewidth + 0.001;
    
        
                // Draw the left set of axes
                this.context.beginPath();
                this.context.strokeStyle = prop.axesColor;
                
                // Draw the horizontal 3d axis
                // The left horizontal axis
                path(this.context,
                    'b m % % l % % l % % l % % s #aaa f #ddd',
                    this.marginLeft, this.canvas.height - this.marginBottom,
                    this.marginLeft + offsetx, this.canvas.height - this.marginBottom - offsety,
                    this.marginLeft + offsetx + this.axisWidth, this.canvas.height - this.marginBottom - offsety,
                    this.marginLeft + this.axisWidth, this.canvas.height - this.marginBottom
                );
                
                // The left vertical axis
                this.draw3DLeftVerticalAxis();
                
                
                
                
                // Draw the right horizontal axes
                path(this.context,
                    'b m % % l % % l % % l % % s #aaa f #ddd',
                    this.marginLeft + this.marginCenter + this.axisWidth, this.canvas.height - this.marginBottom,
                    this.marginLeft + this.marginCenter + this.axisWidth + offsetx, this.canvas.height - this.marginBottom - offsety,
                    this.marginLeft + this.marginCenter + this.axisWidth + this.axisWidth + offsetx, this.canvas.height - this.marginBottom - offsety,
                    this.marginLeft + this.marginCenter + this.axisWidth + this.axisWidth, this.canvas.height - this.marginBottom
                );
                
                
                
                
                // Draw the right vertical axes
                path(this.context,
                    'b m % % l % % l % % l % % s #aaa f #ddd',
                    this.marginLeft + this.marginCenter + this.axisWidth, this.canvas.height - this.marginBottom,
                    this.marginLeft + this.marginCenter + this.axisWidth, this.canvas.height - this.marginBottom - this.axisHeight,
                    this.marginLeft + this.marginCenter + this.axisWidth + offsetx, this.canvas.height - this.marginBottom - this.axisHeight - offsety,
                    this.marginLeft + this.marginCenter + this.axisWidth + offsetx, this.canvas.height - this.marginBottom - offsety
                );
            }
        }








        //
        // Redraws the left vertical axis
        //
        this.draw3DLeftVerticalAxis = function ()
        {
            if (prop.variant === '3d') {
                var offsetx = prop.variantThreedOffsetx,
                    offsety = prop.variantThreedOffsety;
    
                // The left vertical axis
                path(this.context,
                    'b m % % l % % l % % l % % s #aaa f #ddd',
                    this.marginLeft + this.axisWidth, this.marginTop,
                    this.marginLeft + this.axisWidth + offsetx, this.marginTop - offsety,
                    this.marginLeft + this.axisWidth + offsetx, this.canvas.height - this.marginBottom - offsety,
                    this.marginLeft + this.axisWidth, this.canvas.height - this.marginBottom
                );
            }
        };








        //
        // Draws the axes
        //
        this.drawAxes = function ()
        {
            // Set the linewidth
            this.context.lineWidth = prop.axesLinewidth + 0.001;

    
            // Draw the left set of axes
            this.context.beginPath();
            this.context.strokeStyle = prop.axesColor;
    
            this.axisWidth  = (this.canvas.width - prop.marginCenter - this.marginLeft - this.marginRight) / 2;
            this.axisHeight = this.canvas.height - this.marginTop - this.marginBottom;
            
            
            // This must be here so that the two above variables are calculated
            if (!prop.axes) {
                return;
            }
    
            if (prop.xaxis) {
                this.context.moveTo(this.marginLeft, this.canvas.height - this.marginBottom);
                this.context.lineTo(this.marginLeft + this.axisWidth, this.canvas.height - this.marginBottom);
            }
            
            if (prop.yaxis) {
                this.context.moveTo(this.marginLeft + this.axisWidth, this.canvas.height - this.marginBottom);
                this.context.lineTo(this.marginLeft + this.axisWidth, this.marginTop);
            }
            
            this.context.stroke();
    
    
            // Draw the right set of axes
            this.context.beginPath();
    
            var x = this.marginLeft + this.axisWidth + prop.marginCenter;
            
            if (prop.yaxis) {
                this.context.moveTo(x, this.marginTop);
                this.context.lineTo(x, this.canvas.height - this.marginBottom);
            }
            
            if (prop.xaxis) {
                this.context.moveTo(x, this.canvas.height - this.marginBottom);
                this.context.lineTo(this.canvas.width - this.marginRight, this.canvas.height - this.marginBottom);
            }
    
            this.context.stroke();
        };








        //
        // Draws the tick marks on the axes
        //
        this.drawTicks = function ()
        {
            // Set the linewidth
            this.context.lineWidth = prop.axesLinewidth + 0.001;
    
            var numDataPoints = this.left.length;
            var barHeight     = ( (this.canvas.height - this.marginTop - this.marginBottom)- (this.left.length * (prop.marginInner * 2) )) / numDataPoints;
    
            // Store this for later
            this.barHeight = barHeight;
    
            // If no axes - no tickmarks
            if (!prop.axes) {
                return;
            }
    
            // Draw the left Y tick marks
            if (prop.yaxis && prop.yaxisTickmarksCount > 0) {
                this.context.beginPath();
                    for (var i=0; i<prop.yaxisTickmarksCount; ++i) {
                        var y = prop.marginTop + (((this.canvas.height - this.marginTop - this.marginBottom) / prop.yaxisTickmarksCount) * i);
                        this.context.moveTo(this.marginLeft + this.axisWidth , y);
                        this.context.lineTo(this.marginLeft + this.axisWidth + 3, y);
                    }
                this.context.stroke();


                //Draw the right axis Y tick marks
                this.context.beginPath();
                    for (var i=0; i<prop.yaxisTickmarksCount; ++i) {
                        var y = prop.marginTop + (((this.canvas.height - this.marginTop - this.marginBottom) / prop.yaxisTickmarksCount) * i);
                        this.context.moveTo(this.marginLeft + this.axisWidth + prop.marginCenter, y);
                        this.context.lineTo(this.marginLeft + this.axisWidth + prop.marginCenter - 3, y);
                    }
                this.context.stroke();




                // Draw an exra tick if the Y axis isn't being shown
                // on each of the sides
                if (!prop.xaxis) {
                    path(
                        this.context,
                        'b m % % l % % s %',
                        this.marginLeft + this.axisWidth,
                        this.canvas.height - this.marginBottom,
                        this.marginLeft + this.axisWidth + 4,
                        (this.canvas.height - this.marginBottom),
                        this.context.strokeStyle
                    );

                    path({
                        context: this.context,
                        path: 'b m % % l % % s %',
                        args: [
                            this.marginLeft + this.axisWidth + prop.marginCenter, this.canvas.height - this.marginBottom,
                            this.marginLeft + this.axisWidth + prop.marginCenter - 4, this.canvas.height - this.marginBottom,
                            this.context.strokeStyle
                        ]
                    });
                }
            }
            
            
            
            //
            // X tickmarks
            //
            if (prop.xaxis && prop.xaxisTickmarksCount > 0) {
                var xInterval = this.axisWidth / prop.xaxisTickmarksCount;
        
                // Is xaxisTickmarksInterval specified ? If so, use that.
                if (typeof(prop.xaxisTickmarksInterval) == 'number') {
                    xInterval = prop.xaxisTickmarksInterval;
                }
        
                
                // Draw the left sides X tick marks
                for (i=this.marginLeft; i<(this.marginLeft + this.axisWidth); i+=xInterval) {
                    this.context.beginPath();
                    this.context.moveTo(i, this.canvas.height - this.marginBottom);
                    this.context.lineTo(i, (this.canvas.height - this.marginBottom) + 4);
                    this.context.closePath();
                    
                    this.context.stroke();
                }
        
                // Draw the right sides X tick marks
                var stoppingPoint = this.canvas.width - this.marginRight;
        
                for (i=(this.marginLeft + this.axisWidth + prop.marginCenter + xInterval); i<=stoppingPoint; i+=xInterval) {
                    this.context.beginPath();
                        this.context.moveTo(i, this.canvas.height - this.marginBottom);
                        this.context.lineTo(i, (this.canvas.height - this.marginBottom) + 4);
                    this.context.closePath();
                    this.context.stroke();
                }
                
                
                // Draw an exra tick if the Y axis isn't being shown
                // on each of the sides
                if (!prop.yaxis) {
                    path(
                        this.context,
                        'b m % % l % % s %',
                        this.marginLeft + this.axisWidth,
                        this.canvas.height - this.marginBottom,
                        this.marginLeft + this.axisWidth,
                        (this.canvas.height - this.marginBottom) + 4,
                        this.context.strokeStyle
                    );

                    path(
                        this.context,
                        'b m % % l % % s %',
                        this.marginLeft + this.axisWidth + prop.marginCenter,
                        this.canvas.height - this.marginBottom,
                        this.marginLeft + this.axisWidth + prop.marginCenter,
                        (this.canvas.height - this.marginBottom) + 4,
                        this.context.strokeStyle
                    );
                }
            }
        };








        //
        // Figures out the maximum value, or if defined, uses xaxisScaleMax
        //
        this.getMax = function()
        {
            var dec  = prop.xaxisScaleDecimals;
            
            // xaxisScaleMax defined
            if (prop.xaxisScaleMax) {
    
                var max = prop.xaxisScaleMax;
                var min = prop.xaxisScaleMin;

                this.scale2 = RGraph.getScale2(this, {
                    'scale.max':          max,
                    'scale.min':          min,
                    'scale.strict':       true,
                    'scale.thousand':     prop.xaxisScaleThousand,
                    'scale.point':        prop.xaxisScalePoint,
                    'scale.decimals':     prop.xaxisScaleDecimals,
                    'scale.labels.count': prop.xaxisLabelsCount,
                    'scale.round':        prop.xaxisScaleRound,
                    'scale.units.pre':    prop.xaxisScaleUnitsPre,
                    'scale.units.post':   prop.xaxisScaleUnitsPost
                });

                this.max = this.scale2.max;
                this.min = this.scale2.min;

    
            //
            // Generate the scale ourselves
            //
            } else {

                var max = 1;

                // Work out the max value for the left hand side
                for (var i=0; i<this.left.length; ++i) {
                    if (typeof this.left[i] === 'number') {
                        max = Math.max(max, this.left[i]);
                    } else if (RGraph.isNull(this.left[i])) {
                        // Nada
                    } else {
                        max = Math.max(max, prop.grouping === 'stacked' ? RGraph.arraySum(this.left[i]) : RGraph.arrayMax(this.left[i]));
                    }
                }

                // Work out the max value for the right hand side
                for (var i=0; i<this.right.length; ++i) {
                    if (typeof this.right[i] === 'number') {
                        max = Math.max(max, this.right[i]);
                    } else if (RGraph.isNull(this.right[i])) {
                        // Nada
                    } else {
                        max = Math.max(max, prop.grouping === 'stacked' ? RGraph.arraySum(this.right[i]) : RGraph.arrayMax(this.right[i]));
                    }
                }

                this.scale2 = RGraph.getScale2(this, {
                    'scale.max':          max,
                    'scale.min':          prop.xaxisScaleMin,
                    'scale.thousand':     prop.xaxisScaleThousand,
                    'scale.point':        prop.xaxisScalePoint,
                    'scale.decimals':     prop.xaxisScaleDecimals,
                    'scale.labels.count': prop.xaxisLabelsCount,
                    'scale.round':        prop.xaxisScaleRound,
                    'scale.units.pre':    prop.xaxisScaleUnitsPre,
                    'scale.units.post':   prop.xaxisScaleUnitsPost
                });
    

                this.max = this.scale2.max;
                this.min = this.scale2.min;
            }
    
            // Don't need to return it as it is stored in this.max
        };








        // Function to draw the left hand bars
        this.drawLeftBars = function ()
        {
            var opt = {};

            if (typeof arguments[0] === 'object') {
                opt.shadow = arguments[0].shadow;
            } else {
                opt.shadow = true;
            }

            var offsetx = prop.variantThreedOffsetx,
                offsety = prop.variantThreedOffsety;

            // Set the stroke colour
            this.context.strokeStyle = prop.colorsStroke;
            
            // Set the linewidth
            this.context.lineWidth = prop.linewidth;
    
            for (var i=0,sequentialColorIndex=0; i<this.left.length; ++i) {

                //
                // Turn on a shadow if requested
                //
                if (prop.shadow && prop.variant !== '3d' && opt.shadow) {
                    RGraph.setShadow({
                        object: this,
                        prefix: 'shadow'
                    });
                }



                if (typeof this.left[i] === 'number') {

                    // If colorsSequential is specified - handle that
                    // ** There's another instance of this further down **
                    if (prop.colorsSequential) {
                        this.context.fillStyle = prop.colors[sequentialColorIndex];
                    } else {
                        this.context.fillStyle = prop.colors[0];
                    
                        // If there's only two colors then use them in the format of
                        // one for each side. This facilitates easy coloring.
                        if (prop.colors.length === 2) {
                            this.context.fillStyle = prop.colors[0];
                        }
                    }
    
    
    
    
                    //
                    // Work out the coordinates
                    //
                    var width = (( (this.left[i] - this.min) / (this.max - this.min)) *  this.axisWidth);
    
                    var coords = [
                        this.marginLeft + this.axisWidth - width,
                        this.marginTop + (i * ( this.axisHeight / this.left.length)) + prop.marginInner,
                        width,
                        this.barHeight
                    ];
        
                    
                    if (this.left[i] !== null) {
                        this.context.strokeRect(
                            coords[0],
                            coords[1],
                            coords[2],
                            coords[3]
                        );
                        
                        this.context.fillRect(
                            coords[0],
                            coords[1],
                            coords[2],
                            coords[3]
                        );
                    }


                    // Draw the 3D sides if required
                    if (prop.variant === '3d' && this.left[i] !== null) {
    
                        // If the shadow is enabled draw the backface for
                        // (that we don't actually see
                        if (prop.shadow && opt.shadow) {
    
                            this.context.shadowColor   = prop.shadowColor;
                            this.context.shadowBlur    = prop.shadowBlur;
                            this.context.shadowOffsetX = prop.shadowOffsetx;
                            this.context.shadowOffsetY = prop.shadowOffsety;
    
    
                            path(this.context,
                                'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                coords[0] + offsetx, coords[1] - offsety,
                                coords[0] + offsetx + coords[2], coords[1] - offsety,
                                coords[0] + offsetx + coords[2], coords[1] - offsety + coords[3],
                                coords[0] + offsetx,coords[1] - offsety + coords[3]
                            );
                        }
    
    
    
                        // If colorsSequential is specified - handle that (again)
                        //
                        // ** There's another instance of this further up **
                        if (prop.colorsSequential) {
                            this.context.fillStyle = prop.colors[i];
        
                        } else {
                            this.context.fillStyle = prop.colors[0];
                        }
    
                        path(this.context,
                            'b m % % l % % l % % l % % f %',
                            coords[0],coords[1],
                            coords[0] + offsetx, coords[1] - offsety,
                            coords[0] + offsetx + coords[2], coords[1] - offsety,
                            coords[0] + coords[2], coords[1]
                        );

                        path(this.context,
                            'b m % % l % % l % % l % % f rgba(255,255,255,0.4)',
                            coords[0],coords[1],
                            coords[0] + offsetx, coords[1] - offsety,
                            coords[0] + offsetx + coords[2], coords[1] - offsety,
                            coords[0] + coords[2], coords[1]
                        );
                    }
                    
                    // Only store coordinates if this isn't a shadow iteration
                    if (!opt.shadow) {

                        // Add the coordinates to the coords array
                        this.coords.push([
                            coords[0],
                            coords[1],
                            coords[2],
                            coords[3]
                        ]);
                        
                        this.coordsLeft.push([
                            coords[0],
                            coords[1],
                            coords[2],
                            coords[3]
                        ]);
                    }
                    
                    sequentialColorIndex++;








                // A stacked Bipolar chart
                } else if (typeof this.left[i] === 'object' && prop.grouping === 'stacked') {

                    for (var j=0,accumulatedWidth=0; j<this.left[i].length; ++j) {

                        // If colorsSequential is specified - handle that
                        // ** There's another instance of this further down **
                        if (prop.colorsSequential) {
                            this.context.fillStyle = prop.colors[sequentialColorIndex];
        
                        } else {
                            this.context.fillStyle = prop.colors[j];
                        }

    
    
    
                        //
                        // Work out the coordinates
                        //
                        var value         = this.left[i][j],
                            min           = this.min,
                            max           = this.max,
                            margin        = prop.marginInner,

                            width         = (( (value - min) / (max - min)) *  this.axisWidth),
                            sectionHeight = (this.axisHeight / this.left.length),
                            height        = (sectionHeight - (2 * margin)),
                            x             = this.marginLeft + this.axisWidth - width - accumulatedWidth,
                            y             = this.marginTop + margin + (i * sectionHeight);

                        accumulatedWidth += width;


                        if (this.left[i] !== null) {
                            this.context.strokeRect(x, y, width, height);
                            this.context.fillRect(x, y, width, height);
                        }




                        // Draw the 3D sides if required =========================
                        if (prop.variant === '3d' && this.left[i] !== null) {
                        
                            // If the shadow is enabled draw the backface for
                            // (that we don't actually see
                            if (prop.shadow && opt.shadow) {
                        
                                this.context.shadowColor   = prop.shadowColor;
                                this.context.shadowBlur    = prop.shadowBlur;
                                this.context.shadowOffsetX = prop.shadowOffsetx;
                                this.context.shadowOffsetY = prop.shadowOffsety;
                        
                        
                                path(this.context,
                                    'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                    x + offsetx, y - offsety,
                                    x + offsetx + width, y - offsety,
                                    x + offsetx + width, y - offsety + height,
                                    x + offsetx,y - offsety + height
                                );
                            }
                        
                        
                        
                            // If colorsSequential is specified - handle that (again)
                            //
                            // ** There's another instance of this further up **
                            if (prop.colorsSequential) {
                                this.context.fillStyle = prop.colors[sequentialColorIndex];
                            } else {
                                this.context.fillStyle = prop.colors[j];
                            }
                        
                            // Top side
                            path(this.context,
                                'b m % % l % % l % % l % % f %',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        
                            // top side again (to lighten it)
                            path(this.context,
                                'b m % % l % % l % % l % % f rgba(255,255,255,0.4)',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        }
                        // ===== 3D ==========================================



                        // Only store coordinates if this isn't a shadow iteration
                        if (!opt.shadow) {
                        
                            //
                            // Add the coordinates to the coords arrays
                            //



                            // The .coords array
                            this.coords.push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            // The .coordsLeft array
                            this.coordsLeft.push([
                                x,
                                y,
                                width,
                                height
                            ]);
    
    
    
                            // The .coords2 array
                            if (!RGraph.isArray(this.coords2[i])) {
                                this.coords2[i] = [];
                            }
    
                            this.coords2[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            // The .coords2Left array
                            if (!RGraph.isArray(this.coords2Left[i])) {
                                this.coords2Left[i] = [];
                            }
    
                            this.coords2Left[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);
                        }

                        sequentialColorIndex++;
                    }
                // A grouped Bipolar chart - and this is also the default
                } else if (typeof this.left[i] === 'object' && !RGraph.isNull(this.left[i])) {

                    for (var j=0; j<this.left[i].length; ++j) {

                        // If colorsSequential is specified - handle that
                        // ** There's another instance of this further down **
                        if (prop.colorsSequential) {
                            this.context.fillStyle = prop.colors[sequentialColorIndex];

                        } else {
                            this.context.fillStyle = prop.colors[j];
                        }




                        //
                        // Work out the coordinates
                        //
                        var value         = this.left[i][j],
                            min           = this.min,
                            max           = this.max,
                            margin        = prop.marginInner,
                            marginGrouped = prop.marginInnerGrouped,

                            width         = (( (value - min) / (max - min)) *  this.axisWidth),
                            sectionHeight = (this.axisHeight / this.left.length),
                            height        = (sectionHeight - (2 * margin) - ( (this.left[i].length - 1) * marginGrouped)) / this.left[i].length,
                            x             = this.marginLeft + this.axisWidth - width,
                            y             = this.marginTop + margin + (i * sectionHeight) + (height * j) + (j * marginGrouped);


                        if (this.left[i] !== null) {
                            this.context.strokeRect(x, y, width, height);
                            this.context.fillRect(x, y, width, height);
                        }



                        // Draw the 3D sides if required
                        if (prop.variant === '3d' && this.left[i] !== null) {
                        
                            // If the shadow is enabled draw the backface for
                            // (that we don't actually see
                            if (prop.shadow && opt.shadow) {
                        
                                this.context.shadowColor   = prop.shadowColor;
                                this.context.shadowBlur    = prop.shadowBlur;
                                this.context.shadowOffsetX = prop.shadowOffsetx;
                                this.context.shadowOffsetY = prop.shadowOffsety;
                        
                        
                                path(this.context,
                                    'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                    x + offsetx, y - offsety,
                                    x + offsetx + width, y - offsety,
                                    x + offsetx + width, y - offsety + height,
                                    x + offsetx,y - offsety + height
                                );
                            }
                        
                        
                        
                            // If colorsSequential is specified - handle that (again)
                            //
                            // ** There's another instance of this further up **
                            if (prop.colorsSequential) {
                                this.context.fillStyle = prop.colors[sequentialColorIndex];
                            } else {
                                this.context.fillStyle = prop.colors[j];
                            }
                        
                            // Top side
                            path(this.context,
                                'b m % % l % % l % % l % % f %',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        
                            // top side again (to lighten it)
                            path(this.context,
                                'b m % % l % % l % % l % % f rgba(255,255,255,0.4)',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        }



                        // Only store coordinates if this isn't a shadow iteration
                        if (!opt.shadow) {



                            // Add the coordinates to the coords arrays
                            this.coords.push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            this.coordsLeft.push([
                                x,
                                y,
                                width,
                                height
                            ]);
    
    
    
                            if (!RGraph.isArray(this.coords2[i])) {
                                this.coords2[i] = [];
                            }
    
                            this.coords2[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);
    
    
    
                            if (!RGraph.isArray(this.coords2Left[i])) {
                                this.coords2Left[i] = [];
                            }
    
                            this.coords2Left[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);
                        }
                        
                        sequentialColorIndex++;
                    }
                }
                
                
                
                // Now draw the left vertical axis again so that it appears
                // over the bars
                this.draw3DLeftVerticalAxis();
            }
    
            //
            // Turn off any shadow
            //
            RGraph.noShadow(this);
            
            // Reset the linewidth
            this.context.lineWidth = 1;
        };








        //
        // Function to draw the right hand bars
        //
        this.drawRightBars = function ()
        {
            var opt = {};
            
            if (typeof arguments[0] === 'object') {
                opt.shadow = arguments[0].shadow;
            } else {
                opt.shadow = true;
            }

            var offsetx = prop.variantThreedOffsetx,
                offsety = prop.variantThreedOffsety;




            // Set the stroke colour
            this.context.strokeStyle = prop.colorsStroke;
            
            // Set the linewidth
            this.context.lineWidth = prop.linewidth;
                
            //
            // Turn on a shadow if requested
            //
            if (prop.shadow && prop.variant !== '3d' && opt.shadow) {
                this.context.shadowColor   = prop.shadowColor;
                this.context.shadowBlur    = prop.shadowBlur;
                this.context.shadowOffsetX = prop.shadowOffsetx;
                this.context.shadowOffsetY = prop.shadowOffsety;
            }

            for (var i=0,sequentialColorIndex=RGraph.arrayLinearize(this.left).length; i<this.right.length; ++i) {

                if (typeof this.right[i] === 'number') {
                        // If colorsSequential is specified - handle that
                        if (prop.colorsSequential) {
                            this.context.fillStyle = prop.colors[sequentialColorIndex];
                        } else {
                            this.context.fillStyle = prop.colors[0];

                            // If there's only two colors then use them in the format of
                            // one for each side. This facilitates easy coloring.
                            if (prop.colors.length === 2) {
                                this.context.fillStyle = prop.colors[1];
                            }
                        }
        
            
                        var width = (((this.right[i] - this.min) / (this.max - this.min)) * this.axisWidth);
        
                        var coords = [
                            this.marginLeft + this.axisWidth + prop.marginCenter,
                            prop.marginInner + (i * (this.axisHeight / this.right.length)) + this.marginTop,
                            width,
                            this.barHeight
                        ];

        
                        if (this.right[i] !== null) {
                            this.context.strokeRect(
                                coords[0],
                                coords[1],
                                coords[2],
                                coords[3]
                            );
                            this.context.fillRect(
                                coords[0],
                                coords[1],
                                coords[2],
                                coords[3]
                            );
                        }
        
        
        
        
        
        
        
        
        
        
        
        
        
                        // Draw the 3D sides if required
                        if (prop.variant === '3d' && this.right[i] !== null) {
        
                            var color = this.context.fillStyle;
                            
        
                            // If the shadow is enabled draw the backface for
                            // (that we don't actually see
                            if (prop.shadow && opt.shadow) {
        
                                this.context.shadowColor   = prop.shadowColor;
                                this.context.shadowBlur    = prop.shadowBlur;
                                this.context.shadowOffsetX = prop.shadowOffsetx;
                                this.context.shadowOffsetY = prop.shadowOffsety;
        
                                path(this.context,
                                    'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                    coords[0] + offsetx, coords[1] - offsety,
                                    coords[0] + offsetx + coords[2], coords[1] - offsety,
                                    coords[0] + offsetx + coords[2], coords[1] - offsety + coords[3],
                                    coords[0] + offsetx,coords[1] - offsety + coords[3]
                                );
                            }
        
                            // Draw the top
                            path(this.context,
                                'b m % % l % % l % % l % % f %',
                                coords[0],coords[1],
                                coords[0] + offsetx, coords[1] - offsety,
                                coords[0] + offsetx + coords[2], coords[1] - offsety,
                                coords[0] + coords[2], coords[1],
                                color
                            );
        
        
                            // Draw the right hand side
                            path(this.context,
                                'b m % % l % % l % % l % % f %',
                                coords[0] + coords[2],coords[1],
                                coords[0] + coords[2] + offsetx, coords[1] - offsety,
                                coords[0] + coords[2] + offsetx, coords[1] - offsety + coords[3],
                                coords[0] + coords[2],coords[1] + coords[3],
                                color
                            );
        
                            // Draw the LIGHTER top
                            path(this.context,
                                'b m % % l % % l % % l % % f rgba(255,255,255,0.6)',
                                coords[0],coords[1],
                                coords[0] + offsetx, coords[1] - offsety,
                                coords[0] + offsetx + coords[2], coords[1] - offsety,
                                coords[0] + coords[2], coords[1]
                            );
        
        
                            // Draw the DARKER right hand side
                            path(this.context,
                                'b m % % l % % l % % l % % f rgba(0,0,0,0.3)',
                                coords[0] + coords[2],coords[1],
                                coords[0] + coords[2] + offsetx, coords[1] - offsety,
                                coords[0] + coords[2] + offsetx, coords[1] - offsety + coords[3],
                                coords[0] + coords[2],coords[1] + coords[3]
                            );
                        }
        
        
        
        
        
        
        
        
        
        
        
        
                        // Only store coordinates if this isn't a shadow iteration
                        if (!opt.shadow) {

                            //
                            // Add the coordinates to the coords array
                            //
                            
                            // The .coords array
                            this.coords.push([
                                coords[0],
                                coords[1],
                                coords[2],
                                coords[3]
                            ]);
                            
                            // The .coordsRight array
                            this.coordsRight.push([
                                coords[0],
                                coords[1],
                                coords[2],
                                coords[3]
                            ]);
                        }
                    
                    // Does this need to be here?
                    sequentialColorIndex++;







                // A stacked Bipolar chart
                } else if (typeof this.left === 'object' && prop.grouping === 'stacked') {

                    for (var j=0,accumulatedWidth=0; j<this.right[i].length; ++j) {

                        // If colorsSequential is specified - handle that
                        // ** There's another instance of this further down **
                        if (prop.colorsSequential) {
                            this.context.fillStyle = prop.colors[sequentialColorIndex];
        
                        } else {
                            this.context.fillStyle = prop.colors[j];
                        }

    
    
    
                        //
                        // Work out the coordinates
                        //
                        var value         = this.right[i][j],
                            min           = this.min,
                            max           = this.max,
                            margin        = prop.marginInner,

                            width         = (( (value - min) / (max - min)) *  this.axisWidth),
                            sectionHeight = (this.axisHeight / this.right.length),
                            height        = (sectionHeight - (2 * margin)),
                            x             = this.marginLeft + this.axisWidth +prop.marginCenter + accumulatedWidth,
                            y             = this.marginTop + margin + (i * sectionHeight);

                        accumulatedWidth += width;


                        if (this.right[i] !== null) {
                            this.context.strokeRect(x, y, width, height);
                            this.context.fillRect(x, y, width, height);
                        }



                        // Draw the 3D sides if required
                        if (prop.variant === '3d' && this.right[i] !== null) {
                        
                            var color = this.context.fillStyle;
                            
                        
                            // If the shadow is enabled draw the backface for
                            // (that we don't actually see
                            if (prop.shadow && opt.shadow) {
                            
                                RGraph.setShadow({
                                    object: this,
                                    prefix: 'shadow'
                                });
                        
                                path(this.context,
                                    'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                    x + offsetx, y - offsety,
                                    x + offsetx + width, y - offsety,
                                    x + offsetx + width, y - offsety + height,
                                    x + offsetx, y - offsety + height
                                );
                            }
                        
                            // Draw the top
                            path(this.context,
                                'b m % % l % % l % % l % % f %',
                                x, y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y,
                                color
                            );
                        
                        
                            // Draw the right hand side - but only
                            // if this the most right hand side segment
                            if (j === (this.right[i].length - 1)) {
                                path(this.context,
                                    'b m % % l % % l % % l % % f %',
                                    x + width,y,
                                    x + width + offsetx, y - offsety,
                                    x + width + offsetx, y - offsety + height,
                                    x + width,y + height,
                                    color
                                );

                                // Draw the DARKER right hand side
                                path(this.context,
                                    'b m % % l % % l % % l % % f rgba(0,0,0,0.3)',
                                    x + width,y,
                                    x + width + offsetx, y - offsety,
                                    x + width + offsetx, y - offsety + height,
                                    x + width,y + height
                                );
                            }
                        
                            // Draw the LIGHTER top
                            path(this.context,
                                'b m % % l % % l % % l % % f rgba(255,255,255,0.6)',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        }


                        // Only store coordinates if this isn't a shadow iteration
                        if (!opt.shadow) {
                            
                            // Add the coordinates to the coords arrays
                            this.coords.push([
                                x,
                                y,
                                width,
                                height
                            ]);



                           // The .coords2 array
                            if (!RGraph.isArray(this.coords2[sequentialColorIndex])) {
                                this.coords2[sequentialColorIndex] = [];
                            }

                            this.coords2[sequentialColorIndex].push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            this.coordsRight.push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            // The .coords2Right array
                            if (!RGraph.isArray(this.coords2Right[i])) {
                                this.coords2Right[i] = [];
                            }
    
                            this.coords2Right[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);
                        }
                        
                        sequentialColorIndex++;
                    }








                // Draw a grouped Bipolar chart, this is also the default
                } else if (typeof this.right[i] === 'object') {

                    for (var j=0; j<this.right[i].length; ++j) {

                        // If colorsSequential is specified - handle that
                        // ** There's another instance of this further down **
                        if (prop.colorsSequential) {
                            this.context.fillStyle = prop.colors[sequentialColorIndex];

                        } else {
                            this.context.fillStyle = prop.colors[j];
                        }

    
    
    
                        //
                        // Work out the coordinates
                        //

                        var value         = this.right[i][j],
                            min           = this.min,
                            max           = this.max,
                            margin        = prop.marginInner,
                            marginGrouped = prop.marginInnerGrouped,

                            width         = ( (value - min) / (max - min)) *  this.axisWidth,
                            sectionHeight = (this.axisHeight / this.right.length),
                            height        = (sectionHeight - (2 * margin) - ( (this.right[i].length - 1) * marginGrouped)) / this.right[i].length,
                            x             = this.marginLeft + this.axisWidth + prop.marginCenter,
                            y             = this.marginTop + margin + (i * sectionHeight) + (height * j) + (j * marginGrouped);


                        if (this.right[i] !== null) {
                            this.context.strokeRect(x, y, width, height);
                            this.context.fillRect(x, y, width, height);
                        }













                        // Only store coordinates if this isn't a shadow iteration
                        if (!opt.shadow) {



                            // Add the coordinates to the coords arrays
                            this.coords.push([
                                x,
                                y,
                                width,
                                height
                            ]);
                            



                            this.coordsRight.push([
                                x,
                                y,
                                width,
                                height
                            ]);



                           // The .coords2 array
                            if (!RGraph.isArray(this.coords2[this.left.length + i])) {
                                this.coords2[this.left.length + i] = [];
                            }
    
                            this.coords2[this.left.length + i].push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            if (!RGraph.isArray(this.coords2Right[i])) {
                                this.coords2Right[i] = [];
                            }

                            this.coords2Right[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);
                        }
                        
                        sequentialColorIndex++;

















                        // Draw the 3D sides if required
                        if (prop.variant === '3d' && this.right[i] !== null) {
                        
                            var color = this.context.fillStyle;
                            
                        
                            // If the shadow is enabled draw the backface for
                            // (that we don't actually see
                            if (prop.shadow && opt.shadow) {
                        
                                this.context.shadowColor   = prop.shadowColor;
                                this.context.shadowBlur    = prop.shadowBlur;
                                this.context.shadowOffsetX = prop.shadowOffsetx;
                                this.context.shadowOffsetY = prop.shadowOffsety;
                        
                                path(this.context,
                                    'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                    x + offsetx, y - offsety,
                                    x + offsetx + width, y - offsety,
                                    x + offsetx + width, y - offsety + height,
                                    x + offsetx, y - offsety + height
                                );
                            }
                        
                            // Draw the top
                            path(this.context,
                                'b m % % l % % l % % l % % f %',
                                x, y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y,
                                color
                            );
                        
                        
                            // Draw the right hand side
                            path(this.context,
                                'b m % % l % % l % % l % % f %',
                                x + width,y,
                                x + width + offsetx, y - offsety,
                                x + width + offsetx, y - offsety + height,
                                x + width,y + height,
                                color
                            );
                        
                            // Draw the LIGHTER top
                            path(this.context,
                                'b m % % l % % l % % l % % f rgba(255,255,255,0.6)',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        
                        
                            // Draw the DARKER right hand side
                            path(this.context,
                                'b m % % l % % l % % l % % f rgba(0,0,0,0.3)',
                                x + width,y,
                                x + width + offsetx, y - offsety,
                                x + width + offsetx, y - offsety + height,
                                x + width,y + height
                            );
                        }
                    }
                }
            }









            //
            // Turn off any shadow
            //
            RGraph.noShadow(this);
            
            // Reset the linewidth
            this.context.lineWidth = 1;
        };








        //
        // Draws the titles
        //
        this.drawLabels = function ()
        {
            var labels        = prop.yaxisLabels,
                barAreaHeight = this.canvas.height - this.marginTop - this.marginBottom
                
                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'yaxisLabels'
                });

            this.context.fillStyle = textConf.color;

            for (var i=0,len=labels.length; i<len; ++i) {
                RGraph.text({

                    object: this,
                    
                    color:  textConf.color,
                    font:   textConf.font,
                    size:   textConf.size,
                    bold:   textConf.bold,
                    italic: textConf.italic,
                    
                    x:      this.marginLeft + this.axisWidth + (prop.marginCenter / 2),
                    y:      this.marginTop + ((barAreaHeight / labels.length) * (i)) + ((barAreaHeight / labels.length) / 2),
                    text:   String(labels[i] ? String(labels[i]) : ''),
                    halign: 'center',
                    valign: 'center',
                    marker: false,
                    tag:    'labels'
                });
            }



            this.context.fillStyle = prop.textColor;



            if (prop.xaxisLabels) {

                // Determine a ew things
                var grapharea = (this.canvas.width - prop.marginCenter - this.marginLeft - this.marginRight) / 2;
                
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'xaxisLabels'
                });

                // Now draw the X labels for the left hand side
                for (var i=0; i<this.scale2.labels.length; ++i) {
                    RGraph.text({
                    
                        object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      this.marginLeft + ((grapharea / this.scale2.labels.length) * i),
                        y:      this.canvas.height - this.marginBottom + 3,
                        text:   typeof prop.xaxisScaleFormatter === 'function' ? (prop.xaxisScaleFormatter)(this, this.scale2.values[this.scale2.values.length - i - 1]) : this.scale2.labels[this.scale2.labels.length - i - 1],
                        valign: 'top',
                        halign: 'center',
                        tag:    'scale'
                    });




                    // Draw the scale for the right hand side
                    RGraph.text({
                    
                        object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      this.marginLeft+ grapharea + prop.marginCenter + ((grapharea / this.scale2.labels.length) * (i + 1)),
                        y:      this.canvas.height - this.marginBottom + 3,
                        text:   this.scale2.labels[i],
                        text:   typeof prop.xaxisScaleFormatter === 'function' ? (prop.xaxisScaleFormatter)(this, this.scale2.values[i]) : this.scale2.labels[i],
                        valign: 'top',
                        halign: 'center',
                        tag:    'scale'
                    });
                }




                // Draw zero?
                if (prop.xaxisScaleZerostart) {
                    RGraph.text({
                    
                        object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      this.marginLeft + this.axisWidth,
                        y:      this.canvas.height - this.marginBottom + 3,
                        text:   typeof prop.xaxisScaleFormatter === 'function' ? (prop.xaxisScaleFormatter)(this, 0) : RGraph.numberFormat({
                            object:    this,
                            number:    (0).toFixed(prop.xaxisScaleDecimals),
                            unitspre:  prop.xaxisScaleUnitsPre,
                            unitspost: prop.xaxisScaleUnitsPost
                        }),
                        valign: 'top',
                        halign: 'center',
                        tag:    'scale'
                    });


                    RGraph.text({
                    
                        object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      this.marginLeft + this.axisWidth + this.marginCenter,
                        y:      this.canvas.height - this.marginBottom + 3,
                        text:   typeof prop.xaxisScaleFormatter === 'function' ? (prop.xaxisScaleFormatter)(this, 0) : RGraph.numberFormat({
                            object: this,
                            number: (0).toFixed(prop.xaxisScaleDecimals),
                            unitspre: prop.xaxisScaleUnitsPre,
                            unitspost: prop.xaxisScaleUnitsPost
                        }),
                        valign: 'top',
                        halign: 'center',
                        tag:     'scale'
                    });
                }
            }





            //
            // Draw above labels
            //
            if (prop.labelsAbove) {
                this.drawLabelsAbove();
            }
        };








        // This function draws the above labels
        this.drawLabelsAbove = function ()
        {
            var coordsLeft  = this.coordsLeft,
                coordsRight = this.coordsRight;

                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'labelsAbove'
                });

            // Draw the left sides above labels
            for (var i=0,seq=0; i<coordsLeft.length; ++i, ++seq) {

                if (typeof this.left[i] == 'number') {

                    var coords = this.coords[seq];

                    RGraph.text({
                    
                        object: this,
                        
                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      coords[0] - 5,
                        y:      coords[1] + (coords[3] / 2),
                        text:   typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter(this, this.left[i]) : RGraph.numberFormat({
                            object:    this,
                            number:    this.left[i].toFixed(typeof prop.labelsAboveDecimals === 'number' ? prop.labelsAboveDecimals : 0),
                            unitspre:  prop.labelsAboveUnitsPre,
                            unitspost: prop.labelsAboveUnitsPost
                        }),
                        valign: 'center',
                        halign: 'right',
                        tag:     'labels.above'
                    });



                    


                // A grouped or stacked chart
                } else if (typeof this.left[i] === 'object') {

                    // Loop through the group

                    for (var j=0; j<this.left[i].length; ++j,++seq) {

                        // Stacked charts only show the above label on the last
                        // segment of the bar
                        if (prop.grouping === 'stacked' && j !== (this.left[i].length - 1) ) {
                            continue;
                        }


                        var coords = coordsLeft[seq];


                        RGraph.text({
                        
                            object: this,

                            font:   textConf.font,
                            size:   textConf.size,
                            bold:   textConf.bold,
                            italic: textConf.italic,
                            color:  textConf.color,

                            x:      coords[0] - 5,
                            y:      coords[1] + (coords[3] / 2),
                            text:   typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter(this, this.left[i][j]) : RGraph.numberFormat({
                                object:    this,
                                number:    RGraph.isNull(this.left[i][j]) || isNaN(this.left[i][j]) ? '' : (prop.grouping === 'stacked' ? RGraph.arraySum(this.left[i]): Number(this.left[i][j])).toFixed(typeof prop.labelsAboveDecimals === 'number' ? prop.labelsAboveDecimals : 0),
                                unitspre:  prop.labelsAboveUnitsPre,
                                unitspost: prop.labelsAboveUnitsPost
                            }),
                            valign: 'center',
                            halign: 'right',
                            tag:     'labels.above'
                        });
                    }
                    
                    seq--;
                }
            }







            // Draw the right sides above labels
            for (i=0,seq=0; i<coordsRight.length; ++i,++seq) {

                if (typeof this.right[i] === 'number') {

                    var coords = coordsRight[seq];

                    RGraph.text({
                    
                        object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:          coords[0] + coords[2] + 5 + (prop.variant === '3d' ? 10 : 0),
                        y:          coords[1] + (coords[3] / 2) + (prop.variant === '3d' ? -5 : 0),
                        text:       typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter(this, this.right[i]) : RGraph.numberFormat({
                                        object:    this,
                                        number:    this.right[i].toFixed(typeof prop.labelsAboveDecimals === 'number' ? prop.labelsAboveDecimals : 0),
                                        unitspre:  prop.labelsAboveUnitsPre,
                                        unitspost: prop.labelsAboveUnitsPost
                                    }),
                        valign:     'center',
                        halign:     'left',
                        tag:        'labels.above'
                    });





                // A grouped/stacked chart
                } else if (typeof this.right[i] === 'object') {

                    // Loop through the group
                    for (var j=0; j<this.right[i].length; ++j,++seq) {

                        // Stacked charts only show the above label on the last
                        // segment of the bar
                        if (prop.grouping === 'stacked' && j !== (this.right[i].length - 1)) {
                            continue;
                        }

                        var coords = coordsRight[seq];

                        RGraph.text({

                            object: this,

                            font:   textConf.font,
                            size:   textConf.size,
                            bold:   textConf.bold,
                            italic: textConf.italic,
                            color:  textConf.color,

                            x:      coords[0] + coords[2] + 5 + (prop.variant === '3d' ? 10 : 0),
                            y:      coords[1] + (coords[3] / 2) + (prop.variant === '3d' ? -5 : 0),
                            text:   typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter(this, this.right[i][j]) : RGraph.numberFormat({
                                        object:    this,
                                        number:    RGraph.isNull(this.right[i][j]) || isNaN(this.right[i][j]) ? '' : prop.grouping === 'stacked' ? RGraph.arraySum(this.right[i]).toFixed(prop.labelsAboveDecimals) : Number(this.right[i][j]).toFixed(typeof prop.labelsAboveDecimals === 'number' ? prop.labelsAboveDecimals : 0),
                                        unitspre:  prop.labelsAboveUnitsPre,
                                        unitspost: prop.labelsAboveUnitsPost
                                    }),
                            valign: 'center',
                            halign: 'left',
                            tag:     'labels.above'
                        });
                    }
                    
                    --seq;
                }
            }
        };








        //
        // Draws the titles
        //
        this.drawTitles = function ()
        {
            // Get the text configuration
            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'titleLeft'
            });

            // Draw the left title
            if (typeof prop.titleLeft === 'string') {
                RGraph.text({
                
                    object: this,
                        
                    font:   textConf.font,
                    size:   textConf.size,
                    bold:   textConf.bold,
                    italic: textConf.italic,
                    color:  textConf.color,

                    x:      this.marginLeft + 5,
                    y:      this.marginTop - 5,
                    text:   prop.titleLeft,
                    halign:'left',
                    valign: 'bottom',
                    tag:    'title.left'
                });
            }

            // Get the text configuration
            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'titleRight'
            });

            // Draw the right title
            if (typeof prop.titleRight === 'string') {
                RGraph.text({
                
                    object: this,
                        
                    font:   textConf.font,
                    size:   textConf.size,
                    bold:   textConf.bold,
                    italic: textConf.italic,
                    color:  textConf.color,

                    x:      this.canvas.width - this.marginRight - 5,
                    y:      this.marginTop - 5,
                    text:   prop.titleRight,
                    halign: 'right',
                    valign: 'bottom',
                    tag:    'title.right'
                });
            }


            // Draw the main title for the whole chart
            if (typeof prop.title === 'string') {
                RGraph.drawTitle(
                    this,
                    prop.title,
                    this.marginTop,
                    null,
                    typeof prop.titleSize === 'number' ? prop.titleSize : null
                );
            }
        };








        //
        // Returns the appropriate focussed bar coordinates
        // 
        // @param e object The event object
        //
        this.getShape = function (e)
        {
            var canvas  = this.canvas,
                context = this.context,
                mouseXY = RGraph.getMouseXY(e)

            //
            // Loop through the bars determining if the mouse is over a bar
            //
            for (var i=0; i<this.coords.length; i++) {

                var mouseX = mouseXY[0],
                    mouseY = mouseXY[1],
                    left   = this.coords[i][0],
                    top    = this.coords[i][1],
                    width  = this.coords[i][2],
                    height = this.coords[i][3]


                if (prop.variant === '3d') {
                    path(this.context,
                        'b r % % % %',
                        left,
                        top,
                        width,
                        height
                    );

                    var over = this.context.isPointInPath(mouseX, mouseY);
                } else {
                    var over =  (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) );
                }
                
                
                // Is the mouse cursor over a shape?
                if (over) {

                    var tooltip = RGraph.parseTooltipText(prop.tooltips, i);

                    return {
                        0: this,
                        1: left,
                        2: top,
                        3: width,
                        4: height,
                        5: i,
                        
                        object: this,
                             x: left,
                             y: top,
                         width: width,
                        height: height,
                         index: i,
                       tooltip: tooltip
                    };
                }
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
            } else {
                RGraph.Highlight.rect(this, shape);
            }
        };








        //
        // When you click on the canvas, this will return the relevant value (if any)
        // 
        // REMEMBER This function will need updating if the Bipolar ever gets yaxisScaleMin
        // 
        // @param object e The event object
        //
        this.getValue = function (e)
        {
            var obj     = e.target.__object__;
            var mouseXY = RGraph.getMouseXY(e);
            var mouseX  = mouseXY[0];
            
            //
            // Left hand side
            //
            if (mouseX > this.marginLeft && mouseX < ( (this.canvas.width / 2) - (prop.marginCenter / 2) )) {
                var value = (mouseX - prop.marginLeft) / this.axisWidth;
                    value = this.max - (value * this.max);
            }
            
            //
            // Right hand side
            //
            if (mouseX < (this.canvas.width -  this.marginRight) && mouseX > ( (this.canvas.width / 2) + (prop.marginCenter / 2) )) {
                var value = (mouseX - prop.marginLeft - this.axisWidth - prop.marginCenter) / this.axisWidth;
                    value = (value * this.max);
            }
            
            return value;
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
                   mouseXY[0] > prop.marginLeft
                && mouseXY[0] < (this.canvas.width - prop.marginRight)
                && mouseXY[1] > prop.marginTop
                && mouseXY[1] < (this.canvas.height - prop.marginBottom)
                ) {
    
                return this;
            }
        };








        //
        // Returns the X coords for a value. Returns two coords because there are... two scales.
        // 
        // @param number value The value to get the coord for
        //
        this.getXCoord = function (value)
        {
            if (value > this.max || value < 0) {
                return null;
            }
    
            var ret = [];
            
            // The offset into the graph area
            var offset = ((value / this.max) * this.axisWidth);
            
            // Get the coords (one fo each side)
            ret[0] = (this.marginLeft + this.axisWidth) - offset;
            ret[1] = (this.canvas.width - this.marginRight - this.axisWidth) + offset;
            
            return ret;
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function ()
        {
            // Necessary for some reason
            var prop = this.properties;

            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors.colors          = RGraph.arrayClone(prop.colors);
                this.original_colors.highlightStroke = RGraph.arrayClone(prop.highlightStroke);
                this.original_colors.highlightFill   = RGraph.arrayClone(prop.highlightFill);
                this.original_colors.axesColor       = RGraph.arrayClone(prop.axesColor);
                this.original_colors.colorsStroke    = RGraph.arrayClone(prop.colorsStroke);
            }

            var prop = this.properties;
            var colors = prop.colors;
    
            for (var i=0; i<colors.length; ++i) {
                colors[i] = this.parseSingleColorForGradient(colors[i]);
            }
            
            prop.highlightStroke = this.parseSingleColorForGradient(prop.highlightStroke);
            prop.highlightFill   = this.parseSingleColorForGradient(prop.highlightFill);
            prop.axesColor       = this.parseSingleColorForGradient(prop.axesColor);
            prop.colorsStroke    = this.parseSingleColorForGradient(prop.colorsStroke);
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
                var grad = this.context.createLinearGradient(prop.marginLeft,0,this.canvas.width - prop.marginRight,0);
    
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
        // Draw the background grid
        //
        this.drawBackgroundGrid = function ()
        {
            if (prop.backgroundGrid) {

                var variant   = prop.variant,
                    color     = prop.backgroundGridColor,
                    numvlines = prop.xaxisLabelsCount, // TODO Should this be based on the data - not the labels...?
                    numhlines = this.left.length,
                    vlines    = prop.backgroundGridVlines,
                    hlines    = prop.backgroundGridHlines,
                    linewidth = prop.backgroundGridLinewidth;
                
                // Autofit
                if (typeof prop.backgroundGridHlinesCount === 'number') {
                    numhlines = prop.backgroundGridHlinesCount;
                }

                if (typeof prop.backgroundGridVlinesCount === 'number') {
                    numvlines = prop.backgroundGridVlinesCount;
                }
                
                this.context.lineWidth = linewidth;
                
                // If it's a bar and 3D variant, translate
                if (variant == '3d') {
                    this.context.save();
                    this.context.translate(
                        prop.variantThreedOffsetx,
                        -1 * prop.variantThreedOffsety
                    );
                }

                // Draw vertical grid lines for the left side
                if (vlines) {
                    for (var i=0; i<=numvlines; i+=1) {
                        path(this.context,
                            'b m % % l % % s %',
                            this.marginLeft + (this.axisWidth / numvlines) * i, this.marginTop,
                            this.marginLeft + (this.axisWidth / numvlines) * i, this.marginTop + this.axisHeight,
                            color
                        );

                    }
                }
                
                // Draw horizontal grid lines for the left side
                if (hlines) {
                    for (var i=0; i<=numhlines; i+=1) {
                        path(this.context,
                            'b m % % l % % s %',
                            this.marginLeft, this.marginTop + (this.axisHeight / numhlines) * i,
                            this.marginLeft + this.axisWidth, this.marginTop + (this.axisHeight / numhlines) * i,
                            color
                        );
                    }
                }
    
                
                // Draw vertical grid lines for the right side
                if (vlines) {
                    for (var i=0; i<=numvlines; i+=1) {
                        path(this.context,
                            'b m % % l % % s %',
                            this.marginLeft + this.marginCenter + this.axisWidth + (this.axisWidth / numvlines) * i, this.marginTop,
                            this.marginLeft + this.marginCenter + this.axisWidth + (this.axisWidth / numvlines) * i, this.marginTop + this.axisHeight,
                            color
                        );
                    }
                }
                
                // Draw horizontal grid lines for the right side
                if (hlines) {
                    for (var i=0; i<=numhlines; i+=1) {
                        path(this.context,
                            'b m % % l % % s %',
                            this.marginLeft + this.axisWidth + this.marginCenter, this.marginTop + (this.axisHeight / numhlines) * i,
                            this.marginLeft + this.axisWidth + this.marginCenter + this.axisWidth, this.marginTop + (this.axisHeight / numhlines) * i,
                            color
                        );
                    }
                }
                
                
                // If it's a bar and 3D variant, translate
                if (variant == '3d') {
                    this.context.restore();
                }
            }
        };








        //
        // This function runs once only
        // (put at the end of the file (before any effects))
        //
        this.firstDrawFunc = function ()
        {
        };








        //
        // Calulate the center margin size
        //
        this.getMarginCenter = function ()
        {
            var bold = typeof prop.yaxisLabelsBold === 'boolean' ? prop.yaxisLabelsBold : prop.textBold,
                font = typeof prop.yaxisLabelsFont === 'string'  ? prop.yaxisLabelsFont : prop.textFont,
                size = typeof prop.yaxisLabelsSize === 'number'  ? prop.yaxisLabelsSize : prop.textSize;

            // Loop through the labels measuring them
            for (var i=0,len=0; i<prop.yaxisLabels.length; ++i) {

                len = Math.max(len, RGraph.measureText(
                    prop.yaxisLabels[i],
                    bold,
                    font,
                    size
                )[0]);
            }

            return len + 15;
        };








        //
        // Grow
        // 
        // The Bipolar chart Grow effect gradually increases the values of the bars
        // 
        // @param object       An object of options - eg: {frames: 30}
        // @param function     A function to call when the effect is complete
        //
        this.grow = function ()
        {
            // Callback
            var opt      = arguments[0] || {},
                frames   = opt.frames || 30,
                frame    = 0,
                callback = arguments[1] || function () {},
                obj      = this;
    
            // Save the data
            var originalLeft  = RGraph.arrayClone(this.left),
                originalRight = RGraph.arrayClone(this.right);

    
            // Stop the scale from changing by setting xaxisScaleMax (if it's
            // not already set)
            if (RGraph.isNull(prop.xaxisScaleMax)) {
    
                var xmax = 0;
    
                // Get the max values
                this.getMax();

                this.set('xaxisScaleMax', this.scale2.max);
            }

            var iterator = function ()
            {
                var easingMultiplier = RGraph.Effects.getEasingMultiplier(frames, frame);

                // Left hand side
                for (var i=0; i<obj.left.length; i+=1) {
                    if (typeof obj.left[i] === 'number') {
                        obj.left[i] = easingMultiplier * originalLeft[i];
                    } else {
                        for (var j=0; j<obj.left[i].length; ++j) {
                            obj.left[i][j] = easingMultiplier * originalLeft[i][j];
                        }
                    }
                }
                
                // Right hand side
                for (var i=0; i<obj.right.length; i+=1) {
                    if (typeof obj.right[i] === 'number') {
                        obj.right[i] = easingMultiplier * originalRight[i];
                    } else {
                        for (var j=0; j<obj.right[i].length; ++j) {
                            obj.right[i][j] = easingMultiplier * originalRight[i][j];
                        }
                    }
                }

                RGraph.redrawCanvas(obj.canvas);

                // Repeat or call the end function if one is defined
                if (frame < frames) {
                    frame += 1;
                    RGraph.Effects.updateCanvas(iterator);
                } else {
                    callback(obj);
                }
            };
    
            iterator();
            
            return this;
        };








        //
        // Bipolar chart Wave effect.
        // 
        // @param object   OPTIONAL An object map of options. You specify 'frames' here to give the number of frames in the effect
        // @param function OPTIONAL A function that will be called when the effect is complete
        //
        this.wave = function ()
        {
            var obj                   = this,
                opt                   = arguments[0] || {};
                opt.frames            =  opt.frames || 120;
                opt.startFrames_left  = [];
                opt.startFrames_right = [];
                opt.counters_left     = [];
                opt.counters_right    = [];

            var framesperbar    = opt.frames / 3,
                frame_left      = -1,
                frame_right     = -1,
                callback        = arguments[1] || function () {},
                original_left   = RGraph.arrayClone(obj.left),
                original_right  = RGraph.arrayClone(obj.right);

            for (var i=0,len=obj.left.length; i<len; i+=1) {
                opt.startFrames_left[i]  = ((opt.frames / 3) / (obj.left.length - 1)) * i;
                opt.startFrames_right[i] = ((opt.frames / 3) / (obj.right.length - 1)) * i;
                opt.counters_left[i]     = 0;
                opt.counters_right[i]    = 0;
            }

            // This stops the chart from jumping
            obj.draw();
            obj.set('xaxisScaleMax', obj.scale2.max);
            RGraph.clear(obj.canvas);


            // Zero all of the data
            for (var i=0,len=obj.left.length; i<len; i+=1) {
                if (typeof obj.left[i] === 'number') obj.left[i] = 0;
                if (typeof obj.right[i] === 'number') obj.right[i] = 0;
            }

            //
            // Iterate over the left side
            //
            function iteratorLeft ()
            {
                ++frame_left;

                for (var i=0,len=obj.left.length; i<len; i+=1) {
                        if (frame_left > opt.startFrames_left[i]) {
                        
                        var isNull = RGraph.isNull(obj.left[i]);
                        
                        // Regular bars
                        if (typeof obj.left[i] === 'number') {
                            obj.left[i] = Math.min(
                                Math.abs(original_left[i]),
                                Math.abs(original_left[i] * ( (opt.counters_left[i]++) / framesperbar))
                            );
                            
                            // Make the number negative if the original was
                            if (original_left[i] < 0) {
                                obj.left[i] *= -1;
                            }


                            // Stacked or grouped bars
                            } else if (RGraph.isArray(obj.left[i])) {
                                for (var j=0; j<obj.left[i].length; ++j) {
                                    obj.left[i][j] = Math.min(
                                        Math.abs(original_left[i][j]),
                                        Math.abs(original_left[i][j] * ( (opt.counters_left[i]++) / framesperbar))
                                    );
                                    
                                    // Make the number negative if the original was
                                    if (original_left[i][j] < 0) {
                                        obj.left[i][j] *= -1;
                                    }
                                }
                            }
                            
                            if (isNull) {
                                obj.left[i] = null;
                            }
                        } else {
                            obj.left[i] = typeof obj.left[i] === 'object' && obj.left[i] ? RGraph.arrayPad([], obj.left[i].length, 0) : (RGraph.isNull(obj.left[i]) ? null : 0);
                        }

                }


                // No callback here - only called by the right function
                if (frame_left < opt.frames) {
                    RGraph.redrawCanvas(obj.canvas);
                    RGraph.Effects.updateCanvas(iteratorLeft);
                }
            }




            //
            // Iterate over the right side
            //
            function iteratorRight ()
            {
                ++frame_right;

                for (var i=0,len=obj.right.length; i<len; i+=1) {
                        if (frame_right > opt.startFrames_right[i]) {
                        
                            var isNull = RGraph.isNull(obj.right[i]);
                        
                            if (typeof obj.left[i] === 'number') {
                                obj.right[i] = Math.min(
                                    Math.abs(original_right[i]),
                                    Math.abs(original_right[i] * ( (opt.counters_right[i]++) / framesperbar))
                                );
                                
                                // Make the number negative if the original was
                                if (original_right[i] < 0) {
                                    obj.right[i] *= -1;
                                }

                                if (isNull) {
                                    obj.right[i] = null;
                                }
                            } else if (RGraph.isArray(obj.right[i])) {
                                for (var j=0; j<obj.right[i].length; ++j) {
                                    obj.right[i][j] = Math.min(
                                        Math.abs(original_right[i][j]),
                                        Math.abs(original_right[i][j] * ( (opt.counters_right[i]++) / framesperbar))
                                    );
                                    
                                    // Make the number negative if the original was
                                    if (original_right[i][j] < 0) {
                                        obj.right[i][j] *= -1;
                                    }
                                }
                            }

                        } else {
                            obj.right[i] = typeof obj.right[i] === 'object' && obj.right[i] ? RGraph.arrayPad([], obj.right[i].length, 0) : (RGraph.isNull(obj.right[i]) ? null : 0);
                        }
                }


                // No callback here - only called by the right function
                if (frame_right < opt.frames) {
                    RGraph.redrawCanvas(obj.canvas);
                    RGraph.Effects.updateCanvas(iteratorRight);
                } else {
                    callback(this);
                }
            }




            iteratorLeft();
            iteratorRight();

            return this;
        };









        //
        // Objects are now always registered so that when RGraph.redraw()
        // is called this chart will be redrawn.
        //
        RGraph.register(this);








        //
        // This is the 'end' of the constructor so if the first argument
        // contains configuration dsta - handle that.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);
    };
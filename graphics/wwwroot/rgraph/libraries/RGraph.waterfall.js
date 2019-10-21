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
    RGraph.Waterfall = function (conf)
    {
        this.id                = conf.id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'waterfall';
        this.max               = 0;
        this.data              = conf.data;
        this.isRGraph          = true;
        this.coords            = [];
        this.uid               = RGraph.createUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.createUID();
        this.colorsParsed      = false;
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false






        // Various config
        this.properties =
        {
            backgroundBarsCount:               null,
            backgroundBarsColor1:              'rgba(0,0,0,0)',
            backgroundBarsColor2:              'rgba(0,0,0,0)',
            backgroundGrid:                    true,
            backgroundGridAutofit:             true,
            backgroundGridAutofitAlign:        true,
            backgroundGridColor:               '#ddd',
            backgroundGridLinewidth:           1,
            backgroundGridHsize:               20,
            backgroundGridVsize:               20,
            backgroundGridVlines:              true,
            backgroundGridHlines:              true,
            backgroundGridBorder:              true,
            backgroundGridAlign:               true,
            backgroundGridHlinesCount:         5,
            backgroundGridVlinesCount:         20,
            backgroundImage:                   null,
            backgroundImageStretch:            true,
            backgroundImageX:                  null,
            backgroundImageY:                  null,
            backgroundImageW:                  null,
            backgroundImageH:                  null,
            backgroundImageAlign:              null,
            backgroundHbars:                   null,

            linewidth:                         1,

            axes:                              true,
            axesLinewidth:                     1,
            axesColor:                         'black',

            colorsStroke:                      '#666',
            colors:                            ['green','red','blue'],
            colorsSequential:                  false,

            marginLeft:                        35,
            marginRight:                       35,
            marginTop:                         35,
            marginBottom:                      35,
            marginInner:                       5,

            xaxis:                             true,
            xaxisPosition:                     'bottom',
            xaxisTickmarksCount:               null,
            xaxisTitle:                        '',
            xaxisTitlePos:                     null,
            xaxisTitleBold:                    null,
            xaxisTitleItalic:                  null,
            xaxisTitleSize:                    null,
            xaxisTitleFont:                    null,
            xaxisTitleColor:                   null,
            xaxisTitleX:                       null,
            xaxisTitleY:                       null,
            xaxisLabels:                       [],
            xaxisLabelsBold:                   null,
            xaxisLabelsColor:                  null,
            xaxisLabelsFont:                   null,
            xaxisLabelsItalic:                 null,
            xaxisLabelsSize:                   null,
            xaxisLabelsOffsetx:                0,
            xaxisLabelsOffsety:                0,
            xaxisLabelsAngle:                  0,


            yaxis:                             true,
            yaxisTickmarksCount:               10,
            yaxisTitle:                        '',
            yaxisTitleBold:                    null,
            yaxisTitleItalic:                  null,
            yaxisTitleSize:                    null,
            yaxisTitleFont:                    null,
            yaxisTitleColor:                   null,
            yaxisTitlePos:                     null,
            yaxisTitleAlign:                   'left',
            yaxisTitleX:                       null,
            yaxisTitleY:                       null,
            yaxisLabels:                       true,
            yaxisLabelsCount:                  5,
            yaxisLabelsOffsetx:                0,
            yaxisLabelsOffsety:                0,
            yaxisLabelsFont:                   null,
            yaxisLabelsSize:                   null,
            yaxisLabelsColor:                  null,
            yaxisLabelsBold:                   null,
            yaxisLabelsItalic:                 null,
            yaxisScaleMax:                     null,
            yaxisScaleMin:                     0,
            yaxisScaleUnitsPre:                '',
            yaxisScaleUnitsPost:               '',
            yaxisScaleDecimals:                0,
            yaxisScalePoint:                   '.',
            yaxisScaleThousand:                ',',
            yaxisScaleZerostart:               true,
            yaxisScaleFormatter:               null,

            labelsAbove:                       false,
            labelsAboveFont:                   null,
            labelsAboveSize:                   null,
            labelsAboveBold:                   null,
            labelsAboveItalic:                 null,
            labelsAboveColor:                  null,
            labelsAboveOffsetx:                0,
            labelsAboveOffsety:                0,
            labelsAboveSpecific:               null,
            labelsAboveDecimals:               0,
            labelsAboveUnitsPre:               '',
            labelsAboveUnitsPost:              '',
            labelsAbovePoint:                  '.',
            labelsAboveThousand:               ',',
            labelsAboveFormatter:              null,
            labelsAboveTotalItalic:            null,
            labelsAboveTotalBold:              null,
            labelsAboveTotalSize:              null,
            labelsAboveTotalFont:              null,
            labelsAboveTotalColor:             null,
            labelsAboveTotalDecimals:          null,
            labelsAboveTotalUnitsPre:          null,
            labelsAboveTotalUnitsPost:         null,
            labelsAboveTotalPoint:             null,
            labelsAboveTotalThousand:          null,
            labelsAboveTotalFormatter:         null,

            textColor:                         'black',
            textSize:                          12,
            textFont:                          'Arial, Verdana, sans-serif',
            textBold:                          false,
            textItalic:                        false,
            textAccessible:                    true,
            textAccessibleOverflow:            'visible',
            textAccessiblePointerevents:       false,


            title:                             '',
            titleColor:                        'black',
            titleBackground:                   null,
            titleHpos:                         null,
            titleVpos:                         null,
            titleBold:                         null,
            titleFont:                         null,
            titleSize:                         null,
            titleItalic:                       null,
            titleColor:                        null,
            titleX:                            null,
            titleY:                            null,
            titleHalign:                       null,
            titleValign:                       null,


            shadow:                            false,
            shadowColor:                       '#666',
            shadowOffsetx:                     3,
            shadowOffsety:                     3,
            shadowBlur:                        3,

            tooltips:                          null,
            tooltipsEffect:                    'fade',
            tooltipsCssClass:                  'RGraph_tooltip',
            tooltipsEvent:                     'onclick',
            tooltipsHighlight:                 true,
            tooltipsOverride:                  null,

            highlightStroke:                   'rgba(0,0,0,0)',
            highlightFill:                     'rgba(255,255,255,0.7)',

            contextmenu:                       null,

            crosshairs:                        false,
            crosshairsColor:                   '#333',
            crosshairsHline:                   true,
            crosshairsVline:                   true,

            annotatable:                       false,
            annotatableLinewidth:              1,
            annotatableColor:                  'black',

            resizable:                         false,
            resizableHandleBackground:         null,

            total:                             true,

            multiplierX:                       1, // Used for animation
            multiplierW:                       1, // Used for animation

            eventsClick:                       null,
            eventsMousemove:                   null,

            key:                               null,
            keyBackground:                     'white',
            keyPosition:                       'graph',
            keyHalign:                         'right',
            keyShadow:                         false,
            keyShadowColor:                    '#666',
            keyShadowBlur:                     3,
            keyShadowOffsetx:                  2,
            keyShadowOffsety:                  2,
            keyPositionGutterBoxed:            false,
            keyPositionX:                      null,
            keyPositionY:                      null,
            keyColorShape:                     'square',
            keyRounded:                        true,
            keyLinewidth:                      1,
            keyColors:                         null,
            keyInteractive:                    false,
            keyInteractiveHighlightChartStroke:'#000',
            keyInteractiveHighlightChartFill:  'rgba(255,255,255,0.7)',
            keyInteractiveHighlightLabel:      'rgba(255,0,0,0.2)',
            keyLabelsColor:                    null,
            keyLabelsFont:                     null,
            keyLabelsSize:                     null,
            keyLabelsBold:                     null,
            keyLabelsItalic:                   null,
            keyLabelsOffsetx:                  0,
            keyLabelsOffsety:                  0,

            barOffsetx:                        0, // Used to facilitate multiple dataset Waterfall charts
            barOffsety:                        0, // Used to facilitate multiple dataset Waterfall charts

            clearto:                           'rgba(0,0,0,0)'
        }

        // Check for support
        if (!this.canvas) {
            alert('[WATERFALL] No canvas support');
            return;
        }
        
        //
        // Create the $ objects
        // 
        // 2/5/016: Now also use this loop to go through the dat conerting
        // strings to floats
        //
        for (var i=0,len=this.data.length; i<=len; ++i) {
            
            // Create the object for adding event listeners
            this['$' + i] = {}
            
            // Ensure that the data point is numeric
            if (typeof this.data[i] === 'string') {
                this.data[i] = parseFloat(this.data[i]);
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
            // Draw the background image
            //
            RGraph.drawBackgroundImage(this);



            //
            // Make the margins easy ro access
            //            
            this.marginLeft   = prop.marginLeft;
            this.marginRight  = prop.marginRight;
            this.marginTop    = prop.marginTop;
            this.marginBottom = prop.marginBottom;

            //
            // Stop the coords array from growing uncontrollably
            //
            this.coords = [];



            //
            // Stop this growing uncontrollably
            //
            this.coordsText = [];




            //
            // This gets used a lot
            //
            this.centery = ((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop;

            //
            // Work out a few things. They need to be here because they depend on things you can change after you instantiate the object
            //
            this.max            = 0;
            this.grapharea      = this.canvas.height - this.marginTop - this.marginBottom;
            this.graphwidth     = this.canvas.width - this.marginLeft - this.marginRight;
            this.halfTextHeight = prop.textSize / 2;
    
    
            //
            // Work out the maximum value
            //
            this.max     = this.getMax(this.data);

            var decimals = prop.yaxisScaleDecimals;

            this.scale2 = RGraph.getScale2(this, {
                'scale.max':          typeof(prop.yaxisScaleMax) == 'number' ? prop.yaxisScaleMax : this.max,
                'scale.min':          prop.yaxisScaleMin,
                'scale.strict':       typeof(prop.yaxisScaleMax) === 'number' ? true : false,
                'scale.decimals':     Number(decimals),
                'scale.point':        prop.yaxisScalePoint,
                'scale.thousand':     prop.yaxisScaleThousand,
                'scale.round':        prop.yaxisScaleRound,
                'scale.units.pre':    prop.yaxisScaleUnitsPre,
                'scale.units.post':   prop.yaxisScaleUnitsPost,
                'scale.labels.count': prop.yaxisLabelsCount,
                'scale.formatter':   prop.yaxisScaleFormatter
            });

            this.max = this.scale2.max;
            this.min = this.scale2.min;
    
            // Draw the background hbars
            RGraph.drawBars(this)

            // Progressively Draw the chart
            RGraph.Background.draw(this);
    
            this.drawAxes();
            this.drawbars();
            this.drawLabels();
            
            //
            // If the X axis is at the bottom AND ymin is 0 - draw the it
            // again so that it appears "on top" of the bars
            //
            if (   prop.xaxisPosition === 'bottom'
                && prop.axes
                && prop.xaxis
                && prop.yaxisScaleMin === 0) {

                this.context.strokeStyle = prop.axesColor;
                this.context.strokeRect(
                    prop.marginLeft,
                    this.canvas.height - this.marginBottom,
                    this.canvas.width - this.marginLeft - this.marginRight,
                    0
                );
            }
    
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
            
            
            // Draw a key if necessary
            if (prop.key && prop.key.length) {
                RGraph.drawKey(this, prop.key, prop.colors);
            }


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
        // Draws the charts axes
        //
        this.drawAxes = function ()
        {
            if (!prop.axes) {
                return;
            }
    
            this.context.beginPath();
            this.context.strokeStyle = prop.axesColor;
            this.context.lineWidth   = prop.axesLinewidth + 0.001;
    
            // Draw the Y axis
            if (prop.yaxis) {
                this.context.moveTo(Math.round(this.marginLeft), this.marginTop);
                this.context.lineTo(Math.round(this.marginLeft), this.canvas.height - this.marginBottom);
            }

            // Draw the X axis
            if (prop.xaxis) {
                // Center X axis
                if (prop.xaxisPosition == 'center') {
                    this.context.moveTo(this.marginLeft, Math.round( ((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop));
                    this.context.lineTo(this.canvas.width - this.marginRight, Math.round( ((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop));
                } else {
                
                    var y = Math.floor(this.getYCoord(0));

                    this.context.moveTo(this.marginLeft, y);
                    this.context.lineTo(this.canvas.width - this.marginRight, y);
                }
            }

            var numYTicks = prop.yaxisTickmarksCount;
    
            // Draw the Y tickmarks
            if (   prop.yaxis
                && prop.yaxisTickmarksCount > 0
               ) {
    
                var yTickGap = (this.canvas.height - this.marginTop - this.marginBottom) / numYTicks;
        
                for (y=this.marginTop; y < (this.canvas.height - this.marginBottom); y += yTickGap) {
                    if (prop.xaxisPosition == 'bottom' || (y != ((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop)) {
                        this.context.moveTo(this.marginLeft, Math.round( y));
                        this.context.lineTo(this.marginLeft - 3, Math.round( y));
                    }
                }

                //
                // If the X axis is not being shown, draw an extra tick
                //
                if (   !prop.xaxis
                    || prop.xaxisPosition == 'center'
                    || prop.yaxisScaleMin !== 0
                   ) {
                    this.context.moveTo(this.marginLeft - 3, Math.round(this.canvas.height - this.marginBottom));
                    this.context.lineTo(this.marginLeft, Math.round(this.canvas.height - this.marginBottom));
                }
            }


            // Draw the X tickmarks
            if (prop.xaxisTickmarksCount == null) {
                prop.xaxisTickmarksCount = this.data.length + (prop.total ? 1 : 0)
            }
    
            if (prop.xaxis && prop.xaxisTickmarksCount > 0) {
    
                xTickGap = (this.canvas.width - this.marginLeft - this.marginRight ) / prop.xaxisTickmarksCount;
                
                if (prop.xaxisPosition == 'center') {
                    yStart   = ((this.canvas.height - this.marginBottom - this.marginTop) / 2) + this.marginTop - 3;
                    yEnd     = ((this.canvas.height - this.marginBottom - this.marginTop) / 2) + this.marginTop + 3;
                } else {
                    yStart   = this.getYCoord(0) - (this.scale2.min < 0 ? 3 : 0);
                    yEnd     = this.getYCoord(0) + 3;
                }
        
                for (x=this.marginLeft + xTickGap; x<=this.canvas.width - this.marginRight + 1; x+=xTickGap) {
                    this.context.moveTo(Math.round(x), yStart);
                    this.context.lineTo(Math.round(x), yEnd);
                }
                
                if (!prop.yaxis) {
                    this.context.moveTo(Math.round( this.marginLeft), yStart);
                    this.context.lineTo(Math.round( this.marginLeft), yEnd);
                }
            }
    
            //
            // If the Y axis is not being shown, draw an extra tick
            //
            if (!prop.yaxis && prop.xaxis) {
                this.context.moveTo(Math.round(this.marginLeft), this.getYCoord(0));
                this.context.lineTo(Math.round(this.marginLeft), this.getYCoord(0));
            }
    
            this.context.stroke();
        };








        //
        // Draws the labels for the graph
        //
        this.drawLabels = function ()
        {
            var context    = this.context,
                numYLabels = 5, // TODO Make this configurable
                interval   = this.grapharea / numYLabels,
                italic     = prop.textItalic,
                bold       = prop.textBold,
                font       = prop.textFont,
                size       = prop.textSize,
                color      = prop.textColor,
                units_pre  = prop.yaxisScaleUnitsPre,
                units_post = prop.yaxisScaleUnitsPost,
                offsetx    = prop.yaxisLabelsOffsetx,
                offsety    = prop.yaxisLabelsOffsety;
            
            this.context.beginPath();
            this.context.fillStyle = color;

            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'yaxisLabels'
            });
    
            //
            // First, draw the Y labels
            //
            if (prop.yaxisLabels) {
                if (prop.xaxisPosition == 'center') {
    
                    var halfInterval = interval / 2;
                    var halfWay      = ((this.canvas.height - this.marginTop - this.marginBottom) / 2) + this.marginTop;

                    for (var i=0,len=this.scale2.labels.length; i<len; ++i) {
                        RGraph.text({
                            
                       object: this,
                
                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                            x:      this.marginLeft - 5 + offsetx,
                            y:      this.marginTop + (((this.grapharea/2) / len) * i) + offsety,
                            text:   this.scale2.labels[len - i - 1],
                            valign: 'center',
                            halign: 'right',
                            tag:    'scale'
                        });
                        
                        RGraph.text({
                            
                       object: this,
                
                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                            x:      this.marginLeft - 5 + offsetx,
                            y:      halfWay + (((this.grapharea/2) / len) * (i + 1)) + offsety,
                            text:   this.scale2.labels[i],
                            valign: 'center',
                            halign: 'right',
                            tag:    'scale'
                        });
                    }
                    
                    // Draw zero if required
                    if (prop.yaxisScaleZerostart) {
                        RGraph.text({
                            
                       object: this,

                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                            x:      this.marginLeft - 5 + offsetx,
                            y:      halfWay,
                            text:   '0',
                            valign: 'center',
                            halign: 'right',
                            tag:    'scale'
                        });
                    }

                } else {

                    for (var i=0,len=this.scale2.values.length; i<len; ++i) {

                        var y = this.getYCoord(this.scale2.values[i]) + offsety;

                        RGraph.text({
                            
                       object: this,

                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                            x:      this.marginLeft - 5 + offsetx,
                            y:      y,
                            text:   this.scale2.labels[i],
                            valign: 'center',
                            halign: 'right',
                            tag:    'scale'
                        });
                    }


                    // Draw zero if required
                    if (prop.yaxisScaleZerostart || prop.yaxisScaleMin !== 0) {

                        RGraph.text({
                            
                       object: this,

                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,
                            
                            x:      this.marginLeft - 5 + offsetx,
                            y:      this.getYCoord(prop.yaxisScaleMin || 0),
                            text:   RGraph.numberFormat({
                                        object:    this,
                                        number:    String(Number(prop.yaxisScaleMin || 0).toFixed(prop.yaxisScaleMin === 0 ? 0 : prop.yaxisScaleDecimals)),
                                        unitspre:  prop.yaxisScaleUnitsPre,
                                        unitspost: prop.yaxisScaleUnitsPost
                                    }),
                            valign: 'center',
                            halign: 'right',
                            tag:    'scale'
                        });
                    }
                }
            }
    
    
    

            // Now, draw the X axis labels
            if (prop.xaxisLabels.length > 0) {
            
                // Recalculate the interval for the X labels
                interval = (this.canvas.width - this.marginLeft - this.marginRight) / prop.xaxisLabels.length;
                
                var halign = 'center',
                    valign = 'top',
                    angle  = prop.xaxisLabelsAngle;
                
                if (angle) {
                    halign = 'right';
                    angle *= -1;
                }
    
                var labels      = prop.xaxisLabels,
                    offsetx     = prop.xaxisLabelsOffsetx,
                    offsety     = prop.xaxisLabelsOffsety;

                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'xaxisLabels'
                });

                for (var i=0,len=labels.length; i<len; i+=1) {
                    RGraph.text({
                            
                   object: this,
                     
                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,
   
                        x:      this.marginLeft + (i * interval) + (interval / 2) + offsetx,
                        y:      this.canvas.height - this.marginBottom + this.halfTextHeight + offsety,
                        text:   labels[i],
                        valign: valign,
                        halign: halign,
                        angle:  angle,
                        tag:    'labels'
                    });
                }
            }
            
            this.context.stroke();
            this.context.fill();




            //
            // Draw the labelsAbove labels
            //
            if (prop.labelsAbove) {
                this.drawLabelsAbove();
            }
        };








        //
        // This function draws all of the above labels
        //
        this.drawLabelsAbove = function ()
        {
            var data      = this.data,
                unitsPre  = prop.labelsAboveUnitsPre,
                unitsPost = prop.labelsAboveUnitsPost,
                decimals  = prop.labelsAboveDecimals,
                thousand  = prop.labelsAboveThousand,
                point     = prop.labelsAbovePoint,
                formatter = prop.labelsAboveFormatter;

            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'labelsAbove'
            });

            for (var i=0; i<this.data.length + (prop.total ? 1 : 0); ++i) {

                // Is this the "total" column
                if (prop.total && i === this.data.length) {
                    var isTotal = true;
                }
                
                // Get the value
                var value = Number(isTotal ? this.total : this.data[i]);
                
                // Determine the color based on whether the value is positive,
                // negative or the total
                if (typeof prop.labelsAboveColor === 'object' && prop.labelsAboveColor) {
                    if (isTotal && typeof prop.labelsAboveColor[2] === 'string') {
                        color = prop.labelsAboveColor[2];
                    } else if (this.data[i] < 0) {
                        color = prop.labelsAboveColor[1];
                    } else {
                        color = prop.labelsAboveColor[0];
                    }
                }
                
                
                // Do the color handling again if this is the last
                // label (and its an object) but using the
                // labelsAboveLastColor property if it's set
                if (typeof prop.labelsAboveTotalColor === 'object' && prop.labelsAboveTotalColor) {
                    if (   isTotal
                        && typeof prop.labelsAboveTotalColor[0] === 'string'
                        && typeof prop.labelsAboveTotalColor[1] === 'string'
                        ) {

                        if (this.total < 0) {
                            color = prop.labelsAboveTotalColor[1];
                        } else {
                            color = prop.labelsAboveTotalColor[0];
                        }
                    }
                }

                var coords = this.coords[i];




                // This code is repeated below for the last label. Temporarily
                // set the point and thousand properies because the numberFormat
                // function is dumb. These properties are reset after the last
                // label has been formatted
                var tmpScaleThousand = prop.yaxisScaleThousand,
                    tmpScalePoint    = prop.yaxisScaleDecimal;

                prop.yaxisScaleThousand = prop.labelsAboveThousand;
                prop.yaxisScalePoint    = prop.labelsAbovePoint;

                // Custom formatting or use the numberFormat function
                if (formatter) {
                    var str = (formatter)({
                        object: this,
                        value: value,
                        index: i
                    });
                } else {
                    var str = RGraph.numberFormat({
                        object:    this,
                        number:    String(value.toFixed(decimals)),
                        unitspre:  unitsPre,
                        unitspost: unitsPost,
                        point:     point,
                        thousand:  thousand
                    });
                }








                // Allow for the styling of the last label
                if (isTotal || i === this.data.length) {

                    if (typeof prop.labelsAboveTotalFont       === 'string')    textConf.font   = prop.labelsAboveTotalFont;
                    if (typeof prop.labelsAboveTotalColor      === 'string')    textConf.color  = prop.labelsAboveTotalColor;
                    if (typeof prop.labelsAboveTotalSize       === 'number')    textConf.size   = prop.labelsAboveTotalSize;
                    if (!RGraph.isNull(prop.labelsAboveTotalBold))                  textConf.bold   = prop.labelsAboveTotalBold;
                    if (!RGraph.isNull(prop.labelsAboveTotalItalic))                textConf.italic = prop.labelsAboveTotalItalic;
                    if (typeof prop.labelsAboveTotalUnitsPre  === 'string')    unitsPre        = prop.labelsAboveTotalUnitsPre;
                    if (typeof prop.labelsAboveTotalUnitsPost === 'string')    unitsPost       = prop.labelsAboveTotalUnitsPost;
                    if (typeof prop.labelsAboveTotalDecimals   === 'number')    decimals        = prop.labelsAboveTotalDecimals;
                    if (typeof prop.labelsAboveTotalFormatter  === 'function')  formatter       = prop.labelsAboveTotalFormatter;
                    if (typeof prop.labelsAboveTotalThousand   === 'string')    thousand        = prop.labelsAboveTotalThousand;
                    if (typeof prop.labelsAboveTotalPoint      === 'string')    point           = prop.labelsAboveTotalPoint;




                    // Custom formatting or use the numberFormat function
                    // This code is repeated just up above
                    if (formatter) {
                        var str = (formatter)({
                            object: this,
                            value: value,
                            index: i
                        });
                    } else {

                        str = RGraph.numberFormat({
                            object:    this,
                            number:    String(value.toFixed(decimals)),
                            unitspre:  unitsPre,
                            unitspost: unitsPost,
                            point:     point,
                            thousand:  thousand
                        });
                    }



                    // These two variables can now be reset to what they were when we
                    // started
                    prop.yaxisScaleThousand = tmpScaleThousand;
                    prop.yaxisScalePoint    = tmpScalePoint;
                }

                // Allow for specific labels
                if (   typeof prop.labelsAboveSpecific === 'object'
                    && !RGraph.isNull(prop.labelsAboveSpecific)
                   ) {
                   
                   if ( typeof prop.labelsAboveSpecific[i] === 'string' || typeof prop.labelsAboveSpecific[i] === 'number' ) {
                       str = prop.labelsAboveSpecific[i];
                   } else {
                       str = '';
                   }
                }


                RGraph.text({
                            
               object: this,

                 font: textConf.font,
                 size: textConf.size,
                color: textConf.color,
                 bold: textConf.bold,
               italic: textConf.italic,

                    x:      coords[0] + (coords[2] / 2) + prop.labelsAboveOffsetx,
                    y:      (isTotal ? this.total : this.data[i]) >= 0 ? (coords[1] - 3 - prop.labelsAboveOffsety) : (coords[1] + coords[3] + 3 + prop.labelsAboveOffsety),
                    text:   str,
                    valign: (isTotal ? this.total : this.data[i]) >= 0 ? 'bottom' : 'top',
                    halign: 'center',
                    tag:    'labels.above'
                });
            }
        };








        //
        // Draws the bars on to the chart
        //
        this.drawbars = function ()
        {
            var context      = this.context,
                canvas       = this.canvas,
                hmargin      = prop.marginInner,
                runningTotal = 0;
    
            this.context.lineWidth = prop.linewidth + 0.001;

            for (var i=0,len=this.data.length,seq=0; i<len; ++i,++seq) {
                
                this.context.beginPath();
                    
                    this.context.strokeStyle = prop.colorsStroke;

                    var x = Math.round( this.marginLeft + hmargin + (((this.graphwidth / (this.data.length + (prop.total ? 1 : 0))) * i) * prop.multiplierX));
                    
                    // Must be before the y coord calculation
                    var h  = this.getYCoord(0) - this.getYCoord(Math.abs(this.data[i]));

                    
                    
                    // Work out the Y coordinate
                    if (i === 0) {
                        y = this.getYCoord(0) - h;
                    } else {
                        y = this.getYCoord(runningTotal) - h;
                    }
                    y = Math.round(y);
                    




                    var w = ((this.canvas.width - this.marginLeft - this.marginRight) / (this.data.length + (prop.total ? 1 : 0 )) ) - (2 * prop.marginInner);
                        w = w * prop.multiplierW;


                    // Adjust the coords for negative values
                    if (this.data[i] < 0) {
                        y += h;
                    }

                    
                    // Allow for sequential colors
                    if (prop.colorsSequential) {
                        this.context.fillStyle = prop.colors[seq];
                    } else {
                        // Color
                        this.context.fillStyle = this.data[i] >= 0 ? prop.colors[0] : prop.colors[1];
                    }

                    
                    if (prop.shadow) {
                        RGraph.setShadow({
                            object: this,
                            prefix: 'shadow'
                        });
                    } else {
                        RGraph.noShadow(this);
                    }

                    //
                    // Draw the bar
                    //
                    this.context.rect(
                        x + prop.barOffsetx,
                        Math.floor(y) + prop.barOffsety,
                        w,
                        Math.floor(h)
                    );

                    this.coords.push([x, y, w, h]);
                    


                    runningTotal += this.data[i];

                this.context.stroke();
                this.context.fill();
            }

            // Store the total
            this.total = runningTotal;

            if (prop.total) {

                // This is the height of the final bar
                h = this.getYCoord(0) - this.getYCoord(Math.abs(runningTotal));

                // Set the Y (ie the start point) value
                if (prop.xaxisPosition == 'center') {
                    y = runningTotal > 0 ? this.getYCoord(0) - h : this.getYCoord(0);
                } else {
                    if (runningTotal > 0) {
                        y = this.getYCoord(0) - h;
                    } else {
                        y = this.getYCoord(0);
                    }
                }
            
                // This is the X position of the final bar
                x = x + (prop.marginInner * 2) + w;
            
                
                // Allow for sequential colors
                if (prop.colorsSequential) {
                    this.context.fillStyle = prop.colors[seq]
                } else {
                    // Final color
                    this.context.fillStyle = prop.colors[2];
                }
            
                path({
                  object: this,
                    path: 'b r % % % % s % f %',
                    args: [
                        x + prop.barOffsetx, y + prop.barOffsety, w, h,
                        this.context.strokeStyle,
                        this.context.fillStyle
                    ]
                });

                // This is set so that the next iteration of the loop will be able to
                // access THIS iterations coordinates
                var previousCoords = [x, y, w, Math.abs(h)];

                // Add the coordinates to the coords array (the previousCooords array, at
                // this point, is actually THIS iterations coords 
                this.coords.push(previousCoords);
            }





            // Turn off the shadow
            RGraph.noShadow(this);






            //
            // This draws the connecting lines
            //
            this.context.lineWidth   = 1;
            this.context.strokeStyle = '#666';
            
            this.context.beginPath();

            for (var i=1,len=this.coords.length; i<len; i+=1) {

                var prev     = this.coords[i - 1],
                    curr     = this.coords[i],
                    prevData = this.data[i-1];

                // CANNOT be a part of the var chain above
                var y = (prevData > 0 ? prev[1] : prev[1] + prev[3]);


                this.context.moveTo(
                    prev[0] + prev[2] + prop.barOffsetx,
                    y + prop.barOffsety
                );

                this.context.lineTo(
                    curr[0] + prop.barOffsetx,
                    (prevData > 0 ? prev[1] : prev[1] + prev[3]) + prop.barOffsety
                );

            }
            
            this.context.stroke();
        };








        //
        // Not used by the class during creating the graph, but is used by event handlers
        // to get the coordinates (if any) of the selected bar
        // 
        // @param object e The event object
        //
        this.getShape = function (e)
        {
            //
            // Loop through the bars determining if the mouse is over a bar
            //
            for (var i=0,len=this.coords.length; i<len; i++) {
    
                var mouseXY = RGraph.getMouseXY(e),
                    mouseX  = mouseXY[0],
                    mouseY  = mouseXY[1];
    
                var left   = this.coords[i][0],
                    top    = this.coords[i][1],
                    width  = this.coords[i][2],
                    height = this.coords[i][3];
    
                if (   mouseX >= left
                    && mouseX <= (left + width)
                    && mouseY >= top
                    && mouseY <= top + height) {
                    
                    var tooltip = RGraph.parseTooltipText(prop.tooltips, i);
    
                    return {
                        0: this,   object: this,
                        1: left,   x:      left,
                        2: top,    y:      top,
                        3: width,  width:  width,
                        4: height, height: height,
                        5: i,      index:  i,
                                   tooltip: tooltip
                    };
                }
            }
            
            return null;
        };








        //
        // The Waterfall is slightly different to Bar/Line charts so has this function to get the max value
        //
        this.getMax = function (data)
        {
            var runningTotal = 0, max = 0;
    
            for (var i=0,len=data.length; i<len; i+=1) {
                runningTotal += data[i];
                
                max = Math.max(Math.abs(runningTotal), max);
            }

            return Math.abs(max);
        };








        //
        // This function facilitates the installation of tooltip event
        // listeners if tooltips are defined.
        //
        this.allowTooltips = function ()
        {
            // Preload any tooltip images that are used in the tooltips
            RGraph.preLoadTooltipImages(this);
    
    
            //
            // This installs the window mousedown event listener that lears any
            // highlight that may be visible.
            //
            RGraph.installWindowMousedownTooltipListener(this);
    
    
            //
            // This installs the canvas mousemove event listener. This function
            // controls the pointer shape.
            //
            RGraph.installCanvasMousemoveTooltipListener(this);
    
    
            //
            // This installs the canvas mouseup event listener. This is the
            // function that actually shows the appropriate tooltip (if any).
            //
            RGraph.installCanvasMouseupTooltipListener(this);
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
        // This method returns the appropriate Y coord for the given value
        // 
        // @param number value The value
        //
        this.getYCoord = function (value)
        {
            if (prop.xaxisPosition == 'center') {
    
                if (value < (-1 * this.max)) {
                    return null;
                }
            
                var coord = (value / this.max) * (this.grapharea / 2);    
                return this.marginTop + (this.grapharea / 2) - coord;
            
            } else {

                var coord = ( (value - this.scale2.min) / (this.max - this.scale2.min) ) * this.grapharea;
                    coord = coord + this.marginBottom;

                return this.canvas.height - coord;
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
                this.original_colors.crosshairsColor       = RGraph.arrayClone(prop.crosshairsColor);
                this.original_colors.highlightStroke       = RGraph.arrayClone(prop.highlightStroke);
                this.original_colors.highlightFill         = RGraph.arrayClone(prop.highlightFill);
                this.original_colors.backgroundBarsColor1  = RGraph.arrayClone(prop.backgroundBarsColor1);
                this.original_colors.backgroundBarsColor2  = RGraph.arrayClone(prop.backgroundBarsColor2);
                this.original_colors.backgroundGridColor   = RGraph.arrayClone(prop.backgroundGridColor);
                this.original_colors.colorsStroke          = RGraph.arrayClone(prop.colorsStroke);
                this.original_colors.axesColor             = RGraph.arrayClone(prop.axesColor);
            }


            // Colors
            var colors = prop.colors;

            if (colors) {
                for (var i=0,len=colors.length; i<len; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }
    
            // keyColors
            var colors = prop.keyColors;

            if (colors) {
                for (var i=0,len=colors.length; i<len; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }
    
             prop.crosshairsColor        = this.parseSingleColorForGradient(prop.crosshairsColor);
             prop.highlightStroke        = this.parseSingleColorForGradient(prop.highlightStroke);
             prop.highlightFill          = this.parseSingleColorForGradient(prop.highlightFill);
             prop.backgroundBarsColor1  = this.parseSingleColorForGradient(prop.backgroundBarsColor1);
             prop.backgroundBarsColor2  = this.parseSingleColorForGradient(prop.backgroundBarsColor2);
             prop.backgroundGridColor   = this.parseSingleColorForGradient(prop.backgroundGridColor);
             prop.colorsStroke           = this.parseSingleColorForGradient(prop.colorsStroke);
             prop.axesColor              = this.parseSingleColorForGradient(prop.axesColor);
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
        // @param string color The color to parse for gradients
        //
        this.parseSingleColorForGradient = function (color)
        {
            if (!color || typeof color != 'string') {
                return color;
            }

            if (typeof color === 'string' && color.match(/^gradient\((.*)\)$/i)) {

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
        // This function runs once only
        // (put at the end of the file (before any effects))
        //
        this.firstDrawFunc = function ()
        {
        };








        //
        // Waterfall Grow
        // 
        // @param object Options. You can pass frames here - which should be a number
        // @param function An optional function which is called when the animation is finished
        //
        this.grow = function ()
        {
            var opt      = arguments[0] || {};
            var callback = arguments[1] || function () {};
            var frames   = opt.frames || 30;
            var numFrame = 0;
            var obj      = this;
            var data     = RGraph.arrayClone(obj.data);
            
            //Reset The data to zeros
            for (var i=0,len=obj.data.length; i<len; ++i) {
                obj.data[i] /= frames;
            }
            
            //
            // Fix the scale
            //
            if (obj.get('yaxisScaleMax') == null) {
                var max   = obj.getMax(data);
                var scale2 = RGraph.getScale2(obj, {'scale.max': max});
                obj.set('yaxisScaleMax', scale2.max);
            }
    
            function iterator ()
            {
                for (var i=0; i<obj.data.length; ++i) {
                    
                    // This produces a very slight easing effect
                    obj.data[i] = data[i] * RGraph.Effects.getEasingMultiplier(frames, numFrame);
                }
                
                RGraph.clear(obj.canvas);
                RGraph.redrawCanvas(obj.canvas);
    
                if (++numFrame <= frames) {
                    RGraph.Effects.updateCanvas(iterator);
                } else {
                    callback(obj);
                }
            }
            
            iterator();
            
            return this;
        };








        //
        // Now, because canvases can support multiple charts, canvases must always be registered
        //
        RGraph.register(this);








        //
        // This is the 'end' of the constructor so if the first argument
        // contains configuration data - handle that.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);

        return this;
    };
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
    // The scatter graph constructor
    //
    RGraph.Scatter = function (conf)
    {
        this.data = new Array(conf.data.length);

       // Store the data set(s)
        this.data = RGraph.arrayClone(conf.data);


        // Account for just one dataset being given
        if (typeof conf.data === 'object' && typeof conf.data[0] === 'object' && (typeof conf.data[0][0] === 'number' || typeof conf.data[0][0] === 'string')) {
            var tmp = RGraph.arrayClone(conf.data);
            conf.data = new Array();
            conf.data[0] = RGraph.arrayClone(tmp);
            
            this.data = RGraph.arrayClone(conf.data);
        }



        // First, if there's only been a single passed to us, convert it to
        // the multiple dataset format
        if (!RGraph.isArray(this.data[0][0])) {
            this.data = [this.data];
        }







        // If necessary convert X/Y values passed as strings to numbers
        for (var i=0,len=this.data.length; i<len; ++i) { // Datasets
            for (var j=0,len2=this.data[i].length; j<len2; ++j) { // Points

                // Handle the conversion of X values
                if (typeof this.data[i][j] === 'object' && !RGraph.isNull(this.data[i][j]) && typeof this.data[i][j][0] === 'string') {
                    if (this.data[i][j][0].match(/^[.0-9]+$/)) {
                        this.data[i][j][0] = parseFloat(this.data[i][j][0]);
                    } else if (this.data[i][j][0] === '') {
                        this.data[i][j][0] = 0;
                    }
                }

                // Handle the conversion of Y values
                if (typeof this.data[i][j] === 'object' && !RGraph.isNull(this.data[i][j]) && typeof this.data[i][j][1] === 'string') {
                    if (this.data[i][j][1].match(/[.0-9]+/)) {
                        this.data[i][j][1] = parseFloat(this.data[i][j][1]);
                    } else if (this.data[i][j][1] === '') {
                        this.data[i][j][1] = 0;
                    }
                }
            }
        }


        this.id                = conf.id;
        this.canvas            = document.getElementById(this.id);
        this.canvas.__object__ = this;
        this.context           = this.canvas.getContext ? this.canvas.getContext('2d') : null;
        this.max               = 0;
        this.coords            = [];
        this.type              = 'scatter';
        this.isRGraph          = true;
        this.uid               = RGraph.createUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.createUID();
        this.colorsParsed      = false;
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false




        // Various config properties
        this.properties = {
            backgroundBarsCount:        null,
            backgroundBarsColor1:       'rgba(0,0,0,0)',
            backgroundBarsColor2:       'rgba(0,0,0,0)',
            backgroundHbars:            null,
            backgroundVbars:            null,
            backgroundGrid:             true,
            backgroundGridLinewidth:    1,
            backgroundGridColor:        '#ddd',
            backgroundGridHsize:        20,
            backgroundGridVsize:        20,
            backgroundGridVlines:       true,
            backgroundGridHlines:       true,
            backgroundGridBorder:       true,
            backgroundGridAutofit:      true,
            backgroundGridAutofitAlign: true,
            backgroundGridHlinesCount:  5,
            backgroundGridVlinesCount:  20,
            backgroundImage:            null,
            backgroundImageStretch:     true,
            backgroundImageX:           null,
            backgroundImageY:           null,
            backgroundImageW:           null,
            backgroundImageH:           null,
            backgroundImageAlign:       null,
            backgroundColor:            null,

            colorsBubbleGraduated:      true,
            
            textColor:                  'black',
            textFont:                   'Arial, Verdana, sans-serif',
            textSize:                   12,
            textBold:                   false,
            textItalic:                 false,
            textAccessible:             true,
            textAccessibleOverflow:     'visible',
            textAccessiblePointerevents:false,
            
            tooltips:                   [], // Default must be an empty array
            tooltipsEffect:             'fade',
            tooltipsEvent:              'onmousemove',
            tooltipsHotspot:            3,
            tooltipsCssClass:           'RGraph_tooltip',
            tooltipsHighlight:          true,
            tooltipsCoordsPage:         false,

            
            xaxis:                      true,
            xaxisPosition:              'bottom',
            xaxisTickmarksCount:        true,
            xaxisTickmarksLast:         true,
            xaxisTitle:                 '',
            xaxisTitleBold:             null,
            xaxisTitleSize:             null,
            xaxisTitleFont:             null,
            xaxisTitleColor:            null,
            xaxisTitleItalic:           null,
            xaxisTitlePos:              null,
            xaxisTitleX:                null,
            xaxisTitleY:                null,
            xaxisLabelsSpecificAlign:   'left',
            xaxisScale:                 false,
            xaxisScaleMin:              0,
            xaxisScaleMax:              null,
            xaxisScaleUnitsPre:         '',
            xaxisScaleUnitsPost:        '',
            xaxisScaleLabelsCount:      10,
            xaxisScaleFormatter:        null,
            xaxisScaleDecimals:         0,
            xaxisScaleThousand:         ',',
            xaxisScalePoint:            '.',
            xaxisLabelsAngle:           0,
            xaxisLabels:                [],
            xaxisLabelsBold:            null,
            xaxisLabelsItalic:          null,
            xaxisLabelsColor:           null,
            xaxisLabelsFont:            null,
            xaxisLabelsSize:            null,
            xaxisLabelsOffsetx:         0,
            xaxisLabelsOffsety:         0,

            yaxis:                      true,
            yaxisPosition:              'left',
            yaxisLabels:                true,
            yaxisLabelsOffsetx:         0,
            yaxisLabelsOffsety:         0,
            yaxisLabelsCount:           5,
            yaxisLabelsSpecific:        null,
            yaxisLabelsInside:          false,
            yaxisLabelsFont:            null,
            yaxisLabelsSize:            null,
            yaxisLabelsColor:           null,
            yaxisLabelsBold:            null,
            yaxisLabelsItalic:          null,
            yaxisTickmarksCount:        10,
            yaxisScaleInvert:           false,
            yaxisScaleUnitsPre:         '',
            yaxisScaleUnitsPost:        '',
            yaxisScaleMax:              null,
            yaxisScaleMin:              0,
            yaxisScaleDecimals:         0,
            yaxisScalePoint:            '.',
            yaxisScaleThousand:         ',',
            yaxisScaleZerostart:        true,
            yaxisTitle:                 '',
            yaxisTitleBold:             null,
            yaxisTitleItalic:           null,
            yaxisTitleSize:             null,
            yaxisTitleFont:             null,
            yaxisTitleColor:            null,
            yaxisTitlePos:              null,
            yaxisTitleX:                null,
            yaxisTitleY:                null,
            
            tickmarksStyle:             'cross',
            tickmarksStyleImageHalign:  'center',
            tickmarksStyleImageValign:  'center',
            tickmarksStyleImageOffsetx: 0,
            tickmarksStyleImageOffsety: 0,
            tickmarksSize:              5,
            
            marginLeft:                 25,
            marginRight:                25,
            marginTop:                  25,
            marginBottom:               30,

            title:                      '',
            titleBackground:            null,
            titleHpos:                  null,
            titleVpos:                  null,
            titleBold:                  null,
            titleItalic:                null,
            titleFont:                  null,
            titleSize:                  null,
            titleItalic:                null,
            titleX:                     null,
            titleY:                     null,
            titleHalign:                null,
            titleValign:                null,

            labelsIngraph:              null,
            labelsIngraphFont:          null,
            labelsIngraphSize:          null,
            labelsIngraphColor:         null,
            labelsIngraphBold:          null,
            labelsIngraphItalic:        null,
            labelsAbove:                false,
            labelsAboveSize:            null,
            labelsAboveFont:            null,
            labelsAboveColor:           null,
            labelsAboveBold:            null,
            labelsAboveItalic:          null,
            labelsAboveDecimals:        0,
            
            contextmenu:                null,
            
            colorsDefault:              'black',

            crosshairs:                 false,
            crosshairsHline:            true,
            crosshairsVline:            true,
            crosshairsColor:            '#333',
            crosshairsLinewidth:        1,
            crosshairsCoords:           false,
            crosshairsCoordsFixed:      true,
            crosshairsCoordsLabelsX:    'X',
            crosshairsCoordsLabelsY:    'Y',
            crosshairsCoordsFormatterX: null,
            crosshairsCoordsFormatterY: null,

            annotatable:                false,
            annotatableColor:           'black',
            annotatableLinewidth:       1,

            line:                       false,
            lineLinewidth:              1,
            lineColors:                 ['green', 'red','blue','orange','pink','brown','black','gray'],
            lineShadowColor:            'rgba(0,0,0,0)',
            lineShadowBlur:             2,
            lineShadowOffsetx:          3,
            lineShadowOffsety:          3,
            lineStepped:                false,
            lineVisible:                true,

            axes:                       true,
            axesColor:                  'black',
            axesLinewidth:              1,

            key:                        null,
            keyBackground:              'white',
            keyPosition:                'graph',
            keyHalign:                  'right',
            keyShadow:                  false,
            keyShadowColor:             '#666',
            keyShadowBlur:              3,
            keyShadowOffsetx:           2,
            keyShadowOffsety:           2,
            keyPositionGutterBoxed:     false,
            keyPositionX:               null,
            keyPositionY:               null,
            keyInteractive:             false,
            keyInteractiveHighlightChartFill: 'rgba(255,0,0,0.9)',
            keyInteractiveHighlightLabel:     'rgba(255,0,0,0.2)',
            keyColorShape:              'square',
            keyRounded:                 true,
            keyLinewidth:               1,
            keyColors:                  null,
            keyLabelsColor:             null,
            keyLabelsFont:              null,
            keyLabelsSize:              null,
            keyLabelsBold:              null,
            keyLabelsItalic:            null,
            keyLabelsOffsetx:           0,
            keyLabelsOffsety:           0,

            boxplotWidth:               10,
            boxplotCapped:              true,

            resizable:                  false,
            resizableHandleBackground:  null,

            eventsMousemove:            null,
            eventsClick:                null,

            highlightStroke:            'rgba(0,0,0,0)',
            highlightFill:              'rgba(255,255,255,0.7)',

            clearto:                    'rgba(0,0,0,0)',

            animationTrace:             false,
            animationTraceClip:         1
        }

        //
        // This allows the data points to be given as dates as well as numbers. Formats supported by RGraph.parseDate() are accepted.
        // 
        // ALSO: unrelated but this loop is also used to convert null values to an
        // empty array
        //
        for (var i=0; i<this.data.length; ++i) {
            for (var j=0; j<this.data[i].length; ++j) {
                
                // Convert null data points to an empty erray
                if ( RGraph.isNull(this.data[i][j]) ) {
                    this.data[i][j] = [];
                }

                // Allow for the X point to be dates
                if (this.data[i][j] && typeof(this.data[i][j][0]) == 'string') {
                    this.data[i][j][0] = RGraph.parseDate(this.data[i][j][0]);
                }
            }
        }


        //
        // Now make the data_arr array - all the data as one big array
        //
        this.data_arr = [];

        for (var i=0; i<this.data.length; ++i) {
            for (var j=0; j<this.data[i].length; ++j) {
                this.data_arr.push(this.data[i][j]);
            }
        }

        // Create the $ objects so that they can be used
        for (var i=0; i<this.data_arr.length; ++i) {
            this['$' + i] = {}
        }


        // Check for support
        if (!this.canvas) {
            alert('[SCATTER] No canvas support');
            return;
        }


        //
        // Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        // done already
        //
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            
            this.canvas.__rgraph_aa_translated__ = true;
        }



        // Shorter variable names
        var prop = this.properties,
            path = RGraph.path;       
        
        
        //
        // "Decorate" the object with the generic effects if the effects library has been included
        //
        if (RGraph.Effects && typeof RGraph.Effects.decorate === 'function') {
            RGraph.Effects.decorate(this);
        }








        //
        // A simple setter
        // 
        // @param string name  The name of the property to set
        // @param string value The value of the property
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
        // A simple getter
        // 
        // @param string name  The name of the property to set
        //
        this.get = function (name)
        {
            return prop[name];
        };








        //
        // The function you call to draw the Scatter chart
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
            // Parse the colors. This allows for simple gradient syntax
            //
            if (!this.colorsParsed) {
                this.parseColors();
                
                // Don't want to do this again
                this.colorsParsed = true;
            }
    



            //
            // Stop this growing uncontrollably
            //
            this.coordsText = [];



            //
            // Make the margins easy ro access
            //
            this.marginLeft   = prop.marginLeft;
            this.marginRight  = prop.marginRight;
            this.marginTop    = prop.marginTop;
            this.marginBottom = prop.marginBottom;
    
            // Go through all the data points and see if a tooltip has been given
            this.hasTooltips = false;
            var overHotspot  = false;
    
            // Reset the coords array
            this.coords = [];
    
            //
            // This facilitates the xmax, xmin and X values being dates
            //
            if (typeof(prop.xaxisScaleMin) == 'string') prop.xaxisScaleMin = RGraph.parseDate(prop.xaxisScaleMin);
            if (typeof(prop.xaxisScaleMax) == 'string') prop.xaxisScaleMax = RGraph.parseDate(prop.xaxisScaleMax);

            //
            // Look for tooltips and populate the tooltips
            // 
            // NB 26/01/2011 Updated so that the tooltips property is ALWAYS populated
            //
            //if (!RGraph.ISOLD) {
                this.set('tooltips', []);
                for (var i=0,len=this.data.length; i<len; i+=1) {
                    for (var j =0,len2=this.data[i].length;j<len2; j+=1) {
    
                        if (this.data[i][j] && this.data[i][j][3]) {
                            prop.tooltips.push(this.data[i][j][3]);
                            this.hasTooltips = true;
                        } else {
                            prop.tooltips.push(null);
                        }
                    }
                }
            //}
    
            // Reset the maximum value
            this.max = 0;
    
            // Work out the maximum Y value
            //if (prop.ymax && prop.ymax > 0) {
            if (typeof prop.yaxisScaleMax === 'number') {

                this.max   = prop.yaxisScaleMax;
                this.min   = prop.yaxisScaleMin ? prop.yaxisScaleMin : 0;


                this.scale2 = RGraph.getScale2(this, {
                    'scale.max':          this.max,
                    'scale.min':          this.min,
                    'scale.strict':       true,
                    'scale.thousand':     prop.yaxisScaleThousand,
                    'scale.point':        prop.yaxisScalePoint,
                    'scale.decimals':     prop.yaxisScaleDecimals,
                    'scale.labels.count': prop.yaxisLabelsCount,
                    'scale.round':        prop.yaxisScaleRound,
                    'scale.units.pre':    prop.yaxisScaleUnitsPre,
                    'scale.units.post':   prop.yaxisScaleUnitsPost
                });
                
                this.max = this.scale2.max;
                this.min = this.scale2.min;
                var decimals = prop.yaxisScaleDecimals;
    
            } else {
    
                var i = 0;
                var j = 0;

                for (i=0,len=this.data.length; i<len; i+=1) {
                    for (j=0,len2=this.data[i].length; j<len2; j+=1) {
                        if (!RGraph.isNull(this.data[i][j]) && this.data[i][j][1] != null) {
                            this.max = Math.max(this.max, typeof(this.data[i][j][1]) == 'object' ? RGraph.arrayMax(this.data[i][j][1]) : Math.abs(this.data[i][j][1]));
                        }
                    }
                }
    
                this.min   = prop.yaxisScaleMin ? prop.yaxisScaleMin : 0;

                this.scale2 = RGraph.getScale2(this, {
                    'scale.max':          this.max,
                    'scale.min':          this.min,
                    'scale.thousand':     prop.yaxisScaleThousand,
                    'scale.point':        prop.yaxisScalePoint,
                    'scale.decimals':     prop.yaxisScaleDecimals,
                    'scale.labels.count': prop.yaxisLabelsCount,
                    'scale.round':        prop.yaxisScaleRound,
                    'scale.units.pre':    prop.yaxisScaleUnitsPre,
                    'scale.units.post':   prop.yaxisScaleUnitsPost
                });

                this.max = this.scale2.max;
                this.min = this.scale2.min;
            }
    
            this.grapharea = this.canvas.height - this.marginTop - this.marginBottom;
    
    

            // Progressively Draw the chart
            RGraph.Background.draw(this);
    
            //
            // Draw any horizontal bars that have been specified
            //
            if (prop.backgroundHbars && prop.backgroundHbars.length) {
                RGraph.drawBars(this);
            }
    
            //
            // Draw any vertical bars that have been specified
            //
            if (prop.backgroundVbars && prop.backgroundVbars.length) {
                this.drawVBars();
            }
    
            if (prop.axes) {
                this.drawAxes();
            }
    
            this.drawLabels();

            // Clip the canvas so that the trace2 effect is facilitated
            if (prop.animationTrace) {
                this.context.save();
                this.context.beginPath();
                this.context.rect(0, 0, this.canvas.width * prop.animationTraceClip, this.canvas.height);
                this.context.clip();
            }

                for(i=0; i<this.data.length; ++i) {
                    this.drawMarks(i);
        
                    // Set the shadow
                    this.context.shadowColor   = prop.lineShadowColor;
                    this.context.shadowOffsetX = prop.lineShadowOffsetx;
                    this.context.shadowOffsetY = prop.lineShadowOffsety;
                    this.context.shadowBlur    = prop.lineShadowBlur;
    
                    this.drawLine(i);
        
                    // Turn the shadow off
                    RGraph.noShadow(this);
                }
        
        
                if (prop.line) {
                    for (var i=0,len=this.data.length;i<len; i+=1) {
                        this.drawMarks(i); // Call this again so the tickmarks appear over the line
                    }
                }
            
            if (prop.animationTrace) {
                this.context.restore();
            }
    
    
    
            //
            // Setup the context menu if required
            //
            if (prop.contextmenu) {
                RGraph.showContext(this);
            }
    
            
            
            //
            // Draw the key if necessary
            //
            if (prop.key && prop.key.length) {
                RGraph.drawKey(this, prop.key, prop.lineColors);
            }
    
    
            //
            // Draw " above" labels if enabled
            //
            if (prop.labelsAbove) {
                this.drawAboveLabels();
            }
    
            //
            // Draw the "in graph" labels, using the member function, NOT the shared function in RGraph.common.core.js
            //
            this.drawInGraphLabels(this);
    
            
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
        }








        //
        // Draws the axes of the scatter graph
        //
        this.drawAxes = function ()
        {
            var graphHeight = this.canvas.height - this.marginTop - this.marginBottom;

            this.context.beginPath();
            this.context.strokeStyle = prop.axesColor;
            this.context.lineWidth   = (prop.axesLinewidth || 1) + 0.001; // Strange Chrome bug

            // Draw the Y axis
            if (prop.yaxis) {
                if (prop.yaxisPosition == 'left') {
                    this.context.moveTo(this.marginLeft, this.marginTop);
                    this.context.lineTo(this.marginLeft, this.canvas.height - this.marginBottom);
                } else {
                    this.context.moveTo(this.canvas.width - this.marginRight, this.marginTop);
                    this.context.lineTo(this.canvas.width - this.marginRight, this.canvas.height - this.marginBottom);
                }
            }
    
    
            // Draw the X axis
            if (prop.xaxis) {
                if (prop.xaxisPosition == 'center') {
                    this.context.moveTo(this.marginLeft, Math.round(this.marginTop + ((this.canvas.height - this.marginTop - this.marginBottom) / 2)));
                    this.context.lineTo(this.canvas.width - this.marginRight, Math.round(this.marginTop + ((this.canvas.height - this.marginTop - this.marginBottom) / 2)));
                } else {
                    
                    var y = this.getYCoord(this.scale2.min > 0 ? this.scale2.min : 0);
                    
                    // Strange bug - easier just to account for it specifically
                    if (prop.yaxisScaleInvert && this.scale2.min === 0) {
                        y = this.canvas.height - this.marginBottom;
                    }

                    this.context.moveTo(this.marginLeft, y);
                    this.context.lineTo(this.canvas.width - this.marginRight, y);
                }
            }
    
            // Draw the Y tickmarks
            if (prop.yaxis) {

                var numyticks = prop.yaxisTickmarksCount;

                for (i=0; i<numyticks; ++i) {
        
                    var y = ((this.canvas.height - this.marginTop - this.marginBottom) / numyticks) * i;
                        y = y + this.marginTop;
                    
                    if (prop.xaxisPosition == 'center' && i == (numyticks / 2)) {
                        continue;
                    }

                    if (prop.yaxisPosition == 'left') {
                        this.context.moveTo(this.marginLeft, Math.round(y));
                        this.context.lineTo(this.marginLeft - 3, Math.round(y));
                    } else {
                        this.context.moveTo(this.canvas.width - this.marginRight +3, Math.round(y));
                        this.context.lineTo(this.canvas.width - this.marginRight, Math.round(y));
                    }
                }
                
                //
                // Draw the end Y tickmark if the X axis is in the centre
                //
                if (prop.yaxisTickmarksCount > 0) {
                    if (prop.xaxisPosition === 'center' && prop.yaxisPosition == 'left') {
                        this.context.moveTo(this.marginLeft, Math.round(this.canvas.height - this.marginBottom));
                        this.context.lineTo(this.marginLeft - 3, Math.round(this.canvas.height - this.marginBottom));
                    } else if (prop.xaxisPosition === 'center'  && prop.yaxisPosition == 'right') {
                        this.context.moveTo(
                            this.canvas.width - this.marginRight + 3,
                            Math.round(this.canvas.height - this.marginBottom)
                        );
                        
                        this.context.lineTo(
                            this.canvas.width - this.marginRight,
                            Math.round(this.canvas.height - this.marginBottom)
                        );
                    }
                }
    
                //
                // Draw an extra tick if the X axis isn't being shown
                //
                if (!prop.xaxis && prop.yaxisPosition === 'left') {
                    this.context.moveTo(this.marginLeft, Math.round(this.canvas.height - this.marginBottom));
                    this.context.lineTo(this.marginLeft - 3, Math.round(this.canvas.height - this.marginBottom));
                } else if (!prop.xaxis && prop.yaxisPosition === 'right') {
                    this.context.moveTo(this.canvas.width - this.marginRight, Math.round(this.canvas.height - this.marginBottom));
                    this.context.lineTo(this.canvas.width - this.marginRight + 3, Math.round(this.canvas.height - this.marginBottom));
                }





                //
                // If: the X axis is offset
                //     the Y axis is being shown
                //     there are Y tickmarks
                //
                if (
                       prop.xaxisPosition === 'bottom'
                    && prop.yaxisTickmarksCount > 0
                    && prop.yaxisScaleMin < 0
                   ) {

                    if (prop.yaxisPosition == 'left') {
                        this.context.moveTo(this.marginLeft, Math.round(this.getYCoord(prop.yaxisScaleMin)));
                        this.context.lineTo(this.marginLeft - 3, Math.round(this.getYCoord(prop.yaxisScaleMin)));
                    } else {
                        this.context.moveTo(this.canvas.width - this.marginRight +3, Math.round(this.getYCoord(prop.yaxisScaleMin)));
                        this.context.lineTo(this.canvas.width - this.marginRight, Math.round(this.getYCoord(prop.yaxisScaleMin)));
                    }
                }
            }








            //
            // Draw the X tickmarks
            //
            if (prop.xaxisTickmarksCount > 0 && prop.xaxis) {

                var x    = 0,
                    y    = this.getYCoord(prop.yaxisScaleInvert ? this.scale2.max : (this.scale2.max > 0 && this.scale2.min > 0 ? this.scale2.min : 0) ) - 3,
                    size = 3;

                if (prop.yaxisScaleMin === 0 && prop.xaxisPosition === 'bottom') {
                    y += 3;
                }

                if (this.scale2.max > 0 && this.scale2.min > 0) {
                    y += 3;
                }

                this.xTickGap = (prop.xaxisLabels && prop.xaxisLabels.length) ? ((this.canvas.width - this.marginLeft - this.marginRight ) / prop.xaxisLabels.length) : (this.canvas.width - this.marginLeft - this.marginRight) / 10;
    
                //
                // This allows the number of X tickmarks to be specified
                //
                if (typeof(prop.xaxisTickmarksCount) == 'number') {
                    this.xTickGap = (this.canvas.width - this.marginLeft - this.marginRight) / prop.xaxisTickmarksCount;
                }
    
    
                for (x=(this.marginLeft + (prop.yaxisPosition == 'left' && prop.yaxis ? this.xTickGap : 0) );
                     x <= (this.canvas.width - this.marginRight - (prop.yaxisPosition == 'left' || !prop.yaxis ? -1 : 1));
                     x += this.xTickGap) {
    
                    if (prop.yaxisPosition == 'left' && !prop.xaxisTickmarksLast && x == (this.canvas.width - this.marginRight) ) {
                        continue;
                    } else if (prop.yaxisPosition == 'right' && !prop.xaxisTickmarksLast && x == this.marginLeft) {
                        continue;
                    }

                    this.context.moveTo(Math.round(x), y);
                    this.context.lineTo(Math.round(x), y + (prop.xaxisPosition === 'center' || prop.yaxisScaleMin < 0 ? size * 2 : size));
                }
            }
    
            this.context.stroke();
            
            //
            // Reset the linewidth back to one
            //
            this.context.lineWidth = 1;
        };








        //
        // Draws the labels on the scatter graph
        //
        this.drawLabels = function ()
        {
            this.context.fillStyle   = prop.textColor;

            var font       = prop.textFont,
                xMin       = prop.xaxisScaleMin,
                xMax       = prop.xaxisScaleMax,
                yMax       = this.scale2.max,
                yMin       = prop.yaxisScaleMin ? prop.yaxisScaleMin : 0,
                text_size  = prop.textSize,
                units_pre  = prop.yaxisScaleUnitsPre,
                units_post = prop.yaxisScaleUnitsPost,
                numYLabels = prop.yaxisLabelsCount,
                invert     = prop.yaxisScaleInvert,
                inside     = prop.yaxisLabelsInside,
                context    = this.context,
                canvas     = this.canvas,
                boxed      = false,
                offsetx    = prop.yaxisLabelsOffsetx,
                offsety    = prop.yaxisLabelsOffsety

            this.halfTextHeight = text_size / 2;
    
    
            this.halfGraphHeight = (this.canvas.height - this.marginTop - this.marginBottom) / 2;
    
            //
            // Draw the Y yaxis labels, be it at the top or center
            //
            if (prop.yaxisLabels) {
    
                var xPos  = prop.yaxisPosition == 'left' ? this.marginLeft - 5 : this.canvas.width - this.marginRight + 5;
                var align = prop.yaxisPosition == 'right' ? 'left' : 'right';
                
                //
                // Now change the two things above if ylabelsInside is specified
                //
                if (inside) {
                    if (prop.yaxisPosition == 'left') {
                        xPos  = prop.marginLeft + 5;
                        align = 'left';
                        boxed = true;
                    } else {
                        xPos  = this.canvas.width - prop.marginRight - 5;
                        align = 'right';
                        boxed = true;
                    }
                }
                
                // Get the text configuration for the Y axis
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'yaxisLabels'
                });
    
                if (prop.xaxisPosition === 'center') {
    

                    //
                    // Specific Y labels
                    //
                    if (typeof(prop.yaxisLabelsSpecific) == 'object' && prop.yaxisLabelsSpecific != null && prop.yaxisLabelsSpecific.length) {
    
                        var labels = prop.yaxisLabelsSpecific;
                        
                        if (prop.yaxisScaleMin > 0) {
                            labels = [];
                            for (var i=0; i<(prop.yaxisLabelsSpecific.length - 1); ++i) {
                                labels.push(prop.yaxisLabelsSpecific[i]);
                            }
                        }
    
                        for (var i=0; i<labels.length; ++i) {
                            var y = this.marginTop + (i * (this.grapharea / (labels.length * 2) ) );
                            
                            RGraph.text({
                                
                          object: this,
                    
                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                                x:        xPos + offsetx,
                                y:        y + offsety,
                                text:     labels[i],
                                valign:   'center',
                                halign:   align,
                                bounding: boxed,
                                tag:      'labels.specific'
                            });
                        }
                        
                        var reversed_labels = RGraph.arrayReverse(labels);
                    
                        for (var i=0; i<reversed_labels.length; ++i) {
                            var y = this.marginTop + (this.grapharea / 2) + ((i+1) * (this.grapharea / (labels.length * 2) ) );
                            RGraph.text({
                                
                          object: this,
                    
                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                                x:        xPos + offsetx,
                                y:        y + offsety,
                                text:     reversed_labels[i],
                                valign:   'center',
                                halign:   align,
                                bounding: boxed,
                                tag:      'labels.specific'
                            });
                        }
                        
                        //
                        // Draw the center label if yaxisScaleMin is specified
                        //
                        if (prop.yaxisScaleMin != 0) {
                            RGraph.text({
                                
                          object: this,
                    
                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                                x:        xPos + offsetx,
                                y:        (this.grapharea / 2) + this.marginTop + offsety,
                                text:     prop.yaxisLabelsSpecific[prop.yaxisLabelsSpecific.length - 1],
                                valign:   'center',
                                halign:   align,
                                bounding: boxed,
                                tag:      'labels.specific'
                            });
                        }
                    }
    
    
                    if (!prop.yaxisLabelsSpecific && typeof numYLabels == 'number') {

                        //
                        // Draw the top half 
                        //
                        for (var i=0,len=this.scale2.labels.length; i<len; i+=1) {
    
                            //var value = ((this.max - this.min)/ numYLabels) * (i+1);
                            //value  = (invert ? this.max - value : value);
                            //if (!invert) value += this.min;
                            //value = value.toFixed(prop.scaleDecimals);
                        
                            if (!invert) { 
                                RGraph.text({
                                    
                              object: this,
                    
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                    x:            xPos + offsetx,
                                    y:            this.marginTop + this.halfGraphHeight - (((i + 1)/numYLabels) * this.halfGraphHeight) + offsety,
                                    valign:       'center',
                                    halign:       align,
                                    bounding:     boxed,
                                    boundingFill: 'white',
                                    text:         this.scale2.labels[i],
                                    tag:          'scale'
                                });
                            } else {
                                RGraph.text({
                                    
                              object: this,
                    
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                    x:            xPos + offsetx,
                                    y:            this.marginTop + this.halfGraphHeight - ((i/numYLabels) * this.halfGraphHeight) + offsety,
                                    valign:       'center',
                                    halign:       align,
                                    bounding:     boxed,
                                    boundingFill: 'white',
                                    text:         this.scale2.labels[this.scale2.labels.length - (i + 1)],
                                    tag:          'scale'
                                });
                            }
                        }
    
                        //
                        // Draw the bottom half
                        //
                        for (var i=0,len=this.scale2.labels.length; i<len; i+=1) {

                            //var value = (((this.max - this.min)/ numYLabels) * i) + this.min;
                            //    value = (invert ? value : this.max - (value - this.min)).toFixed(prop.scaleDecimals);
    
                            if (!invert) {
                                RGraph.text({
                                    
                              object: this,
                    
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                    x:            xPos + offsetx,
                                    y:            this.marginTop + this.halfGraphHeight + this.halfGraphHeight - ((i/numYLabels) * this.halfGraphHeight) + offsety,
                                    valign:       'center',
                                    halign:       align,
                                    bounding:     boxed,
                                    boundingFill: 'white',
                                    text:         '-' + this.scale2.labels[len - (i+1)],
                                    tag:          'scale'
                                });
                            } else {
                            
                                // This ensures that the center label isn't drawn twice
                                if (i == (len - 1)&& invert) {
                                    continue;
                                }
    
                                RGraph.text({
                                    
                              object: this,
                    
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                    x:            xPos + offsetx,
                                    y:            this.marginTop + this.halfGraphHeight + this.halfGraphHeight - (((i + 1)/numYLabels) * this.halfGraphHeight) + offsety,
                                    valign:       'center',
                                    halign:       align,
                                    bounding:     boxed,
                                    boundingFill: 'white',
                                    text:         '-' + this.scale2.labels[i],
                                    tag:          'scale'
                                });
                            }
                        }
    
    
    

                        // If ymin is specified draw that
                        if (!invert && (yMin > 0 || prop.yaxisScaleZerostart)) {

                            RGraph.text({
                                    
                              object: this,
                    
                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                                x:            xPos + offsetx,
                                y:            this.marginTop + this.halfGraphHeight + offsety,
                                valign:       'center',
                                halign:       align,
                                bounding:     boxed,
                                boundingFill: 'white',
                                text:         RGraph.numberFormat({
                                                  object:    this,
                                                  number:    yMin.toFixed(this.scale2.min === 0 ? 0 : prop.yaxisScaleDecimals),
                                                  unitspre:  units_pre,
                                                  unitspost: units_post
                                              }),
                                tag:          'scale'
                            });
                        }
                        
                        if (invert) {
                            RGraph.text({
                                    
                          object: this,
                    
                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                                x:            xPos + offsetx,
                                y:            this.marginTop + offsety,
                                valign:       'center',
                                halign:       align,
                                bounding:     boxed,
                                boundingFill: 'white',
                                text:         RGraph.numberFormat({
                                                  object:    this,
                                                  number:    yMin.toFixed(this.scale2.min === 0 ? 0 : prop.yaxisScaleDecimals),
                                                  unitspre:  units_pre,
                                                  unitspost: units_post
                                              }),
                                tag:          'scale'
                            });
                            
                            RGraph.text({
                                    
                              object: this,
                    
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                x:            xPos + offsetx,
                                y:            this.marginTop + (this.halfGraphHeight * 2) + offsety,
                                valign:       'center',
                                halign:       align,
                                bounding:     boxed,
                                boundingFill: 'white',
                                text:         '-' + RGraph.numberFormat({
                                                        object:    this,
                                                        number:    yMin.toFixed(this.scale2.min === 0 ? 0 : prop.yaxisScaleDecimals),
                                                        unitspre:  units_pre,
                                                        unitspost: units_post
                                                    }),
                                tag:          'scale'
                            });
                        }
                    }
        
                // This draws the Y axis labels when the X axis at the bottom
                } else {

                    var xPos  = prop.yaxisPosition == 'left' ? this.marginLeft - 5 : this.canvas.width - this.marginRight + 5;
                    var align = prop.yaxisPosition == 'right' ? 'left' : 'right';
    
                    if (inside) {
                        if (prop.yaxisPosition == 'left') {
                            xPos  = prop.marginLeft + 5;
                            align = 'left';
                            boxed = true;
                        } else {
                            xPos  = this.canvas.width - this.marginRight - 5;
                            align = 'right';
                            boxed = true;
                        }
                    }
    
                    //
                    // Specific Y labels
                    //
                    if (typeof prop.yaxisLabelsSpecific === 'object' && prop.yaxisLabelsSpecific) {
    
                        var labels = prop.yaxisLabelsSpecific;
                        
                        // Lose the last label
                        if (prop.yaxisScaleMin > 9999) {
                            labels = [];
                            for (var i=0; i<(prop.yaxisLabelsSpecific.length - 1); ++i) {
                                labels.push(prop.yaxisLabelsSpecific[i]);
                            }
                        }
    
                        for (var i=0,len=labels.length; i<len; i+=1) {
                            
                            var y = this.marginTop + (i * (this.grapharea / (len - 1)) );
    
                            RGraph.text({

                              object: this,
                    
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                x:        xPos + offsetx,
                                y:        y + offsety,
                                text:     labels[i],
                                halign:   align,
                                valign:   'center',
                                bounding: boxed,
                                tag:      'scale'
                            });
                        }

                    //
                    // X axis at the bottom with a scale
                    //
                    } else {

                        if (typeof numYLabels === 'number') {

                            if (invert) {
    
                                for (var i=0; i<numYLabels; ++i) {
    
                                    var interval = (this.canvas.height - this.marginTop - this.marginBottom) / numYLabels;
                                
                                    RGraph.text({
                                    
                                  object: this,
                    
                                    font:   textConf.font,
                                    size:   textConf.size,
                                    color:  textConf.color,
                                    bold:   textConf.bold,
                                    italic: textConf.italic,

                                        x:            xPos + offsetx,
                                        y:            this.marginTop + ((i+1) * interval) + offsety,
                                        valign:       'center',
                                        halign:       align,
                                        bounding:     boxed,
                                        boundingFill: 'white',
                                        text:         this.scale2.labels[i],
                                        tag:          'scale'
                                    });
                                }
    
        
                                // No X axis being shown and there's no ymin. If ymin IS set its added further down
                                if (!prop.xaxis && !prop.yaxisScaleMin) {

                                    RGraph.text({
                                    
                                  object: this,
                    
                                    font:   textConf.font,
                                    size:   textConf.size,
                                    color:  textConf.color,
                                    bold:   textConf.bold,
                                    italic: textConf.italic,

                                        x:            xPos + offsetx,
                                        y:            this.marginTop + offsety,
                                        valign:       'center',
                                        halign:       align,
                                        bounding:     boxed,
                                        boundingFill: 'white',
                                        text:         RGraph.numberFormat({
                                                        object:    this,
                                                        number:    this.min.toFixed(this.scale2.min === 0 ? 0 : prop.yaxisScaleDecimals),
                                                        unitspre:  units_pre,
                                                        unitspost: units_post
                                                      }),
                                        tag:          'scale'
                                    });
                                }
        
                            } else {

                                for (var i=0,len=this.scale2.labels.length; i<len; i+=1) {

                                    RGraph.text(this, {
                                    
                               object: this,
                    
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                        x:            xPos + offsetx,
                                        y:            this.marginTop + this.grapharea - (((i + 1)/this.scale2.labels.length) * this.grapharea) + offsety,
                                        valign:       'center',
                                        halign:       align,
                                        bounding:     boxed,
                                        boundingFill: 'white',
                                        text:         this.scale2.labels[i],
                                        tag:          'scale'
                                    });
                                }
    
                                if (!prop.xaxis && prop.yaxisScaleMin === 0) {
                                    RGraph.text({
                                    
                              object: this,
                    
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                        x:            xPos + offsetx,
                                        y:            this.canvas.height - this.marginBottom + offsety,
                                        valign:       'center',
                                        halign:       align,
                                        boundin:      boxed,
                                        boundingFill: 'white',
                                        text:         RGraph.numberFormat({
                                          object:    this,
                                          number:    (0).toFixed(this.scale2.min === 0 ? 0 : prop.yaxisScaleDecimals),
                                          unitspre:  units_pre,
                                          unitspost: units_post,
                                          point:     prop.yaxisScalePoint,
                                          thousand:  prop.yaxisScaleThousand
                                        }),
                                        tag:          'scale'
                                    });
                                }
                            }
                        }
                        
                        if ( (prop.yaxisScaleMin || prop.yaxisScaleZerostart) && !invert) {

                            RGraph.text({
                                    
                              object: this,
                    
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                x:            xPos + offsetx,
                                y:            this.canvas.height - this.marginBottom + offsety,
                                valign:       'center',
                                halign:       align,
                                bounding:     boxed,
                                boundingFill: 'white',
                                text:         RGraph.numberFormat({
                                   object:    this,
                                   number:    prop.yaxisScaleMin.toFixed(this.scale2.min === 0 ? 0 : prop.yaxisScaleDecimals),
                                   unitspre:  units_pre,
                                   unitspost: units_post,
                                   point: prop.yaxisScalePoint,
                                   thousand: prop.yaxisScaleThousand
                                }),
                                tag:          'scale'
                            });

                        } else if (invert) {
                            RGraph.text({
                                    
                              object: this,
                    
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                x:            xPos + offsetx,
                                y:            this.marginTop + offsety,
                                valign:       'center',
                                halign:       align,
                                bounding:     boxed,
                                boundingFill: 'white',
                                text:         RGraph.numberFormat({
                                   object:    this,
                                   number:    prop.yaxisScaleMin.toFixed(this.scale2.min === 0 ? 0 : prop.yaxisScaleDecimals),
                                   unitspre:  units_pre,
                                   unitspost: units_post,
                                   point: prop.yaxisScalePoint,
                                   thousand: prop.yaxisScaleThousand
                                }),
                                tag: 'scale'
                            });
                        }
                    }
                }
            }




            //
            // Draw an X scale
            //
            if (prop.xaxisScale) {

                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'xaxisLabels'
                });

                var numXLabels   = prop.xaxisScaleLabelsCount,
                    y            = this.canvas.height - this.marginBottom + 5 + (text_size / 2),
                    units_pre_x  = prop.xaxisScaleUnitsPre,
                    units_post_x = prop.xaxisScaleUnitsPost,
                    decimals     = prop.xaxisScaleDecimals,
                    point        = prop.xaxisScalePoint,
                    thousand     = prop.xaxisScaleThousand,
                    color        = prop.xaxisLabelsColor,
                    bold         = prop.xaxisLabelsBold,
                    offsetx      = prop.xaxisLabelsOffsetx,
                    offsety      = prop.xaxisLabelsOffsety,
                    angle        = prop.xaxisLabelsAngle;

                if (angle > 0) {
                    angle  *= -1;
                    valign  = 'center';
                    halign  = 'right';
                    y      += 5;
                } else {
                    valign  = 'center';
                    halign  = 'center';
                }

                if (!prop.xaxisScaleMax) {
                    
                    var xmax = 0;
                    var xmin = prop.xaxisScaleMin;
                    
                    for (var ds=0,len=this.data.length; ds<len; ds+=1) {
                        for (var point=0,len2=this.data[ds].length; point<len2; point+=1) {
                            xmax = Math.max(xmax, this.data[ds][point][0]);
                        }
                    }
                } else {
                    xmax = prop.xaxisScaleMax;
                    xmin = prop.xaxisScaleMin
                }

                this.xscale2 = RGraph.getScale2(this, {
                    'scale.max':          xmax,
                    'scale.min':          xmin,
                    'scale.decimals':     decimals,
                    'scale.point':        point,
                    'scale.thousand':     thousand,
                    'scale.units.pre':    units_pre_x,
                    'scale.units.post':   units_post_x,
                    'scale.labels.count': numXLabels,
                    'scale.strict':       true
                });

                this.set('xaxisScaleMax', this.xscale2.max);
                var interval = (this.canvas.width - this.marginLeft - this.marginRight) / this.xscale2.labels.length;
    
                for (var i=0,len=this.xscale2.labels.length; i<len; i+=1) {
                
                    var num  = ( (prop.xaxisScaleMax - prop.xaxisScaleMin) * ((i+1) / numXLabels)) + (xmin || 0),
                        x    = this.marginLeft + ((i+1) * interval),
                        
                        // Repeated a few lines down
                        text = typeof prop.xaxisScaleFormatter === 'function' ? String(prop.xaxisScaleFormatter(this, num)) : this.xscale2.labels[i];
    
                    RGraph.text({
                                    
                    object: this,

                    font:   textConf.font,
                    size:   textConf.size,
                    color:  textConf.color,
                    bold:   textConf.bold,
                    italic: textConf.italic,

                        x:      x + offsetx,
                        y:      y + offsety,
                        valign: valign,
                        halign: halign,
                        text:   text,
                        angle:  angle,
                        tag:    'xscale'
                    });
                }

                // If the Y axis is on the right hand side - draw the left most X label
                // ** Always added now **
                
                // Repeated a few lines up
                var text = typeof prop.xaxisScaleFormatter === 'function' ? String(prop.xaxisScaleFormatter(this, prop.xaxisScaleMin)) : String(prop.xaxisScaleMin);

                RGraph.text({
                                    
              object: this,

                font:   textConf.font,
                size:   textConf.size,
                color:  textConf.color,
                bold:   textConf.bold,
                italic: textConf.italic,

                    x:      this.marginLeft + offsetx,
                    y:      y + offsety,
                    valign: 'center',
                    halign: 'center',
                    text:   text,
                    tag:    'xscale',
                    angle:  angle
                });

            //
            // Draw X labels (as opposed to a scale as is done just above)
            //
            } else {

                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'xaxisLabels'
                });

                // Put the text on the X axis
                var graphArea = this.canvas.width - this.marginLeft - this.marginRight;
                var xInterval = graphArea / prop.xaxisLabels.length;
                var xPos      = this.marginLeft;
                var yPos      = (this.canvas.height - this.marginBottom) + 3;
                var labels    = prop.xaxisLabels;
                var color     = prop.xaxisLabelsColor;
                var bold      = prop.xaxisLabelsBold;
                var offsetx   = prop.xaxisLabelsOffsetx;
                var offsety   = prop.xaxisLabelsOffsety;

                //
                // Text angle
                //
                var angle  = 0;
                var valign = 'top';
                var halign = 'center';

                if (prop.xaxisLabelsAngle > 0) {
                    angle  = -1 * prop.xaxisLabelsAngle;
                    valign = 'center';
                    halign = 'right';
                    yPos += 10;
                }

                for (i=0; i<labels.length; ++i) {

                    if (typeof(labels[i]) == 'object') {

                        if (prop.xaxisLabelsSpecificAlign == 'center') {
                            var rightEdge = 0;
        
                            if (labels[i+1] && labels[i+1][1]) {
                                rightEdge = labels[i+1][1];
                            } else {
                                rightEdge = prop.xaxisScaleMax;
                            }
    
                            var offset = (this.getXCoord(rightEdge) - this.getXCoord(labels[i][1])) / 2;
    
                        } else {
                            var offset = 5;
                        }
                        
                        var xPos = this.getXCoord(labels[i][1]);
                        if (RGraph.isNull(xPos)) {
                            continue;
                        }

                        RGraph.text({
                                    
                      object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                            x:      xPos + offset + offsetx,
                            y:      yPos + offsety,
                            valign: valign,
                            halign: angle != 0 ? 'right' : (prop.xaxisLabelsSpecificAlign == 'center' ? 'center' : 'left'),
                            text:   String(labels[i][0]),
                            angle:  angle,
                            marker: false,
                            tag:    'labels.specific'
                        });
                        
                        //
                        // Draw the gray indicator line
                        //
                        this.context.beginPath();
                            this.context.strokeStyle = '#bbb';
                            this.context.moveTo(Math.round(this.marginLeft + (graphArea * ((labels[i][1] - xMin)/ (prop.xaxisScaleMax - xMin)))), this.canvas.height - this.marginBottom);
                            this.context.lineTo(Math.round(this.marginLeft + (graphArea * ((labels[i][1] - xMin)/ (prop.xaxisScaleMax - xMin)))), this.canvas.height - this.marginBottom + 20);
                        this.context.stroke();
                    
                    } else {

                        RGraph.text({
                                    
                      object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                            x:      xPos + (xInterval / 2) + offsetx,
                            y:      yPos + offsety,
                            valign: valign,
                            halign: halign,
                            text:   String(labels[i]),
                            angle:  angle,
                            tag:    'labels'
                        });
                    }
                    
                    // Do this for the next time around
                    xPos += xInterval;
                }







                //
                // Draw the final indicator line
                //
                if (typeof(labels[0]) == 'object') {
                    this.context.beginPath();
                        this.context.strokeStyle = '#bbb';
                        this.context.moveTo(this.marginLeft + graphArea, this.canvas.height - this.marginBottom);
                        this.context.lineTo(this.marginLeft + graphArea, this.canvas.height - this.marginBottom + 20);
                    this.context.stroke();
                }
            }
        };








        //
        // Draws the actual scatter graph marks
        // 
        // @param i integer The dataset index
        //
        this.drawMarks = function (i)
        {
            //
            //  Reset the coords array
            //
            this.coords[i] = [];
    
            //
            // Plot the values
            //
            var xmax          = prop.xaxisScaleMax;
            var default_color = prop.colorsDefault;

            for (var j=0,len=this.data[i].length; j<len; j+=1) {
                //
                // This is here because tooltips are optional
                //
                var data_points = this.data[i];
                
                // Allow for null points
                if (RGraph.isNull(data_points[j])) {
                    continue;
                }

                var xCoord = data_points[j][0];
                var yCoord = data_points[j][1];
                var color  = data_points[j][2] ? data_points[j][2] : default_color;
                var tooltip = (data_points[j] && data_points[j][3]) ? data_points[j][3] : null;
    
                
                this.drawMark(
                    i,
                    xCoord,
                    yCoord,
                    xmax,
                    this.scale2.max,
                    color,
                    tooltip,
                    this.coords[i],
                    data_points,
                    j
                );
            }
        };








        //
        // Draws a single scatter mark
        //
        this.drawMark = function (data_set_index, x, y, xMax, yMax, color, tooltip, coords, data, data_index)
        {
            var tickmarks = prop.tickmarksStyle,
                tickSize  = prop.tickmarksSize,
                xMin      = prop.xaxisScaleMin,
                x         = ((x - xMin) / (xMax - xMin)) * (this.canvas.width - this.marginLeft - this.marginRight),
                originalX = x,
                originalY = y;

            //
            // This allows the tickmarks property to be an array
            //
            if (tickmarks && typeof(tickmarks) == 'object') {
                tickmarks = tickmarks[data_set_index];
            }
    
    
            //
            // This allows the ticksize property to be an array
            //
            if (typeof(tickSize) == 'object') {
                var tickSize     = tickSize[data_set_index];
                var halfTickSize = tickSize / 2;
            } else {
                var halfTickSize = tickSize / 2;
            }
    
    
            //
            // This bit is for boxplots only
            //
            if (   y
                && typeof y === 'object'
                && typeof y[0] === 'number'
                && typeof y[1] === 'number'
                && typeof y[2] === 'number'
                && typeof y[3] === 'number'
                && typeof y[4] === 'number'
               ) {
    
                this.set('boxplot', true);
    
    
                var y0   = this.getYCoord(y[0]),
                    y1   = this.getYCoord(y[1]),
                    y2   = this.getYCoord(y[2]),
                    y3   = this.getYCoord(y[3]),
                    y4   = this.getYCoord(y[4]),
                    col1 = y[5],
                    col2 = y[6],
                    boxWidth = typeof y[7]  == 'number' ? y[7] : prop.boxplotWidth;
    
    
            } else {
    
                //
                // The new way of getting the Y coord. This function (should) handle everything
                //
                var yCoord = this.getYCoord(y);
            }
    
            //
            // Account for the X axis being at the centre
            //
            // This is so that points are on the graph, and not the gutter - which helps
            x += this.marginLeft;
    
    
    
    
            this.context.beginPath();
            
            // Color
            this.context.strokeStyle = color;
    
    
    
            //
            // Boxplots
            //
            if (prop.boxplot) {

                // boxWidth is a scale value, so convert it to a pixel vlue
                boxWidth = (boxWidth / prop.xaxisScaleMax) * (this.canvas.width - this.marginLeft - this.marginRight);
    
                var halfBoxWidth = boxWidth / 2;
    
                if (prop.lineVisible) {
                    this.context.beginPath();
                        
                        // Set the outline color of the box

                        if (typeof y[8] === 'string') {
                            this.context.strokeStyle = y[8];
                        }
                        this.context.strokeRect(x - halfBoxWidth, y1, boxWidth, y3 - y1);
            
                        // Draw the upper coloured box if a value is specified
                        if (col1) {
                            this.context.fillStyle = col1;
                            this.context.fillRect(x - halfBoxWidth, y1, boxWidth, y2 - y1);
                        }
            
                        // Draw the lower coloured box if a value is specified
                        if (col2) {
                            this.context.fillStyle = col2;
                            this.context.fillRect(x - halfBoxWidth, y2, boxWidth, y3 - y2);
                        }
                    this.context.stroke();
        
                    // Now draw the whiskers
                    this.context.beginPath();
                    if (prop.boxplotCapped) {
                        this.context.moveTo(x - halfBoxWidth, Math.round(y0));
                        this.context.lineTo(x + halfBoxWidth, Math.round(y0));
                    }
        
                    this.context.moveTo(Math.round(x), y0);
                    this.context.lineTo(Math.round(x ), y1);
        
                    if (prop.boxplotCapped) {
                        this.context.moveTo(x - halfBoxWidth, Math.round(y4));
                        this.context.lineTo(x + halfBoxWidth, Math.round(y4));
                    }
        
                    this.context.moveTo(Math.round(x), y4);
                    this.context.lineTo(Math.round(x), y3);

                    this.context.stroke();
                }
            }
    
    
            //
            // Draw the tickmark, but not for boxplots
            //
            if (prop.lineVisible && typeof(y) == 'number' && !y0 && !y1 && !y2 && !y3 && !y4) {
    
                if (tickmarks == 'circle') {
                    this.context.arc(x, yCoord, halfTickSize, 0, 6.28, 0);
                    this.context.fillStyle = color;
                    this.context.fill();
                
                } else if (tickmarks == 'plus') {
    
                    this.context.moveTo(x, yCoord - halfTickSize);
                    this.context.lineTo(x, yCoord + halfTickSize);
                    this.context.moveTo(x - halfTickSize, yCoord);
                    this.context.lineTo(x + halfTickSize, yCoord);
                    this.context.stroke();
                
                } else if (tickmarks == 'square') {
                    this.context.strokeStyle = color;
                    this.context.fillStyle = color;
                    this.context.fillRect(
                        x - halfTickSize,
                        yCoord - halfTickSize,
                        tickSize,
                        tickSize
                    );
    
                } else if (tickmarks == 'cross') {
    
                    this.context.moveTo(x - halfTickSize, yCoord - halfTickSize);
                    this.context.lineTo(x + halfTickSize, yCoord + halfTickSize);
                    this.context.moveTo(x + halfTickSize, yCoord - halfTickSize);
                    this.context.lineTo(x - halfTickSize, yCoord + halfTickSize);
                    
                    this.context.stroke();
                
                //
                // Diamond shape tickmarks
                //
                } else if (tickmarks == 'diamond') {
                    this.context.fillStyle = this.context.strokeStyle;
    
                    this.context.moveTo(x, yCoord - halfTickSize);
                    this.context.lineTo(x + halfTickSize, yCoord);
                    this.context.lineTo(x, yCoord + halfTickSize);
                    this.context.lineTo(x - halfTickSize, yCoord);
                    this.context.lineTo(x, yCoord - halfTickSize);
    
                    this.context.fill();
                    this.context.stroke();
    
                //
                // Custom tickmark style
                //
                } else if (typeof(tickmarks) == 'function') {
    
                    var graphWidth  = this.canvas.width - this.marginLeft - this.marginRight,
                        graphheight = this.canvas.height - this.marginTop - this.marginBottom,
                        xVal = ((x - this.marginLeft) / graphWidth) * xMax,
                        yVal = ((graphheight - (yCoord - this.marginTop)) / graphheight) * yMax;
    
                    tickmarks(this, data, x, yCoord, xVal, yVal, xMax, yMax, color, data_set_index, data_index)

















                //
                // Image based tickmark
                //
                // lineData, xPos, yPos, color, isShadow, prevX, prevY, tickmarks, index
                } else if (
                           typeof tickmarks === 'string' &&
                            (
                             tickmarks.substr(0, 6) === 'image:'  ||
                             tickmarks.substr(0, 5) === 'data:'   ||
                             tickmarks.substr(0, 1) === '/'       ||
                             tickmarks.substr(0, 3) === '../'     ||
                             tickmarks.substr(0, 7) === 'images/'
                            )
                          ) {
    
                    var img = new Image();
                    
                    if (tickmarks.substr(0, 6) === 'image:') {
                        img.src = tickmarks.substr(6);
                    } else {
                        img.src = tickmarks;
                    }
    
                    var obj = this;
                    img.onload = function ()
                    {
                        if (prop.tickmarksStyleImageHalign === 'center') x -= (this.width / 2);
                        if (prop.tickmarksStyleImageHalign === 'right')  x -= this.width;

                        if (prop.tickmarksStyleImageValign === 'center') yCoord -= (this.height / 2);
                        if (prop.tickmarksStyleImageValign === 'bottom') yCoord -= this.height;
                        
                        x += prop.tickmarksStyleImageOffsetx;
                        yCoord += prop.tickmarksStyleImageOffsety;
    
                        obj.context.drawImage(this, x, yCoord);
                    }





                //
                // No tickmarks
                //
                } else if (tickmarks === null) {
        
                //
                // Unknown tickmark type
                //
                } else {
                    alert('[SCATTER] (' + this.id + ') Unknown tickmark style: ' + tickmarks );
                }
            }
    
            //
            // Add the tickmark to the coords array
            //

            if (   prop.boxplot
                && typeof y0 === 'number'
                && typeof y1 === 'number'
                && typeof y2 === 'number'
                && typeof y3 === 'number'
                && typeof y4 === 'number') {
    
                x      = [x - halfBoxWidth, x + halfBoxWidth];
                yCoord = [y0, y1, y2, y3, y4];
            }
    
            coords.push([x, yCoord, tooltip]);
        };








        //
        // Draws an optional line connecting the tick marks.
        // 
        // @param i The index of the dataset to use
        //
        this.drawLine = function (i)
        {
            if (typeof prop.lineVisible == 'boolean' && prop.lineVisible == false) {
                return;
            }
    
            if (prop.line && this.coords[i].length >= 2) {
            
                if (prop.lineDash && typeof this.context.setLineDash === 'function') {
                    this.context.setLineDash(prop.lineDash);
                }

                this.context.lineCap     = 'round';
                this.context.lineJoin    = 'round';
                this.context.lineWidth   = this.getLineWidth(i);// i is the index of the set of coordinates
                this.context.strokeStyle = prop.lineColors[i];

                this.context.beginPath();

                    var prevY = null;
                    var currY = null;
        
                    for (var j=0,len=this.coords[i].length; j<len; j+=1) {
                    
        
                        var xPos = this.coords[i][j][0];
                        var yPos = this.coords[i][j][1];
                        
                        if (j > 0) prevY = this.coords[i][j - 1][1];
                        currY = yPos;
    
                        if (j == 0 || RGraph.isNull(prevY) || RGraph.isNull(currY)) {
                            this.context.moveTo(xPos, yPos);
                        } else {
                        
                            // Stepped?
                            var stepped = prop.lineStepped;
        
                            if (   (typeof stepped == 'boolean' && stepped)
                                || (typeof stepped == 'object' && stepped[i])
                               ) {
                                this.context.lineTo(this.coords[i][j][0], this.coords[i][j - 1][1]);
                            }
        
                            this.context.lineTo(xPos, yPos);
                        }
                    }
                this.context.stroke();
            
                //
                // Set the linedash back to the default
                //
                if (prop.lineDash && typeof this.context.setLineDash === 'function') {
                    this.context.setLineDash([1,0]);
                }
            }

            //
            // Set the linewidth back to 1
            //
            this.context.lineWidth = 1;
        };








        //
        // Returns the linewidth
        // 
        // @param number i The index of the "line" (/set of coordinates)
        //
        this.getLineWidth = function (i)
        {
            var linewidth = prop.lineLinewidth;
            
            if (typeof linewidth == 'number') {
                return linewidth;
            
            } else if (typeof linewidth == 'object') {
                if (linewidth[i]) {
                    return linewidth[i];
                } else {
                    return linewidth[0];
                }
    
                alert('[SCATTER] Error! The linewidth property should be a single number or an array of one or more numbers');
            }
        };








        //
        // Draws vertical bars. Line chart doesn't use a horizontal scale, hence this function
        // is not common
        //
        this.drawVBars = function ()
        {
            var vbars = prop.backgroundVbars;
            var graphWidth = this.canvas.width - this.marginLeft - this.marginRight;

            if (vbars) {
            
                var xmax = prop.xaxisScaleMax;
                var xmin = prop.xaxisScaleMin;
                
                for (var i=0,len=vbars.length; i<len; i+=1) {
                    
                    var key = i;
                    var value = vbars[key];

                    //
                    // Accomodate date/time values
                    //
                    if (typeof value[0] == 'string') value[0] = RGraph.parseDate(value[0]);
                    if (typeof value[1] == 'string') value[1] = RGraph.parseDate(value[1]) - value[0];

                    var x     = (( (value[0] - xmin) / (xmax - xmin) ) * graphWidth) + this.marginLeft;
                    var width = (value[1] / (xmax - xmin) ) * graphWidth;

                    this.context.fillStyle = value[2];
                    this.context.fillRect(x, this.marginTop, width, (this.canvas.height - this.marginTop - this.marginBottom));
                }
            }
        };








        //
        // Draws in-graph labels.
        // 
        // @param object obj The graph object
        //
        this.drawInGraphLabels = function (obj)
        {
            var labels  = obj.get('labelsIngraph');
            var labels_processed = [];
    
            if (!labels) {
                return;
            }
    
            // Defaults
            var fgcolor   = 'black';
            var bgcolor   = 'white';
            var direction = 1;

    
            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'labelsIngraph'
            });

            //
            // Preprocess the labels array. Numbers are expanded
            //
            for (var i=0,len=labels.length; i<len; i+=1) {
                if (typeof(labels[i]) == 'number') {
                    for (var j=0; j<labels[i]; ++j) {
                        labels_processed.push(null);
                    }
                } else if (typeof(labels[i]) == 'string' || typeof(labels[i]) == 'object') {
                    labels_processed.push(labels[i]);
                
                } else {
                    labels_processed.push('');
                }
            }

            //
            // Turn off any shadow
            //
            RGraph.noShadow(obj);
    
            if (labels_processed && labels_processed.length > 0) {
    
                var i=0;
    
                for (var set=0; set<obj.coords.length; ++set) {
                    for (var point = 0; point<obj.coords[set].length; ++point) {
                        if (labels_processed[i]) {
                            var x = obj.coords[set][point][0];
                            var y = obj.coords[set][point][1];
                            var length = typeof(labels_processed[i][4]) == 'number' ? labels_processed[i][4] : 25;
                                
                            var text_x = x;
                            var text_y = y - 5 - length;
    
                            this.context.moveTo(x, y - 5);
                            this.context.lineTo(x, y - 5 - length);
                            
                            this.context.stroke();
                            this.context.beginPath();
                            
                            // This draws the arrow
                            this.context.moveTo(x, y - 5);
                            this.context.lineTo(x - 3, y - 10);
                            this.context.lineTo(x + 3, y - 10);
                            this.context.closePath();

                            this.context.beginPath();
                                // Fore ground color
                                this.context.fillStyle = (typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][1]) == 'string') ? labels_processed[i][1] : 'black';
                                
                                RGraph.text({
                                    
                              object: this,
                                
                                font:   textConf.font,
                                size:   textConf.size,
                                color:  textConf.color,
                                bold:   textConf.bold,
                                italic: textConf.italic,

                                    x:            text_x,
                                    y:            text_y,
                                    text:         (typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][0]) == 'string') ? labels_processed[i][0] : labels_processed[i],
                                    valign:       'bottom',
                                    halign:       'center',
                                    bounding:     true,
                                    boundingFill: (typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][2]) == 'string') ? labels_processed[i][2] : 'white',
                                    tag:          'labels.ingraph'
                                });
                            this.context.fill();
                        }
                        
                        i++;
                    }
                }
            }
        };








        //
        // This function makes it much easier to get the (if any) point that is currently being hovered over.
        // 
        // @param object e The event object
        //
        this.getShape = function (e)
        {
            var mouseXY     = RGraph.getMouseXY(e);
            var mouseX      = mouseXY[0];
            var mouseY      = mouseXY[1];
            var overHotspot = false;
            var offset      = prop.tooltipsHotspot; // This is how far the hotspot extends
    
            for (var set=0,len=this.coords.length; set<len; ++set) {
                for (var i=0,len2=this.coords[set].length; i<len2; ++i) {

                    var x = this.coords[set][i][0];
                    var y = this.coords[set][i][1];
                    var tooltip = this.data[set][i][3];
    
                    if (typeof(y) == 'number') {
                        if (mouseX <= (x + offset) &&
                            mouseX >= (x - offset) &&
                            mouseY <= (y + offset) &&
                            mouseY >= (y - offset)) {
    
                            var tooltip = RGraph.parseTooltipText(this.data[set][i][3], 0);
                            var index_adjusted = i;
    
                            for (var ds=(set-1); ds >=0; --ds) {
                                index_adjusted += this.data[ds].length;
                            }
    
                            return {
                                0: this, 1: x, 2: y, 3: set, 4: i, 5: this.data[set][i][3],
                                object: this, x: x, y: y, dataset: set, index: i, tooltip: tooltip, index_adjusted: index_adjusted
                            };
                        }
                    } else if (RGraph.isNull(y)) {
                        // Nothing to see here
    
                    } else {
    
                        var mark = this.data[set][i];
    
                        //
                        // Determine the width
                        //
                        var width = prop.boxplotWidth;
                        
                        if (typeof(mark[1][7]) == 'number') {
                            width = mark[1][7];
                        }
    
                        if (   typeof(x) == 'object'
                            && mouseX > x[0]
                            && mouseX < x[1]
                            && mouseY < y[1]
                            && mouseY > y[3]
                            ) {
    
                            var tooltip = RGraph.parseTooltipText(this.data[set][i][3], 0);
    
                            return {
                                0: this, 1: x[0], 2: x[1] - x[0], 3: y[1], 4: y[3] - y[1], 5: set, 6: i, 7: this.data[set][i][3],
                                object: this, x: x[0], y: y[1], width: x[1] - x[0], height: y[3] - y[1], dataset: set, index: i, tooltip: tooltip
                            };
                        }
                    }
                }
            }
        };








        //
        // Draws the above line labels
        //
        this.drawAboveLabels = function ()
        {
            var size       = prop.labelsAboveSize;
            var font       = prop.textFont;
            var units_pre  = prop.yaxisScaleUnitsPre;
            var units_post = prop.yaxisScaleUnitsPost;
            
            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'labelsAbove'
            });
    
            for (var set=0,len=this.coords.length; set<len; ++set) {
                for (var point=0,len2=this.coords[set].length; point<len2; ++point) {
                    
                    var x_val = this.data[set][point][0];
                    var y_val = this.data[set][point][1];
                    
                    if (!RGraph.isNull(y_val)) {
                        
                        // Use the top most value from a box plot
                        if (RGraph.isArray(y_val)) {
                            var max = 0;
                            for (var i=0; i<y_val; ++i) {
                                max = Math.max(max, y_val[i]);
                            }
                            
                            y_val = max;
                        }
                        
                        var x_pos = this.coords[set][point][0];
                        var y_pos = this.coords[set][point][1];


                        var xvalueFormatter = prop.labelsAboveFormatterX;
                        var yvalueFormatter = prop.labelsAboveFormatterY;

                        RGraph.text({
                                    
                      object: this,

                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                            x:            x_pos,
                            y:            y_pos - 5 - size,
                            text:         
                                (typeof xvalueFormatter === 'function' ? xvalueFormatter(this, x_val) : x_val.toFixed(prop.labelsAboveDecimals)) +
                                ', ' +
                                (typeof yvalueFormatter === 'function' ? yvalueFormatter(this, y_val) : y_val.toFixed(prop.labelsAboveDecimals)),
                            valign:       'center',
                            halign:       'center',
                            bounding:     true,
                            boundingFill: 'rgba(255, 255, 255, 0.7)',
                            boundingStroke: 'rgba(0,0,0,0.1)',
                            tag:          'labels.above'
                        });
                    }
                }
            }
        };








        //
        // When you click on the chart, this method can return the Y value at that point. It works for any point on the
        // chart (that is inside the gutters) - not just points within the Bars.
        // 
        // @param object e The event object
        //
        this.getYValue = function (arg)
        {
            if (arg.length == 2) {
                var mouseX = arg[0];
                var mouseY = arg[1];
            } else {
                var mouseCoords = RGraph.getMouseXY(arg);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
            }
            
            var obj = this;
    
            if (   mouseY < this.marginTop
                || mouseY > (this.canvas.height - this.marginBottom)
                || mouseX < this.marginLeft
                || mouseX > (this.canvas.width - this.marginRight)
               ) {
                return null;
            }
            
            if (prop.xaxisPosition == 'center') {
                var value = (((this.grapharea / 2) - (mouseY - this.marginTop)) / this.grapharea) * (this.max - this.min)
                value *= 2;
                
                
                // Account for each side of the X axis
                if (value >= 0) {
                    value += this.min

                    if (prop.yaxisScaleInvert) {
                        value -= this.min;
                        value = this.max - value;
                    }
                
                } else {

                    value -= this.min;
                    if (prop.yaxisScaleInvert) {
                        value += this.min;
                        value = this.max + value;
                        value *= -1;
                    }
                }

            } else {

                var value = ((this.grapharea - (mouseY - this.marginTop)) / this.grapharea) * (this.max - this.min)
                value += this.min;
                
                if (prop.yaxisScaleInvert) {
                    value -= this.min;
                    value = this.max - value;
                }
            }
    
            return value;
        };








        //
        // When you click on the chart, this method can return the X value at that point.
        // 
        // @param mixed  arg This can either be an event object or the X coordinate
        // @param number     If specifying the X coord as the first arg then this should be the Y coord
        //
        this.getXValue = function (arg)
        {
            if (arg.length == 2) {
                var mouseX = arg[0];
                var mouseY = arg[1];
            } else {
                var mouseXY = RGraph.getMouseXY(arg);
                var mouseX  = mouseXY[0];
                var mouseY  = mouseXY[1];
            }
            var obj = this;
            
            if (   mouseY < this.marginTop
                || mouseY > (this.canvas.height - this.marginBottom)
                || mouseX < this.marginLeft
                || mouseX > (this.canvas.width - this.marginRight)
               ) {
                return null;
            }
    
            var width = (this.canvas.width - this.marginLeft - this.marginRight);
            var value = ((mouseX - this.marginLeft) / width) * (prop.xaxisScaleMax - prop.xaxisScaleMin)
            value += prop.xaxisScaleMin;

            return value;
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
                // Boxplot highlight
                if (shape['height']) {
                    RGraph.Highlight.rect(this, shape);
        
                // Point highlight
                } else {
                    RGraph.Highlight.point(this, shape);
                }
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
                   mouseXY[0] > (this.marginLeft - 3)
                && mouseXY[0] < (this.canvas.width - this.marginRight + 3)
                && mouseXY[1] > (this.marginTop - 3)
                && mouseXY[1] < ((this.canvas.height - this.marginBottom) + 3)
                ) {
    
                return this;
            }
        };








        //
        // This function can be used when the canvas is clicked on (or similar - depending on the event)
        // to retrieve the relevant X coordinate for a particular value.
        // 
        // @param int value The value to get the X coordinate for
        //
        this.getXCoord = function (value)
        {
            if (typeof value != 'number' && typeof value != 'string') {
                return null;
            }
            
            // Allow for date strings to be passed
            if (typeof value === 'string') {
                value = RGraph.parseDate(value);
            }

            var xmin = prop.xaxisScaleMin;
            var xmax = prop.xaxisScaleMax;
            var x;
    
            if (value < xmin) return null;
            if (value > xmax) return null;
    
            if (prop.yaxisPosition == 'right') {
                x = ((value - xmin) / (xmax - xmin)) * (this.canvas.width - this.marginLeft - this.marginRight);
                x = (this.canvas.width - this.marginRight - x);
            } else {
                x = ((value - xmin) / (xmax - xmin)) * (this.canvas.width - this.marginLeft - this.marginRight);
                x = x + this.marginLeft;
            }
            
            return x;
        };








        //
        // Returns the applicable Y COORDINATE when given a Y value
        // 
        // @param int value The value to use
        // @return int The appropriate Y coordinate
        //
        this.getYCoord = function (value)
        {
            if (typeof(value) != 'number') {
                return null;
            }

            var invert          = prop.yaxisScaleInvert;
            var xaxispos        = prop.xaxisPosition;
            var graphHeight     = this.canvas.height - this.marginTop - this.marginBottom;
            var halfGraphHeight = graphHeight / 2;
            var ymax            = this.max;
            var ymin            = prop.yaxisScaleMin;
            var coord           = 0;
    
            if (value > ymax || (prop.xaxisPosition == 'bottom' && value < ymin) || (prop.xaxisPosition == 'center' && ((value > 0 && value < ymin) || (value < 0 && value > (-1 * ymin))))) {
                return null;
            }

            //
            // This calculates scale values if the X axis is in the center
            //
            if (xaxispos == 'center') {
    
                coord = ((Math.abs(value) - ymin) / (ymax - ymin)) * halfGraphHeight;
    
                if (invert) {
                    coord = halfGraphHeight - coord;
                }
                
                if (value < 0) {
                    coord += this.marginTop;
                    coord += halfGraphHeight;
                } else {
                    coord  = halfGraphHeight - coord;
                    coord += this.marginTop;
                }
    
            //
            // And this calculates scale values when the X axis is at the bottom
            //
            } else {
    
                coord = ((value - ymin) / (ymax - ymin)) * graphHeight;

                if (invert) {
                    coord = graphHeight - coord;
                }
    
                // Invert the coordinate because the Y scale starts at the top
                coord = graphHeight - coord;

                // And add on the top gutter
                coord = this.marginTop + coord;
            }
    
            return coord;
        };








        //
        // A helper class that helps facilitatesbubble charts
        //
        RGraph.Scatter.Bubble = function (scatter, min, max, width, data)
        {
            this.scatter = scatter;
            this.min     = min;
            this.max     = max;
            this.width   = width;
            this.data    = data;
            this.coords  = [];
            this.type    = 'scatter.bubble'



            //
            // A setter for the Bubble chart class - it just acts as a "passthru" to the Scatter object
            //
            this.set = function (name, value)
            {
                this.scatter.set(name, value);
                
                return this;
            };



            //
            // A getter for the Bubble chart class - it just acts as a "passthru" to the Scatter object
            //
            this.get = function (name)
            {
                this.scatter.get(name);
            };




            //
            // Tha Bubble chart draw function
            //
            this.draw = function ()
            {
                var bubble_min       = this.min,
                    bubble_max       = this.max,
                    bubble_data      = this.data,
                    bubble_max_width = this.width;
        
                // Keep a record of the bubble chart object
                var obj_bubble  = this,
                    obj_scatter = this.scatter;

                // This custom ondraw event listener draws the bubbles
                this.scatter.ondraw = function (obj)
                {
                    // Loop through all the points (first dataset)
                    for (var i=0; i<obj.coords[0].length; ++i) {
                        
                        bubble_data[i] = Math.max(bubble_data[i], bubble_min);
                        bubble_data[i] = Math.min(bubble_data[i], bubble_max);
        
                        var     r = ((bubble_data[i] - bubble_min) / (bubble_max - bubble_min) ) * bubble_max_width,
                            color = obj_scatter.data[0][i][2] ? obj_scatter.data[0][i][2] : obj_scatter.properties.colorsDefault;
        
                        this.context.beginPath();
                        this.context.fillStyle = RGraph.radialGradient(obj,
                            obj_scatter.coords[0][i][0] + (r / 2.5),
                            obj_scatter.coords[0][i][1] - (r / 2.5),
                            0,
                            obj_scatter.coords[0][i][0] + (r / 2.5),
                            obj_scatter.coords[0][i][1] - (r / 2.5),
                            r,
                            prop.colorsBubbleGraduated ? 'white' : color,
                            color
                        );
                        
                        // Draw the bubble
                        this.context.arc(
                            obj_scatter.coords[0][i][0],
                            obj_scatter.coords[0][i][1],
                            r,
                            0,
                            RGraph.TWOPI,
                            false
                        );

                        this.context.fill();

                        obj_bubble.coords[i] = [
                            obj_scatter.coords[0][i][0],
                            obj_scatter.coords[0][i][1],
                            r,
                            this.context.fillStyle
                        ];
                    }
                }
                
                this.scatter.draw();
                
                return this;
            };
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors.data                 = RGraph.arrayClone(this.data);
                this.original_colors.backgroundVbars      = RGraph.arrayClone(prop.backgroundVbars);
                this.original_colors.backgroundHbars      = RGraph.arrayClone(prop.backgroundHbars);
                this.original_colors.lineColors           = RGraph.arrayClone(prop.lineColors);
                this.original_colors.colorsDefault        = RGraph.arrayClone(prop.colorsDefault);
                this.original_colors.crosshairsColor      = RGraph.arrayClone(prop.crosshairsColor);
                this.original_colors.highlightStroke      = RGraph.arrayClone(prop.highlightStroke);
                this.original_colors.highlightFill        = RGraph.arrayClone(prop.highlightFill);
                this.original_colors.backgroundBarsColor1 = RGraph.arrayClone(prop.backgroundBarsColor1);
                this.original_colors.backgroundBarsColor2 = RGraph.arrayClone(prop.backgroundBarsColor2);
                this.original_colors.backgroundGridColor  = RGraph.arrayClone(prop.backgroundGridColor);
                this.original_colors.backgroundColor      = RGraph.arrayClone(prop.backgroundColor);
                this.original_colors.axesColor            = RGraph.arrayClone(prop.axesColor);
            }





            // Colors
            var data = this.data;
            if (data) {
                for (var dataset=0; dataset<data.length; ++dataset) {
                    for (var i=0; i<this.data[dataset].length; ++i) {

                        // Boxplots
                        if (this.data[dataset][i] && typeof this.data[dataset][i][1] == 'object' && this.data[dataset][i][1]) {

                            if (typeof(this.data[dataset][i][1][5]) == 'string') this.data[dataset][i][1][5] = this.parseSingleColorForGradient(this.data[dataset][i][1][5]);
                            if (typeof(this.data[dataset][i][1][6]) == 'string') this.data[dataset][i][1][6] = this.parseSingleColorForGradient(this.data[dataset][i][1][6]);
                        }
                        
                        if (!RGraph.isNull(this.data[dataset][i])) {
                            this.data[dataset][i][2] = this.parseSingleColorForGradient(this.data[dataset][i][2]);
                        }
                    }
                }
            }
            
            // Parse HBars
            var hbars = prop.backgroundHbars;
            if (hbars) {
                for (i=0; i<hbars.length; ++i) {
                    hbars[i][2] = this.parseSingleColorForGradient(hbars[i][2]);
                }
            }
            
            // Parse HBars
            var vbars = prop.backgroundVbars;
            if (vbars) {
                for (i=0; i<vbars.length; ++i) {
                    vbars[i][2] = this.parseSingleColorForGradient(vbars[i][2]);
                }
            }
            
            // Parse line colors
            var colors = prop.lineColors;
            if (colors) {
                for (i=0; i<colors.length; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }
    
             prop.colorsDefault         = this.parseSingleColorForGradient(prop.colorsDefault);
             prop.crosshairsColor       = this.parseSingleColorForGradient(prop.crosshairsColor);
             prop.highlightStroke       = this.parseSingleColorForGradient(prop.highlightStroke);
             prop.highlightFill         = this.parseSingleColorForGradient(prop.highlightFill);
             prop.backgroundBarsColor1 = this.parseSingleColorForGradient(prop.backgroundBarsColor1);
             prop.backgroundBarsColor2 = this.parseSingleColorForGradient(prop.backgroundBarsColor2);
             prop.backgroundGridColor  = this.parseSingleColorForGradient(prop.backgroundGridColor);
             prop.backgroundColor       = this.parseSingleColorForGradient(prop.backgroundColor);
             prop.axesColor             = this.parseSingleColorForGradient(prop.axesColor);
        };








        //
        // Use this function to reset the object to the post-constructor state. Eg reset colors if
        // need be etc
        //
        this.reset = function ()
        {
        };








        //
        // This parses a single color value for a gradient
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

                // Allow for JSON gradients
                if (color.match(/^gradient\(({.*})\)$/i)) {
                    return RGraph.parseJSONGradient({object: this, def: RegExp.$1});
                }

                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = this.context.createLinearGradient(0,this.canvas.height - prop.marginBottom, 0, prop.marginTop);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RGraph.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RGraph.trim(parts[j]));
                }
            }
                
            return grad ? grad : color;
        };








        //
        // This function handles highlighting an entire data-series for the interactive
        // key
        // 
        // @param int index The index of the data series to be highlighted
        //
        this.interactiveKeyHighlight = function (index)
        {
            if (this.coords && this.coords[index] && this.coords[index].length) {
                
                var obj = this;
                
                this.coords[index].forEach(function (value, idx, arr)
                {
                    obj.context.beginPath();
                    obj.context.fillStyle = prop.keyInteractiveHighlightChartFill;
                    obj.context.arc(value[0], value[1], prop.tickmarksSize + 3, 0, RGraph.TWOPI, false);
                    obj.context.fill();
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
        // Trace2
        // 
        // This is a new version of the Trace effect which no longer requires jQuery and is more compatible
        // with other effects (eg Expand). This new effect is considerably simpler and less code.
        // 
        // @param object     Options for the effect. Currently only "frames" is available.
        // @param int        A function that is called when the ffect is complete
        //
        this.trace  = function ()
        {
            var obj       = this,
                callback  = arguments[2],
                opt       = arguments[0] || {},
                frames    = opt.frames || 30,
                frame     = 0,
                callback  = arguments[1] || function () {}

            obj.set('animationTrace', true);
            obj.set('animationTraceClip', 0);
    
            function iterator ()
            {
                RGraph.clear(obj.canvas);

                RGraph.redrawCanvas(obj.canvas);

                if (frame++ < frames) {
                    obj.set('animationTraceClip', frame / frames);
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
            for (var i=0,len=this.original_colors.data.length; i<len; ++i) {
                for (var j=0,len2=this.original_colors.data[i].length; j<len2;++j) {

                    // The color for the point
                    this.data[i][j][2] = RGraph.arrayClone(this.original_colors.data[i][j][2]);
                    
                    // Handle boxplots
                    if (typeof this.data[i][j][1] === 'object') {
                        this.data[i][j][1][5] = RGraph.arrayClone(this.original_colors.data[i][j][1][5]);
                        this.data[i][j][1][6] = RGraph.arrayClone(this.original_colors.data[i][j][1][6]);
                    }
                }
            }
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
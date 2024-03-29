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
    RGraph.SVG = RGraph.SVG || {};

// Module pattern
(function (win, doc, undefined)
{
    RGraph.SVG.Bipolar = function (conf)
    {
        //
        // A setter that the constructor uses (at the end)
        // to set all of the properties
        //
        // @param string name  The name of the property to set
        // @param string value The value to set the property to
        //
        this.set = function (name, value)
        {
            if (arguments.length === 1 && typeof name === 'object') {
                for (i in arguments[0]) {
                    if (typeof i === 'string') {
                        
                        name  = ret.name;
                        value = ret.value;

                        this.set(name, value);
                    }
                }
            } else {
                    
                var ret = RGraph.SVG.commonSetter({
                    object: this,
                    name:   name,
                    value:  value
                });
                
                name  = ret.name;
                value = ret.value;

                this.properties[name] = value;

                // If setting the colors, update the originalColors
                // property too
                if (name === 'colors') {
                    this.originalColors = RGraph.SVG.arrayClone(value);
                    this.colorsParsed = false;
                }
            }

            return this;
        };








        //
        // A getter.
        // 
        // @param name  string The name of the property to get
        //
        this.get = function (name)
        {
            return this.properties[name];
        };








        this.id                    = conf.id;
        this.uid                   = RGraph.SVG.createUID();
        this.container             = document.getElementById(this.id);
        this.layers                = {}; // MUST be before the SVG tag is created!
        this.svg                   = RGraph.SVG.createSVG({object: this,container: this.container});
        this.isRGraph              = true;
        this.data                  = [conf.left, conf.right];
        this.left                  = conf.left;
        this.right                 = conf.right;
        this.type                  = 'bipolar';
        this.coords                = [];
        this.coordsLeft            = [];
        this.coordsRight           = [];
        this.coords2               = [];
        this.coords2Left           = [];
        this.coords2Right          = [];
        this.stackedBackfacesLeft  = [];
        this.stackedBackfacesRight = [];
        this.originalColors        = {};
        this.gradientCounter       = 1;
        this.sequentialIndex       = 0; // Used for tooltips



        // Add this object to the ObjectRegistry
        RGraph.SVG.OR.add(this);
        
        this.container.style.display = 'inline-block';

        this.properties =
        {
            marginLeft:   35,
            marginRight:  35,
            marginTop:    35,
            marginBottom: 35,
            marginCenter: null,

            backgroundColor:            null,
            backgroundGrid:             true,
            backgroundGridColor:        '#ddd',
            backgroundGridLinewidth:    1,
            backgroundGridHlines:       true,
            backgroundGridHlinesCount:  null,
            backgroundGridVlines:       true,
            backgroundGridVlinesCount:  null,
            backgroundGridBorder:       true,
            backgroundGridDashed:       false,
            backgroundGridDotted:       false,
            backgroundGridDashArray:    null,

            xaxis:                true,
            xaxisLinewidth:       1,
            xaxisTickmarks:       true,
            xaxisTickmarksLength: 5,
            xaxisLabelsCount:     5,
            xaxisLabelsPositionEdgeTickmarksCount: 5,
            xaxisColor:           'black',
            xaxisLabelsOffsetx:   0,
            xaxisLabelsOffsety:   0,
            xaxisLabelsFont:        null,
            xaxisLabelsSize:        null,
            xaxisLabelsBold:        null,
            xaxisLabelsItalic:      null,
            xaxisLabelsColor:       null,
            xaxisScaleUnitsPre:        '',
            xaxisScaleUnitsPost:       '',
            xaxisScaleStrict:          false,
            xaxisScaleDecimals:        0,
            xaxisScalePoint:           '.',
            xaxisScaleThousand:        ',',
            xaxisScaleRound:           false,
            xaxisScaleMax:             null,
            xaxisScaleMin:             0,
            xaxisScaleFormatter:       null,

            yaxis:                true,
            yaxisTickmarks:       true,
            yaxisTickmarksLength: 5,
            yaxisColor:           'black',
            yaxisScale:           false,
            yaxisLabels:          null,
            yaxisLabelsOffsetx:   0,
            yaxisLabelsOffsety:   0,
            yaxisLabelsFont:        null,
            yaxisLabelsSize:        null,
            yaxisLabelsBold:        null,
            yaxisLabelsItalic:      null,
            yaxisLabelsColor:       null,
            
            // 20 colors. If you need more you need to set the colors property
            colors: [
                'red', '#0f0', '#00f', '#ff0', '#0ff', '#0f0','pink','orange','gray','black',
                'red', '#0f0', '#00f', '#ff0', '#0ff', '#0f0','pink','orange','gray','black'
            ],
            colorsSequential:     false,
            colorsStroke:          'rgba(0,0,0,0)',
            
            marginInner:              3,
            marginInnerGrouped:       2,

            labelsAbove:                  false,
            labelsAboveFont:              null,
            labelsAboveSize:              null,
            labelsAboveBold:              null,
            labelsAboveItalic:            null,
            labelsAboveColor:             null,
            labelsAboveBackground:        null,
            labelsAboveBackgroundPadding: 0,
            labelsAboveUnitsPre:          null,
            labelsAboveUnitsPost:         null,
            labelsAbovePoint:             null,
            labelsAboveThousand:          null,
            labelsAboveFormatter:         null,
            labelsAboveDecimals:          null,
            labelsAboveOffsetx:           0,
            labelsAboveOffsety:           0,
            labelsAboveSpecific:          null,
            
            textColor:            'black',
            textFont:             'Arial, Verdana, sans-serif',
            textSize:             12,
            textBold:             false,
            textItalic:           false,

            linewidth:            1,
            grouping:             'grouped',
            
            tooltips:             null,
            tooltipsOverride:     null,
            tooltipsEffect:       'fade',
            tooltipsCssClass:     'RGraph_tooltip',
            tooltipsEvent:        'click',

            highlightStroke:      'rgba(0,0,0,0)',
            highlightFill:        'rgba(255,255,255,0.7)',
            highlightLinewidth:   1,
            
            title:                '',
            titleX:               null,
            titleY:               null,
            titleHalign:          'center',
            titleValign:          null,
            titleSize:            null,
            titleColor:           null,
            titleFont:            null,
            titleBold:            null,
            titleItalic:          null,
            
            titleSubtitle:        null,
            titleSubtitleColor:   '#aaa',
            titleSubtitleSize:    null,
            titleSubtitleFont:    null,
            titleSubtitleBold:    null,
            titleSubtitleItalic:  null,
            
            shadow:               false,
            shadowOffsetx:        2,
            shadowOffsety:        2,
            shadowBlur:           2,
            shadowOpacity:        0.25,

            key:             null,
            keyColors:       null,
            keyOffsetx:      0,
            keyOffsety:      0,
            keyLabelsOffsetx:  0,
            keyLabelsOffsety:  -1,
            keyLabelsSize:   null,
            keyLabelsBold:   null,
            keyLabelsItalic: null,
            keyLabelsFont:   null,
            keyLabelsColor:  null
        };




        //
        // Copy the global object properties to this instance
        //
        RGraph.SVG.getGlobals(this);





        //
        // "Decorate" the object with the generic effects if the effects library has been included
        //
        if (RGraph.SVG.FX && typeof RGraph.SVG.FX.decorate === 'function') {
            RGraph.SVG.FX.decorate(this);
        }




        var prop = this.properties;








        //
        // The draw method draws the Bar chart
        //
        this.draw = function ()
        {
            // Fire the beforedraw event
            RGraph.SVG.fireCustomEvent(this, 'onbeforedraw');






            // Should the first thing that's done inthe.draw() function
            // except for the onbeforedraw event
            this.width  = Number(this.svg.getAttribute('width'));
            this.height = Number(this.svg.getAttribute('height'));










            // Create the defs tag if necessary
            RGraph.SVG.createDefs(this);

            




            //
            // Autosize the center gutter to allow for big labels
            //
            if (typeof prop.marginCenter !== 'number') {
                prop.marginCenter = this.getMarginCenter();
            }


            // Reset the coords arrays
            this.coords       = [];
            this.coordsLeft   = [];
            this.coordsRight  = [];
            this.coords2      = [];
            this.coords2Left  = [];
            this.coords2Right = [];


            this.graphWidth  = (this.width - prop.marginLeft - prop.marginRight - prop.marginCenter) / 2;
            this.graphHeight = this.height - prop.marginTop - prop.marginBottom;



            //
            // Parse the colors. This allows for simple gradient syntax
            //

            // Parse the colors for gradients
            RGraph.SVG.resetColorsToOriginalValues({object:this});
            this.parseColors();



            // Go through the data and work out the maximum value
            var values = [];

            for (var i=0; i<2; ++i) {
                for (var j=0,max=0; j<this.data[i].length; ++j) {
                    if (typeof this.data[i][j] === 'number') {
                        values.push(this.data[i][j]);
                    
                    } else if (RGraph.SVG.isArray(this.data[i][j]) && prop.grouping === 'grouped') {
                        values.push(RGraph.SVG.arrayMax(this.data[i][j]));
    
                    } else if (RGraph.SVG.isArray(this.data[i][j]) && prop.grouping === 'stacked') {
                        values.push(RGraph.SVG.arraySum(this.data[i][j]));
                    }
                }
            }
            
            var max = RGraph.SVG.arrayMax(values);

            // A custom, user-specified maximum value
            if (typeof prop.xaxisScaleMax === 'number') {
                max = prop.xaxisScaleMax;
            }



            //
            // Generate an appropiate scale
            //
            this.scale = RGraph.SVG.getScale({
                object:    this,
                numlabels: prop.xaxisLabelsCount,
                unitsPre:  prop.xaxisScaleUnitsPre,
                unitsPost: prop.xaxisScaleUnitsPost,
                max:       max,
                min:       prop.xaxisScaleMin,
                point:     prop.xaxisScalePoint,
                round:     prop.xaxisScaleRound,
                thousand:  prop.xaxisScaleThousand,
                decimals:  prop.xaxisScaleDecimals,
                strict:    typeof prop.xaxisScaleMax === 'number',
                formatter: prop.xaxisScaleFormatter
            });





            // Now the scale has been generated adopt its max value
            this.max           = this.scale.max;
            this.min           = this.scale.min;
            prop.yaxisScaleMax = this.scale.max;
            prop.yaxisScaleMin = this.scale.min;



            // Draw the background first
            this.drawBackground(this);
            
            // Draw the title
            this.drawTitle();



            // Draw the bars
            this.drawBars();


            // Draw the axes over the bars
            this.drawAxes();


            // Draw the labels for both of the axes
            this.drawLabels()
            
            
            // Draw the labelsAbove labels
            this.drawLabelsAbove();



            
            
            // Draw the key
            if (typeof prop.key !== null && RGraph.SVG.drawKey) {
                RGraph.SVG.drawKey(this);
            } else if (!RGraph.SVG.isNull(prop.key)) {
                alert('The drawKey() function does not exist - have you forgotten to include the key library?');
            }



            // Fire the draw event
            RGraph.SVG.fireCustomEvent(this, 'ondraw');

            return this;
        };








        //
        // Draws the background
        //
        this.drawBackground = function ()
        {
            // Save the original gutter properties
            var originalMarginRight = prop.marginRight,
                originalMarginLeft  = prop.marginLeft;
            
            // Draw the LEFT background
            prop.marginRight = this.width - (prop.marginLeft + this.graphWidth);
            if (RGraph.SVG.isNull(prop.backgroundGridHlinesCount)) {
                var resetToNull = true;
                prop.backgroundGridHlinesCount = this.left.length;
            }





            // Set the LEFT background image properties
            var properties = ['','Aspect','Opacity','Stretch','X','Y','W','H',];
            
            for (i in properties ) {
                if (typeof properties[i] === 'string') {
                    prop['backgroundImage' + String(properties[i])] = prop['backgroundImageLeft' + properties[i]];
                }
            }




            RGraph.SVG.drawBackground(this);
            
            if (resetToNull) {
                prop.backgroundGridHlinesCount = null;
            }
















            // Draw the RIGHT background
            prop.marginRight = originalMarginRight;
            prop.marginLeft  = this.width - (prop.marginRight + this.graphWidth);
            if (RGraph.SVG.isNull(prop.backgroundGridHlinesCount)) {
                prop.backgroundGridHlinesCount = this.right.length;
            }














            // Set the RIGHT background image properties
            var properties = ['','Aspect','Opacity','Stretch','X','Y','W','H',];
            
            for (i in properties ) {
                if (typeof properties[i] === 'string') {
                    prop['backgroundImage' + properties[i]] = prop['backgroundImageRight' + properties[i]];
                }
            }





            // Draw the background
            RGraph.SVG.drawBackground(this);






            // Reset the margin properties to the original values
            prop.marginLeft  = originalMarginLeft;
            prop.marginRight = originalMarginRight;
        };



























        //
        // Draws the axes
        //
        this.drawAxes = function ()
        {
            // Draw the LEFT X axes
            if (prop.xaxis) {
                RGraph.SVG.create({
                    svg: this.svg,
                    type: 'path',
                    parent: this.svg.all,
                    attr: {
                        d: 'M {1} {2} L {3} {4}'.format(
                            prop.marginLeft,
                            this.height - prop.marginBottom,
                            prop.marginLeft + this.graphWidth,
                            this.height - prop.marginBottom
                        ),
                        'stroke-width': prop.xaxisLinewidth,
                        stroke: prop.xaxisColor,
                        fill: 'rgba(0,0,0,0)',
                        'shape-rendering': 'crispEdges'
                    }
                });




                // Draw the right X axis
                RGraph.SVG.create({
                    svg: this.svg,
                    type: 'path',
                    parent: this.svg.all,
                    attr: {
                        d: 'M {1} {2} L {3} {4}'.format(
                            this.width - prop.marginRight,
                            this.height - prop.marginBottom,
                            this.width - prop.marginRight - this.graphWidth,
                            this.height - prop.marginBottom
                        ),
                        'stroke-width': prop.xaxisLinewidth,
                        stroke: prop.xaxisColor,
                        fill: 'rgba(0,0,0,0)',
                        'shape-rendering': 'crispEdges'
                    }
                });
                
                //
                // Draw tickmarks if necessary
                //
                if (prop.xaxisTickmarks) {
                
                    var startY = this.height - prop.marginBottom,
                        endY   = this.height - prop.marginBottom + prop.xaxisTickmarksLength;

                    // Draw the LEFT sides tickmarks
                    for (var i=0; i<prop.xaxisLabelsPositionEdgeTickmarksCount; ++i) {
    
                        var x = prop.marginLeft + (i * (this.graphWidth / prop.xaxisLabelsPositionEdgeTickmarksCount));

                        RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    x + 0.001,
                                    startY,
                                    x,
                                    endY
                                ),
                                stroke: prop.xaxisColor,
                                'stroke-width': prop.xaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                    
                    // Draw an extra LEFT tick if no Y axis is being shown
                    if (!prop.yaxis) {
                        
                        var x = prop.marginLeft + this.graphWidth;

                        RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    x + 0.001,
                                    startY,
                                    x,
                                    endY
                                ),
                                stroke: prop.xaxisColor,
                                'stroke-width': prop.xaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }









                    // Draw the RIGHT sides tickmarks
                    for (var i=0; i<prop.xaxisLabelsPositionEdgeTickmarksCount; ++i) {
    
                        var x = prop.marginLeft + prop.marginCenter + this.graphWidth + ((i+1) * (this.graphWidth / prop.xaxisLabelsPositionEdgeTickmarksCount));

                        RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    x + 0.001,
                                    startY,
                                    x,
                                    endY
                                ),
                                stroke: prop.xaxisColor,
                                'stroke-width': prop.xaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }


                    // Draw an extra RIGHT tick if no Y axis is being shown
                    if (!prop.yaxis) {
                        
                        var x = prop.marginLeft + this.graphWidth + prop.marginCenter;

                        RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    x + 0.001,
                                    startY,
                                    x,
                                    endY
                                ),
                                stroke: prop.xaxisColor,
                                'stroke-width': prop.xaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                }
            }














            // Draw the LEFT vertical axes
            if (prop.yaxis) {
                RGraph.SVG.create({
                    svg: this.svg,
                    type: 'path',
                    parent: this.svg.all,
                    attr: {
                        d: 'M {1} {2} L {3} {4}'.format(
                            prop.marginLeft + this.graphWidth,
                            this.height - prop.marginBottom,
                            prop.marginLeft + this.graphWidth,
                            prop.marginTop
                        ),
                        'stroke-width': prop.yaxisLinewidth,
                        stroke: prop.yaxisColor,
                        fill: 'rgba(0,0,0,0)',
                        'shape-rendering': 'crispEdges',
                        'stroke-linecap': 'square'
                    }
                });




                // Draw the RIGHT vertical  axis
                RGraph.SVG.create({
                    svg: this.svg,
                    type: 'path',
                    parent: this.svg.all,
                    attr: {
                        d: 'M {1} {2} L {3} {4}'.format(
                            prop.marginLeft + this.graphWidth + prop.marginCenter,
                            this.height - prop.marginBottom,
                            prop.marginLeft + this.graphWidth + prop.marginCenter,
                            prop.marginTop
                        ),
                        'stroke-width': prop.yaxisLinewidth,
                        stroke: prop.yaxisColor,
                        fill: 'rgba(0,0,0,0)',
                        'shape-rendering': 'crispEdges',
                        'stroke-linecap': 'square'
                    }
                });




                //
                // Draw Y axis tickmarks if necessary
                //
                if (prop.yaxisTickmarks) {
                
                    var startX   = prop.marginLeft + this.graphWidth,
                        endX     = prop.marginLeft + this.graphWidth + prop.yaxisTickmarksLength,
                        numticks = this.left.length;
    
                    // Draw the left sides tickmarks
                    for (var i=0; i<numticks; ++i) {
    
                        var y = prop.marginTop + (i * (this.graphHeight / numticks));
    
                        RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX + 0.001,
                                    y,
                                    endX,
                                    y
                                ),
                                stroke: prop.yaxisColor,
                                'stroke-width': prop.yaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                    
                    // Draw an extra LEFT tickmark if the X axis is not being shown
                    if (!prop.xaxis) {

                        var y = prop.marginTop + this.graphHeight;
    
                        RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX + 0.001,
                                    y,
                                    endX,
                                    y
                                ),
                                stroke: prop.yaxisColor,
                                'stroke-width': prop.yaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }












                    var startX   = prop.marginLeft + this.graphWidth + prop.marginCenter,
                        endX     = prop.marginLeft + this.graphWidth + prop.marginCenter - prop.yaxisTickmarksLength,
                        numticks = this.right.length;



                    for (var i=0; i<numticks; ++i) {
    
                        var y = prop.marginTop + (i * (this.graphHeight / numticks));
    
                        RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX + 0.001,
                                    y,
                                    endX,
                                    y
                                ),
                                stroke: prop.yaxisColor,
                                'stroke-width': prop.yaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                    
                    // Draw an extra RIGHT tickmark if the X axis is not being shown
                    if (!prop.xaxis) {

                        var y = prop.marginTop + this.graphHeight;
    
                        RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX + 0.001,
                                    y,
                                    endX,
                                    y
                                ),
                                stroke: prop.yaxisColor,
                                'stroke-width': prop.yaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                }
            }
        };








        //
        // Draws the labels
        //
        this.drawLabels = function ()
        {
            //
            // Draw the Y axis labels
            //
            var numlabels = prop.yaxisLabels ? prop.yaxisLabels.length : 5

            for (var i=0; i<numlabels; ++i) {

                var segment = this.graphHeight / numlabels,
                    y       = prop.marginTop + (segment * i) + (segment / 2) + prop.yaxisLabelsOffsety,
                    x       = prop.marginLeft + this.graphWidth + (prop.marginCenter / 2) + prop.yaxisLabelsOffsetx;

                var text = RGraph.SVG.text({
                    object: this,
                    parent: this.svg.all,
                    text:   prop.yaxisLabels && prop.yaxisLabels[i] ? prop.yaxisLabels[i] : '',
                    x:      x,
                    y:      y,
                    halign: 'center',
                    valign: 'center',
                    tag:    'labels.yaxis',
                    font:   prop.yaxisLabelsFont || prop.textFont,
                    size:   typeof prop.yaxisLabelsSize === 'number' ? prop.yaxisLabelsSize : prop.textSize,
                    bold:   typeof prop.yaxisLabelsBold === 'boolean' ? prop.yaxisLabelsBold : prop.textBold,
                    italic: typeof prop.yaxisLabelsItalic === 'boolean' ? prop.yaxisLabelsItalic : prop.textItalic,
                    color:  prop.yaxisLabelsColor  || prop.textColor
                });
            }





            //
            // Add the minimum label for the LEFT side
            //
            var y   = this.height - prop.marginBottom + 10,
                str = (typeof prop.xaxisScaleFormatter === 'function') ?
                    prop.xaxisScaleFormatter(this, prop.xaxisScaleMin)
                    :
                    (prop.xaxisScaleUnitsPre + prop.xaxisScaleMin.toFixed(prop.xaxisScaleDecimals).replace(/\./, prop.xaxisScalePoint) + prop.xaxisScaleUnitsPost);

            var text = RGraph.SVG.text({
                
                object:     this,
                parent:     this.svg.all,
                
                text:       str,
                
                x:          prop.marginLeft + this.graphWidth + prop.xaxisLabelsOffsetx,
                y:          y + prop.xaxisLabelsOffsety,
                halign:     'center',
                valign:     'top',
                
                tag:        'labels.xaxis',
                
                font:       prop.xaxisLabelsFont   || prop.textFont,
                size:       typeof prop.xaxisLabelsSize   === 'number' ? prop.xaxisLabelsSize : prop.textSize,
                bold:       typeof prop.xaxisLabelsBold   === 'boolean' ? prop.xaxisLabelsBold   : prop.textBold,
                italic:     typeof prop.xaxisLabelsItalic === 'boolean' ? prop.xaxisLabelsItalic : prop.textItalic,
                color:      prop.xaxisLabelsColor  || prop.textColor
            });


            //
            // Draw the X axis scale for the LEFT side
            //
            var segment = this.graphWidth / prop.xaxisLabelsCount;

            for (var i=0; i<this.scale.labels.length; ++i) {

                RGraph.SVG.text({
                    
                    object: this,
                    parent: this.svg.all,
                    
                    text:   this.scale.labels[i],
                    
                    x:      prop.marginLeft + this.graphWidth - (segment * (i+1)) + prop.xaxisLabelsOffsetx,
                    y:      this.height - prop.marginBottom + 10 + prop.xaxisLabelsOffsety,
                    halign: 'center',
                    valign: 'top',
                    
                    tag:    'labels.xaxis',
                    
                    font:   prop.xaxisLabelsFont   || prop.textFont,
                    size:   typeof prop.xaxisLabelsSize === 'number' ? prop.xaxisLabelsSize : prop.textSize,
                    bold:   typeof prop.xaxisLabelsBold   === 'boolean' ? prop.xaxisLabelsBold   : prop.textBold,
                    italic: typeof prop.xaxisLabelsItalic === 'boolean' ? prop.xaxisLabelsItalic : prop.textItalic,
                    color:  prop.xaxisLabelsColor  || prop.textColor
                });
            }











            //
            // Add the minimum label for the RIGHT side
            //
            var text = RGraph.SVG.text({
                
                object: this,
                parent: this.svg.all,
                
                text:   (typeof prop.xaxisScaleFormatter == 'function') ?
                            prop.xaxisScaleFormatter(this, prop.xaxisScaleMin)
                            :
                            prop.xaxisScaleUnitsPre + prop.xaxisScaleMin.toFixed(prop.xaxisScaleDecimals).replace(/\./, prop.xaxisScalePoint) + prop.xaxisScaleUnitsPost,
                
                x:      prop.marginLeft + this.graphWidth + prop.marginCenter + prop.xaxisLabelsOffsetx,
                y:      this.height - prop.marginBottom + 10 + prop.xaxisLabelsOffsety,
                halign: 'center',
                valign: 'top',
                
                tag:    'labels.xaxis',
                
                font:   prop.xaxisLabelsFont   || prop.textFont,
                size:   typeof prop.xaxisLabelsSize === 'number' ? prop.xaxisLabelsSize : prop.textSize,
                bold:   typeof prop.xaxisLabelsBold   === 'boolean' ? prop.xaxisLabelsBold   : prop.textBold,
                italic: typeof prop.xaxisLabelsItalic === 'boolean' ? prop.xaxisLabelsItalic : prop.textItalic,
                color:  prop.xaxisLabelsColor  || prop.textColor
            });

            //
            // Draw the X axis scale for the RIGHT side
            //
            for (var i=0; i<this.scale.labels.length; ++i) {

                RGraph.SVG.text({
                    object: this,
                    parent: this.svg.all,
                    text:   this.scale.labels[i],
                    x:      prop.marginLeft + this.graphWidth + prop.marginCenter + (segment * (i + 1)) + prop.xaxisLabelsOffsetx,
                    y:      this.height - prop.marginBottom + 10 + prop.xaxisLabelsOffsety,
                    halign: 'center',
                    valign: 'top',
                    tag:    'labels.xaxis',
                    font:   prop.xaxisLabelsFont   || prop.textFont,
                    size:   typeof prop.xaxisLabelsSize === 'number' ? prop.xaxisLabelsSize : prop.textSize,
                    bold:   typeof prop.xaxisLabelsBold   === 'boolean' ? prop.xaxisLabelsBold   : prop.textBold,
                    italic: typeof prop.xaxisLabelsItalic === 'boolean' ? prop.xaxisLabelsItalic : prop.textItalic,
                    color:  prop.xaxisLabelsColor  || prop.textColor
                });
            }





        };








        //
        // Draws the bars
        //
        this.drawBars = function ()
        {
            if (prop.shadow) {
                RGraph.SVG.setShadow({
                    object:  this,
                    offsetx: prop.shadowOffsetx,
                    offsety: prop.shadowOffsety,
                    blur:    prop.shadowBlur,
                    opacity: prop.shadowOpacity,
                    id:      'dropShadow'
                });
            }







            // Go thru the LEFT data and draw the bars
            for (var i=0; i<this.left.length; ++i) {

                // LEFT REGULAR NUMBER
                if (typeof this.left[i] === 'number') {

                    var color   = prop.colors[this.sequentialIndex],
                        tooltip = RGraph.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                        y       = prop.marginTop + ((this.graphHeight / this.left.length) * i) + prop.marginInner,
                        width   = this.getWidth(this.left[i]),
                        x       = prop.marginLeft + this.graphWidth - width,
                        height  = (this.graphHeight / this.left.length) - prop.marginInner - prop.marginInner;
                        
        
                    var rect = RGraph.SVG.create({
                        svg: this.svg,
                        parent: this.svg.all,
                        type: 'rect',
                        attr: {
                            x:                       x,
                            y:                       y,
                            width:                   width,
                            height:                  height,
                            fill:                    prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[0],
                            stroke:                  prop.colorsStroke,
                            'stroke-width':          prop.linewidth,
                            'shape-rendering':       'crispEdges',
                            'data-original-x':       x,
                            'data-original-y':       y,
                            'data-original-width':   width,
                            'data-original-height':  height,
                            'data-tooltop':          (tooltip || ''),
                            'data-index':            i,
                            'data-sequential-index': this.sequentialIndex,
                            'data-value':            this.left[i],
                            filter: prop.shadow ? 'url(#dropShadow)' : ''
                        }
                    });











                    this.coords.push({
                        object:  this,
                        element: rect,
                        x:      parseFloat(rect.getAttribute('x')),
                        y:      parseFloat(rect.getAttribute('y')),
                        width:  parseFloat(rect.getAttribute('width')),
                        height: parseFloat(rect.getAttribute('height'))
                    });

                    this.coordsLeft.push({
                        object:  this,
                        element: rect,
                        x:      parseFloat(rect.getAttribute('x')),
                        y:      parseFloat(rect.getAttribute('y')),
                        width:  parseFloat(rect.getAttribute('width')),
                        height: parseFloat(rect.getAttribute('height'))
                    });




                    this.installTooltipsEventListeners({
                        rect: rect,
                        index: i,
                        sequentialIndex: this.sequentialIndex
                    });

                    this.sequentialIndex++;







                // LEFT STACKED
                } else if (RGraph.SVG.isArray(this.left[i]) && prop.grouping === 'stacked') {

                    var accWidth = 0;

                    for (var j=0; j<this.left[i].length; ++j) {

                        var color    = prop.colors[this.sequentialIndex],
                            tooltip  = RGraph.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                            y        = prop.marginTop + ((this.graphHeight / this.left.length) * i) + prop.marginInner,
                            width    = this.getWidth(this.left[i][j]),
                            accWidth = accWidth + width,
                            x        = prop.marginLeft + this.graphWidth - accWidth,
                            height   = (this.graphHeight / this.left.length) - prop.marginInner - prop.marginInner;











                        // If this is the first iteration of the loop and a shadow
                        // is requested draw a rect here to create it.
                        if (j === 0 && prop.shadow) {
                            
                            var shadowBackfaceX = prop.marginLeft + this.graphWidth - this.getWidth(RGraph.SVG.arraySum(this.left[i])),
                                shadowBackfaceWidth = this.getWidth(RGraph.SVG.arraySum(this.left[i]));
                                

                            var rect = RGraph.SVG.create({
                                svg: this.svg,
                                parent: this.svg.all,
                                type: 'rect',
                                attr: {
                                    fill: '#eee',
                                    x: shadowBackfaceX,
                                    y: y,
                                    width: shadowBackfaceWidth,
                                    height: height,
                                    'stroke-width': 0,
                                    'data-index': i,
                                    filter: 'url(#dropShadow)'
                                }
                            });

                            this.stackedBackfacesLeft[i] = rect;
                        }






                        var rect = RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'rect',
                            attr: {
                                x:                      x,
                                y:                      y,
                                width:                  width,
                                height:                 height,
                                fill:                   prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[j],
                                stroke:                 prop.colorsStroke,
                                'stroke-width':         prop.linewidth,
                                'shape-rendering':      'crispEdges',
                                'data-original-x':       x,
                                'data-original-y':       y,
                                'data-original-width':   width,
                                'data-original-height':  height,
                                'data-tooltop':          (tooltip || ''),
                                'data-index':            i,
                                'data-subindex':         j,
                                'data-sequential-index': this.sequentialIndex,
                                'data-value':            this.left[i][j]
                            }
                        });






                        this.coords.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coordsLeft.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        if (!this.coords2[i]) {
                            this.coords2[i] = [];
                        }

                        if (!this.coords2Left[i]) {
                            this.coords2Left[i] = [];
                        }

                        this.coords2[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coords2Left[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });










                        this.installTooltipsEventListeners({
                            rect: rect,
                            index: i,
                            sequentialIndex: this.sequentialIndex
                        });
                        
                        
                        this.sequentialIndex++;
                    }









                // LEFT GROUPED
                } else if (RGraph.SVG.isArray(this.left[i]) && prop.grouping === 'grouped') {

                    for (var j=0; j<this.left[i].length; ++j) {

                        var color    = prop.colors[this.sequentialIndex],
                            tooltip  = RGraph.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                            height   = ((this.graphHeight / this.left.length) - prop.marginInner - prop.marginInner - (prop.marginInnerGrouped * (this.left[i].length - 1))) / this.left[i].length,
                            y        = prop.marginTop + ((this.graphHeight / this.left.length) * i) + prop.marginInner + (height * j) + (j * prop.marginInnerGrouped),
                            width    = this.getWidth(this.left[i][j]),
                            x        = prop.marginLeft + this.graphWidth - width;

            
                        var rect = RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'rect',
                            attr: {
                                x:                      x,
                                y:                      y,
                                width:                  width,
                                height:                 height,
                                fill:                   prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[j],
                                stroke:                 prop.colorsStroke,
                                'stroke-width':         prop.linewidth,
                                'shape-rendering':      'crispEdges',
                                'data-original-x':       x,
                                'data-original-y':       y,
                                'data-original-width':   width,
                                'data-original-height':  height,
                                'data-tooltop':          (tooltip || ''),
                                'data-index':            i,
                                'data-subindex':         j,
                                'data-sequential-index': this.sequentialIndex,
                                'data-value':            this.left[i][j],
                                filter: prop.shadow ? 'url(#dropShadow)' : ''
                            }
                        });






                        this.coords.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coordsLeft.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });


                        if (!this.coords2[i]) {
                            this.coords2[i] = [];
                        }

                        if (!this.coords2Left[i]) {
                            this.coords2Left[i] = [];
                        }

                        this.coords2[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coords2Left[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.installTooltipsEventListeners({
                            rect: rect,
                            index: i,
                            sequentialIndex: this.sequentialIndex
                        });

                        this.sequentialIndex++;
                    }
                }
            }


















            // Go thru the RIGHT data and draw the bars
            for (var i=0; i<this.right.length; ++i) {

                // RIGHT REGULAR
                if (typeof this.right[i] === 'number') {

                    var color   = prop.colors[this.sequentialIndex],
                        tooltip = RGraph.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                        y       = prop.marginTop + ((this.graphHeight / this.right.length) * i) + prop.marginInner,
                        width   = this.getWidth(this.right[i]),
                        x       = prop.marginLeft + this.graphWidth + prop.marginCenter,
                        height  = (this.graphHeight / this.right.length) - prop.marginInner - prop.marginInner;
                        
        
                    var rect = RGraph.SVG.create({
                        svg: this.svg,
                        parent: this.svg.all,
                        type: 'rect',
                        attr: {
                            x:                       x,
                            y:                       y,
                            width:                   width,
                            height:                  height,
                            fill:                    prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[0],
                            stroke:                  prop.colorsStroke,
                            'stroke-width':          prop.linewidth,
                            'shape-rendering':       'crispEdges',
                            'data-original-x':       x,
                            'data-original-y':       y,
                            'data-original-width':   width,
                            'data-original-height':  height,
                            'data-tooltop':          (tooltip || ''),
                            'data-index':            i,
                            'data-sequential-index': this.sequentialIndex,
                            'data-value':            this.right[i],
                            filter: prop.shadow ? 'url(#dropShadow)' : ''
                        }
                    });

                    this.coords.push({
                        object:  this,
                        element: rect,
                        x:      parseFloat(rect.getAttribute('x')),
                        y:      parseFloat(rect.getAttribute('y')),
                        width:  parseFloat(rect.getAttribute('width')),
                        height: parseFloat(rect.getAttribute('height'))
                    });

                    this.coordsRight.push({
                        object:  this,
                        element: rect,
                        x:      parseFloat(rect.getAttribute('x')),
                        y:      parseFloat(rect.getAttribute('y')),
                        width:  parseFloat(rect.getAttribute('width')),
                        height: parseFloat(rect.getAttribute('height'))
                    });

                    this.installTooltipsEventListeners({
                        rect: rect,
                        index: i,
                        sequentialIndex: this.sequentialIndex
                    });
                    
                    this.sequentialIndex++;


                // RIGHT STACKED
                } else if (RGraph.SVG.isArray(this.right[i]) && prop.grouping === 'stacked') {


                    var accWidth = 0;

                    for (var j=0; j<this.right[i].length; ++j) {

                        var color    = prop.colors[this.sequentialIndex],
                            tooltip  = RGraph.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                            y        = prop.marginTop + ((this.graphHeight / this.right.length) * i) + prop.marginInner,
                            width    = this.getWidth(this.right[i][j]),
                            x        = prop.marginLeft + this.graphWidth + prop.marginCenter + accWidth,
                            accWidth = accWidth + width,
                            height   = (this.graphHeight / this.left.length) - prop.marginInner - prop.marginInner;








                        // If this is the first iteration of the loop and a shadow
                        // is requested draw a rect here to create it.
                        if (j === 0 && prop.shadow) {
                            
                            var shadowBackfaceX     = prop.marginLeft + this.graphWidth + prop.marginCenter,
                                shadowBackfaceWidth = this.getWidth(RGraph.SVG.arraySum(this.right[i]));
                                

                            var rect = RGraph.SVG.create({
                                svg: this.svg,
                                parent: this.svg.all,
                                type: 'rect',
                                attr: {
                                    fill: '#eee',
                                    x: shadowBackfaceX,
                                    y: y,
                                    width: shadowBackfaceWidth,
                                    height: height,
                                    'stroke-width': 0,
                                    'data-index': i,
                                    filter: 'url(#dropShadow)'
                                }
                            });
                            
                            this.stackedBackfacesRight[i] = rect;
                        }
















                        var rect = RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'rect',
                            attr: {
                                x:                       x,
                                y:                       y,
                                width:                   width,
                                height:                  height,
                                fill:                    prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[j],
                                stroke:                  prop.colorsStroke,
                                'stroke-width':          prop.linewidth,
                                'shape-rendering':       'crispEdges',
                                'data-original-x':       x,
                                'data-original-y':       y,
                                'data-original-width':   width,
                                'data-original-height':  height,
                                'data-tooltop':          (tooltip || ''),
                                'data-index':            i,
                                'data-subindex':         j,
                                'data-sequential-index': this.sequentialIndex,
                                'data-value':            this.right[i][j]
                            }
                        });









                        this.coords.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coordsRight.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });



                        if (!this.coords2[i + this.left.length]) {
                            this.coords2[i + this.left.length] = [];
                        }

                        if (!this.coords2Right[i]) {
                            this.coords2Right[i] = [];
                        }

                        this.coords2[i + this.left.length].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coords2Right[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.installTooltipsEventListeners({
                            rect: rect,
                            index: i,
                            sequentialIndex: this.sequentialIndex
                        });

                        this.sequentialIndex++;
                    }













                // RIGHT GROUPED
                } else if (RGraph.SVG.isArray(this.right[i]) && prop.grouping === 'grouped') {

                    for (var j=0; j<this.right[i].length; ++j) {

                        var color    = prop.colors[this.sequentialIndex],
                            tooltip  = RGraph.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                            height   = ((this.graphHeight / this.right.length) - prop.marginInner - prop.marginInner - (prop.marginInnerGrouped * (this.right[i].length - 1))) / this.right[i].length,
                            y        = prop.marginTop + ((this.graphHeight / this.right.length) * i) + prop.marginInner + (height * j) + (j * prop.marginInnerGrouped),
                            width    = this.getWidth(this.right[i][j]),
                            x        = prop.marginLeft + this.graphWidth + prop.marginCenter;

            
                        var rect = RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'rect',
                            attr: {
                                x:                      x,
                                y:                      y,
                                width:                  width,
                                height:                 height,
                                fill:                   prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[j],
                                stroke:                 prop.colorsStroke,
                                'stroke-width':         prop.linewidth,
                                'shape-rendering':      'crispEdges',
                                'data-original-x':       x,
                                'data-original-y':       y,
                                'data-original-width':   width,
                                'data-original-height':  height,
                                'data-tooltop':          (tooltip || ''),
                                'data-index':            i,
                                'data-subindex':         j,
                                'data-sequential-index': this.sequentialIndex,
                                'data-value':            this.right[i][j],
                                filter: prop.shadow ? 'url(#dropShadow)' : ''
                            }
                        });









                        this.coords.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coordsRight.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });









                        if (!this.coords2[i + this.left.length]) {
                            this.coords2[i + this.left.length] = [];
                        }

                        if (!this.coords2Right[i]) {
                            this.coords2Right[i] = [];
                        }

                        this.coords2[i + this.left.length].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coords2Right[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });










                        this.installTooltipsEventListeners({
                            rect: rect,
                            index: i,
                            sequentialIndex: this.sequentialIndex
                        });

                        this.sequentialIndex++;
                    }
                }
            }
        };








        //
        // Installs the tooltips event lissteners. This is called from the
        // above function.
        //
        // @param object opt The various arguments to the function
        //
        this.installTooltipsEventListeners = function (opt)
        {
            var obj = this;

            // Add the tooltip events
            if (!RGraph.SVG.isNull(prop.tooltips) && prop.tooltips[this.sequentialIndex]) {
                //
                // Add tooltip event listeners
                //
                (function (idx, seq)
                {

                    opt.rect.addEventListener(prop.tooltipsEvent.replace(/^on/, ''), function (e)
                    {
                        obj.removeHighlight();

                        // Show the tooltip
                        RGraph.SVG.tooltip({
                            object:          obj,
                            index:           idx,
                            group:           null,
                            sequentialIndex: seq,
                            text:            prop.tooltips[seq],
                            event:           e
                        });
                        
                        // Highlight the rect that has been clicked on
                        obj.highlight(e.target);
                    }, false);

                    opt.rect.addEventListener('mousemove', function (e)
                    {
                        e.target.style.cursor = 'pointer'
                    }, false);
                })(opt.index, opt.sequentialIndex);
            }
        };








        //
        // 
        // 
        // @param int value The value to get the width for.
        //
        this.getWidth = function (value)
        {
            var x1 = this.getLeftXCoord(0),
                x2 = this.getLeftXCoord(value);

            if (RGraph.SVG.isNull(x1) || RGraph.SVG.isNull(x2)) {
                return null;
            }

            return x1 - x2;
        };








        //
        // This function is similar to the above but instead 
        // of a width it gets a relevant coord for a value
        // on the LEFT side
        // 
        // @param int value The value to get the coordinate for.
        //
        this.getLeftXCoord = function (value)
        {
            var width;

            if (value > this.scale.max) {
                return null;
            }

            if (value < this.scale.min) {
                return null;
            }

            width  = ((value - this.scale.min) / (this.scale.max - this.scale.min));
            width *= this.graphWidth;
            
            // Calculate the X coord
            var x  = prop.marginLeft + this.graphWidth - width;

            return x;
        };








        //
        // This function gets an X coordinate for the RIGHT
        // side.
        // 
        // @param int value The value to get the coordinate for.
        //
        this.getRightXCoord = function (value)
        {
            var width;

            if (value > this.scale.max) {
                return null;
            }

            if (value < this.scale.min) {
                return null;
            }

            width  = ((value - this.scale.min) / (this.scale.max - this.scale.min));
            width *= this.graphWidth;
            
            // Calculate the X coord
            var x  = prop.marginLeft + this.graphWidth + prop.marginCenter + width;

            return x;
        };








        //
        // This function can be used to highlight a bar on the chart
        // 
        // @param object rect The rectangle to highlight
        //
        this.highlight = function (rect)
        {
            var x      = parseInt(rect.getAttribute('x')),
                y      = parseInt(rect.getAttribute('y')),
                width  = parseInt(rect.getAttribute('width')),
                height = parseInt(rect.getAttribute('height'));

            var highlight = RGraph.SVG.create({
                svg: this.svg,
                parent: this.svg.all,
                type: 'rect',
                attr: {
                    'stroke-width': prop.highlightLinewidth,
                    stroke:         prop.highlightStroke,
                    fill:           prop.highlightFill,
                    x:              x - 1,
                    y:              y - 1,
                    width:          width + 2,
                    height:         height + 2
                },
                style: {
                    pointerEvents: 'none'
                }
            });


            // Store the highlight rect in the rebistry so
            // it can be cleared later
            RGraph.SVG.REG.set('highlight', highlight);
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function () 
        {
            // Save the original colors so that they can be restored when
            // the canvas is cleared
            if (!Object.keys(this.originalColors).length) {
                this.originalColors = {
                    colors:              RGraph.SVG.arrayClone(prop.colors),
                    backgroundGridColor: RGraph.SVG.arrayClone(prop.backgroundGridColor),
                    highlightFill:       RGraph.SVG.arrayClone(prop.highlightFill),
                    backgroundColor:     RGraph.SVG.arrayClone(prop.backgroundColor)
                }
            }


            // colors
            var colors = prop.colors;

            if (colors) {
                for (var i=0; i<colors.length; ++i) {
                    colors[i] = RGraph.SVG.parseColorLinear({
                        object: this,
                        color: colors[i],
                        direction: 'horizontal'
                    });
                }
            }

            prop.backgroundGridColor = RGraph.SVG.parseColorLinear({object: this, color: prop.backgroundGridColor,direction:'horizontal'});
            prop.highlightFill       = RGraph.SVG.parseColorLinear({object: this, color: prop.highlightFill,direction:'horizontal'});
            prop.backgroundColor     = RGraph.SVG.parseColorLinear({object: this, color: prop.backgroundColor,direction:'horizontal'});
        };








        //
        // Draws the labelsAbove
        //
        this.drawLabelsAbove = function ()
        {
            // Go through the above labels
            if (prop.labelsAbove) {

                //var data_seq      = RGraph.SVG.arrayLinearize(this.data),
                //    seq           = 0,
                //    stacked_total = 0;

                for (var dataset=0,seq=0; dataset<this.data.length; ++dataset,++seq) {
                    for (var i=0; i<this.data[dataset].length; ++i,++seq) {

                        var value   = this.data[dataset][i],
                            halign  = dataset === 0 ? 'right' : 'left',
                            valign  = 'center',
                            hoffset = dataset === 0 ? -10 : 10;

                        // REGULAR CHART
                        if (typeof value === 'number') {

                            if (this.coords[seq]) {

                                var x      = parseInt(this.coords[seq].element.getAttribute('x')) + hoffset + prop.labelsAboveOffsetx;
                                var height = parseInt(this.coords[seq].element.getAttribute('height'));
                                var y      = parseInt(this.coords[seq].element.getAttribute('y')) + (height / 2) + prop.labelsAboveOffsety;
                                var width  = parseInt(this.coords[seq].element.getAttribute('width'));

                                // If the dataset is the RHS (which would equal )
                                // then set the alignment appropriately
                                if (dataset === 1) {
                                    x += width;
                                }
    
                                var str = RGraph.SVG.numberFormat({
                                    object:    this,
                                    num:       value.toFixed(prop.labelsAboveDecimals),
                                    prepend:   typeof prop.labelsAboveUnitsPre  === 'string'   ? prop.labelsAboveUnitsPre  : null,
                                    append:    typeof prop.labelsAboveUnitsPost === 'string'   ? prop.labelsAboveUnitsPost : null,
                                    point:     typeof prop.labelsAbovePoint     === 'string'   ? prop.labelsAbovePoint     : null,
                                    thousand:  typeof prop.labelsAboveThousand  === 'string'   ? prop.labelsAboveThousand  : null,
                                    formatter: typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter : null
                                });
    
    
                                // Facilitate labelsAboveSpecific
                                if (prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && (typeof prop.labelsAboveSpecific[seq] === 'string' || typeof prop.labelsAboveSpecific[seq] === 'number') ) {
                                    str = String(prop.labelsAboveSpecific[seq]);
                                } else if ( prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && typeof prop.labelsAboveSpecific[seq] !== 'string' && typeof prop.labelsAboveSpecific[seq] !== 'number') {
                                    continue;
                                }
        
                                // Add the text to the SVG
                                RGraph.SVG.text({
                                    object:     this,
                                    parent:     this.svg.all,
                                    text:       str,
                                    x:          x,
                                    y:          y,
                                    halign:     halign,
                                    valign:     valign,
                                    tag:        'labels.above',
                                    font:       prop.labelsAboveFont              || prop.textFont,
                                    size:       typeof prop.labelsAboveSize === 'number' ? prop.labelsAboveSize : prop.textSize,
                                    bold:       typeof prop.labelsAboveBold === 'boolean' ? prop.labelsAboveBold   : prop.textBold,
                                    italic:     typeof prop.labelsAboveItalic === 'boolean' ? prop.labelsAboveItalic : prop.textItalic,
                                    color:      prop.labelsAboveColor             || prop.textColor,
                                    background: prop.labelsAboveBackground,
                                    padding:    prop.labelsAboveBackgroundPadding
                                });
                            }














                        // STACKED CHART
                        } else if (!RGraph.SVG.isNull(value) && typeof value === 'object' && prop.grouping === 'stacked') {

                            for (var k=0,sum=0,width=0; k<this.coords2[seq].length; ++k) {
                                sum += parseFloat(this.coords2[seq][k].element.getAttribute('data-value'));
                            }

                            var len =this.coords2[seq].length;

                            if (dataset === 0) {
                                var x      = parseFloat(this.coords2[seq][len - 1].x) + hoffset,
                                    height = parseFloat(this.coords2[seq][len - 1].height),
                                    y      = parseFloat(this.coords2[seq][0].y) + (height / 2);
                            } else {
                                var x      = parseFloat(this.coords2[this.data[0].length + i][0].x) + hoffset + prop.labelsAboveOffsetx,
                                    height = parseFloat(this.coords2[seq][len - 1].height),
                                    y      = parseFloat(this.coords2[seq][0].y) + (height / 2) + prop.labelsAboveOffsety;

                                // Work out the total width by summing all the individual widths

                                for (var j=0; j<this.coords2Right[i].length; ++j) {
                                    x += this.coords2Right[i][j].width;
                                }
                            }

                            var str = RGraph.SVG.numberFormat({
                                object:    this,
                                num:       sum.toFixed(prop.labelsAboveDecimals),
                                prepend:   typeof prop.labelsAboveUnitsPre  === 'string'   ? prop.labelsAboveUnitsPre  : null,
                                append:    typeof prop.labelsAboveUnitsPost === 'string'   ? prop.labelsAboveUnitsPost : null,
                                point:     typeof prop.labelsAbovePoint     === 'string'   ? prop.labelsAbovePoint     : null,
                                thousand:  typeof prop.labelsAboveThousand  === 'string'   ? prop.labelsAboveThousand  : null,
                                formatter: typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter : null
                            });

                            // Facilitate labelsAboveSpecific
                            if (prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && (typeof prop.labelsAboveSpecific[seq] === 'string' || typeof prop.labelsAboveSpecific[seq] === 'number') ) {
                                str = String(prop.labelsAboveSpecific[seq]);
                            } else if ( prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && typeof prop.labelsAboveSpecific[seq] !== 'string' && typeof prop.labelsAboveSpecific[seq] !== 'number') {
                                continue;
                            }
    
                            // Add the text to the SVG
                            RGraph.SVG.text({
                                object:     this,
                                parent:     this.svg.all,
                                text:       str,
                                x:          x,
                                y:          y,
                                halign:     halign,
                                valign:     valign,
                                tag:        'labels.above',
                                font:       prop.labelsAboveFont || prop.textFont,
                                size:       typeof prop.labelsAboveSize === 'number' ? prop.labelsAboveSize : prop.textSize,
                                bold:       typeof prop.labelsAboveBold === 'boolean' ? prop.labelsAboveBold : prop.textBold,
                                italic:     typeof prop.labelsAboveItalic === 'boolean' ? prop.labelsAboveItalic : prop.textItalic,
                                color:      prop.labelsAboveColor             || prop.textColor,
                                background: prop.labelsAboveBackground,
                                padding:    prop.labelsAboveBackgroundPadding
                            });


















                        // GROUPED CHART
                        } else if (!RGraph.SVG.isNull(value) && typeof value === 'object' && prop.grouping === 'grouped') {

                            for (var k=0; k<value.length; ++k) {
                            
                                val = value[k];
                                
                                if (typeof val !== 'number') {
                                    val = '';
                                }


                                var x      = parseInt(this.coords[seq].element.getAttribute('x')) + hoffset + prop.labelsAboveOffsetx,
                                    height = parseInt(this.coords[seq].element.getAttribute('height')),
                                    y      = parseInt(this.coords[seq].element.getAttribute('y')) + (height / 2) + prop.labelsAboveOffsety,
                                    width  = parseInt(this.coords[seq].element.getAttribute('width'));
                                
                                // If the dataset is the RHS (which would equal )
                                // then set the alignment appropriately
                                if (dataset === 1) {
                                    x += width;
                                }

                                var str = RGraph.SVG.numberFormat({
                                    object:    this,
                                    num:       parseFloat(val).toFixed(prop.labelsAboveDecimals),
                                    prepend:   typeof prop.labelsAboveUnitsPre  === 'string'   ? prop.labelsAboveUnitsPre  : null,
                                    append:    typeof prop.labelsAboveUnitsPost === 'string'   ? prop.labelsAboveUnitsPost : null,
                                    point:     typeof prop.labelsAbovePoint     === 'string'   ? prop.labelsAbovePoint     : null,
                                    thousand:  typeof prop.labelsAboveThousand  === 'string'   ? prop.labelsAboveThousand  : null,
                                    formatter: typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter : null
                                });

                                if (val === 0 || RGraph.SVG.isNull(val) || val === '') {                                    
                                    str = '';
                                }

                                // Facilitate labelsAboveSpecific
                                if (prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && (typeof prop.labelsAboveSpecific[seq] === 'string' || typeof prop.labelsAboveSpecific[seq] === 'number') ) {
                                    str = String(prop.labelsAboveSpecific[seq]);
                                } else if ( prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && typeof prop.labelsAboveSpecific[seq] !== 'string' && typeof prop.labelsAboveSpecific[seq] !== 'number') {
                                    continue;
                                }

                                // Add the text to the SVG
                                RGraph.SVG.text({
                                    object:     this,
                                    parent:     this.svg.all,
                                    text:       str,
                                    x:          x,
                                    y:          y,
                                    halign:     halign,
                                    valign:     valign,
                                    tag:        'labels.above',
                                    font:       prop.labelsAboveFont              || prop.textFont,
                                    size:       typeof prop.labelsAboveSize === 'number' ? prop.labelsAboveSize : prop.textSize,
                                    bold:       typeof prop.labelsAboveBold   === 'boolean' ? prop.labelsAboveBold   : prop.textBold,
                                    italic:     typeof prop.labelsAboveItalic === 'boolean' ? prop.labelsAboveItalic : prop.textItalic,
                                    color:      prop.labelsAboveColor             || prop.textColor,
                                    background: prop.labelsAboveBackground,
                                    padding:    prop.labelsAboveBackgroundPadding
                                });
                                
                                seq++;
                            }
                            
                            seq--;
                        } else if (RGraph.SVG.isNull(value)) {
                            --seq;
                        }
                    }

                    --seq;
                }
            }
        };








        //
        // Using a function to add events makes it easier to facilitate method
        // chaining
        // 
        // @param string   type The type of even to add
        // @param function func 
        //
        this.on = function (type, func)
        {
            if (type.substr(0,2) !== 'on') {
                type = 'on' + type;
            }
            
            RGraph.SVG.addCustomEventListener(this, type, func);
    
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
        // Remove highlight from the chart (tooltips)
        //
        this.removeHighlight = function ()
        {
            var highlight = RGraph.SVG.REG.get('highlight');
            if (highlight && highlight.parentNode) {
                highlight.parentNode.removeChild(highlight);
            }
            
            RGraph.SVG.REG.set('highlight', null);
        };








        //
        // Calulate the center gutter size
        //
        this.getMarginCenter =
        this.getGutterCenter = function ()
        {
            var bold  = typeof prop.yaxisLabelsBold === 'boolean' ? prop.yaxisLabelsBold : prop.textBold,
                font  = typeof prop.yaxisLabelsFont === 'string'  ? prop.yaxisLabelsFont : prop.textFont,
                size  = typeof prop.yaxisLabelsSize === 'number'  ? prop.yaxisLabelsSize : prop.textSize,
                width = 0;

            // Loop through the labels measuring them
            if (prop.yaxisLabels) {

                for (var i=0,len=prop.yaxisLabels.length; i<len; ++i) {

                    width = Math.max(width, RGraph.SVG.measureText({
                        text: prop.yaxisLabels[i],
                        bold: bold,
                        font: font,
                        size: size
                    })[0]);

                }
            } else {
                var width = 50;
            }

            return width + 15;
        };








        //
        // Draw the title
        //
        this.drawTitle = function ()
        {
            if (RGraph.SVG.isNull(prop.titleX)) {
                prop.titleX = ((this.width - prop.marginLeft - prop.marginRight) / 2) + prop.marginLeft;
            }

            RGraph.SVG.drawTitle(this);
        };







        //
        // The Bar chart grow effect
        //
        this.grow = function ()
        {
            var opt      = arguments[0] || {},
                frames   = opt.frames || 30,
                frame    = 0,
                obj      = this,
                left     = RGraph.SVG.arrayClone(this.left),
                right    = RGraph.SVG.arrayClone(this.right),
                seq      = 0;

            this.draw();

            var iterate = function ()
            {
                // LOOP THROUGH THE LEFT DATA
                for (var i=0,seq=0,len=obj.coordsLeft.length; i<len; ++i, ++seq) {

                    var   multiplier = (frame / frames)
                        // RGraph.SVG.FX.getEasingMultiplier(frames, frame)
                        // RGraph.SVG.FX.getEasingMultiplier(frames, frame);
                
                


                    // The main loop through the data
                    // LEFT REGULAR
                    if (typeof left[i] === 'number') {

                        width   = Math.abs(obj.getLeftXCoord(left[i]) - obj.getLeftXCoord(0));
                        left[i] = obj.left[i] * multiplier;

                        // Set the new height on the rect
                        obj.coordsLeft[i].element.setAttribute(
                            'width',
                            width
                        );

                        // Set the correct Y coord on the object
                        obj.coords[seq].element.setAttribute(
                            'x',
                            obj.getLeftXCoord(0) - width
                        );





                    // LEFT STACKED
                    } else if (typeof left[i] === 'object' && prop.grouping === 'stacked') {

                        var accumulativeWidth = 0;

                        for (var j=0,len2=left[i].length; j<len2; ++j, ++seq) {

                            width      = Math.abs(obj.getLeftXCoord(left[i][j]) - obj.getLeftXCoord(0));
                            left[i][j] = obj.left[i][j] * multiplier;

                            obj.coords[seq].element.setAttribute(
                                'width',
                                width
                            );

                            obj.coords[seq].element.setAttribute(
                                'x',
                                obj.getLeftXCoord(0) - width - accumulativeWidth
                            );

                            accumulativeWidth += (prop.grouping === 'stacked' ? width : 0);
                        }



                        //
                        // Set the width and X coord of the backfaces
                        //
                        if (obj.stackedBackfacesLeft[i]) {
                            obj.stackedBackfacesLeft[i].setAttribute(
                                'width',
                                accumulativeWidth
                            );
    
                            obj.stackedBackfacesLeft[i].setAttribute(
                                'x',
                                obj.getLeftXCoord(0) - accumulativeWidth
                            );
                        }

                        // Decrease seq by one so that it's not incremented twice
                        --seq;

                    // LEFT GROUPED
                    } else if (typeof left[i] === 'object' && prop.grouping === 'grouped') {

                        // Loop thru the group
                        for (var j=0,len2=left[i].length; j<len2; ++j, ++seq) {

                            width      = Math.abs(obj.getLeftXCoord(left[i][j]) - obj.getLeftXCoord(0));
                            left[i][j] = obj.left[i][j] * multiplier;

                            obj.coords[seq].element.setAttribute(
                                'width',
                                width
                            );

                            obj.coords[seq].element.setAttribute(
                                'x',
                                obj.getLeftXCoord(0) - width
                            );
                        }

                        // Decrease seq by one so that it's not incremented twice
                        --seq;
                    }
                }









                // LOOP THROUGH THE RIGHT DATA
                for (var i=0,seq=0,len=obj.coordsRight.length; i<len; ++i, ++seq) {

                    var   multiplier = (frame / frames)
                        // RGraph.SVG.FX.getEasingMultiplier(frames, frame)
                        // RGraph.SVG.FX.getEasingMultiplier(frames, frame);
                
                


                    // The main loop through the data
                    // RIGHT REGULAR
                    if (typeof right[i] === 'number') {

                        width    = Math.abs(obj.getRightXCoord(right[i]) - obj.getRightXCoord(0));
                        right[i] = obj.right[i] * multiplier;

                        // Set the new height on the rect
                        obj.coordsRight[i].element.setAttribute(
                            'width',
                            width
                        );

                        // Set the correct Y coord on the object
                        obj.coordsRight[seq].element.setAttribute(
                            'x',
                            obj.getRightXCoord(0)
                        );





                    // RIGHT STACKED
                    } else if (typeof right[i] === 'object' && prop.grouping === 'stacked') {

                        var accumulativeWidth = 0;

                        for (var j=0,len2=right[i].length; j<len2; ++j, ++seq) {

                            width      = Math.abs(obj.getRightXCoord(right[i][j]) - obj.getRightXCoord(0));
                            right[i][j] = obj.right[i][j] * multiplier;

                            obj.coordsRight[seq].element.setAttribute(
                                'width',
                                width
                            );

                            obj.coordsRight[seq].element.setAttribute(
                                'x',
                                obj.getRightXCoord(0) + accumulativeWidth
                            );

                            accumulativeWidth += width;
                        }



                        //
                        // Set the width and X coord of the backfaces
                        //
                        if (obj.stackedBackfacesRight[i]) {
                            obj.stackedBackfacesRight[i].setAttribute(
                                'width',
                                accumulativeWidth
                            );
    
                            obj.stackedBackfacesRight[i].setAttribute(
                                'x',
                                obj.getRightXCoord(0)
                            );
                        }

                        // Decrease seq by one so that it's not incremented twice
                        --seq;

                    // RIGHT GROUPED
                    } else if (typeof right[i] === 'object' && prop.grouping === 'grouped') {

                        // Loop thru the group
                        for (var j=0,len2=right[i].length; j<len2; ++j, ++seq) {

                            width      = Math.abs(obj.getRightXCoord(right[i][j]) - obj.getRightXCoord(0));
                            right[i][j] = obj.right[i][j] * multiplier;

                            obj.coordsRight[seq].element.setAttribute(
                                'width',
                                width
                            );

                            obj.coordsRight[seq].element.setAttribute(
                                'x',
                                obj.getRightXCoord(0)
                            );
                        }

                        // Decrease seq by one so that it's not incremented twice
                        --seq;
                    }
                }







                if (frame++ <= frames) {
                    RGraph.SVG.FX.update(iterate);
                } else if (opt.callback) {
                    (opt.callback)(obj);
                }
            };

            iterate();
            
            return this;
        };








        //
        // HBar chart Wave effect.
        // 
        // @param object OPTIONAL An object map of options. You specify 'frames'
        //                        here to give the number of frames in the effect
        //                        and also callback to specify a callback function
        //                        thats called at the end of the effect
        //
        this.wave = function ()
        {
            var obj                   = this,
                opt                   = arguments[0] || {},
                frames                = opt.frames || 120,
                startFrames_left      = [],
                startFrames_right     = [],
                counters_left         = [],
                counters_right        = [];

            var framesperbar    = frames / 3,
                frame_left      = -1,
                frame_right     = -1,
                callback        = arguments[1] || function () {},
                original_left   = RGraph.SVG.arrayClone(this.left),
                original_right  = RGraph.SVG.arrayClone(this.right);

            for (var i=0,len=this.left.length,seq=0; i<len; i+=1,++seq) {

                startFrames_left[seq]  = ((frames / 3) / (RGraph.SVG.arrayLinearize(this.left).length - 1)) * i;
                startFrames_right[seq] = ((frames / 3) / (RGraph.SVG.arrayLinearize(this.right).length - 1)) * i;
                counters_left[seq]     = 0;
                counters_right[seq]    = 0;

                if (RGraph.SVG.isArray(this.left[i])) {
                    for (var j=0; j<this.left[i].length; ++j,seq++) {
                        startFrames_left[seq]  = ((frames / 3) / (RGraph.SVG.arrayLinearize(this.left).length - 1)) * seq;
                        startFrames_right[seq] = ((frames / 3) / (RGraph.SVG.arrayLinearize(this.right).length - 1)) * seq;
                        counters_left[seq]     = 0;
                        counters_right[seq]    = 0;
                    }
                    
                    --seq;
                }
            }




            // This stops the chart from jumping
            this.draw();


            // Zero all of the data and set all of the rect widths to zero
            for (var i=0,len=this.left.length; i<len; i+=1) {
                if (typeof this.left[i] === 'number') {
                    this.left[i]  = 0;
                    this.right[i] = 0;

                    if (this.coordsLeft[i] && this.coordsLeft[i].element) this.coordsLeft[i].element.setAttribute('width', 0);
                    if (this.coordsRight[i] && this.coordsRight[i].element) this.coordsRight[i].element.setAttribute('width', 0);

                } else if (typeof this.left[i] === 'object' && !RGraph.SVG.isNull(this.left[i])) {
                    for (var j=0; j<this.left[i].length; ++j) {
                        this.left[i][j]  = 0;
                        this.right[i][j] = 0;
                        this.coords2Left[i][j].element.setAttribute('width', 0);
                        this.coords2Right[i][j].element.setAttribute('width', 0);
                    }
                }
            }

            //
            // Iterate over the left side
            //
            function iteratorLeft ()
            {
                ++frame_left;

                for (var i=0,len=obj.left.length,seq=0; i<len; i+=1,seq+=1) {

                    if (frame_left >= startFrames_left[seq]) {

                        var isNull = RGraph.SVG.isNull(obj.left[i]);

                        // Regular bars
                        if (typeof obj.left[i] === 'number') {
                            
                            obj.left[i] = Math.min(
                                Math.abs(original_left[i]),
                                Math.abs(original_left[i] * ( (counters_left[i]++) / framesperbar))
                            );
                            
                            var rect_left = obj.coords[i].element;
                            
                            rect_left.setAttribute(
                                'width',
                                parseFloat(rect_left.getAttribute('data-original-width')) * (obj.left[i] / rect_left.getAttribute('data-value'))
                            );
                            
                            rect_left.setAttribute(
                                'x',
                                obj.properties.marginLeft + obj.graphWidth - (parseFloat(rect_left.getAttribute('data-original-width')) * (obj.left[i] / rect_left.getAttribute('data-value')))
                            );


                        // Stacked or grouped bars
                        } else if (RGraph.SVG.isArray(obj.left[i])) {

                            for (var j=0,accWidth=0; j<obj.left[i].length; ++j,++seq) {

                                obj.left[i][j] = Math.min(
                                    Math.abs(original_left[i][j]),
                                    Math.abs(original_left[i][j] * ( (counters_left[seq]++) / framesperbar))
                                );

                                var rect_left = obj.coords[seq].element;

                                rect_left.setAttribute(
                                    'width',
                                    parseFloat(rect_left.getAttribute('data-original-width')) * (obj.left[i][j] / rect_left.getAttribute('data-value'))
                                );

                                rect_left.setAttribute(
                                    'x',
                                    obj.properties.marginLeft + obj.graphWidth - (parseFloat(rect_left.getAttribute('data-original-width')) * (obj.left[i][j] / rect_left.getAttribute('data-value'))) - accWidth
                                );
                                
                                // Only update this for stacked charts
                                if (obj.properties.grouping === 'stacked') {
                                    accWidth += parseFloat(rect_left.getAttribute('width'));
                                }
                            }
                            
                            seq--;
                        }
                            
                        if (isNull) {
                            obj.left[i] = null;
                        }
                    } else {
                        obj.left[i] = typeof obj.left[i] === 'object' && obj.left[i] ? RGraph.SVG.arrayPad([], obj.left[i].length, 0) : (RGraph.SVG.isNull(obj.left[i]) ? null : 0);
                    }
                }


                // No callback here - only called by the right function
                if (frame_left <= frames) {
                    RGraph.SVG.FX.update(iteratorLeft);
                }
            }












            //
            // Iterate over the right side
            //
            function iteratorRight ()
            {
                ++frame_right;

                for (var i=0,len=obj.right.length,seq=0; i<len; i+=1,seq+=1) {

                    if (frame_right >= startFrames_right[seq]) {

                        var isNull = RGraph.SVG.isNull(obj.right[i]);

                        // Regular bars
                        if (typeof obj.right[i] === 'number') {

                            obj.right[i] = Math.min(
                                Math.abs(original_right[i]),
                                Math.abs(original_right[i] * ( (counters_right[i]++) / framesperbar))
                            );

                            var rect_right = obj.coords[i + obj.left.length].element;

                            rect_right.setAttribute(
                                'width',
                                parseFloat(rect_right.getAttribute('data-original-width')) * (obj.right[i] / rect_right.getAttribute('data-value'))
                            );
                            
                            rect_right.setAttribute(
                                'x',
                                obj.properties.marginLeft + obj.graphWidth + prop.marginCenter
                            );

                        // Stacked or grouped bars
                        } else if (RGraph.SVG.isArray(obj.right[i])) {

                            for (var j=0,accWidth=0; j<obj.right[i].length; ++j,++seq) {

                                obj.right[i][j] = Math.min(
                                    Math.abs(original_right[i][j]),
                                    Math.abs(original_right[i][j] * ( (counters_right[seq]++) / framesperbar))
                                );

                                var rect_right = obj.coordsRight[seq].element;

                                rect_right.setAttribute(
                                    'width',
                                    parseFloat(rect_right.getAttribute('data-original-width')) * (obj.right[i][j] / rect_right.getAttribute('data-value'))
                                );

                                rect_right.setAttribute(
                                    'x',
                                    obj.properties.marginLeft + obj.graphWidth + prop.marginCenter + accWidth
                                );


                                
                                // Only update this for stacked charts
                                if (obj.properties.grouping === 'stacked') {
                                    accWidth += parseFloat(rect_right.getAttribute('width'));
                                }
                            }
                            
                            seq--;
                        }
                            
                        if (isNull) {
                            obj.right[i] = null;
                        }
                    } else {
                        obj.right[i] = typeof obj.right[i] === 'object' && obj.right[i] ? RGraph.SVG.arrayPad([], obj.right[i].length, 0) : (RGraph.SVG.isNull(obj.right[i]) ? null : 0);
                    }
                }


                // Call the callback if necessary
                if (frame_right <= frames) {
                    RGraph.SVG.FX.update(iteratorRight);
                } else {
                    // Fini - call the callback
                }
            }



            iteratorLeft();
            iteratorRight();

            return this;
        };








        //
        // Set the options that the user has provided
        //
        for (i in conf.options) {
            if (typeof i === 'string') {
                this.set(i, conf.options[i]);
            }
        }
    };
            
    return this;

// End module pattern
})(window, document);
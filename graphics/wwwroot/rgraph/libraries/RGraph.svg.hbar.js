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
    RGraph.SVG.HBar = function (conf)
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








        this.id               = conf.id;
        this.uid              = RGraph.SVG.createUID();
        this.container        = document.getElementById(this.id);
        this.layers           = {}; // MUST be before the SVG tag is created!
        this.svg              = RGraph.SVG.createSVG({object: this,container: this.container});
        this.isRGraph         = true;
        this.width            = Number(this.svg.getAttribute('width'));
        this.height           = Number(this.svg.getAttribute('height'));
        this.data             = conf.data;
        this.type             = 'hbar';
        this.coords           = [];
        this.coords2          = [];
        this.stackedBackfaces = [];
        this.colorsParsed     = false;
        this.originalColors   = {};
        this.gradientCounter  = 1;












        // Add this object to the ObjectRegistry
        RGraph.SVG.OR.add(this);
        
        this.container.style.display = 'inline-block';

        this.properties =
        {
            marginLeft:   100,
            marginRight:  35,
            marginTop:    35,
            marginBottom: 35,
            marginLeftAuto: true,

            backgroundColor:            null,
            backgroundImage:            null,
            backgroundImageAspect:      'none',
            backgroundImageStretch:     true,
            backgroundImageOpacity:     null,
            backgroundImageX:           null,
            backgroundImageY:           null,
            backgroundImageW:           null,
            backgroundImageH:           null,
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
            
            // 20 colors. If you need more you need to set the colors property
            colors: [
                'red', '#0f0', '#00f', '#ff0', '#0ff', '#0f0','pink','orange','gray','black',
                'red', '#0f0', '#00f', '#ff0', '#0ff', '#0f0','pink','orange','gray','black'
            ],
            colorsSequential:     false,
            colorsStroke:          'rgba(0,0,0,0)',

            marginInner:              3,
            marginInnerGrouped:       2,
            marginInnerTop:           0,
            marginInnerBottom:        0,

            xaxis:                true,
            xaxisTickmarks:       true,
            xaxisTickmarksLength: 5,
            xaxisColor:           'black',
            xaxisLabels:          [],
            xaxisLabelsOffsetx:   0,
            xaxisLabelsOffsety:   0,
            xaxisLabelsCount:     5,
            xaxisScale:           true,
            xaxisScaleUnitsPre:        '',
            xaxisScaleUnitsPost:       '',
            xaxisScaleStrict:          false,
            xaxisScaleDecimals:        0,
            xaxisScaleThousand:           '.',
            xaxisScaleThousand:        ',',
            xaxisScaleRound:           false,
            xaxisScaleMax:             null,
            xaxisScaleMin:             0,
            xaxisScaleFormatter:       null,
            xaxisLabelsPositionEdgeTickmarksCount: null,
            xaxisLabelsColor:       null,
            xaxisLabelsBold:        null,
            xaxisLabelsItalic:      null,
            xaxisLabelsFont:        null,
            xaxisLabelsSize:        null,

            yaxis:                true,
            yaxisTickmarks:       true,
            yaxisTickmarksLength: 3,
            yaxisLabels:          [],
            yaxisLabelsPosition:  'section',
            yaxisLabelsOffsetx:   0,
            yaxisLabelsOffsety:   0,
            yaxisScale:           false,
            yaxisLabelsPositionSectionTickmarksCount: null,
            yaxisColor:           'black',
            yaxisLabelsFont:        null,
            yaxisLabelsSize:        null,
            yaxisLabelsColor:       null,
            yaxisLabelsBold:        null,
            yaxisLabelsItalic:      null,
            
            textColor:            'black',
            textFont:             'Arial, Verdana, sans-serif',
            textSize:             12,
            textBold:             false,
            textItalic:           false,
            
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
            labelsAboveHalign:            null,
            labelsAboveValign:            'center',
            labelsAboveSpecific:          null,

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



            key:              null,
            keyColors:        null,
            keyOffsetx:       0,
            keyOffsety:       0,
            keyLabelsOffsetx: 0,
            keyLabelsOffsety: -1,
            keyLabelsSize:    null,
            keyLabelsBold:    null,
            keyLabelsItalic:  null,
            keyLabelsColor:   null,
            keyLabelsFont:    null
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
            
            this.coords  = [];
            this.coords2 = [];



            // Create the defs tag if necessary
            RGraph.SVG.createDefs(this);



            //
            // Handle the marginLeft autosizing
            //
            if (prop.marginLeftAuto) {
                for (var i=0,len=prop.yaxisLabels.length,maxLength=0; i<len; ++i) {
                    var sizes = RGraph.SVG.measureText({
                        text: prop.yaxisLabels[i],
                        bold: prop.yaxisLabelsBold || prop.textBold,
                        size: prop.yaxisLabelsSize || prop.textSize,
                        font: prop.yaxisLabelsFont || prop.textFont
                    });
                    
                    maxLength = Math.max(maxLength, sizes[0]);
                }
                
                prop.marginLeft = maxLength + 15 - prop.yaxisLabelsOffsetx;

                // Minimum left margin of 15
                if (prop.marginLeft < 15) {
                    prop.marginLeft = 15;
                }
            }




            this.graphWidth  = this.width - prop.marginLeft - prop.marginRight;
            this.graphHeight = this.height - prop.marginTop - prop.marginBottom;



            // Parse the colors for gradients
            RGraph.SVG.resetColorsToOriginalValues({object:this});
            this.parseColors();



            // Go through the data and work out the maximum value
            var values = [];

            for (var i=0,max=0; i<this.data.length; ++i) {
                if (typeof this.data[i] === 'number') {
                    values.push(this.data[i]);
                
                } else if (RGraph.SVG.isArray(this.data[i]) && prop.grouping === 'grouped') {
                    values.push(RGraph.SVG.arrayMax(this.data[i]));

                } else if (RGraph.SVG.isArray(this.data[i]) && prop.grouping === 'stacked') {
                    values.push(RGraph.SVG.arraySum(this.data[i]));
                }
            }
            var max = RGraph.SVG.arrayMax(values);

            // A custom, user-specified maximum value
            if (typeof prop.xaxisScaleMax === 'number') {
                max = prop.xaxisScaleMax;
            }
            
            // Set the ymin to zero if it's set to mirror
            if (prop.xaxisScaleMin === 'mirror' || prop.xaxisScaleMin === 'middle' || prop.xaxisScaleMin === 'center') {
                var mirrorScale = true;
                prop.xaxisScaleMin   = prop.xaxisScaleMax * -1;
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



            //
            // Get the scale a second time if the xmin should be mirored
            //
            // Set the xmin to zero if it's set mirror
            if (mirrorScale) {
                this.scale = RGraph.SVG.getScale({
                    object: this,
                    numlabels: prop.xaxisLabelsCount,
                    unitsPre:  prop.xaxisScaleUnitsPre,
                    unitsPost: prop.xaxisScaleUnitsPost,
                    max:       this.scale.max,
                    min:       this.scale.max * -1,
                    point:     prop.xaxisScaleThousand,
                    round:     false,
                    thousand:  prop.xaxisScaleThousand,
                    decimals:  prop.xaxisScaleDecimals,
                    strict:    typeof prop.xaxisScaleMax === 'number',
                    formatter: prop.xaxisScaleFormatter
                });
            }

            // Now the scale has been generated adopt its max value
            this.max      = this.scale.max;
            prop.xaxisScaleMax = this.scale.max;

            this.min      = this.scale.min;
            prop.xaxisScaleMin = this.scale.min;




            // Draw the background first
            RGraph.SVG.drawBackground(this);

            // Draw the bars
            this.drawBars();


            // Draw the axes over the bars
            RGraph.SVG.drawXAxis(this);
            RGraph.SVG.drawYAxis(this);


            // Draw the labelsAbove
            this.drawLabelsAbove();






            // Draw the key
            if (typeof prop.key !== null && RGraph.SVG.drawKey) {
                RGraph.SVG.drawKey(this);
            } else if (!RGraph.SVG.isNull(prop.key)) {
                alert('The drawKey() function does not exist - have you forgotten to include the key library?');
            }




            
            
            // Add the attribution link. If you're adding this elsewhere on your page/site
            // and you don't want it displayed then there are options available to not
            // show it.
            RGraph.SVG.attribution(this);



            // Add the event listener that clears the highlight rect if
            // there is any. Must be MOUSEDOWN (ie before the click event)
            var obj = this;
            document.body.addEventListener('mousedown', function (e)
            {
                RGraph.SVG.removeHighlight(obj);

            }, false);



            // Fire the draw event
            RGraph.SVG.fireCustomEvent(this, 'ondraw');




            return this;
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

            // Go through the bars
            for (var i=0,sequentialIndex=0; i<this.data.length; ++i,++sequentialIndex) {

                //
                // NORMAL bars
                //
                if (typeof this.data[i] === 'number') {

                    var outerSegment = (this.graphHeight - prop.marginInnerTop - prop.marginInnerBottom) / this.data.length,
                        width        = this.getWidth(this.data[i]),
                        height       = ( (this.graphHeight - prop.marginInnerTop - prop.marginInnerBottom) / this.data.length) - prop.marginInner - prop.marginInner,
                        x            = this.getXCoord(
                                            (this.scale.min < 0 && this.scale.max < 0) || (this.scale.min > 0 && this.scale.max > 0) ? this.scale.min : 0
                                        ) - (this.data[i] <  0 ? width : 0),
                        y            = prop.marginTop + prop.marginInnerTop + prop.marginInner + (outerSegment * i);

                    // If theres a min set but both the min and max are below
                    // zero the bars should be aligned to the right hand
                    // side
                    if (this.scale.min < 0 && this.scale.max < 0) {
                        x = this.width - prop.marginRight - width;
                    }

                    var rect = RGraph.SVG.create({
                        svg: this.svg,
                        parent: this.svg.all,
                        type: 'rect',
                        attr: {
                            stroke: prop.colorsStroke,
                            fill: prop.colorsSequential ? (prop.colors[sequentialIndex] ? prop.colors[sequentialIndex] : prop.colors[prop.colors.length - 1]) : prop.colors[0],
                            x: x,
                            y: y,
                            width: width,
                            height: height,
                            'stroke-width': prop.linewidth,
                            'data-tooltip': (!RGraph.SVG.isNull(prop.tooltips) && prop.tooltips.length) ? prop.tooltips[i] : '',
                            'data-index': i,
                            'data-original-width': width,
                            'data-original-height': height,
                            'data-sequential-index': sequentialIndex,
                            'data-value': this.data[i],
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
                    
                    if (!this.coords2[0]) {
                        this.coords2[0] = [];
                    }

                    this.coords2[0].push({
                        object:  this,
                        element: rect,
                        x:      parseFloat(rect.getAttribute('x')),
                        y:      parseFloat(rect.getAttribute('y')),
                        width:  parseFloat(rect.getAttribute('width')),
                        height: parseFloat(rect.getAttribute('height'))
                    });





                    // Add toooltips if necessary
                    if (!RGraph.SVG.isNull(prop.tooltips) && prop.tooltips[sequentialIndex]) {

                        var obj = this;

                        //
                        // Add tooltip event listeners
                        //
                        (function (idx, seq)
                        {
                            rect.addEventListener(prop.tooltipsEvent.replace(/^on/, ''), function (e)
                            {
                                obj.removeHighlight();

                                // Show the tooltip
                                RGraph.SVG.tooltip({
                                    object: obj,
                                    index: idx,
                                    group: null,
                                    sequentialIndex: seq,
                                    text: prop.tooltips[seq],
                                    event: e
                                });
                                
                                // Highlight the rect that has been clicked on
                                obj.highlight(e.target);
                            }, false);
                            
                            rect.addEventListener('mousemove', function (e)
                            {
                                e.target.style.cursor = 'pointer';
                            }, false);
                        })(i, sequentialIndex);
                    }




                //
                // GROUPED charts
                //
                } else if (RGraph.SVG.isArray(this.data[i]) && prop.grouping === 'grouped') {

                    var outerSegment = ( (this.graphHeight - prop.marginInnerTop - prop.marginInnerBottom) / this.data.length),
                        innerSegment = outerSegment - (2 * prop.marginInner);

                    // Loop through the group
                    for (var j=0; j<this.data[i].length; ++j,++sequentialIndex) {

                        var width  = Math.abs((this.data[i][j] / (this.max - this.min)) * this.graphWidth),
                            height = ( (innerSegment - ((this.data[i].length - 1) * prop.marginInnerGrouped)) / this.data[i].length),
                            y      = prop.marginTop + prop.marginInner + prop.marginInnerTop + (outerSegment * i) + (j * height) + (j * prop.marginInnerGrouped),
                            x      = this.getXCoord(0) - (this.data[i][j] <  0 ? width : 0);









                        // Work out some coordinates for the width and X coords ///////////////////////
                        if (this.scale.max < 0 && this.scale.min < this.scale.max) {
                            var x1 = this.getXCoord(this.data[i][j]);
                            var x2 = this.getXCoord(this.scale.max);
                            x      = x1;
                            width  = x2 - x1;
                        
                        } else if (this.scale.min > 0 && this.scale.max > this.scale.min) {
                            var x1 = this.getXCoord(this.data[i][j]);
                            var x2 = this.getXCoord(this.scale.min);
                            x      = this.getXCoord(this.scale.min);
                            width  = x1 - x2;

                        }
                        //////////////////////////////////////////////////////////////////////////////








                        //
                        // Determine the fill color
                        //
                        var fill;
                        
                        if (prop.colorsSequential) {
                            if (prop.colors[sequentialIndex]) {
                                fill = prop.colors[sequentialIndex];
                            }
                        } else {
                            if (prop.colors[j]) {
                                fill = prop.colors[j];
                            } else {
                                fill = prop.colors[prop.colors.length - 1];
                            }
                        }




                        var rect = RGraph.SVG.create({
                            svg: this.svg,
                            type: 'rect',
                            parent: this.svg.all,
                            attr: {
                                stroke: prop['colorsStroke'],
                                fill: fill,
                                x: x,
                                y: y,
                                width: width,
                                height: height,
                                'stroke-width': prop.linewidth,
                                'data-index': i,
                                'data-original-width': width,
                                'data-sequential-index': sequentialIndex,
                                'data-tooltip': (!RGraph.SVG.isNull(prop.tooltips) && prop.tooltips.length) ? prop.tooltips[sequentialIndex] : '',
                                'data-value': this.data[i][j],
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

                        if (!this.coords2[i]) {
                            this.coords2[i] = [];
                        }
        
                        this.coords2[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });


                        // Add the tooltip data- attribute
                        if (!RGraph.SVG.isNull(prop.tooltips) && prop.tooltips[sequentialIndex]) {
                        
                            var obj = this;
    
                        
                            //
                            // Add tooltip event listeners
                            //
                            (function (idx, seq)
                            {
                                var indexes = RGraph.SVG.sequentialIndexToGrouped(seq, obj.data);

                                rect.addEventListener(prop.tooltipsEvent.replace(/^on/, ''), function (e)
                                {
                                    obj.removeHighlight();

                                    // Show the tooltip
                                    RGraph.SVG.tooltip({
                                        object: obj,
                                        group: idx,
                                        index: indexes[1],
                                        sequentialIndex: seq,
                                        text: prop.tooltips[seq],
                                        event: e
                                    });
                                    
                                    // Highlight the rect that has been clicked on
                                    obj.highlight(e.target);
    
                                }, false);
                                
                                rect.addEventListener('mousemove', function (e)
                                {
                                    e.target.style.cursor = 'pointer'
                                }, false);
                            })(i, sequentialIndex);
                        }
                    }

                    --sequentialIndex;
                        


                //
                // STACKED CHARTS
                //
                } else if (RGraph.SVG.isArray(this.data[i]) && prop.grouping === 'stacked') {

                    // This is each bars "segment" of the chart
                    var section = ( (this.graphHeight - prop.marginInnerTop - prop.marginInnerBottom) / this.data.length);

                    
                    // Intialise the X and Y coordinates
                    var x = this.getXCoord(0);

                    

                    // Loop through the stack
                    for (var j=0; j<this.data[i].length; ++j,++sequentialIndex) {

                        var outerHeight = (this.graphHeight - prop.marginInnerTop - prop.marginInnerBottom) / this.data.length,
                            width       = Math.abs((this.data[i][j] / (this.max - this.min)) * this.graphWidth),
                            height      = outerHeight - (2 * prop.marginInner),
                            y           = prop.marginTop + prop.marginInner + prop.marginInnerTop + (outerHeight * i);

                        // If this is the first iteration of the loop and a shadow
                        // is requested draw a rect here to create it.
                        if (j === 0 && prop.shadow) {
                            
                            var fullWidth = Math.abs((RGraph.SVG.arraySum(this.data[i]) / (this.max - this.min)) * this.graphWidth);

                            var rect = RGraph.SVG.create({
                                svg: this.svg,
                                parent: this.svg.all,
                                type: 'rect',
                                attr: {
                                    x: x,
                                    y: y,
                                    width: fullWidth,
                                    height: height,
                                    fill: 'white',
                                    'stroke-width': 0,
                                    'data-index': i,
                                    filter: 'url(#dropShadow)'
                                }
                            });
                            
                            this.stackedBackfaces[i] = rect;
                        }



                        // Create the visible bar
                        var rect = RGraph.SVG.create({
                            svg: this.svg,
                            type: 'rect',
                            parent: this.svg.all,
                            attr: {
                                stroke: prop['colorsStroke'],
                                fill: prop.colorsSequential ? (prop.colors[sequentialIndex] ? prop.colors[sequentialIndex] : prop.colors[prop.colors.length - 1]) : (prop.colors[j] ? prop.colors[j] : prop.colors[prop.colors.length - 1]),
                                x: x,
                                y: y,
                                width: width,
                                height: height,
                                'stroke-width': prop.linewidth,
                                'data-original-width': width,
                                'data-original-height': height,
                                'data-original-x': x,
                                'data-original-y': y,
                                'data-index': i,
                                'data-sequential-index': sequentialIndex,
                                'data-tooltip': (!RGraph.SVG.isNull(prop.tooltips) && prop.tooltips.length) ? prop.tooltips[sequentialIndex] : '',
                                'data-value': this.data[i][j]
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

                        if (!this.coords2[i]) {
                            this.coords2[i] = [];
                        }
        
                        this.coords2[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });



                        // Add the tooltips 
                        if (!RGraph.SVG.isNull(prop.tooltips) && prop.tooltips[sequentialIndex]) {
                        
                            var obj = this;
    
                        
                            //
                            // Add tooltip event listeners
                            //
                            (function (idx, seq)
                            {
                                rect.addEventListener(prop.tooltipsEvent.replace(/^on/, ''), function (e)
                                {
                                    obj.removeHighlight();

                                    var indexes = RGraph.SVG.sequentialIndexToGrouped(seq, obj.data);

                                    // Show the tooltip
                                    RGraph.SVG.tooltip({
                                        object: obj,
                                        index: indexes[1],
                                        group: idx,
                                        sequentialIndex: seq,
                                        text: prop.tooltips[seq],
                                        event: e
                                    });
                                    
                                    // Highlight the rect that has been clicked on
                                    obj.highlight(e.target);
                                }, false);
                                
                                rect.addEventListener('mousemove', function (e)
                                {
                                    e.target.style.cursor = 'pointer'
                                }, false);
                            })(i, sequentialIndex);
                        }
                        
                        x += width;
                    }

                    --sequentialIndex;
                }
            }

        };









        //
        // This function can be used to retrieve the relevant X coordinate for a
        // particular value.
        // 
        // @param int value The value to get the X coordinate for
        //
        this.getXCoord = function (value)
        {
            var prop = this.properties;

            if (value > this.scale.max) {
                return null;
            }

            var x;

            if (value < this.scale.min) {
                return null;
            }

            x  = ((value - this.scale.min) / (this.scale.max - this.scale.min));
            x *= this.graphWidth;
            x += prop.marginLeft;

            return x;
        };









        //
        // This function can be used to retrieve the relevant X coordinate for a
        // particular value.
        // 
        // @param int value The value to get the X coordinate for
        //
        this.getWidth = function (value)
        {
            if (this.scale.max <= 0 && this.scale.min < this.scale.max) {
                var x1 = this.getXCoord(this.scale.max);
                var x2 = this.getXCoord(value);
            
            } else if (this.scale.min > 0 && this.scale.max > this.scale.min) {
                var x1 = this.getXCoord(this.scale.min);
                var x2 = this.getXCoord(value);
            
            } else {
                var x1 = this.getXCoord(0);
                var x2 = this.getXCoord(value);
            }

            return Math.abs(x1 - x2);
        };
        
        //Math.abs(((this.data[i] - this.scale.min) / (this.max - this.scale.min)) * this.graphWidth)








        //
        // This function can be used to highlight a bar on the chart
        // 
        // @param object rect The rectangle to highlight
        //
        this.highlight = function (rect)
        {
            var x      = rect.getAttribute('x'),
                y      = rect.getAttribute('y'),
                width  = rect.getAttribute('width'),
                height = rect.getAttribute('height');
            
            var highlight = RGraph.SVG.create({
                svg: this.svg,
                type: 'rect',
                parent: this.svg.all,
                attr: {
                    stroke: prop.highlightStroke,
                    fill: prop.highlightFill,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    'stroke-width': prop.highlightLinewidth
                },
                style: {
                    pointerEvents: 'none'
                }
            });


            //if (prop.tooltipsEvent === 'mousemove') {
            //    highlight.addEventListener('mouseout', function (e)
            //    {
            //        highlight.parentNode.removeChild(highlight);
            //        RGraph.SVG.hideTooltip();

            //        RGraph.SVG.REG.set('highlight', null);
            //    }, false);
            //}


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
                        direction: 'horizontal',
                        start: prop.marginLeft,
                        end: this.width - prop.marginRight
                    });
                }
            }

            prop.backgroundGridColor = RGraph.SVG.parseColorLinear({object: this, color: prop.backgroundGridColor, direction: 'horizontal',start: prop.marginLeft,end: this.width - prop.marginRight});
            prop.highlightFill       = RGraph.SVG.parseColorLinear({object: this, color: prop.highlightFill, direction: 'horizontal',start: prop.marginLeft,end: this.width - prop.marginRight});
            prop.backgroundColor     = RGraph.SVG.parseColorLinear({object: this, color: prop.backgroundColor});
        };








        //
        // Draws the labelsAbove
        //
        this.drawLabelsAbove = function ()
        {
            // Go through the above labels
            if (prop.labelsAbove) {
                
                var data = RGraph.SVG.arrayLinearize(this.data);

                for (var i=0; i<this.coords.length; ++i) {

                    var value = data[i].toFixed(typeof prop.labelsAboveDecimals === 'number' ? prop.labelsAboveDecimals : prop.xaxisScaleDecimals);
                    var indexes = RGraph.SVG.sequentialIndexToGrouped(i, this.data);



                    if (RGraph.SVG.isArray(this.data[indexes[0]]) && prop.grouping === 'stacked') {
                        if ((indexes[1] +1) === this.data[indexes[0]].length) {
                            value = RGraph.SVG.arraySum(this.data[indexes[0]]);
                            value = value.toFixed(typeof prop.labelsAboveDecimals === 'number' ? prop.labelsAboveDecimals : prop.xaxisScaleDecimals);
                        } else {
                            continue;
                        }
                    }


                    var str = prop.labelsAboveSpecific ? prop.labelsAboveSpecific[i].toString() : RGraph.SVG.numberFormat({
                        object:    this,
                        num:       value,
                        prepend:   typeof prop.labelsAboveUnitsPre  === 'string'   ? prop.labelsAboveUnitsPre  : null,
                        append:    typeof prop.labelsAboveUnitsPost === 'string'   ? prop.labelsAboveUnitsPost : null,
                        point:     typeof prop.labelsAbovePoint     === 'string'   ? prop.labelsAbovePoint     : null,
                        thousand:  typeof prop.labelsAboveThousand  === 'string'   ? prop.labelsAboveThousand  : null,
                        formatter: typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter : null
                    });

                    var bold   = typeof prop.labelsAboveBold   === 'boolean' ? prop.labelsAboveBold   : prop.textBold,
                        italic = typeof prop.labelsAboveItalic === 'boolean' ? prop.labelsAboveItalic : prop.textItalic,
                        size   = typeof prop.labelsAboveSize === 'number' ? prop.labelsAboveSize : prop.textSize,
                        font   = prop.labelsAboveFont || prop.textFont,
                        halign = prop.labelsAboveHalign,
                        valign = prop.labelsAboveValign;


                    var dimensions = RGraph.SVG.measureText({
                        text: str,
                        bold: bold,
                        font: font,
                        size: size
                    });

                    var x      = (value >= 0)
                                   ? (parseFloat(this.coords[i].element.getAttribute('x')) + parseFloat(this.coords[i].element.getAttribute('width')) + 7 + prop.labelsAboveOffsetx)
                                   : parseFloat(this.coords[i].element.getAttribute('x') - 7 - prop.labelsAboveOffsetx),
                        y      = parseFloat(this.coords[i].element.getAttribute('y')) + parseFloat(this.coords[i].element.getAttribute('height') / 2) + prop.labelsAboveOffsety,
                        width  = dimensions[0],
                        height = dimensions[1],
                        halign = (value >= 0) ? 'left': 'right';

                    if (x + width > this.width && value > 0) {
                        halign = 'right';
                        x      = this.width - 5;
                        prop.labelsAboveBackground = prop.labelsAboveBackground || 'rgba(255,255,255,0.95)';
                    }

                    // Horizontal alignment
                    if (typeof prop.labelsAboveHalign === 'string') {
                        halign = prop.labelsAboveHalign;
                    }

                    var text = RGraph.SVG.text({
                        object:     this,
                        parent:     this.svg.all,
                        tag:        'labels.above',
                        text:       str,
                        x:          x,
                        y:          y,
                        halign:     halign,
                        valign:     valign,
                        
                        font:       font,
                        size:       size,
                        bold:       bold,
                        italic:     italic,
                        color:      prop.labelsAboveColor || prop.textColor,
                        
                        background: prop.labelsAboveBackground        || null,
                        padding:    prop.labelsAboveBackgroundPadding || 0
                    });
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
        // The Bar chart grow effect
        //
        this.grow = function ()
        {
            var opt      = arguments[0] || {},
                frames   = opt.frames || 30,
                frame    = 0,
                obj      = this,
                data     = [],
                height   = null,
                seq      = 0;

            //
            // Copy the data
            //
            data = RGraph.SVG.arrayClone(this.data);

            this.draw();

            var iterate = function ()
            {
                for (var i=0,seq=0,len=obj.coords.length; i<len; ++i, ++seq) {

                    var   multiplier = (frame / frames)
                        // RGraph.SVG.FX.getEasingMultiplier(frames, frame)
                        // RGraph.SVG.FX.getEasingMultiplier(frames, frame);
                
                
                
                
                    // TODO Go through the data and update the value according to
                    // the frame number
                    if (typeof data[i] === 'number') {

                        width       = Math.abs(obj.getXCoord(data[i]) - obj.getXCoord(0));
                        obj.data[i] = data[i] * multiplier;
                        width       = multiplier * width;
                        
                        // Set the new width on the rect
                        obj.coords[seq].element.setAttribute(
                            'width',
                            width
                        );

                        // Set the correct Y coord on the object
                        obj.coords[seq].element.setAttribute(
                            'x',
                            data[i] > 0 ? obj.getXCoord(0) : obj.getXCoord(0) - width
                        );

                    } else if (typeof data[i] === 'object') {

                        var accumulativeWidth = 0;

                        for (var j=0,len2=data[i].length; j<len2; ++j, ++seq) {

                            width          = Math.abs(obj.getXCoord(data[i][j]) - obj.getXCoord(0));
                            width          = multiplier * width;
                            obj.data[i][j] = data[i][j] * multiplier;

                            obj.coords[seq].element.setAttribute(
                                'width',
                                width
                            );

                            obj.coords[seq].element.setAttribute(
                                'x',
                                data[i][j] > 0 ? (obj.getXCoord(0) + accumulativeWidth) : (obj.getXCoord(0) - width - accumulativeWidth)
                            );
                            
                            accumulativeWidth += (prop.grouping === 'stacked' ? width : 0);
                        }

                        //
                        // Set the height and Y cooord of the backfaces if necessary
                        //
                        if (obj.stackedBackfaces[i]) {
                            obj.stackedBackfaces[i].setAttribute(
                                'width',
                                accumulativeWidth
                            );

                            obj.stackedBackfaces[i].setAttribute(
                                'x',
                                prop.marginLeft
                            );
                        }

                        // Decrease seq by one so that it's not incremented twice
                        --seq;
                    }
                }

                if (frame++ < frames) {
                    //setTimeout(iterate, frame > 1 ? opt.delay : 200);
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
            // First draw the chart
            this.draw();


            var obj = this,
                opt = arguments[0] || {};
            
            opt.frames      = opt.frames || 60;
            opt.startFrames = [];
            opt.counters    = [];

            var framesperbar    = opt.frames / 3,
                frame           = -1,
                callback        = opt.callback || function () {},
                width;

            for (var i=0,len=this.coords.length; i<len; i+=1) {
                opt.startFrames[i] = ((opt.frames / 2) / (obj.coords.length - 1)) * i;
                opt.counters[i]    = 0;
                
                // Now zero the width of the bar
                this.coords[i].element.setAttribute('width', 0);
            }


            function iterator ()
            {
                ++frame;

                for (var i=0,len=obj.coords.length; i<len; i+=1) {
                    if (frame > opt.startFrames[i]) {                            
                        
                        var originalWidth = obj.coords[i].element.getAttribute('data-original-width'),
                            value         = parseFloat(obj.coords[i].element.getAttribute('data-value'));

                        obj.coords[i].element.setAttribute(
                            'width',
                            width = Math.min(
                                ((frame - opt.startFrames[i]) / framesperbar) * originalWidth,
                                originalWidth
                            )
                        );
                        
                        obj.coords[i].element.setAttribute(
                            'x',
                            value >=0 ? obj.getXCoord(0) : obj.getXCoord(0) - width
                        );
                        
                        
                        if (prop.grouping === 'stacked') {
                            var seq = obj.coords[i].element.getAttribute('data-sequential-index');
                            var indexes = RGraph.SVG.sequentialIndexToGrouped(seq, obj.data);
                            
                            if (indexes[1] > 0) {
                                obj.coords[i].element.setAttribute(
                                    'x',
                                    parseInt(obj.coords[i - 1].element.getAttribute('x')) + parseInt(obj.coords[i - 1].element.getAttribute('width'))
                                );
                            }
                        }
                    }
                }


                if (frame >= opt.frames) {
                    callback(obj);
                } else {
                    RGraph.SVG.FX.update(iterator);
                }
            }
            
            iterator();

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
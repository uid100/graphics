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
    // The pie chart constructor
    //
    RGraph.Pie = function (conf)
    {
        var id                 = conf.id,
            canvas             = document.getElementById(id),
            data               = conf.data;

        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = canvas;
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d", {alpha: (typeof id === 'object' && id.alpha === false) ? false : true}) : null;
        this.canvas.__object__ = this;
        this.total             = 0;
        this.subTotal          = 0;
        this.angles            = [];
        this.data              = data;
        this.properties        = [];
        this.type              = 'pie';
        this.isRGraph          = true;
        this.coords            = [];
        this.coords.key        = [];
        this.coordsSticks      = [];
        this.coordsText        = [];
        this.uid               = RGraph.createUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.createUID();
        this.colorsParsed      = false;
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false
        this.exploding         = null;





        //
        // Go through the data and convert strings to numbers
        //
        for (var i=0; i<this.data.length; ++i) {
            if (typeof this.data[i] === 'string') {
                this.data[i] = parseFloat(this.data[i]);
            }
        }

        this.properties =
        {
            centerxAdjust:                  0,
            centeryAdjust:                  0,

            colors:                         ['red', '#ccc', '#cfc', 'blue', 'pink', 'yellow', 'black', 'orange', 'cyan', 'purple', '#78CAEA', '#E284E9', 'white', 'blue', '#9E7BF6'],
            colorsStroke:                   'white',

            linewidth:                      3,

            labels:                         [],
            labelsFont:                     null,
            labelsSize:                     null,
            labelsColor:                    null,
            labelsBold:                     null,
            labelsItalic:                   null,
            labelsSticks:                   false,
            labelsSticksLength:             7,
            labelsSticksColors:             null,
            labelsSticksLinewidth:          1,
            labelsSticksHlength:            5,
            labelsList:                     true,
            labelsIngraph:                  null,
            labelsIngraphColor:             null,
            labelsIngraphFont:              null,
            labelsIngraphSize:              null,
            labelsIngraphBold:              null,
            labelsIngraphItalic:            null,
            labelsIngraphBounding:          true,
            labelsIngraphBoundingFill:      'rgba(255,255,255,0.85)',
            labelsIngraphBoundingStroke:    'rgba(0,0,0,0)',
            labelsIngraphSpecific:          null,
            labelsIngraphUnitsPre:          '',
            labelsIngraphUnitsPost:         '',
            labelsIngraphPoint:             '.',
            labelsIngraphThousand:          ',',
            labelsIngraphDecimals:          0,
            labelsIngraphRadius:            null,
            labelsCenter:                   null,
            labelsCenterSize:               26,
            labelsCenterFont:               null,
            labelsCenterColor:              null,
            labelsCenterItalic:             null,
            labelsCenterBold:               null,

            marginLeft:                     25,
            marginRight:                    25,
            marginTop:                      25,
            marginBottom:                   25,

            title:                          '',
            titleBackground:                null,
            titleHpos:                      null,
            titleVpos:                      0.5,
            titleBold:                      null,
            titleFont:                      null,
            titleSize:                      null,
            titleColor:                     null,
            titleItalic:                    null,
            titleX:                         null,
            titleY:                         null,
            titleHalign:                    null,
            titleValign:                    null,

            shadow:                         true,
            shadowColor:                    '#aaa',
            shadowOffsetx:                  0,
            shadowOffsety:                  0,
            shadowBlur:                     15,

            textBold:                       false,
            textItalic:                     false,
            textSize:                       12,
            textColor:                      'black',
            textFont:                       'Arial, Verdana, sans-serif',
            textAccessible:                 true,
            textAccessibleOverflow:         'visible',
            textAccessiblePointerevents:    false,

            contextmenu:                    null,

            tooltips:                       null,
            tooltipsEvent:                  'onclick',
            tooltipsEffect:                 'fade',
            tooltipsCssClass:               'RGraph_tooltip',
            tooltipsHighlight:              true,

            highlightStyle:                 '2d',
            highlightStyleTwodFill:         'rgba(255,255,255,0.7)',
            highlightStyleTwodStroke:       'rgba(255,255,255,0.7)',
            highlightStyleOutlineWidth:     null,

            centerx:                        null,
            centery:                        null,
            radius:                         null,

            border:                         false,
            borderColor:                    'rgba(255,255,255,0.5)',

            key:                            null,
            keyBackground:                  'white',
            keyPosition:                    'graph',
            keyHalign:                      'right',
            keyShadow:                      false,
            keyShadowColor:                 '#666',
            keyShadowBlur:                  3,
            keyShadowOffsetx:               2,
            keyShadowOffsety:               2,
            keyPositionGutterBoxed:         false,
            keyPositionX:                   null,
            keyPositionY:                   null,
            keyColorShape:                  'square',
            keyRounded:                     true,
            keyLinewidth:                   1,
            keyColors:                      null,
            keyInteractive:                 false,
            keyInteractiveHighlightChartStroke: 'black',
            keyInteractiveHighlightChartFill: 'rgba(255,255,255,0.7)',
            keyInteractiveHighlightLabel:   'rgba(255,0,0,0.2)',
            keyLabelsColor:                 null,
            keyLabelsFont:                  null,
            keyLabelsSize:                  null,
            keyLabelsBold:                  null,
            keyLabelsItalic:                null,
            keyLabelsOffsetx:               0,
            keyLabelsOffsety:               0,

            annotatable:                    false,
            annotatableColor:               'black',

            resizable:                      false,
            resizableHandleAdjust:          [0,0],
            resizableHandleBackground:      null,

            variant:                        'pie',
            variantDonutWidth:              null,
            variantThreedDepth:             20,

            exploded:                       [],

            effectRoundrobinMultiplier:     1,

            events:                         true,
            eventsClick:                    null,
            eventsMousemove:                null,

            centerpin:                      null,
            centerpinFill:                  'gray',
            centerpinStroke:                'white',

            origin:                         0 - (Math.PI / 2),

            clearto:                        'rgba(0,0,0,0)'
        }



        //
        // Calculate the total
        //
        for (var i=0,len=data.length; i<len; i++) {
            this.total += data[i];
            
            // This loop also creates the $xxx objects - this isn't related to
            // the code above but just saves doing another loop through the data
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
        // A generic setter
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
        // A generic getter
        //
        this.get = function (name)
        {
            return prop[name];
        };








        //
        // This draws the pie chart
        //
        this.draw = function ()
        {
            //
            // Fire the onbeforedraw event
            //
            RGraph.fireCustomEvent(this, 'onbeforedraw');
            
            // NB: Colors are parsed further down so that the center X/Y can be used
    



            //
            // Make the margins easy ro access
            //
            this.marginLeft   = prop.marginLeft;
            this.marginRight  = prop.marginRight;
            this.marginTop    = prop.marginTop;
            this.marginBottom = prop.marginBottom;

            this.radius     = this.getRadius();// MUST be first
            this.centerx    = (this.graph.width / 2) + this.marginLeft + prop.centerxAdjust;
            this.centery    = (this.graph.height / 2) + this.marginTop + prop.centeryAdjust;
            this.subTotal   = prop.origin;
            this.angles     = [];
            this.coordsText = [];

            //
            // Allow specification of a custom radius & center X/Y
            //
            if (typeof prop.radius === 'number')  this.radius  = prop.radius;
            if (typeof prop.centerx === 'number') this.centerx = prop.centerx;
            if (typeof prop.centery === 'number') this.centery = prop.centery;

    
            if (this.radius <= 0) {
                return;
            }
    
            //
            // Parse the colors for gradients. Its down here so that the center X/Y can be used
            //
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }


            if (prop.variant.indexOf('3d') > 0) {
                return this.draw3d();
            }




            //
            // Draw the title
            //
            RGraph.drawTitle(
                this,
                prop.title,
                (this.canvas.height / 2) - this.radius - 5,
                this.centerx,
                prop.titleSize ? prop.titleSize : prop.textSize
            );

            //
            // The total of the array of values
            //
            this.total = RGraph.arraySum(this.data);
            var tot    = this.total;
            var data   = this.data;

            for (var i=0,len=this.data.length; i<len; i++) {
                
                var angle = ((data[i] / tot) * RGraph.TWOPI);
    
                // Draw the segment
                this.drawSegment(angle,prop.colors[i],i == (len - 1), i);
            }

            RGraph.noShadow(this);

            //
            // Redraw the seperating lines
            //
            if (prop.linewidth > 0) {
                this.drawBorders();
            }

            //
            // Now draw the segments again with shadow turned off. This is always performed,
            // not just if the shadow is on.
            //
            var len = this.angles.length;
            var r   = this.radius;

            
            for (var action=0; action<2; action+=1) {
                for (var i=0; i<len; i++) {
    
                    this.context.beginPath();
     
                    var segment = this.angles[i];
            
                        if (action === 1) {
                            this.context.strokeStyle = typeof(prop.colorsStroke) == 'object' ? prop.colorsStroke[i] : prop.colorsStroke;
                        }
                        prop.colors[i] ?  this.context.fillStyle = prop.colors[i] : null;
                        this.context.lineJoin = 'round';
                        
                        this.context.arc(
                            segment[2],
                            segment[3],
                            r,
                            (segment[0]),
                            (segment[1]),
                            false
                        );
                        if (prop.variant == 'donut') {
        
                            this.context.arc(
                                segment[2],
                                segment[3],
                                typeof(prop.variantDonutWidth) == 'number' ? r - prop.variantDonutWidth : r / 2,
                                (segment[1]),
                                (segment[0]),
                                true
                            );
                            
                        } else {
                            this.context.lineTo(segment[2], segment[3]);
                        }
                    this.context.closePath();
                    action === 0 ? this.context.fill() : this.context.stroke();
                }
            }
            

    

            //
            // Draw label sticks
            //
            if (prop.labelsSticks) {
                
                this.drawSticks();
    
                // Redraw the border going around the Pie chart if the stroke style is NOT white
                var strokeStyle = prop.colorsStroke;
            }

            //
            // Draw the labels
            //
            if (prop.labels) {
                this.drawLabels();
            }
            
            
            //
            // Draw centerpin if requested
            //
            if (prop.centerpin) {
                this.drawCenterpin();
            }
    
    
    
    
            //
            // Draw ingraph labels
            //
            if (prop.labelsIngraph) {
                this.drawInGraphLabels();
            }
    
    
    
    
            //
            // Draw the center label if requested
            //
            if (typeof prop.labelsCenter === 'string') {
                this.drawCenterLabel(prop.labelsCenter);
            }
    
            
            //
            // Setup the context menu if required
            //
            if (prop.contextmenu) {
                RGraph.showContext(this);
            }
    
    
    
            //
            // If a border is pecified, draw it
            //
            if (prop.border) {
                this.context.beginPath();
                this.context.lineWidth = 5;
                this.context.strokeStyle = prop.borderColor;
    
                this.context.arc(
                    this.centerx,
                    this.centery,
                    this.radius - 2,
                    0,
                    RGraph.TWOPI,
                    0
                );
    
                this.context.stroke();
            }

            //
            // Draw the kay if desired
            //
            if (prop.key && prop.key.length) {
                RGraph.drawKey(this, prop.key, prop.colors);
            }
    
            RGraph.noShadow(this);
    
            
            //
            // This function enables resizing
            //
            if (prop.resizable) {
                RGraph.allowResizing(this);
            }
    
    
            //
            // This installs the event listeners
            //
            if (prop.events == true) {
                RGraph.installEventListeners(this);
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
        // Draws a single segment of the pie chart
        // 
        // @param int degrees The number of degrees for this segment
        //
        this.drawSegment = function (radians, color, last, index)
        {
            // IE7/8/ExCanvas fix (when there's only one segment the Pie chart doesn't display
            //if (RGraph.ISOLD && radians == RGraph.TWOPI) {
            //    radians -= 0.0001;
            //} else if (RGraph.ISOLD && radians == 0) {
            //    radians = 0.001;
            //}

            var subTotal = this.subTotal;
                radians  = radians * prop.effectRoundrobinMultiplier;
    
            this.context.beginPath();
    
                color ? this.context.fillStyle   = color : null;
                this.context.strokeStyle = prop.colorsStroke;
                this.context.lineWidth   = 0;
    
                if (prop.shadow) {
                    RGraph.setShadow(
                        this,
                        prop.shadowColor,
                        prop.shadowOffsetx,
                        prop.shadowOffsety,
                        prop.shadowBlur
                    );
                }
    
                //
                // Exploded segments
                //
                if ( (typeof(prop.exploded) == 'object' && prop.exploded[index] > 0) || typeof(prop.exploded) == 'number') {
                    
                    var explosion = typeof(prop.exploded) == 'number' ? prop.exploded : prop.exploded[index];
                    var x         = 0;
                    var y         = 0;
                    var h         = explosion;
                    var t         = subTotal + (radians / 2);
                    var x         = (Math.cos(t) * explosion);
                    var y         = (Math.sin(t) * explosion);
                    var r         = this.radius;
                
                    this.context.moveTo(this.centerx + x, this.centery + y);
                } else {
                    var x = 0;
                    var y = 0;
                    var r = this.radius;
                }
    
                //
                // Calculate the angles
                //
                var startAngle = subTotal;
                var endAngle   = ((subTotal + radians));
    
                this.context.arc(this.centerx + x,
                       this.centery + y,
                       r,
                       startAngle,
                       endAngle,
                       0);
    
                if (prop.variant == 'donut') {
    
                    this.context.arc(
                        this.centerx + x,
                        this.centery + y,
                        typeof(prop.variantDonutWidth) == 'number' ? r - prop.variantDonutWidth : r / 2,
                        endAngle,
                        startAngle,
                        true
                    );
                } else {
                    this.context.lineTo(this.centerx + x, this.centery + y);
                }
    
            this.context.closePath();
    
    
            // Keep hold of the angles
            this.angles.push([
                subTotal,
                subTotal + radians,
                this.centerx + x,
                this.centery + y
            ]);
    
    
            
            //this.context.stroke();
            this.context.fill();
    
            //
            // Calculate the segment angle
            //
            this.subTotal += radians;
        };








        //
        // Draws the graphs labels
        //
        this.drawLabels = function ()
        {
            // New way of spacing labels out
            if (prop.labels.length && prop.labelsList) {
                return this.drawLabelsList();
            }

            var hAlignment = 'left',
                vAlignment = 'center',
                labels     = prop.labels,
                context    = this.context,
                font       = prop.textFont,
                bold       = prop.labelsBold,
                text_size  = prop.textSize,
                cx         = this.centerx,
                cy         = this.centery,
                r          = this.radius;

            //
            // Turn the shadow off
            //
            RGraph.noShadow(this);
            
            this.context.fillStyle = 'black';
            this.context.beginPath();
    
            //
            // Draw the labels
            //
            if (labels && labels.length) {
                
                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'labels'
                });
    
                for (i=0; i<this.angles.length; ++i) {
                
                    var segment = this.angles[i];
                
                    if (typeof labels[i] != 'string' && typeof labels[i] != 'number') {
                        continue;
                    }
    
                    // Move to the centre
                    this.context.moveTo(cx,cy);
                    
                    var a     = segment[0] + ((segment[1] - segment[0]) / 2),
                        angle = ((segment[1] - segment[0]) / 2) + segment[0];

                    //
                    // Handle the additional "explosion" offset
                    //
                    if (typeof prop.exploded === 'object' && prop.exploded[i] || typeof prop.exploded == 'number') {
    
                        var t          = ((segment[1] - segment[0]) / 2),
                            seperation = typeof(prop.exploded) == 'number' ? prop.exploded : prop.exploded[i];
    
                        // Adjust the angles
                        var explosion_offsetx = (Math.cos(angle) * seperation),
                            explosion_offsety = (Math.sin(angle) * seperation);
                    } else {
                        var explosion_offsetx = 0,
                            explosion_offsety = 0;
                    }

                    //
                    // Allow for the label sticks
                    //
                    if (prop.labelsSticks) {
                        explosion_offsetx += (Math.cos(angle) * (typeof prop.labelsSticksLength === 'object' ? prop.labelsSticksLength[i] : prop.labelsSticksLength) );
                        explosion_offsety += (Math.sin(angle) * (typeof prop.labelsSticksLength === 'object' ? prop.labelsSticksLength[i] : prop.labelsSticksLength) );
                    }
    
                    //
                    // Coords for the text
                    //
                    var x = cx + explosion_offsetx + ((r + 10)* Math.cos(a)) + (prop.labelsSticks ? (a < RGraph.HALFPI || a > (RGraph.TWOPI + RGraph.HALFPI) ? 2 : -2) : 0),
                        y = cy + explosion_offsety + (((r + 10) * Math.sin(a)));




                    //
                    //  If sticks are enabled use the endpoints that have been saved
                    //
                    if (this.coordsSticks && this.coordsSticks[i]) {
                        var x = this.coordsSticks[i][4][0] + (x < cx ? -5 : 5),
                            y = this.coordsSticks[i][4][1];
                    }


                    //
                    // Alignment
                    //
                    //vAlignment = y < cy ? 'center' : 'center';
                    vAlignment = 'center';
                    hAlignment = x < cx ? 'right' : 'left';
    
                    this.context.fillStyle = prop.textColor;
                    //if (   typeof prop.labelsColors === 'object' && prop.labelsColors && prop.labelsColors[i]) {
                    //    this.context.fillStyle = prop.labelsColors[i];
                    //}

                        RGraph.text({
                            
                           object: this,
                             
                             font: textConf.font,
                             size: textConf.size,
                            color: textConf.color,
                             bold: textConf.bold,
                           italic: textConf.italic,
    
                                 x: x,
                                 y: y,
                              text: labels[i],
                            valign: vAlignment,
                            halign: hAlignment,
                               tag: 'labels'
                        });
                }
                
                this.context.fill();
            }
        };








        //
        // A newer way of spacing out labels
        //
        this.drawLabelsList = function ()
        {
            var segment      = this.angles[i],
                labels       = prop.labels,
                labels_right = [],
                labels_left  = [],
                left         = [],
                right        = [],
                centerx      = this.centerx,
                centery      = this.centery,
                radius       = this.radius,
                offset       = 50 // This may not be used - see the endpoint_outer var below








            //
            // Draw the right hand side labels
            //
            for (var i=0; i<this.angles.length; ++i) {
            
                // Null values do not get labels displayed
                if (RGraph.isNull(this.data[i])) {
                    continue;
                }

                var angle          = this.angles[i][0] + ((this.angles[i][1] - this.angles[i][0]) / 2), // Midpoint
                    endpoint_inner = RGraph.getRadiusEndPoint(centerx, centery, angle, radius + 5),
                    endpoint_outer = RGraph.getRadiusEndPoint(centerx, centery, angle, radius + 30),
                    explosion      = [
                        (typeof prop.exploded === 'number' ? prop.exploded : prop.exploded[i]),
                        (Math.cos(angle) * (typeof prop.exploded === 'number' ? prop.exploded : prop.exploded[i])),
                        (Math.sin(angle) * (typeof prop.exploded === 'number' ? prop.exploded : prop.exploded[i]))
                    ]

                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'labels'
                });

                
                

                if (angle > (-1 * RGraph.HALFPI) && angle < RGraph.HALFPI) {
                    labels_right.push([
                        i,
                        angle,
                        labels[i] ? labels[i] : '',
                        endpoint_inner,
                        endpoint_outer,
                        textConf.color,
                        RGraph.arrayClone(explosion)
                    ]);
                } else {
                    labels_left.push([
                        i,
                        angle,
                        labels[i] ? labels[i] : '',
                        endpoint_inner,
                        endpoint_outer,
                        textConf.color,
                        RGraph.arrayClone(explosion)
                    ]);
                }
            }


            
            
            //
            // Draw the right hand side labels first
            //


            // Calculate how much space there is for each label
            var vspace_right = (this.canvas.height - prop.marginTop - prop.marginBottom) / labels_right.length

            for (var i=0,y=(prop.marginTop + (vspace_right / 2)); i<labels_right.length; y+=vspace_right,i++) {
                
                if (labels_right[i][2]) {

                    var x          = this.centerx + this.radius + offset,
                        idx        = labels_right[i][0],
                        explosionX = labels_right[i][6][0] ? labels_right[i][6][1] : 0,
                        explosionY = labels_right[i][6][0] ? labels_right[i][6][2] : 0

                    var ret = RGraph.text({
                        
                        object: this,
                        
                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                        x:      x + explosionX,
                        y:      y + explosionY,
                        text:   labels_right[i][2],
                        valign: 'center',
                        halign: 'left',
                        tag:    'labels',
                        color:  labels_right[i][5]
                    });
                    
                    if (ret && ret.node) {
                        ret.node.__index__ = labels_right[i][0];
                    }

                    // This draws the stick
                    path(this.context, 'lc round lw % b m % % qc % % % % s %',
                        
                        prop.labelsSticksLinewidth,
                        
                        labels_right[i][3][0] + explosionX,
                        labels_right[i][3][1] + explosionY,
                    
                        labels_right[i][4][0] + explosionX,
                        labels_right[i][4][1] + explosionY,
                        
                        //this.centerx + this.radius + 25 + explosionX,
                        //Math.round(labels_right[i][4][1] + explosionY),
                        
                        ret.x - 5 ,
                        ret.y + (ret.height / 2),
                    
                        labels_right[i][5]
                    );

                    
                    // Draw a circle at the end odf the stick
                    path(this.context,
                        'b a % % 2 0 6.2830 false, f %',
                        ret.x - 5,
                        ret.y + (ret.height / 2),
                        labels_right[i][5]
                    );
                }
            }









            //
            // Draw the left hand side labels
            //
            
            

            
            
            // Calculate how much space there is for each label
            var vspace_left = (this.canvas.height - prop.marginTop - prop.marginBottom) / labels_left.length

            for (var i=(labels_left.length - 1),y=(prop.marginTop + (vspace_left / 2)); i>=0; y+=vspace_left,i--) {

                if (labels_left[i][2]) {

                    var x = this.centerx - this.radius - offset,
                        idx        = labels_left[i][0],
                        explosionX = labels_left[i][6][0] ? labels_left[i][6][1] : 0,
                        explosionY = labels_left[i][6][0] ? labels_left[i][6][2] : 0
                    
                    var ret = RGraph.text({
                        
                        object: this,
                        
                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                        x:      x + explosionX,
                        y:      y + explosionY,
                        text:   labels_left[i][2],
                        valign: 'center',
                        halign: 'right',
                        tag:    'labels'
                    });
                    
                    if (ret && ret.node) {
                        ret.node.__index__ = labels_left[i][0];
                    }
    
                    path(this.context,
                        'lw % b m % % qc % % % % s %',
                        
                        prop.labelsSticksLinewidth,
                        
                        labels_left[i][3][0] + explosionX,
                        labels_left[i][3][1] + explosionY,
    
                        //labels_left[i][4][0] + explosionX,
                        //labels_left[i][4][1] + explosionY,
                        
                        labels_left[i][4][0] + explosionX,
                        Math.round(labels_left[i][4][1] + explosionY),
                        
                        ret.x + 5 + ret.width,
                        ret.y + (ret.height / 2),
    
                        labels_left[i][5]
                    );

                    
                    // Draw a circle at the end odf the stick
                    path(this.context,
                        'b a % % 2 0 6.2830 false, f %',
                        ret.x + 5 + ret.width,
                        ret.y + (ret.height / 2),
                        labels_left[i][5]
                    );
                }
            }
        };








        //
        // This function draws the pie chart sticks (for the labels)
        //
        this.drawSticks = function ()
        {
            var offset    = prop.linewidth / 2,
                exploded  = prop.exploded,
                sticks    = prop.labelsSticks,
                colors    = prop.colors,
                cx        = this.centerx,
                cy        = this.centery,
                radius    = this.radius,
                points    = [],
                linewidth = prop.labelsSticksLinewidth

            for (var i=0,len=this.angles.length; i<len; ++i) {
            
                var segment = this.angles[i];
    
                // This allows the labelsSticks to be an array as well as a boolean
                if (typeof sticks === 'object' && !sticks[i]) {
                    continue;
                }
    
                var radians = segment[1] - segment[0];
    
                this.context.beginPath();
                this.context.strokeStyle = typeof prop.labelsSticksColors === 'string' ? prop.labelsSticksColors : (!RGraph.isNull(prop.labelsSticksColors) ? prop.labelsSticksColors[i] : 'gray');
                this.context.lineWidth   = linewidth;
                
                if (typeof prop.labelsSticksColor === 'string') {
                    this.context.strokeStyle = prop.labelsSticksColor;
                }
    
                var midpoint = (segment[0] + (radians / 2));
    
                if (typeof exploded === 'object' && exploded[i]) {
                    var extra = exploded[i];
                } else if (typeof exploded === 'number') {
                    var extra = exploded;
                } else {
                    var extra = 0;
                }
                
                //
                // Determine the stick length
                //
                var stickLength = typeof prop.labelsSticksLength === 'object' ? prop.labelsSticksLength[i] : prop.labelsSticksLength;
                

                points[0] = RGraph.getRadiusEndPoint(cx, cy, midpoint, radius + extra + offset);
                points[1] = RGraph.getRadiusEndPoint(cx, cy, midpoint, radius + stickLength + extra - 5);
                
                points[2] = RGraph.getRadiusEndPoint(cx, cy, midpoint, radius + stickLength + extra);
                
                points[3] = RGraph.getRadiusEndPoint(cx, cy, midpoint, radius + stickLength + extra);
                points[3][0] += (points[3][0] > cx ? 5 : -5);
                
                points[4] = [
                    points[2][0] + (points[2][0] > cx ? 5 + prop.labelsSticksHlength : -5 - prop.labelsSticksHlength),
                    points[2][1]
                ];


                this.context.moveTo(points[0][0], points[0][1]);
                this.context.quadraticCurveTo(
                    points[2][0],
                    points[2][1],
                    points[4][0],
                    points[4][1]
                );
    
                this.context.stroke();
                
                //
                // Save the stick end coords
                //
                this.coordsSticks[i] = [
                    points[0],
                    points[1],
                    points[2],
                    points[3],
                    points[4]
                ];
            }
        };








        //
        // The (now Pie chart specific) getSegment function
        // 
        // @param object e The event object
        //
        this.getShape = function (e)
        {
            RGraph.fixEventObject(e);
    
            // The optional arg provides a way of allowing some accuracy (pixels)
            var accuracy = arguments[1] ? arguments[1] : 0;
    
            var canvas      = this.canvas;
            var context     = this.context;
            var mouseCoords = RGraph.getMouseXY(e);
            var mouseX      = mouseCoords[0];
            var mouseY      = mouseCoords[1];
            var r           = this.radius;
            var angles      = this.angles;
            var ret         = [];
    
            for (var i=0,len=angles.length; i<len; ++i) {
    
                // DRAW THE SEGMENT AGAIN SO IT CAN BE TESTED //////////////////////////
                this.context.beginPath();
                    this.context.strokeStyle = 'rgba(0,0,0,0)';
                    this.context.arc(angles[i][2], angles[i][3], this.radius, angles[i][0], angles[i][1], false);
                    
                    if (this.type == 'pie' && prop.variant == 'donut') {
                        this.context.arc(angles[i][2], angles[i][3], (typeof(prop.variantDonutWidth) == 'number' ? this.radius - prop.variantDonutWidth : this.radius / 2), angles[i][1], angles[i][0], true);
                    } else {
                        this.context.lineTo(angles[i][2], angles[i][3]);
                    }
                this.context.closePath();
                    
                if (!this.context.isPointInPath(mouseX, mouseY)) {
                    continue;
                }
    
                ////////////////////////////////////////////////////////////////////////
    
                ret[0] = angles[i][2];
                ret[1] = angles[i][3];
                ret[2] = this.radius;
                ret[3] = angles[i][0] - RGraph.TWOPI;
                ret[4] = angles[i][1];
                ret[5] = i;
    
    
                
                if (ret[3] < 0) ret[3] += RGraph.TWOPI;
                if (ret[4] > RGraph.TWOPI) ret[4] -= RGraph.TWOPI;
                
                //
                // Add the tooltip to the returned shape
                //
                var tooltip = RGraph.parseTooltipText ? RGraph.parseTooltipText(prop.tooltips, ret[5]) : null;
                
                //
                // Now return textual keys as well as numerics
                //
                ret['object']      = this;
                ret['x']           = ret[0];
                ret['y']           = ret[1];
                ret['radius']      = ret[2];
                ret['angle.start'] = ret[3];
                ret['angle.end']   = ret[4];
                ret['index']       = ret[5];
                ret['tooltip']     = tooltip;
    
                return ret;
            }
            
            return null;
        };








        this.drawBorders = function ()
        {
            if (prop.linewidth > 0) {
    
                this.context.lineWidth = prop.linewidth;
                this.context.strokeStyle = prop.colorsStroke;
                
                var r = this.radius;
    
                for (var i=0,len=this.angles.length; i<len; ++i) {
                
                    var segment = this.angles[i];

                    this.context.beginPath();
                        this.context.arc(segment[2],
                               segment[3],
                               r,
                               (segment[0]),
                               (segment[0] + 0.001),
                               0);
                        this.context.arc(segment[2],
                               segment[3],
                               prop.variant == 'donut' ? (typeof(prop.variantDonutWidth) == 'number' ? this.radius - prop.variantDonutWidth : r / 2): r,
                               segment[0],
                               segment[0] + 0.0001,
                               0);
                    this.context.closePath();
                    this.context.stroke();
                }
            }
        };








        //
        // Returns the radius of the pie chart
        // 
        // [06-02-2012] Maintained for compatibility ONLY.
        //
        this.getRadius = function ()
        {
            this.graph = {
                width: this.canvas.width - prop.marginLeft - prop.marginRight,
                height: this.canvas.height - prop.marginTop - prop.marginBottom
            };
    
            if (typeof(prop.radius) == 'number') {
                this.radius = prop.radius;
            } else {
                this.radius = Math.min(this.graph.width, this.graph.height) / 2;
            }
    
            return this.radius;
        };








        //
        // A programmatic explode function
        // 
        // @param object obj   The chart object
        // @param number index The zero-indexed number of the segment
        // @param number size  The size (in pixels) of the explosion
        //
        this.explodeSegment = function (index, size)
        {
            if (typeof this.exploding === 'number' && this.exploding === index) {
                return;
            }

            //this.set('exploded', []);
            if (!prop.exploded) {
                prop.exploded = [];
            }
            
            // If exploded is a number - convert it to an array
            if (typeof prop.exploded === 'number') {
    
                var original_explode = prop.exploded;
                var exploded = prop.exploded;
    
                prop.exploded = [];
                
                for (var i=0,len=this.data.length; i<len; ++i) {
                    prop.exploded[i] = exploded;
                }
            }
            
            prop.exploded[index] = typeof original_explode == 'number' ? original_explode : 0;

            this.exploding = index;
            var delay = RGraph.ISIE && !RGraph.ISIE10 ? 25 : 16.666;
            var obj = this;

            for (var o=0; o<size; ++o) {
    
                setTimeout(
                    function ()
                    {

                        prop.exploded[index] += 1;
                        RGraph.clear(obj.canvas);
                        RGraph.redrawCanvas(obj.canvas);
                    }, o * delay);
            }
            
            var obj = this;
            setTimeout(function ()
            {
                obj.exploding = null;
            }, size * delay);
        };








        //
        // This function highlights a segment
        // 
        // @param array segment The segment information that is returned by the pie.getSegment(e) function
        //
        this.highlight_segment = function (segment)
        {
            this.context.beginPath();
                this.context.strokeStyle = prop.highlightStyleTwodStroke;
                this.context.fillStyle   = prop.highlightStyleTwodFill;
                this.context.moveTo(segment[0], segment[1]);
                this.context.arc(segment[0], segment[1], segment[2], this.angles[segment[5]][0], this.angles[segment[5]][1], 0);
                this.context.lineTo(segment[0], segment[1]);
            this.context.closePath();
            
            this.context.stroke();
            this.context.fill();
        };








        //
        // Each object type has its own Highlight() function which highlights
        // the appropriate shape
        // 
        // @param object shape The shape to highlight
        //
        this.highlight = function (shape)
        {
            if (prop.tooltipsHighlight) {
                
                if (typeof prop.highlightStyle === 'function') {
                    (prop.highlightStyle)(shape);

                //
                // 3D style of highlighting
                //
                } else if (prop.highlightStyle == '3d') {

                    this.context.lineWidth = 1;
                    
                    // This is the extent of the 2D effect. Bigger values will give the appearance of a larger "protusion"
                    var extent = 2;
            
                    // Draw a white-out where the segment is
                    this.context.beginPath();
                        RGraph.noShadow(this);
                        this.context.fillStyle   = 'rgba(0,0,0,0)';
                        this.context.arc(shape['x'], shape['y'], shape['radius'], shape['angle.start'], shape['angle.end'], false);
                        if (prop.variant == 'donut') {
                            this.context.arc(shape['x'], shape['y'], shape['radius'] / 5, shape['angle.end'], shape['angle.start'], true);
                        } else {
                            this.context.lineTo(shape['x'], shape['y']);
                        }
                    this.context.closePath();
                    this.context.fill();
        
                    // Draw the new segment
                    this.context.beginPath();
        
                        this.context.shadowColor   = '#666';
                        this.context.shadowBlur    = 3;
                        this.context.shadowOffsetX = 3;
                        this.context.shadowOffsetY = 3;
        
                        this.context.fillStyle   = prop.colors[shape['index']];
                        this.context.strokeStyle = prop.colorsStroke;
                        this.context.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'], shape['angle.start'], shape['angle.end'], false);
                        if (prop.variant == 'donut') {
                            this.context.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'] / 2, shape['angle.end'], shape['angle.start'],  true)
                        } else {
                            this.context.lineTo(shape['x'] - extent, shape['y'] - extent);
                        }
                    this.context.closePath();
                    
                    this.context.stroke();
                    this.context.fill();
                    
                    // Turn off the shadow
                    RGraph.noShadow(this);
        
                    //
                    // If a border is defined, redraw that
                    //
                    if (prop.border) {
                        this.context.beginPath();
                        this.context.strokeStyle = prop.borderColor;
                        this.context.lineWidth = 5;
                        this.context.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'] - 2, shape['angle.start'], shape['angle.end'], false);
                        this.context.stroke();
                    }
                



                // Outline style of highlighting
                } else if (prop.highlightStyle === 'outline') {
            
                    var tooltip = RGraph.Registry.get('tooltip'),
                        index   = tooltip.__index__,
                        coords  = this.angles[index],
                        color   = this.get('colors')[index]
                        width   = this.radius / 12.5;
                    
                    // Allow custom setting of outline
                    if (typeof prop.highlightStyleOutlineWidth === 'number') {
                        width = prop.highlightStyleOutlineWidth;
                    }



                    RGraph.path(
                        this.context,
                        'ga 0.25 b a % % % % % false a % % % % % true c f % ga 1',
                        coords[2],
                        coords[3],
                        this.radius + 2 + width,
                        coords[0],
                        coords[1],
                        
                        coords[2],
                        coords[3],
                        this.radius + 2,
                        coords[1],
                        coords[0],
                        color
                    );
        
        
        
        
        
        
                // Default 2D style of  highlighting
                } else {

                    this.context.beginPath();
    
                        this.context.strokeStyle = prop.highlightStyleTwodStroke;
                        this.context.fillStyle   = prop.highlightStyleTwodFill;

                        if (prop.variant.indexOf('donut') > -1) {
                            this.context.arc(shape['x'], shape['y'], shape['radius'], shape['angle.start'], shape['angle.end'], false);
                            this.context.arc(shape['x'], shape['y'], typeof(prop.variantDonutWidth) == 'number' ? this.radius - prop.variantDonutWidth : shape['radius'] / 2, shape['angle.end'], shape['angle.start'], true);
                        } else {
                            this.context.arc(shape['x'], shape['y'], shape['radius'] + 1, shape['angle.start'], shape['angle.end'], false);
                            this.context.lineTo(shape['x'], shape['y']);
                        }
                    this.context.closePath();
        
                    this.context.stroke();
                    this.context.fill();
                }
            }
        };








        //
        // The getObjectByXY() worker method. The Pie chart is able to use the
        // getShape() method - so it does.
        //
        this.getObjectByXY = function (e)
        {
            if (this.getShape(e)) {
                return this;
            }
        };








        //
        // Draws the centerpin if requested
        //
        this.drawCenterpin = function ()
        {
            if (typeof prop.centerpin === 'number' && prop.centerpin > 0) {
            
                var cx = this.centerx;
                var cy = this.centery;
            
                this.context.beginPath();
                    this.context.strokeStyle = prop.centerpinStroke ? prop.centerpinStroke : prop.colorsStroke;
                    this.context.fillStyle = prop.centerpinFill ? prop.centerpinFill : prop.colorsStroke;
                    this.context.moveTo(cx, cy);
                    this.context.arc(cx, cy, prop.centerpin, 0, RGraph.TWOPI, false);
                this.context.stroke();
                this.context.fill();
            }
        };








        //
        // This draws Ingraph labels
        //
        this.drawInGraphLabels = function ()
        {
            var context = this.context;
            var cx      = this.centerx;
            var cy      = this.centery;
            var radius  = prop.labelsIngraphRadius;
            
            //
            // Is the radius less than 2? If so then it's a factor and not n exact point
            //
            if (radius <= 2 && radius > 0) {
                radiusFactor = radius;
            } else {
                radiusFactor = 0.5;
            }

            if (prop.variant == 'donut') {
                var r = this.radius * (0.5 + (radiusFactor * 0.5));
                
                if (typeof(prop.variantDonutWidth) == 'number') {
                    var r = (this.radius - prop.variantDonutWidth) + (prop.variantDonutWidth / 2);
                }
            } else {
                var r = this.radius * radiusFactor;
            }

            if (radius > 2) {
                r = radius;
            }
    
            for (var i=0,len=this.angles.length; i<len; ++i) {
    
                // This handles any explosion that the segment may have
                if (typeof(prop.exploded) == 'object' && typeof(prop.exploded[i]) == 'number') {
                    var explosion = prop.exploded[i];
                } else if (typeof(prop.exploded) == 'number') {
                    var explosion = parseInt(prop.exploded);
                } else {
                    var explosion = 0;
                }
    
                var angleStart  = this.angles[i][0];
                var angleEnd    = this.angles[i][1];
                var angleCenter = ((angleEnd - angleStart) / 2) + angleStart;
                var coords      = RGraph.getRadiusEndPoint(
                    this.centerx,
                    this.centery,
                    angleCenter,
                    r + (explosion ? explosion : 0)
                );

                var x           = coords[0];
                var y           = coords[1];
    
                var text = prop.labelsIngraphSpecific && typeof(prop.labelsIngraphSpecific[i]) == 'string' ? prop.labelsIngraphSpecific[i] : RGraph.numberFormat({
                    object:    this,
                    number:    this.data[i].toFixed(prop.labelsIngraphDecimals),
                    unitspre:  prop.labelsIngraphUnitsPre,
                    unitspost: prop.labelsIngraphUnitsPost,
                    point:     prop.labelsIngraphPoint,
                    thousand:  prop.labelsIngraphThousand
                });
    
                if (text) {
                    this.context.beginPath();
                        
                        var textConf = RGraph.getTextConf({
                            object: this,
                            prefix: 'labelsIngraph'
                        });
    
                        RGraph.text({
                            
                       object: this,

                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                            x:              x,
                            y:              y,
                            text:           text,
                            valign:         'center',
                            halign:         'center',
                            bounding:       prop.labelsIngraphBounding,
                            boundingFill:   prop.labelsIngraphBoundingFill,
                            boundingStroke: prop.labelsIngraphBoundingStroke,
                            tag:            'labels.ingraph'
                        });
                    this.context.stroke();
                }
            }
        };








        //
        // Draws the center label if required
        //
        this.drawCenterLabel = function (label)
        {
            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'labelsCenter'
            });

            RGraph.text({
                
           object: this,

             font: textConf.font,
             size: textConf.size,
            color: textConf.color,
             bold: textConf.bold,
           italic: textConf.italic,

                x: this.centerx,
                y: this.centery,

                halign: 'center',
                valign: 'center',

                text: label,
                
                bounding: true,
                boundingFill: 'rgba(255,255,255,0.7)',
                boundingStroke: 'rgba(0,0,0,0)',

                tag: 'labels.center'
            });
        };








        //
        // This returns the angle for a value based around the maximum number
        // 
        // @param number value The value to get the angle for
        //
        this.getAngle = function (value)
        {
            if (value > this.total) {
                return null;
            }
            
            var angle = (value / this.total) * RGraph.TWOPI;
    
            // Handle the origin (it can br -HALFPI or 0)
            angle += prop.origin;
    
            return angle;
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors.colors                    = RGraph.arrayClone(prop.colors);
                this.original_colors.keyColors                 = RGraph.arrayClone(prop.keyColors);
                this.original_colors.colorsStroke              = RGraph.arrayClone(prop.colorsStroke);
                this.original_colors.highlightStroke           = RGraph.arrayClone(prop.highlightStroke);
                this.original_colors.highlightStyleTwodFill    = RGraph.arrayClone(prop.highlightStyleTwodFill);
                this.original_colors.highlightStyleTwodStroke  = RGraph.arrayClone(prop.highlightStyleTwodStroke);
                this.original_colors.labelsIngraphBoundingFill = RGraph.arrayClone(prop.labelsIngraphBoundingFill);
                this.original_colors.labelsIngraphColor        = RGraph.arrayClone(prop.labelsIngraphColor);
            }

            for (var i=0; i<prop.colors.length; ++i) {
                prop.colors[i] = this.parseSingleColorForGradient(prop.colors[i]);
            }
    
            var keyColors = prop.keyColors;
            if (keyColors) {
                for (var i=0; i<keyColors.length; ++i) {
                    keyColors[i] = this.parseSingleColorForGradient(keyColors[i]);
                }
            }
    
            prop.colorsStroke                = this.parseSingleColorForGradient(prop.colorsStroke);
            prop.highlightStroke             = this.parseSingleColorForGradient(prop.highlightStroke);
            prop.highlightStyleTwodFill    = this.parseSingleColorForGradient(prop.highlightStyleTwodFill);
            prop.highlightStyleTwodStroke  = this.parseSingleColorForGradient(prop.highlightStyleTwodStroke);
            prop.labelsIngraphBoundingFill = this.parseSingleColorForGradient(prop.labelsIngraphBoundingFill);
            prop.labelsIngraphColor         = this.parseSingleColorForGradient(prop.labelsIngraphColor);
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
    
                // If the chart is a donut - the first width should half the total radius
                if (prop.variant == 'donut') {
                    var radius_start = typeof(prop.variantDonutWidth) == 'number' ? this.radius - prop.variantDonutWidth : this.radius / 2;
                } else {
                    var radius_start = 0;
                }

                // Create the gradient
                var grad = this.context.createRadialGradient(
                    this.centerx,
                    this.centery,
                    radius_start,
                    this.centerx,
                    this.centery,
                    Math.min(this.canvas.width - prop.marginLeft - prop.marginRight,
                    this.canvas.height - prop.marginTop - prop.marginBottom) / 2
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
        // This function handles highlighting an entire data-series for the interactive
        // key
        // 
        // @param int index The index of the data series to be highlighted
        //
        this.interactiveKeyHighlight = function (index)
        {
            if (this.angles && this.angles[index]) {

                var segment = this.angles[index];
                var x = segment[2];
                var y = segment[3];
                var start = segment[0];
                var end   = segment[1];
                
                this.context.strokeStyle = prop.keyInteractiveHighlightChartStroke;
                this.context.fillStyle   = prop.keyInteractiveHighlightChartFill;
                this.context.lineWidth   = 2;
                this.context.lineJoin    = 'bevel';
                
                this.context.beginPath();
                this.context.moveTo(x, y);
                this.context.arc(x, y, this.radius, start, end, false);
                this.context.closePath();
                this.context.fill();
                this.context.stroke();
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
        // Draw a 3D Pie/Donut chart
        //
        this.draw3d = function ()
        {
            var scaleX            = 1.5,
                depth             = prop.variantThreedDepth,
                prop_shadow       = prop.shadow,
                prop_labels       = prop.labels,
                prop_labelsSticks = prop.labelsSticks

            this.set({
                labels: [],
                labelsSticks: false,
                strokestyle: 'rgba(0,0,0,0)'
            });
            
            //
            // Change the variant so that the draw function doesn't keep
            // coming in here
            //
            this.set({
                variant: this.get('variant').replace(/3d/, '')
            });
            
            this.context.setTransform(scaleX, 0, 0, 1, (this.canvas.width * (scaleX) - this.canvas.width) * -0.5, 0);
            
            for (var i=depth; i>0; i-=1) {
                
                this.set({
                    centeryAdjust: i
                });
                
                if (i === parseInt(depth / 2) ) {
                    this.set({
                        labels: prop_labels,
                        labelsSticks: prop_labelsSticks
                    });
                }
                
                if (i === 0) {
                    this.set({
                        shadow: prop_shadow
                    });
                }

                this.draw();

                // Turn off the shadow after the bottom pie/donut has
                // been drawn
                this.set('shadow', false);

                //
                // If on the middle pie/donut turn the labels and sticks off
                //
                if (i <= parseInt(depth / 2) ) {
                    this.set({
                        labels: [],
                        labelsSticks: false
                    });
                }

                //
                // Make what we're drawng darker by going over
                // it in a semi-transparent dark color
                //
                if (i > 1) {
                    if (prop.variant.indexOf('donut') !== -1) {

                        for (var j=0; j<this.angles.length; ++j) {
                            path(this.context,[
                                'b',
                                'a', this.angles[j][2], this.angles[j][3], this.radius + 1, this.angles[j][0], this.angles[j][1] * prop.effectRoundrobinMultiplier, false,
                                'a', this.angles[j][2], this.angles[j][3], this.radius / 2, this.angles[j][1] * prop.effectRoundrobinMultiplier, this.angles[j][0], true,
                                'f', 'rgba(0,0,0,0.15)'
                            ]);
                        }

                    // Draw the pie chart darkened segments
                    } else {

                        for (var j=0; j<this.angles.length; ++j) {

                            path(this.context,[
                                'b',
                                'm', this.angles[j][2], this.angles[j][3],
                                'a', this.angles[j][2],
                                     this.angles[j][3],
                                     this.radius + 1,
                                     this.angles[j][0],
                                     this.angles[j][1] * prop.effectRoundrobinMultiplier,
                                     false,
                                'c',
                                'f', 'rgba(0,0,0,0.15)'
                            ]);
                        }
                    }
                }
            }

            //
            // Reset the variant by adding the 3d back on
            //
            this.set({
                variant: this.get('variant') + '3d',
                shadow: prop_shadow,
                labels: prop_labels,
                labelsSticks: prop_labelsSticks
            });
            
            // Necessary to allow method chaining
            return this;
        };








        //
        // Pie chart explode
        // 
        // Explodes the Pie chart - gradually incrementing the size of the explode property
        // 
        // @param object     Options for the effect
        // @param function   An optional callback function to call when the animation completes
        //
        this.explode = function ()
        {
            var obj            = this;
            var opt            = arguments[0] ? arguments[0] : {};
            var callback       = arguments[1] ? arguments[1] : function () {};
            var frames         = opt.frames ? opt.frames : 30;
            var frame          = 0;
            var maxExplode     = Number(typeof opt.radius === 'number' ? opt.radius : Math.max(this.canvas.width, this.canvas.height));
            var currentExplode = Number(obj.get('exploded')) || 0;
            var step           = (maxExplode - currentExplode) / frames;
            
            // Lose the labels
            this.set('labels', null);

            // exploded option
            var iterator = function ()
            {
                obj.set('exploded', currentExplode + (step * frame) );

                RGraph.clear(obj.canvas);
                RGraph.redrawCanvas(obj.canvas);
    
                if (frame++ < frames) {
                    RGraph.Effects.updateCanvas(iterator);
                } else {
                    callback(obj);
                }
            }
            
            iterator();
            
            return this;
        };








        //
        // Pie chart grow
        // 
        // Gradually increases the pie chart radius
        // 
        // @param object   OPTIONAL An object of options
        // @param function OPTIONAL A callback function
        //
        this.grow = function ()
        {
            var obj      = this;
            var canvas   = obj.canvas;
            var opt      = arguments[0] ? arguments[0] : {};
            var frames   = opt.frames || 30;
            var frame    = 0;
            var callback = arguments[1] ? arguments[1] : function () {};
            var radius   = obj.getRadius();


            prop.radius = 0;

            var iterator = function ()
            {
                obj.set('radius', (frame / frames) * radius);
                
                RGraph.redrawCanvas(canvas);
    
                if (frame++ < frames) {
                    RGraph.Effects.updateCanvas(iterator);
                
                } else {

                    RGraph.redrawCanvas(obj.canvas);


                    callback(obj);
                }
            };
    
            iterator();
            
            return this;
        };








        //
        // RoundRobin
        // 
        // This effect does two things:
        //  1. Gradually increases the size of each segment
        //  2. Gradually increases the size of the radius from 0
        // 
        // @param object OPTIONAL Options for the effect
        // @param function OPTIONAL A callback function
        //
        this.roundRobin = function ()
        {
            var obj      = this,
                opt      = arguments[0] || {},
                callback = arguments[1] || function () {},
                frame    = 0,
                frames   = opt.frames || 30,
                radius   =  obj.getRadius(),
                labels   =  obj.get('labels')
            
            obj.set('events', false);
            obj.set('labels', []);

            var iterator = function ()
            {
                obj.set(
                    'effectRoundrobinMultiplier',
                    RGraph.Effects.getEasingMultiplier(frames, frame)
                );

                RGraph.redrawCanvas(obj.canvas);

                if (frame < frames) {
                    RGraph.Effects.updateCanvas(iterator);
                    frame++;
                
                } else {

                    obj.set({
                        events: true,
                        labels: labels
                    });

                    RGraph.redrawCanvas(obj.canvas);
                    callback(obj);
                }
            };
    
            iterator();
            
            return this;
        };









        //
        // Pie chart implode
        // 
        // Implodes the Pie chart - gradually decreasing the size of the exploded property. It starts at the largest of
        // the canvas width./height
        // 
        // @param object     Optional options for the effect. You can pass in frames here - such as:
        //                   myPie.implode({frames: 60}; function () {alert('Done!');})
        // @param function   A callback function which is called when the effect is finished
        //
        this.implode = function ()
        {
            var obj         = this,
                opt         = arguments[0] || {},
                callback    = arguments[1] || function (){},
                frames      = opt.frames || 30,
                frame       = 0,
                explodedMax = Math.max(this.canvas.width, this.canvas.height),
                exploded    = explodedMax;
    
    
    
            function iterator ()
            {
                exploded =  explodedMax - ((frame / frames) * explodedMax);

                // Set the new value
                obj.set('exploded', exploded);
    
                RGraph.clear(obj.canvas);
                RGraph.redrawCanvas(obj.canvas);

                if (frame++ < frames) {
                    RGraph.Effects.updateCanvas(iterator);
                } else {
                    RGraph.clear(obj.canvas);
                    RGraph.redrawCanvas(obj.canvas);
                    callback(obj);
                }
            }
            
            iterator();

            return this;
        };








        //
        // Now need to register all chart types. MUST be after the setters/getters are defined
        //
        RGraph.register(this);








        //
        // This is the 'end' of the constructor so if the first argument
        // contains configuration data - handle that.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);
    };








    //
    // A specific class to make creating and showing Horseshoe
    // Meter charts very easy.
    //
    RGraph.HorseshoeMeter = function (conf)
    {
        this.draw = function ()
        {
            var width    = typeof conf.options.width === 'number' ? conf.options.width : 5,
                fgColor  = typeof conf.options.colors === 'object' && typeof conf.options.colors[0] === 'string' ? conf.options.colors[0] : 'black',
                bgColor  = typeof conf.options.colors === 'object' && typeof conf.options.colors[1] === 'string' ? conf.options.colors[1] : '#ddd';

            // Bounds checking
            conf.value = Math.max(conf.value, conf.min);
            conf.value = Math.min(conf.value, conf.max);

            var obj = new RGraph.Pie({
                id: conf.id,
                data: [conf.value - conf.min, conf.max - conf.value],
                options: {
                    centerx:        conf.options.centerx,
                    centery:        conf.options.centery,
                    radius:         conf.options.radius,
                    marginLeft:     conf.options.marginLeft || 25,
                    marginRight:    conf.options.marginRight || 25,
                    marginTop:      conf.options.marginTop || 25,
                    marginBottom:   conf.options.marginBottom || 25,
                    shadow:         false,
                    variant:        'donut',
                    variantDonutWidth: width,
                    colors:         [fgColor, 'transparent'],
                    colorsStroke:   'rgba(0,0,0,0)',
                    contextmenu:    conf.options.contextmenu
                }
            }).draw();
            
            obj.on('beforedraw', function (obj)
            {
                // Draw the background gray circle
                RGraph.path(
                    obj.context,
                    'b lw % a % % % 0 6.2830 false a % % % 6.2830 0 true f %',
                    width,
                    obj.centerx,
                    obj.centery,
                    obj.radius,
                    obj.centerx,
                    obj.centery,
                    obj.radius - width,
                    bgColor
                );
            }).on('draw', function (obj)
            {
                // Draw the circle at the start of the Pie chart
                RGraph.path(
                    obj.context,
                    'b a % % % 0 6.2830 false f % s white',
                    obj.centerx,
                    obj.centery - obj.radius + (width / 2),
                    width + 5,
                    fgColor
                );
    
                // Get the coordinates to the end point of the donut chart
                var coords = RGraph.getRadiusEndPoint(
                    obj.centerx,
                    obj.centery,
                    obj.angles[0][1],
                    obj.radius - (width / 2)
                );
                
                // Draw the circle at the end of the Pie chart
                RGraph.path(
                    obj.context,
                    'b a % % % 0 6.2830 false f % s white',
                    coords[0],
                    coords[1],
                    width + 5,
                    fgColor
                );

               // The draw event adds the text that sits in the center of the donut.
                // Because it's in the draw event it gets redrawn on every frame.
                RGraph.text({
                    
                    object:  obj,

                    size:    typeof conf.options.textSize   === 'number' ? conf.options.textSize    : 60,
                    font:    typeof conf.options.textFont   === 'string' ? conf.options.textFont    : 'Arial',
                    color:   typeof conf.options.textColor  === 'string' ? conf.options.textColor   : 'black',
                    bold:    typeof conf.options.textBold   === 'boolean' ? conf.options.textBold   : false,
                    italic:  typeof conf.options.textItalic === 'boolean' ? conf.options.textItalic : false,

                    text:    parseInt(conf.min + (obj.data[0] * obj.get('effectRoundrobinMultiplier')) ) + '%',
                    x:       obj.centerx,
                    y:       obj.centery,
                    halign:  'center',
                    valign:  'center'
                });
            });

            RGraph.clear(obj.canvas);
            
            // Now draw the Meter
            if (conf.roundRobin) {
                obj.roundRobin(
                    conf.options.animationOptions,
                    conf.options.animationCallback
                );
            } else {
                obj.draw();
            }
            
            return obj;
        };


        //
        // The roundfRobin animation
        //
        this.roundRobin = function ()
        {
            conf.roundRobin = true;
            if (arguments[0]) {conf.options.animationOptions  = arguments[0];}
            if (arguments[1]) {conf.options.animationCallback = arguments[1];}

            this.draw();
        };
    };

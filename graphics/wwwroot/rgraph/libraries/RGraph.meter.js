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
    RGraph.Meter = function (conf)
    {
        var id                 = conf.id
        var canvas             = document.getElementById(id);
        var min                = conf.min;
        var max                = conf.max;
        var value              = conf.value;

        // id, min, max, value
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = canvas;
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d", {alpha: (typeof id === 'object' && id.alpha === false) ? false : true}) : null;
        this.canvas.__object__ = this;
        this.type              = 'meter';
        this.min               = RGraph.stringsToNumbers(min);
        this.max               = RGraph.stringsToNumbers(max);
        this.value             = RGraph.stringsToNumbers(value);
        this.centerx           = null;
        this.centery           = null;
        this.radius            = null;
        this.isRGraph          = true;
        this.currentValue      = null;
        this.uid               = RGraph.createUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.createUID();
        this.colorsParsed      = false;
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false


        // Various config type stuff
        this.properties =
        {
            backgroundImageUrl:     			null,
            backgroundImageOffsetx: 			0,
            backgroundImageOffsety: 			0,
            backgroundImageStretch: 			true,
            backgroundColor:       				'white',

            marginLeft:            				15,
            marginRight:           				15,
            marginTop:             				15,
            marginBottom:          				20,

            linewidth:              			1,
            linewidthSegments:     				0,

            colorsStroke:            			null,
            
            border:                 			true,
            borderColor:           				'black',
            
            textFont:              				'Arial, Verdana, sans-serif',
            textSize:              				12,
            textColor:             				'black',
            textBold:              				false,
            textItalic:            				false,
            textValign:            				'center',
            textAccessible:               		false,
            textAccessibleOverflow:      		'visible',
            textAccessiblePointerevents: 		false,
            
            labels:                             true,
            labelsCount:                        10,
            labelsSpecific:                     null,
            labelsRadiusOffset:                0,
            labelsFont:                         null,
            labelsSize:                         null,
            labelsColor:                        null,
            labelsBold:                         null,
            labelsItalic:                       null,
            labelsValueText:                   	false,
            labelsValueTextFont:              	null,
            labelsValueTextSize:              	null,
            labelsValueTextBold:              	null,
            labelsValueTextItalic:            	null,
            labelsValueTextColor:             	null,
            labelsValueTextDecimals:          	0,
            labelsValueTextUnitsPre:         	'',
            labelsValueTextUnitsPost:        	'',
            labelsValueTextBackground:        	true,
            labelsValueTextBackgroundFill:   	'rgba(255,255,255,0.75)',
            labelsValueTextBackgroundStroke: 	'rgba(0,0,0,0)',
            labelsValueTextSpecific:          	null,
            labelsValueTextAccessible:        	true,
            
            title:                  			'',
            titleBackground:        			null,
            titleHpos:              			null,
            titleVpos:              			null,
            titleColor:             			null,
            titleBold:              			null,
            titleFont:              			null,
            titleItalic:            			null,
            titleSize:              			null,
            titleX:                 			null,
            titleY:                 			null,
            titleHalign:            			null,
            titleValign:            			null,

            colorsGreenStart:            		((this.max - this.min) * 0.35) + this.min,
            colorsGreenEnd:              		this.max,
            colorsGreenColor:            		'#207A20',
            colorsYellowStart:           		((this.max - this.min) * 0.1) + this.min,
            colorsYellowEnd:             		((this.max - this.min) * 0.35) + this.min,
            colorsYellowColor:           		'#D0AC41',
            colorsRedStart:              		this.min,
            colorsRedEnd:                		((this.max - this.min) * 0.1) + this.min,
            colorsRedColor:              		'#9E1E1E',
            colorsRanges:          				null,

            contextmenu:            			null,

            annotatable:            			false,
            annotatableColor:      				'black',

            shadow:                 			false,
            shadowColor:           				'rgba(0,0,0,0.5)',
            shadowBlur:            				3,
            shadowOffsetx:         				3,
            shadowOffsety:         				3,

            resizable:                   		false,
            resizableHandleAdjust:     			[0,0],
            resizableHandleBackground: 			null,

            tickmarksSmallCount:    			100,
            tickmarksSmallColor:    			'#bbb',
            tickmarksLargeCount:    			10,
            tickmarksLargeColor:    			'black',

            scaleUnitsPre:          			'',
            scaleUnitsPost:         			'',
            scaleDecimals:           			0,
            scalePoint:              			'.',
            scaleThousand:           			',',

            radius:                   			null,
            centerx:                  			null,
            centery:                  			null,

            segmentsRadiusStart:     			0,

            needleRadius:            			null,
            needleType:              			'normal',
            needleTail:              			false,
            needleHead:              			true,
            needleHeadLength:       			30,
            needleHeadWidth:        			0.088,
            needleColor:             			'black',
            needleImageUrl:         			null,
            needleImageOffsetx:     			0,
            needleImageOffsety:     			0,

            adjustable:               			false,

            anglesStart:             			RGraph.PI,
            anglesEnd:               			RGraph.TWOPI,

            centerpinStroke:         			'black',
            centerpinFill:           			'white',

            clearto:   							'rgba(0,0,0,0)'
        }


        // Check for support
        if (!this.canvas) {
            alert('[METER] No canvas support');
            return;
        }



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
            // Constrain the value to be within the min and max
            //
            if (this.value > this.max) this.value = this.max;
            if (this.value < this.min) this.value = this.min;
    
            //
            // Set the current value
            //
            this.currentValue = this.value;



            //
            // Make the margins easy to access
            //
            this.marginLeft   = prop.marginLeft;
            this.marginRight  = prop.marginRight;
            this.marginTop    = prop.marginTop;
            this.marginBottom = prop.marginBottom;
            
            this.centerx = ((this.canvas.width - this.marginLeft - this.marginRight) / 2) + this.marginLeft;
            this.centery = this.canvas.height - this.marginBottom;
            this.radius  = Math.min(
                (this.canvas.width - this.marginLeft - this.marginRight) / 2,
                (this.canvas.height - this.marginTop - this.marginBottom)
            );
                
            //
            // Stop this growing uncontrollably
            //
            this.coordsText = [];
    
    
    
            //
            // Custom centerx, centery and radius
            //
            if (typeof prop.centerx === 'number') this.centerx = prop.centerx;
            if (typeof prop.centery === 'number') this.centery = prop.centery;
            if (typeof prop.radius  === 'number') this.radius  = prop.radius;
    
    
            //
            // Parse the colors for gradients. Its down here so that the center X/Y can be used
            //
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    
            this.drawBackground();
            this.drawLabels();
            this.drawNeedle();
            this.drawReadout();
            
            //
            // Draw the title
            //
            RGraph.drawTitle(
                this,
                prop.title,
                this.marginTop,
                null,
                typeof prop.titleSize === 'boolean' ? prop.titleSize : prop.textSize
            );

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
        // Draws the background of the chart
        //
        this.drawBackground = function ()
        {
            //
            // First draw the background image if it's defined
            //
            if (typeof prop.backgroundImageUrl === 'string' && !this.__background_image__) {
                
                var x   = 0 + prop.backgroundImageOffsetx;
                var y   = 0 + prop.backgroundImageOffsety;
                var img = new Image();

                this.__background_image__ = img;
                img.src = prop.backgroundImageUrl;
                var obj = this;

                img.onload = function ()
                {
                    if (prop.backgroundImageStretch) {
                        obj.context.drawImage(this, x,y,obj.canvas.width, obj.canvas.height);
                    } else {
                        obj.context.drawImage(this, x,y);
                    }
                    RGraph.redraw();
                }

            } else if (this.__background_image__) {
            
                var x   = 0 + prop.backgroundImageOffsetx;
                var y   = 0 + prop.backgroundImageOffsety;

                if (prop.backgroundImageStretch) {
                    this.context.drawImage(this.__background_image__, x,y,this.canvas.width, this.canvas.height);
                } else {
                    this.context.drawImage(this.__background_image__, x,y);
                }
            }



            //
            // Draw the white background
            //
            this.context.beginPath();
    
                this.context.fillStyle = prop.backgroundColor;
                
                if (prop.shadow) {
                    RGraph.setShadow(
                        this,
                        prop.shadowColor,
                        prop.shadowOffsetx,
                        prop.shadowOffsety,
                        prop.shadowBlur
                    );
                }

                this.context.moveTo(this.centerx,this.centery);
                this.context.arc(
                    this.centerx,
                    this.centery,
                    this.radius,
                    prop.anglesStart,
                    prop.anglesEnd,
                    false
                );
    
            this.context.fill();
            
            RGraph.noShadow(this);
    
            
            // Draw the shadow
            if (prop.shadow) {
    
                this.context.beginPath();
                    var r = (this.radius * 0.06) > 40 ? 40 : (this.radius * 0.06);
                    this.context.arc(this.centerx, this.centery, r, 0, RGraph.TWOPI, 0);
                this.context.fill();
    
                RGraph.noShadow(this);
            }



            // First, draw the grey tickmarks
            if (prop.tickmarksSmallCount) {
                for (var i=0; i<(prop.anglesEnd - prop.anglesStart); i+=(RGraph.PI / prop.tickmarksSmallCount)) {
                    this.context.beginPath();
                        this.context.strokeStyle = prop.tickmarksSmallColor;
                        this.context.arc(this.centerx, this.centery, this.radius, prop.anglesStart + i, prop.anglesStart + i + 0.00001, 0);
                        this.context.arc(this.centerx, this.centery, this.radius - 5, prop.anglesStart + i, prop.anglesStart + i + 0.00001, 0);
                    this.context.stroke();
                }
    
                // Draw the semi-circle that makes the tickmarks
                this.context.beginPath();
                    this.context.fillStyle = prop.backgroundColor;
                    this.context.arc(this.centerx, this.centery, this.radius - 4, prop.anglesStart, prop.anglesEnd, false);
                this.context.closePath();
                this.context.fill();
            }
    
    
            // Second, draw the darker tickmarks. First run draws them in white to get rid of the existing tickmark,
            // then the second run draws them in the requested color
            
            
            if (prop.tickmarksLargeCount) {
                
                var colors = ['white','white',prop.tickmarksLargeColor];
                
                for (var j=0; j<colors.length; ++j) {
                    for (var i=0; i<(prop.anglesEnd - prop.anglesStart); i+=((prop.anglesEnd - prop.anglesStart) / prop.tickmarksLargeCount)) {
                        this.context.beginPath();
                            this.context.strokeStyle = colors[j];
                            this.context.arc(this.centerx, this.centery, this.radius, prop.anglesStart +  i, prop.anglesStart + i + 0.001, 0);
                            this.context.arc(this.centerx, this.centery, this.radius - 5, prop.anglesStart + i, prop.anglesStart + i + 0.0001, 0);
                        this.context.stroke();
                    }
                }
            }
    
            // Draw the white circle that makes the tickmarks
            this.context.beginPath();
            this.context.fillStyle = prop.backgroundColor;
            this.context.moveTo(this.centerx, this.centery);
            this.context.arc(
                this.centerx,
                this.centery,
                this.radius - 7,
                prop.anglesStart,
                prop.anglesEnd,
                false
            );
            this.context.closePath();
            this.context.fill();
    
            //
            // Color ranges - either green/yellow/red or an arbitrary number of ranges
            //
            var ranges = prop.colorsRanges;
    
            if (RGraph.isArray(prop.colorsRanges)) {
    
                var ranges = prop.colorsRanges;
    
                for (var i=0; i<ranges.length; ++i) {
    
                    this.context.strokeStyle = prop.colorsStroke ? prop.colorsStroke : ranges[i][2];
                    this.context.fillStyle = ranges[i][2];
                    this.context.lineWidth = prop.linewidthSegments;
    
                    this.context.beginPath();
                        this.context.arc(
                            this.centerx,
                            this.centery,
                            this.radius * 0.85,
                            (((ranges[i][0] - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                            (((ranges[i][1] - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                            false
                        );
    
                        if (prop.segmentsRadiusStart > 0) {
                            this.context.arc(
                                this.centerx,
                                this.centery,
                                prop.segmentsRadiusStart,
                                (((ranges[i][1] - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                                (((ranges[i][0] - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                                true
                            );
                        } else {
                            this.context.lineTo(this.centerx, this.centery);
                        }
    
                    this.context.closePath();
                    this.context.stroke();
                    this.context.fill();
                }
    
                // Stops the last line from being changed to a big linewidth.
                this.context.beginPath();
    
            } else {
                this.context.lineWidth = prop.linewidth;
    
                // Draw the green area
                this.context.strokeStyle = prop.colorsStroke ? prop.colorsStroke : prop.colorsGreenColor;
                this.context.fillStyle   = prop.colorsGreenColor;
                this.context.lineWidth   = prop.linewidthSegments;
                
                this.context.beginPath();
                    this.context.arc(
                        this.centerx,
                        this.centery,
                        this.radius * 0.85,
                        (((prop.colorsGreenStart - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                        (((prop.colorsGreenEnd - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                        false
                    );
    
                    if (prop.segmentsRadiusStart > 0) {
    
                        this.context.arc(
                            this.centerx,
                            this.centery,
                            prop.segmentsRadiusStart,
                            (((prop.colorsGreenEnd - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                            (((prop.colorsGreenStart - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                            true
                        );
                    } else {
                        this.context.lineTo(this.centerx, this.centery);
                    }
    
                this.context.closePath();
                this.context.stroke();
                this.context.fill();
                
                // Draw the yellow area
                this.context.strokeStyle = prop.colorsStroke ? prop.colorsStroke : prop.colorsYellow;
                this.context.fillStyle = prop.colorsYellowColor;
                this.context.lineWidth = prop.linewidthSegments;
                this.context.beginPath();
                this.context.arc(
                    this.centerx,
                    this.centery,
                    this.radius * 0.85,
                    (((prop.colorsYellowStart - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                    (((prop.colorsYellowEnd - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                    false
                );
                
                if (prop.segmentsRadiusStart > 0) {
                    this.context.arc(
                        this.centerx,
                        this.centery,
                        prop.segmentsRadiusStart,
                        (((prop.colorsYellowEnd - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                        (((prop.colorsYellowStart - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                        true
                    );
                } else {
                    this.context.lineTo(this.centerx, this.centery);
                }
    
                this.context.closePath();
                this.context.stroke();
                this.context.fill();
                
                // Draw the red area
                this.context.strokeStyle = prop.colorsStroke ? prop.colorsStroke : prop.colorsRedColor;
                this.context.fillStyle = prop.colorsRedColor;
                this.context.lineWidth = prop.linewidthSegments;
                
                this.context.beginPath();
                    this.context.arc(
                        this.centerx,
                        this.centery,this.radius * 0.85,
                        (((prop.colorsRedStart - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                        (((prop.colorsRedEnd - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                        false
                    );
        
                    if (prop.segmentsRadiusStart > 0) {
                        this.context.arc(
                            this.centerx,
                            this.centery,
                            prop.segmentsRadiusStart,
                            (((prop.colorsRedEnd - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                            (((prop.colorsRedStart - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart,
                            true
                        );
                    } else {
                        this.context.lineTo(this.centerx, this.centery);
                    }
    
                this.context.closePath();
                this.context.stroke();
                this.context.fill();
                
                // Revert the linewidth
                this.context.lineWidth = 1;
            }
    
            // Draw the outline
            if (prop.border) {
                this.context.strokeStyle = prop.borderColor;
                this.context.lineWidth   = prop.linewidth;
                
                this.context.beginPath();
                    this.context.moveTo(this.centerx, this.centery);
                    this.context.arc(
                        this.centerx,
                        this.centery,
                        this.radius,
                        prop.anglesStart,
                        prop.anglesEnd,
                        false
                    );
                this.context.closePath();
            }
    
            this.context.stroke();
            
            // Reset the linewidth back to 1
            this.context.lineWidth = 1;
        };








        //
        // Draws the pointer
        //
        this.drawNeedle = function ()
        {
            //
            // The angle that the needle is at
            //
            var a = (((this.value - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart;

            //
            // First draw the background image if it's defined
            //
            if (typeof prop.needleImageUrl === 'string' && !this.__needle_image__) {
                
                var img = new Image();

                this.__needle_image__ = img;
                img.src = prop.needleImageUrl;
                var obj = this;

                img.onload = function ()
                {
                    obj.context.save();
                        RGraph.rotateCanvas(obj.canvas, obj.centerx, obj.centery, a);
                        obj.context.drawImage(
                            this,
                            obj.centerx + prop.needleImageOffsetx,
                            obj.centery + prop.needleImageOffsety
                        );
                    obj.context.restore();

                    RGraph.redraw();
                }

            } else if (this.__needle_image__) {

                this.context.save();
                    RGraph.rotateCanvas(this.canvas, this.centerx, this.centery, a);
                    this.context.drawImage(
                        this.__needle_image__,
                        this.centerx + prop.needleImageOffsetx,
                        this.centery + prop.needleImageOffsety
                    );
                this.context.restore();
            }


            // Allow customising the needle radius
            var needleRadius = typeof prop.needleRadius === 'number' ? prop.needleRadius : this.radius * 0.7;



            //
            // Draw a simple pointer as for the needle
            //
            if (prop.needleType === 'pointer') {

                // Draw the center circle (the stroke)
                var r = (this.radius * 0.06) > 40 ? 40 : (this.radius * 0.06);

                // Draw the black circle at the bottom of the needle
                this.context.beginPath();
                
                this.context.fillStyle = prop.needleColor;
                
                this.context.moveTo(this.centerx,this.centery);

                this.context.arc(
                    this.centerx,
                    this.centery,
                    r,
                    0,
                    RGraph.TWOPI,
                    false
                );
                
                this.context.fill();
                this.context.beginPath();
           
                // This moves the "pen" to the outer edge of the needle
                this.context.arc(
                    this.centerx,
                    this.centery,
                    r,
                    a + RGraph.HALFPI,
                    a + RGraph.HALFPI + 0.0001,
                    false
                );
 
                // Draw a line up to the tip of the needle
                this.context.arc(
                    this.centerx,
                    this.centery,
                    needleRadius,
                    a,
                    a + 0.001,
                    false
                );

                // Draw a line back down to the other side of the circle
                this.context.arc(
                    this.centerx,
                    this.centery,
                    r,
                    a - RGraph.HALFPI,
                    a - RGraph.HALFPI + 0.001,
                    false
                );

                
                this.context.fill();
                
                
            } else {

        
                // First draw the circle at the bottom
                this.context.fillStyle = 'black';
                this.context.lineWidth = this.radius >= 200 ? 7 : 3;
                this.context.lineCap = 'round';
        
                // Now, draw the arm of the needle
                this.context.beginPath();
                    this.context.strokeStyle = prop.needleColor;
                    if (typeof(prop.needleLinewidth) == 'number') this.context.lineWidth = prop.needleLinewidth;
    
        
                    this.context.arc(this.centerx, this.centery, needleRadius, a, a + 0.001, false);
                    this.context.lineTo(this.centerx, this.centery);
                this.context.stroke();
    
                // Draw the triangular needle head

                if (prop.needleHead) {
                    this.context.fillStyle = prop.needleColor;
                    this.context.beginPath();
                        this.context.lineWidth = 1;
                        //this.context.moveTo(this.centerx, this.centery);
                        this.context.arc(this.centerx, this.centery, needleRadius + 15, a, a + 0.001, 0);
                        this.context.arc(this.centerx, this.centery, needleRadius - prop.needleHeadLength + 15, a + prop.needleHeadWidth, a + prop.needleHeadWidth, 0);
                        this.context.arc(this.centerx, this.centery, needleRadius - prop.needleHeadLength + 15, a - prop.needleHeadWidth, a - prop.needleHeadWidth, 1);
                    this.context.fill();
                }
    
                // Draw the tail if requested
                if (prop.needleTail) {
                    this.context.beginPath();
                        this.context.strokeStyle = prop.needleColor;
                        if (typeof(prop.needleLinewidth) == 'number') this.context.lineWidth = prop.needleLinewidth;
    
                        var a = ((this.value - this.min) / (this.max - this.min) * (this.properties.anglesEnd - this.properties.anglesStart)) + this.properties.anglesStart + RGraph.PI;
                        this.context.arc(this.centerx, this.centery, 25, a, a + 0.001, false);
                        this.context.lineTo(this.centerx, this.centery);
                    this.context.stroke();
                }
    
                // Draw the center circle (the stroke)
                var r = (this.radius * 0.06) > 40 ? 40 : (this.radius * 0.06);
        
                this.context.beginPath();
                this.context.fillStyle = prop.centerpinStroke;
                this.context.arc(this.centerx, this.centery, r, 0 + 0.001, RGraph.TWOPI, 0);
                this.context.fill();
    
    
    
                // Draw the centre bit of the circle (the fill)
                this.context.fillStyle = prop.centerpinFill;
                this.context.beginPath();
                this.context.arc(this.centerx, this.centery, r - 2, 0 + 0.001, RGraph.TWOPI, 0);
                this.context.fill();
            }
        };








        //
        // Draws the labels
        //
        this.drawLabels = function ()
        {
            if (!prop.labels) {
                return;
            }

            var radius      = this.radius,
                text_italic = prop.textItalic,
                units_post  = prop.scaleUnitsPost,
                units_pre   = prop.scaleUnitsPre,
                point       = prop.scalePoint,
                thousand    = prop.scaleThousand,
                centerx     = this.centerx,
                centery     = this.centery,
                min         = this.min,
                max         = this.max,
                decimals    = prop.scaleDecimals,
                numLabels   = prop.labelsCount,
                offset      = prop.labelsRadiusOffset,
                specific    = prop.labelsSpecific;


            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'labels'
            });


            //
            // Draw the specific labels if they're specific
            //
            if (specific) {

                for (var i=0; i<specific.length; ++i) {

                    if (typeof specific[i] === 'string' || typeof specific[i] === 'number') {

                        var angle = this.getAngle(
                                (((this.max - this.min) / specific.length) / 2) + (((this.max - this.min) / specific.length) * i) + this.min
                            ),
                            angle_degrees = angle * (180 / RGraph.PI),
                            text          = specific[i].toString(),
                            coords        = RGraph.getRadiusEndPoint(
                                this.centerx,
                                this.centery,
                                angle,
                                (this.radius * 0.925) + offset
                            );

                    } else {

                        var angle         = this.getAngle(specific[i][1]),
                            angle_degrees = angle * (180 / RGraph.PI),
                            text          = specific[i][0].toString(),
                            coords        = RGraph.getRadiusEndPoint(
                                this.centerx,
                                this.centery,
                                angle,
                                (this.radius * 0.925) + offset
                            );
                    }

                    RGraph.text({
                    
                   object: this,

                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,

                        x:        coords[0],
                        y:        coords[1],
                        text:     text,
                        halign:   'center',
                        valign:   'center',
                        angle:    angle_degrees + 90,
                        bounding: false,
                        tag:      'labels-specific'
                    });
                }
            
                return;
            }




            this.context.fillStyle = prop.textColor;
            this.context.lineWidth = 1;
    
            this.context.beginPath();
    
            for (var i=0; i<=numLabels; ++i) {
            
                var angle  = ((prop.anglesEnd - prop.anglesStart) * (i / numLabels)) + prop.anglesStart;
                var coords = RGraph.getRadiusEndPoint(
                    centerx,
                    centery,
                    angle + (((i == 0 || i == numLabels) && prop.border) ? (i == 0 ? 0.05 : -0.05) : 0),
                    ((this.radius * 0.925) - (prop.textValign === 'bottom' ? 15 : 0) + prop.labelsRadiusOffset
                ));
                
                var angleStart = prop.anglesStart,
                    angleEnd   = prop.anglesEnd,
                    angleRange = angleEnd - angleStart,                
                    angleStart_degrees = angleStart * (180 / RGraph.PI),
                    angleEnd_degrees = angleEnd * (180 / RGraph.PI),
                    angleRange_degrees = angleRange * (180 / RGraph.PI)

                // Vertical alignment
                valign = prop.textValign;
    
                // Horizontal alignment
                if (prop.border) {
                    if (i == 0) {
                        halign = 'left';
                    } else if (i == numLabels) {
                        halign = 'right';
                    } else {
                        halign = 'center'
                    }
                } else {
                    halign = 'center';
                }

                var value = ((this.max - this.min) * (i / numLabels)) + this.min;
    
                RGraph.text({
                
                   object: this,

                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,

                    x:            coords[0],
                    y:            coords[1],
                    text:         RGraph.numberFormat({
                                      object:    this,
                                      number:    (value).toFixed(value === 0 ? 0 : decimals),
                                      unitspre:  units_pre,
                                      unitspost: units_post,
                                      point:     point,
                                      thousand:  thousand
                                  }),
                    halign:       halign,
                    valign:       valign,
                    angle:        ((angleRange_degrees * (1 / numLabels) * i) + angleStart_degrees) - 270,
                    bounding:     false,
                    boundingFill: (i == 0 || i == numLabels) ? 'white': null,
                    tag:          'scale'
                });
            }
        };








        //
        // This function draws the text readout if specified
        //
        this.drawReadout = function ()
        {
            if (prop.labelsValueText) {
                
                // The text label
                var text = (prop.labelsValueTextUnitsPre || '')
                            + (this.value).toFixed(prop.labelsValueTextDecimals)
                            + (prop.labelsValueTextUnitsPost || '');
                
                // Allow for a specific label
                if (typeof prop.labelsValueTextSpecific === 'string') {
                    text = prop.labelsValueTextSpecific;
                }

                var textConf = RGraph.getTextConf({
                    object: this,
                    prefix: 'labelsValueText'
                });

                RGraph.text({
                
               object: this,

                 font: textConf.font,
                 size: textConf.size,
                color: textConf.color,
                 bold: textConf.bold,
               italic: textConf.italic,

                    x:            this.centerx,
                    y:            this.centery - textConf.size - 15,
                    text:         text,
                    halign:       'center',
                    valign:       'bottom',
                    bounding:     prop.labelsValueTextBackground,
                    boundingFill: prop.labelsValueTextBackgroundFill,
                    boundingStroke: prop.labelsValueTextBackgroundStroke,
                    accessible:     prop.labelsValueTextAccessible,
                    tag:            'value.text'
                });
            }
        };








        //
        // A placeholder function
        // 
        // @param object The event object
        //
        this.getShape = function (e) {};








        //
        // This function returns the pertinent value for a particular click (or other mouse event)
        // 
        // @param obj e The event object
        //
        this.getValue = function (e)
        {
            var mouseXY = RGraph.getMouseXY(e);
            var angle   = RGraph.getAngleByXY(this.centerx, this.centery, mouseXY[0], mouseXY[1]);

            // Work out the radius
            var radius = RGraph.getHypLength(this.centerx, this.centery, mouseXY[0], mouseXY[1]);
            if (radius > this.radius) {
                return null;
            }
    
    
            if (angle < RGraph.HALFPI) {
                angle += RGraph.TWOPI;
            }

            var value = (((angle - prop.anglesStart) / (prop.anglesEnd - prop.anglesStart)) * (this.max - this.min)) + this.min;

            value = Math.max(value, this.min);
            value = Math.min(value, this.max);

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
    
            // Work out the radius
            var radius = RGraph.getHypLength(this.centerx, this.centery, mouseXY[0], mouseXY[1]);
    
            if (
                   mouseXY[0] > (this.centerx - this.radius)
                && mouseXY[0] < (this.centerx + this.radius)
                && mouseXY[1] > (this.centery - this.radius)
                && mouseXY[1] < (this.centery + this.radius)
                && radius <= this.radius
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
                this.value = this.getValue(e);
                RGraph.clear(this.canvas);
                RGraph.redrawCanvas(this.canvas);
                RGraph.fireCustomEvent(this, 'onadjust');
            }
        };








        //
        // This method returns the appropriate angle for a value
        // 
        // @param number value The value
        //
        this.getAngle = function (value)
        {
            // Higher than max
            if (value > this.max || value < this.min) {
                return null;
            }
    
            var angle = (((value - this.min) / (this.max - this.min)) * (prop.anglesEnd - prop.anglesStart)) + prop.anglesStart;
    
            return angle;
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors.colorsGreenColor  = RGraph.arrayClone(prop.colorsGreenColor);
                this.original_colors.colorsYellowColor = RGraph.arrayClone(prop.colorsYellowColor);
                this.original_colors.colorsRedColor    = RGraph.arrayClone(prop.colorsRedColor);
                this.original_colorsColorsRanges       = RGraph.arrayClone(prop.colorsRanges);
            }

            // Parse the basic colors
            prop.colorsGreenColor  = this.parseSingleColorForGradient(prop.colorsGreenColor);
            prop.colorsYellowColor = this.parseSingleColorForGradient(prop.colorsYellowColor);
            prop.colorsRedColor    = this.parseSingleColorForGradient(prop.colorsRedColor);
    
            // Parse colorsRanges
            var ranges = prop.colorsRanges;

            if (ranges && ranges.length) {
                for (var i=0; i<ranges.length; ++i) {
                    ranges[i][2] = this.parseSingleColorForGradient(ranges[i][2]);
                }
            }
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
                    return RGraph.parseJSONGradient({
                        object: this,
                        def:    RegExp.$1,radial:true
                    });
                }

                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = this.context.createRadialGradient(this.centerx, this.centery, prop.segmentsRadiusStart, this.centerx, this.centery, this.radius * 0.85);
    
                var diff = 1 / (parts.length - 1);
    
                for (var j=0; j<parts.length; ++j) {
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
        // Meter Grow
        // 
        // This effect gradually increases the represented value
        // 
        // @param              An object of options - eg: {frames: 60}
        // @param function     An optional callback function
        //
        this.grow = function ()
        {
            var obj = this;

            obj.currentValue = obj.currentValue || obj.min;

            var opt      = arguments[0] || {};
            var frames   = opt.frames || 30;
            var frame    = 0;
            var diff     = obj.value - obj.currentValue;
            var step     = diff / frames;
            var callback = arguments[1] || function () {};
            var initial  = obj.currentValue;



            function iterator ()
            {
                obj.value = initial + (frame++ * step);
    
                RGraph.clear(obj.canvas);
                RGraph.redrawCanvas(obj.canvas);
            
                if (frame <= frames) {
                    RGraph.Effects.updateCanvas(iterator);
                } else {
                    callback(obj);
                }
            }
            
            iterator();
            
            return this;
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
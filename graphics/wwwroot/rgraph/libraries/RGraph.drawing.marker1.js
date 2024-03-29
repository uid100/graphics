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
    RGraph.Drawing.Marker1 = function (conf)
    {
        var id                        = conf.id,
            canvas                    = document.getElementById(id),
            x                         = conf.x,
            y                         = conf.y,
            radius                    = conf.radius,
            text                      = conf.text;

        // id, x, y, radius, text)
        this.id                = id;
        this.canvas            = canvas;
        this.context           = this.canvas.getContext("2d");
        this.colorsParsed      = false;
        this.canvas.__object__ = this;
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false


        //
        // Store the properties
        //
        this.centerx = x;
        this.centery = y;
        this.radius  = radius;
        this.text    = text;


        //
        // This defines the type of this shape
        //
        this.type = 'drawing.marker1';


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
            colorsStroke:       'black',
            colorsFill:         'white',
            
            linewidth:          2,
            
            textColor:          'black',
            textSize:           12,
            textFont:           'Arial, Verdana, sans-serif',
            textBold:           false,
            textItalic:         false,
            textAccessible:     true,
            textAccessibleOverflow:      'visible',
            textAccessiblePointerevents: false,

            eventsClick:        null,
            eventsMousemove:    null,
            
            shadow:             true,
            shadowColor:        '#aaa',
            shadowOffsetx:      0,
            shadowOffsety:      0,
            shadowBlur:         15,
            
            highlightStroke:    'rgba(0,0,0,0)',
            highlightFill:      'rgba(255,0,0,0.7)',
            
            tooltips:           null,
            tooltipsHighlight:  true,
            tooltipsEvent:      'onclick',
            
            align:              'center',
            
            clearto:            'rgba(0,0,0,0)'
        }

        //
        // A simple check that the browser has canvas support
        //
        if (!this.canvas) {
            alert('[DRAWING.MARKER1] No canvas support');
            return;
        }


        //
        // Create the dollar object so that functions can be added to them
        //
        this.$0 = {};


        //
        // Arrays that store the coordinates
        //
        this.coords = [];
        this.coordsText = [];



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
        // Draws the circle
        //
        this.draw = function ()
        {
            //
            // Fire the onbeforedraw event
            //
            RGraph.fireCustomEvent(this, 'onbeforedraw');
            
            var r = this.radius;
    
            if (prop.align == 'left') {
    
                this.markerCenterx = this.centerx - r - r - 3;
                this.markerCentery = this.centery - r - r - 3;
            
            } else if (prop.align == 'right') {
                
                this.markerCenterx = this.centerx + r + r + 3;
                this.markerCentery = this.centery - r - r - 3;
    
            } else {
    
                this.markerCenterx = this.centerx;
                this.markerCentery = this.centery - r - r - 3;
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
            // Stop this growing uncontrollably
            //
            this.coordsText = [];




            //
            // DRAW THE MARKER HERE
            //
            path(this.context, ['b','lw',prop.linewidth]);

            if (prop.shadow) {
                RGraph.setShadow(
                    this,
                    prop.shadowColor,
                    prop.shadowOffsetx,
                    prop.shadowOffsety,
                    prop.shadowBlur
                );
            }
            this.drawMarker();
            
            path(this.context, ['c','s',prop.colorsStroke,'f',prop.colorsFill]);




            // Turn the shadow off
            RGraph.noShadow(this);



            // Get the text configuration
            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'text'
            });

            // Now draw the text on the marker
            this.context.fillStyle = prop.textColor;
            
            // Draw the text on the marker
            RGraph.text({
            
                object: this,

                font:   textConf.font,
                size:   textConf.size,
                color:  textConf.color,
                bold:   textConf.bold,
                italic: textConf.italic,

                x:      this.coords[0][0] - 1,
                y:      this.coords[0][1] - 1,
                text:   this.text,
                valign: 'center',
                halign: 'center',
                tag:    'labels'
            });
    
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
        // Not used by the class during creating the shape, but is used by event handlers
        // to get the coordinates (if any) of the selected bar
        // 
        // @param object e The event object
        // @param object   OPTIONAL You can pass in the bar object instead of the
        //                          function using "this"
        //
        this.getShape = function (e)
        {
            var mouseXY = RGraph.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1];
    
            //
            // Path the marker but DON'T STROKE OR FILL it
            //
            this.context.beginPath();
            this.drawMarker();
    
            if (this.context.isPointInPath(mouseXY[0], mouseXY[1])) {
    
                return {
                    0: this, 1: this.coords[0][0], 2: this.coords[0][1], 3: this.coords[0][2], 4: 0,
                    object: this, x: this.coords[0][0], y: this.coords[0][1], radius: this.coords[0][2], index: 0, tooltip: prop.tooltips ? prop.tooltips[0] : null
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
            if (prop.tooltipsHighlight) {
                if (typeof prop.highlightStyle === 'function') {
                    (prop.highlightStyle)(shape);
                } else {
                    
                    this.context.beginPath(); 
                    this.context.strokeStyle = prop.highlightStroke;
                    this.context.fillStyle   = prop.highlightFill;
                    this.drawMarker();
                    this.context.closePath();
                    this.context.stroke();
                    this.context.fill();
                }
            }
        };








        //
        // This function is used to encapsulate the actual drawing of the marker. It
        // intentional does not start a path or set colors.
        //
        this.drawMarker = function ()
        {
            var r = this.radius;
            
            if (prop.align === 'left') {
    
                var x = this.markerCenterx,
                    y = this.markerCentery;
        
                path(this.context, ['a',x,y,r,RGraph.HALFPI,RGraph.TWOPI,false]);
                
                path(this.context, ['qc',x + r,y + r,x + r + r,y + r + r]);
                path(this.context, ['qc',x + r,y + r,x,y + r]);

            } else if (prop.align === 'right') {
    
                var x = this.markerCenterx,
                    y = this.markerCentery;

                path(this.context, ['a',x,y,r,RGraph.HALFPI,RGraph.PI,true]);
    
               // special case for MSIE 7/8
                path(this.context, ['qc',x - r,y + r,x - r - r,y + r + r]);
                path(this.context, ['qc',x - r, y + r, x, y + r]);
    
            // Default is center
            } else {
    
                var x = this.markerCenterx,
                    y = this.markerCentery;
    
                path(this.context, ['a',x, y, r, RGraph.HALFPI / 2, RGraph.PI - (RGraph.HALFPI / 2), true]);
                
                // special case for MSIE 7/8
                path(this.context, ['qc',x,y + r + (r / 4),x,y + r + r - 2]);
                path(this.context, ['qc',x,y + r + (r / 4),x + (Math.cos(RGraph.HALFPI / 2) * r),y + (Math.sin(RGraph.HALFPI / 2) * r)]);
            }

            this.coords[0] = [x, y, r];
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors.colorsFill      = RGraph.arrayClone(prop.colorsFill);
                this.original_colors.colorsStroke    = RGraph.arrayClone(prop.colorsStroke);
                this.original_colors.highlightFill   = RGraph.arrayClone(prop.highlightFill);
                this.original_colors.highlightStroke = RGraph.arrayClone(prop.highlightStroke);
                this.original_colors.textColor       = RGraph.arrayClone(prop.textColor);
            }

            //
            // Parse various properties for colors
            //
            prop.colorsFill      = this.parseSingleColorForGradient(prop.colorsFill);
            prop.colorsStroke    = this.parseSingleColorForGradient(prop.colorsStroke);
            prop.highlightStroke = this.parseSingleColorForGradient(prop.highlightStroke);
            prop.highlightFill   = this.parseSingleColorForGradient(prop.highlightFill);
            prop.textColor       = this.parseSingleColorForGradient(prop.textColor);
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

                // Create the gradient
                var parts = RegExp.$1.split(':'),
                    grad = this.context.createRadialGradient(this.markerCenterx, this.markerCentery, 0, this.markerCenterx, this.markerCentery, this.radius),
                    diff = 1 / (parts.length - 1);
    
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
        // Objects are now always registered so that the chart is redrawn if need be.
        //
        RGraph.register(this);








        //
        // This is the 'end' of the constructor so if the first argument
        // contains configuration data - handle that.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);
    };
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
    RGraph.Drawing.Image = function (conf)
    {
        var id     = conf.id,
            canvas = document.getElementById(id),
            x      = conf.x,
            y      = conf.y,
            src    = conf.src;

        // id, x, y
        this.id                 = id;
        this.canvas             = document.getElementById(this.id);
        this.context            = this.canvas.getContext('2d');
        this.colorsParsed       = false;
        this.canvas.__object__  = this;
        this.alignmentProcessed = false;
        this.original_colors    = [];
        this.firstDraw         = true; // After the first draw this will be false

        //
        // Store the properties
        //
        this.x   = x;
        this.y   = y;
        this.src = src;
        this.img = new Image();
        this.img.src = this.src;


        //
        // This defines the type of this shape
        //
        this.type = 'drawing.image';


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
            src:              null,

            width:            null,
            height:           null,

            halign:           'left',
            valign:           'top',

            eventsMousemove: null,
            eventsClick:     null,

            shadow:           false,
            shadowColor:     'gray',
            shadowOffsetx:   3,
            shadowOffsety:   3,
            shadowBlur:      5,

            tooltips:           null,
            tooltipsHighlight: true,
            tooltipsCssClass: 'RGraph_tooltip',
            tooltipsEvent:     'onclick',

            highlightStroke:     'rgba(0,0,0,0)',
            highlightFill:       'rgba(255,255,255,0.7)',

            colorsAlpha:         1,

            border:               false,
            borderColor:         'black',
            borderLinewidth:     1,
            borderRadius:        0,

            backgroundColor:     'rgba(0,0,0,0)',

            clearto:   'rgba(0,0,0,0)'
        }

        //
        // A simple check that the browser has canvas support
        //
        if (!this.canvas) {
            alert('[DRAWING.IMAGE] No canvas support');
            return;
        }
        
        //
        // This can be used to store the coordinates of shapes on the graph
        //
        this.coords = [];


        //
        // Create the dollar object so that functions can be added to them
        //
        this.$0 = {};


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
        // @param name  string The name of the property to set OR it can be a map
        //                     of name/value settings like what you set in the constructor
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
    

            //
            // Parse the colors. This allows for simple gradient syntax
            //
            var obj = this;
            this.img.onload = function ()
            {
                if (!obj.colorsParsed) {
    
                    obj.parseColors();
        
                    // Don't want to do this again
                    obj.colorsParsed = true;
                }
                
                obj.width  = this.width;
                obj.height = this.height;

    
    
    
    
    
    
                if (!obj.alignmentProcessed) {
                
                    var customWidthHeight = (typeof obj.properties.width == 'number' && typeof obj.properties.width == 'number');

                    // Horizontal alignment
                    if (obj.properties.halign === 'center') {
                        obj.x -= customWidthHeight ? (obj.properties.width / 2) : (this.width / 2);
                    } else if (obj.properties.halign == 'right') {
                        obj.x -= customWidthHeight ? obj.properties.width : this.width;
                    }
                    
                    // Vertical alignment
                    if (obj.properties.valign === 'center') {
                        obj.y -= customWidthHeight ? (obj.properties.height / 2) : (this.height / 2);
                    } else if (obj.properties.valign == 'bottom') {
                        obj.y -= customWidthHeight ? obj.properties.height : this.height;
                    }
                    
                    // Don't do this again
                    obj.alignmentProcessed = true;
                }
            }
    
    
    
    
    
    
    
            
            // The onload event doesn't always fire - so call it manually as well
            if (this.img.complete || this.img.readyState === 4) {
                this.img.onload();
            }
    
    
            //
            // Draw the image here
            //
            
            if (prop.shadow) {
                RGraph.setShadow(
                    this,
                    prop.shadowColor,
                    prop.shadowOffsetx,
                    prop.shadowOffsety,
                    prop.shadowBlur
                );
            }

            var oldAlpha = this.context.globalAlpha;
            this.context.globalAlpha = prop.colorsAlpha;





                //
                // Draw a border around the image
                //
                if (prop.border) {
                    
                    this.context.strokeStyle = prop.borderColor;
                    this.context.lineWidth   = prop.borderLinewidth;
                    
                    var borderRadius = 0;
                    
                    // Work out the borderRadius only if the image has been loaded
                    if (this.width || this.height) {
                        borderRadius = Math.min(this.width / 2, this.height / 2)
                    }
                    
                    if ((prop.width / 2) > borderRadius && (prop.height / 2) > borderRadius) {
                        borderRadius = Math.min((prop.width / 2), (prop.height / 2))
                    }
                    
                    if (prop.borderRadius < borderRadius) {
                        borderRadius = prop.borderRadius;
                    }
                
                
                
                
                    this.context.beginPath();
                    this.roundedRect(
                        Math.round(this.x) - Math.round(this.context.lineWidth / 2),
                        Math.round(this.y) - Math.round(this.context.lineWidth / 2),
                        (prop.width || this.img.width) + this.context.lineWidth,
                        (prop.height || this.img.height) + this.context.lineWidth,
                        borderRadius
                    );
                }
                
                
                
                if (borderRadius) {
                    this.context.save();

                    // Draw the rect that casts the shadow

                    // Draw the background color
                    this.drawBackgroundColor(borderRadius);



                    // Clip the canvas
                    this.context.beginPath();
                    this.roundedRect(
                        Math.round(this.x) - Math.round(this.context.lineWidth / 2),
                        Math.round(this.y) - Math.round(this.context.lineWidth / 2),
                        (prop.width || this.img.width) + this.context.lineWidth,
                        (prop.height || this.img.height) + this.context.lineWidth,
                        borderRadius
                    );
                    this.context.clip();
                
                } else {
                
                    // Draw the background color
                    this.drawBackgroundColor(0);
                }


                if (typeof prop.height === 'number' || typeof prop.width === 'number') {
                    this.context.drawImage(
                        this.img,
                        Math.round(this.x),
                        Math.round(this.y),
                        prop.width || this.width,
                        prop.height || this.height
                    );
                } else {
                    this.context.drawImage(
                        this.img,
                        Math.round(this.x),
                        Math.round(this.y)
                    );
                }




                // If borderRadius is enabled restore the canvas to it's pre-clipped state
                if (borderRadius) {
                    this.context.restore();
                }
                
                RGraph.noShadow(this);
                
                
        
                // If the border is enabled need a stroke so that the border is drawn
                if (prop.border) {
                    this.context.stroke();
                }





            this.context.globalAlpha = oldAlpha;
    
            var obj    = this;    
            this.img.onload = function ()
            {
                RGraph.redrawCanvas(obj.canvas);
                
                obj.coords[0] = [
                    Math.round(obj.x),
                    Math.round(obj.y),
                    typeof prop.width === 'number' ? prop.width : this.width, typeof prop.height == 'number' ? prop.height : this.height
                ];
            }
            
            RGraph.noShadow(this);
    
    
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
            var mouseXY = RGraph.getMouseXY(e);
    
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
    
            if (   this.coords
                && this.coords[0]
                && mouseXY[0] >= this.coords[0][0]
                && mouseXY[0] <= (this.coords[0][0] + this.coords[0][2])
                && mouseXY[1] >= this.coords[0][1]
                && mouseXY[1] <= (this.coords[0][1] + this.coords[0][3])) {
                
                return {
                    0: this, 1: this.coords[0][0], 2: this.coords[0][1], 3: this.coords[0][2], 4: this.coords[0][3], 5: 0,
                    'object': this, 'x': this.coords[0][0], 'y': this.coords[0][1], 'width': this.coords[0][2], 'height': this.coords[0][3], 'index': 0, 'tooltip': prop.tooltips ? prop.tooltips[0] : null
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
                    path({
                        object: this,
                        path:   'b r % % % % f % s %',
                        args: [
                            this.coords[0][0],this.coords[0][1],this.coords[0][2],this.coords[0][3],
                            prop.highlightFill,
                            prop.highlightStroke
                        ]
                    });
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
                this.original_colors.colorsBackground = RGraph.arrayClone(prop.colorsBackground);
                this.original_colors.highlightStroke  = RGraph.arrayClone(prop.highlightStroke);
                this.original_colors.highlightFill    = RGraph.arrayClone(prop.highlightFill);
            }




            //
            // Parse various properties for colors
            //
            prop.colorsBackground = this.parseSingleColorForGradient(prop.colorsBackground);
            prop.highlightStroke  = this.parseSingleColorForGradient(prop.highlightStroke);
            prop.highlightFill    = this.parseSingleColorForGradient(prop.highlightFill);
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
            if (!color) {
                return color;
            }
    

            if (typeof color === 'string' && color.match(/^gradient\((.*)\)$/i)) {

                // Allow for JSON gradients
                if (color.match(/^gradient\(({.*})\)$/i)) {
                    return RGraph.parseJSONGradient({object: this, def: RegExp.$1});
                }

                var parts = RegExp.$1.split(':'),
                    grad  = this.context.createLinearGradient(this.x, this.y, this.x + this.img.width, this.y),
                    diff  = 1 / (parts.length - 1);

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
        // This draws a rectangle for the border of the image with optional rounded corners
        //
        this.roundedRect = function (x, y, width, height, radius)
        {
            // Save the existing state of the canvas so that it can be restored later
            this.context.save();
            
                // Translate to the given X/Y coordinates
                this.context.translate(x, y);
    
                // Move to the center of the top horizontal line
                this.context.moveTo(width / 2,0);
                
                // Draw the rounded corners. The connecting lines in between them are drawn automatically
                this.context.arcTo(width,0,width,height, Math.min(height / 2, radius));
                this.context.arcTo(width, height, 0, height, Math.min(width / 2, radius));
                this.context.arcTo(0, height, 0, 0, Math.min(height / 2, radius));
                this.context.arcTo(0, 0, radius, 0, Math.min(width / 2, radius));
    
                // Draw a line back to the start coordinates
                this.context.lineTo(width / 2,0);
    
            // Restore the state of the canvas to as it was before the save()
            this.context.restore();
        };








        //
        // 
        //
        this.drawBackgroundColor = function (borderRadius)
        {
            this.context.beginPath();
            this.context.fillStyle = prop.backgroundColor;
            this.roundedRect(
                Math.round(this.x) - Math.round(this.context.lineWidth / 2),
                Math.round(this.y) - Math.round(this.context.lineWidth / 2),
                (prop.width || this.img.width) + this.context.lineWidth,
                (prop.height || this.img.height) + this.context.lineWidth,
                borderRadius
            );
            this.context.fill();
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
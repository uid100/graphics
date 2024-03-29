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
    RGraph.Drawing.Marker3 = function (conf)
    {
        var id     = conf.id,
            canvas = document.getElementById(id),
            x      = conf.x,
            y      = conf.y,
            radius = conf.radius;

        this.id                = id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext('2d')
        this.colorsParsed      = false;
        this.canvas.__object__ = this;
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false

        
        // The actual radius is what is used to draw the marker - the other radius is the maximum target radius
        // that the marker grows to
        this.actualRadius = 0;
        
        // This is the alpha value that is used to fade out the pulsing marker
        this.alpha = 1;


        //
        // Store the properties
        //
        this.centerx = x;
        this.centery = y;
        this.radius  = radius;


        //
        // This defines the type of this shape
        //
        this.type = 'drawing.marker3';


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
            colorsFill:                  'white',

            delay:                       50,

            eventsClick:                 null,
            eventsMousemove:             null,

            highlightFill:               'rgba(255,0,0,1.0)',

            tooltips:                    null,
            tooltipsHighlight:           true,
            tooltipsEvent:               'onclick',

            textAccessible:              true,
            textAccessibleOverflow:      'visible',
            textAccessiblePointerevents: false,

            clearto:                     'rgba(0,0,0,0)'
        }

        //
        // A simple check that the browser has canvas support
        //
        if (!this.canvas) {
            alert('[DRAWING.MARKER3] No canvas support');
            return;
        }
        
        //
        // These are used to store coords
        //
        this.coords     = [];
        this.coordsText = [];


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
        // Draws the marker
        //
        this.draw = function ()
        {
            // Draw a circle to start with
            this.context.globalAlpha = this.alpha;
            path({
                context: this.context,
                path: 'b a % % % % % % a % % % % % % f %',
                args: [
                    this.centerx, this.centery, this.actualRadius, 0, 2 * Math.PI,false,
                    this.centerx, this.centery, Math.max(this.actualRadius - 8, 0), 2 * Math.PI,0, true,
                    prop.colorsFill
                ]
            });
            
            this.alpha     = this.actualRadius ? 1 - ( (this.actualRadius * 0.75) / this.radius) : 1;
            this.context.globalAlpha = 1;
            
            
            if (this.actualRadius < this.radius) {
                this.actualRadius += 2;
            } else if (this.actualRadius >= this.radius) {
                this.actualRadius = 0;
                this.alpha = 1;
            }

            if (!this.TIMER) {

                var obj = this;
                
                setInterval(function ()
                {
                    RGraph.redrawCanvas(obj.canvas);
                }, prop.delay);
                
                this.TIMER = true;
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
        //
        this.getShape = function (e)
        {
            var mouseXY = RGraph.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1];
    
            if (RGraph.getHypLength(this.centerx, this.centery, mouseXY[0], mouseXY[1]) <= this.radius) {
                return {
                    0: this, 1: this.centerx, 2: this.centery, 3: this.radius, 4: null, 5: 0,
                    'object': this, 'x': this.centerx, 'y': this.centery, 'radius': this.radius, 'index': 0, 'tooltip': prop.tooltips ? prop.tooltips[0] : null
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
                    path(this.context, ['b','r',this.coords[0][0],this.coords[0][1],this.coords[0][2],this.coords[0][3],'f',prop.highlightFill,'s',prop.highlightStroke]);
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
                this.original_colors.colorsFill      = RGraph.arrayClone(prop.colorsFill);
                this.original_colors.highlightFill   = RGraph.arrayClone(prop.highlightFill);
            }


            //
            // Parse various properties for colors
            //
            prop.colorsFill    = this.parseSingleColorForGradient(prop.colorsFill);
            prop.highlightFill = this.parseSingleColorForGradient(prop.highlightFill);
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

                // Create the gradient
                var parts = RegExp.$1.split(':'),
                    grad  = this.context.createRadialGradient(this.centerx, this.centery, 0, this.centerx, this.centery, this.radius),
                    diff  = 1 / (parts.length - 1);
    
                //grad.addColorStop(0, RGraph.trim(parts[0]));
    
                for (var j=0; j<parts.length; j+=1) {
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
        // the number of arguments is only one and it's an
        // object - parse it for configuration data and return.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);
    };
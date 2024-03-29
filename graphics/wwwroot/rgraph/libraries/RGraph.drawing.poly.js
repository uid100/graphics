// version: 2019-09-08
    // o--------------------------------------------------------------------------------o
    // | This file is part of the RGraph package - you can learn more at:               |
    // |                                                                                |
    // |                         https://www.rgraph.net                                 |
    // |                                                                                |
    // | RGraph is licensed under the Open Source MIT license. That means that it's     |
    // | totally free to use and there are no restrictions on what you can do with it!  |
    // o--------------------------------------------------------------------------------o

    
    ///**
    //* Having this here means that the RGraph libraries can be included in any order, instead of you having
    //* to include the common core library first.
    //*/

    // Define the RGraph global variable
    RGraph = window.RGraph || {isRGraph: true};
    RGraph.Drawing = RGraph.Drawing || {};

    ///**
    //* The constructor. This function sets up the object.
    //*/
    RGraph.Drawing.Poly = function (conf)
    {
        var id                        = conf.id,
            coords                    = conf.coords;

        this.id                = id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext('2d');
        this.colorsParsed      = false;
        this.canvas.__object__ = this;
        this.coords            = coords;
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false

        ///**
        //* This defines the type of this shape
        //*/
        this.type = 'drawing.poly';


        ///**
        //* This facilitates easy object identification, and should always be true
        //*/
        this.isRGraph = true;


        ///**
        //* This adds a uid to the object that you can use for identification purposes
        //*/
        this.uid = RGraph.createUID();


        ///**
        //* This adds a UID to the canvas for identification purposes
        //*/
        this.canvas.uid = this.canvas.uid ? this.canvas.uid : RGraph.createUID();




        ///**
        //* Some example background properties
        //*/
        this.properties =
        {
            linewidth:               1,

            colorsStroke:            'black',
            colorsFill:              'red',

            eventsClick:             null,
            eventsMousemove:         null,

            tooltips:                null,
            tooltipsOverride:        null,
            tooltipsEffect:          'fade',
            tooltipsCssClass:        'RGraph_tooltip',
            tooltipsEvent:           'onclick',
            tooltipsHighlight:       true,

            highlightStroke:        'rgba(0,0,0,0)',
            highlightFill:          'rgba(255,255,255,0.7)',

            shadow:                  false,
            shadowColor:             'rgba(0,0,0,0.2)',
            shadowOffsetx:           3,
            shadowOffsety:           3,
            shadowBlur:              5,

            clearto:                 'rgba(0,0,0,0)'
        }

        ///**
        //* A simple check that the browser has canvas support
        //*/
        if (!this.canvas) {
            alert('[DRAWING.POLY] No canvas support');
            return;
        }
        
        ///**
        //* Create the dollar object so that functions can be added to them
        //*/
        this.$0 = {};


        ///**
        //* Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        //* done already
        //*/
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            this.canvas.__rgraph_aa_translated__ = true;
        }




        // Short variable names
        var prop = this.properties,
            path = RGraph.path;
        
        
        
        //**
        //* "Decorate" the object with the generic effects if the effects library has been included
        //*/
        if (RGraph.Effects && typeof RGraph.Effects.decorate === 'function') {
            RGraph.Effects.decorate(this);
        }








        //
        // A setter method for setting properties.
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
        // Draws the shape
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
            // Stop this growing uncontrollably
            //
            this.coordsText = [];




    
            //
            // DRAW THE SHAPE HERE
            //

            if (prop.shadow) {
                this.context.shadowColor   = prop.shadowColor;
                this.context.shadowOffsetX = prop.shadowOffsetx;
                this.context.shadowOffsetY = prop.shadowOffsety;
                this.context.shadowBlur    = prop.shadowBlur;
            }

            this.context.strokeStyle = prop.colorsStroke;
            this.context.fillStyle   = prop.colorsFill;

            this.drawPoly();
            
            this.context.lineWidth = prop.linewidth;
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
            if (this.getShape(e)) {
                return this;
            }
        };








        //
        // Draw the Poly but doesn't stroke or fill - that's left to other functions
        //
        this.drawPoly = function ()
        {
            var coords = this.coords;
            
            path(this.context, ['b','m',coords[0][0], coords[0][1]]);

            // Draw lines to subsequent coords
            for (var i=1,len=coords.length; i<len; ++i) {
                this.context.lineTo(coords[i][0],coords[i][1]);
            }

            // Close the path and stroke/fill it with whatever the current fill/stroke styles are
            path(this.context, ['lw', prop.linewidth, 'c','f',this.context.fillStyle, 's',this.context.strokeStyle]);
        };




        //
        // Not used by the class during creating the graph, but is used by event handlers
        // to get the coordinates (if any) of the selected bar
        // 
        // @param object e The event object
        //
        this.getShape = function (e)
        {
            var coords  = this.coords,
                mouseXY = RGraph.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1];
    
            // Should redraw the poly but not stroke or fill it and then use isPointInPath() to test it
            // DON'T USE PATH OBJECT HERE
            
            // Need to save these so that they can be reset
            var old_strokestyle = this.context.strokeStyle,
                old_fillstyle   = this.context.fillStyle;
            
            this.context.beginPath();
                this.context.strokeStyle = 'rgba(0,0,0,0)';
                this.context.fillStyle = 'rgba(0,0,0,0)';
            this.drawPoly();
            
            // Reset the colors
            this.context.strokeStyle = old_strokestyle;
            this.context.fillStyle   = old_fillstyle;

    
            if (this.context.isPointInPath(mouseX, mouseY)) {
                    
                return {
                    0: this, 1: this.coords, 2: 0,
                    'object': this, 'coords': this.coords, 'index': 0, 'tooltip': prop.tooltips ? prop.tooltips[0] : null
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
            // Evidentally this is necessary
            this.context.fillStyle = prop.colorsFill;

            // Close a path thats been left open.
            path(this.context,
                'c f % s %',
                prop.highlightFill,
                prop.highlightStroke
            );

            // Add the new highlight
            if (prop.tooltipsHighlight) {
                if (typeof prop.highlightStyle === 'function') {
                    (prop.highlightStyle)(shape);
                } else {
                    path(
                        this.context,
                        ['b', 'fu', function (obj){obj.drawPoly();},'f',prop.highlightFill,'s',prop.highlightStroke]
                    );
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
                this.original_colors.colorsStroke    = RGraph.arrayClone(prop.colorsStroke);
                this.original_colors.highlightStroke = RGraph.arrayClone(prop.highlightStroke);
                this.original_colors.highlightFill   = RGraph.arrayClone(prop.highlightFill);
            }

            var func = this.parseSingleColorForGradient;
    
            //
            // Parse various properties for colors
            //
            prop.colorsFill      = func(prop.colorsFill);
            prop.colorsStroke    = func(prop.colorsStroke);
            prop.highlightStroke = func(prop.highlightStroke);
            prop.highlightFill   = func(prop.highlightFill);
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
                    grad  = this.context.createLinearGradient(0,0,this.canvas.width,0),
                    diff  = 1 / (parts.length - 1);
    
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
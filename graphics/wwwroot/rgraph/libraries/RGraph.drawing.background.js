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
    RGraph.Drawing.Background = function (conf)
    {
        var id                        = conf.id,
            canvas                    = document.getElementById(id);

        this.id                = id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false

        //
        // This defines the type of this shape
        //
        this.type = 'drawing.background';

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
            backgroundBarsCount:       null,
            backgroundBarsColor1:      'rgba(0,0,0,0)',
            backgroundBarsColor2:      'rgba(0,0,0,0)',
            backgroundGrid:            true,
            backgroundGridColor:       '#ddd',
            backgroundGridLinewidth:   1,
            backgroundGridVlines:      true,
            backgroundGridHlines:      true,
            backgroundGridBorder:      true,
            backgroundGridAutofit:     true,
            backgroundGridHlinesCount: 5,
            backgroundGridVlinesCount: 20,
            backgroundGridDashed:      false,
            backgroundGridDotted:      false,
            backgroundImage :          null,
            backgroundImageStretch:    true,
            backgroundImageX:          null,
            backgroundImageY:          null,
            backgroundImageW:          null,
            backgroundImageH:          null,
            backgroundImageAlign:      null,
            backgroundColor:           null,

            marginLeft:                25,
            marginRight:               25,
            marginTop:                 25,
            marginBottom:              30,

            textColor:                   'black', // Gradients aren't supported for this color
            textSize:                    12,
            textFont:                    'Arial, Verdana, sans-serif',
            textBold:                    false,
            textItalic:                  false,
            textAccessible:              true,
            textAccessibleOverflow:      'visible',
            textAccessiblePointerevents: false,

            eventsClick:       null,
            eventsMousemove:   null,

            tooltips:           null,
            tooltipsHighlight: true,
            tooltipsEvent:     'onclick',

            highlightStroke:   'rgba(0,0,0,0)',
            highlightFill:     'rgba(255,255,255,0.7)',

            linewidth:          1,

            title:           '',
            titleBackground: null, // Gradients aren't supported for this color
            titleHpos:       null,
            titleVpos:       null,
            titleFont:       null,
            titleSize:       null,
            titleColor:      null,
            titleBold:       null,
            titleItalic:     null,
            titleX:          null,
            titleY:          null,
            titleHalign:     null,
            titleValign:     null,
            
            xaxisTitle:      '',
            xaxisTitleBold:   null,
            xaxisTitleItalic: null,
            xaxisTitleSize:   null,
            xaxisTitleFont:   null,
            xaxisTitleColor:  null,
            xaxisTitleX:      null,
            xaxisTitleY:      null,
            xaxisTitlePos:    null,
            
            yaxisTitle:       '',
            yaxisTitleBold:   null,
            yaxisTitleSize:   null,
            yaxisTitleFont:   null,
            yaxisTitleColor:  null,
            yaxisTitleItalic: null,
            yaxisTitleX:      null,
            yaxisTitleY:      null,
            yaxisTitlePos:    null,

            clearto:          'rgba(0,0,0,0)'
        }





        //
        // A simple check that the browser has canvas support
        //
        if (!this.canvas) {
            alert('[DRAWING.BACKGROUND] No canvas support');
            return;
        }



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
            // DRAW BACKGROUND HERE *
            //
            this.marginLeft   = prop.marginLeft;
            this.marginRight  = prop.marginRight;
            this.marginTop    = prop.marginTop;
            this.marginBottom = prop.marginBottom;
    
    
            //
            // Parse the colors. This allows for simple gradient syntax
            //
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }

            //
            // Set the shadow
            //
            RGraph.drawBackgroundImage(this);
            RGraph.Background.draw(this);

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

            if (
                   mouseX >= this.marginLeft
                && mouseX <= (this.canvas.width - this.marginRight)
                && mouseY >= this.marginTop
                && mouseY <= (this.canvas.height - this.marginBottom)
               ) {

                var tooltip = prop.tooltips ? prop.tooltips[0] : null
                
                return {
                    0: this, 1: 0 /* the index */, 2: tooltip,
                    object: this,index: 0, tooltip: tooltip
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
                    path(this.context,
                        'b r % % % % f % s %',
                        prop.marginLeft,
                        prop.marginTop,
                        this.canvas.width - prop.marginLeft - prop.marginRight,
                        this.canvas.height - prop.marginTop - prop.marginBottom,
                        prop.highlightFill,
                        prop.highlightStroke
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
                this.original_colors.backgroundColor     = RGraph.arrayClone(prop.backgroundColor);
                this.original_colors.backgroundGridColor = RGraph.arrayClone(prop.backgroundGridColor);
                this.original_colors.highlightStroke     = RGraph.arrayClone(prop.highlightStroke);
                this.original_colors.highlightFill       = RGraph.arrayClone(prop.highlightFill);
            }





            //
            // Parse various properties for colors
            //
            prop.backgroundColor     = this.parseSingleColorForGradient(prop.backgroundColor);
            prop.backgroundGridColor = this.parseSingleColorForGradient(prop.backgroundGridColor);
            prop.highlightStroke     = this.parseSingleColorForGradient(prop.highlightStroke);
            prop.highlightFill       = this.parseSingleColorForGradient(prop.highlightFill);
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

                // Split and create the gradient
                var parts = RegExp.$1.split(':'),
                    grad = this.context.createLinearGradient(
                        this.marginLeft,
                        this.marginTop,
                        this.canvas.width - this.marginRight,
                        this.canvas.height - this.marginBottom
                    ),
                    diff = 1 / (parts.length - 1);
    
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
        // This is the 'end' of the constructor so if the first argument
        // contains configuration data - handle that.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);
    };
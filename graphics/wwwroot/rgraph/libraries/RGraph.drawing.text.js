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
    RGraph.Drawing.Text = function (conf)
    {
        var id   = conf.id
        var x    = conf.x;
        var y    = conf.y;
        var text = String(conf.text);

        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext('2d');
        this.colorsParsed      = false;
        this.canvas.__object__ = this;
        this.x                 = x;
        this.y                 = y;
        this.text              = String(text);
        this.coords            = [];
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false


        //
        // This defines the type of this shape
        //
        this.type = 'drawing.text';


        //
        // This facilitates easy object identification, and should always be true
        //
        this.isRGraph = true;


        // This adds a uid to the object that you can use for identification purposes
        this.uid = RGraph.createUID();


        // This adds a UID to the canvas for identification purposes
        this.canvas.uid = this.canvas.uid ? this.canvas.uid : RGraph.createUID();


        // Some example background properties
        this.properties =
        {
            textSize:                    12,
            textFont:                    'Arial, Verdana, sans-serif',
            textBold:                    false,
            textItalic:                  false,

            angle:                   0,

            colors:                  ['black'],

            eventsClick:            null,
            eventsMousemove:        null,

            highlightStroke:        '#ccc',
            highlightFill:          'rgba(255,255,255,0.7)',

            tooltips:                null,
            tooltipsEffect:         'fade',
            tooltipsCssClass:      'RGraph_tooltip',
            tooltipsEvent:          'onclick',
            tooltipsHighlight:      true,
            tooltipsCoordsPage:    false,

            bounding:                false,
            boundingFill:           'rgba(255,255,255,0.7)',
            boundingStroke:         '#777',
            boundingShadow:         false,
            boundingShadowColor:   '#ccc',
            boundingShadowBlur:    3,
            boundingShadowOffsetx: 3,
            boundingShadowOffsety: 3,

            marker:                  false,

            halign:                  'left',
            valign:                  'bottom',

            link:                    null,
            linkTarget:             '_self',
            linkOptions:            '',

            textAccessible:                true,
            textAccessibleOverflow:       'visible',
            textAccessiblePointerevents:  false,

            shadow:                         false,
            shadowColor:                   '#ccc',
            shadowOffsetx:                 2,
            shadowOffsety:                 2,
            shadowBlur:                    3,

            clearto:                        'rgba(0,0,0,0)'
        }

        //
        // A simple check that the browser has canvas support
        //
        if (!this.canvas) {
            alert('[DRAWING.TEXT] No canvas support');
            return;
        }
        
        // Create the dollar object so that functions can be added to them
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
        
        
        
        // "Decorate" the object with the generic effects if the effects library has been included
        if (RGraph.Effects && typeof RGraph.Effects.decorate === 'function') {
            RGraph.Effects.decorate(this);
        }



        // A setter method for setting properties.
        // 
        // @param name  string The name of the property to set OR it can be a map
        //                     of name/value settings like what you set in the constructor
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
        // Draws the rectangle
        //
        this.draw = function ()
        {
            // Fire the onbeforedraw event
            RGraph.fireCustomEvent(this, 'onbeforedraw');
    
    
            // Parse the colors. This allows for simple gradient syntax
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
            
            
            // Stop the coods array from growing
            this.coords = [];



            // Stop this growing uncntrollably
            this.coordsText = [];



            
            // The font, its size and whether its bold or not can be set by properties,
            // so now they have been (potentiall) set - measure the text
            // Measure the text and add the width/height
            // 
            // text, bold, font, size
            var dimensions = RGraph.measureText(
                this.text,
                prop.textBold,
                prop.textFont,
                prop.textSize
            );
    
    
    
            // ------------- DRAW TEXT HERE -------------
            this.context.fillStyle = prop.colors[0];
            
            // Shadow
            if (prop.shadow) {
                RGraph.setShadow(
                    this,
                    prop.shadowColor,
                    prop.shadowOffsetx,
                    prop.shadowOffsety,
                    prop.shadowBlur
                );
            }

            var ret = RGraph.text({
              
              object: this,

                font:                      prop.textFont,
                size:                      prop.textSize,
                bold:                      prop.textBold,
                italic:                    prop.textItalic,
                color:                     prop.colors[0],

                x:                         this.x,
                y:                         this.y,
                text:                      this.text,
                angle:                     prop.angle,
                
                bounding:                  prop.bounding,
                'bounding.fill':           prop.boundingFill,
                'bounding.stroke':         prop.boundingStroke,
                'bounding.shadow':         prop.boundingShadow,
                'bounding.shadow.color':   prop.boundingShadowColor,
                'bounding.shadow.blur':    prop.boundingShadowBlur,
                'bounding.shadow.offsetx': prop.boundingShadowOffsetx,
                'bounding.shadow.offsety': prop.boundingShadowOffsety,
                
                marker:                    prop.marker,
                halign:                    prop.halign,
                valign:                    prop.valign
            });


            // Shadow
            if (prop.shadow) {
                RGraph.noShadow(this);
            }



            // store the dimensions
            this.coords.push({
                0: ret.x,      x:      ret.x,
                1: ret.y,      y:      ret.y,
                2: ret.width,  width:  ret.width,
                3: ret.height, height: ret.height
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




            // Fire the ondraw event
            RGraph.fireCustomEvent(this, 'ondraw');
            
            return this;
        };








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








        // The getObjectByXY() worker method
        //
        this.getObjectByXY = function (e)
        {
            if (this.getShape(e)) {
                return this;
            }
        };








        //
        // Not used by the class during creating the graph, but is used by event handlers
        // to get the coordinates (if any) of the selected bar
        // 
        // @param object e The event object
        //
        this.getShape = function (e)
        {
            var prop    = this.properties;
            var coords  = this.coords;
            var mouseXY = RGraph.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];  
    
            for (var i=0,len=this.coords.length; i<len; i++) {
    
                var left   = coords[i].x;
                var top    = coords[i].y;
                var width  = coords[i].width;
                var height = coords[i].height;
    
                if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height)) {
                    
                    return {
                            0: this, 1: left, 2: top, 3: width, 4: height, 5: 0,
                            object: this, x: left, y: top, width: width, height: height, index: 0, tooltip: prop.tooltips ? prop.tooltips[0] : null
                           };
                }
            }
            
            return null;
        };








        // Each object type has its own Highlight() function which highlights the appropriate shape
        // 
        // @param object shape The shape to highlight
        //
        this.highlight = function (shape)
        {
            if (typeof prop.highlightStyle === 'function') {
                (prop.highlightStyle)(shape);
            } else {
                RGraph.Highlight.rect(this, shape);
            }
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors.colors          = RGraph.arrayClone(prop.colors)[0];
                this.original_colors.colorsFill      = RGraph.arrayClone(prop.colorsFill);
                this.original_colors.colorsStroke    = RGraph.arrayClone(prop.colorsStroke);
                this.original_colors.highlightStroke = RGraph.arrayClone(prop.highlightStroke);
                this.original_colors.highlightFill   = RGraph.arrayClone(prop.highlightFill);
            }




            // Parse various properties for colors
            prop.colors[0]       = this.parseSingleColorForGradient(prop.colors[0]);
            prop.colorsFill      = this.parseSingleColorForGradient(prop.colorsFill);
            prop.colorsStroke    = this.parseSingleColorForGradient(prop.colorsStroke);
            prop.highlightStroke = this.parseSingleColorForGradient(prop.highlightStroke);
            prop.highlightFill   = this.parseSingleColorForGradient(prop.highlightFill);
        };








        // Use this function to reset the object to the post-constructor state. Eg reset colors if
        // need be etc
        this.reset = function ()
        {
        };








        // This parses a single color value
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

                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = this.context.createLinearGradient(0,0,this.canvas.width,0);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RGraph.trim(parts[0]));
    
                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RGraph.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        };








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








        // This function runs once only
        // (put at the end of the file (before any effects))
        //
        this.firstDrawFunc = function ()
        {
        };








        // Objects are now always registered so that the chart is redrawn if need be.
        //
        RGraph.register(this);

        // This is the 'end' of the constructor so if the first argument
        // contains configuration data - handle that.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);
    };
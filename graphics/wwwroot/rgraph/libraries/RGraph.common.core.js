// version: 2019-09-08
    // o--------------------------------------------------------------------------------o
    // | This file is part of the RGraph package - you can learn more at:               |
    // |                                                                                |
    // |                         https://www.rgraph.net                                 |
    // |                                                                                |
    // | RGraph is licensed under the Open Source MIT license. That means that it's     |
    // | totally free to use and there are no restrictions on what you can do with it!  |
    // o--------------------------------------------------------------------------------o

    window.RGraph = window.RGraph || {isRGraph: true};

// Module pattern
(function (win, doc, undefined)
{
    // A short name variable
    var ua  = navigator.userAgent;

    //
    // Initialise the various objects
    //
    RGraph.Highlight      = {};
    RGraph.Registry       = {};
    RGraph.Registry.store = [];
    RGraph.Registry.store['event.handlers']       = [];
    RGraph.Registry.store['__rgraph_event_listeners__'] = []; // Used in the new system for tooltips
    RGraph.Background     = {};
    RGraph.background     = {};
    RGraph.objects        = [];
    RGraph.Resizing       = {};
    RGraph.events         = [];
    RGraph.cursor         = [];
    RGraph.Effects        = RGraph.Effects || {};
    RGraph.cache          = [];

    RGraph.ObjectRegistry                    = {};
    RGraph.ObjectRegistry.objects            = {};
    RGraph.ObjectRegistry.objects.byUID      = [];
    RGraph.ObjectRegistry.objects.byCanvasID = [];
    RGraph.OR                                = RGraph.ObjectRegistry;




    //
    // Some "constants". The ua variable is navigator.userAgent (definedabove)
    //
    RGraph.PI       = Math.PI;
    RGraph.HALFPI   = RGraph.PI / 2;
    RGraph.TWOPI    = RGraph.PI * 2;

    RGraph.ISFF     = ua.indexOf('Firefox') != -1;
    RGraph.ISOPERA  = ua.indexOf('Opera') != -1;
    RGraph.ISCHROME = ua.indexOf('Chrome') != -1;
    RGraph.ISSAFARI = ua.indexOf('Safari') != -1 && !RGraph.ISCHROME;
    RGraph.ISWEBKIT = ua.indexOf('WebKit') != -1;

    RGraph.ISIE   = ua.indexOf('Trident') > 0 || navigator.userAgent.indexOf('MSIE') > 0;
    RGraph.ISIE6  = ua.indexOf('MSIE 6') > 0;
    RGraph.ISIE7  = ua.indexOf('MSIE 7') > 0;
    RGraph.ISIE8  = ua.indexOf('MSIE 8') > 0;
    RGraph.ISIE9  = ua.indexOf('MSIE 9') > 0;
    RGraph.ISIE10 = ua.indexOf('MSIE 10') > 0;
    RGraph.ISOLD  = RGraph.ISIE6 || RGraph.ISIE7 || RGraph.ISIE8; // MUST be here
    
    RGraph.ISIE11UP = ua.indexOf('MSIE') == -1 && ua.indexOf('Trident') > 0;
    RGraph.ISIE10UP = RGraph.ISIE10 || RGraph.ISIE11UP;
    RGraph.ISIE9UP  = RGraph.ISIE9 || RGraph.ISIE10UP;




    //
    // Returns five values which are used as a nice scale
    // 
    // 11/12/2018
    // ==========
    // This funtction doesn't appear to ve being used
    // any more - could remove it.
    // 
    // @param  max int    The maximum value of the graph
    // @param  obj object The graph object
    // @return     array   An appropriate scale
    //
    RGraph.getScale = function (max, obj)
    {
        var prefix = obj.type === 'hbar' ? 'xaxis' : 'yaxis';

        //
        // Special case for 0
        //
        if (max == 0) {
            return ['0.2', '0.4', '0.6', '0.8', '1.0'];
        }

        var original_max = max;

        //
        // Manually do decimals
        //
        if (max <= 1) {
            if (max > 0.5) {
                return [0.2,0.4,0.6,0.8, Number(1).toFixed(1)];

            } else if (max >= 0.1) {
                return obj.get(prefix + 'ScaleRound') ? [0.2,0.4,0.6,0.8,1] : [0.1,0.2,0.3,0.4,0.5];

            } else {

                var tmp = max;
                var exp = 0;

                while (tmp < 1.01) {
                    exp += 1;
                    tmp *= 10;
                }

                var ret = ['2e-' + exp, '4e-' + exp, '6e-' + exp, '8e-' + exp, '10e-' + exp];


                if (max <= ('5e-' + exp)) {
                    ret = ['1e-' + exp, '2e-' + exp, '3e-' + exp, '4e-' + exp, '5e-' + exp];
                }

                return ret;
            }
        }

        // Take off any decimals
        if (String(max).indexOf('.') > 0) {
            max = String(max).replace(/\.\d+$/, '');
        }

        var interval = Math.pow(10, Number(String(Number(max)).length - 1));
        var topValue = interval;

        while (topValue < max) {
            topValue += (interval / 2);
        }

        // Handles cases where the max is (for example) 50.5
        if (Number(original_max) > Number(topValue)) {
            topValue += (interval / 2);
        }

        // Custom if the max is greater than 5 and less than 10
        if (max < 10) {
            topValue = (Number(original_max) <= 5 ? 5 : 10);
        }
        
        //
        // Added 02/11/2010 to create "nicer" scales
        //
        if (obj && typeof(obj.get(prefix + 'ScaleRound')) == 'boolean' && obj.get(prefix + 'ScaleRound')) {
            topValue = 10 * interval;
        }

        return [topValue * 0.2, topValue * 0.4, topValue * 0.6, topValue * 0.8, topValue];
    };








    //
    // Returns an appropriate scale. The return value is actualy an object consisting of:
    //  scale.max
    //  scale.min
    //  scale.scale
    // 
    // @param  obj object  The graph object
    // @param  prop object An object consisting of configuration properties
    // @return     object  An object containg scale information
    //
    RGraph.getScale2 = function (obj, opt)
    {
        var prop         = obj.properties,
            numlabels    = typeof opt['scale.labels.count'] == 'number' ? opt['scale.labels.count'] : 5,
            units_pre    = typeof opt['scale.units.pre'] == 'string' ? opt['scale.units.pre'] : '',
            units_post   = typeof opt['scale.units.post'] == 'string' ? opt['scale.units.post'] : '',
            max          = Number(opt['scale.max']),
            min          = typeof opt['scale.min'] == 'number' ? opt['scale.min'] : 0,
            strict       = opt['scale.strict'],
            decimals     = Number(opt['scale.decimals']), // Sometimes the default is null
            point        = opt['scale.point'], // Default is a string in all chart libraries so no need to cast it
            thousand     = opt['scale.thousand'], // Default is a string in all chart libraries so no need to cast it
            original_max = max,
            round        = opt['scale.round'],
            scale        = {max:1,labels:[],values:[]},
            formatter    = opt['scale.formatter'];

            // Determine any prefix to use
            prefix = obj.type === 'hbar' ? 'xaxis' : 'yaxis';
            prefix = obj.type === 'odo' ? '' : prefix;





        //
        // Special case for 0
        // 
        // ** Must be first **
        //
        if (!max) {

            var max   = 1;

            for (var i=0; i<numlabels; ++i) {

                var label = ((((max - min) / numlabels) + min) * (i + 1)).toFixed(decimals);

                scale.labels.push(units_pre + label + units_post);
                scale.values.push(parseFloat(label))
            }

        //
        // Manually do decimals
        //
        } else if (max <= 1 && !strict) {

            var arr = [
                1,0.5,
                0.10,0.05,
                0.010,0.005,
                0.0010,0.0005,
                0.00010,0.00005,
                0.000010,0.000005,
                0.0000010,0.0000005,
                0.00000010,0.00000005,
                0.000000010,0.000000005,
                0.0000000010,0.0000000005,
                0.00000000010,0.00000000005,
                0.000000000010,0.000000000005,
                0.0000000000010,0.0000000000005
            ], vals = [];



            for (var i=0; i<arr.length; ++i) {
                if (max > arr[i]) {
                    i--;
                    break;
                }
            }


            scale.max = arr[i]
            scale.labels = [];
            scale.values = [];
        
            for (var j=0; j<numlabels; ++j) {

                var value = ((((arr[i] - min) / numlabels) * (j + 1)) + min).toFixed(decimals);

                scale.values.push(value);
                scale.labels.push(RGraph.numberFormat({
                    object:    obj,
                    number:    value,
                    unitspre:  units_pre,
                    unitspost: units_post,
                    thousand:  thousand,
                    point:     point,
                    formatter: formatter,
                    decimals: decimals
                }));
            }




        } else if (!strict) {

            //
            // Now comes the scale handling for integer values
            //

            // This accommodates decimals by rounding the max up to the next integer
            max = Math.ceil(max);

            var interval = Math.pow(10, Math.max(1, Number(String(Number(max) - Number(min)).length - 1)) );

            var topValue = interval;

            while (topValue < max) {
                topValue += (interval / 2);
            }

            // Handles cases where the max is (for example) 50.5
            if (Number(original_max) > Number(topValue)) {
                topValue += (interval / 2);
            }

            // Custom if the max is greater than 5 and less than 10
            if (max <= 10) {
                topValue = (Number(original_max) <= 5 ? 5 : 10);
            }
    
    
            // Added 02/11/2010 to create "nicer" scales
            if (obj && typeof(round) == 'boolean' && round) {
                topValue = 10 * interval;
            }

            scale.max = topValue;

            // Now generate the scale. Temporarily set the objects scaleDecimal and scalePoint to those
            // that we've been given as the number_format functuion looks at those instead of using
            // arguments.
            var tmp_point    = prop[prefix + 'ScalePoint'];
            var tmp_thousand = prop[prefix + 'ScaleThousand'];

            obj.set(prefix + 'scaleThousand', thousand);
            obj.set(prefix + 'scalePoint', point);


            for (var i=0; i<numlabels; ++i) {
                scale.labels.push(RGraph.numberFormat({
                    object:    obj,
                    number:    ((((i+1) / numlabels) * (topValue - min)) + min).toFixed(decimals),
                    unitspre:  units_pre,
                    unitspost: units_post,
                    point:     point,
                    thousand:  thousand,
                    formatter: formatter
                }) );
                scale.values.push(((((i+1) / numlabels) * (topValue - min)) + min).toFixed(decimals));
            }

            obj.set(prefix + 'scaleThousand', tmp_thousand);
            obj.set(prefix + 'scalePoint', tmp_point);

        } else if (typeof max == 'number' && strict) {

            //
            // ymax is set and also strict
            //
            for (var i=0; i<numlabels; ++i) {
                scale.labels.push(RGraph.numberFormat({
                    object:    obj,
                    number:    ((((i+1) / numlabels) * (max - min)) + min).toFixed(decimals),
                    unitspre:  units_pre,
                    unitspost: units_post,
                    thousand:  thousand,
                    point:     point,
                    formatter: formatter
                }));

                scale.values.push(
                    ((((i+1) / numlabels) * (max - min)) + min).toFixed(decimals)
                );
            }

            // ???
            scale.max = max;
        }


        scale.units_pre  = units_pre;
        scale.units_post = units_post;
        scale.point      = point;
        scale.decimals   = decimals;
        scale.thousand   = thousand;
        scale.numlabels  = numlabels;
        scale.round      = Boolean(round);
        scale.min        = min;
        scale.formatter  = formatter;

        //
        // Convert all of the scale values to numbers
        //
        for (var i=0; i<scale.values.length; ++i) {
            scale.values[i] = parseFloat(scale.values[i]);
        }

        return scale;
    };








    //
    // Parse a gradient thats in JSON format like this:
    //
    // Gradient({colors: ["red","white"],x1:0,y1:25,x2:0,y2:275})
    //
    RGraph.parseJSONGradient = function (opt)
    {
        var obj      = opt.object,
            def      = opt.def, // The gradient definition
            context  = opt.object.context;

        // Evaluate the JSON
        def = eval("(" + def + ")");





        // Create a radial gradient
        if (typeof def.r1 === 'number' && typeof def.r2 === 'number') {
            // Create the gradient
            var grad = context.createRadialGradient(
                def.x1, def.y1, def.r1,
                def.x2, def.y2, def.r2
            );
        // Create a linear gradient
        } else {
            var grad = context.createLinearGradient(
                def.x1, def.y1,
                def.x2, def.y2
            );
        }




        // Add the parts to the gradient
        var diff = 1 / (def.colors.length - 1);
        
        grad.addColorStop(0, RGraph.trim(def.colors[0]));
        
        for (var j=1,len=def.colors.length; j<len; ++j) {
            grad.addColorStop(j * diff, RGraph.trim(def.colors[j]));
        }

        return grad;
    };








    //
    // Converts an the truthy values to falsey values and vice-versa
    //
    RGraph.arrayInvert = function (arr)
    {
        for (var i=0,len=arr.length; i<len; ++i) {
            arr[i] = !arr[i];
        }

        return arr;
    };








    //
    // An arrayTrim function that removes the empty elements off
    //both ends
    //
    RGraph.arrayTrim = function (arr)
    {
        var out = [], content = false;

        // Trim the start
        for (var i=0; i<arr.length; i++) {
        
            if (arr[i]) {
                content = true;
            }
        
            if (content) {
                out.push(arr[i]);
            }
        }
        
        // Reverse the array and trim the start again
        out = RGraph.arrayReverse(out);

        var out2 = [], content = false ;
        for (var i=0; i<out.length; i++) {
        
            if (out[i]) {
                content = true;
            }
        
            if (content) {
                out2.push(out[i]);
            }
        }
        
        // Now reverse the array and return it
        out2 = RGraph.arrayReverse(out2);

        return out2;
    };








    //
    // Makes a clone of an ARRAY
    // 
    // @param obj val The object to clone
    //
    RGraph.arrayClone =
    RGraph.array_clone = function (obj)
    {
        if(obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = RGraph.isArray(obj) ? [] : {};

        for (var i in obj) {
            if (typeof i === 'string' || typeof i === 'number' ) {
                if (typeof obj[i]  === 'number') {
                    temp[i] = (function (arg) {return Number(arg);})(obj[i]);
                
                } else if (typeof obj[i]  === 'string') {
                    temp[i] = (function (arg) {return String(arg);})(obj[i]);
                
                } else if (typeof obj[i] === 'function') {
                    temp[i] = obj[i];
                
                } else {
                    temp[i] = RGraph.arrayClone(obj[i]);
                }
            }
        }

        return temp;
    };








    //
    // Returns the maximum numeric value which is in an array. This function IS NOT
    // recursive
    // 
    // @param  array arr The array (can also be a number, in which case it's returned as-is)
    // @param  int       Whether to ignore signs (ie negative/positive)
    // @return int       The maximum value in the array
    //
    RGraph.arrayMax =
    RGraph.array_max = function (arr)
    {
        var max = null,
            ma  = Math
        
        if (typeof arr === 'number') {
            return arr;
        }
        
        if (RGraph.isNull(arr)) {
            return 0;
        }

        for (var i=0,len=arr.length; i<len; ++i) {
            if (typeof arr[i] === 'number' && !isNaN(arr[i])) {

                var val = arguments[1] ? Math.abs(arr[i]) : arr[i];
                
                if (typeof max === 'number') {
                    max = Math.max(max, val);
                } else {
                    max = val;
                }
            }
        }

        return max;
    };








    //
    // Returns the minimum numeric value which is in an array
    // 
    // @param  array arr The array (can also be a number, in which case it's returned as-is)
    // @param  int       Whether to ignore signs (ie negative/positive)
    // @return int       The minimum value in the array
    //
    RGraph.arrayMin = function (arr)
    {
        var max = null,
            min = null,
            ma  = Math;
        
        if (typeof arr === 'number') {
            return arr;
        }
        
        if (RGraph.isNull(arr)) {
            return 0;
        }

        for (var i=0,len=arr.length; i<len; ++i) {
            if (typeof arr[i] === 'number') {

                var val = arguments[1] ? Math.abs(arr[i]) : arr[i];
                
                if (typeof min === 'number') {
                    min = Math.min(min, val);
                } else {
                    min = val;
                }
            }
        }

        return min;
    };








    //
    // Returns the maximum value which is in an array
    // 
    // @param  array arr The array
    // @param  int   len The length to pad the array to
    // @param  mixed     The value to use to pad the array (optional)
    //
    RGraph.arrayPad =
    RGraph.array_pad = function (arr, len)
    {
        if (arr.length < len) {
            var val = arguments[2] ? arguments[2] : null;
            
            for (var i=arr.length; i<len; i+=1) {
                arr[i] = val;
            }
        }
        
        return arr;
    };








    //
    // An array sum function
    // 
    // @param  array arr The  array to calculate the total of
    // @return int       The summed total of the arrays elements
    //
    RGraph.arraySum =
    RGraph.array_sum = function (arr)
    {
        // Allow integers
        if (typeof arr === 'number') {
            return arr;
        }
        
        // Account for null
        if (RGraph.isNull(arr)) {
            return 0;
        }

        var i, sum, len = arr.length;

        for(i=0,sum=0;i<len;sum+=(arr[i++]||0));

        return sum;
    };








    //
    // Takes any number of arguments and adds them to one big linear array
    // which is then returned
    // 
    // @param ... mixed The data to linearise. You can strings, booleans, numbers or arrays
    //
    RGraph.arrayLinearize =
    RGraph.array_linearize = function ()
    {
        var arr  = [],
            args = arguments

        for (var i=0,len=args.length; i<len; ++i) {

            if (typeof args[i] === 'object' && args[i]) {
                for (var j=0,len2=args[i].length; j<len2; ++j) {
                    var sub = RGraph.arrayLinearize(args[i][j]);
                    
                    for (var k=0,len3=sub.length; k<len3; ++k) {
                        arr.push(sub[k]);
                    }
                }
            } else {
                arr.push(args[i]);
            }
        }

        return arr;
    };








    //
    // Takes one off the front of the given array and returns the new array.
    // 
    // @param array arr The array from which to take one off the front of array 
    // 
    // @return array The new array
    //
    RGraph.arrayShift =
    RGraph.array_shift = function(arr)
    {
        var ret = [];
        
        for(var i=1,len=arr.length; i<len; ++i) {
            ret.push(arr[i]);
        }
        
        return ret;
    };








    //
    // Reverses the order of an array
    // 
    // @param array arr The array to reverse
    //
    RGraph.arrayReverse =
    RGraph.array_reverse = function (arr)
    {
        if (!arr) {
            return;
        }

        var newarr=[];

        for(var i=arr.length - 1; i>=0; i-=1) {
            newarr.push(arr[i]);
        }
        
        return newarr;
    };








    //
    // Returns the absolute value of a number. You can also pass in an
    // array and it will run the abs() function on each element. It
    // operates recursively so sub-arrays are also traversed.
    // 
    // @param array arr The number or array to work on
    //
    RGraph.abs = function (value)
    {
        if (typeof value === 'string') {
            value = parseFloat(value) || 0;
        }

        if (typeof value === 'number') {
            return Math.abs(value);
        }

        if (typeof value === 'object') {
            for (i in value) {
                if (   typeof i === 'string'
                    || typeof i === 'number'
                    || typeof i === 'object') {

                    value[i] = RGraph.abs(value[i]);
                }
            }
            
            return value;
        }
        
        return 0;
    };








    //
    // Clears the canvas by setting the width. You can specify a colour if you wish.
    // 
    // @param object canvas The canvas to clear
    // @param mixed         Usually a color string to use to clear the canvas
    //                      with - could also be a gradient object
    //
    RGraph.clear =
    RGraph.Clear = function (canvas)
    {
        var obj     = canvas.__object__;
        var context = canvas.getContext('2d');
        var color   = arguments[1] || (obj && obj.get('clearto'));

        if (!canvas) {
            return;
        }
        
        RGraph.fireCustomEvent(obj, 'onbeforeclear');

        //
        // Set the CSS display: to none for DOM text
        //
        if (RGraph.text.domNodeCache && RGraph.text.domNodeCache[canvas.id]) {
            for (var i in RGraph.text.domNodeCache[canvas.id]) {
                
                var el = RGraph.text.domNodeCache[canvas.id][i];
    
                if (el && el.style) {
                    el.style.display = 'none';
                }
            }
        }

        //
        // Can now clear the canvas back to fully transparent
        //
        if (   !color
            || (color && color === 'rgba(0,0,0,0)' || color === 'transparent')
            ) {

            context.clearRect(-100,-100,canvas.width + 200, canvas.height + 200);

            // Reset the globalCompositeOperation
            context.globalCompositeOperation = 'source-over';

        } else if (color) {

            RGraph.path(
                context,
                'fs % fr -100 -100 % %',
                color,
                canvas.width + 200,
                canvas.height + 200
            );
        
        } else {
            RGraph.path(
                context,
                'fs % fr -100 -100 % %',
                obj.get('clearto'),
                canvas.width + 200,
                canvas.height + 200
            );
        }
        
        //if (RGraph.clearAnnotations) {
            //RGraph.clearAnnotations(canvas.id);
        //}
        
        //
        // This removes any background image that may be present
        //
        if (RGraph.Registry.get('background.image.' + canvas.id)) {
            var img = RGraph.Registry.get('background.image.' + canvas.id);
            img.style.position = 'absolute';
            img.style.left     = '-10000px';
            img.style.top      = '-10000px';
        }
        
        //
        // This hides the tooltip that is showing IF it has the same canvas ID as
        // that which is being cleared
        //
        if (RGraph.Registry.get('tooltip') && obj && !obj.get('tooltipsNohideonclear')) {
            RGraph.hideTooltip(canvas);
        }

        //
        // Set the cursor to default
        //
        canvas.style.cursor = 'default';

        RGraph.fireCustomEvent(obj, 'onclear');
    };








    //
    // Draws the title of the graph
    // 
    // @param object  canvas The canvas object
    // @param string  text   The title to write
    // @param integer margin The size of the margin
    // @param integer        The center X point (optional - if not given it will be generated from the canvas width)
    // @param integer        Size of the text. If not given it will be 14
    // @param object         An optional object which has canvas and context properties to use instead of those on
    //                       the obj argument (so as to enable caching)
    //
    RGraph.drawTitle =
    RGraph.DrawTitle = function (obj, text, marginTop)
    {
        var canvas       = obj.canvas,
            context      = obj.context,
            prop         = obj.properties,
            marginLeft   = prop.marginLeft,
            marginRight  = prop.marginRight,
            marginTop    = marginTop,
            marginBottom = prop.marginBottom,
            centerx      = (arguments[3] ? arguments[3] : ((canvas.width - marginLeft - marginRight) / 2) + marginLeft),
            keypos       = prop.keyPosition,
            vpos         = prop.titleVpos,
            hpos         = prop.titleHpos,
            bgcolor      = prop.titleBackground,
            x            = prop.titleX,
            y            = prop.titleY,
            halign       = 'center',
            valign       = 'center',
            
            textConf = RGraph.getTextConf({
                object: obj,
                prefix: 'title'
            });

            var size   = textConf.size,
                bold   = textConf.bold,
                italic = textConf.italic;
                
                // Set bold to true for the title if it hasn't been set by
                // the user 
                if (RGraph.isNull(bold)) {
                    textConf.bold = true;
                    bold          = true;
                }



        // Account for 3D effect by faking the key position
        if (obj.type == 'bar' && prop.variant == '3d') {
            keypos = 'margin';
        }

        context.beginPath();
        context.fillStyle = textConf.color ? textConf.color : 'black';


        //
        // Vertically center the text if the key is not present
        //
        if (keypos && keypos != 'margin') {
            var valign = 'center';

        } else if (!keypos) {
            var valign = 'center';

       } else {
            var valign = 'bottom';
        }





        // if titleVpos is a number, use that
        if (typeof prop.titleVpos === 'number') {
            vpos = prop.titleVpos * marginTop;

            if (prop.xaxisPosition === 'top') {
                vpos = prop.titleVpos * marginBottom + marginTop + (canvas.height - marginTop - marginBottom);
            }

        } else {
            vpos = marginTop - size - 5;

            if (prop.xaxisPosition === 'top') {
                vpos = canvas.height  - marginBottom + size + 5;
            }
        }

        // if titleHpos is a number, use that. It's multiplied with the (entire) canvas width
        if (typeof hpos === 'number') {
            centerx = hpos * canvas.width;
        }

        //
        // Now the titleX and titleY settings override (is set) the above
        //
        if (typeof x === 'number') centerx = x;
        if (typeof y === 'number') vpos    = y;
        
        if (typeof x === 'string') centerx += parseFloat(x);
        if (typeof y === 'string') vpos    += parseFloat(y);




        //
        // Horizontal alignment can now (Jan 2013) be specified
        //
        if (typeof prop.titleHalign === 'string') {
            halign = prop.titleHalign;
        }
        
        //
        // Vertical alignment can now (Jan 2013) be specified
        //
        if (typeof prop.titleValign === 'string') {
            valign = prop.titleValign;
        }




        
        // Set the colour
        if (typeof textConf.color !== null) {
            
            var oldColor = context.fillStyle,
                newColor = textConf.color;
            
            context.fillStyle = newColor ? newColor : 'black';
        }

        // Draw the title
        var ret = RGraph.text({
        
            object: obj,

            font:    textConf.font,
            size:    textConf.size,
            color:   textConf.color,
            bold:    textConf.bold,
            italic:  textConf.italic,

            x:       centerx,
            y:       vpos,
            text:    text,
            valign:  valign,
            halign:  halign,
            bounding:bgcolor != null,
            'bounding.fill':bgcolor,
            tag:     'title',
            marker:  false
        });

        // Reset the fill colour
        context.fillStyle = oldColor;
    };








    //
    // Gets the mouse X/Y coordinates relative to the canvas
    // 
    // @param object e The event object. As such this method should be used in an event listener.
    //
    RGraph.getMouseXY = function(e)
    {
        // This is necessary foe IE9
        if (!e.target) {
            return;
        }

        var el      = e.target,
            canvas  = el,
            caStyle = canvas.style,
            offsetX = 0,
            offsetY = 0,
            x,
            y,
            borderLeft  = parseInt(caStyle.borderLeftWidth) || 0,
            borderTop   = parseInt(caStyle.borderTopWidth) || 0,
            paddingLeft = parseInt(caStyle.paddingLeft) || 0,
            paddingTop  = parseInt(caStyle.paddingTop) || 0,
            additionalX = borderLeft + paddingLeft,
            additionalY = borderTop + paddingTop;


        if (typeof e.offsetX === 'number' && typeof e.offsetY === 'number') {


            if (!RGraph.ISIE && !RGraph.ISOPERA) {
                x = e.offsetX - borderLeft - paddingLeft;
                y = e.offsetY - borderTop - paddingTop;
            
            } else if (RGraph.ISIE) {
                x = e.offsetX - paddingLeft;
                y = e.offsetY - paddingTop;
            
            } else {
                x = e.offsetX;
                y = e.offsetY;
            }   

        } else {

            if (typeof el.offsetParent !== 'undefined') {
                do {
                    offsetX += el.offsetLeft;
                    offsetY += el.offsetTop;
                } while ((el = el.offsetParent));
            }

            x = e.pageX - offsetX - additionalX;
            y = e.pageY - offsetY - additionalY;

            x -= (2 * (parseInt(document.body.style.borderLeftWidth) || 0));
            y -= (2 * (parseInt(document.body.style.borderTopWidth) || 0));

            //x += (parseInt(caStyle.borderLeftWidth) || 0);
            //y += (parseInt(caStyle.borderTopWidth) || 0);
        }

        // We return a javascript array with x and y defined
        return [x, y];
    };








    //
    // This function returns a two element array of the canvas x/y position in
    // relation to the page
    // 
    // @param object canvas
    //
    RGraph.getCanvasXY = function (canvas)
    {
        var x  = 0;
        var y  = 0;
        var el = canvas; // !!!

        do {

            x += el.offsetLeft;
            y += el.offsetTop;
            
            // ACCOUNT FOR TABLES IN wEBkIT
            if (el.tagName.toLowerCase() == 'table' && (RGraph.ISCHROME || RGraph.ISSAFARI)) {
                x += parseInt(el.border) || 0;
                y += parseInt(el.border) || 0;
            }

            el = el.offsetParent;

        } while (el && el.tagName.toLowerCase() != 'body');


        var paddingLeft = canvas.style.paddingLeft ? parseInt(canvas.style.paddingLeft) : 0;
        var paddingTop  = canvas.style.paddingTop ? parseInt(canvas.style.paddingTop) : 0;
        var borderLeft  = canvas.style.borderLeftWidth ? parseInt(canvas.style.borderLeftWidth) : 0;
        var borderTop   = canvas.style.borderTopWidth  ? parseInt(canvas.style.borderTopWidth) : 0;

        if (navigator.userAgent.indexOf('Firefox') > 0) {
            x += parseInt(document.body.style.borderLeftWidth) || 0;
            y += parseInt(document.body.style.borderTopWidth) || 0;
        }

        return [x + paddingLeft + borderLeft, y + paddingTop + borderTop];
    };








    //
    // This function determines whther a canvas is fixed (CSS positioning) or not. If not it returns
    // false. If it is then the element that is fixed is returned (it may be a parent of the canvas).
    // 
    // @return Either false or the fixed positioned element
    //
    RGraph.isFixed = function (canvas)
    {
        var obj = canvas;
        var i = 0;

        while (obj && obj.tagName.toLowerCase() != 'body' && i < 99) {

            if (obj.style.position == 'fixed') {
                return obj;
            }
            
            obj = obj.offsetParent;
        }

        return false;
    };








    //
    // Registers a graph object (used when the canvas is redrawn)
    // 
    // @param object obj The object to be registered
    //
    RGraph.register =
    RGraph.Register = function (obj)
    {
        // Checking this property ensures the object is only registered once
        if (!obj.get('noregister') && obj.get('register') !== false) {
            // As of 21st/1/2012 the object registry is now used
            RGraph.ObjectRegistry.add(obj);
            obj.set('register', false);
        }
    };








    //
    // Causes all registered objects to be redrawn
    // 
    // @param string An optional color to use to clear the canvas
    //
    RGraph.redraw =
    RGraph.Redraw = function ()
    {
        var objectRegistry = RGraph.ObjectRegistry.objects.byCanvasID;

        // Get all of the canvas tags on the page
        var tags = document.getElementsByTagName('canvas');

        for (var i=0,len=tags.length; i<len; ++i) {
            if (tags[i] && tags[i].__object__ && tags[i].__object__.isRGraph) {
                
                // Only clear the canvas if it's not Trace'ing - this applies to the Line/Scatter Trace effects
                if (!tags[i].noclear) {
                    RGraph.clear(tags[i], arguments[0] ? arguments[0] : null);
                }
            }
        }

        // Go through the object registry and redraw *all* of the canvas'es that have been registered
        for (var i=0,len=objectRegistry.length; i<len; ++i) {
            if (objectRegistry[i]) {
                var id = objectRegistry[i][0];
                objectRegistry[i][1].draw();
            }
        }
    };








    //
    // Causes all registered objects ON THE GIVEN CANVAS to be redrawn
    // 
    // @param canvas object The canvas object to redraw
    // @param        bool   Optional boolean which defaults to true and determines whether to clear the canvas
    //
    RGraph.redrawCanvas =
    RGraph.RedrawCanvas = function (canvas)
    {
        var objects = RGraph.ObjectRegistry.getObjectsByCanvasID(canvas.id);

        //
        // First clear the canvas
        //
        if (!arguments[1] || (typeof arguments[1] === 'boolean' && !arguments[1] == false) ) {
            var color = arguments[2] || canvas.__object__.get('clearto') || 'transparent';
            RGraph.clear(canvas, color);
        }

        //
        // Now redraw all the charts associated with that canvas
        //
        for (var i=0,len=objects.length; i<len; ++i) {
            if (objects[i]) {
                if (objects[i] && objects[i].isRGraph) { // Is it an RGraph object ??
                    objects[i].draw();
                }
            }
        }
    };








    //
    // This function draws the background for the bar chart, line chart and scatter chart.
    // 
    // @param  object obj The graph object
    //
    RGraph.Background.draw =
    RGraph.Background.Draw =
    RGraph.background.draw =
    RGraph.background.Draw = function (obj)
    {
        var prop         = obj.properties,
            height       = 0,
            marginLeft   = obj.marginLeft,
            marginRight  = obj.marginRight,
            marginTop    = obj.marginTop,
            marginBottom = obj.marginBottom,
            variant      = prop.variant


            obj.context.fillStyle = prop.textColor;

            // If it's a bar and 3D variant, translate
            if (variant == '3d') {
                obj.context.save();
                obj.context.translate(prop.variantThreedOffsetx, -1 * prop.variantThreedOffsety);
            }
    
            // X axis title
            if (typeof prop.xaxisTitle === 'string' && prop.xaxisTitle.length) {
            
                var size   = prop.textSize + 2;
                //var font   = prop.textFont;
                //var bold   = prop.xaxisTitleBold;
                //var italic = prop.xaxisTitleItalic;

                //if (typeof prop.xaxisTitleSize === 'number') {
                //    size = prop.xaxisTitleSize;
                //}
    
                //if (typeof prop.xaxisTitleFont === 'string') {
                //    font = prop.xaxisTitleFont;
                //}
                
                var hpos = ((obj.canvas.width - marginLeft - marginRight) / 2) + marginLeft;
                var vpos = obj.canvas.height - marginBottom + 25;
                
                if (typeof prop.xaxisTitlePos === 'number') {
                    vpos = obj.canvas.height - (marginBottom * prop.xaxisTitlePos);
                }
    
    
    
    
                // Specifically specified X/Y positions
                if (typeof prop.xaxisTitleX === 'number') {
                    hpos = prop.xaxisTitleX;
                }
    
                if (typeof prop.xaxisTitleY === 'number') {
                    vpos = prop.xaxisTitleY;
                }
                
                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: obj,
                    prefix: 'xaxisTitle'
                });
    

                RGraph.text({
                
                  object: obj,

                    font:   textConf.font,
                    size:   textConf.size,
                    color:  textConf.color,
                    bold:   textConf.bold,
                    italic: textConf.italic,

                    x:      hpos,
                    y:      vpos,
                    text:   prop.xaxisTitle,
                    halign: 'center',
                    valign: 'top',
                    tag:    'xaxis.title'
                });
            }
    
            // Y axis title
            if (typeof(prop.yaxisTitle) === 'string' && prop.yaxisTitle.length) {

                var size   = prop.textSize + 2;
                var font   = prop.textFont;
                var italic = prop.textItalic;
                var angle  = 270;
                var bold   = prop.yaxisTitleBold;
                var color  = prop.yaxisTitleColor;

                if (typeof prop.yaxisTitlePos == 'number') {
                    var yaxis_title_pos = prop.yaxisTitlePos * marginLeft;
                } else if (obj.type === 'hbar' && RGraph.isNull(prop.yaxisTitlePos) ) {
                    var yaxis_title_pos = prop.marginLeft - obj.yaxisLabelsSize;
                } else {

                    if (obj && obj.scale2) {

                        var yaxisTitleDimensions = RGraph.measureText({
                            text: obj.scale2.labels[obj.scale2.labels.length - 1],
                            bold: typeof prop.yaxisScaleBold === 'boolean' ? prop.yaxisScaleBold : prop.textBold,
                            font: prop.yaxisScaleFont || prop.textFont,
                            size: typeof prop.yaxisScaleSize === 'number' ? prop.yaxisScaleSize : prop.textSize
                        });

                    } else {
                        // This is here to allow for the drawing API background
                        // object
                        yaxisTitleDimensions = [0,0];
                    }

                    var yaxis_title_pos = prop.marginLeft - yaxisTitleDimensions[0] - 7;
                }
                if (typeof prop.yaxisTitleSize === 'number') {
                    size = prop.yaxisTitleSize;
                }
    
                if (typeof prop.yaxisTitleItalic === 'boolean') {
                    italic = prop.yaxisTitleItalic;
                }
    
                if (typeof prop.yaxisTitleFont === 'string') {
                    font = prop.yaxisTitleFont;
                }
                
                

                if (   prop.yaxisTitleAlign == 'right'
                    || prop.yaxisTitlePosition == 'right'
                    || (obj.type === 'hbar' && prop.yaxisPosition === 'right' && typeof prop.yaxisTitleAlign === 'undefined' && typeof prop.yaxisTitlePosition === 'undefined')
                   ) {

                    angle = 90;
                    yaxis_title_pos = typeof prop.yaxisTitlePos === 'number'
                                          ? (obj.canvas.width - marginRight) + (prop.yaxisTitlePos * marginRight)
                                          : obj.canvas.width - marginRight + (prop.yaxisLabelsSize || prop.textSize) + 10;

                }

                var y = ((obj.canvas.height - marginTop - marginBottom) / 2) + marginTop;

                // Specifically specified X/Y positions
                if (typeof prop.yaxisTitleX === 'number') {
                    yaxis_title_pos = prop.yaxisTitleX;
                }
    
                if (typeof prop.yaxisTitleY === 'number') {
                    y = prop.yaxisTitleY;
                }

                obj.context.fillStyle = color;

                // Get the text configuration
                var textConf = RGraph.getTextConf({
                    object: obj,
                    prefix: 'yaxisTitle'
                });


                RGraph.text({
                
                  object: obj,
                
                    font:   textConf.font,
                    size:   textConf.size,
                    color:  textConf.color,
                    bold:   textConf.bold,
                    italic: textConf.italic,

                    x:          yaxis_title_pos,
                    y:          y,
                    valign:     'bottom',
                    halign:     'center',
                    angle:      angle,
                    text:       prop.yaxisTitle,
                    tag:        'yaxis.title',
                    accessible: false
                });
            }
    
            //
            // If the background color is spec ified - draw that. It's a rectangle that fills the
            // entire area within the margins
            //
            var bgcolor = prop.backgroundColor;

            if (bgcolor) {
                obj.context.fillStyle = bgcolor;
                obj.context.fillRect(marginLeft + 0.5, marginTop + 0.5, obj.canvas.width - marginLeft - marginRight, obj.canvas.height - marginTop - marginBottom);
            }







            //
            // Draw horizontal background bars
            //
            var numbars   = (prop.yaxisLabelsCount || 5);

            // If the backbgroundBarcount property is set use that
            if (typeof prop.backgroundBarsCount === 'number') {
                numbars = prop.backgroundBarsCount;
            }

            // Calculate the height of the bars
            var barHeight = (obj.canvas.height - marginBottom - marginTop) / numbars;

            obj.context.beginPath();
                obj.context.fillStyle   = prop.backgroundBarsColor1;
                obj.context.strokeStyle = obj.context.fillStyle;
                height = (obj.canvas.height - marginBottom);

                for (var i=0; i<numbars; i+=2) {
                    obj.context.rect(marginLeft,
                        (i * barHeight) + marginTop,
                        obj.canvas.width - marginLeft - marginRight,
                        barHeight
                    );
                }
            obj.context.fill();



            obj.context.beginPath();
                obj.context.fillStyle   = prop.backgroundBarsColor2;
                obj.context.strokeStyle = obj.context.fillStyle;
        
                for (var i=1; i<numbars; i+=2) {
                    obj.context.rect(
                        marginLeft,
                        (i * barHeight) + marginTop,
                        obj.canvas.width - marginLeft - marginRight,
                        barHeight
                    );
                }
            
            obj.context.fill();
            
            // Close any errantly open path
            obj.context.beginPath();












            //
            // The background grid is cached
            //
            var func = function (obj, cacheCanvas, cacheContext)
            {
                // Draw the background grid
                if (prop.backgroundGrid) {
                
                    prop.backgroundGridHlinesCount += 0.0001;

                    // If autofit is specified, use the .numhlines and .numvlines along with the width to work
                    // out the hsize and vsize
                    if (prop.backgroundGridAutofit) {

                        //
                        // Align the grid to the tickmarks
                        //
                        if (prop.backgroundGridAutofitAlign) {
                        
                            // Align the horizontal lines
                            if (obj.type === 'hbar') {
                                obj.set('backgroundGridHlinesCount', obj.data.length);
                            }

                            // Align the vertical lines for the line
                            if (obj.type === 'line') {
                                if (typeof prop.backgroundGridVlinesCount === 'number') {
                                    // Nada
                                } else if (prop.xaxisLabels && prop.xaxisLabels.length) {
                                    obj.set('backgroundGridVlinesCount', prop.xaxisLabels.length - 1);
                                } else {
                                    obj.set('backgroundGridVlinesCount', obj.data[0].length - 1);
                                }
                            } else if (obj.type === 'waterfall') {
                                obj.set(
                                    'backgroundGridVlinesCount',
                                    obj.data.length + (prop.total ? 1 : 0)
                                );

                            // Align the vertical lines for the bar
                            } else if (obj.type === 'bar') {
                                
                                // 13/12/2018
                                //
                                // Updated to be the same as the number of data points
                                //
                                obj.set('backgroundGridVlinesCount', obj.data.length);
                            
                            // Align the vertical lines for the Scatter
                            } else if (obj.type === 'scatter') {
                                if (typeof prop.backgroundGridVlinesCount !== 'number') {
                                    
                                    // Set the number of grid lines to the same
                                    // as the number of labels
                                    if (RGraph.isArray(prop.xaxisLabels) && prop.xaxisLabels.length) {
                                        obj.set('backgroundGridVlinesCount', prop.xaxisLabels.length);
                                    
                                    // No labels - set the number of grid lines
                                    // to 10
                                    } else {
                                        obj.set('backgroundGridVlinesCount', 10);
                                    }
                                }

    
                            // Gantt
                            } else if (obj.type === 'gantt') {

                                if (typeof obj.get('backgroundGridVlinesCount') === 'number') {
                                    // Nothing to do here
                                } else {
                                    obj.set('backgroundGridVlinesCount', prop.xaxisScaleMax);
                                }
    
                                obj.set('backgroundGridHlinesCount', obj.data.length);
                            
                            // HBar
                            } else if (obj.type === 'hbar' && RGraph.isNull(prop.backgroundGridHlinesCount) ) {
                                obj.set('backgroundGridHlinesCount', obj.data.length);
                            }
                        }
    
                        var vsize = ((cacheCanvas.width - marginLeft - marginRight)) / prop.backgroundGridVlinesCount;
                        var hsize = (cacheCanvas.height - marginTop - marginBottom) / prop.backgroundGridHlinesCount;

                        obj.set('backgroundGridVsize', vsize);
                        obj.set('backgroundGridHsize', hsize);
                    }

                    obj.context.beginPath();
                    cacheContext.lineWidth   = prop.backgroundGridLinewidth ? prop.backgroundGridLinewidth : 1;
                    cacheContext.strokeStyle = prop.backgroundGridColor;

                    // Dashed background grid
                    if (prop.backgroundGridDashed && typeof cacheContext.setLineDash == 'function') {
                        cacheContext.setLineDash([3,5]);
                    }
                    
                    // Dotted background grid
                    if (prop.backgroundGridDotted && typeof cacheContext.setLineDash == 'function') {
                        cacheContext.setLineDash([1,3]);
                    }
                    
                    obj.context.beginPath();
        
        
                    // Draw the horizontal lines
                    if (prop.backgroundGridHlines) {
                        height = (cacheCanvas.height - marginBottom)
                        var hsize = prop.backgroundGridHsize;
                        for (y=marginTop; y<=height; y+=hsize) {
                            cacheContext.moveTo(marginLeft, Math.round(y));
                            cacheContext.lineTo(obj.canvas.width - marginRight, Math.round(y));
                        }
                    }
        
                    // Draw the vertical lines

                    if (prop.backgroundGridVlines) {

                        var width = (cacheCanvas.width - marginRight);
                        var vsize = prop.backgroundGridVsize;

                        for (var x=marginLeft; Math.round(x)<=width; x+=vsize) {
                            cacheContext.moveTo(Math.round(x), marginTop);
                            cacheContext.lineTo(Math.round(x), obj.canvas.height - marginBottom);
                        }
                    }
        
                    if (prop.backgroundGridBorder) {
                        // Make sure a rectangle, the same colour as the grid goes around the graph
                        cacheContext.strokeStyle = prop.backgroundGridColor;
                        cacheContext.strokeRect(Math.round(marginLeft), Math.round(marginTop), obj.canvas.width - marginLeft - marginRight, obj.canvas.height - marginTop - marginBottom);
                    }
                }
    
                cacheContext.stroke();
    
    
    
                // Ensure the grid is drawn before continuing
                cacheContext.beginPath();
                cacheContext.closePath();
            }
            
            // Now a cached draw in newer browsers
            RGraph.cachedDraw(obj, obj.uid + '_background', func);







            // If it's a bar and 3D variant, translate
            if (variant == '3d') {
                obj.context.restore();
            }

            // Reset the line dash
            if (typeof obj.context.setLineDash == 'function') {
                obj.context.setLineDash([1,0]);
            }
    
            obj.context.stroke();



        // Draw the title if one is set
        if ( typeof(obj.properties.title) == 'string') {

            var prop = obj.properties;

            RGraph.drawTitle(
                obj,
                prop.title,
                obj.marginTop,
                null,
                prop.titleSize ? prop.titleSize : prop.textSize + 2,
                obj
            );
        }
    };








    //
    // Formats a number with thousand seperators so it's easier to read
    // 
    // THESE ARE OLDER ARGS:
    // 
    // @param  integer obj The chart object
    // @param  integer num The number to format
    // @param  string      The (optional) string to prepend to the string
    // @param  string      The (optional) string to append to the string
    // @return string      The formatted number
    //
    RGraph.numberFormat =
    RGraph.number_format = function (opt)
    {
        var prop = opt.object.properties;



        var i;
        var prepend = opt.unitspre ? String(opt.unitspre) : '';
        var append  = opt.unitspost ? String(opt.unitspost) : '';
        var output  = '';
        var decimal = '';
        var decimal_seperator  = typeof opt.point    === 'string' ? opt.point    : '.';
        var thousand_seperator = typeof opt.thousand === 'string' ? opt.thousand : ',';
        RegExp.$1   = '';
        var i,j;

        if (typeof opt.formatter === 'function') {
            return (opt.formatter)(opt);
        }

        // Ignore the preformatted version of "1e-2"
        if (String(opt.number).indexOf('e') > 0) {
            return String(prepend + String(opt.number) + append);
        }

        // We need then number as a string
        opt.number = String(opt.number);

        // Take off the decimal part - we re-append it later
        if (opt.number.indexOf('.') > 0) {
            var tmp    = opt.number;
            opt.number = opt.number.replace(/\.(.*)/, ''); // The front part of the number
            decimal    = tmp.replace(/(.*)\.(.*)/, '$2'); // The decimal part of the number
        }

        // Thousand seperator
        //var seperator = arguments[1] ? String(arguments[1]) : ',';
        var seperator = thousand_seperator;

        // Work backwards adding the thousand seperators
        //
        // ** i is a local variable at this poin **
        var foundPoint;
        for (i=(opt.number.length - 1),j=0; i>=0; j++,i--) {
            var character = opt.number.charAt(i);
            
            if ( j % 3 == 0 && j != 0) {
                output += seperator;
            }
            
            //
            // Build the output
            //
            output += character;
        }

        //
        // Now need to reverse the string
        //
        var rev = output;
        output = '';
        for (i=(rev.length - 1); i>=0; i--) {
            output += rev.charAt(i);
        }

        // Tidy up
        //output = output.replace(/^-,/, '-');
        if (output.indexOf('-' + opt.thousand) == 0) {
            output = '-' + output.substr(('-' + opt.thousand).length);
        }

        // Reappend the decimal
        if (decimal.length) {
            output =  output + decimal_seperator + decimal;
            decimal = '';
            RegExp.$1 = '';
        }

        // Minor bugette
        if (output.charAt(0) == '-') {
            output = output.replace(/-/, '');
            prepend = '-' + prepend;
        }
        
        // Get rid of leading commas
        output = output.replace(/^,+/,'');

        return prepend + output + append;
    };








    //
    // Draws horizontal coloured bars on something like the bar, line or scatter
    //
    RGraph.drawBars =
    RGraph.DrawBars = function (obj)
    {
        var prop  = obj.properties;
        var hbars = prop.backgroundHbars;

        if (hbars === null) {
            return;
        }

        //
        // Draws a horizontal bar
        //
        obj.context.beginPath();

        for (var i=0,len=hbars.length; i<len; ++i) {
        
            var start  = hbars[i][0];
            var length = hbars[i][1];
            var color  = hbars[i][2];
            

            // Perform some bounds checking
            if(RGraph.is_null(start))start = obj.scale2.max
            if (start > obj.scale2.max) start = obj.scale2.max;
            if (RGraph.isNull(length)) length = obj.scale2.max - start;
            if (start + length > obj.scale2.max) length = obj.scale2.max - start;
            if (start + length < (-1 * obj.scale2.max) ) length = (-1 * obj.scale2.max) - start;

            if (prop.xaxisPosition == 'center' && start == obj.scale2.max && length < (obj.scale2.max * -2)) {
                length = obj.scale2.max * -2;
            }


            //
            // Draw the bar
            //
            var x = prop.marginLeft;
            var y = obj.getYCoord(start);
            var w = obj.canvas.width - prop.marginLeft - prop.marginRight;
            var h = obj.getYCoord(start + length) - y;

            // Accommodate Opera :-/
            if (RGraph.ISOPERA != -1 && prop.xaxisPosition == 'center' && h < 0) {
                h *= -1;
                y = y - h;
            }

            //
            // Account for X axis at the top
            //
            if (prop.xaxisPosition == 'top') {
                y  = obj.canvas.height - y;
                h *= -1;
            }

            obj.context.fillStyle = color;
            obj.context.fillRect(x, y, w, h);
        }




//
//            // If the X axis is at the bottom, and a negative max is given, warn the user
//            if (obj.get('xaxisPosition') == 'bottom' && (hbars[i][0] < 0 || (hbars[i][1] + hbars[i][1] < 0)) ) {
//                alert('[' + obj.type.toUpperCase() + ' (ID: ' + obj.id + ') BACKGROUND HBARS] You have a negative value in one of your background hbars values, whilst the X axis is in the center');
//            }
//
//            var ystart = (obj.grapharea - (((hbars[i][0] - obj.scale2.min) / (obj.scale2.max - obj.scale2.min)) * obj.grapharea));
//            //var height = (Math.min(hbars[i][1], obj.max - hbars[i][0]) / (obj.scale2.max - obj.scale2.min)) * obj.grapharea;
//            var height = obj.getYCoord(hbars[i][0]) - obj.getYCoord(hbars[i][1]);
//
//           // Account for the X axis being in the center
//            if (obj.get('xaxisPosition') == 'center') {
//                ystart /= 2;
//                //height /= 2;
//            }
//            
//            ystart += obj.get('marginTop')
//
//            var x = obj.get('marginLeft');
//            var y = ystart - height;
//            var w = obj.canvas.width - obj.get('marginLeft') - obj.get('marginRight');
//            var h = height;
//
//            // Accommodate Opera :-/
//            if (navigator.userAgent.indexOf('Opera') != -1 && obj.get('xaxisPosition') == 'center' && h < 0) {
//                h *= -1;
//                y = y - h;
//            }
//            
//            //
//            // Account for X axis at the top
//            //
//            //if (obj.get('xaxisPosition') == 'top') {
//            //    y  = obj.canvas.height - y;
//            //    h *= -1;
//            //}
//
//            //obj.context.fillStyle = hbars[i][2];
//            //obj.context.fillRect(x, y, w, h);
//        //}
    };








    //
    // Draws in-graph labels.
    // 
    // @param object obj The graph object
    //
    RGraph.drawInGraphLabels =
    RGraph.DrawInGraphLabels = function (obj)
    {
        var prop    = obj.properties,
            labels  = prop.labelsIngraph,
            labels_processed = [];

        // Defaults
        var fgcolor   = 'black',
            bgcolor   = 'white',
            direction = 1;

        if (!labels) {
            return;
        }

        // Get the text configuration
        var textConf = RGraph.getTextConf({
            object: obj,
            prefix: 'labelsIngraph'
        });

        //
        // Preprocess the labels array. Numbers are expanded
        //
        for (var i=0,len=labels.length; i<len; i+=1) {
            if (typeof labels[i] === 'number') {
                for (var j=0; j<labels[i]; ++j) {
                    labels_processed.push(null);
                }
            } else if (typeof labels[i] === 'string' || typeof labels[i] === 'object') {
                labels_processed.push(labels[i]);
            
            } else {
                labels_processed.push('');
            }
        }








        //
        // Turn off any shadow
        //
        RGraph.noShadow(obj);








        if (labels_processed && labels_processed.length > 0) {

            for (var i=0,len=labels_processed.length; i<len; i+=1) {
                if (labels_processed[i]) {
                    var coords = obj.coords[i];
                    
                    if (coords && coords.length > 0) {
                        var x      = (obj.type == 'bar' ? coords[0] + (coords[2] / 2) : coords[0]);
                        var y      = (obj.type == 'bar' ? coords[1] + (coords[3] / 2) : coords[1]);
                        var length = typeof labels_processed[i][4] === 'number' ? labels_processed[i][4] : 25;
    
                        obj.context.beginPath();
                        obj.context.fillStyle   = 'black';
                        obj.context.strokeStyle = 'black';
                        
    
                        if (obj.type === 'bar') {
                        
                            //
                            // X axis at the top
                            //
                            if (obj.get('xaxisPosition') == 'top') {
                                length *= -1;
                            }
    
                            if (prop.variant == 'dot') {
                                obj.context.moveTo(Math.round(x), obj.coords[i][1] - 5);
                                obj.context.lineTo(Math.round(x), obj.coords[i][1] - 5 - length);
                                
                                var text_x = Math.round(x);
                                var text_y = obj.coords[i][1] - 5 - length;
                            
                            } else if (prop.variant == 'arrow') {
                                obj.context.moveTo(Math.round(x), obj.coords[i][1] - 5);
                                obj.context.lineTo(Math.round(x), obj.coords[i][1] - 5 - length);
                                
                                var text_x = Math.round(x);
                                var text_y = obj.coords[i][1] - 5 - length;
                            
                            } else {
    
                                obj.context.arc(Math.round(x), y, 2.5, 0, 6.28, 0);
                                obj.context.moveTo(Math.round(x), y);
                                obj.context.lineTo(Math.round(x), y - length);

                                var text_x = Math.round(x);
                                var text_y = y - length;
                            }

                            obj.context.stroke();
                            obj.context.fill();
                            
    
                        } else {

                            if (
                                typeof labels_processed[i] == 'object' &&
                                typeof labels_processed[i][3] == 'number' &&
                                labels_processed[i][3] == -1
                               ) {

                                // Draw an up arrow
                                drawUpArrow(x, y)
                                var valign = 'top';
                                
                                var text_x = x;
                                var text_y = y + 5 + length;
                            
                            } else {

                                var text_x = x;
                                var text_y = y - 5 - length;

                                if (text_y < 5 && (typeof labels_processed[i] === 'string' || typeof labels_processed[i][3] === 'undefined')) {
                                    text_y = y + 5 + length;
                                    var valign = 'top';
                                }

                                if (valign === 'top') {
                                    /// Draw an down arrow
                                    drawUpArrow(x, y);
                                } else {
                                    /// Draw an up arrow
                                    drawDownArrow(x, y);
                                }
                            }
                        
                            obj.context.fill();
                        }

                        obj.context.beginPath();
                            
                            // Foreground color
                            obj.context.fillStyle = (typeof labels_processed[i] === 'object' && typeof labels_processed[i][1] === 'string') ? labels_processed[i][1] : 'black';

                            RGraph.text({
                            
                              object: obj,

                                font:            textConf.font,
                                size:            textConf.size,
                                color:           textConf.color,
                                bold:            textConf.bold,
                                italic:          textConf.italic,

                                x:               text_x,
                                y:               text_y + (obj.properties.textAccessible ? 2 : 0),
                                text:            (typeof labels_processed[i] === 'object' && typeof labels_processed[i][0] === 'string') ? labels_processed[i][0] : labels_processed[i],
                                valign:          valign || 'bottom',
                                halign:          'center',
                                bounding:        true,
                                'bounding.fill': (typeof labels_processed[i] === 'object' && typeof labels_processed[i][2] === 'string') ? labels_processed[i][2] : 'white',
                                tag:             'labels ingraph'
                            });
                        obj.context.fill();
                    }




                    // Draws a down arrow
                    function drawUpArrow (x, y)
                    {
                        obj.context.moveTo(Math.round(x), y + 5);
                        obj.context.lineTo(Math.round(x), y + 5 + length);
                        
                        obj.context.stroke();
                        obj.context.beginPath();                                
                        
                        // This draws the arrow
                        obj.context.moveTo(Math.round(x), y + 5);
                        obj.context.lineTo(Math.round(x) - 3, y + 10);
                        obj.context.lineTo(Math.round(x) + 3, y + 10);
                        obj.context.closePath();
                    }




                    // Draw an up arrow
                    function drawDownArrow (x, y)
                    {
                        obj.context.moveTo(Math.round(x), y - 5);
                        obj.context.lineTo(Math.round(x), y - 5 - length);
                        
                        obj.context.stroke();
                        obj.context.beginPath();
                        
                        // This draws the arrow
                        obj.context.moveTo(Math.round(x), y - 5);
                        obj.context.lineTo(Math.round(x) - 3, y - 10);
                        obj.context.lineTo(Math.round(x) + 3, y - 10);
                        obj.context.closePath();
                    }
                    
                    valign = undefined;
                }
            }
        }
    };








    //
    // This function "fills in" key missing properties that various implementations lack
    // 
    // @param object e The event object
    //
    RGraph.fixEventObject =
    RGraph.FixEventObject = function (e)
    {
        if (RGraph.ISOLD) {
            var e = event;

            e.pageX  = (event.clientX + doc.body.scrollLeft);
            e.pageY  = (event.clientY + doc.body.scrollTop);
            e.target = event.srcElement;
            
            if (!doc.body.scrollTop && doc.documentElement.scrollTop) {
                e.pageX += parseInt(doc.documentElement.scrollLeft);
                e.pageY += parseInt(doc.documentElement.scrollTop);
            }
        }

        
        // Any browser that doesn't implement stopPropagation() (MSIE)
        if (!e.stopPropagation) {
            e.stopPropagation = function () {window.event.cancelBubble = true;}
        }
        
        return e;
    };








    //
    // Thisz function hides the crosshairs coordinates
    //
    RGraph.hideCrosshairCoords =
    RGraph.HideCrosshairCoords = function ()
    {
        var div = RGraph.Registry.get('coordinates.coords.div');

        if (   div
            && div.style.opacity == 1
            && div.__object__.get('crosshairsCoordsFadeout')
           ) {
            
            var style = RGraph.Registry.get('coordinates.coords.div').style;

            setTimeout(function() {style.opacity = 0.9;}, 25);
            setTimeout(function() {style.opacity = 0.8;}, 50);
            setTimeout(function() {style.opacity = 0.7;}, 75);
            setTimeout(function() {style.opacity = 0.6;}, 100);
            setTimeout(function() {style.opacity = 0.5;}, 125);
            setTimeout(function() {style.opacity = 0.4;}, 150);
            setTimeout(function() {style.opacity = 0.3;}, 175);
            setTimeout(function() {style.opacity = 0.2;}, 200);
            setTimeout(function() {style.opacity = 0.1;}, 225);
            setTimeout(function() {style.opacity = 0;}, 250);
            setTimeout(function() {style.display = 'none';}, 275);
        }
    };








    //
    // Draws the3D axes/background
    // 
    // @param object obj The chart object
    //
    RGraph.draw3DAxes =
    RGraph.Draw3DAxes = function (obj)
    {
        var prop = obj.properties;

        var marginLeft    = obj.marginLeft,
            marginRight   = obj.marginRight,
            marginTop     = obj.marginTop,
            marginBottom  = obj.marginBottom,
            xaxispos      = prop.xaxisPosition,
            graphArea     = obj.canvas.height - marginTop - marginBottom,
            halfGraphArea = graphArea / 2,
            offsetx       = prop.variantThreedOffsetx,
            offsety       = prop.variantThreedOffsety,
            xaxis         = prop.variantThreedXaxis,
            yaxis         = prop.variantThreedYaxis
        

        //
        // Draw the 3D Y axis
        //
        if (yaxis) {
            RGraph.draw3DYAxis(obj);
        }
        
        
        
        // X axis
        if (xaxis) {
            if (xaxispos === 'center') {
                RGraph.path(
                    obj.context,
                    'b m % % l % % l % % l % % c s #aaa f #ddd',
                    marginLeft,marginTop + halfGraphArea,
                    marginLeft + offsetx,marginTop + halfGraphArea - offsety,
                    obj.canvas.width - marginRight + offsetx,marginTop + halfGraphArea - offsety,
                    obj.canvas.width - marginRight,marginTop + halfGraphArea
                );

            } else {
            
                if (obj.type === 'hbar') {
                    var xaxisYCoord = obj.canvas.height - obj.properties.marginBottom;
                } else {
                    var xaxisYCoord = obj.getYCoord(0);
                }

                RGraph.path(
                    obj.context,
                    'm % % l % % l % % l % % c s #aaa f #ddd',
                    marginLeft,xaxisYCoord,
                    marginLeft + offsetx,xaxisYCoord - offsety,
                    obj.canvas.width - marginRight + offsetx,xaxisYCoord - offsety,
                    obj.canvas.width - marginRight,xaxisYCoord
                );
            }
        }
    };








    //
    // Draws the3D Y axis/background
    // 
    // @param object obj The chart object
    //
    RGraph.draw3DYAxis = function (obj)
    {
        var prop = obj.properties;

        var marginLeft    = obj.marginLeft,
            marginRight   = obj.marginRight,
            marginTop     = obj.marginTop,
            marginBottom  = obj.marginBottom,
            xaxispos      = prop.xaxisPosition,
            graphArea     = obj.canvas.height - marginTop - marginBottom,
            halfGraphArea = graphArea / 2,
            offsetx       = prop.variantThreedOffsetx,
            offsety       = prop.variantThreedOffsety;

        
        
        // Y axis
        // Commented out the if condition because of drawing oddities
        //if (!prop.noaxes && !prop.noyaxis) {

            if ( (obj.type === 'hbar' || obj.type === 'bar') && prop.yaxisPosition === 'center') {
                var x = ((obj.canvas.width - marginLeft - marginRight) / 2) + marginLeft;
            } else if ((obj.type === 'hbar' || obj.type === 'bar') && prop.yaxisPosition === 'right') {
                var x = obj.canvas.width - marginRight;
            } else {
                var x = marginLeft;
            }

            RGraph.path(
                obj.context,
                'b m % % l % % l % % l % % s #aaa f #ddd',
                x,marginTop,
                x + offsetx,marginTop - offsety,
                x + offsetx,obj.canvas.height - marginBottom - offsety,
                x,obj.canvas.height - marginBottom
            );
        //}
    };








    //
    // Draws a rectangle with curvy corners
    // 
    // @param context object The context
    // @param x number The X coordinate (top left of the square)
    // @param y number The Y coordinate (top left of the square)
    // @param w number The width of the rectangle
    // @param h number The height of the rectangle
    // @param   number The radius of the curved corners
    // @param   boolean Whether the top left corner is curvy
    // @param   boolean Whether the top right corner is curvy
    // @param   boolean Whether the bottom right corner is curvy
    // @param   boolean Whether the bottom left corner is curvy
    //
    RGraph.strokedCurvyRect = function (context, x, y, w, h)
    {
        // The corner radius
        var r = arguments[5] ? arguments[5] : 3;

        // The corners
        var corner_tl = (arguments[6] || arguments[6] == null) ? true : false;
        var corner_tr = (arguments[7] || arguments[7] == null) ? true : false;
        var corner_br = (arguments[8] || arguments[8] == null) ? true : false;
        var corner_bl = (arguments[9] || arguments[9] == null) ? true : false;

        context.beginPath();

            // Top left side
            context.moveTo(x + (corner_tl ? r : 0), y);
            context.lineTo(x + w - (corner_tr ? r : 0), y);
            
            // Top right corner
            if (corner_tr) {
                context.arc(x + w - r, y + r, r, RGraph.PI + RGraph.HALFPI, RGraph.TWOPI, false);
            }

            // Top right side
            context.lineTo(x + w, y + h - (corner_br ? r : 0) );

            // Bottom right corner
            if (corner_br) {
                context.arc(x + w - r, y - r + h, r, RGraph.TWOPI, RGraph.HALFPI, false);
            }

            // Bottom right side
            context.lineTo(x + (corner_bl ? r : 0), y + h);

            // Bottom left corner
            if (corner_bl) {
                context.arc(x + r, y - r + h, r, RGraph.HALFPI, RGraph.PI, false);
            }

            // Bottom left side
            context.lineTo(x, y + (corner_tl ? r : 0) );

            // Top left corner
            if (corner_tl) {
                context.arc(x + r, y + r, r, RGraph.PI, RGraph.PI + RGraph.HALFPI, false);
            }

        context.stroke();
    };








    //
    // Draws a filled rectangle with curvy corners
    // 
    // @param context object The context
    // @param x       number The X coordinate (top left of the square)
    // @param y       number The Y coordinate (top left of the square)
    // @param w       number The width of the rectangle
    // @param h       number The height of the rectangle
    // @param         number The radius of the curved corners
    // @param         boolean Whether the top left corner is curvy
    // @param         boolean Whether the top right corner is curvy
    // @param         boolean Whether the bottom right corner is curvy
    // @param         boolean Whether the bottom left corner is curvy
    //
    RGraph.filledCurvyRect = function (context, x, y, w, h)
    {
        // The corner radius
        var r = arguments[5] ? arguments[5] : 3;

        // The corners
        var corner_tl = (arguments[6] || arguments[6] == null) ? true : false;
        var corner_tr = (arguments[7] || arguments[7] == null) ? true : false;
        var corner_br = (arguments[8] || arguments[8] == null) ? true : false;
        var corner_bl = (arguments[9] || arguments[9] == null) ? true : false;

        context.beginPath();

            // First draw the corners

            // Top left corner
            if (corner_tl) {
                context.moveTo(x + r, y + r);
                context.arc(x + r, y + r, r, RGraph.PI, RGraph.PI + RGraph.HALFPI, false);
            } else {
                context.fillRect(x, y, r, r);
            }

            // Top right corner
            if (corner_tr) {
                context.moveTo(x + w - r, y + r);
                context.arc(x + w - r, y + r, r, RGraph.PI + RGraph.HALFPI, 0, false);
            } else {
                context.moveTo(x + w - r, y);
                context.fillRect(x + w - r, y, r, r);
            }


            // Bottom right corner
            if (corner_br) {
                context.moveTo(x + w - r, y + h - r);
                context.arc(x + w - r, y - r + h, r, 0, RGraph.HALFPI, false);
            } else {
                context.moveTo(x + w - r, y + h - r);
                context.fillRect(x + w - r, y + h - r, r, r);
            }

            // Bottom left corner
            if (corner_bl) {
                context.moveTo(x + r, y + h - r);
                context.arc(x + r, y - r + h, r, RGraph.HALFPI, RGraph.PI, false);
            } else {
                context.moveTo(x, y + h - r);
                context.fillRect(x, y + h - r, r, r);
            }

            // Now fill it in
            context.fillRect(x + r, y, w - r - r, h);
            context.fillRect(x, y + r, r + 1, h - r - r);
            context.fillRect(x + w - r - 1, y + r, r + 1, h - r - r);

        context.fill();
    };








    //
    // Hides the zoomed canvas
    //
    RGraph.hideZoomedCanvas =
    RGraph.HideZoomedCanvas = function ()
    {
        var interval = 10;
        var frames   = 15;

        if (typeof RGraph.zoom_image === 'object') {
            var obj  = RGraph.zoom_image.obj;
            var prop = obj.properties;
        } else {
            return;
        }

        if (prop.zoomFadeOut) {
            for (var i=frames,j=1; i>=0; --i, ++j) {
                if (typeof RGraph.zoom_image === 'object') {
                    setTimeout("RGraph.zoom_image.style.opacity = " + String(i / 10), j * interval);
                }
            }

            if (typeof RGraph.zoom_background === 'object') {
                setTimeout("RGraph.zoom_background.style.opacity = " + String(i / frames), j * interval);
            }
        }

        if (typeof RGraph.zoom_image === 'object') {
            setTimeout("RGraph.zoom_image.style.display = 'none'", prop.zoomFadeOut ? (frames * interval) + 10 : 0);
        }

        if (typeof RGraph.zoom_background === 'object') {
            setTimeout("RGraph.zoom_background.style.display = 'none'", prop.zoomFadeOut ? (frames * interval) + 10 : 0);
        }
    };








    //
    // Adds an event handler
    // 
    // @param object obj   The graph object
    // @param string event The name of the event, eg ontooltip
    // @param object func  The callback function
    //
    RGraph.addCustomEventListener =
    RGraph.AddCustomEventListener = function (obj, name, func)
    {
        // Initialise the events array if necessary
        if (typeof RGraph.events[obj.uid] === 'undefined') {
            RGraph.events[obj.uid] = [];
        }
        
        // Prepend "on" if necessary
        if (name.substr(0, 2) !== 'on') {
            name = 'on' + name;
        }

        RGraph.events[obj.uid].push([obj, name, func]);

        return RGraph.events[obj.uid].length - 1;
    };








    //
    // Used to fire one of the RGraph custom events
    // 
    // @param object obj   The graph object that fires the event
    // @param string event The name of the event to fire
    //
    RGraph.fireCustomEvent =
    RGraph.FireCustomEvent = function (obj, name)
    {
        if (obj && obj.isRGraph) {
        
            // This allows the eventsMouseout property to work
            // (for some reason...)
            if (name.match(/(on)?mouseout/) && typeof obj.properties.eventsMouseout === 'function') {
                (obj.properties.eventsMouseout)(obj);
            }
        
            // DOM1 style of adding custom events
            if (obj[name]) {
                (obj[name])(obj);
            }
            
            var uid = obj.uid;

            if (   typeof uid === 'string'
                && typeof RGraph.events === 'object'
                && typeof RGraph.events[uid] === 'object'
                && RGraph.events[uid].length > 0) {

                for(var j=0; j<RGraph.events[uid].length; ++j) {
                    if (RGraph.events[uid][j] && RGraph.events[uid][j][1] === name) {
                        RGraph.events[uid][j][2](obj);
                    }
                }
            }
        }
    };








    //
    // Clears all the custom event listeners that have been registered
    // 
    // @param    string Limits the clearing to this object ID
    //
    RGraph.removeAllCustomEventListeners =
    RGraph.RemoveAllCustomEventListeners = function ()
    {
        var id = arguments[0];

        if (id && RGraph.events[id]) {
            RGraph.events[id] = [];
        } else {
            RGraph.events = [];
        }
    };








    //
    // Clears a particular custom event listener
    // 
    // @param object obj The graph object
    // @param number i   This is the index that is return by .addCustomEventListener()
    //
    RGraph.removeCustomEventListener =
    RGraph.RemoveCustomEventListener = function (obj, i)
    {
        if (   typeof RGraph.events === 'object'
            && typeof RGraph.events[obj.id] === 'object'
            && typeof RGraph.events[obj.id][i] === 'object') {
            
            RGraph.events[obj.id][i] = null;
        }
    };








    //
    // This draws the background
    // 
    // @param object obj The graph object
    //
    RGraph.drawBackgroundImage =
    RGraph.DrawBackgroundImage = function (obj)
    {
        var prop = obj.properties;

        if (typeof prop.backgroundImage === 'string') {
            if (typeof obj.canvas.__rgraph_background_image__ === 'undefined') {
                var img = new Image();
                img.__object__  = obj;
                img.__canvas__  = obj.canvas;
                img.__context__ = obj.context;
                img.src         = obj.get('backgroundImage');
                
                obj.canvas.__rgraph_background_image__ = img;
            } else {
                img = obj.canvas.__rgraph_background_image__;
            }

            // When the image has loaded - redraw the canvas
            img.onload = function ()
            {
                obj.__rgraph_background_image_loaded__ = true;
                RGraph.clear(obj.canvas);
                RGraph.redrawCanvas(obj.canvas);
            }
                
            var marginLeft   = obj.marginLeft;
            var marginRight  = obj.marginRight;
            var marginTop    = obj.marginTop;
            var marginBottom = obj.marginBottom;
            var stretch      = prop.backgroundImageStretch;
            var align        = prop.backgroundImageAlign;
    
            // Handle backgroundImage.align
            if (typeof align === 'string') {
                if (align.indexOf('right') != -1) {
                    var x = obj.canvas.width - (prop.backgroundImageW || img.width) - marginRight;
                } else {
                    var x = marginLeft;
                }
    
                if (align.indexOf('bottom') != -1) {
                    var y = obj.canvas.height - (prop.backgroundImageH || img.height) - marginBottom;
                } else {
                    var y = marginTop;
                }
            } else {
                var x = marginLeft || 25;
                var y = marginTop || 25;
            }

            // X/Y coords take precedence over the align
            var x = typeof prop.backgroundImageX === 'number' ? prop.backgroundImageX : x;
            var y = typeof prop.backgroundImageY === 'number' ? prop.backgroundImageY : y;
            var w = stretch ? obj.canvas.width - marginLeft - marginRight : img.width;
            var h = stretch ? obj.canvas.height - marginTop - marginBottom : img.height;
            
            //
            // You can now specify the width and height of the image
            //
            if (typeof prop.backgroundImageW === 'number') w  = prop.backgroundImageW;
            if (typeof prop.backgroundImageH === 'number') h = prop.backgroundImageH;

            var oldAlpha = obj.context.globalAlpha;
                obj.context.globalAlpha = prop.backgroundImageAlpha;
                obj.context.drawImage(img,x,y,w, h);
            obj.context.globalAlpha = oldAlpha;
        }
    };








    //
    // This function determines wshether an object has tooltips or not
    // 
    // @param object obj The chart object
    //
    RGraph.hasTooltips = function (obj)
    {
        var prop = obj.properties;

        if (typeof prop.tooltips == 'object' && prop.tooltips) {
            for (var i=0,len=prop.tooltips.length; i<len; ++i) {
                if (!RGraph.is_null(obj.get('tooltips')[i])) {
                    return true;
                }
            }
        } else if (typeof prop.tooltips === 'function') {
            return true;
        }
        
        return false;
    };








    //
    // This function creates a (G)UID which can be used to identify objects.
    // 
    // @return string (g)uid The (G)UID
    //
    RGraph.createUID =
    RGraph.CreateUID = function ()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
        {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };








    //
    // This is the new object registry, used to facilitate multiple objects per canvas.
    // 
    // @param object obj The object to register
    //
    RGraph.OR.add =
    RGraph.OR.Add = function (obj)
    {
        var uid = obj.uid;
        var id  = obj.canvas.id;

        //
        // Index the objects by UID
        //
        RGraph.ObjectRegistry.objects.byUID.push([uid, obj]);
        
        //
        // Index the objects by the canvas that they're drawn on
        //
        RGraph.ObjectRegistry.objects.byCanvasID.push([id, obj]);
    };








    //
    // Remove an object from the object registry
    // 
    // @param object obj The object to remove.
    //
    RGraph.OR.remove =
    RGraph.OR.Remove = function (obj)
    {
        var id  = obj.id;
        var uid = obj.uid;

        for (var i=0; i<RGraph.ObjectRegistry.objects.byUID.length; ++i) {
            if (RGraph.ObjectRegistry.objects.byUID[i] && RGraph.ObjectRegistry.objects.byUID[i][1].uid == uid) {
                RGraph.ObjectRegistry.objects.byUID[i] = null;
            }
        }


        for (var i=0; i<RGraph.ObjectRegistry.objects.byCanvasID.length; ++i) {
            if (   RGraph.ObjectRegistry.objects.byCanvasID[i]
                && RGraph.ObjectRegistry.objects.byCanvasID[i][1]
                && RGraph.ObjectRegistry.objects.byCanvasID[i][1].uid == uid) {
                
                RGraph.ObjectRegistry.objects.byCanvasID[i] = null;
            }
        }
    };








    //
    // Removes all objects from the ObjectRegistry. If either the ID of a canvas is supplied,
    // or the canvas itself, then only objects pertaining to that canvas are cleared.
    // 
    // @param mixed   Either a canvas object (as returned by document.getElementById()
    //                or the ID of a canvas (ie a string)
    //
    RGraph.OR.clear =
    RGraph.OR.Clear = function ()
    {
        // If an ID is supplied restrict the learing to that
        if (arguments[0]) {
            var id      = (typeof arguments[0] === 'object' ? arguments[0].id : arguments[0]);
            var objects = RGraph.ObjectRegistry.getObjectsByCanvasID(id);

            for (var i=0,len=objects.length; i<len; ++i) {
                RGraph.ObjectRegistry.remove(objects[i]);
            }

        } else {

            RGraph.ObjectRegistry.objects            = {};
            RGraph.ObjectRegistry.objects.byUID      = [];
            RGraph.ObjectRegistry.objects.byCanvasID = [];
        }
    };








    //
    // Lists all objects in the ObjectRegistry
    // 
    // @param boolean ret Whether to return the list or alert() it
    //
    RGraph.OR.list =
    RGraph.OR.List = function ()
    {
        var list = [];

        for (var i=0,len=RGraph.ObjectRegistry.objects.byUID.length; i<len; ++i) {
            if (RGraph.ObjectRegistry.objects.byUID[i]) {
                list.push(RGraph.ObjectRegistry.objects.byUID[i][1].type);
            }
        }
        
        if (arguments[0]) {
            return list;
        } else {
            $p(list);
        }
    };








    //
    // Clears the ObjectRegistry of objects that are of a certain given type
    // 
    // @param type string The type to clear
    //
    RGraph.OR.clearByType =
    RGraph.OR.ClearByType = function (type)
    {
        var objects = RGraph.ObjectRegistry.objects.byUID;

        for (var i=0,len=objects.length; i<len; ++i) {
            if (objects[i]) {
                var uid = objects[i][0];
                var obj = objects[i][1];
                
                if (obj && obj.type == type) {
                    RGraph.ObjectRegistry.remove(obj);
                }
            }
        }
    };








    //
    // This function provides an easy way to go through all of the objects that are held in the
    // Registry
    // 
    // @param func function This function is run for every object. Its passed the object as an argument
    // @param string type Optionally, you can pass a type of object to look for
    //
    RGraph.OR.iterate =
    RGraph.OR.Iterate = function (func)
    {
        var objects = RGraph.ObjectRegistry.objects.byUID;

        for (var i=0,len=objects.length; i<len; ++i) {
        
            if (typeof arguments[1] === 'string') {
                
                var types = arguments[1].split(/,/);

                for (var j=0,len2=types.length; j<len2; ++j) {
                    if (types[j] == objects[i][1].type) {
                        func(objects[i][1]);
                    }
                }
            } else {
                func(objects[i][1]);
            }
        }
    };








    //
    // Retrieves all objects for a given canvas id
    // 
    // @patarm id string The canvas ID to get objects for.
    //
    RGraph.OR.getObjectsByCanvasID = function (id)
    {
        var store = RGraph.ObjectRegistry.objects.byCanvasID;
        var ret = [];

        // Loop through all of the objects and return the appropriate ones
        for (var i=0,len=store.length; i<len; ++i) {
            if (store[i] && store[i][0] == id ) {
                ret.push(store[i][1]);
            }
        }

        return ret;
    };








    //
    // Retrieves the relevant object based on the X/Y position.
    // 
    // @param  object e The event object
    // @return object   The applicable (if any) object
    //
    RGraph.OR.firstbyxy =
    RGraph.OR.getFirstObjectByXY =
    RGraph.OR.getObjectByXY = function (e)
    {
        var canvas  = e.target;
        var ret     = null;
        var objects = RGraph.ObjectRegistry.getObjectsByCanvasID(canvas.id);

        for (var i=(objects.length - 1); i>=0; --i) {

            var obj = objects[i].getObjectByXY(e);

            if (obj) {
                return obj;
            }
        }
    };








    //
    // Retrieves the relevant objects based on the X/Y position.
    // NOTE This function returns an array of objects
    // 
    // @param  object e The event object
    // @return          An array of pertinent objects. Note the there may be only one object
    //
    RGraph.OR.getObjectsByXY = function (e)
    {
        var canvas  = e.target,
            ret     = [],
            objects = RGraph.ObjectRegistry.getObjectsByCanvasID(canvas.id);

        // Retrieve objects "front to back"
        for (var i=(objects.length - 1); i>=0; --i) {

            var obj = objects[i].getObjectByXY(e);

            if (obj) {
                ret.push(obj);
            }
        }
        
        return ret;
    };








    //
    // Retrieves the object with the corresponding UID
    // 
    // @param string uid The UID to get the relevant object for
    //
    RGraph.OR.get =
    RGraph.OR.getObjectByUID = function (uid)
    {
        var objects = RGraph.ObjectRegistry.objects.byUID;

        for (var i=0,len=objects.length; i<len; ++i) {
            if (objects[i] && objects[i][1].uid == uid) {
                return objects[i][1];
            }
        }
    };








    //
    // Brings a chart to the front of the ObjectRegistry by
    // removing it and then readding it at the end and then
    // redrawing the canvas
    // 
    // @param object  obj    The object to bring to the front
    // @param boolean redraw Whether to redraw the canvas after the 
    //                       object has been moved
    //
    RGraph.OR.bringToFront = function (obj)
    {
        var redraw = typeof arguments[1] === 'undefined' ? true : arguments[1];

        RGraph.ObjectRegistry.remove(obj);
        RGraph.ObjectRegistry.add(obj);
        
        if (redraw) {
            RGraph.redrawCanvas(obj.canvas);
        }
    };








    //
    // Retrieves the objects that are the given type
    // 
    // @param  mixed canvas  The canvas to check. It can either be the canvas object itself or just the ID
    // @param  string type   The type to look for
    // @return array         An array of one or more objects
    //
    RGraph.OR.type =
    RGraph.OR.getObjectsByType = function (type)
    {
        var objects = RGraph.ObjectRegistry.objects.byUID;
        var ret     = [];

        for (var i=0,len=objects.length; i<len; ++i) {

            if (objects[i] && objects[i][1] && objects[i][1].type && objects[i][1].type && objects[i][1].type == type) {
                ret.push(objects[i][1]);
            }
        }

        return ret;
    };








    //
    // Retrieves the FIRST object that matches the given type
    //
    // @param  string type   The type of object to look for
    // @return object        The FIRST object that matches the given type
    //
    RGraph.OR.first =
    RGraph.OR.getFirstObjectByType = function (type)
    {
        var objects = RGraph.ObjectRegistry.objects.byUID;
    
        for (var i=0,len=objects.length; i<len; ++i) {
            if (objects[i] && objects[i][1] && objects[i][1].type == type) {
                return objects[i][1];
            }
        }
        
        return null;
    };








    //
    // This takes centerx, centery, x and y coordinates and returns the
    // appropriate angle relative to the canvas angle system. Remember
    // that the canvas angle system starts at the EAST axis
    // 
    // @param  number cx  The centerx coordinate
    // @param  number cy  The centery coordinate
    // @param  number x   The X coordinate (eg the mouseX if coming from a click)
    // @param  number y   The Y coordinate (eg the mouseY if coming from a click)
    // @return number     The relevant angle (measured in in RADIANS)
    //
    RGraph.getAngleByXY = function (cx, cy, x, y)
    {
        var angle = Math.atan((y - cy) / (x - cx));
            angle = Math.abs(angle)

        if (x >= cx && y >= cy) {
            angle += RGraph.TWOPI;

        } else if (x >= cx && y < cy) {
            angle = (RGraph.HALFPI - angle) + (RGraph.PI + RGraph.HALFPI);

        } else if (x < cx && y < cy) {
            angle += RGraph.PI;

        } else {
            angle = RGraph.PI - angle;
        }

        //
        // Upper and lower limit checking
        //
        if (angle > RGraph.TWOPI) {
            angle -= RGraph.TWOPI;
        }

        return angle;
    };








    //
    // This function returns the distance between two points. In effect the
    // radius of an imaginary circle that is centered on x1 and y1. The name
    // of this function is derived from the word "Hypoteneuse", which in
    // trigonmetry is the longest side of a triangle
    // 
    // @param number x1 The original X coordinate
    // @param number y1 The original Y coordinate
    // @param number x2 The target X coordinate
    // @param number y2 The target Y  coordinate
    //
    RGraph.getHypLength = function (x1, y1, x2, y2)
    {
        var ret = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

        return ret;
    };








    //
    // This function gets the end point (X/Y coordinates) of a given radius.
    // You pass it the center X/Y and the radius and this function will return
    // the endpoint X/Y coordinates.
    // 
    // @param number cx The center X coord
    // @param number cy The center Y coord
    // @param number r  The lrngth of the radius
    //
    RGraph.getRadiusEndPoint = function (cx, cy, angle, radius)
    {
        var x = cx + (Math.cos(angle) * radius);
        var y = cy + (Math.sin(angle) * radius);
        
        return [x, y];
    };








    //
    // This installs all of the event listeners
    // 
    // @param object obj The chart object
    //
    RGraph.installEventListeners =
    RGraph.InstallEventListeners = function (obj)
    {
        var prop = obj.properties;

        //
        // Don't attempt to install event listeners for older versions of MSIE
        //
        if (RGraph.ISOLD) {
            return;
        }

        //
        // If this function exists, then the dynamic file has been included.
        //
        if (RGraph.installCanvasClickListener) {

            RGraph.installWindowMousedownListener(obj);
            RGraph.installWindowMouseupListener(obj);
            RGraph.installCanvasMousemoveListener(obj);
            RGraph.installCanvasMouseupListener(obj);
            RGraph.installCanvasMousedownListener(obj);
            RGraph.installCanvasClickListener(obj);
        
        } else if (   RGraph.hasTooltips(obj)
                   || prop.adjustable
                   || prop.annotatable
                   || prop.contextmenu
                   || prop.resizable
                   || prop.keyInteractive
                   || prop.eventsClick
                   || prop.eventsMousemove
                   || typeof obj.onclick === 'function'
                   || typeof obj.onmousemove === 'function'
                  ) {

            alert('[RGRAPH] You appear to have used dynamic features but not included the file: RGraph.common.dynamic.js');
        }
    };








    //
    // Loosly mimicks the PHP function print_r();
    //
    RGraph.pr = function (obj)
    {
        var indent = (arguments[2] ? arguments[2] : '    ');
        var str    = '';

        var counter = typeof arguments[3] == 'number' ? arguments[3] : 0;
        
        if (counter >= 5) {
            return '';
        }
        
        switch (typeof obj) {
            
            case 'string':    str += obj + ' (' + (typeof obj) + ', ' + obj.length + ')'; break;
            case 'number':    str += obj + ' (' + (typeof obj) + ')'; break;
            case 'boolean':   str += obj + ' (' + (typeof obj) + ')'; break;
            case 'function':  str += 'function () {}'; break;
            case 'undefined': str += 'undefined'; break;
            case 'null':      str += 'null'; break;
            
            case 'object':
                // In case of null
                if (RGraph.isNull(obj)) {
                    str += indent + 'null\n';
                } else {
                    str += indent + 'Object {' + '\n'
                    for (var j in obj) {
                        str += indent + '    ' + j + ' => ' + RGraph.pr(obj[j], true, indent + '    ', counter + 1) + '\n';
                    }
                    str += indent + '}';
                }
                break;
            
            
            default:
                str += 'Unknown type: ' + typeof obj + '';
                break;
        }


        //
        // Finished, now either return if we're in a recursed call, or alert()
        // if we're not.
        //
        if (!arguments[1]) {
            alert(str);
        }
        
        return str;
    };








    //
    // Produces a dashed line
    // 
    // @param object context The 2D context
    // @param number x1 The start X coordinate
    // @param number y1 The start Y coordinate
    // @param number x2 The end X coordinate
    // @param number y2 The end Y coordinate
    //
    RGraph.dashedLine =
    RGraph.DashedLine = function(context, x1, y1, x2, y2)
    {
        //
        // This is the size of the dashes
        //
        var size = 5;

        //
        // The optional fifth argument can be the size of the dashes
        //
        if (typeof arguments[5] === 'number') {
            size = arguments[5];
        }

        var dx  = x2 - x1;
        var dy  = y2 - y1;
        var num = Math.floor(Math.sqrt((dx * dx) + (dy * dy)) / size);

        var xLen = dx / num;
        var yLen = dy / num;

        var count = 0;

        do {
            (count % 2 == 0 && count > 0) ? context.lineTo(x1, y1) : context.moveTo(x1, y1);

            x1 += xLen;
            y1 += yLen;
        } while(count++ <= num);
    };








    //
    // Makes an AJAX call. It calls the given callback (a function) when ready
    // 
    // @param string   url      The URL to retrieve
    // @param function callback A function that is called when the response is ready,
    //                          there's an example below called "myCallback".
    //
    RGraph.AJAX = function (url, callback)
    {
        // Mozilla, Safari, ...
        if (window.XMLHttpRequest) {
            var httpRequest = new XMLHttpRequest();

        // MSIE
        } else if (window.ActiveXObject) {
            var httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }

        httpRequest.onreadystatechange = function ()
        {
            if (this.readyState == 4 && this.status == 200) {
                this.__user_callback__ = callback;

                this.__user_callback__(this.responseText);
            }
        }

        httpRequest.open('GET', url, true);
        httpRequest.send();
    };








    //
    // Makes an AJAX POST request. It calls the given callback (a function) when ready
    // 
    // @param string   url      The URL to retrieve
    // @param object   data     The POST data
    // @param function callback A function that is called when the response is ready, there's an example below
    //                          called "myCallback".
    //
    RGraph.AJAX.post =
    RGraph.AJAX.POST = function (url, data, callback)
    {
        // Used when building the POST string
        var crumbs = [];

        // Mozilla, Safari, ...
        if (window.XMLHttpRequest) {
            var httpRequest = new XMLHttpRequest();

        // MSIE
        } else if (window.ActiveXObject) {
            var httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }

        httpRequest.onreadystatechange = function ()
        {
            if (this.readyState == 4 && this.status == 200) {
                this.__user_callback__ = callback;
                this.__user_callback__(this.responseText);
            }
        }

        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        
        for (i in data) {
            if (typeof i == 'string') {
                crumbs.push(i + '=' + encodeURIComponent(data[i]));
            }
        }

        httpRequest.send(crumbs.join('&'));
    };








    //
    // Uses the above function but calls the call back passing a number as its argument
    // 
    // @param url string The URL to fetch
    // @param callback function Your callback function (which is passed the number as an argument)
    //
    RGraph.AJAX.getNumber = function (url, callback)
    {
        RGraph.AJAX(url, function ()
        {
            var num = parseFloat(this.responseText);

            callback(num);
        });
    };








    //
    // Uses the above function but calls the call back passing a string as its argument
    // 
    // @param url string The URL to fetch
    // @param callback function Your callback function (which is passed the string as an argument)
    //
    RGraph.AJAX.getString = function (url, callback)
    {
        RGraph.AJAX(url, function ()
        {
            var str = String(this.responseText);

            callback(str);
        });
    };








    //
    // Uses the above function but calls the call back passing JSON (ie a JavaScript object ) as its argument
    // 
    // @param url string The URL to fetch
    // @param callback function Your callback function (which is passed the JSON object as an argument)
    //
    RGraph.AJAX.getJSON = function (url, callback)
    {
        RGraph.AJAX(url, function ()
        {
            var json = eval('(' + this.responseText + ')');

            callback(json);
        });
    };








    //
    // Uses the above RGraph.AJAX function but calls the call back passing an array as its argument.
    // Useful if you're retrieving CSV data
    // 
    // @param url string The URL to fetch
    // @param callback function Your callback function (which is passed the CSV/array as an argument)
    //
    RGraph.AJAX.getCSV = function (url, callback)
    {
        var seperator = arguments[2] ? arguments[2] : ',';

        RGraph.AJAX(url, function ()
        {
            var regexp = new RegExp(seperator);
            var arr = this.responseText.split(regexp);
            
            // Convert the strings to numbers
            for (var i=0,len=arr.length;i<len;++i) {
                arr[i] = parseFloat(arr[i]);
            }

            callback(arr);
        });
    };








    //
    // Rotates the canvas
    // 
    // @param object canvas The canvas to rotate
    // @param  int   x      The X coordinate about which to rotate the canvas
    // @param  int   y      The Y coordinate about which to rotate the canvas
    // @param  int   angle  The angle(in RADIANS) to rotate the canvas by
    //
    RGraph.rotateCanvas =
    RGraph.RotateCanvas = function (canvas, x, y, angle)
    {
        var context = canvas.getContext('2d');

        context.translate(x, y);
        context.rotate(angle);
        context.translate(0 - x, 0 - y);    
    };








    //
    // Measures text by creating a DIV in the document and adding the relevant text to it.
    // Then checking the .offsetWidth and .offsetHeight.
    // 
    // @param  string text   The text to measure
    // @param  bool   bold   Whether the text is bold or not
    // @param  string font   The font to use
    // @param  size   number The size of the text (in pts)
    // @return array         A two element array of the width and height of the text
    //
    RGraph.measureText =
    RGraph.MeasureText = function (opt)
    {
        // Individual or object based args
        if (typeof opt === 'object') {
            var text = opt.text,
                bold = opt.bold,
                font = opt.font,
                size = opt.size;
        } else {
            text = arguments[0];
            bold = arguments[1];
            font = arguments[2];
            size = arguments[3];
        }

        // Add the sizes to the cache as adding DOM elements is costly and causes slow downs
        if (typeof RGraph.measuretext_cache === 'undefined') {
            RGraph.measuretext_cache = [];
        }

        var str = text + ':' + bold + ':' + font + ':' + size;
        if (typeof RGraph.measuretext_cache == 'object' && RGraph.measuretext_cache[str]) {
            return RGraph.measuretext_cache[str];
        }
        
        if (!RGraph.measuretext_cache['text-div']) {
            var div = document.createElement('DIV');
                div.style.position = 'absolute';
                div.style.top = '-100px';
                div.style.left = '-100px';
            document.body.appendChild(div);
            
            // Now store the newly created DIV
            RGraph.measuretext_cache['text-div'] = div;

        } else if (RGraph.measuretext_cache['text-div']) {
            var div = RGraph.measuretext_cache['text-div'];
        }

        div.innerHTML        = text.replace(/\r?\n/g, '<br />');
        div.style.fontFamily = font;
        div.style.fontWeight = bold ? 'bold' : 'normal';
        div.style.fontSize   = (size || 12) + 'pt';
        
        var size = [div.offsetWidth, div.offsetHeight];

        //document.body.removeChild(div);
        RGraph.measuretext_cache[str] = size;
        
        return size;
    };








    // New text function. Accepts two arguments:
    //  o obj - The chart object
    //  o opt - An object/hash/map of properties. This can consist of:
    //          x                The X coordinate (REQUIRED)
    //          y                The Y coordinate (REQUIRED)
    //          text             The text to show (REQUIRED)
    //          font             The font to use
    //          size             The size of the text (in pt)
    //          italic           Whether the text should be italic or not
    //          bold             Whether the text should be bold or not
    //          marker           Whether to show a marker that indicates the X/Y coordinates
    //          valign           The vertical alignment
    //          halign           The horizontal alignment
    //          bounding         Whether to draw a bounding box for the text
    //          boundingStroke   The strokeStyle of the bounding box
    //          boundingFill     The fillStyle of the bounding box
    //          accessible       If false this will cause the text to be
    //                           rendered as native canvas text. DOM text otherwise
    //
    RGraph.text  =
    RGraph.text2 =
    RGraph.Text2 = function (opt)
    {
        // Allow for the use of a single argument or two
        // 1. First handle two arguments
        if (arguments[0] && arguments[1] && typeof arguments[1].text === 'string') {
            var obj = arguments[0],
                opt = arguments[1];

        // 2. The alternative is a single option
       } else {
            var obj = opt.object;
        }
        
        // Get the defaults for the text function from RGraph.text.defaults object
        for (var i in RGraph.text.defaults) {
            if (typeof i === 'string' && typeof opt[i] === 'undefined') {
                opt[i] = RGraph.text.defaults[i];
            }
        }

        // Use DOM nodes to get better quality text. This option is BETA quality
        // code and most likely and will not work if you use 3D or if you use
        // your own transformations.
        function domtext ()
        {
            //
            // Check the font property to see if it contains the italic keyword,
            // and if it does then take it out and set the italic property
            //
            if (String(opt.size).toLowerCase().indexOf('italic') !== -1) {
                opt.size = opt.size.replace(/ *italic +/, '');
                opt.italic = true;
            }



            // Used for caching the DOM node
            var cacheKey = Math.abs(parseInt(opt.x)) + '_' + Math.abs(parseInt(opt.y)) + '_' + String(opt.text).replace(/[^a-zA-Z0-9]+/g, '_') + '_' + obj.canvas.id;



            // Wrap the canvas in a DIV
            if (!obj.canvas.rgraph_domtext_wrapper) {

                var wrapper = document.createElement('div');
                    wrapper.id        = obj.canvas.id + '_rgraph_domtext_wrapper';
                    wrapper.className = 'rgraph_domtext_wrapper';

                    // The wrapper can be configured to hide or show the
                    // overflow with the textAccessibleOverflow option
                    wrapper.style.overflow = obj.properties.textAccessibleOverflow != false && obj.properties.textAccessibleOverflow != 'hidden' ? 'visible' : 'hidden';
                    
                    wrapper.style.width    = obj.canvas.offsetWidth + 'px';
                    wrapper.style.height   = obj.canvas.offsetHeight + 'px';

                    wrapper.style.cssFloat   = obj.canvas.style.cssFloat;
                    wrapper.style.display    = obj.canvas.style.display || 'inline-block';
                    wrapper.style.position   = obj.canvas.style.position || 'relative';
                    wrapper.style.left       = obj.canvas.style.left;
                    wrapper.style.top        = obj.canvas.style.top;
                    wrapper.style.width      = obj.canvas.width + 'px';
                    wrapper.style.height     = obj.canvas.height + 'px';
                    wrapper.style.lineHeight = 'initial';

                    obj.canvas.style.position      = 'absolute';
                    obj.canvas.style.left          = 0;
                    obj.canvas.style.top           = 0;
                    obj.canvas.style.display       = 'inline';
                    obj.canvas.style.cssFloat      = 'none';

                    
                    if ((obj.type === 'bar' || obj.type === 'bipolar' || obj.type === 'hbar') && obj.properties.variant === '3d') {
                        wrapper.style.transform = 'skewY(5.7deg)';
                    }

                obj.canvas.parentNode.insertBefore(wrapper, obj.canvas);
                
                // Remove the canvas from the DOM and put it in the wrapper
                obj.canvas.parentNode.removeChild(obj.canvas);
                wrapper.appendChild(obj.canvas);
                
                obj.canvas.rgraph_domtext_wrapper = wrapper;
                
                // TODO Add a subwrapper here

            } else {
                wrapper = obj.canvas.rgraph_domtext_wrapper;
            }



            var defaults = {
                size:   12,
                font:   'Arial',
                italic: 'normal',
                bold:   'normal',
                valign: 'bottom',
                halign: 'left',
                marker: true,
                color:  context.fillStyle,
                bounding: {
                    enabled:   false,
                    fill:      'rgba(255,255,255,0.7)',
                    stroke:    '#666',
                    linewidth: 1
                }
            }

            
            // Transform \n to the string [[RETURN]] which is then replaced
            // further down
            opt.text = String(opt.text).replace(/\r?\n/g, '[[RETURN]]');


            // Create the node cache array that nodes
            // already created are stored in
            if (typeof RGraph.text.domNodeCache === 'undefined') {
                RGraph.text.domNodeCache = new Array();
            }
            
            if (typeof RGraph.text.domNodeCache[obj.id] === 'undefined') {
                RGraph.text.domNodeCache[obj.id] = new Array();
            }

            // Create the dimension cache array that node
            // dimensions are stored in
            if (typeof RGraph.text.domNodeDimensionCache === 'undefined') {
                RGraph.text.domNodeDimensionCache = new Array();
            }
            
            if (typeof RGraph.text.domNodeDimensionCache[obj.id] === 'undefined') {
                RGraph.text.domNodeDimensionCache[obj.id] = new Array();
            }



            // Create the DOM node
            if (!RGraph.text.domNodeCache[obj.id] || !RGraph.text.domNodeCache[obj.id][cacheKey]) {

                var span = document.createElement('span');
                    span.style.position      = 'absolute';
                    span.style.display       = 'inline';
                    
                    span.className        =   ' rgraph_accessible_text'
                                            + ' rgraph_accessible_text_' + obj.id
                                            + ' rgraph_accessible_text_' + (opt.tag || '').replace(/\./, '_')
                                            + ' rgraph_accessible_text_' + obj.type;

                    span.style.left       = (opt.x * (parseInt(obj.canvas.offsetWidth) / parseInt(obj.canvas.width))) + 'px';
                    span.style.top        = (opt.y * (parseInt(obj.canvas.offsetHeight) / parseInt(obj.canvas.height)))  + 'px';
                    span.style.color      = opt.color || defaults.color;
                    span.style.fontFamily = opt.font || defaults.font;
                    span.style.fontWeight = opt.bold ? 'bold' : defaults.bold;
                    span.style.fontStyle  = opt.italic ? 'italic' : defaults.italic;
                    span.style.fontSize   = (opt.size || defaults.size) + 'pt';
                    span.style.whiteSpace = 'nowrap';
                    span.tag              = opt.tag;


                    // CSS angled text. This should be conasidered BETA quality code at the moment,
                    // but it seems to be OK. You may need to use the labelsOffsety when using this
                    // option.
                    if (typeof opt.angle === 'number' && opt.angle !== 0) {
                    
                        var coords = RGraph.measureText(
                            opt.text,
                            opt.bold,
                            opt.font,
                            opt.size
                        );
                    
                        //span.style.left = parseFloat(span.style.left) - coords[0] + 'px';
                        span.style.transformOrigin = '100% 50%';
                        span.style.transform       = 'rotate(' + opt.angle + 'deg)';
                    }




                    // Shadow
                    span.style.textShadow = '{1}px {2}px {3}px {4}'.format(
                        context.shadowOffsetX,
                        context.shadowOffsetY,
                        context.shadowBlur,
                        context.shadowColor
                    );


                    if (opt.bounding) {
                        span.style.border          = '1px solid ' + (opt['bounding.stroke'] || defaults.bounding.stroke);
                        span.style.backgroundColor = opt['bounding.fill'] || defaults.bounding.fill;
                        span.style.borderWidth     = typeof opt['bounding.linewidth'] === 'number' ? opt['bounding.linewidth'] : defaults.bounding.linewidth;
                    }
                    // Pointer events
                    if ((typeof obj.properties.textAccessiblePointerevents === 'undefined' ||
                        obj.properties.textAccessiblePointerevents) &&
                        obj.properties.textAccessiblePointerevents !== 'none') {
                        
                        span.style.pointerEvents =  'auto';
                    } else {
                        span.style.pointerEvents =  'none';
                    }

                    span.style.padding = opt.bounding ? '2px' : null; // Changed to 2px on 16th January 2019
                    span.__text__      = opt.text
                    span.innerHTML     = opt.text.replace('&', '&amp;')
                                                 .replace('<', '&lt;')
                                                 .replace('>', '&gt;');
                    
                    // Now replace the string [[RETURN]] with a <br />
                    span.innerHTML = span.innerHTML.replace(/\[\[RETURN\]\]/g, '<br />');

                wrapper.appendChild(span);

                // Alignment defaults
                opt.halign = opt.halign || 'left';
                opt.valign = opt.valign || 'bottom';
                
                // Horizontal alignment
                if (opt.halign === 'right') {
                    span.style.left      = parseFloat(span.style.left) - span.offsetWidth + 'px';
                    span.style.textAlign = 'right';
                } else if (opt.halign === 'center') {
                    span.style.left      = parseFloat(span.style.left) - (span.offsetWidth  / 2) + 'px';
                    span.style.textAlign = 'center';
                }
                
                // Vertical alignment
                if (opt.valign === 'top') {
                    // Nothing to do here
                } else if (opt.valign === 'center') {
                    span.style.top = parseFloat(span.style.top) - (span.offsetHeight / 2) + 'px';
                } else {
                    span.style.top = parseFloat(span.style.top) - span.offsetHeight + 'px';
                }
                        
                
                var offsetWidth  = parseFloat(span.offsetWidth),
                    offsetHeight = parseFloat(span.offsetHeight),
                    top          = parseFloat(span.style.top),
                    left         = parseFloat(span.style.left);

                RGraph.text.domNodeCache[obj.id][cacheKey] = span;
                RGraph.text.domNodeDimensionCache[obj.id][cacheKey] = {
                      left: left,
                       top: top,
                     width: offsetWidth,
                    height: offsetHeight
                };
                span.id = cacheKey;


            
            } else {
                span = RGraph.text.domNodeCache[obj.id][cacheKey];
                span.style.display = 'inline';
                
                var offsetWidth  = RGraph.text.domNodeDimensionCache[obj.id][cacheKey].width,
                    offsetHeight = RGraph.text.domNodeDimensionCache[obj.id][cacheKey].height,
                    top          = RGraph.text.domNodeDimensionCache[obj.id][cacheKey].top,
                    left         = RGraph.text.domNodeDimensionCache[obj.id][cacheKey].left;
            }


            

            
            
            // If requested, draw a marker to indicate the coords
            if (opt.marker) {
                RGraph.path(context, 'b m % % l % % m % % l % % s',
                    opt.x - 5, opt.y,
                    opt.x + 5, opt.y,
                    opt.x, opt.y - 5,
                    opt.x, opt.y + 5
                );
            }
            
            //
            // If its a drawing API text object then allow
            // for events and tooltips
            //
            if (obj.type === 'drawing.text') {

                // Mousemove
                if (obj.properties.eventsMousemove) {
                    span.addEventListener('mousemove', function (e) {(obj.properties.eventsMousemove)(e, obj);}, false);
                }
                
                // Click
                if (obj.properties.eventsClick) {
                    span.addEventListener('click', function (e) {(obj.properties.eventsClick)(e, obj);}, false);
                }
                
                // Tooltips
                if (obj.properties.tooltips) {
                    span.addEventListener(
                        obj.properties.tooltipsEvent.indexOf('mousemove') !== -1 ? 'mousemove' : 'click',
                        function (e)
                        {
                            if (   !RGraph.Registry.get('tooltip')
                                || RGraph.Registry.get('tooltip').__index__ !== 0
                                || RGraph.Registry.get('tooltip').__object__.uid != obj.uid
                               ) {
                               
                                RGraph.hideTooltip();
                                RGraph.redraw();
                                RGraph.tooltip(obj, obj.properties.tooltips[0], opt.x, opt.y, 0, e);
                            }
                        },
                        false
                    );
                }
            }

            // Build the return value
            var ret        = {};
                ret.x      = left;
                ret.y      = top;
                ret.width  = offsetWidth;
                ret.height = offsetHeight;
                ret.object = obj;
                ret.text   = opt.text;
                ret.tag    = opt.tag;

            
            // The reset() function clears the domNodeCache
            ////
            // @param object OPTIONAL You can pass in the canvas to limit the
            //                        clearing to that canvas.
            RGraph.text.domNodeCache.reset = function ()
            {
                // Limit the clearing to a single canvas tag
                if (arguments[0]) {
                    
                    if (typeof arguments[0] === 'string') {
                        var canvas = document.getElementById(arguments[0])
                    } else {
                        var canvas = arguments[0];
                    }

                    var nodes = RGraph.text.domNodeCache[canvas.id];

                    for (j in nodes) {
                        
                        var node = RGraph.text.domNodeCache[canvas.id][j];
                        
                        if (node && node.parentNode) {
                            node.parentNode.removeChild(node);
                        }
                    }
                    
                    RGraph.text.domNodeCache[canvas.id]          = [];
                    RGraph.text.domNodeDimensionCache[canvas.id] = [];

                // Clear all DOM text from all tags
                } else {
                    for (i in RGraph.text.domNodeCache) {
                        for (j in RGraph.text.domNodeCache[i]) {
                            if (RGraph.text.domNodeCache[i][j] && RGraph.text.domNodeCache[i][j].parentNode) {
                                RGraph.text.domNodeCache[i][j].parentNode.removeChild(RGraph.text.domNodeCache[i][j]);
                            }
                        }
                    }

                    RGraph.text.domNodeCache          = [];
                    RGraph.text.domNodeDimensionCache = [];
                }
            };




            //
            // Helps you get hold of the SPAN tag nodes that hold the text on the chart
            //
            RGraph.text.find = function (opt)
            {
                var span, nodes = [];
                
                if (opt.object && opt.object.isRGraph) {
                    var id = opt.object.id;
                } else if (opt.id) {
                    var id     = typeof opt.id === 'string' ? opt.id : opt.object.id;
                    opt.object = document.getElementById(id).__object__;
                } else {
                    alert('[RGRAPH] You Must give either an object or an ID to the RGraph.text.find() function');
                    return false;
                }

                for (i in RGraph.text.domNodeCache[id]) {
                
                    span = RGraph.text.domNodeCache[id][i];

                    // A full tag is given
                    if (typeof opt.tag === 'string' && opt.tag === span.tag) {
                        nodes.push(span);
                        continue;
                    }



                    // A regex is given as the tag
                    if (typeof opt.tag === 'object' && opt.tag.constructor.toString().indexOf('RegExp')) {

                        var regexp = new RegExp(opt.tag);

                        if (regexp.test(span.tag)) {
                            nodes.push(span);
                            continue;
                        }
                    }



                    // A full text is given
                    if (typeof opt.text === 'string' && opt.text === span.__text__) {
                        nodes.push(span);
                        continue;
                    }



                    // Regex for the text is given
                    // A regex is given as the tag
                    if (typeof opt.text === 'object' && opt.text.constructor.toString().indexOf('RegExp')) {

                        var regexp = new RegExp(opt.text);

                        if (regexp.test(span.__text__)) {
                            nodes.push(span);
                            
                        continue;
                        }
                    }
                }
                
                // If a callback has been specified then call it whilst
                // passing it the text
                if (typeof opt.callback === 'function') {
                    (opt.callback)({nodes: nodes, object:opt.object});
                }

                return nodes;
            };




            //
            // Add the SPAN tag to the return value
            //
            ret.node = span;


            //
            // Save and then return the details of the text (but oly
            // if it's an RGraph object that was given)
            //
            if (obj && obj.isRGraph && obj.coordsText) {
                obj.coordsText.push(ret);
            }


            return ret;
        }




        //
        // An RGraph object can be given, or a string or the 2D rendering context
        // The coords are placed on the obj.coordsText variable ONLY if it's an RGraph object. The function
        // still returns the cooords though in all cases.
        //
        if (obj && obj.isRGraph) {
            var obj     = obj;
            var canvas  = obj.canvas;
            var context = obj.context;
        
        } else if (typeof obj == 'string') {
            var canvas  = document.getElementById(obj);
            var context = canvas.getContext('2d');
            var obj     = canvas.__object__;
        
        } else if (typeof obj.getContext === 'function') {
            var canvas  = obj;
            var context = canvas.getContext('2d');
            var obj     = canvas.__object__;
        
        } else if (obj.toString().indexOf('CanvasRenderingContext2D') != -1 || RGraph.ISIE8 && obj.moveTo) {
            var context  = obj;
            var canvas   = obj.canvas;
            var obj      = canvas.__object__;

        // IE7/8
        } else if (RGraph.ISOLD && obj.fillText) {
            var context  = obj;
            var canvas   = obj.canvas;
            var obj      = canvas.__object__;
        }


        //
        // Changed the name of boundingFill/boundingStroke - this allows you to still use those names
        //

        if (typeof opt.boundingFill      === 'string') opt['bounding.fill']   = opt.boundingFill;
        if (typeof opt.boundingStroke    === 'string') opt['bounding.stroke'] = opt.boundingStroke;
        if (typeof opt.boundingLinewidth === 'number') opt['bounding.linewidth'] = opt.boundingLinewidth;







        if (typeof opt.accessible === 'undefined') {
            if (obj && obj.properties.textAccessible) {
                return domtext();
            }
        } else if (typeof opt.accessible === 'boolean' && opt.accessible) {
            return domtext();
        }




        var x              = opt.x,
            y              = opt.y,
            originalX      = x,
            originalY      = y,
            text           = opt.text,
            text_multiline = typeof text === 'string' ? text.split(/\r?\n/g) : '',
            numlines       = text_multiline.length,
            font           = opt.font ? opt.font : 'Arial',
            size           = opt.size ? opt.size : 10,
            size_pixels    = size * 1.5,
            bold           = opt.bold,
            italic         = opt.italic,
            halign         = opt.halign ? opt.halign : 'left',
            valign         = opt.valign ? opt.valign : 'bottom',
            tag            = typeof opt.tag == 'string' && opt.tag.length > 0 ? opt.tag : '',
            marker         = opt.marker,
            angle          = opt.angle || 0;




        var bounding                = opt.bounding,
            bounding_stroke         = opt['bounding.stroke'] ? opt['bounding.stroke'] : 'black',
            bounding_fill           = opt['bounding.fill'] ? opt['bounding.fill'] : 'rgba(255,255,255,0.7)',
            bounding_shadow         = opt['bounding.shadow'],
            bounding_shadow_color   = opt['bounding.shadow.color'] || '#ccc',
            bounding_shadow_blur    = opt['bounding.shadow.blur'] || 3,
            bounding_shadow_offsetx = opt['bounding.shadow.offsetx'] || 3,
            bounding_shadow_offsety = opt['bounding.shadow.offsety'] || 3,
            bounding_linewidth      = typeof opt['bounding.linewidth'] === 'number' ? opt['bounding.linewidth'] : 1;



        //
        // Initialize the return value to an empty object
        //
        var ret = {};
        
        //
        // Color
        //
        if (typeof opt.color === 'string') {
            var orig_fillstyle = context.fillStyle;
            context.fillStyle = opt.color;
        }



        //
        // The text arg must be a string or a number
        //
        if (typeof text == 'number') {
            text = String(text);
        }

        if (typeof text !== 'string') {
            return;
        }
        
        
        
        //
        // This facilitates vertical text
        //
        if (angle != 0) {
            context.save();
            context.translate(x, y);
            context.rotate((Math.PI / 180) * angle)
            x = 0;
            y = 0;
        }


        
        //
        // Set the font
        //
        context.font = (opt.italic ? 'italic ' : '') + (opt.bold ? 'bold ' : '') + size + 'pt ' + font;



        //
        // Measure the width/height. This must be done AFTER the font has been set
        //
        var width=0;
        for (var i=0; i<numlines; ++i) {
            width = Math.max(width, context.measureText(text_multiline[i]).width);
        }
        var height = size_pixels * numlines;




        //
        // Accommodate old MSIE 7/8
        //
        //if (document.all && RGraph.ISOLD) {
            //y += 2;
        //}



        //
        // If marker is specified draw a marker at the X/Y coordinates
        //
        if (opt.marker) {
            
            var marker_size = 10;
            var strokestyle = context.strokeStyle;
            
            context.beginPath();
                context.strokeStyle = 'red';
                context.moveTo(x, y - marker_size);
                context.lineTo(x, y + marker_size);
                context.moveTo(x - marker_size, y);
                context.lineTo(x + marker_size, y);
            context.stroke();
            context.strokeStyle = strokestyle;
        }



        //
        // Set the horizontal alignment
        //
        if (halign == 'center') {
            context.textAlign = 'center';
            var boundingX = x - 2 - (width / 2);
        } else if (halign == 'right') {
            context.textAlign = 'right';
            var boundingX = x - 2 - width;
        } else {
            context.textAlign = 'left';
            var boundingX = x - 2;
        }


        //
        // Set the vertical alignment
        //
        if (valign == 'center') {
            
            context.textBaseline = 'middle';
            // Move the text slightly
            y -= 1;
            
            y -= ((numlines - 1) / 2) * size_pixels;
            var boundingY = y - (size_pixels / 2) - 2;
        
        } else if (valign == 'top') {
            context.textBaseline = 'top';

            var boundingY = y - 2;

        } else {

            context.textBaseline = 'bottom';
            
            // Move the Y coord if multiline text
            if (numlines > 1) {
                y -= ((numlines - 1) * size_pixels);
            }

            var boundingY = y - size_pixels - 2;
        }
        
        var boundingW = width + 4;
        var boundingH = height + 4;



        //
        // Draw a bounding box if required
        //
        if (bounding) {

            var pre_bounding_linewidth     = context.lineWidth,
                pre_bounding_strokestyle   = context.strokeStyle,
                pre_bounding_fillstyle     = context.fillStyle,
                pre_bounding_shadowcolor   = context.shadowColor,
                pre_bounding_shadowblur    = context.shadowBlur,
                pre_bounding_shadowoffsetx = context.shadowOffsetX,
                pre_bounding_shadowoffsety = context.shadowOffsetY;

            context.lineWidth   = bounding_linewidth ? bounding_linewidth : 0.001;
            context.strokeStyle = bounding_stroke;
            context.fillStyle   = bounding_fill;

            if (bounding_shadow) {
                context.shadowColor   = bounding_shadow_color;
                context.shadowBlur    = bounding_shadow_blur;
                context.shadowOffsetX = bounding_shadow_offsetx;
                context.shadowOffsetY = bounding_shadow_offsety;
            }

            //obj.context.strokeRect(boundingX, boundingY, width + 6, (size_pixels * numlines) + 4);
            //obj.context.fillRect(boundingX, boundingY, width + 6, (size_pixels * numlines) + 4);
            context.fillRect(
                boundingX,
                boundingY,
                boundingW,
                boundingH
            );
            
            context.strokeRect(
                boundingX,
                boundingY,
                boundingW,
                boundingH
            );

            // Reset the linewidth,colors and shadow to it's original setting
            context.lineWidth     = pre_bounding_linewidth;
            context.strokeStyle   = pre_bounding_strokestyle;
            context.fillStyle     = pre_bounding_fillstyle;
            context.shadowColor   = pre_bounding_shadowcolor
            context.shadowBlur    = pre_bounding_shadowblur
            context.shadowOffsetX = pre_bounding_shadowoffsetx
            context.shadowOffsetY = pre_bounding_shadowoffsety
        }

        
        
        //
        // Draw the text
        //
        if (numlines > 1) {
            for (var i=0; i<numlines; ++i) {
                context.fillText(text_multiline[i], x, y + (size_pixels * i));
            }
        } else {
            context.fillText(text, x + 0.5, y + 0.5);
        }
        
        
        
        //
        // If the text is at 90 degrees restore() the canvas - getting rid of the rotation
        // and the translate that we did
        //
        if (angle != 0) {
            if (angle == 90) {
                if (halign == 'left') {
                    if (valign == 'bottom') {boundingX = originalX - 2; boundingY = originalY - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'center') {boundingX = originalX - (height / 2) - 2; boundingY = originalY - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'top')    {boundingX = originalX - height - 2; boundingY = originalY - 2; boundingW = height + 4; boundingH = width + 4;}
                
                } else if (halign == 'center') {
                    if (valign == 'bottom') {boundingX = originalX - 2; boundingY = originalY - (width / 2) - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'center') {boundingX = originalX - (height / 2) -  2; boundingY = originalY - (width / 2) - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'top')    {boundingX = originalX - height -  2; boundingY = originalY - (width / 2) - 2; boundingW = height + 4; boundingH = width + 4;}
                
                } else if (halign == 'right') {
                    if (valign == 'bottom') {boundingX = originalX - 2; boundingY = originalY - width - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'center') {boundingX = originalX - (height / 2) - 2; boundingY = originalY - width - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'top')    {boundingX = originalX - height - 2; boundingY = originalY - width - 2; boundingW = height + 4; boundingH = width + 4;}
                }

            } else if (angle == 180) {

                if (halign == 'left') {
                    if (valign == 'bottom') {boundingX = originalX - width - 2; boundingY = originalY - 2; boundingW = width + 4; boundingH = height + 4;}
                    if (valign == 'center') {boundingX = originalX - width - 2; boundingY = originalY - (height / 2) - 2; boundingW = width + 4; boundingH = height + 4;}
                    if (valign == 'top')    {boundingX = originalX - width - 2; boundingY = originalY - height - 2; boundingW = width + 4; boundingH = height + 4;}
                
                } else if (halign == 'center') {
                    if (valign == 'bottom') {boundingX = originalX - (width / 2) - 2; boundingY = originalY - 2; boundingW = width + 4; boundingH = height + 4;}
                    if (valign == 'center') {boundingX = originalX - (width / 2) - 2; boundingY = originalY - (height / 2) - 2; boundingW = width + 4; boundingH = height + 4;}
                    if (valign == 'top')    {boundingX = originalX - (width / 2) - 2; boundingY = originalY - height - 2; boundingW = width + 4; boundingH = height + 4;}
                
                } else if (halign == 'right') {
                    if (valign == 'bottom') {boundingX = originalX - 2; boundingY = originalY - 2; boundingW = width + 4; boundingH = height + 4;}
                    if (valign == 'center') {boundingX = originalX - 2; boundingY = originalY - (height / 2) - 2; boundingW = width + 4; boundingH = height + 4;}
                    if (valign == 'top')    {boundingX = originalX - 2; boundingY = originalY - height - 2; boundingW = width + 4; boundingH = height + 4;}
                }
            
            } else if (angle == 270) {

                if (halign == 'left') {
                    if (valign == 'bottom') {boundingX = originalX - height - 2; boundingY = originalY - width - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'center') {boundingX = originalX - (height / 2) - 4; boundingY = originalY - width - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'top')    {boundingX = originalX - 2; boundingY = originalY - width - 2; boundingW = height + 4; boundingH = width + 4;}
                
                } else if (halign == 'center') {
                    if (valign == 'bottom') {boundingX = originalX - height - 2; boundingY = originalY - (width/2) - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'center') {boundingX = originalX - (height/2) - 4; boundingY = originalY - (width/2) - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'top')    {boundingX = originalX - 2; boundingY = originalY - (width/2) - 2; boundingW = height + 4; boundingH = width + 4;}
                
                } else if (halign == 'right') {
                    if (valign == 'bottom') {boundingX = originalX - height - 2; boundingY = originalY - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'center') {boundingX = originalX - (height/2) - 2; boundingY = originalY - 2; boundingW = height + 4; boundingH = width + 4;}
                    if (valign == 'top')    {boundingX = originalX - 2; boundingY = originalY - 2; boundingW = height + 4; boundingH = width + 4;}
                }
            }

            context.restore();
        }




        //
        // Reset the text alignment so that text rendered after this text function is not affected
        //
        context.textBaseline = 'alphabetic';
        context.textAlign    = 'left';





        //
        // Fill the ret variable with details of the text
        //
        ret.x      = boundingX;
        ret.y      = boundingY;
        ret.width  = boundingW;
        ret.height = boundingH
        ret.object = obj;
        ret.text   = text;
        ret.tag    = tag;



        //
        // Save and then return the details of the text (but oly
        // if it's an RGraph object that was given)
        //
        if (obj && obj.isRGraph && obj.coordsText) {
            obj.coordsText.push(ret);
        }
        
        //
        // Restore the original fillstyle
        //
        if (typeof orig_fillstyle === 'string') {
            context.fillStyle = orig_fillstyle;
        }

        return ret;
    };
    
    // Create the DEFAULTS object
    RGraph.text.defaults = {};








    //
    // Takes a sequential index abd returns the group/index variation of it. Eg if you have a
    // sequential index from a grouped bar chart this function can be used to convert that into
    // an appropriate group/index combination
    // 
    // @param nindex number The sequential index
    // @param data   array  The original data (which is grouped)
    // @return              The group/index information
    //
    RGraph.sequentialIndexToGrouped = function (index, data)
    {
        var group         = 0;
        var grouped_index = 0;

        while (--index >= 0) {

            if (RGraph.is_null(data[group])) {
                group++;
                grouped_index = 0;
                continue;
            }

            // Allow for numbers as well as arrays in the dataset
            if (typeof data[group] == 'number') {
                group++
                grouped_index = 0;
                continue;
            }
            

            grouped_index++;
            
            if (grouped_index >= data[group].length) {
                group++;
                grouped_index = 0;
            }
        }
        
        return [group, grouped_index];
    };








    //
    // This function highlights a rectangle
    // 
    // @param object obj    The chart object
    // @param number shape  The coordinates of the rect to highlight
    //
    RGraph.Highlight.rect =
    RGraph.Highlight.Rect = function (obj, shape)
    {
        var prop = obj.properties;

        if (prop.tooltipsHighlight) {
            
        
            // Safari seems to need this
            obj.context.lineWidth = 1;


            //
            // Draw a rectangle on the canvas to highlight the appropriate area
            //
            obj.context.beginPath();

                obj.context.strokeStyle = prop.highlightStroke;
                obj.context.fillStyle   = prop.highlightFill;
    
                obj.context.rect(shape['x'],shape['y'],shape['width'],shape['height']);
                //obj.context.fillRect(shape['x'],shape['y'],shape['width'],shape['height']);
            obj.context.stroke();
            obj.context.fill();
        }
    };




    //
    // This function highlights a point
    // 
    // @param object obj    The chart object
    // @param number shape  The coordinates of the rect to highlight
    //
    RGraph.Highlight.point =
    RGraph.Highlight.Point = function (obj, shape)
    {
        var prop = obj.properties;

        if (prop.tooltipsHighlight) {
    
            //
            // Draw a rectangle on the canvas to highlight the appropriate area
            //
            obj.context.beginPath();
                obj.context.strokeStyle = prop.highlightStroke;
                obj.context.fillStyle   = prop.highlightFill;
                var radius   = prop.highlightPointRadius || 2;
                obj.context.arc(shape['x'],shape['y'],radius, 0, RGraph.TWOPI, 0);
            obj.context.stroke();
            obj.context.fill();
        }
    };








    //
    // A better, more flexible, date parsing function that
    // was taken from the SVG libraries.
    //
    //@param  string str The string to parse
    //@return number     A number, as returned by Date.parse()
    //
    RGraph.parseDate = function (str)
    {
        // First off - remove the T from the format: YYYY-MM-DDTHH:MM:SS
        if (str.match(/^\d\d\d\d-\d\d-\d\d(t|T)\d\d:\d\d(:\d\d)?$/)) {
            str = str.toUpperCase().replace(/T/, ' ');
        }


        var d = new Date();

        // Initialise the default values
        var defaults = {
            seconds: '00',
            minutes: '00',
              hours: '00',
               date: d.getDate(),
              month: d.getMonth() + 1,
               year: d.getFullYear()
        };

        // Create the months array for turning textual months back to numbers
        var months       = ['january','february','march','april','may','june','july','august','september','october','november','december'],
            months_regex = months.join('|');

        for (var i=0; i<months.length; ++i) {
            months[months[i]] = i;
            months[months[i].substring(0,3)] = i;
            months_regex = months_regex + '|' + months[i].substring(0,3);
        }

        // These are the seperators allowable for d/m/y and y/m/d dates
        // (Its part of a regexp so the position of the square brackets
        //  is crucial)
        var sep = '[-./_=+~#:;,]+';


        // Tokenise the string
        var tokens = str.split(/ +/);

        // Loop through each token checking what it is
        for (var i=0,len=tokens.length; i<len; ++i) {
            if (tokens[i]) {
                
                // Year
                if (tokens[i].match(/^\d\d\d\d$/)) {
                    defaults.year = tokens[i];
                }

                // Month
                var res = isMonth(tokens[i]);
                if (typeof res === 'number') {
                    defaults.month = res + 1; // Months are zero indexed
                }

                // Date
                if (tokens[i].match(/^\d?\d(?:st|nd|rd|th)?$/)) {
                    defaults.date = parseInt(tokens[i]);
                }

                // Time
                if (tokens[i].match(/^(\d\d):(\d\d):?(?:(\d\d))?$/)) {
                    defaults.hours   = parseInt(RegExp.$1);
                    defaults.minutes = parseInt(RegExp.$2);
                    
                    if (RegExp.$3) {
                        defaults.seconds = parseInt(RegExp.$3);
                    }
                }

                // Dateformat: XXXX-XX-XX
                if (tokens[i].match(new RegExp('^(\\d\\d\\d\\d)' + sep + '(\\d\\d)' + sep + '(\\d\\d)$', 'i'))) {
                    defaults.date  = parseInt(RegExp.$3);
                    defaults.month = parseInt(RegExp.$2);
                    defaults.year  = parseInt(RegExp.$1);

                }

                // Dateformat: XX-XX-XXXX
                if (tokens[i].match(new RegExp('^(\\d\\d)' + sep + '(\\d\\d)' + sep + '(\\d\\d\\d\\d)$','i') )) {
                    defaults.date  = parseInt(RegExp.$1);
                    defaults.month = parseInt(RegExp.$2);
                    defaults.year  = parseInt(RegExp.$3);
                }
            }
        }

        // Now put the defaults into a format thats recognised by Date.parse()
        str = '{1}/{2}/{3} {4}:{5}:{6}'.format(
            defaults.year,
            String(defaults.month).length     === 1 ? '0' + (defaults.month) : defaults.month,
            String(defaults.date).length      === 1 ? '0' + (defaults.date)      : defaults.date,
            String(defaults.hours).length     === 1 ? '0' + (defaults.hours)     : defaults.hours,
            String(defaults.minutes).length   === 1 ? '0' + (defaults.minutes)   : defaults.minutes,
            String(defaults.seconds).length   === 1 ? '0' + (defaults.seconds)   : defaults.seconds
        );

        return Date.parse(str);

        //
        // Support functions
        //
        function isMonth(str)
        {
            var res = str.toLowerCase().match(months_regex);

            return res ? months[res[0]] : false;
        }
    };








    //
    // This is the same as Date.parse - though a little more flexible.
    // 
    // @param string str The date string to parse
    // @return Returns the same thing as Date.parse
    //
    RGraph.parseDateOld = function (str)
    {
        str = RGraph.trim(str);

        // Allow for: now (just the word "now")
        if (str === 'now') {
            str = (new Date()).toString();
        }


        // Allow for: 22-11-2013
        // Allow for: 22/11/2013
        // Allow for: 22-11-2013 12:09:09
        // Allow for: 22/11/2013 12:09:09
        if (str.match(/^(\d\d)(?:-|\/)(\d\d)(?:-|\/)(\d\d\d\d)(.*)$/)) {
            str = '{1}/{2}/{3}{4}'.format(
                RegExp.$3,
                RegExp.$2,
                RegExp.$1,
                RegExp.$4
            );
        }

        // Allow for: 2013-11-22 12:12:12 or  2013/11/22 12:12:12
        if (str.match(/^(\d\d\d\d)(-|\/)(\d\d)(-|\/)(\d\d)( |T)(\d\d):(\d\d):(\d\d)$/)) {
            str = RegExp.$1 + '-' + RegExp.$3 + '-' + RegExp.$5 + 'T' + RegExp.$7 + ':' + RegExp.$8 + ':' + RegExp.$9;
        }

        // Allow for: 2013-11-22
        if (str.match(/^\d\d\d\d-\d\d-\d\d$/)) {
            str = str.replace(/-/g, '/');
        }


        // Allow for: 12:09:44 (time only using todays date)
        if (str.match(/^\d\d:\d\d:\d\d$/)) {
        
            var dateObj  = new Date();
            var date     = dateObj.getDate();
            var month    = dateObj.getMonth() + 1;
            var year     = dateObj.getFullYear();
            
            // Pad the date/month with a zero if it's not two characters
            if (String(month).length === 1) month = '0' + month;
            if (String(date).length === 1) date = '0' + date;

            str = (year + '/' + month + '/' + date) + ' ' + str;
        }

        return Date.parse(str);
    };








    //
    // Reset all of the color values to their original values
    // 
    // @param object
    //
    RGraph.resetColorsToOriginalValues = function (obj)
    {
        if (obj.original_colors) {
            // Reset the colors to their original values
            for (var j in obj.original_colors) {
                if (typeof j === 'string') {// TAKEN OUT 1st AUGUST && j.substr(0,6) === 'chart.'
                    obj.properties[j] = RGraph.arrayClone(obj.original_colors[j]);
                }
            }
        }



        //
        // If the function is present on the object to reset specific colors - use that
        //
        if (typeof obj.resetColorsToOriginalValues === 'function') {
            obj.resetColorsToOriginalValues();
        }



        // Reset the colorsParsed flag so that they're parsed for gradients again
        obj.colorsParsed = false;
    };








    //
    // Creates a Linear gradient
    // 
    // @param object obj The chart object
    // @param number x1 The start X coordinate
    // @param number x2 The end X coordinate
    // @param number y1 The start Y coordinate
    // @param number y2 The end Y coordinate
    // @param string color1 The start color
    // @param string color2 The end color
    //
    RGraph.linearGradient =
    RGraph.LinearGradient = function (obj, x1, y1, x2, y2, color1, color2)
    {
        var gradient = obj.context.createLinearGradient(x1, y1, x2, y2);
        var numColors=arguments.length-5;
        
        for (var i=5; i<arguments.length; ++i) {
            
            var color = arguments[i];
            var stop = (i - 5) / (numColors - 1);
            
            gradient.addColorStop(stop, color);
        }
        
        return gradient;
    };







    
    //
    // Creates a Radial gradient
    // 
    // @param object obj The chart object
    // @param number x1 The start X coordinate
    // @param number x2 The end X coordinate
    // @param number y1 The start Y coordinate
    // @param number y2 The end Y coordinate
    // @param string color1 The start color
    // @param string color2 The end color
    //
    RGraph.radialGradient =
    RGraph.RadialGradient = function(obj, x1, y1, r1, x2, y2, r2, color1, color2)
    {
        var gradient  = obj.context.createRadialGradient(x1, y1, r1, x2, y2, r2);
        var numColors = arguments.length-7;
        
        for(var i=7; i<arguments.length; ++i) {
            
            var color = arguments[i];
            var stop  = (i-7) / (numColors-1);
            
            gradient.addColorStop(stop, color);
        }
        
        return gradient;
    };








    //
    // Adds an event listener to RGraphs internal array so that RGraph can track them.
    // This DOESN'T add the event listener to the canvas/window.
    // 
    // 5/1/14 TODO Used in the tooltips file, but is it necessary any more?
    //
    RGraph.addEventListener =
    RGraph.AddEventListener = function (id, e, func)
    {
        var type = arguments[3] ? arguments[3] : 'unknown';
        
        RGraph.Registry.get('event.handlers').push([id,e,func,type]);
    };








    //
    // Clears event listeners that have been installed by RGraph
    // 
    // @param string id The ID of the canvas to clear event listeners for - or 'window' to clear
    //                  the event listeners attached to the window
    //
    RGraph.clearEventListeners =
    RGraph.ClearEventListeners = function(id)
    {
        if (id && id == 'window') {
        
            window.removeEventListener('mousedown', window.__rgraph_mousedown_event_listener_installed__, false);
            window.removeEventListener('mouseup', window.__rgraph_mouseup_event_listener_installed__, false);
        
        } else {
            
            var canvas = document.getElementById(id);
            
            canvas.removeEventListener('mouseup', canvas.__rgraph_mouseup_event_listener_installed__, false);
            canvas.removeEventListener('mousemove', canvas.__rgraph_mousemove_event_listener_installed__, false);
            canvas.removeEventListener('mousedown', canvas.__rgraph_mousedown_event_listener_installed__, false);
            canvas.removeEventListener('click', canvas.__rgraph_click_event_listener_installed__, false);
        }
    };








    //
    // Hides the annotating palette. It's here because it can be called
    // from code other than the annotating code.
    //
    RGraph.hidePalette =
    RGraph.HidePalette = function ()
    {
        var div = RGraph.Registry.get('palette');
        
        if(typeof div == 'object' && div) {
            
            div.style.visibility = 'hidden';
            div.style.display = 'none';
            
            RGraph.Registry.set('palette', null);
        }
    };








    //
    // Generates a random number between the minimum and maximum
    // 
    // @param number min The minimum value
    // @param number max The maximum value
    // @param number     OPTIONAL Number of decimal places
    //
    RGraph.random = function (min, max)
    {
        var dp = arguments[2] ? arguments[2] : 0;
        var r  = Math.random();
        
        return Number((((max - min) * r) + min).toFixed(dp));
    };








    //
    // 
    //
    RGraph.arrayRand =
    RGraph.arrayRandom =
    RGraph.random.array = function (num, min, max)
    {
        for(var i=0,arr=[]; i<num; i+=1) {
            arr.push(RGraph.random(min,max, arguments[3]));
        }
        
        return arr;
    };








    //
    // Turns off shadow by setting blur to zero, the offsets to zero and the color to transparent black.
    // 
    // @param object obj The chart object
    //
    RGraph.noShadow =
    RGraph.NoShadow = function (obj)
    {

        obj.context.shadowColor   = 'rgba(0,0,0,0)';
        obj.context.shadowBlur    = 0;
        obj.context.shadowOffsetx = 0;
        obj.context.shadowOffsety = 0;
    };








    //
    // Sets the various shadow properties
    // 
    // @param object obj     The chart object
    // @param string color   The color of the shadow
    // @param number offsetx The offsetX value for the shadow
    // @param number offsety The offsetY value for the shadow
    // @param number blur    The blurring value for the shadow
    //
    RGraph.setShadow =
    RGraph.SetShadow = function (opt)
    {
        // 1 Argument
        if (   typeof opt === 'object'
            && typeof opt.object === 'object'
            && typeof opt.object.isRGraph
            && typeof opt.prefix === 'string'
           ) {
            var obj = opt.object;

            obj.context.shadowColor   = obj.properties[opt.prefix + 'Color'];
            obj.context.shadowOffsetX = obj.properties[opt.prefix + 'Offsetx'];
            obj.context.shadowOffsetY = obj.properties[opt.prefix + 'Offsety'];
            obj.context.shadowBlur    = obj.properties[opt.prefix + 'Blur'];

        // Turn Off the shadow
        } else if (   arguments.length === 1
                   && typeof arguments[0] === 'object'
                   && typeof arguments[0].isRGraph) {
            
            var obj = arguments[0];

            obj.context.shadowColor   = 'rgba(0,0,0,0)';
            obj.context.shadowOffsetX = 0;
            obj.context.shadowOffsetY = 0;
            obj.context.shadowBlur    = 0;

        // Separate arguments
        } else {

            var obj = arguments[0];
    
            obj.context.shadowColor   = arguments[1];
            obj.context.shadowOffsetX = arguments[2];
            obj.context.shadowOffsetY = arguments[3];
            obj.context.shadowBlur    = arguments[4];
        }
    };







    //
    // Sets an object in the RGraph registry
    // 
    // @param string name The name of the value to set
    //
    RGraph.Registry.set =
    RGraph.Registry.Set = function (name, value)
    {
        // Convert uppercase letters to dot+lower case letter
        name = name.replace(/([A-Z])/g, function (str)
        {
            return '.' + String(RegExp.$1).toLowerCase();
        });

        RGraph.Registry.store[name] = value;
        
        return value;
    };








    //
    // Gets an object from the RGraph registry
    // 
    // @param string name The name of the value to fetch
    //
    RGraph.Registry.get =
    RGraph.Registry.Get = function (name)
    {
        // Convert uppercase letters to dot+lower case letter
        name = name.replace(/([A-Z])/g, function (str)
        {
            return '.' + String(RegExp.$1).toLowerCase();
        });


        return RGraph.Registry.store[name];
    };








    //
    // Converts the given number of degrees to radians. Angles in canvas are
    // measured in radians. There are a .toDegrees() function and a toRadians()
    // function too.
    // 
    // @param number deg The value to convert
    //
    RGraph.degrees2Radians = function (deg)
    {
        return deg * (RGraph.PI / 180);
    };
    
    // Usage RGraph.toRadians(360) // 6.28
    RGraph.toRadians = function (degrees)
    {
        return degrees * (RGraph.PI / 180);
    };

    // Usage: RGraph.toDegrees(3.14) // 180ish
    RGraph.toDegrees = function (radians)
    {
        return radians * (180 / Math.PI);
    };








    //
    // Generates logs for... log charts
    // 
    // @param number n    The number to generate the log for
    // @param number base The base to use
    //
    RGraph.log = function (n,base)
    {
        return Math.log(n) / (base ? Math.log(base) : 1);
    };








    //
    // Determines if the given object is an array or not
    // 
    // @param mixed obj The variable to test
    //
    RGraph.isArray =
    RGraph.is_array = function (obj)
    {
        if (obj && obj.constructor) {
            var pos = obj.constructor.toString().indexOf('Array');
        } else {
            return false;
        }

        return obj != null &&
               typeof pos === 'number' &&
               pos > 0 &&
               pos < 20;
    };








    //
    // Removes white-space from the start aqnd end of a string
    // 
    // @param string str The string to trim
    //
    RGraph.trim = function (str)
    {
        return RGraph.ltrim(RGraph.rtrim(str));
    };








    //
    // Trims the white-space from the start of a string
    // 
    // @param string str The string to trim
    //
    RGraph.ltrim = function (str)
    {
        return str.replace(/^(\s|\0)+/, '');
    };








    //
    // Trims the white-space off of the end of a string
    // 
    // @param string str The string to trim
    //
    RGraph.rtrim = function (str)
    {
        return str.replace(/(\s|\0)+$/, '');
    };








    //
    // Returns true/false as to whether the given variable is null or not
    // 
    // @param mixed arg The argument to check
    //
    RGraph.isNull =
    RGraph.is_null = function (arg)
    {
        // must BE DOUBLE EQUALS - NOT TRIPLE
        if (arg == null || typeof arg === 'object' && !arg) {
            return true;
        }
        
        return false;
    };








    //
    // This function facilitates a very limited way of making your charts
    // whilst letting the rest of page continue - using  the setTimeout function
    // 
    // @param function func The function to run that creates the chart
    //
    RGraph.async =
    RGraph.Async = function (func)
    {
        return setTimeout(func, arguments[1] ? arguments[1] : 1);
    };








    //
    // Resets (more than just clears) the canvas and clears any pertinent objects
    // from the ObjectRegistry
    // 
    // @param object canvas The canvas object (as returned by document.getElementById() ).
    //
    RGraph.reset =
    RGraph.Reset = function (canvas)
    {
        canvas.width = canvas.width;
        
        RGraph.ObjectRegistry.clear(canvas);
        
        canvas.__rgraph_aa_translated__ = false;

        if (RGraph.text.domNodeCache && RGraph.text.domNodeCache.reset) {
            RGraph.text.domNodeCache.reset(canvas);
        }

        // Create the node and dimension caches if they don't already exist
        if (!RGraph.text.domNodeCache)          { RGraph.text.domNodeCache          = []; }
        if (!RGraph.text.domNodeDimensionCache) { RGraph.text.domNodeDimensionCache = []; }

        // Create/reset the specific canvas arrays in the caches
        RGraph.text.domNodeCache[canvas.id]          = [];
        RGraph.text.domNodeDimensionCache[canvas.id] = [];
    };








    //
    // This function is due to be removed.
    // 
    // @param string id The ID of what can be either the canvas tag or a DIV tag
    //
    RGraph.getCanvasTag = function (id)
    {
        id = typeof id === 'object' ? id.id : id;
        var canvas = doc.getElementById(id);

        return [id, canvas];
    };








    //
    // A wrapper function that encapsulate requestAnimationFrame
    // 
    // @param function func The animation function
    //
    RGraph.Effects.updateCanvas =
    RGraph.Effects.UpdateCanvas = function (func)
    {
        win.requestAnimationFrame =    win.requestAnimationFrame
                                    || win.webkitRequestAnimationFrame
                                    || win.msRequestAnimationFrame
                                    || win.mozRequestAnimationFrame
                                    || (function (func){setTimeout(func, 16.666);});
        
        win.requestAnimationFrame(func);
    };








    //
    // This function returns an easing multiplier for effects so they eas out towards the
    // end of the effect.
    // 
    // @param number frames The total number of frames
    // @param number frame  The frame number
    //
    RGraph.Effects.getEasingMultiplier = function (frames, frame)
    {
        return Math.pow(Math.sin((frame / frames) * RGraph.HALFPI), 3);
    };








    //
    // This function converts an array of strings to an array of numbers. Its used by the meter/gauge
    // style charts so that if you want you can pass in a string. It supports various formats:
    // 
    // '45.2'
    // '-45.2'
    // ['45.2']
    // ['-45.2']
    // '45.2,45.2,45.2' // A CSV style string
    // 
    // @param number frames The string or array to parse
    //
    RGraph.stringsToNumbers = function (str)
    {
        // An optional seperator to use intead of a comma
        var sep = arguments[1] || ',';
        
        
        // If it's already a number just return it
        if (typeof str === 'number') {
            return str;
        }





        if (typeof str === 'string') {
            if (str.indexOf(sep) != -1) {
                str = str.split(sep);
            } else {
                str = parseFloat(str);
            }
        }





        if (typeof str === 'object' && !RGraph.isNull(str)) {
            for (var i=0,len=str.length; i<len; i+=1) {
                str[i] = parseFloat(str[i]);
            }
        }

        return str;
    };








    //
    // Drawing cache function. This function creates an off-screen canvas and draws [wwhatever] to it
    // and then subsequent calls use that  instead of repeatedly drawing the same thing.
    // 
    // @param object   obj  The graph object
    // @param string   id   An ID string used to identify the relevant entry in the cache
    // @param function func The drawing function. This will be called to do the draw.
    //
    RGraph.cachedDraw = function (obj, id, func)
    {



        /////////////////////////////////////////
        //
        // This bypasses caching entirely:
        //
        // func(obj, obj.canvas, obj.context);
        // return;
        //
        /////////////////////////////////////////





        //If the cache entry exists - just copy it across to the main canvas
        if (!RGraph.cache[id]) {

            RGraph.cache[id] = {};

            RGraph.cache[id].object = obj;
            RGraph.cache[id].canvas = document.createElement('canvas');

            RGraph.cache[id].canvas.setAttribute('width', obj.canvas.width);
            RGraph.cache[id].canvas.setAttribute('height', obj.canvas.height);
            RGraph.cache[id].canvas.setAttribute('id', 'background_cached_canvas' + obj.canvas.id);

            RGraph.cache[id].canvas.__object__ = obj;
            RGraph.cache[id].context = RGraph.cache[id].canvas.getContext('2d');
            
            // Antialiasing on the cache canvas
            RGraph.cache[id].context.translate(0.5,0.5);

            // Call the function
            func(obj, RGraph.cache[id].canvas, RGraph.cache[id].context);
        }

        // Now copy the contents of the cached canvas over to the main one.
        // The coordinates are -0.5 because of the anti-aliasing effect in
        // use on the main canvas
        obj.context.drawImage(RGraph.cache[id].canvas,-0.5,-0.5);
    };








    //
    // The function that runs through the supplied configuration and
    // converts it to the RGraph stylee.
    // 
    // @param object conf The config
    // @param object      The settings for the object
    //
    RGraph.parseObjectStyleConfig = function (obj, config)
    {
        for (var i in config) {
            if (typeof i === 'string') {
                obj.set(i, config[i]);
            }
        }
    };








    //
    // This function is a short-cut for the canvas path syntax (which can be rather
    // verbose). You can read a description of it (which details all of the
    // various options) on the RGraph blog (www.rgraph.net/blog). The function is
    // added to the CanvasRenderingContext2D object so it becomes a context function.
    // 
    // So you can use it like these examples show:
    // 
    // 1. RGraph.path(context, 'b r 0 0 50 50 f red');
    // 2. RGraph.path(context, 'b a 50 50 50 0 3.14 false f red');
    // 3. RGraph.path(context, 'b m 5 100 bc 5 0 100 0 100 100 s red');
    // 4. RGraph.path(context, 'b m 5 100 at 50 0 95 100 50 s red');
    // 5. RGraph.path(context, 'sa b r 0 0 50 50 c b r 5 5 590 240 f red rs');
    // 6. RGraph.path(context, 'ld [2,6] ldo 4 b r 5 5 590 240 f red');
    // 7. RGraph.path(context, 'ga 0.25 b r 5 5 590 240 f red');
    // 
    // @param   array p  The path details
    //
    RGraph.path =
    RGraph.path2 = function (opt)
    {
        var arguments = Array.prototype.slice.call(arguments);

        // Allow a single arg to be passed as well as multiple

        // Object is passed
        if (arguments.length === 1 && opt.object && opt.path) {
            var context = opt.object.context;
            var p       = opt.path;
            var args    = opt.args;
        
        // Context is passed
        } else if (arguments.length === 1 && opt.context && opt.path) {
            var context  = opt.context;
            var p        = opt.path;
            var args     = opt.args;
        
        // Multiple args, object given
        } else if (arguments.length >= 2 && arguments[0].isRGraph && arguments[0].context) {
            var context = arguments[0].context;
            var p       = arguments[1];
            var args    = arguments.length > 2 ? arguments.slice(2) : [];
        
        // Multiple args, context given
        } else if (arguments.length >= 2 && arguments[0].toString().indexOf('Context')) {
            var context   = arguments[0];
            var p         = arguments[1];
            var args      = arguments.length > 2 ? arguments.slice(2) : [];
        }

        
        // If the path was a string - split it then collapse quoted bits together
        if (typeof p === 'string') {
            p = splitstring(p);
        }

        // Store the last path on the RGraph object
        RGraph.path.last = RGraph.arrayClone(p);

        // Go through the path information.
        for (var i=0,len=p.length; i<len; i+=1) {

            switch (p[i]) {
                case 'b':context.beginPath();break;
                case 'c':context.closePath();break;
                case 'm':context.moveTo(parseFloat(p[i+1]),parseFloat(p[i+2]));i+=2;break;
                case 'l':context.lineTo(parseFloat(p[i+1]),parseFloat(p[i+2]));i+=2;break;
                case 's':if(p[i+1])context.strokeStyle=p[i+1];context.stroke();i++;break;
                case 'f':if(p[i+1]){context.fillStyle=p[i+1];}context.fill();i++;break;
                case 'qc':context.quadraticCurveTo(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]));i+=4;break;
                case 'bc':context.bezierCurveTo(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]),parseFloat(p[i+5]),parseFloat(p[i+6]));i+=6;break;
                case 'r':context.rect(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]));i+=4;break;
                case 'a':context.arc(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]),parseFloat(p[i+5]),p[i+6]==='true'||p[i+6]===true||p[i+6]===1||p[i+6]==='1'?true:false);i+=6;break;
                case 'at':context.arcTo(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]),parseFloat(p[i+5]));i+=5;break;
                case 'lw':context.lineWidth=parseFloat(p[i+1]);i++;break;
                case 'e':context.ellipse(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]),parseFloat(p[i+5]),parseFloat(p[i+6]),parseFloat(p[i+7]),p[i+8] === 'true' ? true : false);i+=8;break;
                case 'lj':context.lineJoin=p[i+1];i++;break;
                case 'lc':context.lineCap=p[i+1];i++;break;
                case 'sc':context.shadowColor=p[i+1];i++;break;
                case 'sb':context.shadowBlur=parseFloat(p[i+1]);i++;break;
                case 'sx':context.shadowOffsetX=parseFloat(p[i+1]);i++;break;
                case 'sy':context.shadowOffsetY=parseFloat(p[i+1]);i++;break;
                case 'fs':context.fillStyle=p[i+1];i++;break;
                case 'ss':context.strokeStyle=p[i+1];i++;break;
                case 'fr':context.fillRect(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]));i+=4;break;
                case 'sr':context.strokeRect(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]));i+=4;break;
                case 'cl':context.clip();break;
                case 'sa':context.save();break;
                case 'rs':context.restore();break;
                case 'tr':context.translate(parseFloat(p[i+1]),parseFloat(p[i+2]));i+=2;break;
                case 'sl':context.scale(parseFloat(p[i+1]), parseFloat(p[i+2]));i+=2;break;
                case 'ro':context.rotate(parseFloat(p[i+1]));i++;break;
                case 'tf':context.transform(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]),parseFloat(p[i+5]),parseFloat(p[i+6]));i+=6;break;
                case 'stf':context.setTransform(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]),parseFloat(p[i+5]),parseFloat(p[i+6]));i+=6;break;
                case 'cr':context.clearRect(parseFloat(p[i+1]),parseFloat(p[i+2]),parseFloat(p[i+3]),parseFloat(p[i+4]));i+=4;break;
                case 'ld':var parts = p[i+1];context.setLineDash(parts);i+=1;break;
                case 'ldo':context.lineDashOffset=p[i+1];i++;break;
                case 'fo':context.font=p[i+1];i++;break;
                case 'ft':context.fillText(p[i+1], parseFloat(p[i+2]), parseFloat(p[i+3]));i+=3;break;
                case 'st':context.strokeText(p[i+1], parseFloat(p[i+2]), parseFloat(p[i+3]));i+=3;break;
                case 'ta':context.textAlign=p[i+1];i++;break;
                case 'tbl':context.textBaseline=p[i+1];i++;break;
                case 'ga':context.globalAlpha=parseFloat(p[i+1]);i++;break;
                case 'gco':context.globalCompositeOperation=p[i+1];i++;break;
                case 'fu':(p[i+1])(context.canvas.__object__);i++;break;
                
                // Empty option - ignore it
                case '':break;
                
                // Unknown option
                default: alert('[ERROR] Unknown option: ' + p[i]);
            }
        }
        
        function splitstring (p)
        {
            var ret = [], buffer = '', inquote = false, quote = '', substitutionIndex = 0;

            // p ia string - not an array
            for (var i=0; i<p.length; i+=1) {
                
                var chr = p[i],
                    isWS = chr.match(/ /);

                if (isWS) {
                    if (!inquote) {

                        // Get rid of any enclosing quotes
                        if (buffer[0] === '"' || buffer[0] === "'") {
                            buffer = buffer.substr(1, buffer.length - 2);
                        }


                        // String substitution
                        if (buffer.trim() === '%' && typeof args[substitutionIndex] !== 'undefined') {
                            buffer = args[substitutionIndex++];
                        }

                        ret.push(buffer);
                        buffer = '';
                    } else {
                        buffer += chr;
                    }
                } else {
                    if (chr === "'" || chr === '"') {
                        inquote = !inquote;
                    }

                    buffer += chr;
                }
            }

            // Do the last bit (including substitution)
            if (buffer.trim() === '%' && args[substitutionIndex]) {
                buffer = args[substitutionIndex++];
            }

            ret.push(buffer);

            return ret;
        }
    };








    // Allows the conversion of older names and values to newer
    // ones.
    //
    // *** When adding this to a new chart library there needs to be
    // *** two changes done:
    // ***  o Add the list of aliases as a object variable (eg this.aliases = {}; )
    // ***  o The bit that goes in the setter that calls the
    // ***    RGraph.propertyNameAlias() function - copy this from the Bar chart object
    //
    //RGraph.propertyNameAlias = function (opt)
    //{
    //    var obj = opt.object;
    //
    //    if (typeof obj.propertyNameAliases[opt.name] === 'string') {
    //        return {
    //            name:  obj.propertyNameAliases[opt.name],
    //            value: opt.value
    //        };
    //    } else if (typeof obj.propertyNameAliases[opt.name] === 'function') {
    //        var tmp = (obj.propertyNameAliases[opt.name])(opt);
    //
    //        return {
    //            name:  tmp.name,
    //            value: tmp.value
    //        };
    //    }
    //    
    //    // Default response - return the name/value unchanged
    //    return {
    //        name:  opt.name,
    //        value: opt.value
    //    };
    //};








    //
    // This function gets the text properties when given a relevant prefix.
    // So if you give it 'text' as the prefix you'll get the:
    //
    //  o textFont
    //  o textSize
    //  o textColor
    //  o textBold
    //  o textItalic
    //
    // ...properties. On the other hand if you give it 'yaxisScaleLabels'
    // as the prefix you'll get:
    //
    //  o yaxisScaleLabelsFont
    //  o yaxisScaleLabelsSize
    //  o yaxisScaleLabelsColor
    //  o yaxisScaleLabelsBold
    //  o yaxisScaleLabelsItalic
    //
    RGraph.getTextConf = function (opt)
    {
        var obj    = opt.object,
            prop   = obj.properties,
            prefix = opt.prefix;

        // Has to be a seperate var statement
        var font   = typeof prop[prefix + 'Font']   === 'string'  ? prop[prefix + 'Font']  : prop.textFont,
            size   = typeof prop[prefix + 'Size']   === 'number'  ? prop[prefix + 'Size']  : prop.textSize,
            color  = typeof prop[prefix + 'Color']  === 'string'  ? prop[prefix + 'Color'] : prop.textColor,
            bold   = !RGraph.isNull(prop[prefix + 'Bold'])   ? prop[prefix + 'Bold']   : prop.textBold,
            italic = !RGraph.isNull(prop[prefix + 'Italic']) ? prop[prefix + 'Italic'] : prop.textItalic;

        return {
            font:   font,
            size:   size,
            color:  color,
            bold:   bold,
            italic: italic
        };
    };








    //
    // Wraps the canvas in a DIV to allow DOM text to be used
    //
    // NOT USED ANY MORE
    //
    RGraph.wrap = function () {};




// End module pattern
})(window, document);








    //
    // Uses the alert() function to show the structure of the given variable
    // 
    // @param mixed v The variable to print/alert the structure of
    //
    window.$p = function (v)
    {
        RGraph.pr(arguments[0], arguments[1], arguments[3]);
    };








    //
    // A shorthand for the default alert() function
    //
    window.$a = function (v)
    {
        alert(v);
    };








    //
    // Short-hand for console.log
    // 
    // @param mixed v The variable to log to the console
    //
    window.$cl = function (v)
    {
        return console.log(v);
    };








    //
    // A basic string formatting function. Use it like this:
    // 
    // var str = '{0} {1} {2}'.format('a', 'b', 'c');
    // 
    // Outputs: a b c
    //
    if (!String.prototype.format) {
      String.prototype.format = function()
      {
        var args = arguments;

        var s = this.replace(/{(\d+)}/g, function(str, idx)
        {
          return typeof args[idx - 1] !== 'undefined' ? args[idx - 1] : str;
        });
        
        return s.replace(/%(\d+)/g, function(str, idx)
        {
          return typeof args[idx - 1] !== 'undefined' ? args[idx - 1] : str;
        });
      };
    }
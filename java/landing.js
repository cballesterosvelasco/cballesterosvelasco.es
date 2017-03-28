var EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};

function showSection(category, name) {
    $(category).hide();
    $(name).show();
}

function clamp(v, _min, _max) {
    var min = Math.min(_min, _max);
    var max = Math.max(_min, _max);
    return Math.min(Math.max(v, min), max);
}

function inside(v, _min, _max) {
    var min = Math.min(_min, _max);
    var max = Math.max(_min, _max);
    return v >= min && v <= max;
}

function transformScalar01(v, toMin, toMax) {
    return (v * (toMax - toMin)) + toMin;
}

function transformScalar(v, fromMin, fromMax, toMin, toMax) {
    return transformScalar01((v - fromMin) / (fromMax - fromMin), toMin, toMax);
}

function transformScalarClamped(v, fromMin, fromMax, toMin, toMax) {
    return clamp(transformScalar(v, fromMin, fromMax, toMin, toMax), toMin, toMax);
}

function transformScalarClampedWithEasing(v, fromMin, fromMax, toMin, toMax, easing) {
    return transformScalar01(easing(clamp(transformScalar(v, fromMin, fromMax, 0, 1), 0, 1)), toMin, toMax);
}

function scrollDelayed() {
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;

    function getPropertyKindBounds(e, actuationBounds) {
        var bounds = $(e)[0].getBoundingClientRect();

        var smallerThanViewport = bounds.height < viewportHeight;

        var minHeight = Math.min(viewportHeight * 0.75, bounds.height)

        function startAndSize(start, height) {
            return [start, start + height];
        }

        switch (actuationBounds) {
            case 'displaying': return [viewportHeight, -bounds.height];
            case 'exiting':
                if (smallerThanViewport) {
                    return [0, -bounds.height];
                } else {
                    return [-(bounds.height-viewportHeight), -bounds.height];
                }
            case 'entering': return [viewportHeight, viewportHeight - minHeight];
        }
        return [0, -bounds.height];
    }

    function setLandingProperty(props, e, name, propertyRange, actuationBoundsOrKind, extra) {
        var bounds = $(e)[0].getBoundingClientRect();
        if (extra === undefined) extra = {};
        if (extra.suffix === undefined) extra.suffix = '';
        if (extra.offset === undefined) extra.offset = 0;
        var actuationBounds;
        if (typeof actuationBoundsOrKind == 'string') {
            actuationBounds = getPropertyKindBounds(e, actuationBoundsOrKind);
        } else {
            actuationBounds = actuationBoundsOrKind;
        }

        var fromMin = actuationBounds[0];
        var fromMax = actuationBounds[1];
        var toMin = propertyRange[0];
        var toMax = propertyRange[1];

        var apply = false;

        if (inside(bounds.top, fromMin, fromMax)) apply = true;
        if (actuationBoundsOrKind == 'entering' && fromMin < bounds.top) apply = true;

        if (apply) {
            props[name] = transformScalarClampedWithEasing(bounds.top + extra.offset, fromMin, fromMax, toMin, toMax, getElementEasing(e)) + extra.suffix;
        }
    }

    function getElementEasing(e) {
        var easingName = $(e).data('easing') || 'linear';
        var easingFunction = EasingFunctions[easingName] || EasingFunctions.linear;
        return easingFunction;
    }

    $('.landing').each(function(i, e) {
        var $e = $(e);
        var props = {};
        $e.css('opacity', 1.0);
        if ($e.hasClass('disappear-hide')) {
            setLandingProperty(props, e, 'opacity', [1, 0], 'exiting');
        }
        if ($e.hasClass('enter-show')) {
            setLandingProperty(props, e, 'opacity', [0, 1], 'entering');
            $e.css('position', 'relative')
            setLandingProperty(props, e, 'top', [30, 0], 'entering', { suffix: 'px' });
        }
        if ($e.hasClass('show-scale')) {
            setLandingProperty(props, e, 'opacity', [0, 1], 'entering');
            setLandingProperty(props, e, 'scale', [0.1, 1], 'entering');
        }
        if ($e.hasClass('enter-flip')) {
            setLandingProperty(props, e, 'opacity', [0, 1], 'entering');
            setLandingProperty(props, e, 'rotateY', [90, 0], 'entering');
        }
        if ($e.hasClass('exit-flip')) {
            setLandingProperty(props, e, 'opacity', [1, 0], 'exiting');
            setLandingProperty(props, e, 'rotateY', [0, -90], 'exiting');
        }
        if ($e.hasClass('exit-hide')) {
            //console.log('exit-hide');
            setLandingProperty(props, e, 'opacity', [1, 0], 'exiting');
            $(e).css('position', 'relative')
            setLandingProperty(props, e, 'top', [0, -30], 'exiting', { suffix: 'px' });
        }
        if ($e.hasClass('floating-background')) {
            setLandingProperty(props, e, 'background-position-y', [0, 30], 'displaying', { suffix: '%' });
        }

        if (props['opacity'] !== undefined) $e.css('opacity', props['opacity']);
        if (props['background-position-y'] !== undefined) $e.css('background-position', '0 ' + props['background-position-y']);
        if (props['top'] !== undefined) $e.css('top', props['top']);

        var scale = props['scale'] || 1.0;
        var rotateY = props['rotateY'] || '0';
        $e.css('perspective', '1000px');
        $e.css('transform', 'translateZ(0) rotateY(' + Math.floor(rotateY) + 'deg) scale(' + scale + ')');

    });
}

$(function() {
    var updatedScroll = false;

    function eachFrame() {
        if (updatedScroll) {
            updatedScroll = false;
            scrollDelayed();
        }
        requestAnimationFrame(eachFrame);
    }

    $('.selectable').on('click', function() {
        $(this).parent('.group').find('.selectable').removeClass('active');
        $(this).addClass('active');
    });

    $(document).on('scroll', function() {
        updatedScroll = true;
    });

    $(document).on('resize', function() {
        updatedScroll = true;
    });

    eachFrame();
    //console.log($('.floating-background'));
});

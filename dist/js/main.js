$(function(){

    svg4everybody();

    // Prevent transitions from running on page load.
    $('body').removeClass('preload');

    // Grab our brealpoint labels from the body tag.
    var breakpoint = {};
    breakpoint.refreshValue = function () {
        this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
    };

    // Pad text inputs when label is moved to the right.
    var padInputs = function () {
        $('.input').each(function () {

            // The label moves to the top on mobile, so we don't
            // want to pad in that case.
            var invalidBreakpoints = ['xs', 'sm'];

            var $label = $(this).find('.input__label');
            var $input = $(this).find('.input__field');
            var labelWidth = $label.outerWidth();

            // Account for the smaller label size of engaged inputs
            // when resizing from mobile to desktop.
            labelWidth = $label.css('fontSize') !== '14px' ? labelWidth : (labelWidth * 0.85);

            // Remove this padding when resizing to mobile.
            if (invalidBreakpoints.indexOf(breakpoint.value) !== -1) {
                $input.css('paddingRight', '');
            } else {
                $input.css('paddingRight', labelWidth + 'px');
            }
        });
    };

    // Add a value to inputs so we can using input:not([value=""])
    // in CSS to persist the engaged label state when the user fills
    // out an input__field.
    $('.input__field').keyup(function () {
        $(this).attr('value', $(this).val());
    });

    // Add class to select when focused to allow for blue border.
    $('.select__field').focus(function () {
        $(this).parent().addClass('select--has-focus');
    }).blur(function () {
        $(this).parent().removeClass('select--has-focus');
    });

    // Update .select__selected-option text when a change event occurs on the
    // select element.
    $('.select__field').change(function (e) {
        var target = e.target;
        var selectedOptionText = $(target).find('option:selected').text();

        if (selectedOptionText) {
            $(target).siblings('.select__selected-option').text(selectedOptionText);
            $(target).siblings('.select__label').hide();
        } else {
            $(target).siblings('.select__selected-option').text('');
            $(target).siblings('.select__label').show();
        }
    });

    // TODO: Debounce to reduce number of calculations during resize (jquery.ba-throttle-debounce.js)
    $(window).resize(function () {
        breakpoint.refreshValue();
        padInputs();
    }).resize();

});
$(function() {

    $('#submit').on('click', function() {
        setTimeout(function() {
            $('#submit').prop('disabled', true);
            $.LoadingOverlay('show');
        }, 100);
    });

    $('#tweetOnlyActiveDay').on('click', function() {
        var checked = Boolean($(this).prop('checked'));
        $('.threshold')
            .prop('disabled', !checked)
            .prop('required', checked);
    });

});

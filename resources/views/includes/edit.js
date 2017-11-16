$(function() {
    function updateThreshold() {
        var checked = $(this).prop('checked');
        $('.threshold')
            .prop('disabled', !checked)
            .prop('required', checked);
    }
    $('#tweetOnlyActiveDay').on('click', updateThreshold);

    updateThreshold();
});

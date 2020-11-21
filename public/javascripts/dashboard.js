$(document).ready(function () {
    // 提示
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    // 互動視窗
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    })
});
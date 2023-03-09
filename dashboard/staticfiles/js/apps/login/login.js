$(".log-in").on('click', function (e) {

    console.log('a');

    let name = $('#user-name').val();
    let password = $('#user-password').val();

    $.ajax({
        type: 'POST',
        url: '/login/',
        data: {
            name: name,
            password: password,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'post'
        },
        success: function (json) {
            console.log('b');
            if(json == 'log'){
                location.reload();
            }else{
                toastr.error('El e-mail o la contraseña no son validos', 'Error de autenticación', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            }
        },
        error: function (xhr, errmsg, err) {
            console.log('c');
            // console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});
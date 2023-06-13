function login(mail, pass) {
    $.ajax({
        type: 'POST',
        url: '/login/',
        data: {
            name: mail,
            password: pass,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'post'
        },
        success: function (json) {
            console.log(json);
            if(json == 'log'){
                location.reload();
            }else{
                toastr.error('El e-mail o la contraseña no son validos', 'Error de autenticación', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            }
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
}

$(".log-in").on('click', function (e) {

    let name = $('#user-name').val();
    let password = $('#user-password').val();

    login(name, password)
});


$(document).keypress(function(e) {
    if(e.which == 13) {
        let name = $('#user-name').val();
        let password = $('#user-password').val();

        login(name, password)
    }
})
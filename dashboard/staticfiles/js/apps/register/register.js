function validateEmail(email) {
    let arr = email.split('@');

    if (arr.length == 2){
        arr = arr[1].split('.');
        if (arr.length == 2){
            return true;
        }
    }

    return false;
}

// add new user
$(".addUser").on('click', function (e) {
    e.preventDefault();

    let company = $('.user-company').val();
    let mail = $('.user-mail').val();
    let first_name = $('.first-name').val();
    let last_name = $('.last-name').val();
    let password = $('.user-password').val();

    if (mail != '' && company != '' && first_name != '' && last_name != '' && password != '') {
        if (password.length >= 6) {
            if(validateEmail(mail)){
                $.ajax({
                    type: 'POST',
                    url: '/register/',
                    data: {
                        company: company,
                        mail: mail,
                        first_name: first_name,
                        last_name: last_name,
                        password: password,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        action: 'post'
                    },
                    success: function (json) {
                        if (json == "ok") {
                            console.log('123')
                            location.href = "/register-success"
                        }else{
                            console.log('asd')
                        }
                    },
                    error: function (xhr, errmsg, err) {
                        //console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                        toastr.error('El correo introducido ya está asociado a una cuenta.', 'Error');
                    }
                });
            }else{
                toastr.error('El email introducido no es valido.', 'Error');
            }
        } else {
            toastr.error('La contraseña debe tener al menos 6 caracteres.', 'Error');
        }
    } else {
        toastr.error('Debe completar todos los campos.', 'Error');
    }
});
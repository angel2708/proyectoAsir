var url_key = $('.key').val();

$('.completeAccount').click(function(){
    console.log('pressed')
    first_name = $('.first-name').val();
    last_name = $('.last-name').val();
    pass = $('.user-password').val();

    $.ajax({
        type: 'POST',
        url: '/user-invitation/'+url_key,
        data: {
            first_name: first_name,
            last_name: last_name,
            pass: pass,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'post'
        },
        success: function (json) {
            if(json == 'ok')
                location.href = "/inicio"
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});
// prueba de enviar email a cuenta de dominio @gmail
let content = document.querySelector('.ql-editor>p');
$('.send-mail').click(function(e){
    $.ajax({
        type:'POST',
        url:'/email/',
        data:{
            from:$('#emailfrom').val(),
            to:$('#emailTo').val(),
            subject:$('#emailSubject').val(),
            content:document.querySelector('.ql-editor>p').innerText,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action:'send-mail'
        },success:function(res){
            alert('supuestamente enviado '+res+" email");
        },error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            
        }
    });
});
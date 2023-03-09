// dataTable = $('#invitations-table').DataTable({ 'order': [[1, 'desc']] });

$('#departaments-table').DataTable({
    'order': [[1, 'desc']],
    "language": {
        "sProcessing":    "Procesando...",
        "sLengthMenu":    "Mostrar _MENU_ registros",
        "sZeroRecords":   "No se encontraron resultados",
        "sEmptyTable":    "Ningún dato disponible en esta tabla",
        "sInfo":          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty":     "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered":  "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix":   "",
        "sSearch":        "Buscar:",
        "sUrl":           "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst":    "Primero",
            "sLast":    "Último",
            "sNext":    "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    }
});


dataTable.draw();

$('.delete-invitation').click(function(){
    let invitation = $(this).attr('invitation-id');
    let element = this

    swal.fire({
        title: '¿Deseas eliminar el cliente?',
        text: ' ',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true) {
            $(element).closest('tr').remove();

            $.ajax({
                type:'POST',
                url:'/invitations-management/',
                data:{
                    invitation: invitation,
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
                    action:'delete_invitation'
                },
                success:function(res){
                    if(res == 'ok'){
                        toastr.success('La invitación ha sido eliminada', 'Operación relizada con éxito');
                    }else{
                        toastr.error('', 'Ha ocurrido un error');
                    }
                },
                error : function(xhr,errmsg,err) {
                    toastr.error('', 'Error al actualizar');
                    console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                }
            });
        }
    });
});
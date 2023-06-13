// dataTable = $('#departaments-table').DataTable({ 'order': [[1, 'asc']] });

//Datatables en Español
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



var currentRow;
var departament_id;

$(".departament-create").on('click', function (e) {
    document.getElementById("form-departament").reset();
    $('.dept-manager').hide();
    $('.saveDepartament').hide();
    $('.addDepartament').show();
});

$(".addDepartament").on('click', function (e) {
    let departament_name = $('.departament-name').val()

    if(departament_name != ''){
        $.ajax({
            type: 'POST',
            url: '/departaments-management/',
            data: {
                departament_name: departament_name,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'add_departament'
            },
            success: function (json) {
                if(json == 'error'){
                    toastr.error('El departamento introducido ya existe', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                }else{
                    $('#DepartamentModal').modal('hide');

                    let result = json.split("-");
                    
                    let edit = '';

                    if (result[1] == 'True') {
                        edit = '<a data-toggle="modal" data-target="#DepartamentModal" class="primary edit-departament mr-1"><i class="fa fa-pen"></i></a>';
                    }

                    if (result[2] == 'True') {
                        edit = edit + '<a class="danger delete-departament mr-1"><i class="fa fa-trash"></i></a>';
                    }

                    toastr.success('El departamento ha sido introducido en la base de datos', 'Operación realizada con éxito', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    
                    $(".departament-group-"+$('.departament-selection').val()).append('<li class="profile-list-item profile-' + result[0] + '" style="max-height: 15px !important;">' + edit + '<h6 style="margin-top:-5px !important" class="media-heading profile-name-'+result[0]+'">' + $('.profile-name').val() + '</h6></li>');
                    $(".user-profile").html('<option class="user-profile-' + result[0] + '" departament-id="'+$('.departament-selection').val()+'" value="' + result[0] + '">' + $(".departament-selection option:selected" ).text() + ': ' + $('.profile-name').val() + '</option>' + $(".user-profile").html());

                    $('.departament-selection').val('')
                    $('#AddProfileModal').modal('hide');

                    let index;
                    let n = 0;

                    $('.index-reference').each(function() {  
                        if(n==0){
                            index = $(this).text();
                        }    
                        n++;
                    }); 

                    index = parseInt(index, 10) + 1;

                    dataTable.row.add([
                        '<input type="hidden" class="hidden-id" value="'+result[0]+'">'+
                        '<input type="hidden" class="hidden-name" value="'+departament_name+'">'+
                        '<input type="checkbox" class="input-chk check">',
                        '<a class="id index-reference" href="'+result[0]+'">'+result[0]+'</a>',
                        '<p class="departament-name dpt-id-'+result[0]+'">'+departament_name+'</p>',
                        '<p>Sin asignar</p>',
                        '<p>0</p>',
                        edit
                    ]).draw(false);
                }
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    }else{
        toastr.error('Introduzca en nombre del departamento', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
    }
});

$(document).on('click', '.edit-departament', function () {
    $('.dept-manager').show();
    document.getElementById("form-departament").reset();
    currentRow = $(this).parents('tr');
    departament_id = $(this).closest('tr').find('td input.hidden-id').val();

    let name = $(this).closest('tr').find('td input.hidden-name').val();

    $('.saveDepartament').show();
    $('.addDepartament').hide();

    $('.departament-name').val(name);

    $.ajax({
        type: 'POST',
        url: '/get-departament-users/',
        data: {
            departament_id: departament_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function (json) {
            console.log(json)
            $('.dept-manager option').remove();

            $('.dept-manager').append('<option value="0">Seleccionar encargado<option>');

            res = JSON.parse(json)

            for(i in res){
                if($('.dpt-manager-'+departament_id).text() == (res[i]['fields']['first_name']+' '+res[i]['fields']['last_name']))
                    $('.dept-manager').append('<option value="'+res[i]['pk']+'" selected>'+res[i]['fields']['first_name']+' '+res[i]['fields']['last_name']+'<option>');
                else
                    $('.dept-manager').append('<option value="'+res[i]['pk']+'">'+res[i]['fields']['first_name']+' '+res[i]['fields']['last_name']+'<option>');
            }

            $('select option').filter(function() {
                return !this.value || $.trim(this.value).length == 0 || $.trim(this.text).length == 0;
            }).remove();
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});

$(".saveDepartament").click(function () {
    let dept_name = $('.departament-name').val();
    let dept_manager = $('.dept-manager').val();
    $.ajax({
        type: 'POST',
        url: '/departaments-management/',
        data: {
            departament_id: departament_id,
            departament_name: dept_name,
            departament_manager: dept_manager,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'update_departament'
        },
        success: function (json) {
            if(json == 'updated'){
                toastr.success('El usuario  ha sido actualizado en la base de datos', 'Usuario actualizado', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });

                $('.dpt-id-'+departament_id).text(dept_name);
                
                if(dept_manager != 0)
                    $('.dpt-manager-'+departament_id).text($('.dept-manager option:selected').text());
                else
                    $('.dpt-manager-'+departament_id).text('Sin asignar');

                $('#DepartamentModal').modal('hide');
            }else{
                toastr.error('El departamento introducido ya existe', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            }
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});

$(document).on('click', '.delete-departament', function () {
    let element = $(this);
    departament_id = $(this).closest('tr').find('td input.hidden-id').val();

    swal.fire({
        title: '¿Deseas eliminar el usuario?',
        text: ' ',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true) {
            $.ajax({
                type: 'POST',
                url: '/departaments-management/',
                data: {
                    departament_id: departament_id,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'delete_departament'
                },
                success: function (json) {
                    if(json == 'deleted'){
                        toastr.success('El usuario  ha sido eliminado de la base de datos', 'Usuario eliminado', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                        dataTable.row(element.parents('tr')).remove().draw(false);
                    }else{
                        toastr.error('El departamento tiene usuarios asignados', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    }
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                }
            });
        }
    });
});
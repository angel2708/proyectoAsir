
// var userDataTable = $('#departaments-table').DataTable({
//     'order' : [[1,'asc']]
// });


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


$('.company-create').click(function(){
    $('.saveCompany').hide();
    $('.addCompany').show();
    $('.departament-name').val('');   
});

$('.addCompany').click(function(){
    let departament = $('.departament-name').val();   


    let montharray = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var currentTime = new Date();
    var day = currentTime.getDate();
    var month = currentTime.getMonth();
    var year = currentTime.getFullYear();
  
    if (day < 10){
    day = "0" + day;
    }


    var today_date = day + " de " + montharray[month] + " de " + year + " a las " + currentTime.getHours() + ":" + currentTime.getMinutes();


    $.ajax({
        type:'POST',
        url:'/companies-management/',
        data:{
            company_name: departament,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action:'create_company' 
        },
        success:function(id){
            
                toastr.success('La compañía ha sido creada.', 'Operación realizada con éxito');
           
            $('#CompanyModal').modal('hide');

            userDataTable.row.add( [
                "<input type='checkbox'>",
                id,
                departament,
                1,
                today_date,
                "<a data-toggle='modal' data-target='#CompanyModalEdit' company-id='{{company.id}}' class='primary edit-departament mr-1'><i class='fa fa-pen'></i></a>" +
                "<a class='danger delete-departament mr-1'><i class='fa fa-trash'></i></a>",
                
                
            ]).draw( false );
            $('.new').parent().addClass('d-none');



        },
        error : function(xhr,errmsg,err) {
            toastr.error('', 'Error al actualizar');
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});

$('.edit-departament').click(function(){
    let id = $(this).attr('company-id');
    console.log(id);
    $('.company-id').html(id);
    $('.form-container p input').click();
});

$('.form-container').on('change','input[type="file"]', function(){
    $('.form-save button').click();
})

//Este es el boton de "gestion de compañias"
$(".updateCompany").click(function(){
    //alert(id)
    let new_name = $('.company_name2').val()
    let new_name_avatar = $('.company_name2').val()[0] + $('.company_name2').val()[1]
    let id = $('.company-id').html();
    // alert(new_name)
    $.ajax({
        type:'POST',
        // url:"/updateB/" + id + "/",
        url: "/companies-management/",
        data:{
            name: $('.company_name2').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action: 'update_company',
            id: id
        },
        success:function(json){
            if(json == 'ok'){
                toastr.success('La compañía ha sido actualizada.', 'Operación realizada con éxito');
                $('.company-id-'+id).html(new_name);
                $('.company-view-avatar').html(new_name_avatar);
            }else{
                toastr.error('La compañía no ha podido actualizar', 'Error');
            }
            $('#CompanyModalEdit').modal('hide');
        },
        error : function(xhr,errmsg,err) {
        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});

//Este es el boton de "Configuracion de compañias"

$(".updateCompany2").click(function(){
    //alert(id)
    // e.preventDefault();
    let new_name = $('.company_name').val();
    let new_name_avatar = $('.company_name').val()[0].toUpperCase() + $('.company_name').val()[1].toUpperCase();
    let id = $('.company-id').html();
    // let image = $('.logo')[0].files[0];
    //let image = $('.logo').val();
    // console.log(image);
    // alert(new_name)
    $.ajax({
        type:'POST',
        // url:"/updateB/" + id + "/",
        url: "/company-settings/",
        data:{
            name: $('.company_name').val(),
            // logo: $('[name=logo]').val().split('\\')[2],
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action: 'update_company',
            id: id
        },
        success:function(json){
            if(json == 'ok'){
                toastr.success('La compañía ha sido actualizada.', 'Operación realizada con éxito');
                $('.company-view-id').html(new_name);
                $('.company-view-avatar').html(new_name_avatar);
            }else{
                toastr.error('La compañía no ha podido actualizar', 'Error');
            }
        },
        error : function(xhr,errmsg,err) {
        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});

$('img-logo').click(function(){
    alert('funciona')

})
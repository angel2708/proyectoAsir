// dataTable = $('#users-table').DataTable({ 'order': [[1, 'desc']] });

//Datatables en Español
var dataTable = $('#users-table').DataTable({
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



$('#users-table').parent().css('overflow-x', 'scroll')
$('.table-responsive').css('overflow-x', 'hidden')
dataTable.draw();

var currentRow;
var user_id;
var profile_id;
var departament;
var admin;
var manager_id;

// Función que valide el campo email
function validateEmail(email) {
    let arr = email.split('@');
    if (arr[0].length <1) {
        return false;
    } else if (arr.length == 2){
        arr = arr[1].split('.');
        
        if(arr.length > 1){
            return true;
        }else{
            return false;
        }
    }
    return false;
}

// Función que valide que un campo no este vacío
function validateEmpty(string) {
    if (string != '') {
        return true;
    }
    return false;
}

//Gestión de menu de permisos

function recursiveBlockParentkCheck(id, state, type){
    $(".parent-"+id+"."+type).each(function() {      
        let has_child = $(this).attr("class").split(' ')[4];

        $(this).prop('checked', state);
        let i = $(this).attr("class").split(' ')[3];

        if(has_child = "True"){
            recursiveBlockParentkCheck(i, state, type)
        }
    }); 

    let column = true;
    
    $("."+type).each(function() {
        if($(this).prop('checked') == 0){
            column = false;
        }
    });

    if(column){
        if(type == "see"){
            $('#checkAllSee').prop('checked', true);
        } else if(type == "modify"){
            $('#checkAllModify').prop('checked', true);
        } else if(type == "add"){
            $('#checkAllAdd').prop('checked', true);
        } else if(type == "delete"){
            $('#checkAllDelete').prop('checked', true);
        }else if(type == "all"){
            $('#checkAllAll').prop('checked', true);
            $('#checkAllDelete').prop('checked', true);
            $('#checkAllAdd').prop('checked', true);
            $('#checkAllModify').prop('checked', true);
            $('#checkAllSee').prop('checked', true);
        }
    }
}

function recursiveBlockChildCheck(parent, type){   
    let p = $("."+parent+"."+type).attr("class").split(' ')[2].split('-')[1];

    $("."+parent+"."+type).prop('checked', false);

    if(p != "0"){
        recursiveBlockChildCheck(p, type);
    }
}

$('#checkAllSee').change(function() {
    if($('#checkAllSee').prop('checked') == 1){
        $(".see").each(function() {
            $(this).prop('checked', true);
          });
    }else{
        $(".see").each(function() {
            $(this).prop('checked', false);
          });
    }
});

$('#checkAllAdd').change(function() {
    if($('#checkAllAdd').prop('checked') == 1){
        $(".add").each(function() {
            $(this).prop('checked', true);
          });
    }else{
        $(".add").each(function() {
            $(this).prop('checked', false);
          });
    }
});

$('#checkAllModify').change(function() {
    if($('#checkAllModify').prop('checked') == 1){
        $(".modify").each(function() {
            $(this).prop('checked', true);
          });
    }else{
        $(".modify").each(function() {
            $(this).prop('checked', false);
          });
    }
});

$('#checkAllDelete').change(function() {
    if($('#checkAllDelete').prop('checked') == 1){
        $(".delete").each(function() {
            $(this).prop('checked', true);
          });
    }else{
        $(".delete").each(function() {
            $(this).prop('checked', false);
          });
    }
});

$('#checkAllAll').change(function() {
    if($('#checkAllAll').prop('checked') == 1){
        $(".custom-control-input").each(function() {
            $(this).prop('checked', true);
          });
    }else{
        $(".custom-control-input").each(function() {
            $(this).prop('checked', false);
          });
    }
});


$('.control').change(function() {
    let id = $(this).attr("class").split(' ')[3];  
    let type = $(this).attr("class").split(' ')[1];  

    
    if($(this).prop('checked') == 0){
        $('#checkAllAll').prop('checked', false);

        $('.all.'+id).prop('checked', false);
        let p = $(this).attr("class").split(' ')[2].split('-')[1];
        recursiveBlockParentkCheck(id, false ,'all');

        if(p != 0){
            recursiveBlockChildCheck(p,'all');
        }
    }     
     

    let row = true;
    let column = true;
    let n = 0;

    
    $("."+id).each(function() {
        n++;
        if($(this).prop('checked') == 0 && n!=5){
            row = false;
        }     
    });

    $("."+type).each(function() {
        if($(this).prop('checked') == 0){
            column = false;
        }     
    });
    
    if(row && type!="all"){
        $('.all.'+id).prop('checked', true);
        recursiveBlockParentkCheck(id, true, 'all')
    }
    
    if(column){
        if(type == "see"){
            $('#checkAllSee').prop('checked', true);
        } else if(type == "modify"){
            $('#checkAllModify').prop('checked', true);
        } else if(type == "add"){
            $('#checkAllAdd').prop('checked', true);
        } else if(type == "delete"){
            $('#checkAllDelete').prop('checked', true);
        }else if(type == "all"){
            $('#checkAllAll').prop('checked', true);
            $('#checkAllDelete').prop('checked', true);
            $('#checkAllAdd').prop('checked', true);
            $('#checkAllModify').prop('checked', true);
            $('#checkAllSee').prop('checked', true);
        }
    }
});


$('.see').change(function() {
    let has_child = $(this).attr("class").split(' ')[4];
    let id = $(this).attr("class").split(' ')[3];
    let parent = $(this).attr("class").split(' ')[2].split('-')[1];

    if($(this).prop('checked') == 0){
        $('#checkAllSee').prop('checked', false);

        if(has_child = "True"){
            recursiveBlockParentkCheck(id, false, 'see')
        }

        if(parent != "0"){
            recursiveBlockChildCheck(parent, 'see')
        }
    }else{
        if(has_child = "True"){
            recursiveBlockParentkCheck(id, true, 'see')
        }
    }
});

$('.add').change(function() {
    let has_child = $(this).attr("class").split(' ')[4];
    let id = $(this).attr("class").split(' ')[3];
    let parent = $(this).attr("class").split(' ')[2].split('-')[1];

    if($(this).prop('checked') == 0){
        $('#checkAllAdd').prop('checked', false);

        if(has_child = "True"){
            recursiveBlockParentkCheck(id, false, 'add')
        }

        if(parent != "0"){
            recursiveBlockChildCheck(parent, 'add')
        }
    }else{
        if(has_child = "True"){
            recursiveBlockParentkCheck(id, true, 'add')
        }
    }
});

$('.delete').change(function() {
    let has_child = $(this).attr("class").split(' ')[4];
    let id = $(this).attr("class").split(' ')[3];
    let parent = $(this).attr("class").split(' ')[2].split('-')[1];

    if($(this).prop('checked') == 0){
        $('#checkAllDelete').prop('checked', false);

        if(has_child = "True"){
            recursiveBlockParentkCheck(id, false, 'delete')
        }

        if(parent != "0"){
            recursiveBlockChildCheck(parent, 'delete')
        }
    }else{
        if(has_child = "True"){
            recursiveBlockParentkCheck(id, true, 'delete')
        }
    }
});

$('.modify').change(function() {
    let has_child = $(this).attr("class").split(' ')[4];
    let id = $(this).attr("class").split(' ')[3];
    let parent = $(this).attr("class").split(' ')[2].split('-')[1];

    if($(this).prop('checked') == 0){
        $('#checkAllModify').prop('checked', false);

        if(has_child = "True"){
            recursiveBlockParentkCheck(id, false, 'modify')
        }

        if(parent != "0"){
            recursiveBlockChildCheck(parent, 'modify')
        }
    }else{
        if(has_child = "True"){
            recursiveBlockParentkCheck(id, true, 'modify')
        }
    }
});

$('.all').change(function() {
    let id = $(this).attr("class").split(' ')[3];
    if($(this).prop('checked') == 1){
        $("."+id).each(function() {
            let i = $(this).attr("class").split(' ')[3];
            let type = $(this).attr("class").split(' ')[1];
            $(this).prop('checked', true);  
            recursiveBlockParentkCheck(i, true, type)      
        });
    }else{
        $("."+id).each(function() {
            let i = $(this).attr("class").split(' ')[3];
            let type = $(this).attr("class").split(' ')[1];
            $(this).prop('checked', false);
            recursiveBlockParentkCheck(i, false, type) 
        }); 
    } 
});

//Gestión de menu de permisos END

$(document).on('click', '.edit-profile', function () {
    document.getElementById("profile-form").reset();
    $('.saveProfile').show();
    $('.deleteProfile').show();
    $('.addProfile').hide();

    $('.departament-selection').prop('disabled', 'disabled');

    let name = $(this).attr("profile-name");
    let id = $(this).attr("profile-id");
    departament = $(this).attr("profile-departament");
    profile_id = id;

    $(".profile-name").val(name);
    $('.departament-selection').val(departament)

    $.ajax({
        type:'POST',
        url:'/get-profile/',
        data:{
            profile:id,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action: 'post'
        },
        success:function(json){
            let result = JSON.parse(json);
            let index = 0;

            for (const r in result){
                $("."+result[index]['fields']['function_id']).each(function() {
                    let id = $(this).attr("class").split(' ');

                    if(id[1] == 'see' && result[index]['fields']['consult']){
                        $(this).prop('checked', true);
                    }else if(id[1] == 'add' && result[index]['fields']['create']){
                        $(this).prop('checked', true);
                    }else if(id[1] == 'modify' && result[index]['fields']['edit']){
                        $(this).prop('checked', true);
                    }else if(id[1] == 'delete' && result[index]['fields']['delete']){
                        $(this).prop('checked', true);
                    }   
                });

                index = index+1;
            }
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});

$(document).on('click', '.new-profile', function () {
    $('.departament-selection').prop('disabled', false);
    $('.departament-block').hide();
    document.getElementById("profile-form").reset();
    $('.saveProfile').hide();
    $('.deleteProfile').hide();
    $('.addProfile').show();
});

// add new profile
$(".addProfile").on('click', function (e) {
    e.preventDefault();

    var index = 0;

    var formData = new FormData();

    if ($('.departament-selection').val() != 'none' && $('.departament-selection').val() != 'other'){
        if($('.profile-name').val()!=''){

            $(".custom-control-input.control").each(function () {
                let id = $(this).attr("class");

                if (id != 'custom-control-input') {
                    id = id.split(' ');
                    if (id[1] != 'all') {
                        index = index + 1;

                        let check = 0;

                        if ($('.' + id[1] + '.' + id[3]).prop('checked')) {
                            check = 1;
                        }

                        formData.append('c_' + index.toString(), id[1] + '_' + id[3] + '_' + check);
                    }
                }
            });

            formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
            formData.append('action', 'create_profile');
            formData.append('index', index.toString());
            formData.append('profile_name', $('.profile-name').val());
            formData.append('departament_id', $('.departament-selection').val());

            $.ajax({
                type: 'POST',
                url: '/users-management/',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function (json) {
                    let result = json.split("-");

                    let edit = '';

                    if (result[1] != 'False') {
                        edit = '<a style="margin-top:-10px !important" data-toggle="modal" data-target="#AddProfileModal" class="primary float-right edit-profile mr-1" profile-id='+ result[0] +' profile-name='+ $('.profile-name').val() +' profile-departament="'+$('.departament-selection').val() +'" ><i class="fa fa-pen"></i></a>';
                    }

                    toastr.success('El perfil ' + $(".profile-name").val() + ' ha sido insertado en la base de datos', 'Perfil Creado', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    $(".departament-group-"+$('.departament-selection').val()).append('<li class="profile-list-item profile-' + result[0] + '" style="max-height: 15px !important;">' + edit + '<h6 style="margin-top:-5px !important" class="media-heading profile-name-'+result[0]+'">' + $('.profile-name').val() + '</h6></li>');
                    $(".user-profile").html('<option class="user-profile-' + result[0] + '" departament-id="'+$('.departament-selection').val()+'" value="' + result[0] + '">' + $(".departament-selection option:selected" ).text() + ': ' + $('.profile-name').val() + '</option>' + $(".user-profile").html());

                    $('.departament-selection').val('')
                    $('#AddProfileModal').modal('hide');
                },
                error: function (xhr, errmsg, err) {
                    //console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                }
            });
        }else{
            toastr.error('Introduzca el nombre del perfil.', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
        }
    }else{
        toastr.error('Elija el departamento asignado al perfil', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
    }
});

$(".saveProfile").click(function () {

    var index = 0;

    var formData = new FormData();

    if ($('.departament-selection').val() != 'none' && $('.departament-selection').val() != 'other'){

        $(".custom-control-input.control").each(function () {
            let id = $(this).attr("class");

            if (id != 'custom-control-input') {
                id = id.split(' ');
                if (id[1] != 'all') {
                    index = index + 1;

                    let check = 0;

                    if ($('.' + id[1] + '.' + id[3]).prop('checked')) {
                        check = 1;
                    }

                    formData.append('c_' + index.toString(), id[1] + '_' + id[3] + '_' + check);
                }
            }
        });

        formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
        formData.append('action', 'update_profile');
        formData.append('profile_id', profile_id);
        formData.append('name', $(".profile-name").val());
        formData.append('index', index.toString());
        formData.append('profile_name', $('.profile-name').val());
        formData.append('departament_id', $('.departament-selection').val());

        $.ajax({
            type: 'POST',
            url: '/users-management/',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (json) {
                toastr.success('El perfil ' + $(".profile-name").val() + ' ha sido actualizado en la base de datos', 'Perfil actualizada', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });

                if (departament != $('.departament-selection').val()){
                    let edit = '';

                    if ($('.profile-'+profile_id+' a') != 'undefined') {
                        edit = '<a style="margin-top:-10px !important" data-toggle="modal" data-target="#AddProfileModal" class="primary float-right edit-profile mr-1" profile-id='+ profile_id +' profile-name='+ $('.profile-name').val() +' profile-departament="'+$('.departament-selection').val() +'" ><i class="fa fa-pen"></i></a>';
                    }

                    $('.profile-'+profile_id).remove();

                    $(".departament-group-"+$('.departament-selection').val()).append('<li class="profile-list-item profile-' + profile_id + '" style="max-height: 15px !important;">' + edit + '<h6 style="margin-top:-5px !important" class="media-heading profile-name-'+profile_id+'">' + $('.profile-name').val() + '</h6></li>');
                    $(".user-profile").html('<option class="user-profile-' + profile_id + '" departament-id="'+$('.departament-selection').val()+'" value="' + profile_id + '">' + $(".departament-selection option:selected" ).text() + ': ' + $('.profile-name').val() + '</option>' + $(".user-profile").html());

                }else{
                    $(".profile-name-" + profile_id).text($('.profile-name').val());
                    $(".user-profile-" + profile_id).text($(".departament-selection option:selected" ).text() + ': ' + $('.profile-name').val());
                    //$(".user-profile-" + profile_id).attr("departament-id", $('.departament-selection').val());
                }

                $('.departament-selection').val('')
                $('#AddProfileModal').modal('hide');
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    }else{
        toastr.error('Elija el departamento asignado al perfil', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
    }
});

$(".deleteProfile").on('click', function (e) {
    e.preventDefault();

    swal.fire({
        title: '¿Deseas eliminar el perfil?',
        text: ' ',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true) {
            $.ajax({
                type: 'POST',
                url: '/users-management/',
                data: {
                    profile_id: profile_id,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'delete_profile'
                },
                success: function (json) {
                    if (json == 'deleted') {
                        toastr.success('El perfil ' + $(".profile-name").val() + ' ha sido eliminado de la base de datos', 'Perfil eliminado', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                        $(".profile-" + profile_id).remove();
                    } else {
                        toastr.warning('El perfil no puede eliminarse si está asignado a un usuario', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    }
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                }
            });
        }
    });
});

$(".user-create").on('click', function (e) {
    document.getElementById("form-user").reset();
    $('.saveUser').hide();
    $('.addUser').show();
    $('.select-admin-dept').hide();
    $('.select-user-prof').show();
});



function userCreation( email, profile_id ,departament_id, role, phone){

    if (email != '' && profile_id != 'x') {
        if(validateEmail(email)){
        
            $.ajax({
                type: 'POST',
                url: '/users-management/',
                data:
                {
                    email: email,
                    profile_id: profile_id,
                    departament_id: departament_id,
                    role: role,
                    phone: phone,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'add_user'
                },
                success: function (json) {
                    toastr.success('El cliente será dado de alta una vez verifique la cuenta.', 'Operación realizada con éxito.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    $('#UserModal').modal('hide');
                },
                error: function (xhr, errmsg, err) {
                    toastr.error('El correo introducido ya está asociado a una cuenta', 'Error');
                    console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                }
            });
        }else{
            toastr.error('El email introducido no es valido.', 'Error');
        }
    } else {
        toastr.error('Debe completar todos los campos.', 'Error');
    }
}

$(".addUser").on('click', function (e) {
    e.preventDefault();

    $('.select-admin-dept').hide();
    $('.select-user-prof').show();

    let prof_id = $('.user-profile').val();

    userCreation($('.user-email').val(), prof_id, $('.user-profile option[value="' + prof_id + '"]').attr('departament-id'), $('.user-rol').val(), $('.user-phone').val()); 
});

$(document).on('click', '.edit-user', function () {
    //document.getElementById("user-form").reset();
    $(".user-password").val('');
    currentRow = $(this).parents('tr');
    user_id = $(this).closest('tr').find('td input.hidden-id').val();

    admin = $(this).attr('admin');

    if(admin == 'admin'){
        $('.select-admin-dept').show();
        $('.select-user-prof').hide();
    }else{
        $('.select-admin-dept').hide();
        $('.select-user-prof').show();
    }

    $('.saveUser').show();
    $('.addUser').hide();

    $.ajax({
        type: 'POST',
        url: '/get-user/',
        data: {
            account_id: user_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'post'
        },
        success: function (json) {
            console.log(json);
            let result = JSON.parse(json);

            $(".user-first-name").val(result[0]['first_name']);
            $(".user-last-name").val(result[0]['last_name']);
            $(".user-email").val(result[0]['email']);
            $(".user-profile").val(result[0]['user_profile']);
            $('.admin-departament').val(result[0]['departament_id']);
            $('.user-rol').val(result[0]['role']);
            $('.user-phone').val(result[0]['phone']);

            console.log(result[0]['mirror']);

            $('#user-mirror').val(result[0]['mirror']);

            if(result[0]['role']==2){
                $('#mirror-container').show();
            }else{
                $('#mirror-container').hide();
            }

            manager_id = result[0]['manager'];

            if(result[0]['manager'] == user_id){
                $('.manager-check').prop('checked',true);
            }else{
                $('.manager-check').prop('checked',false);
            }
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});

$('.user-rol').change(function(){
    if($(this).val()==2){
        $('#mirror-container').show();
    }else{
        $('#mirror-container').hide();
    }
});

function userUpdate(dept_id){
    if ($('.user-first-name').val() != '' && $('.user-last-name').val() != '' && $('.user-email').val() != '' && $('.user-profile').val() != 'x') {
        if(validateEmail($('.user-email').val())){
            $.ajax({
                type: 'POST',
                url: '/users-management/',
                data: {
                    account_id: user_id,
                    account_password: $('.user-password').val(),
                    profile_id: $('.user-profile').val(),
                    departament_id: dept_id,
                    mirror:$('#user-mirror').val(),
                    role: $('.user-rol').val(),
                    phone: $('.user-phone').val(),
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'edit_user'
                },
                success: function (json) {
                    toastr.success('El usuario  ha sido actualizado en la base de datos', 'Usuario actualizado', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    let result = json.split("-");
        
                    f_edit = '';
                    f_delete = '';
        
                    let table_profile;
                    let admin_attr = '';
        
                    if (admin == 'admin'){
                        table_profile = 'Administrador principal';
                        admin_attr = 'admin="admin" ';
                    }else{
                        table_profile=$(".user-profile option:selected").text();
                    }
        
                    if(result[2] == 'True'){
                        f_edit = '<a data-toggle="modal" '+admin_attr+'data-target="#UserModal" class="primary edit-user mr-1"><i class="fa fa-pen"></i></a>';
                    }
        
                    if(result[3] == 'True'){
                        f_delete = '<a class="danger delete-user mr-1"><i class="fa fa-trash"></i></a>';
                    }
        
                    dataTable.row(currentRow).data([
                        '<input type="hidden" class="hidden-id" value="'+user_id+'">'+
                        '<input type="checkbox" class="input-chk check">',
                        '<a class="id" href="' + result[0] + '">' + result[1] + '</a>',
                        '<div class="media">' +
                        '<div class="media-left pr-1">' +
                        '<span class="avatar avatar-sm avatar-away rounded-circle">' +
                        '<img src="/dashboard/staticfiles/images/portrait/small/img_user_not_found.png" alt="avatar">' +
                        '<i></i>' +
                        '</span>' +
                        '</div>' +
                        '<div class="media-body media-middle">' +
                        '<a class="media-heading name">' + $('.user-first-name').val() + ' ' + $('.user-last-name').val() + '</a>' +
                        '</div>' +
                        '</div>',
                        '<a class="email" href="' + $('.user-email').val() + '">' + $('.user-email').val() + '</a>',
                        '<p class="profile">' + table_profile + '</p>',
                        f_edit + f_delete
                    ]).draw(false);
        
                    $('#UserModal').modal('hide');
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                }
            });
        }else{
            toastr.error('El email introducido no es valido.', 'Error');
        }
    } else {
        toastr.error('Debe completar todos los campos.', 'Error');
    }
}

$(".saveUser").click(function () {
    let dept_id;
    
    if (admin == 'admin'){
        dept_id = $('.admin-departament').val();
    }else{
        dept_id = $('.user-profile option[value="' +$('.user-profile').val() + '"]').attr('departament-id');
    }

    userUpdate(dept_id);
});

$(document).on('click', '.delete-user', function () {
    let element = $(this);
    user_id = $(this).closest('tr').find('td input.hidden-id').val();

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
                url: '/users-management/',
                data: {
                    account_id: user_id,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'delete_user'
                },
                success: function (json) {
                    if (json == 'admin'){
                        toastr.error('El administrador principal no puede ser eliminado', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    }else{
                        toastr.success('El usuario  ha sido eliminado de la base de datos', 'Usuario eliminado', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                        dataTable.row(element.parents('tr')).remove().draw(false);
                        user_id = element.closest('tr').find('td input.hidden-id').val();
                    }
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                }
            });
        }
    });
});

$('.departament-selection').change(function() {
    if($(this).val() == "other"){
        $('.departament-block').show();
    }else{
        $('.departament-block').hide();
    }
});

$(".addDepartament").click(function () {
    let departament_name = $('.departament-name').val()

    if(departament_name != ''){
        $.ajax({
            type: 'POST',
            url: '/users-management/',
            data: {
                departament_name: departament_name,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'add_departament'
            },
            success: function (departament_id) {
                if(departament_id != 'error'){
                    $(".departament-selection").html($(".departament-selection").html()+'<option class="departament-'+departament_id+'" value="'+departament_id+'" selected>'+departament_name+'</option>');
                    $(".admin-departament").html($(".admin-departament").html()+'<option class="admin-departament-'+departament_id+'" value="'+departament_id+'">'+departament_name+'</option>');
                    $('.departament-block').hide();

                    $(".departament-container").append('<b class="departament-'+departament_id+'">Dept. '+departament_name+'</b><ul style="margin-bottom:10px" class="list-group departament-group-'+departament_id+'"></ul>');
                }else{
                    toastr.error('El departamento introducido ya existe.', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
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

// function loadProfiles(perm){
//     $.ajax({
//         type: 'POST',
//         url: '/get-profiles/',
//         data: {
//             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
//         },
//         success: function (json) {
//             let result = JSON.parse(json);
//             let edit = '';

//             for (let i in result){
//                 if (perm)
//                     edit = '<a style="margin-top:-10px !important" data-toggle="modal" data-target="#AddProfileModal" class="primary float-right edit-profile mr-1" profile-id='+ result[i]['pk'] +' profile-name='+ result[i]['fields']['name'] +' profile-departament="'+result[i]['fields']['departament_id']+'" ><i class="fa fa-pen circle-icon"></i></a>';

//                 $(".departament-group-"+result[i]['fields']['departament_id']).append('<li class="profile-list-item profile-' + result[i]['pk'] + '" style="max-height: 15px !important;">' + edit + '<h6 style="margin-top:-5px !important" class="media-heading profile-name-'+result[i]['pk']+'">' + result[i]['fields']['name'] + '</h6></li>');
//             }
//         },
//         error: function (xhr, errmsg, err) {
//             console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
//         }
//     });
// }



$.ajax({
    type: 'POST',
    url: '/users-management/',
    data: {
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        action:'profile_edit_perm'
    },
    success: function (json) {
        has_perm=false;

        if (json == 'ok')
            has_perm=true;

        // loadProfiles(has_perm);
    },
    error: function (xhr, errmsg, err) {
        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
    }
});


dataTable.column(1).search('^((?!Sin acceso).)*$', true, false).draw();

$('.all-switch').change(function(){
    if($(this).prop('checked'))
        dataTable.column(1).search('').draw();
    else
        dataTable.column(1).search('^((?!Sin acceso).)*$', true, false).draw();
});

// Botón que muestre o no la contraseña

// Que la muestre
$(".password-eye").click(function () {
    let pass_on = $(this)
    if ($(".password-eye-off").css('display') == 'none') {
        let pass_off = $(".password-eye-off")
        pass_on.hide()
        pass_off.show()
        $('.user-password').get(0).type = 'text';
    }
})

// Que no la muestre
$(".password-eye-off").click(function () {
    let pass_off = $(this)
    if ($(".password-eye").css('display') == 'none') {
        let pass_on = $(".password-eye")
        pass_off.hide()
        pass_on.show()
        $('.user-password').get(0).type = 'password';
    }
})
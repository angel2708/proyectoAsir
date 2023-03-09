// Función que valide que un campo no este vacío. Los campos de Título y descripción(task) no pueden estar vacíos.
function validateEmpty(string) {
    if (string != '') {
        return true;
    }
    return false;
}

////// KANBAN - TABLEROS, LISTAS Y TARJETAS //////
boardFilter = $(".filter-board");

$(".filter-all").click(function () {
    var $this = $(this);
    boardFilter.find(".active").removeClass('active');
    $this.addClass("active")
});

$(".filter-myboard").click(function () {
    var $this = $(this);
    boardFilter.find(".active").removeClass('active');
    $this.addClass("active")
});

$(".filter-member").click(function () {
    var $this = $(this);
    boardFilter.find(".active").removeClass('active');
    $this.addClass("active")
});

// Función para filtrar los tableros
$(".filtro").click(function () {
    showBoards();
});

// Filtro departamento a la hora de invitar miembros a un tablero.
$(".div-board-dept").click(function () {
    mydept = $('.departament-id').val()
    if ($(".board-dept").prop('checked')) {
        $('.board-item').each(function(index) {
            var item = $(this)
            if (mydept == $(this).attr('dept')) {
                item.show()
            } else {
                item.hide()
            }
        });
    } else {
        $('.board-item').each(function(index) {
            $(this).show()
        });
    }
});

// Que se marque o desmarque un usuario al hacerle click
$(".invitation-list").click(function () {
    if ($(this).attr('checked') == 'checked') {
        let owner = $('.board-owner').val()
        if (owner == $(this).attr('user')) {
            // Es el dueño del tablero, por lo tanto no se le puede eliminar del tablero.
        } else {
            $(this).removeAttr('checked')
            let item = $(this).find('.feather.icon-check')
            item.hide()

            //Eliminamos a este usuario del tablero
            invite_id = $(this).attr('user')
            board_id = $('.board-id').val()
            // Llamada AJAX
            $.ajax({
                type: 'POST',
                url: '/remove-invite/',
                data: {
                    board_id: board_id,
                    invite_id: invite_id,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'remove_invite'
                },
                success: function(respuesta) {
                    let avatar = $('.avatar.avatar_user.board-avatar[user_id='+respuesta+']')
                    avatar.remove()
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    } else {
        $(this).attr('checked','true')
        $(this).append("<i class='feather icon-check mr-50' style='float:left; margin-top: -5%; margin-left: 88%;'></i>")

        //Añadimos este usuario al tablero
        invite_id = $(this).attr('user')
        board_id = $('.board-id').val()
        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/add-invite/',
            data: {
                board_id: board_id,
                invite_id: invite_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'add_invite'
            },
            success: function(respuesta) {
                let result = respuesta
                let user = result.split(',')[0]
                let avatar = result.split(',')[1]
                $('.avatar-list').append(
                '<div class="avatar avatar_user board-avatar" user_id="'+user+'"><img src="/dashboard/staticfiles/images/portrait/small/'+avatar+'"></div>'
                )
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }
})

// Función para filtrar los tableros.
function showBoards() {
    let value = boardFilter.find(".active").attr('board')
    let myuser = $('.board-user_id').val()

    if (value == 0) {
        $('.board-item').each(function(index) {
            $(this).show()
        });
    } else if (value == 1) {
        $('.board-item').each(function(index) {
            if (myuser == $(this).attr('owner')) {
                $(this).show()
            } else {
                $(this).hide()
            }
        });
    } else if (value == 2) {
        $('.board-item').each(function(index) {
            if (myuser == $(this).attr('owner')) {
                $(this).hide()
            } else {
                $(this).show()
            }
        });
    }
}

// Barra de búsqueda de usuarios
$('.user-search').keyup(function () {
    let search = $(this).val()
    let count = 0;
    $(".board-item").each(function () {
        if ($(this).text().search(new RegExp(search, "i")) < 0) {
            $(this).fadeOut();
        } else {
            $(this).show();
            count++;
        }
    });
});

// Guardar un tablero en la base de datos
$(".saveBoard").click(function () {
    user_id = $('.board-user_id').val()
    company_id = $('.board-company_id').val()
    board_name = $('.board-name').val()
    background = $('.board-background').val()

    // Llamada AJAX
    if (validateEmpty(board_name)) {
        $.ajax({
            type: 'POST',
            url: '/save-board/',
            data: {
                user_id: user_id,
                company_id: company_id,
                board_name: board_name,
                background: background,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'save_board'
            },
            success: function(respuesta) {
                console.log(respuesta);
                $('.board-name').val('')
                $('.board-background').val('')

                $('.board-list').append(
                    '<a href="'+respuesta+'" style="width: 250px;margin-right: 2%;margin-top: 2%;">'+
                        '<div class="board-item board" style="background-color: #E4EBEB; width: 100%;" boardId="'+respuesta+'" owner="'+user_id+'">'+
                            '<p class="board-n">'+board_name+'</p>'+
                        '</div>'+
                    '</a>'
                )

                toastr.success('Operación realizada con éxito', 'El tablero ha sido añadido.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    } else {
        return toastr.error('El tablero debe tener un nombre.', 'Error');
    }
})

//// Renombrar un tablero
$('.character-counter').hide()
$('.character-counter-static').hide()
// Que no se pueda pulsar el intro y que no pueda ser una cadena mayor a 15 caracteres
$('.board-name').keydown(function (e) {
    $('.character-counter').show()
    $('.character-counter-static').show()
    if (e.which === 13) {
        e.preventDefault();
    }
    
    if ($('.board-name').text().length == 15) {
        if (e.which !== 8) {
            e.preventDefault();
        }
    }
})

//Contador de caracteres
$('.board-name').keyup(function (e) {
    $('.character-counter').text($('.board-name').text().length)
})

$('.board-name').focusout(function () {
    $('.character-counter').hide()
    $('.character-counter-static').hide()
    
    board_id = $('.board-id').val()
    board_name = $(this).text()

    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/rename-board/',
        data: {
            board_id: board_id,
            board_name: board_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'rename_board'
        },
        success: function(respuesta) {
            $(".dropdown-item.boards").each(function () {
                if ($(this).attr('href') == board_id) {
                    $(this).text(respuesta)
                }
            })
            $('.board-new_name').val()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
})

// Borrar un tablero
$(".board-delete").click(function () {
    board_id = $('.board-id').val()
    swal.fire({
        title: "¿Seguro que quieres borrar este tablero?",
        text: "Esta acción solo podrá revertirla el administrador de la empresa",
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SÍ'
    }) .then(function (resp) {
        if (resp['value'] == true) {
            // Llamada AJAX
            $.ajax({
                type: 'POST',
                url: '/delete-board/',
                data: {
                    board_id: board_id,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'delete_board'
                },
                success: function() {
                    location.href = "/boards"
                    toastr.success('Operación realizada con éxito', 'El tablero ha sido eliminado.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    })
})

// Guardar una lista en la base de datos
$(".saveList").click(function () {
    board_id = $('.board-id').val()
    list_name = $('.list-name').val()

    var order_id = 0
    $('.kanban-board').each(function(index) {
        let result = $(this).attr('order_id')
        order_id = result
    })
    order_id++

    // Llamada AJAX
    if (validateEmpty(list_name)) {
        $.ajax({
            type: 'POST',
            url: '/save-list/',
            data: {
                board_id: board_id,
                list_name: list_name,
                order_id: order_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'save_list'
            },
            success: function(respuesta) {
                $('.list-name').val('')
                toastr.success('Operación realizada con éxito', 'La lista ha sido añadida.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                
                $('.kanban-container').append(
                    '<div class="kanban-board" list_id='+respuesta+' order_id='+order_id+' style="width: 250px; margin-left: 15px; margin-right: 15px; float:left; margin-top:2%; height: auto;min-height: 15px;">'+
                        '<header class="kanban-board-header">'+
                            '<div class="kanban-title-board line-ellipsis list-new-name new" list_id='+respuesta+' contenteditable="true">'+list_name+'</div>'+
                            '<div class="kanban-board-move cursor-pointer" draggable="true" list_id="{{list.id}}" style="margin-right: 3%;"><i class="feather icon-move"></i></div>'+
                            '<div class="dropdown">'+
                                '<div class="dropdown-toggle cursor-pointer" role="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                    '<i class="feather icon-more-vertical"></i>'+
                                '</div>'+
                                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton" x-placement="bottom-end" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(23px, 24px, 0px);">'+
                                    '<a class="dropdown-item" list_id="'+respuesta+'"><i class="feather icon-copy mr-50"></i>Copiar Lista</a>'+
                                    '<a class="dropdown-item" list_id="'+respuesta+'"><i class="feather icon-move mr-50"></i>Mover Lista</a>'+
                                    '<a class="dropdown-item list-delete new" list_id="'+respuesta+'" id="kanban-delete"><i class="feather icon-trash-2 mr-50"></i>Borrar Lista</a>'+
                                '</div>'+
                            '</div>'+
                        '</header>'+
                        '<div class="kanban-cards ui-widget-header" list_id="'+respuesta+'">'+
                        '</div>'+
                        '<button class="kanban-title-button btn btn-default btn-xs add-card new" list_id="'+respuesta+'" style="font-weight: bold">Añadir nueva tarjeta</button>'+
                        '<button type="button" style="margin-left: 5%;" class="btn btn-info add-user-item saveCard new">'+
                            '<span class="d-none d-lg-block" data-i18n="Save">Añadir tarjeta</span>'+
                        '</button>'+
                        '<button style="margin-left: 3%;" class="btn btn-danger btn-xs btn-close new"><i class="feather icon-x"></i></button>'+
                    '</div>'
                )
                
                $('.saveCard.new').hide()
                $('.btn-close.new').hide()

                $(".add-card.new").click(function () {
                    $('.add-card').each(function(index) {
                        $(this).show()
                    })
                
                    $('.saveCard').each(function(index) {
                        $(this).hide()
                    })
                
                    $('.btn-close').each(function(index) {
                        $(this).hide()
                    })
                
                    $('.kanban-drag-new').each(function(index) {
                        $(this).hide()
                    })
                    
                    list_id_card = $(this).attr('list_id')
                    item = $(this).closest($('.kanban-board'))
                    cards = item.find($('.kanban-cards'))
                    button = $(this)
                    btn_add = item.find($('.saveCard'))
                    btn_close = item.find($('.btn-close'))
                    item_list_id = item.attr('list_id')

                    if (item_list_id == list_id_card) {
                        button.hide()
                        cards.append(
                            '<main class="kanban-drag kanban-drag-new">'+
                                '<div style="background-color: #f5f7fa;" class="kanban-item">'+
                                    '<p contenteditable="true" style="outline: 0px solid transparent;" class="card-issue"></p>'+
                                '</div>'+
                            '</main>'
                        )
                        setTimeout(function(){ kanbanAutofocus(); }, 500);
                        
                        btn_add.show()
                        btn_close.show()
                    }

                    $('.kanban-cards').each(function(index) {
                        if ($(this).attr('list_id') == list_id_card) {
                            function updateScrollNew(){
                                $('.kanban-cards').each(function(index) {
                                    if ($(this).attr('list_id') == list_id_card) {
                                        $(this).animate({ scrollTop: $(this).prop("scrollHeight")}, 500);
                                        $('.card-issue').each(function(index) {
                                            $(this).focus()
                                            console.log('antes');
                                        })
                                    }
                                })
                            }
                            setTimeout(function(){ updateScrollNew(); }, 200);
                        }
                    })
                })

                        
                // Funcionalidad de los botones de añadir nueva tarjeta.
                $(".btn-close.new").click(function () {
                    $('.kanban-drag-new').hide()
                    $('.saveCard').hide()
                    $('.btn-close').hide()

                    item = $(this).closest($('.kanban-board'))
                    button = item.find($('.add-card'))
                    button.show()
                })

                // Guardar una tarjeta en la base de datos
                $(".saveCard.new").click(function () {
                    board_id = $('.board-id').val()
                    owner_id = $('.owner-id').val()
                    company_id = $('.company-id').val()
                    card_issue = $('.card-issue').text()

                    $('.kanban-drag-new').hide()
                    $('.saveCard').hide()
                    $('.btn-close').hide()
                    item = $(this).closest($('.kanban-board'))
                    button = item.find($('.add-card'))
                    button.show()

                    var order_id=0
                    $('.kanban-drag').each(function(index) {
                        if ($(this).attr('list_id') == list_id_card) {
                            let result = $(this).attr('order_id')
                            order_id = result
                        }
                    })
                    order_id++

                    // Llamada AJAX
                    if (validateEmpty(card_issue)) {
                        $.ajax({
                            type: 'POST',
                            url: '/save-card/', 
                            data: {
                                board_id: board_id,
                                list_id_card: list_id_card,
                                owner_id: owner_id,
                                company_id: company_id,
                                card_issue: card_issue,
                                order_id: order_id,
                                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                action: 'save_card'
                            },
                            success: function(respuesta) {
                                toastr.success('Operación realizada con éxito', 'La tarjeta ha sido añadida.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                                
                                $('.kanban-cards').each(function(index) {
                                    if ($(this).attr('list_id') == list_id_card) {
                                        $(this).append(
                                            '<main class="kanban-drag" list_id="'+list_id_card+'" card_id="'+respuesta+'" order_id="'+order_id+'">'+
                                                '<div data-toggle="modal" data-target="#CardInfoModal" draggable="true" style="background-color: #f5f7fa;" class="kanban-item new" card_id="'+respuesta+'" card_issue="'+card_issue+'" card_description="" card_deadline="" card_board_id="'+board_id+'" card_list_id="'+list_id_card+'" card_labels="" card_members="">'+
                                                    '<div class="info-card-labels">'+
                                                    '</div>'+
                                                    '<div class="info-card-issue" style="margin-top: 2%;">'+
                                                        '<p class="info-card-issue text">'+card_issue+'</p>'+
                                                            '<div class="float-right fast-edit-card" card-id="'+respuesta+'" style="display: none;"><a href="#" class="warning" data-target="#FastEditModal" data-toggle="modal" style="z-index:10000;position:absolute;top:10px;right:10px;background-color:transparent;">&nbsp;<i class="fas fa-pen-alt"></i></a></div>'+
                                                    '</div>'+
                                                    '<div class="info-card-deadline" style="margin-bottom: -6%; height: 20px; display:none; float:left;">'+
                                                    '</div>'+
                                                    '<div class="info-card-members" style="margin-bottom: -6%; height: 40px; display:none;">'+
                                                    '</div>'+
                                                '</div>'+
                                            '</main>'
                                        )
                                    }
                                })
                                $('.card-issue').text('')
                                // Ver la información de una tarjeta en el modal
                                $(".kanban-item.new").click(function () {
                                    dataCard_id = $(this).attr('card_id')
                                    $('.deadline-state').remove()
                                    $('.div-state').append(
                                        '<p class="deadline-state"></p>'
                                    )

                                    // Llamada AJAX
                                    $.ajax({
                                        type: 'POST',
                                        url: '/get-info-card/',
                                        data: {
                                            dataCard_id: dataCard_id,
                                            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                            action: 'get_info_card'
                                        },
                                        success: function(respuesta) {
                                            let item = JSON.parse(respuesta);

                                            $('.dataCard-avatars').show()
                                            $('.dataCard-labels').show()

                                            $('.dataCard-avatars').empty()
                                            $('.dataCard-avatars').append(
                                                '<h6>Miembros</h6>'
                                            )

                                            $('.dataCard-labels').empty()
                                            $('.dataCard-labels').append(
                                                '<h6>Etiquetas</h6>'
                                            )

                                            $('.dataCard-id').val(item['card'][0]['pk'])
                                            $('.dataCard-issue').text(item['card'][0]['fields'].issue)
                                            $('.dataCard-description').text(item['card'][0]['fields'].description)

                                            if (item['card'][0]['fields'].deadline) {
                                                let date = item['card'][0]['fields'].deadline.split('T')[0]
                                                let h = item['card'][0]['fields'].deadline.split('T')[1].split('Z')[0]
                                                let hour = h.split(':')[0]+':'+h.split(':')[1]

                                                $('.dataCard-finished').show()
                                                $('.dataCard-deadline').val(date.split('-')[2]+'/'+date.split('-')[1]+'/'+date.split('-')[0]+' - '+hour)
                                                if (item['card'][0]['fields'].finished == true) {
                                                    $('.dataCard-finished').prop('checked', true)
                                                }
                                            } else {
                                                $('.dataCard-finished').hide()
                                                $('.dataCard-deadline').val("Sin fecha")
                                                $('.deadline-state').remove()
                                            }
                                            
                                            if (item['card'][0]['fields'].members == ",") {
                                                $('.dataCard-avatars').hide()
                                            } else {
                                                for (let a = 0; a < item['avatars'].length; a++) {
                                                    $('.dataCard-avatars').append(
                                                        '<div style="float: left; margin-right: 1%;" class="avatar avatar_user avatar_card_member" user_id="'+item['avatars'][a].id+'"><img src="/dashboard/staticfiles/images/portrait/small/'+item['avatars'][a].avatar+'"></div>'
                                                    )
                                                }
                                            }

                                            if (item['card'][0]['fields'].labels == ",") {
                                                $('.dataCard-labels').hide()
                                            } else {
                                                for (let l = 0; l < item['labels'].length; l++) {
                                                    $('.dataCard-labels').append(
                                                        '<div style="background-color:'+item['labels'][l].label_color+'" class="mini-labels" label="'+item['labels'][l].id+'">'+
                                                            '<p class="mini-label-text" style="margin: auto; padding: 5px;">'+item['labels'][l].name+'</p>'+
                                                        '</div>'
                                                    )
                                                }
                                            }

                                            if ($(".dataCard-finished").prop('checked')) {
                                                $('.deadline-state').text("TERMINADA")
                                                $('.deadline-state').removeClass('state-yellow state-red')
                                                $('.deadline-state').addClass('state-green')

                                                $('.kanban-item').each(function(index) {
                                                    let item = $(this)
                                                    if (item.attr('card_id') == dataCard_id) {
                                                        let div = item.find('.mini-label.info_card')
                                                        div.css('background-color', '#77D797')
                                                        div.css('color', 'white')
                                                    }
                                                })
                                            } else {
                                                if (item['card'][0]['fields'].deadline) {
                                                    let date1 = new Date(item['card'][0]['fields'].deadline);
                                                    let date2 = new Date()
                                                    let zone = (date1.getTimezoneOffset());
                                                    zone = (zone)/(-60)
                                
                                                    let result = date1.getTime() - date2.getTime()
                                                    let horas = (Math.floor(result/ (1000*60*60)))
                                                    let minutos = (Math.floor(result/ (1000*60)) - (horas*60))
                                                    horas = horas-zone
                                
                                                    if (horas == 0) {
                                                        $('.deadline-state').text("VENCE PRONTO")
                                                        $('.deadline-state').removeClass('state-green state-red')
                                                        $('.deadline-state').addClass('state-yellow')

                                                        $('.kanban-item').each(function(index) {
                                                            let item = $(this)
                                                            if (item.attr('card_id') == dataCard_id) {
                                                                let div = item.find('.mini-label.info_card')
	                                                            div.css('background-color', '#EDFB09')
                                                                div.css('color', '#404e67')
                                                            }
                                                        })
                                                    } else if (horas < 0) {
                                                        $('.deadline-state').text("PLAZO VENCIDO")
                                                        $('.deadline-state').removeClass('state-yellow state-green')
                                                        $('.deadline-state').addClass('state-red')

                                                        $('.kanban-item').each(function(index) {
                                                            let item = $(this)
                                                            if (item.attr('card_id') == dataCard_id) {
                                                                let div = item.find('.mini-label.info_card')
	                                                            div.css('background-color', '#F55F5F')
                                                                div.css('color', 'white')
                                                            }
                                                        })
                                                    } else if ((0 < horas) && (horas < 24)) {
                                                        $('.deadline-state').text("VENCE PRONTO")
                                                        $('.deadline-state').removeClass('state-green state-red')
                                                        $('.deadline-state').addClass('state-yellow')

                                                        $('.kanban-item').each(function(index) {
                                                            let item = $(this)
                                                            if (item.attr('card_id') == dataCard_id) {
                                                                let div = item.find('.mini-label.info_card')
	                                                            div.css('background-color', '#EDFB09')
                                                                div.css('color', '#404e67')
                                                            }
                                                        })
                                                    } else if (horas >= 24) {
                                                        $('.kanban-item').each(function(index) {
                                                            let item = $(this)
                                                            if (item.attr('card_id') == dataCard_id) {
                                                                let div = item.find('.mini-label.info_card')
                                                                div.css('background-color', 'burlywood')
                                                                div.css('color', 'white')
                                                            }
                                                        })
                                                    }
                                                }
                                            }


                                        },
                                        error: function (xhr, errmsg, err) {
                                            console.log(xhr.status + ": " + xhr.responseText);
                                        }
                                    });
                                })
                                $(".kanban-item.new").removeClass('new')

                                dnd_card()
                            },
                            error: function (xhr, errmsg, err) {
                                console.log(xhr.status + ": " + xhr.responseText);
                            }
                        });
                    } else {
                        return toastr.error('La tarjeta debe tener un nombre', 'Error');
                    }
                })

                // Borrar una lista del tablero
                $(".list-delete.new").click(function () {
                    list_id = $(this).attr('list_id')

                    // Llamada AJAX
                    $.ajax({
                        type: 'POST',
                        url: '/delete-list/',
                        data: {
                            list_id: list_id,
                            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                            action: 'delete_list'
                        },
                        success: function() {
                            $(".kanban-board").each(function () {
                                if ($(this).attr('list_id') == list_id) {
                                    $(this).remove()
                                }
                            })
                            setSize()
                            toastr.success('Operación realizada con éxito', 'La lista ha sido eliminada.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                        },
                        error: function (xhr, errmsg, err) {
                            console.log(xhr.status + ": " + xhr.responseText);
                        }
                    });
                })

                // Renombrar una lista
                $('.list-new-name.new').keydown(function (e) {
                    if (e.which === 13) {
                        e.preventDefault();
                    }
                })
                $('.list-new-name.new').focusout(function () {
                    list_id = $(this).attr('list_id')
                    new_name = $(this).text()
                    
                    // Llamada AJAX
                    $.ajax({
                        type: 'POST',
                        url: '/rename-list/',
                        data: {
                            list_id: list_id,
                            new_name: new_name,
                            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                            action: 'rename_list'
                        },
                        success: function() {

                        },
                        error: function (xhr, errmsg, err) {
                            console.log(xhr.status + ": " + xhr.responseText);
                        }
                    });
                });
                
                $('.saveCard.new').removeClass('new')
                $('.btn-close.new').removeClass('new')
                $(".add-card.new").removeClass('new')
                $(".list-delete.new").removeClass('new')
                $('.list-new-name.new').removeClass('new')

                dnd_list()
                dnd_card()
                setSize()
                emptyListSize()
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    } else {
        return toastr.error('La lista debe tener un nombre', 'Error');
    }
})

// Renombrar una lista
$('.list-new-name').keydown(function (e) {
	if (e.which === 13) {
	    e.preventDefault();
	}
})

$('.list-new-name').focusout(function () {
    list_id = $(this).attr('list_id')
    new_name = $(this).text()
    
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/rename-list/',
        data: {
            list_id: list_id,
            new_name: new_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'rename_list'
        },
        success: function() {

        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});

// Borrar una lista del tablero
$(".list-delete").click(function () {
    list_id = $(this).attr('list_id');
    console.log('entra');
    // Llamada AJAX
    swal.fire({
        title: '¿Deseas eliminar la lista?',
        text: "Esta acción solo podrá revertirla el administrador de la empresa",
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true) {
            $.ajax({
                type: 'POST',
                url: '/delete-list/',
                data: {
                    list_id: list_id,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'delete_list'
                },
                success: function() {
                    $(".kanban-board").each(function () {
                        if ($(this).attr('list_id') == list_id) {
                            $(this).remove()
                        }
                    })
                    setSize()
                    toastr.success('Operación realizada con éxito', 'La lista ha sido eliminada.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    });
})

//Guardar el atributo de la lista
var list_id_card;
$('.saveCard').hide()
$('.btn-close').hide()

$(".add-card").click(function () {
    let element = this;
    $('.add-card').each(function(index) {
        $(this).show()
    })

    $('.saveCard').each(function(index) {
        $(this).hide()
    })

    $('.btn-close').each(function(index) {
        $(this).hide()
    })

    $('.kanban-drag-new').each(function(index) {
        $(this).hide()
    })
    $(element).parent().siblings('btn-close').show();
    $(element).parent().siblings('saveCard').show();
    $(element).siblings('kanban-drag-new ').show();

    list_id_card = $(this).attr('list_id')
    item = $(this).closest($('.kanban-board'))
    cards = item.find($('.kanban-cards'))
    button = $(this)
    btn_add = item.find($('.saveCard'))
    btn_close = item.find($('.btn-close'))
    item_list_id = item.attr('list_id')

    if (item_list_id == list_id_card) {
        button.hide()
        cards.append(
            '<main class="kanban-drag kanban-drag-new">'+
                '<div style="background-color: #f5f7fa;" class="kanban-item">'+
                    '<p contenteditable="true" style="outline: 0px solid transparent;" class="card-issue"></p>'+
                '</div>'+
            '</main>'
        )
        btn_add.show()
        btn_close.show()
    }

    $('.kanban-cards').each(function(index) {
        if ($(this).attr('list_id') == list_id_card) {
            function updateScroll(){
                $('.kanban-cards').each(function(index) {
                    if ($(this).attr('list_id') == list_id_card) {
                        $(this).animate({ scrollTop: $(this).prop("scrollHeight")}, 500);
                        $('.card-issue').each(function(index) {
                            $(this).focus()
                        })
                        
                    }
                    
                })
            }
            setTimeout(function(){ updateScroll(); }, 200);
        }
    })
})

// Funcionalidad de los botones de añadir nueva tarjeta.
$(".btn-close").click(function () {
    $('.kanban-drag-new').hide()
    $('.saveCard').hide()
    $('.btn-close').hide()

    item = $(this).closest($('.kanban-board'))
    button = item.find($('.add-card'))
    button.show()
})

// Guardar una tarjeta en la base de datos
$(".saveCard").click(function () {
    board_id = $('.board-id').val()
    owner_id = $('.owner-id').val()
    company_id = $('.company-id').val()
    card_issue = $('.card-issue').text()

    $('.kanban-drag-new').hide()
    $('.saveCard').hide()
    $('.btn-close').hide()
    item = $(this).closest($('.kanban-board'))
    button = item.find($('.add-card'))
    button.show()

    var order_id=0
    $('.kanban-drag').each(function(index) {
        if ($(this).attr('list_id') == list_id_card) {
            let result = $(this).attr('order_id')
            order_id = result
        }
    })
    order_id++

    // Llamada AJAX
    if (validateEmpty(card_issue)) {
        $.ajax({
            type: 'POST',
            url: '/save-card/', 
            data: {
                board_id: board_id,
                list_id_card: list_id_card,
                owner_id: owner_id,
                company_id: company_id,
                card_issue: card_issue,
                order_id: order_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'save_card'
            },
            success: function(respuesta) {
                toastr.success('Operación realizada con éxito', 'La tarjeta ha sido añadida.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                
                $('.kanban-cards').each(function(index) {
                    if ($(this).attr('list_id') == list_id_card) {
                        $(this).append(
                            '<main class="kanban-drag" list_id="'+list_id_card+'" card_id="'+respuesta+'" order_id="'+order_id+'">'+
                                '<div data-toggle="modal" data-target="#CardInfoModal" draggable="true" style="background-color: #f5f7fa;" class="kanban-item new" card_id="'+respuesta+'" card_issue="'+card_issue+'" card_description="" card_deadline="" card_board_id="'+board_id+'" card_list_id="'+list_id_card+'" card_labels="" card_members="">'+
                                    '<div class="info-card-labels">'+
                                    '</div>'+
                                    '<div class="info-card-issue" style="margin-top: 2%;">'+
                                        '<p class="info-card-issue text">'+card_issue+'</p>'+
                                    '</div>'+
                                    '<div class="info-card-deadline" style="margin-bottom: -6%; height: 20px; display:none; float:left;">'+
                                    '</div>'+
                                    '<div class="info-card-members" style="margin-bottom: -6%; height: 40px; display:none;">'+
                                    '</div>'+
                                '</div>'+
                            '</main>'
                        )
                    }
                })
                $('.card-issue').text('')
                // Ver la información de una tarjeta en el modal
                $(".kanban-item.new").click(function () {
                    dataCard_id = $(this).attr('card_id')
                    $('.deadline-state').remove()
                    $('.div-state').append(
                        '<p class="deadline-state"></p>'
                    )

                    // Llamada AJAX
                    $.ajax({
                        type: 'POST',
                        url: '/get-info-card/',
                        data: {
                            dataCard_id: dataCard_id,
                            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                            action: 'get_info_card'
                        },
                        success: function(respuesta) {
                            let item = JSON.parse(respuesta);

                            $('.dataCard-avatars').show()
                            $('.dataCard-labels').show()

                            $('.dataCard-avatars').empty()
                            $('.dataCard-avatars').append(
                                '<h6>Miembros</h6>'
                            )

                            $('.dataCard-labels').empty()
                            $('.dataCard-labels').append(
                                '<h6>Etiquetas</h6>'
                            )
                            
                            $('.dataCard-id').val(item['card'][0]['pk'])
                            $('.dataCard-issue').text(item['card'][0]['fields'].issue)
                            $('.dataCard-description').text(item['card'][0]['fields'].description)

                            if (item['card'][0]['fields'].deadline) {
                                let date = item['card'][0]['fields'].deadline.split('T')[0]
                                let h = item['card'][0]['fields'].deadline.split('T')[1].split('Z')[0]
                                let hour = h.split(':')[0]+':'+h.split(':')[1]

                                $('.dataCard-finished').show()
                                $('.dataCard-deadline').val(date.split('-')[2]+'/'+date.split('-')[1]+'/'+date.split('-')[0]+' - '+hour)
                                if (item['card'][0]['fields'].finished == true) {
                                    $('.dataCard-finished').prop('checked', true)
                                }
                            } else {
                                $('.dataCard-finished').hide()
                                $('.dataCard-deadline').val("Sin fecha")
                                $('.deadline-state').remove()
                            }
                            
                            if (item['card'][0]['fields'].members == ",") {
                                $('.dataCard-avatars').hide()
                            } else {
                                for (let a = 0; a < item['avatars'].length; a++) {
                                    $('.dataCard-avatars').append(
                                        '<div style="float: left; margin-right: 1%;" class="avatar avatar_user avatar_card_member" user_id="'+item['avatars'][a].id+'"><img src="/dashboard/staticfiles/images/portrait/small/'+item['avatars'][a].avatar+'"></div>'
                                    )
                                }
                            }

                            if (item['card'][0]['fields'].labels == ",") {
                                $('.dataCard-labels').hide()
                            } else {
                                for (let l = 0; l < item['labels'].length; l++) {
                                    $('.dataCard-labels').append(
                                        '<div style="background-color:'+item['labels'][l].label_color+'" class="mini-labels" label="'+item['labels'][l].id+'">'+
                                            '<p class="mini-label-text" style="margin: auto; padding: 5px;">'+item['labels'][l].name+'</p>'+
                                        '</div>'
                                    )
                                }
                            }

                            if ($(".dataCard-finished").prop('checked')) {
                                $('.deadline-state').text("TERMINADA")
                                $('.deadline-state').removeClass('state-yellow state-red')
                                $('.deadline-state').addClass('state-green')

                                $('.kanban-item').each(function(index) {
                                    let item = $(this)
                                    if (item.attr('card_id') == dataCard_id) {
                                        let div = item.find('.mini-label.info_card')
                                        div.css('background-color', '#77D797')
                                        div.css('color', 'white')
                                    }
                                })
                            } else {
                                if (item['card'][0]['fields'].deadline) {
                                    let date1 = new Date(item['card'][0]['fields'].deadline);
                                    let date2 = new Date()
                                    let zone = (date1.getTimezoneOffset());
                                    zone = (zone)/(-60)
                
                                    let result = date1.getTime() - date2.getTime()
                                    let horas = (Math.floor(result/ (1000*60*60)))
                                    let minutos = (Math.floor(result/ (1000*60)) - (horas*60))
                                    horas = horas-zone
                
                                    if (horas == 0) {
                                        $('.deadline-state').text("VENCE PRONTO")
                                        $('.deadline-state').removeClass('state-green state-red')
                                        $('.deadline-state').addClass('state-yellow')

                                        $('.kanban-item').each(function(index) {
                                            let item = $(this)
                                            if (item.attr('card_id') == dataCard_id) {
                                                let div = item.find('.mini-label.info_card')
                                                div.css('background-color', '#EDFB09')
                                                div.css('color', '#404e67')
                                            }
                                        })
                                    } else if (horas < 0) {
                                        $('.deadline-state').text("PLAZO VENCIDO")
                                        $('.deadline-state').removeClass('state-yellow state-green')
                                        $('.deadline-state').addClass('state-red')

                                        $('.kanban-item').each(function(index) {
                                            let item = $(this)
                                            if (item.attr('card_id') == dataCard_id) {
                                                let div = item.find('.mini-label.info_card')
                                                div.css('background-color', '#F55F5F')
                                                div.css('color', 'white')
                                            }
                                        })
                                    } else if ((0 < horas) && (horas < 24)) {
                                        $('.deadline-state').text("VENCE PRONTO")
                                        $('.deadline-state').removeClass('state-green state-red')
                                        $('.deadline-state').addClass('state-yellow')

                                        $('.kanban-item').each(function(index) {
                                            let item = $(this)
                                            if (item.attr('card_id') == dataCard_id) {
                                                let div = item.find('.mini-label.info_card')
                                                div.css('background-color', '#EDFB09')
                                                div.css('color', '#404e67')
                                            }
                                        })
                                    } else if (horas >= 24) {
                                        $('.kanban-item').each(function(index) {
                                            let item = $(this)
                                            if (item.attr('card_id') == dataCard_id) {
                                                let div = item.find('.mini-label.info_card')
                                                div.css('background-color', 'burlywood')
                                                div.css('color', 'white')
                                            }
                                        })
                                    }
                                }
                            }
                        },
                        error: function (xhr, errmsg, err) {
                            console.log(xhr.status + ": " + xhr.responseText);
                        }
                    });
                })
                $(".kanban-item.new").removeClass('new')

                dnd_card()
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    } else {
        return toastr.error('La tarjeta debe tener un nombre', 'Error');
    }
})

// Renombrar una tarjeta
$('.dataCard-issue').keydown(function (e) {
	if (e.which === 13) {
	    e.preventDefault();
	}
})



$('.dataCard-issue').focusout(function () {
    card_id = $('.dataCard-id').val()
    new_name = $(this).text()
    
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/rename-card/',
        data: {
            card_id: card_id,
            new_name: new_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'rename_card'
        },
        success: function() {
            $('.kanban-item').each(function(index) {
                if ($(this).attr('card_id') == card_id) {
                    let only_this = $(this).find('.info-card-issue.text')
                    only_this.text(new_name)
                }
            })
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});

$('.dataCard-description').focusout(function(){
    let element = this;
    let card_id = $('.dataCard-id').val();

    $.ajax({
        type: 'POST',
        url: '/rename-description/',
        data: {
            card_id: card_id,
            description: $(element).val(),
            action: 'rename_description',
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success:function(res){
            toastr.success('Operacion realizada con exito','La descipcion ha sido modificada')
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    })

}); 

// Ver la información de una tarjeta en el modal // SIN QUE SE CREEN NUEVAS
$(".kanban-item").click(function (e) {
    let deadline_div = $(this).find('.mini-label.info_card')
    let deadline_icon = $(this).find('.feather')
    let data1 = $(e.target)
    if ((data1[0] == deadline_div[0]) || (data1[0] == deadline_icon[0])) {
        e.stopPropagation();
    } else {
        dataCard_id = $(this).attr('card_id')
        $('.deadline-state').remove()
        $('.div-state').append(
            '<p class="deadline-state"></p>'
        )

        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/get-info-card/',
            data: {
                dataCard_id: dataCard_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'get_info_card'
            },
            success: function(respuesta) {
                let item = JSON.parse(respuesta);

                $('.dataCard-avatars').show()
                $('.dataCard-labels').show()

                $('.dataCard-avatars').empty()
                $('.dataCard-avatars').append(
                    '<h6>Miembros</h6>'
                )

                $('.dataCard-labels').empty()
                $('.dataCard-labels').append(
                    '<h6>Etiquetas</h6>'
                )

                $('.dataCard-id').val(item['card'][0]['pk'])
                $('.dataCard-issue').text(item['card'][0]['fields'].issue)
                $('.dataCard-description').text(item['card'][0]['fields'].description)

                if (item['card'][0]['fields'].deadline) {
                    if (item['card'][0]['fields'].finished == true) {
                        $('.dataCard-finished').prop('checked', true)
                    } else {
                        $('.dataCard-finished').prop('checked', false)
                    }
                    let date = item['card'][0]['fields'].deadline.split('T')[0]
                    let h = item['card'][0]['fields'].deadline.split('T')[1].split('Z')[0]
                    let hour = h.split(':')[0]+':'+h.split(':')[1]

                    $('.dataCard-finished').show()
                    $('.dataCard-deadline').val(date.split('-')[2]+'/'+date.split('-')[1]+'/'+date.split('-')[0]+' - '+hour)
                    if (item['card'][0]['fields'].finished == true) {
                        $('.dataCard-finished').prop('checked', true)
                    }
                } else {
                    $('.dataCard-finished').hide()
                    $('.dataCard-deadline').val("Sin fecha")
                    $('.deadline-state').remove()
                }
                
                if (item['card'][0]['fields'].members == ",") {
                    $('.dataCard-avatars').hide()
                } else {
                    for (let a = 0; a < item['avatars'].length; a++) {
                        $('.dataCard-avatars').append(
                            '<div style="float: left; margin-right: 1%;" class="avatar avatar_user avatar_card_member" user_id="'+item['avatars'][a].id+'"><img src="/dashboard/staticfiles/images/portrait/small/'+item['avatars'][a].avatar+'"></div>'
                        )
                    }
                }

                if (item['card'][0]['fields'].labels == ",") {
                    $('.dataCard-labels').hide()
                } else {
                    for (let l = 0; l < item['labels'].length; l++) {
                        $('.dataCard-labels').append(
                            '<div style="background-color:'+item['labels'][l].label_color+'" class="mini-labels" label="'+item['labels'][l].id+'">'+
                                '<p class="mini-label-text" style="margin: auto; padding: 5px;">'+item['labels'][l].name+'</p>'+
                            '</div>'
                        )
                    }
                }

                if ($(".dataCard-finished").prop('checked')) {
                    $('.deadline-state').text("TERMINADA")
                    $('.deadline-state').removeClass('state-yellow state-red')
                    $('.deadline-state').addClass('state-green')

                    $('.kanban-item').each(function(index) {
                        let item = $(this)
                        if (item.attr('card_id') == dataCard_id) {
                            let div = item.find('.mini-label.info_card')
                            div.css('background-color', '#77D797')
                            div.css('color', 'white')
                        }
                    })
                } else {
                    if (item['card'][0]['fields'].deadline) {
                        let date1 = new Date(item['card'][0]['fields'].deadline);
                        let date2 = new Date()
                        let zone = (date1.getTimezoneOffset());
                        zone = (zone)/(-60)

                        let result = date1.getTime() - date2.getTime()
                        let horas = (Math.floor(result/ (1000*60*60)))
                        let minutos = (Math.floor(result/ (1000*60)) - (horas*60))
                        horas = horas-zone

                        if (horas == 0) {
                            $('.deadline-state').text("VENCE PRONTO")
                            $('.deadline-state').removeClass('state-green state-red')
                            $('.deadline-state').addClass('state-yellow')

                            $('.kanban-item').each(function(index) {
                                let item = $(this)
                                if (item.attr('card_id') == dataCard_id) {
                                    let div = item.find('.mini-label.info_card')
                                    div.css('background-color', '#EDFB09')
                                    div.css('color', '#404e67')
                                }
                            })
                        } else if (horas < 0) {
                            $('.deadline-state').text("PLAZO VENCIDO")
                            $('.deadline-state').removeClass('state-yellow state-green')
                            $('.deadline-state').addClass('state-red')

                            $('.kanban-item').each(function(index) {
                                let item = $(this)
                                if (item.attr('card_id') == dataCard_id) {
                                    let div = item.find('.mini-label.info_card')
                                    div.css('background-color', '#F55F5F')
                                    div.css('color', 'white')
                                }
                            })
                        } else if ((0 < horas) && (horas < 24)) {
                            $('.deadline-state').text("VENCE PRONTO")
                            $('.deadline-state').removeClass('state-green state-red')
                            $('.deadline-state').addClass('state-yellow')

                            $('.kanban-item').each(function(index) {
                                let item = $(this)
                                if (item.attr('card_id') == dataCard_id) {
                                    let div = item.find('.mini-label.info_card')
                                    div.css('background-color', '#EDFB09')
                                    div.css('color', '#404e67')
                                }
                            })
                        } else if (horas >= 24) {
                            $('.kanban-item').each(function(index) {
                                let item = $(this)
                                if (item.attr('card_id') == dataCard_id) {
                                    let div = item.find('.mini-label.info_card')
                                    div.css('background-color', 'burlywood')
                                    div.css('color', 'white')
                                }
                            })
                        }
                    }
                }
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }
})

//Que el check interactue sobre la base de datos para finalizar o reanudar una tarea
$(".dataCard-finished").click(function () {
    if ($(".dataCard-finished").prop('checked')) {
        card_id = $('.dataCard-id').val()

        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/finish-card/',
            data: {
                card_id: card_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'finish_card'
            },
            success: function() {
                $('.deadline-state').text('TERMINADA')
                $('.deadline-state').removeClass('state-yellow state-red')
                $('.deadline-state').addClass('state-green')

                $('.kanban-item').each(function(index) {
                    let item = $(this)
                    if (item.attr('card_id') == dataCard_id) {
                        item.attr('card_finished', 'True')
                        let div = item.find('.mini-label.info_card')
                        div.css('background-color', '#77D797')
                        div.css('color', 'white')
                        let icon = div.find('.feather')
                        icon.removeClass('icon-clock')
                        icon.addClass('icon-check-square')
                    }
                })
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    } else {
        card_id = $('.dataCard-id').val()

        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/unfinish-card/',
            data: {
                card_id: card_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'unfinish_card'
            },
            success: function(respuesta) {
                $('.deadline-state').text("")
                $('.deadline-state').removeClass('state-green')
                let date1 = new Date(respuesta);
                let date2 = new Date()
                let zone = (date1.getTimezoneOffset());
                zone = (zone)/(-60)

                let result = date1.getTime() - date2.getTime()
                let horas = (Math.floor(result/ (1000*60*60)))
                horas = horas-zone

                if (horas == 0) {
                    $('.deadline-state').text("VENCE PRONTO")
                    $('.deadline-state').removeClass('state-green state-red')
                    $('.deadline-state').addClass('state-yellow')

                    $('.kanban-item').each(function(index) {
                        let item = $(this)
                        if (item.attr('card_id') == dataCard_id) {
                            item.attr('card_finished', 'False')
                            let div = item.find('.mini-label.info_card')
                            div.css('background-color', '#EDFB09')
                            div.css('color', '#404e67')
                            let icon = div.find('.feather')
                            icon.removeClass('icon-check-square')
                            icon.addClass('icon-clock')
                        }
                    })
                } else if (horas < 0) {
                    $('.deadline-state').text("PLAZO VENCIDO")
                    $('.deadline-state').addClass('state-red')

                    $('.kanban-item').each(function(index) {
                        let item = $(this)
                        if (item.attr('card_id') == dataCard_id) {
                            item.attr('card_finished', 'False')
                            let div = item.find('.mini-label.info_card')
                            div.css('background-color', '#F55F5F')
                            div.css('color', 'white')
                            let icon = div.find('.feather')
                            icon.removeClass('icon-check-square')
                            icon.addClass('icon-clock')
                        }
                    })
                } else if ((0 < horas) && (horas < 24)) {
                    $('.deadline-state').text("VENCE PRONTO")
                    $('.deadline-state').addClass('state-yellow')

                    $('.kanban-item').each(function(index) {
                        let item = $(this)
                        if (item.attr('card_id') == dataCard_id) {
                            item.attr('card_finished', 'False')
                            let div = item.find('.mini-label.info_card')
                            div.css('background-color', '#EDFB09')
                            div.css('color', '#404e67')
                            let icon = div.find('.feather')
                            icon.removeClass('icon-check-square')
                            icon.addClass('icon-clock')
                        }
                    })
                } else if (horas >= 24) {
                    $('.kanban-item').each(function(index) {
                        let item = $(this)
                        if (item.attr('card_id') == dataCard_id) {
                            item.attr('card_finished', 'False')
                            let div = item.find('.mini-label.info_card')
                            div.css('background-color', 'burlywood')
                            div.css('color', 'white')
                            let icon = div.find('.feather')
                            icon.removeClass('icon-check-square')
                            icon.addClass('icon-clock')
                        }
                    })
                }
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }
})

//DIV de Members / Ocultar al hacer click fuera del mismo
$('.div-members-main').hide()

// Ver los miembros del tablero
$(".right-menu_members").click(function () {
    $('.div-members-main').show()
    $('.div-members').empty()

    board_id = $('.board-id').val()
    card_id = $('.dataCard-id').val()

    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/get-members/',
        data: {
            card_id: card_id,
            board_id: board_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'get_members'
        },
        success: function(respuesta) {
            let json = JSON.parse(respuesta)
            let members = json['members'][0]['fields'].members.split(',')
            let contador = 0

            for (let a = 0; a < json['access'].length; a++) {
                contador = 0
                for (let x = 0; x < members.length; x++) {
                    if (json['access'][a]['pk'] == members[x]) {
                        $('.div-members').append(
                            '<div class="board-item member-info" style="background-color: white; margin-left: -2.2%; margin-right: -2%;" user='+json['access'][a]['pk']+' checked=\'checked\'>'+
                                '<div class="todo-title-wrapper d-flex justify-content-between align-items-center" style="margin-left:23.5%">'+
                                    '<div class="todo-title-area d-flex" style="widht: 100%">'+
                                        '<div class="avatar avatar_user member-avatar"><img src="/dashboard/staticfiles/images/portrait/small/'+json['access'][a]['fields'].avatar+'"></div>'+
                                        '<p class="aqui mx-50 m-0 truncate member-user" style="width:100%;">'+json['access'][a]['fields'].first_name+' '+json['access'][a]['fields'].last_name+'</p>'+
                                    '</div>'+
                                '</div>'+
                                '<i class=\'feather icon-check mr-50\' style=\'float:left; margin-top: -11%; margin-left: 95%;\'></i>'+
                            '</div>'
                        )
                        contador++
                    }
                }
                if (contador == 0) {
                    $('.div-members').append(
                        '<div class="board-item member-info" style="background-color: white; margin-left: -2.2%; margin-right: -2%;" user='+json['access'][a]['pk']+'>'+
                            '<div class="todo-title-wrapper d-flex justify-content-between align-items-center" style="margin-left:23.5%">'+
                                '<div class="todo-title-area d-flex" style="widht: 100%">'+
                                    '<div class="avatar avatar_user member-avatar"><img src="/dashboard/staticfiles/images/portrait/small/'+json['access'][a]['fields'].avatar+'"></div>'+
                                    '<p class="mx-50 m-0 truncate member-user" style="width:100%;">'+json['access'][a]['fields'].first_name+' '+json['access'][a]['fields'].last_name+'</p>'+
                                '</div>'+
                            '</div>'+
                        '</div>'
                    )
                }
            }
            // Añadir o quitar un miembro de la tarjeta al hacer click en él.
            $(".member-info").click(function () {
            if ($(this).attr('checked') == 'checked') {
                $(this).removeAttr('checked')
                let item = $(this).find('.feather.icon-check')
                item.hide()

                //Eliminamos a este usuario de miembro
                card_id = $('.dataCard-id').val()
                member_id = $(this).attr('user')

                // Llamada AJAX
                $.ajax({
                    type: 'POST',
                    url: '/remove-member/',
                    data: {
                        card_id: card_id,
                        member_id: member_id,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        action: 'remove_member'
                    },
                    success: function() {
                        $('.avatar_card_member').each(function(index) {
                            if ($(this).attr('user_id') == member_id) {
                                $(this).remove()
                            }
                        })
                        let length = $('.avatar_card_member').length;
                        if (length == 0) {
                            $('.dataCard-avatars').hide()
                        }

                        $('.kanban-item').each(function(index) {
                            let item = $(this)
                            if ($(this).attr('card_id') == card_id) {
                                let members = item.find('.info-card-members')
                                let only_this = members.find('.avatar_card_member')
                                for (let m = 0; m < only_this.length; m++) {
                                    let result = only_this[m]
                                    if ($(result).attr('user') == member_id) {
                                        only_this[m].remove()
                                    }
                                }
                                members = item.find('.info-card-members')
                                only_this = members.find('.avatar_card_member')
                                deadline = item.find('.info-card-deadline')
                                only_this_d = members.find('.info_card')
                                console.log(only_this.length);
                            }
                        })
                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText);
                    }
                });
            } else {
                $(this).attr('checked','true')
                $(this).append("<i class='feather icon-check mr-50' style='float:left; margin-top: -11%; margin-left: 95%;'></i>")

                //Añadimos este miembro a la tarjeta
                card_id = $('.dataCard-id').val()
                member_id = $(this).attr('user')
                $('.dataCard-avatars').show()

                // Llamada AJAX
                $.ajax({
                    type: 'POST',
                    url: '/add-member/',
                    data: {
                        card_id: card_id,
                        member_id: member_id,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        action: 'add_member'
                    },
                    success: function(respuesta) {
                        let user = JSON.parse(respuesta);
                        $('.dataCard-avatars').append(
                            '<div style="float: left; margin-right: 1%;" class="avatar avatar_user avatar_card_member" user_id="'+member_id+'"><img src="/dashboard/staticfiles/images/portrait/small/'+user[0]['fields'].avatar+'"></div>'
                        )

                        $('.kanban-item').each(function(index) {
                            let item = $(this)
                            if ($(this).attr('card_id') == card_id) {
                                let members = item.find('.info-card-members')
                                members.show()
                                members.append(
                                    '<div style="float: right; width:14%; margin-right: -3%; margin-left: 4%;" class="avatar avatar_user avatar_card_member" user="'+member_id+'"><img src="/dashboard/staticfiles/images/portrait/small/'+user[0]['fields'].avatar+'"></div>'
                                )
                            }
                        })
                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText);
                    }
                });
            }
            })
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    }); 
})

// Botón de fecha límite
$(".right-menu_deadline").click(function () {
    $('.div-deadline-main').removeClass('m-0');
    $('.div-deadline-main').removeClass('d-none');
    $('.div-deadline-main').attr('style','')
    let fullExpiration = $('.dataCard-deadline').val()

    if ($('.dataCard-deadline').val() == 'Sin fecha') {
        let today = new Date()
        let todayYear = today.getFullYear()
        let todayMonth = today.getMonth()+1
        if (todayMonth < 10) {
            todayMonth = '0'+todayMonth
        }
        let todayDay = today.getDate()
        if (todayDay < 10) {
            todayDay = '0'+todayDay
        }
        let todayHours = today.getHours()
        if (todayHours < 10) {
            todayHours = '0'+todayHours
        }
        let todayMinutes = today.getMinutes()
        if (todayMinutes < 10) {
            todayMinutes = '0'+todayMinutes
        }

        $('.dataCard-deadline_date').val(todayYear+'-'+todayMonth+'-'+todayDay)
        $('.dataCard-deadline_hour').val(todayHours+':'+todayMinutes)
    } else {
        let expirationYear = fullExpiration.split('-')[0].split('/')[2].split(' ')[0]
        let expirationMonth = fullExpiration.split('-')[0].split('/')[1]
        let expirationDay = fullExpiration.split('-')[0].split('/')[0]
        let expirationHour = fullExpiration.split('-')[1].split(' ')[1]

        $('.dataCard-deadline_date').val(expirationYear+'-'+expirationMonth+'-'+expirationDay)
        $('.dataCard-deadline_hour').val(expirationHour)
    }
})

// Cambiar Deadline
$(".changeDeadline").click(function () {
    card_id = $('.dataCard-id').val()

    $('.deadline-state').remove()
    $('.div-state').append(
        '<p class="deadline-state"></p>'
    )

    let new_deadline_date = $('.dataCard-deadline_date').val()
    let new_deadline_hour = $('.dataCard-deadline_hour').val()

    let new_deadline = new_deadline_date+' '+new_deadline_hour+':00'

    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/change-deadline/',
        data: {
            card_id: card_id,
            new_deadline: new_deadline,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'change_deadline'
        },
        success: function(respuesta) {
            let new_date = respuesta.split(' ')[0]
            let new_time = respuesta.split(' ')[1]
            $('.dataCard-deadline').val(new_date.split('-')[2]+'/'+new_date.split('-')[1]+'/'+new_date.split('-')[0]+' - '+new_time.split(':')[0]+':'+new_time.split(':')[1])
            let date1 = new Date(respuesta);
            let date2 = new Date()

            let get_day = date1.getDate()
            let get_day_ = date1.getDate()
            if (get_day < 10) {
                get_day = '0'+get_day
            }
            let months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
            let get_month = date1.getMonth()
            let get_year = date1.getFullYear()
            let get_hours = date1.getHours()
            if (get_hours < 10) {
                get_hours = '0'+get_hours
            }
            let get_minutes = date1.getMinutes()
            if (get_minutes < 10) {
                get_minutes = '0'+get_minutes
            }

            get_month = months[get_month]
            let format_date = get_day+' de '+get_month[0]+get_month[1]+get_month[2]

            let result = date1.getTime() - date2.getTime()
            let horas = (Math.floor(result/ (1000*60*60)))
            let minutos = (Math.floor(result/ (1000*60)) - (horas*60))

            if ($('.dataCard-finished').prop('checked')) {
                $('.deadline-state').text('TERMINADA')
                $('.deadline-state').removeClass('state-yellow state-red')
                $('.deadline-state').addClass('state-green')
                $('.dataCard-finished').show()

                $('.kanban-item').each(function(index) {
                    let item = $(this)
                    if (item.attr('card_id') == dataCard_id) {
                        item.attr('card_deadline', ''+get_day_+' de '+get_month+' de '+get_year+' a las '+get_hours+':'+get_minutes)
                        let div = item.find('.mini-label.info_card')
                        div.css('background-color', '#77D797')
                        div.css('color', 'white')
                    }
                })
            } else {
                if (horas == 0) {
                    $('.deadline-state').text("VENCE PRONTO")
                    $('.deadline-state').removeClass('state-green state-red')
                    $('.deadline-state').addClass('state-yellow')
                    $('.dataCard-finished').show()

                    $('.kanban-item').each(function(index) {
                        let item = $(this)
                        if (item.attr('card_id') == dataCard_id) {
                            item.attr('card_deadline', ''+get_day_+' de '+get_month+' de '+get_year+' a las '+get_hours+':'+get_minutes)
                            let father_div = item.find('.info-card-deadline')
                            let members_div = item.find('.info-card-members')
                            let div = item.find('.mini-label.info_card')
                            
                            if (div.length == 0) {
                                father_div.append(
                                    '<div class="mini-label info_card" style="float: left; font-size: small; background-color: burlywood; height: 20px; max-width: 100px; width: max-content; font-weight: 600; padding-left: 5%; padding-right: 5%;"><i class="feather icon-clock"> </i>'+format_date+'</div>'
                                )
                                father_div.show()
                                members_div.show()
                                div.show()
                            } else {
                                div.css('background-color', '#EDFB09')
                                div.css('color', '#404e67')
                            }
                        }
                    })
                } else if (horas < 0) {
                    $('.deadline-state').text("PLAZO VENCIDO")
                    $('.deadline-state').removeClass('state-green state-yellow')
                    $('.deadline-state').addClass('state-red')
                    $('.dataCard-finished').show()

                    $('.kanban-item').each(function(index) {
                        let item = $(this)
                        if (item.attr('card_id') == dataCard_id) {
                            item.attr('card_deadline', ''+get_day_+' de '+get_month+' de '+get_year+' a las '+get_hours+':'+get_minutes)
                            let father_div = item.find('.info-card-deadline')
                            let members_div = item.find('.info-card-members')
                            let div = item.find('.mini-label.info_card')

                            if (div.length == 0) {
                                father_div.append(
                                    '<div class="mini-label info_card" style="float: left; font-size: small; background-color: burlywood; height: 20px; max-width: 100px; width: max-content; font-weight: 600; padding-left: 5%; padding-right: 5%;"><i class="feather icon-clock"> </i>'+format_date+'</div>'
                                )
                                father_div.show()
                                members_div.show()
                                div.show()
                            } else {
                                div.css('background-color', '#F55F5F')
                                div.css('color', 'white')
                            }
                        }
                    })
                } else if ((0 < horas) && (horas < 24)) {
                    $('.deadline-state').text("VENCE PRONTO")
                    $('.deadline-state').removeClass('state-green state-red')
                    $('.deadline-state').addClass('state-yellow')
                    $('.dataCard-finished').show()

                    $('.kanban-item').each(function(index) {
                        let item = $(this)
                        if (item.attr('card_id') == dataCard_id) {
                            item.attr('card_deadline', ''+get_day_+' de '+get_month+' de '+get_year+' a las '+get_hours+':'+get_minutes)
                            let father_div = item.find('.info-card-deadline')
                            let members_div = item.find('.info-card-members')
                            let div = item.find('.mini-label.info_card')

                            if (div.length == 0) {
                                father_div.append(
                                    '<div class="mini-label info_card" style="float: left; font-size: small; background-color: burlywood; height: 20px; max-width: 100px; width: max-content; font-weight: 600; padding-left: 5%; padding-right: 5%;"><i class="feather icon-clock"> </i>'+format_date+'</div>'
                                )
                                father_div.show()
                                members_div.show()
                                div.show()
                            } else {
                                div.css('background-color', '#EDFB09')
                                div.css('color', '#404e67')
                            }
                        }
                    })
                } else if (horas > 24) {
                    $('.deadline-state').text("")
                    $('.deadline-state').removeClass('state-green state-red state-yellow')
                    $('.dataCard-finished').show()
                    $('.kanban-item').each(function(index) {
                        let item = $(this)
                        if (item.attr('card_id') == dataCard_id) {
                            item.attr('card_deadline', ''+get_day_+' de '+get_month+' de '+get_year+' a las '+get_hours+':'+get_minutes)
                            let father_div = item.find('.info-card-deadline')
                            let members_div = item.find('.info-card-members')
                            let div = item.find('.mini-label.info_card')

                            if (div.length == 0) {
                                father_div.append(
                                    '<div class="mini-label info_card" style="float: left; font-size: small; background-color: burlywood; height: 20px; max-width: 100px; width: max-content; font-weight: 600; padding-left: 5%; padding-right: 5%;"><i class="feather icon-clock"> </i>'+format_date+'</div>'
                                )
                                father_div.show()
                                members_div.show()
                                div.show()
                            } else {
                                div.css('background-color', 'burlywood')
                                div.css('color', 'white')
                            }
                        }
                    })
                }
            }
            toastr.success('Operación realizada con éxito', 'La fecha de vencimiento ha sido modificada.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });

            $('.kanban-item').each(function(index) {
                let item = $(this)
                if ($(this).attr('card_id') == card_id) {
                    let div = item.find('.mini-label.info_card')
                    let deadline = new Date(new_deadline)
                    let now = new Date()
                    let zone = (deadline.getTimezoneOffset());
                    zone = (zone)/(-60)

                    let result = deadline.getTime() - now.getTime()
                    let horas = (Math.floor(result/ (1000*60*60)))
                    let minutos = (Math.floor(result/ (1000*60)) - (horas*60))
                    horas = horas-zone

                    if (horas == 0) {
                        div.css('background-color', '#EDFB09')
                        div.css('color', '#404e67')
                    } else if (horas < 0) {
                        div.css('background-color', '#F55F5F')
                        div.css('color', 'white')
                    } else if ((0 < horas) && (horas < 24)) {
                        div.css('background-color', '#EDFB09')
                        div.css('color', '#404e67')
                    }

                    if (item.attr('card_finished') == 'True') {
                        div.css('background-color', '#77D797')
                        div.css('color', 'white')
                    }

                    let months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
                    let month = deadline.getMonth()
                    let day = deadline.getDate()

                    month = months[month]
                    month = month[0]+month[1]+month[2]+'.'
                    let date = day+' de '+month
                    div.html("<i class=\"feather icon-clock\"> </i> "+date)
                    
                }
            })
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
})

// Quitar Deadline
$(".removeDeadline").click(function () {
    card_id = $('.dataCard-id').val()

    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/remove-deadline/',
        data: {
            card_id: card_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'remove_deadline'
        },
        success: function(respuesta) {
            $('.dataCard-deadline').val('Sin fecha')
            $('.deadline-state').text("")
            $('.deadline-state').removeClass('state-green state-red state-yellow')
            $('.dataCard-finished').hide()
            toastr.success('Operación realizada con éxito', 'Ahora esta tarjeta carece de vencimiento.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            
            $('.kanban-item').each(function(index) {
                let item = $(this)
                if ($(this).attr('card_id') == card_id) {
                    item.attr('card_deadline', 'None')
                    let deadline = item.find('.info-card-deadline')
                    let only_this = deadline.find('.mini-label.info_card')
                    only_this.remove()

                    members = item.find('.info-card-members')
                    only_this_m = members.find('.avatar_card_member')
                    deadline = item.find('.info-card-deadline')
                    only_this = members.find('.info_card')

                    if (only_this_m.length == 0) {
                        members.hide()
                    }
                    deadline.hide()
                }
            })
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
})

// Dar el card_id a las etiquetas
$('.card-labels').click(function () {
    $('.div-labels-main').removeClass('m-0');
    $('.div-labels-main').removeClass('d-none');
    $('.div-labels-main').attr('style','')
    $('.labels').attr('card_id', $('.dataCard-id').val())

    $('.labels').each(function(index) {
        dataCard_id = $(this).attr('card_id')
        $(this).css('width', '180')
        $(this).prop('checked', false)
    })

    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/get-info-card/',
        data: {
            dataCard_id: dataCard_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'get_info_card'
        },
        success: function(respuesta) {
            let data = JSON.parse(respuesta);
            let labels = data['card'][0]['fields'].labels
            let label = labels.split(',')

            $('.labels').each(function(index) {
                for (let y = 0; y < label.length; y++) {
                    if (label[y] == $(this).attr('label')) {
                        $(this).css('width', '210')
                        $(this).prop('checked', true)
                    }
                }
            })

            $('.div-rename-label').remove()
            // $('.div-labels-main').css('height', '295px')
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
})

// Añadir una etiqueta

$('#LabelsModal').on('hide.bs.modal',function(){
    $('.new-tag').parent().remove();
});

$('.addTag').click(function(e){
    let element = this;
    e.preventDefault();
    if(!($('.addTag').parent().parent().children('.row').children().hasClass('new-tag'))){
        $(element).parent().parent().append('<div class="row mt-1"><input class="offset-1 col-6 labels new-tag" type="text" placeholder="Nueva etiqueta"><div class="col-1 my-auto"><input type="color" class="tag-color border-0" style="outline:0;"></div><div class="offset-1 col-1 m-auto"><button class="btn addTagAccept p-0"><i class="fas fa-plus-circle fa-2x"></i></button></div></div>');
        // $('.div-labels-main').css('height',document.querySelector('.div-labels-main').clientHeight + 42 + "px")
    }
    if(!($('#LabelsModal').hasClass('show'))){
        $('.new-tag').parent().remove();
    }
    $('.new-tag').mouseover(function(){
        $(this).css('width','180px');
    });
    $(".tag-color").change(function(){
        $('.new-tag').css('color','white');
        $('.new-tag').css('background-color',$('.tag-color').val());
    });
    $('.addTagAccept').click(function(e){
        e.preventDefault();
        let board_id = $('.board-id').val()
        $.ajax({
            type:'POST',
            url:'/add-tag/',
            data:{
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'add-tag',
                name:$('.new-tag').val(),
                board_id: board_id,
                color: $('.tag-color').val()
            },
            success:function(json){
                $(element).parent().parent().append("<input class='labels' style='cursor:pointer;background-color:"+$('.tag-color').val()+"; color:white;' type='text' value='"+$('.new-tag').val()+"' label='"+json+"' readonly>"+
                                                            '<i class="feather icon-edit-2 mr-50 edit-label" style="float:right; padding-right: 2%; padding-top: 2%;" label="'+json+'" color="'+$('.tag-color').val()+'" name="'+$('.new-tag').val()+'"></i>');
                $('.new-tag').parent().remove();

                // Marcar o desmarcar las etiquetas
                $('.labels').last().click(function (e) {
                    card_id = $('.dataCard-id').val()
                    let label = $(this).attr('label')

                    if ($(this).prop('checked')) {
                        $(this).css('width', '180')
                        $(this).prop('checked', false)

                        // Llamada AJAX
                        $.ajax({
                            type: 'POST',
                            url: '/uncheck-label/',
                            data: {
                                label: label,
                                card_id: card_id,
                                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                action: 'uncheck_label'
                            },
                            success: function(respuesta) {
                                let label = JSON.parse(respuesta);
                                $('.mini-labels').each(function(index) {
                                    if ($(this).attr('label') == label[0]['pk']) {
                                        $(this).remove()
                                    }
                                })

                                let length = $('.mini-labels').length;
                                if (length == 0) {
                                    $('.dataCard-labels').hide()
                                }

                                $('.kanban-item').each(function(index) {
                                    let item = $(this)
                                    if ($(this).attr('card_id') == card_id) {
                                        let labels = item.find('.info-card-labels')
                                        let only_this = labels.find('.mini-label')
                                        for (let m = 0; m < only_this.length; m++) {
                                            let result = only_this[m]
                                            if ($(result).attr('label') == label[0]['pk']) {
                                                only_this[m].remove()
                                            }
                                        }
                                        labels = item.find('.info-card-labels')
                                        only_this = labels.find('.mini-label')
                                        if (only_this.length == 0) {
                                            labels.hide()
                                        }
                                    }
                                })
                            },
                            error: function (xhr, errmsg, err) {
                                console.log(xhr.status + ": " + xhr.responseText);
                            }
                        });
                    } else {
                        $(this).css('width', '210')
                        $(this).prop('checked', true)

                        // Llamada AJAX
                        $.ajax({
                            type: 'POST',
                            url: '/check-label/',
                            data: {
                                label: label,
                                card_id: card_id,
                                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                action: 'check_label'
                            },
                            success: function(respuesta) {
                                let label = JSON.parse(respuesta);
                                console.log(label)
                                if (label[0]['fields'].name) {
                                    var label_name = label[0]['fields'].name
                                } else {
                                    var label_name = ''
                                }
                                $('.dataCard-labels').show()
                                $('.dataCard-labels').append(
                                    '<div style="background-color:'+label[0]['fields'].label_color+'" class="mini-labels" label="'+label[0]['pk']+'">'+
                                        '<p style="margin: auto; padding: 5px;">'+label_name+'</p>'+
                                    '</div>'
                                )

                                $('.kanban-item').each(function(index) {
                                    let item = $(this)
                                    if ($(this).attr('card_id') == card_id) {
                                        let labels = item.find('.info-card-labels')
                                        let br = labels.find('.label_br')
                                        br.remove()
                                        labels.show()
                                        labels.append(
                                            '<div style="background-color:'+label[0]['fields'].label_color+'; height: 20px; min-width: 25px;" class="mini-label" label="'+label[0]['pk']+'">'+
                                                '<p style="margin: auto; padding-left: 5px; padding-right: 5px;" class="mini-label child">'+label_name+'</p>'+
                                            '</div>'+
                                            '<br class="label_br">'
                                        )
                                    }
                                })
                            },
                            error: function (xhr, errmsg, err) {
                                console.log(xhr.status + ": " + xhr.responseText);
                            }
                        });
                    }
                    e.stopPropagation();
                })

                // Editar el texto de las etiquetas
                $('.edit-label').click(function () {
                    let label = $(this)
                    let label_id = $(this).attr('label')
                    let label_color = $(this).attr('color')
                    // $('.div-labels-main').css('height', document.querySelector('.div-labels-main').clientHeight + 100 + "px")
                    $('.div-rename-label').remove()

                    $('.div-labels').append(
                        '<hr class="div-rename-label">'+
                        '<div class="div-rename-label">'+
                            '<h6 style="margin-left: 6%; float:left; width:100%;">Nuevo nombre <span class="my-auto float-right renameLabel_cancel cursor-pointer" style="margin-right:13%;font-size:x-large;">&times;</span> </h6>'+
                            '<input class="label-new_name" type="text" style="background-color:'+label_color+'; color:white;">'+
                            '<fieldset class="form-group position-relative has-icon-left mb-0">'+
                                '<button type="button" class="btn btn-secondary renameLabel" style="width: 170px; margin-left: 6%; margin-top: 2%;">'+
                                    '<span class="d-none d-lg-block" data-i18n="Save">Renombrar etiqueta</span>'+
                                '</button>'+
                                '<button type="button" label_id="'+label_id+'" class="btn btn-danger delete-label" style="width: 45px; margin-left: 2%; margin-top: 2%;">'+
                                    '<span class="d-none d-lg-block" data-i18n="Save"><i class="fas fa-trash-alt"></i></span>'+
                                '</button>'+
                            '</fieldset>'+
                        '</div>'
                    )

                    $('.label-new_name').focus(); 

                    if (label.attr('name')) {
                        $('.label-new_name').val(label.attr('name'))
                    }

                    $('.renameLabel_cancel').click(function () {
                        $('.div-rename-label').remove()
                        /* $('.div-labels-main').css('height', document.querySelector('.div-labels-main').clientHeight - 100 + "px")*/
                    })

                    $('.delete-label').click(function(e){
                        let element = this;
                        // Llamada AJAX
                        $.ajax({
                            type: 'POST',
                            url: '/delete-label/',
                            data: {
                                label_id: $(element).attr('label_id'),
                                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                action: 'delete-label'
                            },
                            success: function(e) {
                                $('.div-rename-label').remove()
                                $('.labels[label='+$(element).attr('label_id')+']').remove()
                                $('.edit-label[label='+$(element).attr('label_id')+']').remove()
                                $(".mini-labels[label='"+$(element).attr('label_id')+"']").remove()
                                $(".mini-label[label='"+$(element).attr('label_id')+"']").remove()

                                toastr.success('Operación realizada con éxito', 'La etiqueta ha sido eliminada.');
                            },
                            error: function (xhr, errmsg, err) {
                                console.log(xhr.status + ": " + xhr.responseText);
                            }
                        });
                    });

                    $('.renameLabel').click(function () {
                        let label_name = $('.label-new_name').val()

                        // Llamada AJAX
                        $.ajax({
                            type: 'POST',
                            url: '/edit-label/',
                            data: {
                                label_id: label_id,
                                label_name: label_name,
                                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                action: 'edit_label'
                            },
                            success: function(respuesta) {
                                $('.labels').each(function(index) {
                                    if ($(this).attr('label') == label_id) {
                                        $(this).val(respuesta)
                                    }
                                })

                                label.attr('name', respuesta)
                                $('.div-rename-label').remove()
                                $('.div-labels-main').css('height', '295px')

                                $('.mini-labels').each(function(index) {
                                    $(".mini-labels[label='"+label_id+"'] p").html(label_name)
                                    $(".mini-label[label='"+label_id+"'] p").html(label_name)
                                })
                            },
                            error: function (xhr, errmsg, err) {
                                console.log(xhr.status + ": " + xhr.responseText);
                            }
                        });
                    })
                })
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
            
        })
        e.stopPropagation();
    });
    e.stopPropagation();
});

// Marcar o desmarcar las etiquetas
$('.labels').click(function () {
    card_id = $('.dataCard-id').val()
    let label = $(this).attr('label')

    if ($(this).prop('checked')) {
        $(this).css('width', '180')
        $(this).prop('checked', false)

        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/uncheck-label/',
            data: {
                label: label,
                card_id: card_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'uncheck_label'
            },
            success: function(respuesta) {
                let label = JSON.parse(respuesta);
                $('.mini-labels').each(function(index) {
                    if ($(this).attr('label') == label[0]['pk']) {
                        $(this).remove()
                    }
                })

                let length = $('.mini-labels').length;
                if (length == 0) {
                    $('.dataCard-labels').hide()
                }

                $('.kanban-item').each(function(index) {
                    let item = $(this)
                    if ($(this).attr('card_id') == card_id) {
                        let labels = item.find('.info-card-labels')
                        let only_this = labels.find('.mini-label')
                        for (let m = 0; m < only_this.length; m++) {
                            let result = only_this[m]
                            if ($(result).attr('label') == label[0]['pk']) {
                                only_this[m].remove()
                            }
                        }
                        labels = item.find('.info-card-labels')
                        only_this = labels.find('.mini-label')
                        if (only_this.length == 0) {
                            labels.hide()
                        }
                    }
                })
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    } else {
        $(this).css('width', '210')
        $(this).prop('checked', true)

        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/check-label/',
            data: {
                label: label,
                card_id: card_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'check_label'
            },
            success: function(respuesta) {
                let label = JSON.parse(respuesta);
                if (label[0]['fields'].name) {
                    var label_name = label[0]['fields'].name
                } else {
                    var label_name = ''
                }
                $('.dataCard-labels').show()
                $('.dataCard-labels').append(
                    '<div style="background-color:'+label[0]['fields'].label_color+'" class="mini-labels" label="'+label[0]['pk']+'">'+
                        '<p style="margin: auto; padding: 5px;">'+label_name+'</p>'+
                    '</div>'
                )

                $('.kanban-item').each(function(index) {
                    let item = $(this)
                    if ($(this).attr('card_id') == card_id) {
                        let labels = item.find('.info-card-labels')
                        let br = labels.find('.label_br')
                        br.remove()
                        labels.show()
                        labels.append(
                            '<div style="background-color:'+label[0]['fields'].label_color+'; height: 20px; min-width: 25px;" class="mini-label" label="'+label[0]['pk']+'">'+
                                '<p style="margin: auto; padding-left: 5px; padding-right: 5px;" class="mini-label child">'+label_name+'</p>'+
                            '</div>'+
                            '<br class="label_br">'
                        )
                    }
                })
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }
})

// Editar el texto de las etiquetas
$('.edit-label').click(function () {
    let label = $(this)
    let label_id = $(this).attr('label')
    let label_color = $(this).attr('color')
    $('.div-labels-main').css('height', document.querySelector('.div-labels-main').clientHeight + 100 + "px")
    $('.div-rename-label').remove()

    $('.div-labels').append(
        '<hr class="div-rename-label">'+
        '<div class="div-rename-label">'+
            '<h6 style="margin-left: 6%; float:left; width:100%;">Nuevo nombre <span class="my-auto float-right renameLabel_cancel cursor-pointer" style="margin-right:13%;font-size:x-large;">&times;</span> </h6>'+
            '<input class="label-new_name" type="text" style="background-color:'+label_color+'; color:white;">'+
            '<fieldset class="form-group position-relative has-icon-left mb-0">'+
                '<button type="button" class="btn btn-secondary renameLabel" style="width: 170px; margin-left: 6%; margin-top: 2%;">'+
                    '<span class="d-none d-lg-block" data-i18n="Save">Renombrar etiqueta</span>'+
                '</button>'+
                '<button type="button" label_id="'+label_id+'" class="btn btn-danger delete-label" style="width: 45px; margin-left: 2%; margin-top: 2%;">'+
                    '<span class="d-none d-lg-block" data-i18n="Save"><i class="fas fa-trash-alt"></i></span>'+
                '</button>'+
            '</fieldset>'+
        '</div>'
    )

    $('.label-new_name').focus(); 

    if (label.attr('name')) {
        $('.label-new_name').val(label.attr('name'))
    }

    $('.renameLabel_cancel').click(function () {
        $('.div-rename-label').remove()
        $('.div-labels-main').css('height', document.querySelector('.div-labels-main').clientHeight - 100 + "px")
    })

    $('.delete-label').click(function(e){
        let element = this;
        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/delete-label/',
            data: {
                label_id: $(element).attr('label_id'),
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'delete-label'
            },
            success: function(e) {
                $('.div-rename-label').remove()
                $('.labels[label='+$(element).attr('label_id')+']').remove()
                $('.edit-label[label='+$(element).attr('label_id')+']').remove()
                $(".mini-labels[label='"+$(element).attr('label_id')+"']").remove()
                $(".mini-label[label='"+$(element).attr('label_id')+"']").remove()

                toastr.success('Operación realizada con éxito', 'La etiqueta ha sido eliminada.');
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    });

    $('.renameLabel').click(function () {
        let label_name = $('.label-new_name').val()

        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/edit-label/',
            data: {
                label_id: label_id,
                label_name: label_name,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'edit_label'
            },
            success: function(respuesta) {
                $('.labels').each(function(index) {
                    if ($(this).attr('label') == label_id) {
                        $(this).val(respuesta)
                    }
                })

                label.attr('name', respuesta)
                $('.div-rename-label').remove()
                // $('.div-labels-main').css('height', '295px')

                $('.mini-labels').each(function(index) {
                    $(".mini-labels[label='"+label_id+"'] p").html(label_name)
                    $(".mini-label[label='"+label_id+"'] p").html(label_name)
                })
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    })
})

// Botón de Borrar tarjeta
$(".card-delete").click(function () {
    card_id = $('.dataCard-id').val()
    board_id = $('.board-id').val()

    swal.fire({
        title: "¿Seguro que quieres borrar esta tarjeta?",
        text: "Esta acción solo podrá revertirla el administrador de la empresa",
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SÍ'
    }) .then(function (resp) {
        if (resp['value'] == true) {
            // Llamada AJAX
            $.ajax({
                type: 'POST',
                url: '/delete-card/',
                data: {
                    card_id: card_id,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'delete_card'
                },
                success: function(e) {
                    $('.kanban-drag').each(function(index) {
                        if ($(this).attr('card_id') == card_id) {
                            $(this).remove()
                            $('#CardInfoModal').modal('hide')
                        }
                    })
                    sortCard()
                    toastr.success('Operación realizada con éxito', 'La tarjeta ha sido eliminada.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    })
})

// Drag and Drop
let draggedItem = null;
let drag_card_id;
let drop_list_id;

dnd_list()
dnd_card()

// Drag and Drop - Lists
function dnd_list() {
    const kanban_boards = $('.kanban-board').find()['prevObject'];
    const kanban_boards_move = $('.kanban-board-move').find()['prevObject'];
    const kanban_container = $('.kanban-container').find()['prevObject'];

    for (let l = 0; l < kanban_boards.length; l++) {
        const list_draggable = kanban_boards[l];
        const move_item = kanban_boards_move[l];

        function drag_list() {
            draggedList = list_draggable;
            drag_list_id = (list_draggable.getAttribute("list_id"));
            setTimeout(function () {
                list_draggable.classList.add('dragging_list');
            }, 0);
        }

        move_item.addEventListener('dragstart', function (e) {
            list_draggable.addEventListener('dragstart', drag_list())

            for (let y = 0; y < kanban_container.length; y++) {
                const container_droppable = kanban_container[y];
                
                container_droppable.addEventListener('dragover', function (e) {
                    e.preventDefault();
                })

                container_droppable.addEventListener('dragenter', function (e) {
                    e.preventDefault();
                    container_droppable.appendChild(draggedList)
                    const afterList = getDragAfterList(container_droppable, e.clientX)
                    if (afterList == null) {
                        container_droppable.appendChild(draggedList)
                    } else {
                        container_droppable.insertBefore(draggedList, afterList)
                    }
                })

                container_droppable.addEventListener('dragleave', function (e) {
                    e.preventDefault();
                })
            
                container_droppable.addEventListener('drop', function (e) {

                })
            }

            list_draggable.addEventListener('dragend', function() {
                setTimeout(function() {
                    list_draggable.classList.remove('dragging_list');
                    draggedList = null;
                    sortList()
                }, 0);
            })

            list_draggable.removeEventListener('dragstart', drag_list())
        })
    }
}

// Drag and Drop - Cards
function dnd_card() {
    const kanban_drag = $('.kanban-drag').find()['prevObject'];
    const kanban_cards = $('.kanban-cards').find()['prevObject'];

    for (let i = 0; i < kanban_drag.length; i++) {
        const item_draggable = kanban_drag[i]

        item_draggable.addEventListener('dragstart', function() {
            draggedItem = item_draggable;
            drag_card_id = (item_draggable.getAttribute("card_id"));
            setTimeout(function () {
                item_draggable.classList.add('dragging_card');
            }, 0);
        })

        for (let x = 0; x < kanban_cards.length; x++) {
            const list_droppable = kanban_cards[x]
        
            list_droppable.addEventListener('dragover', function (e) {
                e.preventDefault();
            })
        
            list_droppable.addEventListener('dragenter', function (e) {
                e.preventDefault();
                list_droppable.appendChild(draggedItem)
                const afterElement = getDragAfterCard(list_droppable, e.clientY)
                if (afterElement == null) {
                    list_droppable.appendChild(draggedItem)
                } else {
                    list_droppable.insertBefore(draggedItem, afterElement)
                }
            })
            
            list_droppable.addEventListener('dragleave', function (e) {
                e.preventDefault();
            })
        
            list_droppable.addEventListener('drop', function (e) {
                drop_list_id = (list_droppable.getAttribute("list_id"));
            })
        }

        item_draggable.addEventListener('dragend', function() {
            setTimeout(function() {
                item_draggable.classList.remove('dragging_card');
                draggedItem = null;
                cardToList()
                sortCard()
            }, 0);
        })
    }
}

//Función para SORT de listas
function getDragAfterList(container, x) {
    const draggableLists = [...container.querySelectorAll('.kanban-board:not(.dragging)')]

    return draggableLists.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = x - box.right - box.width / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

//Función para SORT de tarjetas
function getDragAfterCard(list, y) {
    const draggableElements = [...list.querySelectorAll('.kanban-drag:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

// Guardar en la base de datos el cambio de una tarjeta a otra lista
function cardToList() {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/card-to-list/',
        data: {
            drag_card_id: drag_card_id,
            drop_list_id: drop_list_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'card_to_list'
        },
        success: function() {
            
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

// Cambiar el order en las LISTAS
function sortList() {
    var order_id=0
    $('.kanban-board').each(function(index) {
        list_id = $(this).attr('list_id')
        order_id++
        $(this).attr('order_id', order_id)
        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/sort-list/',
            data: {
                list_id: list_id,
                order_id: order_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'sort_list'
            },
            success: function() {
                
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    })
}

// Cambiar el order en las TARJETAS
function sortCard() {
    var order_id=0
    $('.kanban-drag').each(function(index) {
        card_id = $(this).attr('card_id')
        order_id++
        $(this).attr('order_id', order_id)
        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/sort-card/',
            data: {
                card_id: card_id,
                order_id: order_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'sort_card'
            },
            success: function() {
                
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    })
}

//Tamaño de la ventana para el Scroll
setSize()
function setSize() {
    let contador = 0
    $('.kanban-board').each(function(index) {
        contador++
    })
    let result = 287*contador
    result = result+'px'
    $('.kanban-container').css('width', result)
}

//Ajustar tamaño de lista si está vacía
emptyListSize()
function emptyListSize() {
    $('.kanban-cards').each(function(index) {
        let this_list = $(this)
        if ($(this).find('.kanban-drag').length == 0) {
            this_list.css('height', 'auto')
            this_list.css('min-height', '15px')
        }
    })
}

// Scroll horizontal con el cursor, haciendo draggind en el container
cursorScroll()
function cursorScroll() {
    const main = document.querySelector('.kanban-main');
    const container = document.querySelector('.kanban-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    main.addEventListener('mousedown', function (e) {
        if (e.target == container) {
            isDown = true;
            startX = e.pageX - main.offsetLeft;
            scrollLeft = main.scrollLeft;
        }
    });

    main.addEventListener('mouseleave', function () {
        isDown = false;
    });

    main.addEventListener('mouseup', function () {
        isDown = false;
    });

    main.addEventListener('mousemove', function (e) {
        if (e.target == container) {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - main.offsetLeft;
            const walk = (x - startX);
            main.scrollLeft = scrollLeft - walk;
        }
    });
}

// Información de la tarjeta en vista previa
infoCard()
function infoCard() {
    $('.kanban-item').each(function(index) {
        let this_card = $(this)
        let dataCard_id = $(this).attr('card_id')
        let card_deadline = $(this).attr('card_deadline')
        let card_issue = $(this).attr('card_issue')

        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/get-info-card/',
            data: {
                dataCard_id: dataCard_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'get_info_card'
            },
            success: function(respuesta) {
                let info = JSON.parse(respuesta);
                console.log(info)
                if (info['labels'].length !== 0) {
                    let this_labels = this_card.find('.info-card-labels')
                    for (let l = 0; l < info['labels'].length; l++) {
                        this_labels.append(
                            '<div style="background-color:'+info['labels'][l].label_color+'; height: 20px; min-width: 25px;" class="mini-label" label="'+info['labels'][l].id+'">'+
                                '<p style="margin: auto; padding-left: 5px; padding-right: 5px;" class="mini-label child">'+info['labels'][l].name+'</p>'+
                            '</div>'
                        )
                    }
                    this_labels.append(
                        '<br class="label_br">'
                    )
                } else {
                    let this_labels = this_card.find('.info-card-labels')
                    this_labels.hide()
                }

                let this_issue = this_card.find('.info-card-issue')
                this_issue.append(
                    '<p class="info-card-issue text" style="word-wrap:break-word;">'+card_issue+'</p>'+
                    '<div class="float-right fast-edit-card" card-id="'+dataCard_id+'" style="display: none;"><a href="#" class="warning" data-target="#FastEditModal" data-toggle="modal" style="z-index:10000;position:absolute;top:10px;right:10px;background-color:transparent;">&nbsp;<i class="fas fa-pen-alt"></i></a></div>'
                )
                

                $('.fast-edit-card[card-id="'+dataCard_id+'"]').click(function(e){
                    let left = document.querySelector('.kanban-item[card_id="'+dataCard_id+'"]').getBoundingClientRect().left - 240;
                    let top = document.querySelector('.kanban-item[card_id="'+dataCard_id+'"]').getBoundingClientRect().top - 56;
                    let bottom = document.querySelector('.kanban-item[card_id="'+dataCard_id+'"]').getBoundingClientRect().bottom;
                    let right = document.querySelector('.kanban-item[card_id="'+dataCard_id+'"]').getBoundingClientRect().right - document.querySelector('.kanban-item[card_id="'+dataCard_id+'"]').clientWidth;
                    $('#FastEditModal').css('margin-left',left+"px")
                    if(bottom < 500){
                        $('#FastEditModal').css('margin-top', top+"px")
                        $('#FastEditModal').css('margin-bottom', '')
                        $('#fast-edit-card-title').css('margin-top', '');
                        $('#fast-edit-card-title').parent().removeClass('order-1')
                        $('.fast-edit-link-list').parent().removeClass('order-0')
                        $('.fast-edit-link-list').children().removeClass('ml-auto')
                    }else{
                        $('#FastEditModal').css('margin-bottom', bottom+"px")
                        $('#FastEditModal').css('margin-top', '')
                        let ta_bottom = document.querySelector('#fast-edit-card-title').getBoundingClientRect().bottom - document.querySelector('#fast-edit-card-title').getBoundingClientRect().top;
                        $('.fast-edit-link-list').parent().css('margin-top', "auto");
                        $('#fast-edit-card-title').css('margin-top', top+"px");
                        $('#fast-edit-card-title').parent().removeClass('order-1')
                        $('.fast-edit-link-list').parent().removeClass('order-0')
                        $('.fast-edit-link-list').children().removeClass('ml-auto')
                    }
                    if(right > 1200){
                        let m_right = document.documentElement.clientWidth - document.querySelector('.kanban-item[card_id="'+dataCard_id+'"]').getBoundingClientRect().right;
                        $('#FastEditModal').css('width','max-content');
                        let m_left = document.querySelector('.kanban-item[card_id="'+dataCard_id+'"]').getBoundingClientRect().left - 500 ;
                        $('#FastEditModal').css('margin-left',m_left+"px");
                        $('#FastEditModal').css('margin-right',m_right+"px");
                        $('#FastEditModal').css('margin-top',top+"px");
                        $('#fast-edit-card-title').parent().addClass('order-1')
                        $('.fast-edit-link-list').parent().addClass('order-0')
                        $('.fast-edit-link-list').children().addClass('ml-auto')
                    }
                    $('#FastEditModal').modal('show');
                    $('.app-content').scrollTop('0px');
                    $('#fast-edit-card-title').focus();
                    $('#fast-edit-card-title').on('focusout',function(e){
                        card_id = dataCard_id;
                        new_name = $(this).val()
                        // Llamada AJAX
                        $.ajax({
                            type: 'POST',
                            url: '/rename-card/',
                            data: {
                                card_id: card_id,
                                new_name: new_name,
                                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                action: 'rename_card'
                            },
                            success: function(res) {
                                $('.kanban-item[card_id="'+card_id+'"] .info-card-issue p').html(new_name)
                            },
                            error: function (xhr, errmsg, err) {
                                console.log(xhr.status + ": " + xhr.responseText);
                            }
                        });
                    });
                    $('.fast-edit-open-card').click(function(){
                        $('#FastEditModal').modal('hide');
                        $('#CardInfoModal').modal('show');
                        $('')
                        $.ajax({
                            type: 'POST',
                            url: '/get-info-card/',
                            data: {
                                dataCard_id: dataCard_id,
                                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                action: 'get_info_card'
                            },
                            success:function(json){
                                item = JSON.parse(json);
                                $('.dataCard-avatars').show()
                                $('.dataCard-labels').show()

                                $('.dataCard-avatars').empty()
                                $('.dataCard-avatars').append(
                                    '<h6>Miembros</h6>'
                                )

                                $('.dataCard-labels').empty()
                                $('.dataCard-labels').append(
                                    '<h6>Etiquetas</h6>'
                                )

                                $('.dataCard-id').val(item['card'][0]['pk'])
                                $('.dataCard-issue').text(item['card'][0]['fields'].issue)
                                $('.dataCard-description').text(item['card'][0]['fields'].description)

                                if (item['card'][0]['fields'].deadline) {
                                    if (item['card'][0]['fields'].finished == true) {
                                        $('.dataCard-finished').prop('checked', true)
                                    } else {
                                        $('.dataCard-finished').prop('checked', false)
                                    }
                                    let date = item['card'][0]['fields'].deadline.split('T')[0]
                                    let h = item['card'][0]['fields'].deadline.split('T')[1].split('Z')[0]
                                    let hour = h.split(':')[0]+':'+h.split(':')[1]

                                    $('.dataCard-finished').show()
                                    $('.dataCard-deadline').val(date.split('-')[2]+'/'+date.split('-')[1]+'/'+date.split('-')[0]+' - '+hour)
                                    if (item['card'][0]['fields'].finished == true) {
                                        $('.dataCard-finished').prop('checked', true)
                                    }
                                } else {
                                    $('.dataCard-finished').hide()
                                    $('.dataCard-deadline').val("Sin fecha")
                                    $('.deadline-state').remove()
                                }
                                
                                if (item['card'][0]['fields'].members == ",") {
                                    $('.dataCard-avatars').hide()
                                } else {
                                    for (let a = 0; a < item['avatars'].length; a++) {
                                        $('.dataCard-avatars').append(
                                            '<div style="float: left; margin-right: 1%;" class="avatar avatar_user avatar_card_member" user_id="'+item['avatars'][a].id+'"><img src="/dashboard/staticfiles/images/portrait/small/'+item['avatars'][a].avatar+'"></div>'
                                        )
                                    }
                                }

                                if (item['card'][0]['fields'].labels == ",") {
                                    $('.dataCard-labels').hide()
                                } else {
                                    for (let l = 0; l < item['labels'].length; l++) {
                                        $('.dataCard-labels').append(
                                            '<div style="background-color:'+item['labels'][l].label_color+'" class="mini-labels" label="'+item['labels'][l].id+'">'+
                                                '<p class="mini-label-text" style="margin: auto; padding: 5px;">'+item['labels'][l].name+'</p>'+
                                            '</div>'
                                        )
                                    }
                                }

                                if ($(".dataCard-finished").prop('checked')) {
                                    $('.deadline-state').text("TERMINADA")
                                    $('.deadline-state').removeClass('state-yellow state-red')
                                    $('.deadline-state').addClass('state-green')

                                    $('.kanban-item').each(function(index) {
                                        let item = $(this)
                                        if (item.attr('card_id') == dataCard_id) {
                                            let div = item.find('.mini-label.info_card')
                                            div.css('background-color', '#77D797')
                                            div.css('color', 'white')
                                        }
                                    })
                                } else {
                                    if (item['card'][0]['fields'].deadline) {
                                        let date1 = new Date(item['card'][0]['fields'].deadline);
                                        let date2 = new Date()
                                        let zone = (date1.getTimezoneOffset());
                                        zone = (zone)/(-60)

                                        let result = date1.getTime() - date2.getTime()
                                        let horas = (Math.floor(result/ (1000*60*60)))
                                        let minutos = (Math.floor(result/ (1000*60)) - (horas*60))
                                        horas = horas-zone

                                        if (horas == 0) {
                                            $('.deadline-state').text("VENCE PRONTO")
                                            $('.deadline-state').removeClass('state-green state-red')
                                            $('.deadline-state').addClass('state-yellow')

                                            $('.kanban-item').each(function(index) {
                                                let item = $(this)
                                                if (item.attr('card_id') == dataCard_id) {
                                                    let div = item.find('.mini-label.info_card')
                                                    div.css('background-color', '#EDFB09')
                                                    div.css('color', '#404e67')
                                                }
                                            })
                                        } else if (horas < 0) {
                                            $('.deadline-state').text("PLAZO VENCIDO")
                                            $('.deadline-state').removeClass('state-yellow state-green')
                                            $('.deadline-state').addClass('state-red')

                                            $('.kanban-item').each(function(index) {
                                                let item = $(this)
                                                if (item.attr('card_id') == dataCard_id) {
                                                    let div = item.find('.mini-label.info_card')
                                                    div.css('background-color', '#F55F5F')
                                                    div.css('color', 'white')
                                                }
                                            })
                                        } else if ((0 < horas) && (horas < 24)) {
                                            $('.deadline-state').text("VENCE PRONTO")
                                            $('.deadline-state').removeClass('state-green state-red')
                                            $('.deadline-state').addClass('state-yellow')

                                            $('.kanban-item').each(function(index) {
                                                let item = $(this)
                                                if (item.attr('card_id') == dataCard_id) {
                                                    let div = item.find('.mini-label.info_card')
                                                    div.css('background-color', '#EDFB09')
                                                    div.css('color', '#404e67')
                                                }
                                            })
                                        } else if (horas >= 24) {
                                            $('.kanban-item').each(function(index) {
                                                let item = $(this)
                                                if (item.attr('card_id') == dataCard_id) {
                                                    let div = item.find('.mini-label.info_card')
                                                    div.css('background-color', 'burlywood')
                                                    div.css('color', 'white')
                                                }
                                            })
                                        }
                                    }
                                }
                            },
                            error: function (xhr, errmsg, err) {
                                console.log(xhr.status + ": " + xhr.responseText);
                            }
                        });
                    });
                    $('.fast-edit-edit-tag').click(function(){
                        let m_top = document.querySelector('.fast-edit-edit-tag').getBoundingClientRect().bottom - 18;
                        let m_left = document.querySelector('.fast-edit-edit-tag').getBoundingClientRect().left - 20;
                        $('.div-labels-main').addClass('m-0');
                        $('.div-labels-main').css('position','fixed');
                        $('.div-labels-main').css('top', m_top+"px");
                        $('.div-labels-main').css('left', m_left+"px");
                        $('.div-labels-main').addClass('d-none');
                        $('#LabelsModal').modal('show');
                        setTimeout(function(){
                            $('.div-labels-main').removeClass('d-none');
                        },500);
                        $('#LabelsModal').on('hide.bs.modal',function(e){
                            $('.div-labels-main').addClass('d-none');
                        });
                    });

                    $('.fast-edit-deadline').click(function(){
                        let m_top = document.querySelector('.fast-edit-deadline').getBoundingClientRect().bottom - 18;
                        let m_left = document.querySelector('.fast-edit-deadline').getBoundingClientRect().left + 20;
                        $('.div-deadline-main').addClass('m-0');
                        $('.div-deadline-main').css('position','fixed');
                        $('.div-deadline-main').css('top', m_top+"px");
                        $('.div-deadline-main').css('left', m_left+"px");
                        $('.div-deadline-main').addClass('d-none');
                        $('#DeadlineModal').modal('show');
                        setTimeout(function(){
                            $('.div-deadline-main').removeClass('d-none');
                        },500);
                        $('#DeadlineModal').on('hide.bs.modal',function(e){
                            $('.div-deadline-main').addClass('d-none');
                        });


                    })

                    $('#FastEditModal').click(function(e){
                        if(!(e.target.id == 'fast-edit-card-title' || e.target.classList[0] == 'fast-edit-link')){
                            $('#FastEditModal').modal('hide');
                        }
                    });


                    $('#fast-edit-card-title').html($(this_card).attr('card_issue'));
                    e.stopPropagation();
                });
                

                /* this_card.mouseover(function(){
                    $('.fast-edit-card[card-id="'+dataCard_id+'"]').show();
                })
                this_card.mouseout(function(){
                    $('.fast-edit-card[card-id="'+dataCard_id+'"]').hide();
                }) */

                if (info['avatars'].length !== 0) {
                    let this_members = this_card.find('.info-card-members')
                    for (let a = 0; a < info['avatars'].length; a++) {
                        this_members.append(
                            '<div style="float: right; width:14%; margin-right: -3%; margin-left: 4%;" class="avatar avatar_user avatar_card_member" user="'+info['avatars'][a].id+'"><img src="/dashboard/staticfiles/images/portrait/small/'+info['avatars'][a].avatar+'"></div>'
                        )
                    }
                }

                if (card_deadline !== 'None') {
                    card_deadline_ = card_deadline.split(' ')
                    let month = card_deadline_[2]
                    card_deadline_format = card_deadline_[0]+' '+card_deadline_[1]+' '+month[0]+month[1]+month[2]+'.'

                    let this_deadline = this_card.find('.info-card-deadline')
                    this_deadline.append(
                        '<div class="mini-label info_card" style="float: left; font-size: small; background-color: burlywood; height: 20px; max-width: 100px; width: max-content; font-weight: 600; padding-left: 5%; padding-right: 5%;"><i class="feather icon-clock"> </i>'+card_deadline_format+'</div>'
                    )
                    
                    let months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
                    let get_day = card_deadline.split(' ')[0]
                    if (get_day < 10) {
                        get_day = '0'+get_day
                    }
                    let get_month = months.indexOf(card_deadline.split(' ')[2])
                    if (get_month < 10) {
                        get_month = '0'+get_month
                    }
                    get_month++
                    let get_year = card_deadline.split(' ')[4]
                    let get_time = card_deadline.split(' ')[7]
                    let get_full_date = get_year+'-'+get_month+'-'+get_day+' '+get_time+':00'
                    let date1 = new Date(get_full_date)
                    let now = new Date()

                    let result = date1.getTime() - now.getTime()
                    let horas = (Math.floor(result/ (1000*60*60)))
                    let minutos = (Math.floor(result/ (1000*60)) - (horas*60))

                    let div = this_card.find('.mini-label.info_card')

                    if (this_card.attr('card_finished') == 'True') {
                        div.css('background-color', '#77D797')
                        div.css('color', 'white')

                        let icon = div.find('.feather')
                        icon.removeClass('icon-clock')
                        icon.addClass('icon-check-square')

                        div.mouseover(function() {
                            if (icon.hasClass('icon-clock')) {
                                icon.removeClass('icon-clock')
                                icon.addClass('icon-square')
                            }
                        })

                        div.mouseout(function() {
                            if (icon.hasClass('icon-square')) {
                                icon.removeClass('icon-square')
                                icon.addClass('icon-clock')
                            }
                        })

                        div.click(function() {
                            if (icon.hasClass('icon-square')) {
                                console.log("icon-square");
                                icon.removeClass('icon-square')
                                icon.addClass('icon-check-square')
                                div.css('background-color', '#77D797')
                                div.css('color', 'white')

                                this_card.attr('card_finished', "True")
                                card_id = this_card.attr('card_id')

                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/finish-card/',
                                    data: {
                                        card_id: card_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'finish_card'
                                    },
                                    success: function() {
                                        
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            } else if (icon.hasClass('icon-check-square')) {
                                console.log("icon-check-square");
                                icon.removeClass('icon-check-square')
                                icon.addClass('icon-square')

                                this_card.attr('card_finished', "False")
                                card_id = this_card.attr('card_id')

                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/unfinish-card/',
                                    data: {
                                        card_id: card_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'unfinish_card'
                                    },
                                    success: function() {
                                        let new_card_deadline = this_card.attr('card_deadline')
                                        let new_months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
                                        let new_get_day = new_card_deadline.split(' ')[0]
                                        if (new_get_day < 10) {
                                            new_get_day = '0'+new_get_day
                                        }
                                        let new_get_month = new_months.indexOf(new_card_deadline.split(' ')[2])
                                        if (new_get_month < 10) {
                                            new_get_month = '0'+new_get_month
                                        }
                                        new_get_month++
                                        let new_get_year = new_card_deadline.split(' ')[4]
                                        let new_get_time = new_card_deadline.split(' ')[7]
                                        let new_get_full_date = new_get_year+'-'+new_get_month+'-'+new_get_day+' '+new_get_time+':00'
                                        let new_date1 = new Date(new_get_full_date)

                                        let new_result = new_date1.getTime() - now.getTime()
                                        let new_horas = (Math.floor(new_result/ (1000*60*60)))

                                        if (new_horas == 0) {
                                            div.css('background-color', '#EDFB09')
                                            div.css('color', '#404e67')
                                        } else if (new_horas < 0) {
                                            div.css('background-color', '#F55F5F')
                                            div.css('color', 'white')
                                        } else if ((0 < new_horas) && (new_horas < 24)) {
                                            div.css('background-color', '#EDFB09')
                                            div.css('color', '#404e67')
                                        } else if (new_horas >= 24) {
                                            div.css('background-color', 'burlywood')
                                            div.css('color', 'white')
                                        }
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            }
                        })   
                    } else if (horas == 0) {
                        div.css('background-color', '#EDFB09')
                        div.css('color', '#404e67')
                        var icon = div.find('.feather')

                        div.mouseover(function() {
                            if (icon.hasClass('icon-clock')) {
                                icon.removeClass('icon-clock')
                                icon.addClass('icon-square')
                            }
                        })
    
                        div.mouseout(function() {
                            if (icon.hasClass('icon-square')) {
                                icon.removeClass('icon-square')
                                icon.addClass('icon-clock')
                            }
                        })

                        div.click(function() {
                            if (icon.hasClass('icon-square')) {
                                icon.removeClass('icon-square')
                                icon.addClass('icon-check-square')
                                div.css('background-color', '#77D797')
                                div.css('color', 'white')

                                this_card.attr('card_finished', "True")
                                card_id = this_card.attr('card_id')

                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/finish-card/',
                                    data: {
                                        card_id: card_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'finish_card'
                                    },
                                    success: function() {
                                        
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            } else if (icon.hasClass('icon-check-square')) {
                                icon.removeClass('icon-check-square')
                                icon.addClass('icon-square')

                                this_card.attr('card_finished', "False")
                                card_id = this_card.attr('card_id')

                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/unfinish-card/',
                                    data: {
                                        card_id: card_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'unfinish_card'
                                    },
                                    success: function() {
                                        let new_card_deadline = this_card.attr('card_deadline')
                                        let new_months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
                                        let new_get_day = new_card_deadline.split(' ')[0]
                                        if (new_get_day < 10) {
                                            new_get_day = '0'+new_get_day
                                        }
                                        let new_get_month = new_months.indexOf(new_card_deadline.split(' ')[2])
                                        if (new_get_month < 10) {
                                            new_get_month = '0'+new_get_month
                                        }
                                        new_get_month++
                                        let new_get_year = new_card_deadline.split(' ')[4]
                                        let new_get_time = new_card_deadline.split(' ')[7]
                                        let new_get_full_date = new_get_year+'-'+new_get_month+'-'+new_get_day+' '+new_get_time+':00'
                                        let new_date1 = new Date(new_get_full_date)

                                        let new_result = new_date1.getTime() - now.getTime()
                                        let new_horas = (Math.floor(new_result/ (1000*60*60)))

                                        if (new_horas == 0) {
                                            div.css('background-color', '#EDFB09')
                                            div.css('color', '#404e67')
                                        } else if (new_horas < 0) {
                                            div.css('background-color', '#F55F5F')
                                            div.css('color', 'white')
                                        } else if ((0 < new_horas) && (new_horas < 24)) {
                                            div.css('background-color', '#EDFB09')
                                            div.css('color', '#404e67')
                                        } else if (new_horas >= 24) {
                                            div.css('background-color', 'burlywood')
                                            div.css('color', 'white')
                                        }
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            }
                        })
                    } else if (horas < 0) {
                        div.css('background-color', '#F55F5F')
                        div.css('color', 'white')
                        var icon = div.find('.feather')

                        div.mouseover(function() {
                            if (icon.hasClass('icon-clock')) {
                                icon.removeClass('icon-clock')
                                icon.addClass('icon-square')
                            }
                        })
    
                        div.mouseout(function() {
                            if (icon.hasClass('icon-square')) {
                                icon.removeClass('icon-square')
                                icon.addClass('icon-clock')
                            }
                        })

                        div.click(function() {
                            if (icon.hasClass('icon-square')) {
                                icon.removeClass('icon-square')
                                icon.addClass('icon-check-square')
                                div.css('background-color', '#77D797')
                                div.css('color', 'white')

                                this_card.attr('card_finished', "True")
                                card_id = this_card.attr('card_id')

                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/finish-card/',
                                    data: {
                                        card_id: card_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'finish_card'
                                    },
                                    success: function() {
                                        
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            } else if (icon.hasClass('icon-check-square')) {
                                icon.removeClass('icon-check-square')
                                icon.addClass('icon-square')

                                this_card.attr('card_finished', "False")
                                card_id = this_card.attr('card_id')

                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/unfinish-card/',
                                    data: {
                                        card_id: card_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'unfinish_card'
                                    },
                                    success: function() {
                                        let new_card_deadline = this_card.attr('card_deadline')
                                        let new_months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
                                        let new_get_day = new_card_deadline.split(' ')[0]
                                        if (new_get_day < 10) {
                                            new_get_day = '0'+new_get_day
                                        }
                                        let new_get_month = new_months.indexOf(new_card_deadline.split(' ')[2])
                                        if (new_get_month < 10) {
                                            new_get_month = '0'+new_get_month
                                        }
                                        new_get_month++
                                        let new_get_year = new_card_deadline.split(' ')[4]
                                        let new_get_time = new_card_deadline.split(' ')[7]
                                        let new_get_full_date = new_get_year+'-'+new_get_month+'-'+new_get_day+' '+new_get_time+':00'
                                        let new_date1 = new Date(new_get_full_date)

                                        let new_result = new_date1.getTime() - now.getTime()
                                        let new_horas = (Math.floor(new_result/ (1000*60*60)))

                                        if (new_horas == 0) {
                                            div.css('background-color', '#EDFB09')
                                            div.css('color', '#404e67')
                                        } else if (new_horas < 0) {
                                            div.css('background-color', '#F55F5F')
                                            div.css('color', 'white')
                                        } else if ((0 < new_horas) && (new_horas < 24)) {
                                            div.css('background-color', '#EDFB09')
                                            div.css('color', '#404e67')
                                        } else if (new_horas >= 24) {
                                            div.css('background-color', 'burlywood')
                                            div.css('color', 'white')
                                        }
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            }
                        })
                    } else if ((0 < horas) && (horas < 24)) {
                        div.css('background-color', '#EDFB09')
                        div.css('color', '#404e67')
                        var icon = div.find('.feather')

                        div.mouseover(function() {
                            if (icon.hasClass('icon-clock')) {
                                icon.removeClass('icon-clock')
                                icon.addClass('icon-square')
                            }
                        })
    
                        div.mouseout(function() {
                            if (icon.hasClass('icon-square')) {
                                icon.removeClass('icon-square')
                                icon.addClass('icon-clock')
                            }
                        })

                        div.click(function() {
                            if (icon.hasClass('icon-square')) {
                                icon.removeClass('icon-square')
                                icon.addClass('icon-check-square')
                                div.css('background-color', '#77D797')
                                div.css('color', 'white')

                                this_card.attr('card_finished', "True")
                                card_id = this_card.attr('card_id')

                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/finish-card/',
                                    data: {
                                        card_id: card_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'finish_card'
                                    },
                                    success: function() {
                                        
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            } else if (icon.hasClass('icon-check-square')) {
                                icon.removeClass('icon-check-square')
                                icon.addClass('icon-square')

                                this_card.attr('card_finished', "False")
                                card_id = this_card.attr('card_id')

                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/unfinish-card/',
                                    data: {
                                        card_id: card_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'unfinish_card'
                                    },
                                    success: function() {
                                        let new_card_deadline = this_card.attr('card_deadline')
                                        let new_months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
                                        let new_get_day = new_card_deadline.split(' ')[0]
                                        if (new_get_day < 10) {
                                            new_get_day = '0'+new_get_day
                                        }
                                        let new_get_month = new_months.indexOf(new_card_deadline.split(' ')[2])
                                        if (new_get_month < 10) {
                                            new_get_month = '0'+new_get_month
                                        }
                                        new_get_month++
                                        let new_get_year = new_card_deadline.split(' ')[4]
                                        let new_get_time = new_card_deadline.split(' ')[7]
                                        let new_get_full_date = new_get_year+'-'+new_get_month+'-'+new_get_day+' '+new_get_time+':00'
                                        let new_date1 = new Date(new_get_full_date)

                                        let new_result = new_date1.getTime() - now.getTime()
                                        let new_horas = (Math.floor(new_result/ (1000*60*60)))

                                        if (new_horas == 0) {
                                            div.css('background-color', '#EDFB09')
                                            div.css('color', '#404e67')
                                        } else if (new_horas < 0) {
                                            div.css('background-color', '#F55F5F')
                                            div.css('color', 'white')
                                        } else if ((0 < new_horas) && (new_horas < 24)) {
                                            div.css('background-color', '#EDFB09')
                                            div.css('color', '#404e67')
                                        } else if (new_horas >= 24) {
                                            div.css('background-color', 'burlywood')
                                            div.css('color', 'white')
                                        }
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            }
                        })
                    } else if (horas >= 24) {
                        div.css('background-color', 'burlywood')
                        div.css('color', 'white')
                        var icon = div.find('.feather')

                        div.mouseover(function() {
                            if (icon.hasClass('icon-clock')) {
                                icon.removeClass('icon-clock')
                                icon.addClass('icon-square')
                            }
                        })

                        div.mouseout(function() {
                            if (icon.hasClass('icon-square')) {
                                icon.removeClass('icon-square')
                                icon.addClass('icon-clock')
                            }
                        })

                        div.click(function() {
                            if (icon.hasClass('icon-square')) {
                                icon.removeClass('icon-square')
                                icon.addClass('icon-check-square')
                                div.css('background-color', '#77D797')
                                div.css('color', 'white')

                                this_card.attr('card_finished', "True")
                                card_id = this_card.attr('card_id')

                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/finish-card/',
                                    data: {
                                        card_id: card_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'finish_card'
                                    },
                                    success: function() {
                                        
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            } else if (icon.hasClass('icon-check-square')) {
                                icon.removeClass('icon-check-square')
                                icon.addClass('icon-square')

                                this_card.attr('card_finished', "False")
                                card_id = this_card.attr('card_id')

                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/unfinish-card/',
                                    data: {
                                        card_id: card_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'unfinish_card'
                                    },
                                    success: function() {
                                        let new_card_deadline = this_card.attr('card_deadline')
                                        let new_months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
                                        let new_get_day = new_card_deadline.split(' ')[0]
                                        if (new_get_day < 10) {
                                            new_get_day = '0'+new_get_day
                                        }
                                        let new_get_month = new_months.indexOf(new_card_deadline.split(' ')[2])
                                        if (new_get_month < 10) {
                                            new_get_month = '0'+new_get_month
                                        }
                                        new_get_month++
                                        let new_get_year = new_card_deadline.split(' ')[4]
                                        let new_get_time = new_card_deadline.split(' ')[7]
                                        let new_get_full_date = new_get_year+'-'+new_get_month+'-'+new_get_day+' '+new_get_time+':00'
                                        let new_date1 = new Date(new_get_full_date)

                                        let new_result = new_date1.getTime() - now.getTime()
                                        let new_horas = (Math.floor(new_result/ (1000*60*60)))

                                        if (new_horas == 0) {
                                            div.css('background-color', '#EDFB09')
                                            div.css('color', '#404e67')
                                        } else if (new_horas < 0) {
                                            div.css('background-color', '#F55F5F')
                                            div.css('color', 'white')
                                        } else if ((0 < new_horas) && (new_horas < 24)) {
                                            div.css('background-color', '#EDFB09')
                                            div.css('color', '#404e67')
                                        } else if (new_horas >= 24) {
                                            div.css('background-color', 'burlywood')
                                            div.css('color', 'white')
                                        }
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            }
                        })
                    }
                }

                if (info['avatars'].length == 0 && card_deadline == 'None') {
                    let this_members = this_card.find('.info-card-members')
                    this_members.hide()
                    let this_deadline = this_card.find('.info-card-deadline')
                    this_deadline.hide()
                }
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    })
}
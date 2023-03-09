var chatSidebarListWrapper = $(".chat-sidebar-list-wrapper"),
	chatOverlay = $(".chat-overlay"),
	chatContainer = $(".chat-container"),
	chatProfileToggle = $(".chat-profile-toggle"),
	chatSidebarClose = $(".chat-sidebar-close"),
	chatProfile = $(".chat-profile"),
	chatUserProfile = $(".chat-user-profile"),
	chatProfileClose = $(".chat-profile-close"),
	chatSidebar = $(".chat-sidebar"),
	chatArea = $(".chat-area"),
	chatStart = $(".chat-start"),
	chatSidebarToggle = $(".chat-sidebar-toggle"),
	chatMessageSend = $(".chat-message-send");

$(document).ready(function () {
	"use strict";
	
	// menu user list perfect scrollbar initialization
	if (!$.app.menu.is_touch_device()) {
		if (chatSidebarListWrapper.length > 0) {
			var menu_user_list = new PerfectScrollbar(".chat-sidebar-list-wrapper");
		}
		// user profile sidebar perfect scrollbar initialization
		if ($(".chat-user-profile-scroll").length > 0) {
			var profile_sidebar_scroll = new PerfectScrollbar(".chat-user-profile-scroll");
		}
		// chat area perfect scrollbar initialization
		if (chatContainer.length > 0) {
			var chat_user_user = new PerfectScrollbar(".chat-container");
		}
		if ($(".chat-profile-content").length > 0) {
			var chat_profile_content = new PerfectScrollbar(".chat-profile-content");
		}
	} else {
		$('.chat-sidebar-list-wrapper').css('overflow', 'scroll');
		$('.chat-user-profile-scroll').css('overflow', 'scroll');
		$('.chat-container').css('overflow', 'scroll');
		$('.chat-profile-content').css('overflow', 'scroll');
	}

	// user profile sidebar toggle
	chatProfileToggle.on("click", function () {
		chatProfile.addClass("show");
		chatOverlay.addClass("show");
	});

	// Add class active on click of Chat users list
	$(".chat-sidebar-list-wrapper ul li").on("click", function () {
		if ($(".chat-sidebar-list-wrapper ul li").hasClass("active")) {
			$(".chat-sidebar-list-wrapper ul li").removeClass("active");
		}
		$(this).addClass("active");
		if ($(".chat-sidebar-list-wrapper ul li").hasClass("active")) {
			chatStart.addClass("d-none");
			chatArea.removeClass("d-none");
		} else {
			chatStart.removeClass("d-none");
			chatArea.addClass("d-none");
		}
	});

	// Autoscroll del chat
	$(".conversation").click(function () {
		$(".chat-container").animate({
			scrollTop: $(".chat-container")[0].scrollHeight
		}, 400)
	});
});

// Add message to chat
function chatMessagesSend(source) {
	var message = chatMessageSend.val();
	if (message != "") {
		var html = '<div class="chat-message">' + "<p>" + message + "</p>" + "<div class=" + "chat-time" + ">3:35 AM</div></div>";
		$(".chat-wrapper .chat:last-child .chat-body").append(html);
		chatMessageSend.val("");
		chatContainer.scrollTop($(".chat-container > .chat-content").height());
	}
}

// LÓGICA DEL CHAT

// Función que valide que un campo no este vacío.
function validateEmpty(string) {
    if (string != '') {
        return true;
    }
    return false;
}

// Buscador
$("#chat-search").on("keyup", function () {
	var value = $(this).val().toLowerCase();
	if (value != "") {
		$(".chat-sidebar-list-wrapper .chat-sidebar-list li").filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
		});
	} else {
		// if search filter box is empty
		$(".chat-sidebar-list-wrapper .chat-sidebar-list li").show();
	}
});

// Función para mostrar los datos del usuario que está usando el chat
$(".user-info").click(function () {
	let info = $(".chat-user-profile")
	let overlay = $(".chat-overlay")
	info.addClass("show")
	overlay.addClass("show")
})

// Cerrar el modal de los datos del usuario que usa el chat
$(".chat-profile-close").click(function () {
	let info = $(".chat-user-profile")
	let overlay = $(".chat-overlay")
	let profile = $(".chat-profile")
	info.removeClass("show")
	profile.removeClass("show")
	overlay.removeClass("show")
})

// Cerrar todo al hacer click en el overlay
$(".chat-overlay").click(function () {
	let info = $(".chat-user-profile")
	let overlay = $(".chat-overlay")
	let profile = $(".chat-profile")
	info.removeClass("show")
	profile.removeClass("show")
	overlay.removeClass("show")
})

// Modal para nuevos grupos
$(".add-group").click(function () {
	let addGroup = $(".modal-add-group")
	let overlay = $(".chat-overlay")
	addGroup.addClass("show")
	overlay.addClass("show")
})

// Modal para nuevos chats
$(".add-chat").click(function () {
	let addChat = $(".modal-add-chat")
	let overlay = $(".chat-overlay")
	addChat.addClass("show")
	overlay.addClass("show")
})

// Función que muestre nombre y apellidos de la persona con la que hablas en cada conversación
showConversations();
function showConversations() {
	$('.conversation').each(function(index) {
		let item = $(this)
		let user = $(this).attr('user_id')
		let members = $(this).attr('members').replaceAll(',','')
		let other = members.replaceAll(user,'')
		
		$.ajax({
            type: 'POST',
            url: '/show-conversation/',
            data: {
                user_id: other,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'show_conversation'
            },
            success: function(respuesta) {
				let data = JSON.parse(respuesta);
				let name = item.find('.chat-name')
				let avatar = item.find('.chat-avatar')

                name.append(
					'<h6 class="mb-0">'+data[0]['fields'].first_name+' '+data[0]['fields'].last_name+'</h6>'
				)

				avatar.append(
					'<img src="/dashboard/staticfiles/images/portrait/small/'+data[0]['fields'].avatar+'" height="36" width="36">'
				)

            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
	})
}
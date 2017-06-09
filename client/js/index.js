/* Dossier dans lequel les pages à charger sont présentes */
var htmlFolder = "html";

/* Adresse de l'API REST */
var apiURL = "http://localhost:8080/Trombi_Web/rest/";

/* Base de l'API de récupération des images */
var imgURL = 'https://demeter.utc.fr/portal/pls/portal30/portal30.get_photo_utilisateur?username='

/* Endpoint pour les logins */
var loginEndpoint = "login?"

/* Endpoint pour les étudiants */
var studentEndpoint = "student?";

/* Nom des cookies */
var cookieLogin = 'login';
var cookieToken = 'token';

/* Modèle pour les profils d'étudiant */
var cardStudent;

/* Gère l'affichage du message de bienvenue, du bouton de connexion 
dans la barre de navigation et de la modale de connexion. */
function manageGUILogin(removeWelcome) {
	var welcome = $('#welcome-msg');
	var loginButton = $('#btn-con');
	var login = getCookie(cookieLogin);

	if(login === "") {
		welcome.hide();
		resetLoginModal();
	}
	else {
		welcome.show();
		welcome.text("Bienvenue, " + login + '!');
	}
}

/* Charge la liste des étudiants et l'affiche */
function loadStudents() {
	checkLogin('Veuillez pour connecter pour accéder à cette fonctionnalité');
	loadPage(
		apiURL + studentEndpoint,
		function(content) {
			var json = JSON.parse(content);
			setStudentContent(json);
		},
		function() {
			setCookie(cookieToken, "");
			checkLogin('Jeton non-valide. Veuillez vous reconnecter.');
		},
		true
	);
}

/* Recherche la liste des étudiants et l'affiche */
function searchStudents(name, surname) {
	checkLogin('Veuillez pour connecter pour accéder à cette fonctionnalité');
	var button = $('#btn-do-search');
	//Cas où la recherche n'est pas finie
	if(button.attr("data-dismiss") != "modal") {
		var apiParams = "nom=" + encodeURIComponent(name) + "&prenom=" + encodeURIComponent(surname);
		loadPage(
			apiURL + studentEndpoint + apiParams,
			function(content) {
			animateProgressBar(button, false);
				var title = $('#modalSearchLabel');
				button.text("Fermer")
					.removeClass("btn-primary")
					.addClass("btn-success")
					.blur()
					.delay(1600)
					.fadeIn(function() {
						title.text("Recherche terminée!");
						button.attr("data-dismiss", "modal");
					});
				var json = JSON.parse(content);
				setStudentContent(json);
			},
			function() {
				setCookie(cookieToken, "");
				checkLogin('Jeton non-valide. Veuillez vous reconnecter.');
			},
			true
		);
	}
}

function searchStudentsFromStaticForm(all, name, surname) {
	checkLogin('Veuillez pour connecter pour accéder à cette fonctionnalité');
	var button = $('#btn-do-search');
	//Cas où la recherche n'est pas finie
		var apiParams = "";
		if(all !== "")
			apiParams = "all=" + encodeURIComponent(all);
		else 
			apiParams = "nom=" + encodeURIComponent(name) + "&prenom=" + encodeURIComponent(surname);
		loadPage(
			apiURL + studentEndpoint + apiParams,
			function(content) {
				var json = JSON.parse(content);
				setStudentContent(json);
			},
			function() {
				setCookie(cookieToken, "");
				checkLogin('Jeton non-valide. Veuillez vous reconnecter.');
			},
			true
		);
}

function studentCalendar() {
    var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

	$('#content').empty();

	/* initialize the calendar
	-----------------------------------------------------------------*/
	
	var calendar =  $('#content').fullCalendar({
		header: {
			left: 'title',
			right: 'today'
		},
		firstDay: 1, //  1(Monday) this can be changed to 0(Sunday) for the USA system
		selectable: true,
		defaultView: 'agendaWeek',
		
		axisFormat: 'hh:mm',
        views: { 
        	week: { 
        		titleFormat: "DD MMMM YYYY" 
        	}
        },
        slotLabelFormat:"HH:mm",
		allDaySlot: false,
		minTime : "08:00:00",
		maxTime : "20:00:00",
		contentHeight : "auto",
		
		events: [
			{
				title: 'All Day Event',
				start: new Date(y, m, 1)
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: new Date(y, m, d-3, 16, 0),
				allDay: false,
				className: 'info'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: new Date(y, m, d+4, 16, 0),
				allDay: false,
				className: 'info'
			},
			{
				title: 'Meeting',
				start: new Date(y, m, d, 10, 30),
				allDay: false,
				className: 'important'
			},
			{
				title: 'Lunch',
				start: new Date(y, m, d, 12, 0),
				end: new Date(y, m, d, 14, 0),
				allDay: false,
				className: 'important'
			},
			{
				title: 'Birthday Party',
				start: new Date(y, m, d+1, 19, 0),
				end: new Date(y, m, d+1, 22, 30),
				allDay: false,
			},
			{
				title: 'Click for Google',
				start: new Date(y, m, 28),
				end: new Date(y, m, 29),
				url: 'http://google.com/',
				className: 'success'
			}
		],			
	});
}

/* Recherche à partir de la modale */
function performModalSearch() {
	var name = $('#lastnameModal').val();
	var surname = $('#firstnameModal').val();
	searchStudents(name, surname);
}

/* Recherche à partir du formulaire statique */
function performSearch() {
	var all = $('#all-search').val();
	var name = $('#lastname').val();
	var surname = $('#firstname').val();
	searchStudentsFromStaticForm(all, name, surname);
}

function setStudentContent(json) {
	var result = '';
	for(i = 0; i < json.length; ++i) {
		//Trick pour avoir une copie réelle et pas de référence
		var copy = cardStudent.slice(0);

		//Mise à jour des valeurs
		var $copy = $(copy);
		var current = json[i];
		$copy.find('#card-title').text(current.nom + " " + current.prenom);
		$copy.find('#card-email').text(current.mail);
		$copy.find('#card-img').attr('src', imgURL + current.login);
		$copy.find('#card-branch').text(current.branche.nom);

		//Deux par ligne au maximum
		var html = '';
		if(i % 2 === 0) {
			if(i != 0) html += '\n</div>\n';
			html += '\n<div class="row">\n';						
		} 
		html += $copy.prop('outerHTML');
		if(i === json.length - 1) html += '</div>';
		result += html;
	}
	setContent(result);
}

function loadHome() {
	loadPage('home.html', setContent);
}

function loadStudentCard() {
	loadPage('profile.html', function(content) {
		cardStudent = content;
	});
}

/* Renvoie le bon object XMLHttp selon le navigateur courant */
function getXMLHttpObject() {
	var xmlHttp = null;
	if(window.XMLHttpRequest || window.ActiveXObject) {
		if(window.ActiveXObject) {
			try {
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		else {
			xmlHttp = new XMLHttpRequest();
		}
	}
	else {
		alert("Votre navigateur ne supporte pas AJAX.");
	}
	return xmlHttp;
}

/* Charge une page HTML depuis le serveur et effectue une action
@param pageName page à charger
@whatToDo callback une fois la page récupérée
@unauthorized callback si non authorisé 
@extern indique une requête CORS */
function loadPage(pageName, whatToDo, unauthorized, extern = false) {
	var xmlHttp = getXMLHttpObject();
	if(!extern) pageName = htmlFolder + '/' + pageName;
	xmlHttp.onreadystatechange = function() {
		if(xmlHttp.readyState == 4) {
			//L'accès est ok
			if(xmlHttp.status == 200 || xmlHttp.status == 0) {
				whatToDo(xmlHttp.responseText);
			}
			//L'accès n'est pas autorisé
			else if(xmlHttp.status == 403 || xmlHttp.status == 401) {
				unauthorized();
			}
		}
	};

	xmlHttp.open("GET", pageName, true);
	xmlHttp.setRequestHeader("Authorization", "Bearer " + getCookie(cookieToken));
	xmlHttp.send(null);
}

/* Assigne le contenu de la page 
@param content contenu 
@param add true s'il faut juste rajouter */
function setContent(content, add = false) {
	var contentDiv = document.getElementById('content');
	if(add) {
		contentDiv.innerHTML = contentDiv.innerHTML + content;
	}
	else {
		contentDiv.innerHTML = content;
	}
}

/* Vérifie que la connexion au serveur est toujours active.
Si elle ne l'est pas (i.e. cookie inexistant ou invalide),
ouvre l'invité de connexion. 
@param message Titre de la modale */
function checkLogin(message = "Authentification") {
	if(getCookie(cookieLogin) === "" || getCookie(cookieToken) === "") {
		openLogin(message);
	}
}

/* Ouvre la modale de connexion
@param message titre de la modale */
function openLogin(message) {
	resetLoginModal(message);
	$('#myModal').modal('show');
}

function openSearch() {
	resetSearchModal();
	$('#modalSearch').modal('show');
}

function openConsult() {
	$('#modalConsult').modal('show');
}

/* Remet à zéro les valeurs de la modale de recherche */
function resetSearchModal() {
	var inputs = $('#searchForm input');
	var title = $('#modalSearchLabel');
	var progressBar = $('#prog-search');
	var button = $('#btn-do-search');
	inputs.removeAttr("disabled");
	progressBar.css({ "width" : "0%" });
	title.text("Recherche d'étudiants")
	button.removeClass("btn-success")
			.addClass("btn-primary")
			.text("Recherche")
			.removeAttr("data-dismiss");
}

/* Remet à zéro les valeurs de la modale de connexion
@param message titre de la modale */
function resetLoginModal(message) {
	var inputs = $('#loginForm input');
	var title = $('#myModalLabel');
	var progressBar = $('#prog-login');
	var button = $('#btn-do-login');
	inputs.removeAttr("disabled");
	$('#uPassword').val('');
	title.text(message);
	progressBar.css({ "width" : "0%" });
	button.removeClass("btn-success")
			.addClass("btn-primary")
			.text("Connexion")
			.removeAttr("data-dismiss");
}

/* Appelé avant la fermeture de la modale. Tente de se connecter au serveur.
Si la connexion réussit, ferme la modale et modifie la navbar, puis
stocke le jeton dans un cookie.
Si la connexion échoue, affiche un message d'erreur dans la modale.
*/
function performLogin() {
	var button = $('#btn-do-login');
	//Cas où la connexion n'a pas encore réussi
	if(button.attr("data-dismiss") != "modal") {
		var login = $('#uLogin').val();
		var password = $('#uPassword').val();

		//Tentative de connexion
		loadPage(
			apiURL + loginEndpoint + 'login=' + encodeURIComponent(login) + '&passwd=' + encodeURIComponent(password),
			//À faire si la connexion a fonctionné
			function(content) {
				animateProgressBar(button, true);
				var title = $('#myModalLabel');
				var login = $('#uLogin').val();
				button.text("Fermer")
					.removeClass("btn-primary")
					.addClass("btn-success")
					.blur()
					.delay(1600)
					.fadeIn(function() {
						title.text("Connexion réussie ! Bienvenue, " + login + "!");
						button.attr("data-dismiss", "modal");
					});
				var days = 1;
				if(document.getElementById('cbRemember').checked) {
					days = 5;
				}
				setCookie(cookieLogin, login, days);
				setCookie(cookieToken, content, days);
				manageGUILogin();
			},
			//À faire si la connexion n'a pas fonctionné
			function() {
				resetLoginModal();
				$('#myModalLabel').text("Échec de la connexion")
			},
			true
		);
	}
}

/* Récupère un cookie par son nom dans la chaîne stockée 
@param cname nom du cookie */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/* Enregistre un cookie en le concaténant avec la valeur existante
@param cname nom du cookie
@param cvalue valeur du cookie
@exdays nombre de jours pour expirer */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/* Anime la barre de progression
@param button Bouton de connexion 
@param login true si login, false si recherche */
function animateProgressBar(button, login) {
	if(login) {
		var loginformId = "#loginForm";
		var titleId = "#myModalLabel";
		var progressId = "#progressLogin";
		var progressBarId = "#prog-login";
	}
	else {
		var loginformId = "#searchForm";
		var titleId = "#modalSearchLabel";
		var progressId = "#progressSearch";
		var progressBarId = "#prog-search";
	}
	var inputs = $(loginformId + ' input');
	var title = $(titleId);
	var progress = $(progressId);
	var progressBar = $(progressBarId);
	inputs.attr("disabled", true);
	button.hide();
	progress.show();
	progressBar.animate({width : "100%"}, 100);
	progress.delay(1000)
			.fadeOut(600);
}

$(document).ready(function() {
	manageGUILogin();
	loadHome();
	checkLogin();
	loadStudentCard();
});
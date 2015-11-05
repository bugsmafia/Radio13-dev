$(document).ready(function() {
$debug = 1; // Отладка
$SpeedUpd = 5000;

function windowSize(){
	$windowsW = $(document).width(); // Ширина экрана
	$windowsH = $(document).height(); // Высота экрана
	$bodyW = $('body').width(); // Ширина рабочей области
	$bodyH = $('body').height(); // Высота рабочей области
	$headerH = $('header').height(); // Высота шапки
	
	$TrackTitleH = $('#track-title').height(); // Высота шапки	
	$TrackSongH = $('#track-song').height(); // Высота шапки

	$VolumeH = $('#Volume').height(); // Уровня громкости
	
	$ContPlayL = $('#cont-play-left').width(); //Страница: Статус вопроизведения. Левый блок: Ширина.
	$ContPlayC = $('#cont-play-center').width(); //Страница: Статус вопроизведения. Центральный блок: Ширина.
	$ContPlayR = $('#cont-play-right').width(); //Страница: Статус вопроизведения. Правый блок: Ширина.
	
	$BigPlayBtn = $windowsW - $ContPlayL - $ContPlayR - 60; // Расчитываем ширину кнопки\изображения статус стрека
	$BigPlayBtn = $BigPlayBtn - 60;
	
	$DigPlayBtnHeaderHFix = $windowsH - $headerH;
	if ($DigPlayBtnHeaderHFix <= $BigPlayBtn) {
		$DigPlayBtnHeaderHFix = $DigPlayBtnHeaderHFix - $TrackTitleH - $TrackSongH - 30;
		$('#status-track-img').css('width',$DigPlayBtnHeaderHFix);
		$('#status-track-img').css('height',$DigPlayBtnHeaderHFix);
		$('#play-btn-line').css('line-height',$DigPlayBtnHeaderHFix+'px');
		if ($debug = 1){
			console.log('Высота кнопки больше. Формула #1');
		}
	} else {
		$('#status-track-img').css('width',$BigPlayBtn);
		$('#status-track-img').css('height',$BigPlayBtn);
		$('#play-btn-line').css('line-height',$BigPlayBtn+'px');
		if ($debug = 1){
			console.log('Высота кнопки меньше. Формула #2');
		}
	}
	
	$bgW = $windowsW / 2;
	$bgH = ($windowsH / 2) + $headerH - 30;
	$('#bg').css('left',$bgW);
	$('#bg').css('top',$bgH);
	if ($debug = 1){
		console.log('Размер экрана изменился - '+$windowsW+' x '+$windowsH);
		console.log('Размер области изменились - '+$bodyW+' x '+$bodyH);
	}
}
function StatusTrackUpdate(){
	$.getJSON("http://app.radio13.ru/status/json.php?i=l", function(load) {
		$id = load.id;
		$a = load.a;
		$s = load.s;
		$c = load.c;
		$vkmus = load.vk;
		
		if ($debug = 1){
			console.log('Обновление статуса: #'+$id+' '+$a+' - '+$s+'. База #'+$c+'. VK audio: '+$vkmus);
		}
		
		$('#track-title').text($a);
		$('#track-song').html('</br>'+$s);
		$('#stats-track-name').html('<strong>'+$a+'</strong> - '+$s);
		$('body').attr('id', $id);
	
		$.ajax({
			url: "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist="+$a+"&album="+$s+"&api_key=88571316d4e244f24172ea9a9bf602fe",
			type: "GET",
			dataType: "xml",
			success: function(xml) {				
				$(xml).find('album').each(function(){
					$(this).find('image').each(function(){
						var img = $(this).attr('size');
						if(img == "mega")
							if ($(this).text()){
								$('#status-track-img').css('background-image', 'url("'+$(this).text()+'")');
							}
							else {
								$('#status-track-img').css('background-image', 'url("images/no-image.png")');
							}
					})
				});
			},
			statusCode: {
				400: function() {
					$('#status-track-img').css('background-image', 'url("images/no-image.png")');
					
				}
			}
		});

	});
	windowSize();
}

$(window).load(windowSize); // при загрузке
$(window).resize(windowSize); // Выполняем каждый раз при имзенении размера экрана
$(window).load(StatusTrackUpdate);
$i = 0;
$id = 1;
setInterval(function(){
	$.getJSON("http://app.radio13.ru/status/json.php?i=i", function(info) {
		
		$i = info.i; // Уникальный ID текущего трека
		$l = info.l; // Лайк
		$u = info.u; // Дизлайк
		if ($i != $id){
			StatusTrackUpdate();
		};
		
		$sv = parseFloat($l) + parseFloat($u);
		if($sv != 0){
			var prc = Math.round(($l * 100) / $sv);
			$('#like-line').width(prc+'%');
		}
		else {
			$('#like-line').width('0%');
		}			
	});
	windowSize();	
}, $SpeedUpd);



$playerLoad = 0;
$( "#status-track-img" ).click(function() {
	if ($playerLoad == 0){
		$('#audio').html('<audio id="audioplay" controls preload="none"><source src="http://play.radio13.ru" type="audio/mpeg"></audio>');
		var audio = document.getElementById("audioplay");
		audio.play();
		$playerLoad++;
		$('#status-track-img').html('');
		if ($debug = 1){
			console.log('Плеер загружен');
		}
	} else {
		var audio = document.getElementById("audioplay");
		audio.pause();
		audio.src = ""; // Stops audio download.
		audio.load(); // Initiate a new load, required in Firefox 3.x.
		//  $('#audio').html('STOP');		
		$('#status-track-img').html('<div class="play-btn-stop"><div id="play-btn-line">ВКЛЮЧИТЬ</div></div>');
		if ($debug = 1){
			$playerLoad = 0;
			console.log('Плеер отключен');			
		}
	};
  
});

// Управление громкостью
$('#volume').click(function(e) {
	$volumeH = $('#volume').width(); // Ширина блока с модулем управления
    var posX = $(this).position().left,posY = $(this).position().top; // Координаты клика
	$volumeFinal = (e.pageX - posX) * 100;
	$volumeFinal = $volumeFinal / $volumeH;
	$('#volume-line').css('width', $volumeFinal+'%');
	$volumeFinal = $volumeFinal / 100;
	$volumeFinal = $volumeFinal.toFixed(2);
	var audio = document.getElementById("audioplay"); // Ищем наш плеер
	audio.volume = $volumeFinal; // Передаем плееру данные громкости
});
});

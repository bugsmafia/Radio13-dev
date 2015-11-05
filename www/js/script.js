jQuery(document).ready(function() {
$debug = 1; // Отладка
$SpeedUpd = 5000;

function windowSize(){
	$windowsW = jQuery(document).width(); // Ширина экрана
	$windowsH = jQuery(document).height(); // Высота экрана
	$bodyW = jQuery('body').width(); // Ширина рабочей области
	$bodyH = jQuery('body').height(); // Высота рабочей области
	$headerH = jQuery('header').height(); // Высота шапки
	
	$TrackTitleH = jQuery('#track-title').height(); // Высота шапки	
	$TrackSongH = jQuery('#track-song').height(); // Высота шапки

	$VolumeH = jQuery('#Volume').height(); // Уровня громкости
	
	$ContPlayL = jQuery('#cont-play-left').width(); //Страница: Статус вопроизведения. Левый блок: Ширина.
	$ContPlayC = jQuery('#cont-play-center').width(); //Страница: Статус вопроизведения. Центральный блок: Ширина.
	$ContPlayR = jQuery('#cont-play-right').width(); //Страница: Статус вопроизведения. Правый блок: Ширина.
	
	$BigPlayBtn = $windowsW - $ContPlayL - $ContPlayR - 60; // Расчитываем ширину кнопки\изображения статус стрека
	$BigPlayBtn = $BigPlayBtn - 60;
	
	$DigPlayBtnHeaderHFix = $windowsH - $headerH;
	if ($DigPlayBtnHeaderHFix <= $BigPlayBtn) {
		$DigPlayBtnHeaderHFix = $DigPlayBtnHeaderHFix - $TrackTitleH - $TrackSongH - 30;
		jQuery('#status-track-img').css('width',$DigPlayBtnHeaderHFix);
		jQuery('#status-track-img').css('height',$DigPlayBtnHeaderHFix);
		jQuery('#play-btn-line').css('line-height',$DigPlayBtnHeaderHFix+'px');
		if ($debug = 1){
			//console.log('Высота кнопки больше. Формула #1');
		}
	} else {
		jQuery('#status-track-img').css('width',$BigPlayBtn);
		jQuery('#status-track-img').css('height',$BigPlayBtn);
		jQuery('#play-btn-line').css('line-height',$BigPlayBtn+'px');
		if ($debug = 1){
			//console.log('Высота кнопки меньше. Формула #2');
		}
	}
	
	$bgW = $windowsW / 2;
	$bgH = ($windowsH / 2) + $headerH - 30;
	jQuery('#bg').css('left',$bgW);
	jQuery('#bg').css('top',$bgH);
	if ($debug = 1){
		//console.log('Размер экрана изменился - '+$windowsW+' x '+$windowsH);
		//console.log('Размер области изменились - '+$bodyW+' x '+$bodyH);
	}
}
function StatusTrackUpdate(){
	jQuery.getJSON("http://app.radio13.ru/status/json.php?i=l", function(load) {
		$id = load.id;
		$a = load.a;
		$s = load.s;
		$c = load.c;
		$vkmus = load.vk;
		
		if ($debug = 1){
			console.log('Обновление статуса: #'+$id+' '+$a+' - '+$s+'. База #'+$c+'. VK audio: '+$vkmus);
		}
		
		jQuery('#track-title').text($a);
		jQuery('#track-song').html('</br>'+$s);
		jQuery('#stats-track-name').html('<strong>'+$a+'</strong> - '+$s);
		jQuery('body').attr('id', $id);
	
		jQuery.ajax({
			url: "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist="+$a+"&album="+$s+"&api_key=88571316d4e244f24172ea9a9bf602fe",
			type: "GET",
			dataType: "xml",
			success: function(xml) {				
				jQuery(xml).find('album').each(function(){
					jQuery(this).find('image').each(function(){
						var img = jQuery(this).attr('size');
						if(img == "mega")
							if (jQuery(this).text()){
								jQuery('#status-track-img').css('background-image', 'url("'+jQuery(this).text()+'")');
							}
							else {
								jQuery('#status-track-img').css('background-image', 'url("images/no-image.png")');
							}
					})
				});
			},
			statusCode: {
				400: function() {
					jQuery('#status-track-img').css('background-image', 'url("images/no-image.png")');
					
				}
			}
		});

	});
	windowSize();
}

jQuery(window).load(windowSize); // при загрузке
jQuery(window).resize(windowSize); // Выполняем каждый раз при имзенении размера экрана
jQuery(window).load(StatusTrackUpdate);
$i = 0;
$id = 1;
setInterval(function(){
	jQuery.getJSON("http://app.radio13.ru/status/json.php?i=i", function(info) {
		
		$i = info.i; // Уникальный ID текущего трека
		$l = info.l; // Лайк
		$u = info.u; // Дизлайк
		if ($i != $id){
			StatusTrackUpdate();
		};
		
		$sv = parseFloat($l) + parseFloat($u);
		if($sv != 0){
			var prc = Math.round(($l * 100) / $sv);
			jQuery('#like-line').width(prc+'%');
		}
		else {
			jQuery('#like-line').width('0%');
		}			
	});
	windowSize();	
}, $SpeedUpd);



$playerLoad = 0;
jQuery( "#status-track-img" ).click(function() {
	if ($playerLoad == 0){
		jQuery('#audio').html('<audio id="audioplay" controls preload="none"><source src="http://play.radio13.ru" type="audio/mpeg"></audio>');
		var audio = document.getElementById("audioplay");
		audio.play();
		$playerLoad++;
		jQuery('#status-track-img').html('');
		if ($debug = 1){
			console.log('Плеер загружен');
		}
	} else {
		var audio = document.getElementById("audioplay");
		audio.pause();
		audio.src = ""; // Stops audio download.
		audio.load(); // Initiate a new load, required in Firefox 3.x.
		//  jQuery('#audio').html('STOP');		
		jQuery('#status-track-img').html('<div class="play-btn-stop"><div id="play-btn-line">ВКЛЮЧИТЬ</div></div>');
		if ($debug = 1){
			$playerLoad = 0;
			console.log('Плеер отключен');			
		}
	};
  
});

// Управление громкостью
jQuery('#volume').click(function(e) {
	$volumeH = jQuery('#volume').width(); // Ширина блока с модулем управления
    var posX = jQuery(this).position().left,posY = jQuery(this).position().top; // Координаты клика
	$volumeFinal = (e.pageX - posX) * 100;
	$volumeFinal = $volumeFinal / $volumeH;
	jQuery('#volume-line').css('width', $volumeFinal+'%');
	$volumeFinal = $volumeFinal / 100;
	$volumeFinal = $volumeFinal.toFixed(2);
	var audio = document.getElementById("audioplay"); // Ищем наш плеер
	audio.volume = $volumeFinal; // Передаем плееру данные громкости
});


});

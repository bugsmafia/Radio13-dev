jQuery(document).ready(function() {
$debug = 1; // Отладка
$SpeedUpd = 5000;
$i = 0;
$id = 1;
$playerLoad = 0;
function windowSize(){
	$windowsW = jQuery(document).width(); // Ширина экрана
	$windowsH = jQuery(document).height(); // Высота экрана
	$bodyW = jQuery('body').width(); // Ширина рабочей области
	$bodyH = jQuery('body').height(); // Высота рабочей области
	$headerH = jQuery('header').height(); // Высота шапки
	$volumH = jQuery('#volum').height() + 20;
	
	$TrackTitleH = jQuery('#track-title').height(); 
	$TrackSongH = jQuery('#track-song').height();

	$VolumeH = jQuery('#Volume').height(); // Уровня громкости
	
	$ContPlayL = jQuery('#cont-play-left').width(); //Страница: Статус вопроизведения. Левый блок: Ширина.
	$ContPlayC = jQuery('#cont-play-center').width(); //Страница: Статус вопроизведения. Центральный блок: Ширина.
	$ContPlayR = jQuery('#cont-play-right').width(); //Страница: Статус вопроизведения. Правый блок: Ширина.
	
	$BigPlayBtn = $windowsW - $ContPlayL - $ContPlayR - 60; // Расчитываем ширину кнопки\изображения статус стрека
	$BigPlayBtn = $BigPlayBtn - 90;
	
	$DigPlayBtnHeaderHFix = $windowsH - $headerH;
	if ($DigPlayBtnHeaderHFix <= $BigPlayBtn) {
		$DigPlayBtnHeaderHFix = $DigPlayBtnHeaderHFix - 30;
		jQuery('.status-wrap').css('width',$DigPlayBtnHeaderHFix);
		jQuery('.status-wrap').css('height',$DigPlayBtnHeaderHFix);
		jQuery('#play-btn-line').css('line-height',$DigPlayBtnHeaderHFix+'px');
		if ($debug = 1){
			//console.log('Высота кнопки больше. Формула #1');
		}
	} else {
		jQuery('.status-wrap').css('width',$BigPlayBtn);
		jQuery('.status-wrap').css('height',$BigPlayBtn);
		jQuery('#play-btn-line').css('line-height',$BigPlayBtn+'px');
		$volumRadius = ($BigPlayBtn / 2) + 20;
		$("#volum").roundSlider({
			sliderType: "min-range",
			circleShape: "custom-quarter",
			min: 0,
			max: 10,
			startAngle: 225,
			editableTooltip: false,
			radius: $volumRadius,
			width: 20,
			handleShape: "dot",
			tooltipFormat: "tooltipVal1"
		});
		$volumRadiusM = -1 * $volumRadius;
		jQuery('#volum .rs-container').css('margin-left', $volumRadiusM);
		jQuery('#volum .rs-container').css('margin-top','-445px');

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
		jQuery('#track-song').html(''+$s);
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

	}).fail(function(jqXHR) {
    if (jqXHR.status == 404) {
        alert("404 Not Found");
    } else {
        alert("Other non-handled error type");
    }
});
	windowSize();
}

jQuery(window).load(windowSize); // при загрузке
jQuery(window).resize(windowSize); // Выполняем каждый раз при имзенении размера экрана
jQuery(window).load(StatusTrackUpdate);

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




jQuery( "#play-f" ).click(function() {
	if ($playerLoad == 0){
		jQuery('#audio').html('<audio id="audioplay" controls preload="none"><source src="http://play.radio13.ru" type="audio/mpeg"></audio>');
		var audio = document.getElementById("audioplay");
		audio.play();
		$playerLoad++;
		jQuery('#status-track-img').html('');
		
		setInterval(function(){
			$volume = $('input[name=tooltip1]').val();
			if($volume == 0){
				audio.volume =1;
			} else if ($volume == 1){
				audio.volume =0.9;
			}else if ($volume == 2){
				audio.volume =0.8;
			}else if ($volume == 3){
				audio.volume =0.7;
			}else if ($volume == 4){
				audio.volume =0.6;
			}else if ($volume == 5){
				audio.volume =0.5;
			}else if ($volume == 6){
				audio.volume =0.4;
			}else if ($volume == 7){
				audio.volume =0.3;
			}else if ($volume == 8){
				audio.volume =0.2;
			}else if ($volume == 9){
				audio.volume =0.1;
			}else if ($volume == 10){
				audio.volume =0;
			}
		}, 600);
		if ($debug = 1){
			console.log('Плеер загружен');
		}
	} else {
		var audio = document.getElementById("audioplay");
		audio.pause();
		audio.src = ""; // Stops audio download.
		audio.load(); // Initiate a new load, required in Firefox 3.x.
		//  jQuery('#audio').html('STOP');		
		jQuery('#status-track-img').html('<div class="play-btn-stop"><div id="play-btn-line"><i class="fa fa-play-circle-o"></i></div></div>');
		if ($debug = 1){
			$playerLoad = 0;
			console.log('Плеер отключен');			
		}
	};
  
});


$("#volum").roundSlider({
			sliderType: "min-range",
			circleShape: "custom-quarter",
			min: 0,
			max: 10,
			value: 8,
			startAngle: 225,
			editableTooltip: false,
			radius: 0,
			width: 20,
			handleShape: "dot",
			tooltipFormat: "tooltipVal1"
		});
function tooltipVal1(args) {
    var months = [
	'максимум звука!',
	'очень громко', 
	'громко', 
	'чуть громче', 
	'средняя громкость', 
	'средняя громкость', 
	'средняя громкость', 	
	'тихо', 
	'очень тихо', 
	'еле слышно', 
	'без звука', 
	];
    return months[args.value];
}

});



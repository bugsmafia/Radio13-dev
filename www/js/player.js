$(window).load(function(){
	Player();
	function Player(){
		vars={"m":"audio","file":"none.mp3","uid":"player"};
		player = new Uppod(vars);
		document.getElementById('player').addEventListener('start',onStart,false);
		document.getElementById('player').addEventListener('play',onPlay,false);
		document.getElementById('player').addEventListener('pause',onPause,false);
		document.getElementById('player').addEventListener('stop',onStop,false);
		document.getElementById('player').addEventListener('end',onStop,false);
		document.getElementById('player').addEventListener('time',onTime,false);
		document.getElementById('player').addEventListener('played',onPlayed,false);
		document.getElementById('player').addEventListener('error',onError,false);
		document.getElementById('player').addEventListener('fullscreen',onFull,false);
		document.getElementById('player').addEventListener('exitfullscreen',onExitFull,false);
		document.getElementById('player').addEventListener('seeking',onSeeking,false);
		document.getElementById('player').addEventListener('seeked',onSeeked,false);
	}
	function onStart(e){
		trace(e.type);
	}
	function onPlay(e){
		trace(e.type);
	}
	function onPause(e){
		trace(e.type);
	}
	function onStop(e){
		trace(e.type);
	}
	function onEnd(e){
		trace(e.type);
	}
	function onTime(e){
		trace(e.type+': '+player.EventDetail(e.type));
	}
	function onPlayed(e){
		trace(e.type+': '+player.EventDetail(e.type));
	}
	function onError(e){
		trace(e.type+': '+player.EventDetail(e.type));
	}
	function onFull(e){
		trace(e.type);
	}
	function onExitFull(e){
		trace(e.type);
	}
	function onSeeking(e){
		trace(e.type);
	}
	function onSeeked(e){
	trace(e.type);
	}
	function Resize(){
		document.getElementById('player').style.width='500px';
		document.getElementById('player').style.height='281px';
		player.Resize();
	}
	function trace(str){
		document.getElementById('trace').innerHTML=str;
	}

	
	
	var playstatus = 0;
	var streamQ;
	player.Volume('0.9');

	$('#stream').click(function(){
		var bitrate = $('#p-setting #bitrate').val();

		if(bitrate == 'aac-32'){
			player.Play('http://play.radio13.ru/aac');
			player.Pause();
			setTimeout(function () {
				player.Play();
			}, 4000);
		} 
		else if(bitrate == 'aac-64'){
			player.Play('http://play.radio13.ru/64');
			player.Pause();
			setTimeout(function () {
				player.Play();
			}, 4000);
			// streamQ = 'http://play.radio13.ru/64';		
		} 
		else if (bitrate == 'mp3-128'){
			player.Play('http://play.radio13.ru/mp3');
			player.Pause();
			setTimeout(function () {
				player.Play();
			}, 4000);
			
		}
	});
	$('#p-setting #bitrate').on('change', function() {
		var bitrate = $(this).val();
		if(bitrate == 'aac-32'){
			streamQ = 'http://play.radio13.ru/aac';		
		} 
		else if(bitrate == 'aac-64'){
			streamQ = 'http://play.radio13.ru/64';		
		} 
		else if (bitrate == 'mp3-128'){
			streamQ = 'http://play.radio13.ru/mp3';
			
		}
		player.Play(streamQ);
	});
	
	setInterval(function(){
		if (playstatus != player.getStatus()){
			if (player.getStatus() == 0){
				jp_container_1
				$('#stream').removeClass('red orange waves-green').addClass('green waves-red');
				document.getElementById('stream').innerHTML = "<i class=\"material-icons\">pause</i>";
				$('#stream').attr('onclick', '');
			}
			
			if(player.getStatus() == 1){
				$('#stream').removeClass('green orange waves-red').addClass('red waves-green');
				// $('#stream').text('Выключить радио <i class="large mdi-av-stop"></i>');
				document.getElementById('stream').innerHTML = "<i class=\"material-icons\">pause</i>";
				$('#stream').attr('onclick', 'player.Play(\'audio/none.mp3\');');
			}
			
			if(player.getStatus() == 2){
				$('#stream').removeClass('orange red waves-green').addClass('green waves-red');
				document.getElementById('stream').innerHTML = "<i class=\"material-icons\">play_arrow</i>";
				$('#stream').attr('onclick', '');
			}
			
			if(player.getStatus() == 3){
				$('#stream').removeClass('green red').addClass('orange');
				document.getElementById('stream').innerHTML = "<i class=\"material-icons\">forward_5</i>";
			}
			
		}
		playstatus = player.getStatus();
	}, 500);
});
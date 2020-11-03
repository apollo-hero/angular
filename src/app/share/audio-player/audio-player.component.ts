import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

import { AppServices } from './../../app.services';

@Component({
	selector: 'app-audio-player',
	templateUrl: './audio-player.component.html',
	styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {
	@Output() doVerify = new EventEmitter();
	audio; currAlbum; currTrackName; currArtwork; nTime;
	currIndex = -1;
	albumArt; playPauseButton; seekBar; trackTime; tProgress; tTime; bTime; playerTrack; buffInterval; albumName; trackName; bgArtwork; bgArtworkUrl;
	@Input() tracks = [{
		album: 'Dawn',
		track: 'Skylike - Dawn',
		photo: 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg',
		id: "_1",
		url: 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3'
	}, {
		album: 'Me & You',
		track: 'Alex Skrindo - Me & You',
		photo: 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_2.jpg',
		id: "_2",
		url: 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/1.mp3'
	}, {
		album: 'Electro Boy',
		track: 'Kaaze - Electro Boy',
		photo: 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_3.jpg',
		id: "_3",
		url: 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/3.mp3'
	}, {
		album: 'Home',
		track: 'Jordan Schor - Home',
		photo: 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_4.jpg',
		id: "_4",
		url: 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/4.mp3'
	}, {
		album: 'Proxy (Original Mix)',
		track: 'Martin Garrix - Proxy',
		photo: 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_5.jpg',
		id: "_5",
		url: 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/5.mp3'
	}];
	constructor(private appServices: AppServices) { }

	ngOnInit() {
		this.albumArt = $("#album-art");
		this.playPauseButton = $("#play-pause-button");
		this.seekBar = $("#seek-bar");
		this.trackTime = $("#track-time");
		this.tProgress = $("#current-time");
		this.tTime = $("#track-length");
		this.playerTrack = $("#player-track");
		this.albumName = $("#album-name");
		this.trackName = $("#track-name");
		this.bgArtwork = $("#bg-artwork");

		var playerTrack = $("#player-track"),
		sArea = $("#s-area"),
		insTime = $("#ins-time"),
		sHover = $("#s-hover"),
		seekT,
		seekLoc,
		seekBarPos,
		cM,
		ctMinutes,
		ctSeconds,
		curMinutes,
		curSeconds,
		durMinutes,
		durSeconds,
		playProgress,
		nTime = 0,
		tFlag = false,
		playPreviousTrackButton = $("#play-previous"),
		playNextTrackButton = $("#play-next");

		this.audio = new Audio();
		this.selectTrack(0);
		this.audio.loop = false;
		this.playPauseButton.on("click", () => {
			if(this.audio) {
				this.doVerify.emit(this.audio);
				let tracks = this.appServices.getLocal('tracks')
				if(tracks && tracks.length) {
					let audioIndx = tracks.findIndex(f => f.url == this.tracks[this.currIndex]['url'])
					if(tracks && tracks.length && tracks[audioIndx]) {
						this.audio.currentTime = (tracks[audioIndx].currentTime ? tracks[audioIndx].currentTime : 0);
					}
				}
				setTimeout(() => {
					if (this.audio.paused) {
						this.playerTrack.addClass("active");
						this.albumArt.addClass("active");
						this.checkBuffering();
						this.playPauseButton.find("i").attr("class", "fa fa-pause");
						this.audio.play();
					} else {
						this.playerTrack.removeClass("active");
						this.albumArt.removeClass("active");
						clearInterval(this.buffInterval);
						this.albumArt.removeClass("buffering");
						this.playPauseButton.find("i").attr("class", "fa fa-play");
						this.audio.pause();
					}
				}, 300);
			}
		});
		sArea.mousemove((event) => {
			seekBarPos = sArea.offset();
			seekT = event.clientX - seekBarPos.left;
			seekLoc = this.audio.duration * (seekT / sArea.outerWidth());

			sHover.width(seekT);

			cM = seekLoc / 60;

			ctMinutes = Math.floor(cM);
			ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

			if (ctMinutes < 0 || ctSeconds < 0) return;

			if (ctMinutes < 0 || ctSeconds < 0) return;

			if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
			if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

			if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
			else insTime.text(ctMinutes + ":" + ctSeconds);

			insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
		});
		sArea.mouseout(() => {
			sHover.width(0);
			insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
		});
		sArea.on("click", () => {
			this.audio.currentTime = seekLoc;
			this.seekBar.width(seekT);
			sHover.width(0);
			insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
		});
		$(this.audio).on("timeupdate", () => {
			let audio = this.appServices.getLocal('audio')
			if(this.currIndex > -1) {
				let audioIndx = audio.findIndex(f => {
					if(!this.tracks[this.currIndex]) {
						return false
					} else {
						return f.url == this.tracks[this.currIndex]['url']
					}
				})
				if(audioIndx > -1) {
					Object.assign(audio[audioIndx], {currentTime: this.audio.currentTime})
					this.appServices.setLocal('tracks', audio)
				}
			}

			this.nTime = new Date();
			this.nTime = this.nTime.getTime();

			if (!tFlag && this.trackTime) {
				tFlag = true;
				this.trackTime.addClass("active");
			}
			if(this.audio) {
				curMinutes = Math.floor(this.audio.currentTime / 60);
				curSeconds = Math.floor(this.audio.currentTime - curMinutes * 60);

				durMinutes = Math.floor(this.audio.duration / 60);
				durSeconds = Math.floor(this.audio.duration - durMinutes * 60);

				playProgress = (this.audio.currentTime / this.audio.duration) * 100;
			}

			if (curMinutes < 10) curMinutes = "0" + curMinutes;
			if (curSeconds < 10) curSeconds = "0" + curSeconds;

			if (durMinutes < 10) durMinutes = "0" + durMinutes;
			if (durSeconds < 10) durSeconds = "0" + durSeconds;

			if (isNaN(curMinutes) || isNaN(curSeconds)) this.tProgress.text("00:00");
			else this.tProgress.text(curMinutes + ":" + curSeconds);

			if (isNaN(durMinutes) || isNaN(durSeconds)) this.tTime.text("00:00");
			else this.tTime.text(durMinutes + ":" + durSeconds);

			if (isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
				this.trackTime.removeClass("active");
			else this.trackTime.addClass("active");

			this.seekBar.width(playProgress + "%");

			if (playProgress == 100) {
				this.playPauseButton.find("i").attr("class", "fa fa-play");
				this.seekBar.width(0);
				this.tProgress.text("00:00");
				this.albumArt.removeClass("buffering").removeClass("active");
				clearInterval(this.buffInterval);
			}
		});
		playPreviousTrackButton.on("click", () => {
			this.selectTrack(-1);
		});
		playNextTrackButton.on("click", () => {
			this.selectTrack(1);
		});
		document.addEventListener('keydown', (e) => {
			switch (e.keyCode) {
				case 80:
				this.playPauseButton.click();
				break;
				case 32:
				this.playPauseButton.click();
				break;
				case 37:
				this.selectTrack(-1);
				break;
				case 38:
				this.audio.volume = (this.audio.volume > 1 ? 1 : (this.audio.volume + .05))
				break;
				case 39:
				this.selectTrack(1);
				break;
				case 40:
				this.audio.volume = (this.audio.volume < 0 ? 0 : (this.audio.volume - .05))
				break;
				case 74:
				this.audio.currentTime -= 10;
				break;
				case 76:
				this.audio.currentTime += 10;
				break;
				case 77:
				this.audio.volume = (this.audio.volume == 0 ? .5 : 0);
				break;
				case 188:
				this.audio.currentTime -= 1;
				break;
				case 190:
				this.audio.currentTime += 1;
				break;
			}
		});
	}

	selectTrack(flag) {
		if (flag == 0 || flag == 1) ++this.currIndex;
		else --this.currIndex;

		if(flag == 1 && this.currIndex == this.tracks.length) {
			this.currIndex = 0;
		} else if(flag == -1 && this.currIndex == -1) {
			this.currIndex = this.tracks.length - 1;
		}
		if (this.currIndex > -1 && this.currIndex < this.tracks.length) {
			if (flag == 0) this.playPauseButton.find("i").attr("class", "fa fa-play");
			else {
				this.albumArt.removeClass("buffering");
				this.playPauseButton.find("i").attr("class", "fa fa-pause");
			}

			this.seekBar.width(0);
			this.trackTime.removeClass("active");
			this.tProgress.text("00:00");
			this.tTime.text("00:00");

			this.currAlbum = this.tracks[this.currIndex]['album'];
			this.currTrackName = this.tracks[this.currIndex]['track'];
			this.currArtwork = this.tracks[this.currIndex]['id'];

			this.audio.src = this.tracks[this.currIndex]['url'];

			this.nTime = 0;
			this.bTime = new Date();
			this.bTime = this.bTime.getTime();

			if (flag != 0) {
				this.audio.play();
				this.playerTrack.addClass("active");
				this.albumArt.addClass("active");
				clearInterval(this.buffInterval);
				this.checkBuffering();
			}

			this.albumName.text(this.currAlbum);
			this.trackName.text(this.currTrackName);
			this.albumArt.find("img.active").removeClass("active");
			$("#" + this.currArtwork).addClass("active");

			this.bgArtworkUrl = $("#" + this.currArtwork).attr("src");

			this.bgArtwork.css({ "background-image": "url(" + this.bgArtworkUrl + ")" });
		} else {
			if (flag == 0 || flag == 1) --this.currIndex;
			else ++this.currIndex;
		}
	}
	checkBuffering() {
		clearInterval(this.buffInterval);
		this.buffInterval = setInterval(function () {
			if(this.albumArt) {
				if (this.nTime == 0 || this.bTime - this.nTime > 1000) this.albumArt.addClass("buffering");
				else this.albumArt.removeClass("buffering");
			}

			this.bTime = new Date();
			this.bTime = this.bTime.getTime();
		}, 100);
	}
}

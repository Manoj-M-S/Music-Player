jQuery(function ($) {
  "use strict";
  var supportsAudio = !!document.createElement("audio").canPlayType;
  if (supportsAudio) {
    var player = new Plyr("#audio1", {
      controls: [
        "restart",
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
      ],
    });
    $.getJSON(
      "https://5efab74180d8170016f7588e.mockapi.io/playlist/tracks",
      function (tracks) {
        var index = 0,
        playing = false;
        if(tracks){
          $("#npTitle").text(tracks[0].track)
          $("#npArtist").text(tracks[0].artist)    
            var src1 = tracks[0].albumCover;
            $("#npCover").attr("src", src1);
            var src2 = tracks[0].file;
            $("#audio1").attr("src", src2);
        }
          var buildPlaylist = $.each(tracks, function (key, value) {
            var trackNumber = value.id,
              trackName = value.track,
              artist = value.artist,
              Cover = value.albumCover;

            $("#plList").append(
              `<li>                     <div class="plItem">                         <span class="plNum">${trackNumber}.</span>                         <span class="plCover" > <img src=${Cover} width=30px height=30px > </span>                         <span class="plTitle">${trackName} </span>                         <span class="plArtist">${artist} </span>                     </div>                 </li>`
            );
          }),
          
          trackCount = tracks.length,
          npAction = $("#npAction"),
          npTitle = $("#npTitle"),
          npArtist = $("#npArtist"),
          audio = $("#audio1")
            .on("play", function () {
              playing = true;
              npAction.text("Now Playing.");
            })
            .on("pause", function () {
              playing = false;
              npAction.text("Paused.");
            })
            .on("ended", function () {
              npAction.text("Paused.");
              if (index < trackCount) {
                index++;
                loadTrack(index);
                audio.play();
              } else {
                audio.pause();
                index = 0;
                loadTrack(index);
              }
            })
            .get(0),
          btnPrev = $("#btnPrev").on("click", function () {
            if (index - 1 > -1) {
              index--;
              loadTrack(index);
              if (playing) {
                audio.play();
              }
            } else {
              audio.pause();
              index = 7;
              loadTrack(index);
            }
          }),
          btnshuffle = $("#btnshuffle").on("click", function () {
            if (index + Math.floor(Math.random() * 5) < trackCount - 1) {
              index = index + Math.floor(Math.random() * 5);
              loadTrack(index);
              if (playing) {
                audio.play();
              }
            } else {
              audio.pause();
              index = 0;
              loadTrack(index);
            }
          }),
          btnNext = $("#btnNext").on("click", function () {
            if (index < trackCount - 1) {
              index++;
              loadTrack(index);
              if (playing) {
                audio.play();
              }
            } else {
              audio.pause();
              index = 0;
              loadTrack(index);
            }
          }),
          li = $("#plList li").on("click", function () {
            var id = parseInt($(this).index());
            if (id === index) {
              playTrack(id);
              console.log(id);
            }
          }),
          loadTrack = function (id) {
            $(".plSel").removeClass("plSel");
            $("#plList li:eq(" + id + ")").addClass("plSel");
            console.log(id);
            npTitle.text(tracks[id].track);
            npArtist.text(tracks[id].artist);
            var src1 = tracks[id].albumCover;
            $("#npCover").attr("src", src1);
            index = id;
            audio.src = tracks[id].file;
          },
          playTrack = function (id) {
            loadTrack(id);
            audio.play();
          };
      }
    );
  } else {
    $(".column").addClass("hidden");
    var noSupport = $("#audio1").text();
    $(".container").append('<p class="no-support">' + noSupport + "</p>");
  }
});

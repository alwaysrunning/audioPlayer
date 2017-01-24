
var app = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {

        this.onDeviceReady()
        //document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {

        var list = [{
            url:'1.mp3',
            id:1,
            name: 'yesterday',
            imgUrl:'images/1.jpg',
        },{
            url:'2.mp3',
            id:2,
            name: 'today',
            imgUrl:'images/2.jpg',
        },{
            url:'3.mp3',
            id:3,
            name: 'tomorrow',
            imgUrl:'images/3.jpg',
        }]

        audioPlayerManager = new _AudioPlayerManager({
            category: "",
            data: [],
            type: "native", // cordova
            next: document.querySelector(".jq-next"), //下一曲
            previous: document.querySelector(".jq-previous"), //上一曲
            player: document.querySelector(".jq-play"), //播放
            pause: document.querySelector(".jq-pause"), //暂停
            tools: document.querySelector(".progressBar"), //进度条
            toolsBar: document.querySelector(".drag"),
            toolsDrag: document.querySelector(".drag")
        });

        audioPlayerManager.reset({
            category: "",
            data: list,
            id: 1
        });

        /*setTimeout(function(){
            audioPlayerManager.destroy()
        },5000)
        audioPlayerManager.removeAudio({
            category: "我的收藏",
            id: id
        })

        audioPlayerManager.reset({
            category: category,
            data: _.clone(this.audioFiles),
            id: id
        });

        audioPlayerManager.addAudio({
            category:"我的收藏",
            data:_.clone(collectAudio)
        })*/

    }
};

app.initialize();
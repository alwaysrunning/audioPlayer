function _Audio(opts){
	this.audio = null;
	this.audioType = opts.audioType || 'native';
	this.duration = -1;
	this.status = 'init';
    this.currentTime = 0;
    this.progress = 0;
	this.loop = opts.loop || false;
	this.paused = opts.paused ||false;
	this.loadingData = false;
    this.getCurrentPos= opts.getCurrentPos || false;
	this.file = opts.file || '';
	this.failback = opts.failback || false;
	this.endCallback = opts.endCallback || false;

	if(this.audioType == 'cordova'){
		this.audio = new Media('/android_asset/www/'+this.file, this.complete.bind(this), this.fail.bind(this));
		this.loadeddata();
	}else{
		this.audio = new Audio(this.file);
		this.audio.addEventListener("ended", this.complete.bind(this), false);
		this.audio.addEventListener("error", this.fail.bind(this), false);
		this.audio.addEventListener("loadeddata", this.loadeddata.bind(this), false);
        if(this.loop){
            this.audio.loop = this.loop
        }
        if(!this.paused){
            this.play()
        }
	}
    
}

_Audio.prototype = {

	constructor : _Audio,

    listener: {},

    on: function(name, fn){
        if(name in this.listener){
            this.listener[name].push(fn);
        }else{
            this.listener[name] = [];
            this.listener[name].push(fn)
        }
    },

    trigger: function(name,arg){
        if(name in this.listener){
            var callbacks = this.listener[name];
            for(var i=0, len=callbacks.length; i<len; i++){
                var fn = callbacks[i];
                fn.call(this, arg)
            }
        }
    },

    remove: function(){
        for(var name in this.listener){
            delete this.listener[name]
        }
    },

	loadeddata : function(){
		if(!this.audio) return;
        if(!this.paused && this.status!="play"){
            this.play();             
        }
        var self = this;
		if(this.audioType == 'cordova'){
            var getDuration = function(){
                var timerDur = setTimeout(function(){
                    clearTimeout(timerDur);
                    var dur  = self.audio.getDuration()
                    if(dur < 0){
                        getDuration()
                    }else{
                        self.duration = dur
                    }
                },100)
            }
            getDuration()	
		}else{
			this.duration = this.audio.duration
		}
	},

    getCurrentTime: function(){
        var self = this;
        if(!this.audio) return;

        var getCurrent =  function(){
            var mediaTimer = setTimeout(function(){
                clearTimeout(mediaTimer);
                if(self.audioType == 'cordova'){
                    self.audio.getCurrentPosition(function(pos){
                        if(self.duration>0 && self.status == 'play' && parseInt(pos)<=parseInt(self.duration)){
                            self.currentTime = pos;
                        }
                        if(self.audio){
                            getCurrent()
                        }
                    },function(e){
                        console.log("Error getting pos=" + e);
                        if(self.audio){
                            getCurrent()
                        }
                    })
                }else{
                    if(self.duration>0 && self.status == 'play' && parseInt(self.audio.currentTime)<=parseInt(self.duration)){
                        self.currentTime = self.audio.currentTime;
                    }
                    if(self.audio){
                        getCurrent();
                    }
                }
            },100) 
        }
        getCurrent();
            
    },

    seekTo: function(second){  
        var self = this;
        if(this.audioType=='cordova'){
            var setTime = setTimeout(function(){
                clearTimeout(setTime);
                self.audio.seekTo(second*1000)
            },100)
        }else{
            this.audio.currentTime = second;
        }
    },


    pause: function(){
        if(this.audio){
            this.audio.pause()
            this.status="pause";
            this.trigger("onPause")
        }
        
    },

    play: function(){
        if(this.loop && this.audioType =='cordova'){
            this.audio.play({numberOfLoops:-1})
        }else{
            this.audio.play()
        }
        if(this.getCurrentPos){
            this.getCurrentTime()
        }
        this.status="play";
        this.trigger("onPlay")
    },

    complete: function(value){
        if(this.loop && this.audioType =='cordova'){
            this.play()
        }
        if(!this.loop && this.endCallback){
            this.endCallback && this.endCallback(value);
            this.status = "complete";
            this.duration = -1;
            this.trigger("onComplete")
        }
    },

    fail: function(){
        this.failback && this.failback();
    },

    restart: function(src, fn){
        if(this.audio) this.pause();
        this.duration = -1
        if(this.audioType == 'cordova'){
            this.audio = new Media('/android_asset/www/'+src, this.complete.bind(this), this.fail.bind(this));
        }else{
            this.audio.src = src;
        }
        if(fn){
            this.endCallback = fn
        }
        this.play()
    },

    destroy: function(){
        if(this.status != "complete"){
            this.audio && this.audio.pause()
        }
        delete this.status;
        delete this.duration;
        delete this.currentTime;
        delete this.audio;
        this.duration = null;
        this.currentTime = null;
        this.status = null;
        this.audio = null;
        this.remove()
    }
}


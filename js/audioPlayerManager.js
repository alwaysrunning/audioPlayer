function _AudioPlayerManager(opts){
	this.opts = opts;
    this.category = opts.category || "default";
    this.data = this.opts.data;
    this.count = this.opts.data.length;
    this.index = 0;
    this.current = null;
    this.type = opts.type || 'native'
    this.toolsBar = this.opts.toolsBar;
    this.scroller = this.opts.toolsDrag;
    this.tools = this.opts.tools;
    this.hasTouch = "ontouchstart" in window;
    this.startEventType = this.hasTouch ? "touchstart" : "mousedown";
    this.moveEventType = this.hasTouch ? "touchmove" : "mousemove";
    this.endEventType = this.hasTouch ? "touchend" : "mouseup";
    this.cancelEventType = this.hasTouch ? "touchcancel" : "mouseup";
    this.start();
    this.event();
    this._bind(this.startEventType);

    this._bind(this.startEventType,this.tools)
    this._bind(this.endEventType,this.tools)
    this._bind(this.cancelEventType,this.tools)
}

_AudioPlayerManager.prototype = {

	constructor : _AudioPlayerManager,

    reset: function(opt){
        this.category = opt.category;
        this.data = opt.data;
        this.count = this.data.length;
        var id = opt.id
        for(var i=0; i<this.count; i++){
            if(this.data[i].id == id){
                this.index = i
            }
        }
        this.start();
    },

    addAudio: function(opt){
        var index = -1;
        if(this.category == opt.category){
            for(var i=0; i<this.data.length; i++){
                this.data[i].id == opt.data.id;
                index = i;
            }
        }
        if(index>-1) return;
        this.data.push(opt.data);
        this.count = this.data.length;
    },

    removeAudio: function(){
        var index = -1;
        var nowindex = this.index;
        if(this.category == opt.category){
            for(var i=0; i<this.data.length; i++){
                this.data[i].id == opt.data.id;
                index = i;
            }
        }
        if(index==-1) return;
        this.data.splice(index,1);
        this.count = this.data.length;

        if(index == nowindex){
            this.index--;
            this.next()
        }

        if(index < nowindex){
            this.index--
        }

    },
    _bind: function(type, el, bubble){
        (el || this.scroller).addEventListener(type, this, !!bubble)
    },

    _unbind: function(type, el, bubble){
        (el || this.scroller).removeEventListener(type, this, !!bubble)
    },

    _start: function(e){
        e.preventDefault();
        if(this.count<1) return
        if(!this.audioplayer) return

        this._bind(this.moveEventType, document.body);
        this._bind(this.endEventType, document.body);
        this._bind(this.cancelEventType, document.body);
        this.audioplayer.pause()
        this.setMove(e);
    },

    _move: function(e){
        e.preventDefault();
        if(this.count<1) return
        if(!this.audioplayer) return

        this.setMove(e);
    },

    _end: function(e){
        e.preventDefault();
        if(this.count<1) return
        if(!this.audioplayer) return

        this._unbind(this.moveEventType, document.body);
        this._unbind(this.endEventType, document.body);
        this._unbind(this.cancelEventType, document.body);

        this.setMove(e);
        this.audioplayer.seekTo(this.audioplayer.progress*this.audioplayer.duration);
        this.audioplayer.play()
        
    },

    setTimeInfo: function(){
        var self = this;

        var time = function(){
            var timeInfo = setTimeout(function(){
                clearTimeout(timeInfo);
                if(self.current && self.current.status == 'play'){
                    self.setInfo(self.current.currentTime);
                }
                time();
            },1000)
        }
        time();
    },

    setMove: function(e){
        var toolsWidth = this.tools.offsetWidth;
        var toolsLeft = this.offsetLf(this.tools);
        var x = this.hasTouch ? e.changedTouches[0].pageX : e.pageX;
        var pro = Math.abs(x-toolsLeft)/toolsWidth;
        this.audioplayer.progress = pro;
        if(x>0){
            pro >=1 ? 1 : pro;
            this.current.currentTime = pro*this.audioplayer.duration
            this.setInfo(this.current.currentTime)
        }
    },

    setInfo: function(currentTime){
        var maxWidth = this.tools.offsetWidth;
        var progress = (currentTime/this.current.duration)*maxWidth;
        if(progress<0){
            progress = 0;
        }
        if(progress>=maxWidth-this.toolsBar.offsetWidth/2){
            progress = maxWidth-this.toolsBar.offsetWidth/3;
        }
        
        this.toolsBar.style.webkitTransform = "translate("+progress+"px, 0px)";
        document.querySelector(".speed").style.width = progress +"px";
        document.querySelector(".jq-current-time").innerHTML = this.covert(currentTime);
        document.querySelector(".allTime").innerHTML = this.covert(this.current.duration)
        document.querySelector(".audioName").innerHTML = this.data[this.index].name;
        var img = document.querySelector(".currentAudio img");
        img.src = this.data[this.index].imgUrl
        img.style.display = 'block'
        
    },

    offsetLf: function(dom){
        var left = 0;
        var parent = dom;
        while(parent!=null && parent!=document.body){
            left += parent.offsetLeft;
            parent = parent.offsetParent;
        }
        return left;
    },

    handleEvent: function(e){
        var self =  this;
        switch(e.type){
            case this.startEventType:
            this._start(e);
            break

            case this.moveEventType:
            this._move(e);
            break

            case this.endEventType:
            this._end(e);
            break

            case this.cancelEventType:
            this._end(e);
            break
        }
    },

    event: function(){
        var self = this;
        this.opts.next.addEventListener("click", self.next.bind(self), false);
        this.opts.previous.addEventListener("click", self.previous.bind(self), false);
        this.opts.pause.addEventListener("click", self.pause.bind(self), false);
        this.opts.player.addEventListener("click", self.play.bind(self), false);
    },

    unbind: function(){
        var self = this;
        this.opts.next.removeEventListener("click", self.next.bind(self), false);
        this.opts.previous.removeEventListener("click", self.previous.bind(self), false);
        this.opts.pause.removeEventListener("click", self.pause.bind(self), false);
        this.opts.player.removeEventListener("click", self.play.bind(self), false);
    },
    play: function(){
        this.playElm();
        if(this.audioplayer){
            this.audioplayer.play()
        }else{
            this.audioplayer.next()
        }
        this.setTimeInfo()
    },

    pause: function(){
        if(this.audioplayer){
            this.pauseEle();
            this.audioplayer.pause()
        }
    },
    previous: function(){
        this.playElm()

        if(this.index==0){
            this.index = this.count - 1;
        }else{
            this.index--
        }

        if(this.audioplayer){
            this.audioplayer.destroy()
            this.audioplayer = null
        }

        this.start()
    },

    next: function(){
        this.playElm()

        if(this.index<this.count-1){
            this.index++
        }else{
            this.index = 0
        }

        if(this.audioplayer){
            this.audioplayer.destroy()
            this.audioplayer = null
        }

        this.start()
    },
    start: function(){
        var self = this;
        if(this.audioplayer){
            this.audioplayer.destroy()
            this.audioplayer = null
        }

        if(this.count<1||!this.data){
            return;
        }
        this.audioplayer = new _Audio({
            file: this.data[self.index].url,
            paused: true,
            audioType: this.type,
            getCurrentPos: true,
            endCallback: function(){
                if(self.audioplayer && self.audioplayer.duration){
                    if(self.index<self.count-1){
                        self.index++
                    }else{
                        self.index = 0
                    }
                    self.start()
                }  
            },
            failback: function(value){
                var code = value["code"];
                alert(code)
                self.audioplayer && self.audioplayer.destroy();
                self.audioplayer = null;
                set.alert("当前网络异常，请检查网络后再启动播放器！");
            }
        })

        this.current = this.audioplayer
        this.play()
    },


    playElm: function(){
        this.opts.player.style.display = 'none';
        document.querySelector(".audioplayer").classList.add("active");
        this.opts.pause.style.display = 'block';
    },

    pauseEle: function(){
        this.opts.player.style.display = 'block';
        document.querySelector(".audioplayer").classList.remove("active");
        this.opts.pause.style.display = 'none';
    },

    

    covert: function(nub){
        if(!nub){
            nub= "-1";
        }
        if(nub.toString()=="-1"){
            return "00:00"
        }
        var m = parseInt(nub/60)
        if(m.toString().length<2){
            m = "0"+m
        }
        var s = parseInt(nub%60)
        if(s.toString().length<2){
            s = "0"+s
        }
        return m+":"+s;
    },

    destroy: function(){
        var self=this;
        this.pauseEle();
        this.unbind();
        this._unbind(self.startEventType);
        this._unbind(self.startEventType, this.tools);
        this.audioplayer && this.audioplayer.destroy();
        delete this.scroller;
        delete this.opts;
        delete this.index;
        delete this.current;
        delete this.count;
        delete this.audioplayer;
    }

}

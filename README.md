# How to use
音频播放器 (可拖拉)



创建音频播放器

```bash
audioPlayerManager = new _AudioPlayerManager({
    category: "",
    data: [], // 加载音频队列
    type: "cordova", // h5播放(native) 和 底层播放方式(cordova) 两种播放方式。 安卓app里面只能用底层方法播放
    next: document.querySelector(".jq-next"), //下一曲
    previous: document.querySelector(".jq-previous"), //上一曲
    player: document.querySelector(".jq-play"), //播放
    pause: document.querySelector(".jq-pause"), //暂停
    tools: document.querySelector(".progressBar"), //进度条
    toolsBar: document.querySelector(".drag"), //拖拽按钮
    toolsDrag: document.querySelector(".drag")
});
```

播放

```bash
需要加载的音频数据格式

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

audioPlayerManager.reset({
    category: "",
    data: list,
    id: 1  //  从第几个开始播放
});
```

添加音频

```bash
需要加载的音频数据格式

var audio = {            
    url:'1.mp3',
    id:1,
    name: 'yesterday',
    imgUrl:'images/1.jpg',
}

audioPlayerManager.addAudio({
    category:"default",  //添加在哪个分类下
    data: audio
})
```


删除音频

```bash
audioPlayerManager.removeAudio({
    category: "我的收藏",
    id: id   // 音频的id
})
```
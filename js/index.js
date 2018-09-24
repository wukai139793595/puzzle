(function (win, $) {
    win.Puzzle = Puzzle

    function Puzzle(obj) {
        this.obj = obj
        this.$btn = this.obj.wrap.find('.btn')
        this.$img = this.obj.wrap.find('.item')
        this.arr = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        this.init()
        this.moveFlag = true
        this.bindStart()
        // this.bindEvent()
    }
    Puzzle.prototype.init = function () {
        var self = this
        self.$img.css({
            left: function (index) {

                return self.arr[index] % 3 * 100 + 'px'

            },
            top: function (index) {
                return Math.floor(self.arr[index]  / 3) * 100 + 'px'
            },
            backgroundImage: function (index) {
                return 'url(./images/pic.jpg)'
            },
            backgroundPosition: function (index) {
                return -index  % 3 * 100 + 'px ' + -Math.floor(index  / 3) * 100 + 'px'
            }
        })
    }
    Puzzle.prototype.sortImg = function () {
        var self = this 

        self.arr.forEach(function (item, index) {
            self.$img.eq(item).animate({
                left: index % 3 * 100 + 'px',
                top: Math.floor(index / 3) * 100 + 'px'
            }, 300, 'linear')
        })
    }
    Puzzle.prototype.bindStart = function () {
        var self = this
        self.$btn.on('click', function (e) {
            if($(this).text() === '开始'){
                self.arr.sort(function(a, b){
                    return 0.5 - Math.random()
                })
                // console.log(self.arr)
                $(this).text('恢复')
                self.sortImg()
                self.bindEvent()
            }else if($(this).text() ==='恢复'){
                self.arr.sort(function (a, b){
                    return a - b
                })
                $(this).text('开始')
                self.init()
                // self.offEvent()
            }
            console.log(self.arr)
        })
        // console.log(self.arr , self.newArr)
    }
    Puzzle.prototype.bindEvent = function () {
        var self = this
        var indStart = undefined
        
        self.$img.on('mousedown', mouseDown)
        function mouseDown(e) {
            // console.log($(this).index())
            if(self.moveFlag) {
                var imgLeft = $(e.target).position().left

                var imgTop = $(e.target).position().top
                var xStart = Math.floor(imgLeft/100)
                var yStart = Math.floor(imgTop/100)
                var disX = e.clientX - $(e.target).position().left
                var disY = e.clientY - $(e.target).position().top
                var imgTarget = $(this)
                var indStart = yStart * 3 + xStart
                // imgTarget.css({
                //     zIndex: '100'
                // })
                $(document).on('mousemove', mouseMove)
                $(document).on('mouseup', mouseUp)
                function mouseMove(e) {
                    imgTarget.css({
                        left: e.clientX-disX + 'px',
                        top: e.clientY-disY + 'px'
                    })
                }
                function mouseUp(e) {
                    e.stopPropagation()
                    e.preventDefault()
                    
                    var endLeft = imgTarget.position().left
                    var endTop = imgTarget.position().top
                    var xEnd = Math.round(endLeft / 100)
                    var yEnd = Math.round(endTop / 100)
                    var indEnd = yEnd * 3 + xEnd   
                    var imgEndLeft = xEnd * 100    
                    var imgEndTop = yEnd * 100    
                    console.log(xEnd,yEnd)
    
                    if(imgTarget.position().left> 300 || imgTarget.position().left < 0 || imgTarget.position().top > 300 || imgTarget.position().top < 0){
                        imgTarget.css({
                            left: imgLeft + 'px',
                            top: imgTop + 'px'
                        })
                    }else{
                        self.moveFlag = false
                        var temp = self.arr[indEnd]
                        imgTarget.css({
                            left: imgEndLeft + 'px',
                            top: imgEndTop + 'px'
                        })
                        $(self.$img[self.arr[indEnd]]).animate({
                            left: imgLeft + 'px',
                            top: imgTop + 'px'
                        }, 400, 'linear', function () {
                            if(testArr()){
                                alert('success!!')
                            }
                            self.moveFlag = true
                        })       
                        self.arr[indEnd] = self.arr[indStart]    
                        self.arr[indStart] = temp     
    
                    }
                    $(document).off('mousemove', mouseMove)
                    $(document).off('mouseup', mouseUp)
                }
            }
        }
        function testArr() {
            var flag = true
            self.arr.forEach(function (item, index) {
                if(item != index) {
                    flag = false
                }
            })
            return flag
        }
    }
})(window, $)
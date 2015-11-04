/*

The MIT License (MIT)

Copyright (c) 2015 Micheal Parks

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

(function(window, sf) {

  if (typeof module !== 'undefined') module.exports = sf()
  else window.Starfield = sf()

})(this, function() {

'use strict'

/*
 * config:
 * {
 *   canvas: string or HTML element
 *   numStars: number, default 500
 *   vx: number, rate of x movement, default 0.05
 *   vy: number, rate of y movement, default 0.05
 *   maxRadius: number, default 2
 * }
 */
function Starfield(config) {
  this.canvas = typeof config.canvas === 'string' ?
    document.querySelector(config.canvas) :
    config.canvas
  this.ctx = this.canvas.getContext('2d')
  this.style = getComputedStyle(this.canvas)

  this.vx = config.vx || 0.05
  this.vy = config.vy || 0.05

  this.maxStars = config.numStars || 500
  this.maxRadius = config.maxRadius

  this.shootingStarInterval = config.shootingStarInterval || undefined
  this.lastShootingStar = this.shootingStarInterval ? Date.now() : undefined
  this.shootingStar = undefined;

  this.onResize()

  window.addEventListener('resize', this.onResize.bind(this))
}

Starfield.prototype.star = function() {
  return {
    x: Math.round(Math.random() * this.canvas.width),
    y: Math.round(Math.random() * this.canvas.height),
    r: 0.5 + (Math.random() * (this.maxRadius || 500)),
    l: Math.random(),
    bl: 0.1 * (Math.random()*6 + 2),
    dl: Math.round(Math.random()) === 1? 0.01: -0.01
  }
}

Starfield.prototype.loadStars = function() {
  this.stars = []

  for (var i = 0, l = this.numStars; i < l; i++)
    this.stars.push(this.star())
}

Starfield.prototype.onResize = function() {
  this.canvas.width = Number(this.style.width.replace('px', '')) * window.devicePixelRatio
  this.canvas.height = Number(this.style.height.replace('px', '')) * window.devicePixelRatio

  if (this.canvas.width / window.devicePixelRatio < 500) this.numStars = 100
  else this.numStars = this.maxStars

  this.loadStars();
}

Starfield.prototype.draw = function(star) {
  this.ctx.beginPath()
  this.ctx.fillStyle = 'rgba(255,255,255,' + star.l + ')' 
  this.ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI, false)
  this.ctx.fill()
}

Starfield.prototype.start = function() {
  var tick = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = 'black' 
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    var i = this.stars.length
    while (i-- > 0) {
      var star = this.stars[i]

      this.draw(star)
      
      star.y += this.vy 
      star.x += this.vx
      star.l += star.dl

      if (Math.abs(star.l - star.bl) >= 0.25) star.dl = -star.dl
      if (star.x > this.canvas.width) star.x = this.vx > 0? -1: this.canvas.width + 1
      if (star.y > this.canvas.height) star.y = this.vy > 0? -1: this.canvas.height + 1
    }

    if (this.shootingStar) {
      var star = this.shootingStar;

      this.draw(star)
      
      star.y += 15
      star.x += 15
      star.l += star.dl
      star.r -= .1

      if (star.r <= 0) this.shootingStar = undefined
    } else if (this.shootingStarInterval) {
      var i = this.shootingStarInterval * 1000
      var t = Date.now()

      if (t - this.lastShootingStar >= i) {
        this.shootingStar = this.star()
        this.lastShootingStar = Date.now()

        this.shootingStar.r = 3
      }
    }

    this.frameId = window.requestAnimationFrame(tick)

  }.bind(this)
  
  this.frameId = window.requestAnimationFrame(tick)
}

return Starfield

})
var slider = document.getElementById('slider'),
  sliderItems = document.getElementById('slides')
 // prev = document.getElementById('prev'),
 // next = document.getElementById('next')

function slide(wrapper, items) {
  var posX1 = 0,
    posX2 = 0,
    posInitial,
    posFinal,
    threshold = 100,
    slides = items.getElementsByClassName('slide'),
    slidesLength = slides.length,
    slideSize = items.getElementsByClassName('slide')[0].offsetWidth,
    firstSlide = slides[0],
    secondSlide = slides[1],
    secondLastSlide = slides[slidesLength - 2],
    lastSlide = slides[slidesLength - 1],
    cloneFirst = firstSlide.cloneNode(true),
    cloneLast = lastSlide.cloneNode(true),
    index = 1,
    lastDirection = -1,
    allowShift = true

  // Clone first and last slide
  items.appendChild(cloneFirst)
  items.appendChild(secondSlide.cloneNode(true))
  //items.insertBefore(secondLastSlide.cloneNode(true))
  items.insertBefore(cloneLast, firstSlide)
  items.insertBefore(secondLastSlide.cloneNode(true), cloneLast)
  wrapper.classList.add('loaded')

  // Mouse events
  items.onmousedown = dragStart

  // Touch events
  items.addEventListener('touchstart', dragStart)
  items.addEventListener('touchend', dragEnd)
  items.addEventListener('touchmove', dragAction)

  // Click events
/*   prev.addEventListener('click', function () {
    shiftSlide(-1)
  })
  next.addEventListener('click', function () {
    shiftSlide(1)
  }) */

  // Transition events
  items.addEventListener('transitionend', checkIndex)

  function dragStart(e) {
    e = e || window.event
    e.preventDefault()
    posInitial = items.offsetTop

    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientY
    } else {
      posX1 = e.clientY
      document.onmouseup = dragEnd
      document.onmousemove = dragAction
    }
  }

  function dragAction(e) {
    e = e || window.event

    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientY
      posX1 = e.touches[0].clientY
    } else {
      posX2 = posX1 - e.clientY
      posX1 = e.clientY
    }
    items.style.top = items.offsetTop - posX2 + 'px'
  }

  function dragEnd(e) {
    posFinal = items.offsetTop
    if (posFinal - posInitial < -threshold) {
      shiftSlide(1, 'drag')
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(-1, 'drag')
    } else {
      items.style.top = posInitial + 'px'
    }

    document.onmouseup = null
    document.onmousemove = null
  }

  function shiftSlide(dir, action) {
    items.classList.add('shifting')

    if (allowShift) {
      if (!action) {
        posInitial = items.offsetTop
      }
      if (dir == 1) {
        items.style.top = posInitial - slideSize + 'px'
        index++
      } else if (dir == -1) {
        items.style.top = posInitial + slideSize + 'px'
        index--
      }
      lastDirection = dir
    }

    allowShift = false
  }

  function checkIndex(e) {
    //console.log(index, lastDirection)

    items.classList.remove('shifting')

    // Moving down
    if (lastDirection === 1) {
      if (index === 0) {
        items.style.top = -(slidesLength * slideSize) + 'px'
        index = slidesLength
      }
      if (index === slidesLength) {
        items.style.top = '0px'
        index = 0
      }
      allowShift = true
    }
    console.log(index, lastDirection === 1 ? 'down' : 'up')
    if (lastDirection === -1) {

      if (index === slidesLength) {
        items.style.top = -(slidesLength * slideSize) + 'px'

        index = 0
      }
      if (index === 0) {
        items.style.top = -(slidesLength * slideSize) + 'px'
        //items.style.top = '0px'
        index = slidesLength
      }
      allowShift = true
    }

    Array.from(document.querySelectorAll('.slide')).map((e, i) => {
      if (i === index + 1) e.classList.add('main')
      else e.classList.remove('main')
    })


  }
}

slide(slider, sliderItems)

(function ($) {
    var app = $('.app-body')
    var header = $('.header')
    var banner = document.getElementById('article-banner') || false
    var about = document.getElementById('about-banner') || false
    var top = $('.scroll-top')
    var isOpen = false

    $(document).ready(function () {
        NProgress.start()
        $('#nprogress .bar').css({
            'background': '#42b983'
        })
        $('#nprogress .spinner').hide()

        var fade = {
            transform: 'translateY(0)',
            opacity: 1
        }
        if (banner) {
            app.css('transition-delay', '0.15s')
            $('#article-banner').children().css(fade)
        }
        if (about) {
            $('.author-content').children().css(fade)
        }
        app.css(fade)
    })

    window.onload = function () {
        setTimeout(function () {
            NProgress.done()
        }, 200)
    }

    $('.menu').on('click', function () {
        if (!header.hasClass('fixed-header') || isOpen) {
            header.toggleClass('fixed-header')
            isOpen = !isOpen
        }
        $('.menu-mask').toggleClass('open')
    })

    $('#tag-cloud a').on('click', function () {
        var list = $('.tag-list')
        var name = $(this).data('name')
        var maoH = list.find('#' + name).offset().top

        $('html,body').animate({ scrollTop: maoH - header.height() }, 500)
    })

    $('.reward-btn').on('click', function () {
        $('.money-code').fadeToggle()
    })

    $('.arrow-down').on('click', function () {
        $('html, body').animate({ scrollTop: banner.offsetHeight - header.height() }, 500)
    })

    top.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 600)
    })

    // 防抖动函数
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate & !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    var myEfficientFn = debounce(function() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var headerH = header.height()
        if (banner) {
            if (scrollTop > headerH) {
                header.addClass('fixed-header')
            } else if (scrollTop === 0) {
                header.removeClass('fixed-header')
            }
        }
        if (scrollTop > 100) {
            top.addClass('opacity')
        } else {
            top.removeClass('opacity')
        }

        var catalogs = $('aside.catalog-container')
        if (catalogs){
            var catelog = catalogs[0];
            catelog.style.paddingTop = scrollTop+'px';
        }

    }, 250);

    // 绑定监听
    window.addEventListener('scroll', myEfficientFn);

})(jQuery)

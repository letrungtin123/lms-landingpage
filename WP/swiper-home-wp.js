document.addEventListener("DOMContentLoaded", function () {
    const serviceSwiperEl = document.getElementById("serviceSwiper");

    if (!serviceSwiperEl || serviceSwiperEl.querySelector(".nesso-services-carousel")) {
        return;
    }

    const template = document.getElementById("navTemplate");
    const slides = serviceSwiperEl.querySelectorAll(":scope > .swiper-wrapper > .swiper-slide");
    const total = slides.length;

    if (!template || !total || typeof Swiper === "undefined") {
        return;
    }

    function prepareElementorSlide(slide) {
        slide.querySelectorAll(".e-con.e-parent:not(.e-lazyloaded)").forEach(function (container) {
            container.classList.add("e-lazyloaded");
        });
    }

    slides.forEach(function (slide, index) {
        prepareElementorSlide(slide);

        const header = slide.querySelector(".slide-header");

        if (!header) {
            return;
        }

        const nav = template.content.cloneNode(true);
        nav.querySelector(".set-label").textContent = `(Set ${index + 1}/${total})`;
        nav.querySelector(".btn-prev").dataset.action = "prev";
        nav.querySelector(".btn-next").dataset.action = "next";
        header.appendChild(nav);
    });

    const swiper = new Swiper(serviceSwiperEl, {
        speed: 0,
        loop: true,
        allowTouchMove: true,
        on: {
            slideChange: function () {
                const index = this.realIndex + 1;

                serviceSwiperEl.querySelectorAll(".set-label").forEach(function (label) {
                    label.textContent = `(Set ${index}/${total})`;
                });
            }
        }
    });

    serviceSwiperEl.addEventListener("click", function (event) {
        const button = event.target.closest("[data-action]");

        if (!button) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (button.dataset.action === "prev") {
            swiper.slidePrev(0);
        } else {
            swiper.slideNext(0);
        }
    });
});

"use strict"

$(document).ready(function() {
    $(".accordion__text").on("click", function() {
        if ($(this).hasClass("accordion__text-opened")) {
            $(this).removeClass("accordion__text-opened");
            $(this).siblings(".accordion__body").slideUp(300);
        } else {
            $(".accordion__text").removeClass("accordion__text-opened");
            $(this).addClass("accordion__text-opened");
            $(".accordion__body").slideUp(300);
            $(this).siblings(".accordion__body").slideDown(300);
        }
    });


    console.log("Done");
    ymaps.ready(init);
});

const swiper = new Swiper('.how-swiper', {
    slidesPerView: 1.1,
    spaceBetween: 6,
    centeredSlides: true,
    pagination: {
        el: '.how-pagination',
    },
    breakpoints: {
        540: {
            slidesPerView: 1.5,
        },
        720: {
            centeredSlides: false,
            slidesPerView: 2,

        },
        900: {
            centeredSlides: false,
            slidesPerView: 3,
            spaceBetween: 0,
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    ymaps.ready(init);

    function init() {
        const geolocation = ymaps.geolocation;

        const myMap = new ymaps.Map(
            "map", {
                center: [48.200217, 66.716842],
                zoom: 5,
            }, {
                searchControlProvider: "yandex#search",
            }
        );

        const objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 32,
        });

        objectManager.objects.options.set({
            iconLayout: "default#image",
            iconImageHref: "https://www.szhuldyz.kz/geo/star6.png",
            iconImageSize: [46, 54],
            iconImageOffset: [-14, -54],
        });

        objectManager.objects.options.set("preset", "islands#redDotIcon");
        objectManager.clusters.options.set("preset", "islands#yellowClusterIcons");

        objectManager.objects.events.add("add", function(e) {
            const obj = e.get("child");
            if (obj.properties.color === "red") {
                obj.options = obj.options || {};
                obj.options.preset = "islands#lightblueDotIcon";
            }
            if (obj.properties.color === "green") {
                obj.options = obj.options || {};
                obj.options.preset = "islands#darkblueDotIcon";
            }
            if (obj.properties.color === "blue") {
                obj.options = obj.options || {};
                obj.options.preset = "default#image";
            }
        });

        myMap.geoObjects.add(objectManager);

        geolocation
            .get({
                provider: "yandex",
                mapStateAutoApply: true,
            })
            .then(function(result) {
                result.geoObjects.options.set("preset", "islands#redCircleIcon");
                result.geoObjects.get(0).properties.set({
                    balloonContentBody: "Мое местоположение по ip",
                });
                myMap.geoObjects.add(result.geoObjects);
            });

        geolocation
            .get({
                provider: "browser",
                mapStateAutoApply: true,
            })
            .then(function(result) {
                result.geoObjects.options.set("preset", "islands#blueCircleIcon");
                result.geoObjects.get(0).properties.set({
                    balloonContentBody: "Мое местоположение через браузер",
                });
                myMap.geoObjects.add(result.geoObjects);
            });

        fetch("https://www.szhuldyz.kz/aegis/json4map.php")
            .then((response) => response.json())
            .then((data) => {
                objectManager.add(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }
});
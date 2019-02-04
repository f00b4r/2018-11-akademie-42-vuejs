import Vue from "vue";
import Spotlight from "./components/Spotlight.vue";
import $ from "jquery";
import "bootstrap/js/src/modal";

Vue.config.productionTip = false;

document.addEventListener("DOMContentLoaded", function () {
    const $opener = $("#spotlight-trigger");
    const cid = 'a42-spotlight-dialog';

    $(document).keypress("f", function (e) {
        if (e.ctrlKey && e.altKey) {
            $opener.click();
        }
    });

    $opener.on("click", (e) => {
        e.preventDefault();

        const $body = $("body");

        if ($body.find(cid).length <= 0) {
            $body.append(`<div id='${cid}'></div>`);
        }

        const spotlight = new Vue({
            el: `#${cid}`,
            template: "<Spotlight :url='url' @hide='hide'/>",
            components: {Spotlight},
            data: () => ({
                url: $opener.data("url"),
            }),
            methods: {
                hide() {
                    spotlight.$destroy();
                    $(spotlight.$el).remove();
                }
            }
        });
    });
});
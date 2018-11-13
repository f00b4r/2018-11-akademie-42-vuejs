import $ from "jquery";
import "bootstrap";
import _ from "lodash";

$(() => {
    alert('Loaded!');

    _.forEach(document.getElementsByClassName('.article'), (el) => {
        console.log(el);
    });
});

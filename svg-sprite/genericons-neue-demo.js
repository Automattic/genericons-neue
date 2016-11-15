/**
 * Genericons Neue Demo page JS
 */

window.onload = function () {

    var rows = document.getElementsByTagName( 'svg' );

    for ( i=0; i<rows.length; i++ ) {
        rows[i].onclick = function () {
            var cssClass = this.getAttribute( 'class' );
            var iconID = '#' + cssClass.split(' genericons-neue-')[1];
            var fileLocation = 'genericons-neue.svg';
            var suggestion = '<svg class="'+ cssClass +'" width="16px" height="16px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + fileLocation + iconID + '"></use></svg>';
            window.prompt( 'Copy this, paste in your HTML.', suggestion );
        }
    }
}

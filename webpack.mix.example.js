let mix = require('laravel-mix').mix;

let env = 'dist/'; //test or src
env = 'docs/'; //test or src

mix.sass('resources/assets/sass/zippy.scss',env+'css/zippy.css');
mix.js('resources/assets/js/zippy.js',env+'js/zippy.js');
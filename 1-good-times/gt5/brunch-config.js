module.exports = {
    paths: {
        public: "dist"
    },
    files: {
        javascripts: {
            joinTo: {
                'vendor.js': /^(?!app)/,
                'app.js': /^app/
            }
        },
        stylesheets: { joinTo: 'app.css' }
    },
    plugins: {
        babel: { presets: ['latest'] },
        postcss: { processors: [require('autoprefixer')] },
        cleancss: {
            keepSpecialComments: 0,
            removeEmpty: true
        }
    }
};
